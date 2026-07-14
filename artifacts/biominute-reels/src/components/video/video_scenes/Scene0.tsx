import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Moon } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene0() {
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

      <motion.div
        className="absolute top-[20%] w-[550px] h-[550px] bg-gradient-to-tr from-[#10b981]/20 to-[#2F6FED]/10 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-[260px] flex items-center justify-center z-10 w-full">
        <motion.div
          className="relative w-[300px] h-[300px] rounded-full bg-[#0F172A] border-8 border-[#f97316] flex items-center justify-center drop-shadow-[0_0_60px_rgba(249,115,22,0.35)]"
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...SPRING_SMOOTH }}
        >
          <Moon size={140} color="#f97316" strokeWidth={1.5} />
          <motion.div
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#10b981] flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, ...SPRING_SNAPPY }}
          >
            <span className="text-[#0F172A] font-display font-black text-[22px]">10PM</span>
          </motion.div>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-14 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 100 }}
      >
        <motion.h1
          className="text-[#f8fafc] text-[64px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Does Eating Late at Night
          <motion.span
            className="text-[#f97316] block mt-3 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, ...SPRING_SNAPPY }}
          >
            Cause Weight Gain?
          </motion.span>
        </motion.h1>
      </div>
    </motion.div>
  );
}
