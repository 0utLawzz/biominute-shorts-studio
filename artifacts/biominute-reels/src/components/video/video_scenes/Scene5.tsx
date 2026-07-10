import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display flex flex-col justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-1 w-full p-[8%] flex flex-col items-center justify-center">
        
        {/* Logo Reveal */}
        <motion.div 
           className="w-[70%] aspect-video flex items-center justify-center mb-[calc(var(--cvh)*8)]"
           initial={{ scale: 0.5, opacity: 0, y: 40 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
           <img 
             src={`${BASE_URL}images/biominute-logo.png`} 
             alt="BioMinute" 
             className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(47,111,237,0.5)]"
           />
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-[calc(var(--cvw)*6)] p-[calc(var(--cvw)*8)] w-full border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.8 }}
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-brand-emerald" />
           <p className="text-brand-teal font-bold mb-[calc(var(--cvh)*2)] uppercase tracking-widest" style={{ fontSize: 'calc(var(--cvw)*4.5)' }}>
             Question of the day
           </p>
           <p className="text-white font-bold leading-snug" style={{ fontSize: 'calc(var(--cvw)*7.5)' }}>
             Do you walk after meals, <br/> or sit right down?
           </p>
           <motion.div 
             className="mt-[calc(var(--cvh)*4)] flex justify-center gap-[calc(var(--cvw)*3)]"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5 }}
           >
              {[0, 1, 2].map(i => (
                 <motion.div 
                   key={i}
                   className="w-[calc(var(--cvw)*3)] h-[calc(var(--cvw)*3)] bg-brand-orange rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                 />
              ))}
           </motion.div>
        </motion.div>

      </div>

      {/* Citation (bottom) */}
      <motion.div 
        className="w-full p-[8%] pb-[calc(var(--cvh)*5)] text-center text-white/30 font-body leading-tight"
        style={{ fontSize: 'calc(var(--cvw)*3.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Source: Dipietro L et al. (2013), Diabetes Care; Reynolds AN et al. (2016), Diabetologia
      </motion.div>
    </motion.div>
  );
}
