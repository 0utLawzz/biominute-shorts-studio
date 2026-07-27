import app from "./app";
import { logger } from "./lib/logger";
import { db, episodesTable } from "@workspace/db";
import { eq, and, lte, isNull } from "drizzle-orm";
import {
  findEpisodeVideoPath,
  uploadEpisodeVideo,
  addVideoToPlaylist,
  SEASON_PLAYLIST_ENV,
  buildYouTubeDescription,
  assertNotAlreadyPublished,
} from "./lib/youtube-upload";
import { shutdownRenderJobs } from "./lib/render-jobs";

// ---------------------------------------------------------------------------
// Startup credential check — hard-fails if any required env var is absent.
// The server must not start in a half-configured state; a clear list of what
// is missing is far easier to diagnose than a cryptic runtime error later.
// ---------------------------------------------------------------------------

/** Variables that must be present for the server to function at all. */
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
  "YOUTUBE_PLAYLIST_S1",
  "YOUTUBE_PLAYLIST_S2",
  "YOUTUBE_PLAYLIST_S3",
  "YOUTUBE_PLAYLIST_S4",
  "YOUTUBE_PLAYLIST_S5",
  "YOUTUBE_PLAYLIST_S6",
  "SESSION_SECRET",
  "DASHBOARD_PASSWORD",
] as const;

/** Additional vars that are present but not strictly required (logged for visibility). */
const OPTIONAL_ENV_VARS = [
  "YOUTUBE_CHANNEL_NAME",
  "YOUTUBE_CHANNEL_ID",
  "GITHUB_TOKEN",
] as const;

function assertAndLogCredentials(): void {
  const missing = REQUIRED_ENV_VARS.filter((k) => !process.env[k]);

  if (missing.length > 0) {
    // Use console.error so this is visible even before the pino logger is ready
    console.error(
      "\n🚫  Server startup aborted — missing required environment variables:\n" +
        missing.map((k) => `   • ${k}`).join("\n") +
        "\n\nAdd these to Replit Secrets and restart the server.\n",
    );
    process.exit(1);
  }

  const present = [
    ...REQUIRED_ENV_VARS,
    ...OPTIONAL_ENV_VARS.filter((k) => !!process.env[k]),
  ];
  const optionalMissing = OPTIONAL_ENV_VARS.filter((k) => !process.env[k]);

  logger.info({ present }, "Startup: all required credentials present");
  if (optionalMissing.length > 0) {
    logger.warn(
      { missing: optionalMissing },
      "Startup: optional credentials missing — related features may be limited",
    );
  }
}

// ---------------------------------------------------------------------------
// Scheduler auto-publish log — circular buffer (last 50 events)
// ---------------------------------------------------------------------------
interface SchedulerLogEntry {
  ts: string;
  epNumber: number;
  hookTitle: string;
  status: "success" | "failed";
  youtubeVideoId?: string;
  error?: string;
}
const schedulerLog: SchedulerLogEntry[] = [];
let schedulerLastChecked: string | null = null;

function pushSchedulerLog(entry: SchedulerLogEntry) {
  schedulerLog.unshift(entry);
  if (schedulerLog.length > 50) schedulerLog.length = 50;
}

app.get("/api/scheduler/log", (_req, res) => {
  res.json({ log: schedulerLog, lastChecked: schedulerLastChecked });
});

// POST /api/scheduler/run — manually trigger a scheduler check immediately.
// Useful after a server restart that may have missed a due episode.
app.post("/api/scheduler/run", async (_req, res) => {
  res.json({ queued: true, message: "Scheduler check triggered" });
  runScheduledPublish().catch((err) =>
    logger.error({ err }, "Scheduler: manual trigger failed"),
  );
});

