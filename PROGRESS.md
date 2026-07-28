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

### Request — Generate source scenes and start Episodes 81–90
*(Session: 2026-07-28 — paused at context limit)*

**User said:** Generate missing Episode 81–90 scenes from the workbook visual direction, then start production.

**Agent did:**
1. Confirmed the workbook contains the Episode 81–90 titles, scripts, visual directions, citations, and CTAs.
2. Added a reusable workbook-driven `GeneratedScene` renderer with topic-aware icons, hook scenes, evidence cards, practical takeaways, and citation/CTA scenes.
3. Generated archived content and Scene0–Scene4 wrappers for Episodes 81–90.
4. Restarted the reels workflow and completed Episode 81:
   - Rendered valid 1080×1920 MP4
   - YouTube ID: `7kq3nB3tTno`
   - Scheduled: 2026-09-19 09:00 UTC
   - DB status: `scheduled`
5. Stopped before Episodes 82–90 because the session reached its context limit. No duplicate uploads were attempted.
6. Pending: synchronize Episode 81 build metadata, verify the generated scene batch, render/upload Episodes 82–90 in small batches, regenerate the dashboard after each batch, and push each completed batch to GitHub.

### Request — Seed the uploaded master workbook without overwriting live state
*(Session: 2026-07-28)*

**User said:** Use the uploaded older workbook to take missing episode data, update the seed script and database, and push the changes to GitHub.

**Agent did:**
1. Used `attached_assets/BioMinute-Master-Workbook_1785267003956.xlsx` as the newest workbook source.
2. Ran the seed successfully: 102 existing rows updated, 0 rows inserted.
3. Preserved all existing YouTube-backed status, post dates, and scheduled publish times, including the completed Episodes 51–80 batches, despite the workbook being older.
4. Updated the seed script so any existing YouTube ID preserves externally managed publish state, not only Episodes 1–50.
5. Confirmed Episodes 81–100 remain scripted and regenerated the static dashboard.
6. Passed scripts typecheck and publishing-dashboard typecheck/build; the existing tooltip sourcemap warning remains non-blocking.

### Request — Produce Episodes 76–80 in small batches
*(Session: 2026-07-28)*

**User said:** Continue production through Episode 80 in small parts because of the session limit, keep publishing completed parts to GitHub, and defer the date correction.

**Agent did:**
1. Produced Episodes 76–78 as one batch, rendering valid 1080×1920 MP4s and uploading private scheduled YouTube videos.
2. Produced Episodes 79–80 as a second batch, rendering valid 1080×1920 MP4s and uploading private scheduled YouTube videos.
3. Preserved all existing database date and schedule values without attempting the later date fix.
4. Synchronized all five rows as `scheduled` / `exported`, regenerated the static dashboard, and restored temporary scene/config swaps.
5. Verified the YouTube schedule successfully (`15 OK, 0 failed`) and pushed the 76–78 batch to GitHub; the 79–80 batch is ready for its separate commit/push.

### Request — Produce Episodes 71–75 in small batches
*(Session: 2026-07-28)*

**User said:** Start production through Episode 75 in small chunks, keep publishing each completed chunk to GitHub, and leave the date issue for a later pass.

**Agent did:**
1. Confirmed Episodes 71–75 were scripted with no existing YouTube IDs.
2. Produced Episodes 71–73 as the first batch, rendering valid 1080×1920 MP4s and uploading private scheduled YouTube videos.
3. Produced Episodes 74–75 as the second batch, again rendering valid 1080×1920 MP4s and uploading private scheduled YouTube videos.
4. Preserved the existing database dates and schedule values without attempting the requested later date fix.
5. Synchronized all five database rows as `scheduled` / `exported`, regenerated the static dashboard, and restored temporary scene/config swaps.
6. Verified the YouTube schedule successfully (`15 OK, 0 failed`) and pushed the first batch to GitHub; the second batch is ready for its separate commit/push.

### Request — Simplify dashboard navigation and finish Episodes 51–65 scheduling
*(Session: 2026-07-28)*

**User said:** Remove the crowded lower pipeline links from the dashboard navigation, keep only Social, Setup, and Analytics, fix Episodes 51–65 scheduling from September 4 onward, finish builds, update the database, schedule YouTube, and push all changes.

**Agent did:**
1. Replaced the overflowing navbar with three compact primary links: Social, Setup, and Analytics.
2. Replaced the long status-filter button row with compact Season and Status selectors.
3. Styled Due Today, Due Tomorrow, and later due dates as distinct queue labels instead of competing countdown controls.
4. Seeded and reconciled the database, then locked Episodes 51–65 to daily 09:00 UTC slots from September 4–18, 2026.
5. Preserved all existing YouTube IDs and schedules; no duplicate uploads were performed.
6. Completed and validated all 15 local MP4 builds at 1080×1920 and synchronized all 15 rows as `scheduled` / `exported`.
7. Verified all 15 YouTube videos are private and scheduled with database timestamps matching exactly.

