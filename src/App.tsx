import { useState, useEffect, useRef } from 'react';
import { useFlywheelEngine } from './hooks/useBurnEngine';
import { PONS_V2_CONFIG } from './contracts';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Copy, Check, ArrowUpRight, ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BurnLedgerDrawer } from './components/BurnLedgerDrawer';
import { MemexAdmin } from './components/MemexAdmin';
import { VoidMark } from './components/void/VoidMark';
import { LiveNumber } from './components/void/LiveNumber';
import { BlackHole } from './components/void/BlackHole';
import { AccretionMeter } from './components/void/AccretionMeter';
import { OrbitSequence } from './components/void/OrbitSequence';
import { ObservingLog } from './components/void/ObservingLog';
import { WatcherWiring } from './components/void/WatcherWiring';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** What the Void says when something is tossed in. */
const VOID_SAYS = [
  'more.',
  'everything falls in.',
  'nothing comes back out.',
  'odd orbits i eat. even orbits they refuel.',
  'keep trading, observer.',
  'the watcher never blinks.',
  'supply goes in. supply stays in.',
  'i was an address once.',
];

/** X account for VOID. */
const X_URL = 'https://x.com/blackvoidrh';
const EXPLORER_URL = 'https://explorer.mainnet.chain.robinhood.com';
/** Where to trade and where to watch, once the CA is known. */
const buyUrl = (ca: string) => (ca ? `https://ponsfamily.com/launchpad/${ca}` : EXPLORER_URL);
const chartUrl = (ca: string) => (ca ? `https://dexscreener.com/robinhood/${ca}` : EXPLORER_URL);

