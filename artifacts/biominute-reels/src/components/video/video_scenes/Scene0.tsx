import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene0() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-[8%]">

        {/* Plate image */}
        <motion.div
          className="relative w-[72%] aspect-square mb-[calc(var(--cvh)*5)]"
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.15 }}
        >
          <div className="absolute inset-0 bg-brand-orange/20 blur-[80px] rounded-full" />
          <img
            src={`${BASE_URL}images/plate-overhead.png`}
            alt="Meal"
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(249,115,22,0.3)]"
          />
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-[-12%] rounded-full border-[3px] border-brand-orange/40"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
          />
        </motion.div>

        {/* Hook text */}
        <motion.div className="flex flex-col items-center text-center gap-[calc(var(--cvh)*1.5)]">
          <motion.span
            className="text-brand-muted font-medium uppercase tracking-widest"
            style={{ fontSize: 'calc(var(--cvw)*4)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.4 }}
          >
            Did you know?
          </motion.span>

          <motion.span
            className="text-white font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'calc(var(--cvw)*11)' }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.6 }}
          >
            What happens{'\n'}right after{'\n'}you eat?
          </motion.span>

          <motion.div
            className="w-[60%] h-[3px] rounded-full bg-gradient-to-r from-brand-orange to-brand-teal"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />

          <motion.span
            className="text-brand-orange font-bold"
            style={{ fontSize: 'calc(var(--cvw)*6.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 1.5 }}
          >
            Your blood sugar spikes.
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
