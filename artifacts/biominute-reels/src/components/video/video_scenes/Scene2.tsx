import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
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
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center p-[8%] gap-[calc(var(--cvh)*3)]">

        {/* Headline */}
        <motion.div
          className="flex flex-col gap-[calc(var(--cvh)*1.5)]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.1 }}
        >
          <span className="text-brand-muted font-medium uppercase tracking-widest"
            style={{ fontSize: 'calc(var(--cvw)*3.8)' }}>How It Works</span>
          <span className="text-white font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'calc(var(--cvw)*10.5)' }}>
            Your muscles act like a{' '}
            <span className="text-brand-emerald">glucose sponge</span>
          </span>
        </motion.div>

        {/* Visual: muscle absorption diagram */}
        <motion.div
          className="w-full flex flex-col items-center gap-[calc(var(--cvh)*2)] bg-white/5 rounded-[calc(var(--cvw)*3)] border border-white/10 p-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*3)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.3 }}
        >
          {/* Glucose dots flowing */}
          <div className="w-full flex items-center justify-between px-[calc(var(--cvw)*2)] relative"
            style={{ height: 'calc(var(--cvh)*6)' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-[calc(var(--cvw)*6)] h-[calc(var(--cvw)*6)] rounded-full bg-brand-orange"
                style={{ boxShadow: '0 0 16px rgba(249,115,22,0.6)' }}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [0, 0, 60], opacity: [0, 1, 0], scale: [1, 1, 0.5] }}
                transition={{ duration: 2, delay: 0.6 + i * 0.25, repeat: Infinity, repeatDelay: 1.5 }}
              />
            ))}
            <motion.div
              className="absolute right-0 w-[35%] h-full rounded-[calc(var(--cvw)*3)] bg-brand-emerald/20 border-2 border-brand-emerald/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-brand-emerald font-bold text-center"
                style={{ fontSize: 'calc(var(--cvw)*4)' }}>Muscle</span>
            </motion.div>
          </div>

          <motion.div
            className="text-center text-brand-emerald font-bold"
            style={{ fontSize: 'calc(var(--cvw)*5.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            Glucose absorbed ✓
          </motion.div>
        </motion.div>

        {/* Explanation text */}
        <motion.span
          className="text-white/90 font-medium leading-snug"
          style={{ fontSize: 'calc(var(--cvw)*5.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 1.4 }}
        >
          When you walk, muscles activate{' '}
          <span className="text-brand-teal font-bold">GLUT-4 transporters</span> — pulling glucose out of your blood without insulin.
        </motion.span>

        {/* Walking shoes image */}
        <motion.div
          className="flex items-center gap-[calc(var(--cvw)*4)]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 2.0 }}
        >
          <img
            src={`${BASE_URL}images/walking-shoes-3d.png`}
            alt="Walking"
            className="w-[25%] h-auto object-contain drop-shadow-[0_8px_20px_rgba(20,184,166,0.4)]"
          />
          <span className="text-brand-teal font-bold leading-tight"
            style={{ fontSize: 'calc(var(--cvw)*6)' }}>
            Walking is one of the best post-meal habits
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
}
