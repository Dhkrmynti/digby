import { ScrollText } from 'lucide-react';
import type { FlywheelState, MachineConfig } from '../../types';
import { SpriteCard } from './Sprite';
import { STAGES, fmtPct, stageIndexFor } from './stages';

interface WatchProps {
  state: FlywheelState;
  config: MachineConfig;
  live: boolean;
  fill: number;
  burnedPercent: number;
  totalBurned: number;
  graves: number;
  onOpenLog: () => void;
}

const PHASE: Record<string, string> = {
  accumulate: 'watching the lantern fill',
  claim: 'claiming the lantern',
  buyback: 'buying $DIGBY',
  burn: 'Digby is burying it',
  keep: "paying Digby's wages",
};

const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);

/** The night watch: what the bot is doing right now and the running totals, read live from the engine. */
export function Watch({ state, config, live, fill, burnedPercent, totalBurned, graves, onOpenLog }: WatchProps) {
  const stage = STAGES[stageIndexFor(burnedPercent)];
  const doing = !live ? 'asleep until the contract address is set' : state.isWheelSpinning ? PHASE[state.currentPhase] ?? 'on a shift' : 'watching the lantern fill';
  const lit = Math.round(fill * 10);
  const rows = [
    { k: 'stage', v: `${stage.n} · ${stage.name}` },
    { k: 'shifts', v: `${state.cycleCount || 0}` },
    { k: 'buried', v: `${compact(totalBurned)} · ${fmtPct(burnedPercent)}%` },
    { k: 'graves', v: `${graves}` },
    { k: 'next shift', v: state.nextCycleType === 'keep' ? 'wages · 0.02 ETH' : 'burial · 0.01 ETH' },
    { k: 'buys on', v: state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'Pons curve' },
    { k: 'ETH claimed', v: `${(state.totalFeesClaimedETH || 0).toFixed(4)}` },
    { k: 'wages paid', v: `${(state.totalFeesRetainedETH || 0).toFixed(4)} ETH` },
  ];

  return (
    <section id="watch" aria-labelledby="watch-title" className="relative px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div>
          <h2 id="watch-title" className="display m-0 text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
            The night watch
          </h2>
          <p className="m-0 mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">
            The night shift is a bot that never clocks out. It checks the lantern every block, claims it when it is full and runs the burial or the wages on its own. This panel reads what it is doing as it happens.
          </p>
        </div>

        <div className="slab min-w-0 p-5 sm:p-7">
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-5 border-b-[3px] border-ink-soft pb-5">
            <SpriteCard art={live && state.isWheelSpinning ? 'dig' : 'idle'} stage={stage.n} label={`Digby, ${doing}`} className="w-full shadow-[0_0_0_3px_var(--color-ink-soft)]" />
            <div className="min-w-0">
              <div className="label inline-flex items-center gap-2 text-[0.7rem] text-mist">
                <span className={`inline-block h-2 w-2 ${live ? 'nom-blink bg-ecto' : 'bg-stone'}`} aria-hidden="true" />
                {live ? 'right now, live from the chain' : 'not live yet'}
              </div>
              <div className="font-logo text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium leading-tight text-cream" aria-live="polite">
                {doing}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="label text-[0.65rem] text-mist">lantern</span>
                <span className="grid h-3 w-full max-w-[10rem] gap-[2px]" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }} aria-label={`Fee lantern ${lit * 10}% full`} role="img">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} className={i < lit ? 'bg-ecto' : 'bg-ink-soft'} />
                  ))}
                </span>
              </div>
              {state.lastActionText ? <div className="mt-2 truncate font-mono text-[0.75rem] text-mist">{state.lastActionText}</div> : null}
            </div>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 pt-5 sm:grid-cols-4">
            {rows.map((r) => (
              <div key={r.k} className="min-w-0">
                <dt className="label text-[0.65rem] text-mist">{r.k}</dt>
                <dd className="m-0 mt-1 truncate font-logo text-[1.05rem] font-medium tabular text-cream" title={r.v}>
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink-soft pt-5">
            <span className="font-mono text-[0.75rem] text-mist">
              yard {config.deadAddress.slice(0, 6)}…{config.deadAddress.slice(-4)}
            </span>
            <button type="button" onClick={onOpenLog} className="btn-chip cursor-pointer">
              <ScrollText className="h-4 w-4" />
              open the full register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
