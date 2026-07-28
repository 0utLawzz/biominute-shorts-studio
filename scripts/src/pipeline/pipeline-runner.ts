import { db } from "@workspace/db";
import { getArtifact, getEpisode, parseEpisodeNumber, probeVideo, runCommand, VIDEO_HEIGHT, VIDEO_WIDTH } from "./helpers.js";

async function main() {
  const epNumber = parseEpisodeNumber(process.argv[2]);
  const publish = process.argv.includes("--publish");
  const now = process.argv.includes("--now");
  const episode = await getEpisode(epNumber);
  console.log(`\nBioMinute pipeline — EP${epNumber}: ${episode.hookTitle}`);
  runCommand("pnpm", ["--filter", "@workspace/scripts", "exec", "tsx", "./src/pipeline/preflight.ts", String(epNumber)]);
  runCommand("pnpm", ["--filter", "@workspace/scripts", "exec", "tsx", "./src/pipeline/build.ts", String(epNumber)]);
  const artifact = getArtifact(epNumber);
  const probe = probeVideo(artifact.videoPath);
  if (probe.width !== VIDEO_WIDTH || probe.height !== VIDEO_HEIGHT || probe.duration < 1) {
    throw new Error("Pipeline stopped: rendered artifact did not pass verification.");
  }
  console.log(`VERIFY PASS: ${probe.width}x${probe.height}, ${probe.duration.toFixed(1)}s`);
  if (!publish) {
    console.log("PUBLISH HOLD: build is verified. Add --publish to upload, or --publish --now for immediate publishing.");
    await db.$client.end();
    return;
  }
  runCommand("pnpm", ["--filter", "@workspace/scripts", "exec", "tsx", "./src/pipeline/publish-gate.ts", String(epNumber), ...(now ? ["--now"] : [])], {},);
  console.log("PUBLISH PASS");
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(`PIPELINE FAIL: ${error instanceof Error ? error.message : error}`);
  await db.$client.end();
  process.exit(1);
});