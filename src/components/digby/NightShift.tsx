import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SpriteCard, useSpriteClock } from './Sprite';
import { coinSprite, type CardArt } from './canvas';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface NightShiftProps {
  tokenSymbol: string;
  escrow: number;
  threshold: number;
  fill: number;
  claimedETH: number;
  retainedETH: number;
  routerName: string;
  nextCycle: 'burn' | 'keep';
  live: boolean;
}

interface Step {
  art: CardArt;
  stage?: number;
  level?: number;
  title: string;
  body: ReactNode;
  readingLabel: string;
  reading: string;
}

/** A spinning $DIGBY coin on the shared sprite clock. */
function SpinningCoin({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useSpriteClock(ref, (t) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 10, 10);
    const w = [10, 7, 3, 7][(t >> 1) % 4];
    ctx.drawImage(coinSprite(), Math.round(5 - w / 2), 0, w, 10);
  });
  return <canvas ref={ref} width={10} height={10} aria-hidden="true" className={`pixelated block ${className}`} />;
}

/**
 * How a burial happens, told as a dig. A shaft runs down the left of the steps; as you scroll,
 * it is dug deeper and a bought-back coin falls down it, lighting each step as it passes,
 * until it drops into the grave at the bottom. Every reading on the right is live from the engine.
 */
export function NightShift({ tokenSymbol, escrow, threshold, fill, claimedETH, retainedETH, routerName, nextCycle, live }: NightShiftProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const shaft = ref.current?.querySelector('[data-shaft]');
        if (!shaft) return;
        const steps = gsap.utils.toArray<HTMLElement>('[data-step]');
        steps.forEach((el) => (el.dataset.lit = 'false'));
        // the shaft is dug in steps of 8px and the coin rides its bottom edge
        const dig = { trigger: shaft, start: 'top 62%', end: 'bottom 62%', scrub: true };
        gsap.fromTo('[data-shaft-dug]', { scaleY: 0 }, { scaleY: 1, ease: 'steps(32)', scrollTrigger: dig });
        gsap.set('[data-coin]', { top: 0 });
        gsap.fromTo('[data-coin]', { y: 0 }, { y: () => (shaft as HTMLElement).offsetHeight, ease: 'steps(32)', immediateRender: true, scrollTrigger: { ...dig, invalidateOnRefresh: true } });
        steps.forEach((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top 62%',
            onEnter: () => (el.dataset.lit = 'true'),
            onLeaveBack: () => (el.dataset.lit = 'false'),
          }),
        );
        return () => steps.forEach((el) => delete el.dataset.lit);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const steps: Step[] = [
    {
      art: 'lantern',
      level: Math.round(fill * 4),
      title: 'Every trade feeds the lantern',
      body: <>Each {tokenSymbol} buy or sell pays a small creator fee in ETH. It collects in the fee lantern, the Pons fee escrow, and the lantern glows a step brighter.</>,
      readingLabel: 'in the lantern now',
      reading: `${escrow.toFixed(4)} ETH · ${Math.round(fill * 100)}%`,
    },
    {
      art: 'idle',
      stage: 3,
      title: 'The night shift claims it',
      body: <>The night shift is the bot. It checks the lantern around the clock and, once it holds {threshold ? `${threshold.toFixed(2)} ETH` : 'enough'}, claims all of it on its own.</>,
      readingLabel: 'ETH claimed so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
    },
    {
      art: 'coin',
      title: `It buys ${tokenSymbol}`,
      body: <>On a burial shift every bit of that ETH market-buys {tokenSymbol} on {routerName}. Real buying, every time, in the open.</>,
      readingLabel: 'buying on',
      reading: routerName.replace(/^the /, ''),
    },
  ];

  const outcomes = [
    {
      art: 'tomb' as const,
      on: nextCycle === 'burn',
      title: 'Odd shifts: Digby buries it',
      body: <>Every {tokenSymbol} bought goes to 0x…dEaD, where nothing can ever move it again. A new headstone goes up in the yard and the supply is smaller for good.</>,
    },
    {
      art: 'sack' as const,
      on: nextCycle === 'keep',
      title: "Even shifts: Digby's wages",
      body: <>The claimed ETH goes to the project wallet that keeps the yard running, paid in the open and listed next to the graves. {retainedETH > 0 ? `${retainedETH.toFixed(4)} ETH so far.` : ''}</>,
    },
  ];

  return (
    <section ref={ref} id="shift" aria-labelledby="shift-title" className="underground grass-edge dither-bottom relative px-4 pb-24 pt-20 sm:px-10 sm:pt-24 lg:px-16">
      <div className="mx-auto max-w-[84rem]">
        <div className="max-w-[46rem]">
          <h2 id="shift-title" className="display m-0 text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
            The night shift
          </h2>
          <p className="m-0 mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-cream/85">
            Nobody presses a button. Trading fills the lantern, a bot does the rest, and every step lands on Robinhood Chain where anyone can check it.
          </p>
        </div>

        <div className="relative mt-12 pl-12 sm:pl-20">
          {/* the shaft: dug deeper as you scroll, with the coin falling down it */}
          <div data-shaft className="absolute bottom-24 left-2 top-6 w-6 sm:left-5 sm:w-8" aria-hidden="true">
            <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[repeating-linear-gradient(var(--color-dirt-2)_0_6px,transparent_6px_12px)]" />
            <div data-shaft-dug className="absolute inset-0 origin-top bg-dirt-lo shadow-[inset_3px_0_0_var(--color-ink),inset_-3px_0_0_var(--color-dirt-2)]" />
            <div data-coin className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: '100%' }}>
              <SpinningCoin className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>

          <ol className="m-0 list-none p-0">
            {steps.map((s) => (
              <li key={s.title} data-step className="step grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-3 border-t-[3px] border-dashed border-dirt-2 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,14rem)] sm:gap-x-8">
                <SpriteCard art={s.art} stage={s.stage} level={s.level} label={s.title} className="step-art w-full" />
                <div className="min-w-0">
                  <h3 className="m-0 font-logo text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold leading-tight text-cream">{s.title}</h3>
                  <p className="m-0 mt-2 max-w-[56ch] text-[1rem] leading-relaxed text-cream/85">{s.body}</p>
                </div>
                <div className="col-span-2 min-w-0 sm:col-span-1 sm:justify-self-end sm:text-right">
                  <div className="label text-[0.65rem] text-cream/70">{s.readingLabel}</div>
                  <div className="mt-1 font-logo text-[1.3rem] font-medium tabular text-cream">{s.reading}</div>
                </div>
              </li>
            ))}

            <li data-step className="step border-t-[3px] border-dashed border-dirt-2 py-6">
              <h3 className="m-0 font-logo text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold leading-tight text-cream">Then the shifts take turns</h3>
              <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
                {outcomes.map((o) => (
                  <div key={o.title} className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-4 bg-dirt-lo p-4 ${o.on && live ? 'shadow-[0_0_0_3px_var(--color-ecto)]' : 'shadow-[0_0_0_3px_var(--color-dirt-2)]'}`}>
                    <SpriteCard art={o.art} label={o.title} className="w-full" />
                    <div className="min-w-0">
                      {o.on && live ? <div className="label mb-1 text-[0.65rem] text-ecto">next up</div> : null}
                      <h4 className="m-0 font-logo text-[1.35rem] font-bold leading-tight text-cream">{o.title}</h4>
                      <p className="m-0 mt-2 text-[0.98rem] leading-relaxed text-cream/85">{o.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
