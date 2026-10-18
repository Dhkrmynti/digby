import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BOWL, COIN, FEEDER, JAR, KIBBLE, LCD, MUNCH_OPEN, MUNCH_SHUT, Sprite } from './sprites';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeedingProps {
  tokenSymbol: string;
  escrow: number;
  threshold: number;
  fill: number;
  claimedETH: number;
  routerName: string;
  nextCycle: 'burn' | 'keep';
}

interface Step {
  name: string;
  body: ReactNode;
  readingLabel: string;
  reading: string;
}

const INK = '#2f3a22';
const MID = '#8a9666';
const BAR_X = 52;
const BAR_W = 56;

/** One feeding, drawn on a 160 by 100 pixel screen. */
function Scene({ still = false }: { still?: boolean }) {
  const label = { fontFamily: 'DotGothic16, monospace', fontSize: 5, fill: INK } as const;
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" shapeRendering="crispEdges">
      {/* trades, top left */}
      <Sprite rows={KIBBLE} x={6} y={6} px={2} pal={LCD} />
      <Sprite rows={KIBBLE} x={16} y={12} px={2} pal={LCD} />
      <text x="6" y="30" {...label}>TRADES</text>

      {/* the hunger bar and the bowl under it */}
      <rect x={BAR_X - 2} y="4" width={BAR_W + 4} height="8" fill={INK} />
      <rect x={BAR_X} y="6" width={BAR_W} height="4" fill="#c4cfa1" />
      <rect data-bar x={BAR_X} y="6" width={still ? BAR_W : 0} height="4" fill={MID} />
      <Sprite rows={BOWL} x={68} y={16} px={2} pal={LCD} />
      <text x="80" y="36" textAnchor="middle" {...label}>THE BOWL</text>

      {/* the auto-feeder */}
      <g data-feeder>
        <Sprite rows={FEEDER} x={68} y={42} px={2} pal={LCD} />
      </g>
      <text x="80" y="70" textAnchor="middle" {...label}>AUTO-FEEDER</text>

      {/* the jar, bottom left */}
      <Sprite rows={JAR} x={8} y={64} px={2} pal={LCD} />
      <text x="20" y="98" textAnchor="middle" {...label}>SNACK JAR</text>

      {/* MUNCH, bottom right: its mouth is 0x…dEaD */}
      <g data-munch-shut opacity={still ? 0 : 1}>
        <Sprite rows={MUNCH_SHUT} x={108} y={48} px={2} pal={LCD} />
      </g>
      <g data-munch-open opacity={still ? 1 : 0}>
        <Sprite rows={MUNCH_OPEN} x={108} y={48} px={2} pal={LCD} />
      </g>
      <text x="132" y="47" textAnchor="middle" {...label}>0x…dEaD</text>
      <rect x="0" y="99" width="160" height="1" fill={INK} />

      {/* what travels */}
      <g data-kibble opacity={still ? 0 : 1}>
        <Sprite rows={KIBBLE} px={2} pal={LCD} />
      </g>
      <g data-coin opacity={still ? 1 : 0} transform={still ? 'translate(124 64)' : undefined}>
        <Sprite rows={COIN} px={2} pal={LCD} />
      </g>
      <g data-jar-coin opacity={still ? 1 : 0} transform={still ? 'translate(12 56)' : undefined}>
        <Sprite rows={COIN} px={1} pal={LCD} />
      </g>
    </svg>
  );
}

const PHONE_LIVE = '(max-width: 899px) and (prefers-reduced-motion: no-preference)';

