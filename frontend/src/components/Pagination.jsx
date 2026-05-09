import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="premium-panel mt-4 flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">
          Page {currentPage} of {totalPages}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Browse more experts without losing your filters.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="button-secondary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Prev
        </motion.button>

        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <motion.button
              key={page}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(page)}
              className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-[0_18px_34px_rgba(59,130,246,0.18)]'
                  : 'border border-white/10 bg-white/[0.04] text-[var(--color-text-secondary)] hover:bg-white/[0.08] hover:text-[var(--color-text)]'
              }`}
            >
              {page}
            </motion.button>
          );
        })}

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="button-secondary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
