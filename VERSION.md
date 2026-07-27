# BioMinute Shorts Studio — Version History

Project follows [Semantic Versioning](https://semver.org/).

## v0.2.1 — 2026-07-27

### Fixed
- **Root cause removed:** Deleted the hardcoded episode-range status logic (51–65 → complete, 66–100 → scripted) from `scripts/src/seed-episodes.ts`. Status for every episode now comes exclusively from the workbook's own Status column via `workbookStatusToDb()` — no episode-number special-casing anywhere.
- **Auto-schedule on export:** `GET /episodes/:id/build-status` now automatically sets `status = "scheduled"` and computes `scheduledPublishAt` (postDate + 09:00 UTC) when a rendering episode's video file appears — no manual approval click needed.

### Added
- **Sync Workbook button** on the publishing dashboard Overview page. Clicking it POSTs to `POST /api/episodes/sync-workbook`, re-reads the master XLSX, upserts all episodes, and refreshes the page data — no terminal required.

## v0.2.0 — 2026-07-26

### Added
- Expanded episode master workbook from 50 to 100 regular episodes + 2 test slots.
- Seed rules for episodes 51–65 (`approved`) and 66–100 (`scripted`) while preserving live state for 1–50.
- Live pipeline status header in the publishing dashboard Navbar (`/api/episodes/stats` + system-health readout).
- Social platform connection guide (`docs/Social-Platforms-Setup.md`) covering YouTube, Facebook, TikTok, Instagram, X/Twitter, and LinkedIn.
- Neon PR branch automation workflow (`.github/workflows/neon_workflow.yml`) that creates a database branch for every pull request and deletes it when the PR closes.
- YouTube re-authorization script (`scripts/src/youtube-reauth.ts`) to generate a fresh `YOUTUBE_REFRESH_TOKEN`.

### Changed
- Updated project documentation (`README.md`, `docs/INSTALL.md`, `docs/RUN.md`, `docs/USAGE.md`, `docs/CONTRIBUTING.md`) to reflect the 100-episode pipeline and current commands.
- Publishing dashboard is now the root website artifact (`previewPath = "/"`).
- Renamed generic `Episode-51-build` … `Episode-55-build` export folders to descriptive slugs.
- Cleaned up old/duplicate workbook files from `attached_assets/`.

### Fixed
- Database status for episodes 51–65 now matches their real YouTube state (`scheduled` after upload).
- Facebook publishing references removed from the dashboard; column kept in the database for historical reference only.

## v0.1.0 — 2026-07-17

Initial versioned release after production pipeline launch.

### Added
- Canonical YouTube description builder (`buildYouTubeDescription`) locked to the BioMinute template.
- Duplicate-upload guard (`assertNotAlreadyPublished`) on every publish path (dashboard, scheduler, manual trigger).
- Live dashboard (`exports/dashboard.html`) reads from the database and shows YouTube status, publish dates, and scheduled times.
- Auto-dashboard generation after every `export-video` run.
- Manual `POST /api/episodes/:epNumber/publish-now` endpoint for immediate uploads.
- Two pipeline test slots (`TEST-1`, `TEST-2`) reserved for smoke-testing before daily rollout.
- Episode range extended from 36 to 50 topics in the master workbook.

### Fixed
- Duplicate YouTube upload for Episode 3 prevented by the new guard.
- Broken description template that leaked `CITATION:` / `CTA:` labels into live descriptions.
- API server port conflicts and stale Neon connection handling.

### Changed
- Database connection now prefers `DATABASE_URL` (Neon) with PG* vars as fallback.
- All 36 episodes marked `approved` in the database so no manual approval gate blocks publishing.
- Dashboard no longer relies solely on `exports/production-log.md`; it reflects live DB state.
