/**
 * Hang On's drawings, ported from hang-on/src/tree/Sloth.tsx and Fire.tsx so the posts match the
 * site: the sloth head, a sloth hanging by both arms, the one asleep in the hammock, the campfire,
 * a bough with leaves, the toucan. `sway` (degrees) replaces the site's CSS swing.
 */
import type { CSSProperties } from "react";
import { C, type } from "./brand";

export type Traits = [fur: number, hat: number, acc: number, bg: number];
const FUR = ["#bfa784", "#93a06a", "#9b9a93", "#7d5d44", "#c98443"];
const INK = C.ink;
const LEAF = C.leaf;
const MANGO = C.mango;
const hasMonocle = (acc: number) => acc === 1 || acc === 4;
const hasMask = (acc: number) => acc === 2 || acc === 5;
const hasGrass = (acc: number) => acc >= 3;
const line = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function mix(a: string, b: string, k: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;
}

/** The ten sloths of the site's canopy, in their coats. */
export const TROOP: Traits[] = [
  [0, 1, 2, 0],
  [1, 0, 1, 0],
  [2, 3, 0, 0],
  [3, 2, 4, 0],
  [4, 4, 3, 0],
  [1, 2, 0, 0],
  [0, 3, 5, 0],
  [4, 0, 1, 0],
  [2, 1, 2, 0],
  [3, 4, 0, 0],
];

export function SlothHead({ traits, asleep = false, startled = false }: { traits: Traits; asleep?: boolean; startled?: boolean }) {
  const [f, hat, acc] = traits;
  const fur = FUR[f] ?? FUR[0];
  const pale = mix(fur, "#fff5df", 0.66);
  const mask = mix(fur, "#1c1712", 0.62);
  return (
    <g>
      <path d="M41 19 l4 -9 l4 8 l4 -9 l4 9 l4 -7 l1 9 Z" fill={fur} {...line} />
      <circle cx="50" cy="53" r="36" fill={fur} {...line} />
      <ellipse cx="50" cy="57" rx="27" ry="24" fill={pale} />
      <path d="M43 49 C 34 45, 23 52, 19 64 C 28 64, 38 60, 45 54 Z" fill={mask} />
      <path d="M57 49 C 66 45, 77 52, 81 64 C 72 64, 62 60, 55 54 Z" fill={mask} />
      {startled
        ? [39, 61].map((x) => (
            <g key={x}>
              <circle cx={x} cy="51" r="5.6" fill="#fffaf0" {...line} strokeWidth={2} />
              <circle cx={x} cy="51" r="1.9" fill={INK} />
            </g>
          ))
        : asleep || hasMask(acc)
          ? [39, 61].map((x) => <path key={x} d={`M${x - 4.5} 51 q4.5 4 9 0`} fill="none" stroke="#fffaf0" strokeWidth="2.2" strokeLinecap="round" />)
          : [39, 61].map((x) => (
              <g key={x}>
                <circle cx={x} cy="51.5" r="3.2" fill={INK} />
                <circle cx={x + 1} cy="50.4" r="1" fill="#fffaf0" />
              </g>
            ))}
      <ellipse cx="50" cy="61" rx="5.2" ry="3.7" fill={mix(mask, "#000000", 0.25)} />
      <path d="M42 67 Q50 73.5 58 67" fill="none" {...line} strokeWidth={2.2} />
      {hasGrass(acc) ? <path d="M56 68.5 C 66 70, 78 66, 88 56" fill="none" stroke={LEAF} strokeWidth="3" strokeLinecap="round" /> : null}
      {hasMonocle(acc) ? (
        <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
          <circle cx="61" cy="51.5" r="8.2" fill="#fffaf0" fillOpacity="0.3" />
          <path d="M67 57.5 C 72 66, 71 76, 66 84" strokeWidth="1.6" />
        </g>
      ) : null}
      {hasMask(acc) ? (
        <g>
          <path d="M22 46 Q50 38 78 46 L78 57 Q50 50 22 57 Z" fill="#35518f" {...line} strokeWidth={2.2} />
          <path d="M35 49.5 q4 3.4 8 0 M57 49.5 q4 3.4 8 0" fill="none" stroke="#fffaf0" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : null}
      {hat === 1 ? (
        <path d="M18 30 C 30 6, 70 4, 86 22 C 70 34, 40 38, 18 30 Z M22 29 C 44 26, 66 22, 84 22" fill={LEAF} {...line} strokeWidth={2.2} fillRule="evenodd" />
      ) : hat === 2 ? (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="27" cy="13" rx="6" ry="9" fill="#d94a3a" {...line} strokeWidth={1.8} transform={`rotate(${a} 27 23)`} />
          ))}
          <circle cx="27" cy="23" r="3.6" fill={MANGO} {...line} strokeWidth={1.6} />
        </g>
      ) : hat === 3 ? (
        <g {...line} strokeWidth={1.8}>
          <path d="M50 18 C 40 4, 28 6, 30 16 C 31 22, 42 22, 50 18 Z" fill="#d8c7a3" />
          <path d="M50 18 C 60 4, 72 6, 70 16 C 69 22, 58 22, 50 18 Z" fill="#d8c7a3" />
          <ellipse cx="50" cy="15" rx="2.4" ry="6" fill="#7d5d44" />
        </g>
      ) : hat === 4 ? (
        <g {...line} strokeWidth={2}>
          <path d="M50 20 V8" fill="none" />
          <path d="M50 9 C 44 0, 34 2, 34 8 C 40 13, 46 12, 50 9 Z" fill="#7fbf5a" />
          <path d="M50 9 C 56 0, 66 2, 66 8 C 60 13, 54 12, 50 9 Z" fill="#7fbf5a" />
        </g>
      ) : null}
    </g>
  );
}

