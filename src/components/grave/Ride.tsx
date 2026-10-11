import { useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RideProps {
  tokenSymbol: string;
  escrow: number;
  threshold: number;
  fill: number;
  claimedETH: number;
  routerName: string;
  nextCycle: 'burn' | 'keep';
  burnedLabel: string;
}

interface Stop {
  name: string;
  body: ReactNode;
  readingLabel: string;
  reading: string;
  scene: ReactNode;
}

/* ───────── Stop scenery: plain geometry, painted flat ───────── */

const CoinBoxScene = ({ fill }: { fill: number }) => (
  <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
    <rect x="40" y="70" width="160" height="120" rx="10" fill="#2a1838" stroke="#f6eedd" strokeWidth="3" />
    <rect x="96" y="62" width="48" height="10" rx="5" fill="#0e0714" stroke="#f6eedd" strokeWidth="3" />
    <rect x="52" y={180 - 98 * fill} width="136" height={98 * fill} rx="4" fill="#ffcf3a" opacity="0.9" />
    {[0, 1, 2].map((i) => (
      <g key={i} data-drop style={{ ['--d' as string]: `${i * 0.6}s` }}>
        <circle cx={120} cy={20 + i * 2} r="11" fill="#ffcf3a" stroke="#2a1626" strokeWidth="3" />
        <path d={`M116 ${20 + i * 2}h8`} stroke="#2a1626" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
    <text x="120" y="135" textAnchor="middle" fontFamily="Bungee" fontSize="16" fill="#f6eedd">COINS</text>
  </svg>
);

const ClaimScene = () => (
  <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
    <rect x="30" y="110" width="110" height="80" rx="8" fill="#2a1838" stroke="#f6eedd" strokeWidth="3" />
    <path d="M30 110l30-34h110l-30 34Z" fill="#463056" stroke="#f6eedd" strokeWidth="3" strokeLinejoin="round" />
    <rect x="160" y="40" width="10" height="150" rx="3" fill="#6b5a78" />
    <path d="M150 40h30l-6 26h-18Z" fill="#9686a6" stroke="#2a1626" strokeWidth="3" />
    <circle cx="200" cy="90" r="22" fill="#ffcf3a" stroke="#2a1626" strokeWidth="3" />
    <text x="200" y="97" textAnchor="middle" fontFamily="Bungee" fontSize="17" fill="#2a1626">Ξ</text>
  </svg>
);

const BoothScene = () => (
  <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
    <rect x="70" y="40" width="100" height="150" rx="8" fill="#d7263d" stroke="#f6eedd" strokeWidth="3" />
    <rect x="86" y="70" width="68" height="50" rx="6" fill="#0e0714" />
    <circle cx="36" cy="95" r="22" fill="#f6eedd" stroke="#2a1626" strokeWidth="3" />
    <text x="36" y="102" textAnchor="middle" fontFamily="Bungee" fontSize="17" fill="#2a1626">Ξ</text>
    <path d="M60 95h18" stroke="#f6eedd" strokeWidth="3" strokeLinecap="round" />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={196 + i * 6} cy={80 + i * 26} r="16" fill="#ffcf3a" stroke="#2a1626" strokeWidth="3" />
    ))}
    <path d="M162 95h18" stroke="#f6eedd" strokeWidth="3" strokeLinecap="round" />
    <text x="120" y="160" textAnchor="middle" fontFamily="Bungee" fontSize="14" fill="#f6eedd">BUY</text>
  </svg>
);

/** The switch signal at the fork: the lamp for the next ride is lit. */
const SwitchScene = ({ next }: { next: 'burn' | 'keep' }) => {
  const burn = next === 'burn';
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="92" y="70" width="16" height="126" rx="3" fill="#6b5a78" />
      <rect x="54" y="8" width="92" height="120" rx="14" fill="#2a1838" stroke="#f6eedd" strokeWidth="3" />
      <circle cx="100" cy="44" r="22" fill={burn ? '#ffcf3a' : '#3a2c22'} stroke="#2a1626" strokeWidth="3" style={burn ? { filter: 'drop-shadow(0 0 10px #ffcf3a)' } : undefined} />
      <circle cx="100" cy="94" r="22" fill={!burn ? '#a6ff4d' : '#2c3a24'} stroke="#2a1626" strokeWidth="3" style={!burn ? { filter: 'drop-shadow(0 0 10px #a6ff4d)' } : undefined} />
      <text x="160" y="50" fontFamily="Bungee" fontSize="13" fill={burn ? '#ffcf3a' : '#9686a6'}>BURIAL</text>
      <text x="160" y="100" fontFamily="Bungee" fontSize="13" fill={!burn ? '#a6ff4d' : '#9686a6'}>WAGES</text>
    </svg>
  );
};

