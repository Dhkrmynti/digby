import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TAGLINE, TICKER, body, disp, mono } from "./brand";
import { AshUrn, Board, Candle, Drape, SmokingSkull, Valance, Velvet, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ X profile picture (1000×1000): the smoking skull, its disc filling X's circle crop ═════════ */
export const UrnLogo: React.FC = () => (
  <AbsoluteFill style={{ background: C.flame, alignItems: "center", justifyContent: "center" }}>
    <SmokingSkull size={1000} t={0.25} />
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): the parlour; words held in the middle, clear of the profile picture ═════════ */
export const UrnBanner: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Velvet />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: `repeating-conic-gradient(${C.paper} 0 25%, #d9ceb6 0 50%) 0 0 / 70px 70px`, borderTop: `5px solid ${C.ink}` }} />
    <Drape side="l" open={0.55} width={260} height={500} />
    <Drape side="r" open={0.55} width={260} height={500} />
    <Valance width={1500} />
    <div style={{ position: "absolute", left: 330, top: 104 }}>
      <Board text={TAGLINE} size={92} style={{ transform: "rotate(-1.5deg)" }} />
    </div>
    <p style={{ position: "absolute", left: 360, top: 290, margin: 0, fontFamily: body, fontWeight: 700, fontSize: 34, color: C.paper2 }}>
      Every trade's fee buys {TICKER} and burns it.
    </p>
    <div style={{ position: "absolute", left: 360, top: 352 }}>
      <p style={chip(24, C.flame)}>
        {TICKER} · buy &amp; burn · treasury · {SITE}
      </p>
    </div>
    <Candle height={230} flick={0.2} style={{ position: "absolute", right: 372, bottom: 40 }} />
    <AshUrn id="banner" size={250} style={{ position: "absolute", right: 120, bottom: 22 }} />
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4 s, seamless): the mark smoking ═════════ */
export const UrnLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Velvet />
      {/* embers drifting up, each wrapping round once per loop */}
      {Array.from({ length: 14 }, (_, i) => {
        const k = (t + i / 14) % 1;
        const x = 30 + ((i * 397) % 540) + Math.sin((k + i) * 6.28) * 10;
        return <div key={i} style={{ position: "absolute", left: x, top: 600 - k * 640, width: 7, height: 7, borderRadius: "50%", background: i % 3 ? C.ember : C.flame, opacity: Math.sin(k * Math.PI) }} />;
      })}
      <div style={{ transform: `translateY(${Math.sin(t * Math.PI * 2) * 6}px) rotate(${Math.sin(t * Math.PI * 2) * 2}deg)` }}>
        <SmokingSkull size={470} t={t} puffs />
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30 s): one turn of the cycle, burn then treasury ═════════ */
const STEPS = [
  { at: 150, n: "1", name: "Fees collect", text: `Every ${TICKER} buy and sell on Pons pays a creator fee in ETH. It waits in the Pons fee escrow.` },
  { at: 330, n: "2", name: "Burn", text: `At 0.02 ETH the engine claims it, buys ${TICKER} with all of it, and sends every token to the dead address.` },
  { at: 540, n: "3", name: "Treasury", text: "The next 0.01 ETH goes to the treasury wallet, for the funeral home's upkeep." },
  { at: 690, n: "4", name: "Then again", text: `Burn, treasury, burn. Nobody is paid to stay. There is just less ${TICKER} after every burn.` },
];

