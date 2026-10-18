/**
 * Digby's pixel art. Every sprite is built on a small grid in code, then outlined
 * automatically, so the site and the X kit draw exactly the same pixels.
 * Pure data: no DOM here, so a canvas, an SVG or a Remotion still can all render it.
 */

export const PAL = {
  ol: '#16111f',
  bone: '#ece5d0',
  boneS: '#b9ad94',
  sock: '#16111f',
  eye: '#9dff7a',
  eyeHi: '#e6ffd9',
  hood: '#4e3b6b',
  hoodS: '#36284d',
  hoodH: '#6a5590',
  rope: '#c79d52',
  patch: '#7a5a3a',
  wood: '#8d5b33',
  woodS: '#5f3b1f',
  iron: '#a9b1bb',
  ironS: '#6b7380',
  gold: '#f2c14e',
  goldS: '#b07f22',
  goldH: '#fff2b8',
  lanF: '#3a3145',
  lanG: '#a8ff7f',
  lanIn: '#221a2c',
  cloak: '#27434d',
  lining: '#7b2a3c',
  hat: '#211a2b',
  hatB: '#8a5cc4',
  hatH: '#3a2f4a',
  ghost: '#ece8ff',
  ghostS: '#b4abe3',
  blush: '#ff9fb8',
  stone: '#8a879a',
  stoneS: '#625f73',
  stoneH: '#a9a6b8',
  moss: '#5f8a4e',
  dirt: '#4a3328',
  dirtS: '#33221b',
  grass: '#3d5c3a',
  grassH: '#5b8450',
  sack: '#9b7448',
  sackS: '#6e5030',
  sky0: '#0f0b1d',
  sky1: '#151029',
  sky2: '#1d1535',
  hill0: '#1b1430',
  hill1: '#221a3a',
  fence: '#2c2342',
  moon: '#f1e6bf',
  moonS: '#d6c898',
  star: '#e9e3d3',
  starD: '#6f6890',
  hole: '#0c0812',
  bubble: '#f4eedc',
  blood: '#c43a4e',
} as const;

const C = PAL;

export class Grid {
  w: number;
  h: number;
  d: (string | null)[];
  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.d = new Array(w * h).fill(null);
  }
  p(x: number, y: number, c: string | null) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.d[y * this.w + x] = c;
  }
  g(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.d[y * this.w + x];
  }
  r(x: number, y: number, w: number, h: number, c: string | null) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.p(x + i, y + j, c);
  }
  row(x0: number, x1: number, y: number, c: string | null) {
    for (let x = x0; x <= x1; x++) this.p(x, y, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: string) {
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) {
      this.p(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) {
        e += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        e += dx;
        y0 += sy;
      }
    }
  }
  /** One-pixel ink outline round every filled shape (4-neighbour), the classic sprite look. */
  outline(c: string) {
    const add: [number, number][] = [];
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (this.g(x, y)) continue;
        if (this.g(x + 1, y) || this.g(x - 1, y) || this.g(x, y + 1) || this.g(x, y - 1)) add.push([x, y]);
      }
    add.forEach(([x, y]) => this.p(x, y, c));
    return this;
  }
  /** Horizontal runs of one colour, so an SVG needs a rect per run instead of per pixel. */
  runs() {
    const out: { x: number; y: number; w: number; c: string }[] = [];
    for (let y = 0; y < this.h; y++) {
      let x = 0;
      while (x < this.w) {
        const c = this.d[y * this.w + x];
        if (!c) {
          x++;
          continue;
        }
        let e = x + 1;
        while (e < this.w && this.d[y * this.w + e] === c) e++;
        out.push({ x, y, w: e - x, c });
        x = e;
      }
    }
    return out;
  }
}

