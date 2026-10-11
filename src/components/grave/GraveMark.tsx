interface GraveMarkProps {
  className?: string;
  title?: string;
}

/** A headstone with Mort's eyes peeking over it. Same geometry as /grave-mark.svg. */
export function GraveMark({ className, title }: GraveMarkProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M9 37V17.5C9 10.6 13.9 5 20 5s11 5.6 11 12.5V37Z" fill="#f1e6cc" />
      <path d="M9 37V17.5C9 10.6 13.9 5 20 5s11 5.6 11 12.5V37Z" fill="none" stroke="#2a1626" strokeWidth="1.6" />
      <rect x="5" y="34.5" width="30" height="3.5" rx="1.2" fill="#d7263d" />
      <ellipse cx="16" cy="18" rx="2.6" ry="3.4" fill="#2a1626" />
      <ellipse cx="24" cy="18" rx="2.6" ry="3.4" fill="#2a1626" />
      <circle cx="16.8" cy="17" r="1" fill="#ffcf3a" />
      <circle cx="24.8" cy="17" r="1" fill="#ffcf3a" />
      <path d="M15 26.5h10" stroke="#2a1626" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
