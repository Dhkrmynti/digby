import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { B, SITE, TAGLINE } from "./brand";
import { Cottage, M, Pot, S, T } from "./parts";
import { Hex } from "./Hex";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ X profile picture (1000×1000): Hex under the hat, glow behind ═════════ */
export const BrewLogo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 50% 60%, #810100 0%, #630000 45%, #1B1717 85%)" }}>
    <div style={{ position: "absolute", left: 60, top: 70, width: 880 }}>
      <Hex still spoon={false} viewBox="90 -10 320 350" />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): cauldron and Hex on the right ═════════ */
export const BrewBanner: React.FC = () => (
  <AbsoluteFill>
    <Cottage w={1500} h={500} t={2} window={[0.06, 0.1, 160]} floor={0.82} />
    <div style={{ position: "absolute", left: 1090, top: 120, width: 200 }}>
      <Hex still stir={0} viewBox="80 -20 420 680" />
    </div>
    <div style={{ position: "absolute", left: 1225, top: 268 }}>
      <Pot w={240} t={2} heat={0.85} />
    </div>
    <div style={{ position: "absolute", left: 380, top: 130 }}>
      <p style={S(120)}>BREW</p>
      <p style={{ ...S(40, B.cherryText), marginTop: 12 }}>{TAGLINE}</p>
      <p style={{ ...M(19, B.cottonDim), marginTop: 22 }}>$BREW · Robinhood Chain · Pons · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4s, seamless): Hex stirs, the pot boils ═════════ */
export const BrewLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // every motion completes whole cycles inside the loop, so it repeats without a seam
  const p = frame / durationInFrames;
  const t = p * (durationInFrames / fps);
  return (
    <AbsoluteFill>
      <Cottage w={600} h={600} t={t} floor={0.8} />
      <div style={{ position: "absolute", left: 40, top: 150, width: 230 }}>
        <Hex still stir={Math.sin(p * Math.PI * 2 * 2) * 9} viewBox="80 -20 420 680" />
      </div>
      <div style={{ position: "absolute", left: 255, top: 300 }}>
        <Pot w={290} t={t} heat={0.85} />
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30s): one brew, start to finish ═════════ */
const STEPS = [
  { at: 300, name: "Ingredients", text: "Every $BREW buy and sell on Pons pays a creator fee in ETH. Every fee is one more thing in the pot." },
  { at: 375, name: "The cauldron", text: "The fees collect in the Pons fee escrow, filling the cauldron a little with every trade." },
  { at: 450, name: "It boils", text: "At 0.01 ETH the cauldron boils and the bot wakes up." },
  { at: 525, name: "Stir it in", text: "The bot claims the fees and buys $BREW on the Pons curve. Hex stirs. Nobody presses a button." },
  { at: 600, name: "Dissolved", text: "Every $BREW the bot just bought goes to 0x…dEaD. Nothing comes out of the cauldron." },
  { at: 675, name: "Potion for later", text: "Every other cycle, the ETH is bottled for the treasury instead, logged like everything else.", keep: true },
];
const INGREDIENT = (kind: number, size: number) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    {kind === 0 ? (
      <>
        <path d="M6 24 C6 10 34 10 34 24 Z" fill="#c9523a" stroke="#1B1717" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="2.5" fill="#EDEBDD" />
        <rect x="16" y="24" width="8" height="12" rx="3" fill="#EDEBDD" stroke="#1B1717" strokeWidth="2.5" />
      </>
    ) : kind === 1 ? (
      <>
        <circle cx="20" cy="20" r="15" fill="#EDEBDD" stroke="#1B1717" strokeWidth="2.5" />
        <circle cx="22" cy="21" r="7" fill="#c8322e" stroke="#1B1717" strokeWidth="2" />
        <circle cx="23" cy="21" r="3" fill="#1B1717" />
      </>
    ) : (
      <>
        <circle cx="20" cy="20" r="16" fill="#810100" stroke="#1B1717" strokeWidth="2.5" />
        <text x="20" y="26" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="15" fill="#EDEBDD">$B</text>
      </>
    )}
  </svg>
);

