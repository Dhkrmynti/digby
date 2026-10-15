/**
 * The pit, frame-driven: Brr on his ledge throws a $LAVA block into the lava and it blows up.
 * Drawn in sprite pixels (viewBox 160×100) so every shape stays on the pixel grid.
 * `p` is the place in one throw, 0..1; p = 0 and p = 1 look the same, so a loop is seamless.
 * Everything that runs on `t` repeats every 4 s, so a 4-second GIF loops without a seam.
 */
import type { ReactElement } from "react";
import { BLOCK, BRR, BRR_BLINK, PAL, SWEAT, Sprite, TORCH } from "./sprites";

export const W = 160;
export const H = 100;
const LAVA_Y = 78;
const HAND = { x: 37, y: 44 };
export const IMPACT = { x: 112, y: LAVA_Y };
export const T_THROW = 0.24;
export const T_HIT = 0.47;

const rnd = (n: number) => Math.abs(Math.sin(n * 12.9898 + 4.1) * 43758.5453) % 1;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** A filled pixel disc of radius r centred on (cx, cy). */
function Disc({ cx, cy, r, fill, opacity = 1 }: { cx: number; cy: number; r: number; fill: string; opacity?: number }) {
  if (r < 0.5) return null;
  const rows: ReactElement[] = [];
  const R = Math.round(r);
  for (let y = -R; y <= R; y++) {
    const half = Math.floor(Math.sqrt(Math.max(0, R * R - y * y)));
    if (half <= 0) continue;
    rows.push(<rect key={y} x={Math.round(cx) - half} y={Math.round(cy) + y} width={half * 2} height={1} fill={fill} />);
  }
  return <g opacity={opacity}>{rows}</g>;
}

/** Flame tongues along the lava; `t` flickers them (any number), `blaze` makes them taller. */
export function Flames({ x0, x1, y, t, blaze = 1, seed = 1 }: { x0: number; x1: number; y: number; t: number; blaze?: number; seed?: number }) {
  const out: ReactElement[] = [];
  let x = x0;
  let n = 0;
  while (x < x1) {
    const w = 3 + Math.round(rnd(n + seed) * 4);
    const flick = 0.75 + 0.35 * Math.abs(Math.sin(Math.PI * 2 * t * 1.5 + n * 1.7 + seed));
    const h = Math.max(2, Math.round((4 + rnd(n + 50 + seed) * 9) * blaze * flick));
    out.push(
      <g key={n}>
        <rect x={x} y={y - Math.ceil(h * 0.55)} width={w} height={Math.ceil(h * 0.55)} fill={PAL.r} />
        <rect x={x + 1} y={y - h + 1} width={Math.max(1, w - 2)} height={h - 1} fill={PAL.o} />
        <rect x={x + 1} y={y - Math.ceil(h * 0.4)} width={Math.max(1, w - 2)} height={Math.ceil(h * 0.4)} fill={PAL.y} />
        <rect x={x + Math.floor(w / 2)} y={y - h - 2} width={1} height={2} fill={n % 2 ? PAL.y : PAL.o} />
      </g>,
    );
    x += Math.max(2, Math.round(7 * (0.45 + rnd(n + 3 + seed) * 0.9)));
    n++;
  }
  return <g shapeRendering="crispEdges">{out}</g>;
}

/** The lava pool: layered red with a crust that slides and bubbles that pop. */
export function LavaPool({ x0, x1, y, h, t }: { x0: number; x1: number; y: number; h: number; t: number }) {
  const w = x1 - x0;
  const shift = Math.floor((t * 8) % 8);
  return (
    <g shapeRendering="crispEdges">
      <rect x={x0} y={y} width={w} height={h} fill={PAL.r} />
      <rect x={x0} y={y + 4} width={w} height={h - 4} fill="#b8330b" />
      <rect x={x0} y={y + 10} width={w} height={Math.max(0, h - 10)} fill={PAL.R} />
      {Array.from({ length: Math.ceil(w / 8) + 1 }, (_, i) => {
        const x = x0 + i * 8 + shift - 8;
        return x >= x0 && x < x1 - 4 ? <rect key={i} x={x} y={y} width={i % 3 === 0 ? 5 : 3} height={2} fill={i % 2 ? PAL.y : PAL.o} /> : null;
      })}
      {Array.from({ length: Math.max(2, Math.floor(w / 22)) }, (_, i) => {
        const k = (t * 0.5 + rnd(i + 20)) % 1;
        return <rect key={`b${i}`} x={x0 + 5 + ((i * 22 + rnd(i) * 12) % (w - 8))} y={y + 7 - Math.round(k * 6)} width={2} height={2} fill={PAL.y} opacity={1 - k} />;
      })}
    </g>
  );
}

/** Cave wall: dark stone blocks with mortar lines. */
function Wall() {
  const rows: ReactElement[] = [];
  for (let y = 0; y < H; y += 10) {
    const off = (y / 10) % 2 ? 10 : 0;
    for (let x = -off; x < W; x += 20) {
      const r = rnd(x * 3 + y);
      rows.push(<rect key={`${x}-${y}`} x={x + 1} y={y + 1} width={18} height={8} fill={r > 0.8 ? "#2a221d" : r > 0.4 ? "#231c18" : "#1f1915"} />);
    }
  }
  return (
    <g shapeRendering="crispEdges">
      <rect width={W} height={H} fill="#161210" />
      {rows}
    </g>
  );
}

/**
 * The whole scene. `t` is the free-running clock (seconds) for flicker; `p` is the place in the throw.
 * `throwOn` false shows Brr idle with no block (for stills).
 */
