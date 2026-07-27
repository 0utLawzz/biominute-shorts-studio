import { Router } from "express";
import { eq, and, asc, sql } from "drizzle-orm";
import { db, episodesTable } from "@workspace/db";
import {
  ListEpisodesQueryParams,
  UpdateEpisodeBody,
  GetEpisodeParams,
  UpdateEpisodeParams,
  CreateEpisodeBody,
  GetBuildStatusParams,
  RunProductionParams,
} from "@workspace/api-zod";
import { spawn } from "child_process";
import { promises as fs, openSync, closeSync, mkdirSync, readdirSync, existsSync } from "fs";
import path from "path";
import {
  attachRenderPid,
  claimRenderJob,
  finishRenderJob,
  getRenderJob,
  RenderAlreadyRunningError,
} from "../lib/render-jobs";

// The valid set of episode status strings (mirrors the Drizzle pgEnum)
type EpisodeStatusValue =
  | "draft"
  | "scripted"
  | "complete"
  | "scheduled"
  | "published"
  | "building";

const router = Router();

// POST /episodes/sync-workbook
// Re-reads the master workbook and upserts episodes — this is the manual trigger
// Nadeem can click instead of running a terminal command by hand.
router.post("/episodes/sync-workbook", async (req, res): Promise<void> => {
  const { execFile } = await import("node:child_process");
  const pathMod = await import("node:path");

  const scriptPath = pathMod.resolve(import.meta.dirname, "../../../../scripts/src/seed-episodes.ts");

  execFile(
    "pnpm",
    ["--filter", "@workspace/scripts", "exec", "tsx", scriptPath],
    { cwd: pathMod.resolve(import.meta.dirname, "../../../../") },
    (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: "Sync failed", detail: stderr || error.message });
        return;
      }
      // seed-episodes.ts logs lines like "Inserted N new episodes." and
      // "Updated metadata for N existing episodes." — parse those counts out.
      const insertedMatch = stdout.match(/Inserted (\d+) new episodes/);
      const updatedMatch = stdout.match(/Updated metadata for (\d+) existing episodes/);
      res.json({
        success: true,
        inserted: insertedMatch ? parseInt(insertedMatch[1], 10) : 0,
        updated: updatedMatch ? parseInt(updatedMatch[1], 10) : 0,
        raw: stdout,
      });
    },
  );
});

// ── Helpers ────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..");

/** Find exported video file for an episode number, returns null if not found */
async function findVideoPath(epNumber: number): Promise<string | null> {
  const padded = String(epNumber).padStart(2, "0");
  const exportsDir = path.join(WORKSPACE_ROOT, "exports");

  try {
    const entries = await fs.readdir(exportsDir);
    for (const entry of entries) {
      if (entry.startsWith(`Episode-${padded}`)) {
        const candidate = path.join(exportsDir, entry, "episode.mp4");
        try {
          await fs.access(candidate);
          return candidate;
        } catch {
          // file doesn't exist in this folder
        }
      }
    }
  } catch {
    // exports dir doesn't exist yet
  }
  return null;
}

/** Build an episode export output dir path */
function buildExportDir(epNumber: number): string {
  const padded = String(epNumber).padStart(2, "0");
  return path.join(WORKSPACE_ROOT, "exports", `Episode-${padded}-build`);
}

// ── Routes ─────────────────────────────────────────────────────────────────────

// GET /episodes
router.get("/episodes", async (req, res): Promise<void> => {
  const parsed = ListEpisodesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, season } = parsed.data;

  const conditions = [];
  if (status) conditions.push(eq(episodesTable.status, status as EpisodeStatusValue));
  if (season) conditions.push(eq(episodesTable.season, season));

  const episodes = await db
    .select()
    .from(episodesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(episodesTable.epNumber));

  res.json(episodes);
});

