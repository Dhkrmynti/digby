/**
 * Lava Pit pixel sprites. Every sprite is a grid of palette letters drawn as SVG rects
 * with crisp edges, so it stays sharp at any size. All art here is original.
 */
import type { ReactElement, SVGProps } from 'react';

export const PAL: Record<string, string> = {
  k: '#1a1412', // outline
  g: '#a29d95', // stone light
  s: '#7d7871', // stone mid
  d: '#57534d', // stone dark
  w: '#f4ecdc', // eye white
  p: '#1a1412', // pupil
  m: '#e0806e', // cheek
  y: '#ffe066', // flame core
  o: '#ff8a1f', // flame
  r: '#d9420f', // lava red
  R: '#8f2108', // lava deep
  b: '#9a6431', // wood
  B: '#5f3a17', // wood dark
  i: '#d4dade', // iron
  I: '#8e979c', // iron dark
  a: '#f2b53c', // $LAVA block
  A: '#c47f1c', // $LAVA block shade
  h: '#ffe39a', // $LAVA block shine
  e: '#7fdcf0', // ETH ore fleck
  E: '#3aa7c4', // ETH ore fleck dark
  n: '#262a35', // penguin back
  N: '#161921', // penguin flipper
  W: '#f4ecdc', // penguin belly
  q: '#f29a2e', // beak and feet
  u: '#f2c230', // hard hat
  U: '#c79a1c', // hard hat brim
  L: '#fff6c2', // head lamp
  v: '#9fe3ff', // sweat
};

/** Brr: a penguin who took a wrong turn off an iceberg and ended up at the bottom of a lava mine. He works the pit. */
export const BRR = [
  '....kkkkkk....',
  '...kuuLLuuk...',
  '..kuuuLLuuuk..',
  '.kUUUUUUUUUUk.',
  '.knnnnnnnnnnk.',
  'knnWWnnnnWWnnk',
  'knnWpWnnWpWnnk',
  'knnWWWqqWWWnnk',
  'knnWWqqqqWWnnk',
  'knWWWWWWWWWWnk',
  'kNnWWWWWWWWnNk',
  'kNnWWWWWWWWnNk',
  '.knWWWWWWWWnk.',
  '.knWWWWWWWWnk.',
  '.knnWWWWWWnnk.',
  '..knnnnnnnnk..',
  '..kqqk..kqqk..',
  '..kkkk..kkkk..',
];

/** Brr with his eyes shut (the blink). */
export const BRR_BLINK = BRR.map((row, i) => (i === 6 ? 'knnkkWnnWkknnk' : row));

/** A drop of sweat: it is hot down here. */
export const SWEAT = ['.v.', 'vvv', '.v.'];

export const PICK = ['.IiiiiiI.', 'I...b...I', '...b.....', '..b......', '.b.......', 'b........'];

/** One block of $LAVA, the token. */
export const BLOCK = ['kkkkkkkk', 'khhaaaAk', 'khaaoaAk', 'kaaooaAk', 'kaoyoaAk', 'kaaoaAAk', 'kAAAAAAk', 'kkkkkkkk'];

/** ETH ore: creator fees, as they come out of the rock. */
export const ORE = ['kkkkkkkk', 'ksgsgdsk', 'kgeegsgk', 'ksgeEggk', 'kgsgsdek', 'kdgeEsgk', 'ksgsggek', 'kkkkkkkk'];

export const CHEST = [
  'kkkkkkkkkkkk',
  'kbbbbbbbbbbk',
  'kbBBBBBBBBbk',
  'kbbbbbbbbbbk',
  'kkkkkiikkkkk',
  'kbbbbIIbbbbk',
  'kbbbbbbbbbbk',
  'kbBBBBBBBBbk',
  'kbbbbbbbbbbk',
  'kkkkkkkkkkkk',
];

export const TORCH = ['.y.', 'yoy', '.o.', '.B.', '.B.', '.B.', '.B.'];

