import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, episodesTable } from "@workspace/db";
import { google } from "googleapis";
import { isInvalidGrantError } from "../lib/youtube-upload";
import { logger } from "../lib/logger";

const router = Router();

// ---------------------------------------------------------------------------
// GET /analytics/youtube/:id — fetch live YouTube stats via Data API v3
// ---------------------------------------------------------------------------
router.get("/analytics/youtube/:id", async (req, res): Promise<void> => {
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

  if (!episode.youtubeVideoId) {
    res.status(400).json({ error: "Episode has no YouTube video ID — publish to YouTube first." });
    return;
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    res.status(400).json({ error: "YouTube credentials not configured." });
    return;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const response = await youtube.videos.list({
      part: ["statistics", "snippet"],
      id: [episode.youtubeVideoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      res.status(404).json({ error: "Video not found on YouTube. It may have been deleted." });
      return;
    }

    const stats = video.statistics;
    const snippet = video.snippet;

    const metrics = {
      views: parseInt(stats?.viewCount ?? "0", 10),
      likes: parseInt(stats?.likeCount ?? "0", 10),
      comments: parseInt(stats?.commentCount ?? "0", 10),
      publishedAt: snippet?.publishedAt ?? null,
    };

    // Update DB cache
    await db
      .update(episodesTable)
      .set({
        youtubeViews: metrics.views,
        youtubeLikes: metrics.likes,
        youtubeComments: metrics.comments,
        updatedAt: new Date(),
      })
      .where(eq(episodesTable.id, id));

    res.json(metrics);
  } catch (err) {
    logger.error({ err, episodeId: id, youtubeVideoId: episode.youtubeVideoId }, "YouTube analytics fetch failed");
    if (isInvalidGrantError(err)) {
      res.status(502).json({ error: "YouTube refresh token expired. Run youtube-reauth.ts.", errorCode: "INVALID_GRANT" });
      return;
    }
    res.status(502).json({ error: err instanceof Error ? err.message : "YouTube analytics fetch failed" });
  }
});

// ---------------------------------------------------------------------------
// GET /analytics/facebook/:id — fetch live Facebook stats via Graph API
// ---------------------------------------------------------------------------
router.get("/analytics/facebook/:id", async (req, res): Promise<void> => {
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

  if (!episode.facebookVideoId) {
    res.status(400).json({ error: "Episode has no Facebook video ID — publish to Facebook first." });
    return;
  }

  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(400).json({ error: "Facebook credentials not configured." });
    return;
  }

  try {
    // Fetch video insights from Facebook Graph API
    // video_views, total_video_views, total_interactions, video_share_count, video_reactions_by_type_total
    const fields = [
      "id",
      "views",
      "likes.summary(true).limit(0)",
      "comments.summary(true).limit(0)",
      ...(process.env.FACEBOOK_SHARES_ENABLED === "true" ? ["shares"] : []),
    ].join(",");

    const fbRes = await fetch(
      `https://graph.facebook.com/v21.0/${episode.facebookVideoId}?fields=${encodeURIComponent(fields)}&access_token=${accessToken}`,
    );

    if (!fbRes.ok) {
      const errBody = await fbRes.text();
      throw new Error(`Facebook API error (${fbRes.status}): ${errBody}`);
    }

    const data = (await fbRes.json()) as {
      id?: string;
      views?: number;
      likes?: { summary?: { total_count?: number }; data?: Array<unknown> };
      comments?: { summary?: { total_count?: number }; data?: Array<unknown> };
      shares?: { count?: number };
    };

    const metrics = {
      views: data.views ?? 0,
      likes: data.likes?.summary?.total_count ?? 0,
      comments: data.comments?.summary?.total_count ?? 0,
      shares: data.shares?.count ?? 0,
    };

    // Update DB cache
    await db
      .update(episodesTable)
      .set({
        facebookViews: metrics.views,
        facebookLikes: metrics.likes,
        facebookComments: metrics.comments,
        facebookShares: metrics.shares,
        updatedAt: new Date(),
      })
      .where(eq(episodesTable.id, id));

    res.json(metrics);
  } catch (err) {
    logger.error({ err, episodeId: id, facebookVideoId: episode.facebookVideoId }, "Facebook analytics fetch failed");
    res.status(502).json({ error: err instanceof Error ? err.message : "Facebook analytics fetch failed" });
  }
});

// ---------------------------------------------------------------------------
// GET /analytics/episodes — aggregated analytics across all published episodes
// ---------------------------------------------------------------------------
router.get("/analytics/episodes", async (_req, res): Promise<void> => {
  const episodes = await db
    .select()
    .from(episodesTable)
    .where(
      eq(episodesTable.status, "published"),
    );

  if (episodes.length === 0) {
    res.json({ total: 0, byEpisode: [], totalYoutubeViews: 0, totalFacebookViews: 0, aggregate: null });
    return;
  }

  const byEpisode = episodes.map((ep) => ({
    id: ep.id,
    epNumber: ep.epNumber,
    hookTitle: ep.hookTitle,
    youtubeVideoId: ep.youtubeVideoId,
    youtubeViews: ep.youtubeViews ?? 0,
    youtubeLikes: ep.youtubeLikes ?? 0,
    youtubeComments: ep.youtubeComments ?? 0,
    facebookVideoId: ep.facebookVideoId,
    facebookViews: ep.facebookViews ?? 0,
    facebookLikes: ep.facebookLikes ?? 0,
    facebookComments: ep.facebookComments ?? 0,
    facebookShares: ep.facebookShares ?? 0,
    publishedAt: ep.publishedAt,
  }));

  const totalYoutubeViews = byEpisode.reduce((sum, ep) => sum + ep.youtubeViews, 0);
  const totalFacebookViews = byEpisode.reduce((sum, ep) => sum + ep.facebookViews, 0);
  const totalYoutubeLikes = byEpisode.reduce((sum, ep) => sum + ep.youtubeLikes, 0);
  const totalFacebookLikes = byEpisode.reduce((sum, ep) => sum + ep.facebookLikes, 0);

  res.json({
    total: byEpisode.length,
    byEpisode,
    totalYoutubeViews,
    totalFacebookViews,
    totalYoutubeLikes,
    totalFacebookLikes,
    aggregate: {
      youtubeViews: totalYoutubeViews,
      facebookViews: totalFacebookViews,
      youtubeLikes: totalYoutubeLikes,
      facebookLikes: totalFacebookLikes,
    },
  });
});

export default router;
