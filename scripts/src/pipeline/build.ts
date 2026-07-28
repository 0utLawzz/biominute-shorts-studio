import path from "node:path";
import { db } from "@workspace/db";
import { getEpisode, findExportDir, runCommand, parseEpisodeNumber, EXPORTS_DIR } from "./helpers.js";
import { prepareEpisodeScenes } from "./prepare-scenes.js";

async function main() {
  const epNumber = parseEpisodeNumber(process.argv[2]);
  const episode = await getEpisode(epNumber);
  prepareEpisodeScenes(epNumber, episode.hookTitle);
  const existing = findExportDir(epNumber);
  const exportDir = existing ?? path.join(EXPORTS_DIR, `Episode-${String(epNumber).padStart(2, "0")}-build`);
  const script = path.join(process.cwd(), "scripts", "src", "export-video.ts");
  const exportUrl = process.env.BIOMINUTE_EXPORT_URL ?? "http://localhost:25078/biominute-reels/";
  console.log(`BUILD EP${epNumber}: ${episode.hookTitle}`);
  runCommand(path.join(process.cwd(), "scripts", "node_modules", ".bin", "tsx"), [script], {
    BIOMINUTE_EXPORT_URL: exportUrl,
    BIOMINUTE_EXPORT_DIR: exportDir,
  });
  console.log(`BUILD PASS: ${exportDir}`);
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(`BUILD FAIL: ${error instanceof Error ? error.message : error}`);
  await db.$client.end();
  process.exit(1);
});