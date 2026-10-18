/**
 * Turns Digby's grids into canvases and paints the graveyard scene.
 * Every sprite is drawn once at 1× and cached; the page scales the canvases up with
 * `image-rendering: pixelated`, so each art pixel stays a crisp square.
 */
import {
  DIG,
  IDLE,
  LANTERN_AT,
  PAL,
  YAWN,
  buildCoffin,
  buildCoin,
  buildDigby,
  buildGhost,
  buildHead,
  buildLantern,
  buildSack,
  buildStake,
  buildTomb,
  glyphs,
  type Frame,
  type Grid,
} from './pixels';

const cache = new Map<string, HTMLCanvasElement>();

function toCanvas(g: Grid) {
  const c = document.createElement('canvas');
  c.width = g.w;
  c.height = g.h;
  const x = c.getContext('2d')!;
  for (const r of g.runs()) {
    x.fillStyle = r.c;
    x.fillRect(r.x, r.y, r.w, 1);
  }
  return c;
}

function spr(key: string, build: () => Grid) {
  let c = cache.get(key);
  if (!c) {
    c = toCanvas(build());
    cache.set(key, c);
  }
  return c;
}

export const digbySprite = (stage: number, f: Frame) => spr(`d${stage}${f.p}${f.bob ? 1 : 0}${f.blink ? 1 : 0}${f.yawn ? 1 : 0}`, () => buildDigby(stage, f.p, f));
export const headSprite = (stage = 3) => spr(`h${stage}`, () => buildHead(stage));
export const ghostSprite = (f: number) => spr(`g${f}`, () => buildGhost(f));
export const tombSprite = () => spr('t', buildTomb);
export const coinSprite = () => spr('c', buildCoin);
export const lanternSprite = (l: number) => spr(`l${l}`, () => buildLantern(l));
export const sackSprite = () => spr('s', buildSack);
export const coffinSprite = () => spr('k', buildCoffin);
export const stakeSprite = () => spr('p', buildStake);

