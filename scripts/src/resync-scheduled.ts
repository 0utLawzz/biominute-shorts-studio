// Re-sync scheduled_publish_at for all non-published episodes on the primary DB (Neon).
// Rule: scheduled_publish_at = post_date + 09:00:00 UTC (= 2:00 PM PKT)
// Each episode derives from its OWN post_date — no carry-forward from a previous slot.
import { db, episodesTable } from "@workspace/db";
import { sql, ne } from "drizzle-orm";

async function main() {
  // Update every episode that has a post_date and isn't already published.
  // Uses PostgreSQL timestamp arithmetic so the result is always exactly post_date + 9h UTC.
  const updated = await db.execute(sql`
    UPDATE episodes
    SET
      scheduled_publish_at = (post_date + interval '9 hours'),
      updated_at = now()
    WHERE post_date IS NOT NULL
      AND status != 'published'
    RETURNING ep_number, status, post_date, scheduled_publish_at
  `);

  console.log(`Re-synced ${updated.rows.length} episodes:`);
  for (const row of updated.rows as any[]) {
    console.log(
      `  Ep ${String(row.ep_number).padStart(2, "0")}  ${row.status.padEnd(10)}  post_date=${row.post_date}  scheduled=${row.scheduled_publish_at}`
    );
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
