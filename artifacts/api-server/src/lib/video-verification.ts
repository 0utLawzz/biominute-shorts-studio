import { execFileSync } from "node:child_process";
import fs from "node:fs";

const WIDTH = 1080;
const HEIGHT = 1920;

export function assertVerifiedVideo(videoPath: string): void {
  if (!fs.existsSync(videoPath)) throw new Error(`Rendered MP4 not found: ${videoPath}`);
  if (fs.statSync(videoPath).size === 0) throw new Error(`Rendered MP4 is empty: ${videoPath}`);

  const output = execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    videoPath,
  ], { encoding: "utf8" });
  const parsed = JSON.parse(output) as {
    streams?: Array<{ width?: number; height?: number }>;
    format?: { duration?: string };
  };
  const stream = parsed.streams?.[0];
  const width = Number(stream?.width);
  const height = Number(stream?.height);
  const duration = Number(parsed.format?.duration);
  if (width !== WIDTH || height !== HEIGHT || !Number.isFinite(duration) || duration < 1) {
    throw new Error(`Build verification failed: expected ${WIDTH}x${HEIGHT} video with duration, got ${width}x${height}.`);
  }
}