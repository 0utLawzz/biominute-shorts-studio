import { useEffect, useRef, useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL ?? '/';

export interface AudioAssets {
  background?: string;
  sceneSfx?: Record<string, string>;
}

interface AudioEngineProps {
  currentSceneKey: string;
  totalDurationMs?: number;
  assets?: AudioAssets;
  muted?: boolean;
  volume?: number;
  onReady?: () => void;
}

export function useAudioState() {
  const [muted, setMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Default is UNMUTED — only mute if the user explicitly set it
    const stored = window.localStorage.getItem('biominute-audio-muted');
    return stored === 'true';
  });

  const toggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      window.localStorage.setItem('biominute-audio-muted', String(next));
      return next;
    });
  };

  return { muted, toggleMuted };
}

export function AudioEngine({
  currentSceneKey,
  assets,
  muted = true,
  volume = 0.45,
}: AudioEngineProps) {
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const lastSceneRef = useRef<string>(currentSceneKey);
  const [audioCtxReady, setAudioCtxReady] = useState(false);

  const bgPath = assets?.background ? `${BASE_URL}${assets.background}` : null;
  const sceneSfx = assets?.sceneSfx;

  // Initialize background music once
  useEffect(() => {
    if (!bgPath || bgRef.current) return;
    const bg = new Audio(bgPath);
    bg.loop = true;
    bg.volume = volume;
    bg.preload = 'auto';
    bgRef.current = bg;

    const sfx = new Audio();
    sfx.preload = 'auto';
    sfxRef.current = sfx;

    const tryPlay = () => {
      setAudioCtxReady(true);
      if (bg.paused && !bg.muted) {
        bg.play().catch(() => {});
      }
    };

    // Try to auto-play immediately (works when browser allows it)
    bg.play().then(() => {
      setAudioCtxReady(true);
    }).catch(() => {
      // Browser blocked autoplay — wait for first user gesture
      window.addEventListener('pointerdown', tryPlay, { once: true });
      window.addEventListener('keydown', tryPlay, { once: true });
      window.addEventListener('touchstart', tryPlay, { once: true });
    });

    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
      bg.pause();
      sfx.pause();
      bgRef.current = null;
      sfxRef.current = null;
    };
  }, [bgPath, volume]);

  // Handle mute/unmute
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    bg.muted = muted;
    if (!muted && audioCtxReady && bg.paused) {
      bg.play().catch(() => {});
    }
  }, [muted, audioCtxReady]);

  // Trigger scene-change SFX
  useEffect(() => {
    if (!sceneSfx || !sfxRef.current) return;
    const cleanKey = currentSceneKey.replace(/_r[12]$/, '');
    const lastClean = lastSceneRef.current.replace(/_r[12]$/, '');
    if (cleanKey === lastClean) return;
    lastSceneRef.current = currentSceneKey;

    const path = sceneSfx[cleanKey] || sceneSfx['default'];
    if (!path) return;

    const sfx = sfxRef.current;
    sfx.src = `${BASE_URL}${path}`;
    sfx.volume = muted ? 0 : 0.6;
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }, [currentSceneKey, sceneSfx, muted]);

  return null;
}

export function AudioMuteButton({
  muted,
  toggle,
}: {
  muted: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className="w-14 h-14 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={muted ? 'Unmute audio' : 'Mute audio'}
    >
      {muted ? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