/** A soft green glow, for lanterns. */
export function halo(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, a: number) {
  const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gr.addColorStop(0, `rgba(168,255,127,${a})`);
  gr.addColorStop(1, 'rgba(168,255,127,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

/** The "RIP!" speech bubble, 17×11 with its tail. */
export function ripBubble(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 17;
  const h = 9;
  ctx.fillStyle = PAL.ol;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = PAL.bubble;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = PAL.ol;
  ctx.fillRect(x + 2, y + h, 2, 1);
  ctx.fillRect(x + 1, y + h + 1, 2, 1);
  ctx.fillStyle = PAL.bubble;
  ctx.fillRect(x + 2, y + h - 1, 2, 1);
  ctx.fillStyle = PAL.blood;
  glyphs((px, py) => ctx.fillRect(px, py, 1, 1), 'RIP!', x + 3, y + 2);
}

/* ───────── small framed sprite cards (48×44) ───────── */
export const CARD_W = 48;
export const CARD_H = 44;

export function cardBackdrop(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAL.sky1;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = PAL.sky2;
  ctx.fillRect(0, 26, CARD_W, 12);
  ctx.fillStyle = PAL.grassH;
  ctx.fillRect(0, 38, CARD_W, 1);
  ctx.fillStyle = PAL.grass;
  ctx.fillRect(0, 39, CARD_W, 1);
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(0, 40, CARD_W, 4);
  ctx.fillStyle = PAL.dirtS;
  for (let x = 0; x < CARD_W; x += 2) ctx.fillRect(x + (x % 4 ? 1 : 0), 42, 1, 1);
}

export type CardArt = 'idle' | 'dig' | 'yawn' | 'rip' | 'ghost' | 'tomb' | 'lantern' | 'coin' | 'sack';

/** One tick of a small sprite card. `level` drives the lantern when it is a live reading. */
export function drawCard(ctx: CanvasRenderingContext2D, art: CardArt, stage: number, t: number, level?: number) {
  cardBackdrop(ctx);
  if (art === 'idle' || art === 'dig' || art === 'yawn' || art === 'rip') {
    const track = art === 'dig' ? DIG : art === 'yawn' ? YAWN : IDLE;
    ctx.drawImage(digbySprite(stage, track[t % 8]), 7, 8);
    if (stage >= 3) halo(ctx, 7 + LANTERN_AT.x, 8 + LANTERN_AT.y, 9, 0.28 + 0.06 * ((t >> 1) % 2));
    if (art === 'rip' && t % 8 < 6) ripBubble(ctx, 27, 1);
  } else if (art === 'ghost') {
    ctx.drawImage(ghostSprite((t >> 1) % 2), 8, 12 + Math.round(Math.sin(t / 3) * 2));
    ctx.globalAlpha = 0.75;
    ctx.drawImage(ghostSprite(((t >> 1) + 1) % 2), 27, 7 + Math.round(Math.sin(t / 3 + 2) * 2));
    ctx.globalAlpha = 1;
  } else if (art === 'tomb') {
    const k = t % 24;
    const rise = k < 8 ? 14 - k * 2 : 0;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CARD_W, 40);
    ctx.clip();
    ctx.drawImage(tombSprite(), 16, 24 + Math.max(0, rise));
    ctx.restore();
  } else if (art === 'lantern') {
    const lvl = level ?? Math.min(4, Math.floor(t / 4) % 7);
    if (lvl > 0) halo(ctx, 24, 23, 6 + lvl * 3, 0.08 * lvl);
    ctx.drawImage(lanternSprite(lvl), 19, 15);
  } else if (art === 'coin') {
    const w = [10, 7, 3, 7][(t >> 1) % 4];
    ctx.drawImage(coinSprite(), Math.round(24 - w / 2), 18 + Math.round(Math.sin(t / 3) * 2), w, 10);
  } else if (art === 'sack') {
    ctx.drawImage(sackSprite(), 17, 25);
    if ((t >> 2) % 2) {
      ctx.fillStyle = PAL.goldH;
      ctx.fillRect(28, 24, 1, 1);
    }
  }
}

/* ───────── the graveyard ───────── */
export const SCENE_H = 96;
export const GROUND = 80;
/** Ticks in one full burial: dig, coin drops, fill, headstone rises, bell. */
export const BURIAL_TICKS = 53;

export interface SceneState {
  stage: number;
  /** fee lantern fill, 0..1 */
  lantern: number;
  /** how many burials so far */
  graves: number;
  /** tick the newest grave appeared (it rises from the ground) */
  newGraveAt: number;
  /** the engine is mid-run: Digby keeps a grave open */
  digging: boolean;
  /** ticks since a burial started, or null */
  burial: number | null;
  /** tick Digby was last poked (he does one dig) */
  pokedAt: number;
  /** cap on floating ghosts (default: one per grave, up to six) */
  ghosts?: number;
  /** 0..1: how far the camera has sunk below the grass (scroll-driven) */
  depth?: number;
  /** art rows cut off the top of the sky, so the camera sits closer (the site uses VIEW_CROP) */
  cropTop?: number;
}

/** The site's camera: 16 rows of empty sky cropped, so Digby is drawn bigger in the same box. */
export const VIEW_CROP = 16;
export const VIEW_H = 96 - VIEW_CROP;
const MOON_Y = 30;

/** How many art pixels of underground the camera can sink into. */
export const UNDER = 76;

interface Layout {
  w: number;
  dx: number;
  pole: number;
  holeX: number;
  front: number[];
  back: number[];
  stars: [number, number][];
}

const layouts = new Map<number, Layout>();

/** Where everything sits for a scene `w` pixels wide. Digby, the lantern post and the open grave share the middle. */
export function layoutFor(w: number): Layout {
  let l = layouts.get(w);
  if (l) return l;
  // wide yards put Digby on the right third so the name has the sky on the left; narrow ones centre him
  const dx = Math.round(w * (w >= 170 ? 0.66 : 0.46)) - 17;
  const pole = dx - 9;
  const holeX = dx + 35;
  const busyL = pole - 13;
  const busyR = holeX + 22;
  const front: number[] = [];
  // fill outwards from the middle, alternating sides
  const right: number[] = [];
  for (let x = busyR; x + 16 <= w; x += 18) right.push(x);
  const left: number[] = [];
  for (let x = busyL - 16; x >= 0; x -= 18) left.push(x);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (right[i] !== undefined) front.push(right[i]);
    if (left[i] !== undefined) front.push(left[i]);
  }
  const back: number[] = [];
  for (let x = 6; x + 16 <= w; x += 19) if (x + 16 < pole - 2 || x > holeX + 12) back.push(x);
  let seed = 7 + w;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: Math.round(w / 5) }, () => [Math.floor(rand() * w), Math.floor(rand() * 56)] as [number, number]);
  l = { w, dx, pole, holeX, front, back, stars };
  layouts.set(w, l);
  return l;
}

