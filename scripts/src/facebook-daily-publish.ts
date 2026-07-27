/**
 * Daily Facebook auto-publish: uploads exactly one Ep 1–50 video to the Facebook
 * Page per run, then safety-gates any local cleanup.
 *
 * Safety rule: the local export folder is deleted ONLY when BOTH Facebook
 * (facebookVideoId set by this run) AND YouTube (youtubeVideoId already set)
 * have a confirmed copy. Otherwise the local file is kept intact — it might
 * be the only copy of that episode's video.
 *
 * Usage:
 *   pnpm run facebook-daily-publish                   # daily scheduled run
 *   TEST_MODE=true pnpm run facebook-daily-publish    # dry-run (logs only)
 *
 * Defaults to picking the lowest-numbered Ep 1–50 row lacking facebookVideoId.
 * Re-runs the next day pick up the next episode — does not reprocess one.
 */
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, asc, eq, gte, isNull, lte } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

// ---------------------------------------------------------------------------
// Env validation — Replit Scheduled Deployments run in a fresh, isolated
// environment, so we must own our DATABASE_URL/FB creds here (NOT rely on
// the API server process being alive).
// ---------------------------------------------------------------------------
const TEST_MODE = process.env.TEST_MODE === "true";

const REQUIRED_VARS = [
  "DATABASE_URL",
  "FACEBOOK_PAGE_ACCESS_TOKEN",
  "FACEBOOK_PAGE_ID",
];

const missingVars = REQUIRED_VARS.filter((k) => !process.env[k]);
if (missingVars.length > 0) {
  console.error(
    "\n🚫  facebook-daily-publish aborted — missing required environment variables:\n" +
      missingVars.map((k) => `   • ${k}`).join("\n") +
      "\n\nAdd these to Replit Secrets before running.\n",
  );
  process.exit(1);
}

const FB_GRAPH_VIDEO_URL = "https://graph-video.facebook.com/v21.0";
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

// ---------------------------------------------------------------------------
// DB — own Pool, same self-contained pattern as schedule-upload.ts.
// ---------------------------------------------------------------------------
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ---------------------------------------------------------------------------
// Helpers — self-contained copies (same convention as schedule-upload.ts).
// ---------------------------------------------------------------------------

/** Anchored to this script's location: workspace root is `../../`. */
function workspaceRoot(): string {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  return path.resolve(scriptDir, "../..");
}

/**
 * Locate the export folder for an episode. Returns the folder path (not the
 * mp4 inside) so we can both read the file and later delete the folder for
 * the safety-gated cleanup step.
 */
function findExportFolder(epNumber: number): string | null {
  const exportsDir = path.join(workspaceRoot(), "exports");
  const padded = String(epNumber).padStart(2, "0");
  if (!fs.existsSync(exportsDir)) return null;
  const matches = fs
    .readdirSync(exportsDir)
    .filter((n) => n.startsWith(`Episode-${padded}-`));
  if (!matches.length) return null;
  // Prefer the folder whose episode.mp4 is non-empty (a real export),
  // matching schedule-upload.ts's "largest mp4 wins" tie-breaker.
  const scored = matches
    .map((n) => {
      const videoPath = path.join(exportsDir, n, "episode.mp4");
      const size = fs.existsSync(videoPath) ? fs.statSync(videoPath).size : 0;
      return { name: n, videoPath, size };
    })
    .sort((a, b) => b.size - a.size);
  const best = scored[0];
  if (!best.size) return null;
  return path.join(exportsDir, best.name);
}