### Request — Rework Preview placement and replace workbook sync with Seed/Publish actions
*(Session: 2026-07-28)*

**User said:** Change the Preview navigation placement/display and replace the Sync Workbook action with Seed and Publish script actions.

**Agent did:**
1. Separated Preview into a labelled Review navigation group with an eye icon so it is visually distinct from production/status links.
2. Replaced Sync Workbook with a safe Seed action: workbook dry-run first, then an explicit Confirm & Seed Database action.
3. Added a Publish action with episode selection and confirmation; episodes already carrying a YouTube ID are excluded to prevent duplicate uploads.
4. Added the `/api/episodes/seed` endpoint with dry-run-by-default behavior while retaining the existing authenticated API structure.
5. Verified the seed dry-run reports 102 parsed rows, 0 inserts, 102 metadata updates, with the database unchanged.

### Request — Export, schedule, and publish Episodes 66–70
*(Session: 2026-07-28)*

**User said:** Run Episodes 66–70 export, push them to YouTube, update the database and dashboard, and always commit changes to GitHub.

**Agent did:**
1. Exported all five reels as verified 1080×1920 MP4s under descriptive episode folders.
2. Uploaded all five to YouTube as private scheduled videos in the S1 playlist:
   - Ep 66 — `uJODjZB6Gj8` — 2026-09-04 09:00 UTC
   - Ep 67 — `vxpHY1NDL2M` — 2026-09-05 09:00 UTC
   - Ep 68 — `SLpRHodm4Vk` — 2026-09-06 09:00 UTC
   - Ep 69 — `vqtt-fEQoE0` — 2026-09-07 09:00 UTC
   - Ep 70 — `6RFtIo5JoUM` — 2026-09-08 09:00 UTC
3. Updated the database records to `scheduled`, `build_stage=exported`, set `date_built=2026-07-28`, and stored each YouTube video ID.
4. Regenerated `exports/dashboard.html`; Ep 66–70 now show muted MP4 previews, scheduled PKT times, and YouTube links. Active scene/config swaps were restored so they are not left as source changes.
5. Verified each YouTube video has `privacyStatus=private` and the exact expected `publishAt`, verified all five MP4 dimensions, and kept the existing unrelated dashboard artifact change intact.

### Request — Silence reels preview audio and verify Episodes 66–80
*(Session: 2026-07-28)*

**Agent did:**
1. Traced the unexpected preview sound to both the background `AudioEngine` autoplay race and 268 scene-level `<audio>` elements that call `.play()` directly.
2. Made iframe preview mode hard-silent: no audio control is exposed, the background starts muted, and preview media playback is blocked before scene effects run. Export mode remains intentionally audible; FFmpeg still mixes background music into final MP4s.
3. Queried the development database for Episodes 66–80. All 15 remain `scripted`; Ep 66 reports an `exported` build stage and Ep 67–70 report `rendering`, but none has `date_built` or a YouTube video ID, so they are not completed builds.
4. Verified the reels production build with `PORT=25078 BASE_PATH=/biominute-reels/`, publishing-dashboard typecheck/build, diff whitespace checks, and the running reels preview. The dashboard build retains its existing non-blocking tooltip sourcemap warning.


### Request — Integrate the Production Queue dashboard design
*(Session: 2026-07-28)*

**User said:** Apply the selected Production Queue canvas design to the BioMinute Publishing Dashboard artifact.

**Agent did:**
1. Replaced the dashboard body with the approved Production Queue hierarchy while preserving the shared navbar, auth, API data, sync workbook action, filters, episode detail navigation, and PKT timestamp formatting.
2. Added a live-backed Action Required queue using upcoming episodes and a searchable, season/status-filterable dense library.
3. Kept the uploaded reference images untracked and out of the implementation; they remain available under `attached_assets/`.
4. Removed the unsupported `defaultMuted` JSX attribute from the existing preview queue so the dashboard package typecheck passes without changing its existing `muted` behavior.
5. Verified `pnpm --filter @workspace/publishing-dashboard run typecheck`, dashboard build, diff whitespace checks, workflow restart, and clean Vite/API logs. The build retains the pre-existing non-blocking tooltip sourcemap warning.

### Request — Stop dashboard audio and prevent duplicate batch exports
*(Session: 2026-07-28)*

**User said:** Dashboard background music keeps playing even though audio belongs only in reels; also asked why `export-all-episodes.sh` exported Episodes 61–65 twice and requested GitHub batch-push/import guidance.

