import { AbsoluteFill } from "remotion";
import { B, spell, body, mono } from "./brand";

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const TONGUES = (() => {
  const r = rng(17);
  return Array.from({ length: 160 }, () => ({ x: Math.min(0.9, Math.max(0.1, 0.5 + ((r() + r() + r()) / 3 - 0.5) * 1.2)), ph: r(), sp: 0.7 + r() * 0.8, s: 0.6 + r() * 0.8 }));
})();
const BUBBLES = (() => {
  const r = rng(29);
  return Array.from({ length: 22 }, () => ({ x: r() * 2 - 1, ph: r(), sp: 0.7 + r() * 0.9, s: 0.6 + r() }));
})();
const STEAM = (() => {
  const r = rng(41);
  return Array.from({ length: 14 }, () => ({ x: r() * 2 - 1, ph: r(), sp: 0.18 + r() * 0.2, s: 0.7 + r() * 0.7 }));
})();
const MOTES = (() => {
  const r = rng(53);
  return Array.from({ length: 70 }, () => ({ x: r(), y: r(), v: 0.03 + r() * 0.06, s: 0.8 + r() * 2.2, ember: r() < 0.5, ph: r() * 6 }));
})();

/** witchfire: yellow core, cherry tips. Bottom-anchored in a w×h box. */
export const Witchfire: React.FC<{ w: number; h: number; t: number; heat?: number }> = ({ w, h, t, heat = 0.8 }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, bottom: 0, filter: "blur(2px)", WebkitMaskImage: "radial-gradient(ellipse 48% 70% at 50% 80%, #000 55%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 70% at 50% 80%, #000 55%, transparent 100%)" }}>
    {TONGUES.map((g, i) => {
      const life = (t * g.sp + g.ph) % 1;
      const reach = h * (0.25 + heat * 0.6) * Math.max(0.2, 1 - Math.abs(g.x - 0.5) * 1.9);
      const y = h - life * reach;
      const x = g.x * w + Math.sin(t * 3 + i) * 6;
      const r = Math.min(w, h) * (0.03 + g.s * 0.035) * (1 - life * 0.55);
      const col = life < 0.2 ? `rgba(255,236,170,${0.85 - life})` : life < 0.45 ? `rgba(255,140,40,${0.7 - life * 0.4})` : life < 0.8 ? `rgba(200,50,46,${0.6 - life * 0.3})` : `rgba(40,30,30,${(1 - life) * 0.3})`;
      return <path key={i} d={`M${x} ${y - r * 2.2} Q${x + r} ${y - r * 0.4} ${x} ${y + r} Q${x - r} ${y - r * 0.4} ${x} ${y - r * 2.2} Z`} fill={col} />;
    })}
  </svg>
);

