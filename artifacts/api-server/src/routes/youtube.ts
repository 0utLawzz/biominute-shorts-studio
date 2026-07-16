import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, episodesTable } from "@workspace/db";
import { PublishToYouTubeBody, PublishToYouTubeParams } from "@workspace/api-zod";
import {
  findEpisodeVideoPath,
  uploadEpisodeVideo,
  addVideoToPlaylist,
  repairVideoOnYouTube,
  seasonEnvKey,
} from "../lib/youtube-upload";
import { logger } from "../lib/logger";

const router = Router();

// ---------------------------------------------------------------------------
// GET /youtube/status
// ---------------------------------------------------------------------------
router.get("/youtube/status", async (_req, res): Promise<void> => {
  // This route must never 500 — it is polled by the dashboard on every load.
  const hasCredentials =
    !!process.env.YOUTUBE_CLIENT_ID &&
    !!process.env.YOUTUBE_CLIENT_SECRET &&
    !!process.env.YOUTUBE_REFRESH_TOKEN;

  // Surface which season playlists are configured so the dashboard can warn
  const playlists: Record<string, boolean> = {};
  for (const [season, envKey] of Object.entries(SEASON_PLAYLIST_ENV)) {
    playlists[season] = !!process.env[envKey];
  }

  res.json({
    connected: hasCredentials,
    channelName: hasCredentials ? (process.env.YOUTUBE_CHANNEL_NAME ?? null) : null,
    channelId: hasCredentials ? (process.env.YOUTUBE_CHANNEL_ID ?? null) : null,
    playlists,
  });
});

// ---------------------------------------------------------------------------
// GET /youtube/auth-url
// ---------------------------------------------------------------------------
router.get("/youtube/auth-url", async (_req, res): Promise<void> => {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri =
    process.env.YOUTUBE_REDIRECT_URI ?? "urn:ietf:wg:oauth:2.0:oob";

  if (!clientId) {
    res.json({
      url: "https://console.cloud.google.com/apis/credentials — Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET as secrets first",
    });
    return;
  }

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
  ].join(" ");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  res.json({ url: url.toString() });
});

