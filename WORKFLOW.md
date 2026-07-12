# BioMinute Reel Production Workflow

A simple checklist for creating any BioMinute episode. Follow it every time.

## Before you start

1. Confirm the 9:16 format: **"I will build every BioMinute video in 9:16 vertical (1080×1920), not 16:9."**
2. Read `exports/production-log.md` and find the lowest-numbered episode with status `Uncomplete`.
3. Read that episode's row in `attached_assets/BioMinute-Episode-Master-Plan_1783643847514.xlsx` (sheet `Content_Master`) for the exact script, citation, visual direction, CTA, hashtags, and thumbnail prompt.
4. Check the existing `artifacts/biominute-reels/src/components/video/video_scenes/` to understand the current brand execution.

## Build the episode

1. Overwrite `Scene0.tsx` through `Scene5.tsx` in `artifacts/biominute-reels/src/components/video/video_scenes/` with the new episode's content.
2. Keep the brand identity:
   - Dark navy/slate `#0F172A`
   - Teal `#14b8a6`, emerald `#10b981`, orange `#f97316`, blue `#2F6FED`
   - No red
   - BioMinute logo, DNA/heartbeat motif
3. Keep **9:16 vertical** format. All scenes must fill the vertical canvas.
4. Add background music and minor SFX. Place audio files in `artifacts/biominute-reels/public/audio/` and wire them in `VideoTemplate` / `VideoWithControls`.
5. Use the video-js quality bar: layered scenes, choreographed motion, custom transitions, no slideshow fades.
6. Include the citation on screen (small corner or end-card).
7. End with the BioMinute logo/brand outro and the episode's CTA as on-screen text.

## Verify

1. Restart the workflow: `pnpm --filter @workspace/biominute-reels run dev` or restart the Replit workflow.
2. Open the preview and watch the full loop at least twice.
3. Check that no 16:9 composition snuck in and all text is readable at 9:16.

## Export

1. Use the preview's built-in **record/export control** to capture the MP4.
2. The user uploads the 1080×1920 thumbnail separately. Place the MP4 in `exports/Episode-NN-slug/` as `episode.mp4` and the user-provided thumbnail as `thumbnail.png`.
4. Update `exports/Episode-NN-slug/episode-notes.md` with build/export notes.
5. Update `exports/production-log.md`: set status to `Complete`, set `Date Completed`, and note the exported MP4 and user-provided thumbnail.
6. Regenerate the dashboard: `pnpm run dashboard:generate`.
7. Push to GitHub:
   - Make sure `GITHUB_TOKEN` is set as a Replit Secret (classic PAT with `repo` scope).
   - Run `bash scripts/push-to-github.sh "Episode N: Title exported"`.

## Important rules

- The artifact holds **one episode at a time**. If you build Episode 7 before exporting Episode 6, Episode 6's scenes will be overwritten.
- Always export before moving to the next episode, or explicitly tell the user which episode is currently live.
- Never commit API keys or tokens. Only `GITHUB_TOKEN` should live as a Replit Secret.

## Status definitions

- `Uncomplete` — not yet built or exported.
- `Built — awaiting export` — scenes are live in the artifact, waiting for MP4/thumbnail export.
- `Complete` — `episode.mp4` is in the episode's `exports/` folder and committed to GitHub; the user-provided `thumbnail.png` is also included.
