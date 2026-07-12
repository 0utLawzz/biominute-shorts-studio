# BioMinute Reels — Project Overview

A simple workspace for making short animated health-science videos (YouTube Shorts / Reels) for the **BioMinute** channel.

## What this project does

- Builds 6-scene vertical videos (9:16, 1080×1920) inside `artifacts/biominute-reels`.
- Tracks every episode in `exports/production-log.md`.
- Keeps scripts, visual direction, and citations in `attached_assets/BioMinute-Episode-Master-Plan_1783643847514.xlsx`.
- Exports the final MP4 to `exports/Episode-NN-slug/` and commits it to GitHub. The user uploads the thumbnail separately.

## Current state

- **Episode 1 — Walk After Meals:** `Complete` (exported and in `exports/Episode-01-Walk-After-Meals/`).
- **Episodes 2–5:** `Uncomplete`. Their export folders were removed and are queued for fresh rebuilds.
- **Episodes 6–36:** `Uncomplete` (planned queue with post dates).
- **Live artifact:** `artifacts/biominute-reels` currently holds **Episode 1** scenes.

> **Format reminder:** every BioMinute video is **9:16 vertical** (1080×1920), not 16:9. The generic video-js skill defaults to 16:9 — this project overrides that.

## Quick start for the next episode

1. Read `exports/production-log.md` and pick the lowest-numbered `Uncomplete` episode.
2. Read that episode's row in the Excel master sheet (`Content_Master` tab).
3. Follow `WORKFLOW.md` to build the scenes in `artifacts/biominute-reels`.
4. Preview the running artifact, then use the **record/export control** to capture the MP4.
5. Save the MP4 to `exports/Episode-NN-slug/`. The user provides the thumbnail separately.
6. Update `exports/production-log.md` and run `pnpm run dashboard:generate`.
7. Push the MP4 to GitHub (see `scripts/push-to-github.sh` — requires `GITHUB_TOKEN` secret).

## Useful commands

| Command | What it does |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm --filter @workspace/biominute-reels run dev` | Start the video player |
| `pnpm --filter @workspace/api-server run dev` | Start the optional API server |
| `pnpm --filter @workspace/mockup-sandbox run dev` | Start the optional design sandbox |
| `pnpm run dashboard:generate` | Regenerate `exports/dashboard.html` |
| `pnpm run typecheck` | Check TypeScript across all packages |
| `bash scripts/push-to-github.sh "message"` | Push changes to GitHub |

## Key files

- `WORKFLOW.md` — step-by-step checklist for every episode.
- `SETUP.md` — full local install/run instructions.
- `TEMPLATE.md` — what this repo looks like when imported as a template.
- `exports/production-log.md` — source-of-truth episode tracker.
- `exports/dashboard.html` — auto-generated visual dashboard.
- `scripts/push-to-github.sh` — helper for auto-pushing after an export.
