import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { S, wide } from "./brand";

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DISK = (() => {
  const r = rng(21);
  return Array.from({ length: 1100 }, () => ({ a: r() * Math.PI * 2, r: 1.3 + r() ** 1.5 * 2.3, s: 0.8 + r() * 1.6, h: r() }));
})();
const STREAM = (() => {
  const r = rng(33);
  return Array.from({ length: 520 }, () => ({ seed: r(), speed: 0.16 + r() * 0.18, spin: 1.35 + r() * 0.35, s: 1 + r() * 2.2, jitter: (r() - 0.5) * 0.12, out: r() < 0.18 }));
})();
const STARS = (() => {
  const r = rng(44);
  return Array.from({ length: 260 }, () => ({ x: r(), y: r(), m: r() }));
})();

const cache = new Map<string, HTMLCanvasElement>();
const sprite = (rgb: string) => {
  const hit = cache.get(rgb);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.5)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  cache.set(rgb, c);
  return c;
};

/**
 * The same tidal disruption the site draws, driven by time `t` (seconds) so every
 * frame renders the same. `reach` 0..1 drags the sun toward the hole; `swallow`
 * 0..1 takes it across the horizon. `hole` / `sun` place them as fractions of the frame.
 */
export const Tidal: React.FC<{
  width: number;
  height: number;
  t: number;
  reach?: number;
  swallow?: number;
  hole?: [number, number];
  sun?: [number, number];
  scale?: number;
  stars?: boolean;
  jets?: boolean;
}> = ({ width, height, t, reach = 0, swallow = 0, hole = [0.66, 0.46], sun = [0.24, 0.56], scale = 1, stars = true, jets = true }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const w = width;
    const h = height;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, w, h);
    const unit = Math.min(w, h) * scale;
    const R = unit * 0.09;
    const bh = { x: w * hole[0], y: h * hole[1] };
    const TILT = 0.3;
    const HOT = sprite("255,244,214");
    const GOLD = sprite("255,179,71");
    const FLARE = sprite("255,107,44");
    const JET = sprite("143,140,255");
    const dot = (img: HTMLCanvasElement, x: number, y: number, size: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    };

    if (stars) {
      for (const s of STARS) {
        const sx = ((s.x + t * 0.004 * (0.3 + s.m)) % 1) * w;
        const sy = s.y * h;
        const dx = sx - bh.x;
        const dy = sy - bh.y;
        const d = Math.hypot(dx, dy) || 1;
        const push = (R * R * 1.6) / d;
        const lx = sx + (dx / d) * push;
        const ly = sy + (dy / d) * push;
        if (Math.hypot(lx - bh.x, ly - bh.y) < R * 1.05) continue;
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(236,233,246,${0.15 + s.m * 0.55})`;
        const z = s.m > 0.93 ? 2 : 1.2;
        ctx.fillRect(lx, ly, z, z);
      }
    }

    const Rs = unit * 0.14 * (1 - swallow);
    const start = { x: w * sun[0], y: h * sun[1] };
    const sunP = { x: start.x + (bh.x - R * 1.1 - start.x) * reach, y: start.y + (bh.y - start.y) * reach };
    const toBh = Math.atan2(bh.y - sunP.y, bh.x - sunP.x);
    const stretch = 0.12 + reach * 0.4;

    ctx.globalCompositeOperation = "lighter";
    if (jets) {
      for (let i = 0; i < 26; i++) {
        const k = i / 26;
        const flick = 0.5 + 0.5 * Math.sin(t * 7 + i);
        for (const dir of [-1, 1]) dot(JET, bh.x + Math.sin(t * 2 + i) * R * 0.08 * k, bh.y + dir * (R * 1.1 + k * R * 5.5), R * (0.5 + k * 0.9), (1 - k) * 0.22 * flick);
      }
    }

    const tip = { x: sunP.x + Math.cos(toBh) * Rs * (1 + stretch), y: sunP.y + Math.sin(toBh) * Rs * (1 + stretch) };
    const tail = { x: sunP.x - Math.cos(toBh) * Rs * (1 + stretch * 0.6), y: sunP.y - Math.sin(toBh) * Rs * (1 + stretch * 0.6) };
    const startR = Math.hypot(tip.x - bh.x, tip.y - bh.y);
    const startA = Math.atan2(tip.y - bh.y, tip.x - bh.x);
    if (Rs > 1) {
      for (const b of STREAM) {
        const k = (t * b.speed + b.seed) % 1;
        if (b.out) {
          const d = k * unit * 0.6;
          const a = toBh + Math.PI + b.jitter * 2.2;
          dot(JET, tail.x + Math.cos(a) * d, tail.y + Math.sin(a) * d, b.s * (R / 30), (1 - k) * 0.55);
          continue;
        }
        const r = startR + (R * 1.5 - startR) * Math.pow(k, 0.7);
        const a = startA + k * Math.PI * b.spin + b.jitter;
        const flat = 1 - k * (1 - TILT);
        dot(k < 0.35 ? HOT : k < 0.75 ? GOLD : FLARE, bh.x + Math.cos(a) * r, bh.y + Math.sin(a) * r * flat, b.s * (R / 22), 0.85 * (1 - k * 0.35));
      }
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.translate(sunP.x, sunP.y);
      ctx.rotate(toBh);
      ctx.scale(1 + stretch, 1 - stretch * 0.32);
      const corona = ctx.createRadialGradient(0, 0, Rs * 0.8, 0, 0, Rs * 2.2);
      corona.addColorStop(0, "rgba(255,170,70,0.35)");
      corona.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(0, 0, Rs * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      const body = ctx.createRadialGradient(-Rs * 0.25, -Rs * 0.25, Rs * 0.1, 0, 0, Rs);
      body.addColorStop(0, "#fffbe8");
      body.addColorStop(0.45, "#ffd57a");
      body.addColorStop(0.85, "#ff9a3c");
      body.addColorStop(1, "#e8652a");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, 0, Rs, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "lighter";
    }

    const doppler = (a: number) => 1 - Math.cos(a) * 0.55;
    const heat = (m: (typeof DISK)[number]) => {
      const k = Math.max(0, Math.min(1, (3.6 - m.r) / 2.3)) * 0.75 + m.h * 0.25;
      return k > 0.7 ? HOT : k > 0.42 ? GOLD : FLARE;
    };
    const glow = 0.85 + swallow * 0.4;
    const ang = (m: (typeof DISK)[number]) => m.a + t * (0.8 / m.r ** 1.5);
    for (const m of DISK) {
      const a = ang(m);
      if (Math.sin(a) >= 0) continue;
      dot(heat(m), bh.x + Math.cos(a) * m.r * R, bh.y + Math.sin(a) * m.r * R * TILT, m.s * (R / 30), 0.45 * glow * doppler(a));
    }
    for (const m of DISK) {
      const a = ang(m);
      if (Math.sin(a) >= 0) continue;
      const rho = R * (1.06 + (m.r - 1.3) * 0.18);
      const u = Math.cos(a);
      dot(heat(m), bh.x + u * rho, bh.y - Math.sqrt(Math.max(0, rho * rho - (u * rho) ** 2)), m.s * (R / 36), 0.4 * glow * doppler(a));
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const sh = ctx.createRadialGradient(bh.x, bh.y, R * 0.9, bh.x, bh.y, R * 1.04);
    sh.addColorStop(0, "#000");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.arc(bh.x, bh.y, R * 1.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1.5, R * 0.03);
    ctx.strokeStyle = `rgba(255,236,200,${0.5 + glow * 0.3})`;
    ctx.beginPath();
    ctx.arc(bh.x, bh.y, R * 1.035, 0, Math.PI * 2);
    ctx.stroke();
    for (const m of DISK) {
      const a = ang(m);
      if (Math.sin(a) < 0) continue;
      dot(heat(m), bh.x + Math.cos(a) * m.r * R, bh.y + Math.sin(a) * m.r * R * TILT, m.s * (R / 26), 0.7 * glow * doppler(a));
    }
    if (swallow > 0) {
      const f = Math.sin(Math.min(1, swallow) * Math.PI);
      dot(HOT, bh.x, bh.y, R * (3 + f * 5), f * 0.6);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }, [width, height, t, reach, swallow, hole, sun, scale, stars, jets]);
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width, height }} />;
};

export const Space: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(70% 50% at 25% 40%, rgba(255,107,44,0.07) 0%, transparent 70%), radial-gradient(60% 50% at 80% 30%, rgba(143,140,255,0.07) 0%, transparent 70%), ${S.space}`,
    }}
  />
);

export const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <ellipse cx="30" cy="25" rx="16" ry="4.5" fill="none" stroke={S.plasma} strokeWidth="2" />
    <circle cx="30" cy="25" r="8" fill="#000" stroke={S.plasmaHot} strokeWidth="1.8" />
    <path d="M6 32 C12 22, 18 20, 22 23" fill="none" stroke={S.plasma} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="8" cy="31" r="5" fill={S.plasma} />
  </svg>
);

export const W = (size: number, color: string = S.star): React.CSSProperties => ({
  fontFamily: wide,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  color,
  margin: 0,
});