/** How many headstones fit in a scene this wide. */
export const sceneCapacity = (w: number) => {
  const l = layoutFor(w);
  return l.front.length + l.back.length;
};

function sky(ctx: CanvasRenderingContext2D, l: Layout, t: number) {
  const { w } = l;
  ctx.fillStyle = PAL.sky0;
  ctx.fillRect(0, 0, w, SCENE_H);
  ctx.fillStyle = PAL.sky1;
  ctx.fillRect(0, 30, w, 20);
  ctx.fillStyle = PAL.sky2;
  ctx.fillRect(0, 50, w, 30);
  for (let x = 0; x < w; x += 2) {
    ctx.fillStyle = PAL.sky1;
    ctx.fillRect(x, 29, 1, 1);
    ctx.fillStyle = PAL.sky2;
    ctx.fillRect(x + 1, 49, 1, 1);
  }
  l.stars.forEach(([x, y], i) => {
    const dim = (t + i * 7) % 29 < 3;
    ctx.fillStyle = dim ? PAL.starD : PAL.star;
    ctx.fillRect(x, y, 1, 1);
    if (i % 9 === 0 && !dim) {
      ctx.fillStyle = PAL.starD;
      ctx.fillRect(x - 1, y, 1, 1);
      ctx.fillRect(x + 1, y, 1, 1);
      ctx.fillRect(x, y - 1, 1, 1);
      ctx.fillRect(x, y + 1, 1, 1);
    }
  });
  const mx = w - 34;
  const gr = ctx.createRadialGradient(mx, MOON_Y, 6, mx, MOON_Y, 30);
  gr.addColorStop(0, 'rgba(241,230,191,0.18)');
  gr.addColorStop(1, 'rgba(241,230,191,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(mx - 30, MOON_Y - 30, 60, 60);
  ctx.fillStyle = PAL.moon;
  for (let dy = -10; dy <= 10; dy++) {
    const half = Math.floor(Math.sqrt(100 - dy * dy));
    ctx.fillRect(mx - half, MOON_Y + dy, half * 2 + 1, 1);
  }
  ctx.fillStyle = PAL.moonS;
  ctx.fillRect(mx - 5, MOON_Y - 4, 3, 2);
  ctx.fillRect(mx + 3, MOON_Y + 3, 2, 2);
  ctx.fillRect(mx - 2, MOON_Y + 5, 2, 1);
  ctx.fillRect(mx + 5, MOON_Y - 6, 1, 1);
  for (let x = 0; x < w; x++) {
    const h0 = 58 + Math.round(4 * Math.sin(x / 17) + 3 * Math.sin(x / 7.3));
    ctx.fillStyle = PAL.hill0;
    ctx.fillRect(x, h0, 1, GROUND - h0);
    const h1 = 68 + Math.round(3 * Math.sin(x / 11 + 2) + 2 * Math.sin(x / 5.1));
    ctx.fillStyle = PAL.hill1;
    ctx.fillRect(x, h1, 1, GROUND - h1);
  }
  ctx.fillStyle = PAL.fence;
  ctx.fillRect(0, 66, w, 1);
  ctx.fillRect(0, 74, w, 1);
  for (let x = 2; x < w; x += 7) {
    ctx.fillRect(x, 63, 1, 17);
    ctx.fillRect(x - 1, 64, 3, 1);
    ctx.fillRect(x, 62, 1, 1);
  }
}

function ground(ctx: CanvasRenderingContext2D, w: number) {
  ctx.fillStyle = PAL.grassH;
  ctx.fillRect(0, GROUND, w, 1);
  ctx.fillStyle = PAL.grass;
  ctx.fillRect(0, GROUND + 1, w, 2);
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(0, GROUND + 3, w, SCENE_H - GROUND - 3);
  ctx.fillStyle = PAL.dirtS;
  for (let y = GROUND + 6; y < SCENE_H; y += 2) for (let x = y % 4 ? 0 : 1; x < w; x += 3) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = PAL.grassH;
  for (let x = 5; x < w; x += 13) {
    ctx.fillRect(x, GROUND - 1, 1, 1);
    ctx.fillRect(x + 2, GROUND - 2, 1, 2);
  }
}

function headstones(ctx: CanvasRenderingContext2D, l: Layout, s: SceneState, t: number) {
  const front = Math.min(s.graves, l.front.length);
  const back = Math.min(Math.max(0, s.graves - l.front.length), l.back.length);
  const newest = s.graves - 1;
  const rising = (i: number) => {
    const k = t - s.newGraveAt;
    return i === newest && k >= 0 && k < 8 ? 16 - k * 2 : 0;
  };
  // the back row: further away, so smaller steps and dimmer
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, l.w, GROUND - 4);
  ctx.clip();
  for (let i = 0; i < back; i++) {
    ctx.drawImage(tombSprite(), l.back[i], GROUND - 20 + rising(l.front.length + i));
  }
  ctx.restore();
  if (back > 0) {
    ctx.fillStyle = 'rgba(16,12,27,0.35)';
    ctx.fillRect(0, GROUND - 22, l.w, 18);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, l.w, GROUND + 2);
  ctx.clip();
  for (let i = 0; i < front; i++) ctx.drawImage(tombSprite(), l.front[i], GROUND - 14 + rising(i));
  ctx.restore();
}

