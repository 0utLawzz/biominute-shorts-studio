import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Zap, Activity } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

export function Scene2() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.volume = 0.6; audioRef.current.play().catch(() => {}); } }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }} transition={{ duration: 0.8 }}>
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />
      <div className="absolute top-[110px] z-10 w-[90%] flex flex-col items-center gap-5">
        <motion.p className="text-[#94a3b8] font-display text-[24px] uppercase tracking-widest text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Fitness Gauge Over Time</motion.p>

        <div className="flex gap-4 w-full">
          {/* HIIT side */}
          <motion.div className="flex-1 bg-[#f97316]/10 border border-[#f97316]/30 rounded-[24px] p-5 flex flex-col items-center gap-3"
            initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, ...SPRING_SMOOTH }}>
            <Zap size={44} color="#f97316" strokeWidth={1.4} />
            <p className="text-[#f97316] font-display font-bold text-[18px] uppercase">HIIT</p>
            <p className="text-[#94a3b8] text-[15px] text-center">Less time, intense bursts</p>
            <div className="w-full flex flex-col gap-1 mt-2">
              {['Fat loss', 'VO₂max', 'Recovery'].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <p className="text-[#64748b] text-[13px] w-16 text-right shrink-0">{label}</p>
                  <div className="flex-1 h-4 bg-[#1e293b] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#f97316] rounded-full" initial={{ width: 0 }}
                      animate={{ width: i === 2 ? '45%' : '78%' }} transition={{ delay: 1.0 + i * 0.2, duration: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Steady side */}
          <motion.div className="flex-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-[24px] p-5 flex flex-col items-center gap-3"
            initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, ...SPRING_SMOOTH }}>
            <Activity size={44} color="#10b981" strokeWidth={1.4} />
            <p className="text-[#10b981] font-display font-bold text-[18px] uppercase">Steady</p>
            <p className="text-[#94a3b8] text-[15px] text-center">More time, moderate pace</p>
            <div className="w-full flex flex-col gap-1 mt-2">
              {['Fat loss', 'VO₂max', 'Recovery'].map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <p className="text-[#64748b] text-[13px] w-16 text-right shrink-0">{label}</p>
                  <div className="flex-1 h-4 bg-[#1e293b] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#10b981] rounded-full" initial={{ width: 0 }}
                      animate={{ width: i === 2 ? '82%' : '75%' }} transition={{ delay: 1.0 + i * 0.2, duration: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="bg-[#2F6FED]/10 border border-[#2F6FED]/30 rounded-2xl px-6 py-4 w-full text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, ...SPRING_SMOOTH }}>
          <p className="text-[#2F6FED] font-display font-bold text-[22px] uppercase">Similar fitness gains — different time cost</p>
        </motion.div>
      </div>
      <div className="absolute w-full px-12 text-center z-20" style={{ bottom: BOTTOM_SAFE_ZONE_PX + 60 }}>
        <motion.p className="text-[#64748b] font-body text-[18px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
          Source: Milanović Z et al. (2015) — HIIT vs MICT review
        </motion.p>
      </div>
    </motion.div>
  );
}
