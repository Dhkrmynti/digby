import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ScrollText, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { FlywheelState, MachineConfig } from '../../types';
import { sounds } from '../../utils/audio';
import { NODE_CODES, type NodeCodeData } from './nodeCodes';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface WatcherWiringProps {
  state?: FlywheelState;
  config?: MachineConfig;
  onOpenLog?: () => void;
}

const DISPLAY = "'Big Shoulders Display', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const PEN = '#1c2a6b';
const PEN_SOFT = '#4a5577';
const MARKER = '#cf3228';
const RING = '#e08a12';
const FUEL = '#1d7262';

const Runner = ({ path, color, dur = '1.8s' }: { path: string; color: string; dur?: string }) => (
  <g>
    <circle r="10" fill={color} opacity="0.22">
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
    <circle r="5" fill={color}>
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
  </g>
);

const keyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

/** A module on the schematic, plotted in pen on the chart paper. */
const Module = ({
  id, x, y, w, h, title, sub, active, color = MARKER, onSelect,
}: { id: string; x: number; y: number; w: number; h: number; title: string; sub: string; active: boolean; color?: string; onSelect: (id: string) => void }) => (
  <g onClick={() => onSelect(id)} onKeyDown={keyActivate(() => onSelect(id))} className="group cursor-pointer" role="button" tabIndex={0} aria-label={`Read the ${title} code`}>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={active ? '#fff7e6' : '#f8f4ea'} stroke={active ? color : PEN} strokeWidth={active ? 4 : 2} style={{ transition: 'stroke .4s, fill .4s' }} />
    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill={active ? color : PEN} fontFamily={DISPLAY} fontWeight="900" fontSize="26" letterSpacing="0.5" className="uppercase transition-[fill] group-hover:fill-[#cf3228]">
      {title}
    </text>
    <text x={x + w / 2} y={y + h / 2 + 25} textAnchor="middle" fill={PEN_SOFT} fontFamily={MONO} fontSize="12">
      {sub}
    </text>
  </g>
);

/** A sensor tapped off the Watcher's bus. */
const Sensor = ({ id, cx, label, active, onSelect }: { id: string; cx: number; label: string; active: boolean; onSelect: (id: string) => void }) => (
  <g onClick={() => onSelect(id)} onKeyDown={keyActivate(() => onSelect(id))} className="group cursor-pointer" role="button" tabIndex={0} aria-label={`Read the ${label} code`}>
    <circle cx={cx} cy={352} r="28" fill={active ? '#fff7e6' : '#f8f4ea'} stroke={active ? MARKER : PEN} strokeWidth={active ? 4 : 2} />
    <circle cx={cx} cy={352} r="16" fill="none" stroke={active ? MARKER : PEN} strokeOpacity="0.5" strokeWidth="1.5" />
    <circle cx={cx} cy={352} r="5" fill={active ? MARKER : PEN} />
    <text x={cx} y={404} textAnchor="middle" fill={PEN} fontFamily={DISPLAY} fontWeight="800" fontSize="16" letterSpacing="1.5" className="uppercase transition-[fill] group-hover:fill-[#cf3228]">
      {label}
    </text>
  </g>
);

