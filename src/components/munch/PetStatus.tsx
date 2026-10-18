import { ScrollText } from 'lucide-react';
import type { FlywheelState, MachineConfig } from '../../types';
import { Pet } from './Pet';
import { HEART, HEART_EMPTY, LCD_INV, PixelArt } from './sprites';
import { EGG_CRACKS, STAGES, crackLevel, fmtPct, stageIndexFor } from './stages';

interface PetStatusProps {
  state: FlywheelState;
  config: MachineConfig;
  live: boolean;
  fill: number;
  burnedPercent: number;
  totalBurned: number;
  onOpenLog: () => void;
}

const PHASE: Record<string, string> = {
  accumulate: 'watching the bowl fill',
  claim: 'claiming the bowl',
  buyback: 'buying $MUNCH',
  burn: 'MUNCH is eating',
  keep: 'filling the snack jar',
};

const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);

/**
 * The pet's status screen, like the one behind a virtual pet's heart icon, read live from the engine.
 * It is the one chapter with the backlight on: the screen inverts, lit pixels on dark glass.
 */
export function PetStatus({ state, config, live, fill, burnedPercent, totalBurned, onOpenLog }: PetStatusProps) {
  const stage = STAGES[stageIndexFor(burnedPercent)];
  const doing = !live ? 'asleep until the contract address is set' : state.isWheelSpinning ? PHASE[state.currentPhase] ?? 'feeding' : 'watching the bowl fill';
  const hearts = Math.round(fill * 4);
  const rows = [
    { k: 'stage', v: stage.key === 'egg' ? `egg · ${crackLevel(burnedPercent)}/${EGG_CRACKS} cracks` : stage.name },
    { k: 'age', v: `${state.cycleCount || 0} feedings` },
    { k: 'eaten', v: `${compact(totalBurned)} · ${fmtPct(burnedPercent)}%` },
    { k: 'next', v: state.nextCycleType === 'keep' ? 'jar · 0.02 ETH' : 'meal · 0.01 ETH' },
    { k: 'buys on', v: state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'Pons curve' },
    { k: 'ETH claimed', v: `${(state.totalFeesClaimedETH || 0).toFixed(4)}` },
    { k: 'to the jar', v: `${(state.totalFeesRetainedETH || 0).toFixed(4)} ETH` },
    { k: 'mouth', v: `${config.deadAddress.slice(0, 6)}…${config.deadAddress.slice(-4)}` },
  ];

  return (
    <section id="status" aria-labelledby="status-title" className="lcd lcd-night lcd-dither relative mt-10 px-4 pb-28 pt-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 font-lcd text-[0.8rem] uppercase text-lcd-soft">
            <span className="nom-blink inline-block h-2 w-2 bg-lcd-ink" aria-hidden="true" />
            light: on
          </div>
          <h2 id="status-title" className="m-0 font-lcd text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-lcd-ink">
            Status
          </h2>
          <p className="m-0 mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-lcd-ink">
            The auto-feeder is the bot. It checks the bowl around the clock, claims it when it is full and does the feeding on its own. Every move it makes lands on chain, and this screen reads it live.
          </p>
        </div>

        <div className="lcd-window min-w-0 p-5 sm:p-7">
          <div className="flex items-center gap-5 border-b-4 border-lcd-ink pb-5">
            <Pet stage={stage.key} crack={crackLevel(burnedPercent)} chewing={state.isWheelSpinning} pal={LCD_INV} className="h-20 w-20 shrink-0" />
            <div className="min-w-0 font-lcd text-lcd-ink">
              <div className="text-[0.8rem] uppercase text-lcd-soft">right now</div>
              <div className="text-[clamp(1.3rem,2.1vw,1.7rem)] leading-tight" aria-live="polite">
                {doing}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[0.8rem] uppercase">
                <span className="text-lcd-soft">bowl</span>
                <span className="flex gap-1" aria-label={`bowl ${hearts} of 4 full`}>
                  {Array.from({ length: 4 }, (_, i) => (
                    <PixelArt key={i} rows={i < hearts ? HEART : HEART_EMPTY} pal={LCD_INV} className="h-4 w-[1.1rem]" />
                  ))}
                </span>
              </div>
              {state.lastActionText ? <div className="mt-1 truncate font-mono text-[0.78rem] text-lcd-soft">{state.lastActionText}</div> : null}
            </div>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 pt-5 sm:grid-cols-4">
            {rows.map((r) => (
              <div key={r.k} className="min-w-0">
                <dt className="font-lcd text-[0.78rem] uppercase text-lcd-soft">{r.k}</dt>
                <dd className="m-0 mt-1 truncate font-lcd text-[1rem] tabular text-lcd-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={onOpenLog} className="btn-lcd mt-6 cursor-pointer">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        </div>
      </div>
    </section>
  );
}
