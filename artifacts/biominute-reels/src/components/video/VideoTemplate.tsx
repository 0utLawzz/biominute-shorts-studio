import { useEffect, useMemo } from 'react';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { SCENE_DURATIONS, useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';

import { Scene0 } from './video_scenes/Scene0';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { ThumbnailSlide } from './video_scenes/ThumbnailSlide';

export { SCENE_DURATIONS };

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  0: Scene0,
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: ThumbnailSlide,
};

declare global {
  interface Window {
    __biominuteTotalDuration__?: number;
  }
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const totalDurationMs = useMemo(
    () => Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0),
    [],
  );

  useEffect(() => {
    window.__biominuteTotalDuration__ = totalDurationMs;
  }, [totalDurationMs]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-brand-navy)' }}
    >
      {/* Background persistent layer */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          scale: sceneIndex >= 3 ? 1.05 : 1,
        }}
        transition={{ duration: 4, ease: 'easeOut' }}
      >
        {/* Morning gradient shift effect */}
        <motion.div
           className="absolute inset-0 opacity-40 mix-blend-screen"
           animate={{
              background: sceneIndex >= 3 
                ? 'radial-gradient(circle at center, rgba(16, 185, 129, 0.5) 0%, transparent 70%)' 
                : 'radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.4) 0%, transparent 60%)' 
           }}
           transition={{ duration: 2 }}
        />
        <div className="absolute top-[-10%] left-[-20%] w-[calc(var(--cvw)*80)] h-[calc(var(--cvw)*80)] bg-brand-teal/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[calc(var(--cvw)*80)] h-[calc(var(--cvw)*80)] bg-brand-blue/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:calc(var(--cvw)*4)_calc(var(--cvw)*4)]" />

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* Audio layer */}
      <AudioEngine
        currentSceneKey={currentSceneKey}
        muted={muted}
        volume={0.35}
        assets={{
          background: 'audio/background.mp3',
          sceneSfx: {
            '0': 'audio/swoosh.mp3',
            '1': 'audio/pop.mp3',
            '2': 'audio/swoosh.mp3',
            '3': 'audio/pop.mp3',
            '4': 'audio/swoosh.mp3',
            '5': 'audio/pop.mp3',
            default: 'audio/swoosh.mp3',
          },
        }}
      />
    </div>
  );
}
