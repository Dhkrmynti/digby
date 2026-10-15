import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TOPS } from "./brand";
import { Capsule, D, Drum, L, Machine, Sticker } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ X profile picture (1000×1000): the mascot capsule, safe inside X's circle crop ═════════ */
export const CapsuLogo: React.FC = () => (
  <AbsoluteFill style={{ background: C.body, alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 760, height: 760, borderRadius: "50%", background: C.interior, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 30px 80px rgba(4,6,50,0.8)" }}>
      <Capsule size={620} top={C.pink} face />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): text held in the middle band, clear of the profile picture ═════════ */
export const CapsuBanner: React.FC = () => (
  <AbsoluteFill style={{ background: C.body, overflow: "hidden" }}>
    <div style={{ position: "absolute", right: -40, top: -110, opacity: 1 }}>
      <Drum size={720} p={0.13} />
    </div>
    <div style={{ position: "absolute", left: 410, top: 96 }}>
      <Sticker rot={-3} pad={30} radius={30}>
        <p style={D(74, C.ink)}>
          One capsule drops.
          <br />
          One holder takes the pot.
        </p>
      </Sticker>
    </div>
    <div style={{ position: "absolute", left: 420, top: 364, background: C.ledBg, borderRadius: 12, padding: "12px 20px" }}>
      <p style={L(26)}>$CAPSU · ROBINHOOD CHAIN · PONS · {SITE.toUpperCase()}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4 s, seamless): the drum turning ═════════ */
export const CapsuLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.body, alignItems: "center", justifyContent: "center" }}>
      <Drum size={520} p={frame / durationInFrames} />
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30 s): one fill of the coin box, start to finish ═════════ */
const STEPS = [
  { at: 150, name: "Coins go in", text: "Every $CAPSU buy and sell on Pons pays a creator fee in ETH. Each one lands in the coin box." },
  { at: 270, name: "The drum is locked", text: "When the box is full, the list of every holder's capsules is written on-chain, with a block that does not exist yet." },
  { at: 390, name: "The crank turns", text: "That block arrives. Its hash, which nobody could know in advance, points at exactly one capsule." },
  { at: 510, name: "One capsule drops", text: "The whole coin box goes to the wallet inside it, in one transaction." },
];

