import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-[8%]">

        {/* Citation Chip */}
        <motion.div
          className="absolute top-[8%] left-[8%] right-[8%] bg-white/5 border border-white/10 rounded-xl p-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.5 }}
        >
          <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1">Source</p>
          <p className="text-white/70 text-[10px] leading-tight">
            Popkin BM et al. (2010), Nutrition Reviews — Water, hydration and health
          </p>
        </motion.div>

        {/* Logo Mark */}
        <motion.div
          className="relative w-[30%] aspect-square mb-[calc(var(--cvh)*4)] flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, delay: 1 }}
        >
          <div className="absolute inset-0 bg-brand-emerald/20 blur-[30px] rounded-full" />
          <div className="absolute w-[80%] h-[80%] rounded-full border-[2px] border-brand-teal flex items-center justify-center relative overflow-hidden bg-brand-navy">
            {/* Simple DNA/Heartbeat Logo abstraction */}
            <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
              <path d="M 10 50 L 30 50 L 40 20 L 60 80 L 70 50 L 90 50" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-emerald font-black tracking-tight"
          style={{ fontSize: 'calc(var(--cvw)*12)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, delay: 1.4 }}
        >
          BioMinute
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-[calc(var(--cvh)*6)] bg-white/10 border border-white/20 rounded-2xl p-[calc(var(--cvw)*5)] text-center w-full"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 2.8 }}
        >
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest block mb-2">Join the discussion</span>
          <span className="text-white font-bold leading-tight drop-shadow-md" style={{ fontSize: 'calc(var(--cvw)*6.5)' }}>
            Do you reach for water or coffee first thing?
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
}
