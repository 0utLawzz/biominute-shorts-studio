import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { logger } from "./logger";

// ---------------------------------------------------------------------------
// Season → playlist env-var mapping
// Seasons are stored as either short codes ("S1") or full labels
// ("S1: Morning Habits"). getPlaylistId normalizes both formats by extracting
// the short code prefix before the colon, so "S1: Morning Habits" and "S1"
// both resolve to YOUTUBE_PLAYLIST_S1.
// Set YOUTUBE_PLAYLIST_S1 … YOUTUBE_PLAYLIST_S6 in Replit Secrets.
// ---------------------------------------------------------------------------

/** Derives the env-var name for a season regardless of format. */
export function seasonEnvKey(season: string): string {
  // "S1: Morning Habits" → "S1" | "S1" → "S1"
  const shortCode = season.split(":")[0].trim().toUpperCase();
  return `YOUTUBE_PLAYLIST_${shortCode}`;
}

/** Returns the YouTube playlist ID for a season, or null if not configured. */
export function getPlaylistId(season: string): string | null {
  return process.env[seasonEnvKey(season)] ?? null;
}

// Kept for external consumers that reference this map by name.
// Keys cover both short-code and full-label formats.
export const SEASON_PLAYLIST_ENV: Record<string, string> = {
  S1:                              "YOUTUBE_PLAYLIST_S1",
  S2:                              "YOUTUBE_PLAYLIST_S2",
  S3:                              "YOUTUBE_PLAYLIST_S3",
  S4:                              "YOUTUBE_PLAYLIST_S4",
  S5:                              "YOUTUBE_PLAYLIST_S5",
  S6:                              "YOUTUBE_PLAYLIST_S6",
  "S1: Morning Habits":            "YOUTUBE_PLAYLIST_S1",
  "S2: Movement & Body":           "YOUTUBE_PLAYLIST_S2",
  "S3: Sleep & Recovery":          "YOUTUBE_PLAYLIST_S3",
  "S4: Stress & Mind":             "YOUTUBE_PLAYLIST_S4",
  "S5: Nutrition & Myths":         "YOUTUBE_PLAYLIST_S5",
  "S6: Healthy Aging & Longevity": "YOUTUBE_PLAYLIST_S6",
};

// ---------------------------------------------------------------------------
// Shared OAuth2 client factory
// ---------------------------------------------------------------------------
function getOAuth2Client() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "YouTube credentials are not configured " +
        "(YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN).",
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// ---------------------------------------------------------------------------
// findEpisodeVideoPath
// ---------------------------------------------------------------------------
/**
 * Locates the exported MP4 for a given episode number.
 * Export folders follow `exports/Episode-{NN}-{slug}/episode.mp4`, but the
 * exact slug casing/wording varies per episode, so we glob for the numbered
 * folder instead of reconstructing the slug from the title.
 */
export function findEpisodeVideoPath(epNumber: number): string {
  // process.cwd() = artifacts/api-server/ at runtime → 2 levels up = workspace root
  const workspaceRoot = path.resolve(process.cwd(), "../..");
  const exportsDir = path.join(workspaceRoot, "exports");
  const padded = String(epNumber).padStart(2, "0");

  const entries = fs.existsSync(exportsDir) ? fs.readdirSync(exportsDir) : [];
  const match = entries.find((name) => name.startsWith(`Episode-${padded}-`));

  if (!match) {
    throw new Error(
      `No export folder found for episode ${epNumber} (expected exports/Episode-${padded}-*)`,
    );
  }

  const videoPath = path.join(exportsDir, match, "episode.mp4");
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Export folder found but episode.mp4 is missing: ${videoPath}`);
  }

  return videoPath;
}

// ---------------------------------------------------------------------------
// uploadEpisodeVideo
// ---------------------------------------------------------------------------
export interface UploadEpisodeVideoParams {
  videoPath: string;
  title: string;
  description: string;
  tags?: string[];
  /** If set, video is uploaded as 'private' and YouTube publishes it at this time. */
  publishAt?: string | null;
  /** Ignored when publishAt is set (YouTube requires private for scheduled uploads). */
  privacyStatus: "public" | "unlisted" | "private";
}

export interface UploadEpisodeVideoResult {
  youtubeVideoId: string;
  youtubeUrl: string;
}

/**
 * Uploads an episode's MP4 to YouTube via the Data API v3 resumable upload.
 *
 * Privacy rules:
 * - If `publishAt` is provided → always uploads as `private` with `publishAt`
 *   set; YouTube automatically flips it to public/unlisted at that timestamp.
 * - Otherwise → uses `privacyStatus` as-is.
 */
export async function uploadEpisodeVideo(
  params: UploadEpisodeVideoParams,
): Promise<UploadEpisodeVideoResult> {
  const youtube = google.youtube({ version: "v3", auth: getOAuth2Client() });

  const usesSchedule = !!params.publishAt;
  const status = usesSchedule
    ? {
        privacyStatus: "private" as const,
        publishAt: new Date(params.publishAt as string).toISOString(),
        selfDeclaredMadeForKids: false,
      }
    : {
        privacyStatus: params.privacyStatus,
        selfDeclaredMadeForKids: false,
      };

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: params.title,
        description: params.description,
        tags: params.tags,
      },
      status,
    },
    media: {
      body: fs.createReadStream(params.videoPath),
    },
  });

  const youtubeVideoId = response.data.id;
  if (!youtubeVideoId) {
    throw new Error("YouTube upload succeeded but returned no video id.");
  }

  return {
    youtubeVideoId,
    youtubeUrl: `https://youtu.be/${youtubeVideoId}`,
  };
}

