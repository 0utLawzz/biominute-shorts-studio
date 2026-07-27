# BioMinute Shorts Studio — Improvement Plan

> **How to use this:** Tell the agent `"Start N"` (e.g. `"Start 1"`) and it will execute that numbered item end-to-end — all code, tests, commits, and PROGRESS.md update included. Items are ordered by impact: do 1 before 2, etc.

Last audit: **2026-07-28**

---

## 🔴 1 — Lock the dashboard behind a password (Security)

**Why it matters:** The dashboard and API are fully public. Anyone who finds the URL can trigger a YouTube publish, start a video render, or read your episode schedule. This is a production blocker.

**What gets built:**
- Simple passphrase-based session auth on the Express API (`SESSION_SECRET` already exists in secrets)
- Login page on the dashboard — unauthenticated requests redirect there
- All `/api/*` routes require a valid session cookie
- Session stored server-side (no JWT, no external service needed)

**Files touched:** `artifacts/api-server/src/middleware/`, `artifacts/api-server/src/index.ts`, `artifacts/publishing-dashboard/src/`

---

## 🔴 2 — Fix the render queue so double-clicks can't corrupt exports

**Why it matters:** `POST /api/episodes/:ep/run-production` spawns a detached `tsx` process with no lock. If it's clicked twice, two render processes race over the same output folder — one overwrites the other's frames mid-render, producing a broken MP4.

**What gets built:**
- In-memory render lock per episode number (rejects a second request while one is running)
- Active render status tracked and exposed via `GET /api/episodes/:ep/render-status`
- Dashboard "Build" button goes to a loading/progress state while render is active, preventing re-click
- Clean process teardown on server restart

**Files touched:** `artifacts/api-server/src/routes/episodes.ts`, `artifacts/publishing-dashboard/src/pages/EpisodeDetail.tsx`

---

## 🟡 3 — Fix the seed script so it survives a workbook rename

**Why it matters:** `seed-episodes.ts` has the workbook filename hardcoded. When the XLSX is updated (a new version is exported from Google Sheets), the script silently fails unless someone edits the source code.

**What gets built:**
- Script auto-discovers the newest `.xlsx` in `attached_assets/` instead of hardcoding the name
- Dry-run mode (`--dry-run` flag) prints what would change without touching the DB
- Fix `postDate` column type from `text` → `timestamp` in the Drizzle schema so date math works natively in queries (currently done manually in 6 places in the API)

**Files touched:** `scripts/src/seed-episodes.ts`, `lib/db/schema/episodes.ts`, migration needed

---

## 🟡 4 — Clean up dead code and sync the OpenAPI spec

**Why it matters:** The auto-scheduler block in `api-server/index.ts` (marked disabled) and ghost endpoints in `lib/api-spec/openapi.yaml` create confusion for every future agent session — they suggest features that don't exist or routes that don't match.

**What gets built:**
- Remove the dead auto-scheduler block from `index.ts`
- Audit all routes in `openapi.yaml` against actual Express routes; add missing ones, remove ghosts
- Split `artifacts/api-server/src/routes/episodes.ts` (~500 lines) into focused sub-files: `episodes-core.ts`, `episodes-social.ts`, `episodes-production.ts`
- Regenerate Orval hooks after spec fixes

**Files touched:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/routes/episodes.ts`, `lib/api-spec/openapi.yaml`

---

## 🟢 5 — Performance pass: async I/O + incremental TypeScript builds

**Why it matters:** `readdirSync`/`existsSync` in the API block Node's event loop while scanning the `exports/` directory (will get worse as exports grow). TypeScript cold-start is slow because `incremental` mode isn't enabled.

**What gets built:**
- Replace all `readdirSync`/`existsSync` in `episodes.ts` with `fs/promises` equivalents
- Add `"incremental": true` to `tsconfig.base.json` with a shared `tsBuildInfoFile`
- Lazy-load scene components in `biominute-reels` (dynamic `import()`) so unused scenes don't bloat the render bundle
- Add a `?episodes=1,2,3` batch filter to the `social-rows` endpoint to avoid scanning all 100 episodes on every page load

**Files touched:** `artifacts/api-server/src/routes/episodes.ts`, `tsconfig.base.json`, `artifacts/biominute-reels/src/VideoTemplate.tsx`

---

## Summary table

| # | Severity | What | Effort |
|---|----------|------|--------|
| 1 | 🔴 Critical | Dashboard authentication | ~2h |
| 2 | 🔴 Critical | Render queue + process lock | ~1.5h |
| 3 | 🟡 Important | Seed script resilience + DB type fix | ~1h |
| 4 | 🟡 Important | Dead code removal + API spec sync | ~1h |
| 5 | 🟢 Nice-to-have | Async I/O + incremental TS builds | ~1h |

**To execute any item:** say `"Start 1"` (or 2, 3, 4, 5) and the agent will handle it end-to-end.
