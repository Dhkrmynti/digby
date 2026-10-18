import { useEffect, useRef } from 'react';
import { CARD_H, CARD_W, drawCard, headSprite, type CardArt, type CardOptions } from './canvas';
import { FPS } from './pixels';

/* One shared clock for every animated sprite on the page, so they all step together at 8 fps. */
type Listener = (t: number) => void;
const listeners = new Set<Listener>();
let tick = 0;
let timer: number | null = null;

export function onTick(fn: Listener) {
  listeners.add(fn);
  if (timer === null) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer = window.setInterval(() => {
      tick++;
      listeners.forEach((l) => l(tick));
    }, reduce ? 400 : 1000 / FPS);
  }
  fn(tick);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}
export const currentTick = () => tick;

/** Runs `draw` on the shared clock while the element is on screen. */
export function useSpriteClock(ref: React.RefObject<HTMLElement | null>, draw: (t: number) => void) {
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let off: (() => void) | null = null;
    const start = () => {
      if (!off) off = onTick((t) => drawRef.current(t));
    };
    const stop = () => {
      off?.();
      off = null;
    };
    drawRef.current(tick);
    if (!('IntersectionObserver' in window)) {
      start();
      return stop;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '120px' });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [ref]);
}

interface SpriteCardProps {
  art: CardArt;
  stage?: number;
  /** a live lantern reading, 0–4 */
  level?: number;
  className?: string;
  label: string;
  bare?: CardOptions['bare'];
  locked?: CardOptions['locked'];
}

/** A small framed pixel scene (48×44 art pixels), animated on the shared clock. */
export function SpriteCard({ art, stage = 2, level, className = '', label, bare, locked }: SpriteCardProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useSpriteClock(ref, (t) => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) drawCard(ctx, art, stage, t, level, { bare, locked });
  });
  return <canvas ref={ref} width={CARD_W} height={CARD_H} role="img" aria-label={label} className={`pixelated block aspect-[48/44] max-w-full ${className}`} />;
}

/** Digby's hooded skull: the logo mark. Static. */
export function DigbyMark({ className = '', stage = 3 }: { className?: string; stage?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(headSprite(stage), 0, 0);
  }, [stage]);
  return <canvas ref={ref} width={18} height={16} aria-hidden="true" className={`pixelated block ${className}`} />;
}
