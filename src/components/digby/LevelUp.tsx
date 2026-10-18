import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SpriteCard } from './Sprite';
import { STAGES, fmtPct, stageIndexFor, stageProgress } from './stages';

interface LevelUpProps {
  burnedPercent: number;
  tokenSymbol: string;
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pctLabel = (p: number) => `${p}%`;

/** Digby's five stages, read from the real share of supply at 0x…dEaD. The current one is lit. */
export function LevelUp({ burnedPercent, tokenSymbol }: LevelUpProps) {
  const now = stageIndexFor(burnedPercent);
  const cur = STAGES[now];
  const next = STAGES[now + 1];
  const prog = stageProgress(burnedPercent, now);
  const ref = useRef<HTMLElement>(null);

  // the five stages come up out of the ground one after another, like headstones; the meter then fills to the live reading
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-stage-card]', {
          clipPath: 'inset(100% 0 0 0)',
          yPercent: 12,
          duration: 0.6,
          ease: 'steps(6)',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-stage-row]', start: 'top 82%', once: true },
        });
        gsap.from('[data-meter] > span', {
          opacity: 0,
          duration: 0.05,
          stagger: 0.035,
          ease: 'steps(1)',
          scrollTrigger: { trigger: '[data-meter]', start: 'top 88%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="stages" aria-labelledby="stages-title" className="relative px-4 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-[84rem]">
        <div className="max-w-[46rem]">
          <h2 id="stages-title" className="display m-0 text-[clamp(2.4rem,5vw,4.2rem)] text-cream">
            Digby levels up
          </h2>
          <p className="m-0 mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-mist">
            Digby levels up with the share of all {tokenSymbol} sitting at 0x…dEaD, read live from the chain. Five stages, each with new gear. No one can skip one: the only way up is more burials.
          </p>
        </div>

        <div className="slab mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 sm:p-6">
          <div className="label text-[0.8rem] text-cream">
            now: <span className="text-ecto">stage {cur.n} · {cur.name}</span>
          </div>
          <div className="min-w-0">
            <div className="flex justify-between gap-4 text-[0.9rem] text-mist">
              <span className="tabular">{fmtPct(burnedPercent)}% buried</span>
              <span className="tabular">{next ? `stage ${next.n} at ${pctLabel(next.from)}` : 'top stage reached'}</span>
            </div>
            <div data-meter className="mt-2 grid h-5 gap-[3px] bg-ink p-[3px] shadow-[0_0_0_3px_var(--color-ink-soft)]" style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(prog * 100)} aria-label={`Progress to the next stage, ${Math.round(prog * 100)}%`}>
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className={i < Math.round(prog * 20) ? 'bg-ecto' : 'bg-ink-soft'} />
              ))}
            </div>
          </div>
        </div>

        <ol data-stage-row className="m-0 mt-8 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3 lg:grid-cols-5">
          {STAGES.map((s, i) => {
            const state = i < now ? 'done' : i === now ? 'now' : 'ahead';
            return (
              <li key={s.n} className="flex min-w-0 flex-col gap-3">
                <div data-stage-card className={`relative ${state === 'now' ? 'shadow-[0_0_0_3px_var(--color-ecto)]' : 'shadow-[0_0_0_3px_var(--color-ink-soft)]'}`}>
                  <SpriteCard
                    art={state === 'now' ? 'dig' : 'idle'}
                    stage={s.n}
                    locked={state === 'ahead'}
                    label={state === 'ahead' ? `Stage ${s.n} is locked until ${pctLabel(s.from)} of the supply is buried` : `Digby at stage ${s.n}, ${s.name}: ${s.gear}`}
                    className="w-full"
                  />
                  {state === 'now' ? <span className="label absolute left-0 top-0 bg-ecto px-2 py-1 text-[0.65rem] text-ink">now</span> : null}
                </div>
                <div>
                  <div className="label text-[0.7rem] text-mist">
                    stage {s.n} · {s.from === 0 ? 'from day one' : `${pctLabel(s.from)} buried`}
                  </div>
                  <h3 className={`m-0 mt-1 font-logo text-[1.4rem] font-bold leading-tight ${state === 'ahead' ? 'text-mist' : 'text-cream'}`}>{state === 'ahead' ? '???' : s.name}</h3>
                  <p className="m-0 mt-1 text-[0.95rem] leading-snug text-mist">{state === 'ahead' ? `New gear unlocks when ${pctLabel(s.from)} of the supply is in the ground.` : s.blurb}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