**Agent did:**
1. Traced the audio source: exported MP4 files intentionally contain BGM/SFX, while dashboard video previews were not enforcing a hard mute boundary.
2. Added `muted`, `defaultMuted`, and inline playback enforcement to the React dashboard preview and generated static dashboard.
3. Regenerated `exports/dashboard.html` so existing static video previews also carry the mute guard.
4. Changed `scripts/export-all-episodes.sh` to accept explicit episode numbers, skip existing MP4s by default, support intentional `FORCE_EXPORT=1` rerenders, and stop auto-pushing.
5. Added the GitHub import/batch checklist to `replit.md` and `.agents/memory/github-batch-import-checklist.md`; no token value was exposed.
6. Restarted the dashboard workflow and verified the updated frontend hot-loaded. Shell syntax, generated dashboard mute attributes, and diff checks passed.

**Root cause of the 61–65 repeat:** the old script had a hard-coded 61–65 list and always ran those five exports whenever invoked; it also committed/pushed automatically, making reruns confusing. The new explicit/idempotent behavior prevents that.

**Known unrelated verification blockers:** dashboard standalone `tsc --noEmit` requires the generated API client build; reels standalone typecheck still reports older Ep73–74 animated-prop errors. Neither comes from the audio/export guard change.

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

### Request 10 — Start Stage 4: create a safe build, verify, and publish runner
*(Session: 2026-07-28)*

**User said:** "Start it. Helping files ko proper structure do. Start runner, then build, build check, render verification, and only then publishing."

**Agent did:**
1. Added a structured pipeline under `scripts/src/pipeline/`:
   - `preflight.ts` checks the database episode and blocks duplicates.
   - `prepare-scenes.ts` loads the selected episode's archived scene source and fails if it is missing.
   - `build.ts` renders into the episode export folder.
   - `verify-build.ts` checks MP4 existence, integrity, duration, and exact 1080×1920 dimensions.
   - `publish-gate.ts` re-checks the verified artifact before calling the existing scheduled/immediate YouTube publisher.
   - `pipeline-runner.ts` runs preflight → scene preparation → build → verify.
2. Publishing is opt-in:
   - `pnpm pipeline:run 66` stops after verification and never uploads.
   - `pnpm pipeline:run 66 --publish` explicitly enables scheduled publishing.
   - `pnpm pipeline:run 66 --publish --now` explicitly enables immediate publishing.
3. Added root and scripts-package commands for each pipeline stage.
4. Added the same verified-video gate to dashboard YouTube and Facebook publishing routes. Invalid, empty, or non-1080×1920 videos cannot be published.
5. Removed the disabled in-process auto-scheduler and its stale scheduler routes from the API server. Publishing remains manual/YouTube-managed.
6. Audited and synchronized the OpenAPI contract with the real workbook sync, social rows, video stream, YouTube repair, Facebook, and analytics routes. Regenerated clients and added a stable API Zod export-normalization step.
7. Updated `docs/RUN.md`, `docs/improvement-plan.md`, and package build commands. The root build now supplies the Reels artifact's required `PORT` and `BASE_PATH`.
8. Verification:
   - Full workspace typecheck passed.
   - Full workspace build passed.
   - OpenAPI codegen passed with generated export normalization.
   - EP66 preflight passed.
   - EP66 verify safely failed because no export exists yet.
   - EP61 runner safely blocked because it already has a YouTube video.
   - Four workflows remain running.

**Stage 4 status: COMPLETE.**

**Next task: Stage 5 — performance pass (async filesystem checks, incremental builds, and render/dashboard efficiency).**

### Request 11 — Start Stage 5: complete the performance pass
*(Session: 2026-07-28)*

**User said:** "Stage 5 karan start. Or katni stages hain?"

**Agent did:**
1. Confirmed that the improvement plan contains five planned stages total; Stage 5 is the final planned stage.
2. Replaced the synchronous `readdirSync`/`existsSync` social-row scan with asynchronous filesystem operations. The exports directory is read once per request and video existence checks run asynchronously.
3. Added the optional `episodes` query filter:
   - `GET /api/episodes/social-rows?episodes=66,67`
   - Invalid or out-of-range values are ignored safely.
   - The dashboard preserves the filter in its query key and request URL.
4. Updated OpenAPI and regenerated the API clients.
5. Converted the six base scene imports in `VideoTemplate.tsx` to lazy dynamic imports. Vite now emits separate Scene0–Scene5 chunks instead of bundling all scenes into the initial reels JavaScript.
6. Kept TypeScript incremental compilation enabled and added a predictable per-project `.cache/tsbuildinfo` location through the shared base config.
7. Fixed and verified the Reels workflow after a stale process temporarily held port 25078.
8. Verification:
   - OpenAPI codegen passed.
   - Full workspace typecheck passed.
   - Full workspace build passed.
   - Production output contains separate lazy scene chunks.
   - Unauthenticated filtered social-row request returns 401 as expected.
   - All four workflows are running.

**Stage 5 status: COMPLETE.**

**Improvement roadmap status: COMPLETE — five planned stages finished.**

---
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
