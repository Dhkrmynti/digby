/**
 * Drawing parts for The Sealed Tomb's X content: the Pharaoh's mask (the site's own mascot,
 * sealed-tomb/src/components/Mugshot.tsx, in its gold-nemes-beard form), the limestone
 * pyramid, and the brazier every buyback burns in. All original art.
 */
import type { CSSProperties } from "react";
import { C, body, mono } from "./brand";

const LAPIS = "#2c4a8f";
const LINEN = "#eee9dc";

/** The Pharaoh: a gold mask in a striped nemes with a false beard. */
export function Mask({ size, style, bg = C.ochre, frame = true }: { size: number; style?: CSSProperties; bg?: string | null; frame?: boolean }) {
  const face = "#d6a72e";
  const shade = "#a47a14";
  const line = "#3d2b06";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <defs>
        <clipPath id="tomb-nemes">
          <path d="M50 15 C35 15 27 25 27 40 L21 80 L36 85 L36 60 L64 60 L64 85 L79 80 L73 40 C73 25 65 15 50 15 Z" />
        </clipPath>
      </defs>
      {bg ? <rect width="100" height="100" fill={bg} /> : null}
      <g clipPath="url(#tomb-nemes)">
        <rect width="100" height="100" fill={C.gold} />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x="0" y={14 + i * 5.4} width="100" height="2.7" fill={LAPIS} />
        ))}
      </g>
      <path d="M12 100 C16 84 32 79 50 79 C68 79 84 84 88 100 Z" fill={shade} stroke={line} strokeWidth="1.6" />
      <path d="M43 70 L43 81 C46 83 54 83 57 81 L57 70 Z" fill={shade} />
      <path d="M33 43 C33 29 40 23 50 23 C60 23 67 29 67 43 L67 51 C67 64 60 74 50 74 C40 74 33 64 33 51 Z" fill={face} stroke={line} strokeWidth="1.6" />
      <path d="M50 26 C46 30 45 36 46 41 L54 41 C55 36 54 30 50 26 Z" fill={shade} opacity="0.35" />
      <g fill="none" stroke={line} strokeLinecap="round">
        <path d="M37 42.5 Q42.5 38.8 48 41.6" strokeWidth="2" />
        <path d="M52 41.6 Q57.5 38.8 63 42.5" strokeWidth="2" />
      </g>
      <g fill={LINEN} stroke={line} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M37 47 Q42.5 43.4 48 47 Q42.5 50.2 37 47 Z" />
        <path d="M52 47 Q57.5 43.4 63 47 Q57.5 50.2 52 47 Z" />
      </g>
      <g fill={line}>
        <circle cx="42.5" cy="47" r="2" />
        <circle cx="57.5" cy="47" r="2" />
      </g>
      <g fill="none" stroke={line} strokeWidth="1.3" strokeLinecap="round">
        <path d="M37 47 L33.5 46" />
        <path d="M63 47 L66.5 46" />
        <path d="M50 49 L48.4 58.2 Q50 59.6 51.6 58.2" />
      </g>
      <path d="M44.5 64.2 Q50 61.6 55.5 64.2 Q50 67.4 44.5 64.2 Z" fill={shade} stroke={line} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M46.6 72 L53.4 72 L52.8 88 Q50 90.5 47.2 88 Z" fill={LAPIS} stroke={line} strokeWidth="1.2" strokeLinejoin="round" />
      {[75.5, 79, 82.5, 86].map((y) => (
        <path key={y} d={`M47 ${y} H53`} stroke={C.gold} strokeWidth="1.2" />
      ))}
      <path d="M33 40 C39 36.4 61 36.4 67 40" fill="none" stroke={line} strokeWidth="1.4" />
      {frame ? <rect x="0.8" y="0.8" width="98.4" height="98.4" fill="none" stroke={C.soot} strokeWidth="1.6" /> : null}
    </svg>
  );
}

/**
 * The pyramid, laid in limestone courses. `built` (0..1) is how many courses are set,
 * bottom first; the gold capstone lands last.
 */
