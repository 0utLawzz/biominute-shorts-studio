---
name: BioMinute video export pipeline
description: Export script env vars, build-stage flow, TypeScript project references rebuild required after lib changes.
---

# BioMinute Video Export Pipeline

## Current production state (as of 2026-07-25)
- Episodes 1–50: status `published` on YouTube (uploaded with video IDs)
- Episodes 51–55: status `scheduled` on YouTube (video IDs present, future post dates)
- Episodes 56–65: status `scripted` in DB — scene files exist, not yet exported
- By post date today (~9 aired publicly): eps 1–9 have post_date ≤ 2026-07-24

## Scene file naming & location
- `artifacts/biominute-reels/src/components/video/video_scenes/`
- Pattern: `ep{N}_Scene{0-4}.tsx` (5 scenes per episode, Scene5 = ThumbnailSlide shared)
- Export script physically copies `ep{N}_Scene{i}.tsx` → `Scene{i}.tsx` before recording

## Export pipeline flow
1. Vite dev server starts on `PORT=25078` (matches `BIOMINUTE_EXPORT_URL`)
2. `export-all-episodes.sh` iterates episodes, swaps scene files via `cp`, updates config.ts comment (triggers HMR)
3. `scripts/src/export-video.ts` uses Playwright + ffmpeg to record → MP4
4. Output: `exports/Episode-NN-slug/episode.mp4`

## Critical env vars for export
- `BIOMINUTE_EXPORT_URL`: must be `http://localhost:25078/biominute-reels/` (trailing slash required, port 25078)
- `BIOMINUTE_EXPORT_DIR`: temp dir for Playwright recording (e.g. `/tmp/biominute-ep56`)
- tsx must be called via `node_modules/.bin/tsx` not bare `tsx` (not in PATH when run via pnpm exec)

**Why:** The Vite dev server for biominute-reels binds to port 25078 (the artifact's assigned port). Using 5173 or other ports will fail.

## How to apply
Run `bash scripts/export-all-episodes.sh` from workspace root. Script handles server startup, scene swapping, export, and git push. The script is pre-configured for the current batch of episodes (update `EPISODES` array for each batch).
