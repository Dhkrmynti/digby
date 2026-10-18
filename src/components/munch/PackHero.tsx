import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Check, Copy, ScrollText } from 'lucide-react';
import { Device, LCD_CENTER, LCD_SIZE } from './Device';
import { Pet } from './Pet';
import { COIN, ICONS, PixelArt, Sprite, LCD } from './sprites';
import { EGG_CRACKS, STAGES, crackLevel, fmtPct, stageIndexFor } from './stages';
import { LiveNumber } from './LiveNumber';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface PackHeroProps {
  tokenSymbol: string;
  totalBurned: number;
  burnedPercent: number;
  escrow: number;
  threshold: number;
  fill: number;
  nextCycle: 'burn' | 'keep';
  live: boolean;
  running: boolean;
  tokenAddress: string;
  copiedCA: boolean;
  onCopyCA: () => void;
  buyHref: string;
  chartHref: string;
  onOpenLog: () => void;
  onFeed: () => void;
  fed: number;
  say: string;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(n));
const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n);
/** On the phone-sized screen there is room for about five characters of number. */
const short = (n: number) => (n < 1e4 ? fmt(n) : new Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 3, roundingMode: 'floor' } as Intl.NumberFormatOptions).format(n));
const SEGMENTS = 10;

/** What the handheld's screen shows in the pack: the live pet, what it has eaten, and how hungry it is. */
function PackScreen({ stageIdx, chewing, totalBurned, burnedPercent, fill, nextCycle, live, tokenSymbol, dropKey }: { stageIdx: number; chewing: boolean; totalBurned: number; burnedPercent: number; fill: number; nextCycle: 'burn' | 'keep'; live: boolean; tokenSymbol: string; dropKey: number }) {
  const stage = STAGES[stageIdx];
  const lit = Math.round(fill * SEGMENTS);
  // A small screen (the phone) drops the menu strip and gives the number the room: what it ate is the point
  return (
    <div className="flex h-full flex-col px-[5cqw] pb-[4cqw] pt-[3.5cqw] font-lcd text-lcd-ink @max-[13rem]:px-[6cqw] @max-[13rem]:pt-[5cqw]">
      {/* the menu strip along the top of the screen */}
      <div className="flex items-center justify-between @max-[13rem]:hidden">
        {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((k) => (
          <PixelArt key={k} rows={ICONS[k]} pal={k === 'life' ? LCD : { k: '#8a9666' }} className="h-[6cqw] w-[6cqw]" />
        ))}
      </div>

      <div className="mt-[2.5cqw] flex min-h-0 flex-1 items-center gap-[4cqw] @max-[13rem]:mt-0 @max-[13rem]:gap-[3cqw]">
        <div className="relative flex h-full w-[38%] shrink-0 items-end justify-center @max-[13rem]:w-[32%]">
          <Pet stage={stage.key} crack={crackLevel(burnedPercent)} chewing={chewing} className="h-[30cqw] w-[30cqw]" title={`MUNCH, ${stage.name} stage`} />
          {dropKey > 0 ? (
            <svg key={dropKey} viewBox="0 0 8 8" className="lcd-drop absolute left-1/2 top-0 h-[7cqw] w-[7cqw] -translate-x-1/2" shapeRendering="crispEdges" aria-hidden="true">
              <Sprite rows={COIN} pal={LCD} />
            </svg>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 leading-none">
          <div className="text-[4.6cqw] uppercase @max-[13rem]:text-[6.5cqw]">eaten</div>
          <div className="mt-[1cqw] truncate text-[12cqw] tabular @max-[13rem]:text-[20cqw]" title={`${fmt(totalBurned)} ${tokenSymbol}`}>
            <LiveNumber value={totalBurned} format={(n) => (n >= 1e6 ? compact(n) : fmt(n))} className="@max-[13rem]:hidden" />
            <LiveNumber value={totalBurned} format={short} className="hidden @max-[13rem]:inline" />
          </div>
          <div className="mt-[1.5cqw] text-[4.6cqw] @max-[13rem]:text-[6cqw]">{fmtPct(burnedPercent)}% of supply</div>
          <div className="mt-[2.5cqw] inline-block bg-lcd-ink px-[1.5cqw] py-[0.6cqw] text-[4.2cqw] uppercase text-lcd @max-[13rem]:text-[5.4cqw]">{stage.key === 'egg' ? `egg · ${crackLevel(burnedPercent)}/${EGG_CRACKS} cracks` : `stage: ${stage.name}`}</div>
        </div>
      </div>

      <div className="mt-[2.5cqw]">
        <div className="flex justify-between text-[4.2cqw] uppercase @max-[13rem]:text-[5.6cqw]">
          <span>hunger</span>
          <span>{!live ? 'asleep' : nextCycle === 'burn' ? 'next: meal' : 'next: snack jar'}</span>
        </div>
        <div className="mt-[1cqw] grid h-[5cqw] gap-[1cqw] @max-[13rem]:h-[7cqw] border-[0.8cqw] border-lcd-ink p-[0.8cqw]" style={{ gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))` }}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={i < lit ? 'bg-lcd-ink' : 'bg-lcd-ghost'} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** A small pixel arrow printed on the card, pointing at the screen. */
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 14 7" className={`h-4 w-8 shrink-0 ${flip ? '-scale-x-100' : ''}`} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="3" width="11" height="1" fill="currentColor" />
      <rect x="9" y="1" width="2" height="1" fill="currentColor" />
      <rect x="11" y="2" width="1" height="1" fill="currentColor" />
      <rect x="12" y="3" width="2" height="1" fill="currentColor" />
      <rect x="11" y="4" width="1" height="1" fill="currentColor" />
      <rect x="9" y="5" width="2" height="1" fill="currentColor" />
    </svg>
  );
}

/**
 * The first viewport: MUNCH's retail pack. Scrolling lifts the handheld out of its blister
 * and dives into the screen; the next chapter of the page is the screen.
 */
export function PackHero(props: PackHeroProps) {
  const { tokenSymbol, totalBurned, burnedPercent, escrow, threshold, fill, nextCycle, live, running, tokenAddress, copiedCA, onCopyCA, buyHref, chartHref, onOpenLog, onFeed, fed, say } = props;
  const sectionRef = useRef<HTMLElement>(null);
  const stageIdx = stageIndexFor(burnedPercent);
  const stage = STAGES[stageIdx];
  const [munching, setMunching] = useState(false);

  // feeding it by hand: a coin drops onto the screen and it chews for a moment
  useEffect(() => {
    if (!fed) return;
    setMunching(true);
    const id = window.setTimeout(() => setMunching(false), 1300);
    return () => window.clearTimeout(id);
  }, [fed]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // arrival: the logo letters pop up off the card, then the pack settles
        gsap.from(q('[data-logo-ch]'), { yPercent: 60, opacity: 0, duration: 0.5, ease: 'back.out(3)', stagger: 0.05, delay: 0.1 });
        gsap.from(q('[data-pack-line]'), { y: 18, opacity: 0, duration: 0.45, ease: 'steps(4)', stagger: 0.06, delay: 0.45 });
        gsap.from(q('[data-device]'), { y: 40, rotate: -4, opacity: 0, duration: 0.7, ease: 'back.out(1.6)', delay: 0.25 });

        const slot = q('[data-device-slot]')[0] as HTMLElement;
        // where the screen sits, measured from the untransformed slot, relative to the section
        const geo = () => {
          const s = slot.getBoundingClientRect();
          const sec = section.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const pinOffset = Math.min(0, vh - section.offsetHeight);
          const cx = s.left - sec.left + s.width * LCD_CENTER.x;
          const cy = s.top - sec.top + s.height * LCD_CENTER.y + pinOffset;
          const scale = Math.max(vw / (s.width * LCD_SIZE.w), vh / (s.height * LCD_SIZE.h)) * 1.12;
          return { dx: vw / 2 - cx, dy: vh / 2 - cy, scale };
        };

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: () => (section.offsetHeight > window.innerHeight + 2 ? 'bottom bottom' : 'top top'),
            end: '+=110%',
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.to(q('[data-pack-left]'), { x: -80, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q('[data-pack-right]'), { x: 80, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q('[data-pack-logo]'), { y: -90, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q('[data-pack-strip]'), { y: 90, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q('[data-sticker]'), { rotate: 40, scale: 0.6, autoAlpha: 0, duration: 0.25 }, 0)
          // the plastic peels up and away
          .to(q('[data-blister]'), { yPercent: -70, rotate: -10, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0.05)
          // the handheld comes up to your face, screen first
          .to(q('[data-device]'), { rotate: 0, duration: 0.2 }, 0.15)
          .to(
            q('[data-device]'),
            {
              x: () => geo().dx,
              y: () => geo().dy,
              scale: () => geo().scale,
              transformOrigin: `${LCD_CENTER.x * 100}% ${LCD_CENTER.y * 100}%`,
              duration: 0.75,
              ease: 'power3.in',
            },
            0.25,
          )
          .to(q('[data-lcd-flood]'), { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.86)
          // the screen is now the page: lift the pack away to show the chapter waiting under it
          .set(section, { autoAlpha: 0 }, 0.999);
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-hero aria-labelledby="hero-title" className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden bg-ink px-3 pb-3 pt-[4.5rem] sm:px-5 sm:pb-5 sm:pt-[5.25rem]">
      {/* the cardboard backer card */}
      <div data-card className="cardboard relative flex flex-1 flex-col rounded-[22px] px-4 pb-4 pt-9 sm:px-8 sm:pb-6 lg:px-10">
        {/* die-cut hang tab */}
        <span className="absolute left-1/2 top-3 h-[14px] w-24 -translate-x-1/2 rounded-full bg-ink shadow-[inset_0_3px_0_rgba(0,0,0,0.4)]" aria-hidden="true" />

        <header data-pack-logo className="text-center">
          <h1 id="hero-title" className="logo m-0 text-[clamp(3.6rem,10vw,7.4rem)]" aria-label="MUNCH">
            {'MUNCH'.split('').map((ch, i) => (
              <span key={i} data-logo-ch aria-hidden="true" className="inline-block" style={{ transform: `rotate(${[-4, 3, -2, 4, -3][i]}deg)` }}>
                {ch}
              </span>
            ))}
          </h1>
          <p data-pack-line className="m-0 mt-1 text-[clamp(1rem,1.6vw,1.25rem)] font-bold text-ink">
            The virtual pet that eats its own supply. <span className="whitespace-nowrap">{tokenSymbol} on Robinhood Chain.</span>
          </p>
        </header>

        <div className="mt-4 grid flex-1 items-center gap-4 lg:mt-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
          {/* printed callouts, left */}
          <div data-pack-left className="hidden flex-col items-end gap-10 text-right lg:flex">
            <div data-pack-line className="flex max-w-[19rem] items-center gap-3">
              <div>
                <p className="m-0 font-logo text-[1.35rem] leading-tight text-ink">Live on the screen</p>
                <p className="m-0 mt-1 text-[0.98rem] leading-snug text-ink">Every {tokenSymbol} it has ever eaten, read straight from the chain.</p>
              </div>
              <Arrow />
            </div>
            <div data-pack-line className="flex max-w-[19rem] items-center gap-3">
              <div>
                <p className="m-0 font-logo text-[1.35rem] leading-tight text-ink">It grows</p>
                <p className="m-0 mt-1 text-[0.98rem] leading-snug text-ink">Egg, munchlet, chomper, MUNCH. The more supply it eats, the bigger it gets. Now: {stage.name}.</p>
              </div>
              <Arrow />
            </div>
          </div>

          {/* the blister with the handheld inside */}
          <div className="relative mx-auto">
            <div data-blister className="blister pointer-events-none absolute -inset-x-6 -inset-y-5 sm:-inset-x-9 sm:-inset-y-7" aria-hidden="true" />
            <div data-device-slot className="relative w-[min(66vw,calc(40svh*0.766),24rem)] lg:w-[min(26vw,calc((100svh-24rem)*0.766),24rem)]">
              <div data-device className="relative will-change-transform" style={{ transform: 'rotate(-3deg)' }}>
                <Device
                  left={
                    <button type="button" onClick={onFeed} className="dev-btn" aria-label="Feed MUNCH a coin">
                      <span className="dev-label">feed</span>
                    </button>
                  }
                  center={
                    <a href={buyHref} target="_blank" rel="noreferrer" className="dev-btn" aria-label={`Buy ${tokenSymbol}`}>
                      <span className="dev-label">buy</span>
                    </a>
                  }
                  right={
                    <button type="button" onClick={onOpenLog} className="dev-btn" aria-label="Open the full log">
                      <span className="dev-label">log</span>
                    </button>
                  }
                >
                  <PackScreen stageIdx={stageIdx} chewing={munching || running} totalBurned={totalBurned} burnedPercent={burnedPercent} fill={fill} nextCycle={nextCycle} live={live} tokenSymbol={tokenSymbol} dropKey={fed} />
                </Device>
              </div>
            </div>
            {/* the sticker on the plastic */}
            <div data-sticker className="sticker absolute -right-4 -top-3 rotate-[12deg] sm:-right-10 sm:top-0" aria-hidden={totalBurned <= 0}>
              {totalBurned > 0 ? (
                <>
                  <span className="block text-[0.62rem] uppercase tracking-wide">already ate</span>
                  <span className="block font-logo text-[1.15rem] leading-none">{compact(totalBurned)}</span>
                  <span className="block text-[0.62rem] uppercase tracking-wide">{tokenSymbol}</span>
                </>
              ) : (
                <>
                  <span className="block text-[0.62rem] uppercase tracking-wide">eats only</span>
                  <span className="block font-logo text-[1.05rem] leading-none">{tokenSymbol}</span>
                </>
              )}
            </div>
          </div>

          {/* printed callouts, right */}
          <div data-pack-right className="hidden flex-col items-start gap-10 lg:flex">
            <div data-pack-line className="flex max-w-[19rem] items-center gap-3">
              <Arrow flip />
              <div>
                <p className="m-0 font-logo text-[1.35rem] leading-tight text-ink">Hunger</p>
                <p className="m-0 mt-1 text-[0.98rem] leading-snug text-ink">
                  Every trade drops ETH kibble in its bowl: <span className="font-mono text-[0.88rem]">{escrow.toFixed(4)}</span> of <span className="font-mono text-[0.88rem]">{threshold ? threshold.toFixed(2) : '—'}</span> ETH now.
                </p>
              </div>
            </div>
            <div data-pack-line className="flex max-w-[19rem] items-center gap-3">
              <Arrow flip />
              <div>
                <p className="m-0 font-logo text-[1.35rem] leading-tight text-ink">Full bowl, feeding time</p>
                <p className="m-0 mt-1 text-[0.98rem] leading-snug text-ink">The auto-feeder buys {tokenSymbol} and MUNCH eats it at 0x…dEaD. Every other feeding goes in the snack jar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* the action strip printed along the bottom of the card */}
        <div data-pack-strip className="mt-5 flex flex-col gap-3 lg:mt-3 lg:flex-row lg:items-center lg:justify-between">
          <div data-pack-line className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={buyHref} target="_blank" rel="noreferrer" className="btn-buy order-first px-7 py-3.5 text-[1.15rem] no-underline sm:order-none">
              buy {tokenSymbol}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            {tokenAddress ? (
              <button type="button" onClick={onCopyCA} className="ca-field min-w-0 cursor-pointer text-left sm:max-w-[25rem]" title="Copy contract address">
                <span className="min-w-0">
                  <span className="block text-[0.7rem] font-bold uppercase tracking-wide text-ink-soft">contract address</span>
                  <span className="block truncate font-mono text-[0.8rem] text-ink">{tokenAddress}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[0.75rem] font-bold text-cream">
                  {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCA ? 'copied' : 'copy'}
                </span>
              </button>
            ) : (
              <p className="m-0 rounded-2xl border-[3px] border-dashed border-ink/50 px-4 py-2.5 text-[0.95rem] font-semibold text-ink">The contract address is printed here at launch.</p>
            )}
            <div className="flex gap-2">
              <a href={chartHref} target="_blank" rel="noreferrer" className="btn-chip no-underline">
                chart
              </a>
              <button type="button" onClick={onOpenLog} className="btn-chip cursor-pointer" aria-label="Open the full log">
                <ScrollText className="h-4 w-4" />
                log
              </button>
            </div>
          </div>
          <div data-pack-line className="flex min-h-[2.5rem] items-center gap-3" aria-live="polite">
            <button type="button" onClick={onFeed} className="btn-chip cursor-pointer">
              <PixelArt rows={COIN} className="h-4 w-4" />
              feed it · {fed}
            </button>
            {/* a new line re-inks in on the LCD's steps */}
            <p key={say} className="speech reink m-0">
              {say}
            </p>
          </div>
        </div>
      </div>

      {/* the screen, filling everything at the end of the dive */}
      <div data-lcd-flood className="lcd pointer-events-none invisible absolute inset-0 z-30 opacity-0" aria-hidden="true" />
    </section>
  );
}
