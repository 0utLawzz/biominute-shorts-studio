---
name: biominute
version: 0.1.0
description: Onboard new Replit Agent sessions to the BioMinute Shorts Studio pipeline, encode design guidelines, and run the export → publish workflow with a security-review subagent.
triggers: biominute, bio minute, shorts studio, export episode, publish youtube, build video, scene file, schedule upload, video pipeline, 9:16, reels, shorts, ai video agent
---

# BioMinute Shorts Studio — Agent Skill

Use this skill whenever you are starting a new session on the BioMinute project or being asked to build, export, schedule, or publish BioMinute episodes. It replaces guesswork with the project’s real conventions.

## 1. Project overview

- **Product:** Daily health-science YouTube Shorts (9:16, 1080×1920, ~35–45 s).
- **Stack:** pnpm monorepo, React + Framer Motion video engine, Playwright + ffmpeg export, Express API, React publishing dashboard, Neon Postgres via Drizzle ORM.
- **Artifacts:**
  - `artifacts/biominute-reels` — video engine (port 25078, path `/biominute-reels/`)
  - `artifacts/publishing-dashboard` — episode UI (port 24083, path `/`)
  - `artifacts/api-server` — API (port 8080, path `/api`)
- **State sources of truth (read in this order):**
  1. `exports/production-log.md` — statuses, URLs, export folders, timing notes
  2. `exports/dashboard.html` — regenerated from DB, always check after export
  3. `episodes` table in Neon (`DATABASE_URL`) — queue, season, status, `scheduled_publish_at`, `youtube_video_id`
  4. `artifacts/biominute-reels/src/components/video/video_scenes/` — scene components (`epNN_SceneM.tsx`) and the active `Scene0.tsx`…`Scene5.tsx` templates

## 2. Before you touch anything

1. Ensure the three workflows are running. Restart any that are stopped or failed (`artifacts/biominute-reels` is the only one required for export).
2. Check the database for the next batch of episodes:
   ```sql
   SELECT ep_number, hook_title, youtube_title, status, season, scheduled_publish_at, youtube_video_id
   FROM episodes
   WHERE status IN ('scripted','approved','building') AND scheduled_publish_at IS NULL
   ORDER BY ep_number;
   ```
3. Confirm the current active `Scene0..5.tsx` files are the canonical `ep55` template when not actively exporting.
4. Read the last 20 lines of `exports/production-log.md` to see the most recent batch and any special notes.

## 3. Design guidelines (non-negotiable)

### Format
- 9:16 vertical, 1080×1920 CSS pixels.
- `BOTTOM_SAFE_ZONE_PX = VIDEO_HEIGHT * 0.30` (30% of the bottom) is reserved for YouTube UI. Never put critical text or icons below ~70% of the canvas.
- 8% safe margin on all sides (`SAFE_ZONE_PX`).

### Visual language
- Background: dark slate `#0F172A`.
- Typography: uppercase `font-display` for headlines, `font-body` for body copy.
- Season colors (use these exact hex codes):
  - S1 Morning Habits: orange `#f97316` + teal `#10b981`
  - S2 Movement & Body: blue `#2F6FED` + orange `#f97316`
  - S3 Sleep & Recovery: purple `#7c3aed` + blue `#2F6FED`
  - S4 Stress & Mind: rose `#f43f5e` + purple `#7c3aed`
  - S5 Nutrition & Myths: emerald `#10b981` + orange `#f97316`
  - S6 Healthy Aging & Longevity: amber `#f59e0b` + teal `#10b981`
- Icon library: `lucide-react` only.
- Motion: spring easing (`SPRING_SNAPPY` and `SPRING_SMOOTH`), staggered list cards, subtle orbiting accent icons, blur glows.
- Every episode must have a clear hook, 3–4 evidence/takeaway scenes, and a CTA comment prompt in the final scene.
- Scene audio: use `public/audio/sfx-whoosh.mp3` on the hook, `sfx-pop.mp3` on fact cards. Background music is mixed in by ffmpeg.

### What NOT to do
- Never change the video engine resolution or aspect ratio.
- Never add audio controls, BGM selectors, or SFX UI to the publishing dashboard.
- Never hand-copy scaffold files (`tsconfig`, `vite.config`, `artifact.toml`) when importing external repos.
- Never publish the same episode twice; the upload guard checks `youtube_video_id`.
- Never use `formatPKDate` for episode timestamps; always use `formatPKT` (date + time).

## 4. Building an episode batch

