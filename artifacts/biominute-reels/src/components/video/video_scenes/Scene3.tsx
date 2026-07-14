import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { GitFork, Apple, Cookie } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene3() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
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

      <div className="absolute top-[240px] flex flex-col items-center z-10 w-full">
        <div className="relative w-[340px] h-[340px] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#10b981]/15 to-[#2F6FED]/10 blur-[40px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
            <motion.path
              d="M 170 80 L 170 170 L 100 250"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.path
              d="M 170 170 L 240 250"
              fill="none"
              stroke="#f97316"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </svg>

          <motion.div
            className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full bg-[#0F172A] border-4 border-[#f97316] flex items-center justify-center drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, ...SPRING_SMOOTH }}
          >
            <GitFork size={48} color="#f97316" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            className="absolute bottom-[40px] left-[40px] w-[100px] h-[100px] rounded-full bg-[#0F172A] border-4 border-[#10b981] flex items-center justify-center drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, ...SPRING_SMOOTH }}
          >
            <Apple size={48} color="#10b981" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            className="absolute bottom-[40px] right-[40px] w-[100px] h-[100px] rounded-full bg-[#0F172A] border-4 border-[#f97316] flex items-center justify-center drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, ...SPRING_SMOOTH }}
          >
            <Cookie size={48} color="#f97316" strokeWidth={1.5} />
          </motion.div>
        </div>

        <motion.div
          className="mt-8 bg-[#f97316]/10 border border-[#f97316]/30 px-6 py-4 rounded-2xl text-center max-w-[80%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, ...SPRING_SMOOTH }}
        >
          <span className="text-[#f8fafc] font-display font-bold text-[22px] uppercase tracking-wider">It's the Habits, Not the Clock</span>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-14 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 100 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[58px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Late Snacking Often Means
          <motion.span
            className="text-[#f97316] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, ...SPRING_SNAPPY }}
          >
            More and Less Nutritious Food
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
