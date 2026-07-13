#!/usr/bin/env bash
# Auto-push to GitHub after an episode export.
# Usage: bash scripts/push-to-github.sh "Episode 1: Walk After Meals exported"
#
# Requires GITHUB_TOKEN env var (classic PAT with repo scope).
# Set it with: export GITHUB_TOKEN=ghp_xxxx
# Or add it as a Replit Secret named GITHUB_TOKEN.

set -e

MSG="${1:-"BioMinute: auto-push $(date '+%Y-%m-%d %H:%M')"}"

TOKEN="${GITHUB_TOKEN:-$GITHUB_ACCESS_TOKEN}"
if [ -z "$TOKEN" ]; then
  echo "❌  No GitHub token found."
  echo "    Add a GitHub Personal Access Token (classic, repo scope) as a Replit Secret named GITHUB_TOKEN."
  exit 1
fi

REMOTE_URL="https://${TOKEN}@github.com/0utLawzz/Health-Channel-Creator.git"

git add -A
git commit -m "$MSG" || echo "Nothing new to commit."
git push "$REMOTE_URL" HEAD:main

echo "✅  Pushed to GitHub: $MSG"
