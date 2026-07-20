import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Footprints, Droplets, Utensils, Moon, Wind, Dumbbell } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;

const CYCLE_ICONS = [
  { icon: Footprints, color: '#2F6FED', label: 'Move' },
  { icon: Droplets, color: '#14b8a6', label: 'Hydrate' },
  { icon: Utensils, color: '#10b981', label: 'Eat Well' },
  { icon: Moon, color: '#2F6FED', label: 'Sleep' },
  { icon: Wind, color: '#14b8a6', label: 'Breathe' },
  { icon: Dumbbell, color: '#f97316', label: 'Train' },
];

export function Scene1() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    const t = setInterval(() => setIdx((v) => (v + 1) % CYCLE_ICONS.length), 550);
    return () => clearInterval(t);
  }, []);

  const current = CYCLE_ICONS[idx];
  const Icon = current.icon;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />

      <div className="absolute top-[190px] flex flex-col items-center gap-6 z-10 w-full px-10">
        <motion.div
          className="bg-[#2F6FED]/10 border border-[#2F6FED]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...SPRING_SMOOTH }}
        >
          <span className="text-[#2F6FED] font-display font-bold text-[24px] uppercase tracking-wider">No Single Magic Fix</span>
        </motion.div>

        <motion.div
          key={idx}
          className="w-[190px] h-[190px] rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${current.color}18`, border: `4px solid ${current.color}55` }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Icon size={88} color={current.color} strokeWidth={1.6} />
        </motion.div>
        <motion.span
          key={`label-${idx}`}
          className="font-display font-bold text-[20px] uppercase tracking-wide"
          style={{ color: current.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {current.label}
        </motion.span>

        <motion.div
          className="bg-[#1e293b]/90 border border-[#334155] px-8 py-5 rounded-2xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, ...SPRING_SMOOTH }}
        >
          <p className="text-[#f8fafc] font-display font-bold text-[24px] leading-snug uppercase tracking-wide">
            No Magic Food or Workout — Just <span className="text-[#2F6FED]">The Basics, Done Well</span>
          </p>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 80 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[52px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Real Results Come
          <motion.span
            className="text-[#2F6FED] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, ...SPRING_SNAPPY }}
          >
            From the Basics
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
