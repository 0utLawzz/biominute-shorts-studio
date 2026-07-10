import { motion } from 'framer-motion';

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
      <div className="absolute inset-0 w-full h-full p-[8%] flex flex-col items-center justify-center">
        
        {/* Text block */}
        <motion.h2 
          className="text-white text-center font-bold leading-[1.3] mb-[calc(var(--cvh)*6)] w-full"
          style={{ fontSize: 'calc(var(--cvw)*9.5)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.2 }}
        >
          You don't need <br/>
          <span className="text-white/30 line-through decoration-brand-orange decoration-[calc(var(--cvw)*1)]">speed</span> or <span className="text-white/30 line-through decoration-brand-orange decoration-[calc(var(--cvw)*1)]">distance</span>
        </motion.h2>

        <motion.div 
           className="relative bg-gradient-to-br from-brand-teal to-brand-emerald text-brand-navy rounded-[calc(var(--cvw)*8)] p-[calc(var(--cvw)*10)] w-full text-center overflow-hidden shadow-[0_20px_50px_rgba(20,184,166,0.3)]"
           initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
           animate={{ scale: 1, opacity: 1, rotate: 0 }}
           transition={{ ...SPRING_SMOOTH, delay: 0.8 }}
        >
           {/* Shimmer effect */}
           <motion.div 
             className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/40 skew-x-12 blur-[10px]"
             animate={{ x: ['0%', '400%'] }}
             transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
           />

           <p className="font-bold mb-[calc(var(--cvh)*1)] opacity-90 uppercase tracking-widest" style={{ fontSize: 'calc(var(--cvw)*5)' }}>
             A relaxed
           </p>
           <p className="font-extrabold leading-none tracking-tighter my-[calc(var(--cvh)*1)] drop-shadow-md" style={{ fontSize: 'calc(var(--cvw)*22)' }}>
             10-15
           </p>
           <p className="font-bold uppercase tracking-widest bg-brand-navy/10 inline-block px-[calc(var(--cvw)*4)] py-[calc(var(--cvw)*2)] rounded-full mt-[calc(var(--cvh)*1)]" style={{ fontSize: 'calc(var(--cvw)*5.5)' }}>
             Minute Walk
           </p>
        </motion.div>

        <motion.p 
          className="text-white/70 text-center font-medium mt-[calc(var(--cvh)*5)] leading-tight"
          style={{ fontSize: 'calc(var(--cvw)*7)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 1.4 }}
        >
          is enough to make a <br/>
          <span className="text-white font-bold">meaningful difference.</span>
        </motion.p>

      </div>
    </motion.div>
  );
}
