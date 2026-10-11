import { useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BlackHole } from './BlackHole';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface OrbitSequenceProps {
  tokenSymbol: string;
  escrow: number;
  threshold: number;
  fill: number;
  claimedETH: number;
  routerName: string;
  nextCycle: 'burn' | 'keep';
  feeding: boolean;
}

interface Step {
  name: string;
  body: ReactNode;
  readingLabel: string;
  reading: string;
  /** the observer's note on the stage, and where it points */
  note: string;
  noteAt: string;
}

export function OrbitSequence({ tokenSymbol, escrow, threshold, fill, claimedETH, routerName, nextCycle, feeding }: OrbitSequenceProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const falls = nextCycle === 'burn';

  const steps: Step[] = [
    {
      name: 'The disk',
      body: <>Every {tokenSymbol} buy and sell pays a creator fee in ETH. The fees spiral into the accretion disk, which is the Pons fee escrow.</>,
      readingLabel: 'in the disk now',
      reading: `${escrow.toFixed(4)} ETH`,
      note: 'fees spiral in here',
      noteAt: 'left-[2%] top-[58%]',
    },
    {
      name: 'Critical mass',
      body: <>The disk keeps filling until it holds {threshold ? `${threshold.toFixed(3)} ETH` : 'enough'}. Then it goes critical.</>,
      readingLabel: 'disk filled',
      reading: `${Math.round(fill * 100)}%`,
      note: 'ring brightens as it fills',
      noteAt: 'right-[4%] top-[18%]',
    },
    {
      name: 'The pull',
      body: <>The Watcher, our bot, claims everything in the disk. Nobody presses a button. It watches every block, all night.</>,
      readingLabel: 'ETH pulled so far',
      reading: `${claimedETH.toFixed(4)} ETH`,
      note: 'the Watcher pulls it all',
      noteAt: 'left-[6%] top-[16%]',
    },
    {
      name: 'The feed',
      body: <>On a feeding orbit the pulled ETH market-buys {tokenSymbol} on {routerName}. Real buying, every time.</>,
      readingLabel: 'buying on',
      reading: routerName.replace(/^the /, ''),
      note: `${tokenSymbol} falls toward the horizon`,
      noteAt: 'right-[2%] top-[62%]',
    },
    {
      name: 'The fork',
      body: (
        <>
          Orbits alternate. <strong className="font-semibold text-ring">Odd orbits, everything bought falls in</strong>: it is sent to 0x…dEaD and never comes back.{' '}
          <strong className="font-semibold text-fuel">Even orbits fuel the observatory</strong>: the fees go to the creator wallet.
        </>
      ),
      readingLabel: 'next orbit',
      reading: falls ? 'falls in' : 'observatory fuel',
      note: falls ? 'odd orbit: gone for good' : 'even orbit: fuel siphoned off',
      noteAt: 'left-[4%] top-[70%]',
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
        const notes = q('[data-note]');
        gsap.set(texts, { autoAlpha: 0, y: 28 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        gsap.set(notes, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: frame,
            pin: true,
            start: 'top top',
            end: '+=400%',
            scrub: 0.8,
            onUpdate: (self) => setStep(Math.min(4, Math.floor(self.progress * 5))),
          },
        });
        // the hole draws nearer as the orbit goes on
        tl.fromTo(q('[data-stage]'), { scale: 0.86 }, { scale: 1.08, ease: 'none', duration: 5 }, 0);
        texts.forEach((el, i) => {
          tl.to(notes[i], { autoAlpha: 1, duration: 0.2 }, i + 0.15);
          if (i < texts.length - 1) {
            tl.to(notes[i], { autoAlpha: 0, duration: 0.2 }, i + 0.8);
            tl.to(el, { autoAlpha: 0, y: -28, duration: 0.25 }, i + 0.82);
            tl.to(texts[i + 1], { autoAlpha: 1, y: 0, duration: 0.3 }, i + 0.98);
          }
        });
        return () => {
          delete frame.dataset.mode;
        };
      });
      // phones and reduced motion: a sticky hole follows whichever step is in view
      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('[data-step]', frame).forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 70%',
            end: 'bottom 70%',
            onToggle: (self) => self.isActive && setStep(i),
          });
        });
      });
      return () => mm.revert();
    },
    { scope: frameRef },
  );

  // what the hole on the stage is doing at each step
  const stageFill = [0.18, 1, 1, 0.75, 0.55][step];
  const stageFeeding = feeding || step === 2 || step === 3 || (step === 4 && falls);
  const stageFuel = step === 4 && !falls;

  return (
    <section id="orbit" aria-labelledby="orbit-title" className="relative">
      <div ref={frameRef} className="group/orbit relative data-[mode=pinned]:h-[100svh] data-[mode=pinned]:overflow-hidden">
        <div className="mx-auto grid max-w-[84rem] gap-12 px-4 pb-24 pt-28 sm:px-10 lg:px-16 group-data-[mode=pinned]/orbit:h-full group-data-[mode=pinned]/orbit:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] group-data-[mode=pinned]/orbit:items-center group-data-[mode=pinned]/orbit:gap-8 group-data-[mode=pinned]/orbit:py-0">
          <div className="min-w-0">
            <h2 id="orbit-title" className="m-0 display text-[clamp(3rem,6.4vw,5.8rem)] text-star" style={{ lineHeight: 1.08 }}>
              One orbit, from fee to horizon
            </h2>

            {/* phones: the hole stays in view while the steps pass over it */}
            <div className="pointer-events-none sticky top-16 z-0 mt-6 h-[42svh] group-data-[mode=pinned]/orbit:hidden" aria-hidden="true">
              <BlackHole fill={stageFill} feeding={stageFeeding} fuel={stageFuel} shadow={0.2} className="h-full w-full" />
              <span className="absolute bottom-2 left-0 hand text-[1.7rem] text-marker [text-shadow:0_1px_0_rgba(0,0,0,0.8)]">{steps[step].note}</span>
            </div>

            <ol className="relative z-10 m-0 mt-10 grid list-none gap-[34svh] p-0 group-data-[mode=pinned]/orbit:mt-12 group-data-[mode=pinned]/orbit:gap-0 group-data-[mode=pinned]/orbit:grid-cols-1 group-data-[mode=pinned]/orbit:grid-rows-1">
              {steps.map((s, i) => (
                <li key={s.name} data-step className="min-w-0 bg-gradient-to-b from-night/0 via-night/95 to-night/95 pb-4 pt-10 group-data-[mode=pinned]/orbit:bg-none group-data-[mode=pinned]/orbit:p-0 group-data-[mode=pinned]/orbit:col-start-1 group-data-[mode=pinned]/orbit:row-start-1">
                  <h3 className="m-0 flex items-baseline gap-4 display text-[clamp(2rem,3.2vw,2.8rem)] text-star">
                    <span className="font-mono text-[1rem] font-normal tracking-normal text-ring" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}/05
                    </span>
                    {s.name}
                  </h3>
                  <p className="m-0 mt-4 max-w-[44ch] text-[1.12rem] leading-relaxed text-star/90">{s.body}</p>
                  <div className="mt-5 inline-flex items-baseline gap-3 border-t border-panel-line pt-3">
                    <span className="label text-[0.72rem] text-star-dim">{s.readingLabel}</span>
                    <span className={`tabular font-mono text-[1.02rem] ${i === 4 ? (falls ? 'text-ring' : 'text-fuel') : 'text-star'}`}>{s.reading}</span>
                  </div>
                </li>
              ))}
            </ol>

            <ol className="m-0 mt-12 hidden list-none gap-2 p-0 group-data-[mode=pinned]/orbit:flex" aria-hidden="true">
              {steps.map((s, i) => (
                <li key={s.name} className={`h-1 w-12 rounded-full transition-colors duration-300 ${i <= step ? 'bg-ring' : 'bg-panel-line'}`} />
              ))}
            </ol>
          </div>

          {/* the stage: only while pinned */}
          <div className="relative hidden aspect-square w-full max-h-[86svh] min-w-0 group-data-[mode=pinned]/orbit:block" aria-hidden="true">
              <div data-stage className="absolute inset-0">
                <BlackHole fill={stageFill} feeding={stageFeeding} fuel={stageFuel} shadow={0.17} className="h-full w-full" />
              </div>
              {steps.map((s) => (
                <div key={s.name} data-note className={`pointer-events-none absolute ${s.noteAt} max-w-[21rem]`}>
                  <span className="hand block text-[2rem] text-marker [text-shadow:0_1px_0_rgba(0,0,0,0.6)]">{s.note}</span>
                  <svg viewBox="0 0 120 40" className="mt-1 h-8 w-28 overflow-visible">
                    <path d="M4 6c30 2 60 10 96 26" fill="none" stroke="#cf3228" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M100 32l-12-1m12 1-4-11" fill="none" stroke="#cf3228" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