/** Phase 1 → 2 → 3 chunked upload, copied from artifacts/api-server/src/routes/facebook.ts */
async function uploadChunkedToFacebook(videoPath: string): Promise<string> {
  const fileSize = fs.statSync(videoPath).size;

  // Phase 1: start
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
    const errBody = await startRes.text();
    throw new Error(`Facebook start-upload failed (${startRes.status}): ${errBody}`);
  }
  const startData = (await startRes.json()) as {
    upload_session_id: string;
    start_offset: string;
    end_offset: string;
  };
  const uploadSessionId = startData.upload_session_id;
  let cursor = parseInt(startData.start_offset, 10);
  let end = parseInt(startData.end_offset, 10);

  // Phase 2: transfer chunks until complete
  const fileBuffer = fs.readFileSync(videoPath);
  while (cursor < fileSize) {
    const chunk = fileBuffer.subarray(cursor, end);
    const formData = new FormData();
    formData.append("upload_phase", "transfer");
    formData.append("start_offset", String(cursor));
    formData.append("upload_session_id", uploadSessionId);
    formData.append("access_token", ACCESS_TOKEN);
    formData.append(
      "video_file_chunk",
      new Blob([chunk], { type: "video/mp4" }),
      "chunk.mp4",
    );
    const transferRes = await fetch(
      `${FB_GRAPH_VIDEO_URL}/${PAGE_ID}/videos`,
      { method: "POST", body: formData },
    );
    if (!transferRes.ok) {
      const errBody = await transferRes.text();
      throw new Error(
        `Facebook chunk-transfer failed (${transferRes.status}): ${errBody}`,
      );
    }
    const transferData = (await transferRes.json()) as {
      start_offset: string;
      end_offset: string;
    };
    cursor = parseInt(transferData.start_offset, 10);
    end = parseInt(transferData.end_offset, 10);
    if (cursor >= fileSize) break;
  }

  // Phase 3: finish
  const finishParams = new URLSearchParams({
    upload_phase: "finish",
    upload_session_id: uploadSessionId,
    access_token: ACCESS_TOKEN,
  });
  const finishRes = await fetch(
    `${FB_GRAPH_VIDEO_URL}/${PAGE_ID}/videos?${finishParams}`,
    { method: "POST" },
  );
  if (!finishRes.ok) {
    const errBody = await finishRes.text();
    throw new Error(`Facebook finish-upload failed (${finishRes.status}): ${errBody}`);
  }
  const finishData = (await finishRes.json()) as {
    success?: boolean;
    video_id?: string;
  };
  const videoId = finishData.video_id ?? uploadSessionId;
  if (!finishData.success && !finishData.video_id) {
    throw new Error("Facebook upload finished but returned no video ID.");
  }
  return videoId;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  const [next] = await db
    .select()
    .from(episodesTable)
    .where(
      and(
        gte(episodesTable.epNumber, 1),
        lte(episodesTable.epNumber, 50),
        isNull(episodesTable.facebookVideoId),
      ),
    )
    .orderBy(asc(episodesTable.epNumber))
    .limit(1);

  if (!next) {
    console.log(
      "No eligible Ep 1–50 episodes left to publish to Facebook. Done.",
    );
    await pool.end();
    process.exit(0);
  }

  const epNumber = next.epNumber;
  console.log(
    `\n=== ${TEST_MODE ? "[TEST_MODE] " : ""}Daily Facebook publish: Episode ${epNumber} ===`,
  );

  const exportFolder = findExportFolder(epNumber);
  if (!exportFolder) {
    console.warn(
      `  ⚠️  Episode ${epNumber} has no exported video on disk — skipping, needs export first.`,
    );
    await pool.end();
    process.exit(0);
  }
  const videoPath = path.join(exportFolder, "episode.mp4");
  console.log(`  Video : ${videoPath}`);

  // Was YouTube already confirmed before this run? Check BEFORE the FB upload
  // updates the row so the cleanup step uses the correct prior state.
  const youtubeConfirmedBefore = !!next.youtubeVideoId;

  // Build the FB caption — keep it consistent with the in-app publish path.
  const title = next.youtubeTitle ?? next.hookTitle ?? `Episode ${epNumber}`;
  const description = [
    next.voScript?.slice(0, 500) ?? "",
    "",
    next.hashtags ?? "",
  ]
    .join("\n")
    .trim();

  if (TEST_MODE) {
    console.log(`  [TEST_MODE] would publish: "${title}"`);
    console.log(`  [TEST_MODE] description preview:\n${description.slice(0, 200)}...`);
    console.log(`  [TEST_MODE] no Facebook API call, DB unchanged.`);
    await pool.end();
    process.exit(0);
  }

  console.log(`  Title : ${title}`);
  console.log("  Uploading to Facebook Graph API...");

  const facebookVideoId = await uploadChunkedToFacebook(videoPath);
  const facebookUrl = `https://www.facebook.com/watch/?v=${facebookVideoId}`;
  console.log(`  ✓ Uploaded: ${facebookUrl}`);

  await db
    .update(episodesTable)
    .set({ facebookVideoId, updatedAt: new Date() })
    .where(eq(episodesTable.epNumber, epNumber));

  // ---------------------------------------------------------------------------
  // Safety-gated cleanup: delete only when BOTH YouTube and Facebook have a
  // confirmed copy. Otherwise leave the local file alone — it might be the
  // only copy we have.
  // ---------------------------------------------------------------------------
  if (youtubeConfirmedBefore) {
    try {
      fs.rmSync(exportFolder, { recursive: true, force: true });
      console.log(
        `  ✓ Deleted local video for Episode ${epNumber} — confirmed on YouTube + Facebook.`,
      );
    } catch (e) {
      console.warn(
        `  ⚠️  Cleanup failed (non-fatal): ${(e as Error).message}`,
      );
    }
  } else {
    console.log(
      `  ℹ️  Episode ${epNumber} published to Facebook but not yet on YouTube —`,
    );
    console.log(
      `     keeping local file until YouTube upload confirmed.`,
    );
  }

  console.log(
    `\nSummary: Episode ${epNumber} → Facebook ${facebookUrl}` +
      (youtubeConfirmedBefore
        ? ` | local file: DELETED (both platforms confirmed)`
        : ` | local file: KEPT (YouTube upload still pending)`),
  );

  await pool.end();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
