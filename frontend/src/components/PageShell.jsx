import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motion';

export default function PageShell({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`app-container page-stack ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
