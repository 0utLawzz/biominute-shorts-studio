import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, TrendingDown } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene2() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [days, setDays] = useState(10);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    // Tick the illness duration down
    const t = setInterval(() => {
      setDays((v) => (v > 7 ? v - 1 : 7));
    }, 400);
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
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-sparkle.mp3`} preload="auto" />

      <div className="absolute top-[180px] flex flex-col items-center gap-5 z-10 w-full px-10">
        <motion.div
          className="bg-[#2F6FED]/10 border border-[#2F6FED]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...SPRING_SMOOTH }}
        >
          <span className="text-[#2F6FED] font-display font-bold text-[22px] uppercase tracking-wider">The Duration Effect</span>
        </motion.div>

        {/* Calendar comparison */}
        <div className="flex gap-4 w-full">
          {/* Without regular vitamin C — longer illness */}
          <motion.div
            className="flex-1 rounded-[24px] p-6 flex flex-col items-center gap-3 border"
            style={{ backgroundColor: '#33415530', borderColor: '#64748b45' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, ...SPRING_SNAPPY }}
          >
            <Calendar size={44} color="#94a3b8" strokeWidth={1.8} />
            <span className="text-[#94a3b8] font-display font-bold text-[18px] uppercase text-center leading-tight">No Regular<br/>Vitamin C</span>
            <div className="w-full h-4 bg-[#1e293b] rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-[#94a3b8]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.0, duration: 1.2 }}
              />
            </div>
            <span className="text-[#64748b] font-body text-[16px] text-center">~10 days</span>
          </motion.div>

          {/* With regular vitamin C — shorter */}
          <motion.div
            className="flex-1 rounded-[24px] p-6 flex flex-col items-center gap-3 border"
            style={{ backgroundColor: '#10b98118', borderColor: '#10b98145' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, ...SPRING_SNAPPY }}
          >
            <Clock size={44} color="#10b981" strokeWidth={1.8} />
            <span className="text-[#10b981] font-display font-bold text-[18px] uppercase text-center leading-tight">Regular<br/>Vitamin C</span>
            <div className="w-full h-4 bg-[#1e293b] rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-[#10b981]"
                initial={{ width: '0%' }}
                animate={{ width: '70%' }}
                transition={{ delay: 1.0, duration: 1.2 }}
              />
            </div>
            <span className="text-[#64748b] font-body text-[16px] text-center">~7 days</span>
          </motion.div>
        </div>

        {/* Duration ticker */}
        <motion.div
          className="w-full bg-[#1e293b] border border-[#334155] rounded-[28px] px-8 py-6 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, ...SPRING_SMOOTH }}
        >
          <div className="flex items-center gap-3">
            <TrendingDown size={28} color="#10b981" strokeWidth={1.8} />
            <span className="text-[#94a3b8] font-display font-bold text-[20px] uppercase tracking-wide">Illness duration</span>
          </div>
          <motion.span
            className="text-[#10b981] font-display font-bold text-[64px] leading-none tabular-nums"
            key={days}
          >
            {days}d
          </motion.span>
          <span className="text-[#64748b] font-body text-[18px]">modest shortening for consistent takers</span>
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
          Shorten,
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, ...SPRING_SNAPPY }}
          >
            Not Stop
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
