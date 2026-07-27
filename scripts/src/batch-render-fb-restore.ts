/**
 * batch-render-fb-restore.ts
 *
 * Re-renders selected Ep 1-50 MP4s needed to refresh Facebook posts.
 * Differs from batch-export-schedule.ts:
 *   - does NOT upload to YouTube (videos are already published there)
 *   - does NOT bail when YouTube videoId is c/baoadoad
 *   - supports an expanded SCENE_DURATIONS map (Ep 25-30, 36-50)
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/batch-render-fb-restore.ts 25 26 27
 */

import fs from "node:fs";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

const WORKSPACE_ROOT = path.resolve(process.cwd(), "..");
const REELS_SRC = path.join(WORKSPACE_ROOT, "artifacts/biominute-reels/src/components/video/video_scenes");
const CONFIG_PATH = path.join(WORKSPACE_ROOT, "artifacts/biominute-reels/src/lib/video/config.ts");
const EXPORTS_DIR = path.join(WORKSPACE_ROOT, "exports");
const REELS_URL = process.env.BIOMINUTE_EXPORT_URL ?? "http://localhost:25078/biominute-reels/";
const EXPORT_SCRIPT = path.join(WORKSPACE_ROOT, "scripts/src/export-video.ts");

const DEFAULT_SCENE_DURATIONS = { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 };

// Per-episode scene durations. Source: exports/production-log.md
// Ep 25-30 used 4500/7000/6500/6000/6500/5000 (six scenes).
// Ep 36-50 used 4500/6500/7000/6000/6500/5000 (six scenes).
const SCENE_DURATIONS: Record<number, Record<number, number>> = {
  25: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  26: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  27: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  28: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  29: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  30: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  36: { 0: 4500, 1: 7000, 2: 6500, 3: 6000, 4: 6500, 5: 5000 },
  37: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  38: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  39: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  40: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  41: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  43: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  44: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  45: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  46: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  47: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  48: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  49: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
  50: { 0: 4500, 1: 6500, 2: 7000, 3: 6000, 4: 6500, 5: 5000 },
};

function slugify(title: string | null | undefined): string {
  if (!title) return "episode";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join("-")
    .replace(/^-|-$/g, "") || "episode";
}

// Env validation
const missing = ["DATABASE_URL"].filter(k => !process.env[k]);
if (missing.length) {
  console.error("\n🚫  Missing required env vars:\n" + missing.map(k => `   • ${k}`).join("\n"));
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function swapScenes(epNumber: number): void {
  for (let i = 0; i <= 4; i++) {
    const archived = path.join(REELS_SRC, `ep${epNumber}_Scene${i}.tsx`);
    const active = path.join(REELS_SRC, `Scene${i}.tsx`);
    if (!fs.existsSync(archived)) {
      throw new Error(`Missing archived scene: ep${epNumber}_Scene${i}.tsx`);
    }
    fs.copyFileSync(archived, active);
  }
}

function updateConfig(epNumber: number, durations: Record<number, number>, title: string): void {
  const durationLines = Object.entries(durations)
    .map(([k, v]) => `  ${k}: ${v}, // Scene ${k}`)
    .join("\n");

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
}

function exportVideo(epNumber: number, outputPath: string): void {
  const exportDir = path.dirname(outputPath);
  fs.mkdirSync(exportDir, { recursive: true });

  console.log(`  🎬 Rendering EP${epNumber} → ${outputPath}`);
  const result = spawnSync(
    "pnpm", ["exec", "tsx", EXPORT_SCRIPT, outputPath],
    {
      cwd: path.join(WORKSPACE_ROOT, "scripts"),
      env: { ...process.env, BIOMINUTE_EXPORT_URL: REELS_URL },
      stdio: "inherit",
      timeout: 300_000,
    }
  );
  if (result.status !== 0) {
    throw new Error(`Export failed for EP${epNumber} (exit ${result.status})`);
  }
  console.log(`  ✓ MP4 exported: ${outputPath}`);
}

async function processEpisode(epNumber: number): Promise<void> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  EP${epNumber}`);
  console.log(`${"=".repeat(60)}`);

  const rows = await db.select().from(episodesTable).where(eq(episodesTable.epNumber, epNumber));
  if (!rows.length) throw new Error(`Episode ${epNumber} not found in DB`);
  const ep = rows[0];

  const durations = SCENE_DURATIONS[epNumber] ?? DEFAULT_SCENE_DURATIONS;
  const slug = slugify(ep.hookTitle);

  const padded = String(epNumber).padStart(2, "0");
  const exportFolder = path.join(EXPORTS_DIR, `Episode-${padded}-${slug}`);
  const mp4Path = path.join(exportFolder, "episode.mp4");

  swapScenes(epNumber);
  updateConfig(epNumber, durations, ep.hookTitle ?? `Episode ${epNumber}`);

  console.log("  ⏳ Waiting 6s for Vite HMR to reload...");
  execSync("sleep 6");

  exportVideo(epNumber, mp4Path);

  const totalDurationMs = Object.values(durations).reduce((a, b) => a + b, 0);
  console.log(`  ✅ EP${epNumber} MP4 ready (${(totalDurationMs / 1000).toFixed(1)}s of source-config duration)`);
}

(async () => {
  const epArgs = process.argv.slice(2).map(Number).filter(n => n > 0);
  if (!epArgs.length) {
    console.error("Usage: tsx ./src/batch-render-fb-restore.ts <ep_number> [ep_number ...]");
    process.exit(1);
  }

  console.log(`\n🎬 BioMinute batch re-render (no YT upload)`);
  console.log(`   Episodes: ${epArgs.join(", ")}`);
  console.log(`   Reels URL: ${REELS_URL}\n`);

  for (const n of epArgs) {
    await processEpisode(n);
  }

  await pool.end();
  console.log("\n🎉 All done!\n");
})().catch(e => { console.error(e); process.exit(1); });