/** Before the first burial: plot #1, dug out of the grass and staked, waiting. */
function reservedPlot(ctx: CanvasRenderingContext2D, l: Layout) {
  const x = l.front[0];
  if (x === undefined) return;
  ctx.fillStyle = PAL.dirtS;
  ctx.fillRect(x, GROUND, 16, 3);
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(x + 1, GROUND, 14, 1);
  ctx.fillRect(x + 3, GROUND - 1, 10, 1);
  ctx.drawImage(stakeSprite(), x + 1, GROUND - 15);
}

function grave(ctx: CanvasRenderingContext2D, x: number, size: number) {
  if (size <= 0) return;
  const w = size > 1 ? 10 : 6;
  const hx = size > 1 ? x : x + 2;
  ctx.fillStyle = PAL.dirtS;
  ctx.fillRect(hx - 1, GROUND, w + 2, 4);
  ctx.fillStyle = PAL.hole;
  ctx.fillRect(hx, GROUND, w, 4);
  const peak = size > 1 ? 5 : 2;
  for (let i = 0; i < 9; i++) {
    const h = Math.max(1, peak - Math.abs(i - 4));
    ctx.fillStyle = PAL.dirt;
    ctx.fillRect(x + 12 + i, GROUND - h, 1, h);
    if (i % 2) {
      ctx.fillStyle = PAL.dirtS;
      ctx.fillRect(x + 12 + i, GROUND - 1, 1, 1);
    }
  }
}

