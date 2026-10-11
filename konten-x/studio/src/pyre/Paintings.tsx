/**
 * Rock art for the cave wall, in ochre and charcoal. Each painting is one
 * step of the bot, drawn the way it would have been on a cave wall.
 */
const O = '#e48e52';
const OD = '#c8642c';
const K = '#0b0806';
const S = { stroke: O, strokeWidth: 9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

// a stick-figure ape, the way the wall draws him
function Ape({ x, y, s = 1, arm = 'down' }: { x: number; y: number; s?: number; arm?: 'down' | 'up' | 'throw' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...S}>
      <circle cx="0" cy="-92" r="16" fill={O} stroke="none" />
      <path d="M0 -76 Q6 -40 0 -10" />
      <path d="M0 -10 L-18 30 M0 -10 L20 30" />
      {arm === 'down' ? <path d="M2 -64 L-24 -34 M2 -64 L28 -38" /> : null}
      {arm === 'up' ? <path d="M2 -64 L-26 -40 M2 -64 L22 -100" /> : null}
      {arm === 'throw' ? <path d="M2 -64 L-24 -36 M2 -64 L40 -82" /> : null}
    </g>
  );
}

function Flames({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C-30 -30 -18 -70 0 -110 C10 -80 34 -70 30 -36 C44 -50 46 -70 40 -86 C66 -56 60 -16 30 0 Z" fill={OD} />
      <path d="M8 -6 C-8 -24 0 -50 12 -70 C18 -50 32 -42 28 -20 C26 -10 20 -4 8 -6 Z" fill={O} />
    </g>
  );
}

export function PaintKindling() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <Ape x={80} y={190} arm="up" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${170 + i * 26} ${200 - (i % 2) * 8} L${200 + i * 26} ${120 + (i % 3) * 10}`} {...S} strokeWidth={8} />
      ))}
      <path d="M160 214 L300 214" {...S} strokeWidth={5} opacity="0.6" />
    </svg>
  );
}

export function PaintWoodpile() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      {[0, 1, 2, 3].map((row) =>
        Array.from({ length: 4 - row }, (_, i) => <path key={`${row}-${i}`} d={`M${70 + row * 26 + i * 52} ${206 - row * 30} L${112 + row * 26 + i * 52} ${206 - row * 30}`} {...S} strokeWidth={16} />),
      )}
      {[0, 1, 2, 3].map((row) =>
        Array.from({ length: 4 - row }, (_, i) => <circle key={`c${row}-${i}`} cx={70 + row * 26 + i * 52} cy={206 - row * 30} r="7" fill={K} />),
      )}
      <Ape x={270} y={206} s={0.7} />
    </svg>
  );
}

export function PaintCatches() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <path d="M90 206 L230 206 M110 196 L210 216 M110 216 L210 196" {...S} strokeWidth={10} />
      <Flames x={140} y={196} s={0.9} />
      {[[60, 90], [262, 70], [240, 130], [80, 150]].map(([x, y]) => (
        <path key={`${x}`} d={`M${x} ${y} l0 -14 M${x} ${y} l12 -6 M${x} ${y} l-12 -6`} {...S} strokeWidth={4} />
      ))}
    </svg>
  );
}

export function PaintFeed() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <Ape x={70} y={200} arm="throw" />
      <path d="M118 112 Q170 70 210 120" {...S} strokeWidth={4} strokeDasharray="2 14" />
      <circle cx="122" cy="108" r="11" fill={O} />
      <Flames x={220} y={206} s={0.85} />
    </svg>
  );
}

export function PaintIntoFire() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <Flames x={130} y={210} s={1.25} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={150 + i * 18} cy={70 + i * 26} r={8 - i * 2} fill={O} opacity={1 - i * 0.25} />
      ))}
      <path d="M40 222 L280 222" {...S} strokeWidth={5} opacity="0.6" />
    </svg>
  );
}

export function PaintBananas() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <Ape x={90} y={200} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${170 + i * 34} ${120 + i * 4} C${168 + i * 34} ${160} ${190 + i * 34} ${190} ${222 + i * 34} ${186} C${200 + i * 34} ${176} ${186 + i * 34} ${150} ${190 + i * 34} ${118} Z`} fill="#ffd23d" stroke={OD} strokeWidth="5" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

/** A handprint: the wall's own signature. */
export function Handprint({ className = '', color = O }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true">
      <g fill={color}>
        <ellipse cx="60" cy="100" rx="36" ry="38" />
        <rect x="22" y="36" width="15" height="58" rx="7.5" transform="rotate(-12 30 66)" />
        <rect x="42" y="14" width="15" height="70" rx="7.5" />
        <rect x="62" y="10" width="15" height="74" rx="7.5" />
        <rect x="82" y="24" width="15" height="64" rx="7.5" transform="rotate(8 90 56)" />
        <rect x="94" y="78" width="15" height="42" rx="7.5" transform="rotate(42 100 98)" />
      </g>
    </svg>
  );
}
