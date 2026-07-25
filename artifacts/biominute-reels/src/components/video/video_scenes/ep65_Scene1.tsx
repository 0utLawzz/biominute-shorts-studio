import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;

export function Scene1() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.volume = 0.6; audioRef.current.play().catch(() => {}); } }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }} transition={{ duration: 0.8 }}>
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />
      <div className="absolute top-[160px] flex flex-col items-center gap-5 z-10 w-full px-10">
        <motion.div className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ...SPRING_SMOOTH }}>
          <span className="text-[#7c3aed] font-display font-bold text-[22px] uppercase tracking-wider">Napping Depends on Timing</span>
        </motion.div>
        {[
          { icon: Clock, color: '#7c3aed', title: 'Short naps are usually fine', body: 'A 20–30 minute nap earlier in the day rarely disrupts nighttime sleep' },
          { icon: Sun, color: '#10b981', title: 'Earlier is better', body: 'Morning or early-afternoon naps align with your natural circadian dip' },
          { icon: Moon, color: '#2F6FED', title: 'Long naps change the math', body: 'Deep sleep during a long nap can reduce your nightly sleep drive' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} className="bg-[#1e293b] border border-[#334155] rounded-[24px] px-7 py-4 flex items-center gap-5 w-full"
              initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 + i * 0.3, ...SPRING_SMOOTH }}>
              <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.color}20`, border: `3px solid ${item.color}40` }}>
                <Icon size={28} color={item.color} strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-display font-bold text-[21px] uppercase leading-tight" style={{ color: item.color }}>{item.title}</p>
                <p className="text-[#94a3b8] font-body text-[19px] leading-snug mt-1">{item.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="absolute w-full px-12 text-center z-20" style={{ bottom: BOTTOM_SAFE_ZONE_PX + 80 }}>
        <motion.h2 className="text-[#f8fafc] text-[46px] font-bold uppercase tracking-wider font-display leading-tight"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.8 }}>
          Timing
          <motion.span className="text-[#7c3aed] block mt-2 drop-shadow-md"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.4, ...SPRING_SNAPPY }}>
            Is Everything
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
