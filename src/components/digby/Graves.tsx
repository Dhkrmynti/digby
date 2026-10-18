import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { Check, Copy, ExternalLink, ScrollText } from 'lucide-react';
import type { ActivityLog, BurnLedgerEntry } from '../../types';
import { SpriteCard } from './Sprite';

interface GravesProps {
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

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EPITAPHS = ['rest in supply', 'gone for good', 'no refunds', 'here lies a bag', 'dug at night', 'one less', 'never coming back', 'another one for the ground'];

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
const buried = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;

interface WageRun {
  key: string;
  eth: number;
  time: string;
  tx: string;
}

/** Every burial as a headstone, newest first, each with its transaction. Then the wage runs, in the open. */
export function Graves({ burnLedger, logs, totalBurned, tokenSymbol, deadAddress, explorerUrl, copiedDead, onCopyDead, onOpenLog }: GravesProps) {
  const graves = useMemo(() => {
    const chrono = [...burnLedger].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return chrono
      .filter((e) => e.cycleType !== 'keep' && (buried(e) > 0 || e.burnTx))
      .map((e, i) => ({ e, n: i + 1 }))
      .reverse();
  }, [burnLedger]);

  // wage runs: keep entries from the ledger, plus the bot's "forwarded … to treasury" log lines
  const wages = useMemo(() => {
    const out: WageRun[] = [];
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

  const ref = useRef<HTMLElement>(null);
  // each headstone comes up out of the ground the way it does in the yard, in six steps
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.batch('[data-stone]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.from(els, { yPercent: 35, autoAlpha: 0, duration: 0.5, ease: 'steps(6)', stagger: 0.08 }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [graves.length] },
  );

  const shown = graves.slice(0, 12);
  const biggest = Math.max(0, ...graves.map(({ e }) => buried(e)));

  return (
    <section ref={ref} id="graves" aria-labelledby="graves-title" className="relative px-4 pb-20 pt-20 sm:px-10 sm:pt-28 lg:px-16">
      <div className="mx-auto max-w-[84rem]">
        <div className="max-w-[46rem]">
          <h2 id="graves-title" className="display m-0 text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
            Every grave, on chain
          </h2>
          <p className="m-0 mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-mist">
            Each burial gets a headstone with the amount and the transaction, read straight from Robinhood Chain. Newest first.
          </p>
        </div>

        <div className="slab mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <span className="label text-[0.8rem] text-cream">
            graves: <span className="text-ecto tabular">{graves.length}</span>
          </span>
          <span className="flex min-w-0 items-center gap-3">
            <span className="label shrink-0 text-[0.7rem] text-mist">the yard</span>
            <span className="truncate font-mono text-[0.8rem] text-cream" title={deadAddress}>
              {deadAddress.slice(0, 8)}…{deadAddress.slice(-6)}
            </span>
            <button type="button" onClick={onCopyDead} className="btn-chip shrink-0 cursor-pointer px-3 py-1.5 text-[0.7rem]">
              {copiedDead ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedDead ? 'copied' : 'copy'}
            </button>
          </span>
        </div>

        {shown.length === 0 ? (
          <div data-log-row className="mt-8 grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-5">
            <SpriteCard art="tomb" label="An empty plot waiting for its first headstone" className="w-full shadow-[0_0_0_3px_var(--color-ink-soft)]" />
            <p className="m-0 max-w-[48ch] font-logo text-[1.2rem] font-medium leading-snug text-cream">
              {totalBurned > 0 ? `${compact(totalBurned)} ${tokenSymbol} already in the ground. Reading the graves from the chain…` : 'No graves yet. Digby is waiting with his shovel. The first one shows up here with its transaction.'}
            </p>
          </div>
        ) : (
          <ol className="m-0 mt-10 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-x-5 gap-y-8 p-0" aria-label="Recent graves">
            {shown.map(({ e, n }) => {
              const tx = e.burnTx || e.buyTx || e.claimTx;
              const amt = buried(e);
              const top = amt > 0 && amt === biggest;
              return (
                <li key={e.id} data-stone className="headstone flex flex-col items-center px-5 pb-5 pt-9 text-center">
                  <span className="label text-[0.7rem] text-ink">{top ? 'the biggest one · ' : ''}grave {n}</span>
                  <span className="mt-1 font-logo text-[1rem] font-bold uppercase tracking-[0.1em] text-stone-lo">RIP</span>
                  <span className="mt-2 font-logo text-[clamp(1.5rem,2.2vw,1.9rem)] font-bold leading-none tabular text-ink" title={`${fmt(amt)} ${tokenSymbol}`}>
                    {amt >= 1e6 ? compact(amt) : fmt(amt)}
                  </span>
                  <span className="label mt-1 text-[0.7rem] text-ink">{tokenSymbol}</span>
                  <span className="mt-3 text-[0.9rem] italic text-ink/80">{EPITAPHS[(n - 1) % EPITAPHS.length]}</span>
                  <span className="mt-1 text-[0.8rem] text-ink/70">{when(e)}</span>
                  {tx && tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${tx}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-mono text-[0.78rem] text-ink underline decoration-ink/40">
                      {shortHash(tx)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}

        <div className="mt-10">
          <button type="button" onClick={onOpenLog} className="btn-chip cursor-pointer">
            <ScrollText className="h-4 w-4" />
            open the full register
          </button>
        </div>

        <div id="wages" className="mt-20 grid grid-cols-[minmax(0,1fr)] gap-8 border-t-[3px] border-dashed border-ink-soft pt-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-5">
            <SpriteCard art="sack" label="Digby's wage sack" className="w-full shadow-[0_0_0_3px_var(--color-ink-soft)]" />
            <div>
              <h2 className="display m-0 text-[clamp(1.9rem,3.2vw,2.7rem)] text-cream">Digby&apos;s wages</h2>
              <p className="m-0 mt-3 max-w-[44ch] text-[1.03rem] leading-relaxed text-mist">
                Every other shift pays the gravedigger instead: the ETH goes to the project wallet that keeps the yard running. Nothing hidden, so those runs are listed here too.
              </p>
            </div>
          </div>
          {wages.length === 0 ? (
            <p className="m-0 text-[1rem] leading-relaxed text-mist">No wage run in the recent log. The next one shows up here with its transaction. Older ones are in the project wallet’s history.</p>
          ) : (
            <ol className="m-0 list-none p-0">
              {wages.slice(0, 4).map((f) => (
                <li key={f.key} data-log-row className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-[3px] border-dashed border-ink-soft py-3">
                  <span className="label text-[0.7rem] text-gold">wages</span>
                  <span className="font-logo text-[1.15rem] font-medium tabular text-cream">{f.eth.toFixed(4)} ETH</span>
                  <span className="text-[0.85rem] text-mist">{f.time}</span>
                  {f.tx && f.tx.startsWith('0x') ? (
                    <a href={`${explorerUrl}/tx/${f.tx}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[0.8rem] text-cream underline decoration-cream/40">
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