/* ───────── text: a 3×5 pixel face for the few words drawn into the art ───────── */
const GLY: Record<string, string[]> = {
  R: ['110', '101', '110', '101', '101'],
  I: ['1', '1', '1', '1', '1'],
  P: ['110', '101', '110', '100', '100'],
  '!': ['1', '1', '1', '0', '1'],
  '#': ['101', '111', '101', '111', '101'],
  '1': ['010', '110', '010', '010', '111'],
};
export function glyphs(put: (x: number, y: number) => void, str: string, x: number, y: number) {
  for (const ch of str) {
    const gl = GLY[ch];
    if (!gl) continue;
    gl.forEach((r, j) => [...r].forEach((b, i) => b === '1' && put(x + i, y + j)));
    x += gl[0].length + 1;
  }
}

/* ───────── Digby ───────── */
export type Pose = 'idle' | 'raise' | 'plunge' | 'toss';
export interface Frame {
  p: Pose;
  bob?: number;
  blink?: number;
  yawn?: number;
}

/** Where the shovel's top, its blade end and Digby's hand sit for each pose. */
const POSES: Record<Pose, { t: [number, number]; b: [number, number]; h: [number, number] }> = {
  idle: { t: [25, 11], b: [25, 25], h: [24, 19] },
  raise: { t: [28, 7], b: [23, 21], h: [25, 14] },
  plunge: { t: [26, 15], b: [25, 27], h: [25, 20] },
  toss: { t: [23, 19], b: [28, 9], h: [24, 14] },
};

/** Digby is 34×34. His feet stand on row 29, so row 30 is the ground line. */
export const DIGBY_SIZE = 34;
/** The lantern he carries from stage 3, in sprite coordinates (for the glow). */
export const LANTERN_AT = { x: 8.5, y: 27.5 };

