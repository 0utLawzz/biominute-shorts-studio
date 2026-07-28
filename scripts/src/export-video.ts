import { spawn, execSync } from 'child_process';
import { chromium } from 'playwright-chromium';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Path to the public audio assets relative to this script
const AUDIO_DIR = path.resolve(__dirname, '../../artifacts/biominute-reels/public/audio');
const BG_MUSIC_PATH = path.join(AUDIO_DIR, 'background.mp3');
const CONFIG_PATH = path.resolve(__dirname, '../../artifacts/biominute-reels/src/lib/video/config.ts');

const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;
const rawBrowserUrl = process.env.BIOMINUTE_EXPORT_URL || 'http://localhost:5173/';
const parsedBrowserUrl = new URL(rawBrowserUrl);
const BROWSER_URL = parsedBrowserUrl.pathname === '/'
  ? rawBrowserUrl.replace(/\/+$/, '')
  : rawBrowserUrl.replace(/\/+$/, '') + '/';
const OUT_DIR = process.env.BIOMINUTE_EXPORT_DIR || (process.platform === 'win32' ? path.join(process.env.TEMP || 'C:\\Temp', 'biominute-export') : '/tmp/biominute-export');
const FALLBACK_DURATION_MS = 43500;

function getConfigDurationMs(): number | null {
  try {
    const content = fsSync.readFileSync(CONFIG_PATH, 'utf8');
    const match = content.match(/SCENE_DURATIONS\s*=\s*\{([^}]+)\}/s);
    if (!match) return null;
    const vals = [...match[1].matchAll(/:\s*(\d+)/g)].map((m) => Number(m[1]));
    const total = vals.reduce((a, b) => a + b, 0);
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

async function startXvfb(): Promise<{ display: string; stop: () => void }> {
  const display = ':99';
  const proc = spawn('Xvfb', [display, '-screen', '0', `${VIDEO_WIDTH}x${VIDEO_HEIGHT}x24`, '-ac', '+extension', 'GLX', '+render', '-noreset']);
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Xvfb failed to start')), 10000);
    proc.on('error', reject);
    proc.on('spawn', () => {
      clearTimeout(timeout);
      setTimeout(resolve, 500);
    });
  });
  return {
    display,
    stop: () => {
      proc.kill('SIGTERM');
    },
  };
}

async function main() {
  const isWindows = process.platform === 'win32';
  const xvfb = isWindows ? { display: '', stop: () => {} } : await startXvfb();
  let browser;
  try {
    await fs.mkdir(OUT_DIR, { recursive: true });

    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      `--window-size=${VIDEO_WIDTH},${VIDEO_HEIGHT}`,
    ];

    browser = await chromium.launch({
      headless: true,
      env: isWindows ? { ...process.env } : { ...process.env, DISPLAY: xvfb.display },
      args: launchArgs,
    });

    // Create context with Playwright's built-in video recording
    const context = await browser.newContext({
      viewport: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: OUT_DIR,
        size: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
      },
    });
    const page = await context.newPage();

    // Navigate with a generous timeout
    console.log(`Navigating to ${BROWSER_URL}`);
    await page.goto(BROWSER_URL, { waitUntil: 'load', timeout: 60000 });

    // Give the React app time to mount and start animations
    console.log('Waiting for app to initialize...');
    await page.waitForTimeout(5000);

    // Read the total video duration from the page; fall back to config file, then safe value
    let totalDurationMs = await page
      .evaluate(() => ((globalThis as any).__biominuteTotalDuration__ as number | undefined))
      .then((d) => (d && d > 0 ? d : 0));
    if (!totalDurationMs) {
      totalDurationMs = getConfigDurationMs() ?? FALLBACK_DURATION_MS;
      console.log('Duration from config file:', totalDurationMs);
    }
    console.log(`Recording ${totalDurationMs}ms...`);

    // Wait for the full video loop plus buffer
    await page.waitForTimeout(totalDurationMs + 2000);

    // Close context to finalize the video recording
    const videoPath = await page.video()?.path();
    await context.close();

    if (!videoPath) {
      throw new Error('No video was recorded by Playwright');
    }

    console.log('Playwright recorded:', videoPath);

    // Convert to MP4 at exactly 1080x1920 with yuv420p for compatibility
    // Mix in background music directly via ffmpeg (Playwright recordVideo cannot capture audio)
    const mp4Path = process.argv[2] || path.join(OUT_DIR, 'episode.mp4');

    let bgMusicExists = false;
    try { await fs.access(BG_MUSIC_PATH); bgMusicExists = true; } catch {}

    if (bgMusicExists) {
      console.log('Mixing background music from:', BG_MUSIC_PATH);
      // Force 60fps CFR output so the MP4 stays in sync with the looped audio track.
      execSync(
        `ffmpeg -y -i "${videoPath}" -stream_loop -1 -i "${BG_MUSIC_PATH}" -vf "scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:force_original_aspect_ratio=decrease,pad=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -r 60 -vsync cfr -map 0:v:0 -map 1:a:0 -c:v libx264 -preset fast -crf 23 -movflags +faststart -af "volume=0.10" -c:a aac -b:a 128k -shortest "${mp4Path}"`,
        { stdio: 'inherit' }
      );
    } else {
      console.warn('Background music not found at:', BG_MUSIC_PATH, '— exporting video-only');
      // Force 60fps CFR output to avoid variable-frame-rate drift.
      execSync(
        `ffmpeg -y -i "${videoPath}" -vf "scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:force_original_aspect_ratio=decrease,pad=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -r 60 -vsync cfr -c:v libx264 -preset fast -crf 23 -movflags +faststart "${mp4Path}"`,
        { stdio: 'inherit' }
      );
    }

    // The Playwright .webm recording has now been fully converted into the final
    // mp4 (with music mixed in) — delete it immediately so these intermediate
    // recordings never pile up in exports/ or get accidentally committed to git.
    try {
      await fs.unlink(videoPath);
      console.log('Deleted intermediate Playwright recording:', videoPath);
    } catch (cleanupErr) {
      console.warn('Could not delete intermediate .webm (non-fatal):', cleanupErr);
    }

    console.log('Exported MP4:', mp4Path);

    // Regenerate the static dashboard so the latest export is visible immediately.
    try {
      const { execSync } = await import('child_process');
      execSync('pnpm run dashboard:generate', { stdio: 'inherit', cwd: path.resolve(__dirname, '../..') });
      console.log('Dashboard regenerated after export.');
    } catch (dashErr) {
      console.warn('Dashboard regeneration failed (non-fatal):', dashErr);
    }
  } finally {
    if (browser) await browser.close();
    xvfb.stop();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