/** One feeding acted out on a scene, one second per step: kibble, bowl, feeder, coin, the mouth. */
function actOut(tl: gsap.core.Timeline, s: (sel: string) => Element[]) {
  gsap.set(s('[data-kibble]'), { x: 8, y: 8, opacity: 0 });
  // 1: kibble pops out of a trade and lands in the bowl
  tl.to(s('[data-kibble]'), { opacity: 1, duration: 0.1 }, 0.05)
    .to(s('[data-kibble]'), { x: 75, y: 14, duration: 0.7 }, 0.15)
    .to(s('[data-kibble]'), { opacity: 0, duration: 0.1 }, 0.85)
    // 2: the bar fills
    .to(s('[data-bar]'), { attr: { width: BAR_W }, duration: 0.9 }, 1.05)
    // 3: the bar empties into the feeder, which shakes
    .to(s('[data-bar]'), { attr: { width: 0 }, duration: 0.4 }, 2.05)
    .set(s('[data-kibble]'), { x: 75, y: 18 }, 2.05)
    .to(s('[data-kibble]'), { opacity: 1, duration: 0.05 }, 2.1)
    .to(s('[data-kibble]'), { y: 46, duration: 0.5 }, 2.2)
    .to(s('[data-kibble]'), { opacity: 0, duration: 0.05 }, 2.7)
    .to(s('[data-feeder]'), { x: -2, duration: 0.08, ease: 'steps(1)', repeat: 5, yoyo: true }, 2.7)
    // 4: a coin drops out of the spout
    .set(s('[data-coin]'), { x: 72, y: 60 }, 3.05)
    .to(s('[data-coin]'), { opacity: 1, duration: 0.05 }, 3.1)
    .to(s('[data-coin]'), { y: 74, duration: 0.6, ease: 'bounce.out' }, 3.15)
    // 5: the mouth opens, the coin goes in, it chews; the other feeding's coin goes in the jar
    .to(s('[data-munch-shut]'), { opacity: 0, duration: 0.01 }, 4.0)
    .to(s('[data-munch-open]'), { opacity: 1, duration: 0.01 }, 4.0)
    .to(s('[data-coin]'), { x: 124, duration: 0.5, ease: 'steps(10)' }, 4.05)
    .to(s('[data-coin]'), { y: 50, duration: 0.25, ease: 'power1.out' }, 4.05)
    .to(s('[data-coin]'), { y: 66, duration: 0.25, ease: 'power2.in' }, 4.3)
    .to(s('[data-coin]'), { opacity: 0, duration: 0.02 }, 4.55)
    .to(s('[data-munch-open]'), { opacity: 0, duration: 0.01, repeat: 5, yoyo: true, repeatDelay: 0.05 }, 4.56)
    .to(s('[data-munch-shut]'), { opacity: 1, duration: 0.01 }, 4.56)
    .to(s('[data-jar-coin]'), { opacity: 1, duration: 0.05 }, 4.05)
    .fromTo(s('[data-jar-coin]'), { x: 70, y: 56 }, { x: 16, y: 74, duration: 0.8 }, 4.05);
}

