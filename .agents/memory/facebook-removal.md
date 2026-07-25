---
name: Facebook publishing removed
description: Facebook publishing was fully cut from the codebase. facebookVideoId DB column was intentionally kept.
---

# Facebook Publishing Removed

## What was removed
- `artifacts/api-server/src/lib/facebook-upload.ts` — deleted
- `artifacts/api-server/src/routes/facebook.ts` — deleted
- Facebook router removed from `artifacts/api-server/src/routes/index.ts`
- Facebook paths + schemas removed from `lib/api-spec/openapi.yaml`
- Facebook generated types deleted: `lib/api-zod/src/generated/types/facebookPublishRequest.ts`, `facebookPublishResult.ts`, `facebookStatus.ts`
- Facebook route schemas removed from `lib/api-zod/src/generated/api.ts`
- Facebook hooks/functions removed from `lib/api-client-react/src/generated/api.ts` and `api.schemas.ts`
- Facebook UI (button, handler, status query) removed from `artifacts/publishing-dashboard/src/pages/EpisodeDetail.tsx`

## What was intentionally kept
- `facebookVideoId` column in `lib/db/src/schema/episodes.ts` — it's an existing DB column; dropping it would require a schema migration. The field still appears in Episode type/zod schemas but has no UI or API routes.

**Why:** User explicitly asked to cut Facebook publishing. facebookVideoId column kept to avoid a destructive migration.

**How to apply:** Do NOT re-add Facebook routes, hooks, or UI. If facebookVideoId needs to be dropped later, run a drizzle migration to remove the column.
