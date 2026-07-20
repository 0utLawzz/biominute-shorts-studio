import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Clock, Utensils, Moon } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene0() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    const t = setInterval(() => setTick((v) => v + 1), 800);
    return () => clearInterval(t);
  }, []);

  // Animated clock hand angle
  const handDeg = (tick % 12) * 30;

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
        className="absolute top-[12%] w-[520px] h-[520px] bg-gradient-to-tr from-[#10b981]/15 to-[#2F6FED]/10 rounded-full blur-[130px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Clock visual */}
      <div className="absolute top-[185px] flex flex-col items-center gap-6 z-10 w-full px-12">
        <motion.div
          className="relative w-[220px] h-[220px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, ...SPRING_SNAPPY }}
        >
          {/* Clock face — split half emerald / half blue */}
          <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0">
            {/* Eating window (top half — emerald) */}
            <path d="M 110 110 L 110 10 A 100 100 0 0 1 210 110 Z" fill="#10b981" opacity="0.25" />
            <path d="M 110 110 L 210 110 A 100 100 0 0 1 110 210 Z" fill="#10b981" opacity="0.12" />
            {/* Fasting window (left half — blue, dimmed) */}
            <path d="M 110 110 L 110 210 A 100 100 0 0 1 10 110 Z" fill="#2F6FED" opacity="0.15" />
            <path d="M 110 110 L 10 110 A 100 100 0 0 1 110 10 Z" fill="#2F6FED" opacity="0.08" />
            {/* Clock ring */}
            <circle cx="110" cy="110" r="100" fill="none" stroke="#334155" strokeWidth="4" />
            {/* Clock hand */}
            <motion.line
              x1="110" y1="110"
              x2="110" y2="30"
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ rotate: handDeg }}
              style={{ originX: '110px', originY: '110px' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            <circle cx="110" cy="110" r="8" fill="#10b981" />
          </svg>

          {/* Labels */}
          <motion.div
            className="absolute top-2 right-0 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Utensils size={16} color="#10b981" />
            <span className="text-[#10b981] font-display font-bold text-[13px] uppercase">Eating</span>
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-0 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Moon size={16} color="#2F6FED" />
            <span className="text-[#2F6FED] font-display font-bold text-[13px] uppercase">Fasting</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 bg-[#10b981]/10 border border-[#10b981]/30 px-7 py-4 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, ...SPRING_SMOOTH }}
        >
          <Clock size={20} color="#10b981" />
          <span className="text-[#10b981] font-display font-bold text-[18px] uppercase tracking-wider">S5 • Nutrition &amp; Myths</span>
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
          Does Intermittent
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, ...SPRING_SNAPPY }}
          >
            Fasting
          </motion.span>
          <motion.span
            className="text-[#f97316] block mt-1 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, ...SPRING_SNAPPY }}
          >
            Actually Work?
          </motion.span>
        </motion.h1>
      </div>
    </motion.div>
  );
}