// ---------------------------------------------------------------------------
// addVideoToPlaylist
// ---------------------------------------------------------------------------
export interface AddToPlaylistParams {
  youtubeVideoId: string;
  season: string;
}

export interface AddToPlaylistResult {
  playlistId: string;
  playlistItemId: string;
}

/**
 * Adds a video to the season playlist configured in env vars.
 * Returns null (with a warning log) if the playlist ID is not configured for
 * this season — this is non-fatal so a missing env var never blocks publishing.
 */
export async function addVideoToPlaylist(
  params: AddToPlaylistParams,
): Promise<AddToPlaylistResult | null> {
  const playlistId = getPlaylistId(params.season);
  if (!playlistId) {
    logger.warn(
      {
        season: params.season,
        envVar: seasonEnvKey(params.season),
      },
      "No playlist ID configured for season — skipping playlist insert",
    );
    return null;
  }

  const youtube = google.youtube({ version: "v3", auth: getOAuth2Client() });

  const response = await youtube.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId: params.youtubeVideoId,
        },
      },
    },
  });

  const playlistItemId = response.data.id;
  if (!playlistItemId) {
    throw new Error("playlistItems.insert succeeded but returned no item id.");
  }

  logger.info(
    { youtubeVideoId: params.youtubeVideoId, playlistId, playlistItemId },
    "Video added to season playlist",
  );

  return { playlistId, playlistItemId };
}

// ---------------------------------------------------------------------------
// repairVideoOnYouTube — retroactively fix privacy + playlist for an existing video
// ---------------------------------------------------------------------------
export interface RepairVideoParams {
  youtubeVideoId: string;
  season: string;
  privacyStatus: "public" | "unlisted" | "private";
  /** If set, overrides privacyStatus to 'private' and schedules auto-publish. */
  publishAt?: string | null;
}

export interface RepairVideoResult {
  privacyUpdated: boolean;
  playlistResult: AddToPlaylistResult | null;
  playlistWarning: string | null;
}

/**
 * Retroactively sets privacy status and adds an existing YouTube video to the
 * correct season playlist. Used to fix videos uploaded outside the pipeline.
 */
export async function repairVideoOnYouTube(
  params: RepairVideoParams,
): Promise<RepairVideoResult> {
  const youtube = google.youtube({ version: "v3", auth: getOAuth2Client() });

  // Update privacy (and optional scheduled publish time)
  const usesSchedule = !!params.publishAt;
  const status = usesSchedule
    ? {
        privacyStatus: "private" as const,
        publishAt: new Date(params.publishAt as string).toISOString(),
        selfDeclaredMadeForKids: false,
      }
    : {
        privacyStatus: params.privacyStatus,
        selfDeclaredMadeForKids: false,
      };

  await youtube.videos.update({
    part: ["status"],
    requestBody: {
      id: params.youtubeVideoId,
      status,
    },
  });

  logger.info(
    { youtubeVideoId: params.youtubeVideoId, status },
    "Repair: video privacy updated",
  );

  // Add to playlist (non-fatal)
  let playlistResult: AddToPlaylistResult | null = null;
  let playlistWarning: string | null = null;
  try {
    playlistResult = await addVideoToPlaylist({
      youtubeVideoId: params.youtubeVideoId,
      season: params.season,
    });
    if (!playlistResult) {
      const envVar = SEASON_PLAYLIST_ENV[params.season] ?? "YOUTUBE_PLAYLIST_S?";
      playlistWarning = `No playlist ID configured for season "${params.season}". Set ${envVar} in Replit Secrets to enable playlist assignment.`;
    }
  } catch (err) {
    playlistWarning =
      err instanceof Error
        ? `Playlist insert failed: ${err.message}`
        : "Playlist insert failed (unknown error)";
    logger.warn(
      { err, youtubeVideoId: params.youtubeVideoId },
      "Repair: playlist insert failed (non-fatal)",
    );
  }

  return { privacyUpdated: true, playlistResult, playlistWarning };
}