function lanternPost(ctx: CanvasRenderingContext2D, l: Layout, fill: number, t: number) {
  const px = l.pole;
  ctx.fillStyle = PAL.ol;
  ctx.fillRect(px - 1, 55, 3, GROUND - 55);
  ctx.fillRect(px - 9, 54, 11, 3);
  ctx.fillStyle = PAL.lanF;
  ctx.fillRect(px, 56, 1, GROUND - 56);
  ctx.fillRect(px - 8, 55, 9, 1);
  const lvl = Math.round(Math.max(0, Math.min(1, fill)) * 4);
  if (lvl > 0) halo(ctx, px - 7, 64, 6 + lvl * 3, 0.07 * lvl + 0.02 * ((t >> 2) % 2));
  ctx.drawImage(lanternSprite(lvl), px - 12, 55);
}

function ghosts(ctx: CanvasRenderingContext2D, l: Layout, s: SceneState, t: number) {
  const n = Math.min(s.graves, s.ghosts ?? 6);
  const span = l.w - 16;
  for (let i = 0; i < n; i++) {
    const speed = 0.12 + (i % 3) * 0.04;
    const p = ((t * speed + i * 41) % (span * 2)) / span;
    const x = p < 1 ? p * span : (2 - p) * span;
    const y = 10 + ((i * 13) % 34) + Math.sin((t + i * 9) / 4) * 1.5;
    // the newest ghost floats up out of its grave
    const k = t - s.newGraveAt;
    if (i === n - 1 && k >= 0 && k < 24 && s.graves <= 6) {
      const slot = l.front[Math.min(s.graves - 1, l.front.length - 1)] ?? x;
      const e = k / 24;
      ctx.globalAlpha = 0.85 * Math.min(1, k / 4);
      ctx.drawImage(ghostSprite((t >> 1) % 2), Math.round(slot + 1 + (x - slot) * e), Math.round(GROUND - 16 + (y - (GROUND - 16)) * e));
      ctx.globalAlpha = 1;
      continue;
    }
    ctx.globalAlpha = 0.85;
    ctx.drawImage(ghostSprite(((t >> 1) + i) % 2), Math.round(x), Math.round(y));
    ctx.globalAlpha = 1;
  }
}

/**
 * Under the grass: the topsoil carries on, then darker strata, roots, stones, old bones,
 * and a coffin under every headstone. Drawn in world rows 96..96+UNDER.
 */
function underground(ctx: CanvasRenderingContext2D, l: Layout, s: SceneState) {
  const { w } = l;
  const top = SCENE_H;
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(0, top, w, UNDER);
  // two darker strata with stepped, wavy edges
  for (let x = 0; x < w; x++) {
    const a = 26 + Math.round(2 * Math.sin(x / 9) + Math.sin(x / 3.7));
    const b = 54 + Math.round(3 * Math.sin(x / 13 + 1) + Math.sin(x / 4.3));
    ctx.fillStyle = PAL.dirtS;
    ctx.fillRect(x, top + a, 1, 3);
    ctx.fillRect(x, top + b, 1, UNDER - b);
  }
  ctx.fillStyle = PAL.dirtS;
  for (let y = top + 2; y < top + 54; y += 3) for (let x = (y * 7) % 5; x < w; x += 5) ctx.fillRect(x, y, 1, 1);
  // roots hanging from the grass
  ctx.fillStyle = PAL.woodS;
  for (let x = 9; x < w; x += 23) {
    const len = 4 + ((x * 13) % 7);
    for (let k = 0; k < len; k++) ctx.fillRect(x + (k % 3 === 2 ? 1 : 0) + Math.floor(k / 3), top + k, 1, 1);
  }
  // stones and an old bone or two
  let seed = 11 + w;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < Math.round(w / 22); i++) {
    const x = Math.floor(rand() * (w - 4));
    const y = top + 10 + Math.floor(rand() * (UNDER - 14));
    ctx.fillStyle = PAL.stoneS;
    ctx.fillRect(x, y, 3, 2);
    ctx.fillStyle = PAL.stone;
    ctx.fillRect(x, y, 2, 1);
  }
  for (let i = 0; i < Math.max(1, Math.round(w / 90)); i++) {
    const x = Math.floor(rand() * (w - 8));
    const y = top + 40 + Math.floor(rand() * 20);
    ctx.fillStyle = PAL.boneS;
    ctx.fillRect(x, y + 1, 7, 1);
    ctx.fillStyle = PAL.bone;
    ctx.fillRect(x, y, 2, 1);
    ctx.fillRect(x, y + 2, 2, 1);
    ctx.fillRect(x + 5, y, 2, 1);
    ctx.fillRect(x + 5, y + 2, 2, 1);
  }
  // one coffin under every headstone that is up
  const front = Math.min(s.graves, l.front.length);
  const back = Math.min(Math.max(0, s.graves - l.front.length), l.back.length);
  for (let i = 0; i < front; i++) ctx.drawImage(coffinSprite(), l.front[i], top + 6);
  for (let i = 0; i < back; i++) ctx.drawImage(coffinSprite(), l.back[i] + 1, top + 32);
}

