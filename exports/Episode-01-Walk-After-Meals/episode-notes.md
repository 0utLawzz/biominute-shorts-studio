# Episode 1 — Walk After Meals

## Status: Complete (video) — thumbnail pending

## Build
- Scenes: `Scene0.tsx` – `Scene5.tsx` + `ThumbnailSlide.tsx` in `artifacts/biominute-reels/src/components/video/video_scenes/`.
- Format: 9:16 vertical, 1080×1920.
- Durations (ms): 4500 / 7000 / 4000 / 3000 / 5000 / 5000 / 4000.
- CTA: "Do you walk after meals, or sit right down?"

## Export
- Exported with the project's own pipeline: `pnpm run export-video` (Playwright headless Chromium recording at 1080×1920 + ffmpeg mux with `background.mp3`).
- Verified with `pnpm --filter @workspace/scripts verify-export` → PASS, 1080x1920.
- File: `episode.mp4` in this folder.

## Outstanding
- `thumbnail.png` — the user provides this separately; not yet supplied.
- Not yet pushed to GitHub (`GITHUB_TOKEN` secret is not set in this environment).
