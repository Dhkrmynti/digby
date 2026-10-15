import { BLOCK, CHEST, ORE, PixelArt } from './sprites';

interface FeeBarProps {
  escrow: number;
  threshold: number;
  fill: number;
  nextCycle: 'burn' | 'keep';
  live: boolean;
  running: boolean;
}

const SEGMENTS = 20;

/**
 * The fee monitor: the Pons fee escrow as a segmented bar. When it fills, Brr runs:
 * odd runs drop $LAVA in the lava, even runs fill the chest.
 */
export function FeeBar({ escrow, threshold, fill, nextCycle, live, running }: FeeBarProps) {
  const lit = Math.round(fill * SEGMENTS);
  const burn = nextCycle === 'burn';
  const status = !live
    ? 'waiting for the contract address'
    : running
      ? burn
        ? 'running: into the lava now'
        : 'running: filling the chest now'
      : fill >= 0.85
        ? 'almost full'
        : 'every trade adds ore';

  return (
    <div className="px-panel p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="pxl text-[0.72rem] text-star-dim">fee escrow</span>
        <span className={`pxl text-[0.72rem] ${running ? 'text-ring-hot' : 'text-star-dim'}`} aria-live="polite">
          {status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <PixelArt rows={ORE} className="h-9 w-9 shrink-0" />
        <div className="flex-1">
          <div
            className="grid h-6 gap-[3px] bg-[#0b0806] p-[3px]"
            style={{ gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))` }}
            role="meter"
            aria-label="Fee escrow toward the next run"
            aria-valuemin={0}
            aria-valuemax={threshold || 1}
            aria-valuenow={escrow}
          >
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                className={i < lit ? (burn ? 'bg-ring' : 'bg-fuel') : 'bg-[#2b221c]'}
                style={i < lit ? { boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.3)' } : undefined}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[0.8rem] tabular text-star">
            <span>{escrow.toFixed(4)} ETH</span>
            <span className="text-star-dim">/ {threshold ? threshold.toFixed(2) : '—'} ETH</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t-[3px] border-[#0b0806] pt-3">
        <PixelArt rows={burn ? BLOCK : CHEST} className="h-8 w-9 shrink-0" />
        <p className="m-0 text-[0.95rem] leading-snug text-star">
          Next run: {burn ? <b className="text-ring">buy $LAVA and drop it in the lava</b> : <b className="text-fuel">fees go in the chest</b>}
          <span className="block text-[0.82rem] text-star-dim">{burn ? 'odd runs burn, at 0.01 ETH' : 'even runs keep, at 0.02 ETH'}</span>
        </p>
      </div>
    </div>
  );
}
