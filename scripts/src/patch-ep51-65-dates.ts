/**
 * patch-ep51-65-dates.ts
 * Sets scheduledPublishAt for episodes 51-65 (continuing daily from EP50 = 2026-09-03).
 * Run once after seeding workbook-3.
 */
import { db, episodesTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const SCHEDULE: Record<number, string> = {
  51: '2026-09-04',
  52: '2026-09-05',
  53: '2026-09-06',
  54: '2026-09-07',
  55: '2026-09-08',
  56: '2026-09-09',
  57: '2026-09-10',
  58: '2026-09-11',
  59: '2026-09-12',
  60: '2026-09-13',
  61: '2026-09-14',
  62: '2026-09-15',
  63: '2026-09-16',
  64: '2026-09-17',
  65: '2026-09-18',
};

async function main() {
  for (const [epStr, dateStr] of Object.entries(SCHEDULE)) {
    const epNumber = Number(epStr);
    const scheduledPublishAt = new Date(`${dateStr}T09:00:00Z`);
    const postDate = new Date(`${dateStr}T00:00:00Z`);
    await db.update(episodesTable)
      .set({ postDate, scheduledPublishAt, updatedAt: new Date() })
      .where(eq(episodesTable.epNumber, epNumber));
    console.log(`EP${epNumber} → ${scheduledPublishAt.toISOString()}`);
  }
  console.log('Done.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
