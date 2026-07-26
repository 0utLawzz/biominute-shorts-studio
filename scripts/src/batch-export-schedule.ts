/**
 * batch-export-schedule.ts
 *
 * For each episode number provided as arguments:
 *   1. Copies archived ep{N}_Scene{0-4}.tsx → active Scene{0-4}.tsx
 *   2. Updates config.ts with the episode's SCENE_DURATIONS
 *   3. Waits for Vite HMR to reload
 *   4. Exports the animation to MP4 → exports/Episode-NN-slug/episode.mp4
 *   5. Uploads to YouTube as private with publishAt = DB scheduledPublishAt
 *   6. Updates DB with youtubeVideoId and status='scheduled'
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/batch-export-schedule.ts 43 44 45
 *
 * Set TEST_MODE=true to skip the real YouTube upload.
 * Set SKIP_EXPORT=true to skip rendering (use existing MP4 if present).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { google } from 'googleapis';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { episodesTable } from '@workspace/db';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const TEST_MODE = process.env.TEST_MODE === 'true';
const SKIP_EXPORT = process.env.SKIP_EXPORT === 'true';

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..');
const REELS_SRC = path.join(WORKSPACE_ROOT, 'artifacts/biominute-reels/src/components/video/video_scenes');
const CONFIG_PATH = path.join(WORKSPACE_ROOT, 'artifacts/biominute-reels/src/lib/video/config.ts');
const EXPORTS_DIR = path.join(WORKSPACE_ROOT, 'exports');
const REELS_URL = process.env.BIOMINUTE_EXPORT_URL ?? 'http://localhost:25078/biominute-reels/';
const EXPORT_SCRIPT = path.join(WORKSPACE_ROOT, 'scripts/src/export-video.ts');

// Standard scene durations for newer episodes without a custom override.
const DEFAULT_SCENE_DURATIONS = { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 };

// Standard scene durations (matching eps 37-42)
const SCENE_DURATIONS: Record<number, Record<number, number>> = {
  43: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  44: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  45: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  46: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  47: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  48: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  49: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  50: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  51: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  52: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  53: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  54: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  55: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
};

// Episode slugs for export folder naming
const EP_SLUGS: Record<number, string> = {
  43: 'meditation-for-anxiety',
  44: 'electrolytes-vs-water',
  45: 'sunscreen-and-vitamin-d',
  46: 'fasted-cardio-and-fat-loss',
  47: 'posture-and-back-pain',
  48: 'magnesium-and-sleep',
  49: 'hiit-vs-steady-cardio',
  50: 'night-mode-and-sleep',
  51: 'hair-washing-and-baldness',
  52: 'seed-oils-and-inflammation',
  53: 'raw-milk-vs-pasteurized',
  54: 'animal-vs-plant-protein',
  55: 'fluoride-in-water',
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('-')
    .replace(/^-|-$/g, '') || 'episode';
}

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------
const REQUIRED = TEST_MODE
  ? ['DATABASE_URL']
  : ['DATABASE_URL', 'YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_REFRESH_TOKEN'];

const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
  console.error('\n🚫  Missing required env vars:\n' + missing.map(k => `   • ${k}`).join('\n'));
  process.exit(1);
}

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ---------------------------------------------------------------------------
// YouTube helpers
// ---------------------------------------------------------------------------
function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  return client;
}

function buildYouTubeDescription(params: {
  voScript: string; citationCta: string; hashtags: string; season: string;
}): string {
  const { voScript, citationCta, hashtags, season } = params;
  const sentences = (voScript ?? '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  let hook = sentences.slice(0, 2).join(' ').trim();
  if (hook.length > 240) hook = hook.slice(0, 240).replace(/\s+\S*$/, '').trim() + '.';

  const cleanedBlock = (citationCta ?? '')
    .replace(/^CITATION:\s*/i, '').replace(/\bCTA:\s*/gi, '')
    .replace(/HASHTAGS:.*$/s, '').replace(/\r?\n+/g, '\n').replace(/\n\s*\n/g, '\n').trim();
  const citationLine = cleanedBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    .find(l => /^[A-Z][a-z]+\s+\w+.*\(\d{4}\)|^doi:|^pmid:|^https?:\/\//i.test(l));
  const citation = citationLine ?? cleanedBlock;

  const playlistName = season.includes(':') ? season : season;
  return [hook, '', citation ? `Backed by: ${citation}` : '',
    '', '🔔 Subscribe to BioMinute for daily evidence-based health tips.',
    `📌 Playlist: ${playlistName}`, '', (hashtags ?? '').trim()]
    .filter(p => p !== '').join('\n').trim();
}

function seasonEnvKey(season: string): string {
  return `YOUTUBE_PLAYLIST_${season.split(':')[0].trim().toUpperCase()}`;
}

