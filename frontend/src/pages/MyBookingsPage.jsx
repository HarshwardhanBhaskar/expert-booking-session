import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBookingsByEmail } from '../api/services';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import {
  CalendarIcon,
  ClockIcon,
  InboxIcon,
  MailIcon,
  NoteIcon,
  PhoneIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
} from '../components/Icons';
import { fadeUp, staggerContainer } from '../utils/motion';

function formatBookingDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyBookingsPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialEmail));
  const [searched, setSearched] = useState(Boolean(initialEmail));

  const fetchBookings = async (targetEmail) => {
    const normalizedEmail = targetEmail.trim();

    if (!normalizedEmail) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data } = await getBookingsByEmail(normalizedEmail);
      setBookings(data.bookings);
    } catch (err) {
      setBookings([]);
      toast.error(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialEmail) {
      return;
    }

    const loadInitialBookings = async () => {
      try {
        const { data } = await getBookingsByEmail(initialEmail.trim());
        setBookings(data.bookings);
      } catch (err) {
        setBookings([]);
        toast.error(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    loadInitialBookings();
  }, [initialEmail]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchBookings(email);
  };

  return (
    <PageShell>
      <motion.section variants={fadeUp} className="premium-panel px-6 py-7 sm:px-8 sm:py-8">
        <SectionHeader
          eyebrow="Your booking history"
          title="Keep every expert session in one clear, polished timeline."
          description="Search by the email used during booking to review active sessions, confirm the status, and revisit the booking details that matter most."
          aside={(
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="metric-tile">
                <span className="metric-label">Loaded bookings</span>
                <p className="metric-value">{bookings.length}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label">Last search state</span>
                <p className="metric-value text-base">{searched ? 'Ready' : 'Awaiting email'}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label">Status tracking</span>
                <p className="metric-value text-base">Live updates</p>
              </div>
            </div>
          )}
        />
      </motion.section>

      <motion.section variants={fadeUp} className="premium-panel px-5 py-5 sm:px-6">
        <form onSubmit={handleSearch} className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="field-label">Find bookings by email</span>
            <MailIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter the booking email address"
              className="input-shell h-14 pl-12 pr-4"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="button-primary h-14 w-full px-6 text-sm lg:w-auto disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SearchIcon className="h-4 w-4" />
              {loading ? 'Searching...' : 'Search bookings'}
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="surface-chip">
            <SparklesIcon className="h-4 w-4" />
            Designed for clean status tracking
          </span>
          <span className="surface-chip">
            <CalendarIcon className="h-4 w-4" />
            Responsive card layout
          </span>
        </div>
      </motion.section>

      {loading ? (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {[...Array(3)].map((_, index) => (
            <div key={index} className="premium-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-14 w-14 rounded-2xl" />
                  <div className="space-y-3">
                    <div className="skeleton h-5 w-40" />
                    <div className="skeleton h-4 w-24" />
                  </div>
                </div>
                <div className="skeleton h-10 w-28 rounded-full" />
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-4">
                {[...Array(4)].map((__, itemIndex) => (
                  <div key={itemIndex} className="skeleton h-20 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </motion.section>
      ) : !searched ? (
        <EmptyState
          icon={<InboxIcon className="h-7 w-7" />}
          title="Search for your bookings"
          message="Enter the same email address you used during booking to load your session history instantly."
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" />}
          title="No bookings found"
          message={`We could not find any bookings for ${email}. Double-check the email or create a new session from the experts page.`}
        />
      ) : (
        <>
          <motion.div variants={fadeUp} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                Booking results
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {bookings.length} booking{bookings.length === 1 ? '' : 's'} found for {email}.
              </p>
            </div>
          </motion.div>

          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {bookings.map((booking) => (
              <motion.article key={booking._id} variants={fadeUp} className="premium-card p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    {booking.expertId?.profileImage ? (
                      <img
                        src={booking.expertId.profileImage}
                        alt={booking.expertId?.name || 'Expert'}
                        className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                        Expert session
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                        {booking.expertId?.name || 'Expert'}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {booking.expertId?.category || 'General consultation'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="metric-tile">
                    <span className="metric-label inline-flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                    </span>
                    <p className="metric-value text-lg">{formatBookingDate(booking.date)}</p>
                  </div>
                  <div className="metric-tile">
                    <span className="metric-label inline-flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      Time
                    </span>
                    <p className="metric-value text-lg">{booking.slot}</p>
                  </div>
                  <div className="metric-tile">
                    <span className="metric-label inline-flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Booked by
                    </span>
                    <p className="metric-value text-lg">{booking.name}</p>
                  </div>
                  <div className="metric-tile">
                    <span className="metric-label inline-flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Contact
                    </span>
                    <p className="metric-value text-lg">{booking.phone}</p>
                  </div>
                </div>

                {booking.notes ? (
                  <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="metric-label inline-flex items-center gap-2">
                      <NoteIcon className="h-4 w-4" />
                      Notes
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                      {booking.notes}
                    </p>
                  </div>
                ) : null}
              </motion.article>
            ))}
          </motion.section>
        </>
      )}
    </PageShell>
  );
}
