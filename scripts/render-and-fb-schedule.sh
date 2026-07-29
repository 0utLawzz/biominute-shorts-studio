#!/usr/bin/env bash
# render-and-fb-schedule.sh
#
# For each episode number given as arguments:
#   1. Renders the episode MP4 (using RENDER_EXISTING=true so YouTube is untouched)
#   2. Immediately uploads it to Facebook as a scheduled post
#   3. Cleans up local MP4 (facebook-bulk-schedule.ts handles that)
#
# Usage:
#   bash scripts/render-and-fb-schedule.sh 14 15 16 17 18 19 20
#
# Requirements:
#   - biominute-reels Vite server must be running on port 25078
#   - All env vars: DATABASE_URL, FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS_DIR="$ROOT/scripts"
# Use tsx directly (MUST cd into SCRIPTS_DIR first so process.cwd() resolves correctly
# in batch-export-schedule.ts where WORKSPACE_ROOT = path.resolve(process.cwd(), '..'))
TSX="$SCRIPTS_DIR/node_modules/.bin/tsx"

EPISODES=("$@")
if [ "${#EPISODES[@]}" -eq 0 ]; then
  echo "Usage: bash scripts/render-and-fb-schedule.sh <ep_number> [ep_number ...]"
  exit 1
fi

echo ""
echo "========================================================"
echo "  BioMinute — render + Facebook schedule"
echo "  Episodes: ${EPISODES[*]}"
echo "  Started : $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "========================================================"

SUCCEEDED=()
FAILED=()

for ep in "${EPISODES[@]}"; do
  echo ""
  echo "──────────────────────────────────────────────────────"
  echo "  Processing Episode $ep"
  echo "  Time: $(date -u +%H:%M:%SZ)"
  echo "──────────────────────────────────────────────────────"

  # Step 1: Render the episode
  # MUST cd into SCRIPTS_DIR so batch-export-schedule.ts resolves WORKSPACE_ROOT correctly:
  #   WORKSPACE_ROOT = path.resolve(process.cwd(), '..') = scripts/../ = workspace root
  echo "  [1/2] Rendering EP${ep}..."
  render_ok=0
  (
    cd "$SCRIPTS_DIR"
    RENDER_EXISTING=true BIOMINUTE_EXPORT_URL="http://localhost:25078/biominute-reels/" \
      "$TSX" ./src/batch-export-schedule.ts "$ep"
  ) 2>&1 && render_ok=1 || render_ok=0

  if [ "$render_ok" -eq 1 ]; then
    echo "  ✓ EP${ep} rendered"
  else
    echo "  ✗ EP${ep} render FAILED — skipping Facebook upload"
    FAILED+=("$ep")
    continue
  fi

  # Step 2: Upload to Facebook
  echo "  [2/2] Uploading EP${ep} to Facebook..."
  fb_ok=0
  (
    cd "$SCRIPTS_DIR"
    "$TSX" ./src/facebook-bulk-schedule.ts "$ep"
  ) 2>&1 && fb_ok=1 || fb_ok=0

  if [ "$fb_ok" -eq 1 ]; then
    echo "  ✓ EP${ep} Facebook scheduled"
    SUCCEEDED+=("$ep")
  else
    echo "  ✗ EP${ep} Facebook upload FAILED (MP4 kept for retry)"
    FAILED+=("$ep")
  fi

done

echo ""
echo "========================================================"
echo "  Summary"
echo "  Done    : $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  SUCCESS : ${SUCCEEDED[*]:-none}"
echo "  FAILED  : ${FAILED[*]:-none}"
echo "========================================================"
