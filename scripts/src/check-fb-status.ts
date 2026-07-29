/**
 * check-fb-status.ts — quick DB query to show Facebook ID status per episode
 */
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await pool.query<{
  ep_number: number;
  hook_title: string;
  facebook_video_id: string | null;
  youtube_video_id: string | null;
  scheduled_publish_at: Date | null;
  status: string;
}>(`
  SELECT ep_number, hook_title, facebook_video_id, youtube_video_id, scheduled_publish_at, status
  FROM episodes
  WHERE ep_number > 0 AND ep_number <= 100
  ORDER BY ep_number
`);

const have = rows.filter((r) => r.facebook_video_id);
const missing = rows.filter((r) => !r.facebook_video_id);
console.log(`WITH FB ID   : ${have.length}`);
console.log(`MISSING FB ID: ${missing.length}`);
console.log("\n--- Missing Facebook IDs ---");
for (const r of missing) {
  const d = r.scheduled_publish_at
    ? new Date(r.scheduled_publish_at).toISOString().slice(0, 10)
    : "null";
  const yt = r.youtube_video_id ? "YT✓" : "YT✗";
  console.log(
    `Ep${String(r.ep_number).padStart(3, "0")}  ${yt}  date=${d}  status=${r.status}`,
  );
}
await pool.end();
