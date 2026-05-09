import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BriefcaseIcon, CalendarIcon, StarIcon } from './Icons';
import { fadeUp, softScale } from '../utils/motion';

export default function ExpertCard({ expert }) {
  const totalSlots = expert.availableSlots?.reduce((count, item) => count + item.slots.length, 0) || 0;

  return (
    <motion.article
      variants={fadeUp}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="h-full"
    >
      <motion.div variants={softScale} className="premium-card flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-md" />
              <img
                src={expert.profileImage}
                alt={expert.name}
                className="relative h-16 w-16 rounded-2xl border border-white/10 object-cover shadow-lg"
              />
            </div>
            <div className="min-w-0">
              <span className="surface-chip !px-3 !py-1.5 text-xs">{expert.category}</span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--color-text)]">
                {expert.name}
              </h3>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-amber-200">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <StarIcon className="h-4 w-4" />
              {expert.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <p className="mt-5 flex-1 text-sm leading-7 text-[var(--color-text-secondary)]">
          {expert.bio}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="metric-tile">
            <span className="metric-label inline-flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4" />
              Experience
            </span>
            <p className="metric-value">{expert.experience} yrs</p>
          </div>
          <div className="metric-tile">
            <span className="metric-label inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Open Slots
            </span>
            <p className="metric-value">{totalSlots}</p>
          </div>
        </div>

        <Link
          to={`/experts/${expert._id}`}
          className="button-primary mt-6 w-full px-5 py-3.5 text-sm"
        >
          View profile
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.article>
  );
}
