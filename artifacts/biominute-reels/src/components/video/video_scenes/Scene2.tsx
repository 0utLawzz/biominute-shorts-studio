import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene2() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full p-[8%] flex flex-col items-center justify-center">
        
        <motion.div 
           className="w-full h-[calc(var(--cvh)*35)] bg-white/5 rounded-[calc(var(--cvw)*6)] border border-white/10 p-[calc(var(--cvw)*5)] relative mb-[calc(var(--cvh)*6)] overflow-hidden shadow-2xl"
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-[calc(var(--cvw)*10)] px-[calc(var(--cvw)*5)] opacity-10">
             {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-white/50" />)}
          </div>

          {/* Graph lines */}
          <svg className="absolute inset-0 w-full h-full pt-[calc(var(--cvw)*5)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
             {/* Spike (Orange) */}
             <motion.path 
               d="M 5,80 L 25,80 L 40,20 L 55,80 L 95,80" 
               fill="none" 
               stroke="var(--color-brand-orange)" 
               strokeWidth="2" 
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeDasharray="2 3"
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 0.4 }}
               transition={{ duration: 1.5, ease: "linear", delay: 0.5 }}
             />
             
             {/* Flatline (Emerald) */}
             <motion.path 
               d="M 5,80 L 25,80 Q 40,70 55,70 L 95,70" 
               fill="none" 
               stroke="var(--color-brand-emerald)" 
               strokeWidth="4" 
               strokeLinecap="round"
               strokeLinejoin="round"
               className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, ease: "easeOut", delay: 2.0 }}
             />
             
             {/* Pulse Dot on Emerald Line */}
             <motion.circle
               cx="95" cy="70" r="3" fill="var(--color-brand-emerald)"
               className="drop-shadow-[0_0_10px_rgba(16,185,129,1)]"
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 1, 0.5, 1], scale: [0, 1.5, 1, 1.5] }}
               transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
             />
          </svg>

          {/* Labels */}
          <motion.div 
             className="absolute top-[calc(var(--cvw)*6)] right-[calc(var(--cvw)*6)] bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald px-[calc(var(--cvw)*4)] py-[calc(var(--cvw)*2)] rounded-[calc(var(--cvw)*3)] font-bold backdrop-blur-sm shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
             style={{ fontSize: 'calc(var(--cvw)*4.5)' }}
             initial={{ opacity: 0, scale: 0, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ ...SPRING_SNAPPY, delay: 3.5 }}
          >
             Steady Glucose
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col items-center text-center gap-[calc(var(--cvh)*2)]">
           <motion.h2 
             className="text-white font-bold leading-tight"
             style={{ fontSize: 'calc(var(--cvw)*9.5)' }}
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ ...SPRING_SNAPPY, delay: 0.6 }}
           >
             Muscles absorb glucose
           </motion.h2>
           <motion.p 
             className="text-white/70 font-medium"
             style={{ fontSize: 'calc(var(--cvw)*6.5)' }}
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ ...SPRING_SNAPPY, delay: 0.8 }}
           >
             supporting steadier blood sugar
           </motion.p>
        </motion.div>

      </div>
    </motion.div>
  );
}
