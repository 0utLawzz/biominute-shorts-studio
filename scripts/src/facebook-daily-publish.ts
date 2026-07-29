/**
 * Daily Facebook auto-publish: schedules the next Ep 1–50 episode(s) for
 * publication on the Facebook Page, pacing 1/day starting tomorrow at
 * 09:00 UTC. Runs in two modes:
 *
 *  DEFAULT (no args)            — picks the next single eligible episode.
 *                                Designed to be invoked once per day by a
 *                                Replit Scheduled Deployment.
 *
 *  BACKFILL (--all or --num N)  — schedules the next N eligible episodes (or
 *                                every remaining eligible one) in this single
 *                                run, spaced 1/day starting tomorrow.
 *
 * Uploads via the Graph video API as `published=0` with a `scheduled_publish_time`
 * timestamp. Facebook holds the upload and auto-publishes at that time — same
 * model as our YouTube publishing.
 *
 * Safety rule (unchanged from the immediate-publish version):
 * the local export folder is deleted ONLY when BOTH `facebookVideoId` (just set
 * by this run) AND `youtubeVideoId` (already set beforehand) are populated.
 *
 * Usage:
 *   pnpm run facebook-daily-publish                     # daily scheduled run
 *   pnpm run facebook-daily-publish --all               # backfill everything
 *   pnpm run facebook-daily-publish --num 44            # backfill next 44
 *   TEST_MODE=true pnpm run facebook-daily-publish --all  # dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, asc, eq, gte, isNull, lte } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const BACKFILL_ALL = args.includes("--all");
const PUBLISH_NOW = args.includes("--now");
const TARGET_EPISODE = (() => {
  const idx = args.indexOf("--episode");
  if (idx === -1) return null;
  const n = parseInt(args[idx + 1], 10);
  return Number.isInteger(n) && n > 0 ? n : null;
})();
const BACKFILL_NUM = (() => {
  const idx = args.indexOf("--num");
  if (idx === -1) return null;
  const n = parseInt(args[idx + 1], 10);
  return Number.isFinite(n) && n > 0 ? n : null;
})();
const EPISODE_START = (() => {
  const idx = args.indexOf("--start");
  const n = idx === -1 ? 1 : parseInt(args[idx + 1], 10);
  return Number.isInteger(n) && n > 0 ? n : 1;
})();
const EPISODE_END = (() => {
  const idx = args.indexOf("--end");
  const n = idx === -1 ? 50 : parseInt(args[idx + 1], 10);
  return Number.isInteger(n) && n >= EPISODE_START ? n : 50;
})();
const RUN_ONCE = !BACKFILL_ALL && !BACKFILL_NUM && !TARGET_EPISODE;
const EFFECTIVE_BATCH_SIZE = BACKFILL_ALL ? Infinity : (BACKFILL_NUM ?? 1);

// ---------------------------------------------------------------------------
// Env validation
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
// Schedule-time helpers
// ---------------------------------------------------------------------------
/**
 * Returns the next 09:00 UTC timestamp strictly after `now`.
 * For N=0 → tomorrow 09:00 UTC. For N>0 → base + N*24h.
 */
function computeSlotDate(now: Date, indexInRun: number): Date {
  const base = new Date(now);
  base.setUTCDate(base.getUTCDate() + 1);
  base.setUTCHours(9, 0, 0, 0);
  // FB_SLOT_START_OFFSET_DAYS lets a resumed batch continue the cadence of a
  // previous (interrupted) run instead of restarting at "tomorrow".
  const startOffset = parseInt(process.env.FB_SLOT_START_OFFSET_DAYS || "0", 10) || 0;
  return new Date(
    base.getTime() +
      (startOffset + indexInRun) * 24 * 60 * 60 * 1000,
  );
}

