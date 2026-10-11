import { Composition, Folder, Still } from "remotion";
import { Demo } from "./Demo";
import { RideLoop, TunnelPOV } from "./Motion";
import { SellPOV } from "./SellPOV";
import { ShiftLog } from "./ShiftLog";
import { RipVideo } from "./RipVideo";
import { ScoopVideo } from "./ScoopVideo";
import { PumpGif } from "./PumpGif";
import { SkullSpeech } from "./SkullSpeech";
import { SkullHour20 } from "./SkullHour20";
import { SkullBearish } from "./SkullBearish";
import { ScoopGif } from "./ScoopGif";
import { NightTour } from "./NightTour";
import { PostPodium } from "./Podium";
import { PostGazette } from "./Gazette";
import { PostAlmostBell } from "./AlmostBell";
import { PostBackFromDead } from "./BackFromDead";
import { PostClearance } from "./Clearance";
import { AlmostGif } from "./AlmostGif";
import { PostMortExe } from "./MortExe";
import { PostDirtPrices } from "./DirtPrices";
import { PostDing } from "./Ding";
import { PostDepartures } from "./Departures";
import { PostBullCandle } from "./BullCandle";
import { PostWrapped } from "./Wrapped";
import { PostWanted } from "./Wanted";
import { PostNutrition } from "./Nutrition";
import { PostWaited } from "./Waited";
import { PostFeelings } from "./Feelings";
import { PostScoopShop } from "./ScoopShop";
import { ClawVideo } from "./ClawVideo";
import { PostElement } from "./Element";
import { PostOcto } from "./Octo";
import { ZeroDays } from "./ZeroDays";
import { GraveCam } from "./GraveCam";
import { PostReceipt } from "./Receipt";
import { PostGraveSale } from "./GraveSale";
import { BurialReplay, PostFirstGrave, PostHighScore, PostManifest, PostPaidMore, PostDeathCert, PostDexPaid, PostDexSoon, PostPlotMap, PostRipDexPaid, PostTooQuiet, PostScoop, PostTallyWall, SupplyCounter } from "./Live";
import { VoidBanner, VoidLogo, VoidOg, PostMeetVoid, PostNowObserving, PostHowVoidWorks, PostTwoOrbits, PostFlatLine, PostNothingEscapes, PostStatus } from "./void/Stills";
import { VoidLoop, VoidTeaser, VoidDemo } from "./void/Motion";
import { SunLogo, SunBanner, SunOg, PostNowEating, PostCaught, PostSunHow, PostHalfIn, PostSunHook } from "./suneater/Stills";
import { SunLoop, SunTeaser, SunDemo } from "./suneater/Motion";
import { GulpLogo, GulpBanner, GulpOg, PostMeetGulp, PostGulpLive, PostGulpHow, PostGulpHook } from "./gulp/Stills";
import { GulpLoop, GulpTeaser } from "./gulp/Motion";
import { PyreLogo, PyreBanner, PyreOg, PostMeetPyre, PostPyreLive, PostPyreHow, PostPyreHook } from "./pyre/Stills";
import { PyreLoop, PyreTeaser } from "./pyre/Motion";
import { CircleLogo, CircleBanner, CircleLoop, CircleDemo, CircleStatus, CircleUpdate } from "./pyre/CircleComps";
import { PyreReceipt, HookPOV, PyreTodo, ScoopDip, PaperHands, PyreFees } from "./pyre/HookComps";
import { BrewLogo, BrewBanner, BrewLoop, BrewDemo } from "./brew/Comps";
import { Banner, Logo, OgImage, PostAdmitOne, PostHowItWorks, PostMeetMort, PostObituary, PostRingTheBell, PostTrending, PostTwoShifts } from "./Stills";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Profile">
        <Still id="Logo" component={Logo} width={1000} height={1000} />
        <Still id="Banner" component={Banner} width={1500} height={500} />
        <Still id="OgImage" component={OgImage} width={1200} height={630} />
      </Folder>
      <Folder name="Posts">
        <Still id="PostAdmitOne" component={PostAdmitOne} width={1080} height={1350} />
        <Still id="PostMeetMort" component={PostMeetMort} width={1080} height={1350} />
        <Still id="PostHowItWorks" component={PostHowItWorks} width={1600} height={900} />
        <Still id="PostObituary" component={PostObituary} width={1080} height={1350} />
        <Still id="PostRingTheBell" component={PostRingTheBell} width={1080} height={1350} />
        <Still id="PostTwoShifts" component={PostTwoShifts} width={1080} height={1350} />
        <Still id="PostTrending" component={PostTrending} width={1080} height={1350} defaultProps={{ rank: "" }} />
      </Folder>
      <Folder name="Motion">
        <Composition id="RideLoop" component={RideLoop} width={600} height={600} fps={30} durationInFrames={120} />
        <Composition id="TunnelPOV" component={TunnelPOV} width={1080} height={1350} fps={30} durationInFrames={360} />
        <Composition id="SellPOV" component={SellPOV} width={1080} height={1350} fps={30} durationInFrames={360} />
        <Composition id="Demo" component={Demo} width={1920} height={1080} fps={30} durationInFrames={900} />
      </Folder>
      <Folder name="Live-numbers">
        <Still id="PostFirstGrave" component={PostFirstGrave} width={1080} height={1350} defaultProps={{ burned: 18125623.54, burials: 1, wages: 1, lastBurial: 18125623.54, lastBurialEth: "0.0132", wageEth: "0.0204", date: "Oct 7, 2026", claimTx: "0x044fe69fe765d592555de532aa7193c26b4e5a031c3d06ba1787754de27709b4", buyTx: "0x40b399c8fe75d939dd5bc7ae72ecc53e4f8389b4b35a13e59a81b026ef5e8077", burnTx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd", wageTx: "0x134cda15c70ed008f62c86de3a90aeb537b7aec9febee74127ce1039bb87fc9a", next: "burial" as const }} />
        <Still id="PostManifest" component={PostManifest} width={1080} height={1350} defaultProps={{ burned: 18125623.54, burials: 1, wages: 1, lastBurial: 18125623.54, lastBurialEth: "0.0132", wageEth: "0.0204", date: "Oct 7, 2026", claimTx: "0x044fe69fe765d592555de532aa7193c26b4e5a031c3d06ba1787754de27709b4", buyTx: "0x40b399c8fe75d939dd5bc7ae72ecc53e4f8389b4b35a13e59a81b026ef5e8077", burnTx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd", wageTx: "0x134cda15c70ed008f62c86de3a90aeb537b7aec9febee74127ce1039bb87fc9a", next: "burial" as const }} />
        <Still id="PostHighScore" component={PostHighScore} width={1080} height={1350} defaultProps={{ burned: 18125623.54, burials: 1, wages: 1, lastBurial: 18125623.54, lastBurialEth: "0.0132", wageEth: "0.0204", date: "Oct 7, 2026", claimTx: "0x044fe69fe765d592555de532aa7193c26b4e5a031c3d06ba1787754de27709b4", buyTx: "0x40b399c8fe75d939dd5bc7ae72ecc53e4f8389b4b35a13e59a81b026ef5e8077", burnTx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd", wageTx: "0x134cda15c70ed008f62c86de3a90aeb537b7aec9febee74127ce1039bb87fc9a", next: "burial" as const }} />
        <Composition id="SupplyCounter" component={SupplyCounter} width={1080} height={1350} fps={30} durationInFrames={300} defaultProps={{ burned: 18125623.54, burials: 1, wages: 1, lastBurial: 18125623.54, lastBurialEth: "0.0132", wageEth: "0.0204", date: "Oct 7, 2026", claimTx: "0x044fe69fe765d592555de532aa7193c26b4e5a031c3d06ba1787754de27709b4", buyTx: "0x40b399c8fe75d939dd5bc7ae72ecc53e4f8389b4b35a13e59a81b026ef5e8077", burnTx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd", wageTx: "0x134cda15c70ed008f62c86de3a90aeb537b7aec9febee74127ce1039bb87fc9a", next: "burial" as const }} />
        <Composition id="BurialReplay" component={BurialReplay} width={1080} height={1350} fps={30} durationInFrames={450} defaultProps={{ burned: 18125623.54, burials: 1, wages: 1, lastBurial: 18125623.54, lastBurialEth: "0.0132", wageEth: "0.0204", date: "Oct 7, 2026", claimTx: "0x044fe69fe765d592555de532aa7193c26b4e5a031c3d06ba1787754de27709b4", buyTx: "0x40b399c8fe75d939dd5bc7ae72ecc53e4f8389b4b35a13e59a81b026ef5e8077", burnTx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd", wageTx: "0x134cda15c70ed008f62c86de3a90aeb537b7aec9febee74127ce1039bb87fc9a", next: "burial" as const }} />
        <Still
          id="PostPaidMore"
          component={PostPaidMore}
          width={1080}
          height={1350}
          defaultProps={{
            a: { n: 1, tokens: 18125623.54, eth: 0.013206819, tx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd" },
            b: { n: 2, tokens: 4059132.01, eth: 0.017347885, tx: "0xb4833dae9fb569cfc816b4466840fb649b4a40bb080b41f475a72af038dbaea5" },
            burned: 22184755.55,
          }}
        />
        <Still id="PostDeathCert" component={PostDeathCert} width={1080} height={1350} defaultProps={{ burned: 46404247.63, graves: 12, date: "OCT 7, 2026", lastTx: "0xa8b6b0c979320aae999828e4f2c5329eeda38f888a7f3a0c60e1a9ad753ccf44", milestone: 5 }} />
        <Still id="PostScoop" component={PostScoop} width={1080} height={1350} defaultProps={{ burned: 35057630.7, best: { n: 1, tokens: 18125623.54, eth: 0.013206819, tx: "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd" } }} />
        <Still id="PostTooQuiet" component={PostTooQuiet} width={1080} height={1350} defaultProps={{ asOf: "OCT 7 · 09:44 UTC", graves: 11, burned: 44963448.09, lastBurial: "08:28", trades: 28, boxFill: 0.66, next: "wages" as const }} />
        <Still id="PostRipDexPaid" component={PostRipDexPaid} width={1080} height={1350} defaultProps={{ died: "OCT 7, 2026 · 08:28 UTC", graves: 11, burned: 44963448.09, next: 20 }} />
        <Still id="PostDexPaidDone" component={PostDexSoon} width={1080} height={1350} defaultProps={{ graves: 11, burned: 44963448.09, date: "OCT 7 · 08:29 UTC", promised: 15, paid: true }} />
        <Still id="PostDexSoon" component={PostDexSoon} width={1080} height={1350} defaultProps={{ graves: 10, burned: 43087788.9, date: "OCT 7 · 07:34 UTC", promised: 15 }} />
        <Still id="PostDexPaid" component={PostDexPaid} width={1080} height={1350} defaultProps={{ graves: [18125623.54, 4059132.01, 2629678, 1896757, 5333244.14, 1485234.94, 1527960.56], wages: 7, burned: 35057630.7, date: "OCT 7 · 06:54 UTC", after: "grave #15", goal: 15 }} />
        <Still id="PostTallyWall" component={PostTallyWall} width={1080} height={1350} defaultProps={{ trades: 472, wallets: 124, window: "LAST 60 MINUTES", burned: 32044435.2 }} />
        <Still id="PostPlotMap" component={PostPlotMap} width={1080} height={1350} defaultProps={{ burned: 32044435.2, burials: 5, date: "OCT 7, 2026" }} />
        <Composition
          id="ShiftLog"
          component={ShiftLog}
          width={1080}
          height={1350}
          fps={30}
          durationInFrames={450}
          defaultProps={{
            rides: [
              { time: "05:46", kind: "burial" as const, tokens: 18125623.54, eth: 0.013207 },
              { time: "05:54", kind: "wages" as const, eth: 0.020436 },
              { time: "05:58", kind: "burial" as const, tokens: 4059132.01, eth: 0.017348 },
              { time: "06:01", kind: "wages" as const, eth: 0.020287 },
              { time: "06:01", kind: "burial" as const, tokens: 2629678.49, eth: 0.018756 },
            ],
            totalBuried: 24814434.04,
            minutes: 15,
            next: "wages" as const,
          }}
        />
        <Composition id="RipVideo" component={RipVideo} width={1080} height={1350} fps={30} durationInFrames={420} defaultProps={{ died: "OCT 7, 2026 · 08:28 UTC", graves: 11, burned: 44963448.09, next: 20 }} />
        <Composition id="ScoopVideo" component={ScoopVideo} width={1080} height={1350} fps={30} durationInFrames={480} defaultProps={{ buybacks: [ { n: 1, time: "05:46", tokens: 18125623.54, eth: 0.03671 }, { n: 2, time: "05:58", tokens: 4059132.01, eth: 0.01735 }, { n: 3, time: "06:01", tokens: 2629678.49, eth: 0.01876 }, { n: 4, time: "06:04", tokens: 1896757.02, eth: 0.01028 }, { n: 5, time: "06:18", tokens: 5333244.14, eth: 0.03658 }, { n: 6, time: "06:25", tokens: 1485234.94, eth: 0.01067 }, { n: 7, time: "06:40", tokens: 1527960.56, eth: 0.0118 }, { n: 8, time: "06:54", tokens: 3920483.67, eth: 0.01858 }, { n: 9, time: "07:06", tokens: 1964472.83, eth: 0.01123 }, { n: 10, time: "07:25", tokens: 2145201.7, eth: 0.01563 }, { n: 11, time: "08:28", tokens: 1875659, eth: 0.01261 } ], dip: 7, burned: 44963448.09, trades: 48, asOf: "OCT 7 · 09:05 UTC" }} />
        <Composition id="PumpGif" component={PumpGif} width={720} height={720} fps={30} durationInFrames={120} defaultProps={{ buys: 15, sells: 5 }} />
        <Composition id="SkullSpeech" component={SkullSpeech} width={1080} height={1350} fps={30} durationInFrames={360} defaultProps={{ burned: 47626380.15, graves: 13, next: "Mort’s wages" }} />
        <Composition id="SkullHour20" component={SkullHour20} width={1080} height={1350} fps={30} durationInFrames={420} defaultProps={{ hours: 20, burned: 53063610.88, graves: 19 }} />
        <Composition id="SkullBearish" component={SkullBearish} width={1080} height={1350} fps={30} durationInFrames={450} defaultProps={{ burned: 57257405.64, graves: 22, todayBurials: 3, todayTokens: 4193795, hour: { label: "last hour", sells: 13, buys: 3, soldM: 89.3, boughtM: 8.8 }, three: { label: "last 3 hours", sells: 45, buys: 17, soldM: 226.7, boughtM: 36.2 }, asOf: "18:04 UTC" }} />
        <Composition id="ClawVideo" component={ClawVideo} width={1080} height={1350} fps={30} durationInFrames={420} defaultProps={{ before: 54224705.74, after: 55089450.85, graves: 21, lastTokens: 864745.11 }} />
        <Composition id="ScoopGif" component={ScoopGif} width={720} height={720} fps={30} durationInFrames={120} />
        <Composition id="NightTour" component={NightTour} width={1080} height={1350} fps={30} durationInFrames={560} defaultProps={{"burials": [{"n": 1, "time": "05:46", "tokens": 18125624}, {"n": 2, "time": "05:58", "tokens": 4059132}, {"n": 3, "time": "06:01", "tokens": 2629678}, {"n": 4, "time": "06:04", "tokens": 1896757}, {"n": 5, "time": "06:18", "tokens": 5333244}, {"n": 6, "time": "06:25", "tokens": 1485235}, {"n": 7, "time": "06:40", "tokens": 1527961}, {"n": 8, "time": "06:54", "tokens": 3920484}, {"n": 9, "time": "07:06", "tokens": 1964473}, {"n": 10, "time": "07:25", "tokens": 2145202}, {"n": 11, "time": "08:28", "tokens": 1875659}, {"n": 12, "time": "10:33", "tokens": 1440800}, {"n": 13, "time": "11:43", "tokens": 1222133}], "burned": 47626380.15}} />
        <Still id="PostPodium" component={PostPodium} width={1080} height={1350} defaultProps={{"top": [{"n": 1, "tokens": 18125624, "time": "05:46", "tx": "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd"}, {"n": 5, "tokens": 5333244, "time": "06:18", "tx": "0xfe5101f0081c94fce164a155bba636505ab667feb0d3cf424cc6a4aced9fe2c4"}, {"n": 2, "tokens": 4059132, "time": "05:58", "tx": "0xb4833dae9fb569cfc816b4466840fb649b4a40bb080b41f475a72af038dbaea5"}], "graves": 13, "burned": 47626380.15}} />
        <Still id="PostGazette" component={PostGazette} width={1080} height={1350} defaultProps={{"burned": 47626380.15, "graves": 13, "date": "OCT 8, 2026", "record": {"n": 1, "tokens": 18125624, "tx": "0xc8ce2b299ebe0823205e8d21adf5a117230bd23af6c2e2b8ce1ce61821885fdd"}, "latest": [{"n": 13, "tokens": 1222133, "tx": "0xf041c88bbd375836960c903c22377aa680522e0acd57193cb87ad93f885a9d52"}, {"n": 12, "tokens": 1440800, "tx": "0xa8b6b0c979320aae999828e4f2c5329eeda38f888a7f3a0c60e1a9ad753ccf44"}, {"n": 11, "tokens": 1875659, "tx": "0x9f41b8be8267ec1d9bab1b852ae9ee8817239bade63de5d94a0844f2056370d2"}]}} />
        <Still id="PostAlmostBell" component={PostAlmostBell} width={1080} height={1350} defaultProps={{"burned": 49227859.89, "graves": 15, "goalPct": 5, "latest": {"n": 15, "tokens": 769119.81, "tx": "0x1629dd7abc074e569a40e17e81130a86be64783e2198512c646c9cb4b5689496"}}} />
        <Still id="PostBackFromDead" component={PostBackFromDead} width={1080} height={1350} defaultProps={{"buys": 116, "sells": 99, "netM": 119.7, "window": "last hour", "burned": 48458740.08}} />
        <Still id="PostClearance" component={PostClearance} width={1080} height={1350} defaultProps={{"window": "last 15 min", "sells": 26, "soldM": 69.0, "buys": 27, "boughtM": 29.8, "burned": 48458740.08}} />
        <Composition id="AlmostGif" component={AlmostGif} width={720} height={720} fps={30} durationInFrames={120} defaultProps={{"burned": 49227859.89, "goalPct": 5}} />
        <Still id="PostMortExe" component={PostMortExe} width={1080} height={1350} defaultProps={{"burned": 49779321.93, "goalPct": 5, "graves": 16}} />
        <Still id="PostDirtPrices" component={PostDirtPrices} width={1080} height={1350} defaultProps={{"burials": [{"n": 1, "tokens": 18125624, "eth": 0.03671}, {"n": 2, "tokens": 4059132, "eth": 0.01735}, {"n": 3, "tokens": 2629678, "eth": 0.01876}, {"n": 4, "tokens": 1896757, "eth": 0.01028}, {"n": 5, "tokens": 5333244, "eth": 0.03658}, {"n": 6, "tokens": 1485235, "eth": 0.01067}, {"n": 7, "tokens": 1527961, "eth": 0.0118}, {"n": 8, "tokens": 3920484, "eth": 0.01858}, {"n": 9, "tokens": 1964473, "eth": 0.01123}, {"n": 10, "tokens": 2145202, "eth": 0.01563}, {"n": 11, "tokens": 1875659, "eth": 0.01261}, {"n": 12, "tokens": 1440800, "eth": 0.01022}, {"n": 13, "tokens": 1222133, "eth": 0.01103}, {"n": 14, "tokens": 832360, "eth": 0.00902}, {"n": 15, "tokens": 769120, "eth": 0.00899}, {"n": 16, "tokens": 551462, "eth": 0.00898}], "burned": 49779321.93}} />
        <Still id="PostDing" component={PostDing} width={1080} height={1350} defaultProps={{"burned": 53063610.88, "graves": 19, "goalPct": 5, "ringer": {"n": 18, "tokens": 1195710.5, "tx": "0x5aa22eafcb90000a46c0cfb56fa939fdf5a5fe4f7616dd4be9f0a3f57bddfb48"}}} />
        <Still id="PostDepartures" component={PostDepartures} width={1080} height={1350} defaultProps={{"burned": 53063610.88, "buys": 52, "sells": 26, "window": "last 3h"}} />
        <Still id="PostBullCandle" component={PostBullCandle} width={1080} height={1350} defaultProps={{"burned": 53063610.88, "buys": 52, "sells": 26, "window": "last 3h"}} />
        <Still id="PostWrapped" component={PostWrapped} width={1080} height={1350} defaultProps={{"burials": [{"n": 1, "time": "05:46", "tokens": 18125624}, {"n": 2, "time": "05:58", "tokens": 4059132}, {"n": 3, "time": "06:01", "tokens": 2629678}, {"n": 4, "time": "06:04", "tokens": 1896757}, {"n": 5, "time": "06:18", "tokens": 5333244}, {"n": 6, "time": "06:25", "tokens": 1485235}, {"n": 7, "time": "06:40", "tokens": 1527961}, {"n": 8, "time": "06:54", "tokens": 3920484}, {"n": 9, "time": "07:06", "tokens": 1964473}, {"n": 10, "time": "07:25", "tokens": 2145202}, {"n": 11, "time": "08:28", "tokens": 1875659}, {"n": 12, "time": "10:33", "tokens": 1440800}, {"n": 13, "time": "11:43", "tokens": 1222133}, {"n": 14, "time": "18:00", "tokens": 832360}, {"n": 15, "time": "18:18", "tokens": 769120}, {"n": 16, "time": "18:57", "tokens": 551462}, {"n": 17, "time": "20:27", "tokens": 868241}, {"n": 18, "time": "22:36", "tokens": 1195711}, {"n": 19, "time": "23:31", "tokens": 1220337}], "burned": 53063610.88}} />
        <Still id="PostWanted" component={PostWanted} width={1080} height={1350} defaultProps={{"burned": 54224705.74, "graves": 20, "latest": {"n": 20, "tokens": 1161094.86, "tx": "0x2462d56f7a385868a787b4d3e4ad479dcc85fa32184743581c4bf143e8082459"}}} />
        <Still id="PostNutrition" component={PostNutrition} width={1080} height={1350} defaultProps={{"burned": 54224705.74, "graves": 20, "biggest": {"n": 1, "tokens": 18125624}, "smallest": {"n": 16, "tokens": 551462}}} />
        <Still id="PostWaited" component={PostWaited} width={1080} height={1350} defaultProps={{"early": {"time": "07:14", "usd": 23, "eth": 0.00896, "tokens": 1161094.86}, "late": {"time": "11:32", "usd": 24, "eth": 0.00946, "tokens": 864745.11}, "burned": 55089450.85, "gap": "4 hours"}} />
        <Still id="PostFeelings" component={PostFeelings} width={1080} height={1350} defaultProps={{"burned": 55089450.85, "graves": 21}} />
        <Still id="PostScoopShop" component={PostScoopShop} width={1080} height={1350} defaultProps={{"window": "last hour", "sells": 8, "soldM": 62.7, "buys": 7, "boughtM": 9.5, "burned": 55089450.85}} />
        <Still id="PostElement" component={PostElement} width={1080} height={1350} defaultProps={{"burned": 57257405.64, "graves": 22}} />
        <Still id="PostOcto" component={PostOcto} width={1080} height={1350} defaultProps={{"burned": 57257405.64, "graves": 22}} />
        <Composition id="ZeroDays" component={ZeroDays} width={720} height={720} fps={30} durationInFrames={120} defaultProps={{ burials: 4, buried: 26711191.06 }} />
        <Composition
          id="GraveCam"
          component={GraveCam}
          width={1080}
          height={1350}
          fps={30}
          durationInFrames={540}
          defaultProps={{
            from: "05:44",
            to: "13:44",
            date: "2026-10-07",
            // Graves 1-11: exact UTC times from the chain. 12 and 13: placed inside their checked windows (10:19-11:18, 11:18-11:48).
            graves: [
              { time: "05:46", tokens: 18125623.54 },
              { time: "05:58", tokens: 4059132.01 },
              { time: "06:01", tokens: 2629678.49 },
              { time: "06:04", tokens: 1896757.02 },
              { time: "06:18", tokens: 5333244.14 },
              { time: "06:25", tokens: 1485234.94 },
              { time: "06:40", tokens: 1527960.56 },
              { time: "06:54", tokens: 3920483.67 },
              { time: "07:06", tokens: 1964472.83 },
              { time: "07:25", tokens: 2145201.7 },
              { time: "08:28", tokens: 1875659 },
              { time: "10:50", tokens: 1440799.54 },
              { time: "11:35", tokens: 1222132.52 },
            ],
            wages: 12,
            totalBuried: 47626380.15,
            feesEth: "0.45",
            boxFill: 0.92,
            quietFrom: "11:35",
          }}
        />
        <Still
          id="PostReceipt"
          component={PostReceipt}
          width={1080}
          height={1350}
          defaultProps={{
            date: "OCT 7, 2026",
            shift: "05:44–13:44",
            graves: [18125623.54, 4059132.01, 2629678.49, 1896757.02, 5333244.14, 1485234.94, 1527960.56, 3920483.67, 1964472.83, 2145201.7, 1875659, 1440799.54, 1222132.52],
            burned: 47626380.15,
            feesEth: "0.4499",
            burialEth: "0.1979",
            wageEth: "0.2520",
            wages: 12,
          }}
        />
        <Still id="PostGraveSale" component={PostGraveSale} width={1080} height={1350} defaultProps={{ burned: 47626380.15, graves: 13, boxFill: 0.85, next: "burial" as const }} />
      </Folder>
      <Folder name="BlackVoid">
        <Still id="VoidLogo" component={VoidLogo} width={1000} height={1000} />
        <Still id="VoidBanner" component={VoidBanner} width={1500} height={500} />
        <Still id="VoidOg" component={VoidOg} width={1200} height={630} />
        <Still id="PostMeetVoid" component={PostMeetVoid} width={1080} height={1350} />
        <Still id="PostNowObserving" component={PostNowObserving} width={1080} height={1350} />
        <Still id="PostHowVoidWorks" component={PostHowVoidWorks} width={1600} height={900} />
        <Still id="PostTwoOrbits" component={PostTwoOrbits} width={1080} height={1350} />
        <Still id="PostFlatLine" component={PostFlatLine} width={1080} height={1350} />
        <Still id="PostNothingEscapes" component={PostNothingEscapes} width={1080} height={1350} />
        <Still id="PostStatus" component={PostStatus} width={1080} height={1350} defaultProps={{ asOf: "Oct 10, 2026 · 16:14 UTC", pendingEth: 0.00296, criticalEth: 0.01, trades: 8, buys: 6, sells: 2, holders: 4, falls: 0 }} />
        <Composition id="VoidLoop" component={VoidLoop} width={600} height={600} fps={30} durationInFrames={120} />
        <Composition id="VoidTeaser" component={VoidTeaser} width={1080} height={1350} fps={30} durationInFrames={360} />
        <Composition id="VoidDemo" component={VoidDemo} width={1920} height={1080} fps={30} durationInFrames={720} />
      </Folder>
      <Folder name="SunEater">
        <Still id="SunLogo" component={SunLogo} width={1000} height={1000} />
        <Still id="SunBanner" component={SunBanner} width={1500} height={500} />
        <Still id="SunOg" component={SunOg} width={1200} height={630} />
        <Still id="PostNowEating" component={PostNowEating} width={1080} height={1350} />
        <Still id="PostCaught" component={PostCaught} width={1080} height={1350} />
        <Still id="PostSunHow" component={PostSunHow} width={1600} height={900} />
        <Still id="PostHalfIn" component={PostHalfIn} width={1080} height={1350} />
        <Still id="PostSunHook" component={PostSunHook} width={1080} height={1350} />
        <Composition id="SunLoop" component={SunLoop} width={600} height={600} fps={30} durationInFrames={120} />
        <Composition id="SunTeaser" component={SunTeaser} width={1080} height={1350} fps={30} durationInFrames={360} />
        <Composition id="SunDemo" component={SunDemo} width={1920} height={1080} fps={30} durationInFrames={720} />
      </Folder>
      <Folder name="Gulp">
        <Still id="GulpLogo" component={GulpLogo} width={1000} height={1000} />
        <Still id="GulpBanner" component={GulpBanner} width={1500} height={500} />
        <Still id="GulpOg" component={GulpOg} width={1200} height={630} />
        <Still id="PostMeetGulp" component={PostMeetGulp} width={1080} height={1350} />
        <Still id="PostGulpLive" component={PostGulpLive} width={1080} height={1350} />
        <Still id="PostGulpHow" component={PostGulpHow} width={1600} height={900} />
        <Still id="PostGulpHook" component={PostGulpHook} width={1080} height={1350} />
        <Composition id="GulpLoop" component={GulpLoop} width={600} height={600} fps={30} durationInFrames={120} />
        <Composition id="GulpTeaser" component={GulpTeaser} width={1080} height={1350} fps={30} durationInFrames={360} />
      </Folder>
      <Folder name="ApePyre">
        <Still id="PyreLogo" component={PyreLogo} width={1000} height={1000} />
        <Still id="PyreBanner" component={PyreBanner} width={1500} height={500} />
        <Still id="PyreOg" component={PyreOg} width={1200} height={630} />
        <Still id="PostMeetPyre" component={PostMeetPyre} width={1080} height={1350} />
        <Still id="PostPyreLive" component={PostPyreLive} width={1080} height={1350} />
        <Still id="PostPyreHow" component={PostPyreHow} width={1600} height={900} />
        <Still id="PostPyreHook" component={PostPyreHook} width={1080} height={1350} />
        <Composition id="PyreLoop" component={PyreLoop} width={600} height={600} fps={30} durationInFrames={120} />
        <Composition id="PyreTeaser" component={PyreTeaser} width={1080} height={1350} fps={30} durationInFrames={360} />
        <Still id="CircleLogo" component={CircleLogo} width={1000} height={1000} />
        <Still id="CircleBanner" component={CircleBanner} width={1500} height={500} />
        <Composition id="CircleLoop" component={CircleLoop} width={600} height={600} fps={20} durationInFrames={120} />
        <Composition id="CircleDemo" component={CircleDemo} width={1920} height={1080} fps={30} durationInFrames={900} />
        <Still id="PyreReceipt" component={PyreReceipt} width={1080} height={1350} defaultProps={{ asOf: "Oct 11, 14:03 UTC", burns: [{ amount: 20607394.87, tx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc" }, { amount: 3547255.6, tx: "0x412f1e0a9dfebb73a9b483096f96294b8b5c527fb467feb0bff197ba5074541c" }], ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
        <Still id="PyreTodo" component={PyreTodo} width={1080} height={1350} defaultProps={{ asOf: "Oct 11, 14:10 UTC", burns: [{ amount: 20607394.87, tx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc" }, { amount: 3547255.6, tx: "0x412f1e0a9dfebb73a9b483096f96294b8b5c527fb467feb0bff197ba5074541c" }], ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
        <Composition id="ScoopDip" component={ScoopDip} width={1080} height={1350} fps={30} durationInFrames={480} defaultProps={{ asOf: "", burns: [{ amount: 0, tx: "0x" }], ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
        <Composition id="PaperHands" component={PaperHands} width={1080} height={1350} fps={30} durationInFrames={480} defaultProps={{ asOf: "Oct 11, 14:20 UTC", burns: [{ amount: 20607394.87, tx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc" }, { amount: 3547255.6, tx: "0x412f1e0a9dfebb73a9b483096f96294b8b5c527fb467feb0bff197ba5074541c" }], ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c", sells: 71, nextKind: "burn" as const, nextAt: 0.01 }} />
        <Still id="PyreFees" component={PyreFees} width={1080} height={1350} defaultProps={{ asOf: "Oct 11, 14:28 UTC", pile: 0.009836, target: 0.01, next: "burn" as const, claimed: 0.0818, kept: 0.041, cycles: 4 }} />
        <Composition id="HookPOV" component={HookPOV} width={1080} height={1350} fps={30} durationInFrames={390} defaultProps={{ asOf: "Oct 11, 14:03 UTC", burns: [{ amount: 20607394.87, tx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc" }, { amount: 3547255.6, tx: "0x412f1e0a9dfebb73a9b483096f96294b8b5c527fb467feb0bff197ba5074541c" }], ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
        <Composition id="CircleUpdate" component={CircleUpdate} width={1080} height={1350} fps={30} durationInFrames={630} defaultProps={{ asOf: "Oct 11, 13:58 UTC", minutesIn: 14, burns: [{ amount: 20607394.87, tx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc" }, { amount: 3547255.6, tx: "0x412f1e0a9dfebb73a9b483096f96294b8b5c527fb467feb0bff197ba5074541c" }], cycles: ["burn", "keep", "burn"], next: "keep", nextAt: 0.02, escrow: 0.01312, holders: 36, buys: 85, sells: 46, ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
        <Composition id="CircleStatus" component={CircleStatus} width={1080} height={1350} fps={30} durationInFrames={690} defaultProps={{ asOf: "Oct 11, 13:48 UTC", burned: 20607394.87, burnedPct: 2.0607, burnTx: "0x29a9c92a86b036433dd4e657fe50dd47762c5e60595348a11d4a713bba501ebc", burnSpentEth: 0.024856, keepEth: 0.020791, buys: 53, sells: 22, holders: 32, nextAt: 0.01, ca: "0xc038e7b0e97fb9ecf3feb224f811e8e001304c0c" }} />
      </Folder>
      <Folder name="Brew">
        <Still id="BrewLogo" component={BrewLogo} width={1000} height={1000} />
        <Still id="BrewBanner" component={BrewBanner} width={1500} height={500} />
        <Composition id="BrewLoop" component={BrewLoop} width={600} height={600} fps={20} durationInFrames={80} />
        <Composition id="BrewDemo" component={BrewDemo} width={1920} height={1080} fps={30} durationInFrames={900} />
      </Folder>
    </>
  );
};
