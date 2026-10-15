import { useMemo } from 'react';
import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';
import { BLOCK, CHEST, PixelArt } from './sprites';

interface LavaLogProps {
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

const SIZZLE = ['tssss.', 'gone.', 'melted.', 'no take-backs.', 'sizzle.', 'down it goes.', 'one less out there.', 'the lava says thanks.'];

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

interface ChestRun {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

/** Every drop into the lava, and every chest run, each with its transaction. */
export function LavaLog({ burnLedger, logs, totalBurned, tokenSymbol, deadAddress, explorerUrl, copiedDead, onCopyDead, onOpenLog }: LavaLogProps) {
  const drops = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (burned(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // chest runs: keep entries from the ledger, plus the bot's "forwarded … to treasury" log lines
  const chest = useMemo(() => {
    const out: ChestRun[] = [];
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

  const shown = drops.slice(0, 8);
  const biggest = Math.max(1, ...shown.map(({ e }) => burned(e)));

  return (
    <section id="log" aria-labelledby="log-title" className="relative px-4 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="log-title" className="m-0 display text-[clamp(2.6rem,5.4vw,4.6rem)] text-star">
            The lava log
          </h2>
          <p className="m-0 max-w-[50ch] text-[1.08rem] leading-relaxed text-star-dim lg:justify-self-end">
            Every time {tokenSymbol} goes in the lava, it is written here with its transaction, read straight from Robinhood Chain. The bar beside each drop is its size next to the biggest one shown.
          </p>
        </div>

        <div className="px-panel mt-12 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b-[3px] border-[#0b0806] pb-4 text-[0.82rem] text-star-dim">
            <span className="pxl text-[0.7rem]">
              drops <span className="text-ring">{drops.length}</span>
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="pxl text-[0.7rem]">the lava</span>
              <span className="truncate font-mono text-star" title={deadAddress}>
                {deadAddress.slice(0, 8)}…{deadAddress.slice(-6)}
              </span>
              <button type="button" onClick={onCopyDead} className="btn-ghost cursor-pointer px-2.5 py-1 text-[0.72rem]">
                {copiedDead ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedDead ? 'copied' : 'copy'}
              </button>
            </span>
          </div>

          <ol className="m-0 list-none p-0" aria-label="Recent drops into the lava">
            {shown.length === 0 ? (
              <li data-log-row className="flex items-center gap-4 py-8">
                <PixelArt rows={BLOCK} className="h-10 w-10 shrink-0 opacity-60" />
                <p className="m-0 text-[1.05rem] text-star-dim">
                  {totalBurned > 0 ? `${compact(totalBurned)} ${tokenSymbol} already went in. Reading the drops from the chain…` : 'Nothing in the lava yet. The first drop shows up here with its transaction.'}
                </p>
              </li>
            ) : (
              shown.map(({ e, n }) => {
                const tx = e.burnTx || e.buyTx || e.claimTx;
                const amt = burned(e);
                const share = Math.max(0.04, amt / biggest);
                return (
                  <li key={e.id} data-log-row className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b-[3px] border-[#0b0806] py-4 last:border-b-0 sm:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto]">
                    <PixelArt rows={BLOCK} className="h-10 w-10" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="pxl text-[0.72rem] text-star-dim">drop {n}</span>
                        <span className="font-mono text-[0.8rem] text-star-dim">{when(e)}</span>
                      </div>
                      <div className="display text-[clamp(1.5rem,2.4vw,2rem)] tabular text-star">
                        {fmt(amt)} <span className="text-[0.6em] text-ring">{tokenSymbol}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-3 sm:col-span-1" aria-hidden="true">
                      <span className="h-3 bg-ring" style={{ width: `${share * 100}%`, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.3)' }} />
                      <span className="hidden whitespace-nowrap pxl text-[0.66rem] text-ring-hot lg:inline">{SIZZLE[(n - 1) % SIZZLE.length]}</span>
                    </div>
                    {tx && tx.startsWith('0x') ? (
                      <a href={`${explorerUrl}/tx/${tx}`} target="_blank" rel="noreferrer" className="col-span-2 inline-flex items-center gap-1 font-mono text-[0.82rem] text-ring underline decoration-ring/40 sm:col-span-1 sm:justify-self-end">
                        {shortHash(tx)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                );
              })
            )}
          </ol>
          <button type="button" onClick={onOpenLog} className="btn-ghost mt-6 cursor-pointer px-5 py-2.5 text-[0.9rem]">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        </div>

        <div id="chest" className="mt-16 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex items-start gap-4">
            <PixelArt rows={CHEST} className="mt-1 h-12 w-14 shrink-0" />
            <div>
              <h3 className="m-0 display text-[clamp(2rem,3.2vw,2.7rem)] text-fuel">The chest</h3>
              <p className="m-0 mt-3 max-w-[44ch] text-[1.03rem] leading-relaxed text-star-dim">
                Every other run keeps the mine going: the fees go to the project wallet instead of the lava. Those runs are written up here too, in full.
              </p>
            </div>
          </div>
          {chest.length === 0 ? (
            <p className="m-0 self-end text-[1rem] leading-relaxed text-star-dim">No chest run in the recent log. The next one shows up here with its transaction. Older ones are in the project wallet’s history.</p>
          ) : (
            <ol className="m-0 list-none self-end p-0">
              {chest.slice(0, 4).map((f) => (
                <li key={f.key} data-log-row className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-[3px] border-panel-line py-3">
                  <span className="pxl text-[0.68rem] text-fuel">chest run</span>
                  <span className="tabular font-mono text-[1rem] text-star">{f.eth.toFixed(4)} ETH</span>
                  <span className="font-mono text-[0.85rem] text-star-dim">{f.time}</span>
                  {f.tx && f.tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${f.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.85rem] text-fuel underline decoration-fuel/40">
                      {shortHash(f.tx)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
