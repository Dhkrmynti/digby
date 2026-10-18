import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { SpriteCard } from './Sprite';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StoryProps {
  tokenSymbol: string;
  deadAddress: string;
  buyHref: string;
  tokenAddress: string;
  copiedCA: boolean;
  onCopyCA: () => void;
}

/**
 * Digby's story, set as an obituary page on parchment, then the last word under the moon.
 */
export function Story({ tokenSymbol, deadAddress, buyHref, tokenAddress, copiedCA, onCopyCA }: StoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // the obituary unrolls down out of the night as you reach it
        gsap.fromTo(
          '[data-parchment]',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', ease: 'steps(12)', scrollTrigger: { trigger: '[data-parchment]', start: 'top 92%', end: 'top 30%', scrub: true } },
        );
        // the last line drops into the ground one word at a time, like clods off a shovel
        gsap.from('[data-clod]', {
          yPercent: -120,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'steps(5)',
          stagger: 0.14,
          scrollTrigger: { trigger: '[data-finale]', start: 'top 75%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const profile = [
    ['Name', 'Digby'],
    ['Ticker', tokenSymbol],
    ['Lives at', `${deadAddress.slice(0, 6)}…${deadAddress.slice(-4)}, a graveyard on Robinhood Chain`],
    ['Job', `Buries every ${tokenSymbol} the night shift buys back`],
    ['Personality', 'Grumpy, loyal, yawns a lot. Has never missed a shift.'],
    ['Days off', 'None so far'],
  ];

  return (
    <div ref={ref}>
      <section data-parchment id="story" aria-labelledby="story-title" className="paper relative px-4 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0">
            <h2 id="story-title" className="display m-0 max-w-[18ch] text-[clamp(2.4rem,5vw,4.2rem)] text-pen">
              Somebody has to put it in the ground
            </h2>
            <div className="mt-8 grid max-w-[62ch] gap-5 text-[1.08rem] leading-relaxed text-pen">
              <p className="m-0">
                Every token ever sent to 0x…dEaD had to go somewhere. Digby is the one who puts it there. He has kept the graveyard at the dead address for longer than anyone can check: a hooded skeleton with a shovel, a lantern, and no days off.
              </p>
              <p className="m-0">
                The deal never changes. Every {tokenSymbol} trade pays a little ETH into his fee lantern. When the lantern is full, the night shift claims it. On a burial shift it buys {tokenSymbol} on the open market and hands the bag to Digby, who digs a grave and buries it. Nothing he buries comes back up.
              </p>
              <p className="m-0">
                On the other shifts the ETH is his wages, paid to the project wallet that keeps the yard running and listed right next to the graves. Every grave gets a headstone, every headstone lets a ghost out, and every percent of the supply in the ground earns Digby new gear.
              </p>
            </div>
          </div>

          <aside className="min-w-0 self-start bg-paper-shade p-6 shadow-[0_0_0_3px_var(--color-pen)] sm:p-8" aria-label="Digby's profile">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-5">
              <SpriteCard art="rip" stage={3} label="Digby with a RIP speech bubble" className="w-full shadow-[0_0_0_3px_var(--color-pen)]" />
              <div>
                <div className="label text-[0.7rem] text-hood">keeper of 0x…dEaD</div>
                <div className="mt-1 font-logo text-[2.2rem] font-bold leading-none text-pen">Digby</div>
              </div>
            </div>
            <dl className="m-0 mt-6 grid gap-3">
              {profile.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-3 border-b-2 border-dashed border-pen/25 pb-3">
                  <dt className="label pt-0.5 text-[0.68rem] text-hood">{k}</dt>
                  <dd className="m-0 text-[1rem] text-pen">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 mt-6 font-logo text-[1.5rem] font-medium leading-tight text-pen">“Another one for the ground.”</p>
          </aside>
        </div>
      </section>

      <section data-finale aria-labelledby="finale-title" className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[84rem] flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="finale-title" className="logo m-0 max-w-[15ch] text-[clamp(3rem,7vw,6rem)]" aria-label="Another one for the ground.">
              {'Another one for the ground.'.split(' ').map((word, i) => (
                <span key={i} aria-hidden="true" className="inline-block whitespace-pre">
                  <span data-clod className="inline-block">
                    {word}
                  </span>{' '}
                </span>
              ))}
            </h2>
            <p className="m-0 mt-5 max-w-[44ch] text-[1.1rem] leading-relaxed text-mist">
              Every trade keeps the lantern lit. Every full lantern is another grave. Digby is already holding the shovel.
            </p>
          </div>
          <div className="flex w-full max-w-[30rem] flex-col gap-4">
            <a href={buyHref} target="_blank" rel="noreferrer" className="btn-buy w-[calc(100%-8px)] px-6 py-4 text-[1.05rem] no-underline">
              Buy {tokenSymbol}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            {tokenAddress ? (
              <button type="button" onClick={onCopyCA} className="ca-field w-full cursor-pointer text-left" title="Copy contract address">
                <span className="min-w-0 truncate font-mono text-[0.85rem] text-cream">{tokenAddress}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-ecto" aria-hidden="true">
                  {copiedCA ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
