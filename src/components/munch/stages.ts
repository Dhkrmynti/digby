/**
 * MUNCH grows with the real share of supply it has eaten (sent to 0x…dEaD).
 * The thresholds are lore, not tokenomics: tune them here and the whole page follows.
 */
export type StageKey = 'egg' | 'munchlet' | 'chomper' | 'munch';

export interface Stage {
  key: StageKey;
  name: string;
  /** % of total supply eaten where this stage starts */
  from: number;
  /** % where the next stage starts (Infinity for the last) */
  to: number;
  blurb: string;
  says: string;
}

export const STAGES: Stage[] = [
  {
    key: 'egg',
    name: 'egg',
    from: 0,
    to: 0.1,
    blurb: 'Landed at 0x…dEaD and refused to stay dead. It wobbles when a trade comes in.',
    says: '…crk.',
  },
  {
    key: 'munchlet',
    name: 'munchlet',
    from: 0.1,
    to: 1,
    blurb: 'Hatched. Small, round, and already asking for more. Every meal is a little bit of supply gone.',
    says: 'nom?',
  },
  {
    key: 'chomper',
    name: 'chomper',
    from: 1,
    to: 5,
    blurb: 'Horns coming in, teeth already there. Eats faster than you can chart it.',
    says: 'NOM.',
  },
  {
    key: 'munch',
    name: 'MUNCH',
    from: 5,
    to: Infinity,
    blurb: 'Full grown. The mouth is most of it now. Nothing that goes in comes back out.',
    says: 'more.',
  },
];

export function stageIndexFor(pct: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) if (pct >= STAGES[i].from) return i;
  return 0;
}

/** How far through its own stage MUNCH is, 0..1. */
export function stageProgress(pct: number, i: number) {
  const s = STAGES[i];
  if (pct >= s.to) return 1;
  if (pct <= s.from) return 0;
  if (!Number.isFinite(s.to)) return 1;
  return (pct - s.from) / (s.to - s.from);
}

/** Inside the egg stage the shell cracks in three steps, a quarter of the way at a time. */
export const EGG_CRACKS = 3;
export function crackLevel(pct: number) {
  if (stageIndexFor(pct) > 0) return EGG_CRACKS;
  return Math.min(EGG_CRACKS, Math.floor(stageProgress(pct, 0) * (EGG_CRACKS + 1)));
}
/** The share of supply where the next crack (or the hatch) happens. */
export function nextCrackAt(pct: number) {
  const step = STAGES[0].to / (EGG_CRACKS + 1);
  return Math.min(STAGES[0].to, (Math.floor(pct / step) + 1) * step);
}
export const EGG_SAYS = ['…', '…tk.', '…crk.', '…CRK!'];

export const fmtPct = (p: number) => (p > 0 && p < 0.01 ? '<0.01' : (Math.floor(p * 100) / 100).toFixed(2));
