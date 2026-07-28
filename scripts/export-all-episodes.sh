#!/usr/bin/env bash
set -euo pipefail

# Full sequential export for an explicit episode batch.
# Usage: bash scripts/export-all-episodes.sh 61 62 63 64 65
# With no arguments, it keeps the legacy 61–65 default.
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

EXPORT_URL="http://localhost:25078/biominute-reels/"
VITE_PORT=25078
SCENES_DIR="artifacts/biominute-reels/src/components/video/video_scenes"
CONFIG_FILE="artifacts/biominute-reels/src/lib/video/config.ts"

# ─── Episode definitions ───────────────────────────────────────────────
# Format: "ep_num|scene_prefix|export_dir|config_comment_scene0"
declare -A EP_DEFS=(
  [61]="61|ep61|exports/Episode-61-is-decaf-coffee-actually-caffeine|Hook: \"Is Decaf Coffee Actually Caffeine-Free?\""
  [62]="62|ep62|exports/Episode-62-does-sugar-really-cause-hyperactivity|Hook: \"Does Sugar Really Cause Hyperactivity in Kids?\""
  [63]="63|ep63|exports/Episode-63-can-apple-cider-vinegar-really-help|Hook: \"Can Apple Cider Vinegar Really Help You Lose Weight?\""
  [64]="64|ep64|exports/Episode-64-is-it-bad-to-work-out-on-an-empty|Hook: \"Is It Bad to Work Out on an Empty Stomach?\""
  [65]="65|ep65|exports/Episode-65-does-napping-during-the-day-ruin|Hook: \"Does Napping During the Day Ruin Your Night Sleep?\""
)

REQUESTED_EPISODES=("$@")
if [ "${#REQUESTED_EPISODES[@]}" -eq 0 ]; then
  REQUESTED_EPISODES=(61 62 63 64 65)
fi

EPISODES=()
for ep_num in "${REQUESTED_EPISODES[@]}"; do
  if [ -z "${EP_DEFS[$ep_num]+x}" ]; then
    echo "❌ Episode ${ep_num} is not configured in this batch script."
    echo "   Add its scene prefix, export folder, and hook comment before exporting it."
    exit 1
  fi
  EPISODES+=("${EP_DEFS[$ep_num]}")
done

# ─── Start Vite dev server ─────────────────────────────────────────────
echo "▶ Starting Vite dev server on port $VITE_PORT..."
PORT=$VITE_PORT pnpm --filter @workspace/biominute-reels run dev &
VITE_PID=$!
trap "echo '⏹ Stopping Vite...'; kill $VITE_PID 2>/dev/null || true" EXIT

# Wait for server to be ready (up to 60s)
echo "⏳ Waiting for server to be ready..."
for i in $(seq 1 60); do
  if curl -sf "$EXPORT_URL" -o /dev/null 2>/dev/null; then
    echo "✅ Server ready after ${i}s"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "❌ Server failed to start after 60s"; exit 1
  fi
  sleep 1
done

# Extra buffer for React hydration
sleep 3

# ─── Export each episode ───────────────────────────────────────────────
for ep_def in "${EPISODES[@]}"; do
  IFS='|' read -r ep_num prefix out_dir comment <<< "$ep_def"

  echo ""
  echo "══════════════════════════════════════════"
  echo "  EP${ep_num}: Swapping scenes & exporting"
  echo "══════════════════════════════════════════"

  # Swap scenes
  for i in 0 1 2 3 4; do
    cp "$SCENES_DIR/${prefix}_Scene${i}.tsx" "$SCENES_DIR/Scene${i}.tsx"
  done

  # Update config.ts scene 0 comment only (durations are the same for all)
  sed -i "s|0: 4500, // Hook:.*|0: 4500, // ${comment}|" "$CONFIG_FILE"

  echo "   Scenes swapped. Exporting MP4..."

  # Ensure output dir exists
  mkdir -p "$out_dir"
  MP4_PATH="$ROOT/$out_dir/episode.mp4"
  if [ -f "$MP4_PATH" ] && [ "${FORCE_EXPORT:-0}" != "1" ]; then
    echo "   ⏭️  $MP4_PATH already exists; skipping. Use FORCE_EXPORT=1 to re-export."
    continue
  fi
  TMP_DIR="/tmp/biominute-ep${ep_num}"
  mkdir -p "$TMP_DIR"

  BIOMINUTE_EXPORT_URL="$EXPORT_URL" \
  BIOMINUTE_EXPORT_DIR="$TMP_DIR" \
    pnpm --filter @workspace/scripts exec node_modules/.bin/tsx src/export-video.ts "$MP4_PATH"

  echo "   ✅ EP${ep_num} exported → $out_dir/episode.mp4"

  # Give Vite a moment to pick up file changes before next episode
  sleep 3
done

echo ""
echo "══════════════════════════════════════════"
echo "  Batch export complete. Push this batch with:"
echo "  bash scripts/push-to-github.sh \"feat: export episodes ${REQUESTED_EPISODES[*]}\""
echo "══════════════════════════════════════════"
echo ""
echo "🎉 Done! Episodes ${REQUESTED_EPISODES[*]} exported."