export function buildDigby(stage: number, pose: Pose, f: Omit<Frame, 'p'> = {}) {
  const g = new Grid(34, 34);
  const hy = f.bob ? 1 : 0;
  const P = POSES[pose];

  // keeper's cloak, behind everything
  if (stage >= 4) {
    g.r(7, 17, 18, 12, C.cloak);
    for (let y = 18; y < 29; y++) {
      g.p(7, y, C.lining);
      g.p(24, y, C.lining);
    }
  }

  // robe
  g.row(11, 20, 17, C.hood);
  for (let y = 18; y <= 20; y++) g.row(10, 21, y, C.hood);
  for (let y = 21; y <= 28; y++) g.row(9, 22, y, C.hood);
  for (let y = 18; y <= 28; y++) g.p(y < 21 ? 10 : 9, y, C.hoodS);
  for (let y = 24; y <= 28; y++) g.p(16, y, C.hoodS);
  for (let x = 10; x <= 22; x += 3) g.p(x, 28, null);
  g.row(9, 22, 22, C.rope);
  g.p(12, 23, C.rope);
  g.p(12, 24, C.rope);
  g.p(13, 23, C.rope);
  if (stage >= 5) g.r(15, 21, 2, 2, C.gold);
  if (stage === 1) {
    g.r(18, 25, 3, 2, C.patch);
    g.p(19, 25, C.rope);
  }

  // feet
  g.row(11, 13, 29, C.bone);
  g.row(18, 20, 29, C.bone);
  g.p(13, 29, C.boneS);
  g.p(20, 29, C.boneS);

  // left arm
  g.r(8, 18, 2, 4, C.hood);
  g.p(8, 19, C.hoodS);
  g.p(8, 20, C.hoodS);
  g.r(8, 22, 2, 2, C.bone);
  g.p(8, 23, C.boneS);

  // hood
  g.row(13, 18, 5 + hy, C.hood);
  g.row(11, 20, 6 + hy, C.hood);
  g.row(10, 21, 7 + hy, C.hood);
  for (let y = 8; y <= 16; y++) g.row(9, 22, y + hy, C.hood);
  g.row(13, 16, 5 + hy, C.hoodH);
  g.row(11, 13, 6 + hy, C.hoodH);
  for (let y = 8; y <= 16; y++) g.p(9, y + hy, C.hoodS);
  g.row(12, 19, 7 + hy, C.hoodS);

  // skull
  g.row(12, 19, 8 + hy, C.bone);
  for (let y = 9; y <= 12; y++) g.row(11, 20, y + hy, C.bone);
  g.row(12, 19, 13 + hy, C.bone);
  g.row(13, 18, 14 + hy, C.boneS);
  for (let y = 9; y <= 12; y++) g.p(20, y + hy, C.boneS);
  if (f.blink || f.yawn) {
    g.row(13, 14, 11 + hy, C.sock);
    g.row(17, 18, 11 + hy, C.sock);
  } else {
    g.r(13, 10 + hy, 2, 2, C.sock);
    g.r(17, 10 + hy, 2, 2, C.sock);
    g.p(14, 11 + hy, C.eye);
    g.p(17, 11 + hy, C.eye);
    if (stage >= 5) {
      g.p(13, 11 + hy, C.eye);
      g.p(18, 11 + hy, C.eye);
      g.p(14, 10 + hy, C.eyeHi);
      g.p(17, 10 + hy, C.eyeHi);
    }
  }
  g.p(15, 12 + hy, C.sock);
  g.p(16, 12 + hy, C.sock);
  if (f.yawn) g.r(14, 13 + hy, 4, 2, C.sock);
  else {
    g.p(14, 13 + hy, C.sock);
    g.p(17, 13 + hy, C.sock);
  }

  // keeper's collar
  if (stage >= 4) {
    g.row(8, 23, 17, C.cloak);
    g.p(8, 16, C.cloak);
    g.p(8, 15, C.cloak);
    g.p(23, 16, C.cloak);
    g.p(23, 15, C.cloak);
    g.p(9, 17, C.lining);
    g.p(22, 17, C.lining);
  }

  // the undertaker's top hat
  if (stage >= 5) {
    g.row(9, 22, 5 + hy, C.hat);
    g.r(12, 1 + hy, 8, 4, C.hat);
    g.row(12, 19, 4 + hy, C.hatB);
    g.p(13, 2 + hy, C.hatH);
    g.p(13, 3 + hy, C.hatH);
  }

  // shovel
  const blade = stage === 1 ? [C.wood, C.woodS] : stage >= 5 ? [C.gold, C.goldS] : [C.iron, C.ironS];
  const [tx, ty] = P.t;
  const [bx, by] = P.b;
  g.line(tx, ty, bx, by, C.wood);
  if (Math.abs(bx - tx) < Math.abs(by - ty)) g.row(tx - 1, tx + 1, ty, C.woodS);
  else {
    g.p(tx, ty - 1, C.woodS);
    g.p(tx, ty + 1, C.woodS);
  }
  if (by > ty) {
    g.r(bx - 1, by + 1, 4, 4, blade[0]);
    g.row(bx, bx + 1, by + 5, blade[0]);
    for (let y = by + 1; y <= by + 4; y++) g.p(bx + 2, y, blade[1]);
  } else {
    g.r(bx - 1, by - 4, 4, 4, blade[0]);
    g.row(bx, bx + 1, by - 5, blade[0]);
    for (let y = by - 4; y <= by - 1; y++) g.p(bx + 2, y, blade[1]);
  }
  if (pose === 'toss') {
    g.p(30, 2, C.dirt);
    g.p(31, 4, C.dirtS);
    g.p(29, 1, C.dirt);
    g.p(32, 6, C.dirt);
  }

  // right arm and hand on the handle
  const [hx, hy2] = P.h;
  g.line(21, 18, hx, hy2, C.hood);
  g.line(21, 19, hx, hy2 + 1, C.hood);
  g.r(hx, hy2, 2, 2, C.bone);
  g.p(hx + 1, hy2 + 1, C.boneS);

  // the fee lantern, from stage 3
  if (stage >= 3) {
    g.p(8, 24, C.lanF);
    g.row(7, 9, 25, C.lanF);
    g.r(6, 26, 5, 3, C.lanF);
    g.r(7, 26, 3, 3, C.lanG);
    g.p(8, 27, C.eyeHi);
    g.row(7, 9, 29, C.lanF);
  }
  return g.outline(C.ol);
}

