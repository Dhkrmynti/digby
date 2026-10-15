/**
 * Copied from graveburn/src/components/lava (sprites.tsx + LavaMark.tsx) so the X content uses the
 * site's own art. Flames and lava here are frame-driven instead of CSS-animated.
 */
import type { CSSProperties, ReactElement, SVGProps } from 'react';

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

/** The mark: Brr's face, hard hat and head lamp on, sweating. */
export const MARK = [
  '....kkkkkk.....',
  '...kuuLLuuk....',
  '..kuuuLLuuuk...',
  '.kUUUUUUUUUUk..',
  '.knnnnnnnnnnk..',
  'knnWWnnnnWWnnkv',
  'knnWpWnnWpWnnvv',
  'knnWWWqqWWWnnkv',
  'knnWWqqqqWWnnk.',
  'knWWWWWWWWWWnk.',
  '.kkWWWWWWWWkk..',
  '...kkkkkkkk....',
];


/** A sprite as its own <svg>, `px` screen pixels per sprite pixel. */
export function Pix({ rows, px, style, pal }: { rows: string[]; px: number; style?: CSSProperties; pal?: Record<string, string> }) {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg width={w * px} height={rows.length * px} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" style={style}>
      <Sprite rows={rows} pal={pal} />
    </svg>
  );
}
