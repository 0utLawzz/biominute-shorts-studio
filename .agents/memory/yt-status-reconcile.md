---
name: YouTube-status reconciliation
description: How to bring DB episode status back in sync with YouTube Data API truth (publishAt + privacyStatus).
---

When the dashboard's status counts diverge from reality, `scripts/src/reconcile-yt-status.mjs` is the canonical fix — it queries YouTube Data API `videos.list` for every Ep 1–65 with a `youtube_video_id`, then writes:

- `privacyStatus=public` (or `private` + `publishAt<=now`) → DB `status='published'`
- `privacyStatus=private` + `publishAt>now` → DB `status='scheduled'` + `post_date` + `scheduled_publish_at`
- Ep 66–100 with no YT id → forced to `status='scripted'`

**Why:** `seed-episodes.ts` derives status from the workbook only, and a number of Ep 1–50 reached DB as `status='published'` even though they're still private/scheduled on YouTube (today's "Published" must match `privacyStatus=public` for the count to mean anything). `Ep 1–11` are the only ones currently public.

**How to apply:** Whenever the dashboard's `byStatus.published` count looks wrong, run the script before any seed. Then follow with `seed-episodes.ts` (preserves Ep 1–50 locked) + `resync-scheduled.ts` (rebuilds `scheduled_publish_at = post_date + 9h UTC`). The `videos.list` `id=` filter rejects `maxResults` — split into ≤50 chunks when querying all 65.
