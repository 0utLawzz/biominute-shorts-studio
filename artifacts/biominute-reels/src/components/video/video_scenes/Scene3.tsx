import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Scale } from 'lucide-react';
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

          <motion.div
            className="w-[240px] h-[240px] rounded-full bg-[#0F172A] border-8 border-[#10b981] flex items-center justify-center drop-shadow-[0_0_60px_rgba(16,185,129,0.35)]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, ...SPRING_SMOOTH }}
          >
            <Scale size={88} color="#10b981" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            className="absolute top-0 left-[10%] flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ...SPRING_SMOOTH }}
          >
            <div className="w-[80px] h-[80px] rounded-full bg-[#f97316]/20 border-2 border-[#f97316] flex items-center justify-center">
              <span className="text-[#f97316] font-display font-black text-[20px]">BIG</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-[10%] flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, ...SPRING_SMOOTH }}
          >
            <div className="w-[80px] h-[80px] rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center">
              <span className="text-[#10b981] font-display font-black text-[20px]">OK</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 bg-[#10b981]/10 border border-[#10b981]/30 px-6 py-4 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, ...SPRING_SMOOTH }}
        >
          <span className="text-[#f8fafc] font-display font-bold text-[22px] uppercase tracking-wider">Balance, Not Avoidance</span>
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
          Portions Matter
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, ...SPRING_SNAPPY }}
          >
            If Your Goal Is Weight Loss
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
