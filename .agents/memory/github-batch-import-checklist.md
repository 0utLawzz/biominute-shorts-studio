---
name: GitHub batch import and push checklist
description: Import and GitHub push conventions for working in small, recoverable batches.
---

# GitHub Batch Import and Push Checklist

**Rule:** When `GITHUB_TOKEN` is available as a Replit Secret, work in small logical batches and push each completed batch through the repository push script. Never print, interpolate into logs, or commit the token.

**Why:** Small pushes make episode exports and fixes easier to recover, review, and resume. A prior export script bundled a hard-coded five-episode batch and pushed automatically, which made reruns confusing and caused already-exported episodes to be processed again.

**How to apply:**

1. At the start of an imported project, read `PROGRESS.md`, inspect the README/package/workspaces, verify the GitHub remote and push script, and check that `GITHUB_TOKEN` is available without displaying its value.
2. Before making changes, split the work into a small logical batch (for example, five episodes or one focused fix).
3. Run the relevant typecheck/build and preview checks for that batch.
4. Push only the completed batch with `scripts/push-to-github.sh`; use a descriptive commit message.
5. Record the batch outcome in `PROGRESS.md` when it is a meaningful milestone.
6. Export scripts must accept explicit episode numbers, skip existing `episode.mp4` files unless `FORCE_EXPORT=1`, and must not silently re-export a hard-coded batch.