/** One frame of the graveyard, `w`×96 pixels. With `depth`, the camera sinks below the grass. */
export function drawScene(ctx: CanvasRenderingContext2D, w: number, t: number, s: SceneState) {
  const l = layoutFor(w);
  ctx.imageSmoothingEnabled = false;
  const dy = Math.round(Math.max(0, Math.min(1, s.depth ?? 0)) * UNDER);
  ctx.save();
  ctx.translate(0, -dy - (s.cropTop ?? 0));
  if (dy > 0) underground(ctx, l, s);
  sky(ctx, l, t);
  headstones(ctx, l, s, t);
  ground(ctx, w);
  if (s.graves === 0) reservedPlot(ctx, l);
  lanternPost(ctx, l, s.lantern, t);

  let frame: Frame = IDLE[t % 8];
  let holeSize = 0;
  let coinY: number | null = null;
  let bubble = false;
  const k = s.burial;
  if (k !== null) {
    if (k < 8) {
      frame = DIG[k];
      holeSize = k >= 3 ? (k >= 5 ? 2 : 1) : 0;
    } else if (k < 17) {
      holeSize = 2;
      const y = Math.round(-10 + 84 * Math.min(1, ((k - 8) / 8) ** 2));
      coinY = y >= GROUND - 6 ? null : y;
    } else if (k < 25) {
      frame = DIG[k - 17];
      holeSize = k < 21 ? 2 : k < 24 ? 1 : 0;
    } else if (k >= 30) {
      bubble = (k - 30) % 4 < 3;
      frame = { p: 'idle', bob: (k >> 1) % 2 };
    }
  } else if (s.digging) {
    frame = DIG[t % 8];
    holeSize = 2;
  } else if (t - s.pokedAt >= 0 && t - s.pokedAt < 8) {
    frame = DIG[t - s.pokedAt];
  } else if (t % 64 >= 40 && t % 64 < 48) {
    frame = YAWN[t % 8];
  }

  grave(ctx, l.holeX, holeSize);
  ctx.fillStyle = 'rgba(0,0,0,0.33)';
  ctx.fillRect(l.dx + 9, GROUND, 15, 1);
  ctx.drawImage(digbySprite(s.stage, frame), l.dx, GROUND - 30);
  if (s.stage >= 3) halo(ctx, l.dx + LANTERN_AT.x, GROUND - 30 + LANTERN_AT.y, 12, 0.26 + 0.05 * ((t >> 1) % 2));
  if (coinY !== null) ctx.drawImage(coinSprite(), l.holeX, coinY);
  ghosts(ctx, l, s, t);
  if (bubble) ripBubble(ctx, l.dx + 22, GROUND - 38);
  ctx.restore();
}
