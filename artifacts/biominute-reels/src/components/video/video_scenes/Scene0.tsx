import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Citrus, ShieldAlert, Pill } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene0() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    const t = setInterval(() => setPulse((v) => v + 1), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-whoosh.mp3`} preload="auto" />

      {/* Background glow */}
      <motion.div
        className="absolute top-[12%] w-[520px] h-[520px] bg-gradient-to-tr from-[#f97316]/15 to-[#10b981]/10 rounded-full blur-[130px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Visual: orange/citrus glow vs shrinking virus */}
      <div className="absolute top-[185px] flex flex-col items-center gap-6 z-10 w-full px-12">
        <motion.div
          className="relative w-[220px] h-[220px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, ...SPRING_SNAPPY }}
        >
          {/* Citrus/orange ring */}
          <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0">
            <circle cx="110" cy="110" r="100" fill="none" stroke="#f97316" strokeWidth="6" opacity="0.35" />
            <circle cx="110" cy="110" r="80" fill="none" stroke="#f97316" strokeWidth="4" opacity="0.25" />
            <circle cx="110" cy="110" r="60" fill="none" stroke="#f97316" strokeWidth="3" opacity="0.15" />
            <motion.circle
              cx="110" cy="110" r="10"
              fill="#f97316"
              animate={{ r: [10, 18, 10] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>

          {/* Virus icon shrinks */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.7, opacity: 0.5 }}
            transition={{ delay: 1.2, duration: 1.5, ease: 'easeInOut' }}
          >
            <ShieldAlert size={72} color="#f97316" strokeWidth={1.4} />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 bg-[#f97316]/10 border border-[#f97316]/30 px-7 py-4 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, ...SPRING_SMOOTH }}
        >
          <Pill size={20} color="#f97316" />
          <span className="text-[#f97316] font-display font-bold text-[18px] uppercase tracking-wider">S5 • Nutrition &amp; Myths</span>
        </motion.div>
      </div>

      {/* Hook text */}
      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 90 }}
      >
        <motion.h1
          className="text-[#f8fafc] text-[44px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Can Vitamin C
          <motion.span
            className="text-[#f97316] block mt-2 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, ...SPRING_SNAPPY }}
          >
            Actually Prevent
          </motion.span>
          <motion.span
            className="text-[#10b981] block mt-1 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, ...SPRING_SNAPPY }}
          >
            a Cold?
          </motion.span>
        </motion.h1>
      </div>
    </motion.div>
  );
}
