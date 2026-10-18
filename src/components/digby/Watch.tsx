import { ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, FlywheelState, MachineConfig } from '../../types';
import { SpriteCard } from './Sprite';
import { STAGES, stageIndexFor } from './stages';

interface WatchProps {
  state: FlywheelState;
  config: MachineConfig;
  logs: ActivityLog[];
  live: boolean;
  fill: number;
  burnedPercent: number;
  explorerUrl: string;
  onOpenLog: () => void;
}

const PHASE: Record<string, string> = {
  accumulate: 'watching the lantern fill',
  claim: 'claiming the lantern',
  buyback: 'buying $DIGBY',
  burn: 'Digby is burying it',
  keep: "paying Digby's wages",
};

/** What each kind of log line is, in the yard's words. */
const KIND: Record<string, string> = {
  accumulate: 'lantern',
  claim: 'claim',
  buyback: 'buy',
  burn: 'burial',
  keep: 'wages',
};

const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;

/**
 * The night watch: only what the rest of the page does not already say. What the bot is
 * doing this second, how full the lantern is, and its last few moves, each with its transaction.
 */
export function Watch({ state, config, logs, live, fill, burnedPercent, explorerUrl, onOpenLog }: WatchProps) {
  const stage = STAGES[stageIndexFor(burnedPercent)];
  const doing = !live ? 'asleep until the contract address is set' : state.isWheelSpinning ? PHASE[state.currentPhase] ?? 'on a shift' : 'watching the lantern fill';
  const lit = Math.round(fill * 10);
  const recent = logs.filter((l) => l.status !== 'failed').slice(0, 5);
  const totals = [
    { k: 'shifts worked', v: `${state.cycleCount || 0}` },
    { k: 'next shift', v: state.nextCycleType === 'keep' ? 'wages · 0.02 ETH' : 'burial · 0.01 ETH' },
    { k: 'buys on', v: state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'Pons curve' },
    { k: 'wages paid', v: `${(state.totalFeesRetainedETH || 0).toFixed(4)} ETH` },
  ];

  return (
    <section id="watch" aria-labelledby="watch-title" className="relative px-4 pb-24 pt-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[84rem]">
        <h2 id="watch-title" className="display m-0 text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
          The night watch
        </h2>
        <p className="m-0 mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-mist">
          The bot never clocks out. This is what it is doing right now and the last things it did, read as they happen.
        </p>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* right now */}
          <div className="slab min-w-0 p-5 sm:p-7">
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-5">
              <SpriteCard art={live && state.isWheelSpinning ? 'dig' : 'idle'} stage={stage.n} label={`Digby, ${doing}`} className="w-full shadow-[0_0_0_3px_var(--color-ink-soft)]" />
              <div className="min-w-0">
                <div className="label inline-flex items-center gap-2 text-[0.7rem] text-mist">
                  <span className={`inline-block h-2 w-2 ${live ? 'nom-blink bg-ecto' : 'bg-stone'}`} aria-hidden="true" />
                  {live ? 'right now' : 'not live yet'}
                </div>
                <div className="mt-1 font-logo text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium leading-tight text-cream" aria-live="polite">
                  {doing}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-[0.65rem] text-mist">fee lantern</span>
                <span className="font-logo text-[1rem] tabular text-cream">{(state.currentEscrowBalanceETH || 0).toFixed(4)} ETH</span>
              </div>
              <div className="mt-2 grid h-4 gap-[3px]" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }} role="img" aria-label={`Fee lantern ${lit * 10}% full`}>
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={i < lit ? 'bg-ecto' : 'bg-ink-soft'} />
                ))}
              </div>
            </div>
            <dl className="m-0 mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              {totals.map((r) => (
                <div key={r.k} className="min-w-0">
                  <dt className="label text-[0.62rem] text-mist">{r.k}</dt>
                  <dd className="m-0 mt-1 truncate font-logo text-[1.05rem] font-medium tabular text-cream" title={r.v}>
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* the last few moves */}
          <div className="min-w-0">
            <h3 className="m-0 font-logo text-[1.5rem] font-bold text-cream">Last moves</h3>
            {recent.length === 0 ? (
              <p className="m-0 mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-mist">
                {live ? 'Quiet night so far. Each claim, buy and burial shows up here as the bot makes it.' : 'Nothing yet. Once the contract address is set, every claim, buy and burial shows up here as the bot makes it.'}
              </p>
            ) : (
              <ol className="m-0 mt-4 list-none p-0">
                {recent.map((l) => (
                  <li key={l.id} data-log-row className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-b-[3px] border-dashed border-ink-soft py-3 last:border-b-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
                    <span className={`label self-start px-1.5 py-0.5 text-center text-[0.6rem] ${l.phase === 'burn' ? 'bg-ecto text-ink' : 'bg-ink-soft text-cream'}`}>{KIND[l.phase] ?? l.phase}</span>
                    <div className="min-w-0">
                      <div className="truncate text-[0.98rem] text-cream" title={l.details || l.action}>
                        {l.action}
                      </div>
                      <div className="text-[0.82rem] text-mist">{l.timestamp}</div>
                    </div>
                    {l.txHash && l.txHash.startsWith('0x') ? (
                      <a href={`${explorerUrl}/tx/${l.txHash}`} target="_blank" rel="noreferrer" className="col-start-2 inline-flex items-center gap-1 self-center font-mono text-[0.78rem] text-cream underline decoration-cream/40 sm:col-start-3">
                        {shortHash(l.txHash)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
      </div>
    </section>
  );
}
