import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useFlywheelEngine } from './hooks/useBurnEngine';
import { PONS_V2_CONFIG } from './contracts';
import { sounds } from './utils/audio';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BurnLedgerDrawer } from './components/BurnLedgerDrawer';
import { Hero } from './components/digby/Hero';
import { LevelUp } from './components/digby/LevelUp';
import { NightShift } from './components/digby/NightShift';
import { Graves } from './components/digby/Graves';
import { Watch } from './components/digby/Watch';
import { Story } from './components/digby/Story';
import { RipAlert } from './components/digby/RipAlert';
import { DigbyMark } from './components/digby/Sprite';
import { DIGBY_SAYS, STAGES, stageIndexFor } from './components/digby/stages';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The operator panel: only the /memex route needs it, so visitors never download it. */
const MemexAdmin = lazy(() => import('./components/MemexAdmin'));

/** X account for the project: empty until there is one. */
const X_URL = '';
/** Telegram group for the project: empty until there is one. */
const TG_URL = '';
const EXPLORER_URL = 'https://explorer.mainnet.chain.robinhood.com';
/** Where to trade and where to watch, once the CA is known. */
const buyUrl = (ca: string) => (ca ? `https://ponsfamily.com/launchpad/${ca}` : EXPLORER_URL);
const chartUrl = (ca: string) => (ca ? `https://dexscreener.com/robinhood/${ca}` : EXPLORER_URL);

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
  const [pokes, setPokes] = useState(0);
  const [burial, setBurial] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('');
  const pageRef = useRef<HTMLDivElement>(null);

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

  const pokeDigby = () => {
    setPokes((prev) => prev + 1);
    sounds.playTone(110, 'square', 0.07, 0.06);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsMemexRoute(false);
  };

  const threshold = state.currentThresholdETH || state.claimThresholdETH || config.claimThresholdETH || 0;
  const escrow = state.currentEscrowBalanceETH || 0;
  const lanternFill = threshold > 0 ? Math.max(0, Math.min(1, escrow / threshold)) : 0;

  useGSAP(
    () => {
      if (isMemexRoute) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.batch('[data-log-row]', {
          start: 'top 92%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.3, ease: 'steps(3)', stagger: 0.06 }),
        });
      });
      // the nav lights the chapter you are in
      ['stages', 'shift', 'graves', 'story'].forEach((id) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActiveSection(id),
          onLeaveBack: (self) => self.trigger?.id === 'stages' && setActiveSection(''),
        }),
      );
      // Sections build their own triggers (children first); put them back in page order and re-measure
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: pageRef, dependencies: [isMemexRoute] },
  );

  if (isMemexRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <MemexAdmin onBack={navigateToHome} />
      </Suspense>
    );
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

  const tokenSymbol = '$DIGBY';
  const deadAddress = config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress;
  const isConfigured = Boolean(config.tokenAddress && config.tokenAddress.startsWith('0x') && config.tokenAddress.length === 42);
  const nextCycle = state.nextCycleType || 'burn';
  const graves = burnLedger.filter((e) => e.cycleType !== 'keep' && ((e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0) > 0 || e.burnTx)).length;
  const stage = STAGES[stageIndexFor(burnedPercent)];
  const routerName = state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'the Pons bonding curve';

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-x-clip bg-ink font-body text-ink">
      {/* ───────── The nav ───────── */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${scrolled ? 'bg-ink shadow-[0_3px_0_var(--color-ink-soft)]' : ''}`}>
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-10 lg:px-16">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-3 text-cream no-underline"
            aria-label="DIGBY home"
          >
            <DigbyMark stage={stage.n} className="h-8 w-9 transition-transform duration-150 group-hover:-translate-y-1" />
            <span className="font-logo text-[1.6rem] font-bold leading-none">DIGBY</span>
          </a>

          <nav className="label hidden items-center gap-6 text-[0.75rem] text-cream md:flex" aria-label="Sections">
            {[
              ['stages', 'stages'],
              ['shift', 'night shift'],
              ['graves', 'graves'],
              ['story', 'story'],
            ].map(([id, name]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? 'location' : undefined}
                className={`no-underline underline-offset-[6px] decoration-[3px] hover:text-ecto ${activeSection === id ? 'text-ecto underline' : ''}`}
              >
                {name}
              </a>
            ))}
            <button type="button" onClick={() => setIsLogOpen(true)} className="label cursor-pointer hover:text-ecto">
              register
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
              title={config.soundEnabled ? 'Mute the grave bell' : 'Turn the sounds on'}
              aria-label={config.soundEnabled ? 'Mute the grave bell' : 'Turn the sounds on'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-cream shadow-[inset_0_0_0_3px_var(--color-ink-soft)] transition-colors hover:text-ecto hover:shadow-[inset_0_0_0_3px_var(--color-ecto-lo)]"
            >
              {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            {X_URL ? (
              <a href={X_URL} target="_blank" rel="noreferrer" title="DIGBY on X" aria-label="DIGBY on X" className="flex h-10 w-10 items-center justify-center text-cream shadow-[inset_0_0_0_3px_var(--color-ink-soft)] hover:text-ecto">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.2-8.2L2.9 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
                </svg>
              </a>
            ) : null}
            {config.tokenAddress ? (
              <button type="button" onClick={copyCA} className="btn-chip hidden cursor-pointer py-2 lg:inline-flex" title="Copy contract address">
                {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCA ? 'copied' : <>CA <span className="font-mono text-[0.8rem] normal-case">{`${config.tokenAddress.slice(0, 6)}…${config.tokenAddress.slice(-4)}`}</span></>}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative">
        <Hero
          tokenSymbol={tokenSymbol}
          totalBurned={totalTokensBurned}
          burnedPercent={burnedPercent}
          graves={graves}
          escrow={escrow}
          threshold={threshold}
          fill={lanternFill}
          nextCycle={nextCycle}
          live={isConfigured}
          running={state.isWheelSpinning}
          burialKey={burial}
          tokenAddress={config.tokenAddress}
          copiedCA={copiedCA}
          onCopyCA={copyCA}
          buyHref={buyUrl(config.tokenAddress)}
          chartHref={chartUrl(config.tokenAddress)}
          onPoke={pokeDigby}
          pokes={pokes}
          say={`“${DIGBY_SAYS[(pokes - 1 + DIGBY_SAYS.length) % DIGBY_SAYS.length]}”`}
        />

        <LevelUp burnedPercent={burnedPercent} tokenSymbol={tokenSymbol} />

        <NightShift
          tokenSymbol={tokenSymbol}
          escrow={escrow}
          threshold={threshold}
          fill={lanternFill}
          claimedETH={state.totalFeesClaimedETH || 0}
          retainedETH={state.totalFeesRetainedETH || 0}
          routerName={routerName}
          nextCycle={nextCycle}
          live={isConfigured}
        />

        <Graves
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

        <Watch state={state} config={config} logs={logs} live={isConfigured} fill={lanternFill} burnedPercent={burnedPercent} explorerUrl={EXPLORER_URL} onOpenLog={() => setIsLogOpen(true)} />

        <Story
          tokenSymbol={tokenSymbol}
          deadAddress={deadAddress}
          buyHref={buyUrl(config.tokenAddress)}
          tokenAddress={config.tokenAddress}
          copiedCA={copiedCA}
          onCopyCA={copyCA}
          links={{ x: X_URL, telegram: TG_URL, chart: config.tokenAddress ? chartUrl(config.tokenAddress) : '', yard: `${EXPLORER_URL}/address/${deadAddress}` }}
        />

        <footer className="relative border-t-[3px] border-ink-soft bg-ink">
          <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-4 pb-12 pt-8 text-[0.95rem] text-mist sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <div className="flex items-center gap-3">
              <DigbyMark stage={stage.n} className="h-7 w-8" />
              <span className="font-semibold text-cream">{tokenSymbol} on Robinhood Chain</span>
            </div>
            <p className="m-0 max-w-[52ch]">Burials and wage runs are done by a bot and every one is on chain. A meme, not financial advice.</p>
            <div className="font-mono text-[0.8rem]">
              Chain ID 4663 · {!isConfigured ? 'Digby is asleep' : state.isWheelSpinning ? 'on a shift now' : 'night shift on'}
            </div>
          </div>
        </footer>
      </main>

      <RipAlert burnLedger={burnLedger} tokenSymbol={tokenSymbol} explorerUrl={EXPLORER_URL} stage={stage.n} sound={config.soundEnabled} onBurial={setBurial} />

      <BurnLedgerDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} logs={logs} burnLedger={burnLedger} state={state} config={config} />
    </div>
  );
}

export default App;
