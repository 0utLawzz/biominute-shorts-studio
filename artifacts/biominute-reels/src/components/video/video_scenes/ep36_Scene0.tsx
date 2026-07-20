import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Footprints, Droplets, Utensils, Moon, Wind, Dumbbell, Sparkles } from 'lucide-react';
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

  const icons = [Footprints, Droplets, Utensils, Moon, Wind, Dumbbell];
  const colors = ['#2F6FED', '#14b8a6', '#10b981', '#2F6FED', '#14b8a6', '#f97316'];

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
        className="absolute top-[16%] w-[500px] h-[500px] bg-gradient-to-tr from-[#10b981]/15 to-[#2F6FED]/10 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute top-[190px] flex flex-col items-center gap-5 z-10 w-full px-12">
        <div className="relative w-[280px] h-[220px] flex items-center justify-center">
          {icons.map((Icon, i) => {
            const angle = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * 105;
            const y = Math.sin(angle) * 85;
            return (
              <motion.div
                key={i}
                className="absolute w-[54px] h-[54px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors[i]}20`, border: `2px solid ${colors[i]}45`, left: `calc(50% + ${x}px - 27px)`, top: `calc(50% + ${y}px - 27px)` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15, ...SPRING_SNAPPY }}
              >
                <Icon size={24} color={colors[i]} strokeWidth={1.8} />
              </motion.div>
            );
          })}
          <motion.div
            className="w-[100px] h-[100px] rounded-full bg-[#10b981]/15 border-4 border-[#10b981]/60 flex items-center justify-center drop-shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={44} color="#10b981" strokeWidth={1.8} />
          </motion.div>
        </div>

        <motion.div
          className="flex items-center gap-3 bg-[#10b981]/10 border border-[#10b981]/30 px-7 py-4 rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, ...SPRING_SMOOTH }}
        >
          <span className="text-[#10b981] font-display font-bold text-[20px] uppercase tracking-wider">30 Episodes of Evidence</span>
        </motion.div>
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 90 }}
      >
        <motion.h1
          className="text-[#f8fafc] text-[46px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          What's the #1 Habit
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, ...SPRING_SNAPPY }}
          >
            That Improves
          </motion.span>
          <motion.span
            className="text-[#f8fafc] block mt-1 drop-shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, ...SPRING_SNAPPY }}
          >
            Your Health?
          </motion.span>
        </motion.h1>
      </div>
    </motion.div>
  );
}
