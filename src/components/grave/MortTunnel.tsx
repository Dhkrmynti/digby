import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface MortTunnelProps {
  onFeed: () => void;
  /** Coin box fill 0..1: Mort's eyes glow brighter as the box fills. */
  fill: number;
  className?: string;
}

/**
 * The tunnel mouth of the ride. Two plank doors stand ajar and Mort watches
 * from the dark gap: only his eyes. Tap them to toss Mort a coin.
 */
export function MortTunnel({ onFeed, fill, className }: MortTunnelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [grin, setGrin] = useState(false);
  const [blink, setBlink] = useState(false);

  // Eyes follow the pointer
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy = (e.clientY - (r.top + r.height * 0.45)) / (window.innerHeight / 2);
      setLook({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Slow blink
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2600 + Math.random() * 3200);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  const feed = () => {
    onFeed();
    setGrin(true);
    window.setTimeout(() => setGrin(false), 900);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('[data-door]', { rotate: 0 }, { rotate: (i) => (i === 0 ? -3 : 3), duration: 0.08, yoyo: true, repeat: 5, ease: 'power1.inOut', transformOrigin: '50% 100%' });
    }
  };

  const glow = 0.55 + fill * 0.45;
  const px = look.x * 5;
  const py = look.y * 4;

  return (
    <div ref={rootRef} className={`relative ${className ?? ''}`}>
      <svg viewBox="0 0 300 300" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <radialGradient id="tunnel-dark" cx="50%" cy="62%" r="60%">
            <stop offset="0%" stopColor="#05020a" />
            <stop offset="100%" stopColor="#1d0f29" />
          </radialGradient>
          <linearGradient id="plank" x1="0" x2="1">
            <stop offset="0%" stopColor="#3a2350" />
            <stop offset="100%" stopColor="#2a1838" />
          </linearGradient>
        </defs>
        {/* stone frame */}
        <path d="M18 300V128C18 62 77 14 150 14s132 48 132 114v172Z" fill="#2a1838" stroke="#463056" strokeWidth="3" />
        <path d="M40 300V132C40 78 89 38 150 38s110 40 110 94v168Z" fill="url(#tunnel-dark)" />
        {/* doors ajar */}
        <g data-door style={{ transformBox: 'fill-box' } as React.CSSProperties}>
          <path d="M40 300V132C40 98 60 70 92 54L128 64V300Z" fill="url(#plank)" stroke="#120919" strokeWidth="2" />
          {[62, 84, 106].map((x) => (
            <line key={x} x1={x} y1={x < 70 ? 92 : 66} x2={x} y2={300} stroke="#170d1f" strokeWidth="2" />
          ))}
          <path d="M46 196L124 168M46 268L124 240" stroke="#170d1f" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g data-door style={{ transformBox: 'fill-box' } as React.CSSProperties}>
          <path d="M260 300V132C260 98 240 70 208 54L176 64V300Z" fill="url(#plank)" stroke="#120919" strokeWidth="2" />
          {[194, 216, 238].map((x) => (
            <line key={x} x1={x} y1={x > 230 ? 92 : 66} x2={x} y2={300} stroke="#170d1f" strokeWidth="2" />
          ))}
          <path d="M254 196L180 168M254 268L180 240" stroke="#170d1f" strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* Mort, in the gap */}
        <g>
          {[136, 164].map((cx) =>
            grin ? (
              <path key={cx} d={`M${cx - 8} ${150 + py} q8 -10 16 0`} fill="none" stroke="#ffcf3a" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #ffcf3a)' }} />
            ) : (
              <g key={cx}>
                <ellipse cx={cx} cy={150} rx="9" ry={blink ? 1.2 : 11} fill="#ffcf3a" opacity={glow} style={{ filter: `drop-shadow(0 0 ${6 + fill * 8}px rgba(255,207,58,0.9))` }} />
                {!blink && <circle cx={cx + px} cy={151 + py} r="4" fill="#170d1f" />}
              </g>
            ),
          )}
        </g>
      </svg>
      <button
        type="button"
        onClick={feed}
        className="absolute left-1/2 top-[40%] h-[22%] w-[26%] -translate-x-1/2 cursor-pointer rounded-full"
        aria-label="Toss Mort a coin"
        title="Toss Mort a coin"
      />
    </div>
  );
}
