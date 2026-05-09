import { CheckIcon, ClockIcon, PulseIcon } from './Icons';

const statusConfig = {
  Pending: {
    className: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    icon: ClockIcon,
  },
  Confirmed: {
    className: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    icon: PulseIcon,
  },
  Completed: {
    className: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
    icon: CheckIcon,
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-[0.08em] uppercase ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
