# BioMinute Reels — Final Working Project v1.1

## Released
2026-07-13

## Tag
`v1.0-final` (updated to latest commit)

## Includes
All **10 Episodes** from the BioMinute Health Reels channel are now fully scripted, animated, exported as 1080×1920 vertical MP4s, and pushed to the GitHub repository:

| Episode | Title | Duration | Export Folder |
|---|---|---|---|
| 1 | The 5-Minute Rule That Beats Procrastination | 36.4s | `exports/Episode-01-*/` |
| 2 | Why Stretching Before Bed Improves Sleep | 39.5s | `exports/Episode-02-*/` |
| 3 | The Best Time to Drink Coffee | 39.0s | `exports/Episode-03-*/` |
| 4 | How Walking After Meals Changes Your Body | 39.8s | `exports/Episode-04-*/` |
| 5 | Why Sleep Matters More Than You Think | 39.8s | `exports/Episode-05-*/` |
| 6 | Why Are You Still Hungry Right After Eating? | 41.0s | `exports/Episode-06-*/` |
| 7 | How Deep Breathing Reduces Stress | 42.3s | `exports/Episode-07-*/` |
| 8 | Does Drinking Water Really Boost Metabolism? | 38.5s | `exports/Episode-08-*/` |
| 9 | Morning Sunlight for Better Sleep | 39.8s | `exports/Episode-09-*/` |
| 10 | Can You Build Muscle Without Supplements? | 37.9s | `exports/Episode-10-*/` |

## What's in the repo
- **React + Vite video renderer** at `artifacts/biominute-reels/`.
- **Scene components** at `src/components/video/video_scenes/Scene0.tsx` – `Scene4.tsx`.
- **Type-safe config** at `src/lib/video/config.ts` with per-episode durations and 1080×1920 constants.
- **Export pipeline** at `scripts/src/export-video.ts` using Playwright + ffmpeg with background music.
- **Production log** at `exports/production-log.md` tracking episode status.
- **Episode notes** inside each `exports/Episode-XX-*/episode-notes.md`.
- **Push script** at `scripts/push-to-github.sh` with `GITHUB_TOKEN` support.

## Pipeline
- **Typecheck:** `pnpm --filter @workspace/biominute-reels run typecheck`
- **Dev server:** `pnpm --filter @workspace/biominute-reels run dev`
- **Export:** `BIOMINUTE_EXPORT_URL=<url> BIOMINUTE_EXPORT_DIR=<dir> pnpm --filter @workspace/scripts export-video`
- **Push:** `bash scripts/push-to-github.sh "<message>"`

## Repository
https://github.com/0utLawzz/Health-Channel-Creator
