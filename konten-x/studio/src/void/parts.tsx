import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { display, hand, V } from "./brand";

/* Seeded random so every frame renders the same particles. */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Mote {
  a: number;
  r: number;
  s: number;
  h: number;
  w: number;
}
const MOTES: Mote[] = (() => {
  const r = rng(7);
  return Array.from({ length: 1400 }, () => ({ a: r() * Math.PI * 2, r: 1.5 + r() ** 1.6 * 2.6, s: 0.9 + r() * 1.9, h: r(), w: r() }));
})();
const STARS = (() => {
  const r = rng(11);
  return Array.from({ length: 260 }, () => ({ x: r(), y: r(), m: r() }));
})();

const spriteCache = new Map<string, HTMLCanvasElement>();
const sprite = (rgb: string) => {
  const hit = spriteCache.get(rgb);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  spriteCache.set(rgb, c);
  return c;
};

/**
 * dEaD-1, the same black hole the site draws, but driven by the frame number so
 * renders are deterministic. `t` is seconds; `glow` 0..1.4; `feed` pulls matter in.
 */
export const VoidHole: React.FC<{ width: number; height: number; t: number; shadow?: number; glow?: number; feed?: number; stars?: boolean; style?: React.CSSProperties }> = ({
  width,
  height,
  t,
  shadow = 0.27,
  glow = 0.9,
  feed = 0,
  stars = true,
  style,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = width;
    const h = height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * shadow;
    const TILT = 0.24;
    const HOT = sprite("255,234,190");
    const MID = sprite("255,170,64");
    const COOL = sprite("214,96,38");

    if (stars) {
      for (const s of STARS) {
        const sx = ((s.x + t * 0.004 * (0.3 + s.m)) % 1) * w;
        const sy = s.y * h;
        const dx = sx - cx;
        const dy = sy - cy;
        const d = Math.hypot(dx, dy) || 1;
        const push = (R * R * 1.4) / d;
        const lx = sx + (dx / d) * push;
        const ly = sy + (dy / d) * push;
        if (Math.hypot(lx - cx, ly - cy) < R * 1.05) continue;
        ctx.fillStyle = `rgba(211,219,236,${0.18 + s.m * 0.5})`;
        const z = s.m > 0.92 ? 2 : 1.2;
        ctx.fillRect(lx, ly, z, z);
      }
    }

    // matter: angle advances with time (Kepler-ish), radius shrinks while feeding
    const at = (m: Mote) => {
      const r = Math.max(1.08, m.r - feed * ((t * 0.35 + m.w) % 1) * 1.6);
      const a = m.a + t * (0.9 / r ** 1.5) * (1 + feed * 1.5);
      return { a, r };
    };
    const heat = (m: Mote, r: number) => {
      const k = Math.max(0, Math.min(1, (4 - r) / 2.6)) * 0.75 + m.h * 0.25;
      return k > 0.72 ? HOT : k > 0.45 ? MID : COOL;
    };
    const dop = (a: number) => 1 - Math.cos(a) * 0.6;
    const dot = (img: HTMLCanvasElement, x: number, y: number, size: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    };
    const scale = R / 120;

    ctx.globalCompositeOperation = "lighter";
    for (const m of MOTES) {
      const { a, r } = at(m);
      if (Math.sin(a) >= 0) continue;
      dot(heat(m, r), cx + Math.cos(a) * r * R, cy + Math.sin(a) * r * R * TILT, m.s * 3.2 * scale, 0.5 * glow * dop(a));
    }
    for (const m of MOTES) {
      const { a, r } = at(m);
      const rho = R * (1.05 + (r - 1.08) * 0.13);
      const u = Math.cos(a);
      const arc = Math.sqrt(Math.max(0, rho * rho - (u * rho) ** 2));
      if (Math.sin(a) < 0) dot(heat(m, r), cx + u * rho, cy - arc, m.s * 2.6 * scale, 0.55 * glow * dop(a));
      else dot(heat(m, r), cx + u * rho, cy + arc * 0.92, m.s * 2 * scale, 0.16 * glow);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const sh = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.04);
    sh.addColorStop(0, "#000");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1.5, R * 0.022);
    ctx.strokeStyle = `rgba(255,214,150,${0.35 + glow * 0.5})`;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.035, 0, Math.PI * 2);
    ctx.stroke();
    const halo = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 1.5);
    halo.addColorStop(0, `rgba(255,173,66,${0.18 * glow})`);
    halo.addColorStop(1, "rgba(255,173,66,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
    ctx.arc(cx, cy, R, 0, Math.PI * 2, true);
    ctx.fill();
    for (const m of MOTES) {
      const { a, r } = at(m);
      if (Math.sin(a) < 0) continue;
      dot(heat(m, r), cx + Math.cos(a) * r * R, cy + Math.sin(a) * r * R * TILT, m.s * 3.5 * scale, 0.75 * glow * dop(a));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }, [width, height, t, shadow, glow, feed, stars]);
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width, height, ...style }} />;
};