// ---------------------------------------------------------------------------
// Step 1: Swap active scene files
// ---------------------------------------------------------------------------
function swapScenes(epNumber: number): void {
  console.log(`  📁 Swapping scene files for EP${epNumber}...`);
  for (let i = 0; i <= 4; i++) {
    const archived = path.join(REELS_SRC, `ep${epNumber}_Scene${i}.tsx`);
    const active = path.join(REELS_SRC, `Scene${i}.tsx`);
    if (!fs.existsSync(archived)) {
      throw new Error(`Missing archived scene: ep${epNumber}_Scene${i}.tsx`);
    }
    fs.copyFileSync(archived, active);
  }
  // Scene5 (thumbnail slide) stays as-is
  console.log(`  ✓ Scenes 0-4 swapped`);
}

// ---------------------------------------------------------------------------
// Step 2: Update config.ts
// ---------------------------------------------------------------------------
function updateConfig(epNumber: number, durations: Record<number, number>, title: string): void {
  console.log(`  ⚙️  Updating config.ts for EP${epNumber}...`);
  const durationLines = Object.entries(durations)
    .map(([k, v]) => `  ${k}: ${v}, // Scene ${k}`)
    .join('\n');

  const content = `// BioMinute Reels: hard-coded 9:16 vertical format.
// 1080×1920 is the only supported export resolution. All scenes, components,
// and export tooling must use these constants.

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_ASPECT_RATIO = VIDEO_WIDTH / VIDEO_HEIGHT; // 9:16 ≈ 0.5625

export const SAFE_ZONE_PADDING = 0.08; // 8% minimum margin on all sides
export const SAFE_ZONE_PX = VIDEO_WIDTH * SAFE_ZONE_PADDING; // 86.4px
export const BOTTOM_SAFE_ZONE_RATIO = 0.30; // 30% bottom reserved for YouTube UI
export const BOTTOM_SAFE_ZONE_PX = VIDEO_HEIGHT * BOTTOM_SAFE_ZONE_RATIO; // 576px

// Canvas style used by the root wrapper: the video is always rendered at
// exactly 1080×1920 CSS pixels and then scaled to fit the browser viewport.
export const CANVAS_STYLE = {
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
} as const;

// Scene durations for the current episode. The video player uses these to
// advance scenes automatically. Keep the total loop duration in sync with
// the exported MP4 length so the record/export control captures the full video.
// EP ${epNumber} — "${title}"
export const SCENE_DURATIONS = {
${durationLines}
} as const;
`;
  fs.writeFileSync(CONFIG_PATH, content);
  console.log(`  ✓ config.ts updated`);
}