1. Query the DB for the target episodes and their seasons, hooks, scripts, and citation CTAs.
2. Create one set of scene components per episode: `epNN_Scene0.tsx` … `epNN_Scene4.tsx` (or `Scene5.tsx` for the thumbnail end card if needed). Keep the same component names (`Scene0`, `Scene1`, etc.) so the active renderer imports them.
3. Copy the relevant season’s `epXX_SceneM.tsx` as a starting template. Season colors and layout patterns must match the season.
4. After creating files, run `pnpm --filter @workspace/biominute-reels exec tsc --noEmit` to ensure no TS errors.
5. Update `artifacts/biominute-reels/src/lib/video/config.ts` with the correct `SCENE_DURATIONS` and a comment naming the current episode. The export script uses the sum of these durations as the recording length fallback.

## 5. Export workflow

Use the batch script for 5-episode runs:
```bash
bash scripts/export-all-episodes.sh
```
Key gotchas from the real pipeline:
- `BIOMINUTE_EXPORT_URL` must be `http://localhost:25078/biominute-reels/` (not the root domain).
- The `tsx` binary is at `scripts/node_modules/.bin/tsx`, not always in `PATH`.
- The workspace root is two levels up from `scripts/` (not three), so the export script resolves with `..` from its own directory.
- After exporting, the dashboard is regenerated automatically; verify `exports/dashboard.html`.
- If the export script times out, run the remaining episode manually with an absolute output path (ffmpeg fails on relative paths from `scripts/`).

After export, reset the active `Scene0..5.tsx` files to the `ep55` template and restore the `config.ts` hook comment to `// Hook: ep55 build template`.

## 6. Publishing workflow

Scheduled upload (auto-publish at `scheduled_publish_at`):
```bash
pnpm --filter @workspace/scripts exec node_modules/.bin/tsx src/schedule-upload.ts 61 62 63 64 65
```
Immediate upload (right now, public):
```bash
pnpm --filter @workspace/scripts exec node_modules/.bin/tsx src/upload-now.ts 998 999
```
- The upload script reads the episode row and builds the description from `vo_script`, `citation_cta`, `hashtags`, and `season`.
- It adds the video to the correct season playlist using `YOUTUBE_PLAYLIST_S1`…`S6`.
- It updates `episodes.youtube_video_id` and leaves `status` as `scheduled` for scheduled uploads, or flips to `published` for immediate uploads.
- If an episode has no `scheduled_publish_at`, use `upload-now.ts`; do not use `schedule-upload.ts`.

## 7. Security-review subagent

Before any new video component or upload script change lands in the main app, run a focused security review via the `delegation` skill:

```javascript
const review = await subagent({
  name: "biominute-security-review",
  task: "Review the new BioMinute scene files / export scripts for: (1) hardcoded secrets or tokens, (2) XSS or unsafe HTML in motion components, (3) path traversal or command injection in ffmpeg/execSync calls, (4) DB query injection via user input, (5) privacy leaks in test episodes or filenames. Return a short pass/fail report with file paths and line numbers.",
  config: { $kind: "review" }
});
```
Do not treat the subagent as a substitute for the `security-scan` skill. If the user explicitly asks for a security scan, run `security-scan` and report the concise summary.

## 8. Multi-channel output

The current engine renders a single 9:16 MP4. This is already compatible with:
- YouTube Shorts (primary)
- TikTok / Reels (same aspect ratio, but require captions burned in and different UI safe zones)

When a user asks for “multi-channel support,” the project does **not** yet have a TikTok/Reels export path. The minimal correct implementation is:
1. Add a `platform` parameter to the export script (default `youtube`, options `tiktok`, `instagram`).
2. For `tiktok`/`instagram`, add burned-in captions and a 14:9 or 4:5 crop variant if needed.
3. Store per-platform outputs in `exports/Episode-NN-slug/<platform>/`.
4. Add a `platform` column to the episodes table and upload scripts for each platform.
Do not promise these features exist today; implement them when asked.

## 9. How a new Replit session picks this up automatically

This skill is the mechanism. Because it lives in `.agents/skills/biominute/SKILL.md`, any future Replit Agent session will load it when the conversation matches the triggers (`biominute`, `shorts studio`, `export episode`, etc.). In addition, `replit.md` at the repo root contains the project overview and user preferences, which is loaded into every session automatically. If the user asks “how do I make a new agent know the setup,” the answer is: keep this skill and `replit.md` up to date, and use the `MEMORY.md` index for non-obvious pipeline quirks (e.g., export URL port, tsx path, workspace root).
