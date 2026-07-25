---
name: run-production spawn fix
description: tsx not in PATH for detached spawns; correct tsx binary path and reels URL for run-production.
---

# run-production Spawn Fix

## The rule
- `npx tsx` fails silently (tsx not in shell PATH when spawned detached from the API server).
- Use the absolute binary path: `scripts/node_modules/.bin/tsx`.
- Default `BIOMINUTE_EXPORT_URL` must be `http://localhost:25078/biominute-reels/` — the Reels dev server runs on port 25078 with the `/biominute-reels/` path prefix. The old default `http://localhost:5173/` was wrong.

**Why:** The API server spawns `export-video.ts` detached. In a pnpm workspace the tsx binary is not in PATH unless explicitly resolved. Discovered when all 5 ep51-55 builds silently failed with "tsx: command not found" in export.log.

**How to apply:** Any future spawn of tsx from the API server (or any non-shell context) must use the absolute binary path. The fix lives in `artifacts/api-server/src/routes/episodes.ts` — the `tsxBin` variable resolves the path via `path.join(WORKSPACE_ROOT, "scripts", "node_modules", ".bin", "tsx")`.
