import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene3() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full p-[8%] flex flex-col items-center justify-center">
        
        {/* Center icon */}
        <motion.div 
           className="relative flex items-center justify-center w-[50%] aspect-square mb-[calc(var(--cvh)*6)]"
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
           {/* Background pulses */}
           <motion.div 
             className="absolute inset-0 rounded-full bg-brand-blue/30 blur-[40px]"
             animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
           />
           <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-transparent rounded-full border-[calc(var(--cvw)*0.5)] border-brand-blue/40 shadow-[inset_0_0_20px_rgba(47,111,237,0.3)]" />
           <Activity className="w-[45%] h-[45%] text-brand-blue relative z-10 drop-shadow-[0_0_15px_rgba(47,111,237,0.8)]" />
        </motion.div>

        {/* Text Cards */}
        <div className="flex flex-col gap-[calc(var(--cvh)*2.5)] w-full">
           <motion.div 
             className="bg-white/5 border border-white/10 rounded-[calc(var(--cvw)*5)] p-[calc(var(--cvw)*6)] flex items-center gap-[calc(var(--cvw)*5)] shadow-lg"
             initial={{ x: -50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ ...SPRING_SMOOTH, delay: 0.5 }}
           >
              <div className="w-[calc(var(--cvw)*14)] h-[calc(var(--cvw)*14)] rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                <svg className="w-[50%] h-[50%]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-bold leading-tight" style={{ fontSize: 'calc(var(--cvw)*6.5)' }}>Aids digestion</p>
           </motion.div>

           <motion.div 
             className="bg-white/5 border border-white/10 rounded-[calc(var(--cvw)*5)] p-[calc(var(--cvw)*6)] flex items-center gap-[calc(var(--cvw)*5)] shadow-lg"
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ ...SPRING_SMOOTH, delay: 0.8 }}
           >
              <div className="w-[calc(var(--cvw)*14)] h-[calc(var(--cvw)*14)] rounded-full bg-brand-emerald/20 flex items-center justify-center text-brand-emerald shrink-0">
                <Zap className="w-[50%] h-[50%] fill-brand-emerald/20" />
              </div>
              <p className="text-white font-bold leading-tight" style={{ fontSize: 'calc(var(--cvw)*6.5)' }}>Reduces post-meal slump</p>
           </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
