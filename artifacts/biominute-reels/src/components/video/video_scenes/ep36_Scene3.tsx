import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Repeat, Clock, Sparkles } from 'lucide-react';
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

      <div className="absolute top-[190px] flex flex-col items-center gap-7 z-10 w-full px-10">
        <motion.div
          className="bg-[#2F6FED]/10 border border-[#2F6FED]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...SPRING_SMOOTH }}
        >
          <span className="text-[#2F6FED] font-display font-bold text-[24px] uppercase tracking-wider">The Reality</span>
        </motion.div>

        {[
          { icon: Repeat, color: '#10b981', title: 'Small Habits', body: 'Beat big, unsustainable swings' },
          { icon: Clock, color: '#2F6FED', title: 'Repeated Over Time', body: 'Consistency compounds' },
          { icon: Sparkles, color: '#f97316', title: 'That\u2019s the #1 Habit', body: 'Showing up, again and again' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="bg-[#1e293b] border border-[#334155] rounded-[28px] px-8 py-6 flex items-center gap-6 w-full"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.3, ...SPRING_SMOOTH }}
            >
              <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.color}20`, border: `3px solid ${item.color}40` }}>
                <Icon size={34} color={item.color} strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-display font-bold text-[24px] uppercase leading-tight" style={{ color: item.color }}>{item.title}</p>
                <p className="text-[#94a3b8] font-body text-[20px] leading-snug mt-1">{item.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="absolute w-full px-12 text-center z-20"
        style={{ bottom: BOTTOM_SAFE_ZONE_PX + 80 }}
      >
        <motion.h2
          className="text-[#f8fafc] text-[56px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Consistency Is
          <motion.span
            className="text-[#10b981] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, ...SPRING_SNAPPY }}
          >
            The Real Superpower
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
