# PROGRESS — BioMinute Shorts Studio

> **Canonical chronological log.** Every user request → every agent action → every commit.
> Read this first when continuing work in a new session, before diving into code.

This file exists so a freshly-spawned agent (or the user themselves) can reconstruct exactly what happened, in order, without scraping through git history, conversation summaries, or working memory by hand. It is updated every time a meaningful chunk of work ships.

**Companion files:**
- `replit.md` — agent context (workflows, ports, conventions)
- `README.md` — public-facing project overview
- `docs/production-status.md` — current pipeline snapshot (live counts, statuses, workflows)
- `.agents/memory/MEMORY.md` — durable lessons index (long-term knowledge)
- `exports/production-log.md` — free-form timeline maintained alongside this file

---

## User requests → Agent actions

### Request 1 — Schedule Ep 50 Facebook posts (1/day, immediate delete-all reset)
*(Session: 2026-07-27, FB reset)*

**User said:** "Schedule Ep 1–50 on Facebook at 1/day cadence. Delete any existing scheduled posts first; re-publish the lot with the correct title + description since the originals had no caption."

**Agent did:**
1. **Disc** the project is BioMinute Shorts Studio — 102 episodes, monorepo on Replit (pnpm workspaces, 4 workflows).
2. Wrote the 3-phase FB chunked upload (`scripts/src/facebook-daily-publish.ts`) into scheduled mode with `--all` and `--num` flags.
3. Pushed `8be66f6` (FB cadence + slot-offset env), `4d34aa2` (Finish-phase now appends `title`+`description` — root cause of missing captions).
4. Re-rendered missing Ep 3–24, 31–35, 42 — **27 episodes had no archived React scene source** (built before archiving convention), so only Ep 25–30, 36–41, 43–50 re-rendered.
5. New scripts: `batch-render-fb-restore.ts` (renders without YT upload), `facebook-bulk-schedule.ts` (explicit-episode CLI, supports `FB_SLOT_START_OFFSET_DAYS`).
6. Foregrounded 5-ep chunks (5-min shell cap, `nohup` died silently).
7. Final FB state: 22 posts scheduled (Ep 1, 2 + 25–30 + 36–50), 28 cannot be re-uploaded (no scene source).
8. Memory recorded: `dashboard-pipeline-status.md`, `episode-seeding-status-rules.md`, `biominute-scheduled-time-drift.md`, `facebook-removal.md`, `export-folder-naming-convention.md`.
9. **Commit `43db884`** — the new bulk scripts.

### Request 2 — Fix dashboard, reconcile statuses with YouTube, run seed, update docs
*(Session: 2026-07-27 evening)*

**User said:** "Fix dashboard. From YouTube check how many Publish and live now. Mark them Published. Those scheduled mark Scheduled till ep 65. Make sure all ep uploaded to YouTube as scheduled. Rest from 66–100 mark Scripted. Always push little little work to GitHub. Run ep seed. Update database. Update repo README and docs folder to update status."

**Agent did:**
1. **DB inspection** — found `published=52, scripted=48` but 9 of those `published` (Ep 12–50) were actually still **private/scheduled** on YouTube. The DB had drifted from reality.
2. Built `scripts/src/reconcile-yt-status.mjs` — queries YouTube Data API `videos.list` (privacyStatus + publishAt) for every Ep 1–65 with a YT id, rewrites status: `published` for public or past publishAt; `scheduled` for private + future publishAt; `scripted` forced for Ep 66–100.
3. Ran reconcile + `seed-episodes.ts` (locks Ep 1–50 from downgrade) + `resync-scheduled.ts` (rebuilds `scheduled_publish_at = post_date + 9h UTC`).
4. Counts after: **published 11, scheduled 54, scripted 35, complete 2 (test).**
5. Dashboard endpoint `GET /api/episodes/stats` reflects the same.
6. Updated: `README.md` Project Status section, `exports/production-log.md` 2026-07-27 entry, **new `docs/production-status.md`** as canonical pipeline snapshot.
7. Memory recorded: `yt-status-reconcile.md`.
8. **Commits pushed:** `de07f8e` (README+log), `8315441` (reconcile script+canonical doc).

### Request 3 — Persistent progress log
*(Session: 2026-07-27, present turn)*