/** Just the hooded skull, for the logo mark and the favicon. 18×16. */
export function buildHead(stage = 3) {
  const g = new Grid(18, 16);
  const ox = -7;
  const oy = -3;
  const put = (x: number, y: number, c: string) => g.p(x + ox, y + oy, c);
  const row = (a: number, b: number, y: number, c: string) => {
    for (let x = a; x <= b; x++) put(x, y, c);
  };
  row(13, 18, 5, C.hood);
  row(11, 20, 6, C.hood);
  row(10, 21, 7, C.hood);
  for (let y = 8; y <= 16; y++) row(9, 22, y, C.hood);
  row(13, 16, 5, C.hoodH);
  row(11, 13, 6, C.hoodH);
  for (let y = 8; y <= 16; y++) put(9, y, C.hoodS);
  row(12, 19, 7, C.hoodS);
  row(12, 19, 8, C.bone);
  for (let y = 9; y <= 12; y++) row(11, 20, y, C.bone);
  row(12, 19, 13, C.bone);
  row(13, 18, 14, C.boneS);
  for (let y = 9; y <= 12; y++) put(20, y, C.boneS);
  row(13, 14, 10, C.sock);
  row(13, 14, 11, C.sock);
  row(17, 18, 10, C.sock);
  row(17, 18, 11, C.sock);
  put(14, 11, C.eye);
  put(17, 11, C.eye);
  if (stage >= 5) {
    put(13, 11, C.eye);
    put(18, 11, C.eye);
  }
  put(15, 12, C.sock);
  put(16, 12, C.sock);
  put(14, 13, C.sock);
  put(17, 13, C.sock);
  return g.outline(C.ol);
}

export function buildGhost(f: number) {
  const g = new Grid(14, 14);
  g.row(5, 8, 1, C.ghost);
  g.row(3, 10, 2, C.ghost);
  for (let y = 3; y <= 10; y++) g.row(2, 11, y, C.ghost);
  for (let y = 3; y <= 10; y++) g.p(11, y, C.ghostS);
  g.row(3, 10, 10, C.ghostS);
  (f ? [4, 5, 8, 9] : [2, 3, 6, 7, 10, 11]).forEach((x) => g.p(x, 11, C.ghostS));
  g.p(4, 3, '#ffffff');
  g.p(5, 2, '#ffffff');
  g.p(4, 5, C.sock);
  g.p(4, 6, C.sock);
  g.p(9, 5, C.sock);
  g.p(9, 6, C.sock);
  g.p(3, 7, C.blush);
  g.p(10, 7, C.blush);
  g.p(6, 8, C.sock);
  g.p(7, 8, C.sock);
  return g.outline(C.ol);
}

/** A headstone, 16×17. Rows 14–15 are the base that sits in the grass. */
export function buildTomb() {
  const g = new Grid(16, 17);
  g.row(5, 10, 1, C.stone);
  g.row(3, 12, 2, C.stone);
  for (let y = 3; y <= 13; y++) g.row(2, 13, y, C.stone);
  for (let y = 3; y <= 13; y++) {
    g.p(2, y, C.stoneH);
    g.p(13, y, C.stoneS);
  }
  g.row(4, 8, 2, C.stoneH);
  glyphs((x, y) => g.p(x, y, C.stoneS), 'RIP', 4, 5);
  g.row(5, 10, 11, C.stoneS);
  g.p(2, 13, C.moss);
  g.p(3, 13, C.moss);
  g.p(2, 12, C.moss);
  g.p(13, 13, C.moss);
  g.p(12, 13, C.moss);
  g.row(1, 14, 14, C.stoneS);
  g.row(1, 14, 15, C.stoneS);
  return g.outline(C.ol);
}

/** A $DIGBY coin, 10×10, with a D stamped in it. */
export function buildCoin() {
  const g = new Grid(10, 10);
  g.row(3, 6, 1, C.gold);
  g.row(2, 7, 2, C.gold);
  for (let y = 3; y <= 6; y++) g.row(1, 8, y, C.gold);
  g.row(2, 7, 7, C.gold);
  g.row(3, 6, 8, C.gold);
  for (let y = 3; y <= 6; y++) g.p(8, y, C.goldS);
  g.row(3, 6, 8, C.goldS);
  g.p(7, 7, C.goldS);
  g.r(4, 3, 2, 4, C.goldS);
  g.p(6, 4, C.goldS);
  g.p(6, 5, C.goldS);
  g.p(3, 3, C.goldH);
  g.p(2, 4, C.goldH);
  return g.outline(C.ol);
}

