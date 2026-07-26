# BioMinute Shorts Studio

An automated AI-powered production pipeline for health-science YouTube Shorts — managing the full lifecycle from a spreadsheet-based master plan through to published vertical (9:16) videos.

**Version:** `v0.2.0` (see `VERSION.md`)

## Project Structure

```
artifacts/
  api-server/          Express 5 API, port 8080, path /api
  publishing-dashboard/ React+Vite publishing UI (main website), port 24083, path /
  biominute-reels/     Video animation engine (React+Framer Motion), port 25078, path /biominute-reels/
lib/
  db/                  Drizzle ORM schema + database client (@workspace/db)
  api-spec/            OpenAPI 3.1 spec + generated Zod schemas and React Query hooks
scripts/
  src/seed-episodes.ts     Seeds episodes table from master XLSX
  src/upload-now.ts       Manual one-off immediate YouTube upload
  src/schedule-upload.ts  Manual one-off scheduled YouTube upload
  src/youtube-reauth.ts   Generate a fresh YouTube refresh token
  src/export-video.ts     Render current episode to MP4 + regenerate dashboard
  src/generate-dashboard.ts  Regenerate exports/dashboard.html from DB
  src/verify-export.ts    Verify MP4 resolution is 1080×1920
  src/verify-youtube-scheduled.ts  Verify YouTube scheduled status for uploaded episodes
exports/               Output directory for generated MP4s, thumbnails, production-log.md, dashboard.html
docs/                  Project documentation, including the social platform setup guide
attached_assets/       Master plan XLSX, brand assets, logos, screenshots
.github/workflows/   GitHub Actions (Neon PR branch automation)
```

## How to Run

All three workflows start automatically:
- **API Server**: `artifacts/api-server: API Server` workflow (port 8080, path `/api`)
- **Publishing Dashboard**: `artifacts/publishing-dashboard: web` workflow (port 24083, path `/`) — main website
- **BioMinute Reels**: `artifacts/biominute-reels: web` workflow (port 25078, path `/biominute-reels/`)

To reseed the database from the master XLSX:
```
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
```

To export the current episode to MP4:
```
BIOMINUTE_EXPORT_DIR="exports/Episode-NN-<slug>" pnpm run export-video
```

To manually upload an episode immediately:
```
pnpm --filter @workspace/scripts exec tsx ./src/upload-now.ts 4
```

To manually upload an episode as scheduled:
```
pnpm --filter @workspace/scripts exec tsx ./src/schedule-upload.ts 51
```

To generate a fresh YouTube refresh token:
```
pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts
```

To verify scheduled episodes on YouTube:
```
pnpm --filter @workspace/scripts exec tsx ./src/verify-youtube-scheduled.ts
```

## Database

Uses `DATABASE_URL` (Neon) as the primary database, with built-in Replit PostgreSQL (`PGHOST`/`PGDATABASE`/`PGUSER`/`PGPASSWORD`) as a fallback.

Schema is managed with Drizzle ORM. To push schema changes:
```
cd lib/db && pnpm exec drizzle-kit push --force --config ./drizzle.config.ts
```

## Environment Secrets

All required secrets are configured:
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — Neon Postgres connection strings (primary)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — built-in Replit Postgres (fallback)
- `SESSION_SECRET` — Express session signing
- `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` — YouTube OAuth
- `YOUTUBE_CHANNEL_ID`, `YOUTUBE_CHANNEL_NAME` — channel info
- `YOUTUBE_PLAYLIST_S1`–`S6` — season playlist IDs
- `GITHUB_TOKEN` — for pushing exports to the repository
- `NEON_API_KEY` — for PR branch automation workflow
- `NEON_PROJECT_ID` — GitHub repository variable for Neon PR branch automation

## Key Scripts

| Script | Purpose |
|--------|---------|
| `pnpm run export-video` | Export current episode to MP4 (needs ffmpeg + Playwright) |
| `pnpm run dashboard:generate` | Regenerate static HTML dashboard from the database |
| `pnpm run typecheck` | TypeScript validation across workspace |
| `pnpm --filter @workspace/db run push-force` | Push schema to the database |
| `pnpm --filter @workspace/scripts exec tsx ./src/upload-now.ts <ep>` | Manual one-off immediate YouTube upload |
| `pnpm --filter @workspace/scripts exec tsx ./src/schedule-upload.ts <ep>` | Manual one-off scheduled YouTube upload |
| `pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts` | Generate a fresh YouTube refresh token |
| `pnpm --filter @workspace/scripts exec tsx ./src/verify-youtube-scheduled.ts` | Verify scheduled episodes on YouTube |

## Social Platforms

To connect YouTube, Facebook, TikTok, Instagram, X/Twitter, or LinkedIn, see `docs/Social-Platforms-Setup.md`. It covers required credentials, OAuth steps, token types, how to extend Facebook tokens, and how credentials flow into Replit Secrets.

## GitHub Actions

`.github/workflows/neon_workflow.yml` creates a Neon database branch for every pull request and deletes it when the PR closes. It requires `NEON_API_KEY` (secret) and `NEON_PROJECT_ID` (repository variable).

## User Preferences

- Keep existing project structure and stack intact.
- Prefer `DATABASE_URL` (Neon) in production; use built-in Replit Postgres only as a fallback.
- Use the canonical description template for every YouTube upload.
- Never upload an episode twice; the upload guard blocks duplicates.
- Regenerate the dashboard after every export so it stays current.
- The BioMinute agent skill is at `.agents/skills/biominute/SKILL.md` — it is the source of truth for how a new Replit Agent session should discover the project, build episodes, run the export/publish pipeline, and invoke the security-review subagent.
