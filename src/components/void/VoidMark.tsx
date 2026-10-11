/** VOID's mark: the shadow, its photon ring, and the disk cutting across it. */
export function VoidMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="24" rx="22" ry="5.5" fill="none" stroke="#ffad42" strokeWidth="2.4" opacity="0.55" />
      <circle cx="24" cy="24" r="12.5" fill="#000" stroke="#ffe2a6" strokeWidth="2" />
      <path d="M2 24c0 3 9.8 5.5 22 5.5S46 27 46 24" fill="none" stroke="#ffad42" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
