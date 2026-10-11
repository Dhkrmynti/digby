import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ScrollText, X } from 'lucide-react';
import type { FlywheelState, MachineConfig } from '../../types';
import { sounds } from '../../utils/audio';
import { NODE_CODES, type NodeCodeData } from './nodeCodes';

interface UnderTheRideProps {
  state?: FlywheelState;
  config?: MachineConfig;
  onOpenManifest?: () => void;
}

const SIGN = "'Bungee', sans-serif";
const MONO = "'Courier Prime', monospace";

const Packet = ({ path, color, dur = '1.8s' }: { path: string; color: string; dur?: string }) => (
  <g>
    <path d={path} fill="none" stroke={color} strokeWidth="4" strokeDasharray="12 10" />
    <circle r="11" fill={color} opacity="0.3">
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
    <circle r="5" fill="#fff2b8">
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

/** A painted board on the maintenance wall. */
const Board = ({
  id, x, y, w, h, title, sub, active, color = '#ffcf3a', onSelect,
}: { id: string; x: number; y: number; w: number; h: number; title: string; sub: string; active: boolean; color?: string; onSelect: (id: string) => void }) => (
  <g onClick={() => onSelect(id)} onKeyDown={keyActivate(() => onSelect(id))} className="group cursor-pointer" role="button" tabIndex={0} aria-label={`Read the ${title} code`}>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={active ? '#3a2350' : '#2a1838'} stroke={active ? color : '#463056'} strokeWidth={active ? 4 : 2.5} style={{ transition: 'stroke .4s, fill .4s' }} />
    <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx="7" fill="none" stroke="#f6eedd" strokeOpacity="0.25" strokeWidth="1.5" />
    <text x={x + w / 2} y={y + h / 2 + 2} textAnchor="middle" fill={active ? '#fff2b8' : '#f6eedd'} fontFamily={SIGN} fontSize="20" className="transition-[fill] group-hover:fill-[#ffcf3a]">
      {title}
    </text>
    <text x={x + w / 2} y={y + h / 2 + 24} textAnchor="middle" fill="#b7a9c4" fontFamily={MONO} fontSize="13">
      {sub}
    </text>
  </g>
);

const Gear = ({ id, cx, label, active, onSelect }: { id: string; cx: number; label: string; active: boolean; onSelect: (id: string) => void }) => (
  <g onClick={() => onSelect(id)} onKeyDown={keyActivate(() => onSelect(id))} className="group cursor-pointer" role="button" tabIndex={0} aria-label={`Read the ${label} code`}>
    <circle cx={cx} cy={352} r="30" fill={active ? '#3a2350' : '#1d1027'} stroke={active ? '#ffcf3a' : '#463056'} strokeWidth="3" />
    {[0, 45, 90, 135].map((a) => (
      <rect key={a} x={cx - 4} y={316} width="8" height="72" rx="2" fill={active ? '#ffcf3a' : '#463056'} transform={`rotate(${a} ${cx} 352)`} opacity="0.55" />
    ))}
    <circle cx={cx} cy={352} r="11" fill="#0e0714" stroke={active ? '#ffcf3a' : '#6b5a78'} strokeWidth="2.5" />
    <text x={cx} y={410} textAnchor="middle" fill="#b7a9c4" fontFamily={SIGN} fontSize="13" className="transition-[fill] group-hover:fill-[#ffcf3a]">
      {label}
    </text>
  </g>
);

export function UnderTheRide({ state, config, onOpenManifest }: UnderTheRideProps) {
  const isConfigured = Boolean(
    config?.tokenAddress &&
      config.tokenAddress.trim().startsWith('0x') &&
      config.tokenAddress.trim().length === 42 &&
      config.tokenAddress.toLowerCase() !== 'none',
  );

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

  // Light the track only while the bot is executing on-chain
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
  const branch = isBurn ? '#ffcf3a' : '#a6ff4d';
  const lit = (step: number) => activeStep >= step;

  const pTradeToBot = 'M 170 160 L 290 160';
  const pBotToSwitch = 'M 520 160 L 606 160';
  const pToBurial = 'M 680 146 C 740 146, 740 110, 800 110';
  const pToWages = 'M 680 174 C 740 174, 740 270, 800 270';
  const pBotToRpc = 'M 340 206 C 340 270, 210 270, 210 322';
  const pBotToBox = 'M 385 206 C 385 270, 330 270, 330 322';
  const pBotToDex = 'M 430 206 C 430 270, 450 270, 450 322';
  const pBotToYard = 'M 475 206 C 475 270, 570 270, 570 322';

  const statusLine =
    activeStep >= 0
      ? isBurn
        ? ['A trade landed. Waking Mort’s bot…', 'Mort’s bot is reading the coin box over RPC…', 'Odd ride: switching the track to the graveyard…', 'Buying back and burying at 0x…dEaD…'][activeStep]
        : ['A trade landed. Waking Mort’s bot…', 'Mort’s bot is reading the coin box over RPC…', 'Even ride: switching the track to Mort’s wages…', 'Paying Mort’s wages to the creator wallet…'][activeStep]
      : !isConfigured
        ? 'The ride is closed until the token address is set.'
        : state?.lastActionText || `Waiting at the station. Coin box: ${(state?.currentEscrowBalanceETH || 0).toFixed(4)} ETH.`;

  return (
    <section id="engine" aria-labelledby="engine-title" className="relative px-5 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="engine-title" className="m-0 sign-lettering text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.95] text-cream">
            Under the ride
          </h2>
          <p className="m-0 max-w-[48ch] text-[1.05rem] leading-relaxed text-dust lg:justify-self-end">
            The bot that runs the ride, drawn as it runs. The track lights up while a ride is happening on-chain. Tap any part to read the code it executes.
          </p>
        </div>

        {/* status strip */}
        <div className="mt-10 flex flex-col gap-3 rounded-xl border-2 border-plum-line bg-night-deep px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-display text-[0.8rem]">
            <span className="flex items-center gap-2 text-cream">
              <span className="bulb h-3 w-3" data-lit={isConfigured ? 'true' : 'false'} aria-hidden="true" />
              {!isConfigured ? 'Ride closed' : state?.isWheelSpinning ? 'Ride in motion' : 'At the station'}
            </span>
            <span className={isBurn ? 'text-bulb' : 'text-slime'}>{isBurn ? 'Odd ride · burial' : 'Even ride · Mort’s wages'}</span>
          </div>
          <p className="m-0 font-mono text-[0.92rem] leading-snug text-dust md:max-w-[60ch] md:text-right">{statusLine}</p>
        </div>

        {/* the maintenance board */}
        <div className="mt-4 overflow-x-auto rounded-xl border-2 border-plum-line bg-[#120919]">
          <div className="min-w-[860px]">
            <svg viewBox="0 0 1000 450" className="block h-auto w-full" role="group" aria-label="Engine map of Mort’s ghost train">
              {[pTradeToBot, pBotToSwitch, pToBurial].map((d) => (
                <path key={d} d={d} fill="none" stroke="#463056" strokeWidth="6" strokeLinecap="round" />
              ))}
              <path d={pToWages} fill="none" stroke="#3a4a32" strokeWidth="6" strokeLinecap="round" />
              {[pBotToRpc, pBotToBox, pBotToDex, pBotToYard].map((d) => (
                <path key={d} d={d} fill="none" stroke="#463056" strokeWidth="2" strokeDasharray="5 7" />
              ))}

              {activeStep === 0 && <Packet path={pTradeToBot} color="#ffcf3a" />}
              {activeStep === 1 && (
                <g>
                  <Packet path={pBotToSwitch} color="#ffcf3a" />
                  {[pBotToRpc, pBotToBox, pBotToDex, pBotToYard].map((d, i) => (
                    <Packet key={d} path={d} color="#d7263d" dur={`${1.4 + i * 0.2}s`} />
                  ))}
                </g>
              )}
              {activeStep >= 2 && <Packet path={isBurn ? pToBurial : pToWages} color={branch} />}

              <Board onSelect={open} id="trigger" x={20} y={120} w={150} h={80} title="Trade" sub="swap on the DEX" active={lit(0)} />
              <Board onSelect={open} id="agent" x={290} y={110} w={230} h={96} title="Mort’s bot" sub="runs the ride, 24/7" active={lit(1)} />
              <g onClick={() => open('condition')} onKeyDown={keyActivate(() => open('condition'))} className="group cursor-pointer" role="button" tabIndex={0} aria-label="Read the track switch code">
                <circle cx={643} cy={160} r={36} fill="#1d1027" stroke={lit(2) ? branch : '#463056'} strokeWidth={lit(2) ? 4 : 2.5} />
                <path d="M622 172 L643 142 L664 172" fill="none" stroke={lit(2) ? '#fff2b8' : '#9686a6'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <text x={643} y={220} textAnchor="middle" fill="#b7a9c4" fontFamily={SIGN} fontSize="14" className="transition-[fill] group-hover:fill-[#ffcf3a]">
                  Switch
                </text>
                <text x={643} y={238} textAnchor="middle" fill="#9686a6" fontFamily={MONO} fontSize="12">
                  odd / even
                </text>
              </g>
              <Board onSelect={open} id="buybackAction" x={800} y={74} w={180} h={74} title="Burial" sub="buy, then 0xdEaD" active={lit(3) && isBurn} />
              <Board onSelect={open} id="creatorPayout" x={800} y={234} w={180} h={74} title="Wages" sub="to creator wallet" active={lit(3) && !isBurn} color="#a6ff4d" />

              <Gear onSelect={open} id="rpc" cx={210} label="RPC" active={activeStep === 1} />
              <Gear onSelect={open} id="memory" cx={330} label="Coin box" active={activeStep === 1} />
              <Gear onSelect={open} id="dex" cx={450} label="DEX" active={activeStep === 1} />
              <Gear onSelect={open} id="burn" cx={570} label="Graveyard" active={activeStep === 1} />
            </svg>
          </div>
        </div>
        <p className="m-0 mt-2 text-[0.85rem] text-dust-dim md:hidden">Swipe the board sideways · tap a part to read its code</p>

        {onOpenManifest ? (
          <button type="button" onClick={onOpenManifest} className="btn-night mt-8 cursor-pointer px-5 py-3 text-[0.95rem]">
            <ScrollText className="h-4 w-4" />
            Open the ride manifest
          </button>
        ) : null}
      </div>

      {/* code inspector */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0714d9] p-4" onClick={() => setSelected(null)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ opacity: 0, y: 18, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-plum-line bg-night text-cream shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-start justify-between gap-4 bg-sign px-5 py-4">
                <div>
                  <h3 className="m-0 sign-lettering text-[1.7rem] leading-none">{selected.title}</h3>
                  <div className="mt-2 font-mono text-[0.85rem] text-bulb-hot">{selected.filename}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-cream/60 text-cream hover:border-bulb hover:text-bulb"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="m-0 border-b-2 border-plum-line px-5 py-3 text-[0.95rem] leading-relaxed text-dust">{selected.description}</p>
              <div className="flex-1 overflow-y-auto bg-night-deep p-5">
                <pre className="m-0 select-text whitespace-pre-wrap font-mono text-[0.85rem] leading-relaxed text-bulb-hot">
                  <code>{selected.code}</code>
                </pre>
              </div>
              <div className="flex items-center justify-between gap-3 border-t-2 border-plum-line px-5 py-4">
                <span className="hidden font-mono text-[0.8rem] text-dust-dim sm:inline">Robinhood Chain · ID 4663</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={copyCode} className="btn-admit cursor-pointer px-4 py-2 text-[0.85rem]">
                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedCode ? 'Copied' : 'Copy code'}
                  </button>
                  <button type="button" onClick={() => setSelected(null)} className="btn-night cursor-pointer px-4 py-2 text-[0.85rem]">
                    Close
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