// GET /episodes/social-rows
// Per-episode matrix used by the dashboard's Social Stats tabs.
// Returns folder / video / YouTube / Facebook presence so the UI can
// render the four-column indicator (e.g. "ep 66  video ❌ folder ✅
// YouTube ❌ Facebook ❌") without N+1 client requests.
router.get("/episodes/social-rows", async (_req, res): Promise<void> => {
  const all = await db
    .select({
      epNumber: episodesTable.epNumber,
      hookTitle: episodesTable.hookTitle,
      status: episodesTable.status,
      youtubeVideoId: episodesTable.youtubeVideoId,
      facebookVideoId: episodesTable.facebookVideoId,
      postDate: episodesTable.postDate,
      scheduledPublishAt: episodesTable.scheduledPublishAt,
    })
    .from(episodesTable)
    .orderBy(episodesTable.epNumber);

  const EXPORTS_DIR = path.resolve(process.cwd(), "../../exports");
  const rows = all
    .filter((row) => row.epNumber >= 1 && row.epNumber <= 100)
    .map((row) => {
      const padded = String(row.epNumber).padStart(2, "0");
      const folderName = readdirSync(EXPORTS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith(`Episode-${padded}-`))
        .map((d) => d.name)[0] ?? null;
      const hasFolder = folderName !== null;
      const hasVideoFile =
        hasFolder &&
        existsSync(path.join(EXPORTS_DIR, folderName, "episode.mp4"));
      return {
        epNumber: row.epNumber,
        hookTitle: row.hookTitle,
        status: row.status,
        hasFolder,
        hasVideoFile,
        youtubeVideoId: row.youtubeVideoId,
        facebookVideoId: row.facebookVideoId,
        postDate: row.postDate,
        scheduledPublishAt: row.scheduledPublishAt,
      };
    });

  res.json({ total: rows.length, rows });
});

