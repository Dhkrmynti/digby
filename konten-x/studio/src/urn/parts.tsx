/**
 * Urn's drawings, ported from urn/src/skull/Skull.tsx so the posts match the site: the bare skull,
 * a flame, Ash in his urn, a candle, the smoking mark, the velvet wall and the curtains.
 */
import type { CSSProperties } from "react";
import { C, disp, mono } from "./brand";

const INK = C.ink;
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const SKULL = "M50 6 C 76 6, 92 24, 92 46 C 92 60, 86 68, 78 72 L78 84 C 78 90, 74 94, 68 94 L32 94 C 26 94, 22 90, 22 84 L22 72 C 14 68, 8 60, 8 46 C 8 24, 24 6, 50 6 Z";
const URN_BODY = "M96 150 H204 C 204 170, 250 190, 250 250 C 250 310, 214 350, 196 364 H104 C 86 350, 50 310, 50 250 C 50 190, 96 170, 96 150 Z";

export function mix(a: string, b: string, k: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;
}

/** A flame, its base at (x, y). `flick` (0..1) sways it. */
export function Flame({ x, y, s = 1, flick = 0 }: { x: number; y: number; s?: number; flick?: number }) {
  const sway = Math.sin(flick * Math.PI * 2) * 0.08;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 + sway)} ${s * (1 - sway)})`}>
      <path d="M0 0 C -10 -6, -10 -16, -3 -22 C -3 -16, 2 -16, 1 -28 C 10 -20, 12 -7, 0 0 Z" fill={C.ember} {...line} strokeWidth={2.4 / s} />
      <path d="M0 -3 C -4.5 -7, -4.5 -12, 0 -17 C 4.5 -12, 4.5 -7, 0 -3 Z" fill={C.flame} />
    </g>
  );
}

/** The bare skull, face on, in a 100 by 100 box. `fire` (0..1) is how bright the eye flames burn; 0 shows plain glints. */
export function Bare({ fire = 0, flick = 0 }: { fire?: number; flick?: number }) {
  const bone = C.bone;
  const pale = mix(bone, "#ffffff", 0.55);
  const shade = mix(bone, INK, 0.2);
  return (
    <g>
      <path d={SKULL} fill={bone} {...line} />
      <path d="M78 72 C 86 68, 92 60, 92 46 C 92 34, 87 22, 78 14 C 84 26, 86 40, 82 54 C 80 62, 78 66, 78 72 Z" fill={shade} />
      <ellipse cx="33" cy="48" rx="12" ry="13" fill={INK} />
      <ellipse cx="67" cy="48" rx="12" ry="13" fill={INK} />
      {fire > 0 ? (
        [33, 67].map((x) => (
          <g key={x} transform={`translate(${x} 58) scale(${0.6 + fire * 0.5 + Math.sin(flick * Math.PI * 2 + x) * 0.05}) translate(${-x} -58)`}>
            <path d={`M${x} 58 C ${x - 9} 53, ${x - 9} 44, ${x - 3} 39 C ${x - 3} 44, ${x + 2} 44, ${x + 1} 35 C ${x + 9} 41, ${x + 10} 53, ${x} 58 Z`} fill={C.ember} />
            <path d={`M${x} 56 C ${x - 4} 52, ${x - 4} 48, ${x} 44 C ${x + 4} 48, ${x + 4} 52, ${x} 56 Z`} fill={C.flame} />
          </g>
        ))
      ) : (
        <g fill={pale}>
          <circle cx="37" cy="44" r="3.4" />
          <circle cx="71" cy="44" r="3.4" />
        </g>
      )}
      <path d="M50 61 C 47 66, 44 70, 47 71 C 49 71.5, 50 70, 50 70 C 50 70, 51 71.5, 53 71 C 56 70, 53 66, 50 61 Z" fill={INK} />
      <rect x="30" y="76" width="40" height="12" rx="2" fill={pale} {...line} strokeWidth={2.4} />
      <path d="M38 76 V88 M46 76 V88 M54 76 V88 M62 76 V88" fill="none" {...line} strokeWidth={2.4} />
    </g>
  );
}

/**
 * Ash in his urn (300 by 430 box, like the site). `up` (0..1) is how far his skull has risen over
 * the rim, `lid` tips the lid in degrees, `fire` lights his eyes. `id` keeps the clip paths unique.
 */
export function AshUrn({ id, size, up = 1, lid = 0, fire = 1, flick = 0, style }: { id: string; size: number; up?: number; lid?: number; fire?: number; flick?: number; style?: CSSProperties }) {
  const rise = (1 - up) * 150;
  return (
    <svg viewBox="0 -30 300 430" width={size} height={(size * 430) / 300} style={style}>
      <defs>
        <clipPath id={`${id}-above`}>
          <rect x="-200" y="-400" width="700" height="546" />
        </clipPath>
        <clipPath id={`${id}-body`}>
          <path d={URN_BODY} />
        </clipPath>
      </defs>
      {["M58 208 C 16 196, 16 268, 60 274", "M242 208 C 284 196, 284 268, 240 274"].map((d) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke={INK} strokeWidth="17" />
          <path d={d} stroke={C.urnD} strokeWidth="10" />
        </g>
      ))}
      <path d="M100 362 H200 L214 390 H86 Z" fill={C.urnD} {...line} strokeWidth={4} />
      <path d={URN_BODY} fill={C.urn} {...line} strokeWidth={4} />
      <g clipPath={`url(#${id}-body)`}>
        <path d="M204 150 C 204 170, 250 190, 250 250 C 250 310, 214 350, 196 364 H170 C 196 340, 214 300, 214 250 C 214 200, 190 172, 184 150 Z" fill={C.urnD} />
        <rect x="40" y="236" width="220" height="34" fill={C.paper2} />
        <path d="M40 236 H260 M40 270 H260" stroke={INK} strokeWidth="4" />
        <path d="M52 262 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18 l12 -18 l12 18" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <path d="M74 232 C 74 204, 88 188, 102 178" fill="none" stroke={C.paper2} strokeOpacity="0.7" strokeWidth="6" strokeLinecap="round" />
      <g clipPath={`url(#${id}-above)`}>
        <g transform={`translate(0 ${rise})`}>
          <g transform="translate(72 34) scale(1.56)">
            <Bare fire={fire} flick={flick} />
          </g>
          <g transform={`rotate(${-8 + lid} 150 50)`}>
            <path d="M96 62 H204 L196 44 Q150 14 104 44 Z" fill={C.urnD} {...line} strokeWidth={4} />
            <circle cx="150" cy="22" r="10" fill={C.gold} {...line} strokeWidth={3.4} />
          </g>
        </g>
      </g>
      <rect x="86" y="138" width="128" height="20" rx="8" fill={C.urnD} {...line} strokeWidth={4} />
      {[92, 180].map((x) => (
        <g key={x}>
          {[0, 10, 20].map((dx) => (
            <rect key={dx} x={x + dx} y="130" width="9" height="26" rx="4.5" fill={C.bone} {...line} strokeWidth={2.6} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function Candle({ height, flick = 0, style }: { height: number; flick?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 -40 60 340" width={(height * 60) / 340} height={height} style={style}>
      <path d="M30 96 V280" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M30 96 V280" stroke={C.gold} strokeWidth="4" strokeLinecap="round" />
      <path d="M8 296 H52 L44 278 H16 Z" fill={C.gold} {...line} />
      <path d="M10 96 H50 L44 84 H16 Z" fill={C.gold} {...line} />
      <rect x="20" y="28" width="20" height="56" rx="3" fill={C.paper2} {...line} />
      <Flame x={30} y={30} s={1.3} flick={flick} />
    </svg>
  );
}

/**
 * The mark: Ash with a smoke, in a 120 box (same drawing as the site's logo). `t` (0..1, loops)
 * drives the smoke puffs rising off the tip and the ember's glow; `puffs` adds drifting rings.
 */
export function SmokingSkull({ size, t = 0, disc = true, puffs = false }: { size: number; t?: number; disc?: boolean; puffs?: boolean }) {
  const bone = C.bone;
  const pale = mix(bone, "#ffffff", 0.55);
  const shade = mix(bone, INK, 0.2);
  const glow = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
  const wave = Math.sin(t * Math.PI * 2);
  const smoke = `M96 78 C ${87 + wave * 2} 68, ${106 - wave * 2} 62, 98 52 C ${91 + wave * 2} 43, ${106 - wave * 2} 38, ${100 + wave} 28`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: "visible" }}>
      {disc ? <circle cx="60" cy="60" r="55" fill={C.flame} stroke={INK} strokeWidth="6" /> : null}
      {puffs
        ? [0, 1, 2].map((i) => {
            const k = (t + i / 3) % 1;
            return <circle key={i} cx={100 + Math.sin((k + i) * 6) * 4 + k * 6} cy={26 - k * 34} r={4 + k * 9} fill="none" stroke={C.paper2} strokeWidth={3.4 * (1 - k)} opacity={1 - k} />;
          })
        : null}
      <g transform="translate(15 32) scale(0.72)">
        <path d={SKULL} fill={bone} {...line} strokeWidth={4} />
        <path d="M78 72 C 86 68, 92 60, 92 46 C 92 34, 87 22, 78 14 C 84 26, 86 40, 82 54 C 80 62, 78 66, 78 72 Z" fill={shade} />
        {[33, 67].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="49" rx="12.5" ry="12" fill={INK} />
            <path d={`M${x - 14} 49 Q ${x} 43 ${x + 14} 49 V 34 H ${x - 14} Z`} fill={bone} />
            <path d={`M${x - 12.5} 48.5 Q ${x} 43.5 ${x + 12.5} 48.5`} fill="none" {...line} strokeWidth={3.4} />
            <circle cx={x + 3} cy="53" r="3.4" fill={C.ember} />
          </g>
        ))}
        <path d="M50 61 C 47 66, 44 70, 47 71 C 49 71.5, 50 70, 50 70 C 50 70, 51 71.5, 53 71 C 56 70, 53 66, 50 61 Z" fill={INK} />
        <rect x="30" y="76" width="40" height="12" rx="2" fill={pale} {...line} strokeWidth={3} />
        <path d="M38 76 V88 M46 76 V88 M54 76 V88 M62 76 V88" fill="none" {...line} strokeWidth={3} />
        <g transform="translate(60 83) rotate(-16)">
          <rect x="0" y="-5" width="13" height="10" rx="1.5" fill={C.gold} {...line} strokeWidth={3} />
          <rect x="13" y="-5" width="34" height="10" fill={C.paper2} {...line} strokeWidth={3} />
          <rect x="47" y="-5" width="8" height="10" rx="2" fill={mix(C.ember, C.flame, glow * 0.7)} {...line} strokeWidth={3} />
          <circle cx="53" cy="-1" r={1.8 + glow * 1.2} fill={C.flame} />
        </g>
        <g transform="rotate(-12 50 10)">
          <path d="M20 16 H80 L76 6 Q50 -9 24 6 Z" fill={C.urn} {...line} strokeWidth={3.6} />
          <path d="M28 8 Q50 -3 72 8" fill="none" stroke={C.paper2} strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="-7" r="6.5" fill={C.gold} {...line} strokeWidth={3} />
        </g>
      </g>
      <g fill="none" strokeLinecap="round">
        <path d={smoke} stroke={INK} strokeWidth="8" />
        <path d={smoke} stroke={C.paper2} strokeWidth="4.2" />
      </g>
    </svg>
  );
}

/** The plum chapel wall with its stripes. */
export const Velvet: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(90deg, ${C.plum} 0 46px, ${C.plum2} 46px 92px)`, ...style }} />
);

/** One velvet curtain. `side` is which edge it hangs from; `open` (0..1) pulls it aside. */
export function Drape({ side, open, width, height }: { side: "l" | "r"; open: number; width: number; height: number }) {
  const x = side === "l" ? -open * width * 0.86 : open * width * 0.86;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [side === "l" ? "left" : "right"]: 0,
        width,
        height,
        transform: `translateX(${x}px)`,
        background: `repeating-linear-gradient(90deg, ${C.velvetD} 0 18px, ${C.velvet} 18px 52px, ${C.velvetL} 52px 64px, ${C.velvet} 64px 90px)`,
        borderLeft: side === "r" ? `6px solid ${INK}` : undefined,
        borderRight: side === "l" ? `6px solid ${INK}` : undefined,
      }}
    />
  );
}

/** The scalloped valance along the top. */
export function Valance({ width }: { width: number }) {
  const n = Math.ceil(width / 60);
  return (
    <svg width={width} height={70} viewBox={`0 0 ${width} 70`} style={{ position: "absolute", top: 0, left: 0 }}>
      <rect width={width} height={34} fill={C.velvetD} />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={i * 60 + 30} cy={34} r={30} fill={C.velvetD} />
      ))}
      <rect y={30} width={width} height={6} fill={C.gold} opacity={0.9} />
    </svg>
  );
}

/** The felt letter board the headline hangs on. */
export function Board({ text, size, style }: { text: string; size: number; style?: CSSProperties }) {
  return (
    <div style={{ background: C.coal, border: `${Math.round(size / 9)}px solid ${C.wood}`, outline: `5px solid ${INK}`, padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.22}px`, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 ${size * 0.32}px, rgba(255,255,255,0.07) ${size * 0.32}px ${size * 0.34}px)`, ...style }}>
      <p style={{ margin: 0, fontFamily: disp, fontWeight: 900, fontSize: size, lineHeight: 1, color: C.paper2, whiteSpace: "nowrap" }}>{text}</p>
    </div>
  );
}

/** A small mono label chip. */
export const chip = (size: number, bg: string = C.ember, color: string = C.ink): CSSProperties => ({
  display: "inline-block",
  margin: 0,
  padding: `${size * 0.3}px ${size * 0.6}px`,
  background: bg,
  color,
  border: `3px solid ${INK}`,
  fontFamily: mono,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});
