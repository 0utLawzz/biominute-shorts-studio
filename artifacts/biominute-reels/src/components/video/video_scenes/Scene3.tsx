import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

const BENEFITS = [
  { emoji: '🫀', label: 'Steadier blood sugar', color: '#10b981', delay: 0.5 },
  { emoji: '🍽️', label: 'Improved digestion', color: '#14b8a6', delay: 0.9 },
  { emoji: '⚡', label: 'Less post-meal slump', color: '#2F6FED', delay: 1.3 },
  { emoji: '🔥', label: 'Gentle calorie burn', color: '#f97316', delay: 1.7 },
];

export function Scene3() {
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
            style={{ fontSize: 'calc(var(--cvw)*3.8)' }}>The Benefits</span>
          <span className="text-white font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'calc(var(--cvw)*11)' }}>
            A short walk does more than you think
          </span>
        </motion.div>

        {/* Benefit cards */}
        <div className="flex flex-col gap-[calc(var(--cvh)*2)]">
          {BENEFITS.map((b) => (
            <motion.div
              key={b.label}
              className="flex items-center gap-[calc(var(--cvw)*4)] bg-white/5 border border-white/10 rounded-[calc(var(--cvw)*3)] px-[calc(var(--cvw)*5)] py-[calc(var(--cvh)*1.8)]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_SNAPPY, delay: b.delay }}
            >
              <motion.span
                style={{ fontSize: 'calc(var(--cvw)*9)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_SNAPPY, delay: b.delay + 0.1 }}
              >
                {b.emoji}
              </motion.span>
              <div className="flex flex-col">
                <span
                  className="font-bold leading-tight"
                  style={{ fontSize: 'calc(var(--cvw)*6)', color: b.color }}
                >
                  {b.label}
                </span>
              </div>
              <motion.div
                className="ml-auto w-[calc(var(--cvw)*5)] h-[calc(var(--cvw)*5)] rounded-full flex items-center justify-center"
                style={{ backgroundColor: b.color + '33', border: `2px solid ${b.color}` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_SNAPPY, delay: b.delay + 0.2 }}
              >
                <span className="text-white font-bold" style={{ fontSize: 'calc(var(--cvw)*3)' }}>✓</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Citation appears late */}
        <motion.p
          className="text-white/35 font-body text-center"
          style={{ fontSize: 'calc(var(--cvw)*3.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
        >
          Dipietro L et al. (2013), Diabetes Care
        </motion.p>

      </div>
    </motion.div>
  );
}