export function PitScene({ p, t, throwOn = true, wall = true }: { p: number; t: number; throwOn?: boolean; wall?: boolean }) {
  // the block: lifted (0–T_THROW), flying (T_THROW–T_HIT), gone after
  const lift = seg(p, 0.04, 0.18);
  const fly = seg(p, T_THROW, T_HIT);
  const flying = throwOn && p >= T_THROW && p < T_HIT;
  const holding = throwOn && p >= 0.04 && p < T_THROW;
  const bx = flying ? lerp(HAND.x, IMPACT.x, fly) : HAND.x;
  const by = flying ? lerp(HAND.y, IMPACT.y - 2, fly) - Math.sin(fly * Math.PI) * 30 : lerp(64, HAND.y, lift);
  const spin = Math.floor(fly * 6) * 90;

  // the blast: 0 at impact, 1 when it has burnt out
  const b = throwOn ? seg(p, T_HIT, 0.86) : 1;
  const blasting = throwOn && p >= T_HIT && p < 0.86;
  const blaze = blasting ? 1 + 1.6 * Math.max(0, 1 - b * 1.6) : 1;

  // Brr: leans back on the wind-up, hops when it lands
  const lean = throwOn && p > 0.16 && p < T_THROW + 0.03 ? -1 : 0;
  const hop = throwOn ? Math.round(Math.sin(seg(p, 0.55, 0.7) * Math.PI) * 4) : 0;
  const blink = (t % 4) > 3.85;

  const debris = Array.from({ length: 22 }, (_, i) => {
    const a = -Math.PI * (0.08 + rnd(i) * 0.84);
    const v = 26 + rnd(i + 9) * 46;
    const tt = b * 1.25;
    const x = IMPACT.x + Math.cos(a) * v * tt;
    const y = IMPACT.y + Math.sin(a) * v * tt + 60 * tt * tt;
    const s = rnd(i + 3) > 0.6 ? 3 : 2;
    const c = i % 4 === 0 ? PAL.a : i % 4 === 1 ? PAL.y : i % 4 === 2 ? PAL.o : PAL.s;
    return y < LAVA_Y + 1 ? <rect key={i} x={Math.round(x)} y={Math.round(y)} width={s} height={s} fill={c} /> : null;
  });
  const smoke = Array.from({ length: 5 }, (_, i) => {
    const k = seg(b, 0.25 + i * 0.06, 1);
    if (k <= 0 || k >= 1) return null;
    return <Disc key={i} cx={IMPACT.x + (i - 2) * 7 + Math.sin(k * 4 + i) * 3} cy={IMPACT.y - 12 - k * 34} r={3 + k * 5} fill={i % 2 ? "#5a514a" : "#463f3a"} opacity={(1 - k) * 0.85} />;
  });

  return (
    <g shapeRendering="crispEdges">
      {wall ? <Wall /> : null}
      {/* torches */}
      <Sprite rows={TORCH} x={8} y={34} />
      <Sprite rows={TORCH} x={150} y={30} />

      {/* the ledge Brr stands on */}
      <rect x={0} y={70} width={64} height={30} fill={PAL.d} />
      <rect x={0} y={70} width={64} height={3} fill={PAL.g} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={4 + i * 10 + (i % 2) * 3} y={78 + (i % 3) * 6} width={4} height={2} fill={PAL.s} />
      ))}
      <rect x={62} y={70} width={2} height={30} fill={PAL.k} />

      {/* the blast glow, then the pool and its flames */}
      {blasting && b < 0.5 ? <Disc cx={IMPACT.x} cy={LAVA_Y - 4} r={34} fill={PAL.o} opacity={(0.5 - b) * 0.35} /> : null}
      <LavaPool x0={64} x1={W} y={LAVA_Y} h={H - LAVA_Y} t={t} />
      <Flames x0={66} x1={W - 2} y={LAVA_Y} t={t} blaze={blaze} />

      {/* Brr */}
      <g transform={`translate(${lean} ${-hop})`}>
        <Sprite rows={blink ? BRR_BLINK : BRR} x={30} y={52} />
        {(t % 4) > 2 ? <Sprite rows={SWEAT} x={45} y={52 + Math.floor((t * 4) % 4)} /> : null}
      </g>

      {/* the $LAVA block */}
      {holding || flying ? (
        <g transform={`rotate(${spin} ${Math.round(bx) + 4} ${Math.round(by) + 4})`}>
          <Sprite rows={BLOCK} x={Math.round(bx)} y={Math.round(by)} />
        </g>
      ) : null}

      {/* the blast */}
      {blasting ? (
        <g>
          {b < 0.12 ? <rect x={0} y={0} width={W} height={H} fill={PAL.y} opacity={(0.12 - b) * 3} /> : null}
          <Disc cx={IMPACT.x} cy={IMPACT.y - 4} r={Math.min(22, 4 + b * 70)} fill={PAL.r} opacity={Math.max(0, 1 - b * 2.2)} />
          <Disc cx={IMPACT.x} cy={IMPACT.y - 4} r={Math.min(16, 3 + b * 55)} fill={PAL.o} opacity={Math.max(0, 1 - b * 2.6)} />
          <Disc cx={IMPACT.x} cy={IMPACT.y - 4} r={Math.max(0, 9 - b * 30)} fill={PAL.y} />
          {debris}
          {smoke}
        </g>
      ) : null}
    </g>
  );
}

/** The scene as a sized <svg>. */
export function Pit({ width, p, t, throwOn = true, wall = true }: { width: number; p: number; t: number; throwOn?: boolean; wall?: boolean }) {
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <PitScene p={p} t={t} throwOn={throwOn} wall={wall} />
    </svg>
  );
}
