import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full p-[8%] flex flex-col items-center justify-center">
        
        {/* Animated Clock / Plate */}
        <div className="relative w-[65%] aspect-square mb-[calc(var(--cvh)*6)] flex items-center justify-center">
          
          {/* Clock Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" overflow="visible">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-teal/20" />
            <motion.circle 
              cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" className="text-brand-teal drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]"
              strokeLinecap="round"
              strokeDasharray="301.59"
              initial={{ strokeDashoffset: 301.59 }}
              animate={{ strokeDashoffset: 150.8 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
            />
          </svg>

          {/* Plate Image */}
          <motion.img 
            src={`${BASE_URL}images/plate-overhead.png`} 
            alt="Plate"
            className="w-[75%] h-[75%] object-contain relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...SPRING_SMOOTH, delay: 0.4 }}
          />
          
          {/* 30 Min Badge */}
          <motion.div 
            className="absolute -right-[5%] -bottom-[5%] bg-brand-orange text-white rounded-full flex items-center justify-center font-bold z-20 shadow-[0_10px_20px_rgba(249,115,22,0.4)] border-[calc(var(--cvw)*1)] border-brand-navy"
            style={{ 
               width: 'calc(var(--cvw)*22)', 
               height: 'calc(var(--cvw)*22)',
               fontSize: 'calc(var(--cvw)*6)' 
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...SPRING_SNAPPY, delay: 2.0 }}
          >
            30 Min
          </motion.div>
        </div>

        {/* Text */}
        <motion.div className="flex flex-col items-center text-center gap-[calc(var(--cvh)*2)] w-full">
           <motion.p 
             className="text-white/80 font-medium tracking-wide uppercase"
             style={{ fontSize: 'calc(var(--cvw)*5.5)' }}
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ ...SPRING_SNAPPY, delay: 0.8 }}
           >
             Light movement within
           </motion.p>
           <motion.p 
             className="text-brand-teal font-bold bg-brand-teal/10 px-[calc(var(--cvw)*6)] py-[calc(var(--cvw)*3)] rounded-[calc(var(--cvw)*4)] border border-brand-teal/20"
             style={{ fontSize: 'calc(var(--cvw)*8.5)' }}
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ ...SPRING_SNAPPY, delay: 1.0 }}
           >
             30 minutes of eating
           </motion.p>
        </motion.div>

      </div>
    </motion.div>
  );
}
