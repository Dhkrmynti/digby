import { useMemo } from 'react';
import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';

interface GraveyardProps {
  burnLedger: BurnLedgerEntry[];
  logs: ActivityLog[];
  totalBurned: number;
  burnedPercent: number;
  tokenSymbol: string;
  deadAddress: string;
  explorerUrl: string;
  copiedDead: boolean;
  onCopyDead: () => void;
  onOpenManifest: () => void;
}

const EPITAPHS = [
  'Bought at market. Buried by dawn.',
  'Gone to 0x…dEaD. No forwarding address.',
  'Here lies supply. Nobody will miss it.',
  'Taken by Mort. Never returned.',
  'Paper hands paid for this one.',
  'Six feet under, one block deep.',
  'It had a good run.',
  'Rest in pieces.',
];

/* Three honest silhouettes, cycled along the row */
const STONES = [
  { shape: 'rounded-t-[999px] rounded-b-md', height: 'h-[19rem]' },
  { shape: 'rounded-t-[1.6rem] rounded-b-md', height: 'h-[17.5rem]' },
  { shape: 'rounded-b-md [clip-path:polygon(0_15%,50%_0,100%_15%,100%_100%,0_100%)]', height: 'h-[20rem]' },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
const when = (e: BurnLedgerEntry) => {
  // ledger timestamps from the chain are in seconds
  const ms = e.timestamp && e.timestamp < 1e12 ? e.timestamp * 1000 : e.timestamp;
  const d = ms ? new Date(ms) : null;
  if (!d || Number.isNaN(d.getTime())) return e.timeStr?.split(' (')[0] ?? '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};
const buried = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;

interface WageSlip {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

/** Mort's wage tin: a lidded tin with a coin slot and a painted count. */
const WageTin = ({ count }: { count: number }) => (
  <svg viewBox="0 0 200 220" className="h-auto w-full" aria-hidden="true">
    <ellipse cx="100" cy="206" rx="78" ry="10" fill="#0e0714" />
    <path d="M28 64h144v128c0 8-32 16-72 16s-72-8-72-16Z" fill="#6b5a78" stroke="#2a1626" strokeWidth="4" />
    <path d="M28 96h144M28 168h144" stroke="#2a1626" strokeWidth="3" opacity="0.5" />
    <rect x="44" y="108" width="112" height="52" rx="8" fill="#a6ff4d" stroke="#2a1626" strokeWidth="3" />
    <text x="100" y="134" textAnchor="middle" fontFamily="Bungee" fontSize="22" fill="#2a1626">
      {count}
    </text>
    <text x="100" y="152" textAnchor="middle" fontFamily="Bungee" fontSize="11" fill="#2a1626">
      RECENT {count === 1 ? 'WAGE' : 'WAGES'}
    </text>
    <ellipse cx="100" cy="64" rx="76" ry="16" fill="#9686a6" stroke="#2a1626" strokeWidth="4" />
    <rect x="80" y="58" width="40" height="8" rx="4" fill="#0e0714" />
    <circle cx="100" cy="30" r="13" fill="#ffcf3a" stroke="#2a1626" strokeWidth="3" />
    <path d="M100 43v12" stroke="#2a1626" strokeWidth="3" strokeDasharray="3 3" />
  </svg>
);

export function Graveyard({
  burnLedger,
  logs,
  totalBurned,
  burnedPercent,
  tokenSymbol,
  deadAddress,
  explorerUrl,
  copiedDead,
  onCopyDead,
  onOpenManifest,
}: GraveyardProps) {
  const burials = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (buried(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // Wage slips: keep entries from the ledger, plus the bot's "forwarded … to Treasury" log lines
  const wages = useMemo(() => {
    const slips: WageSlip[] = [];
    const seen = new Set<string>();
    for (const e of burnLedger) {
      if (e.cycleType !== 'keep') continue;
      const tx = e.claimTx || '';
      seen.add(tx || e.id);
      slips.push({ key: e.id, eth: e.retainedETH || e.claimedETH || 0, time: when(e), tx });
    }
    for (const l of logs) {
      const m = /forwarded\s+([\d.]+)\s*ETH\s+to\s+treasury/i.exec(l.details || '');
      if (!m) continue;
      const tx = l.txHash || '';
      const key = tx || l.id;
      if (seen.has(key)) continue;
      seen.add(key);
      slips.push({ key, eth: parseFloat(m[1]) || 0, time: l.timestamp, tx });
    }
    return slips;
  }, [burnLedger, logs]);

  const shown = burials.slice(0, 7);

  return (
    <section id="graveyard" aria-labelledby="graveyard-title" className="relative overflow-hidden px-5 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 id="graveyard-title" className="m-0 sign-lettering text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.95] text-cream">
          The Graveyard
        </h2>
        <p className="m-0 mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-dust">
          One headstone for every burial, read straight from Robinhood Chain. Each one links to the transaction that dug it.
        </p>

        {/* the plot: stones, then the gate sign */}
        <div className="relative mt-16">
          <ul className="m-0 flex list-none flex-wrap items-end justify-center gap-x-6 gap-y-12 p-0 sm:justify-start">
            {shown.length === 0 ? (
              <li data-stone className={`headstone flex w-[14.5rem] flex-col items-center justify-center px-6 text-center ${STONES[0].shape} ${STONES[0].height}`}>
                <span className="sign-lettering text-[1.35rem] leading-tight [text-shadow:none]">{totalBurned > 0 ? 'Carving…' : 'Reserved'}</span>
                <span className="mt-3 text-[0.95rem] leading-snug">
                  {totalBurned > 0
                    ? `${fmt(totalBurned)} ${tokenSymbol} are already in the ground. Their headstones load from the chain.`
                    : 'This plot is waiting for the first burial. Mort is already digging.'}
                </span>
              </li>
            ) : (
              shown.map(({ e, n }, i) => {
                const tx = e.burnTx || e.buyTx || e.claimTx;
                const stone = STONES[i % STONES.length];
                return (
                  <li key={e.id} data-stone className={`headstone flex w-[14.5rem] flex-col items-center px-5 pb-6 pt-14 text-center ${stone.shape} ${stone.height}`}>
                    <span className="font-display text-[1rem] leading-none">Here lies</span>
                    <span className="tabular mt-3 font-display text-[1.6rem] leading-none">{fmt(buried(e))}</span>
                    <span className="font-display text-[0.8rem]">{tokenSymbol}</span>
                    <span className="mt-3 text-[0.85rem] font-semibold">
                      Burial #{n} · {when(e)}
                    </span>
                    <span className="mt-2 text-[0.92rem] leading-snug">{EPITAPHS[(n - 1) % EPITAPHS.length]}</span>
                    {tx && tx.startsWith('0x') ? (
                      <a
                        href={`${explorerUrl}/tx/${tx}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-1 font-mono text-[0.8rem] text-[#1d1622] underline decoration-[#1d162266]"
                      >
                        tx {shortHash(tx)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                );
              })
            )}

            {/* gate sign at the plot */}
            <li className="flex flex-1 basis-[18rem] items-end justify-center sm:justify-end">
              <div className="flex flex-col items-center">
                <div className="sign-board w-[min(22rem,100%)] px-7 py-6 text-left">
                  <p className="m-0 sign-lettering text-[1.9rem] leading-none">The Plot</p>
                  <p className="m-0 mt-3 text-[1rem] leading-snug text-cream">
                    <span className="tabular font-display text-bulb">{burnedPercent > 0 ? burnedPercent.toFixed(2) : '0.00'}%</span> of the supply rests here, across{' '}
                    {burials.length} {burials.length === 1 ? 'burial' : 'burials'}.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[0.9rem]">
                    <span title={deadAddress}>
                      {deadAddress.slice(0, 10)}…{deadAddress.slice(-6)}
                    </span>
                    <button type="button" onClick={onCopyDead} className="inline-flex cursor-pointer items-center gap-1 font-display text-[0.72rem] text-bulb-hot hover:text-bulb">
                      {copiedDead ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedDead ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                {/* the two posts the sign hangs from */}
                <div className="flex w-[min(18rem,80%)] justify-between" aria-hidden="true">
                  <span className="h-16 w-3 rounded-b bg-plum-line" />
                  <span className="h-16 w-3 rounded-b bg-plum-line" />
                </div>
              </div>
            </li>
          </ul>
          <div className="mt-[-0.4rem] h-4 rounded-full bg-[#0e0714]" aria-hidden="true" />
        </div>

        {/* Mort's wage tin: keep rides, in full */}
        <div className="mt-24 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1.1fr)]">
          <div>
            <h3 className="m-0 sign-lettering text-[clamp(1.8rem,2.8vw,2.4rem)] leading-tight text-slime">Mort’s wage tin</h3>
            <p className="m-0 mt-3 max-w-[44ch] text-[1rem] leading-relaxed text-dust">
              Every other ride pays the gravedigger. On those rides the fees go to the creator wallet instead of a grave. Each wage drops a slip in the tin.
            </p>
          </div>
          <div className="mx-auto w-44 lg:w-full">
            <WageTin count={wages.length} />
          </div>
          <div>
            {wages.length === 0 ? (
              <p className="m-0 rounded-lg bg-ticket px-5 py-4 text-[0.98rem] leading-snug text-ticket-ink">
                <span className="font-display text-[0.85rem]">No wage slips in the recent ride log.</span> When Mort takes his next wage, its slip lands here with the transaction. Older wages are in the creator wallet’s history.
              </p>
            ) : (
              <ol className="m-0 flex list-none flex-col gap-3 p-0">
                {wages.slice(0, 4).map((w, i) => (
                  <li
                    key={w.key}
                    className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-md bg-ticket px-4 py-3 text-ticket-ink ${i % 2 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'}`}
                  >
                    <span className="font-display text-[0.8rem]">Wage slip</span>
                    <span className="tabular font-mono text-[1rem] font-bold">{w.eth.toFixed(4)} ETH</span>
                    <span className="font-mono text-[0.85rem] text-ticket-dim">{w.time}</span>
                    {w.tx && w.tx.startsWith('0x') ? (
                      <a href={`${explorerUrl}/tx/${w.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.85rem] text-sign-deep underline decoration-sign/40">
                        {shortHash(w.tx)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <button type="button" onClick={onOpenManifest} className="btn-night mt-14 cursor-pointer px-5 py-3 text-[0.95rem]">
          <ScrollText className="h-4 w-4" />
          Read the full ride manifest
        </button>
      </div>
    </section>
  );
}
