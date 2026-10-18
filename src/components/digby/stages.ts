/**
 * Digby levels up with the real share of supply in the ground (sent to 0x…dEaD).
 * The thresholds are lore, not tokenomics: tune them here and the whole page follows.
 */
export interface Stage {
  /** 1–5, the sprite stage */
  n: number;
  name: string;
  /** % of total supply buried where this stage starts */
  from: number;
  /** % where the next stage starts (Infinity for the last) */
  to: number;
  gear: string;
  blurb: string;
}

export const STAGES: Stage[] = [
  { n: 1, name: 'Night Shift', from: 0, to: 0.5, gear: 'wooden shovel, patched robe', blurb: 'New on the job. One wooden shovel, one patched robe, no days off.' },
  { n: 2, name: 'Iron Spade', from: 0.5, to: 1, gear: 'iron spade', blurb: 'The graves got deeper, so the shovel got serious. The patch is gone.' },
  { n: 3, name: 'Lanternbearer', from: 1, to: 2.5, gear: 'the green fee lantern', blurb: 'Carries the fee lantern on his rounds. It glows greener with every trade.' },
  { n: 4, name: 'Keeper', from: 2.5, to: 5, gear: "high-collared keeper's cloak", blurb: 'The yard is his now. The cloak keeps the ghosts from asking questions.' },
  { n: 5, name: 'The Undertaker', from: 5, to: Infinity, gear: 'top hat, gold spade, both eyes lit', blurb: 'Full undertaker. Five percent of the supply is under his feet and he is still digging.' },
];

export function stageIndexFor(pct: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) if (pct >= STAGES[i].from) return i;
  return 0;
}

/** How far through his own stage Digby is, 0..1. */
export function stageProgress(pct: number, i: number) {
  const s = STAGES[i];
  if (pct >= s.to) return 1;
  if (pct <= s.from) return 0;
  if (!Number.isFinite(s.to)) return 1;
  return (pct - s.from) / (s.to - s.from);
}

export const fmtPct = (p: number) => (p > 0 && p < 0.01 ? '<0.01' : (Math.floor(p * 100) / 100).toFixed(2));

/** What Digby mutters when you poke him. */
export const DIGBY_SAYS = [
  'another one for the ground.',
  'no refunds down here.',
  'shift ends never.',
  'dig. drop. pat. repeat.',
  'nothing comes back up.',
  'the lantern is not full yet.',
  'keep trading. i keep digging.',
  'quiet night. good night.',
  'that one was heavy.',
];