/** A drawn two-spur switch for the stacked (phone / reduced-motion) ride. */
const StackedSplit = ({ next }: { next: 'burn' | 'keep' }) => {
  const burn = next === 'burn';
  return (
    <svg viewBox="0 0 320 120" className="mt-2 h-auto w-full max-w-[22rem] group-data-[mode=ride]/ride:hidden" aria-hidden="true">
      <path d="M10 60H110C150 60 170 22 210 22H262" fill="none" stroke={burn ? '#ffcf3a' : '#6b5a78'} strokeWidth="6" strokeLinecap="round" />
      <path d="M10 60H110C150 60 170 98 210 98H262" fill="none" stroke={!burn ? '#a6ff4d' : '#6b5a78'} strokeWidth="6" strokeLinecap="round" />
      <path d="M268 30V10c0-6 5-10 10-10s10 4 10 10v20Z" fill="#8f879a" stroke="#2a1626" strokeWidth="2.5" transform="translate(0 -2)" />
      <rect x="266" y="84" width="26" height="22" rx="3" fill="#6b5a78" stroke="#2a1626" strokeWidth="2.5" />
      <rect x="264" y="80" width="30" height="6" rx="3" fill="#9686a6" stroke="#2a1626" strokeWidth="2" />
    </svg>
  );
};

