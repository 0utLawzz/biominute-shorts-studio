/**
 * Align every non-published YouTube episode to one daily 09:00 UTC cadence.
 *
 * Published episodes are read-only. Existing private YouTube videos are
 * rescheduled in place; this intentionally does not delete or re-upload them.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/fix-youtube-daily-cadence.ts --dry-run
 *   pnpm --filter @workspace/scripts exec tsx ./src/fix-youtube-daily-cadence.ts
 */
import { google } from "googleapis";
import pg from "pg";

const dryRun = process.argv.includes("--dry-run");
const required = [
  "DATABASE_URL",
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const oauth = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
);
oauth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth: oauth });

const { rows } = await pool.query<{
  ep_number: number;
  youtube_video_id: string | null;
  post_date: string | null;
  scheduled_publish_at: Date | null;
  status: string;
}>(`SELECT ep_number, youtube_video_id, post_date, scheduled_publish_at, status
    FROM episodes
    WHERE ep_number BETWEEN 1 AND 100
    ORDER BY ep_number`);

const ids = rows.filter((row) => row.youtube_video_id).map((row) => row.youtube_video_id!);
const statusById = new Map<string, {
  privacyStatus?: string | null;
  publishAt?: string | null;
  publishedAt?: string | null;
}>();
for (let i = 0; i < ids.length; i += 50) {
  const response = await youtube.videos.list({
    part: ["status", "snippet"],
    id: ids.slice(i, i + 50),
  });
  for (const video of response.data.items ?? []) {
    statusById.set(video.id!, {
      privacyStatus: video.status?.privacyStatus,
      publishAt: video.status?.publishAt,
      publishedAt: video.snippet?.publishedAt,
    });
  }
}

const published = rows.filter((row) => {
  const info = row.youtube_video_id ? statusById.get(row.youtube_video_id) : undefined;
  return info?.privacyStatus === "public";
});
const scheduled = rows.filter((row) => {
  const info = row.youtube_video_id ? statusById.get(row.youtube_video_id) : undefined;
  return Boolean(row.youtube_video_id && info && info.privacyStatus !== "public");
});

if (!scheduled.length) {
  console.log("No non-published YouTube episodes found.");
  await pool.end();
  process.exit(0);
}

const toDateOnly = (value: Date | string | null | undefined): string | null => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

const latestPublishedDate = published
  .map((row) => {
    const info = row.youtube_video_id ? statusById.get(row.youtube_video_id) : undefined;
    return toDateOnly(row.post_date) ?? info?.publishedAt?.slice(0, 10) ?? null;
  })
  .filter((value): value is string => Boolean(value))
  .sort()
  .at(-1);
if (!latestPublishedDate) {
  throw new Error("Cannot determine the last published episode date.");
}

const anchor = new Date(`${latestPublishedDate}T00:00:00.000Z`);
anchor.setUTCDate(anchor.getUTCDate() + 1);
scheduled.sort((a, b) => a.ep_number - b.ep_number);

console.log(`${dryRun ? "[DRY RUN] " : ""}Aligning ${scheduled.length} scheduled episodes.`);
console.log(`Published episodes remain untouched. First scheduled slot: ${anchor.toISOString()}`);

for (let index = 0; index < scheduled.length; index++) {
  const row = scheduled[index];
  const target = new Date(anchor);
  target.setUTCDate(target.getUTCDate() + index);
  target.setUTCHours(9, 0, 0, 0);
  const targetIso = target.toISOString();
  const actual = row.youtube_video_id ? statusById.get(row.youtube_video_id)?.publishAt ?? null : null;
  const unchanged = actual === targetIso && row.scheduled_publish_at?.toISOString() === targetIso;
  console.log(`Ep${String(row.ep_number).padStart(2, "0")}: ${actual ?? "missing"} → ${targetIso}${unchanged ? " (already aligned)" : ""}`);
  if (dryRun || unchanged || !row.youtube_video_id) continue;

  await youtube.videos.update({
    part: ["status"],
    requestBody: {
      id: row.youtube_video_id,
      status: {
        privacyStatus: "private",
        publishAt: targetIso,
        selfDeclaredMadeForKids: false,
      },
    },
  });
  await pool.query(
    `UPDATE episodes
     SET status = 'scheduled', post_date = $1, scheduled_publish_at = $2, updated_at = NOW()
     WHERE ep_number = $3`,
    [targetIso.slice(0, 10), targetIso, row.ep_number],
  );
}

if (dryRun) {
  console.log("Dry run complete; no YouTube or database changes made.");
} else {
  console.log("YouTube cadence update complete.");
}
await pool.end();