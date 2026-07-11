import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

function FluidDepletionGraphic() {
  return (
    <div className="w-full" style={{ height: 'calc(var(--cvh)*25)' }}>
      <svg viewBox="0 0 100 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Human outline / Body */}
        <path d="M30,150 L30,60 C30,40 70,40 70,60 L70,150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="25" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        
        {/* Fluid level dropping */}
        <clipPath id="fluidClip">
          <motion.rect
            x="20" y="0" width="60" height="160"
            initial={{ height: 160, y: 0 }}
            animate={{ height: 60, y: 100 }}
            transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }}
          />
        </clipPath>
        
        <g clipPath="url(#fluidClip)">
          <path d="M30,150 L30,60 C30,40 70,40 70,60 L70,150" fill="#2F6FED" opacity="0.6" />
          <circle cx="50" cy="25" r="15" fill="#2F6FED" opacity="0.6" />
        </g>

        {/* Droplets escaping (sweat/breath) */}
        <motion.circle cx="75" cy="40" r="3" fill="#14b8a6"
          initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -20, x: 10 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
        <motion.circle cx="25" cy="80" r="2" fill="#14b8a6"
          initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -30, x: -10 }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
      </svg>
    </div>
  );
}

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center p-[8%] gap-[calc(var(--cvh)*3)]">
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
          <FluidDepletionGraphic />
        </motion.div>

        <motion.span
          className="text-white/90 font-medium leading-snug text-center mt-[calc(var(--cvh)*2)]"
          style={{ fontSize: 'calc(var(--cvw)*6.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 1.0 }}
        >
          After <span className="text-brand-blue font-bold">7 to 8 hours</span> of sleep...
        </motion.span>

        <motion.div
          className="flex flex-col items-center text-center gap-[calc(var(--cvh)*1.5)] bg-brand-blue/10 border border-brand-blue/20 rounded-[calc(var(--cvw)*3)] px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*3)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 3.0 }}
        >
          <span className="text-white font-bold leading-tight drop-shadow-md"
            style={{ fontSize: 'calc(var(--cvw)*7)' }}>
            Your body is naturally <span className="text-brand-teal">low on fluids</span>
          </span>
          <span className="text-white/70" style={{ fontSize: 'calc(var(--cvw)*4.5)' }}>
            from breathing and sweating overnight.
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
}