/** Draws a sprite inside an existing <svg>, one rect per horizontal run of a colour. */
export function Sprite({ rows, x = 0, y = 0, px = 1, pal = PAL, ...rest }: { rows: string[]; x?: number; y?: number; px?: number; pal?: Record<string, string> } & SVGProps<SVGGElement>) {
  const rects: ReactElement[] = [];
  rows.forEach((row, ry) => {
    let start = 0;
    for (let cx = 1; cx <= row.length; cx++) {
      if (cx === row.length || row[cx] !== row[start]) {
        const c = row[start];
        if (c !== '.' && pal[c]) {
          rects.push(<rect key={`${ry}-${start}`} x={x + start * px} y={y + ry * px} width={(cx - start) * px} height={px} fill={pal[c]} />);
        }
        start = cx;
      }
    }
  });
  return (
    <g shapeRendering="crispEdges" {...rest}>
      {rects}
    </g>
  );
}

/** A sprite as its own little picture. */
export function PixelArt({ rows, className, title, pal }: { rows: string[]; className?: string; title?: string; pal?: Record<string, string> }) {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg viewBox={`0 0 ${w} ${rows.length}`} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} shapeRendering="crispEdges">
      <Sprite rows={rows} pal={pal} />
    </svg>
  );
}

/**
 * Pixel flames standing on a line at y, across [x0, x1]. Each tongue flickers on its own
 * (CSS, stepped so it reads as pixels); `blaze` makes them taller.
 */
export function Flames({ x0, x1, y, seed = 1, blaze = 1, gap = 7 }: { x0: number; x1: number; y: number; seed?: number; blaze?: number; gap?: number }) {
  const tongues: ReactElement[] = [];
  const rnd = (n: number) => Math.abs(Math.sin((n + seed) * 12.9898) * 43758.5453) % 1;
  let x = x0;
  let n = 0;
  while (x < x1) {
    const r = rnd(n);
    const w = 3 + Math.round(r * 4); // 3..7 wide
    const h = Math.round((4 + rnd(n + 50) * 9) * blaze);
    const d = (rnd(n + 99) * 1.2).toFixed(2);
    // a stepped tongue: wide red base, narrower orange, yellow heart, a lick on top
    tongues.push(
      <g key={n} className="px-flame" style={{ animationDelay: `-${d}s`, transformOrigin: `${x + w / 2}px ${y}px` }}>
        <rect x={x} y={y - Math.ceil(h * 0.55)} width={w} height={Math.ceil(h * 0.55)} fill={PAL.r} />
        <rect x={x + 1} y={y - h + 1} width={Math.max(1, w - 2)} height={h - 1} fill={PAL.o} />
        <rect x={x + 1} y={y - Math.ceil(h * 0.4)} width={Math.max(1, w - 2)} height={Math.ceil(h * 0.4)} fill={PAL.y} />
        <rect x={x + Math.floor(w / 2)} y={y - h - 2} width={1} height={2} fill={rnd(n + 7) > 0.5 ? PAL.y : PAL.o} />
      </g>,
    );
    x += Math.max(2, Math.round(gap * (0.45 + rnd(n + 3) * 0.9)));
    n++;
  }
  return <g shapeRendering="crispEdges">{tongues}</g>;
}

/** A lava surface from x0 to x1 starting at y, filling down to y + h, with rising bubbles. */
export function Lava({ x0, x1, y, h, seed = 3 }: { x0: number; x1: number; y: number; h: number; seed?: number }) {
  const w = x1 - x0;
  const bubbles = Array.from({ length: Math.max(2, Math.floor(w / 26)) }, (_, i) => {
    const r = Math.abs(Math.sin((i + seed) * 78.233) * 12345.678) % 1;
    return { x: x0 + 6 + ((i * 26 + r * 14) % (w - 10)), d: (r * 2.4).toFixed(2) };
  });
  return (
    <g shapeRendering="crispEdges">
      <rect x={x0} y={y} width={w} height={h} fill={PAL.r} />
      <rect x={x0} y={y + 4} width={w} height={h - 4} fill="#b8330b" />
      <rect x={x0} y={y + 10} width={w} height={Math.max(0, h - 10)} fill={PAL.R} />
      {/* the moving crust on top */}
      <g className="px-lava-crust">
        {Array.from({ length: Math.ceil(w / 8) + 2 }, (_, i) => (
          <rect key={i} x={x0 - 8 + i * 8} y={y} width={i % 3 === 0 ? 5 : 3} height={2} fill={i % 2 ? PAL.y : PAL.o} />
        ))}
      </g>
      {bubbles.map((b, i) => (
        <rect key={i} className="px-bubble" x={b.x} y={y + 6} width={2} height={2} fill={PAL.y} style={{ animationDelay: `-${b.d}s` }} />
      ))}
    </g>
  );
}