export function WatcherWiring({ state, config, onOpenLog }: WatcherWiringProps) {
  const isConfigured = Boolean(
    config?.tokenAddress &&
      config.tokenAddress.trim().startsWith('0x') &&
      config.tokenAddress.trim().length === 42 &&
      config.tokenAddress.toLowerCase() !== 'none',
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [cycleType, setCycleType] = useState<'burn' | 'keep'>(state?.nextCycleType || 'burn');
  const [selected, setSelected] = useState<NodeCodeData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Follow the engine's real cycle type
  useEffect(() => {
    if (state?.currentPhase === 'burn') setCycleType('burn');
    else if (state?.currentPhase === 'keep') setCycleType('keep');
    else if (state?.nextCycleType) setCycleType(state.nextCycleType);
  }, [state?.nextCycleType, state?.currentPhase]);

  // Light the wiring only while the bot is executing on-chain
  useEffect(() => {
    if (state?.isWheelSpinning && state?.currentPhase) {
      const phaseMap: Record<string, number> = { accumulate: 0, claim: 1, buyback: 2, burn: 3, keep: 3 };
      if (state.currentPhase in phaseMap) setActiveStep(phaseMap[state.currentPhase]);
      return;
    }
    setActiveStep(-1);
  }, [state?.isWheelSpinning, state?.currentPhase]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  // The pen plots the wiring as the schematic scrolls into view
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-wire]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: '[data-schematic]', start: 'top 85%', end: 'top 35%', scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const open = (key: string) => {
    sounds.playTone(500, 'sine', 0.06, 0.08);
    const data = NODE_CODES[key];
    if (data) {
      setSelected(data);
      setCopiedCode(false);
    }
  };

  const copyCode = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.code);
    setCopiedCode(true);
    sounds.playTone(800, 'triangle', 0.08, 0.1);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isBurn = cycleType === 'burn';
  const branch = isBurn ? RING : FUEL;
  const lit = (step: number) => activeStep >= step;

  const pTradeToBot = 'M 170 160 L 290 160';
  const pBotToSwitch = 'M 520 160 L 606 160';
  const pToHole = 'M 680 146 C 740 146, 740 110, 800 110';
  const pToFuel = 'M 680 174 C 740 174, 740 270, 800 270';
  const pBotToRpc = 'M 340 206 C 340 270, 210 270, 210 322';
  const pBotToDisk = 'M 385 206 C 385 270, 330 270, 330 322';
  const pBotToDex = 'M 430 206 C 430 270, 450 270, 450 322';
  const pBotToHorizon = 'M 475 206 C 475 270, 570 270, 570 322';

  const statusLine =
    activeStep >= 0
      ? isBurn
        ? ['A trade paid its fee. Waking the Watcher…', 'The Watcher is reading the disk over RPC…', 'Odd orbit: routing to the horizon…', 'Buying back and dropping it into 0x…dEaD…'][activeStep]
        : ['A trade paid its fee. Waking the Watcher…', 'The Watcher is reading the disk over RPC…', 'Even orbit: routing to observatory fuel…', 'Sending the fuel to the creator wallet…'][activeStep]
      : !isConfigured
        ? 'The observatory is dark until the token address is set.'
        : state?.lastActionText || `Watching. Disk: ${(state?.currentEscrowBalanceETH || 0).toFixed(4)} ETH.`;

  return (
    <section ref={sectionRef} id="watcher" aria-labelledby="watcher-title" className="relative px-4 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="watcher-title" className="m-0 display text-[clamp(3rem,6.4vw,5.8rem)] text-star">
            The Watcher’s wiring
          </h2>
          <p className="m-0 max-w-[48ch] text-[1.1rem] leading-relaxed text-star-dim lg:justify-self-end">
            The bot that feeds the hole, plotted as it runs. The wiring lights up while an orbit is running on-chain. Tap any module to read the code it executes.
          </p>
        </div>

        {/* status line */}
        <div className="mt-10 flex flex-col gap-3 rounded-[10px] border border-panel-line bg-panel px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2 label text-[0.75rem] text-star">
              <span className={`block h-2.5 w-2.5 rounded-full ${isConfigured ? 'bg-ring shadow-[0_0_10px_2px_rgba(255,173,66,0.6)]' : 'bg-panel-line'}`} aria-hidden="true" />
              {!isConfigured ? 'observatory dark' : state?.isWheelSpinning ? 'orbit running' : 'watching'}
            </span>
            <span className={`label text-[0.75rem] ${isBurn ? 'text-ring' : 'text-fuel'}`}>{isBurn ? 'odd orbit · falls in' : 'even orbit · observatory fuel'}</span>
          </div>
          <p className="m-0 font-mono text-[0.86rem] leading-snug text-star-dim md:max-w-[60ch] md:text-right">{statusLine}</p>
        </div>

        {/* the schematic, plotted on chart paper */}
        <div data-schematic className="paper mt-4 overflow-x-auto rounded-[6px]">
          <div className="min-w-[860px]">
            <svg viewBox="0 0 1000 450" className="block h-auto w-full" role="group" aria-label="Schematic of the Watcher’s wiring">
              {[pTradeToBot, pBotToSwitch, pToHole, pToFuel].map((d, i) => (
                <path key={d} data-wire d={d} pathLength={1} strokeDasharray="1" fill="none" stroke={i === 3 ? FUEL : PEN} strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
              ))}
              {[pBotToRpc, pBotToDisk, pBotToDex, pBotToHorizon].map((d) => (
                <path key={d} d={d} fill="none" stroke={PEN} strokeOpacity="0.45" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
              ))}

              {activeStep === 0 && <Runner path={pTradeToBot} color={MARKER} />}
              {activeStep === 1 && (
                <g>
                  <Runner path={pBotToSwitch} color={MARKER} />
                  {[pBotToRpc, pBotToDisk, pBotToDex, pBotToHorizon].map((d, i) => (
                    <Runner key={d} path={d} color={PEN} dur={`${1.4 + i * 0.2}s`} />
                  ))}
                </g>
              )}
              {activeStep >= 2 && <Runner path={isBurn ? pToHole : pToFuel} color={branch} />}

              <Module onSelect={open} id="trigger" x={20} y={120} w={150} h={80} title="Trade" sub="a swap pays a fee" active={lit(0)} />
              <Module onSelect={open} id="agent" x={290} y={110} w={230} h={96} title="The Watcher" sub="every block, 24/7" active={lit(1)} />
              <g onClick={() => open('condition')} onKeyDown={keyActivate(() => open('condition'))} className="group cursor-pointer" role="button" tabIndex={0} aria-label="Read the fork code">
                <circle cx={643} cy={160} r={36} fill="#f8f4ea" stroke={lit(2) ? branch : PEN} strokeWidth={lit(2) ? 4 : 2} />
                <path d="M622 172 L643 142 L664 172" fill="none" stroke={lit(2) ? branch : PEN} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <text x={643} y={222} textAnchor="middle" fill={PEN} fontFamily={DISPLAY} fontWeight="900" fontSize="20" letterSpacing="0.5" className="uppercase transition-[fill] group-hover:fill-[#cf3228]">
                  The fork
                </text>
                <text x={643} y={240} textAnchor="middle" fill={PEN_SOFT} fontFamily={MONO} fontSize="12">
                  odd / even
                </text>
              </g>
              <Module onSelect={open} id="buybackAction" x={800} y={74} w={180} h={74} title="Falls in" sub="buy, then 0xdEaD" active={lit(3) && isBurn} color={RING} />
              <Module onSelect={open} id="creatorPayout" x={800} y={234} w={180} h={74} title="Fuel" sub="to creator wallet" active={lit(3) && !isBurn} color={FUEL} />

              <Sensor onSelect={open} id="rpc" cx={210} label="rpc" active={activeStep === 1} />
              <Sensor onSelect={open} id="memory" cx={330} label="the disk" active={activeStep === 1} />
              <Sensor onSelect={open} id="dex" cx={450} label="market" active={activeStep === 1} />
              <Sensor onSelect={open} id="burn" cx={570} label="horizon" active={activeStep === 1} />

              <text x={830} y={400} fontFamily="'Reenie Beanie', cursive" fontSize="30" fill={MARKER} transform="rotate(-3 830 400)">
                tap a module
              </text>
            </svg>
          </div>
        </div>
        <p className="m-0 mt-2 text-[0.95rem] text-star-dim md:hidden">Swipe the schematic sideways · tap a module to read its code</p>

        {onOpenLog ? (
          <button type="button" onClick={onOpenLog} className="btn-ghost mt-8 cursor-pointer px-5 py-2.5 text-[1rem]">
            <ScrollText className="h-4 w-4" />
            open the full log
          </button>
        ) : null}
      </div>

      {/* code inspector */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06080fe0] p-4" onClick={() => setSelected(null)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="paper flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[8px]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-pen/25 px-6 py-5">
                <div>
                  <h3 className="m-0 display text-[2rem] text-pen">{selected.title}</h3>
                  <div className="mt-1 font-mono text-[0.85rem] text-marker">{selected.filename}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-pen/40 text-pen hover:border-marker hover:text-marker"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="m-0 bg-paper/90 px-6 py-3 text-[1rem] leading-relaxed text-pen-soft">{selected.description}</p>
              <div className="flex-1 overflow-y-auto bg-night p-5">
                <pre className="m-0 select-text whitespace-pre-wrap font-mono text-[0.8rem] leading-relaxed text-star">
                  <code>{selected.code}</code>
                </pre>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-pen/25 bg-paper/90 px-6 py-4">
                <span className="hidden font-mono text-[0.8rem] text-pen-soft sm:inline">Robinhood Chain · ID 4663</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={copyCode} className="btn-ring cursor-pointer px-5 py-2 text-[0.95rem]">
                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedCode ? 'copied' : 'copy code'}
                  </button>
                  <button type="button" onClick={() => setSelected(null)} className="btn-pen cursor-pointer px-4 py-2 text-[0.95rem]">
                    close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
