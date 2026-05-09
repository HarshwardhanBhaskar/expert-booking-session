import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getExpertById } from '../api/services';
import socket from '../socket/socket';
import ErrorState from '../components/ErrorState';
import PageShell from '../components/PageShell';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  PulseIcon,
  SparklesIcon,
  StarIcon,
} from '../components/Icons';
import { addBookedSlot, createBookedSlotKey, flattenBookedSlots } from '../utils/slotUtils';
import { fadeUp, staggerContainer } from '../utils/motion';

const MotionLink = motion(Link);

function formatLongDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ExpertDetailPage() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await getExpertById(id);
        setExpert(data.expert);
        setBookedSlots(flattenBookedSlots(data.bookedSlots));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch expert details');
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  useEffect(() => {
    const handleSlotBooked = (data) => {
      if (data.expertId === id) {
        setBookedSlots((prev) => addBookedSlot(prev, data.date, data.slot));
      }
    };

    socket.on('slotBooked', handleSlotBooked);
    return () => socket.off('slotBooked', handleSlotBooked);
  }, [id]);

  const isSlotBooked = (date, slot) => bookedSlots.includes(createBookedSlotKey(date, slot));

  if (loading) {
    return (
      <PageShell>
        <div className="premium-panel p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 items-center gap-5">
              <div className="skeleton h-24 w-24 rounded-3xl shrink-0" />
              <div className="w-full space-y-4">
                <div className="skeleton h-7 w-40" />
                <div className="skeleton h-5 w-28 rounded-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="skeleton h-28 rounded-3xl" />
              <div className="skeleton h-28 rounded-3xl" />
              <div className="skeleton h-28 rounded-3xl" />
              <div className="skeleton h-28 rounded-3xl" />
            </div>
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="premium-card p-6">
              <div className="skeleton h-5 w-40" />
              <div className="mt-6 flex flex-wrap gap-3">
                {[...Array(4)].map((__, itemIndex) => (
                  <div key={itemIndex} className="skeleton h-12 w-28 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </PageShell>
    );
  }

  const openSlotsCount = expert.availableSlots.reduce(
    (count, dateSlot) => count + dateSlot.slots.filter((slot) => !isSlotBooked(dateSlot.date, slot)).length,
    0
  );
  const bookedCount = expert.availableSlots.reduce(
    (count, dateSlot) => count + dateSlot.slots.filter((slot) => isSlotBooked(dateSlot.date, slot)).length,
    0
  );
  const nextAvailable = expert.availableSlots
    .flatMap((dateSlot) => dateSlot.slots.map((slot) => ({ date: dateSlot.date, slot })))
    .find((item) => !isSlotBooked(item.date, item.slot));

  return (
    <PageShell>
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="button-ghost px-4 py-2.5 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to experts
        </Link>
        <span className="surface-chip">
          <span className="live-dot" />
          Real-time slot availability
        </span>
      </motion.div>

      <motion.section variants={fadeUp} className="premium-panel overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-[var(--color-primary)]/20 blur-2xl" />
                <img
                  src={expert.profileImage}
                  alt={expert.name}
                  className="relative h-28 w-28 rounded-[2rem] border border-white/10 object-cover shadow-xl"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="section-kicker">{expert.category}</span>
                <h1 className="display-title mt-4 text-4xl leading-none text-[var(--color-text)] sm:text-5xl">
                  {expert.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
                  {expert.bio}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="surface-chip">
                    <StarIcon className="h-4 w-4 text-amber-300" />
                    {expert.rating.toFixed(1)} rating
                  </span>
                  <span className="surface-chip">
                    <BriefcaseIcon className="h-4 w-4" />
                    {expert.experience} years experience
                  </span>
                  {nextAvailable ? (
                    <span className="surface-chip">
                      <ClockIcon className="h-4 w-4" />
                      Next open slot: {nextAvailable.slot}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="metric-tile">
              <span className="metric-label inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Open slots
              </span>
              <p className="metric-value">{openSlotsCount}</p>
            </div>
            <div className="metric-tile">
              <span className="metric-label inline-flex items-center gap-2">
                <PulseIcon className="h-4 w-4" />
                Booked slots
              </span>
              <p className="metric-value">{bookedCount}</p>
            </div>
            <div className="metric-tile">
              <span className="metric-label inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Active dates
              </span>
              <p className="metric-value">{expert.availableSlots.length}</p>
            </div>
            <div className="metric-tile">
              <span className="metric-label inline-flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                Session mode
              </span>
              <p className="metric-value text-base">Live booking</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="premium-panel px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-kicker">Availability schedule</span>
            <h2 className="display-title mt-4 text-3xl text-[var(--color-text)] sm:text-4xl">
              Choose a time that is still live.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
              Booked slots dim instantly across all connected clients, so what you see here stays trustworthy while you browse.
            </p>
          </div>
          <div className="surface-chip">
            <span className="live-dot" />
            Synced through Socket.io
          </div>
        </div>

        {expert.availableSlots.length === 0 ? (
          <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            No available slots at the moment.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-8 grid gap-5 xl:grid-cols-2"
          >
            {expert.availableSlots.map((dateSlot) => (
              <motion.article key={dateSlot.date} variants={fadeUp} className="premium-card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[var(--color-text)]">
                      {formatLongDate(dateSlot.date)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {(dateSlot.slots.filter((slot) => !isSlotBooked(dateSlot.date, slot))).length} slots currently open
                    </p>
                  </div>
                  <span className="surface-chip">
                    <ClockIcon className="h-4 w-4" />
                    {dateSlot.slots.length} total slots
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {dateSlot.slots.map((slot) => {
                    const booked = isSlotBooked(dateSlot.date, slot);

                    return (
                      <MotionLink
                        key={`${dateSlot.date}-${slot}`}
                        whileHover={!booked ? { y: -3 } : {}}
                        whileTap={!booked ? { scale: 0.98 } : {}}
                        to={booked ? '#' : `/booking/${id}?date=${dateSlot.date}&slot=${encodeURIComponent(slot)}`}
                        onClick={(event) => booked && event.preventDefault()}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                          booked
                            ? 'cursor-not-allowed border-rose-400/20 bg-rose-400/10 text-rose-200/70 line-through'
                            : 'border-white/10 bg-white/[0.04] text-[var(--color-text)] hover:border-[var(--color-primary)]/35 hover:bg-[var(--color-primary)]/12'
                        }`}
                      >
                        <ClockIcon className="h-4 w-4" />
                        {slot}
                        {!booked ? <ArrowRightIcon className="h-4 w-4" /> : null}
                      </MotionLink>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </motion.section>
    </PageShell>
  );
}
