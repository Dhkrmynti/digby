import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TAGLINE, TICKER, body, display, mono } from "./brand";
import { Brazier, Mask, Pyramid, TombBlock, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Embers rising from a fire at (x, y); each wraps once per loop, so a loop stays seamless. */
function Embers({ t, x, y, spread, rise, n = 12 }: { t: number; x: number; y: number; spread: number; rise: number; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = (t + i / n) % 1;
        const ex = x + ((((i * 37) % 100) / 100) - 0.5) * spread + Math.sin((k + i) * 6.28) * 10;
        return <div key={i} style={{ position: "absolute", left: ex, top: y - k * rise, width: 8, height: 8, background: i % 3 ? C.ochreLit : C.flame, opacity: Math.sin(k * Math.PI) }} />;
      })}
    </>
  );
}

/** The tomb wall: dark sandstone courses in torchlight. */
const tombWall = {
  background: C.tomb,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, rgba(0,0,0,0.45) 58px 62px), repeating-linear-gradient(90deg, transparent 0 118px, rgba(0,0,0,0.35) 118px 122px)`,
} as const;

/* ═════════ X profile picture (1000×1000): the Pharaoh over the brazier, centred for the round crop ═════════ */
export const TombLogo: React.FC = () => (
  <AbsoluteFill style={{ background: C.ochre, alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 940, height: 940, borderRadius: "50%", ...tombWall, border: `22px solid ${C.soot}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "62%", width: 760, height: 760, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,0.38), transparent 62%)` }} />
      <Mask size={560} bg={null} frame={false} style={{ position: "absolute", left: 168, top: 70 }} />
      <Brazier size={300} t={0.15} style={{ position: "absolute", left: 298, top: 560 }} />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): the pyramid at noon, words in the middle band, clear of the profile picture ═════════ */
export const TombBanner: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(${C.sky}, ${C.skyDeep} 70%)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 90, top: 46, width: 110, height: 110, borderRadius: "50%", background: C.sun }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: C.sand }} />
    <Pyramid width={280} style={{ position: "absolute", left: 1170, bottom: 92, opacity: 0.55 }} />
    <Pyramid width={440} style={{ position: "absolute", left: 930, bottom: 70 }} />
    <Brazier size={120} t={0.3} style={{ position: "absolute", left: 1330, bottom: 40 }} />
    <div style={{ position: "absolute", left: 330, top: 70, width: 580 }}>
      <p style={{ margin: 0, fontFamily: display, fontSize: 50, lineHeight: 1.02, color: C.soot, textTransform: "uppercase" }}>
        What goes in the tomb stays in the tomb.
      </p>
      <p style={{ margin: "16px 0 0", fontFamily: body, fontWeight: 600, fontSize: 25, color: C.sootSoft, whiteSpace: "nowrap" }}>Every trade's fee buys {TICKER} back and burns it.</p>
      <div style={{ marginTop: 18 }}>
        <p style={chip(20, C.ochre, C.dust)}>
          {TICKER} · buyback &amp; burn · treasury · {SITE}
        </p>
      </div>
    </div>
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4 s, seamless): a $TOMB block drops into the brazier and the fire takes it ═════════ */
export const TombLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1, one loop
  const drop = interpolate(t, [0.05, 0.42], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const blockY = interpolate(drop, [0, 1], [-140, 300]);
  const inFire = t > 0.42;
  const flare = interpolate(t, [0.42, 0.5, 0.8, 1], [1, 1.45, 1.1, 1], clamp);
  return (
    <AbsoluteFill style={{ ...tombWall, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "70%", width: 620, height: 620, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,${0.25 + (flare - 1) * 0.5}), transparent 62%)` }} />
      <p style={{ position: "absolute", left: 0, right: 0, top: 34, margin: 0, textAlign: "center", fontFamily: display, fontSize: 40, color: C.dust, textTransform: "uppercase" }}>Into the fire</p>
      {!inFire ? <TombBlock size={130} style={{ position: "absolute", left: 235, top: blockY, transform: `rotate(${drop * 30}deg)` }} /> : null}
      <Brazier size={250} t={t * 4} blaze={flare} style={{ position: "absolute", left: 175, top: 250 }} />
      <Embers t={t} x={300} y={420} spread={160} rise={300} />
      <p style={{ position: "absolute", left: 0, right: 0, bottom: 26, margin: 0, textAlign: "center", fontFamily: mono, fontWeight: 600, fontSize: 22, color: C.torch }}>
        {TICKER} · gone to 0x…dEaD
      </p>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30 s) ═════════ */
