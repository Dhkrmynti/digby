import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ExternalLink, X } from 'lucide-react';
import type { BurnLedgerEntry } from '../../types';
import { sounds } from '../../utils/audio';
import { SpriteCard } from './Sprite';

gsap.registerPlugin(useGSAP);

interface RipAlertProps {
  burnLedger: BurnLedgerEntry[];
  tokenSymbol: string;
  explorerUrl: string;
  stage: number;
  sound: boolean;
  /** a fresh burial: its id while the alert is up, so the yard can act it out */
  onBurial: (id: string | null) => void;
}

interface Burial {
  id: string;
  amount: number;
  tx: string;
}

/** A burial only counts as news if it happened in the last few minutes; older ones are history. */
const RECENT_MS = 15 * 60 * 1000;
const SHOW_MS = 9000;
const buried = (e: BurnLedgerEntry) => e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0;
const msOf = (e: BurnLedgerEntry) => (e.timestamp && e.timestamp < 1e12 ? e.timestamp * 1000 : e.timestamp || 0);
const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);
const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(n));

/** The grave bell: two shovel thunks, then a two-note bell with a low hum under it. */
function bell() {
  sounds.playTone(110, 'square', 0.07, 0.06);
  setTimeout(() => sounds.playTone(110, 'square', 0.07, 0.06), 260);
  setTimeout(() => sounds.playTone(1318.5, 'square', 0.45, 0.05), 620);
  setTimeout(() => {
    sounds.playTone(987.8, 'square', 0.7, 0.05);
    sounds.playTone(493.9, 'triangle', 0.9, 0.1);
  }, 820);
}

/**
 * When the night shift lands a real burial while the page is open, the bell rings and the
 * notice says how much went in the ground, with the transaction.
 * Add ?rip (or ?rip=1234567) to the URL to play one for a recording.
 */
export function RipAlert({ burnLedger, tokenSymbol, explorerUrl, stage, sound, onBurial }: RipAlertProps) {
  const [burial, setBurial] = useState<Burial | null>(null);
  const seen = useRef<Set<string> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // a new burial: one not on the page before, written in the last few minutes
  useEffect(() => {
    const all = burnLedger.filter((e) => e.cycleType !== 'keep' && buried(e) > 0);
    if (!seen.current) {
      seen.current = new Set(all.map((e) => e.id));
      return;
    }
    const known = seen.current;
    const fresh = all.filter((e) => !known.has(e.id));
    fresh.forEach((e) => known.add(e.id));
    const news = fresh.filter((e) => Date.now() - msOf(e) < RECENT_MS).sort((a, b) => msOf(b) - msOf(a))[0];
    if (news) setBurial({ id: news.id, amount: buried(news), tx: news.burnTx || news.buyTx || '' });
  }, [burnLedger]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has('rip')) return;
    const id = window.setTimeout(() => setBurial({ id: `demo-${Date.now()}`, amount: Number(q.get('rip')) || 1234567, tx: '' }), 2500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!burial) return;
    onBurial(burial.id);
    if (soundRef.current) bell();
    const id = window.setTimeout(() => setBurial(null), SHOW_MS);
    return () => {
      window.clearTimeout(id);
      onBurial(null);
    };
  }, [burial, onBurial]);

  useGSAP(
    () => {
      if (!burial || !boxRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(boxRef.current, { yPercent: 140, duration: 0.4, ease: 'steps(5)' });
      });
      return () => mm.revert();
    },
    { dependencies: [burial?.id] },
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6" role="status" aria-live="polite">
      {burial ? (
        <div ref={boxRef} key={burial.id} className="slab pointer-events-auto relative flex w-full max-w-[26rem] items-center gap-4 p-3 pr-10 shadow-[0_0_0_3px_var(--color-ecto),0_18px_34px_-14px_rgba(0,0,0,0.8)]">
          <SpriteCard art="rip" stage={stage} label="Digby ringing the grave bell" className="w-20 shrink-0 shadow-[0_0_0_3px_var(--color-ink-soft)]" />
          <div className="min-w-0 flex-1">
            <div className="nom-blink font-logo text-[1.9rem] font-bold leading-none text-blood">RIP!</div>
            <div className="mt-1 text-[0.98rem] text-cream" title={`${fmt(burial.amount)} ${tokenSymbol}`}>
              Digby buried {compact(burial.amount)} {tokenSymbol}
            </div>
            {burial.tx.startsWith('0x') ? (
              <a href={`${explorerUrl}/tx/${burial.tx}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-[0.78rem] text-ecto underline decoration-ecto/40">
                see the burial on chain
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="label mt-1 text-[0.65rem] text-mist">gone for good · 0x…dEaD</div>
            )}
          </div>
          <button type="button" onClick={() => setBurial(null)} className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center text-mist hover:text-ecto" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
