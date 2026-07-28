import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { logger } from "./logger";

// ---------------------------------------------------------------------------
// Description builder — locked to canonical BioMinute template
// ---------------------------------------------------------------------------
export interface BuildDescriptionParams {
  voScript: string;
  citationCta: string;
  hashtags: string;
  season: string;
}

/**
 * Builds a YouTube description in the exact canonical BioMinute format:
 *
 *   {hook — first 1–2 sentences of the VO script}
 *
 *   Backed by: {citation}
 *
 *   🔔 Subscribe to BioMinute for daily evidence-based health tips.
 *   📌 Playlist: {season name}
 *
 *   {hashtags}
 *
 * The function is intentionally defensive: it strips the old "CITATION:" and
 * "CTA:" labels that leaked into live descriptions, drops stray blank lines,
 * and always follows the same order regardless of what the source spreadsheet
 * contains.
 */
export function buildYouTubeDescription(params: BuildDescriptionParams): string {
  const { voScript, citationCta, hashtags, season } = params;

  // Hook: first 1–2 sentences of the VO script, capped at 240 chars to stay punchy.
  const sentences = (voScript ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  let hook = sentences.slice(0, 2).join(" ").trim();
  if (hook.length > 240) {
    hook = hook.slice(0, 240).replace(/\s+\S*$/, "").trim() + ".";
  }
  if (!hook) hook = "";

  // Citation: extract the real citation from the citation/CTA block, strip old labels.
  const cleanedBlock = (citationCta ?? "")
    .replace(/^CITATION:\s*/i, "")
    .replace(/\bCTA:\s*/gi, "")
    .replace(/HASHTAGS:.*$/s, "")
    .replace(/\r?\n+/g, "\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  // Find the line that looks like a citation (starts with a name/date or DOI/PMID).
  const citationLine = cleanedBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .find((l) => /^[A-Z][a-z]+\s+\w+.*\(\d{4}\)|^doi:|^pmid:|^https?:\/\//i.test(l));

  const citation = citationLine ?? cleanedBlock;

  // Playlist display name — use the full season label if it has a colon, otherwise just the season.
  const playlistName = (season ?? "").includes(":") ? season : `${season}: ${seasonName(season)}`;

  const parts = [
    hook,
    "",
    citation ? `Backed by: ${citation}` : "",
    "",
    "🔔 Subscribe to BioMinute for daily evidence-based health tips.",
    `📌 Playlist: ${playlistName}`,
    "",
    (hashtags ?? "").trim(),
  ];

  return parts
    .filter((p) => p !== "")
    .join("\n")
    .trim();
}

/** Returns a friendly season name for the playlist line when only a short code is given. */
function seasonName(season: string): string {
  const map: Record<string, string> = {
    S1: "Morning Habits",
    S2: "Movement & Body",
    S3: "Sleep & Recovery",
    S4: "Stress & Mind",
    S5: "Nutrition & Myths",
    S6: "Healthy Aging & Longevity",
  };
  const code = (season ?? "").split(":")[0].trim().toUpperCase();
  return map[code] ?? season;
}

// ---------------------------------------------------------------------------
// Upload guard — prevent duplicate YouTube uploads
// ---------------------------------------------------------------------------
export interface EpisodeGuard {
  id: number;
  epNumber: number;
  youtubeVideoId?: string | null;
  status?: string | null;
}

/**
 * Throws if the episode already has a YouTube video ID. Call before every
 * videos.insert paths (manual CLI and dashboard publish) to prevent
 * duplicate uploads from race conditions or double-clicks.
 */
export function assertNotAlreadyPublished(episode: EpisodeGuard): void {
  if (episode.youtubeVideoId) {
    throw new Error(
      `Episode ${episode.epNumber} is already on YouTube (${episode.youtubeVideoId}). ` +
        `Delete the existing video first if you want to re-upload.`,
    );
  }
}

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
 *
 * TEST_MODE: set TEST_MODE=true in env to skip the real upload and return a
 * fake video ID. Use for all TEST-* episodes so tests never touch the live
 * channel.
 */
export async function uploadEpisodeVideo(
  params: UploadEpisodeVideoParams,
): Promise<UploadEpisodeVideoResult> {
  if (process.env.TEST_MODE === "true") {
    const fakeId = `TEST_${Date.now()}`;
    logger.info({ title: params.title }, `TEST_MODE: would upload: ${params.title}`);
    return { youtubeVideoId: fakeId, youtubeUrl: `https://youtu.be/${fakeId}` };
  }

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
 *
 * TEST_MODE: skips the real API call and returns null.
 */
export async function addVideoToPlaylist(
  params: AddToPlaylistParams,
): Promise<AddToPlaylistResult | null> {
  if (process.env.TEST_MODE === "true") {
    logger.info(
      { youtubeVideoId: params.youtubeVideoId, season: params.season },
      "TEST_MODE: would add video to playlist",
    );
    return null;
  }

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

// ---------------------------------------------------------------------------
// Token health check — used by GET /youtube/status
// ---------------------------------------------------------------------------

/**
 * Returns true if the error message indicates an invalid / revoked refresh token.
 * Call this in catch blocks around any googleapis call to detect token expiry.
 */
export function isInvalidGrantError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("invalid_grant") ||
    msg.includes("token has been expired") ||
    msg.includes("token_revoked") ||
    msg.includes("invalid credentials")
  );
}

/**
 * Probes the YouTube API with a minimal channels.list call to verify the
 * refresh token is still valid. Returns:
 *   "valid"   — token works
 *   "expired" — token is revoked / expired (invalid_grant)
 *   "error"   — some other API / network error (don't surface as expired)
 */
export async function checkYouTubeTokenHealth(): Promise<"valid" | "expired" | "error"> {
  try {
    const auth = getOAuth2Client();
    const yt = google.youtube({ version: "v3", auth });
    await yt.channels.list({ part: ["id"], mine: true, maxResults: 1 });
    return "valid";
  } catch (err) {
    if (isInvalidGrantError(err)) return "expired";
    return "error";
  }
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