function Caption({ kicker, line, frame, at, dark = false }: { kicker: string; line: string; frame: number; at: number; dark?: boolean }) {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", left: 120, top: 120, width: 1000, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <p style={{ ...chip(26, C.ochre, C.dust) }}>{kicker}</p>
      <p style={{ margin: "26px 0 0", fontFamily: display, fontSize: 84, lineHeight: 1.02, color: dark ? C.dust : C.soot, textTransform: "uppercase" }}>{line}</p>
    </div>
  );
}

export const TombDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = { build: [0, 150], fee: [150, 330], fire: [330, 570], keep: [570, 720], end: [720, 900] } as const;
  const inScene = (k: keyof typeof S) => frame >= S[k][0] && frame < S[k][1];
  const fade = (k: keyof typeof S) => interpolate(frame, [S[k][0], S[k][0] + 12, S[k][1] - 12, S[k][1]], [0, 1, 1, 0], clamp);

  // scene 1: the pyramid goes up
  const built = interpolate(frame, [10, 110], [0, 1], { ...clamp, easing: ease });
  // scene 2: the offering bowl fills to 0.01 ETH
  const fill = interpolate(frame, [190, 300], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  // scene 3: the block falls into the brazier
  const drop = interpolate(frame, [400, 450], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flare = interpolate(frame, [450, 465, 540], [1, 1.5, 1.1], clamp);
  // scene 4: ETH into the builders' coffer, the wheel turns back to fire
  const coin = interpolate(frame, [610, 660], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const wheel = interpolate(frame, [670, 710], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const end = spring({ frame: frame - 735, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ background: C.tomb, overflow: "hidden" }}>
      {/* 1. noon on the plateau */}
      {inScene("build") ? (
        <AbsoluteFill style={{ opacity: fade("build"), background: `linear-gradient(${C.sky}, ${C.skyDeep} 70%)` }}>
          <div style={{ position: "absolute", left: 1480, top: 110, width: 160, height: 160, borderRadius: "50%", background: C.sun }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240, background: C.sand }} />
          <Pyramid width={1100} built={built} style={{ position: "absolute", left: 760, bottom: 150 }} />
          <Caption kicker={`${TICKER} on Robinhood Chain`} line="The Sealed Tomb." frame={frame} at={20} />
          <p style={{ position: "absolute", left: 120, top: 360, width: 700, margin: 0, fontFamily: body, fontWeight: 600, fontSize: 40, lineHeight: 1.3, color: C.sootSoft, opacity: interpolate(frame, [50, 70], [0, 1], clamp) }}>{TAGLINE}</p>
        </AbsoluteFill>
      ) : null}

      {/* 2. every trade leaves an offering */}
      {inScene("fee") ? (
        <AbsoluteFill style={{ opacity: fade("fee"), background: `linear-gradient(${C.sky}, ${C.skyDeep} 70%)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240, background: C.sand }} />
          <Caption kicker="Step 1 · the offering" line="Every trade leaves an offering." frame={frame} at={160} />
          <div style={{ position: "absolute", left: 120, top: 520, width: 900 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontWeight: 600, fontSize: 34, color: C.soot }}>
              <span>creator fee → Pons escrow</span>
              <span>{(fill * 0.01).toFixed(4)} / 0.01 ETH</span>
            </div>
            <div style={{ marginTop: 14, height: 44, border: `6px solid ${C.soot}`, background: C.stoneHi }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: C.ochre }} />
            </div>
            <p style={{ margin: "22px 0 0", fontFamily: body, fontSize: 30, color: C.sootSoft }}>Buys and sells both pay it, in ETH. The bot watches every block.</p>
          </div>
          <Pyramid width={620} style={{ position: "absolute", left: 1160, bottom: 150 }} />
        </AbsoluteFill>
      ) : null}

      {/* 3. into the fire */}
      {inScene("fire") ? (
        <AbsoluteFill style={{ opacity: fade("fire"), ...tombWall }}>
          <div style={{ position: "absolute", left: 1340, top: 720, width: 1100, height: 1100, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,${0.25 + (flare - 1) * 0.4}), transparent 60%)` }} />
          <Caption kicker="Step 2 · at 0.01 ETH" line={`Buy ${TICKER} back. Burn it.`} frame={frame} at={340} dark />
          <p style={{ position: "absolute", left: 120, top: 520, width: 760, margin: 0, fontFamily: body, fontSize: 34, lineHeight: 1.35, color: C.dustSoft, opacity: interpolate(frame, [370, 390], [0, 1], clamp) }}>
            The bot claims the escrow, market-buys {TICKER} with all of it, and sends exactly what it bought to the dead address.
          </p>
          {frame < 452 ? <TombBlock size={190} style={{ position: "absolute", left: 1245, top: interpolate(drop, [0, 1], [80, 600]), transform: `rotate(${drop * 40}deg)` }} /> : null}
          <Brazier size={420} t={frame / 22} blaze={flare} style={{ position: "absolute", left: 1130, top: 420 }} />
          <Embers t={(frame % 60) / 60} x={1340} y={700} spread={240} rise={460} n={16} />
          {frame >= 470 ? (
            <div style={{ position: "absolute", left: 120, top: 760, transform: `scale(${spring({ frame: frame - 470, fps, config: { damping: 12 } })})`, transformOrigin: "0 50%" }}>
              <p style={chip(36, C.torch, C.soot)}>→ 0x000…dEaD · gone for good</p>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* 4. the builders' share */}
      {inScene("keep") ? (
        <AbsoluteFill style={{ opacity: fade("keep"), background: `linear-gradient(${C.sky}, ${C.skyDeep} 70%)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240, background: C.sand }} />
          <Caption kicker="Step 3 · the next 0.02 ETH" line="The builders' share." frame={frame} at={580} />
          <p style={{ position: "absolute", left: 120, top: 440, width: 760, margin: 0, fontFamily: body, fontSize: 34, lineHeight: 1.35, color: C.sootSoft }}>
            Every other run goes to the treasury, in the open. Then it's back to the fire.
          </p>
          {/* the coffer and the coin */}
          <div style={{ position: "absolute", left: 1220, top: 560, width: 300, height: 220, background: C.wood, border: `8px solid ${C.soot}` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 16, background: C.gold }} />
            <p style={{ position: "absolute", left: 0, right: 0, bottom: 18, margin: 0, textAlign: "center", fontFamily: mono, fontWeight: 600, fontSize: 28, color: C.dust }}>treasury</p>
          </div>
          {coin < 1 ? (
            <div style={{ position: "absolute", left: 1330, top: interpolate(coin, [0, 1], [120, 560]), width: 84, height: 84, borderRadius: "50%", background: C.goldHi, border: `6px solid ${C.soot}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 600, fontSize: 22, color: C.soot }}>ETH</div>
          ) : null}
          {/* the wheel: fire → treasury → fire */}
          <div style={{ position: "absolute", left: 120, top: 640, display: "flex", alignItems: "center", gap: 30 }}>
            <svg viewBox="0 0 200 200" width={200} height={200} style={{ transform: `rotate(${wheel}deg)` }}>
              <circle cx="100" cy="100" r="92" fill={C.stoneHi} stroke={C.soot} strokeWidth="8" />
              <path d="M100 8 V192" stroke={C.soot} strokeWidth="5" strokeDasharray="12 8" />
              <text x="54" y="112" textAnchor="middle" fontFamily={mono} fontWeight={600} fontSize="22" fill={C.ochre} transform={`rotate(${-wheel} 54 104)`}>burn</text>
              <text x="146" y="112" textAnchor="middle" fontFamily={mono} fontWeight={600} fontSize="22" fill={C.soot} transform={`rotate(${-wheel} 146 104)`}>keep</text>
            </svg>
            <p style={{ margin: 0, fontFamily: mono, fontWeight: 600, fontSize: 32, lineHeight: 1.4, color: C.soot }}>
              0.01 burn → 0.02 treasury
              <br />→ repeat, forever
            </p>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 5. the close */}
      {inScene("end") ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [720, 734], [0, 1], clamp), ...tombWall, alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: "50%", top: "55%", width: 1300, height: 1300, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,0.3), transparent 60%)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 70, transform: `scale(${end})` }}>
            <Mask size={330} bg={C.ochre} />
            <div>
              <p style={{ margin: 0, fontFamily: display, fontSize: 92, lineHeight: 1, color: C.dust, textTransform: "uppercase" }}>
                No rewards.
                <br />
                No ranks.
              </p>
              <p style={{ margin: "18px 0 0", fontFamily: display, fontSize: 64, color: C.ochreLit, textTransform: "uppercase" }}>Just less {TICKER}.</p>
              <p style={{ ...chip(36, C.torch, C.soot), marginTop: 34 }}>{SITE}</p>
            </div>
          </div>
          <p style={{ position: "absolute", left: 0, right: 0, bottom: 40, margin: 0, textAlign: "center", fontFamily: mono, fontSize: 24, color: C.dustSoft }}>
            Robinhood Chain · Pons · a meme, not financial advice
          </p>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
