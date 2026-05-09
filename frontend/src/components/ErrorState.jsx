import { motion } from 'framer-motion';
import { ArrowRightIcon, BoltIcon } from './Icons';
import { fadeUp } from '../utils/motion';

export default function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="premium-panel mx-auto max-w-2xl px-6 py-10 text-center sm:px-10"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-200">
        <BoltIcon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
        Something interrupted the flow
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)]">
        {message || 'An unexpected error occurred. Please try again in a moment.'}
      </p>
      {onRetry ? (
        <button onClick={onRetry} className="button-primary mt-6 px-5 py-3 text-sm">
          Retry
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      ) : null}
    </motion.div>
  );
}