**User said:** "Make progress md file where everything is listed. Major change. My request your action. Add this thing in main instructions that must see that 1st to get to know what is done in the past. List all github comments in older dates."

**Agent did:**
1. Created this file (`PROGRESS.md`) at repo root as the canonical chronological log.
2. Updated `replit.md` to point at PROGRESS.md in its "Start here" section.
3. Added PROGRESS.md pointer to `.agents/memory/MEMORY.md` index.
4. Listed every git commit chronologically (next section).
5. **Commit pushed** *(this turn).*

---

## Git commit history (chronological, oldest → newest)

| Hash      | Date (UTC)           | Message                                                                          |
|-----------|----------------------|----------------------------------------------------------------------------------|
| `7a83a34` | 2026-07-26 22:12:12  | Published your App                                                               |
| `d9b6543` | 2026-07-27 02:13:19  | Fix root cause: remove hardcoded episode-range status logic, add Sync Workbook   |
| `a2eee15` | 2026-07-27 02:31:13  | Fix root cause: remove hardcoded episode-range status logic (mirrored commit)  |
| `45fdcae` | 2026-07-27 02:31:18  | Add daily Facebook auto-publish script (Ep 1–50, 1/day) with safety cleanup       |
| `c95dbe2` | 2026-07-27 02:45:00  | Delete leftover Playwright `.webm` recordings (intermediate export byproduct)    |
| `d47e4d2` | 2026-07-27 02:52:10  | Published your App                                                               |
| `3879b97` | 2026-07-27 02:52:10  | Published your App (mirrored)                                                    |
| `6c654f1` | 2026-07-27 03:08:54  | Update thumbnail + remove notes for Ep 06                                        |
| `998e5c7` | 2026-07-27 03:08:54  | (mirrored) Update thumbnail + remove notes for Ep 06                             |
| `8be66f6` | 2026-07-27 03:29:40  | Schedule FB uploads (not immediate publish): pace 1/day + cadence slots         |
| `6e5dab7` | 2026-07-27 03:29:53  | Remove episode notes + update thumbnails (multiple episodes)                     |
| `87198e8` | 2026-07-27 03:29:53  | (mirrored) Remove episode notes + update thumbnails                              |
| `0620e22` | 2026-07-27 04:05:42  | Update dashboard.html                                                            |
| `4d34aa2` | 2026-07-27 04:08:20  | Fix FB scheduled posts missing title/description                                 |
| `17f5c04` | 2026-07-27 04:08:55  | Update episode thumbnails + clean up unused notes                                |
| `33c84c6` | 2026-07-27 04:08:55  | (mirrored) Update episode thumbnails + clean up unused notes                    |
| `01bfb69` | 2026-07-27 04:09:39  | Published your App                                                               |
| `0f27d6c` | 2026-07-27 04:09:39  | (mirrored) Published your App                                                     |
| `43db884` | 2026-07-27 05:25:46  | Add FB bulk-schedule + batch-render-fb-restore; fix Finish-phase title/desc      |
| `de07f8e` | 2026-07-27 05:29:17  | docs: Project Status + production-log 2026-07-27 YT reconciliation               |
| `8315441` | 2026-07-27 05:29:23  | feat(scripts): reconcile-yt-status + canonical docs/production-status.md        |
| `03b6730` | 2026-07-27 05:30:08  | Update video scene components and project memory tracker                        |
| `dbab846` | 2026-07-27 05:30:08  | (mirrored) Update video scene components and project memory tracker             |
| `ba135b9` | 2026-07-27 05:44:35  | Published your App                                                               |
| `94d4d5d` | 2026-07-27 05:44:35  | (mirrored) Published your App                                                     |

> "Published your App" marks are Replit's automatic deploy notes — they don't change code, they just publish the current `main` snapshot.

> "(mirrored)" rows are commits made by both local replit and Replit's remote-publishing flow that end up with the same tree; deduplicate by tree (`git log --oneline --all`) if a strict linear history is needed.

---

## How to keep this file alive

Append a new section every time:
- A meaningful user request resolves (one row, with commit hash).
- A new incident class or recurring theme becomes visible (one short paragraph).
- A pivot in pipeline direction happens (e.g., social-platform changes).

Skip appends for: typo fixes, infra config, deploy artefacts, files moved inside `artifacts/`.