// GET /episodes/stats
router.get("/episodes/stats", async (req, res): Promise<void> => {
  const all = await db.select().from(episodesTable);

  const byStatus = {
    draft: 0,
    scripted: 0,
    complete: 0,
    scheduled: 0,
    published: 0,
    building: 0,
  };

  for (const ep of all) {
    if (ep.status in byStatus) {
      byStatus[ep.status as keyof typeof byStatus]++;
    }
  }

  const now = new Date();
  const thisMonthPublished = all.filter((ep) => {
    if (!ep.publishedAt) return false;
    const d = new Date(ep.publishedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const upcoming = all
    .filter((ep) => ep.status !== "published")
    .map((ep) => ep.postDate)
    .sort()[0] ?? null;

  res.json({
    total: all.length,
    byStatus,
    nextPostDate: upcoming,
    publishedThisMonth: thisMonthPublished,
  });
});

// GET /episodes/upcoming
router.get("/episodes/upcoming", async (req, res): Promise<void> => {
  const all = await db
    .select()
    .from(episodesTable)
    .where(
      sql`${episodesTable.status} NOT IN ('published')`
    )
    .orderBy(asc(episodesTable.epNumber))
    .limit(5);

  res.json(all);
});

// POST /episodes — create new episode (enters building pipeline)
router.post("/episodes", async (req, res): Promise<void> => {
  const parsed = CreateEpisodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const [created] = await db
    .insert(episodesTable)
    .values({
      epNumber: data.epNumber,
      postDate: data.postDate,
      season: data.season,
      duration: data.duration,
      hookTitle: data.hookTitle,
      youtubeTitle: data.youtubeTitle,
      voScript: data.voScript,
      visualDirection: data.visualDirection,
      bgSound: data.bgSound,
      thumbnailPrompt: data.thumbnailPrompt,
      citationCta: data.citationCta,
      hashtags: data.hashtags,
      aspectRatio: data.aspectRatio ?? "9:16",
      status: "building",
      buildStage: "script_ready",
    })
    .returning();

  res.status(201).json(created);
});

// GET /episodes/:id
router.get("/episodes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = GetEpisodeParams.safeParse({ id });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [episode] = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.id, id));

  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  res.json(episode);
});

// PATCH /episodes/:id
router.patch("/episodes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const paramParsed = UpdateEpisodeParams.safeParse({ id });
  if (!paramParsed.success) {
    res.status(400).json({ error: paramParsed.error.message });
    return;
  }

  const bodyParsed = UpdateEpisodeBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { status, youtubeTitle, citationCta, hashtags, scheduledPublishAt, buildStage, buildNote } = bodyParsed.data;

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (status !== undefined) updateData.status = status;
  if (youtubeTitle !== undefined) updateData.youtubeTitle = youtubeTitle;
  if (citationCta !== undefined) updateData.citationCta = citationCta;
  if (hashtags !== undefined) updateData.hashtags = hashtags;
  if (buildStage !== undefined) updateData.buildStage = buildStage;
  if (buildNote !== undefined) updateData.buildNote = buildNote;
  if (scheduledPublishAt !== undefined) {
    updateData.scheduledPublishAt = scheduledPublishAt ? new Date(scheduledPublishAt) : null;
  }

  const [updated] = await db
    .update(episodesTable)
    .set(updateData)
    .where(eq(episodesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  res.json(updated);
});

// REMOVED: POST /episodes/:id/approve — manual approval workflow eliminated
// Episodes now auto-advance: build completion (stage=exported) → complete/scheduled

// GET /episodes/:id/build-status
router.get("/episodes/:id/build-status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = GetBuildStatusParams.safeParse({ id });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [episode] = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.id, id));

  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  const videoPath = await findVideoPath(episode.epNumber);
  const videoExists = videoPath !== null;

  // Auto-advance: if video found but stage is still 'rendering', advance to 'exported'
  // AND auto-schedule the episode (no manual approval step anymore). scheduledPublishAt
  // is derived from postDate + 09:00 UTC, same formula this app already uses elsewhere
  // for schedule dates.
  if (videoExists && episode.buildStage === "rendering") {
    let scheduledPublishAt: Date | null = null;
    if (episode.postDate) {
      const d = new Date(episode.postDate);
      d.setUTCHours(9, 0, 0, 0);
      if (!Number.isNaN(d.getTime())) scheduledPublishAt = d;
    }
    const nextStatus = episode.status === "published" ? episode.status : "scheduled";

    await db
      .update(episodesTable)
      .set({
        buildStage: "exported",
        status: nextStatus,
        updatedAt: new Date(),
        ...(scheduledPublishAt ? { scheduledPublishAt } : {}),
      })
      .where(eq(episodesTable.id, id));

    res.json({
      id: episode.id,
      status: nextStatus,
      buildStage: "exported",
      buildNote: episode.buildNote,
      videoExists: true,
      videoPath,
    });
    return;
  }

  res.json({
    id: episode.id,
    status: episode.status,
    buildStage: episode.buildStage,
    buildNote: episode.buildNote,
    videoExists,
    videoPath,
  });
});

// GET /episodes/:id/render-status — durable process-level render status
router.get("/episodes/:id/render-status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [episode] = await db
    .select({ id: episodesTable.id })
    .from(episodesTable)
    .where(eq(episodesTable.id, id));
  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  const [statusEpisode] = await db
    .select({ epNumber: episodesTable.epNumber })
    .from(episodesTable)
    .where(eq(episodesTable.id, id));
  const outputExists = statusEpisode
    ? (await findVideoPath(statusEpisode.epNumber)) !== null
    : false;
  const job = await getRenderJob(id, outputExists);
  res.json({
    status: job?.status ?? "idle",
    jobId: job?.id ?? null,
    pid: job?.pid ?? null,
    startedAt: job?.startedAt?.toISOString() ?? null,
    finishedAt: job?.finishedAt?.toISOString() ?? null,
    logPath: job?.logPath ?? null,
    error: job?.error ?? null,
  });
});

// POST /episodes/:id/run-production
router.post("/episodes/:id/run-production", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = RunProductionParams.safeParse({ id });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [episode] = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.id, id));

  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  if (episode.status !== "building" && episode.status !== "scripted") {
    res.status(400).json({ error: `Episode must be in 'scripted' or 'building' status to run production (current: ${episode.status})` });
    return;
  }

  // Claim the durable per-episode render slot before touching the episode or
  // spawning a child. The row-level lock makes simultaneous requests safe.
  const exportDir = buildExportDir(episode.epNumber);
  const logPath = path.join(exportDir, "export.log");
  let renderJob: Awaited<ReturnType<typeof claimRenderJob>>;
  try {
    renderJob = await claimRenderJob({ episodeId: id, logPath });
  } catch (error) {
    if (error instanceof RenderAlreadyRunningError) {
      res.status(409).json({
        error: error.message,
        status: "running",
        jobId: error.job.id,
        startedAt: error.job.startedAt,
      });
      return;
    }
    throw error;
  }

  // Promote scripted → building, then mark as rendering
  await db
    .update(episodesTable)
    .set({ status: "building", buildStage: "rendering", updatedAt: new Date() })
    .where(eq(episodesTable.id, id));

  // Determine the biominute-reels URL and output dir
  // Default to the actual Reels dev-server port/path used in this workspace.
  const exportUrl =
    process.env.BIOMINUTE_EXPORT_URL ||
    `http://localhost:${process.env.BIOMINUTE_REELS_PORT || "25078"}/biominute-reels/`;
  const scriptPath = path.join(WORKSPACE_ROOT, "scripts", "src", "export-video.ts");

  // tsx lives in the scripts package's node_modules — use that path directly
  // so the spawn doesn't depend on it being in PATH.
  const tsxBin = path.join(WORKSPACE_ROOT, "scripts", "node_modules", ".bin", "tsx");

  // Ensure export dir exists so the log file can be opened before tsx starts.
  mkdirSync(exportDir, { recursive: true });
  const logFd = openSync(logPath, "w");

  // Keep the child detached so a normal HTTP/API lifecycle does not cancel a
  // render. The database row remains the durable lock across restarts and lets
  // the next API instance reconcile the PID.
  // stdout + stderr both go to export.log — never silent-fail again.
  const child = spawn(
    tsxBin,
    [scriptPath],
    {
      detached: true,
      stdio: ["ignore", logFd, logFd],
      env: {
        ...process.env,
        BIOMINUTE_EXPORT_URL: exportUrl,
        BIOMINUTE_EXPORT_DIR: exportDir,
      },
    }
  );
  child.unref();
  closeSync(logFd);

  if (!child.pid) {
    await finishRenderJob({
      jobId: renderJob.id,
      status: "failed",
      error: "Render process did not provide a PID",
    });
    res.status(500).json({ error: "Render process did not start" });
    return;
  }

  await attachRenderPid(renderJob.id, child.pid);
  child.once("error", async (error) => {
    await finishRenderJob({
      jobId: renderJob.id,
      status: "failed",
      error: error.message,
    });
    await db
      .update(episodesTable)
      .set({
        status: "scripted",
        buildStage: "script_ready",
        buildNote: `Render failed: ${error.message}`,
        updatedAt: new Date(),
      })
      .where(eq(episodesTable.id, id));
  });
  child.once("exit", async (code, signal) => {
    const succeeded = code === 0;
    await finishRenderJob({
      jobId: renderJob.id,
      status: succeeded ? "succeeded" : "failed",
      error: succeeded
        ? null
        : `Render exited with ${signal ? `signal ${signal}` : `code ${code}`}`,
    });
    if (!succeeded) {
      await db
        .update(episodesTable)
        .set({
          status: "scripted",
          buildStage: "script_ready",
          buildNote: `Render failed: ${signal ? `signal ${signal}` : `code ${code}`}`,
          updatedAt: new Date(),
        })
        .where(eq(episodesTable.id, id));
    }
  });

  res.json({
    success: true,
    jobId: renderJob.id,
    pid: child.pid,
    message: "Production render started. Poll /render-status for progress.",
  });
});

// REMOVED: POST /episodes/:id/reject — manual rejection workflow eliminated

// GET /episodes/:id/video — stream the exported mp4
router.get("/episodes/:id/video", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [episode] = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.id, id));

  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  const videoPath = await findVideoPath(episode.epNumber);
  if (!videoPath) {
    res.status(404).json({ error: "Video file not found. Has production been run?" });
    return;
  }

  res.sendFile(videoPath);
});

export default router;
