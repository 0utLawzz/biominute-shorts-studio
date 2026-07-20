import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL ?? '/';

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-[#0F172A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={`${BASE_URL}images/episode-thumbnail.png`}
        alt="Episode Thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}
