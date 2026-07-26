/**
 * Verify that episodes 51-65 are scheduled on YouTube.
 * Prints each video's privacy status, scheduled publish time, and title.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/verify-youtube-scheduled.ts
 */
import { google } from "googleapis";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { episodesTable } from "@workspace/db";

const REQUIRED = [
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing env vars:", missing.join(", "));
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  return client;
}

async function main() {
  const eps = await db
    .select({
      epNumber: episodesTable.epNumber,
      youtubeVideoId: episodesTable.youtubeVideoId,
      youtubeTitle: episodesTable.youtubeTitle,
      scheduledPublishAt: episodesTable.scheduledPublishAt,
    })
    .from(episodesTable)
    .where(sql`${episodesTable.epNumber} >= 51 and ${episodesTable.epNumber} <= 65`)
    .orderBy(episodesTable.epNumber);

  const youtube = google.youtube({ version: "v3", auth: getOAuth2Client() });

  console.log("\nVerifying episodes 51–65 on YouTube...\n");

  let ok = 0;
  let fail = 0;

  for (const ep of eps) {
    if (!ep.youtubeVideoId) {
      console.log(`EP${ep.epNumber}: ❌ no youtubeVideoId in DB`);
      fail++;
      continue;
    }

    try {
      const res = await youtube.videos.list({
        part: ["snippet", "status"],
        id: [ep.youtubeVideoId],
      });
      const video = res.data.items?.[0];
      if (!video) {
        console.log(`EP${ep.epNumber}: ❌ video not found on YouTube (${ep.youtubeVideoId})`);
        fail++;
        continue;
      }

      const status = video.status;
      const snippet = video.snippet;
      const privacy = status?.privacyStatus;
      const publishAt = status?.publishAt;
      const publishDate = publishAt ? new Date(publishAt) : null;
      const dbDate = ep.scheduledPublishAt ? new Date(ep.scheduledPublishAt) : null;
      const timesMatch = publishDate && dbDate && Math.abs(publishDate.getTime() - dbDate.getTime()) < 1000;
      const dbTime = dbDate ? dbDate.toISOString() : "N/A";
      const match = timesMatch ? "✅" : "⚠️";

      console.log(
        `EP${ep.epNumber}: ${match} privacy=${privacy} publishAt=${publishAt} db=${dbTime} id=${ep.youtubeVideoId}`,
      );
      console.log(`  Title: ${snippet?.title}`);
      ok++;
    } catch (err) {
      console.log(`EP${ep.epNumber}: ❌ API error — ${err instanceof Error ? err.message : err}`);
      fail++;
    }
  }

  console.log(`\nResult: ${ok} OK, ${fail} failed`);
  await pool.end();
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
