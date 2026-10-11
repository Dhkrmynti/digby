import { AbsoluteFill } from "remotion";
import { fat, G } from "./brand";

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const FLAKES = (() => {
  const r = rng(7);
  return Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: 0.6 + r() ** 2 * 2.6, a: 0.12 + r() * 0.4, v: 0.02 + r() * 0.05, ph: r() * 6.28 }));
})();

/** Water at a given depth (0 = sunlit surface, 1 = trench floor), with marine snow. t in seconds. */
export const Water: React.FC<{ depth?: number; t?: number; shafts?: boolean; w: number; h: number }> = ({ depth = 0.5, t = 0, shafts = false, w, h }) => {
  const stops = [G.surface, G.twilight, G.midnight, G.abyss, G.hadal];
  const i = Math.min(3, Math.floor(depth * 4));
  const top = stops[i];
  const bottom = stops[Math.min(4, i + 1)];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)` }}>
      {shafts ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(104deg, transparent 18%, rgba(214,248,255,0.10) 24%, transparent 31%), linear-gradient(98deg, transparent 44%, rgba(214,248,255,0.08) 50%, transparent 58%), linear-gradient(110deg, transparent 63%, rgba(214,248,255,0.06) 68%, transparent 76%), linear-gradient(180deg, rgba(214,248,255,0.16) 0%, transparent 46%)",
            maskImage: "linear-gradient(180deg, #000 0%, transparent 85%)",
          }}
        />
      ) : null}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} viewBox={`0 0 ${w} ${h}`}>
        {FLAKES.map((f, k) => {
          const y = ((f.y + t * f.v) % 1) * h;
          const x = f.x * w + Math.sin(t / 2.4 + f.ph) * 8;
          return <circle key={k} cx={x} cy={y} r={f.s} fill="#dff3f0" opacity={f.a} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const F = (size: number, color: string = G.foam): React.CSSProperties => ({ fontFamily: fat, fontSize: size, lineHeight: 0.92, letterSpacing: "-0.01em", color, margin: 0 });
