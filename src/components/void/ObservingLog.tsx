import { useMemo } from 'react';
import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';

interface ObservingLogProps {
  burnLedger: BurnLedgerEntry[];
  logs: ActivityLog[];
  totalBurned: number;
  burnedPercent: number;
  tokenSymbol: string;
  deadAddress: string;
  explorerUrl: string;
  copiedDead: boolean;
  onCopyDead: () => void;
  onOpenLog: () => void;
}

const NOTES = ['gone.', 'past the horizon.', 'no light escapes.', 'spaghettified.', 'never coming back.', 'swallowed whole.', 'one less out there.', 'the void says thanks.'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
const when = (e: BurnLedgerEntry) => {
  // ledger timestamps from the chain are in seconds
  const ms = e.timestamp && e.timestamp < 1e12 ? e.timestamp * 1000 : e.timestamp;
  const d = ms ? new Date(ms) : null;
  if (!d || Number.isNaN(d.getTime())) return e.timeStr?.split(' (')[0] ?? '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};
const fallen = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;

interface Fuel {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

const ROW = 112;

/** Seeded jitter so the noise floor holds still between renders. */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

/**
 * The recorder's one continuous pen line down the strip: a live noise floor,
 * with a spike at each fall sized by the amount that went in.
 */
const RecorderTrace = ({ amps }: { amps: number[] }) => {
  const rows = Math.max(amps.length, 1);
  const H = rows * ROW;
  let d = 'M30 0';
  for (let y = 4; y <= H; y += 4) {
    const row = Math.floor(y / ROW);
    const local = y - row * ROW;
    const amp = amps[row] ?? 0;
    let x = 30 + noise(y) * 5;
    if (amp > 0 && local > 36 && local < 80) {
      // a burst: sharp swing out, ringing back to the floor
      const k = (local - 36) / 44;
      x = 30 + Math.sin(k * Math.PI * 3) * (1 - k) * (14 + amp * 70) + noise(y) * 3;
    }
    d += ` L${x.toFixed(1)} ${y}`;
  }
  return (
    <svg viewBox={`0 0 120 ${H}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-y-0 left-0 h-full w-[5.5rem] overflow-visible sm:w-[9rem]" aria-hidden="true">
      <path data-trace d={d} pathLength={1} strokeDasharray="1" fill="none" stroke="#1c2a6b" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

export function ObservingLog({
  burnLedger,
  logs,
  totalBurned,
  tokenSymbol,
  deadAddress,
  explorerUrl,
  copiedDead,
  onCopyDead,
  onOpenLog,
}: ObservingLogProps) {
  const falls = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (fallen(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // Observatory fuel: keep entries from the ledger, plus the bot's "forwarded … to Treasury" log lines
  const fuel = useMemo(() => {
    const out: Fuel[] = [];
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

  const shown = falls.slice(0, 8);
  const biggest = Math.max(1, ...shown.map(({ e }) => Math.log10(fallen(e) + 1)));

  return (
    <section id="log" aria-labelledby="log-title" className="relative px-4 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="log-title" className="m-0 display text-[clamp(3rem,6.4vw,5.8rem)] text-star">
            The observing log
          </h2>
          <p className="m-0 max-w-[50ch] text-[1.1rem] leading-relaxed text-star-dim lg:justify-self-end">
            The recorder never stops. Every time {tokenSymbol} falls into dEaD-1 the pen spikes, and the observer writes it down. Each line links to the transaction, read straight from Robinhood Chain.
          </p>
        </div>

        {/* the strip */}
        <div className="paper sprockets mt-12 rounded-[4px] px-6 pb-10 pt-5 sm:px-10">
          {/* what the recorder prints across the head of the paper */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-pen/30 pb-3 font-mono text-[0.78rem] uppercase text-pen-soft">
            <span>chan 1 · dEaD-1</span>
            <span>
              falls recorded <span className="text-pen">{falls.length}</span>
            </span>
            <span className="flex min-w-0 items-center gap-2">
              horizon <span className="truncate normal-case text-pen" title={deadAddress}>{deadAddress.slice(0, 8)}…{deadAddress.slice(-6)}</span>
              <button type="button" onClick={onCopyDead} className="btn-pen cursor-pointer bg-paper px-2.5 py-0.5 text-[0.8rem]">
                {copiedDead ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedDead ? 'copied' : 'copy'}
              </button>
            </span>
            <span className="sm:ml-auto">paper speed: 1 fall / row</span>
          </div>
          <div className="relative">
          <RecorderTrace amps={shown.length ? shown.map(({ e }) => Math.log10(fallen(e) + 1) / biggest) : [0, 0, 0, 0]} />
          <ol className="m-0 list-none p-0" aria-label="Recent falls">
            {shown.length === 0
              ? [0, 1, 2, 3].map((i) => (
                  <li key={i} data-log-row className="grid h-28 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
                    <span />
                    {i === 1 ? (
                      <p className="m-0 hand text-[2rem] text-marker">
                        {totalBurned > 0 ? `${compact(totalBurned)} ${tokenSymbol} already fell in. Reading the lines from the chain…` : 'flat line. waiting for the first fall.'}
                      </p>
                    ) : (
                      <span />
                    )}
                  </li>
                ))
              : shown.map(({ e, n }) => {
                  const tx = e.burnTx || e.buyTx || e.claimTx;
                  const amt = fallen(e);
                  return (
                    <li
                      key={e.id}
                      data-log-row
                      className="grid h-28 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto]"
                    >
                      <span />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <span className="display text-[1.15rem] text-pen-soft">Fall {n}</span>
                          <span className="font-mono text-[0.82rem] text-pen-soft">{when(e)}</span>
                        </div>
                        <div className="display text-[clamp(1.8rem,3vw,2.4rem)] tabular text-pen">
                          {fmt(amt)} <span className="text-[0.55em] text-pen-soft">{tokenSymbol}</span>
                        </div>
                        {tx && tx.startsWith('0x') ? (
                          <a href={`${explorerUrl}/tx/${tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.8rem] text-pen underline decoration-pen/40">
                            {shortHash(tx)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                      <p className="hidden m-0 hand text-[1.9rem] text-marker sm:block sm:-rotate-2">{NOTES[(n - 1) % NOTES.length]}</p>
                    </li>
                  );
                })}
          </ol>
          </div>
          <button type="button" onClick={onOpenLog} className="btn-pen mt-6 cursor-pointer bg-paper px-5 py-2.5 text-[1rem]">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        </div>

        {/* observatory fuel, written up just as plainly */}
        <div className="mt-16 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <h3 className="m-0 display text-[clamp(2.2rem,3.6vw,3rem)] text-fuel">Observatory fuel</h3>
            <p className="m-0 mt-3 max-w-[44ch] text-[1.05rem] leading-relaxed text-star-dim">
              Every other orbit keeps the lights on: the fees go to the creator wallet instead of the hole. Those orbits are logged here too, in full.
            </p>
          </div>
          {fuel.length === 0 ? (
            <p className="m-0 self-end text-[1.02rem] leading-relaxed text-star-dim">
              No fuel orbit in the recent log. The next one shows up here with its transaction. Older ones are in the creator wallet’s history.
            </p>
          ) : (
            <ol className="m-0 list-none self-end p-0">
              {fuel.slice(0, 4).map((f) => (
                <li key={f.key} data-log-row className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-panel-line py-3">
                  <span className="label text-[0.7rem] text-fuel">fuel orbit</span>
                  <span className="tabular font-mono text-[1rem] text-star">{f.eth.toFixed(4)} ETH</span>
                  <span className="font-mono text-[0.85rem] text-star-dim">{f.time}</span>
                  {f.tx && f.tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${f.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.85rem] text-ring underline decoration-ring/40">
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
