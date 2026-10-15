import { useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BLOCK, BRR, CHEST, Flames, Lava, ORE, PICK, Sprite, TORCH } from './sprites';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RunSequenceProps {
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

const BAR_X = 44;
const BAR_W = 72;

/** The stage: one run of the mine, drawn on a 160 by 100 pixel grid. */
function Stage({ still = false }: { still?: boolean }) {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" shapeRendering="crispEdges">
      <rect width="160" height="100" fill="#1d1714" />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={(i * 41) % 160} y={(i * 17) % 84} width={i % 3 ? 6 : 10} height={4} fill={i % 2 ? '#241c18' : '#171210'} />
      ))}
      <Sprite rows={TORCH} x={6} y={34} />
      <Sprite rows={TORCH} x={151} y={34} />

      {/* the ore vein the trades come out of */}
      <rect x="0" y="0" width="30" height="24" fill="#3a3430" />
      <Sprite rows={ORE} x={4} y={4} />
      <Sprite rows={ORE} x={14} y={10} />
      <text x="16" y="31" textAnchor="middle" className="pxl" fontSize="5" fill="#b5a896">TRADES</text>

      {/* the fee bar */}
      <rect x={BAR_X - 2} y="8" width={BAR_W + 4} height="10" fill="#0b0806" />
      <rect data-bar x={BAR_X} y="10" width={still ? BAR_W : 0} height="6" fill="#ff8a1f" />
      <text x={BAR_X + BAR_W / 2} y="27" textAnchor="middle" className="pxl" fontSize="5" fill="#b5a896">FEE ESCROW</text>

      {/* Brr on the middle shelf */}
      <rect x="58" y="60" width="44" height="6" fill="#57534d" />
      <rect x="58" y="60" width="44" height="2" fill="#7d7871" />
      <Sprite rows={BRR} x={70} y={42} />
      <g data-stage-pick>
        <Sprite rows={PICK} x={83} y={47} />
      </g>

      {/* the chest, bottom left */}
      <rect x="0" y="88" width="56" height="12" fill="#57534d" />
      <rect x="0" y="88" width="56" height="2" fill="#7d7871" />
      <Sprite rows={CHEST} x={20} y={78} />
      <text x="28" y="97" textAnchor="middle" className="pxl" fontSize="5" fill="#1a1412">THE CHEST</text>

      {/* the lava, bottom right */}
      <Lava x0={96} x1={160} y={88} h={12} />
      <Flames x0={98} x1={160} y={88} gap={8} />
      <g data-stage-flare opacity="0">
        <Flames x0={97} x1={160} y={88} gap={5} blaze={1.5} seed={7} />
      </g>
      <text x="128" y="98" textAnchor="middle" className="pxl" fontSize="5" fill="#ffe066">LAVA · 0x…dEaD</text>

      {/* what travels: ETH ore, then a $LAVA block, plus the ore that goes to the chest */}
      <g data-ore opacity={still ? 0 : 1}>
        <Sprite rows={ORE} x={0} y={0} />
      </g>
      <g data-block opacity={still ? 1 : 0} transform={still ? 'translate(124 80)' : undefined}>
        <Sprite rows={BLOCK} x={0} y={0} />
      </g>
      <g data-chest-ore opacity={still ? 1 : 0} transform={still ? 'translate(22 68)' : undefined}>
        <Sprite rows={ORE} x={0} y={0} />
      </g>
    </svg>
  );
}

