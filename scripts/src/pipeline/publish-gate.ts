import { db } from "@workspace/db";
import { assertPublishable, getArtifact, getEpisode, parseEpisodeNumber, probeVideo, VIDEO_HEIGHT, VIDEO_WIDTH, runCommand } from "./helpers.js";

async function main() {
  const epNumber = parseEpisodeNumber(process.argv[2]);
  const mode = process.argv.includes("--now") ? "now" : "scheduled";
  const episode = await getEpisode(epNumber);
  const artifact = getArtifact(epNumber);
  const probe = probeVideo(artifact.videoPath);
  if (probe.width !== VIDEO_WIDTH || probe.height !== VIDEO_HEIGHT) {
    throw new Error("Publish blocked: build verification failed.");
  }
  assertPublishable(episode, artifact);
  const script = mode === "now" ? "upload-now.ts" : "schedule-upload.ts";
  console.log(`PUBLISH GATE PASS: EP${epNumber} artifact verified.`);
  runCommand(
    `${process.cwd()}/scripts/node_modules/.bin/tsx`,
    [`${process.cwd()}/scripts/src/${script}`, String(epNumber)],
  );
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(`PUBLISH BLOCKED: ${error instanceof Error ? error.message : error}`);
  await db.$client.end();
  process.exit(1);
});