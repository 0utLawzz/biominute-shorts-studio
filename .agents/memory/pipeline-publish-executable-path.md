---
name: Pipeline publish executable path
description: Workspace-root path handling for production pipeline subprocesses
---

The production pipeline may execute from the `scripts` package directory when invoked through pnpm filters. Any subprocess path that starts with the current working directory must account for that package context; otherwise it can incorrectly resolve to a nested `scripts/scripts` path.

**Why:** Episode publishing initially rendered and verified successfully but failed before upload because the publish gate resolved `scripts/node_modules/.bin/tsx` relative to an already package-scoped working directory.

**How to apply:** Use the shared workspace-root path helper when invoking scripts or binaries from pipeline code. Keep preflight and artifact verification ahead of the publish subprocess so path errors cannot cause a partial upload.