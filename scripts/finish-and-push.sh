#!/usr/bin/env bash
set -euo pipefail

# Helper: run after finishing work to stage, commit, and push all changes.
# Usage: bash scripts/finish-and-push.sh "optional commit message"

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

if [ -z "$(git status --short)" ]; then
  echo "No changes to commit."
  exit 0
fi

MSG="${1:-update: latest BioMinute changes}"

# Stage everything except node_modules and build output (already ignored)
git add -A
git commit -m "$MSG" || true

# Push via Replit-managed credentials (use the git-remote skill if available)
git push origin "$(git branch --show-current)"

echo "Pushed to GitHub."