export const BrewDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lightsOn = interpolate(frame, [0, 40], [1, 0], clamp);
  const flareAt = (f0: number, s = 1) => Math.max(0, 1 - Math.abs(frame - f0) / 14) * s;
  // ingredients land at these frames
  const lands = [395, 420, 445, 560];
  const flare = Math.max(...lands.map((f) => flareAt(f, 0.6)), flareAt(470, 0.9), flareAt(615, 1.2), flareAt(630, 1));
  const heat = 0.35 + interpolate(frame, [300, 470], [0, 0.45], clamp) + flare * 0.6;
  const boil = 0.3 + interpolate(frame, [300, 470], [0, 0.7], clamp) + flare * 0.5;
  const zoom = interpolate(frame, [0, 90, 290, 700, 760], [1.2, 1, 1, 1.18, 1], { ...clamp, easing: ease });
  const shake = flareAt(615, 1) * Math.sin(frame * 3) * 8;
  const flash = Math.max(flareAt(615, 0.45), flareAt(470, 0.3));

  // the pot sits at (1260, 640); ingredients arc in from the right
  const potX = 1150;
  const potY = 600;
  const potW = 420;
  const throws = lands.map((land, i) => {
    const q = interpolate(frame, [land - 26, land], [0, 1], clamp);
    if (q <= 0 || q >= 1) return null;
    const x0 = 1880;
    const y0 = 380;
    const x1 = potX + potW / 2;
    const y1 = potY + 40;
    return { i, x: interpolate(q, [0, 1], [x0, x1]), y: y0 - Math.sin(q * Math.PI) * 220 + q * (y1 - y0), r: q * -560, kind: i === 3 ? 2 : i % 2 };
  });

  // bottles flying out on the keep step
  const bot = interpolate(frame, [690, 750], [0, 1], clamp);

  const step = [...STEPS].reverse().find((s) => frame >= s.at && frame < 760) || null;
  const stepIn = step ? interpolate(frame - step.at, [0, 12], [0, 1], { ...clamp, easing: ease }) : 0;

  return (
    <AbsoluteFill style={{ background: B.noir }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${shake}px)`, transformOrigin: "66% 70%" }}>
        <Cottage w={1920} h={1080} t={t} window={[0.72, 0.08, 280]} floor={0.78} />
        <div style={{ position: "absolute", left: 870, top: 300, width: 360 }}>
          <Hex still stir={Math.sin(t * Math.PI * 2 * 0.45) * 8} viewBox="80 -20 420 680" />
        </div>
        <div style={{ position: "absolute", left: potX, top: potY }}>
          <Pot w={potW} t={t} heat={heat} boil={boil} />
        </div>
        {throws.map((p) => (p ? <div key={p.i} style={{ position: "absolute", left: p.x - 30, top: p.y - 30, transform: `rotate(${p.r}deg)` }}>{INGREDIENT(p.kind, 60)}</div> : null))}
        {bot > 0 && bot < 1
          ? [0, 1, 2].map((i) => (
              <svg key={i} viewBox="0 0 120 190" width={70} height={110} style={{ position: "absolute", left: potX + potW / 2 - 35 + (i - 1) * 160 * bot - bot * 120, top: potY - 20 - Math.sin(bot * Math.PI) * 300 + bot * 120, transform: `rotate(${(i - 1) * 40 * bot}deg)`, opacity: 1 - bot * 0.5 }}>
                <path d="M44 6 L76 6 L76 60 C108 76 116 130 96 160 C84 180 36 180 24 160 C4 130 12 76 44 60 Z" fill="#EDEBDD" stroke="#1B1717" strokeWidth="5" />
                <path d="M14 120 C40 112 80 128 106 120 L100 160 C84 180 36 180 20 160 Z" fill="#630000" />
              </svg>
            ))
          : null}
        <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 60% 70%, transparent 45%, rgba(5,3,3,0.7) 88%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 66% 70%, rgba(255,190,140,0.9), rgba(200,50,46,0.35) 45%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: B.noir, opacity: lightsOn }} />

      {/* opening */}
      <div style={{ position: "absolute", left: 110, top: 220, width: 780, opacity: interpolate(frame, [50, 80, 270, 295], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [50, 90], [30, 0], { ...clamp, easing: ease })}px` }}>
        <p style={S(132)}>Nothing comes out of</p>
        <p style={{ ...S(132, B.cherryText), marginTop: 10 }}>the cauldron.</p>
        <p style={{ ...T(34), marginTop: 28, opacity: interpolate(frame, [140, 170], [0, 1], clamp) }}>Hex brews all night. Every $BREW trade drops an ingredient in.</p>
      </div>

      {/* the recipe, one page at a time */}
      {step ? (
        <div style={{ position: "absolute", left: 100, top: 250, width: 660, padding: "44px 50px", borderRadius: 10, background: B.cotton, color: B.noir, opacity: stepIn, translate: `0 ${(1 - stepIn) * 24}px`, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {STEPS.map((s) => (
              <span key={s.name} style={{ flex: 1, height: 8, borderRadius: 8, background: frame >= s.at ? (s.keep ? B.noir : B.cherry) : "rgba(27,23,23,0.15)" }} />
            ))}
          </div>
          <p style={{ ...S(80, step.keep ? B.noir : B.cherry), marginTop: 30 }}>{step.name}</p>
          <p style={{ ...T(32, B.noir), marginTop: 18 }}>{step.text}</p>
        </div>
      ) : null}

      {/* end card */}
      <div style={{ position: "absolute", left: 110, top: 260, opacity: interpolate(frame, [770, 800], [0, 1], clamp) }}>
        <p style={S(170)}>BREW</p>
        <p style={{ ...S(76, B.cherryText), marginTop: 18 }}>Stir it in.</p>
        <p style={{ ...M(30, B.cottonDim), marginTop: 30 }}>$BREW · Robinhood Chain · Pons · {SITE}</p>
      </div>
    </AbsoluteFill>
  );
};
