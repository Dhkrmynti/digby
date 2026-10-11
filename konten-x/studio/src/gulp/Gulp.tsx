import { useId } from 'react';

/**
 * Gulp, the anglerfish. Faces left; his rod arcs forward so the lure hangs
 * in front of his face. `glow` (0–1) is the live escrow fill, `open` (0–1)
 * how far the jaw drops, `striking` makes him chomp.
 */
interface GulpProps {
  glow?: number;
  open?: number;
  striking?: boolean;
  /** crop of the 900×560 drawing */
  viewBox?: string;
  className?: string;
  title?: string;
  /** static: no idle animation (favicons, marks) */
  still?: boolean;
}

const C = {
  body: '#3d2a4f',
  shade: '#2a1c39',
  deep: '#1d1229',
  light: '#56406c',
  fin: '#4b3562',
  bone: '#f2ecd8',
  boneShade: '#cfc5a8',
  maw: '#14070f',
  gum: '#6e2c4c',
  lure: '#d8ff4f',
  lureCore: '#f7ffd6',
};

// needle teeth along a lip, from a to b, pointing `dir` (1 = down, -1 = up)
function teeth(a: [number, number], b: [number, number], lengths: number[], dir: 1 | -1, rake: number) {
  const n = lengths.length;
  return lengths.map((len, i) => {
    const t = (i + 0.5) / n;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    const w = 3.2 + len * 0.12;
    return `M${(x - w).toFixed(1)} ${y.toFixed(1)} Q${(x + rake * 0.4).toFixed(1)} ${(y + dir * len * 0.6).toFixed(1)} ${(x + rake).toFixed(1)} ${(y + dir * len).toFixed(1)} Q${(x + rake * 0.2 + w * 0.3).toFixed(1)} ${(y + dir * len * 0.5).toFixed(1)} ${(x + w).toFixed(1)} ${y.toFixed(1)} Z`;
  });
}

const UPPER = teeth([410, 268], [556, 299], [24, 13, 33, 11, 22, 10, 17, 9], 1, 4);
const LOWER = teeth([384, 300], [550, 306], [30, 15, 39, 13, 25, 11, 16, 9], -1, -3);

