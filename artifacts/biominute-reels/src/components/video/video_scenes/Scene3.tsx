import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Scale, Calendar, CheckCircle } from 'lucide-react';
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

      <div className="absolute top-[185px] flex flex-col items-center gap-6 z-10 w-full px-10">
        <motion.div
          className="bg-[#f97316]/10 border border-[#f97316]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...SPRING_SMOOTH }}
        >
          <span className="text-[#f97316] font-display font-bold text-[22px] uppercase tracking-wider">The Real Comparison</span>
        </motion.div>

        {/* Balance scale — IF vs Traditional at equal height */}
        <motion.div
          className="relative w-full flex items-end justify-center gap-6 h-[190px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Left pan — IF */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, ...SPRING_SMOOTH }}
          >
            <div className="bg-[#10b981]/15 border-2 border-[#10b981]/50 rounded-[20px] px-5 py-4 w-[130px] flex flex-col items-center gap-1">
              <span className="text-[#10b981] font-display font-bold text-[20px] uppercase">IF</span>
              <span className="text-[#94a3b8] font-body text-[15px] text-center">16:8 or 5:2</span>
            </div>
            <div className="w-0.5 h-12 bg-[#334155]" />
          </motion.div>

          {/* Scale centre icon */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, ...SPRING_SNAPPY }}
          >
            <Scale size={56} color="#f97316" strokeWidth={1.6} />
          </motion.div>

          {/* Right pan — Traditional */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, ...SPRING_SMOOTH }}
          >
            <div className="bg-[#2F6FED]/15 border-2 border-[#2F6FED]/50 rounded-[20px] px-5 py-4 w-[130px] flex flex-col items-center gap-1">
              <Calendar size={22} color="#2F6FED" strokeWidth={1.8} />
              <span className="text-[#2F6FED] font-display font-bold text-[20px] uppercase">Traditional</span>
            </div>
            <div className="w-0.5 h-12 bg-[#334155]" />
          </motion.div>
        </motion.div>

        {/* Equal outcome card */}
        <motion.div
          className="bg-[#1e293b] border border-[#334155] rounded-[28px] px-8 py-5 flex items-center gap-5 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, ...SPRING_SMOOTH }}
        >
          <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#10b98120', border: '3px solid #10b98140' }}>
            <CheckCircle size={30} color="#10b981" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-display font-bold text-[22px] uppercase leading-tight text-[#10b981]">Same results</p>
            <p className="text-[#94a3b8] font-body text-[19px] leading-snug mt-1">When calories are equal, outcomes are equal</p>
          </div>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 80 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[50px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Best Fit Wins
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, ...SPRING_SNAPPY }}
          >
            Not Best Method
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
