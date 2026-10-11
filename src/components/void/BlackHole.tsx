import { useEffect, useRef, type ReactNode } from 'react';

interface BlackHoleProps {
  /** 0..1 accretion: how full the fee escrow is; the disk and ring brighten with it */
  fill: number;
  /** a feed is running on-chain right now: matter falls in fast */
  feeding?: boolean;
  /** an even orbit: part of the disk is siphoned off as observatory fuel */
  fuel?: boolean;
  /** how much of the canvas the shadow takes, as a fraction of the short side */
  shadow?: number;
  className?: string;
  /** shown inside the shadow */
  children?: ReactNode;
  label?: string;
  /** text sits inside the shadow: dim the near disk where it crosses that text */
  readout?: boolean;
}

interface Mote {
  a: number; // orbital angle
  r: number; // orbital radius, in shadow radii
  s: number; // size
  h: number; // heat 0..1
  jet: number; // >0 while being siphoned off as fuel
}

interface Star {
  x: number;
  y: number;
  m: number;
}

/**
 * dEaD-1, drawn live: a lensed starfield, a tilted accretion disk with its lensed
 * arc wrapping over the shadow, and a photon ring. Plain 2D canvas, additive light.
 */
export function BlackHole({ fill, feeding = false, fuel = false, shadow = 0.2, className = '', children, label, readout = false }: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const props = useRef({ fill, feeding, fuel });
  props.current = { fill, feeding, fuel };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let R = 0;
    let raf = 0;
    let visible = true;
    let t = 0;
    let glow = 0.4;

    const small = window.innerWidth < 700;
    const motes: Mote[] = Array.from({ length: small ? 700 : 1500 }, () => spawnMote(true));
    const stars: Star[] = Array.from({ length: small ? 110 : 220 }, () => ({ x: Math.random(), y: Math.random(), m: Math.random() }));

    function spawnMote(anywhere = false): Mote {
      const r = anywhere ? 1.5 + Math.random() ** 1.6 * 2.6 : 3.4 + Math.random() * 0.8;
      return { a: Math.random() * Math.PI * 2, r, s: 0.9 + Math.random() * 1.9, h: Math.random(), jet: 0 };
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * shadow;
    };

    const TILT = 0.24; // disk tilted toward us

    // soft round sprites, one per heat band, drawn once
    const sprite = (rgb: string) => {
      const c = document.createElement('canvas');
      c.width = c.height = 32;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(0.35, `rgba(${rgb},0.55)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      return c;
    };
    const SPRITES = [sprite('214,96,38'), sprite('255,170,64'), sprite('255,234,190')];
    const FUEL = sprite('92,194,171');

    const dot = (m: Mote, x: number, y: number, alpha: number, scale = 1) => {
      // inner matter runs hotter
      const k = Math.max(0, Math.min(1, (4 - m.r) / 2.6)) * 0.75 + m.h * 0.25;
      const img = k > 0.72 ? SPRITES[2] : k > 0.45 ? SPRITES[1] : SPRITES[0];
      const size = m.s * 3.2 * scale * (R / 120);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    };

    // the approaching (left) side of the disk is Doppler-brightened
    const doppler = (a: number) => 1 - Math.cos(a) * 0.6;

    const frame = (dt: number) => {
      const { fill: f, feeding: fd, fuel: fu } = props.current;
      const target = 0.6 + Math.max(0, Math.min(1, f)) * 0.55 + (fd ? 0.4 : 0);
      glow += (target - glow) * 0.05;
      t += dt;
      const cx = w / 2;
      const cy = h / 2;

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      // stars, pushed outward by the lens
      for (const s of stars) {
        const sx = ((s.x + t * 0.0006 * (0.3 + s.m)) % 1) * w;
        const sy = s.y * h;
        const dx = sx - cx;
        const dy = sy - cy;
        const d = Math.hypot(dx, dy) || 1;
        const push = (R * R * 1.4) / d;
        const lx = sx + (dx / d) * push;
        const ly = sy + (dy / d) * push;
        if (Math.hypot(lx - cx, ly - cy) < R * 1.05) continue;
        ctx.fillStyle = `rgba(211,219,236,${0.18 + s.m * 0.5})`;
        const z = s.m > 0.92 ? 1.6 : 1;
        ctx.fillRect(lx, ly, z, z);
      }

      ctx.globalCompositeOperation = 'lighter';
      const speed = fd ? 2.6 : 1;
      const infall = (fd ? 0.012 : 0.0016) * dt * 60;

      // move matter
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        if (m.jet > 0) {
          m.jet += dt * 0.9;
          if (m.jet > 1) motes[i] = spawnMote();
          continue;
        }
        m.a += (0.9 / m.r ** 1.5) * dt * speed;
        m.r -= infall * (0.4 + Math.random());
        if (m.r < 1.08) motes[i] = spawnMote();
        else if (fu && Math.random() < 0.0009 && m.r > 2.2) m.jet = 0.001;
      }

      // far half of the disk, behind the shadow
      for (const m of motes) {
        if (m.jet > 0 || Math.sin(m.a) >= 0) continue;
        dot(m, cx + Math.cos(m.a) * m.r * R, cy + Math.sin(m.a) * m.r * R * TILT, 0.5 * glow * doppler(m.a));
      }

      // the lens: the far side of the disk bends up over the top of the shadow,
      // and a faint secondary image wraps under the bottom
      for (const m of motes) {
        if (m.jet > 0) continue;
        const rho = R * (1.07 + (m.r - 1.08) * 0.2);
        const u = Math.cos(m.a);
        const x = cx + u * rho;
        const arc = Math.sqrt(Math.max(0, rho * rho - (u * rho) ** 2));
        if (Math.sin(m.a) < 0) dot(m, x, cy - arc, 0.55 * glow * doppler(m.a), 0.8);
        else dot(m, x, cy + arc * 0.92, 0.16 * glow, 0.6);
      }

      // the shadow
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const sh = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.04);
      sh.addColorStop(0, '#000');
      sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
      ctx.fill();

      // photon ring
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = Math.max(1.2, R * 0.022);
      ctx.strokeStyle = `rgba(255,214,150,${0.35 + glow * 0.5})`;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.035, 0, Math.PI * 2);
      ctx.stroke();
      const halo = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 1.5);
      halo.addColorStop(0, `rgba(255,173,66,${0.18 * glow})`);
      halo.addColorStop(1, 'rgba(255,173,66,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 1.0, 0, Math.PI * 2, true);
      ctx.fill();

      // near half of the disk, in front of the shadow
      for (const m of motes) {
        if (m.jet > 0 || Math.sin(m.a) < 0) continue;
        const x = cx + Math.cos(m.a) * m.r * R;
        const y = cy + Math.sin(m.a) * m.r * R * TILT;
        // where the disk passes in front of the readout, let the numbers win
        const overText = readout && Math.abs(x - cx) < R * 0.78 && y < cy + R * 0.62;
        dot(m, x, y, (overText ? 0.18 : 0.7) * glow * doppler(m.a), overText ? 0.8 : 1.1);
      }

      // fuel siphoned off toward the observatory, up and to the right
      for (const m of motes) {
        if (m.jet <= 0) continue;
        const sx = cx + Math.cos(m.a) * m.r * R;
        const sy = cy + Math.sin(m.a) * m.r * R * TILT;
        const size = m.s * 4 * (R / 120);
        ctx.globalAlpha = 0.9 * (1 - m.jet);
        ctx.drawImage(FUEL, sx + (w - sx) * m.jet ** 1.4 - size / 2, sy - sy * m.jet ** 1.1 - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) frame(dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const settle = () => {
      for (let i = 0; i < 90; i++) frame(1 / 60);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) settle();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (reduced) settle();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [shadow, readout]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />
      {children ? <div className="absolute inset-0 grid place-items-center">{children}</div> : null}
    </div>
  );
}
