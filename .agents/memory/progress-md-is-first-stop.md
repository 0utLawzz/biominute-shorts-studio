---
name: PROGRESS.md is the first stop
description: Where every session starts — canonical chronological log of requests, actions, and commits.
---

Before doing any work in a new session, **read `/PROGRESS.md`** at the repo root. It contains:

1. **User requests → Agent actions** — every meaningful request the user has made, paired with what was done to satisfy it (with commit hashes).
2. **Git commit history** — full `git log --all --oneline` table, oldest → newest, including mirrored Replit-publish commits.
3. **Companion doc pointers** — `replit.md`, `README.md`, `docs/production-status.md`, `exports/production-log.md`, and `.agents/memory/`.

**Why:** the working memory (`.agents/memory/MEMORY.md`) captures durable lessons by *topic* but cannot reconstruct the story of *what happened in order*. Tracing that through git log + conversation summaries is slow and lossy. PROGRESS.md is the linear narrative sibling — read it once to catch up, then dive into specific topic files as needed.

**How to apply:** When continuing work in a session, scan PROGRESS.md before touching anything. When shipping meaningful work, append a new "Request N" section to PROGRESS.md (with commit hash) before the commit lands. Skip appends for: typo fixes, deploy artefacts, pure code moves.
