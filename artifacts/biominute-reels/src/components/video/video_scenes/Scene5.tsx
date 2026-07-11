import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display bg-brand-navy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full p-[8%] flex flex-col items-center justify-center">

        {/* Animated background rings */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2 }}
        >
          <div className="w-[160%] aspect-square rounded-full border-[calc(var(--cvw)*0.5)] border-brand-teal/40" />
          <div className="absolute w-[120%] aspect-square rounded-full border-[calc(var(--cvw)*0.5)] border-brand-blue/40" />
          <div className="absolute w-[80%] aspect-square rounded-full border-[calc(var(--cvw)*0.5)] border-brand-emerald/40" />
        </motion.div>

        {/* BioMinute Logo */}
        <motion.div
          className="relative w-[55%] mb-[calc(var(--cvh)*4)]"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
          <img
            src={`${BASE_URL}images/biominute-logo.png`}
            alt="BioMinute Logo"
            className="w-full h-auto drop-shadow-[0_10px_30px_rgba(20,184,166,0.4)]"
          />
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          className="text-gradient-emerald-teal font-extrabold tracking-tight mb-[calc(var(--cvh)*3)]"
          style={{ fontSize: 'calc(var(--cvw)*12)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, delay: 0.6 }}
        >
          BioMinute
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="w-[50%] h-[3px] rounded-full bg-gradient-to-r from-brand-teal to-brand-emerald mb-[calc(var(--cvh)*4)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        />

        {/* CTA */}
        <motion.div
          className="w-full text-center px-[calc(var(--cvw)*4)]"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, delay: 1.2 }}
        >
          <p
            className="text-white/90 font-medium leading-snug"
            style={{ fontSize: 'calc(var(--cvw)*6.5)' }}
          >
            Do you walk after meals, or sit right down?
          </p>
          <p
            className="text-brand-muted font-medium mt-[calc(var(--cvh)*2)]"
            style={{ fontSize: 'calc(var(--cvw)*4.5)' }}
          >
            Drop your answer below 👇
          </p>
        </motion.div>

        {/* Pulse burst at end */}
        <motion.div
          className="absolute w-[calc(var(--cvw)*8)] h-[calc(var(--cvw)*8)] bg-brand-teal rounded-full"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 80, opacity: 0 }}
          transition={{ duration: 1.8, delay: 5.0 }}
        />

      </div>
    </motion.div>
  );
}
