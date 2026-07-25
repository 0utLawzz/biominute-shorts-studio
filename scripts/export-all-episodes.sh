#!/usr/bin/env bash
set -euo pipefail

# Full sequential export for Episodes 56–60
# Usage: bash scripts/export-all-episodes.sh
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

EXPORT_URL="http://localhost:25078/biominute-reels/"
VITE_PORT=25078
SCENES_DIR="artifacts/biominute-reels/src/components/video/video_scenes"
CONFIG_FILE="artifacts/biominute-reels/src/lib/video/config.ts"

# ─── Episode definitions ───────────────────────────────────────────────
# Format: "ep_num|scene_prefix|export_dir|config_comment_scene0"
EPISODES=(
  "56|ep56|exports/Episode-56-why-are-you-always-tired|Hook: \"Why Are You Always Tired Even After 8 Hours of Sleep?\""
  "57|ep57|exports/Episode-57-why-cant-you-lose-weight|Hook: \"Why Can't You Lose Weight Even When You're Doing Everything Right?\""
  "58|ep58|exports/Episode-58-whats-actually-causing-your-bloating|Hook: \"What's Actually Causing Your Bloating?\""
  "59|ep59|exports/Episode-59-does-cracking-your-knuckles|Hook: \"Does Cracking Your Knuckles Cause Arthritis?\""
  "60|ep60|exports/Episode-60-can-you-catch-up-on-sleep-debt|Hook: \"Can You Actually Catch Up on Sleep Debt on Weekends?\""
)

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
echo "  All 5 episodes exported. Pushing to GitHub..."
echo "══════════════════════════════════════════"

git add -A
git commit -m "ep56-60: export 5 episodes (Tired After Sleep → Weekend Sleep Debt)" || true
git push origin "$(git branch --show-current)"

echo ""
echo "🎉 Done! Episodes 56–60 exported and pushed to GitHub."
