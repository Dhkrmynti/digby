import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface AccretionMeterProps {
  escrow: number;
  threshold: number;
  fill: number;
  nextCycle: 'burn' | 'keep';
  live: boolean;
  status: string;
  className?: string;
}

const SWEEP = 56; // needle travel either side of vertical, in degrees
const angleFor = (f: number) => -SWEEP + Math.max(0, Math.min(1, f)) * SWEEP * 2;

const polar = (deg: number, r: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [120 + Math.cos(rad) * r, 132 + Math.sin(rad) * r];
};

/**
 * The accretion meter: a VU-style needle reading the fee escrow against critical
 * mass. The needle swings with weighted overshoot, like a real ballistic meter.
 */
export function AccretionMeter({ escrow, threshold, fill, nextCycle, live, status, className = '' }: AccretionMeterProps) {
  const needleRef = useRef<SVGGElement>(null);
  const needle = useRef({ a: angleFor(0) });
  const falls = nextCycle === 'burn';

  useGSAP(
    () => {
      const el = needleRef.current;
      if (!el) return;
      const to = angleFor(fill);
      const write = () => el.setAttribute('transform', `rotate(${needle.current.a} 120 132)`);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        needle.current.a = to;
        write();
        return;
      }
      gsap.to(needle.current, { a: to, duration: 1.6, delay: 0.4, ease: 'elastic.out(1.1, 0.35)', overwrite: true, onUpdate: write });
    },
    { dependencies: [fill] },
  );

  const ticks = Array.from({ length: 21 }, (_, i) => i / 20);
  const [rx1, ry1] = polar(angleFor(0.85), 96);
  const [rx2, ry2] = polar(angleFor(1), 96);

  return (
    <figure className={`paper sprockets m-0 px-8 pb-5 pt-5 ${className}`} aria-label="The accretion meter">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="display text-[1.55rem] text-pen">Accretion disk</span>
        <span className="tabular font-mono text-[0.8rem] text-pen-soft">{Math.round(fill * 100)}%</span>
      </figcaption>

      <svg viewBox="0 0 240 150" className="mt-1 block h-auto w-full" role="img" aria-label={`Needle at ${Math.round(fill * 100)}% of critical mass`}>
        <rect x="6" y="8" width="228" height="138" rx="10" fill="#f8f4ea" stroke="#1c2a6b" strokeOpacity="0.35" />
        {/* the red past critical: the only red the meter allows */}
        <path d={`M${rx1} ${ry1} A96 96 0 0 1 ${rx2} ${ry2}`} fill="none" stroke="#cf3228" strokeWidth="7" />
        {ticks.map((v) => {
          const major = Math.round(v * 20) % 5 === 0;
          const [x1, y1] = polar(angleFor(v), major ? 84 : 89);
          const [x2, y2] = polar(angleFor(v), 99);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke={v >= 0.85 ? '#cf3228' : '#1c2a6b'} strokeWidth={major ? 2 : 1} />;
        })}
        {[0, 0.25, 0.5, 0.75].map((v) => {
          const [x, y] = polar(angleFor(v), 70);
          return (
            <text key={v} x={x} y={y + 4} textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="800" fontSize="13" fill="#1c2a6b">
              {v * 100}
            </text>
          );
        })}
        <text x={polar(angleFor(1), 70)[0] - 4} y={polar(angleFor(1), 70)[1] + 4} textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="900" fontSize="12" fill="#cf3228">
          CRIT
        </text>
        <text x="120" y="112" textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="800" fontSize="15" letterSpacing="2" fill="#4a5577">
          MASS
        </text>
        <g ref={needleRef} transform={`rotate(${angleFor(0)} 120 132)`}>
          <line x1="120" y1="132" x2="120" y2="40" stroke="#06080f" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <circle cx="120" cy="132" r="7" fill="#06080f" />
      </svg>

      <dl className="m-0 mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
        <dt className="label text-[0.68rem] text-pen-soft">in the disk</dt>
        <dd className="m-0 text-right font-mono text-[0.85rem] text-pen tabular">{escrow.toFixed(4)} ETH</dd>
        <dt className="label text-[0.68rem] text-pen-soft">critical mass</dt>
        <dd className="m-0 text-right font-mono text-[0.85rem] text-pen tabular">{threshold ? threshold.toFixed(4) : '—'} ETH</dd>
        <dt className="label text-[0.68rem] text-pen-soft">next orbit</dt>
        <dd className={`m-0 text-right display text-[1.05rem] ${!live ? 'text-pen-soft' : falls ? 'text-marker' : 'text-fuel-ink'}`}>{falls ? 'falls in' : 'fuel'}</dd>
      </dl>
      <p className="m-0 mt-3 hand text-[1.6rem] text-marker" aria-live="polite">
        {status}
      </p>
    </figure>
  );
}
