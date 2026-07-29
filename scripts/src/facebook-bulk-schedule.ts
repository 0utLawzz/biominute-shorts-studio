/**
 * facebook-bulk-schedule.ts
 *
 * Uploads a specified set of Ep 1-50 episodes as FB Scheduled posts.
 * Differs from facebook-daily-publish.ts: takes explicit episode numbers
 * (instead of `WHERE facebook_video_id IS NULL`) so we can target exactly
 * the episodes that have a local MP4 (the others will be skipped with
 * "no video file").
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/facebook-bulk-schedule.ts 36 37 38 39 40
 *   FB_SLOT_START_OFFSET_DAYS=8 pnpm --filter @workspace/scripts exec tsx ./src/facebook-bulk-schedule.ts 36 37 38
 *
 * Slot pacing: tomorrow 09:00 UTC + (startOffset + indexInList) * 24h.
 */

import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

const REQUIRED_VARS = [
  "DATABASE_URL",
  "FACEBOOK_PAGE_ACCESS_TOKEN",
  "FACEBOOK_PAGE_ID",
];
const missingVars = REQUIRED_VARS.filter((k) => !process.env[k]);
if (missingVars.length) {
  console.error(
    "\n🚫  Missing required env vars:\n" + missingVars.map((k) => `   • ${k}`).join("\n"),
  );
  process.exit(1);
}

const FB_GRAPH_VIDEO_URL = "https://graph-video.facebook.com/v21.0";
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function workspaceRoot(): string {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  return path.resolve(scriptDir, "../..");
}

function findExportFolder(epNumber: number, slugFromDb?: string | null): string | null {
  const exportsDir = path.join(workspaceRoot(), "exports");
  if (!fs.existsSync(exportsDir)) return null;
  const matches = fs
    .readdirSync(exportsDir)
    .filter((n) => n.startsWith(`Episode-${String(epNumber).padStart(2, "0")}-`));
  if (!matches.length) return null;
  const scored = matches
    .map((n) => ({
      name: n,
      videoPath: path.join(exportsDir, n, "episode.mp4"),
      size: fs.existsSync(path.join(exportsDir, n, "episode.mp4"))
        ? fs.statSync(path.join(exportsDir, n, "episode.mp4")).size
        : 0,
    }))
    .sort((a, b) => b.size - a.size);
  return scored[0].size ? path.join(exportsDir, scored[0].name) : null;
}

function computeSlotDate(now: Date, indexInRun: number): Date {
  const base = new Date(now);
  base.setUTCDate(base.getUTCDate() + 1);
  base.setUTCHours(9, 0, 0, 0);
  const startOffset = parseInt(process.env.FB_SLOT_START_OFFSET_DAYS || "0", 10) || 0;
  return new Date(base.getTime() + (startOffset + indexInRun) * 24 * 60 * 60 * 1000);
}

function assertSlotIsValid(slot: Date, now: Date): void {
  const SECONDS_MAX = 75 * 24 * 60 * 60;
  const SECONDS_MIN = 10 * 60;
  const diffSec = Math.floor((slot.getTime() - now.getTime()) / 1000);
  if (diffSec < SECONDS_MIN) throw new Error(`Slot too soon: ${slot.toISOString()}`);
  if (diffSec > SECONDS_MAX) throw new Error(`Slot > 75 days: ${slot.toISOString()}`);
}

async function uploadChunkedToFacebook(
  videoPath: string,
  scheduledPublishAt: Date | null,
  title: string,
  description: string,
): Promise<string> {
  const fileSize = fs.statSync(videoPath).size;

  const startParams = new URLSearchParams({
    upload_phase: "start",
    file_size: String(fileSize),
    access_token: ACCESS_TOKEN,
  });
  const startRes = await fetch(
    `${FB_GRAPH_VIDEO_URL}/${PAGE_ID}/videos?${startParams}`,
    { method: "POST" },
  );
  if (!startRes.ok) {
    throw new Error(`start failed (${startRes.status}): ${await startRes.text()}`);
  }
  const startData = (await startRes.json()) as {
    upload_session_id: string;
    start_offset: string;
    end_offset: string;
  };
  const uploadSessionId = startData.upload_session_id;
  let cursor = parseInt(startData.start_offset, 10);
  let end = parseInt(startData.end_offset, 10);

  const fileBuffer = fs.readFileSync(videoPath);
  while (cursor < fileSize) {
    const chunk = fileBuffer.subarray(cursor, end);
    const formData = new FormData();
    formData.append("upload_phase", "transfer");
    formData.append("start_offset", String(cursor));
    formData.append("upload_session_id", uploadSessionId);
    formData.append("access_token", ACCESS_TOKEN);
    formData.append("video_file_chunk", new Blob([chunk], { type: "video/mp4" }), "chunk.mp4");
    const transferRes = await fetch(`${FB_GRAPH_VIDEO_URL}/${PAGE_ID}/videos`, {
      method: "POST",
      body: formData,
    });
    if (!transferRes.ok) {
      throw new Error(`transfer failed (${transferRes.status}): ${await transferRes.text()}`);
    }
    const transferData = (await transferRes.json()) as {
      start_offset: string;
      end_offset: string;
    };
    cursor = parseInt(transferData.start_offset, 10);
    end = parseInt(transferData.end_offset, 10);
    if (cursor >= fileSize) break;
  }

  const finishParams = new URLSearchParams({
    upload_phase: "finish",
    upload_session_id: uploadSessionId,
    access_token: ACCESS_TOKEN,
    title,
    description,
  });
  if (scheduledPublishAt) {
    finishParams.append("published", "0");
    finishParams.append(
      "scheduled_publish_time",
      Math.floor(scheduledPublishAt.getTime() / 1000).toString(),
    );
  }
  const finishRes = await fetch(
    `${FB_GRAPH_VIDEO_URL}/${PAGE_ID}/videos?${finishParams}`,
    { method: "POST" },
  );
  if (!finishRes.ok) {
    throw new Error(`finish failed (${finishRes.status}): ${await finishRes.text()}`);
  }
  const finishData = (await finishRes.json()) as { success?: boolean; video_id?: string };
  return finishData.video_id ?? uploadSessionId;
}

