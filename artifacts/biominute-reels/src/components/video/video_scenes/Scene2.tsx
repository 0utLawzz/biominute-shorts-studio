import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

function WaterGlassGraphic() {
  return (
    <div className="w-full flex justify-center" style={{ height: 'calc(var(--cvh)*25)' }}>
      <svg viewBox="0 0 100 120" className="h-full" preserveAspectRatio="xMidYMid meet">
        {/* Glass outline */}
        <path d="M25,10 L30,110 C30,115 70,115 70,110 L75,10" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        
        {/* Water filling up */}
        <clipPath id="glassClip">
          <motion.rect
            x="20" width="60" height="120"
            initial={{ y: 120 }}
            animate={{ y: 30 }}
            transition={{ duration: 2.5, delay: 1.5, ease: "easeInOut" }}
          />
        </clipPath>
        
        <g clipPath="url(#glassClip)">
          <path d="M25,10 L30,110 C30,115 70,115 70,110 L75,10" fill="url(#waterGrad)" />
        </g>

        <defs>
          <linearGradient id="waterGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#2F6FED" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Droplets falling into glass */}
        <motion.path 
          d="M50,0 C50,0 45,10 50,15 C55,10 50,0 50,0" 
          fill="#14b8a6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: [ -20, 100 ], opacity: [ 0, 1, 0 ] }}
          transition={{ duration: 0.8, repeat: 3, delay: 0.5, repeatDelay: 0.2 }}
        />
      </svg>
    </div>
  );
}

export function Scene2() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-[8%] gap-[calc(var(--cvh)*4)]">
        
        <motion.span
          className="text-white/90 font-medium leading-snug text-center"
          style={{ fontSize: 'calc(var(--cvw)*6.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 0.2 }}
        >
          Drinking a <span className="text-brand-teal font-bold">glass of water</span> before your first coffee...
        </motion.span>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.5 }}
        >
          <WaterGlassGraphic />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-[calc(var(--cvh)*2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 3.5 }}
        >
          <div className="flex items-center gap-[calc(var(--cvw)*3)] bg-brand-teal/15 border border-brand-teal/30 rounded-full px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*1.5)]">
            <span style={{ fontSize: 'calc(var(--cvw)*6)' }}>💧</span>
            <span className="text-brand-teal font-bold" style={{ fontSize: 'calc(var(--cvw)*5)' }}>
              Replaces overnight losses
            </span>
          </div>
          <div className="flex items-center gap-[calc(var(--cvw)*3)] bg-brand-emerald/15 border border-brand-emerald/30 rounded-full px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*1.5)]">
            <span style={{ fontSize: 'calc(var(--cvw)*6)' }}>⚡</span>
            <span className="text-brand-emerald font-bold" style={{ fontSize: 'calc(var(--cvw)*5)' }}>
              Supports normal alertness
            </span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
