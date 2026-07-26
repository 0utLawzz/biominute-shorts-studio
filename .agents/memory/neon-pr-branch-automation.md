---
name: Neon PR branch automation
description: How the GitHub Actions workflow creates and deletes Neon database branches for pull requests.
---

## Rule

`.github/workflows/neon_workflow.yml` runs on every pull request:

- On `opened`, `reopened`, or `synchronize`: creates a Neon branch named `preview/pr-{number}-{branch}`.
- On `closed`: deletes that branch.

## Requirements

- GitHub Secret: `NEON_API_KEY`
- GitHub Repository Variable: `NEON_PROJECT_ID`

## Why

Each PR gets its own isolated database branch so schema changes and migrations can be tested without touching the production database. The branch expires after 14 days automatically.

## How to apply

When adding a new PR, confirm `NEON_API_KEY` and `NEON_PROJECT_ID` are configured. If the workflow fails, check the Actions tab for the exact error from Neon. Do not log the database URLs that the workflow outputs.
