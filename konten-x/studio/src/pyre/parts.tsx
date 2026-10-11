import { AbsoluteFill } from "remotion";
import { body, heavy, mono, P } from "./brand";

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const TONGUES = (() => {
  const r = rng(11);
  return Array.from({ length: 200 }, () => ({ x: Math.min(0.88, Math.max(0.12, 0.5 + ((r() + r() + r()) / 3 - 0.5) * 1.05)), ph: r(), sp: 0.6 + r() * 0.8, s: 0.6 + r() * 0.8 }));
})();
const BLOTS = (() => {
  const r = rng(3);
  return Array.from({ length: 40 }, () => ({ x: r(), y: r(), s: 0.08 + r() * 0.25, a: 0.15 + r() * 0.25 }));
})();
const SPARKS = (() => {
  const r = rng(5);
  return Array.from({ length: 60 }, () => ({ x: r(), y: r(), v: 0.04 + r() * 0.08, s: 1 + r() * 2.4 }));
})();

/** The cave: dark rock, firelight from (lx, ly), sparks rising. t in seconds. */
export const Cave: React.FC<{ w: number; h: number; t?: number; lx?: number; ly?: number; light?: number }> = ({ w, h, t = 0, lx = 0.6, ly = 0.85, light = 1 }) => (
  <AbsoluteFill style={{ background: P.cave }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
      {BLOTS.map((b, i) => (
        <circle key={i} cx={b.x * w} cy={b.y * h} r={b.s * Math.max(w, h)} fill={`rgba(70,50,36,${b.a})`} style={{ filter: "blur(30px)" }} />
      ))}
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(${60 * light}% ${70 * light}% at ${lx * 100}% ${ly * 100}%, rgba(255,150,60,${0.32 * light}), rgba(255,100,30,${0.1 * light}) 45%, transparent 75%)` }} />
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
      {SPARKS.map((p, i) => {
        const y = (((p.y - t * p.v) % 1) + 1) % 1;
        return <circle key={i} cx={p.x * w + Math.sin(t * 1.5 + i) * 10} cy={y * h} r={p.s * 0.7} fill="#ff9a40" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 4 + i))} />;
      })}
    </svg>
  </AbsoluteFill>
);

/** Deterministic fire along the bottom of a w×h box. */
export const Flames: React.FC<{ w: number; h: number; t: number; heat?: number }> = ({ w, h, t, heat = 0.8 }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, bottom: 0, filter: "blur(3px)" }}>
    {TONGUES.map((g, i) => {
      const life = (t * g.sp + g.ph) % 1;
      const reach = h * (0.22 + heat * 0.6) * Math.max(0.18, 1 - Math.abs(g.x - 0.5) * 2.1);
      const y = h + 10 - life * reach;
      const x = g.x * w + Math.sin(t * 3 + i) * 8;
      const r = (22 + g.s * 30) * (1 - life * 0.55);
      const col = life < 0.2 ? `rgba(255,232,150,${0.85 - life})` : life < 0.5 ? `rgba(255,150,40,${0.7 - life * 0.4})` : life < 0.8 ? `rgba(232,62,20,${0.55 - life * 0.3})` : `rgba(30,20,14,${(1 - life) * 0.3})`;
      return <path key={i} d={`M${x} ${y - r * 2.2} Q${x + r} ${y - r * 0.4} ${x} ${y + r} Q${x - r} ${y - r * 0.4} ${x} ${y - r * 2.2} Z`} fill={col} />;
    })}
  </svg>
);

/** Logs and stones under the fire, w wide. */
export const Logs: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.375} viewBox="0 0 400 150" style={{ display: "block" }}>
    <ellipse cx="200" cy="120" rx="190" ry="26" fill="#0b0806" opacity="0.7" />
    <g stroke="#0b0806" strokeWidth="4" strokeLinejoin="round">
      <path d="M70 118 L300 52 Q316 48 320 62 Q322 76 306 80 L80 140 Q62 142 60 128 Q60 120 70 118 Z" fill="#4a2e1a" />
      <path d="M330 118 L100 52 Q84 48 80 62 Q78 76 94 80 L320 140 Q338 142 340 128 Q340 120 330 118 Z" fill="#5a3a22" />
      <ellipse cx="316" cy="65" rx="10" ry="13" fill="#c8642c" />
      <ellipse cx="84" cy="65" rx="10" ry="13" fill="#c8642c" />
    </g>
    <ellipse cx="200" cy="96" rx="80" ry="16" fill="#ff5a1f" opacity="0.85" />
    <ellipse cx="200" cy="94" rx="46" ry="8" fill="#ffd68a" />
    {[30, 80, 140, 200, 260, 320, 370].map((x, i) => (
      <ellipse key={x} cx={x} cy={134 + (i % 2) * 6} rx={22 + (i % 3) * 4} ry="13" fill="#3a2c22" stroke="#0b0806" strokeWidth="3.5" />
    ))}
  </svg>
);

/** A bonfire of width w with its fire, bottom-anchored at (x, y). */
export const Bonfire: React.FC<{ x: number; y: number; w: number; t: number; heat?: number }> = ({ x, y, w, t, heat = 0.8 }) => (
  <div style={{ position: "absolute", left: x, top: y - w * 0.375, width: w }}>
    <div style={{ position: "absolute", left: -w * 0.25, bottom: w * 0.15, width: w * 1.5, height: w * 1.3 }}>
      <Flames w={w * 1.5} h={w * 1.3} t={t} heat={heat} />
    </div>
    <div style={{ position: "relative" }}>
      <Logs w={w} />
    </div>
  </div>
);

export const H = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: heavy, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color, margin: 0 });
export const T = (size: number, color: string = P.boneDim): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.45, color, margin: 0 });
export const M = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: mono, fontSize: size, color, margin: 0 });