// ---------------------------------------------------------------------------
// POST /youtube/publish/:id
// ---------------------------------------------------------------------------
router.post("/youtube/publish/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const paramParsed = PublishToYouTubeParams.safeParse({ id });
  if (!paramParsed.success) {
    res.status(400).json({ error: paramParsed.error.message });
    return;
  }

  const bodyParsed = PublishToYouTubeBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { scheduleAt, privacyStatus } = bodyParsed.data;

  const hasCredentials =
    !!process.env.YOUTUBE_CLIENT_ID &&
    !!process.env.YOUTUBE_CLIENT_SECRET &&
    !!process.env.YOUTUBE_REFRESH_TOKEN;

  // -------------------------------------------------------------------------
  // DRAFT MODE — no credentials yet; mark scheduled so the scheduler picks
  // it up once credentials are added.
  // -------------------------------------------------------------------------
  if (!hasCredentials) {
    const [episode] = await db
      .select()
      .from(episodesTable)
      .where(eq(episodesTable.id, id));

    if (!episode) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }

    if (episode.status !== "approved") {
      res.status(400).json({ error: "Episode must be approved before publishing" });
      return;
    }

    const scheduledAt = scheduleAt ? new Date(scheduleAt) : new Date();

    await db
      .update(episodesTable)
      .set({ status: "scheduled", scheduledPublishAt: scheduledAt, updatedAt: new Date() })
      .where(eq(episodesTable.id, id));

    logger.info({ episodeId: id, scheduledAt }, "Draft mode: episode queued (no YT credentials)");

    res.json({
      success: true,
      youtubeVideoId: null,
      youtubeUrl: null,
      scheduledAt: scheduledAt.toISOString(),
      message: "Marked as scheduled. Connect YouTube account to publish live.",
    });
    return;
  }

  // -------------------------------------------------------------------------
  // LIVE MODE — upload now.
  // -------------------------------------------------------------------------
  const [episode] = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.id, id));

  if (!episode) {
    res.status(404).json({ error: "Episode not found" });
    return;
  }

  if (episode.status !== "approved") {
    res.status(400).json({ error: "Episode must be approved before publishing" });
    return;
  }

  let videoPath: string;
  try {
    videoPath = findEpisodeVideoPath(episode.epNumber);
  } catch (err) {
    logger.error({ err, epNumber: episode.epNumber }, "Episode video file not found");
    res.status(400).json({
      error:
        err instanceof Error
          ? err.message
          : "Episode video file not found. Export the episode first.",
    });
    return;
  }

  try {
    const tags = (episode.hashtags ?? "")
      .split(/[\s,]+/)
      .map((tag: string) => tag.replace(/^#/, ""))
      .filter(Boolean);

    const { youtubeVideoId, youtubeUrl } = await uploadEpisodeVideo({
      videoPath,
      title: episode.youtubeTitle,
      description: `${episode.citationCta ?? ""}\n\n${episode.hashtags ?? ""}`,
      tags,
      privacyStatus,
      publishAt: scheduleAt ?? null,
    });

    logger.info({ episodeId: id, youtubeVideoId, scheduled: !!scheduleAt }, "YouTube upload succeeded");

    // Add to season playlist (non-fatal — log warning but don't fail the response)
    let playlistResult = null;
    let playlistWarning: string | null = null;
    try {
      playlistResult = await addVideoToPlaylist({ youtubeVideoId, season: episode.season });
      if (!playlistResult) {
        const envVar = seasonEnvKey(episode.season);
        playlistWarning = `No playlist ID set for season "${episode.season}". Add ${envVar} in Replit Secrets.`;
      }
    } catch (err) {
      playlistWarning = err instanceof Error ? err.message : "Playlist insert failed";
      logger.warn({ err, episodeId: id, season: episode.season }, "Playlist insert failed (upload still succeeded)");
    }

    const scheduledAt = scheduleAt ? new Date(scheduleAt) : new Date();

    await db
      .update(episodesTable)
      .set({
        status: scheduleAt ? "scheduled" : "published",
        youtubeVideoId,
        scheduledPublishAt: scheduleAt ? scheduledAt : null,
        publishedAt: scheduleAt ? null : scheduledAt,
        updatedAt: new Date(),
      })
      .where(eq(episodesTable.id, id));

    res.json({
      success: true,
      youtubeVideoId,
      youtubeUrl,
      scheduledAt: scheduleAt ? scheduledAt.toISOString() : null,
      playlist: playlistResult
        ? { playlistId: playlistResult.playlistId, playlistItemId: playlistResult.playlistItemId }
        : null,
      playlistWarning,
      message: scheduleAt
        ? `Uploaded and scheduled to publish at ${scheduledAt.toISOString()}.`
        : "Uploaded and published to YouTube.",
    });
  } catch (err) {
    logger.error({ err, episodeId: id }, "YouTube upload failed");
    res.status(502).json({
      error: err instanceof Error ? err.message : "YouTube upload failed",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /youtube/repair/:id
// Retroactively sets privacy + adds an existing YouTube video to the correct
// season playlist. Use this to fix episodes uploaded outside the pipeline
// (e.g. Episodes 1 & 2 uploaded manually).
//
// Body: { youtubeVideoId: string, privacyStatus?: "public"|"unlisted"|"private", publishAt?: string|null }
// ---------------------------------------------------------------------------
router.post("/youtube/repair/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid episode id" });
    return;
  }

  const { youtubeVideoId, privacyStatus: rawPrivacy = "private", publishAt = null } = req.body as Record<string, unknown>;

  if (!youtubeVideoId || typeof youtubeVideoId !== "string") {
    res.status(400).json({ error: "youtubeVideoId is required (string)" });
    return;
  }
  const VALID_PRIVACY = ["public", "unlisted", "private"] as const;
  type PrivacyStatus = (typeof VALID_PRIVACY)[number];
  if (typeof rawPrivacy !== "string" || !VALID_PRIVACY.includes(rawPrivacy as PrivacyStatus)) {
    res.status(400).json({ error: "privacyStatus must be one of: public, unlisted, private" });
    return;
  }
  const privacyStatus = rawPrivacy as PrivacyStatus;
  if (publishAt !== null && publishAt !== undefined && typeof publishAt !== "string") {
    res.status(400).json({ error: "publishAt must be an ISO datetime string or null" });
    return;
  }

  const hasCredentials =
    !!process.env.YOUTUBE_CLIENT_ID &&
    !!process.env.YOUTUBE_CLIENT_SECRET &&
    !!process.env.YOUTUBE_REFRESH_TOKEN;

  if (!hasCredentials) {
    res.status(400).json({
      error: "YouTube credentials not configured. Add YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN in Replit Secrets.",
    });
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

  try {
    const { privacyUpdated, playlistResult, playlistWarning } = await repairVideoOnYouTube({
      youtubeVideoId,
      season: episode.season,
      privacyStatus,
      publishAt: publishAt ?? null,
    });

    // Update DB to link this videoId and reflect the corrected status
    const isScheduled = !!publishAt;
    const isPublic = !isScheduled && privacyStatus !== "private";

    await db
      .update(episodesTable)
      .set({
        youtubeVideoId,
        status: isScheduled ? "scheduled" : isPublic ? "published" : "scheduled",
        scheduledPublishAt: isScheduled ? new Date(publishAt as string) : null,
        publishedAt: isPublic ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(episodesTable.id, id));

    logger.info(
      { episodeId: id, epNumber: episode.epNumber, youtubeVideoId, privacyUpdated, playlistResult },
      "YouTube repair completed",
    );

    res.json({
      success: true,
      episodeId: id,
      epNumber: episode.epNumber,
      season: episode.season,
      youtubeVideoId,
      youtubeUrl: `https://youtu.be/${youtubeVideoId}`,
      privacyUpdated,
      playlist: playlistResult
        ? { playlistId: playlistResult.playlistId, playlistItemId: playlistResult.playlistItemId }
        : null,
      playlistWarning: playlistWarning ?? null,
    });
  } catch (err) {
    logger.error({ err, episodeId: id, youtubeVideoId }, "YouTube repair failed");
    res.status(502).json({
      error: err instanceof Error ? err.message : "YouTube repair failed",
    });
  }
});

export default router;