/** The fee lantern, 11×16, filled 0–4 (four steps of two rows). */
export function buildLantern(level: number) {
  const g = new Grid(11, 16);
  g.p(5, 1, C.lanF);
  g.row(4, 6, 2, C.lanF);
  g.row(3, 7, 3, C.lanF);
  g.r(2, 4, 7, 9, C.lanF);
  g.r(3, 4, 5, 8, C.lanIn);
  for (let k = 0; k < level * 2; k++) g.row(3, 7, 11 - k, C.lanG);
  for (let y = 4; y <= 11; y++) g.p(5, y, C.lanF);
  g.row(2, 8, 13, C.lanF);
  g.row(3, 7, 14, C.lanF);
  return g.outline(C.ol);
}

/** Digby's wages: a tied sack with a coin peeking out, 14×14. */
export function buildSack() {
  const g = new Grid(14, 14);
  g.row(5, 8, 1, C.sackS);
  g.row(6, 7, 2, C.sackS);
  g.row(5, 8, 3, C.rope);
  g.row(4, 9, 4, C.sack);
  g.row(3, 10, 5, C.sack);
  for (let y = 6; y <= 11; y++) g.row(2, 11, y, C.sack);
  g.row(3, 10, 12, C.sackS);
  for (let y = 5; y <= 11; y++) g.p(y < 6 ? 10 : 11, y, C.sackS);
  g.r(5, 7, 3, 3, C.gold);
  g.p(7, 9, C.goldS);
  g.p(5, 7, C.goldH);
  return g.outline(C.ol);
}

/* ───────── animation tracks (8 fps) ───────── */
export const IDLE: Frame[] = [
  { p: 'idle' },
  { p: 'idle' },
  { p: 'idle', bob: 1 },
  { p: 'idle', bob: 1 },
  { p: 'idle' },
  { p: 'idle', blink: 1 },
  { p: 'idle', bob: 1 },
  { p: 'idle', bob: 1 },
];
export const DIG: Frame[] = [
  { p: 'idle' },
  { p: 'raise' },
  { p: 'raise' },
  { p: 'plunge', bob: 1 },
  { p: 'plunge', bob: 1 },
  { p: 'toss' },
  { p: 'toss' },
  { p: 'idle' },
];
export const YAWN: Frame[] = [
  { p: 'idle' },
  { p: 'idle', bob: 1 },
  { p: 'idle', bob: 1, yawn: 1 },
  { p: 'idle', bob: 1, yawn: 1 },
  { p: 'idle', bob: 1, yawn: 1 },
  { p: 'idle', blink: 1 },
  { p: 'idle' },
  { p: 'idle' },
];
export const FPS = 8;

/** A coffin, 16×10, lying flat under its headstone. */
export function buildCoffin() {
  const g = new Grid(16, 10);
  g.row(4, 11, 1, C.wood);
  g.row(2, 13, 2, C.wood);
  for (let y = 3; y <= 6; y++) g.row(1, 14, y, C.wood);
  g.row(2, 13, 7, C.wood);
  g.row(4, 11, 8, C.woodS);
  g.row(2, 13, 7, C.woodS);
  g.row(4, 7, 2, '#a8754a');
  g.row(6, 9, 4, C.woodS);
  g.r(7, 3, 2, 4, C.woodS);
  return g.outline(C.ol);
}

/** The marker for a plot that is dug and waiting: a wooden stake sign reading "#1", 13×16. */
export function buildStake() {
  const g = new Grid(13, 16);
  g.r(1, 1, 11, 7, C.wood);
  g.row(1, 11, 7, C.woodS);
  g.row(1, 11, 1, '#a8754a');
  glyphs((x, y) => g.p(x, y, C.bone), '#1', 3, 2);
  g.r(5, 8, 2, 7, C.woodS);
  g.p(5, 8, C.wood);
  return g.outline(C.ol);
}
