---
name: No audio/sound in dashboard artifacts
description: User explicitly requested all audio/BGM/SFX UI be removed from non-reel artifacts. Only biominute-reels may have audio.
---

# No Audio / BGM / SFX in Dashboard Artifacts

**Rule:** Never add audio playback, background music fields, SFX controls, or any sound-related UI to:
- `artifacts/publishing-dashboard`

**Why:** User explicitly removed `bgSound` field from the publishing dashboard and episode detail view on 2026-07-16. Audio is solely the concern of `artifacts/biominute-reels` (the reel player) and the export pipeline scripts. (`biominute-deck` and `mockup-sandbox` were deleted 2026-07-20.)

**How to apply:** If you are ever tempted to add a bgSound input, Audio/BGM display, Web Audio API usage, or any sound file import to any artifact other than `biominute-reels`, stop and don't do it. The `bgSound` column still exists in the database schema (used by the export script) — do not surface it in any UI.

**Also applies to video previews:** The exported MP4 files intentionally contain audio for YouTube. Whenever a dashboard shows those MP4s in a `<video>` player, the tag must include `muted`. Otherwise clicking play or browser autoplay policies can let the reel's background music come through the dashboard. This applies to both `artifacts/publishing-dashboard` (PreviewQueue) and the generated `exports/dashboard.html`.

**Preview boundary:** The reels preview iframe must also stay silent. Legacy scene components can create `<audio>` elements and call `.play()` directly, so muting only the shared background-audio engine is insufficient; preview playback needs a boundary-level media guard, while export mode remains audible.

**Why:** Scene-level SFX bypassed the shared audio state and could start before a React mute effect ran.

**How to apply:** Keep preview-only media suppression separate from export rendering. Do not remove FFmpeg's intentional export audio unless the user explicitly requests silent output.
