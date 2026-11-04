type IconProps = {
  className?: string;
};

export function CompassIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M22 10l-3.6 8.4L10 22l3.6-8.4z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="var(--sand, #f8f4ec)" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M16.5 5.5 8 14l-4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M4 10h11M10.5 5.5 15 10l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M10 2.5l2.3 4.9 5.2.7-3.8 3.6.9 5.2L10 14.4l-4.6 2.5.9-5.2L2.5 8.1l5.2-.7z"
        fill="currentColor"
      />
    </svg>
  );
}
