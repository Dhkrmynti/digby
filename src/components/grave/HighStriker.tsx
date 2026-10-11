interface HighStrikerProps {
  /** Coin box fill 0..1 */
  fill: number;
  escrow: number;
  threshold: number;
  nextCycle: 'burn' | 'keep';
  status: string;
  className?: string;
}

const MARKS = [
  { label: 'Bell', at: 100 },
  { label: '¾', at: 75 },
  { label: '½', at: 50 },
  { label: '¼', at: 25 },
];

/**
 * The coin box as a carnival high striker: fees drive the puck up the tower,
 * and when it rings the bell the next ride runs.
 */
export function HighStriker({ fill, escrow, threshold, nextCycle, status, className }: HighStrikerProps) {
  const full = fill >= 0.999;
  const pct = Math.round(fill * 100);
  return (
    <div className={`flex gap-5 ${className ?? ''}`}>
      {/* the tower */}
      <div className="flex w-14 shrink-0 flex-col items-center">
        <span className="bulb h-9 w-9 shrink-0 border-[3px] border-ticket-ink" data-lit={full ? 'true' : 'false'} aria-hidden="true" />
        <div className="relative mt-1 w-full flex-1">
          <div
            className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-ticket-ink bg-plum"
            role="meter"
            aria-label="Coin box fill"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div
              className="absolute inset-x-0 bottom-0 bg-sign transition-[height] duration-[1.2s] ease-[var(--ease-out-expo)]"
              style={{ height: `${pct}%` }}
            />
          </div>
          {MARKS.map((m) => (
            <span
              key={m.label}
              className="absolute left-[calc(50%+0.9rem)] -translate-y-1/2 font-display text-[0.6rem] leading-none text-dust-dim"
              style={{ top: `${100 - m.at}%` }}
              aria-hidden="true"
            >
              {m.label}
            </span>
          ))}
          <div
            className="absolute left-1/2 h-3.5 w-9 -translate-x-1/2 translate-y-1/2 rounded-sm border-[3px] border-ticket-ink bg-bulb transition-[bottom] duration-[1.2s] ease-[var(--ease-out-expo)]"
            style={{ bottom: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-1 h-2.5 w-14 rounded-sm bg-ticket-ink" aria-hidden="true" />
      </div>

      {/* readings */}
      <div className="flex min-w-0 flex-1 flex-col justify-between pl-3">
        <div>
          <p className="m-0 sign-lettering text-[1.6rem] leading-none text-cream">Ring the bell</p>
          <p className="m-0 mt-2 tabular font-display text-[1.3rem] leading-tight text-bulb">{pct}%</p>
          <p className="m-0 tabular font-mono text-[0.9rem] text-cream">
            {escrow.toFixed(4)} <span className="text-dust-dim">/ {threshold ? threshold.toFixed(4) : '—'} ETH</span>
          </p>
        </div>
        <div>
          <p className="m-0 text-[0.92rem] leading-snug text-dust">{status}</p>
          <p className="m-0 mt-2 font-display text-[0.75rem] leading-tight">
            <span className="text-dust-dim">Next ride: </span>
            <span className={nextCycle === 'burn' ? 'text-bulb' : 'text-slime'}>{nextCycle === 'burn' ? 'Burial' : 'Mort’s wages'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
