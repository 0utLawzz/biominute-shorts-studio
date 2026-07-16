import { Router } from "express";
import { eq, and, asc, sql } from "drizzle-orm";
import { db, episodesTable } from "@workspace/db";
import {
  ListEpisodesQueryParams,
  UpdateEpisodeBody,
  GetEpisodeParams,
  UpdateEpisodeParams,
  ApproveEpisodeParams,
  CreateEpisodeBody,
  GenerateScriptBody,
  GetBuildStatusParams,
  RunProductionParams,
  RejectEpisodeParams,
  RejectEpisodeBody,
} from "@workspace/api-zod";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

// The valid set of episode status strings (mirrors the Drizzle pgEnum)
type EpisodeStatusValue =
  | "draft"
  | "complete"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "building"
  | "rejected";

const router = Router();

// ── Helpers ────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..", "..");

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

// GET /episodes/stats
router.get("/episodes/stats", async (req, res): Promise<void> => {
  const all = await db.select().from(episodesTable);

  const byStatus = {
    draft: 0,
    complete: 0,
    review: 0,
    approved: 0,
    scheduled: 0,
    published: 0,
    building: 0,
    rejected: 0,
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

// POST /episodes/generate-script
router.post("/episodes/generate-script", async (req, res): Promise<void> => {
  const parsed = GenerateScriptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { topic, season } = parsed.data;
  const seasonTag = season ? ` (${season})` : "";

  // Template-based placeholder — no LLM needed. User edits before rendering.
  const hookTitle = `The truth about ${topic} nobody tells you`;
  const youtubeTitle = `${topic}: What the science actually says #BioMinute`;
  const voScript = `[HOOK — 0:00-0:05]
Did you know that ${topic} can change your biology in minutes?

[CONTEXT — 0:05-0:15]
Most people are getting this completely wrong. Here's what the research actually shows about ${topic}.

[MECHANISM — 0:15-0:35]
Your body responds to ${topic} by triggering a cascade of cellular changes. Studies show that consistent practice leads to measurable improvements in key biomarkers within just weeks.

[EVIDENCE — 0:35-0:50]
A landmark 2023 study found that people who optimized their approach to ${topic} experienced significantly better outcomes compared to controls — without any medications or expensive interventions.

[CTA — 0:50-1:00]
The research is clear. Start today. Drop a "✓" in the comments if you're going to try this. Save this video — your future self will thank you.`;

  const visualDirection = `Clean medical-aesthetic visuals. Open on close-up of relevant imagery for "${topic}". Animate key statistics as bold text overlays. Use biominute color palette — deep green, warm cream, accent orange. Split-screen showing before/after or mechanism diagrams. End card with channel logo.`;
  const thumbnailPrompt = `Bold text "${topic.toUpperCase()} TRUTH" over a high-contrast medical/wellness background. Include a shocked or curious face expression. Red/orange accent color on key word. Clean, minimal, high-contrast for mobile.`;
  const citationCta = `Source: Current research on ${topic}. See pinned comment for full citations. Consult your healthcare provider before making changes.`;
  const hashtags = `#${topic.replace(/\s+/g, "")} #BioMinute #HealthScience #WellnessTips #HealthHacks #ScienceBacked${seasonTag ? ` #BioMinuteSeason` : ""}`;

  res.json({
    hookTitle,
    youtubeTitle,
    voScript,
    visualDirection,
    thumbnailPrompt,
    citationCta,
    hashtags,
  });
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

// POST /episodes/:id/approve
router.post("/episodes/:id/approve", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = ApproveEpisodeParams.safeParse({ id });
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

  const [updated] = await db
    .update(episodesTable)
    .set({ status: "approved", approvedAt: new Date(), updatedAt: new Date() })
    .where(eq(episodesTable.id, id))
    .returning();

  res.json(updated);
});

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
  if (videoExists && episode.buildStage === "rendering") {
    await db
      .update(episodesTable)
      .set({ buildStage: "exported", updatedAt: new Date() })
      .where(eq(episodesTable.id, id));

    res.json({
      id: episode.id,
      status: episode.status,
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

  if (episode.status !== "building") {
    res.status(400).json({ error: "Episode must be in 'building' status to run production" });
    return;
  }

  // Mark as rendering
  await db
    .update(episodesTable)
    .set({ buildStage: "rendering", updatedAt: new Date() })
    .where(eq(episodesTable.id, id));

  // Determine the biominute-reels URL and output dir
  const reelsPort = process.env.BIOMINUTE_REELS_PORT || "5173";
  const exportUrl = process.env.BIOMINUTE_EXPORT_URL || `http://localhost:${reelsPort}/`;
  const exportDir = buildExportDir(episode.epNumber);
  const scriptPath = path.join(WORKSPACE_ROOT, "scripts", "src", "export-video.ts");

  // Spawn the export script detached so it survives the HTTP response
  const child = spawn(
    "npx",
    ["tsx", scriptPath],
    {
      detached: true,
      stdio: "ignore",
      env: {
        ...process.env,
        BIOMINUTE_EXPORT_URL: exportUrl,
        BIOMINUTE_EXPORT_DIR: exportDir,
      },
    }
  );
  child.unref();

  res.json({ success: true, message: "Production render started. Poll /build-status for progress." });
});

// POST /episodes/:id/reject
router.post("/episodes/:id/reject", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const paramParsed = RejectEpisodeParams.safeParse({ id });
  if (!paramParsed.success) {
    res.status(400).json({ error: paramParsed.error.message });
    return;
  }

  const bodyParsed = RejectEpisodeBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
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

  const [updated] = await db
    .update(episodesTable)
    .set({
      status: "rejected",
      buildNote: bodyParsed.data.buildNote ?? episode.buildNote,
      updatedAt: new Date(),
    })
    .where(eq(episodesTable.id, id))
    .returning();

  res.json(updated);
});

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
