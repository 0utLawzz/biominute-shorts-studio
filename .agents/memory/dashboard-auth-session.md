---
name: Dashboard auth session
description: How cookie-based session auth is implemented for the BioMinute production dashboard. Lessons learned while building Start 1.
---

# Dashboard auth session

**Why:** Session-based auth was added to the dashboard in 2026-07-28 as improvement-plan item #1.

## How it works

- The API server uses `express-session` with a `biominute.sid` cookie.
- Cookie is `httpOnly`, `secure: true`, `sameSite: "lax"`, 24-hour TTL.
- `SESSION_SECRET` signs the cookie; `DASHBOARD_PASSWORD` is the single shared password.
- `requireAuth` middleware protects every route under `/api` except `/api/healthz` and `/api/auth/*`.
- Dashboard `AuthProvider` checks `/api/auth/me` on mount and sends `credentials: "include"` on every fetch.

## Files to touch when changing auth

- `artifacts/api-server/src/middleware/auth.ts` — password verification, requireAuth, session helpers.
- `artifacts/api-server/src/routes/auth.ts` — login/logout/me/protected endpoints.
- `artifacts/api-server/src/app.ts` — session middleware and CORS credentials.
- `artifacts/api-server/src/routes/index.ts` — where requireAuth is applied.
- `artifacts/publishing-dashboard/src/lib/auth.tsx` — React context.
- `artifacts/publishing-dashboard/src/pages/Login.tsx` — login UI.
- `lib/api-client-react/src/custom-fetch.ts` — fetch credentials default.

## Lessons learned

1. **Module augmentation is the cleanest way to add custom fields to `express-session`**. Use `declare module "express-session" { interface SessionData { ... } }` instead of trying to intersect `Express.SessionData`.
2. **Type-only exports can shadow Zod schemas**. If a schema is imported as a value for `.safeParse()`, it must not be exported with `type` from the package index. In `lib/api-zod/src/index.ts`, removing `type` from `CreateEpisodeBody` (and other schemas) fixed the compile error.
3. **Browser fetch needs `credentials: "include"` for cookie auth to work across Vite proxy / Replit proxy**. Setting it as a default in `customFetch` when `typeof window !== "undefined"` covers all generated React Query hooks without touching generated code.
4. **CORS must reflect the origin and allow credentials**. `origin: (origin, callback) => callback(null, origin ?? true)` plus `credentials: true` works for both dev proxy and Replit production.

## Production notes

- In-memory session store is fine for a single instance. If the app ever scales horizontally, switch to a persistent store (e.g. Redis or Postgres session table).
- The single shared password is acceptable for a small admin team. If multi-user roles are needed later, migrate to a real identity provider or Replit Auth.
- `DASHBOARD_PASSWORD` must be at least 8 characters. The server hard-fails on startup if missing or too short.
