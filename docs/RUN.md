# BioMinute Shorts Studio — Run Guide

How to run every artifact and common development workflows.

---

## Start the artifacts

Each artifact is a Vite or Express app managed by Replit workflows. You can also start them manually from the terminal.

### API Server

```bash
pnpm --filter @workspace/api-server run dev
```

- Serves the REST API on the port assigned by Replit (`$PORT`).
- Required by the publishing dashboard.

### Publishing Dashboard (main website)

```bash
pnpm --filter @workspace/publishing-dashboard run dev
```

- Browse to the Replit preview path for the dashboard (root `/`).
- The dashboard calls the API server for episode data and YouTube status.

### BioMinute Reels (video player)

```bash
BASE_PATH=/biominute-reels/ pnpm --filter @workspace/biominute-reels run dev
```

- Opens a 9:16 vertical canvas at `/biominute-reels/`.
- The control bar lets you jump between scenes, loop a scene, and toggle audio.
- Preview starts muted by default (browser autoplay policy). Use the audio button to unmute.
- Add `?export` to the URL to hide controls and force audio on for recording/screen capture.

---

## Local development without Replit

If you run the artifacts locally, set the base path to `/` and pick a free port:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/biominute-reels run dev
PORT=5174 BASE_PATH=/ pnpm --filter @workspace/publishing-dashboard run dev
PORT=5175 BASE_PATH=/ pnpm --filter @workspace/api-server run dev
```

Then open:

- `http://localhost:5173` — reels
- `http://localhost:5174` — dashboard
- `http://localhost:5175` — API server

---

## Common workflows

### Re-seed the database from the master plan

```bash
pnpm --filter @workspace/db push-force
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
```

### Export an episode to MP4

Make sure the reels dev server is running first, then:

```bash
# Programmatic export (Playwright + ffmpeg)
BIOMINUTE_EXPORT_DIR="exports/Episode-NN-<slug>" pnpm run export-video
```

By default it writes to `/tmp/biominute-export/episode.mp4`. Set a custom output folder to keep the export in the repo.

### Verify the export resolution

```bash
pnpm --filter @workspace/scripts exec tsx ./src/verify-export.ts exports/Episode-01-Walk-After-Meals/episode.mp4
```

### Regenerate the static production dashboard

```bash
pnpm run dashboard:generate
```

This writes `exports/dashboard.html` from the current database state.

### Upload an episode to YouTube immediately

```bash
pnpm --filter @workspace/scripts exec tsx ./src/upload-now.ts <EP_NUMBER>
```

### Safe production pipeline

The pipeline always runs preflight, build, and video verification before it reaches the publish gate:

```bash
pnpm pipeline:run 66
```

By default this stops after verification. To explicitly upload to YouTube:

```bash
pnpm pipeline:run 66 --publish
```

For an immediate public upload instead of the normal scheduled upload:

```bash
pnpm pipeline:run 66 --publish --now
```

The `--publish` flag is required; the normal run never uploads anything. The publish gate requires a non-empty, playable 1080×1920 MP4 and blocks duplicate YouTube IDs.

If an episode has no archived `epN_Scene0.tsx` through `epN_Scene4.tsx` source files, the runner stops before rendering. This prevents a different episode's active scenes from being published accidentally.

### Upload an episode to YouTube as scheduled

```bash
pnpm --filter @workspace/scripts exec tsx ./src/schedule-upload.ts <EP_NUMBER>
```

The video is uploaded as private and YouTube flips it to public at the episode's `scheduledPublishAt`.

### Generate a fresh YouTube refresh token

```bash
pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts
```

Open the printed URL, approve, and save the returned refresh token directly in Replit Secrets. The script intentionally does not print the token.

### Push exports to GitHub

```bash
bash scripts/push-to-github.sh "feat: export Episode 5"
```

Requires the `GITHUB_TOKEN` secret.

---

## Free deployment recommendations

This repository is a multi-service production tool: the publishing dashboard is a static React site, the API is a protected Express service backed by PostgreSQL, the reels artifact is a static preview surface, and video rendering needs Playwright, ffmpeg, and a Linux process.

### Best free option for the complete project: Replit Starter

Replit's free Starter plan supports one published app. It is the simplest option for this repository because the existing artifacts already have Replit deployment configuration and the API, dashboard, and reels services share one workspace.

Before publishing:

1. Confirm the development database is seeded and the schema is current.
2. Keep `DASHBOARD_PASSWORD`, `SESSION_SECRET`, YouTube credentials, and `DATABASE_URL` in Secrets only.
3. Publish the API-backed project from the Replit Publishing tool.
4. Use the generated `.replit.app` URL for the dashboard; do not use the temporary `.replit.dev` preview URL as a production callback.
5. Choose the publishing geography before the first publish if your plan allows it; the geography is locked after the first publish.

The free plan is a good fit for a private, low-traffic dashboard, but it is not a guarantee of always-on execution. Run episode rendering as an intentional job, not as a background scheduler.

### Good free alternatives for the dashboard only

If you only need a public static dashboard, these services are usually suitable:

- **GitHub Pages** — free static hosting, especially suitable for generated `exports/dashboard.html`.
- **Cloudflare Pages** — free static hosting with Git-based builds and custom domains.
- **Netlify** or **Vercel** — free static hosting for the publishing-dashboard build.

These alternatives do not replace the protected API server, PostgreSQL database, YouTube OAuth flow, or video rendering worker. Keep those services on Replit or deploy them separately on a provider that supports persistent server processes and environment secrets.

### Not recommended as the complete free deployment

Static-only hosts cannot run the Express API or the Playwright/ffmpeg renderer. A free serverless host may also suspend or time-limit video rendering. Use them for the dashboard shell only unless you separately deploy an API and worker.

### Production checklist

```bash
pnpm install
pnpm --filter @workspace/db push-force
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts --dry-run
pnpm run typecheck
pnpm run build
```

The deployment must have the secrets listed in `docs/INSTALL.md`. Never print, commit, or paste a YouTube refresh token into logs or source control.

---

## Workflow notes

- The `biominute-reels` artifact holds **one episode at a time**. Building a new episode overwrites `Scene0.tsx`–`Scene5.tsx`; older `epNN_SceneX.tsx` files are kept for reference but not rendered.
- Export happens sequentially: write scenes → typecheck → export → copy MP4 into `exports/Episode-NN-slug/` → move to the next episode.
- The publishing dashboard has no background audio; audio is only part of the reels video content.
