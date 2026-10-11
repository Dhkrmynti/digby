import { AbsoluteFill } from "remotion";
import { Pyre } from "./Pyre";
import { Flames, Logs } from "./parts";

/* The circle, for renders: everything is a pure function of t (seconds). */

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const STARS = (() => {
  const r = rng(42);
  return Array.from({ length: 160 }, () => ({ x: r(), y: r() * 0.55, s: 0.6 + r() ** 3 * 2.2, ph: r() * 6.28, o: 0.35 + r() * 0.6 }));
})();

/** night clearing: sky, stars, moon, treeline, earth. horizon at `hz` (0–1). */
export const Night: React.FC<{ w: number; h: number; t: number; hz?: number; moon?: [number, number] | null; glow?: number }> = ({ w, h, t, hz = 0.6, moon = [0.86, 0.24], glow = 1 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg,#07060f 0%,#120b1c ${hz * 60}%,#2a1414 ${hz * 92}%,#4a2412 ${hz * 100}%,#160d08 ${hz * 100 + 1}%,#0d0805 100%)` }} />
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x * w} cy={s.y * h * hz * 1.6} r={s.s * Math.max(1, w / 1600)} fill="#fff4dc" opacity={s.o * (0.55 + 0.45 * Math.sin(t * 1.7 + s.ph))} />
      ))}
    </svg>
    {moon ? (
      <div style={{ position: "absolute", left: moon[0] * w, top: moon[1] * h, width: Math.min(w, h) * 0.09, height: Math.min(w, h) * 0.09, borderRadius: "50%", background: "radial-gradient(circle at 38% 35%,#fff6e0,#f0d9b0 60%,#c9a676)", opacity: 0.82, boxShadow: "0 0 60px 18px rgba(255,230,180,0.12)" }} />
    ) : null}
    <div style={{ position: "absolute", left: 0, right: 0, top: (hz - 0.16) * h, height: 0.3 * h, background: `radial-gradient(60% 100% at 50% 100%, rgba(255,120,40,${0.3 * glow}), transparent 70%)` }} />
    <svg width={w} height={h * 0.17} viewBox="0 0 1200 160" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: (hz - 0.13) * h }}>
      <path d="M0 160 L0 92 C40 70 70 96 100 74 C130 50 160 82 200 64 C240 44 260 78 300 70 C340 60 360 30 400 48 C440 66 470 40 510 56 C550 72 570 52 610 60 C650 70 680 36 720 50 C760 64 790 44 830 58 C870 72 900 40 940 54 C980 70 1010 46 1050 60 C1090 74 1130 52 1200 66 L1200 160 Z" fill="#1a0f12" />
      <path d="M0 160 L0 116 C50 98 80 120 130 104 C170 92 200 112 250 100 C300 88 330 108 380 98 C430 88 450 110 500 102 C560 92 600 114 650 104 C700 94 740 112 790 100 C840 90 870 112 920 104 C970 96 1010 114 1060 102 C1110 92 1150 108 1200 100 L1200 160 Z" fill="#0f0909" />
    </svg>
  </AbsoluteFill>
);

export const TROOP = [
  { warm: 0, light: 1, size: 1, torch: true },
  { warm: 0.35, light: 0.92, size: 0.94, torch: false },
  { warm: 0.1, light: 1.08, size: 1.04, torch: false },
  { warm: 0.55, light: 0.86, size: 0.9, torch: false },
  { warm: 0.2, light: 1.14, size: 0.98, torch: true },
  { warm: 0.45, light: 0.96, size: 1.06, torch: false },
  { warm: 0.65, light: 0.9, size: 0.92, torch: false },
  { warm: 0.05, light: 1.02, size: 1, torch: false },
];

interface CircleProps {
  w: number;
  h: number;
  t: number;
  /** ring centre (px) and radii (px) */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** ape width at the front (px) */
  ape: number;
  /** fire width (px) */
  fire: number;
  heat?: number;
  n?: number;
  /** laps per second */
  lap?: number;
  /** same look for every ape (seamless loops) */
  uniform?: boolean;
  /** extra things drawn in front of the fire (coins, bananas) */
  front?: React.ReactNode;
}

/** The troop dancing round the bonfire, depth-sorted around it. */
export const Circle: React.FC<CircleProps> = ({ t, cx, cy, rx, ry, ape, fire, heat = 0.8, n = 8, lap = 1 / 18, uniform = false, front }) => {
  const apes = Array.from({ length: n }, (_, i) => {
    const m = uniform ? TROOP[0] : TROOP[i % TROOP.length];
    const a = t * lap * Math.PI * 2 + (i / n) * Math.PI * 2;
    const depth = (Math.sin(a) + 1) / 2;
    const hop = Math.abs(Math.sin(t * Math.PI * 2 + i * 1.7)) * ape * 0.05 * (0.5 + depth);
    const s = (0.52 + depth * 0.5) * m.size;
    const lit = depth > 0.5 ? 0.86 - (depth - 0.5) * 0.3 : 1.04 + (0.5 - depth) * 0.1;
    const swing = Math.sin(t * Math.PI * 2 * 1.1 + i) * 12;
    return { i, m, depth, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry - hop, s, lit, swing, tilt: Math.sin(t * Math.PI * 2 + i) * 5 };
  }).sort((p, q) => p.depth - q.depth);

  const renderApe = (p: (typeof apes)[number]) => (
    <div key={p.i} style={{ position: "absolute", left: p.x, top: p.y, width: ape, transform: `translate(-50%, -100%) scale(${p.s}) rotate(${p.tilt}deg)`, transformOrigin: "50% 100%", filter: `sepia(${p.m.warm}) brightness(${p.lit * p.m.light})${p.depth > 0.5 ? " drop-shadow(0 0 10px rgba(255,120,40,0.55))" : ""}` }}>
      <div style={{ position: "absolute", left: "15%", right: "15%", bottom: "-3%", height: "6%", borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(3px)" }} />
      <Pyre still body="full" arms={p.m.torch ? "down" : "up"} hold={p.m.torch ? "torch" : "none"} outfit="fur" armSwing={p.swing} legSwing={p.swing * 0.6} flame={0.7} viewBox="20 40 460 610" className="" />
    </div>
  );

  const fh = fire * 0.375;
  return (
    <>
      {/* firelight on the ground and the worn ring */}
      <div style={{ position: "absolute", left: cx - rx * 1.45, top: cy - ry * 2.2, width: rx * 2.9, height: ry * 4.4, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,130,40,0.42), rgba(255,90,30,0.12) 55%, transparent)" }} />
      <div style={{ position: "absolute", left: cx - rx * 1.05, top: cy - ry * 1.05, width: rx * 2.1, height: ry * 2.1, borderRadius: "50%", border: "3px solid rgba(58,36,24,0.8)" }} />
      {apes.filter((p) => p.depth <= 0.5).map(renderApe)}
      {/* the bonfire */}
      <div style={{ position: "absolute", left: cx - fire / 2, top: cy - fh * 0.85, width: fire }}>
        <div style={{ position: "absolute", left: 0, bottom: fh * 0.35, width: fire, height: fire * 1.3 }}>
          <Flames w={fire} h={fire * 1.3} t={t} heat={heat} />
        </div>
        <div style={{ position: "relative" }}>
          <Logs w={fire} />
        </div>
      </div>
      {front}
      {apes.filter((p) => p.depth > 0.5).map(renderApe)}
    </>
  );
};