export function RunSequence({ tokenSymbol, escrow, threshold, fill, claimedETH, routerName, nextCycle }: RunSequenceProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const burn = nextCycle === 'burn';

  const steps: Step[] = [
    {
      name: 'Trades drop ore',
      body: <>Every {tokenSymbol} buy and sell pays a creator fee in ETH. It drops into the Pons fee escrow like ore out of the rock.</>,
      readingLabel: 'in the escrow now',
      reading: `${escrow.toFixed(4)} ETH`,
    },
    {
      name: 'The bar fills',
      body: <>The bar fills up to the size of the next run: 0.01 ETH on a burn run, 0.02 ETH on a chest run. Full bar, the run starts.</>,
      readingLabel: 'bar filled',
      reading: `${Math.round(fill * 100)}% of ${threshold ? threshold.toFixed(2) : '—'} ETH`,
    },
    {
      name: 'Brr claims it',
      body: <>Brr, the bot, claims everything in the escrow on his own. He watches every block, day and night.</>,
      readingLabel: 'ETH claimed so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
    },
    {
      name: `He buys ${tokenSymbol}`,
      body: <>On a burn run the claimed ETH market-buys {tokenSymbol} on {routerName}. Real buying, every run.</>,
      readingLabel: 'buying on',
      reading: routerName.replace(/^the /, ''),
    },
    {
      name: 'Lava or chest',
      body: (
        <>
          Runs take turns. <strong className="font-semibold text-ring">Odd runs: every block bought goes in the lava</strong>, which is 0x…dEaD, and nothing comes back out.{' '}
          <strong className="font-semibold text-fuel">Even runs: the fees go in the chest</strong>, the project wallet that keeps the mine going.
        </>
      ),
      readingLabel: 'next run',
      reading: burn ? 'into the lava' : 'into the chest',
    },
  ];

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        frame.dataset.mode = 'pinned';
        ScrollTrigger.refresh();
        const q = gsap.utils.selector(frame);
        const texts = q('[data-step]');
        gsap.set(texts, { autoAlpha: 0, y: 24 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        const stage = q('[data-pinned-stage]')[0];
        const s = gsap.utils.selector(stage);
        gsap.set(s('[data-ore]'), { x: 8, y: 6, opacity: 0 });

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
        // 1: ore pops out of the vein and flies into the bar
        tl.to(s('[data-ore]'), { opacity: 1, duration: 0.1 }, 0.05)
          .to(s('[data-ore]'), { x: BAR_X, y: 9, duration: 0.7 }, 0.15)
          .to(s('[data-ore]'), { opacity: 0, duration: 0.1 }, 0.85)
          // 2: the bar fills
          .to(s('[data-bar]'), { attr: { width: BAR_W }, duration: 0.9 }, 1.05)
          // 3: the bar empties into Brr
          .to(s('[data-bar]'), { attr: { width: 0 }, duration: 0.4 }, 2.05)
          .set(s('[data-ore]'), { x: BAR_X + BAR_W - 8, y: 9 }, 2.05)
          .to(s('[data-ore]'), { opacity: 1, duration: 0.05 }, 2.1)
          .to(s('[data-ore]'), { x: 90, y: 30, duration: 0.7 }, 2.2)
          // 4: the swing, and the ore becomes a $LAVA block
          .to(s('[data-stage-pick]'), { rotate: -45, svgOrigin: '88 53', duration: 0.25, ease: 'steps(3)' }, 3.05)
          .to(s('[data-stage-pick]'), { rotate: 0, svgOrigin: '88 53', duration: 0.25, ease: 'steps(3)' }, 3.3)
          .to(s('[data-ore]'), { opacity: 0, duration: 0.05 }, 3.4)
          .set(s('[data-block]'), { x: 90, y: 30 }, 3.4)
          .to(s('[data-block]'), { opacity: 1, duration: 0.05 }, 3.4)
          // 5: the block goes in the lava; the other run's ore goes in the chest
          .to(s('[data-block]'), { x: 124, duration: 0.8, ease: 'steps(12)' }, 4.05)
          .to(s('[data-block]'), { y: 18, duration: 0.3, ease: 'power1.out' }, 4.05)
          .to(s('[data-block]'), { y: 84, duration: 0.5, ease: 'power2.in' }, 4.35)
          .to(s('[data-block]'), { opacity: 0, duration: 0.05 }, 4.85)
          .to(s('[data-stage-flare]'), { opacity: 1, duration: 0.1 }, 4.8)
          .to(s('[data-chest-ore]'), { opacity: 1, duration: 0.05 }, 4.05)
          .fromTo(s('[data-chest-ore]'), { x: 70, y: 40 }, { x: 22, y: 70, duration: 0.8 }, 4.05);

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
      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('[data-step]', frame).forEach((el, i) => {
          ScrollTrigger.create({ trigger: el, start: 'top 70%', end: 'bottom 70%', onToggle: (self) => self.isActive && setStep(i) });
        });
      });
      return () => mm.revert();
    },
    { scope: frameRef },
  );

  return (
    <section id="run" aria-labelledby="run-title" className="relative">
      <div ref={frameRef} className="group/run relative data-[mode=pinned]:h-[100svh] data-[mode=pinned]:overflow-hidden">
        <div className="mx-auto grid max-w-[84rem] gap-10 px-4 pb-24 pt-28 sm:px-10 lg:px-16 group-data-[mode=pinned]/run:h-full group-data-[mode=pinned]/run:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] group-data-[mode=pinned]/run:items-center group-data-[mode=pinned]/run:gap-12 group-data-[mode=pinned]/run:pb-0 group-data-[mode=pinned]/run:pt-[4.5rem]">
          <div className="min-w-0">
            <h2 id="run-title" className="m-0 display text-[clamp(2.6rem,5.4vw,4.6rem)] text-star">
              One run, from fee to lava
            </h2>

            {/* phones: the whole run drawn once, above the steps */}
            <div className="px-frame mt-8 aspect-[16/10] w-full group-data-[mode=pinned]/run:hidden" aria-hidden="true">
              <Stage still />
            </div>

            <ol className="relative z-10 m-0 mt-10 grid list-none gap-10 p-0 group-data-[mode=pinned]/run:mt-12 group-data-[mode=pinned]/run:gap-0 group-data-[mode=pinned]/run:grid-cols-1 group-data-[mode=pinned]/run:grid-rows-1">
              {steps.map((s, i) => (
                <li key={s.name} data-step className="min-w-0 group-data-[mode=pinned]/run:col-start-1 group-data-[mode=pinned]/run:row-start-1">
                  <h3 className="m-0 flex items-baseline gap-4 display text-[clamp(1.7rem,2.6vw,2.3rem)] text-star">
                    <span className="pxl text-[0.8rem] text-ring" aria-hidden="true">
                      {i + 1}/5
                    </span>
                    {s.name}
                  </h3>
                  <p className="m-0 mt-4 max-w-[44ch] text-[1.08rem] leading-relaxed text-star/90">{s.body}</p>
                  <div className="mt-5 inline-flex items-baseline gap-3 border-t-[3px] border-panel-line pt-3">
                    <span className="pxl text-[0.68rem] text-star-dim">{s.readingLabel}</span>
                    <span className={`tabular font-mono text-[1rem] ${i === 4 ? (burn ? 'text-ring' : 'text-fuel') : 'text-star'}`}>{s.reading}</span>
                  </div>
                </li>
              ))}
            </ol>

            <ol className="m-0 mt-12 hidden list-none gap-2 p-0 group-data-[mode=pinned]/run:flex" aria-hidden="true">
              {steps.map((s, i) => (
                <li key={s.name} className={`h-3 w-10 transition-colors duration-200 ${i <= step ? 'bg-ring' : 'bg-panel-line'}`} />
              ))}
            </ol>
          </div>

          <div data-pinned-stage className="px-frame relative hidden aspect-[16/10] w-full min-w-0 group-data-[mode=pinned]/run:block" aria-hidden="true">
            <Stage />
          </div>
        </div>
      </div>
    </section>
  );
}