// ---------------------------------------------------------------------------
// Scheduler: every 15 minutes, find episodes where status = 'scheduled' AND
// scheduledPublishAt <= now, then upload them to YouTube and mark published.
// ---------------------------------------------------------------------------
async function runScheduledPublish(): Promise<void> {
  schedulerLastChecked = new Date().toISOString();

  const hasYouTubeCredentials =
    !!process.env.YOUTUBE_CLIENT_ID &&
    !!process.env.YOUTUBE_CLIENT_SECRET &&
    !!process.env.YOUTUBE_REFRESH_TOKEN;

  if (!hasYouTubeCredentials) {
    // Nothing to do — YouTube is not configured yet
    return;
  }

  try {
    const now = new Date();
    // Only pick up episodes that have NOT yet been uploaded to YouTube.
    // Episodes uploaded via the live-mode publish route already have a
    // youtubeVideoId and are waiting for YouTube to flip them public at
    // scheduledPublishAt — the scheduler must not re-upload those.
    const due = await db
      .select()
      .from(episodesTable)
      .where(
        and(
          eq(episodesTable.status, "scheduled"),
          lte(episodesTable.scheduledPublishAt, now),
          isNull(episodesTable.youtubeVideoId),
        ),
      );

    if (due.length === 0) return;

    logger.info(
      { count: due.length },
      "Scheduler: found episodes due for publishing",
    );

    for (const episode of due) {
      try {
        assertNotAlreadyPublished(episode);

        const videoPath = findEpisodeVideoPath(episode.epNumber);

        const tags = (episode.hashtags ?? "")
          .split(/[\s,]+/)
          .map((t: string) => t.replace(/^#/, ""))
          .filter(Boolean);

        const description = buildYouTubeDescription({
          voScript: episode.voScript,
          citationCta: episode.citationCta,
          hashtags: episode.hashtags,
          season: episode.season,
        });

        const { youtubeVideoId, youtubeUrl } = await uploadEpisodeVideo({
          videoPath,
          title: episode.youtubeTitle,
          description,
          tags,
          privacyStatus: "public",
          publishAt: null,
        });

        // Add to season playlist (non-fatal)
        try {
          await addVideoToPlaylist({ youtubeVideoId, season: episode.season });
        } catch (playlistErr) {
          logger.warn(
            { playlistErr, episodeId: episode.id, season: episode.season },
            "Scheduler: playlist insert failed (episode still marked published)",
          );
        }

        await db
          .update(episodesTable)
          .set({
            status: "published",
            youtubeVideoId,
            publishedAt: now,
            scheduledPublishAt: null,
            updatedAt: now,
          })
          .where(eq(episodesTable.id, episode.id));

        pushSchedulerLog({
          ts: now.toISOString(),
          epNumber: episode.epNumber,
          hookTitle: episode.hookTitle,
          status: "success",
          youtubeVideoId,
        });
        logger.info(
          { episodeId: episode.id, epNumber: episode.epNumber, youtubeVideoId, youtubeUrl },
          "Scheduler: episode published successfully",
        );
      } catch (err) {
        pushSchedulerLog({
          ts: new Date().toISOString(),
          epNumber: episode.epNumber,
          hookTitle: episode.hookTitle,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
        logger.error(
          { err, episodeId: episode.id, epNumber: episode.epNumber },
          "Scheduler: failed to publish episode — will retry next cycle",
        );
      }
    }
  } catch (err) {
    logger.error({ err }, "Scheduler: runScheduledPublish encountered an error");
  }
}

// ---------------------------------------------------------------------------
// Manual publish trigger — POST /api/episodes/:epNumber/publish-now
// Immediately uploads and publishes a single scheduled episode.
// ---------------------------------------------------------------------------
app.post("/api/episodes/:epNumber/publish-now", async (req, res) => {
  const epNumber = parseInt(req.params.epNumber, 10);
  if (isNaN(epNumber) || epNumber <= 0) {
    res.status(400).json({ error: "Invalid episode number" });
    return;
  }

  const rows = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.epNumber, epNumber));

  if (!rows.length) {
    res.status(404).json({ error: `Episode ${epNumber} not found` });
    return;
  }

  const episode = rows[0];

  try {
    assertNotAlreadyPublished(episode);
  } catch (err) {
    res.status(409).json({
      error: err instanceof Error ? err.message : "Already published",
      youtubeVideoId: episode.youtubeVideoId,
      youtubeUrl: episode.youtubeVideoId
        ? `https://youtu.be/${episode.youtubeVideoId}`
        : undefined,
    });
    return;
  }

  try {
    const videoPath = findEpisodeVideoPath(episode.epNumber);

    const tags = (episode.hashtags ?? "")
      .split(/[\s,]+/)
      .map((t: string) => t.replace(/^#/, ""))
      .filter(Boolean);

    const { youtubeVideoId, youtubeUrl } = await uploadEpisodeVideo({
      videoPath,
      title: episode.youtubeTitle,
      description: buildYouTubeDescription({
        voScript: episode.voScript,
        citationCta: episode.citationCta,
        hashtags: episode.hashtags,
        season: episode.season,
      }),
      tags,
      privacyStatus: "public",
      publishAt: null,
    });

    try {
      await addVideoToPlaylist({ youtubeVideoId, season: episode.season });
    } catch (playlistErr) {
      logger.warn({ playlistErr }, "publish-now: playlist insert failed (non-fatal)");
    }

    const now = new Date();
    await db
      .update(episodesTable)
      .set({
        status: "published",
        youtubeVideoId,
        publishedAt: now,
        scheduledPublishAt: null,
        updatedAt: now,
      })
      .where(eq(episodesTable.epNumber, epNumber));

    logger.info({ epNumber, youtubeVideoId, youtubeUrl }, "publish-now: episode published");
    res.json({ ok: true, epNumber, youtubeVideoId, youtubeUrl });
  } catch (err) {
    logger.error({ err, epNumber }, "publish-now: upload failed");
    res.status(500).json({ error: (err as Error).message });
  }
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

assertAndLogCredentials();

let isShuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info({ signal }, "Shutting down — stopping active render jobs");
  try {
    await shutdownRenderJobs();
  } finally {
    process.exit(0);
  }
}

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // AUTO-SCHEDULER DISABLED — publishing is now managed manually via YouTube Studio.
  // The runScheduledPublish function and /api/scheduler/log + /api/scheduler/run
  // routes are kept for reference but the background interval is not started.
  //
  // const INTERVAL_MS = 15 * 60 * 1000;
  // runScheduledPublish().catch((err) =>
  //   logger.error({ err }, "Scheduler: startup check failed"),
  // );
  // setInterval(runScheduledPublish, INTERVAL_MS);
  logger.info("Auto-scheduler disabled — manual YouTube Studio scheduling in use");
});
