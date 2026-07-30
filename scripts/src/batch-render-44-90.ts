/**
 * batch-render-44-90.ts
 *
 * Renders all episodes 44-90 that don't have local MP4s yet.
 * Runs sequentially: prepare-scenes → export-video for each.
 * Already-exported episodes (44-55, 91-100) are skipped.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, "../..");
const EXPORTS_DIR = path.join(WORKSPACE_ROOT, "exports");

function hasExport(ep: number): boolean {
  const prefix = `Episode-${String(ep).padStart(2, "0")}-`;
  if (!fs.existsSync(EXPORTS_DIR)) return false;
  return fs.readdirSync(EXPORTS_DIR).some(
    (n) => n.startsWith(prefix) && fs.existsSync(path.join(EXPORTS_DIR, n, "episode.mp4")),
  );
}

function run(cmd: string, cwd = WORKSPACE_ROOT): void {
  console.log(`\n--- ${cmd} ---`);
  execSync(cmd, { cwd, stdio: "inherit", timeout: 300000 });
}

const start = 56;
const end = 90;

console.log(`Batch render Ep ${start}–${end}`);
console.log(`Checking existing exports...`);

for (let ep = start; ep <= end; ep++) {
  if (hasExport(ep)) {
    console.log(`Ep ${ep}: already has MP4, skipping.`);
    continue;
  }
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  EP${ep} — rendering...`);
  console.log(`${"=".repeat(60)}`);

  run(
    `pnpm --filter @workspace/scripts exec tsx ./src/pipeline/prepare-scenes.ts ${ep}`,
  );
  // Wait for HMR to settle
  execSync("sleep 4", { stdio: "inherit" });
  run(
    `BIOMINUTE_EXPORT_URL="http://localhost:25078/biominute-reels/" BIOMINUTE_EXPORT_DIR="${EXPORTS_DIR}/Episode-${String(ep).padStart(2, "0")}-build" pnpm --filter @workspace/scripts exec tsx ./src/export-video.ts`,
  );
  // Verify
  const mp4 = path.join(EXPORTS_DIR, `Episode-${String(ep).padStart(2, "0")}-build`, "episode.mp4");
  try {
    const probe = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration -of json "${mp4}"`,
      { encoding: "utf8" },
    );
    const parsed = JSON.parse(probe);
    const w = parsed.streams?.[0]?.width;
    const h = parsed.streams?.[0]?.height;
    console.log(`  ✓ EP${ep} verified: ${w}x${h}, ${parsed.format?.duration}s`);
  } catch (e) {
    console.error(`  ✗ EP${ep} verification failed: ${e}`);
  }
}

console.log(`\n🎉 Batch render complete: Ep ${start}–${end} done.`);