/** A sloth hanging by both arms; the grip is at the top of its 100×156 box. `width` sets its size. */
export function Hanger({ traits, width, sway = 0, startled = false, style }: { traits: Traits; width: number; sway?: number; startled?: boolean; style?: CSSProperties }) {
  const fur = FUR[traits[0]] ?? FUR[0];
  const pale = mix(fur, "#fff5df", 0.6);
  return (
    <svg viewBox="0 0 100 156" width={width} height={(width * 156) / 100} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${sway} 50 3)`}>
        {["M33 78 L27 9", "M67 78 L73 9"].map((d) => (
          <g key={d} fill="none" strokeLinecap="round">
            <path d={d} stroke={INK} strokeWidth="18" />
            <path d={d} stroke={fur} strokeWidth="12.8" />
          </g>
        ))}
        <path d="M20 10 q-1 -10 6 -9 M26 10 q0 -10 6 -8 M67 10 q0 -10 7 -9 M74 10 q1 -10 7 -8" fill="none" {...line} strokeWidth={3} />
        <ellipse cx="50" cy="110" rx="28" ry="35" fill={fur} {...line} />
        <ellipse cx="50" cy="116" rx="16" ry="23" fill={pale} />
        {[33, 67].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="144" rx="10.5" ry="7.5" fill={fur} {...line} />
            <path d={`M${x - 5} 149 v4 M${x} 150 v4 M${x + 5} 149 v4`} fill="none" {...line} strokeWidth={2.2} />
          </g>
        ))}
        <g transform="translate(18 42) scale(0.64)">
          <SlothHead traits={traits} startled={startled} />
        </g>
      </g>
    </svg>
  );
}

/** Asleep in the hammock; 160×132 box, ropes meet the branch at the top. */
export function Hammock({ traits, width, sway = 0, style }: { traits: Traits; width: number; sway?: number; style?: CSSProperties }) {
  const fur = FUR[traits[0]] ?? FUR[0];
  return (
    <svg viewBox="0 0 160 132" width={width} height={(width * 132) / 160} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${sway} 80 2)`}>
        <path d="M14 2 L20 58 M146 2 L140 58" fill="none" {...line} strokeWidth={3} />
        <ellipse cx="94" cy="64" rx="36" ry="15" fill={fur} {...line} />
        <path d="M16 56 Q80 128 144 56 Q80 92 16 56 Z" fill={MANGO} {...line} />
        <path d="M38 76 Q80 106 122 76 M60 98 Q80 104 100 98" fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="2" />
        <g fill="none" strokeLinecap="round">
          <path d="M112 70 C 120 84, 120 98, 116 110" stroke={INK} strokeWidth="15" />
          <path d="M112 70 C 120 84, 120 98, 116 110" stroke={fur} strokeWidth="10" />
        </g>
        <g transform="translate(22 14) scale(0.6)">
          <SlothHead traits={traits} asleep />
        </g>
        <path d="M84 30 l8 0 l-8 9 l8 0 M100 14 l6 0 l-6 7 l6 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** The campfire at the foot of the tree. `flick` (0..1, loops) makes the flames lick; `blaze` grows them. */
