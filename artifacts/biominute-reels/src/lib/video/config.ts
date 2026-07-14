// BioMinute Reels: hard-coded 9:16 vertical format.
// 1080×1920 is the only supported export resolution. All scenes, components,
// and export tooling must use these constants.

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_ASPECT_RATIO = VIDEO_WIDTH / VIDEO_HEIGHT; // 9:16 ≈ 0.5625

export const SAFE_ZONE_PADDING = 0.08; // 8% minimum margin on all sides
export const SAFE_ZONE_PX = VIDEO_WIDTH * SAFE_ZONE_PADDING; // 86.4px
export const BOTTOM_SAFE_ZONE_RATIO = 0.30; // 30% bottom reserved for YouTube UI
export const BOTTOM_SAFE_ZONE_PX = VIDEO_HEIGHT * BOTTOM_SAFE_ZONE_RATIO; // 576px

// Canvas style used by the root wrapper: the video is always rendered at
// exactly 1080×1920 CSS pixels and then scaled to fit the browser viewport.
export const CANVAS_STYLE = {
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
} as const;

// Scene durations for the current episode. The video player uses these to
// advance scenes automatically. Keep the total loop duration in sync with
// the exported MP4 length so the record/export control captures the full video.
export const SCENE_DURATIONS = {
  0: 4500, // Hook: "Does Lifting Weights Make Women Bulky?"
  1: 7000, // Strength training doesn't automatically make women bulky
  2: 6500, // Building muscle takes years, genetics, nutrition
  3: 6000, // Lifting improves strength, bone health, body composition
  4: 6500, // CTA + citation
  5: 5000, // Thumbnail end card
} as const;
