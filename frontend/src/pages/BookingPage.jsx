import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getExpertById, createBooking } from '../api/services';
import socket from '../socket/socket';
import ErrorState from '../components/ErrorState';
import PageShell from '../components/PageShell';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MailIcon,
  NoteIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
} from '../components/Icons';
import { addBookedSlot, createBookedSlotKey, flattenBookedSlots } from '../utils/slotUtils';
import { fadeUp } from '../utils/motion';

function formatShortDate(date) {
  if (!date) {
    return 'Select a date';
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });
}

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preDate = searchParams.get('date') || '';
  const preSlot = searchParams.get('slot') || '';
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: { name: '', email: '', phone: '', date: preDate, slot: preSlot, notes: '' },
  });
  const selectedDate = useWatch({ control, name: 'date' }) || '';
  const selectedSlot = useWatch({ control, name: 'slot' }) || '';

  useEffect(() => {
    const loadExpert = async () => {
      try {
        const { data } = await getExpertById(id);
        setExpert(data.expert);
        setBookedSlots(flattenBookedSlots(data.bookedSlots));
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load expert';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadExpert();
  }, [id]);

  useEffect(() => {
    const preselectedDate = getValues('date');
    const preselectedSlot = getValues('slot');

    if (!preselectedDate || !preselectedSlot) {
      return;
    }

    if (bookedSlots.includes(createBookedSlotKey(preselectedDate, preselectedSlot))) {
      setValue('slot', '');
      toast.error('The selected slot is already booked. Please choose another time.');
    }
  }, [bookedSlots, getValues, setValue]);

  useEffect(() => {
    const handleSlotBooked = (data) => {
      if (data.expertId !== id) {
        return;
      }

      setBookedSlots((prev) => addBookedSlot(prev, data.date, data.slot));

      const currentDate = getValues('date');
      const currentSlot = getValues('slot');

      if (currentDate === data.date && currentSlot === data.slot) {
        setValue('slot', '');
        toast.error('That slot was just booked by another user. Please choose another time.');
      }
    };

    socket.on('slotBooked', handleSlotBooked);

    return () => {
      socket.off('slotBooked', handleSlotBooked);
    };
  }, [getValues, id, setValue]);

  const availableSlots = expert?.availableSlots?.find((item) => item.date === selectedDate)?.slots || [];
  const isSlotBooked = (date, slot) => bookedSlots.includes(createBookedSlotKey(date, slot));
  const openSlotCount = expert?.availableSlots?.reduce(
    (count, item) => count + item.slots.filter((slot) => !isSlotBooked(item.date, slot)).length,
    0
  ) || 0;

  const onSubmit = async (formData) => {
    if (isSlotBooked(formData.date, formData.slot)) {
      toast.error('This slot is already booked. Please choose another slot.');
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({ expertId: id, ...formData });
      toast.success('Booking created successfully!');
      navigate(`/my-bookings?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setBookedSlots((prev) => addBookedSlot(prev, formData.date, formData.slot));
        setValue('slot', '');
      }

      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-card p-6">
            <div className="skeleton h-8 w-32" />
            <div className="skeleton mt-6 h-28 w-full rounded-3xl" />
            <div className="mt-6 space-y-3">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-10/12" />
            </div>
          </div>
          <div className="premium-card p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="skeleton h-14 w-full rounded-2xl" />
              ))}
            </div>
          </div>
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

  return (
    <PageShell>
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`/experts/${id}`} className="button-ghost px-4 py-2.5 text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to expert
        </Link>
        <span className="surface-chip">
          <span className="live-dot" />
          Slot conflicts update instantly
        </span>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.aside variants={fadeUp} className="space-y-6">
          <section className="premium-panel px-6 py-7">
            <span className="section-kicker">Session summary</span>
            <div className="mt-6 flex items-center gap-4">
              <img
                src={expert.profileImage}
                alt={expert.name}
                className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
              />
              <div>
                <h1 className="display-title text-3xl text-[var(--color-text)]">
                  {expert.name}
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {expert.category} expert with {expert.experience} years of experience
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="metric-tile">
                <span className="metric-label inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Selected date
                </span>
                <p className="metric-value text-lg">{formatShortDate(selectedDate)}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Selected slot
                </span>
                <p className="metric-value text-lg">{selectedSlot || 'Choose a time'}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label inline-flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  Open slot count
                </span>
                <p className="metric-value">{openSlotCount}</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-[var(--color-text-secondary)]">
              Your slot remains live while you complete the form, but another user can still take it first. If that happens, this form updates in real time and asks you to choose again.
            </p>
          </section>
        </motion.aside>

        <motion.section variants={fadeUp} className="premium-panel px-6 py-7 sm:px-8">
          <span className="section-kicker">Confirm booking</span>
          <h2 className="display-title mt-4 text-3xl text-[var(--color-text)] sm:text-4xl">
            Lock in your expert session.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
            Enter your details, pick a date, and confirm the time slot you want. Validation and slot protection remain fully intact.
          </p>

          <motion.form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="relative block">
                <span className="field-label">Full name *</span>
                <UserIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-shell h-14 pl-12 pr-4"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.name.message}</p>}
              </label>

              <label className="relative block">
                <span className="field-label">Email *</span>
                <MailIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  className="input-shell h-14 pl-12 pr-4"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
              </label>

              <label className="relative block">
                <span className="field-label">Phone *</span>
                <PhoneIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    minLength: { value: 10, message: 'Min 10 digits' },
                  })}
                  className="input-shell h-14 pl-12 pr-4"
                  placeholder="Phone number"
                />
                {errors.phone && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.phone.message}</p>}
              </label>

              <label className="relative block">
                <span className="field-label">Date *</span>
                <CalendarIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
                <select
                  {...register('date', { required: 'Select a date' })}
                  onChange={(event) => {
                    setValue('date', event.target.value);
                    setValue('slot', '');
                  }}
                  className="select-shell h-14 appearance-none pl-12 pr-4"
                >
                  <option value="">Select a date</option>
                  {expert?.availableSlots?.map((item) => (
                    <option key={item.date} value={item.date}>
                      {formatShortDate(item.date)}
                    </option>
                  ))}
                </select>
                {errors.date && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.date.message}</p>}
              </label>
            </div>

            <div>
              <span className="field-label">Time slot *</span>
              <div className="premium-card p-4">
                {selectedDate && availableSlots.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {availableSlots.map((slot) => {
                      const booked = isSlotBooked(selectedDate, slot);

                      return (
                        <label key={slot} className={booked ? 'cursor-not-allowed' : 'cursor-pointer'}>
                          <input
                            type="radio"
                            value={slot}
                            disabled={booked}
                            {...register('slot', { required: 'Select a slot' })}
                            className="sr-only peer"
                          />
                          <span
                            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                              booked
                                ? 'border-rose-400/20 bg-rose-400/10 text-rose-200/70 line-through'
                                : 'border-white/10 bg-white/[0.04] text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:border-[var(--color-primary)]/35 hover:text-[var(--color-text)] peer-checked:border-[var(--color-primary)]/60 peer-checked:bg-[var(--color-primary)]/15 peer-checked:text-white'
                            }`}
                          >
                            <ClockIcon className="h-4 w-4" />
                            {slot}
                            {booked ? 'Booked' : ''}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {selectedDate ? 'No slots available for this date.' : 'Select a date to reveal available time slots.'}
                  </p>
                )}
              </div>
              {errors.slot && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.slot.message}</p>}
            </div>

            <label className="relative block">
              <span className="field-label">Notes</span>
              <NoteIcon className="pointer-events-none absolute left-4 top-[3.25rem] h-5 w-5 text-[var(--color-text-muted)]" />
              <textarea
                {...register('notes')}
                rows={4}
                className="textarea-shell resize-none pl-12 pr-4 pt-4"
                placeholder="Share the topics you want to cover so the expert can prepare."
              />
            </label>

            <motion.button
              type="submit"
              whileHover={!submitting ? { y: -2 } : {}}
              whileTap={!submitting ? { scale: 0.99 } : {}}
              disabled={submitting}
              className="button-primary w-full px-5 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Confirming booking...' : 'Confirm booking'}
            </motion.button>
          </motion.form>
        </motion.section>
      </div>
    </PageShell>
  );
}
