import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

function CoffeeBalanceGraphic() {
  return (
    <div className="w-full flex justify-center items-center gap-[calc(var(--cvw)*4)]" style={{ height: 'calc(var(--cvh)*20)' }}>
      {/* Coffee side */}
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0.3, filter: 'grayscale(100%)' }}
        animate={{ opacity: 1, filter: 'grayscale(0%)' }}
        transition={{ duration: 1.5, delay: 2.5 }}
      >
        <span style={{ fontSize: 'calc(var(--cvw)*12)' }}>☕</span>
        <span className="text-brand-orange font-bold text-sm mt-2">Mild Diuretic</span>
      </motion.div>

      {/* Balance Scale / Plus */}
      <motion.div 
        className="text-white/30 font-bold"
        style={{ fontSize: 'calc(var(--cvw)*8)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_SNAPPY, delay: 1 }}
      >
        +
      </motion.div>

      {/* Water side */}
      <motion.div 
        className="flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...SPRING_SNAPPY, delay: 0.5 }}
      >
        <span style={{ fontSize: 'calc(var(--cvw)*12)' }}>💧</span>
        <span className="text-brand-teal font-bold text-sm mt-2">Hydration Base</span>
      </motion.div>
    </div>
  );
}

export function Scene3() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-[8%] gap-[calc(var(--cvh)*5)]">
        
        <motion.div
          className="bg-brand-orange/10 border border-brand-orange/20 rounded-[calc(var(--cvw)*3)] p-[calc(var(--cvw)*5)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
          <span className="text-white/90 font-medium leading-snug" style={{ fontSize: 'calc(var(--cvw)*6)' }}>
            Coffee has a <span className="text-brand-orange font-bold">mild diuretic effect</span>...
          </span>
        </motion.div>

        <CoffeeBalanceGraphic />

        <motion.span
          className="text-white font-bold leading-tight text-center"
          style={{ fontSize: 'calc(var(--cvw)*7.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 3.5 }}
        >
          Starting hydrated helps <span className="text-brand-blue">balance</span> that out.
        </motion.span>

      </div>
    </motion.div>
  );
}