export function Gulp({ glow = 0.3, open = 0.2, striking = false, viewBox = '0 0 900 560', className, title, still = false }: GulpProps) {
  const id = useId().replace(/:/g, '');
  const g = Math.max(0, Math.min(1, glow));
  const jaw = Math.max(0, Math.min(1, open)) * 22;
  const rot = ([x, y]: [number, number]) => {
    const a = (-jaw * Math.PI) / 180;
    const dx = x - 568;
    const dy = y - 304;
    return `${(568 + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(1)} ${(304 + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(1)}`;
  };
  const maw = `M400 262 Q470 292 568 302 L${rot([570, 306])} Q${rot([470, 318])} ${rot([372, 296])} Z`;
  const anim = still ? '' : ' gulp-alive';

  return (
    <svg viewBox={viewBox} className={`${className ?? ''}${anim}${striking ? ' gulp-striking' : ''}`} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} overflow="visible">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor={C.lure} stopOpacity="0.9" />
          <stop offset="0.25" stopColor={C.lure} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.lure} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-bulb`} cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor={C.lureCore} />
          <stop offset="0.55" stopColor={C.lure} />
          <stop offset="1" stopColor="#8fbf1f" />
        </radialGradient>
        <clipPath id={`${id}-body`}>
          <path d="M400 262 C405 205 450 165 510 150 C590 128 690 140 745 190 C770 212 785 235 792 255 L792 300 C770 350 700 400 610 410 C560 414 525 395 530 360 L568 302 Q470 292 400 262 Z" />
        </clipPath>
        <clipPath id={`${id}-eye`}>
          <circle cx="560" cy="214" r="20" />
        </clipPath>
      </defs>

      {/* tail and fins sit behind the body */}
      <path d="M786 256 C826 196 876 184 894 200 C872 244 872 300 894 348 C872 364 826 352 786 300 Z" fill={C.fin} />
      <path d="M800 262 L880 206 M804 272 L872 248 M804 284 L872 300 M800 294 L880 340" stroke={C.shade} strokeWidth="3" strokeLinecap="round" />
      <path d="M664 146 L686 96 L700 140 L726 108 L734 160 L760 132 L758 192 Z" fill={C.fin} />
      <path d="M672 146 L686 96 M708 150 L726 108 M740 168 L760 132" stroke={C.shade} strokeWidth="3" strokeLinecap="round" />

      {/* the maw: dark interior, revealed as the jaw drops */}
      <path className="gulp-maw" d={maw} fill={C.maw} />

      {/* body */}
      <path d="M400 262 C405 205 450 165 510 150 C590 128 690 140 745 190 C770 212 785 235 792 255 L792 300 C770 350 700 400 610 410 C560 414 525 395 530 360 L568 302 Q470 292 400 262 Z" fill={C.body} />
      <g clipPath={`url(#${id}-body)`}>
        <ellipse cx="660" cy="420" rx="210" ry="96" fill={C.shade} />
        <ellipse cx="540" cy="168" rx="120" ry="44" fill={C.light} opacity="0.7" />
        {[
          [470, 214, 4],
          [500, 196, 3],
          [612, 176, 4.5],
          [646, 196, 3],
          [700, 214, 4],
          [596, 250, 3],
          [668, 262, 3.5],
          [730, 250, 3],
        ].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={C.light} />
        ))}
        <ellipse cx="420" cy="200" rx="190" ry="150" fill={`url(#${id}-halo)`} opacity={0.12 + g * 0.42} />
        <path d="M600 300 Q680 286 770 278" stroke={C.light} strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" fill="none" />
      </g>

      {/* pectoral fin */}
      <path d="M626 318 C656 296 700 304 714 326 C700 342 684 350 694 370 C666 372 640 354 626 318 Z" fill={C.fin} />
      <path d="M632 322 L700 320 M634 328 L690 346 M636 334 L684 364" stroke={C.shade} strokeWidth="2.5" strokeLinecap="round" />

      {/* upper fangs hang over the lower jaw */}
      <g fill={C.bone}>
        {UPPER.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* lower jaw: pivots at the mouth corner */}
      <g className="gulp-jaw" style={{ transformOrigin: '568px 304px', transform: `rotate(${-jaw}deg)` }}>
        <path d="M372 296 Q470 318 570 306 L548 362 C520 394 430 398 394 364 C374 344 364 320 372 296 Z" fill={C.body} />
        <path d="M380 340 C420 380 510 384 548 360 L540 374 C506 398 424 396 390 366 Z" fill={C.shade} />
        <g fill={C.bone}>
          {LOWER.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>

      {/* the eye: small, unimpressed */}
      <circle cx="560" cy="214" r="23" fill={C.deep} />
      <g clipPath={`url(#${id}-eye)`}>
        <circle cx="560" cy="214" r="20" fill={C.bone} />
        <circle cx="551" cy="216" r="7.5" fill={C.maw} />
        <circle cx="548" cy="213" r="2.2" fill="#fff" />
        <path className="gulp-lid" d="M532 186 L592 186 L592 222 L532 210 Z" fill={C.body} />
        <path d="M532 210 L592 222" stroke={C.deep} strokeWidth="3" />
      </g>
      <path d="M528 198 Q556 190 592 214" stroke={C.deep} strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* the rod and the lure */}
      <g className="gulp-rod" style={{ transformOrigin: '515px 154px' }}>
        <path d="M515 154 C492 64 344 18 254 46 C206 62 186 96 194 126" stroke={C.fin} strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M515 154 C492 64 344 18 254 46" stroke={C.light} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
        <circle className="gulp-halo" cx="196" cy="142" r={70 + g * 150} fill={`url(#${id}-halo)`} opacity={0.25 + g * 0.6} />
        <path d="M188 156 Q176 176 182 192 M200 158 Q206 180 198 196 M194 158 L194 188" stroke={C.lure} strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.4 + g * 0.5} />
        <circle className="gulp-bulb" cx="196" cy="142" r="17" fill={`url(#${id}-bulb)`} />
      </g>
    </svg>
  );
}
