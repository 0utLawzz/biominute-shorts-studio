/**
 * Immediately upload one or more episodes to YouTube.
 * Usage:  tsx scripts/src/upload-now.ts 4
 *         tsx scripts/src/upload-now.ts 4 5 6
 *
 * Uses DATABASE_URL (Neon) and all YOUTUBE_* secrets from env.
 *
 * Set TEST_MODE=true to do a dry-run: logs what would be uploaded without
 * touching the YouTube API or updating the database.
 */
import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

// ---------------------------------------------------------------------------
// Env validation — fail loudly before doing anything if required vars are absent
// ---------------------------------------------------------------------------
const TEST_MODE = process.env.TEST_MODE === "true";

const REQUIRED_VARS = TEST_MODE
  ? ["DATABASE_URL"] // YouTube creds not needed in test mode
  : [
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
    ];

const missingVars = REQUIRED_VARS.filter((k) => !process.env[k]);
if (missingVars.length > 0) {
  console.error(
    "\n🚫  upload-now aborted — missing required environment variables:\n" +
      missingVars.map((k) => `   • ${k}`).join("\n") +
      "\n\nAdd these to Replit Secrets before running.\n",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ---------------------------------------------------------------------------
// Shared helpers (duplicated here so the script is self-contained)
// ---------------------------------------------------------------------------
interface BuildDescriptionParams {
  voScript: string;
  citationCta: string;
  hashtags: string;
  season: string;
}

function buildYouTubeDescription(params: BuildDescriptionParams): string {
  const { voScript, citationCta, hashtags, season } = params;

  const sentences = (voScript ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  let hook = sentences.slice(0, 2).join(" ").trim();
  if (hook.length > 240) {
    hook = hook.slice(0, 240).replace(/\s+\S*$/, "").trim() + ".";
  }

  const cleanedBlock = (citationCta ?? "")
    .replace(/^CITATION:\s*/i, "")
    .replace(/\bCTA:\s*/gi, "")
    .replace(/HASHTAGS:.*$/s, "")
    .replace(/\r?\n+/g, "\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  const citationLine = cleanedBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .find((l) => /^[A-Z][a-z]+\s+\w+.*\(\d{4}\)|^doi:|^pmid:|^https?:\/\//i.test(l));

  const citation = citationLine ?? cleanedBlock;

  const seasonMap: Record<string, string> = {
    S1: "Morning Habits",
    S2: "Movement & Body",
    S3: "Sleep & Recovery",
    S4: "Stress & Mind",
    S5: "Nutrition & Myths",
    S6: "Healthy Aging & Longevity",
  };
  const seasonCode = (season ?? "").split(":")[0].trim().toUpperCase();
  const playlistName = (season ?? "").includes(":")
    ? season
    : `${season}: ${seasonMap[seasonCode] ?? season}`;

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

interface EpisodeGuard {
  epNumber: number;
  youtubeVideoId?: string | null;
}

function assertNotAlreadyPublished(episode: EpisodeGuard): void {
  if (episode.youtubeVideoId) {
    throw new Error(
      `Episode ${episode.epNumber} is already on YouTube (${episode.youtubeVideoId}). ` +
        `Delete the existing video first if you want to re-upload.`,
    );
  }
}

function seasonEnvKey(season: string): string {
  return `YOUTUBE_PLAYLIST_${season.split(":")[0].trim().toUpperCase()}`;
}

function getOAuth2Client() {
  const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN } = process.env;
  if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error("Missing YOUTUBE_* credentials in env.");
  }
  const client = new google.auth.OAuth2(YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET);
  client.setCredentials({ refresh_token: YOUTUBE_REFRESH_TOKEN });
  return client;
}

// ---------------------------------------------------------------------------
// Locate exported MP4
// ---------------------------------------------------------------------------
function findVideoPath(epNumber: number): string {
  // Anchor from this file's location so the path is correct regardless of
  // which directory the script is invoked from.
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const exportsDir = path.resolve(scriptDir, "../../exports");
  const padded = String(epNumber).padStart(2, "0");
  const entries = fs.existsSync(exportsDir) ? fs.readdirSync(exportsDir) : [];
  const matches = entries.filter((n) => n.startsWith(`Episode-${padded}-`));
  if (!matches.length) throw new Error(`No export folder for episode ${epNumber}`);
  // If multiple folders match, prefer the one whose episode.mp4 is largest
  // (the real export) over stale placeholder or old build folders.
  const scored = matches.map((n) => {
    const p = path.join(exportsDir, n, "episode.mp4");
    const size = fs.existsSync(p) ? fs.statSync(p).size : 0;
    return { n, p, size };
  }).sort((a, b) => b.size - a.size);
  const best = scored[0];
  if (!best.size) throw new Error(`episode.mp4 missing or empty for episode ${epNumber}`);
  return best.p;
}

// ---------------------------------------------------------------------------
// Upload a single episode
// ---------------------------------------------------------------------------
async function uploadEp(epNumber: number) {
  console.log(`\n=== ${TEST_MODE ? "[TEST_MODE] " : ""}Uploading Episode ${epNumber} ===`);

  const rows = await db.select().from(episodesTable).where(eq(episodesTable.epNumber, epNumber));
  if (!rows.length) throw new Error(`Episode ${epNumber} not found in DB.`);
  const ep = rows[0];

  assertNotAlreadyPublished(ep);

  const description = buildYouTubeDescription({
    voScript: ep.voScript,
    citationCta: ep.citationCta,
    hashtags: ep.hashtags,
    season: ep.season,
  });

  // ------------------------------------------------------------------
  // TEST_MODE: log what would happen and stop — never touch YouTube or
  // update the database with a fake video ID.
  // ------------------------------------------------------------------
  if (TEST_MODE) {
    console.log(`  [TEST_MODE] would upload: "${ep.youtubeTitle}"`);
    console.log(`  [TEST_MODE] season: ${ep.season}, playlist env: ${seasonEnvKey(ep.season ?? "")}`);
    console.log(`  [TEST_MODE] description preview:\n${description.slice(0, 200)}...`);
    console.log(`  [TEST_MODE] No YouTube API call made. DB unchanged.`);
    return;
  }

  const videoPath = findVideoPath(epNumber);
  console.log(`  Video: ${videoPath}`);

  const tags = (ep.hashtags ?? "")
    .split(/[\s,]+/)
    .map((t: string) => t.replace(/^#/, ""))
    .filter(Boolean);

  const youtube = google.youtube({ version: "v3", auth: getOAuth2Client() });

  console.log(`  Uploading: "${ep.youtubeTitle}" ...`);
  const uploadRes = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: ep.youtubeTitle,
        description,
        tags,
      },
      status: { privacyStatus: "public", selfDeclaredMadeForKids: false },
    },
    media: { body: fs.createReadStream(videoPath) },
  });

  const youtubeVideoId = uploadRes.data.id;
  if (!youtubeVideoId) throw new Error("Upload succeeded but no video ID returned.");
  const youtubeUrl = `https://youtu.be/${youtubeVideoId}`;
  console.log(`  ✓ Uploaded: ${youtubeUrl}`);

  const playlistId = process.env[seasonEnvKey(ep.season ?? "")];
  if (playlistId) {
    try {
      await youtube.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId,
            resourceId: { kind: "youtube#video", videoId: youtubeVideoId },
          },
        },
      });
      console.log(`  ✓ Added to playlist ${playlistId}`);
    } catch (e) {
      console.warn(`  ⚠️  Playlist insert failed (non-fatal):`, (e as Error).message);
    }
  } else {
    console.warn(`  ⚠️  No playlist env var for season "${ep.season}"`);
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

  console.log(`  ✓ DB updated — Episode ${epNumber} published.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const epArgs = process.argv.slice(2).map(Number).filter((n) => n > 0);
if (!epArgs.length) {
  console.error("Usage: tsx scripts/src/upload-now.ts <ep_number> [ep_number ...]");
  process.exit(1);
}

(async () => {
  for (const n of epArgs) {
    await uploadEp(n);
  }
  await pool.end();
  console.log("\nDone.");
})().catch((e) => { console.error(e); process.exit(1); });
