import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BURIAL_TICKS, GROUND, VIEW_CROP, VIEW_H, drawScene, layoutFor, sceneCapacity } from './canvas';
import { currentTick, useSpriteClock } from './Sprite';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface GraveyardProps {
  stage: number;
  /** fee lantern fill, 0..1 */
  lantern: number;
  /** burials on record */
  graves: number;
  /** the engine is mid-run */
  digging: boolean;
  /** changes every time a fresh burial lands; Digby then acts the whole burial out */
  burialKey: string | null;
  /** changes when someone pokes Digby */
  pokeKey: number;
  /** scroll the camera down into the ground as the yard leaves the screen */
  descend?: boolean;
  /** clicking Digby himself pokes him; his reply shows in a bubble over his head */
  onPoke?: () => void;
  say?: string;
  className?: string;
  label: string;
}

/** The headstone appears this many ticks into a burial, after the grave is filled. */
const STONE_AT = 25;

/**
 * The live graveyard: Digby, the fee lantern on its post, one headstone per burial and a
 * ghost for each of the latest six. The art is drawn at 96 pixels high and as wide as the
 * box's shape allows, then scaled up whole.
 */
export function Graveyard({ stage, lantern, graves, digging, burialKey, pokeKey, descend = false, onPoke, say, className = '', label }: GraveyardProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [w, setW] = useState(192);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (!r.height) return;
      const next = Math.max(128, Math.min(260, Math.round((VIEW_H * r.width) / r.height / 2) * 2));
      setW(next);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const burialStart = useRef<number | null>(null);
  const lastKey = useRef(burialKey);
  useEffect(() => {
    if (burialKey && burialKey !== lastKey.current) burialStart.current = currentTick();
    lastKey.current = burialKey;
  }, [burialKey]);

  const pokedAt = useRef(-99);
  const firstPoke = useRef(pokeKey);
  useEffect(() => {
    if (pokeKey !== firstPoke.current) pokedAt.current = currentTick();
  }, [pokeKey]);

  const props = useRef({ stage, lantern, graves, digging });
  props.current = { stage, lantern, graves, digging };

  const depth = useRef(0);
  const draw = (t: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = props.current;
    let burial: number | null = null;
    let shown = p.graves;
    let newGraveAt = -999;
    if (burialStart.current !== null) {
      burial = t - burialStart.current;
      if (burial >= BURIAL_TICKS) {
        burialStart.current = null;
        burial = null;
      } else {
        newGraveAt = burialStart.current + STONE_AT;
        // the new headstone only exists once the grave is filled in
        if (burial < STONE_AT) shown = Math.max(0, p.graves - 1);
      }
    }
    drawScene(ctx, canvasRef.current!.width, t, {
      stage: p.stage,
      lantern: p.lantern,
      graves: Math.min(shown, sceneCapacity(canvasRef.current!.width)),
      newGraveAt,
      digging: p.digging,
      burial,
      pokedAt: pokedAt.current,
      depth: depth.current,
      cropTop: VIEW_CROP,
    });
  };
  useSpriteClock(boxRef, draw);

  // The descent: as the yard scrolls away, the camera sinks below the grass, past the coffins,
  // so the page below reads as the ground under the yard. Redrawn on every scroll step, not just on the clock.
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useGSAP(
    () => {
      if (!descend || !boxRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: boxRef.current,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            depth.current = self.progress;
            // once Digby sinks out of reach, his hit area steps aside
            boxRef.current?.toggleAttribute('data-sunk', self.progress > 0.25);
            drawRef.current(currentTick());
          },
        });
        return () => {
          depth.current = 0;
        };
      });
      return () => mm.revert();
    },
    { dependencies: [descend] },
  );

  // Digby's body in view coordinates, as percentages of the box, for the hit area and the bubble
  const dx = layoutFor(w).dx;
  const head = GROUND - 30 + 5 - VIEW_CROP;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div ref={boxRef} className={`group/yard relative ${className}`}>
      <canvas ref={canvasRef} width={w} height={VIEW_H} role="img" aria-label={label} className="pixelated block h-full w-full" />
      {onPoke ? (
        <button
          type="button"
          onClick={onPoke}
          aria-label="Poke Digby"
          title="Poke Digby"
          className="poke-zone absolute cursor-pointer"
          style={{ left: pct(dx + 6, w), top: pct(head - 1, VIEW_H), width: pct(27, w), height: pct(GROUND - VIEW_CROP - head + 1, VIEW_H) }}
        />
      ) : null}
      {say ? (
        <div className="pointer-events-none absolute -translate-y-full" style={{ left: pct(dx + 22, w), top: pct(head - 3, VIEW_H) }}>
          <span key={say + pokeKey} className="speech reink block max-w-[min(15rem,44vw)] whitespace-normal" aria-live="polite">
            {say}
          </span>
        </div>
      ) : null}
    </div>
  );
}
