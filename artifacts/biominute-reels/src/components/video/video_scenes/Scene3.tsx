import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Droplets } from 'lucide-react';
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
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />

      <div className="absolute top-[150px] flex flex-col items-center gap-5 z-10 w-full px-10">
        <motion.div
          className="bg-[#14b8a6]/10 border border-[#14b8a6]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...SPRING_SMOOTH }}
        >
          <span className="text-[#14b8a6] font-display font-bold text-[22px] uppercase tracking-wider">Bottom Line</span>
        </motion.div>

        {[
          { icon: CheckCircle2, color: '#10b981', label: 'Skip electrolyte drinks when resting', ok: true },
          { icon: CheckCircle2, color: '#10b981', label: 'Use them for 60+ min hard exercise', ok: true },
          { icon: CheckCircle2, color: '#10b981', label: 'They matter during illness with fluid loss', ok: true },
          { icon: XCircle, color: '#f97316', label: 'Don\'t use them just for "hydration" at rest', ok: false },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="bg-[#1e293b] border border-[#334155] rounded-[20px] px-6 py-4 flex items-center gap-5 w-full"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.25, ...SPRING_SMOOTH }}
            >
              <Icon size={32} color={item.color} strokeWidth={1.8} className="shrink-0" />
              <p className="font-body text-[20px] leading-snug" style={{ color: item.ok ? '#f8fafc' : '#94a3b8' }}>{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 80 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[46px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          Match the
          <motion.span
            className="text-[#14b8a6] block mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, ...SPRING_SNAPPY }}
          >
            Situation
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
