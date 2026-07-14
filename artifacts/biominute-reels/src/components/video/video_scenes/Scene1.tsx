import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene1() {
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

      <div className="absolute top-[260px] flex items-center justify-center z-10 w-full">
        <div className="relative w-[360px] h-[360px] flex items-center justify-center">
          <motion.div
            className="absolute left-0 flex flex-col items-center gap-2"
            style={{ marginLeft: -20 }}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, ...SPRING_SMOOTH }}
          >
            <div className="w-[110px] h-[110px] rounded-full bg-[#0F172A] border-4 border-[#10b981] flex items-center justify-center drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              <span className="text-[#10b981] font-display font-black text-[36px]">30g</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center">
              <CheckCircle size={18} color="#0F172A" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[14px] uppercase tracking-wider text-[#10b981]">Correct</span>
          </motion.div>

          <motion.div
            className="absolute right-0 flex flex-col items-center gap-2"
            style={{ marginRight: -20 }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, ...SPRING_SMOOTH }}
          >
            <div className="w-[150px] h-[150px] rounded-full bg-[#0F172A] border-4 border-[#f97316] flex items-center justify-center drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]">
              <span className="text-[#f97316] font-display font-black text-[40px]">200g</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
              <AlertTriangle size={18} color="#0F172A" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[14px] uppercase tracking-wider text-[#f97316]">Too Much</span>
          </motion.div>

          <motion.div
            className="w-20 h-20 rounded-full bg-[#2F6FED] flex items-center justify-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0, ...SPRING_SNAPPY }}
          >
            <span className="text-[#0F172A] font-display font-black text-[24px]">VS</span>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute w-full px-14 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 100 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[58px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Healthy Doesn't Always Mean
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, ...SPRING_SNAPPY }}
          >
            Low in Calories
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