async function processEpisode(
  epNumber: number,
  indexInRun: number,
  now: Date,
): Promise<{ epNumber: number; facebookVideoId: string; scheduledPublishAt: Date } | null> {
  const exportFolder = findExportFolder(epNumber);
  if (!exportFolder) {
    console.log(`  ⏭ Ep ${epNumber}: no local MP4 — skipping FB upload`);
    return null;
  }
  const videoPath = path.join(exportFolder, "episode.mp4");
  const rows = await db.select().from(episodesTable).where(eq(episodesTable.epNumber, epNumber));
  if (!rows.length) throw new Error(`Episode ${epNumber} not found in DB`);
  const ep = rows[0];
  // Match Facebook to the authoritative YouTube schedule whenever available.
  // The fallback keeps this script usable for episodes that have no YouTube date.
  const slot = ep.scheduledPublishAt
    ? new Date(ep.scheduledPublishAt)
    : computeSlotDate(now, indexInRun);
  assertSlotIsValid(slot, now);
  console.log(`\n=== Scheduling Episode ${epNumber} ===`);
  console.log(`  Video       : ${videoPath}`);
  console.log(`  Schedule    : ${slot.toISOString()} (Facebook publish time)`);

  const title = ep.youtubeTitle ?? ep.hookTitle ?? `Episode ${epNumber}`;
  const description = [
    ep.voScript?.slice(0, 500) ?? "",
    "",
    ep.hashtags ?? "",
  ]
    .join("\n")
    .trim();
  console.log(`  Title       : ${title}`);
  console.log("  Uploading to Facebook Graph API as a Scheduled post...");

  const facebookVideoId = await uploadChunkedToFacebook(videoPath, slot, title, description);
  console.log(`  ✓ Scheduled : https://www.facebook.com/watch/?v=${facebookVideoId} @ ${slot.toISOString()}`);

  await db
    .update(episodesTable)
    .set({ facebookVideoId, updatedAt: new Date() })
    .where(eq(episodesTable.epNumber, epNumber));

  // Safety-gated cleanup: only delete local if YouTube already has it.
  if (ep.youtubeVideoId) {
    try {
      fs.rmSync(exportFolder, { recursive: true, force: true });
      console.log(`  ✓ Deleted local video for Episode ${epNumber} — confirmed on YouTube + Facebook.`);
    } catch (e) {
      console.warn(`  ⚠️  Cleanup failed (non-fatal): ${(e as Error).message}`);
    }
  }
  return { epNumber, facebookVideoId, scheduledPublishAt: slot };
}

(async () => {
  const epArgs = process.argv.slice(2).map(Number).filter((n) => n > 0);
  if (!epArgs.length) {
    console.error("Usage: tsx ./src/facebook-bulk-schedule.ts <ep_number> [ep_number ...]");
    process.exit(1);
  }

  const now = new Date();
  console.log(`\n=== Facebook schedule-publish (bulk) ===`);
  console.log(`  Episodes: ${epArgs.join(", ")}`);
  console.log(`  Run started : ${now.toISOString()} UTC`);
  console.log(`  First slot  : ${computeSlotDate(now, 0).toISOString()} UTC`);

  const results = [];
  for (let i = 0; i < epArgs.length; i++) {
    try {
      const r = await processEpisode(epArgs[i], i, now);
      if (r) results.push(r);
    } catch (e) {
      console.error(`  ✗ Failed for Episode ${epArgs[i]}: ${(e as Error).message}`);
    }
  }

  console.log(`\n=== Summary ===`);
  for (const r of results) {
    console.log(
      `  Ep ${r.epNumber.toString().padStart(2)}: https://www.facebook.com/watch/?v=${r.facebookVideoId} @ ${r.scheduledPublishAt.toISOString()}`,
    );
  }

  await pool.end();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
