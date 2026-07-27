/**
 * reconcile-yt-status.mjs
 *
 * Reads the YouTube Data API privacyStatus + publishAt for every Ep 1-65
 * with a youtube_video_id, and reconciles the DB:
 *
 *   - privacyStatus=public                  → status='published'
 *   - privacyStatus=private + publishAt>now → status='scheduled', postDate=publishAt date, scheduledPublishAt stored
 *   - private + publishAt<=now              → status='published' (live)
 *   - yt id not found (deleted/unknown)     → leave DB status untouched
 *
 * Episodes without an yt id (66-100) are forced to status='scripted'.
 */
import pg from "pg";
import { google } from "googleapis";

const oauth = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
);
oauth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const yt = google.youtube({ version: "v3", auth: oauth });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function fetchStatus(ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const v = await yt.videos.list({ part: ["status"], id: chunk });
    for (const item of v.data.items ?? []) {
      out.set(item.id, {
        privacyStatus: item.status?.privacyStatus,
        publishAt: item.status?.publishAt,
      });
    }
  }
  return out;
}

const ytRows = await pool.query(
  `SELECT "ep_number", "youtube_video_id"
   FROM episodes
   WHERE "ep_number" BETWEEN 1 AND 65
     AND "youtube_video_id" IS NOT NULL
   ORDER BY "ep_number"`,
);
const ytIds = ytRows.rows.map((r) => r.youtube_video_id);
const ytMap = await fetchStatus(ytIds);
const nowMs = Date.now();

const updates = [];
for (const row of ytRows.rows) {
  const info = ytMap.get(row.youtube_video_id);
  if (!info) continue;
  const ep = row.ep_number;
  const publishAtMs = info.publishAt ? Date.parse(info.publishAt) : 0;
  const isLive =
    info.privacyStatus === "public" ||
    (info.privacyStatus === "private" && publishAtMs && publishAtMs < nowMs);
  const isScheduled =
    info.privacyStatus === "private" && publishAtMs && publishAtMs > nowMs;

  if (isLive) {
    updates.push({ ep, status: "published", postDate: null, scheduledPublishAt: null });
  } else if (isScheduled) {
    updates.push({
      ep,
      status: "scheduled",
      postDate: info.publishAt.slice(0, 10),
      scheduledPublishAt: info.publishAt,
    });
  }
}

console.log(`Reconciling ${updates.length} episodes based on YouTube status:`);
for (const u of updates) {
  await pool.query(
    `UPDATE episodes
     SET status = $1,
         post_date = COALESCE($2, post_date),
         scheduled_publish_at = $3,
         updated_at = NOW()
     WHERE ep_number = $4`,
    [u.status, u.postDate, u.scheduledPublishAt, u.ep],
  );
  console.log(
    `  Ep ${String(u.ep).padStart(2, "0")} → ${u.status.padEnd(10)} postDate=${u.postDate ?? "-"} scheduled=${u.scheduledPublishAt ?? "-"}`,
  );
}

// Force Ep 66-100 to scripted
const scripted = await pool.query(
  `UPDATE episodes
   SET status = 'scripted', updated_at = NOW()
   WHERE ep_number BETWEEN 66 AND 100
     AND youtube_video_id IS NULL
   RETURNING ep_number`,
);
console.log(`\nForced ${scripted.rowCount} episodes (66-100 without yt id) to status='scripted'.`);

// Final status counts
const counts = await pool.query(
  `SELECT status, COUNT(*) AS c FROM episodes WHERE ep_number BETWEEN 1 AND 100 GROUP BY status ORDER BY status`,
);
console.log("\nFinal Ep 1-100 status:");
for (const c of counts.rows) console.log(`  ${c.status.padEnd(10)} ${c.c}`);

await pool.end();