// ---------------------------------------------------------------------------
// Step 3: Export video
// ---------------------------------------------------------------------------
function exportVideo(epNumber: number, outputPath: string): void {
  if (SKIP_EXPORT && fs.existsSync(outputPath)) {
    console.log(`  ⏭  SKIP_EXPORT=true and MP4 exists — skipping render`);
    return;
  }

  console.log(`  🎬 Waiting 6s for Vite HMR to reload...`);
  execSync('sleep 6');

  const exportDir = path.dirname(outputPath);
  fs.mkdirSync(exportDir, { recursive: true });

  console.log(`  🎬 Rendering EP${epNumber} → ${outputPath}`);
  const result = spawnSync(
    'pnpm', ['exec', 'tsx', EXPORT_SCRIPT, outputPath],
    {
      cwd: path.join(WORKSPACE_ROOT, 'scripts'),
      env: { ...process.env, BIOMINUTE_EXPORT_URL: REELS_URL },
      stdio: 'inherit',
      timeout: 300_000, // 5 min
    }
  );
  if (result.status !== 0) {
    throw new Error(`Export failed for EP${epNumber} (exit ${result.status})`);
  }
  console.log(`  ✓ MP4 exported: ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Step 4: Upload to YouTube as private + scheduled
// ---------------------------------------------------------------------------
async function uploadToYouTube(params: {
  epNumber: number;
  videoPath: string;
  title: string;
  description: string;
  tags: string[];
  season: string;
  publishAt: string;
}): Promise<string> {
  if (TEST_MODE) {
    const fakeId = `TEST_EP${params.epNumber}_${Date.now()}`;
    console.log(`  [TEST_MODE] Would upload: "${params.title}"`);
    console.log(`  [TEST_MODE] publishAt: ${params.publishAt}`);
    return fakeId;
  }

  const youtube = google.youtube({ version: 'v3', auth: getOAuth2Client() });

  console.log(`  📤 Uploading to YouTube (private, scheduled ${params.publishAt})...`);
  const uploadRes = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: params.title,
        description: params.description,
        tags: params.tags,
      },
      status: {
        privacyStatus: 'private',
        publishAt: new Date(params.publishAt).toISOString(),
        selfDeclaredMadeForKids: false,
      },
    },
    media: { body: fs.createReadStream(params.videoPath) },
  });

  const youtubeVideoId = uploadRes.data.id;
  if (!youtubeVideoId) throw new Error('Upload succeeded but no video ID returned');
  console.log(`  ✓ Uploaded: https://youtu.be/${youtubeVideoId}`);

  // Add to season playlist (non-fatal)
  const playlistId = process.env[seasonEnvKey(params.season)];
  if (playlistId) {
    try {
      await youtube.playlistItems.insert({
        part: ['snippet'],
        requestBody: { snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId: youtubeVideoId } } },
      });
      console.log(`  ✓ Added to playlist ${playlistId}`);
    } catch (e) {
      console.warn(`  ⚠️  Playlist insert failed (non-fatal): ${(e as Error).message}`);
    }
  } else {
    console.warn(`  ⚠️  No playlist env var for season "${params.season}"`);
  }

  return youtubeVideoId;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function processEpisode(epNumber: number): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  EP${epNumber}${TEST_MODE ? ' [TEST_MODE]' : ''}`);
  console.log(`${'='.repeat(60)}`);

  // Fetch episode from DB
  const rows = await db.select().from(episodesTable).where(eq(episodesTable.epNumber, epNumber));
  if (!rows.length) throw new Error(`Episode ${epNumber} not found in DB`);
  const ep = rows[0];

  if (ep.youtubeVideoId) {
    console.log(`  ⏭  Already on YouTube (${ep.youtubeVideoId}) — skipping`);
    return;
  }

  const durations = SCENE_DURATIONS[epNumber] ?? DEFAULT_SCENE_DURATIONS;
  const slug = EP_SLUGS[epNumber] ?? slugify(ep.hookTitle);

  const padded = String(epNumber).padStart(2, '0');
  const exportFolder = path.join(EXPORTS_DIR, `Episode-${padded}-${slug}`);
  const mp4Path = path.join(exportFolder, 'episode.mp4');

  // Swap scenes and update config
  swapScenes(epNumber);
  updateConfig(epNumber, durations, ep.hookTitle);

  // Export video
  exportVideo(epNumber, mp4Path);

  // Build YouTube metadata
  const tags = (ep.hashtags ?? '').split(/[\s,]+/).map((t: string) => t.replace(/^#/, '')).filter(Boolean);
  const description = buildYouTubeDescription({
    voScript: ep.voScript,
    citationCta: ep.citationCta,
    hashtags: ep.hashtags,
    season: ep.season,
  });

  if (!ep.scheduledPublishAt) throw new Error(`EP${epNumber} has no scheduledPublishAt in DB`);
  const publishAt = ep.scheduledPublishAt instanceof Date
    ? ep.scheduledPublishAt.toISOString()
    : String(ep.scheduledPublishAt);

  // Upload to YouTube
  const youtubeVideoId = await uploadToYouTube({
    epNumber,
    videoPath: mp4Path,
    title: ep.youtubeTitle,
    description,
    tags,
    season: ep.season,
    publishAt,
  });

  // Update DB
  if (!TEST_MODE) {
    await db.update(episodesTable).set({
      youtubeVideoId,
      status: 'scheduled',
      updatedAt: new Date(),
    }).where(eq(episodesTable.epNumber, epNumber));
    console.log(`  ✓ DB updated with youtubeVideoId=${youtubeVideoId}`);
  } else {
    console.log(`  [TEST_MODE] DB NOT updated (would set youtubeVideoId=${youtubeVideoId})`);
  }

  const totalDurationMs = Object.values(durations).reduce((a, b) => a + b, 0);
  const totalDurationS = (totalDurationMs / 1000).toFixed(1);
  console.log(`\n  ✅ EP${epNumber} complete — ${totalDurationS}s — https://youtu.be/${youtubeVideoId}`);
  console.log(`     Scheduled to publish at: ${publishAt}`);
}

(async () => {
  const epArgs = process.argv.slice(2).map(Number).filter(n => n > 0);
  if (!epArgs.length) {
    console.error('Usage: tsx ./src/batch-export-schedule.ts <ep_number> [ep_number ...]');
    process.exit(1);
  }

  console.log(`\n🚀 BioMinute batch export+schedule`);
  console.log(`   Episodes: ${epArgs.join(', ')}`);
  console.log(`   TEST_MODE: ${TEST_MODE}`);
  console.log(`   SKIP_EXPORT: ${SKIP_EXPORT}`);
  console.log(`   Reels URL: ${REELS_URL}\n`);

  for (const n of epArgs) {
    await processEpisode(n);
  }

  await pool.end();
  console.log('\n🎉 All done!\n');
})().catch(e => { console.error(e); process.exit(1); });
