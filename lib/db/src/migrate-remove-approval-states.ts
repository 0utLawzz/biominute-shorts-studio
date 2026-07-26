// Data migration: remap old statuses before dropping them from the enum.
// Run this BEFORE `drizzle-kit push --force`.
// "review" -> "complete", "approved" -> "scheduled", "rejected" -> "draft"

import { db, episodesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Remapping 'review' -> 'complete'...");
  const r1 = await db
    .update(episodesTable)
    .set({ status: "complete", updatedAt: new Date() })
    .where(sql`status = 'review'`);
  console.log(`  → ${r1.rowCount ?? 0} rows`);

  console.log("Remapping 'approved' -> 'scheduled' (with scheduledPublishAt)...");
  const r2 = await db
    .update(episodesTable)
    .set({
      status: "scheduled",
      scheduledPublishAt: sql`COALESCE(scheduled_publish_at, (post_date || 'T09:00:00Z')::timestamptz)`,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      sql`${episodesTable.status} = 'approved' AND ${episodesTable.postDate} IS NOT NULL AND ${episodesTable.postDate} != ''`
    );
  console.log(`  → ${r2.rowCount ?? 0} rows with postDate`);

  // Remaining approved rows without a postDate
  const r2b = await db
    .update(episodesTable)
    .set({ status: "complete", updatedAt: new Date() })
    .where(
      sql`${episodesTable.status} = 'approved' AND (${episodesTable.postDate} IS NULL OR ${episodesTable.postDate} = '')`
    );
  console.log(`  → ${r2b.rowCount ?? 0} approved rows without postDate set to complete`);

  console.log("Remapping 'rejected' -> 'draft'...");
  const r3 = await db
    .update(episodesTable)
    .set({ status: "draft", updatedAt: new Date() })
    .where(sql`status = 'rejected'`);
  console.log(`  → ${r3.rowCount ?? 0} rows`);

  console.log("Migration complete. Now run `drizzle-kit push --force` to apply schema changes.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
