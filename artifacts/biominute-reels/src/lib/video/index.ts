// Video template library - hook and animation presets

export { useVideoPlayer, useSceneTimer } from './hooks';
export type {
  SceneDurations,
  UseVideoPlayerOptions,
  UseVideoPlayerReturn,
} from './hooks';

export {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_ASPECT_RATIO,
  SAFE_ZONE_PADDING,
  SAFE_ZONE_PX,
  CANVAS_STYLE,
  SCENE_DURATIONS,
} from './config';

export {
  springs,
  easings,
  sceneTransitions,
  elementAnimations,
  charVariants,
  charContainerVariants,
  staggerConfigs,
  containerVariants,
  itemVariants,
  staggerDelay,
  customSpring,
  withDelay,
} from './animations';
