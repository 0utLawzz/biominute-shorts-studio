import { db } from "@workspace/db";
import { getArtifact, getEpisode, parseEpisodeNumber, probeVideo, VIDEO_HEIGHT, VIDEO_WIDTH } from "./helpers.js";

async function main() {
  const epNumber = parseEpisodeNumber(process.argv[2]);
  const episode = await getEpisode(epNumber);
  const artifact = getArtifact(epNumber);
  const probe = probeVideo(artifact.videoPath);
  if (probe.width !== VIDEO_WIDTH || probe.height !== VIDEO_HEIGHT) {
    throw new Error(`Expected ${VIDEO_WIDTH}x${VIDEO_HEIGHT}, got ${probe.width}x${probe.height}.`);
  }
  if (probe.duration < 1) throw new Error("Rendered video duration is less than one second.");
  console.log(`VERIFY PASS: EP${episode.epNumber} — ${probe.width}x${probe.height}, ${probe.duration.toFixed(1)}s, ${artifact.videoBytes} bytes`);
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(`VERIFY FAIL: ${error instanceof Error ? error.message : error}`);
  await db.$client.end();
  process.exit(1);
});