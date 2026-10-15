import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BLOCK, BRR, BRR_BLINK, Flames, Lava, PICK, SWEAT, Sprite, TORCH } from './sprites';

export interface PitHandle {
  /** Brr throws one $LAVA block into the lava. */
  toss: () => void;
}

const W = 320;
const H = 64;
const LEDGE = 96; // where the ledge ends and the pit begins
const SURFACE = 44; // top of the lava
const HANDS = { x: 56, y: 24 }; // where Brr holds a block before the throw (world units)
const STACK = { x: 12, y: 24 }; // the top block of the stack
const EVERY = 3.6; // seconds between throws while the scene is on screen

const DEBRIS = 26;
const DROPS = 10;
const SMOKE = 5;
const BOOM_COLORS = ['#ffe066', '#ff8a1f', '#d9420f', '#f2b53c', '#fff6c2'];

/**
 * The bottom of the mine: Brr on his ledge, the lava pit beside him, real flames on it.
 * On a loop he grabs a $LAVA block off the stack, throws it, and it blows up in the lava.
 * Drawn on a 320 by 64 pixel grid, pinned left and centred, so phones crop the far side.
 */
export const PitScene = forwardRef<PitHandle, { blaze?: boolean; className?: string }>(function PitScene({ blaze = false, className }, ref) {
  const root = useRef<SVGSVGElement>(null);
  const [blink, setBlink] = useState(false);
  const busy = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !root.current) return;
      // Brr blinks now and then
      const blinkId = window.setInterval(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 160);
      }, 3100);
      // and throws on a loop, but only while the scene is on screen
      let visible = false;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.2 });
      io.observe(root.current);
      const loopId = window.setInterval(() => visible && document.visibilityState === 'visible' && tossRef.current?.(), EVERY * 1000);
      return () => {
        window.clearInterval(blinkId);
        window.clearInterval(loopId);
        io.disconnect();
      };
    },
    { scope: root },
  );

  const toss = contextSafe(() => {
    if (busy.current || !root.current) return;
    const q = gsap.utils.selector(root.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(q('[data-flare]'), { opacity: 1 }, { opacity: 0, duration: 0.6 });
      return;
    }
    busy.current = true;
    const landX = Math.round(gsap.utils.random(150, 250));
    const block = q('[data-thrown]');
    const brr = q('[data-brr]');
    const boom = q('[data-boom]');

    const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });

    // 1. grab: a block hops off the stack into Brr's flippers, he crouches to catch it
    tl.set(block, { opacity: 1, x: STACK.x, y: STACK.y, rotate: 0 })
      .to(block, { x: HANDS.x, duration: 0.35, ease: 'steps(7)' }, 0)
      .to(block, { keyframes: { y: [STACK.y, STACK.y - 9, HANDS.y] }, duration: 0.35, ease: 'none' }, 0)
      .to(brr, { scaleY: 0.86, scaleX: 1.08, svgOrigin: '49 40', duration: 0.12, ease: 'steps(2)' }, 0.25)
      // 2. wind up and throw: the pick swings back, Brr stretches, the block flies in a stepped arc
      .to(q('[data-pick]'), { rotate: 40, svgOrigin: '57 30', duration: 0.15, ease: 'steps(2)' }, 0.45)
      .to(brr, { scaleY: 1.1, scaleX: 0.94, svgOrigin: '49 40', duration: 0.1, ease: 'steps(2)' }, 0.62)
      .to(q('[data-pick]'), { rotate: -60, svgOrigin: '57 30', duration: 0.12, ease: 'steps(3)' }, 0.62)
      .to(block, { x: landX - 4, duration: 0.85, ease: 'steps(20)' }, 0.66)
      .to(block, { y: 8, duration: 0.38, ease: 'power2.out' }, 0.66)
      .to(block, { y: SURFACE - 6, duration: 0.47, ease: 'power2.in' }, 1.04)
      .to(block, { rotate: 360, transformOrigin: '50% 50%', duration: 0.85, ease: 'steps(4)' }, 0.66)
      .to(brr, { scaleY: 1, scaleX: 1, svgOrigin: '49 40', duration: 0.12, ease: 'steps(2)' }, 0.8)
      .to(q('[data-pick]'), { rotate: 0, svgOrigin: '57 30', duration: 0.2, ease: 'steps(3)' }, 0.85)
      .set(block, { opacity: 0 }, 1.51);

    // 3. impact: the block blows up in the lava
    const T = 1.51;
    tl.set(boom, { x: landX, y: SURFACE }, T)
      // the flash: a pixel blob that blooms and is gone
      .fromTo(q('[data-flash]'), { scale: 0, opacity: 1, transformOrigin: '50% 50%' }, { scale: 2, duration: 0.15, ease: 'steps(3)' }, T)
      .to(q('[data-flash]'), { opacity: 0, scale: 2.2, duration: 0.22, ease: 'steps(3)' }, T + 0.18)
      // the shock ring, flattened like it is skating over the lava
      .fromTo(q('[data-ring]'), { attr: { x: -2, y: -1, width: 4, height: 2 }, opacity: 1 }, { attr: { x: -40, y: -12, width: 80, height: 24 }, opacity: 0, duration: 0.55, ease: 'steps(7)' }, T)
      // the whole scene jolts
      .fromTo(q('[data-world]'), { x: 0, y: 0 }, { keyframes: { x: [2, -2, 1, -1, 0], y: [-1, 1, -1, 0, 0] }, duration: 0.32, ease: 'steps(5)' }, T)
      // a fireball rises out of the hole and burns off
      .fromTo(q('[data-fireball]'), { scale: 0.2, y: 0, opacity: 1, transformOrigin: '50% 100%' }, { scale: 1, y: -6, duration: 0.25, ease: 'steps(4)' }, T + 0.05)
      .to(q('[data-fireball]'), { y: -16, scale: 0.6, opacity: 0, duration: 0.6, ease: 'steps(6)' }, T + 0.3)
      // the flames right there flare up and settle
      .fromTo(q('[data-local-flare]'), { opacity: 1, scaleY: 1.4, transformOrigin: '50% 100%' }, { opacity: 0, scaleY: 1, duration: 1.4, ease: 'steps(8)' }, T);

    // debris: chunks of block and fire fly out and fall back in
    q('[data-debris]').forEach((el) => {
      const dx = gsap.utils.random(-44, 44);
      const up = gsap.utils.random(14, 34);
      const dur = gsap.utils.random(0.6, 1);
      tl.fromTo(el, { x: 0, y: 0, opacity: 1, rotate: 0 }, { x: dx, duration: dur, ease: 'none' }, T)
        .to(el, { keyframes: { y: [0, -up, -up * 0.6, 8] }, duration: dur, ease: 'none' }, T)
        .to(el, { rotate: gsap.utils.random([-180, 180]), duration: dur, ease: 'steps(4)' }, T)
        .to(el, { opacity: 0, duration: 0.15, ease: 'steps(2)' }, T + dur - 0.15);
    });
    // lava splashes straight up
    q('[data-drop]').forEach((el) => {
      const dx = gsap.utils.random(-12, 12);
      const up = gsap.utils.random(6, 16);
      tl.fromTo(el, { x: 0, y: 0, opacity: 1 }, { x: dx, duration: 0.7, ease: 'none' }, T + 0.05).to(el, { keyframes: { y: [0, -up, 2] }, opacity: 0, duration: 0.7, ease: 'power1.in' }, T + 0.05);
    });
    // smoke drifts up after
    q('[data-smoke]').forEach((el, i) => {
      tl.fromTo(
        el,
        { x: gsap.utils.random(-8, 8), y: -2, opacity: 0.8, scale: 1, transformOrigin: '50% 50%' },
        { x: `+=${gsap.utils.random(-6, 6)}`, y: -gsap.utils.random(22, 32), opacity: 0, scale: 2.2, duration: 1.5, ease: 'steps(10)' },
        T + 0.15 + i * 0.06,
      );
    });
    // Brr is pleased with himself
    tl.to(brr, { y: -3, duration: 0.12, ease: 'steps(2)', yoyo: true, repeat: 3 }, T + 0.2);
  });

  // the loop above needs the latest toss without re-subscribing
  const tossRef = useRef(toss);
  tossRef.current = toss;

  useImperativeHandle(ref, () => ({ toss }), [toss]);

  return (
    <svg ref={root} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid slice" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect width={W} height={H} fill="#1d1714" />
      <g data-world>
        {/* the cave wall behind */}
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={(i * 37) % W} y={(i * 13) % 40} width={i % 3 ? 6 : 10} height={4} fill={i % 2 ? '#241c18' : '#171210'} />
        ))}
        {/* glow off the lava on the wall */}
        <rect x={LEDGE} y={20} width={W - LEDGE} height={24} fill="#ff8a1f" opacity={blaze ? 0.16 : 0.08} />
        <rect x={LEDGE} y={30} width={W - LEDGE} height={14} fill="#ff8a1f" opacity={blaze ? 0.16 : 0.08} />

        {/* wall torches */}
        <Sprite rows={TORCH} x={24} y={8} />
        <Sprite rows={TORCH} x={300} y={10} />

        {/* the lava and its fire */}
        <Lava x0={LEDGE} x1={W} y={SURFACE} h={H - SURFACE} />
        <Flames x0={LEDGE + 4} x1={W} y={SURFACE} gap={blaze ? 6 : 9} blaze={blaze ? 1.5 : 1} />
        <g data-flare opacity="0">
          <Flames x0={LEDGE + 2} x1={W} y={SURFACE} gap={5} blaze={2.2} seed={9} />
        </g>

        {/* the ledge Brr works from */}
        <rect x={0} y={40} width={LEDGE} height={H - 40} fill="#57534d" />
        <rect x={0} y={40} width={LEDGE} height={3} fill="#7d7871" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={(i * 19) % (LEDGE - 6)} y={45 + ((i * 7) % 16)} width={6} height={3} fill={i % 2 ? '#4a4641' : '#625d57'} />
        ))}
        <rect x={LEDGE - 3} y={40} width={3} height={H - 40} fill="#3a3632" />

        {/* a small stack of $LAVA blocks waiting their turn */}
        <Sprite rows={BLOCK} x={8} y={32} />
        <Sprite rows={BLOCK} x={16} y={32} />
        <Sprite rows={BLOCK} x={STACK.x} y={STACK.y} />

        {/* Brr, drawn half again as big so he reads first; scaled from his feet */}
        <g data-brr>
          <g transform="translate(49 40) scale(1.5) translate(-49 -40)">
            <Sprite rows={blink ? BRR_BLINK : BRR} x={42} y={22} />
            <g className="px-sweat">
              <Sprite rows={SWEAT} x={39} y={24} />
            </g>
            <g data-pick>
              <Sprite rows={PICK} x={55} y={27} />
            </g>
          </g>
        </g>

        {/* the block in flight (its own 0,0 is the block's corner) */}
        <g data-thrown opacity="0">
          <Sprite rows={BLOCK} x={0} y={0} />
        </g>

        {/* the explosion, moved to wherever the block lands */}
        <g data-boom>
          <g data-flash opacity="0">
            <rect x={-6} y={-12} width={12} height={16} fill="#fff6c2" />
            <rect x={-10} y={-8} width={20} height={8} fill="#fff6c2" />
            <rect x={-4} y={-10} width={8} height={12} fill="#ffe066" />
            <rect x={-8} y={-6} width={16} height={4} fill="#ffe066" />
          </g>
          <rect data-ring x={-2} y={-1} width={4} height={2} fill="none" stroke="#ffe066" strokeWidth={1.5} opacity={0} />
          <g data-local-flare opacity="0">
            <Flames x0={-30} x1={30} y={0} gap={4} blaze={2.4} seed={11} />
          </g>
          <g data-fireball opacity="0">
            <rect x={-9} y={-20} width={18} height={20} fill="#d9420f" />
            <rect x={-12} y={-16} width={24} height={12} fill="#d9420f" />
            <rect x={-7} y={-18} width={14} height={16} fill="#ff8a1f" />
            <rect x={-10} y={-14} width={20} height={8} fill="#ff8a1f" />
            <rect x={-4} y={-14} width={8} height={10} fill="#ffe066" />
            <rect x={-6} y={-12} width={12} height={5} fill="#ffe066" />
            <rect x={-2} y={-11} width={4} height={4} fill="#fff6c2" />
          </g>
          {Array.from({ length: SMOKE }, (_, i) => (
            <rect key={`s${i}`} data-smoke x={-2} y={-2} width={4} height={4} fill={i % 2 ? '#4a4641' : '#625d57'} opacity={0} />
          ))}
          {Array.from({ length: DEBRIS }, (_, i) => (
            <rect key={`d${i}`} data-debris x={-1} y={-1} width={i % 4 === 0 ? 3 : 2} height={i % 4 === 0 ? 3 : 2} fill={BOOM_COLORS[i % BOOM_COLORS.length]} opacity={0} />
          ))}
          {Array.from({ length: DROPS }, (_, i) => (
            <rect key={`l${i}`} data-drop x={-1} y={-1} width={2} height={2} fill={i % 2 ? '#d9420f' : '#ff8a1f'} opacity={0} />
          ))}
        </g>
      </g>
    </svg>
  );
});
