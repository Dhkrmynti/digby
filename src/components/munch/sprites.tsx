/**
 * MUNCH pixel sprites. Every sprite is a grid of palette letters drawn as SVG rects with
 * crisp edges, so it stays sharp at any size. One grid, two palettes: COLOR for the
 * plastic and cardboard, LCD for anything shown on the handheld's screen. All art is original.
 */
import type { ReactElement, SVGProps } from 'react';

/** Printed colour: the pet as it looks on the box. */
export const COLOR: Record<string, string> = {
  k: '#2a1633', // ink outline
  e: '#2a1633', // pupil
  b: '#8a5cff', // body
  B: '#6337d8', // body shade
  p: '#ffd6e8', // belly
  w: '#fffaf2', // eye shine, teeth
  m: '#4a1240', // inside the mouth
  t: '#ff4f8b', // tongue
  h: '#ffd166', // horns
  c: '#ff8fb8', // cheeks
  E: '#fff4e0', // egg shell
  s: '#ff7a2f', // egg spots
  g: '#ffc93c', // $MUNCH coin
  G: '#e0902a', // coin shade
  f: '#7fc8ff', // ETH kibble
  F: '#3f8fd6', // kibble shade
  j: '#c7ecff', // jar glass
  l: '#ff4f8b', // jar lid
  D: '#ff7a2f', // auto-feeder body
  i: '#fffaf2', // shine
};

/** The same grids on the LCD: two inks and the bare screen. */
export const LCD: Record<string, string> = {
  k: '#2f3a22',
  e: '#2f3a22',
  m: '#2f3a22',
  B: '#8a9666',
  t: '#8a9666',
  h: '#8a9666',
  c: '#8a9666',
  s: '#2f3a22',
  G: '#8a9666',
  F: '#2f3a22',
  f: '#8a9666',
  D: '#8a9666',
  l: '#2f3a22',
};

/** Inverted LCD: lit pixels on an ink panel (the selected item on a menu). */
export const LCD_INV: Record<string, string> = {
  k: '#c4cfa1',
  e: '#c4cfa1',
  m: '#c4cfa1',
  B: '#7d8a59',
  t: '#7d8a59',
  h: '#7d8a59',
  c: '#7d8a59',
  s: '#c4cfa1',
  G: '#7d8a59',
  F: '#c4cfa1',
  f: '#7d8a59',
  D: '#7d8a59',
  l: '#c4cfa1',
};

/** Stage 1: the egg that landed at 0x…dEaD, fully cracked (ready to hatch). */
export const EGG = [
  '.....kkkk.....',
  '...kkEEEEkk...',
  '..kEEEEEEEEk..',
  '..kEEssEEEEk..',
  '.kEEEssEEEEEk.',
  '.kEEEEEEEsEEk.',
  'kEEEEEEEEEEEEk',
  'kEEsEEEEEEEEEk',
  'kEkEEkEEkEEkEk',
  'kkEkkEkkEkkEkk',
  'kEEEEEEEEEEEEk',
  '.kEEEEEEEsEEk.',
  '.kEEsEEEEEEEk.',
  '..kEEEEEEEEk..',
  '...kkEEEEkk...',
  '.....kkkk.....',
];

/**
 * The egg at a crack level, 0 (whole) to 3 (cracked all the way across). The crack grows in from
 * the right as the burn moves through the egg stage; at level 3 an eye peeks out of the gap.
 */
export function eggAt(level: number): string[] {
  const l = Math.max(0, Math.min(3, Math.round(level)));
  const from = [13, 9, 5, 1][l];
  const plain = 'kEEEEEEEEEEEEk';
  const crack = (full: string) => full.split('').map((ch, c) => (c === 0 || c === 13 || c >= from ? ch : 'E')).join('');
  return EGG.map((row, i) => {
    if (i === 8) return l === 0 ? plain : crack(row);
    if (i === 9) return l === 0 ? plain : crack(row);
    if (i === 10 && l === 3) return 'kEEEEEEewEEEEk';
    return row;
  });
}