export function Feeding({ tokenSymbol, escrow, threshold, fill, claimedETH, routerName, nextCycle }: FeedingProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const meal = nextCycle === 'burn';

  const steps: Step[] = [
    {
      name: 'Every trade drops kibble',
      body: <>Each {tokenSymbol} buy or sell pays a small creator fee in ETH. It drops into MUNCH’s bowl: the Pons fee escrow.</>,
      readingLabel: 'in the bowl now',
      reading: `${escrow.toFixed(4)} ETH`,
    },
    {
      name: 'The bowl fills up',
      body: <>The bowl fills to the size of the next feeding: 0.01 ETH for a meal, 0.02 ETH for the snack jar. Full bowl, feeding time.</>,
      readingLabel: 'bowl full',
      reading: `${Math.round(fill * 100)}% of ${threshold ? threshold.toFixed(2) : '—'} ETH`,
    },
    {
      name: 'The auto-feeder claims it',
      body: <>The auto-feeder is the bot. It checks the bowl every block, day and night, and claims the whole bowl on its own.</>,
      readingLabel: 'ETH claimed so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
    },
    {
      name: `It buys ${tokenSymbol}`,
      body: <>On a meal, every bit of that ETH market-buys {tokenSymbol} on {routerName}. Real buying, every time.</>,
      readingLabel: 'buying on',
      reading: routerName.replace(/^the /, ''),
    },
    {
      name: 'MUNCH eats it, or the jar does',
      body: (
        <>
          Feedings take turns. <strong className="font-bold">Odd feedings: MUNCH eats every coin</strong>, sent to 0x…dEaD and gone from the supply for good.{' '}
          <strong className="font-bold">Even feedings: the ETH goes in the snack jar</strong>, the project wallet that keeps the lights on.
        </>
      ),
      readingLabel: 'next feeding',
      reading: meal ? 'a meal' : 'the snack jar',
    },
  ];

  // phones with motion get the scene stuck above the steps, acting out each one as you reach it
  const [phoneLive, setPhoneLive] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE_LIVE).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_LIVE);
    const on = () => setPhoneLive(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame) return;
      const q = gsap.utils.selector(frame);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        frame.dataset.mode = 'pinned';
        const texts = q('[data-step]');
        gsap.set(texts, { autoAlpha: 0, y: 24 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        const tl = gsap.timeline({
          defaults: { ease: 'steps(10)' },
          scrollTrigger: {
            trigger: frame,
            pin: true,
            start: 'top top',
            end: '+=420%',
            scrub: 0.6,
            onUpdate: (self) => setStep(Math.min(4, Math.floor(self.progress * 5))),
          },
        });
        actOut(tl, gsap.utils.selector(q('[data-pinned-scene]')[0]));
        texts.forEach((el, i) => {
          if (i < texts.length - 1) {
            tl.to(el, { autoAlpha: 0, y: -24, duration: 0.2, ease: 'power2.in' }, i + 0.82);
            tl.to(texts[i + 1], { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, i + 0.98);
          }
        });
        return () => {
          delete frame.dataset.mode;
        };
      });
      mm.add(PHONE_LIVE, () => {
        if (!phoneLive) return;
        frame.dataset.mode = 'sticky';
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'steps(10)' } });
        actOut(tl, gsap.utils.selector(q('[data-phone-scene]')[0]));
        q('[data-step]').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 72%',
            end: 'bottom 72%',
            onToggle: (self) => {
              if (!self.isActive) return;
              setStep(i);
              tl.tweenTo(i + 1, { duration: 1.1, ease: 'none' });
            },
            onLeaveBack: i === 0 ? () => tl.tweenTo(0, { duration: 0.4, ease: 'none' }) : undefined,
          });
        });
        return () => {
          delete frame.dataset.mode;
        };
      });
      mm.add('(max-width: 899px) and (prefers-reduced-motion: reduce)', () => {
        q('[data-step]').forEach((el, i) => {
          ScrollTrigger.create({ trigger: el, start: 'top 70%', end: 'bottom 70%', onToggle: (self) => self.isActive && setStep(i) });
        });
      });
      return () => mm.revert();
    },
    { scope: frameRef, dependencies: [phoneLive] },
  );

  return (
    <section id="feeding" aria-labelledby="feeding-title" className="relative">
      <div ref={frameRef} className="group/run relative data-[mode=pinned]:h-[100svh] data-[mode=pinned]:overflow-hidden">
        <div className="mx-auto grid max-w-[84rem] gap-10 px-4 pb-24 pt-24 sm:px-10 lg:px-16 group-data-[mode=pinned]/run:h-full group-data-[mode=pinned]/run:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] group-data-[mode=pinned]/run:items-center group-data-[mode=pinned]/run:gap-12 group-data-[mode=pinned]/run:pb-0 group-data-[mode=pinned]/run:pt-32">
          <div className="min-w-0">
            <h2 id="feeding-title" className="m-0 font-lcd text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-lcd-ink">
              Feeding time
            </h2>

            {/* phones: the scene sticks under the menu and acts out each step as it scrolls by */}
            <div className="relative z-20 mt-8 bg-lcd pb-3 group-data-[mode=pinned]/run:hidden group-data-[mode=sticky]/run:sticky group-data-[mode=sticky]/run:top-[7rem] sm:group-data-[mode=sticky]/run:top-[7.5rem]" aria-hidden="true">
              <div data-phone-scene className="lcd-window aspect-[16/10] w-full">
                <Scene still={!phoneLive} />
              </div>
              <ol className="m-0 mt-3 hidden list-none gap-2 p-0 group-data-[mode=sticky]/run:flex">
                {steps.map((s, i) => (
                  <li key={s.name} className={`h-2.5 flex-1 border-2 border-lcd-ink ${i <= step ? 'bg-lcd-ink' : ''}`} />
                ))}
              </ol>
            </div>

            <ol className="relative z-10 m-0 mt-10 grid list-none gap-10 p-0 group-data-[mode=pinned]/run:mt-10 group-data-[mode=pinned]/run:grid-cols-1 group-data-[mode=pinned]/run:grid-rows-1 group-data-[mode=pinned]/run:gap-0">
              {steps.map((s, i) => (
                <li key={s.name} data-step className="min-w-0 group-data-[mode=sticky]/run:min-h-[46svh] group-data-[mode=pinned]/run:col-start-1 group-data-[mode=pinned]/run:row-start-1">
                  <h3 className="m-0 font-lcd text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight text-lcd-ink">
                    {s.name}
                  </h3>
                  <p className="m-0 mt-4 max-w-[44ch] text-[1.06rem] leading-relaxed text-lcd-ink">{s.body}</p>
                  <div className="mt-5 inline-flex items-baseline gap-3 border-t-[3px] border-lcd-ink pt-3">
                    <span className="font-lcd text-[0.8rem] uppercase text-lcd-soft">{s.readingLabel}</span>
                    <span className="font-lcd text-[1.05rem] tabular text-lcd-ink">{s.reading}</span>
                  </div>
                </li>
              ))}
            </ol>

            <ol className="m-0 mt-12 hidden list-none gap-2 p-0 group-data-[mode=pinned]/run:flex" aria-hidden="true">
              {steps.map((s, i) => (
                <li key={s.name} className={`h-3 w-10 border-2 border-lcd-ink ${i <= step ? 'bg-lcd-ink' : ''}`} />
              ))}
            </ol>
          </div>

          <div data-pinned-scene className="lcd-window relative hidden aspect-[16/10] w-full min-w-0 group-data-[mode=pinned]/run:block" aria-hidden="true">
            <Scene />
          </div>
        </div>
      </div>
    </section>
  );
}
