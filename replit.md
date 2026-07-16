# BioMinute Shorts Studio

An automated AI-powered production pipeline for health-science YouTube Shorts — managing the full lifecycle from a spreadsheet-based master plan through to published vertical (9:16) videos.

## Project Structure

```
artifacts/
  api-server/          Express 5 API, port 8080, path /api
  publishing-dashboard/ React+Vite publishing UI, port 24083, path /publishing-dashboard/
  biominute-reels/     Video animation engine (React+Framer Motion), port 25078, path /biominute-reels/
  biominute-deck/      Investor slide deck, port 22186, path /biominute-deck/
lib/
  db/                  Drizzle ORM schema + database client (@workspace/db)
  api-spec/            OpenAPI 3.1 spec + generated Zod schemas and React Query hooks
scripts/
  src/seed-episodes.ts  Seeds episodes table from master XLSX
exports/               Output directory for generated MP4s, thumbnails, production-log.md
attached_assets/       Master plan XLSX, logos, thumbnails zip
```

## How to Run

Both workflows start automatically:
- **API Server**: `artifacts/api-server: API Server` workflow (port 8080)
- **Publishing Dashboard**: `artifacts/publishing-dashboard: web` workflow (port 24083)

To reseed the database from the master XLSX:
```
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
```

To export a video episode:
```
pnpm run export-video
```

## Database

Uses the built-in Replit PostgreSQL (PGHOST/PGDATABASE/PGUSER/PGPASSWORD env vars). The db client in `lib/db/src/index.ts` prefers individual PG* vars over DATABASE_URL so the local database is always used on Replit.

Schema is managed with Drizzle ORM. To push schema changes:
```
cd lib/db && pnpm exec drizzle-kit push --force --config ./drizzle.config.ts
```

## Environment Secrets

All required secrets are configured:
- `SESSION_SECRET` — Express session signing
- `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` — YouTube OAuth
- `YOUTUBE_CHANNEL_ID`, `YOUTUBE_CHANNEL_NAME` — channel info
- `YOUTUBE_PLAYLIST_S1`–`S6` — season playlist IDs
- `GITHUB_TOKEN` — for pushing exports to the repository

Note: `DATABASE_URL` secret points to an external Neon database with stale credentials. The app currently uses the local Replit PostgreSQL instead.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `pnpm run export-video` | Export current episode to MP4 (needs ffmpeg + Playwright) |
| `pnpm run dashboard:generate` | Regenerate static HTML dashboard from production-log.md |
| `pnpm run typecheck` | TypeScript validation across workspace |
| `pnpm --filter @workspace/db run push-force` | Push schema to local DB |

## User Preferences

- Keep existing project structure and stack intact
- Local Replit PostgreSQL preferred over external Neon DB on Replit