const DISCOVERY = [
  {
    night: 'Night 0',
    title: 'The pile',
    text: 'Every token ever sent to 0x…dEaD ended up in one place. Nobody took any of it out. Nobody could. The pile only grew.',
    note: 'heavier every block',
  },
  {
    night: 'Night 1',
    title: 'The collapse',
    text: 'The pile got so heavy the address folded in on itself and light stopped coming back. We catalogued it dEaD-1. The night crew calls it the Void.',
    note: 'it has a horizon now',
  },
  {
    night: 'Every night since',
    title: 'The feeding',
    text: 'Now every $VOID trade feeds its disk. On odd orbits the Watcher drops what it buys past the horizon. On even orbits it keeps the observatory fueled. The Void is always hungry.',
    note: 'it keeps asking for more',
  },
];

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
  const [tossed, setTossed] = useState(0);
  const [sayIndex, setSayIndex] = useState(0);
  const [gulp, setGulp] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const gulpTimer = useRef<number | undefined>(undefined);

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

  // Toss something into the Void
  const tossIn = () => {
    setTossed((prev) => prev + 1);
    setSayIndex((prev) => (prev + 1) % VOID_SAYS.length);
    setGulp(true);
    window.clearTimeout(gulpTimer.current);
    gulpTimer.current = window.setTimeout(() => setGulp(false), 1600);
    sounds.playBuybackSound();
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsMemexRoute(false);
  };

  const threshold = state.currentThresholdETH || state.claimThresholdETH || config.claimThresholdETH || 0;
  const escrow = state.currentEscrowBalanceETH || 0;
  const diskFill = threshold > 0 ? Math.max(0, Math.min(1, escrow / threshold)) : 0;

  // The glow around the hole brightens as the disk fills
  useEffect(() => {
    document.documentElement.style.setProperty('--hearth', diskFill.toFixed(3));
  }, [diskFill]);

  useGSAP(
    () => {
      if (isMemexRoute) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Arrival: the hole resolves out of the dark, the letters are pulled into place
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from('[data-hole-in]', { scale: 0.7, opacity: 0, filter: 'blur(18px)', duration: 2 }, 0)
          .from('[data-letter-in="v"]', { xPercent: -40, opacity: 0, duration: 1.6 }, 0.25)
          .from('[data-letter-in="id"]', { xPercent: 40, opacity: 0, duration: 1.6 }, 0.25)
          .from('[data-hero-line]', { y: 22, opacity: 0, filter: 'blur(6px)', stagger: 0.09, duration: 1.1 }, 0.7)
          .from('[data-slip]', { y: 60, rotate: (i) => (i ? 6 : -6), opacity: 0, stagger: 0.15, duration: 1.3 }, 0.9);

        // Leaving the first view: the letters are dragged toward the hole as it grows
        const leave = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } as const;
        gsap.fromTo('[data-hole]', { scale: 1 }, { scale: 1.25, ease: 'none', scrollTrigger: leave });
        gsap.fromTo('[data-letter="v"]', { xPercent: 0, scale: 1, opacity: 1 }, { xPercent: 22, scale: 0.85, opacity: 0.25, ease: 'none', scrollTrigger: leave });
        gsap.fromTo('[data-letter="id"]', { xPercent: 0, scale: 1, opacity: 1 }, { xPercent: -22, scale: 0.85, opacity: 0.25, ease: 'none', scrollTrigger: leave });

        // The recorder thread: one pen line from the hero down to the log strip
        const thread = document.querySelector<HTMLElement>('[data-thread]');
        const place = () => {
          const hero = document.querySelector<HTMLElement>('[data-hero]');
          const log = document.getElementById('log');
          if (!thread || !hero || !log) return;
          const top = hero.offsetTop + hero.offsetHeight - 40;
          thread.style.top = `${top}px`;
          thread.style.height = `${Math.max(0, log.offsetTop + 260 - top)}px`;
        };
        place();
        ScrollTrigger.addEventListener('refreshInit', place);
        gsap.fromTo(
          '[data-thread] svg',
          { clipPath: 'inset(0 -20px 100% -20px)' },
          { clipPath: 'inset(0 -20px 0% -20px)', ease: 'none', scrollTrigger: { trigger: '[data-thread]', start: 'top 70%', end: 'bottom 70%', scrub: 0.3 } },
        );
        gsap.fromTo(
          '[data-thread-pen]',
          { top: '0%' },
          { top: '100%', ease: 'none', scrollTrigger: { trigger: '[data-thread]', start: 'top 70%', end: 'bottom 70%', scrub: 0.3 } },
        );

        // The recorder pen draws each row of the log as it passes under it
        gsap.utils.toArray<SVGPathElement>('[data-trace]').forEach((el) => {
          gsap.fromTo(
            el,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: el.closest('[data-log-row]') ?? el, start: 'top 88%', end: 'bottom 60%', scrub: 0.4 } },
          );
        });
        ScrollTrigger.batch('[data-log-row]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0.25 }, { opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.08 }),
        });

        // Discovery notes: each entry is written in, then the marker note lands
        gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((el, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
          tl.from(el, { y: 50, rotate: i % 2 ? 2 : -2, opacity: 0, duration: 1, ease: 'expo.out' }).from(
            el.querySelector('[data-scrawl]'),
            { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power2.out' },
            '-=0.4',
          );
        });

        return () => ScrollTrigger.removeEventListener('refreshInit', place);
      });

      // The finale (desktop): the hole swallows the screen, and the last call is written in the dark
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const fin = gsap.timeline({ scrollTrigger: { trigger: '[data-exit]', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
        fin
          .fromTo('[data-final-hole]', { scale: 0.18 }, { scale: 9, ease: 'power2.in', duration: 1 })
          .fromTo('[data-final-copy]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.62);
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
    try {
      confetti({
        particleCount: 36,
        spread: 70,
        startVelocity: 24,
        gravity: 0.5,
        origin: { y: 0.7 },
        colors: ['#ffad42', '#ffe2a6', '#d3dbec', '#5cc2ab'],
        shapes: ['circle'],
        scalar: 0.55,
      });
    } catch {}
    setTimeout(() => setCopiedCA(false), 2500);
  };

  const copyDead = () => {
    navigator.clipboard.writeText(config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress);
    setCopiedDead(true);
    sounds.playBurnSound();
    setTimeout(() => setCopiedDead(false), 2000);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

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

  const fallsCount = burnLedger.filter(
    (e) => e.cycleType !== 'keep' && ((e.burnedJollyburn || e.burnedMuseburn || e.burnedIncinerator || 0) > 0 || e.burnTx),
  ).length;

  const tokenSymbol = '$VOID';
  const deadAddress = config.deadAddress || PONS_V2_CONFIG.contracts.deadAddress;
  const isConfigured = Boolean(config.tokenAddress && config.tokenAddress.startsWith('0x') && config.tokenAddress.length === 42);
  const nextCycle = state.nextCycleType || 'burn';
  const routerName = state.swapRouter === 'uniswap' || state.isTokenMigrated ? 'Uniswap v4' : 'the Pons bonding curve';
  const diskStatus = !isConfigured
    ? 'dark until the token address is set'
    : state.isWheelSpinning
      ? 'feeding right now!'
      : diskFill >= 0.85
        ? 'nearly critical...'
        : diskFill >= 0.4
          ? 'disk is building'
          : 'every trade feeds the disk';

  const notes = [
    { label: 'the event horizon', value: `${deadAddress.slice(0, 6)}…${deadAddress.slice(-4)}`, note: 'nothing comes back' },
    { label: 'falls recorded', value: String(fallsCount), note: 'all in the log below' },
    { label: 'whole supply', value: state.totalSupply > 0 ? formatNumber(state.totalSupply) : '—', note: 'read live' },
  ];

  // the fallen total is sized to fill the shadow, however many digits it has
  const fallenText = formatNumber(Math.round(totalTokensBurned));
  const numeralSize = `${Math.min(26, 100 / (Math.max(fallenText.length, 3) * 0.58))}cqw`;
  const burnedLine = (
    <>
      <div className="label text-[5.4cqw] text-star-dim">{tokenSymbol} fallen in</div>
      <div className={`display tabular leading-[0.92] ${isConfigured ? 'text-ring-hot' : 'text-star-dim'}`} style={{ fontSize: numeralSize }}>
        <LiveNumber value={totalTokensBurned} format={(n) => formatNumber(Math.round(n))} />
      </div>
      <div className="mt-[2cqw] label text-[5.4cqw] text-star">
        {burnedPercent > 0 ? burnedPercent.toFixed(2) : '0.00'}% of supply
      </div>
    </>
  );

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-x-clip bg-night font-body text-star">
      <div className="sky pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* ───────── The nav ───────── */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled ? 'bg-night/90 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-10 lg:px-16">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-star no-underline"
            aria-label="VOID home"
          >
            <VoidMark className="h-9 w-9 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[-30deg]" />
            <span className="display text-[1.9rem]">Void</span>
          </a>

          <nav className="hidden items-center gap-7 label text-[0.74rem] text-star-dim md:flex" aria-label="Sections">
            <a href="#orbit" className="no-underline transition-colors hover:text-ring">the orbit</a>
            <a href="#log" className="no-underline transition-colors hover:text-ring">the log</a>
            <a href="#watcher" className="no-underline transition-colors hover:text-ring">the watcher</a>
            <a href="#discovery" className="no-underline transition-colors hover:text-ring">discovery</a>
            <button type="button" onClick={() => setIsLogOpen(true)} className="label cursor-pointer transition-colors hover:text-ring">
              full log
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
              title={config.soundEnabled ? 'Mute the observatory' : 'Turn the sounds on'}
              aria-label={config.soundEnabled ? 'Mute the observatory' : 'Turn the sounds on'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-panel-line text-star-dim transition-colors hover:border-ring hover:text-ring"
            >
              {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            {X_URL ? (
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                title="VOID on X"
                aria-label="VOID on X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-panel-line text-star-dim transition-colors hover:border-ring hover:text-ring"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.2-8.2L2.9 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
                </svg>
              </a>
            ) : null}
            {config.tokenAddress ? (
              <button
                type="button"
                onClick={copyCA}
                className="hidden h-10 cursor-pointer items-center gap-2 rounded-full bg-paper px-4 font-mono text-[0.8rem] text-pen transition-transform hover:-translate-y-0.5 lg:flex"
                title="Copy contract address"
              >
                {copiedCA ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCA ? 'Copied' : `CA ${config.tokenAddress.slice(0, 6)}…${config.tokenAddress.slice(-4)}`}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* the recorder thread: a pen line from the first view down to the log */}
        <div data-thread className="pointer-events-none absolute left-[max(0.75rem,calc(50%-43rem))] z-0 hidden w-5 motion-safe:lg:block" aria-hidden="true">
          <svg viewBox="0 0 20 2000" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <path d="M10 0 L6.4 8 L8.2 16 L10.0 24 L11.8 32 L13.6 40 L15.4 48 L5.5 56 L7.3 64 L9.1 72 L10.9 80 L12.7 88 L14.5 96 L4.6 104 L6.4 112 L8.2 120 L10.0 128 L11.8 136 L13.6 144 L15.4 152 L5.5 160 L7.3 168 L9.1 176 L10.9 184 L12.7 192 L14.5 200 L4.6 208 L6.4 216 L8.2 224 L10.0 232 L11.8 240 L13.6 248 L15.4 256 L5.5 264 L7.3 272 L9.1 280 L10.9 288 L12.7 296 L14.5 304 L4.6 312 L6.4 320 L8.2 328 L10.0 336 L11.8 344 L13.6 352 L15.4 360 L5.5 368 L7.3 376 L9.1 384 L10.9 392 L12.7 400 L14.5 408 L4.6 416 L6.4 424 L8.2 432 L10.0 440 L11.8 448 L13.6 456 L15.4 464 L5.5 472 L7.3 480 L9.1 488 L10.9 496 L12.7 504 L14.5 512 L4.6 520 L6.4 528 L8.2 536 L10.0 544 L11.8 552 L13.6 560 L15.4 568 L5.5 576 L7.3 584 L9.1 592 L10.9 600 L12.7 608 L14.5 616 L4.6 624 L6.4 632 L8.2 640 L10.0 648 L11.8 656 L13.6 664 L15.4 672 L5.5 680 L7.3 688 L9.1 696 L10.9 704 L12.7 712 L14.5 720 L4.6 728 L6.4 736 L8.2 744 L10.0 752 L11.8 760 L13.6 768 L15.4 776 L5.5 784 L7.3 792 L9.1 800 L10.9 808 L12.7 816 L14.5 824 L4.6 832 L6.4 840 L8.2 848 L10.0 856 L11.8 864 L13.6 872 L15.4 880 L5.5 888 L7.3 896 L9.1 904 L10.9 912 L12.7 920 L14.5 928 L4.6 936 L6.4 944 L8.2 952 L10.0 960 L11.8 968 L13.6 976 L15.4 984 L5.5 992 L7.3 1000 L9.1 1008 L10.9 1016 L12.7 1024 L14.5 1032 L4.6 1040 L6.4 1048 L8.2 1056 L10.0 1064 L11.8 1072 L13.6 1080 L15.4 1088 L5.5 1096 L7.3 1104 L9.1 1112 L10.9 1120 L12.7 1128 L14.5 1136 L4.6 1144 L6.4 1152 L8.2 1160 L10.0 1168 L11.8 1176 L13.6 1184 L15.4 1192 L5.5 1200 L7.3 1208 L9.1 1216 L10.9 1224 L12.7 1232 L14.5 1240 L4.6 1248 L6.4 1256 L8.2 1264 L10.0 1272 L11.8 1280 L13.6 1288 L15.4 1296 L5.5 1304 L7.3 1312 L9.1 1320 L10.9 1328 L12.7 1336 L14.5 1344 L4.6 1352 L6.4 1360 L8.2 1368 L10.0 1376 L11.8 1384 L13.6 1392 L15.4 1400 L5.5 1408 L7.3 1416 L9.1 1424 L10.9 1432 L12.7 1440 L14.5 1448 L4.6 1456 L6.4 1464 L8.2 1472 L10.0 1480 L11.8 1488 L13.6 1496 L15.4 1504 L5.5 1512 L7.3 1520 L9.1 1528 L10.9 1536 L12.7 1544 L14.5 1552 L4.6 1560 L6.4 1568 L8.2 1576 L10.0 1584 L11.8 1592 L13.6 1600 L15.4 1608 L5.5 1616 L7.3 1624 L9.1 1632 L10.9 1640 L12.7 1648 L14.5 1656 L4.6 1664 L6.4 1672 L8.2 1680 L10.0 1688 L11.8 1696 L13.6 1704 L15.4 1712 L5.5 1720 L7.3 1728 L9.1 1736 L10.9 1744 L12.7 1752 L14.5 1760 L4.6 1768 L6.4 1776 L8.2 1784 L10.0 1792 L11.8 1800 L13.6 1808 L15.4 1816 L5.5 1824 L7.3 1832 L9.1 1840 L10.9 1848 L12.7 1856 L14.5 1864 L4.6 1872 L6.4 1880 L8.2 1888 L10.0 1896 L11.8 1904 L13.6 1912 L15.4 1920 L5.5 1928 L7.3 1936 L9.1 1944 L10.9 1952 L12.7 1960 L14.5 1968 L4.6 1976 L6.4 1984 L8.2 1992 L10.0 2000" fill="none" stroke="#ffad42" strokeOpacity="0.6" strokeWidth="1.4" />
          </svg>
          <span data-thread-pen className="absolute left-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ring shadow-[0_0_12px_3px_rgba(255,173,66,0.6)]" />
        </div>
        {/* ───────── V ◉ I D ───────── */}
        <section data-hero aria-labelledby="hero-title" className="relative flex flex-col pt-16 sm:pt-[4.5rem] lg:min-h-[max(100svh,40rem)]">
          <h1 id="hero-title" className="sr-only">
            VOID
          </h1>

          {/* phones: the name above the hole */}
          <div className="px-4 pt-3 text-center lg:hidden" aria-hidden="true">
            <span className="display block text-[clamp(4rem,21vw,6.5rem)] text-star">Void</span>
          </div>

          {/* the hole, with the fallen total written inside its shadow */}
          <div className="relative mx-auto h-[min(84vw,22rem)] w-full shrink-0 lg:h-[60svh]">
            <div data-hole className="absolute inset-0">
              <div data-hole-in className="absolute inset-0">
              <BlackHole fill={diskFill} feeding={state.isWheelSpinning || gulp} fuel={nextCycle === 'keep' && state.isWheelSpinning} shadow={0.33} readout className="h-full w-full" label="dEaD-1, the black hole, drawn live">
                <div className="flex w-[calc(min(84vw,22rem)*0.54)] flex-col items-center text-center [container-type:inline-size] [text-shadow:0_2px_14px_#000,0_0_4px_#000] lg:w-[33svh]">{burnedLine}</div>
              </BlackHole>
              </div>
            </div>
            {/* desktop: the letters either side of the hole */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
              <span className="absolute right-[calc(50%+21.5svh)] top-1/2 -translate-y-1/2">
                <span data-letter="v" className="block origin-right">
                  <span data-letter-in="v" className="display block text-[33svh] text-star">V</span>
                </span>
              </span>
              <span className="absolute left-[calc(50%+21.5svh)] top-1/2 -translate-y-1/2">
                <span data-letter="id" className="block origin-left">
                  <span data-letter-in="id" className="display block text-[33svh] text-star">ID</span>
                </span>
              </span>
            </div>
          </div>

          {/* under the hole: what it is, and the way in */}
          <div className="relative mx-auto w-full max-w-[60rem] px-4 pb-10 text-center sm:px-10 lg:-mt-[2svh] lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pb-[3svh]">
            <p data-hero-line className="m-0 display text-[clamp(2rem,6vw,2.4rem)] text-star lg:text-[clamp(2rem,5svh,3rem)]">
              Everything falls in.
            </p>
            <p data-hero-line className="mx-auto m-0 mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-star-dim lg:text-[clamp(0.95rem,2svh,1.05rem)]">
              Every {tokenSymbol} trade feeds the black hole at 0x…dEaD. At critical mass the Watcher buys {tokenSymbol} back and drops it past the horizon.
            </p>
            <div data-hero-line className="mx-auto mt-4 flex max-w-[52rem] flex-col items-stretch gap-3 lg:mt-[2.2svh] lg:flex-row lg:items-center">
              {config.tokenAddress ? (
                <button
                  type="button"
                  onClick={copyCA}
                  className="group flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-full border border-panel-line bg-panel/80 py-1.5 pl-5 pr-1.5 text-left transition-colors hover:border-ring"
                  title="Copy contract address"
                >
                  <span className="min-w-0">
                    <span className="label block text-[0.6rem] text-star-dim">contract address</span>
                    <span className="block truncate font-mono text-[0.82rem] text-star">{config.tokenAddress}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 display text-[0.95rem] text-pen">
                    {copiedCA ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedCA ? 'copied' : 'copy'}
                  </span>
                </button>
              ) : (
                <p className="m-0 min-w-0 flex-1 rounded-full border border-dashed border-panel-line px-5 py-3 text-[0.95rem] text-star-dim">The contract address shows up here at launch.</p>
              )}
              <div className="flex shrink-0 items-center justify-center gap-2.5">
                <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring px-7 py-3 text-[1.2rem] no-underline">
                  buy {tokenSymbol}
                  <ArrowUpRight className="h-5 w-5" />
                </a>
                <a href={chartUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2.5 text-[1rem] no-underline">
                  chart
                </a>
                <button type="button" onClick={() => setIsLogOpen(true)} className="btn-ghost cursor-pointer px-4 py-2.5 text-[1rem]" aria-label="Open the full log">
                  <ScrollText className="h-4 w-4" />
                  <span className="hidden sm:inline">full log</span>
                </button>
              </div>
            </div>
            <div data-hero-line className="mt-3 flex min-h-[2.4rem] flex-wrap items-baseline justify-center gap-x-3 lg:mt-[1.6svh]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={sayIndex}
                  initial={{ opacity: 0, scale: 1.25, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.6, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="m-0 hand text-[1.7rem] text-marker"
                >
                  “{VOID_SAYS[sayIndex]}”
                </motion.p>
              </AnimatePresence>
              <button type="button" onClick={tossIn} className="cursor-pointer label text-[0.68rem] text-star-dim transition-colors hover:text-ring">
                toss a rock in · {tossed} tossed
              </button>
            </div>
          </div>

          {/* the two slips: beside the hole on wide screens, below it otherwise */}
          <div className="relative grid gap-6 px-4 pb-16 sm:grid-cols-2 sm:px-10 xl:pointer-events-none xl:absolute xl:inset-x-[max(1.5rem,calc(50%-44rem))] xl:top-[calc(4.5rem+30svh)] xl:flex xl:-translate-y-1/2 xl:items-center xl:justify-between xl:p-0">
            <div data-slip className="xl:pointer-events-auto xl:w-[15rem] xl:-rotate-2">
              <div className="paper sprockets px-8 py-5">
                <div className="display text-[1.5rem] text-pen">Observer notes</div>
                <ul className="m-0 mt-3 grid list-none gap-3.5 p-0">
                  {notes.map((n) => (
                    <li key={n.label}>
                      <div className="label text-[0.64rem] text-pen-soft">{n.label}</div>
                      <div className="font-mono text-[0.95rem] text-pen tabular">{n.value}</div>
                      <div className="hand text-[1.45rem] text-marker">{n.note}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div data-slip className="xl:pointer-events-auto xl:w-[15.5rem] xl:rotate-[1.5deg]">
              <AccretionMeter escrow={escrow} threshold={threshold} fill={diskFill} nextCycle={nextCycle} live={isConfigured} status={diskStatus} />
            </div>
          </div>
        </section>

        {/* ───────── One orbit, pinned ───────── */}
        <OrbitSequence
          tokenSymbol={tokenSymbol}
          escrow={escrow}
          threshold={threshold}
          fill={diskFill}
          claimedETH={state.totalFeesClaimedETH || 0}
          routerName={routerName}
          nextCycle={nextCycle}
          feeding={state.isWheelSpinning}
        />

        {/* ───────── The observing log ───────── */}
        <ObservingLog
          burnLedger={burnLedger}
          totalBurned={totalTokensBurned}
          logs={logs}
          burnedPercent={burnedPercent}
          tokenSymbol={tokenSymbol}
          deadAddress={deadAddress}
          explorerUrl={EXPLORER_URL}
          copiedDead={copiedDead}
          onCopyDead={copyDead}
          onOpenLog={() => setIsLogOpen(true)}
        />

        {/* ───────── The Watcher's wiring ───────── */}
        <WatcherWiring state={state} config={config} onOpenLog={() => setIsLogOpen(true)} />

        {/* ───────── The discovery of dEaD-1 ───────── */}
        <section id="discovery" aria-labelledby="discovery-title" className="relative px-4 pb-24 pt-28 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 id="discovery-title" className="m-0 max-w-[16ch] display text-[clamp(3rem,6.4vw,5.8rem)] text-star">
              How an address became a black hole
            </h2>
            <ol className="m-0 mt-16 grid list-none items-start gap-8 p-0 md:grid-cols-3">
              {DISCOVERY.map((d, i) => (
                <li key={d.title} data-entry className={`paper sprockets px-9 pb-8 pt-6 ${i === 1 ? 'md:mt-16 md:rotate-1' : i === 2 ? 'md:mt-32 md:-rotate-1' : 'md:-rotate-[1.5deg]'}`}>
                  <h3 className="m-0 display text-[clamp(2rem,2.8vw,2.5rem)] text-pen">
                    {d.night}: {d.title}
                  </h3>
                  <p className="m-0 mt-3 text-[1.05rem] leading-relaxed text-pen">{d.text}</p>
                  <p data-scrawl className="m-0 mt-4 hand text-[1.9rem] text-marker">{d.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── The finale: swallowed ───────── */}
        <section data-exit aria-labelledby="exit-title" className="relative h-auto lg:h-[220svh]">
          <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-24 sm:px-10 lg:sticky lg:top-0 lg:h-[100svh] lg:py-0">
            <div
              data-final-hole
              className="absolute left-1/2 top-1/2 hidden aspect-square w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_0_2px_rgba(255,226,166,0.9),0_0_60px_12px_rgba(255,173,66,0.45),0_0_160px_40px_rgba(255,173,66,0.18)] lg:motion-safe:block"
              aria-hidden="true"
            />
            <div data-final-copy className="relative z-10 mx-auto max-w-[54rem] text-center">
              <h2 id="exit-title" className="m-0 display text-[clamp(3.6rem,10vw,6rem)] text-star">
                Everything falls in.
              </h2>
              <p className="mx-auto mt-6 max-w-[44ch] text-[1.15rem] leading-relaxed text-star-dim">
                Join the observers. Hold {tokenSymbol}, trade {tokenSymbol}, and watch the supply cross the horizon, one orbit at a time.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href={buyUrl(config.tokenAddress)} target="_blank" rel="noreferrer" className="btn-ring px-9 py-4 text-[1.3rem] no-underline">
                  buy {tokenSymbol}
                  <ArrowUpRight className="h-5 w-5" />
                </a>
                {config.tokenAddress ? (
                  <button type="button" onClick={copyCA} className="btn-ghost cursor-pointer px-6 py-3 text-[1.1rem]">
                    {copiedCA ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    {copiedCA ? 'copied' : 'copy CA'}
                  </button>
                ) : null}
              </div>
              <p className="mt-10 label text-[0.74rem] text-star-dim">0% tax · LP locked · 100% burn</p>
            </div>
          </div>
        </section>

        <footer className="relative mx-auto flex max-w-7xl flex-col gap-4 border-t border-panel-line px-4 pb-12 pt-8 text-[0.98rem] text-star-dim sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div className="flex items-center gap-2.5">
            <VoidMark className="h-8 w-8" />
            <span className="label text-[0.75rem] text-star">{tokenSymbol} on Robinhood Chain</span>
          </div>
          <p className="m-0 max-w-[52ch]">Zero team allocation, zero hidden taxes, automated burns verified on-chain.</p>
          <div className="font-mono text-[0.82rem]">
            Chain ID 4663 · {!isConfigured ? 'observatory dark' : state.isWheelSpinning ? 'orbit running' : 'watching'}
          </div>
        </footer>
      </main>

      <BurnLedgerDrawer
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={logs}
        burnLedger={burnLedger}
        state={state}
        config={config}
      />
    </div>
  );
}

export default App;
