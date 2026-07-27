# Episode 2 — Drink Water Before Your Morning Coffee

## Status: Complete — exported, published, dashboard updated

## Build
- Scenes: `Scene0.tsx` – `Scene5.tsx` + `ThumbnailSlide.tsx` in `artifacts/biominute-reels/src/components/video/video_scenes/`, rebuilt by a design subagent following the locked BioMinute brand system (colors, springs, transitions, typography) and the master-plan data for Episode 2.
- Format: 9:16 vertical, 1080×1920.
- Script beats: overnight fluid loss → hydration/alertness → coffee's mild diuretic effect → "water first, coffee second" swap → citation → CTA/outro.
- Citation: Popkin BM et al. (2010), Nutrition Reviews — shown low-contrast near the end of Scene 4.
- CTA: "Do you reach for water or coffee first thing?"
- Audio: reused the existing locked `background.mp3` track and existing SFX files (no new music generated, per the "same track across every episode" rule).

## Export
- Exported with `pnpm run export-video` (Playwright headless Chromium recording at 1080×1920 + ffmpeg mux with `background.mp3`).
- Verified with `pnpm --filter @workspace/scripts verify-export` → PASS, 1080x1920.
- File: `episode.mp4` in this folder.
- Note: the export script falls back to a fixed ~43.5s recording window when it can't read `__biominuteTotalDuration__` from the page (same behavior observed for Episode 1's export) — the captured clip may include a bit of loop restart at the end. Pre-existing pipeline behavior, not introduced by this build.

## Outstanding
- `thumbnail.png` — the user provides this separately; not yet supplied.
- Not yet pushed to GitHub (`GITHUB_TOKEN` secret is not set in this environment).
