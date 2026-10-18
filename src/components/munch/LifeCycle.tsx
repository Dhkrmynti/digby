import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Pet } from './Pet';
import { LCD_INV } from './sprites';
import { EGG_CRACKS, EGG_SAYS, STAGES, crackLevel, fmtPct, nextCrackAt, stageIndexFor, stageProgress } from './stages';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface LifeCycleProps {
  burnedPercent: number;
  tokenSymbol: string;
}

const range = (from: number, to: number) => (Number.isFinite(to) ? `${from}% – ${to}% eaten` : `${from}% eaten and up`);

/**
 * The life cycle: four stages laid out like the evolution chart in a pet's manual. On scroll the
 * track slides sideways under a pinned screen; the stage MUNCH is really in now is the lit one.
 */
export function LifeCycle({ burnedPercent, tokenSymbol }: LifeCycleProps) {
  const ref = useRef<HTMLElement>(null);
  const current = stageIndexFor(burnedPercent);
  const along = (current + stageProgress(burnedPercent, current)) / STAGES.length;
  const cracks = crackLevel(burnedPercent);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const pin = q('[data-life-pin]')[0] as HTMLElement;
        const track = q('[data-life-track]')[0] as HTMLElement;
        section.dataset.mode = 'pinned';
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        tl.to(q('[data-life-row]'), { x: () => -distance(), ease: 'none', duration: 1 }, 0)
          .fromTo(q('[data-rail-fill]'), { scaleX: 0 }, { scaleX: along, ease: 'none', duration: 1 }, 0)
          .fromTo(q('[data-rail-pin]'), { left: '0%' }, { left: `${along * 100}%`, ease: 'none', duration: 1 }, 0);
        // each stage hops in as it slides under the middle of the screen
        q('[data-stage-card]').forEach((card, i) => {
          tl.fromTo(card.querySelector('[data-stage-art]'), { y: 30, scale: 0.7 }, { y: 0, scale: 1, duration: 0.12, ease: 'back.out(3)' }, Math.max(0, i / STAGES.length - 0.08));
        });
        return () => {
          delete section.dataset.mode;
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [along] },
  );

  return (
    <section ref={ref} id="life" aria-labelledby="life-title" className="group/life relative">
      <div data-life-pin className="flex flex-col justify-center gap-8 px-4 pb-16 pt-24 sm:px-10 lg:px-16 group-data-[mode=pinned]/life:h-[100svh] group-data-[mode=pinned]/life:pb-8 group-data-[mode=pinned]/life:pt-32">
        <div className="mx-auto grid w-full max-w-[84rem] grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="life-title" className="m-0 max-w-[16ch] font-lcd text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-lcd-ink">
            It grows as the supply burns
          </h2>
          <p className="m-0 max-w-[48ch] text-[1.05rem] leading-relaxed text-lcd-ink lg:justify-self-end">
            MUNCH’s stage is set by the real share of {tokenSymbol} it has eaten, counted from 0x…dEaD. Nobody can feed it by hand: only the burn moves it along.
          </p>
        </div>

        <div data-life-track className="mx-auto w-full max-w-[84rem] overflow-x-auto pb-2 group-data-[mode=pinned]/life:overflow-visible">
          <ol data-life-row className="m-0 flex w-max list-none gap-5 p-0 sm:gap-8 min-[900px]:pl-12">
            {STAGES.map((s, i) => {
              const now = i === current;
              const done = i < current;
              const prog = stageProgress(burnedPercent, i);
              return (
                <li
                  key={s.key}
                  data-stage-card
                  aria-current={now ? 'step' : undefined}
                  className={`flex w-[min(80vw,34rem)] flex-col border-4 border-lcd-ink p-5 sm:p-6 ${now ? 'bg-lcd-ink text-lcd' : 'text-lcd-ink'}`}
                >
                  <div className="flex items-start justify-between gap-3 font-lcd text-[0.85rem] uppercase">
                    <span>{range(s.from, s.to)}</span>
                    <span className={now ? 'bg-lcd px-1.5 text-lcd-ink' : ''}>{now ? 'munch is here' : done ? 'done' : 'not yet'}</span>
                  </div>
                  <div data-stage-art className="flex h-[min(34vw,11rem)] items-end justify-center py-4">
                    <Pet stage={s.key} crack={i === 0 ? cracks : undefined} pal={now ? LCD_INV : undefined} className={`h-full w-auto ${i === 0 ? 'aspect-[14/16]' : i === 1 ? 'aspect-[14/13]' : i === 2 ? 'aspect-[18/17]' : 'aspect-[24/22]'} ${!now && !done ? 'opacity-45' : ''}`} />
                  </div>
                  <h3 className="m-0 font-lcd text-[clamp(2rem,3vw,2.6rem)] leading-none">{s.name}</h3>
                  <p className="m-0 mt-3 text-[1rem] leading-relaxed">{s.blurb}</p>
                  {i === 0 ? (
                    // the egg hatches in four beats: three cracks, then out
                    <div className="mt-auto pt-5">
                      <div className="flex justify-between font-lcd text-[0.8rem] uppercase">
                        <span>says: “{done ? s.says : EGG_SAYS[cracks]}”</span>
                        <span>{done ? 'hatched' : `${cracks}/${EGG_CRACKS} cracks`}</span>
                      </div>
                      <div className={`mt-1.5 grid h-3 grid-cols-4 gap-[3px] border-2 p-[2px] ${now ? 'border-lcd' : 'border-lcd-ink'}`}>
                        {Array.from({ length: EGG_CRACKS + 1 }, (_, k) => (
                          <span key={k} className={done || k < cracks ? (now ? 'bg-lcd' : 'bg-lcd-ink') : ''} />
                        ))}
                      </div>
                      {now ? (
                        <p className="m-0 mt-2 font-lcd text-[0.8rem] uppercase">
                          {cracks < EGG_CRACKS ? `next crack at ${+nextCrackAt(burnedPercent).toFixed(3)}% eaten` : `hatches at ${s.to}% eaten`}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-auto pt-5">
                      <div className="flex justify-between font-lcd text-[0.8rem] uppercase">
                        <span>says: “{s.says}”</span>
                        <span>{Math.round(prog * 100)}%</span>
                      </div>
                      <div className={`mt-1.5 h-3 border-2 p-[2px] ${now ? 'border-lcd' : 'border-lcd-ink'}`}>
                        <div className={`h-full ${now ? 'bg-lcd' : 'bg-lcd-ink'}`} style={{ width: `${prog * 100}%` }} />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* the rail: where MUNCH is between hatching and full grown */}
        <div className="mx-auto w-full max-w-[84rem]" aria-label={`${fmtPct(burnedPercent)}% of supply eaten`}>
          <div className="relative h-4 border-[3px] border-lcd-ink">
            <div data-rail-fill className="absolute inset-y-0 left-0 w-full origin-left bg-lcd-ink" style={{ transform: `scaleX(${along})` }} />
            {STAGES.slice(1).map((s, i) => (
              <span key={s.key} className="absolute inset-y-0 w-[3px] bg-lcd-mid" style={{ left: `${((i + 1) / STAGES.length) * 100}%` }} />
            ))}
            <span data-rail-pin className="absolute -top-9 -translate-x-1/2 whitespace-nowrap bg-lcd-ink px-2 py-0.5 font-lcd text-[0.8rem] text-lcd" style={{ left: `${along * 100}%` }}>
              {fmtPct(burnedPercent)}% eaten
            </span>
          </div>
          <div className="mt-2 grid grid-cols-4 font-lcd text-[0.78rem] uppercase text-lcd-ink">
            {STAGES.map((s) => (
              <span key={s.key}>{s.from}%</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
