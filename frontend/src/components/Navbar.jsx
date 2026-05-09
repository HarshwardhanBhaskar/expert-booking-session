import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BoltIcon, CalendarIcon, GridIcon } from './Icons';

const navLinks = [
  { path: '/', label: 'Experts', icon: GridIcon },
  { path: '/my-bookings', label: 'My Bookings', icon: CalendarIcon },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="app-container">
        <nav className="premium-panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="shadow-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] via-[#7c4dff] to-[var(--color-accent)] text-white">
                <BoltIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="display-title text-lg text-[var(--color-text)]">ExpertSlot</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Real-time expert session booking
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-white/6 bg-black/10 p-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative"
                  >
                    <motion.span
                      whileHover={{ y: -1 }}
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-white'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        />
                      ) : null}
                      <span className="relative z-10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="relative z-10">{link.label}</span>
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            <div className="surface-chip hidden lg:inline-flex">
              <span className="live-dot" />
              Slots sync instantly across sessions
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
