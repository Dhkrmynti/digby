import { useState, useEffect, useRef } from 'react';
import { useFlywheelEngine } from './hooks/useBurnEngine';
import { PONS_V2_CONFIG } from './contracts';
import { sounds } from './utils/audio';
import { Volume2, VolumeX, Copy, Check, ArrowUpRight, ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BurnLedgerDrawer } from './components/BurnLedgerDrawer';
import { MemexAdmin } from './components/MemexAdmin';
import { LavaMark } from './components/lava/LavaMark';
import { LiveNumber } from './components/lava/LiveNumber';
import { PitScene, type PitHandle } from './components/lava/PitScene';
import { FeeBar } from './components/lava/FeeBar';
import { RunSequence } from './components/lava/RunSequence';
import { LavaLog } from './components/lava/LavaLog';
import { ShiftBoard } from './components/lava/ShiftBoard';
import { Flames, Lava } from './components/lava/sprites';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** What Brr says when a block goes in. */
const BRR_SAYS = [
  'brr? not down here.',
  'tssss.',
  'in it goes.',
  'odd runs: lava. even runs: chest.',
  'keep trading, miner.',
  'too hot. keep going.',
  'i miss the ice. anyway.',
  'nothing comes back out.',
];

/** X account for the project: empty until there is one. */
const X_URL = '';
const EXPLORER_URL = 'https://explorer.mainnet.chain.robinhood.com';
/** Where to trade and where to watch, once the CA is known. */
const buyUrl = (ca: string) => (ca ? `https://ponsfamily.com/launchpad/${ca}` : EXPLORER_URL);
const chartUrl = (ca: string) => (ca ? `https://dexscreener.com/robinhood/${ca}` : EXPLORER_URL);

const STORY = [
  {
    day: 'Day 0',
    title: 'The wrong turn',
    text: 'A penguin slid off his iceberg, missed the sea, and fell down a mine shaft. He landed at the very bottom, found a hard hat and a pickaxe, and decided to stay. His name is Brr.',
    note: 'he is always sweating',
  },
  {
    day: 'Day 1',
    title: 'The pit',
    text: 'At the bottom he broke into a lake of lava. Anything dropped in melts and is gone for good. On chain, the lava has an address: 0x…dEaD.',
    note: 'nothing comes back out',
  },
  {
    day: 'Every day since',
    title: 'The shift',
    text: 'Every $LAVA trade drops a little ETH ore into the fee escrow. When the bar is full, Brr does a run: odd runs he buys $LAVA and drops it in the lava, even runs he fills the chest.',
    note: 'the pit is always hungry',
  },
];

const WORD = ['L', 'A', 'V', 'A', ' ', 'P', 'I', 'T'];

