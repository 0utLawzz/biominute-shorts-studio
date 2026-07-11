import { motion } from 'framer-motion';

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
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center p-[8%] gap-[calc(var(--cvh)*4)]">

        <motion.span
          className="text-white/80 font-medium"
          style={{ fontSize: 'calc(var(--cvw)*5.5)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 0.2 }}
        >
          Total caffeine intake still matters most...
        </motion.span>

        <motion.div
          className="flex flex-col gap-[calc(var(--cvh)*1)] bg-white/5 border border-white/10 rounded-[calc(var(--cvw)*4)] p-[calc(var(--cvw)*6)] relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 1 }}
        >
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-brand-emerald/10 to-transparent blur-xl" />
          
          <span className="text-brand-teal font-bold uppercase tracking-widest text-sm mb-2">The small swap</span>
          
          <div className="flex items-center gap-4 text-white font-extrabold" style={{ fontSize: 'calc(var(--cvw)*7)' }}>
            <span className="bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-lg">1. Water</span>
            <span className="text-white/30">➜</span>
            <span className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-lg">2. Coffee</span>
          </div>
        </motion.div>

        <motion.span
          className="text-white font-bold leading-tight"
          style={{ fontSize: 'calc(var(--cvw)*7)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 3.5 }}
        >
          This gives your morning an <span className="text-brand-emerald">extra edge.</span>
        </motion.span>

      </div>
    </motion.div>
  );
}
