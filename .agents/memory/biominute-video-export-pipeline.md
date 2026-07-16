---
name: BioMinute video export pipeline
description: Export script invocation, Playwright + Xvfb requirements, episode build status flow, and how the API server spawns renders.
---

## Export script behavior
- Path: `scripts/src/export-video.ts`
- Env vars: `BIOMINUTE_EXPORT_URL` (URL to capture), `BIOMINUTE_EXPORT_DIR` (output folder)
- Default URL: `http://localhost:5173/` — must match the biominute-reels live workflow port
- Default dir: `/tmp/biominute-export` — API server overrides to `exports/Episode-{NN}-build/` for each episode
- Requires: `libgbm` (Playwright Chromium), `Xvfb` (Linux headless display)
- Uses FFmpeg to mix audio after recording

## API server run-production flow
- `POST /episodes/:id/run-production` sets `buildStage='rendering'` then spawns `npx tsx scripts/src/export-video.ts` detached
- `BIOMINUTE_EXPORT_URL` defaults to `http://localhost:${BIOMINUTE_REELS_PORT || 5173}/`
- `BIOMINUTE_EXPORT_DIR` is set to `{WORKSPACE_ROOT}/exports/Episode-{NN}-build/`
- `GET /episodes/:id/build-status` polls FS via `findVideoPath()` — globs `exports/Episode-{padded}*/episode.mp4` under WORKSPACE_ROOT
- When file found and stage is still `rendering`, auto-advances to `exported`

## Episode status + build stage flow
- Status enum: `draft | complete | review | approved | scheduled | published | building | rejected`
- Build stages: `script_ready → rendering → exported → preview_ready`
- Episodes enter `building` status when created via `POST /episodes`
- `building` episodes with `preview_ready` stage appear in Preview Queue
- Approving from Preview Queue moves to `approved` status (standard publish flow)

## TypeScript project references — critical
- `lib/db`, `lib/api-zod`, `lib/api-client-react` all have `composite: true` tsconfigs with `outDir: dist`
- When any of these source files change, run `npx tsc --build lib/db lib/api-zod lib/api-client-react` from workspace root to rebuild `.d.ts` files
- Without rebuilding, consumer packages (api-server, publishing-dashboard) use stale type declarations
- This causes false-negative type errors even though esbuild bundles correctly from source

**Why:** TypeScript project references use pre-built `.d.ts` files for performance. The esbuild bundler reads source directly, so the app runs fine, but `tsc --noEmit` checks fail until you rebuild.

## WORKSPACE_ROOT resolution in api-server
- API server CWD is `artifacts/api-server/`
- `WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..", "..")` → resolves to the monorepo root
- `exports/` folder is at `{WORKSPACE_ROOT}/exports/`