/** Control-room night: the ground of everything. */
export const Night: React.FC<{ glow?: number }> = ({ glow = 0.6 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(70% 55% at 50% 40%, rgba(255,173,66,${0.05 + glow * 0.07}) 0%, transparent 65%), radial-gradient(120% 80% at 50% 120%, #0d1530 0%, transparent 60%), ${V.night}`,
    }}
  />
);

/** Strip-chart recorder paper with sprocket holes. */
export const Paper: React.FC<{ width: number | string; height?: number | string; rotate?: number; children?: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({ width, height, rotate = 0, children, style, pad = 44 }) => (
  <div
    style={{
      width,
      height,
      rotate: `${rotate}deg`,
      background: V.paper,
      backgroundImage: `linear-gradient(to right, rgba(224,112,63,0.42) 1px, transparent 1px), linear-gradient(to bottom, rgba(224,112,63,0.42) 1px, transparent 1px), linear-gradient(to right, rgba(224,112,63,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(224,112,63,0.16) 1px, transparent 1px)`,
      backgroundSize: "40px 40px, 40px 40px, 8px 8px, 8px 8px",
      color: V.pen,
      padding: `${pad * 0.7}px ${pad}px`,
      boxShadow: "0 40px 70px -30px rgba(0,0,0,0.85)",
      WebkitMask:
        "radial-gradient(circle at 12px 50%, transparent 5px, #000 5.5px) left / 24px 28px repeat-y, radial-gradient(circle at 12px 50%, transparent 5px, #000 5.5px) right / 24px 28px repeat-y, linear-gradient(#000,#000) center / calc(100% - 48px) 100% no-repeat",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** The observer's red marker. */
export const Note: React.FC<{ children: React.ReactNode; size?: number; rotate?: number; style?: React.CSSProperties }> = ({ children, size = 44, rotate = -2, style }) => (
  <div style={{ fontFamily: hand, fontSize: size, lineHeight: 1, color: V.marker, rotate: `${rotate}deg`, ...style }}>{children}</div>
);

/** V◉ID wordmark: the letters either side of a hole slot. */
export const Wordmark: React.FC<{ size: number; gap: number; color?: string }> = ({ size, gap, color = V.star }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap, fontFamily: display, fontWeight: 900, fontSize: size, lineHeight: 0.86, color, textTransform: "uppercase" }}>
    <span>V</span>
    <span style={{ width: 0 }} />
    <span>ID</span>
  </div>
);

/** The mark: shadow, photon ring, the disk across it. */
export const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <ellipse cx="24" cy="24" rx="22" ry="5.5" fill="none" stroke={V.ring} strokeWidth="2.4" opacity="0.55" />
    <circle cx="24" cy="24" r="12.5" fill="#000" stroke={V.ringHot} strokeWidth="2" />
    <path d="M2 24c0 3 9.8 5.5 22 5.5S46 27 46 24" fill="none" stroke={V.ring} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
