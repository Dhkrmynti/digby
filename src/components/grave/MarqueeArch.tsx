import { useEffect, useMemo, useState, type ReactNode } from 'react';

interface MarqueeArchProps {
  /** Bulbs light only while the ride is live (a token is configured). */
  live: boolean;
  children: ReactNode;
  className?: string;
}

const ARCH_BULBS = 34;
const SIDE_BULBS = 5;

/**
 * The painted arch over the ride entrance. One continuous red board with a cream
 * pinstripe and a ring of marquee bulbs; the bulbs light one after another on arrival.
 */
export function MarqueeArch({ live, children, className }: MarqueeArchProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const bulbs = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < SIDE_BULBS; i++) pts.push({ x: 3.2, y: 94 - i * ((94 - 47) / SIDE_BULBS) });
    for (let i = 0; i <= ARCH_BULBS; i++) {
      const a = Math.PI - (i / ARCH_BULBS) * Math.PI;
      pts.push({ x: 50 + 46.8 * Math.cos(a), y: 47 - 41 * Math.sin(a) });
    }
    for (let i = SIDE_BULBS - 1; i >= 0; i--) pts.push({ x: 96.8, y: 94 - i * ((94 - 47) / SIDE_BULBS) });
    return pts;
  }, []);

  return (
    <div className={`relative ${className ?? ''}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="arch-paint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2364b" />
            <stop offset="60%" stopColor="#d7263d" />
            <stop offset="100%" stopColor="#a8182c" />
          </linearGradient>
        </defs>
        <path d="M0 100V47A50 47 0 0 1 100 47V100Z" fill="url(#arch-paint)" />
        <path
          d="M6.2 100V47.5A43.8 38.5 0 0 1 93.8 47.5V100"
          fill="none"
          stroke="#f6eedd"
          strokeOpacity="0.8"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path d="M0 100V47A50 47 0 0 1 100 47V100" fill="none" stroke="#2a1626" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-lit={live && ready ? 'true' : 'false'}
          className="bulb bulb-chase absolute h-[clamp(8px,0.9vw,13px)] w-[clamp(8px,0.9vw,13px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            ['--i' as string]: i,
            transitionDelay: ready ? `${i * 28}ms` : '0ms',
          }}
        />
      ))}
      <div className="relative h-full">{children}</div>
    </div>
  );
}
