# Production Status — BioMinute Shorts Studio

> **Canonical snapshot of the pipeline.** Refreshed **2026-07-27** after Stage 3 database date migration, seed refresh, and YouTube reconciliation.

This document is the single source of truth for *where every episode lives* in the publish pipeline. The dashboard (`http://<host>:5173/`) and the API endpoint `GET /api/episodes/stats` reflect the same numbers in real time.

---

## Live counts (Ep 1–100)

| Status                     | Count | What it means                                                                  |
|----------------------------|-------|--------------------------------------------------------------------------------|
| `published`                | 12    | Live on YouTube (`privacyStatus=public`)                                       |
| `scheduled`                | 53    | Uploaded as private, will auto-publish at `publishAt` (9:00 UTC)               |
| `scripted`                 | 35    | Script + visual direction in master workbook, no MP4, no YouTube ID           |
| `complete` (test slots)    |  2    | `TEST-1` (immediate) and `TEST-2` (delayed) — pipeline smoke tests             |
| **Total**                  | **102** | 100 regular episodes (Ep 1–100) + 2 test slots                              |

---

## Episode-by-episode state — Ep 1–65 (all on YouTube)

| Range          | YouTube state                          | DB status    | Publish window          |
|----------------|----------------------------------------|--------------|-------------------------|
| Ep 1, 4–11     | public (9 episodes)                    | `published`  | Jul 12 – Jul 26, 2026   |
| Ep 2, 3        | uploaded, deleted/lost API record      | `published`  | Jul 15, Jul 17, 2026    |
| Ep 12          | public                                | `published`  | live                    |
| Ep 13–50       | private, future `publishAt`            | `scheduled`  | Jul 28 – Sep 03, 2026   |
| Ep 51–65       | private, future `publishAt`            | `scheduled`  | Sep 04 – Sep 18, 2026   |

**Ep 2 and 3** had `youtube_video_id` set but are no longer retrievable from the YouTube Data API. The DB treats them as `published` because the IDs were confirmed live at some point in the past.

**Ep 66–100** — all carry `scripted` status. They have `hookTitle`, `voScript`, `visualDirection`, citation, CTA, hashtags, and a timestamp `postDate` allocated by the master workbook but no rendered MP4 yet.

---

## Reconciliation workflow

When the dashboard feels out of sync with YouTube, run:

```bash
pnpm --filter @workspace/scripts exec tsx ./src/reconcile-yt-status.mjs
```

This script:

1. Pulls `privacyStatus` + `publishAt` from YouTube Data API for every Ep 1–65 with a `youtube_video_id`.
2. Sets DB `status='published'` for live videos, `status='scheduled'` for private videos with future `publishAt`.
3. Forces `status='scripted'` for Ep 66–100 (no YT id).
4. Aligns `post_date` and `scheduled_publish_at` with the actual `publishAt`.

After it runs, follow with the canonical seeding step so workbook metadata stays in lockstep with DB:

```bash
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts --dry-run
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
pnpm --filter @workspace/scripts exec tsx ./src/resync-scheduled.ts
```

The seed script automatically selects the newest `.xlsx` file in `attached_assets/`. Empty dates are stored as `NULL`; real episode dates are stored as PostgreSQL timestamps.

---

## How statuses are derived

| Source                              | Status it implies                                  |
|-------------------------------------|----------------------------------------------------|
| YouTube `privacyStatus=public`      | `published`                                        |
| YouTube `privacyStatus=private` + `publishAt > now` | `scheduled`                          |
| Workbook Status column = "Approved" | `complete`                                         |
| Workbook Status column = "Scripted" | `scripted`                                         |
| Workbook Status column = "Published" | `published` (only used if no YouTube ID yet)     |
| Episode has rendered MP4 on disk    | `complete` (fallback for "Draft")                  |

`seed-episodes.ts` **never downgrades** Ep 1–50 from `published` → `scripted` or `scheduled` → `scripted`. The 1–50 live-state lock protects real publish history from being wiped by an overzealous workbook edit.

---

## Filesystem layout for an episode

```
exports/Episode-NN-slug/
  ├─ episode.mp4          # rendered output, deleted after YT + FB confirm
  ├─ thumbnail.png        # poster frame
  └─ episode-notes.md     # one-page brief used by the dashboard scratchpad
```

If `episode.mp4` is missing, the episode is *not* safely re-renderable from disk alone — the React scene components are the source of truth. See `Biominute-short-video-lifecycle.md` (if present) for the re-render procedure.

---

## Where data lives

| Data                  | Location                                                       |
|-----------------------|----------------------------------------------------------------|
| Episode metadata      | PostgreSQL `episodes` table (102 rows)                          |
| YouTube video IDs     | `episodes.youtube_video_id`                                    |
| Facebook post IDs     | `episodes.facebook_video_id` (22/50)                           |
| Master workbook       | `attached_assets/BioMinute-Master-Workbook_*.xlsx`              |
| Production log        | `exports/production-log.md` (free-form timeline)               |
| Static dashboard      | `exports/dashboard.html` (regenerated by `generate-dashboard.ts`) |

---

## Changes to this document

Edit `docs/production-status.md` whenever the live counts change meaningfully (e.g., new batch uploaded, FB reset, status roll-back). Treat the dashboard stats endpoint as ground truth; this file should reconcile with it.
