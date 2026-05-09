import { motion } from 'framer-motion';
import { fadeUp } from '../utils/motion';

export default function EmptyState({ icon, title, message, action }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="premium-panel mx-auto max-w-2xl px-6 py-10 text-center sm:px-10"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--color-text)]">
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)]">
        {message}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
