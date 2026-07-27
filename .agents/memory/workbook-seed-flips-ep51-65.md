---
name: Workbook seed flips Ep 51-65 status
description: seed-episodes.ts only preserves Ep ≤50 status from the live-state lock; Ep 51+ are overwritten by the workbook's Production Status column.
---

`scripts/src/seed-episodes.ts` has `preserveLiveState = row.epNumber <= 50 && LOCKED_STATUSES.has(currentStatus)`. That means **only Ep 1–50 with existing status `published` or `scheduled`** are protected. Ep 51+ are always overwritten with whatever the workbook's Production.Status column says.

**Discovered:** When you re-seed a workbook where Ep 51–65's Production Status column was last edited *before* the episodes were uploaded to YouTube, they flip from `scheduled` → `scripted` even though they're actually live (private + future `publishAt`) on YouTube. After a single seed, our counts moved from `54 scheduled / 35 scripted` to `39 scheduled / 50 scripted` before being corrected.

**Why:** The `preserve-live-state` rule was written when Ep 1–50 were the only pipeline-loaded episodes. Once Ep 51–65 ship to YouTube but the workbook still labels them `Scripted`, the seed downgrades them.

**How to apply:** Always run the refresh sequence in this order when re-seeding from the workbook:
1. `seed-episodes.ts` — read fresh metadata from Production/Social/Schedule sheets.
2. `reconcile-yt-status.mjs` — overwrite status from YouTube Data API truth; restores Ep 51+ that the seed wrongly demoted.
3. `resync-scheduled.ts` — reboot `scheduled_publish_at = post_date + 9h UTC` for the 89 rows needing timestamps.
4. `generate-dashboard.ts` — regen `exports/dashboard.html`.

If step 2 is skipped, Ep 51+ will silently reflect workbook values, not YouTube reality, and the dashboard will lie.
