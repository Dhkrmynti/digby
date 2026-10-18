import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { Graveyard } from './Graveyard';
import { LiveNumber } from './LiveNumber';
import { STAGES, fmtPct, stageIndexFor } from './stages';

interface HeroProps {
  tokenSymbol: string;
  totalBurned: number;
  burnedPercent: number;
  graves: number;
  escrow: number;
  threshold: number;
  fill: number;
  nextCycle: 'burn' | 'keep';
  live: boolean;
  running: boolean;
  burialKey: string | null;
  tokenAddress: string;
  copiedCA: boolean;
  onCopyCA: () => void;
  buyHref: string;
  chartHref: string;
  onPoke: () => void;
  pokes: number;
  say: string;
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(n));

/**
 * The first view: the graveyard itself, live. Headstones are real burials, the lantern on
 * the post is the fee escrow filling, and Digby digs when the night shift is mid-run.
 * Under the grass: what is buried, how much of the supply that is, and the way to buy.
 */
export function Hero(props: HeroProps) {
  const { tokenSymbol, totalBurned, burnedPercent, graves, threshold, fill, nextCycle, live, running, burialKey, tokenAddress, copiedCA, onCopyCA, buyHref, chartHref, onPoke, pokes, say } = props;
  const stage = STAGES[stageIndexFor(burnedPercent)];
  const yardRef = useRef<HTMLDivElement>(null);

  // as the camera sinks, the name lifts off the sky in steps, like a sprite leaving the screen
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('[data-hero-title]', {
          yPercent: -60,
          autoAlpha: 0,
          ease: 'steps(8)',
          scrollTrigger: { trigger: yardRef.current, start: 'top top', end: '45% top', scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: yardRef },
  );

  // his reply hangs over his head for a few seconds, then he goes back to leaning on the shovel
  const [talking, setTalking] = useState(false);
  useEffect(() => {
    if (!pokes) return;
    setTalking(true);
    const id = window.setTimeout(() => setTalking(false), 3600);
    return () => window.clearTimeout(id);
  }, [pokes]);

  const empty = graves === 0 && totalBurned <= 0;
  const pct = Math.round(fill * 100);
  const shift = nextCycle === 'burn' ? 'a burial' : "Digby's wages";
  const lanternLine = !live
    ? 'The lantern lights at launch.'
    : running
      ? 'The night shift is out right now.'
      : `The lantern is ${pct}% full${threshold ? ` of ${threshold.toFixed(2)} ETH` : ''}. Next shift: ${shift}.`;

  return (
    <section id="yard" aria-labelledby="hero-title" className="relative">
      <h1 id="hero-title" className="sr-only">
        DIGBY ({tokenSymbol}), the gravedigger who buries the supply
      </h1>
      {/* phones: the name sits above the yard so the sky can stay clear */}
      <div className="px-4 pb-3 pt-20 sm:hidden">
        <div className="logo m-0 text-[3.6rem]" aria-hidden="true">
          DIGBY
        </div>
        <p className="m-0 mt-2 font-logo text-[1.35rem] font-medium leading-tight text-cream">He buries the supply.</p>
      </div>

      <div ref={yardRef} className="relative">
        <Graveyard
          descend
          stage={stage.n}
          lantern={fill}
          graves={graves}
          digging={running}
          burialKey={burialKey}
          pokeKey={pokes}
          onPoke={onPoke}
          say={talking ? say : undefined}
          className="h-[16.5rem] w-full sm:h-[min(66svh,44rem)] sm:min-h-[27rem]"
          label={`Digby the gravedigger in his graveyard at night, stage ${stage.n} (${stage.name}). ${graves ? `${graves} headstones, one per burial.` : 'Plot number 1 is dug and staked, waiting for the first burial.'} The fee lantern is ${pct}% full.`}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden px-10 pt-24 sm:block lg:px-16">
          <div data-hero-title className="mx-auto max-w-[84rem]">
            <div className="logo m-0 text-[clamp(5rem,10vw,8.5rem)]" aria-hidden="true">
              DIGBY
            </div>
            <p className="m-0 mt-3 max-w-[20ch] font-logo text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-tight text-cream">He buries the supply. Nothing comes back up.</p>
          </div>
        </div>
      </div>

      {/* under the grass: a stone tablet set in the topsoil carries the count, the way a cemetery gate would */}
      <div className="soil relative px-4 pb-14 pt-6 sm:px-10 sm:pt-10 lg:px-16">
        <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div className="tablet min-w-0 px-5 pb-6 pt-5 sm:px-9 sm:pb-8 sm:pt-7">
            {empty ? (
              <>
                <p className="m-0 font-logo text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-none">Plot #1 is dug.</p>
                <p className="m-0 mt-3 max-w-[46ch] text-[1rem] leading-relaxed sm:mt-4 sm:text-[1.05rem]">
                  {live ? lanternLine : 'The lantern lights at launch.'} When it fills, the night shift buys {tokenSymbol} and Digby gives the first burial the first headstone. Every one after it lands on chain.
                </p>
              </>
            ) : (
              <>
                <p className="label m-0 text-[0.75rem] text-stone-lo">buried at 0x…dEaD</p>
                <p className="m-0 mt-2 flex flex-wrap items-baseline gap-x-3 font-logo font-bold leading-none">
                  <LiveNumber value={totalBurned} format={fmt} className="tabular text-[clamp(2.4rem,6.4vw,5rem)]" />
                  <span className="text-[clamp(1.1rem,1.8vw,1.6rem)]">{tokenSymbol}</span>
                </p>
                <p className="m-0 mt-4 max-w-[48ch] text-[1.05rem] leading-relaxed">
                  That is <strong className="font-bold tabular">{fmtPct(burnedPercent)}%</strong> of the supply, in <strong className="font-bold tabular">{graves}</strong> {graves === 1 ? 'grave' : 'graves'}. {lanternLine}
                </p>
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-4">
              <a href={buyHref} target="_blank" rel="noreferrer" className="btn-buy px-6 py-4 text-[1rem] no-underline">
                Buy {tokenSymbol}
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <a href={chartHref} target="_blank" rel="noreferrer" className="btn-chip no-underline">
                Chart
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            {tokenAddress ? (
              <button type="button" onClick={onCopyCA} className="ca-field w-full max-w-[34rem] cursor-pointer text-left" title="Copy contract address">
                <span className="min-w-0">
                  <span className="label block text-[0.65rem] text-mist">contract address</span>
                  <span className="block truncate font-mono text-[0.85rem] text-cream">{tokenAddress}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-ecto" aria-hidden="true">
                  {copiedCA ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </span>
                <span className="sr-only" aria-live="polite">
                  {copiedCA ? 'Copied' : ''}
                </span>
              </button>
            ) : (
              <div className="ca-field max-w-[34rem] py-3 pr-4">
                <span className="min-w-0">
                  <span className="label block text-[0.65rem] text-mist">contract address</span>
                  <span className="block font-logo text-[1.05rem] text-cream">Posted here the moment {tokenSymbol} launches.</span>
                </span>
              </div>
            )}
            <p className="m-0 text-[0.92rem] text-moon/85">Tap Digby in the yard. He talks back.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
