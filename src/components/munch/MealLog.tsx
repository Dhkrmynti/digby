import { useMemo } from 'react';
import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';
import { COIN, JAR, LCD, PixelArt } from './sprites';

interface MealLogProps {
  burnLedger: BurnLedgerEntry[];
  logs: ActivityLog[];
  totalBurned: number;
  tokenSymbol: string;
  deadAddress: string;
  explorerUrl: string;
  copiedDead: boolean;
  onCopyDead: () => void;
  onOpenLog: () => void;
}

const BURPS = ['nom.', 'crunchy.', 'burp.', 'no refunds.', 'tastes like supply.', 'that one was fat.', 'more.', 'gone.'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(n));
const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);
const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
const when = (e: BurnLedgerEntry) => {
  // ledger timestamps from the chain are in seconds
  const ms = e.timestamp && e.timestamp < 1e12 ? e.timestamp * 1000 : e.timestamp;
  const d = ms ? new Date(ms) : null;
  if (!d || Number.isNaN(d.getTime())) return e.timeStr?.split(' (')[0] ?? '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};
const burned = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;

interface JarRun {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

/** Every meal MUNCH ate and every snack-jar feeding, each with its transaction, as screens on the LCD. */
export function MealLog({ burnLedger, logs, totalBurned, tokenSymbol, deadAddress, explorerUrl, copiedDead, onCopyDead, onOpenLog }: MealLogProps) {
  const meals = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (burned(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // jar runs: keep entries from the ledger, plus the bot's "forwarded … to treasury" log lines
  const jar = useMemo(() => {
    const out: JarRun[] = [];
    const seen = new Set<string>();
    for (const e of burnLedger) {
      if (e.cycleType !== 'keep') continue;
      const tx = e.claimTx || '';
      seen.add(tx || e.id);
      out.push({ key: e.id, eth: e.retainedETH || e.claimedETH || 0, time: when(e), tx });
    }
    for (const l of logs) {
      const m = /forwarded\s+([\d.]+)\s*ETH\s+to\s+treasury/i.exec(l.details || '');
      if (!m) continue;
      const tx = l.txHash || '';
      const key = tx || l.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, eth: parseFloat(m[1]) || 0, time: l.timestamp, tx });
    }
    return out;
  }, [burnLedger, logs]);

  const shown = meals.slice(0, 8);
  const biggest = Math.max(1, ...shown.map(({ e }) => burned(e)));

  return (
    <>
      <section id="meals" aria-labelledby="meals-title" className="relative px-4 pb-16 pt-12 min-[900px]:-mt-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[84rem]">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="meals-title" className="m-0 font-lcd text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-lcd-ink">
              Every meal, on chain
            </h2>
            <p className="m-0 max-w-[48ch] text-[1.05rem] leading-relaxed text-lcd-ink lg:justify-self-end">
              Each time MUNCH eats, the meal is written here with its transaction, read straight from Robinhood Chain. The bar shows how big it was next to the biggest meal on screen.
            </p>
          </div>

          <div className="lcd-window mt-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-lcd-ink px-4 py-2.5 font-lcd text-[0.9rem] uppercase text-lcd sm:px-6">
              <span>meals: {meals.length}</span>
              <span className="flex min-w-0 items-center gap-2 normal-case">
                <span className="uppercase">mouth</span>
                <span className="truncate font-mono text-[0.8rem]" title={deadAddress}>
                  {deadAddress.slice(0, 8)}…{deadAddress.slice(-6)}
                </span>
                <button type="button" onClick={onCopyDead} className="flex cursor-pointer items-center gap-1 border-2 border-lcd px-2 py-0.5 text-[0.75rem] uppercase hover:bg-lcd hover:text-lcd-ink">
                  {copiedDead ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedDead ? 'copied' : 'copy'}
                </button>
              </span>
            </div>

            <ol className="m-0 list-none px-4 sm:px-6" aria-label="Recent meals">
              {shown.length === 0 ? (
                <li data-log-row className="flex items-center gap-4 py-8">
                  <PixelArt rows={COIN} pal={LCD} className="h-10 w-10 shrink-0" />
                  <p className="m-0 font-lcd text-[1.05rem] text-lcd-ink">
                    {totalBurned > 0 ? `${compact(totalBurned)} ${tokenSymbol} already eaten. Reading the meals from the chain…` : 'No meals yet. MUNCH is waiting. The first one shows up here with its transaction.'}
                  </p>
                </li>
              ) : (
                shown.map(({ e, n }) => {
                  const tx = e.burnTx || e.buyTx || e.claimTx;
                  const amt = burned(e);
                  const share = Math.max(0.04, amt / biggest);
                  return (
                    <li key={e.id} data-log-row className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b-[3px] border-dashed border-lcd-mid py-4 last:border-b-0 sm:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto]">
                      <PixelArt rows={COIN} pal={LCD} className="h-9 w-9" />
                      <div className="min-w-0 font-lcd text-lcd-ink">
                        <div className="flex flex-wrap items-baseline gap-x-3 text-[0.8rem] uppercase text-lcd-soft">
                          <span>meal {n}</span>
                          <span>{when(e)}</span>
                        </div>
                        <div className="text-[clamp(1.4rem,2.2vw,1.85rem)] leading-tight tabular">
                          {fmt(amt)} <span className="text-[0.6em]">{tokenSymbol}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-3 sm:col-span-1" aria-hidden="true">
                        <span className="h-3 bg-lcd-ink" style={{ width: `${share * 100}%` }} />
                        <span className="hidden whitespace-nowrap font-lcd text-[0.85rem] text-lcd-soft lg:inline">{BURPS[(n - 1) % BURPS.length]}</span>
                      </div>
                      {tx && tx.startsWith('0x') ? (
                        <a href={`${explorerUrl}/tx/${tx}`} target="_blank" rel="noreferrer" className="col-span-2 inline-flex items-center gap-1 font-mono text-[0.82rem] text-lcd-ink underline decoration-lcd-ink/40 sm:col-span-1 sm:justify-self-end">
                          {shortHash(tx)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </li>
                  );
                })
              )}
            </ol>
            <div className="border-t-4 border-lcd-ink px-4 py-4 sm:px-6">
              <button type="button" onClick={onOpenLog} className="btn-lcd cursor-pointer">
                <ScrollText className="h-4 w-4" />
                open the full log
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="jar" aria-labelledby="jar-title" className="relative px-4 pb-10 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end">
          <div className="flex items-start gap-5">
            <PixelArt rows={JAR} pal={LCD} className="h-20 w-[4.6rem] shrink-0" />
            <div>
              <h2 id="jar-title" className="m-0 font-lcd text-[clamp(1.9rem,3.2vw,2.7rem)] leading-tight text-lcd-ink">
                The snack jar
              </h2>
              <p className="m-0 mt-3 max-w-[44ch] text-[1.03rem] leading-relaxed text-lcd-ink">
                Every other feeding is saved instead of eaten: the ETH goes to the project wallet that keeps MUNCH running. Nothing hidden: those feedings are listed here too.
              </p>
            </div>
          </div>
          {jar.length === 0 ? (
            <p className="m-0 font-lcd text-[1rem] leading-relaxed text-lcd-soft">No snack-jar feeding in the recent log. The next one shows up here with its transaction. Older ones are in the project wallet’s history.</p>
          ) : (
            <ol className="m-0 list-none p-0">
              {jar.slice(0, 4).map((f) => (
                <li key={f.key} data-log-row className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-[3px] border-dashed border-lcd-mid py-3 font-lcd text-lcd-ink">
                  <span className="text-[0.8rem] uppercase">to the jar</span>
                  <span className="text-[1.05rem] tabular">{f.eth.toFixed(4)} ETH</span>
                  <span className="text-[0.85rem] text-lcd-soft">{f.time}</span>
                  {f.tx && f.tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${f.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.82rem] text-lcd-ink underline decoration-lcd-ink/40">
                      {shortHash(f.tx)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