/** The ride's own track splitting at the fork (drawn only while riding). */
const TrackSplit = ({ next }: { next: 'burn' | 'keep' }) => {
  const burn = next === 'burn';
  return (
    <svg
      className="pointer-events-none absolute left-0 top-full hidden h-[9.5rem] w-full overflow-visible group-data-[mode=ride]/ride:block"
      viewBox="0 0 400 152"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 130 C 120 130, 170 130, 230 70 S 330 10, 400 10" fill="none" stroke="#120919" strokeWidth="18" vectorEffect="non-scaling-stroke" />
      <path d="M0 130 C 120 130, 170 130, 230 70 S 330 10, 400 10" fill="none" stroke={burn ? '#ffcf3a' : '#6b5a78'} strokeWidth="6" vectorEffect="non-scaling-stroke" />
      <path d="M0 130 C 120 130, 170 130, 230 170 S 330 210, 400 210" fill="none" stroke="#120919" strokeWidth="18" vectorEffect="non-scaling-stroke" />
      <path d="M0 130 C 120 130, 170 130, 230 170 S 330 210, 400 210" fill="none" stroke={!burn ? '#a6ff4d' : '#6b5a78'} strokeWidth="6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

/** What each spur ends at: a headstone up top, Mort's wage tin below. */
const SpurEnds = () => (
  <div className="pointer-events-none absolute right-0 top-full hidden h-[9.5rem] w-0 group-data-[mode=ride]/ride:block" aria-hidden="true">
    <span className="absolute bottom-[calc(100%-0.6rem)] left-1 block h-14 w-11 rounded-t-full rounded-b-sm bg-[#8f879a] ring-2 ring-ticket-ink" />
    <span className="absolute left-1 top-[calc(138%-1.4rem)] block h-9 w-11 rounded-b-md bg-rail ring-2 ring-ticket-ink">
      <span className="absolute -top-1.5 left-[-3px] block h-2.5 w-[calc(100%+6px)] rounded bg-dust-dim ring-2 ring-ticket-ink" />
    </span>
  </div>
);

/* ───────── The ride car ───────── */
const RideCar = () => (
  <svg viewBox="0 0 220 130" className="h-full w-full" aria-hidden="true">
    <path d="M18 42h150l26 30v26H18Z" fill="#d7263d" stroke="#2a1626" strokeWidth="4" strokeLinejoin="round" />
    <path d="M30 54h130l16 20" fill="none" stroke="#f6eedd" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 42V22c0-6 5-10 10-10h40" fill="none" stroke="#2a1626" strokeWidth="5" strokeLinecap="round" />
    <circle cx="190" cy="66" r="10" fill="#ffcf3a" stroke="#2a1626" strokeWidth="3" />
    <ellipse cx="70" cy="30" rx="5" ry="6" fill="#ffcf3a" />
    <ellipse cx="86" cy="30" rx="5" ry="6" fill="#ffcf3a" />
    {[56, 154].map((cx) => (
      <g key={cx} data-wheel>
        <circle cx={cx} cy="104" r="18" fill="#2a1626" stroke="#6b5a78" strokeWidth="4" />
        <path d={`M${cx - 14} 104h28M${cx} 90v28`} stroke="#9686a6" strokeWidth="3" />
      </g>
    ))}
  </svg>
);

export function Ride({ tokenSymbol, escrow, threshold, fill, claimedETH, routerName, nextCycle, burnedLabel }: RideProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);

  const stops: Stop[] = [
    {
      name: 'The Coin Box',
      body: (
        <>
          Every {tokenSymbol} buy and sell drops a creator fee, paid in ETH, into Mort’s coin box: the Pons fee escrow.
        </>
      ),
      readingLabel: 'In the box right now',
      reading: `${escrow.toFixed(4)} ETH`,
      scene: <CoinBoxScene fill={fill} />,
    },
    {
      name: 'The Claim',
      body: (
        <>
          When the box holds {threshold ? `${threshold.toFixed(3)} ETH` : 'enough'}, Mort’s bot claims every coin in it. Nobody presses a button.
        </>
      ),
      readingLabel: 'How full the box is',
      reading: `${Math.round(fill * 100)}%`,
      scene: <ClaimScene />,
    },
    {
      name: 'The Buy-back Booth',
      body: (
        <>
          On a burial ride, the claimed ETH market-buys {tokenSymbol} on {routerName}. Real buy pressure, every time.
        </>
      ),
      readingLabel: 'ETH claimed so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
      scene: <BoothScene />,
    },
    {
      name: 'The Fork',
      body: (
        <>
          The track splits every ride. <strong className="font-semibold text-bulb">Odd rides go to the graveyard</strong>: every token bought is buried at
          0x…dEaD, forever. <strong className="font-semibold text-slime">Even rides pay Mort’s wages</strong>: the fees go to the creator wallet.
        </>
      ),
      readingLabel: 'Next ride takes the',
      reading: nextCycle === 'burn' ? 'Burial spur' : 'Wages spur',
      scene: <SwitchScene next={nextCycle} />,
    },
  ];

  useGSAP(
    () => {
      const frame = frameRef.current;
      const strip = stripRef.current;
      if (!frame || !strip) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        frame.dataset.mode = 'ride';
        ScrollTrigger.refresh();
        const distance = () => Math.max(0, strip.scrollWidth - window.innerWidth);
        const ride = gsap.to(strip, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => setStop(Math.min(3, Math.floor(self.progress * 4.2))),
          },
        });
        gsap.to('[data-wheel]', {
          rotate: 1800,
          transformOrigin: '50% 50%',
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top top', end: () => `+=${distance()}`, scrub: 0.7 },
        });
        gsap.utils.toArray<HTMLElement>('[data-stop-sign]').slice(1).forEach((el) => {
          gsap.from(el, {
            rotate: -10,
            yPercent: -40,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, containerAnimation: ride, start: 'left 88%', toggleActions: 'play none none reverse' },
          });
        });
        return () => {
          delete frame.dataset.mode;
        };
      });
      return () => mm.revert();
    },
    { scope: frameRef },
  );

  return (
    <section id="ride" aria-labelledby="ride-title" className="relative">
      <div ref={frameRef} className="group/ride relative overflow-hidden data-[mode=ride]:h-[100svh]">
        {/* header + stop lamps */}
        <div className="relative z-20 flex flex-wrap items-end justify-between gap-6 px-5 pt-24 sm:px-10 lg:px-16 group-data-[mode=ride]/ride:absolute group-data-[mode=ride]/ride:inset-x-0 group-data-[mode=ride]/ride:top-0">
          <div>
            <h2 id="ride-title" className="m-0 sign-lettering text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.95] text-cream">
              All aboard.
            </h2>
          </div>
        </div>

        {/* the moving scenery */}
        <div
          ref={stripRef}
          className="relative z-10 flex flex-col gap-16 px-5 pb-24 pt-14 sm:px-10 lg:px-16 group-data-[mode=ride]/ride:absolute group-data-[mode=ride]/ride:inset-y-0 group-data-[mode=ride]/ride:left-0 group-data-[mode=ride]/ride:w-max group-data-[mode=ride]/ride:flex-row group-data-[mode=ride]/ride:items-end group-data-[mode=ride]/ride:gap-0 group-data-[mode=ride]/ride:px-0 group-data-[mode=ride]/ride:pb-[calc(12svh+9.5rem)] group-data-[mode=ride]/ride:pl-[34vw] group-data-[mode=ride]/ride:pt-0"
        >
          {stops.map((s, i) => (
            <article
              key={s.name}
              className="relative grid gap-6 pl-8 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-full before:bg-rail after:absolute after:inset-y-0 after:left-[11px] after:w-[3px] after:rounded-full after:bg-rail group-data-[mode=ride]/ride:before:hidden group-data-[mode=ride]/ride:after:hidden group-data-[mode=ride]/ride:w-[64vw] group-data-[mode=ride]/ride:max-w-[60rem] group-data-[mode=ride]/ride:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] group-data-[mode=ride]/ride:items-end group-data-[mode=ride]/ride:pl-0 group-data-[mode=ride]/ride:pr-[6vw]"
            >
              <div>
                <div data-stop-sign className="sign-board inline-block px-7 py-5" style={{ transformOrigin: '50% 0%' }}>
                  <h3 className="m-0 sign-lettering text-[clamp(1.9rem,3.2vw,2.8rem)] leading-none">{s.name}</h3>
                </div>
                <p className="m-0 mt-6 max-w-[42ch] text-[1.08rem] leading-relaxed text-cream">{s.body}</p>
                <div className="mt-5 inline-flex flex-col rounded-lg bg-ticket px-4 py-2.5 text-ticket-ink">
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ticket-dim">{s.readingLabel}</span>
                  <span className="tabular font-display text-[1.35rem] leading-tight">{s.reading}</span>
                </div>
              </div>
              <div className="h-[clamp(9rem,22vw,15rem)] max-w-[22rem]">{s.scene}</div>
              {i === stops.length - 1 ? (
                <>
                  <StackedSplit next={nextCycle} />
                  <TrackSplit next={nextCycle} />
                  <SpurEnds />
                </>
              ) : null}
            </article>
          ))}
          <div className="flex items-end group-data-[mode=ride]/ride:w-[44vw] group-data-[mode=ride]/ride:pl-[4vw]">
            <a href="#graveyard" className="sign-board inline-flex items-center gap-4 px-8 py-6 no-underline">
              <span className="sign-lettering text-[clamp(1.8rem,3vw,2.6rem)] leading-none">To the graveyard</span>
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path d="M12 4v16m0 0-7-7m7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="sr-only">Total buried so far: {burnedLabel}</span>
          </div>
        </div>

        {/* stop lamps, under the rails */}
        <ol className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-20 m-0 hidden list-none items-center justify-start gap-6 px-5 sm:px-10 lg:px-16 group-data-[mode=ride]/ride:flex" aria-label="Ride progress">
            {stops.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 font-display text-[0.72rem] text-dust-dim">
                <span className="bulb h-3.5 w-3.5" data-lit={i <= stop ? 'true' : 'false'} aria-hidden="true" />
                <span className={i === stop ? 'text-cream' : ''}>{s.name.replace('The ', '')}</span>
              </li>
            ))}
          </ol>
        {/* rails and the car (only while riding) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[12svh] z-0 hidden group-data-[mode=ride]/ride:block" aria-hidden="true">
          <svg className="h-10 w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
            <defs>
              <pattern id="ties" width="2.4" height="10" patternUnits="userSpaceOnUse">
                <rect x="0.4" y="2" width="1" height="8" fill="#2a1838" />
              </pattern>
            </defs>
            <rect width="100" height="10" fill="url(#ties)" />
            <rect y="2.4" width="100" height="0.9" fill="#6b5a78" />
            <rect y="7.2" width="100" height="0.9" fill="#6b5a78" />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-[calc(12svh+1.6rem)] left-[9vw] z-20 hidden h-[clamp(5.5rem,9vw,8rem)] w-[clamp(9rem,15vw,13.5rem)] group-data-[mode=ride]/ride:block">
          <RideCar />
        </div>
      </div>
    </section>
  );
}
