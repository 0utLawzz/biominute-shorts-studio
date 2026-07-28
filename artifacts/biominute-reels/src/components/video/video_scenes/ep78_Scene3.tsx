import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Wand2, MoonStar, Focus } from 'lucide-react';
import { BOTTOM_SAFE_ZONE_PX } from '@/lib/video';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SMOOTH = { type: 'spring', stiffness: 120, damping: 25 } as const;
const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30 } as const;

export function Scene3() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.volume = 0.6; audioRef.current.play().catch(() => {}); } }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-body"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }} transition={{ duration: 0.8 }}>
      <audio ref={audioRef} src={`${BASE_URL}audio/sfx-pop.mp3`} preload="auto" />
      <div className="absolute top-[150px] flex flex-col items-center gap-5 z-10 w-full px-10">
        <motion.div className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-8 py-4 rounded-2xl"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ...SPRING_SMOOTH }}>
          <span className="text-[#7c3aed] font-display font-bold text-[22px] uppercase tracking-wider">Build Your Own Sleep Scene</span>
        </motion.div>
        {[
          { icon: Wand2, color: '#7c3aed', title: 'Keep it detailed', body: 'Add colors, textures, sounds, and movement so your mind has something rich to hold onto' },
          { icon: MoonStar, color: '#2F6FED', title: 'Keep it calm', body: 'Choose a scene that feels peaceful and unhurried, not exciting or stressful' },
          { icon: Focus, color: '#7c3aed', title: 'Keep it simple', body: 'The point is just enough mental engagement to nudge your attention away from tossing and turning' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} className="bg-[#1e293b] border border-[#334155] rounded-[24px] px-7 py-4 flex items-center gap-5 w-full"
              initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + i * 0.3, ...SPRING_SMOOTH }}>
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
          Detailed Imagery
          <motion.span className="text-[#7c3aed] block mt-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, ...SPRING_SNAPPY }}>
            Can Quiet the Mind
          </motion.span>
        </motion.h2>
      </div>
    </motion.div>
  );
}