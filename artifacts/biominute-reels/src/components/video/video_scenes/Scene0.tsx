import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene0() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display bg-gradient-to-br from-brand-navy via-[#1e293b] to-brand-teal/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-[8%]">

        {/* Sunrise / Morning Graphic */}
        <motion.div
          className="relative w-[72%] aspect-square mb-[calc(var(--cvh)*5)] flex items-center justify-center"
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.15 }}
        >
          {/* Glowing sunrise backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/40 to-brand-orange/0 blur-[60px] rounded-full translate-y-[20%]" />
          
          <motion.div 
            className="absolute bg-brand-orange/80 rounded-full blur-[20px]"
            style={{ width: '40%', height: '40%' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: -30, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />

          <motion.div
            className="absolute inset-[-12%] rounded-full border-[3px] border-brand-orange/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
          />
        </motion.div>

        {/* Hook text */}
        <motion.div className="flex flex-col items-center text-center gap-[calc(var(--cvh)*1.5)] relative z-10">
          <motion.span
            className="text-brand-orange font-medium uppercase tracking-widest"
            style={{ fontSize: 'calc(var(--cvw)*4)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.4 }}
          >
            Morning Habits
          </motion.span>

          <motion.span
            className="text-white font-extrabold leading-tight tracking-tight drop-shadow-lg"
            style={{ fontSize: 'calc(var(--cvw)*10.5)' }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.6 }}
          >
            Drink Water{'\n'}Before Your{'\n'}Morning Coffee
          </motion.span>

          <motion.div
            className="w-[60%] h-[3px] rounded-full bg-gradient-to-r from-brand-teal to-brand-blue mt-[calc(var(--cvh)*2)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
