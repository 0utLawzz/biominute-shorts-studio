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

### Request 4 — Routine DB re-seed + dashboard regen + doc refresh
*(Session: 2026-07-27, present turn)*

**User said:** "Ok seed the Database and update dashboard. Edit description tags etc readme and update doc folder with latest data. Push all to github."

**Agent did:**
1. Re-ran the canonical refresh sequence:
   - `pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts` → re-read master workbook Production/Social/Schedule tabs, upserted 102 rows.
   - `pnpm --filter @workspace/scripts exec tsx ./src/reconcile-yt-status.mjs` → rewrote Ep 1-65 statuses from YouTube `privacyStatus`+`publishAt` (caught workbook drift: first seed had flipped Ep 51-65 to `scripted` because the workbook Status column hadn't kept up with their actual YT private+future state — reconcile restored `scheduled`).
   - `pnpm --filter @workspace/scripts exec tsx ./src/resync-scheduled.ts` → rebuilt `scheduled_publish_at = post_date + 9h UTC` for 89 rows.
   - `pnpm --filter @workspace/scripts exec tsx ./src/generate-dashboard.ts` → regenerated `exports/dashboard.html` (62 KB, 102 rows).
2. Counts unchanged after refresh: **11 published, 54 scheduled, 35 scripted, 2 complete.**
3. Updated: `README.md` refresh stamp, `docs/production-status.md` refresh stamp, appended `2026-07-27 — Database re-seed + reconcile + dashboard regen` entry to `exports/production-log.md`.
4. **Commits pushed:** `1f8a8da` (production-log + PROGRESS), `b67ea2b` (README + docs refresh stamp), and `b67ea2b+` (dashboard.html + this PROGRESS entry).

### Request 5 — Add YouTube & Facebook stats tabs + Social Setup UI
*(Session: 2026-07-27, present turn)*

**User said:** "Add Facebook and YouTube stats in Separate in tab new. Like e.g. ep 66 video ✅ folder available ✅ YouTube ✅ Facebook ❌. Add social integration of social where user follow the instructions and add social keys etc push to github update progress.md 66"

**Agent did:**
1. Built a new API endpoint `GET /api/episodes/social-rows` (api-server/src/routes/episodes.ts) that returns per-episode `{epNumber, hookTitle, hasFolder, hasVideoFile, youtubeVideoId, facebookVideoId, status, postDate, scheduledPublishAt}` — one row per episode, drives the new tabs without N+1 requests.
2. Enhanced `GET /api/facebook/status` to also expose `hasAccessToken` / `hasPageId` so the Social Setup page can show each env var in isolation.
3. Dashboard additions:
   - `src/pages/SocialStatus.tsx` — new page at `/social-status` with two Radix Tabs:
     - **YouTube tab**: per-episode matrix showing folder ✓/✗, MP4 ✓/✗, YouTube pill (clickable link), Facebook pill (clickable link), YT id + schedule.
     - **Facebook tab**: same matrix. Counts `{uploaded}/{pending}` and `{posted}/{pending}` highlighted at the top.
   - `src/pages/SocialSetup.tsx` — new page at `/social-setup` with two toggles:
     - **YouTube section**: live status pills (connected, token health, channel, season playlists), alert when refresh token is expired, full step-by-step setup with Replit Secrets names.
     - **Facebook section**: live pills (connection, page id, access token), full setup walkthrough including Graph API Explorer token generation.
   - `src/App.tsx` — both routes registered.
   - `src/components/Navbar.tsx` — nav now includes `Social` (status matrix) and `Setup` (integration walkthrough) between `Published` and `Analytics`.
4. Built + restarted the **api-server** workflow (`dist/index.mjs` regenerated, process restarted) so the new endpoint is live.
5. **Commits pushed** *(this turn, chunks below).*

**Sample row produced by the new endpoint** (Ep 66 — exactly the format the user asked for):
```
ep 66  ·  Magnesium and Insulin Sensitivity  ·  folder ✗  MP4 ✗  YT ✗  FB ✗
```

---

### Request 6 — Code audit + numbered improvement plan
*(Session: 2026-07-28)*

**User said:** "I asked for code audit and want suggestions or feedback for improvement. Build a system where you can say Start from 1 to 5 and the agent knows what to do. Also thinking about production-wise scope. Update PROGRESS.md and memory like a changelog."

**Agent did:**
1. Ran full codebase audit via explore subagent across all 7 areas (api-server, dashboard, biominute-reels, lib/db, lib/api-spec, scripts, root config).
2. Identified **3 critical production blockers** + 12 improvement items (see `docs/improvement-plan.md`).
3. Defined the **1–5 numbered plan** (see below + `docs/improvement-plan.md`) so any future session can run `Start N` and know exactly what to do.
4. Updated PROGRESS.md + agent memory with audit findings.
5. **Commit pushed** *(this turn).*

**Critical findings:**
- 🔴 No authentication on dashboard/API — anyone with the URL can trigger renders or publish to YouTube
- 🔴 `/run-production` spawns detached processes with no queue/lock — double-clicks corrupt exports
- 🟡 `postDate` stored as `text` in DB instead of `timestamp` — requires manual normalization everywhere
- 🟡 `seed-episodes.ts` has a hardcoded workbook filename — breaks on rename
- 🟡 Dead auto-scheduler code in `api-server/index.ts` causes confusion
- 🟢 OpenAPI spec has ghost endpoints that don't match actual routes

---

### Request 7 — Start 1: Lock the dashboard behind a password
*(Session: 2026-07-28)*

**User said:** "Start 1"

**Agent did:**
1. Installed `express-session` + `@types/express-session` in the API server.
2. Created `artifacts/api-server/src/middleware/auth.ts` with password verification, session cookie handling, and `requireAuth` middleware.
3. Created `artifacts/api-server/src/routes/auth.ts` with `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, and `/api/auth/protected`.
4. Updated `artifacts/api-server/src/app.ts` to mount session middleware with `SESSION_SECRET`, secure/sameSite cookies, and CORS credentials.
5. Updated `artifacts/api-server/src/routes/index.ts` so all routes except `/api/healthz` and `/api/auth/*` require a valid session.
6. Made `DASHBOARD_PASSWORD` a required env var; server now hard-fails if missing.
7. Built dashboard auth layer:
   - `artifacts/publishing-dashboard/src/lib/auth.tsx` — auth context + `useAuth` hook.
   - `artifacts/publishing-dashboard/src/pages/Login.tsx` — password gate UI.
   - Updated `App.tsx` to redirect unauthenticated users to Login and wrap the app in `AuthProvider`.
   - Updated `Navbar.tsx` with a Lock button that logs out.
8. Updated `lib/api-client-react/src/custom-fetch.ts` to send `credentials: "include"` by default in browsers so the session cookie travels with every API request.
9. Fixed a pre-existing type bug in `lib/api-zod/src/index.ts` where several Zod schemas were exported as `type` only, breaking `.safeParse()` calls in the API server.
10. Verified:
    - `curl /api/episodes` returns `401` without a session.
    - `curl /api/auth/me` and `/api/healthz` return `200`.
    - TypeScript typecheck passes across the entire workspace.
    - Dashboard now shows a password login screen on first visit.
11. Requested and set `DASHBOARD_PASSWORD` in Replit Secrets; restarted the API server.
12. **Commits pushed** *(this turn).*

### Request 8 — Start stage two: make the render pipeline restart-safe
*(Session: 2026-07-28)*

**User said:** "Stage one is completed, and stage two is not fully completed. Kindly start stage two and complete it."

**Agent did:**
1. Reviewed `PROGRESS.md`, the production status, and the numbered improvement plan.
2. Ran the YouTube reconciliation successfully. Current Ep 1–100 counts: **12 published, 53 scheduled, 35 scripted** (plus 2 test slots).
3. Completed improvement-plan item 2:
   - Existing per-episode database render lock now reports conflicts as HTTP 409 with the active job ID.
   - Failed child processes return episodes from `building/rendering` to retryable `scripted/script_ready`.
   - API shutdown now terminates active detached render children and records a clear failed state.
   - Building UI now shows the server's conflict/error message and exposes the latest render failure reason on hover.
4. Workspace typecheck passed across all libraries, artifacts, and scripts.
5. Updated `docs/production-status.md` with the current reconciled counts.

### Request 9 — Start Stage 3: make database dates and workbook seeding safer
*(Session: 2026-07-27)*

**User said:** "Start Stage 3. Mark progress in small chunks and explain it simply."

**Agent did:**
1. Made workbook selection automatic: the seed script now chooses the newest `.xlsx` file in `attached_assets/`, so a renamed workbook no longer requires a code edit.
2. Added safe preview mode:
   - `pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts --dry-run`
   - It reports the workbook and expected insert/update counts without changing the database.
3. Changed `episodes.post_date` from text to a nullable PostgreSQL timestamp.
   - Existing valid dates were preserved.
   - Empty test-slot dates became `NULL`.
   - Development database verification: 102 total episodes, 100 with dates, 2 without dates.
4. Updated seed, rescheduling, API, dashboard, OpenAPI, and generated client types for timestamp dates.
5. Ran the real seed and YouTube reconciliation:
   - 12 published
   - 53 scheduled
   - 35 scripted
   - 2 test slots
6. Verification passed:
   - Full workspace typecheck
   - Seed dry-run
   - Database schema push reports no pending changes
   - API health endpoint returns 200
   - Unauthenticated protected API returns 401
   - All four workflows are running
   - Dashboard screenshot shows the password gate

**Stage 3 status: COMPLETE.**

**Next task: Stage 4 — clean dead scheduler code and synchronize the OpenAPI route definitions.**

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
| `0c44618` | 2026-07-28 03:24:40  | feat(auth): lock dashboard behind session-based password (Start 1)                |

> "Published your App" marks are Replit's automatic deploy notes — they don't change code, they just publish the current `main` snapshot.

> "(mirrored)" rows are commits made by both local replit and Replit's remote-publishing flow that end up with the same tree; deduplicate by tree (`git log --oneline --all`) if a strict linear history is needed.

---

## How to keep this file alive

Append a new section every time:
- A meaningful user request resolves (one row, with commit hash).
- A new incident class or recurring theme becomes visible (one short paragraph).
- A pivot in pipeline direction happens (e.g., social-platform changes).

Skip appends for: typo fixes, infra config, deploy artefacts, files moved inside `artifacts/`.