/** The cauldron, w wide, with fire, bubbles and steam driven by t. */
export const Pot: React.FC<{ w: number; t: number; heat?: number; boil?: number }> = ({ w, t, heat = 0.8, boil = 0.7 }) => {
  const h = w * (330 / 400);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* steam */}
      <svg width={w * 1.6} height={w * 1.2} viewBox={`0 0 ${w * 1.6} ${w * 1.2}`} style={{ position: "absolute", left: -w * 0.3, bottom: h * 0.62 }}>
        {STEAM.map((p, i) => {
          const life = (t * p.sp + p.ph) % 1;
          const cx = w * 0.8 + p.x * w * 0.25 + Math.sin(t + i) * 12;
          const cy = w * 1.2 - life * w * 1.1;
          const r = w * 0.09 * p.s * (1 + life * 1.6);
          return <circle key={i} cx={cx} cy={cy} r={r} fill={`rgba(220,90,80,${0.13 * (1 - life)})`} style={{ filter: "blur(10px)" }} />;
        })}
      </svg>
      {/* fire */}
      <div style={{ position: "absolute", left: -w * 0.22, bottom: -w * 0.12, width: w * 1.44, height: w * 1.05 }}>
        <Witchfire w={w * 1.44} h={w * 1.05} t={t} heat={heat} />
      </div>
      <svg viewBox="0 0 400 330" width={w} height={h} style={{ position: "relative" }}>
        <defs>
          <radialGradient id="rb-surface" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#ffc2b6" />
            <stop offset="0.45" stopColor="#c8322e" />
            <stop offset="1" stopColor="#630000" />
          </radialGradient>
          <linearGradient id="rb-copper" x1="0" x2="1">
            <stop offset="0" stopColor="#7a3f18" />
            <stop offset="0.35" stopColor="#c9773a" />
            <stop offset="0.6" stopColor="#e09a5a" />
            <stop offset="1" stopColor="#6a3414" />
          </linearGradient>
        </defs>
        <path d="M110 250 L88 318 M290 250 L312 318 M200 280 L200 322" stroke="#1B1717" strokeWidth="16" strokeLinecap="round" />
        <path d="M64 120 C52 220 120 290 200 290 C280 290 348 220 336 120 Z" fill="url(#rb-copper)" stroke="#1B1717" strokeWidth="6" strokeLinejoin="round" />
        <path d="M96 160 C104 220 140 256 186 266" stroke="#ffd2a0" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M70 168 C130 192 270 192 330 168" stroke="#5a2c10" strokeWidth="6" fill="none" />
        {[96, 148, 200, 252, 304].map((x) => (
          <circle key={x} cx={x} cy={x === 200 ? 186 : x === 148 || x === 252 ? 183 : 176} r="5" fill="#f2c08a" stroke="#1B1717" strokeWidth="2" />
        ))}
        <ellipse cx="200" cy="120" rx="148" ry="34" fill="#1B1717" />
        <ellipse cx="200" cy="122" rx="132" ry="26" fill="url(#rb-surface)" />
        {/* bubbles on the surface */}
        {BUBBLES.map((b, i) => {
          const life = (t * b.sp * (0.6 + boil) + b.ph) % 1;
          if (life > 0.9) return null;
          const bx = 200 + b.x * 110;
          const by = 116 - life * 30 * boil;
          const r = (5 + b.s * 8) * (0.5 + life * 0.7);
          return (
            <g key={i}>
              <circle cx={bx} cy={by} r={r} fill="#c8322e" stroke="#3c0000" strokeWidth="2" />
              <circle cx={bx - r * 0.35} cy={by - r * 0.35} r={r * 0.25} fill="#ffe2d8" />
            </g>
          );
        })}
        <ellipse cx="200" cy="118" rx="150" ry="34" fill="none" stroke="#e09a5a" strokeWidth="10" />
        <ellipse cx="200" cy="118" rx="150" ry="34" fill="none" stroke="#1B1717" strokeWidth="3" />
        <path d="M120 140 C118 160 128 168 128 150 Z M262 146 C260 172 272 178 272 156 Z" fill="#c8322e" />
      </svg>
    </div>
  );
};

/** the cottage: noir walls with firelight, floorboards, round moon window, motes */
export const Cottage: React.FC<{ w: number; h: number; t: number; window?: [number, number, number] | null; floor?: number }> = ({ w, h, t, window: win = null, floor = 0.76 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 66% 80%, #322828 0%, #241e1e 45%, #1B1717 80%)" }}>
    {win ? (
      <div style={{ position: "absolute", left: win[0] * w, top: win[1] * h, width: win[2], height: win[2], borderRadius: "50%", border: `${win[2] * 0.05}px solid #4a2a1e`, background: "radial-gradient(circle at 60% 40%, #2a2222, #120e0e)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "22%", top: "22%", width: "30%", height: "30%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff6e0, #e9d6a8)", boxShadow: "0 0 40px 12px rgba(255,240,200,0.25)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: win[2] * 0.035, transform: "translateX(-50%)", background: "#4a2a1e" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: win[2] * 0.035, transform: "translateY(-50%)", background: "#4a2a1e" }} />
      </div>
    ) : null}
    <div style={{ position: "absolute", left: 0, right: 0, top: floor * h, bottom: 0, background: "repeating-linear-gradient(90deg,#221c1c 0 120px,#1d1818 120px 122px)" }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(48% 40% at 66% 88%, rgba(255,140,50,${0.28 + Math.sin(t * 5) * 0.04}), rgba(255,110,40,0.08) 50%, transparent 75%)` }} />
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
      {MOTES.map((m, i) => {
        const y = (((m.y - t * m.v) % 1) + 1) % 1;
        const tw = 0.4 + Math.abs(Math.sin(t * 3 + m.ph)) * 0.5;
        return <circle key={i} cx={m.x * w + Math.sin(t + m.ph) * 12} cy={y * h} r={m.s} fill={m.ember ? "#ff8c32" : "#EDEBDD"} opacity={tw * (m.ember ? 0.8 : 0.45)} />;
      })}
    </svg>
  </AbsoluteFill>
);

export const S = (size: number, color: string = B.cotton): React.CSSProperties => ({ fontFamily: spell, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, margin: 0 });
export const T = (size: number, color: string = B.cottonDim): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.45, color, margin: 0 });
export const M = (size: number, color: string = B.cotton): React.CSSProperties => ({ fontFamily: mono, fontSize: size, color, margin: 0 });
