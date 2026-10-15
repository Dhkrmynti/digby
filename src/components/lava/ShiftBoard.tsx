import { ScrollText } from 'lucide-react';
import type { FlywheelState, MachineConfig } from '../../types';
import { BRR, PixelArt } from './sprites';

interface ShiftBoardProps {
  state: FlywheelState;
  config: MachineConfig;
  live: boolean;
  onOpenLog: () => void;
}

const PHASE: Record<string, string> = {
  accumulate: 'waiting for the bar to fill',
  claim: 'claiming the escrow',
  buyback: 'buying $LAVA',
  burn: 'dropping it in the lava',
  keep: 'filling the chest',
};

/** Brr's shift board: what the bot is doing right now, read from the engine. */
export function ShiftBoard({ state, config, live, onOpenLog }: ShiftBoardProps) {
  const doing = !live ? 'off shift until the contract address is set' : state.isWheelSpinning ? PHASE[state.currentPhase] ?? 'working' : 'watching the bar';
  const rows = [
    { k: 'runs done', v: String(state.cycleCount || 0) },
    { k: 'next run', v: state.nextCycleType === 'keep' ? 'chest · 0.02 ETH' : 'lava · 0.01 ETH' },
    { k: 'buys on', v: state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'Pons curve' },
    { k: 'ETH claimed', v: `${(state.totalFeesClaimedETH || 0).toFixed(4)} ETH` },
    { k: 'ETH to the chest', v: `${(state.totalFeesRetainedETH || 0).toFixed(4)} ETH` },
    { k: 'the lava', v: `${config.deadAddress.slice(0, 6)}…${config.deadAddress.slice(-4)}` },
  ];

  return (
    <section id="shift" aria-labelledby="shift-title" className="relative px-4 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div>
          <h2 id="shift-title" className="m-0 display text-[clamp(2.6rem,5.4vw,4.6rem)] text-star">
            Brr’s shift
          </h2>
          <p className="m-0 mt-5 max-w-[46ch] text-[1.08rem] leading-relaxed text-star-dim">
            Brr is the bot: a penguin, very far from home. He checks the fee escrow around the clock, claims it when the bar is full, and does the run on his own. Every move he makes lands on chain.
          </p>
        </div>

        <div className="px-panel p-5 sm:p-7">
          <div className="flex items-center gap-4 border-b-[3px] border-[#0b0806] pb-5">
            <PixelArt rows={BRR} className={`h-16 w-[3.1rem] shrink-0 ${state.isWheelSpinning ? 'px-hop' : ''}`} />
            <div className="min-w-0">
              <div className="pxl text-[0.7rem] text-star-dim">right now</div>
              <div className={`display text-[clamp(1.4rem,2.2vw,1.8rem)] ${state.isWheelSpinning ? 'text-ring' : 'text-star'}`} aria-live="polite">
                {doing}
              </div>
              {state.lastActionText ? <div className="mt-1 truncate font-mono text-[0.78rem] text-star-dim">{state.lastActionText}</div> : null}
            </div>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 pt-5 sm:grid-cols-3">
            {rows.map((r) => (
              <div key={r.k}>
                <dt className="pxl text-[0.64rem] text-star-dim">{r.k}</dt>
                <dd className="m-0 mt-1 font-mono text-[0.95rem] tabular text-star">{r.v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={onOpenLog} className="btn-ghost mt-6 cursor-pointer px-5 py-2.5 text-[0.9rem]">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        </div>
      </div>
    </section>
  );
}