export const CapsuDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 130 } });
  const show = (a: number, b: number) => interpolate(frame, [a, a + 14, b - 12, b], [0, 1, 1, 0], clamp);

  /* opening: the drum and the promise */
  const intro = show(0, 150);
  const drumZoom = interpolate(frame, [112, 150], [1, 5.5], { ...clamp, easing: Easing.in(Easing.quad) });

  /* the four moves */
  const stepIdx = STEPS.reduce((n, s, i) => (frame >= s.at ? i : n), -1);
  const inSteps = frame >= 150 && frame < 630;
  const step = inSteps ? STEPS[stepIdx] : null;
  const local = step ? frame - step.at : 0;
  const stepIn = interpolate(local, [0, 14], [0, 1], { ...clamp, easing: ease });
  const coins = [165, 190, 215, 240];
  const coinY = coins.map((f) => interpolate(frame, [f, f + 16], [0, 1], clamp)).find((v, i) => frame >= coins[i] && v < 1) ?? -1;
  const fill = interpolate(frame, [165, 258], [0.1, 1], clamp);
  const lock = interpolate(frame, [292, 306], [0, 1], { ...clamp, easing: Easing.out(Easing.back(3)) });
  const ring = interpolate(frame, [306, 372], [0, 1], clamp);
  const turn = interpolate(frame, [408, 498], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const drop = frame >= 520 ? interpolate(frame, [520, 548], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : -1;
  const open = interpolate(frame, [550, 566], [0, 1], { ...clamp, easing: ease });
  const stepsOn = interpolate(frame, [150, 164, 618, 630], [0, 1, 1, 0], clamp);

  /* the rules, the proof, the end card */
  const rules = show(630, 730);
  const proof = show(730, 815);
  const end = interpolate(frame, [815, 835], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.body }}>
      {/* opening */}
      {frame < 152 ? (
        <AbsoluteFill style={{ opacity: frame < 112 ? intro : 1 }}>
          <div style={{ position: "absolute", left: 1010, top: 190, transform: `scale(${drumZoom})`, transformOrigin: "50% 50%" }}>
            <Drum size={700} p={(frame / 240) % 1} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 300, opacity: interpolate(frame, [104, 118], [1, 0], clamp), transform: `scale(${interpolate(pop(8), [0, 1], [1.5, 1])})`, transformOrigin: "30% 50%" }}>
            <Sticker rot={-4} pad={44} radius={40}>
              <p style={D(104, C.ink)}>
                One capsule drops.
                <br />
                One holder takes
                <br />
                the whole pot.
              </p>
            </Sticker>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* inside the drum: the four moves */}
      {inSteps ? (
        <AbsoluteFill style={{ background: C.interior, opacity: stepsOn }}>
          <div style={{ position: "absolute", left: 1090, top: 96 }}>
            <Machine w={800} step={stepIdx + 1} fill={fill} coinY={coinY} lock={lock} ring={ring} crank={turn * 720} drum={turn * 360} drop={drop} open={open} />
          </div>
          {step ? (
            <div style={{ position: "absolute", left: 120, top: 250, width: 900, opacity: stepIn, transform: `translateY(${(1 - stepIn) * 30}px)` }}>
              <p style={{ ...D(330, C.coin), lineHeight: 0.82 }}>{stepIdx + 1}</p>
              <p style={{ ...D(92), marginTop: 28 }}>{step.name}</p>
              <p style={{ ...D(40, C.onBody2, 500), lineHeight: 1.4, letterSpacing: 0, marginTop: 22, maxWidth: 860 }}>{step.text}</p>
              {stepIdx === 0 ? (
                <div style={{ display: "inline-block", marginTop: 30, background: C.ledBg, borderRadius: 12, padding: "12px 20px" }}>
                  <p style={L(34)}>THE BOX IS FULL AT 0.02 ETH</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* the rules: coin-yellow field */}
      {frame >= 630 && frame < 730 ? (
        <AbsoluteFill style={{ background: C.coin, opacity: rules }}>
          <p style={{ ...D(84, C.ink), position: "absolute", left: 120, top: 120, whiteSpace: "nowrap" }}>Hold longer. More capsules are yours.</p>
          <div style={{ position: "absolute", left: 120, top: 300, display: "flex", gap: 50, alignItems: "flex-end", background: C.plate, borderRadius: 28, padding: "40px 60px 30px" }}>
            {Array.from({ length: 7 }, (_, d) => {
              const k = pop(650 + d * 5);
              return (
                <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 2), transform: `translateY(${(1 - k) * 40}px)` }}>
                  <div style={{ display: "flex", flexDirection: "column-reverse" }}>
                    {Array.from({ length: d + 1 }, (_, i) => (
                      <Capsule key={i} size={76} top={TOPS[(d + i) % 4]} style={{ marginTop: -10 }} />
                    ))}
                  </div>
                  <p style={{ ...D(54, C.ink), marginTop: 14 }}>×{d + 1}</p>
                  <p style={{ ...D(24, "#454a78", 800), letterSpacing: 0 }}>day {d + 1}{d === 6 ? "+" : ""}</p>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 1180, top: 400, width: 640 }}>
            <p style={D(58, C.ink)}>Sell once and you are out of every draw.</p>
            <p style={{ ...D(36, C.ink, 500), letterSpacing: 0, lineHeight: 1.4, marginTop: 26 }}>Every other fill (0.025 ETH) goes to the till, the project's treasury, on-chain.</p>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* the proof: LED black */}
      {frame >= 730 && frame < 815 ? (
        <AbsoluteFill style={{ background: C.ledBg, opacity: proof }}>
          <p style={{ ...D(112), position: "absolute", left: 120, top: 230, maxWidth: 1500 }}>Nobody steers the crank. Not us either.</p>
          <p style={{ ...L(46), position: "absolute", left: 120, top: 640, maxWidth: 1600, lineHeight: 1.5 }}>THE DRUM IS LOCKED ON-CHAIN BEFORE THE BLOCK THAT PICKS THE CAPSULE EXISTS.</p>
        </AbsoluteFill>
      ) : null}

      {/* end card */}
      {frame >= 815 ? (
        <AbsoluteFill style={{ background: C.body, opacity: end }}>
          <div style={{ position: "absolute", left: 1220, top: 230 }}>
            <Drum size={620} p={((frame - 815) / 240) % 1} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 250, display: "flex", alignItems: "center", gap: 36 }}>
            <Capsule size={200} top={C.pink} face />
            <p style={D(230)}>CAPSU</p>
          </div>
          <p style={{ ...D(84, C.coin), position: "absolute", left: 124, top: 540 }}>Put a capsule in.</p>
          <div style={{ position: "absolute", left: 124, top: 700, background: C.ledBg, borderRadius: 14, padding: "16px 26px" }}>
            <p style={L(38)}>$CAPSU · ROBINHOOD CHAIN · PONS · {SITE.toUpperCase()}</p>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
