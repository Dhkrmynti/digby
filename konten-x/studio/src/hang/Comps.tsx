import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TAGLINE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, Hammock, Hanger, TROOP, Toucan, Trunk, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const sky = { background: C.sky } as const;

/** Embers rising from a fire at (x, y); each wraps once per loop, so a loop stays seamless. */
function Embers({ t, x, y, spread, rise, n = 10 }: { t: number; x: number; y: number; spread: number; rise: number; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = (t + i / n) % 1;
        const ex = x + ((((i * 37) % 100) / 100) - 0.5) * spread + Math.sin((k + i) * 6.28) * 8;
        return <div key={i} style={{ position: "absolute", left: ex, top: y - k * rise, width: 7, height: 7, borderRadius: "50%", background: i % 3 ? C.fire : C.flame, opacity: Math.sin(k * Math.PI) }} />;
      })}
    </>
  );
}

/* ═════════ X profile picture (1000×1000): a sloth hanging on above the fire, on a leaf-green disc ═════════ */
export const HangLogo: React.FC = () => (
  <AbsoluteFill style={{ ...sky, alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 940, height: 940, borderRadius: "50%", background: C.leaf, border: `22px solid ${C.ink}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250, background: C.leafD }} />
      <Bough width={1000} height={58} leaves={6} style={{ left: -40, top: 190 }} />
      <Hanger traits={[0, 1, 0, 0]} width={330} sway={-3} style={{ position: "absolute", left: 300, top: 214 }} />
      <Campfire size={250} flick={0.2} style={{ position: "absolute", left: 345, top: 640 }} />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): the canopy, words in the middle band, clear of the profile picture ═════════ */
export const HangBanner: React.FC = () => (
  <AbsoluteFill style={{ ...sky, overflow: "hidden" }}>
    <Trunk width={150} side="r" />
    <Bough width={1440} height={34} leaves={8} style={{ left: -60, top: 28 }} />
    {[60, 210, 1010].map((x, i) => (
      <Hanger key={x} traits={TROOP[i + 1]} width={96} sway={[-3, 2, -2][i]} style={{ position: "absolute", left: x, top: 44 }} />
    ))}
    <Hammock traits={TROOP[0]} width={170} sway={2} style={{ position: "absolute", left: 1170, top: 44 }} />
    <Toucan width={92} style={{ position: "absolute", right: 140, top: 250 }} />
    <div style={{ position: "absolute", left: 370, top: 120 }}>
      <p style={{ margin: 0, fontFamily: serif, fontWeight: 900, fontSize: 118, lineHeight: 0.95, letterSpacing: "-0.03em", color: C.ink }}>{TAGLINE}</p>
      <p style={{ margin: "18px 0 0", fontFamily: serif, fontWeight: 700, fontSize: 32, color: C.ink }}>Every trade's fee buys {TICKER} and burns it.</p>
      <div style={{ marginTop: 18 }}>
        <p style={chip(22)}>
          {TICKER} · buy &amp; burn · treasury · {SITE}
        </p>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 150, bottom: 0, height: 64, background: C.leafD, borderTop: `5px solid ${C.ink}` }} />
    <Campfire size={150} flick={0.3} style={{ position: "absolute", left: 1080, bottom: 22 }} />
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4 s, seamless): a sloth hanging on over the fire ═════════ */
export const HangLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const a = t * Math.PI * 2;
  return (
    <AbsoluteFill style={{ ...sky, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: C.leafD, borderTop: `5px solid ${C.ink}` }} />
      <Bough width={700} height={40} leaves={5} style={{ left: -50, top: 70 }} />
      <Hanger traits={[0, 1, 0, 0]} width={190} sway={Math.sin(a) * 6} style={{ position: "absolute", left: 205, top: 88 }} />
      <Embers t={t} x={300} y={480} spread={150} rise={110} />
      <Campfire size={200} flick={t * 2} style={{ position: "absolute", left: 200, top: 360 }} />
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30 s): one turn of the cycle, burn then treasury ═════════ */
const STEPS = [
  { at: 150, n: "1", name: "Fees collect", text: `Every ${TICKER} buy and sell on Pons pays a creator fee in ETH. It waits in the Pons fee escrow.` },
  { at: 330, n: "2", name: "Burn", text: `At 0.01 ETH the engine claims it, buys ${TICKER} with all of it, and throws every token on the fire: the dead address.` },
  { at: 540, n: "3", name: "Treasury", text: "The next 0.02 ETH goes to the treasury wallet, for the tree's upkeep." },
  { at: 690, n: "4", name: "Then again", text: `Burn, treasury, burn. Nobody is paid to hang on. There is just less ${TICKER} after every burn.` },
];

export const HangDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 130 } });
  const t = frame / 60;

  const step = [...STEPS].reverse().find((s) => frame >= s.at);
  const stepIn = step ? pop(step.at) : 0;

  const burnFill = interpolate(frame, [170, 310], [0, 0.01], clamp);
  const treasFill = interpolate(frame, [560, 640], [0, 0.02], clamp);
  const target = frame < 540 ? 0.01 : 0.02;
  const escrow = frame < 345 ? burnFill : frame < 540 ? 0 : frame < 655 ? treasFill : 0;
  const nextName = frame < 540 ? "burn" : "treasury";

  const burnT = interpolate(frame, [360, 470], [0, 1], clamp);
  const blaze = interpolate(frame, [360, 410, 480, 530], [1, 1.45, 1.45, 1], clamp);
  const coinT = interpolate(frame, [655, 690], [0, 1], { ...clamp, easing: ease });
  const outro = interpolate(frame, [800, 840], [0, 1], { ...clamp, easing: ease });
  const scene = 1 - outro;

  return (
    <AbsoluteFill style={{ ...sky, overflow: "hidden", fontFamily: serif }}>
      <Trunk width={150} side="l" />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />

      <div style={{ opacity: scene }}>
        {/* the bough and its sloths, dropping in one by one */}
        <Bough width={980} height={44} leaves={6} style={{ left: 120, top: 120, transform: `scaleX(${interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: ease })})`, transformOrigin: "0 50%" }} />
        {[0, 1, 2, 3].map((i) => {
          const drop = interpolate(pop(30 + i * 8), [0, 1], [-260, 0]);
          return i === 0 ? (
            <Hammock key={i} traits={TROOP[0]} width={230} sway={Math.sin(t * 2 + i) * 2} style={{ position: "absolute", left: 190, top: 142 + drop }} />
          ) : (
            <Hanger key={i} traits={TROOP[i]} width={130} sway={Math.sin(t * 2 + i) * 3} style={{ position: "absolute", left: 340 + i * 200, top: 146 + drop }} />
          );
        })}
        <Toucan width={110} style={{ position: "absolute", left: 140, top: 470 }} />

        {/* the fire at the foot of the tree, and the tokens falling into it */}
        <Embers t={(frame % 90) / 90} x={620} y={820} spread={160} rise={260} n={12} />
        <Campfire size={300} flick={frame / 26} blaze={blaze} style={{ position: "absolute", left: 470, top: 640 }} />
        {Array.from({ length: 9 }, (_, i) => {
          const k = interpolate(burnT, [i * 0.07, i * 0.07 + 0.4], [0, 1], clamp);
          if (k <= 0 || k >= 1) return null;
          const x = interpolate(k, [0, 1], [440 + (i % 3) * 140, 600]);
          const y = interpolate(k, [0, 1], [330, 790], { easing: Easing.in(Easing.quad) });
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${k * 400}deg)`, opacity: 1 - Math.max(0, k - 0.85) / 0.15 }}>
              <p style={chip(26)}>{TICKER}</p>
            </div>
          );
        })}
        {frame >= 410 && frame < 540 ? (
          <div style={{ position: "absolute", left: 800, top: 820, opacity: interpolate(frame, [410, 425, 520, 540], [0, 1, 1, 0], clamp), transform: `scale(${pop(410)})` }}>
            <p style={chip(26, C.paper2)}>burned → 0x…dEaD</p>
          </div>
        ) : null}
        {coinT > 0 && coinT < 1 ? (
          <div style={{ position: "absolute", left: interpolate(coinT, [0, 1], [1260, 1560]), top: interpolate(coinT, [0, 1], [930, 950]) - Math.sin(coinT * Math.PI) * 120, width: 46, height: 46, borderRadius: "50%", background: C.mango, border: `4px solid ${C.ink}` }} />
        ) : null}

        {/* the field card: what is happening now, and the fee monitor */}
        <div style={{ position: "absolute", right: 110, top: 300, width: 680, background: C.paper2, border: `4px solid ${C.ink}`, boxShadow: `12px 12px 0 ${C.ink}`, padding: "32px 38px 36px", transform: `rotate(-1.2deg) translateX(${interpolate(pop(110), [0, 1], [900, 0])}px)` }}>
          {step ? (
            <div style={{ opacity: stepIn, transform: `translateY(${(1 - stepIn) * 24}px)` }}>
              <p style={chip(22)}>Step {step.n}</p>
              <p style={{ margin: "16px 0 10px", fontWeight: 900, fontSize: 74, lineHeight: 1, color: C.ink }}>{step.name}</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 32, lineHeight: 1.35, color: C.ink }}>{step.text}</p>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 80, lineHeight: 0.95, color: C.ink }}>{TAGLINE}</p>
              <p style={{ margin: "16px 0 0", fontWeight: 700, fontSize: 32, lineHeight: 1.35, color: C.ink }}>The sloths just hang on. Nobody here is paid.</p>
            </div>
          )}
          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `3px dashed ${C.ink}` }}>
            <p style={{ margin: 0, fontFamily: type, fontSize: 21, textTransform: "uppercase", color: C.muted }}>Fee monitor · next: {nextName}</p>
            <p style={{ margin: "6px 0 10px", fontFamily: type, fontWeight: 700, fontSize: 50, color: C.ink }}>
              {escrow.toFixed(4)} <span style={{ fontSize: 30, color: C.muted }}>/ {target} ETH</span>
            </p>
            <div style={{ height: 24, border: `3px solid ${C.ink}`, background: C.paper }}>
              <div style={{ height: "100%", width: `${(escrow / target) * 100}%`, background: C.mango, borderRight: escrow > 0 ? `3px solid ${C.ink}` : undefined }} />
            </div>
          </div>
        </div>

        {frame >= 640 && frame < 760 ? (
          <div style={{ position: "absolute", right: 120, bottom: 64, transform: `scale(${pop(640)})`, transformOrigin: "100% 100%" }}>
            <p style={chip(28)}>Treasury +0.02 ETH</p>
          </div>
        ) : null}
      </div>

      {/* the close: the sloth over the fire, the ticker, the site */}
      {outro > 0 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 520, height: 560, transform: `scale(${pop(810)})` }}>
            <Bough width={520} height={40} leaves={4} style={{ left: 0, top: 30 }} />
            <Hanger traits={[0, 1, 0, 0]} width={180} sway={Math.sin(t * 2) * 4} style={{ position: "absolute", left: 170, top: 48 }} />
            <Campfire size={190} flick={frame / 26} style={{ position: "absolute", left: 165, top: 330 }} />
          </div>
          <p style={{ margin: "-10px 0 0", fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.ink, opacity: outro }}>{TICKER}</p>
          <p style={{ ...chip(32), marginTop: 18, opacity: outro }}>{SITE} · live fee monitor</p>
        </AbsoluteFill>
      ) : null}

      <p style={{ position: "absolute", left: 180, bottom: 20, margin: 0, fontFamily: type, fontSize: 18, color: C.paper, opacity: 0.75 * scene }}>illustration of the cycle · amounts are the step sizes</p>
    </AbsoluteFill>
  );
};
