import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene4() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center p-[8%] gap-[calc(var(--cvh)*3)]">

        {/* Headline */}
        <motion.div
          className="flex flex-col gap-[calc(var(--cvh)*1.5)]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.1 }}
        >
          <span className="text-brand-muted font-medium uppercase tracking-widest"
            style={{ fontSize: 'calc(var(--cvw)*3.8)' }}>The Dose</span>
          <span className="text-white font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'calc(var(--cvw)*11)' }}>
            You don't need a gym
          </span>
        </motion.div>

        {/* Walking shoes */}
        <motion.div
          className="relative w-full flex items-center justify-center"
          style={{ height: 'calc(var(--cvh)*22)' }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-brand-emerald/10 blur-[60px] rounded-full" />
          <img
            src={`${BASE_URL}images/walking-shoes-3d.png`}
            alt="Walking shoes"
            className="h-full w-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(16,185,129,0.4)]"
          />
          {/* Glow ring */}
          <motion.div
            className="absolute bottom-[5%] w-[60%] h-[8%] bg-brand-emerald/20 blur-xl rounded-full"
            animate={{ scaleX: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Stat cards */}
        <div className="flex flex-col gap-[calc(var(--cvh)*2)]">

          <motion.div
            className="flex items-center gap-[calc(var(--cvw)*4)] bg-brand-emerald/15 border border-brand-emerald/40 rounded-[calc(var(--cvw)*3)] px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*2)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.8 }}
          >
            <span style={{ fontSize: 'calc(var(--cvw)*10)' }}>🕐</span>
            <div className="flex flex-col">
              <span className="text-brand-emerald font-extrabold leading-none"
                style={{ fontSize: 'calc(var(--cvw)*10)' }}>10–15</span>
              <span className="text-white/70 font-medium"
                style={{ fontSize: 'calc(var(--cvw)*5)' }}>minutes is enough</span>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-[calc(var(--cvw)*4)] bg-brand-teal/15 border border-brand-teal/40 rounded-[calc(var(--cvw)*3)] px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*2)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 1.3 }}
          >
            <span style={{ fontSize: 'calc(var(--cvw)*10)' }}>🚶</span>
            <div className="flex flex-col">
              <span className="text-brand-teal font-extrabold leading-none"
                style={{ fontSize: 'calc(var(--cvw)*8)' }}>Relaxed</span>
              <span className="text-white/70 font-medium"
                style={{ fontSize: 'calc(var(--cvw)*5)' }}>no speed required</span>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-[calc(var(--cvw)*4)] bg-brand-blue/15 border border-brand-blue/40 rounded-[calc(var(--cvw)*3)] px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*2)]"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 1.8 }}
          >
            <span style={{ fontSize: 'calc(var(--cvw)*10)' }}>⏱️</span>
            <div className="flex flex-col">
              <span className="text-brand-blue font-extrabold leading-none"
                style={{ fontSize: 'calc(var(--cvw)*8)' }}>Within 30</span>
              <span className="text-white/70 font-medium"
                style={{ fontSize: 'calc(var(--cvw)*5)' }}>minutes after eating</span>
            </div>
          </motion.div>

        </div>

        {/* Citation */}
        <motion.p
          className="text-white/35 font-body text-center"
          style={{ fontSize: 'calc(var(--cvw)*3.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7.5 }}
        >
          Reynolds AN et al. (2016), Diabetologia
        </motion.p>

      </div>
    </motion.div>
  );
}
