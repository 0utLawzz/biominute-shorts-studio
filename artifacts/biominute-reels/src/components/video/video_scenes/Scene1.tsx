import { motion } from 'framer-motion';

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 };
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 120, damping: 25 };

function BloodSugarGraph() {
  return (
    <div className="w-full" style={{ height: 'calc(var(--cvh)*20)' }}>
      <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <line x1="20" y1="10" x2="290" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="20" y1="50" x2="290" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="20" y1="90" x2="290" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <text x="8" y="14" fill="rgba(148,163,184,0.6)" fontSize="7" textAnchor="middle">High</text>
        <text x="8" y="54" fill="rgba(148,163,184,0.6)" fontSize="7" textAnchor="middle">Mid</text>
        <text x="8" y="94" fill="rgba(148,163,184,0.6)" fontSize="7" textAnchor="middle">Low</text>

        {/* No walk — orange spike */}
        <motion.path
          d="M 28 82 C 55 82 68 22 95 12 C 115 6 138 28 158 52 C 178 68 210 76 285 78"
          fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
        />
        <motion.circle cx="95" cy="12" r="5" fill="#f97316"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 400 }} />
        <motion.text x="102" y="10" fill="#f97316" fontSize="7.5" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>Spike!</motion.text>

        {/* With walk — emerald flat */}
        <motion.path
          d="M 28 82 C 55 82 68 45 95 40 C 115 37 138 44 158 50 C 178 54 210 57 285 58"
          fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.2, ease: 'easeOut' }}
        />

        {/* Legend */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <line x1="28" y1="110" x2="50" y2="110" stroke="#f97316" strokeWidth="2.5" />
          <text x="54" y="113" fill="#f97316" fontSize="7">No walk</text>
          <line x1="116" y1="110" x2="138" y2="110" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
          <text x="142" y="113" fill="#10b981" fontSize="7">Walk after</text>
        </motion.g>
      </svg>
    </div>
  );
}

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center p-[8%] gap-[calc(var(--cvh)*2.5)]">

        <motion.div
          className="flex flex-col gap-[calc(var(--cvh)*1.5)]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.1 }}
        >
          <span className="text-brand-muted font-medium uppercase tracking-widest"
            style={{ fontSize: 'calc(var(--cvw)*3.8)' }}>The Science</span>
          <span className="text-white font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'calc(var(--cvw)*10.5)' }}>
            Your blood sugar spikes after every meal
          </span>
        </motion.div>

        <motion.div
          className="w-full bg-white/5 rounded-[calc(var(--cvw)*3)] border border-white/10 p-[calc(var(--cvw)*4)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SMOOTH, delay: 0.3 }}
        >
          <BloodSugarGraph />
        </motion.div>

        <motion.span
          className="text-white/90 font-medium leading-snug"
          style={{ fontSize: 'calc(var(--cvw)*5.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 1.8 }}
        >
          Light movement within{' '}
          <span className="text-brand-teal font-bold">30 minutes</span> of eating helps muscles absorb glucose — keeping blood sugar steadier.
        </motion.span>

        <motion.div
          className="flex items-center gap-[calc(var(--cvw)*3)] bg-brand-orange/15 border border-brand-orange/30 rounded-[calc(var(--cvw)*2.5)] px-[calc(var(--cvw)*4)] py-[calc(var(--cvh)*1.5)]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SNAPPY, delay: 2.5 }}
        >
          <span style={{ fontSize: 'calc(var(--cvw)*8)' }}>📈</span>
          <span className="text-brand-orange font-bold leading-tight"
            style={{ fontSize: 'calc(var(--cvw)*5)' }}>
            Blood sugar rises after every meal — it's normal, but manageable
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
}
