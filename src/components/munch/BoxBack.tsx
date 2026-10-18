import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CHOMPER, COIN, EGG, FEEDER, LCD, MUNCHLET, Sprite } from './sprites';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BoxBackProps {
  tokenSymbol: string;
  deadAddress: string;
}

const PANELS = (sym: string) => [
  {
    when: 'Day 0',
    title: 'Thrown away',
    text: 'Someone got bored of a cheap virtual pet and threw it into 0x…dEaD, the address nothing ever comes back from. The screen cracked. The egg inside did not.',
    art: (
      <svg viewBox="0 0 40 26" className="h-full w-full" shapeRendering="crispEdges">
        <Sprite rows={EGG} x={13} y={5} px={1} pal={LCD} />
        <rect x="2" y="25" width="36" height="1" fill="#2f3a22" />
        <rect x="6" y="3" width="1" height="2" fill="#8a9666" />
        <rect x="31" y="6" width="1" height="2" fill="#8a9666" />
      </svg>
    ),
  },
  {
    when: 'Day 1',
    title: 'It hatched hungry',
    text: `Down there the only food is tokens, and it only likes one kind. Every ${sym} it eats is gone from the supply for good.`,
    art: (
      <svg viewBox="0 0 40 26" className="h-full w-full" shapeRendering="crispEdges">
        <Sprite rows={MUNCHLET} x={9} y={12} px={1} pal={LCD} />
        <Sprite rows={COIN} x={26} y={6} px={1} pal={LCD} />
        <rect x="2" y="25" width="36" height="1" fill="#2f3a22" />
      </svg>
    ),
  },
  {
    when: 'Day 2+',
    title: 'Feeding time, forever',
    text: 'Every trade fills its bowl. The auto-feeder never sleeps: odd feedings MUNCH eats, even feedings go in the snack jar. And it keeps on growing.',
    art: (
      <svg viewBox="0 0 40 26" className="h-full w-full" shapeRendering="crispEdges">
        <Sprite rows={FEEDER} x={2} y={9} px={1} pal={LCD} />
        <Sprite rows={COIN} x={12} y={16} px={1} pal={LCD} />
        <Sprite rows={CHOMPER} x={20} y={8} px={1} pal={LCD} />
        <rect x="2" y="25" width="36" height="1" fill="#2f3a22" />
      </svg>
    ),
  },
];

/** A barcode printed from the dead address itself: each hex digit becomes a bar and a gap. */
function Barcode({ value }: { value: string }) {
  const bars = useMemo(() => {
    const hex = value.replace(/^0x/, '').toLowerCase();
    let x = 0;
    const out: { x: number; w: number }[] = [];
    for (const ch of hex) {
      const n = parseInt(ch, 16) || 0;
      const w = 1 + (n % 3);
      out.push({ x, w });
      x += w + 1 + (n >> 2) % 2;
    }
    return { out, width: x };
  }, [value]);
  return (
    <svg viewBox={`0 0 ${bars.width} 30`} className="h-14 w-full max-w-[15rem]" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
      {bars.out.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="30" fill="#2a1633" />
      ))}
    </svg>
  );
}

/** The back of the box: the story in three panels, and the fine print. The pack turns round as it arrives. */
export function BoxBack({ tokenSymbol, deadAddress }: BoxBackProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-box]',
          { rotateY: -70, rotateX: 8, scale: 0.86, transformPerspective: 1400 },
          { rotateY: 0, rotateX: 0, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: '[data-box]', start: 'top bottom', end: 'top 25%', scrub: 0.6 } },
        );
        ScrollTrigger.batch('[data-panel]', {
          start: 'top 85%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'steps(5)', stagger: 0.1 }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ink px-3 py-20 sm:px-5 sm:py-28">
      <div data-box className="cardboard mx-auto max-w-[84rem] rounded-[22px] px-5 pb-8 pt-10 sm:px-10 sm:pb-10 lg:px-14 lg:pt-14">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <h2 id="story-title" className="logo-sm m-0 max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)]">
            How MUNCH got in the box
          </h2>
          <p className="m-0 max-w-[36ch] text-[1.05rem] font-semibold leading-snug text-ink">Read the back before you feed it. It only goes one way.</p>
        </div>

        <ol className="m-0 mt-12 grid list-none items-start gap-6 p-0 md:grid-cols-3">
          {PANELS(tokenSymbol).map((p, i) => (
            <li key={p.title} data-panel className={`rounded-[18px] bg-cream p-4 ring-4 ring-ink ${i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-20' : ''}`}>
              <div className="lcd relative aspect-[40/26] w-full rounded-lg ring-4 ring-ink">
                {p.art}
                <span className="absolute left-2.5 top-2 font-lcd text-[0.8rem] uppercase text-lcd-ink">{p.when}</span>
              </div>
              <h3 className="m-0 mt-4 font-logo text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight text-ink">{p.title}</h3>
              <p className="m-0 mt-2 text-[1rem] leading-relaxed text-ink">{p.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 border-t-4 border-dashed border-ink/40 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <dl className="m-0 grid max-w-[60ch] gap-x-8 gap-y-2 text-[0.92rem] text-ink sm:grid-cols-2">
            {[
              ['Contents', '1 pet, alive'],
              ['Batteries', 'not needed, runs on trading fees'],
              ['Feeds on', `${tokenSymbol} only`],
              ['Warning', 'anything MUNCH eats is gone for good'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="font-bold uppercase">{k}:</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col items-start gap-1 md:items-end">
            <Barcode value={deadAddress} />
            <span className="font-mono text-[0.72rem] text-ink">{deadAddress}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
