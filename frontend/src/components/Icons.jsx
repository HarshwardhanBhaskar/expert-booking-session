function createClassName(className = '') {
  return `h-5 w-5 ${className}`.trim();
}

function IconBase({ children, className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={createClassName(className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function FilterIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </IconBase>
  );
}

export function StarIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z" />
    </IconBase>
  );
}

export function BriefcaseIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M9 6V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V6" />
      <path d="M4 10h16" />
      <rect x="3" y="6" width="18" height="14" rx="3" />
    </IconBase>
  );
}

export function CalendarIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M8 3v3" />
      <path d="M16 3v3" />
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
    </IconBase>
  );
}

export function ClockIcon({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function ArrowRightIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowLeftIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </IconBase>
  );
}

export function BoltIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
    </IconBase>
  );
}

export function SparklesIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
      <path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z" />
      <path d="m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z" />
    </IconBase>
  );
}

export function UserIcon({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function MailIcon({ className }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

export function PhoneIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M6.6 3h2.5l1.1 4-1.6 1.6a15.5 15.5 0 0 0 6.8 6.8l1.6-1.6 4 1.1v2.5A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3Z" />
    </IconBase>
  );
}

export function NoteIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M8 4h8" />
      <path d="M8 9h8" />
      <path d="M8 14h5" />
      <path d="M6 3h12a2 2 0 0 1 2 2v14l-4-3H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    </IconBase>
  );
}

export function CheckIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

export function PulseIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 12h4l2-4 4 8 2-4h6" />
    </IconBase>
  );
}

export function InboxIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M5 5h14l2 8v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4l2-8Z" />
    </IconBase>
  );
}

export function ChevronDownIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function GridIcon({ className }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}
