import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Droplets, Zap, User } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene2() {
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

      <div className="absolute top-[130px] z-10 w-[90%] flex flex-col items-center gap-5">
        {/* Everyday scenario */}
        <motion.div
          className="w-full bg-[#2F6FED]/10 border border-[#2F6FED]/30 rounded-[28px] p-6 flex items-center gap-5"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, ...SPRING_SMOOTH }}
        >
          <div className="w-20 h-20 rounded-full bg-[#2F6FED]/20 border-2 border-[#2F6FED]/50 flex items-center justify-center shrink-0">
            <User size={40} color="#2F6FED" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#2F6FED] font-display font-bold text-[22px] uppercase">Everyday Activity</p>
            <p className="text-[#94a3b8] text-[19px] mt-1">Desk work, light walking</p>
            <p className="text-[#10b981] font-bold text-[20px] mt-2">✓ Water is enough</p>
          </div>
        </motion.div>

        <motion.div
          className="text-[#64748b] font-display text-[24px] uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          vs
        </motion.div>

        {/* Heavy loss scenario */}
        <motion.div
          className="w-full bg-[#f97316]/10 border border-[#f97316]/30 rounded-[28px] p-6 flex items-center gap-5"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.1, ...SPRING_SMOOTH }}
        >
          <div className="w-20 h-20 rounded-full bg-[#f97316]/20 border-2 border-[#f97316]/50 flex items-center justify-center shrink-0">
            <Zap size={40} color="#f97316" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#f97316] font-display font-bold text-[22px] uppercase">Heavy Sweat Loss</p>
            <p className="text-[#94a3b8] text-[19px] mt-1">1hr+ exercise, illness, heat</p>
            <p className="text-[#f97316] font-bold text-[20px] mt-2">⚡ Electrolytes help</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#1e293b] border border-[#334155] rounded-2xl px-7 py-4 flex items-center gap-4 w-full mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, ...SPRING_SMOOTH }}
        >
          <Droplets size={30} color="#14b8a6" />
          <p className="text-[#94a3b8] text-[20px]">Most casual exercisers only need water</p>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 60 }}
      >
        <motion.p
          className="text-[#64748b] font-body text-[18px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          Source: Sawka MN et al. — ACSM hydration guidelines
        </motion.p>
      </div>
    </motion.div>
  );
}
