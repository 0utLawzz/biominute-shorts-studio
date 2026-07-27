---
name: Code audit findings (2026-07-28)
description: Critical bugs, security gaps, and improvement areas found during the first full codebase audit. Referenced by the 1–5 improvement plan.
---

# Code Audit Findings

**Why:** First full audit of BioMinute Shorts Studio run on 2026-07-28. These are the non-obvious issues — things that look fine but will cause real problems in production.

---

## Critical (fix before going fully public)

### No authentication on dashboard or API
- **Rule:** Never present the dashboard URL publicly until auth (#1 in improvement plan) is in place.
- **Why:** Any visitor can trigger a YouTube publish or video render.
- **How to apply:** Item 1 in `docs/improvement-plan.md` implements session auth using the existing `SESSION_SECRET`.

### Render process has no lock
- **Rule:** Never call `POST /run-production` for an episode that already has a render in flight; treat the database render job as the durable source of truth.
- **Why:** Two concurrent renders write to the same output folder — frames interleave, MP4 is corrupt. API restarts must also stop detached children and return failed renders to a retryable state.
- **How to apply:** The render job row provides the per-episode lock/status; shutdown handlers terminate active children, and failed renders reset to `scripted`/`script_ready` for retry.

---

## Data / reliability

### `postDate` is stored as a nullable timestamp
- **Rule:** Treat missing post dates as `NULL`; do not use empty strings or cast `post_date` manually in SQL.
- **Why:** Stage 3 migrated the development schema from text to timestamp so date arithmetic is type-safe. Production receives this schema change through Replit's publish flow.
- **How to apply:** Use `postDate: Date | null` in application code and `post_date + interval` in SQL. Re-publish the app to apply the schema change to production.

### `seed-episodes.ts` has a hardcoded workbook filename
- **Rule:** After any workbook rename or re-export, update the filename constant in `seed-episodes.ts` before re-seeding, OR run item 3 which auto-discovers the newest XLSX.
- **File:** `scripts/src/seed-episodes.ts`

---

## Code quality

### Dead auto-scheduler block in api-server
- `artifacts/api-server/src/index.ts` has a large commented/disabled auto-scheduler block. Treat it as dead code — do not reactivate it without understanding it fully. Item 4 removes it.

### OpenAPI spec has ghost endpoints
- Several routes in `lib/api-spec/openapi.yaml` don't match actual Express routes (e.g. `/youtube/publish/{id}` vs `/api/episodes/:epNumber/publish-now`). Generated Orval hooks for these are unreliable. Item 4 reconciles them.

---

## The 1–5 numbered plan
Full detail in `docs/improvement-plan.md`. Order matters: do 1 (auth) before anything else.