/** Stage 2: the munchlet. Small, round, already hungry. */
export const MUNCHLET = [
  '....kkkkkk....',
  '..kkbbbbbbkk..',
  '.kbbbbbbbbbbk.',
  'kbbbbbbbbbbbbk',
  'kbbewbbbbewbbk',
  'kbbeebbbbeebbk',
  'kbcbbbbbbbbcbk',
  'kbbbbkmmkbbbbk',
  'kbbbbbkkbbbbbk',
  'kBbbbbbbbbbbBk',
  '.kBBbbbbbbBBk.',
  '..kkkkkkkkkk..',
  '...kk....kk...',
];

/** Stage 3: the chomper. Horns coming in, teeth already there. */
export const CHOMPER = [
  '..kk..........kk..',
  '.khhk........khhk.',
  '.kbbkkkkkkkkkkbbk.',
  'kbbbbbbbbbbbbbbbbk',
  'kbbewbbbbbbbbewbbk',
  'kbbeebbbbbbbbeebbk',
  'kbcbbbbbbbbbbbbcbk',
  'kbbkkkkkkkkkkkkbbk',
  'kbbkwkwkwkwkwkkbbk',
  'kbbkmmmmmmmmmmkbbk',
  'kbbkmmmttmmmmmkbbk',
  'kbbkkwkwkwkwkwkbbk',
  'kbbbkkkkkkkkkkbbbk',
  'kBbbbbbppppbbbbbBk',
  '.kBBbbbbbbbbbbBBk.',
  '..kkkkkkkkkkkkkk..',
  '...kBBk....kBBk...',
];

const MUNCH_TOP = [
  '.....kk..........kk.....',
  '....khhk........khhk....',
  '....khhk........khhk....',
  '...kkbbkkkkkkkkkkbbkk...',
  '..kbbbbbbbbbbbbbbbbbbk..',
  '.kbbbbbbbbbbbbbbbbbbbbk.',
  '.kbbbweebbbbbbbbweebbbk.',
  '.kbbbeeebbbbbbbbeeebbbk.',
  'kbbcbbbbbbbbbbbbbbbbcbbk',
];
const MUNCH_BOTTOM = [
  'kBbbbbbbppppppppbbbbbbBk',
  'kBbbbbbppppppppppbbbbbBk',
  '.kBbbbbbppppppppbbbbbBk.',
  '..kBBbbbbbbbbbbbbbbBBk..',
  '...kkkkkkkkkkkkkkkkkk...',
  '....kBBBk......kBBBk....',
];

/** Stage 4: MUNCH, full grown, mouth wide open. */
export const MUNCH_OPEN = [
  ...MUNCH_TOP,
  'kbbkkkkkkkkkkkkkkkkkkbbk',
  'kbbkwkwkwkwkwkwkwkwkkbbk',
  'kbbkmmmmmmmmmmmmmmmmkbbk',
  'kbbkmmmmmmttttmmmmmmkbbk',
  'kbbkmmmmmttttttmmmmmkbbk',
  'kbbkkwkwkwkwkwkwkwkwkbbk',
  'kbbbkkkkkkkkkkkkkkkkbbbk',
  ...MUNCH_BOTTOM,
];

/** MUNCH chewing, mouth shut, fangs out. */
export const MUNCH_SHUT = [
  ...MUNCH_TOP,
  'kbbbbbbbbbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbbbbbbbbbk',
  'kbbkbbbbbbbbbbbbbbbbkbbk',
  'kbbbkkkkkkkkkkkkkkkkbbbk',
  'kbbbbkwkbbbbbbbbkwkbbbbk',
  'kbbbbbkbbbbbbbbbbkbbbbbk',
  'kbbbbbbbbbbbbbbbbbbbbbbk',
  ...MUNCH_BOTTOM,
];

/** Blink frames: the eye rows go flat. */
const blink = (rows: string[], eyeRows: number[]) => rows.map((r, i) => (eyeRows.includes(i) ? r.replace(/w/g, 'b').replace(/e/g, i === eyeRows[eyeRows.length - 1] ? 'k' : 'b') : r));
export const MUNCHLET_BLINK = blink(MUNCHLET, [4, 5]);
export const CHOMPER_BLINK = blink(CHOMPER, [4, 5]);
export const MUNCH_SHUT_BLINK = blink(MUNCH_SHUT, [6, 7]);

