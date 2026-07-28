import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { db, episodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { BuildArtifact, PipelineEpisode } from "./types.js";

export const WORKSPACE_ROOT = path.resolve(import.meta.dirname, "../../..");
export const EXPORTS_DIR = path.join(WORKSPACE_ROOT, "exports");
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export function parseEpisodeNumber(value: string | undefined): number {
  const episode = Number(value);
  if (!Number.isInteger(episode) || episode <= 0) {
    throw new Error("Usage: pipeline command <episode-number> [--publish]");
  }
  return episode;
}

export async function getEpisode(epNumber: number): Promise<PipelineEpisode> {
  const rows = await db
    .select({
      id: episodesTable.id,
      epNumber: episodesTable.epNumber,
      status: episodesTable.status,
      hookTitle: episodesTable.hookTitle,
      youtubeVideoId: episodesTable.youtubeVideoId,
      scheduledPublishAt: episodesTable.scheduledPublishAt,
    })
    .from(episodesTable)
    .where(eq(episodesTable.epNumber, epNumber));

  const episode = rows[0];
  if (!episode) throw new Error(`Episode ${epNumber} not found in database.`);
  return episode;
}

export function findExportDir(epNumber: number): string | null {
  const prefix = `Episode-${String(epNumber).padStart(2, "0")}-`;
  const matches = fs.existsSync(EXPORTS_DIR)
    ? fs.readdirSync(EXPORTS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
        .map((entry) => path.join(EXPORTS_DIR, entry.name))
    : [];
  return matches.find((dir) => fs.existsSync(path.join(dir, "episode.mp4"))) ?? matches[0] ?? null;
}

export function getArtifact(epNumber: number): BuildArtifact {
  const exportDir = findExportDir(epNumber);
  if (!exportDir) {
    throw new Error(`No export folder found for episode ${epNumber}. Build it first.`);
  }
  const videoPath = path.join(exportDir, "episode.mp4");
  if (!fs.existsSync(videoPath)) throw new Error(`Missing rendered MP4: ${videoPath}`);
  const videoBytes = fs.statSync(videoPath).size;
  if (videoBytes === 0) throw new Error(`Rendered MP4 is empty: ${videoPath}`);
  return { episode: epNumber, exportDir, videoPath, videoBytes };
}

export function runCommand(command: string, args: string[], env: NodeJS.ProcessEnv = {}): void {
  const result = spawnSync(command, args, {
    cwd: WORKSPACE_ROOT,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status ?? "unknown"}.`);
}

export function probeVideo(videoPath: string): { width: number; height: number; duration: number } {
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
  if (!width || !height || !duration) throw new Error(`ffprobe could not read a valid video from ${videoPath}`);
  return { width, height, duration };
}

export function assertPublishable(episode: PipelineEpisode, artifact: BuildArtifact): void {
  if (episode.youtubeVideoId) {
    throw new Error(`Episode ${episode.epNumber} is already on YouTube (${episode.youtubeVideoId}).`);
  }
  if (episode.status !== "scripted" && episode.status !== "building" && episode.status !== "complete") {
    throw new Error(`Episode ${episode.epNumber} cannot publish from status "${episode.status}".`);
  }
  const metadataPath = path.join(artifact.exportDir, "episode-notes.md");
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Warning: ${metadataPath} is missing; continuing because the renderer has no required notes contract.`);
  }
}