export const UrnDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 130 } });

  const open = interpolate(frame, [0, 60], [0, 1], { ...clamp, easing: ease }) - interpolate(frame, [780, 830], [0, 0.55], { ...clamp, easing: ease });
  const boardY = interpolate(pop(25), [0, 1], [-260, 0]);
  const up = interpolate(frame, [50, 85], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const step = [...STEPS].reverse().find((s) => frame >= s.at);
  const stepIn = step ? pop(step.at) : 0;

  // the fee escrow: fills to 0.02 for the burn, empties on the claim, fills to 0.01 for the treasury
  const burnFill = interpolate(frame, [170, 310], [0, 0.02], clamp);
  const treasFill = interpolate(frame, [560, 640], [0, 0.01], clamp);
  const target = frame < 540 ? 0.02 : 0.01;
  const escrow = frame < 345 ? burnFill : frame < 540 ? 0 : frame < 655 ? treasFill : 0;
  const nextName = frame < 540 ? "burn" : "treasury";

  // the burn: tokens fly from the market into the urn
  const burnT = interpolate(frame, [360, 470], [0, 1], clamp);
  const blaze = interpolate(frame, [360, 400, 480, 530], [1, 1.8, 1.8, 1], clamp);
  const lidPop = interpolate(frame, [372, 392, 430], [0, -24, 0], clamp);
  // the treasury: one coin rolls off to the till
  const coinT = interpolate(frame, [655, 690], [0, 1], { ...clamp, easing: ease });

  const outro = interpolate(frame, [800, 840], [0, 1], { ...clamp, easing: ease });
  const scene = 1 - outro;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: body }}>
      <Velvet />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 210, background: `repeating-conic-gradient(${C.paper} 0 25%, #d9ceb6 0 50%) 0 0 / 120px 120px`, borderTop: `6px solid ${C.ink}` }} />

      <div style={{ opacity: scene }}>
        {/* the headline on its board */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center", transform: `translateY(${boardY}px)` }}>
          <Board text={TAGLINE} size={96} />
        </div>

        {/* Ash on his pedestal, with the tokens flying in */}
        <div style={{ position: "absolute", left: 300, bottom: 150, width: 420, height: 620 }}>
          <Candle height={300} flick={frame / 20} style={{ position: "absolute", left: -90, bottom: 0 }} />
          <Candle height={300} flick={frame / 23 + 0.4} style={{ position: "absolute", right: -90, bottom: 0 }} />
          <AshUrn id="demo" size={420} up={up} lid={lidPop} fire={blaze - 0.4} flick={frame / 18} style={{ position: "absolute", left: 0, bottom: 0 }} />
        </div>
        {Array.from({ length: 9 }, (_, i) => {
          const k = interpolate(burnT, [i * 0.07, i * 0.07 + 0.4], [0, 1], clamp);
          if (k <= 0 || k >= 1) return null;
          const x = interpolate(k, [0, 1], [1180, 510]);
          const y = interpolate(k, [0, 1], [560, 380]) - Math.sin(k * Math.PI) * 220;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${k * 540}deg) scale(${1 - k * 0.5})` }}>
              <p style={chip(26, C.flame)}>{TICKER}</p>
            </div>
          );
        })}
        {frame >= 400 && frame < 540 ? (
          <div style={{ position: "absolute", left: 360, top: 330, opacity: interpolate(frame, [400, 415, 520, 540], [0, 1, 1, 0], clamp), transform: `scale(${pop(400)})` }}>
            <p style={chip(26, C.paper2)}>burned → 0x…dEaD</p>
          </div>
        ) : null}
        {coinT > 0 && coinT < 1 ? (
          <div style={{ position: "absolute", left: interpolate(coinT, [0, 1], [1240, 1560]), top: interpolate(coinT, [0, 1], [930, 900]) - Math.sin(coinT * Math.PI) * 120, width: 46, height: 46, borderRadius: "50%", background: C.gold, border: `4px solid ${C.ink}` }} />
        ) : null}

        {/* the sign: what is happening now */}
        <div style={{ position: "absolute", right: 190, top: 290, width: 680, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}`, padding: "34px 40px 38px", transform: `rotate(1.5deg) translateX(${interpolate(pop(110), [0, 1], [900, 0])}px)` }}>
          {step ? (
            <div style={{ opacity: stepIn, transform: `translateY(${(1 - stepIn) * 24}px)` }}>
              <p style={chip(24)}>Step {step.n}</p>
              <p style={{ margin: "18px 0 10px", fontFamily: disp, fontWeight: 900, fontSize: 76, lineHeight: 1, color: C.ink }}>{step.name}</p>
              <p style={{ margin: 0, fontSize: 34, lineHeight: 1.35, color: C.ink }}>{step.text}</p>
            </div>
          ) : (
            <div>
              <p style={chip(24)}>Now showing</p>
              <p style={{ margin: "18px 0 0", fontSize: 36, lineHeight: 1.35, color: C.ink }}>Ash got cremated. He lives in an urn now, and he keeps the fire going.</p>
            </div>
          )}
          {/* the fee monitor, as on the site */}
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: `3px dashed ${C.ink}` }}>
            <p style={{ margin: 0, fontFamily: mono, fontSize: 20, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Fee monitor · next: {nextName}</p>
            <p style={{ margin: "6px 0 10px", fontFamily: mono, fontWeight: 700, fontSize: 52, color: C.ink }}>
              {escrow.toFixed(4)} <span style={{ fontSize: 30, color: C.muted }}>/ {target} ETH</span>
            </p>
            <div style={{ height: 26, border: `4px solid ${C.ink}`, background: C.paper }}>
              <div style={{ height: "100%", width: `${(escrow / target) * 100}%`, background: C.ember, borderRight: escrow > 0 ? `4px solid ${C.ink}` : undefined }} />
            </div>
          </div>
        </div>

        {frame >= 640 && frame < 760 ? (
          <div style={{ position: "absolute", right: 190, bottom: 70, transform: `scale(${pop(640)})`, transformOrigin: "100% 100%" }}>
            <p style={chip(30, C.gold)}>Treasury +0.01 ETH</p>
          </div>
        ) : null}
      </div>

      <Drape side="l" open={open} width={1000} height={1080} />
      <Drape side="r" open={open} width={1000} height={1080} />
      <Valance width={1920} />

      {/* the close: the mark, the ticker, the site */}
      {outro > 0 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26 }}>
          <div style={{ transform: `scale(${pop(810)})` }}>
            <SmokingSkull size={420} t={(frame % 60) / 60} puffs />
          </div>
          <p style={{ margin: 0, fontFamily: disp, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.paper2, opacity: outro, textShadow: `6px 6px 0 ${C.ink}` }}>{TICKER}</p>
          <p style={{ ...chip(34, C.flame), opacity: outro }}>{SITE} · live fee monitor</p>
        </AbsoluteFill>
      ) : null}

      <p style={{ position: "absolute", left: 170, bottom: 22, margin: 0, fontFamily: mono, fontSize: 18, color: C.ink, opacity: 0.6 * scene }}>illustration of the cycle · amounts are the step sizes</p>
    </AbsoluteFill>
  );
};
