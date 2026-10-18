import { useEffect, useState } from 'react';
import { CHOMPER, CHOMPER_BLINK, COLOR, EGG, LCD, eggAt, MUNCHLET, MUNCHLET_BLINK, MUNCH_OPEN, MUNCH_SHUT, MUNCH_SHUT_BLINK, PixelArt } from './sprites';
import type { StageKey } from './stages';

interface PetProps {
  stage: StageKey;
  /** chewing: the mouth works (MUNCH) or the body hops (smaller stages) */
  chewing?: boolean;
  /** printed colours instead of LCD inks */
  color?: boolean;
  pal?: Record<string, string>;
  /** egg only: how far the crack has run, 0..3 */
  crack?: number;
  className?: string;
  title?: string;
}

const FRAMES: Record<StageKey, { idle: string[]; blink: string[]; chew: string[][] }> = {
  egg: { idle: EGG, blink: EGG, chew: [EGG] },
  munchlet: { idle: MUNCHLET, blink: MUNCHLET_BLINK, chew: [MUNCHLET] },
  chomper: { idle: CHOMPER, blink: CHOMPER_BLINK, chew: [CHOMPER] },
  munch: { idle: MUNCH_SHUT, blink: MUNCH_SHUT_BLINK, chew: [MUNCH_OPEN, MUNCH_SHUT] },
};

/**
 * The pet, alive: it blinks every few seconds, and chews (or hops) while it is being fed.
 * Frame swaps are discrete, like a real LCD; the bob is a stepped CSS animation.
 */
export function Pet({ stage, chewing = false, color = false, pal, crack, className = '', title }: PetProps) {
  const egg = stage === 'egg' && crack !== undefined ? eggAt(crack) : null;
  const f = egg ? { idle: egg, blink: egg, chew: [egg] } : FRAMES[stage];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setTick((t) => t + 1), chewing ? 220 : 400);
    return () => window.clearInterval(id);
  }, [chewing]);

  let rows = f.idle;
  if (chewing) rows = f.chew[tick % f.chew.length];
  else if (tick % 11 === 10) rows = f.blink;

  const motion = stage === 'egg' ? (chewing ? 'px-wobble-fast' : 'px-wobble') : chewing && f.chew.length === 1 ? 'px-hop' : 'px-bob';
  return (
    <span className={`inline-block ${motion} ${className}`}>
      <PixelArt rows={rows} pal={pal ?? (color ? COLOR : LCD)} className="block h-full w-full" title={title} />
    </span>
  );
}
