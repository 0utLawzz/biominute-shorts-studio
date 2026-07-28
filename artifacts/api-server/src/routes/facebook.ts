import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, episodesTable } from "@workspace/db";
import { findEpisodeVideoPath } from "../lib/youtube-upload";
import { logger } from "../lib/logger";
import fs from "node:fs";
import { assertVerifiedVideo } from "../lib/video-verification";

const router = Router();
const FB_GRAPH_VIDEO_URL = "https://graph-video.facebook.com/v21.0";

// ---------------------------------------------------------------------------
// GET /facebook/status
// ---------------------------------------------------------------------------
router.get("/facebook/status", (_req, res): void => {
  const connected =
    !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN && !!process.env.FACEBOOK_PAGE_ID;
  res.json({
    connected,
    pageId: connected ? process.env.FACEBOOK_PAGE_ID : null,
    hasAccessToken: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    hasPageId: !!process.env.FACEBOOK_PAGE_ID,
  });
});

// ---------------------------------------------------------------------------
// POST /facebook/publish/:id
// Uploads the episode MP4 to the configured Facebook Page using the Graph API
// chunked upload protocol (handles files of any size).
// ---------------------------------------------------------------------------
router.post("/facebook/publish/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    res.status(400).json({
      error:
        "Facebook credentials not configured. Add FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID in Replit Secrets.",
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

  if (!["building", "scheduled", "published", "complete"].includes(episode.status)) {
    res.status(400).json({
      error: "Episode must be building, complete, scheduled, or published before posting to Facebook.",
    });
    return;
  }

  if (episode.facebookVideoId) {
    res.status(409).json({
      error: `Episode ${episode.epNumber} is already on Facebook (${episode.facebookVideoId}). Delete it first if you want to re-upload.`,
      facebookVideoId: episode.facebookVideoId,
    });
    return;
  }

  let videoPath: string;
  try {
    videoPath = findEpisodeVideoPath(episode.epNumber);
    assertVerifiedVideo(videoPath);
  } catch (err) {
    res.status(400).json({
      error:
        err instanceof Error
          ? err.message
          : "Verified episode video is required before publishing.",
    });
    return;
  }

  try {
    const fileSize = fs.statSync(videoPath).size;

    const title = episode.youtubeTitle ?? episode.hookTitle ?? `Episode ${episode.epNumber}`;
    const description = [
      episode.voScript?.slice(0, 500) ?? "",
      "",
      episode.hashtags ?? "",
    ]
      .join("\n")
      .trim();

    // -------------------------------------------------------------------------
    // Phase 1: Start upload session
    // -------------------------------------------------------------------------
    const startParams = new URLSearchParams({
      upload_phase: "start",
      file_size: String(fileSize),
      access_token: accessToken,
    });

    const startRes = await fetch(`${FB_GRAPH_VIDEO_URL}/${pageId}/videos?${startParams}`, {
      method: "POST",
    });

    if (!startRes.ok) {
      const errBody = await startRes.text();
      throw new Error(`Facebook start-upload failed (${startRes.status}): ${errBody}`);
    }

    const startData = (await startRes.json()) as {
      upload_session_id: string;
      start_offset: string;
      end_offset: string;
      video_id: string;
    };

    const { upload_session_id } = startData;
    let currentStart = parseInt(startData.start_offset, 10);
    let currentEnd = parseInt(startData.end_offset, 10);

    logger.info(
      { episodeId: id, upload_session_id, fileSize },
      "Facebook: upload session started",
    );

    // -------------------------------------------------------------------------
    // Phase 2: Transfer chunk(s)
    // -------------------------------------------------------------------------
    const fileBuffer = fs.readFileSync(videoPath);

    while (currentStart < fileSize) {
      const chunk = fileBuffer.subarray(currentStart, currentEnd);
      const formData = new FormData();
      formData.append("upload_phase", "transfer");
      formData.append("start_offset", String(currentStart));
      formData.append("upload_session_id", upload_session_id);
      formData.append("access_token", accessToken);
      formData.append(
        "video_file_chunk",
        new Blob([chunk], { type: "video/mp4" }),
        "chunk.mp4",
      );

      const transferRes = await fetch(`${FB_GRAPH_VIDEO_URL}/${pageId}/videos`, {
        method: "POST",
        body: formData,
      });

      if (!transferRes.ok) {
        const errBody = await transferRes.text();
        throw new Error(`Facebook chunk-transfer failed (${transferRes.status}): ${errBody}`);
      }

      const transferData = (await transferRes.json()) as {
        start_offset: string;
        end_offset: string;
      };

      currentStart = parseInt(transferData.start_offset, 10);
      currentEnd = parseInt(transferData.end_offset, 10);

      logger.info(
        { episodeId: id, upload_session_id, currentStart, fileSize },
        "Facebook: chunk transferred",
      );

      if (currentStart >= fileSize) break;
    }

    // -------------------------------------------------------------------------
    // Phase 3: Finish upload
    // -------------------------------------------------------------------------
    const finishParams = new URLSearchParams({
      upload_phase: "finish",
      upload_session_id,
      access_token: accessToken,
      title,
      description,
    });

    const finishRes = await fetch(
      `${FB_GRAPH_VIDEO_URL}/${pageId}/videos?${finishParams}`,
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

    const facebookVideoId = finishData.video_id ?? upload_session_id;
    if (!finishData.success && !finishData.video_id) {
      throw new Error("Facebook upload finished but returned no video ID.");
    }

    const facebookUrl = `https://www.facebook.com/watch/?v=${facebookVideoId}`;

    await db
      .update(episodesTable)
      .set({ facebookVideoId, updatedAt: new Date() })
      .where(eq(episodesTable.id, id));

    logger.info({ episodeId: id, facebookVideoId }, "Facebook upload succeeded");

    res.json({
      success: true,
      facebookVideoId,
      facebookUrl,
      message: "Uploaded to Facebook Page successfully.",
    });
  } catch (err) {
    logger.error({ err, episodeId: id }, "Facebook upload failed");
    res.status(502).json({
      error: err instanceof Error ? err.message : "Facebook upload failed",
    });
  }
});

export default router;
