type IconProps = {
  className?: string;
};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="9" cy="8" r="3.2" {...stroke} />
      <path d="M3.2 19.2c.6-3.1 2.9-5 5.8-5s5.2 1.9 5.8 5" {...stroke} />
      <path d="M15.6 5.4a3.2 3.2 0 0 1 0 6" {...stroke} />
      <path d="M17.2 14.6c2 .5 3.3 2.1 3.7 4.4" {...stroke} />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z" {...stroke} />
      <path d="M4 7.6 12 12l8-4.4M12 12v8.8" {...stroke} />
    </svg>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="5.6" cy="18.4" r="2.4" {...stroke} />
      <circle cx="18.4" cy="5.6" r="2.4" {...stroke} />
      <path d="M8 18.4h5.6a3.2 3.2 0 0 0 0-6.4h-3.2a3.2 3.2 0 0 1 0-6.4H16" {...stroke} />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.2" y="6" width="17.6" height="13" rx="2.6" {...stroke} />
      <path d="M3.2 9.6h17.6" {...stroke} />
      <path d="M15.8 14.4h2.4" {...stroke} />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 19.6h16" {...stroke} />
      <path d="M7 19.6v-5.2M12 19.6V8.4M17 19.6v-8" {...stroke} />
      <path d="M4.6 9.4 9.2 5l3.4 3.2L19.4 2" {...stroke} />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2.6" {...stroke} />
      <path d="M3.4 9.8h17.2M8 3v4M16 3v4" {...stroke} />
    </svg>
  );
}

export function PaperclipIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M17.8 10.6 11 17.4a3.8 3.8 0 0 1-5.4-5.4l7.6-7.6a2.6 2.6 0 0 1 3.7 3.7l-7.4 7.4a1.3 1.3 0 0 1-1.9-1.9l6.7-6.7"
        {...stroke}
      />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 16.4V4.6M7.8 8.8 12 4.6l4.2 4.2" {...stroke} />
      <path d="M4.4 15.6v2.6a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2v-2.6" {...stroke} />
    </svg>
  );
}

export function PlaneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 12.4 20.6 4.8l-4.2 8.4 2.2 6-4-1.8-3.2 2.6-.6-5z" {...stroke} />
    </svg>
  );
}

export function HotelIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 19.4V6.6M20.6 19.4V10a2 2 0 0 0-2-2h-6.2v11.4" {...stroke} />
      <path d="M3.4 13h5.8a2.4 2.4 0 0 1 2.4 2.4v4M3.4 19.4h17.2" {...stroke} />
      <circle cx="6.2" cy="9.2" r="1.6" {...stroke} />
    </svg>
  );
}

export function CarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.4 16.6v-3.2l1.8-5a2 2 0 0 1 1.9-1.3h7.8a2 2 0 0 1 1.9 1.3l1.8 5v3.2" {...stroke} />
      <path d="M4.4 13.4h15.2M6.6 16.6v2M17.4 16.6v2" {...stroke} />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21c4-4.4 6-7.5 6-10a6 6 0 0 0-12 0c0 2.5 2 5.6 6 10z" {...stroke} />
      <circle cx="12" cy="10.6" r="2.2" {...stroke} />
    </svg>
  );
}

export function FoodIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 3.4v7.2M5.6 3.4v4.2A2.4 2.4 0 0 0 8 10h0M10.4 3.4v4.2A2.4 2.4 0 0 1 8 10v10.6" {...stroke} />
      <path d="M16.2 3.4c1.7.8 2.4 2.6 2.4 5.2 0 2-1 3.2-2.4 3.6v8.4" {...stroke} />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.4l1.9 5.5 5.5 1.9-5.5 1.9L12 18.2l-1.9-5.5-5.5-1.9 5.5-1.9z" {...stroke} />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.4 19 6v6c0 4.2-2.9 7.4-7 8.6C7.9 19.4 5 16.2 5 12V6z" {...stroke} />
      <path d="m8.8 11.8 2.2 2.2 4.2-4.2" {...stroke} />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.4 5h5.6v5.6M19 5l-7.4 7.4" {...stroke} />
      <path d="M18 14.6v3.6a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V8.6a2 2 0 0 1 2-2H10" {...stroke} />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="m4.6 10.4 3.4 3.4 7.4-7.4" {...stroke} />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.8 3.6H7a2 2 0 0 0-2 2v12.8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.8z" {...stroke} />
      <path d="M13.8 3.6v5.2H19" {...stroke} />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.6" {...stroke} />
      <path d="M12 7.4V12l3.2 2" {...stroke} />
    </svg>
  );
}

export function TrendIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 16.6 9.4 11l3.4 3.2L20 7" {...stroke} />
      <path d="M14.6 7H20v5.4" {...stroke} />
    </svg>
  );
}
