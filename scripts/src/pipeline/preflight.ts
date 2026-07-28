import { db } from "@workspace/db";
import { parseEpisodeNumber, getEpisode } from "./helpers.js";

async function main() {
  const episode = await getEpisode(parseEpisodeNumber(process.argv[2]));
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  if (episode.youtubeVideoId) throw new Error(`Episode ${episode.epNumber} already has a YouTube video.`);
  console.log(`PASS preflight: EP${episode.epNumber} — ${episode.hookTitle}`);
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(`FAIL preflight: ${error instanceof Error ? error.message : error}`);
  await db.$client.end();
  process.exit(1);
});