/** A $MUNCH coin: what the auto-feeder buys and MUNCH eats. */
export const COIN = ['..kkkk..', '.kgggGk.', 'kgiggGGk', 'kgggggGk', 'kgkggkGk', 'kggkkgGk', '.kGGGGk.', '..kkkk..'];

/** ETH kibble: one creator fee, dropping into the bowl. */
export const KIBBLE = ['.kkk.', 'kffFk', 'kfiFk', 'kFFFk', '.kkk.'];

/** The food bowl (the fee escrow). */
export const BOWL = ['k..........k', 'kk........kk', '.kDDDDDDDDk.', '.kDiDDDDDDk.', '..kDDDDDDk..', '...kkkkkk...'];

/** The snack jar: even feedings go here (the project wallet). */
export const JAR = [
  '..kkkkkkkk..',
  '..kllllllk..',
  '..kkkkkkkk..',
  '.kjjjjjjjjk.',
  'kjijjjjjjjjk',
  'kjijgggjjjjk',
  'kjjjgGgjjjjk',
  'kjjggggggjjk',
  'kjjgGggGgjjk',
  'kjgggggggGjk',
  'kjggGggggggk',
  '.kjjjjjjjjk.',
  '..kkkkkkkk..',
];

/** The auto-feeder: the bot, a little dispenser that never sleeps. */
export const FEEDER = [
  '.kkkkkkkkkk.',
  'kDDDDDDDDDDk',
  'kDkkkkkkkkDk',
  'kDkiffffFkDk',
  'kDkffFfffkDk',
  'kDkkkkkkkkDk',
  'kDDDDkkDDDDk',
  '.kkkkDDkkkk.',
  '....kDDk....',
  '....kkkk....',
];

/** Menu icons along the top of the screen, 9 by 9. */
export const ICONS = {
  life: ['...kkk...', '..k...k..', '.k.....k.', '.k.k...k.', 'k.......k', 'k.....k.k', 'k.......k', '.k.....k.', '..kkkkk..'],
  feed: ['...k.k...', '..k.k....', '...k.k...', '.........', 'kkkkkkkkk', 'k.......k', '.k.....k.', '..k...k..', '...kkk...'],
  meals: ['.kkk.kkk.', 'k...k...k', 'k.k.k.k.k', 'k...k...k', 'k.k.k.k.k', 'k...k...k', 'k...k...k', '.kkkkkkk.', '.........'],
  jar: ['..kkkkk..', '..k...k..', '.kkkkkkk.', 'k.......k', 'k..kkk..k', 'k..k.k..k', 'k..kkk..k', 'k.......k', '.kkkkkkk.'],
  status: ['.........', '.kk...kk.', 'kkkk.kkkk', 'kkkkkkkkk', 'kkkkkkkkk', '.kkkkkkk.', '..kkkkk..', '...kkk...', '....k....'],
} as const;

/** A heart for the hunger readout, full or empty. */
export const HEART = ['.kk.kk.', 'kkkkkkk', 'kkkkkkk', '.kkkkk.', '..kkk..', '...k...'];
export const HEART_EMPTY = ['.kk.kk.', 'k..k..k', 'k.....k', '.k...k.', '..k.k..', '...k...'];

/** Draws a sprite inside an existing <svg>, one rect per horizontal run of a colour. */
export function Sprite({ rows, x = 0, y = 0, px = 1, pal = COLOR, ...rest }: { rows: readonly string[]; x?: number; y?: number; px?: number; pal?: Record<string, string> } & SVGProps<SVGGElement>) {
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
export function PixelArt({ rows, className, title, pal }: { rows: readonly string[]; className?: string; title?: string; pal?: Record<string, string> }) {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg viewBox={`0 0 ${w} ${rows.length}`} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} shapeRendering="crispEdges">
      <Sprite rows={rows} pal={pal} />
    </svg>
  );
}