export function App() {
  const { state, config, setConfig, logs, burnLedger } = useFlywheelEngine();

  const getIsMemex = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/memex') || hash.startsWith('#memex') || hash.startsWith('#/memex');
  };

  const [isMemexRoute, setIsMemexRoute] = useState(getIsMemex());
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedDead, setCopiedDead] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [thrown, setThrown] = useState(0);
  const [sayIndex, setSayIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const pitRef = useRef<PitHandle>(null);

  useEffect(() => {
    const handleLocationChange = () => setIsMemexRoute(getIsMemex());
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Late fonts change line heights; re-measure every trigger once they land
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // While the bot is really running, Brr keeps throwing
  useEffect(() => {
    if (!state.isWheelSpinning) return;
    const id = window.setInterval(() => pitRef.current?.toss(), 1800);
    return () => window.clearInterval(id);
  }, [state.isWheelSpinning]);

  const throwOne = () => {
    setThrown((prev) => prev + 1);
    setSayIndex((prev) => (prev + 1) % BRR_SAYS.length);
    pitRef.current?.toss();
    sounds.playBuybackSound();
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsMemexRoute(false);
  };

  const threshold = state.currentThresholdETH || state.claimThresholdETH || config.claimThresholdETH || 0;
  const escrow = state.currentEscrowBalanceETH || 0;
  const barFill = threshold > 0 ? Math.max(0, Math.min(1, escrow / threshold)) : 0;

  // The lava glow warms as the bar fills
  useEffect(() => {
    document.documentElement.style.setProperty('--hearth', barFill.toFixed(3));
  }, [barFill]);

  useGSAP(
    () => {
      if (isMemexRoute) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Arrival: the letters drop out of the sky and land on the grass, then Brr throws one in
        const intro = gsap.timeline();
        intro
          .from('[data-drop]', { y: () => -window.innerHeight * 0.5, duration: 0.8, ease: 'bounce.out', stagger: 0.06 }, 0.1)
          .from('[data-hero-line]', { y: 16, opacity: 0, duration: 0.4, ease: 'steps(4)', stagger: 0.07 }, 0.5)
          .call(() => pitRef.current?.toss(), [], 1.2);

        // Leaving the first view: the sky slides away slower than the rock
        gsap.to('[data-sky-far]', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });

        // Signs and log rows land in steps, like blocks being placed
        gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((el, i) => {
          gsap.from(el, { y: 60, opacity: 0, duration: 0.5, ease: 'steps(5)', delay: i * 0.08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });
        ScrollTrigger.batch('[data-log-row]', {
          start: 'top 92%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.3, ease: 'steps(3)', stagger: 0.06 }),
        });
      });

      // The finale (desktop): the lava rises and fills the screen
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const fin = gsap.timeline({ scrollTrigger: { trigger: '[data-exit]', start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
        fin
          .fromTo('[data-final-lava]', { yPercent: 88 }, { yPercent: 0, ease: 'steps(16)', duration: 1 })
          .fromTo('[data-final-copy]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'steps(4)' }, 0.65);
      });
      return () => {
        mm.revert();
      };
    },
    { scope: pageRef, dependencies: [isMemexRoute] },
  );

  if (isMemexRoute) {
    return <MemexAdmin onBack={navigateToHome} />;
  }

  const copyCA = () => {
    if (!config.tokenAddress) return;
    navigator.clipboard.writeText(config.tokenAddress);
    setCopiedCA(true);
    sounds.playClaimSound();
    setTimeout(() => setCopiedCA(false), 2500);
  };

  const copyDead = () => {
    navigator.clipboard.writeText(config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress);
    setCopiedDead(true);
    sounds.playBurnSound();
    setTimeout(() => setCopiedDead(false), 2000);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(num));

  const totalTokensBurned =
    state.totalTokensBurned > 0
      ? state.totalTokensBurned
      : burnLedger.reduce((acc, cur) => acc + (cur.burnedJollyburn || cur.burnedMuseburn || cur.burnedIncinerator || 0), 0);

  const burnedPercent =
    state.burnedPercentageOfSupply > 0
      ? state.burnedPercentageOfSupply
      : state.totalSupply > 0
        ? (totalTokensBurned / state.totalSupply) * 100
        : 0;

  const tokenSymbol = '$LAVA';
  const deadAddress = config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress;
  const isConfigured = Boolean(config.tokenAddress && config.tokenAddress.startsWith('0x') && config.tokenAddress.length === 42);
  const nextCycle = state.nextCycleType || 'burn';
  const routerName = state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'the Pons bonding curve';

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-x-clip bg-night font-body text-star">
      {/* ───────── The nav ───────── */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${scrolled ? 'bg-night/95 shadow-[0_4px_0_#0b0806]' : ''}`}>
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-10 lg:px-16">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-star no-underline"
            aria-label="Lava Pit home"
          >
            <LavaMark className="h-8 w-10 transition-transform duration-150 group-hover:-translate-y-1" />
            <span className="px-title text-[1.6rem]">Lava Pit</span>
          </a>

          <nav className="hidden items-center gap-6 pxl text-[0.72rem] text-star md:flex" aria-label="Sections">
            <a href="#run" className="no-underline hover:text-ring-hot">the run</a>
            <a href="#log" className="no-underline hover:text-ring-hot">the log</a>
            <a href="#chest" className="no-underline hover:text-ring-hot">the chest</a>
            <a href="#shift" className="no-underline hover:text-ring-hot">brr</a>
            <button type="button" onClick={() => setIsLogOpen(true)} className="pxl cursor-pointer hover:text-ring-hot">
              full log
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
              title={config.soundEnabled ? 'Mute the mine' : 'Turn the sounds on'}
              aria-label={config.soundEnabled ? 'Mute the mine' : 'Turn the sounds on'}
              className="btn-ghost h-10 w-10 cursor-pointer"
            >
              {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            {X_URL ? (
              <a href={X_URL} target="_blank" rel="noreferrer" title="Lava Pit on X" aria-label="Lava Pit on X" className="btn-ghost h-10 w-10">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.2-8.2L2.9 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
                </svg>
              </a>
            ) : null}
            {config.tokenAddress ? (
              <button type="button" onClick={copyCA} className="btn-ring hidden h-10 cursor-pointer px-4 text-[0.72rem] lg:inline-flex" title="Copy contract address">
                {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCA ? 'Copied' : <>CA <span className="font-mono text-[0.8rem] normal-case tracking-normal">{`${config.tokenAddress.slice(0, 6)}…${config.tokenAddress.slice(-4)}`}</span></>}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ───────── The mine, cut open ───────── */}
        <section data-hero aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col">
          {/* the sky above the mine, with the name standing on the grass */}
          <div className="relative overflow-hidden bg-[#2b2347] pt-16 sm:pt-[4.5rem]">
            <div data-sky-far className="pointer-events-none absolute inset-0" aria-hidden="true">
              {Array.from({ length: 26 }, (_, i) => (
                <span key={i} className="absolute block h-1 w-1 bg-[#f4ecdc]" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 80}%`, opacity: i % 3 ? 0.5 : 0.9 }} />
              ))}
              <span className="absolute right-[30%] top-[50%] block h-8 w-8 sm:right-[12%] sm:top-[26%] sm:h-10 sm:w-10 bg-[#f4ecdc] shadow-[inset_-10px_-6px_0_#d8cdb6]" />
            </div>
            <h1 id="hero-title" className="relative m-0 flex justify-center px-4 pt-6 sm:pt-4" aria-label="Lava Pit">
              {WORD.map((ch, i) =>
                ch === ' ' ? (
                  <span key={i} className="w-[0.35em] text-[clamp(3.6rem,13vw,9.5rem)]" aria-hidden="true" />
                ) : (
                  <span key={i} data-drop aria-hidden="true" className={`px-title block translate-y-[0.08em] text-[clamp(3.6rem,13vw,9.5rem)] ${i < 4 ? 'text-ring' : 'text-star'}`}>
                    {ch}
                  </span>
                ),
              )}
            </h1>
          </div>
          <div className="px-grass h-[18px]" aria-hidden="true" />
          <div className="px-dirt h-6 sm:h-8" aria-hidden="true" />

          {/* the rock: the proof, the way in, and the fee bar */}
          <div className="px-stone relative flex-1">
            <div className="mx-auto grid max-w-[84rem] gap-8 px-4 py-8 sm:px-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-14 lg:px-16 lg:py-[3svh]">
              <div className="min-w-0">
                <p data-hero-line className="m-0 pxl text-[0.78rem] text-star-dim">{tokenSymbol} dropped in the lava</p>
                <div data-hero-line className={`mt-1 px-title tabular text-[clamp(2.8rem,7vw,5.6rem)] ${isConfigured ? 'text-ring' : 'text-star-dim'}`}>
                  <LiveNumber value={totalTokensBurned} format={(n) => formatNumber(n)} />
                </div>
                <p data-hero-line className="m-0 mt-1 pxl text-[0.8rem] text-star">
                  {burnedPercent > 0 ? (Math.floor(burnedPercent * 100) / 100).toFixed(2) : '0.00'}% of the whole supply · gone for good
                </p>
                <p data-hero-line className="m-0 mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-star/90">
                  Every {tokenSymbol} trade drops ETH ore into the fee escrow. When the bar is full, Brr claims it, buys {tokenSymbol} back and throws it in the lava at 0x…dEaD. Every other run fills the chest.
                </p>

                <div data-hero-line className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  {config.tokenAddress ? (
                    <button type="button" onClick={copyCA} className="btn-ghost min-w-0 cursor-pointer justify-between gap-3 py-2 pl-4 pr-2 text-left normal-case sm:max-w-[26rem]" title="Copy contract address">
                      <span className="min-w-0">
                        <span className="pxl block text-[0.6rem] text-star-dim">contract address</span>
                        <span className="block truncate font-mono text-[0.8rem] tracking-normal text-star">{config.tokenAddress}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 bg-[#1a1412] px-2.5 py-1.5 text-[0.68rem] uppercase text-ring-hot">
                        {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedCA ? 'copied' : 'copy'}
                      </span>
                    </button>
                  ) : (
                    <p className="m-0 border-[3px] border-dashed border-panel-line px-4 py-3 text-[0.95rem] text-star-dim">The contract address shows up here at launch.</p>
                  )}
                  <div className="flex items-center gap-4">
                    <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring px-6 py-3.5 text-[0.95rem] no-underline">
                      buy {tokenSymbol}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href={chartUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-3 text-[0.8rem] no-underline">
                      chart
                    </a>
                    <button type="button" onClick={() => setIsLogOpen(true)} className="btn-ghost cursor-pointer px-3.5 py-3 text-[0.8rem]" aria-label="Open the full log">
                      <ScrollText className="h-4 w-4" />
                      <span className="hidden sm:inline">log</span>
                    </button>
                  </div>
                </div>
              </div>

              <div data-hero-line className="min-w-0">
                <FeeBar escrow={escrow} threshold={threshold} fill={barFill} nextCycle={nextCycle} live={isConfigured} running={state.isWheelSpinning} />
                <div className="mt-6 flex min-h-[2.2rem] flex-wrap items-center gap-x-4 gap-y-2" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={sayIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: 'linear' }}
                      className="m-0 pxl text-[0.78rem] text-ring-hot"
                    >
                      brr: “{BRR_SAYS[sayIndex]}”
                    </motion.p>
                  </AnimatePresence>
                  <button type="button" onClick={throwOne} className="btn-ghost cursor-pointer px-3 py-1.5 text-[0.66rem]">
                    throw one in · {thrown}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* the bottom of the mine */}
          <PitScene ref={pitRef} blaze={state.isWheelSpinning} className="block h-[130px] w-full sm:h-[clamp(150px,24svh,250px)]" />
        </section>

        <div className="px-stone">
          {/* ───────── One run, pinned ───────── */}
          <RunSequence tokenSymbol={tokenSymbol} escrow={escrow} threshold={threshold} fill={barFill} claimedETH={state.totalFeesClaimedETH || 0} routerName={routerName} nextCycle={nextCycle} />

          {/* ───────── The lava log and the chest ───────── */}
          <LavaLog
            burnLedger={burnLedger}
            totalBurned={totalTokensBurned}
            logs={logs}
            tokenSymbol={tokenSymbol}
            deadAddress={deadAddress}
            explorerUrl={EXPLORER_URL}
            copiedDead={copiedDead}
            onCopyDead={copyDead}
            onOpenLog={() => setIsLogOpen(true)}
          />

          {/* ───────── Brr's shift ───────── */}
          <ShiftBoard state={state} config={config} live={isConfigured} onOpenLog={() => setIsLogOpen(true)} />

          {/* ───────── How the pit got here ───────── */}
          <section id="story" aria-labelledby="story-title" className="relative px-4 pb-28 pt-20 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-7xl">
              <h2 id="story-title" className="m-0 max-w-[18ch] display text-[clamp(2.6rem,5.4vw,4.6rem)] text-star">
                How the pit got here
              </h2>
              <ol className="m-0 mt-14 grid list-none items-start gap-10 p-0 md:grid-cols-3">
                {STORY.map((d, i) => (
                  <li key={d.title} data-entry className={`paper px-7 pb-7 pt-6 ${i === 1 ? 'md:mt-12' : i === 2 ? 'md:mt-24' : ''}`}>
                    <p className="m-0 pxl text-[0.72rem] text-pen-soft">{d.day}</p>
                    <h3 className="m-0 mt-1 display text-[clamp(1.8rem,2.4vw,2.2rem)] text-pen">{d.title}</h3>
                    <p className="m-0 mt-3 text-[1.02rem] leading-relaxed text-pen">{d.text}</p>
                    <p className="m-0 mt-4 pxl text-[0.78rem] text-marker">{d.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        {/* ───────── The finale: the lava rises ───────── */}
        <section data-exit aria-labelledby="exit-title" className="relative h-auto lg:h-[200svh]">
          <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-night px-4 py-24 sm:px-10 lg:sticky lg:top-0 lg:h-[100svh] lg:py-0">
            <div data-final-lava className="absolute inset-0" aria-hidden="true">
              <svg viewBox="0 0 240 135" preserveAspectRatio="xMidYMin slice" className="h-full w-full" shapeRendering="crispEdges">
                <Lava x0={0} x1={240} y={16} h={119} seed={5} />
                <Flames x0={0} x1={240} y={16} gap={6} blaze={1.2} seed={4} />
              </svg>
            </div>
            <div data-final-copy className="relative z-10 mx-auto max-w-[54rem] text-center">
              <h2 id="exit-title" className="m-0 px-title text-[clamp(3rem,8.5vw,6.4rem)] text-star [text-shadow:0.06em_0.06em_0_#1a1412]">
                Mine it. Drop it in the lava.
              </h2>
              <p className="mx-auto mt-6 max-w-[44ch] text-[1.15rem] font-medium leading-relaxed text-star">
                Hold {tokenSymbol}, trade {tokenSymbol}, and watch Brr throw the supply in, one run at a time.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-5">
                <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ghost px-8 py-4 text-[1rem] no-underline">
                  buy {tokenSymbol}
                  <ArrowUpRight className="h-5 w-5" />
                </a>
                {config.tokenAddress ? (
                  <button type="button" onClick={copyCA} className="btn-ghost cursor-pointer px-6 py-4 text-[0.9rem]">
                    {copiedCA ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    {copiedCA ? 'copied' : 'copy CA'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <footer className="px-stone relative">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-12 pt-8 text-[0.95rem] text-star-dim sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <div className="flex items-center gap-2.5">
              <LavaMark className="h-7 w-9" />
              <span className="pxl text-[0.72rem] text-star">{tokenSymbol} on Robinhood Chain</span>
            </div>
            <p className="m-0 max-w-[52ch]">Burns and chest runs are done by a bot and every one is on chain. A meme, not financial advice.</p>
            <div className="font-mono text-[0.8rem]">
              Chain ID 4663 · {!isConfigured ? 'mine closed' : state.isWheelSpinning ? 'run in progress' : 'brr on shift'}
            </div>
          </div>
        </footer>
      </main>

      <BurnLedgerDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} logs={logs} burnLedger={burnLedger} state={state} config={config} />
    </div>
  );
}

export default App;