/** FB requires scheduled_publish_time to be 10min..75days from now. */
function assertSlotIsValid(slot: Date, now: Date): void {
  const SECONDS_MAX = 75 * 24 * 60 * 60; // 75 days
  const SECONDS_MIN = 10 * 60;          // 10 minutes
  const diffSec = Math.floor((slot.getTime() - now.getTime()) / 1000);
  if (diffSec < SECONDS_MIN) {
    throw new Error(
      `Scheduled slot ${slot.toISOString()} is less than 10 minutes from now.`,
    );
  }
  if (diffSec > SECONDS_MAX) {
    throw new Error(
      `Scheduled slot ${slot.toISOString()} is more than 75 days from ` +
        `now — FB rejects anything beyond that. Reduce batch size.`,
    );
  }
}

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ---------------------------------------------------------------------------
// Helpers — self-contained copies (same convention as schedule-upload.ts).
// ---------------------------------------------------------------------------
function workspaceRoot(): string {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  return path.resolve(scriptDir, "../..");
}

function findExportFolder(epNumber: number): string | null {
  const exportsDir = path.join(workspaceRoot(), "exports");
  const padded = String(epNumber).padStart(2, "0");
  if (!fs.existsSync(exportsDir)) return null;
  const matches = fs
    .readdirSync(exportsDir)
    .filter((n) => n.startsWith(`Episode-${padded}-`));
  if (!matches.length) return null;
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

/**
 * Phase 1 → 2 → 3 chunked upload. `scheduledPublishAt` (optional) flips the
 * video into a FB Scheduled post: published=0 + scheduled_publish_time.
 * `title` and `description` are appended to the finish phase so the post
 * carries the same caption that goes on YouTube.
 */
async function uploadChunkedToFacebook(
  videoPath: string,
  scheduledPublishAt: Date | null,
  title: string,
  description: string,
): Promise<string> {
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

  // Phase 3: finish — optionally schedule instead of publishing immediately,
  // and attach the post's title + description so it carries our caption.
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
// Process a single episode in this run (scheduled upload to FB).
// ---------------------------------------------------------------------------
interface RunResult {
  epNumber: number;
  facebookVideoId: string;
  scheduledPublishAt: Date | null;
  localDeleted: boolean;
  skipped?: string;
}

async function processEpisode(
  ep: typeof episodesTable.$inferSelect,
  indexInRun: number,
  now: Date,
): Promise<RunResult> {
  const epNumber = ep.epNumber;
  const slot = PUBLISH_NOW ? null : computeSlotDate(now, indexInRun);
  if (slot) assertSlotIsValid(slot, now);

  console.log(
    `\n=== ${TEST_MODE ? "[TEST_MODE] " : ""}Scheduling Episode ${epNumber} ===`,
  );

  const exportFolder = findExportFolder(epNumber);
  if (!exportFolder) {
    console.warn(
      `  ⚠️  Episode ${epNumber} has no exported video on disk — skipping, needs export first.`,
    );
    return {
      epNumber,
      facebookVideoId: "",
      scheduledPublishAt: null,
      localDeleted: false,
      skipped: "no-video-file",
    };
  }
  const videoPath = path.join(exportFolder, "episode.mp4");
  console.log(`  Video       : ${videoPath}`);
  console.log(
    `  Mode        : ${PUBLISH_NOW ? "publish immediately" : `${slot!.toISOString()} (Facebook publish time)`}`,
  );

  const youtubeConfirmedBefore = !!ep.youtubeVideoId;

  const title = ep.youtubeTitle ?? ep.hookTitle ?? `Episode ${epNumber}`;
  const description = [
    ep.voScript?.slice(0, 500) ?? "",
    "",
    ep.hashtags ?? "",
  ]
    .join("\n")
    .trim();

  if (TEST_MODE) {
    console.log(`  [TEST_MODE] would ${PUBLISH_NOW ? "publish immediately" : `schedule for ${slot!.toISOString()}`}: "${title}"`);
    console.log(`  [TEST_MODE] description preview:\n${description.slice(0, 200)}...`);
    console.log(`  [TEST_MODE] no Facebook API call, DB unchanged.`);
    return {
      epNumber,
      facebookVideoId: "",
      scheduledPublishAt: slot,
      localDeleted: false,
      skipped: "test-mode",
    };
  }

  console.log(`  Title       : ${title}`);
  console.log(
    `  Uploading to Facebook Graph API as a ${PUBLISH_NOW ? "published" : "scheduled"} post...`,
  );

  const facebookVideoId = await uploadChunkedToFacebook(videoPath, slot, title, description);
  const facebookUrl = `https://www.facebook.com/watch/?v=${facebookVideoId}`;
  console.log(
    `  ✓ ${PUBLISH_NOW ? "Published" : "Scheduled"}: ${facebookUrl} @ ${slot?.toISOString() ?? "now"}`,
  );

  await db
    .update(episodesTable)
    .set({ facebookVideoId, updatedAt: new Date() })
    .where(eq(episodesTable.epNumber, epNumber));

  // Safety-gated cleanup: same rule as before.
  let localDeleted = false;
  if (youtubeConfirmedBefore) {
    try {
      fs.rmSync(exportFolder, { recursive: true, force: true });
      localDeleted = true;
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
      `  ℹ️  Episode ${epNumber} scheduled on Facebook but not yet on YouTube —`,
    );
    console.log(
      `     keeping local file until YouTube upload confirmed.`,
    );
  }

  return {
    epNumber,
    facebookVideoId,
    scheduledPublishAt: slot,
    localDeleted,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  const now = new Date();

  console.log(
    `\n=== ${TEST_MODE ? "[TEST_MODE] " : ""}Facebook schedule-publish ===` +
      (RUN_ONCE ? "" : ` (backfill batch size: ${EFFECTIVE_BATCH_SIZE === Infinity ? "all" : EFFECTIVE_BATCH_SIZE})`),
  );
  console.log(
    `  Mode        : ${PUBLISH_NOW ? "publish-now" : TARGET_EPISODE ? `episode=${TARGET_EPISODE}` : BACKFILL_ALL ? "backfill-all" : BACKFILL_NUM ? `backfill-num=${BACKFILL_NUM}` : "daily (1 episode)"}`,
  );
  console.log(`  Run started : ${now.toISOString()} UTC`);
  if (!PUBLISH_NOW) console.log(`  First slot  : ${computeSlotDate(now, 0).toISOString()} UTC`);

  const limit = EFFECTIVE_BATCH_SIZE === Infinity ? 1000 : EFFECTIVE_BATCH_SIZE;

  const eligible = await db
    .select()
    .from(episodesTable)
    .where(
      and(
        gte(episodesTable.epNumber, EPISODE_START),
        lte(episodesTable.epNumber, EPISODE_END),
        ...(TARGET_EPISODE ? [eq(episodesTable.epNumber, TARGET_EPISODE)] : []),
        isNull(episodesTable.facebookVideoId),
      ),
    )
    .orderBy(asc(episodesTable.epNumber))
    .limit(TARGET_EPISODE ? 1 : limit);

  if (eligible.length === 0) {
    console.log(
      `\nNo eligible Ep ${EPISODE_START}–${EPISODE_END} episodes left to schedule on Facebook. Done.`,
    );
    await pool.end();
    process.exit(0);
  }

  console.log(`  Eligible    : ${eligible.length} episode(s) — will schedule ${eligible.length} now.`);

  const results: RunResult[] = [];
  for (let i = 0; i < eligible.length; i++) {
    try {
      const result = await processEpisode(eligible[i], i, now);
      results.push(result);
    } catch (e) {
      console.error(
        `  ✗ Failed for Episode ${eligible[i].epNumber}: ${(e as Error).message}`,
      );
      results.push({
        epNumber: eligible[i].epNumber,
        facebookVideoId: "",
        scheduledPublishAt: null,
        localDeleted: false,
        skipped: `error: ${(e as Error).message}`,
      });
    }
  }

  // Final summary
  console.log(`\n=== Summary ===`);
  for (const r of results) {
    if (r.skipped) {
      console.log(
        `  Ep ${r.epNumber.toString().padStart(2)}: SKIPPED (${r.skipped})`,
      );
    } else {
      const url = `https://www.facebook.com/watch/?v=${r.facebookVideoId}`;
      const when = r.scheduledPublishAt?.toISOString() ?? "—";
      const local = r.localDeleted ? "DELETED" : "KEPT (YT not confirmed)";
      console.log(`  Ep ${r.epNumber.toString().padStart(2)}: ${url} @ ${when} | local: ${local}`);
    }
  }

  await pool.end();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
