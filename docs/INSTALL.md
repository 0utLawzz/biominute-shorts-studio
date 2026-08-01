# BioMinute Shorts Studio — Installation Guide

Step-by-step instructions to install the project, configure secrets, and prepare the database.

---

## Prerequisites

- **Node.js** v24 or higher
- **pnpm** v10 or higher
- **Git**
- **PostgreSQL** database (Replit-managed or external such as Neon)
- **ffmpeg** and **Xvfb** (only required for the video export pipeline on Linux)

Check your versions:

```bash
node --version    # v24.x.x
pnpm --version    # 10.x.x
git --version
```

---

## 1. Clone the repository

```bash
git clone https://github.com/0utLawzz/biominute-shorts-studio.git
cd biominute-shorts-studio
```

---

## 2. Install dependencies

```bash
pnpm install
```

This installs all packages for every workspace project at once.

> Do not use `npm install` or `yarn install`. The root `package.json` preinstall script rejects them.

---

## 3. Configure environment secrets

All secrets are set through Replit's **Secrets** UI (or your deployment environment). Never commit secrets to the repo.

### Required for the API server & dashboard

| Secret | How to get it |
|--------|---------------|
| `DATABASE_URL` | Replit provisions one automatically, or use an external Neon/Postgres URL. |
| `SESSION_SECRET` | Any long random string for Express session signing. |
| `DASHBOARD_PASSWORD` | The password used to unlock the publishing dashboard. |

### Required for YouTube publishing

| Secret | How to get it |
|--------|---------------|
| `YOUTUBE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 credentials → Web application. |
| `YOUTUBE_CLIENT_SECRET` | Same as above. |
| `YOUTUBE_REFRESH_TOKEN` | Run `pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts` and follow the OAuth flow. |
| `YOUTUBE_CHANNEL_ID` | https://www.youtube.com/account_advanced while signed in. |
| `YOUTUBE_CHANNEL_NAME` | Your channel handle (e.g., `@BioMinutesh`). |

### Required for season playlist uploads

| Secret | How to get it |
|--------|---------------|
| `YOUTUBE_PLAYLIST_S1` … `YOUTUBE_PLAYLIST_S6` | YouTube Studio → Playlists → open a playlist → copy the `list=` value. |

### Required for auto-pushing exports to GitHub

| Secret | How to get it |
|--------|---------------|
| `GITHUB_TOKEN` | GitHub Settings → Developer settings → Personal access tokens (classic) → `repo` scope. |

### Required for Neon PR branch automation

| Secret | How to get it |
|--------|---------------|
| `NEON_API_KEY` | Neon Console → Account → API Keys. |
| `NEON_PROJECT_ID` | Neon Console → Project settings. Set this as a GitHub repository variable (`vars.NEON_PROJECT_ID`). |

See [`docs/Social-Platforms-Setup.md`](Social-Platforms-Setup.md) for the full platform-specific setup guide.

> **Security note:** `youtube-reauth.ts` intentionally does not print refresh tokens. Store the OAuth result directly in Replit Secrets and never put tokens in shell history, logs, screenshots, commits, or issue reports.

### Vercel dashboard deployment variables

The Vercel-hosted dashboard only needs this public configuration variable:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Public URL of the separately deployed Express API, without a trailing slash |

Never put `DATABASE_URL`, YouTube credentials, `SESSION_SECRET`, or `DASHBOARD_PASSWORD` in a `VITE_*` variable. Those values would be bundled into browser JavaScript.

---

## 4. System dependencies for video export

If you are on Replit or another Linux environment, the export pipeline needs headless-browser libraries and ffmpeg.

Common packages:

```bash
# Debian/Ubuntu/NixOS equivalent
ffmpeg
xvfb-run
libgbm
mesa
alsa-lib
gtk3
libdrm
```

On Replit these are normally pre-installed via `replit.nix`. If Playwright fails with a missing `.so`, install the missing system library rather than reinstalling Playwright.

---

## 5. Database setup

Push the schema and seed the episodes table:

```bash
# Push the Drizzle schema to PostgreSQL
pnpm --filter @workspace/db push-force

# Seed 100 episodes + 2 test slots from the master XLSX
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
```

The seed script is idempotent: existing episodes keep their live status and YouTube IDs, while metadata is refreshed from the workbook.

---

## 6. Verify the install

Run the type checker and build:

```bash
pnpm run typecheck
pnpm run build
```

If both succeed, the project is ready to run. See [`docs/RUN.md`](RUN.md) for next steps.

---

## Troubleshooting

### `pnpm install` fails with "Use pnpm instead"

You ran `npm` or `yarn`. Always use `pnpm install`.

### `DATABASE_URL` is not set

Set it in the Secrets UI. The API server and seed script both require it.

### Playwright fails with `libgbm.so.1: cannot open shared object file`

Install the missing system library (`libgbm`) via your package manager. Do not reinstall Playwright.

### Master sheet not found during seed

The seed script reads `attached_assets/BioMinute-Master-Workbook_1785093582748.xlsx` from the sheets `Production`, `Social`, and `Schedule`. If you replace the file, keep the same sheet names or update the script.

### YouTube upload fails with `401 Invalid Credentials`

Your refresh token may be expired or revoked. Regenerate it with:

```bash
pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts
```

Then paste the new token into Replit Secrets and restart the API server workflow.
