# BioMinute Reels — Template Contract

This repository is a **template** for producing a series of short animated health-science videos (YouTube Shorts / Reels) for the BioMinute channel.

## What you get after importing

- A working `pnpm` workspace with Node.js 24 and TypeScript 5.9.
- A pre-scaffolded video-js artifact at `artifacts/biominute-reels` for React + Framer Motion animated shorts.
- A 36-episode production plan in `exports/production-log.md`.
- Episode master data in `attached_assets/BioMinute-Episode-Master-Plan_1783643847514.xlsx`.

## State at import time

- Run `pnpm install` first to install dependencies.
- The API server expects `DATABASE_URL`. The video artifact does not need it.
- Background music and SFX should be added to each new episode.

## How to continue production

1. Read `README.md`, `SETUP.md`, and `WORKFLOW.md`.
2. **Say the 9:16 commitment out loud:** *"I will build every BioMinute video in 9:16 vertical (1080×1920), not 16:9."* The generic video-js skill defaults to 16:9; BioMinute requires 9:16.
3. Find the next `Uncomplete` episode in `exports/production-log.md`.
4. Read that episode's row from the Excel master sheet (`Content_Master` tab).
5. Build the episode by overwriting `artifacts/biominute-reels/src/components/video/video_scenes/Scene0.tsx` through `Scene5.tsx`.
6. Keep the existing brand identity and **9:16 vertical** format.
7. Add background music and SFX.
8. Verify in the preview, then export via the record control.
9. Save the MP4 to `exports/Episode-NN-slug/`. The user uploads the thumbnail separately. Update `exports/production-log.md`.
10. Regenerate `exports/dashboard.html` and push to GitHub.

## Single-artifact constraint

Only one episode's scenes are live at any moment. The current live episode is noted in `exports/production-log.md`. Rebuild any earlier episode before exporting it if it was never exported.
