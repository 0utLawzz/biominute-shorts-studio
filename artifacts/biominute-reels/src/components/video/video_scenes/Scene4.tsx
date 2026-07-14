import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { BookOpen, MessageCircle, Apple } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene4() {
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
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />

      <div className="absolute top-[240px] z-10 w-[90%]">
        <motion.div
          className="bg-[#1e293b]/90 border border-[#334155] rounded-[40px] p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...SPRING_SMOOTH }}
        >
          <div className="absolute top-6 right-8 w-4 h-4 bg-[#10b981] rounded-full" />

          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, ...SPRING_SNAPPY }}
          >
            <div className="w-24 h-24 rounded-full bg-[#10b981] flex items-center justify-center">
              <Apple size={48} color="#0F172A" strokeWidth={2} />
            </div>
          </motion.div>

          <motion.h2
            className="text-[#f8fafc] text-[55px] font-bold uppercase tracking-wider font-display leading-tight mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            What's Your Go-To
            <span className="text-[#10b981] block mt-2">Pre-Workout</span>
            <span className="text-[#f97316] block mt-2">Snack?</span>
          </motion.h2>

          <motion.div
            className="flex items-center gap-3 mt-8 bg-[#0F172A]/80 px-6 py-4 rounded-xl border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 1 }}
          >
            <MessageCircle size={28} color="#14b8a6" />
            <span className="text-[#94a3b8] text-[24px] font-medium">Share below 👇</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute w-full px-12 z-30 flex justify-center"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 60 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
      >
        <div className="flex items-center gap-4 text-[#94a3b8] text-[22px] font-medium bg-[#0F172A]/90 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
          <BookOpen className="shrink-0" size={28} />
          <p className="leading-relaxed text-left">
            Source: General sports nutrition research on pre-exercise fueling (e.g. ACSM/AND guidance)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