export function Pyramid({ width, built = 1, style, night = false }: { width: number; built?: number; style?: CSSProperties; night?: boolean }) {
  const W = 200;
  const H = 120;
  const courses = 16;
  const set = Math.round(built * courses);
  const lit = night ? "#48423a" : C.stoneHi;
  const dark = night ? "#2f2b25" : C.stoneLo;
  const joint = night ? "#1b1916" : C.joint;
  const rows = [];
  for (let i = 0; i < courses; i++) {
    if (i >= set) break;
    const y = H - (i + 1) * (100 / courses);
    const half = (W / 2) * (1 - (i + 1) / (courses + 2.2));
    const prevHalf = (W / 2) * (1 - i / (courses + 2.2));
    const h = 100 / courses;
    rows.push(
      <g key={i}>
        <path d={`M${W / 2 - prevHalf} ${y + h} L${W / 2 - half} ${y} L${W / 2} ${y} L${W / 2} ${y + h} Z`} fill={lit} />
        <path d={`M${W / 2} ${y + h} L${W / 2} ${y} L${W / 2 + half} ${y} L${W / 2 + prevHalf} ${y + h} Z`} fill={dark} />
        <path d={`M${W / 2 - prevHalf} ${y + h} H${W / 2 + prevHalf}`} stroke={joint} strokeWidth="0.5" />
        {Array.from({ length: 6 }, (_, k) => {
          const x = W / 2 - prevHalf + ((k + (i % 2) * 0.5) / 6) * prevHalf * 2;
          return <path key={k} d={`M${x} ${y} V${y + h}`} stroke={joint} strokeWidth="0.35" />;
        })}
      </g>,
    );
  }
  const capY = H - courses * (100 / courses);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} height={(width * H) / W} style={style}>
      {rows}
      {set >= courses ? (
        <g>
          <path d={`M${W / 2 - 11} ${capY} L${W / 2} ${capY - 12} L${W / 2} ${capY} Z`} fill={C.goldHi} />
          <path d={`M${W / 2} ${capY} L${W / 2} ${capY - 12} L${W / 2 + 11} ${capY} Z`} fill={C.gold} />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * The brazier: a stone bowl on a stand with a real fire in it. `t` drives the flicker (any
 * number; whole-number steps loop), `blaze` makes the fire taller.
 */
export function Brazier({ size, t = 0, blaze = 1, style }: { size: number; t?: number; blaze?: number; style?: CSSProperties }) {
  const f = (k: number, a: number) => Math.sin((t + k) * Math.PI * 2) * a;
  const s = blaze;
  return (
    <svg viewBox="0 0 240 300" width={size} height={size * 1.25} style={{ overflow: "visible", ...style }}>
      <g transform={`translate(120 190) scale(${1 + f(0.1, 0.03)} ${s * (1 + f(0.3, 0.06))}) translate(-120 -190)`}>
        <path d={`M120 190 C 66 182, 58 124, 84 92 C 88 112, 98 116, 102 102 C 98 70, ${112 + f(0.2, 4)} 44, ${132 + f(0.5, 5)} 26 C 132 58, 154 70, 160 96 C 168 86, 172 74, 168 62 C 196 92, 196 176, 120 190 Z`} fill={C.ochreLit} stroke={C.soot} strokeWidth="5" strokeLinejoin="round" />
        <path d={`M120 186 C 90 180, 86 148, 100 130 C 104 144, 112 146, 116 136 C 116 114, ${128 + f(0.7, 3)} 100, 138 90 C 138 112, 152 122, 152 144 C 154 166, 140 184, 120 186 Z`} fill={C.torch} />
        <path d="M120 182 C 108 178, 104 164, 112 152 C 116 160, 120 160, 124 152 C 128 164, 132 176, 120 182 Z" fill={C.flame} />
      </g>
      <path d="M40 186 H200 L184 232 H56 Z" fill={C.wood} stroke={C.soot} strokeWidth="6" strokeLinejoin="round" />
      <path d="M56 204 H184" stroke={C.soot} strokeOpacity="0.35" strokeWidth="4" />
      <path d="M100 232 L92 284 H148 L140 232" fill={C.woodHi} stroke={C.soot} strokeWidth="6" strokeLinejoin="round" />
      <path d="M70 290 H170" stroke={C.soot} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

/** One limestone block of $TOMB with its mark cut in. */
export function TombBlock({ size, style }: { size: number; style?: CSSProperties }) {
  return (
    <div style={{ width: size, height: size * 0.62, background: C.stoneHi, border: `${Math.max(3, size / 28)}px solid ${C.soot}`, boxShadow: `inset -${size / 10}px -${size / 12}px 0 ${C.stoneLo}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 600, fontSize: size * 0.2, color: C.ochre, ...style }}>
      $TOMB
    </div>
  );
}

/** A soot-on-limestone label chip. */
export const chip = (fs: number, bg: string = C.soot, fg: string = C.dust): CSSProperties => ({
  display: "inline-block",
  margin: 0,
  padding: `${fs * 0.35}px ${fs * 0.7}px`,
  background: bg,
  color: fg,
  fontFamily: body,
  fontWeight: 800,
  fontSize: fs,
  letterSpacing: "0.02em",
});