export function Campfire({ size, flick = 0, blaze = 1, style }: { size: number; flick?: number; blaze?: number; style?: CSSProperties }) {
  const a = flick * Math.PI * 2;
  const sx = (1 + Math.sin(a * 2) * 0.04) * blaze;
  const sy = (1 + Math.sin(a * 2 + 1.3) * 0.07) * blaze;
  const sk = Math.sin(a) * 4;
  const p = { ...line, strokeWidth: 3 };
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: "visible", ...style }}>
      <g transform={`translate(60 104) skewX(${sk}) scale(${sx} ${sy}) translate(-60 -104)`}>
        <path d="M60 104 C 30 100, 26 70, 40 52 C 42 64, 48 66, 50 58 C 48 40, 56 24, 66 14 C 66 32, 78 38, 82 52 C 86 46, 88 40, 86 34 C 100 50, 100 96, 60 104 Z" fill={C.fire} {...p} />
        <path d="M60 102 C 44 98, 42 80, 50 70 C 52 78, 56 80, 58 74 C 58 62, 64 54, 70 48 C 70 60, 78 66, 78 78 C 80 90, 72 100, 60 102 Z" fill={C.mango} />
        <path d="M60 100 C 54 98, 52 90, 56 84 C 58 88, 60 88, 62 84 C 64 90, 66 96, 60 100 Z" fill={C.flame} />
      </g>
      <path d="M18 106 L102 92" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M18 106 L102 92" stroke={C.bark} strokeWidth="8" strokeLinecap="round" />
      <path d="M22 92 L100 108" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M22 92 L100 108" stroke="#8a6644" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** A horizontal bough with leaves along it. */
export function Bough({ width, height = 34, leaves = 5, style }: { width: number; height?: number; leaves?: number; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", width, height, ...style }}>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d="M0 5 Q0 3.4 5 3 L100 0.6 V9.4 L5 7 Q0 6.6 0 5 Z" fill={C.bark} stroke={INK} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: leaves }, (_, i) => (
        <svg key={i} viewBox="0 0 60 30" width={height * 2.2} height={height * 1.1} style={{ position: "absolute", left: `${4 + (i * 90) / leaves}%`, top: -height * 0.7, rotate: `${[-28, 22, -14, 30, -20, 16][i % 6]}deg` }}>
          <path d="M2 15 C 16 0, 44 0, 58 15 C 44 30, 16 30, 2 15 Z" fill={i % 2 ? LEAF : C.leafL} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M6 15 H54" stroke={INK} strokeOpacity="0.5" strokeWidth="1.8" />
        </svg>
      ))}
    </div>
  );
}

/** The toucan on its perch (96×78 box). */
export function Toucan({ width, style }: { width: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 96 78" width={width} height={(width * 78) / 96} style={{ overflow: "visible", ...style }}>
      <path d="M96 62 H40" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M96 62 H42" stroke={C.bark} strokeWidth="6" strokeLinecap="round" />
      <path d="M64 50 L84 70 L74 52 Z" fill={INK} />
      <ellipse cx="56" cy="40" rx="15" ry="19" fill={INK} />
      <ellipse cx="50" cy="38" rx="8" ry="12" fill="#fffaf0" />
      <circle cx="50" cy="20" r="11" fill={INK} />
      <path d="M42 15 C 24 10, 6 16, 2 30 C 16 30, 32 30, 43 26 Z" fill={MANGO} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M12 21 C 6 23, 3 26, 2 30 C 8 30, 12 30, 16 29.5 Z" fill={C.red} />
      <circle cx="49" cy="18" r="4" fill="#fffaf0" />
      <circle cx="48.4" cy="18" r="1.7" fill={INK} />
      <path d="M52 58 v5 M58 58 v5" stroke={MANGO} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** The trunk at an edge: bark with grooves. */
export const Trunk: React.FC<{ width: number; side?: "l" | "r" }> = ({ width, side = "r" }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      [side === "r" ? "right" : "left"]: 0,
      width,
      background: `repeating-linear-gradient(90deg, ${C.bark} 0 26px, #6b4e33 26px 30px, ${C.bark} 30px 54px)`,
      borderLeft: side === "r" ? `5px solid ${INK}` : undefined,
      borderRight: side === "l" ? `5px solid ${INK}` : undefined,
    }}
  />
);

/** A small typewriter label chip. */
export const chip = (size: number, bg: string = C.mango, color: string = C.ink): CSSProperties => ({
  display: "inline-block",
  margin: 0,
  padding: `${size * 0.28}px ${size * 0.6}px`,
  background: bg,
  color,
  border: `3px solid ${INK}`,
  fontFamily: type,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});
