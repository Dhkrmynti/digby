import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, heavy, mono, P, SITE, TAGLINE } from "./brand";
import { Circle, Night } from "./circle";
import { Pyre } from "./Pyre";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const H = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: heavy, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color, margin: 0 });
const T = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.5, color, margin: 0 });
const M = (size: number, color: string = P.flame): React.CSSProperties => ({ fontFamily: mono, fontSize: size, color, margin: 0 });

/* ═════════ X profile picture (1000×1000): Pyre by the fire ═════════ */
export const CircleLogo: React.FC = () => (
  <AbsoluteFill>
    <Night w={1000} h={1000} t={3} hz={0.78} moon={null} glow={1.6} />
    <AbsoluteFill style={{ background: "radial-gradient(60% 55% at 30% 72%, rgba(255,120,40,0.45), transparent 70%)" }} />
    <div style={{ position: "absolute", left: 60, top: 90, width: 900 }}>
      <Pyre still body="bust" hold="torch" outfit="fur" flame={1} viewBox="60 40 440 440" className="" />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): the circle on the right, words in the middle ═════════ */
export const CircleBanner: React.FC = () => (
  <AbsoluteFill>
    <Night w={1500} h={500} t={4} hz={0.62} moon={[0.6, 0.12]} />
    <Circle w={1500} h={500} t={4.6} cx={1270} cy={390} rx={185} ry={44} ape={104} fire={130} heat={0.9} n={6} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 0%, rgba(7,6,15,0.4) 25%, rgba(7,6,15,0.3) 60%, transparent 78%)" }} />
    <div style={{ position: "absolute", left: 360, top: 130 }}>
      <p style={H(92)}>APE PYRE</p>
      <p style={{ ...H(34, P.fire), marginTop: 16 }}>{TAGLINE}</p>
      <p style={{ ...M(18, P.boneDim), marginTop: 22 }}>$APEPYRE · Robinhood Chain · Pons · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 6s, seamless): the troop goes round once ═════════ */
export const CircleLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const lap = fps / durationInFrames; // exactly one lap per loop
  return (
    <AbsoluteFill>
      <Night w={600} h={600} t={t} hz={0.6} moon={[0.78, 0.14]} />
      <Circle w={600} h={600} t={t} cx={300} cy={440} rx={210} ry={56} ape={120} fire={160} heat={0.9} n={6} lap={lap} uniform />
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30s): one cycle, told by the circle ═════════ */
const STEPS = [
  { at: 300, name: "Kindling", text: "Every $APEPYRE buy and sell on Pons pays a creator fee in ETH. Every fee is a stick for the fire." },
  { at: 375, name: "The woodpile", text: "The sticks pile up in the Pons fee escrow, right by the fire." },
  { at: 450, name: "It catches", text: "At 0.01 ETH the pile catches and the troop goes wild." },
  { at: 525, name: "Feed the fire", text: "The bot claims the fees and buys $APEPYRE on the Pons curve. Nobody has to do anything." },
  { at: 600, name: "Into the fire", text: "On burn cycles, every $APEPYRE it bought goes to 0x…dEaD. Ash does not come back." },
  { at: 675, name: "Bananas for later", text: "Every other cycle, the ETH goes to the treasury, logged in the open.", banana: true },
];

export const CircleDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = 1920;
  const Hh = 1080;

  // the strike at the start, then flares on the ritual's beats
  const ignite = interpolate(frame, [20, 70], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flareAt = (f0: number, size = 1) => Math.max(0, 1 - Math.abs(frame - f0) / 14) * size;
  const flare = Math.max(flareAt(470, 0.6), flareAt(568, 0.9), flareAt(612, 1), flareAt(626, 0.9));
  const heat = 0.15 + ignite * 0.7 + flare * 0.6;
  const flash = Math.max(interpolate(frame, [26, 32, 60], [0, 0.7, 0], clamp), flareAt(612, 0.45));

  // camera: wide at the start, closing in through the ritual, back out for the end card
  const zoom = interpolate(frame, [0, 90, 290, 700, 760], [1.3, 1, 1, 1.22, 1], { ...clamp, easing: ease });
  const shake = flareAt(612, 1) * Math.sin(frame * 3) * 8;

  // a coin thrown in on "Feed the fire"
  const coinP = interpolate(frame, [540, 566], [0, 1], clamp);
  const coin = coinP > 0 && coinP < 1 ? { x: interpolate(coinP, [0, 1], [380, 960]), y: 640 - Math.sin(coinP * Math.PI) * 330 + coinP * 40 } : null;
  // bananas flung out on "Bananas for later"
  const banP = interpolate(frame, [680, 740], [0, 1], clamp);

  const step = [...STEPS].reverse().find((s) => frame >= s.at && frame < 760) || null;
  const stepIn = step ? interpolate(frame - step.at, [0, 12], [0, 1], { ...clamp, easing: ease }) : 0;

  return (
    <AbsoluteFill style={{ background: "#07060f" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${shake}px)`, transformOrigin: "50% 66%" }}>
        <Night w={W} h={Hh} t={t} hz={0.6} moon={[0.84, 0.22]} glow={0.5 + ignite * 0.5} />
        <Circle
          w={W}
          h={Hh}
          t={t}
          cx={960}
          cy={720}
          rx={700}
          ry={120}
          ape={260}
          fire={330}
          heat={heat}
          n={8}
          lap={1 / 16}
          front={
            <>
              {coin ? (
                <div style={{ position: "absolute", left: coin.x - 26, top: coin.y - 26, width: 52, height: 52, borderRadius: "50%", background: P.flame, display: "grid", placeItems: "center", fontFamily: heavy, fontSize: 18, color: P.cave, boxShadow: "0 0 24px rgba(255,160,60,0.9)", transform: `rotate(${coinP * 600}deg)` }}>$P</div>
              ) : null}
              {banP > 0 && banP < 1
                ? Array.from({ length: 6 }, (_, i) => {
                    const dx = (i - 2.5) * 120 + banP * 500;
                    const dy = -Math.sin(banP * Math.PI) * 420 - banP * 300;
                    return (
                      <svg key={i} viewBox="0 0 60 40" width={84} height={56} style={{ position: "absolute", left: 930 + dx * banP, top: 560 + dy, transform: `rotate(${(i - 2.5) * 60 * banP}deg)`, opacity: 1 - banP * 0.6 }}>
                        <path d="M4 8 C8 30 34 40 56 26 C40 30 20 26 12 6 Z" fill="#ffd23d" stroke="#1d1a17" strokeWidth="3" strokeLinejoin="round" />
                      </svg>
                    );
                  })
                : null}
            </>
          }
        />
        <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 70%, transparent 45%, rgba(5,3,2,0.75) 85%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 50% 62%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#0b0806", opacity: interpolate(frame, [0, 30], [1, 0], clamp) }} />

      {/* opening title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: interpolate(frame, [60, 90, 270, 295], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [60, 100], [30, 0], { ...clamp, easing: ease })}px` }}>
        <p style={{ ...H(118), textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
          Everything goes in <span style={{ color: P.fire, textShadow: "0 0 26px rgba(255,90,31,0.6)" }}>the fire.</span>
        </p>
        <p style={{ ...T(34), marginTop: 26, opacity: interpolate(frame, [150, 180], [0, 1], clamp) }}>Pyre found fire first. Now the whole troop dances round it.</p>
      </div>

      {/* the ritual, one step at a time */}
      {step ? (
        <div style={{ position: "absolute", left: 100, top: 300, width: 640, padding: "40px 46px", borderRadius: 26, background: "rgba(11,8,6,0.78)", opacity: stepIn, translate: `0 ${(1 - stepIn) * 24}px` }}>
          <p style={{ ...T(24, P.boneDim), fontWeight: 600 }}>How the troop feeds the fire</p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {STEPS.map((s, i) => (
              <span key={s.name} style={{ flex: 1, height: 8, borderRadius: 8, background: frame >= s.at ? (s.banana ? P.banana : P.fire) : "rgba(244,230,208,0.15)" }} />
            ))}
          </div>
          <p style={{ ...H(72, step.banana ? P.banana : P.bone), marginTop: 30 }}>{step.name}</p>
          <p style={{ ...T(32), marginTop: 18 }}>{step.text}</p>
        </div>
      ) : null}

      {/* end card */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", opacity: interpolate(frame, [770, 800], [0, 1], clamp) }}>
        <p style={{ ...H(140), textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>APE PYRE</p>
        <p style={{ ...H(56, P.fire), marginTop: 18 }}>Throw it in.</p>
        <p style={{ ...M(30, P.bone), marginTop: 30 }}>$APEPYRE · Robinhood Chain · Pons · {SITE}</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Status video (1080×1350, 22s): real on-chain readings ═════════ */
export type StatusProps = {
  asOf: string;
  burned: number;
  burnedPct: number;
  burnTx: string;
  burnSpentEth: number;
  keepEth: number;
  buys: number;
  sells: number;
  holders: number;
  nextAt: number;
  ca: string;
};

const fmtN = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export const CircleStatus: React.FC<StatusProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = 1080;
  const Hh = 1350;
  const sceneOp = (a: number, b: number) => interpolate(frame, [a, a + 12, b - 12, b], [0, 1, 1, 0], clamp);
  const rise = (a: number) => `0 ${interpolate(frame - a, [0, 18], [30, 0], { ...clamp, easing: ease })}px`;

  // the fire flares as the burn total lands
  const count = interpolate(frame, [150, 240], [0, p.burned], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flare = Math.max(0, 1 - Math.abs(frame - 240) / 18);
  const heat = interpolate(frame, [10, 60], [0.1, 0.8], clamp) + flare * 0.7;
  const flash = Math.max(interpolate(frame, [14, 20, 50], [0, 0.6, 0], clamp), flare * 0.4);

  const card: React.CSSProperties = { position: "absolute", left: 70, right: 70, padding: "40px 46px", borderRadius: 28, background: "rgba(11,8,6,0.8)" };
  const row = (k: string, v: React.ReactNode, color: string = P.bone) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "18px 0", borderBottom: "1px solid rgba(244,230,208,0.12)" }}>
      <span style={T(30, P.boneDim)}>{k}</span>
      <span style={{ ...M(34, color) }}>{v}</span>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#07060f" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 660], [1.15, 1.32], clamp)})`, transformOrigin: "50% 75%" }}>
        <Night w={W} h={Hh} t={t} hz={0.7} moon={[0.8, 0.36]} glow={0.6 + flare * 0.4} />
        <Circle w={W} h={Hh} t={t} cx={540} cy={1120} rx={430} ry={90} ape={190} fire={250} heat={heat} n={7} lap={1 / 14} />
        <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 80%, transparent 40%, rgba(5,3,2,0.8) 85%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 80%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#0b0806", opacity: interpolate(frame, [0, 18], [1, 0], clamp) }} />

      {/* 1 · title */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 120, opacity: sceneOp(20, 150), translate: rise(20) }}>
        <p style={M(26, P.flame)}>day 1 report · {p.asOf}</p>
        <p style={{ ...H(118), marginTop: 22 }}>The fire</p>
        <p style={{ ...H(118, P.fire) }}>is lit.</p>
        <p style={{ ...T(34), marginTop: 26, maxWidth: 820 }}>$APEPYRE launched on Pons. The bot has already run twice.</p>
      </div>

      {/* 2 · the burn */}
      <div style={{ ...card, top: 150, opacity: sceneOp(140, 330), translate: rise(140) }}>
        <p style={T(30, P.boneDim)}>in the fire so far</p>
        <p style={{ ...H(112, P.flame), marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{fmtN(count)}</p>
        <p style={{ ...T(36), marginTop: 10 }}>$APEPYRE · {p.burnedPct.toFixed(2)}% of supply</p>
        <p style={{ ...M(24, P.boneDim), marginTop: 22 }}>sent to 0x…dEaD · tx {p.burnTx.slice(0, 10)}…{p.burnTx.slice(-6)}</p>
      </div>

      {/* 3 · the two cycles */}
      <div style={{ ...card, top: 130, opacity: sceneOp(320, 490), translate: rise(320) }}>
        <p style={{ ...H(64) }}>The log</p>
        <div style={{ marginTop: 20 }}>
          {row("#1 into the fire", `${p.burnSpentEth.toFixed(4)} ETH → ${fmtN(p.burned)}`, P.flame)}
          {row("#2 bananas for later", `${p.keepEth.toFixed(4)} ETH → treasury`, P.banana)}
        </div>
        <p style={{ ...T(28, P.boneDim), marginTop: 22 }}>Burn, keep, burn, keep. Every cycle on-chain.</p>
      </div>

      {/* 4 · the troop */}
      <div style={{ ...card, top: 150, opacity: sceneOp(480, 590), translate: rise(480) }}>
        <p style={{ ...H(64) }}>The troop</p>
        <div style={{ marginTop: 20 }}>
          {row("holders", fmtN(p.holders))}
          {row("buys", fmtN(p.buys))}
          {row("sells", fmtN(p.sells))}
        </div>
      </div>

      {/* 5 · next */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 130, opacity: interpolate(frame, [580, 600], [0, 1], clamp), translate: rise(580) }}>
        <p style={{ ...H(96) }}>Next burn at</p>
        <p style={{ ...H(96, P.fire) }}>{p.nextAt} ETH.</p>
        <div style={{ marginTop: 40, padding: "22px 30px", borderRadius: 20, background: "rgba(11,8,6,0.85)" }}>
          <p style={T(22, P.boneDim)}>CA</p>
          <p style={{ ...M(27, P.bone), marginTop: 6 }}>{p.ca}</p>
        </div>
        <p style={{ ...M(30, P.flame), marginTop: 28 }}>apepyre.fun · @apepyre</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Update video (1080×1350, 21s): the burns stack up ═════════ */
export type UpdateProps = {
  asOf: string;
  minutesIn: number;
  burns: { amount: number; tx: string }[];
  cycles: ("burn" | "keep")[];
  next: "burn" | "keep";
  nextAt: number;
  escrow: number;
  holders: number;
  buys: number;
  sells: number;
  ca: string;
};

export const CircleUpdate: React.FC<UpdateProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = 1080;
  const Hh = 1350;
  const sceneOp = (a: number, b: number) => interpolate(frame, [a, a + 12, b - 12, b], [0, 1, 1, 0], clamp);
  const rise = (a: number) => `0 ${interpolate(frame - a, [0, 18], [30, 0], { ...clamp, easing: ease })}px`;

  // one coin per burn, each one lands and the counter jumps
  const tossAt = p.burns.map((_, i) => 140 + i * 75);
  const landAt = tossAt.map((f) => f + 26);
  let shown = 0;
  p.burns.forEach((b, i) => {
    shown += b.amount * interpolate(frame, [landAt[i], landAt[i] + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  });
  const flare = Math.max(0, ...landAt.map((f) => Math.max(0, 1 - Math.abs(frame - f) / 16)));
  const heat = interpolate(frame, [8, 50], [0.15, 0.8], clamp) + flare * 0.7;
  const flash = Math.max(interpolate(frame, [12, 18, 46], [0, 0.6, 0], clamp), flare * 0.4);
  const coins = tossAt
    .map((f0, i) => {
      const q = interpolate(frame, [f0, f0 + 26], [0, 1], clamp);
      if (q <= 0 || q >= 1) return null;
      const fromX = i % 2 ? 900 : 180;
      return { i, q, x: interpolate(q, [0, 1], [fromX, 540]), y: 1050 - Math.sin(q * Math.PI) * 360 + q * 20 };
    })
    .filter(Boolean) as { i: number; q: number; x: number; y: number }[];

  const card: React.CSSProperties = { position: "absolute", left: 70, right: 70, padding: "40px 46px", borderRadius: 28, background: "rgba(11,8,6,0.82)" };
  const row = (k: string, v: React.ReactNode, color: string = P.bone) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "18px 0", borderBottom: "1px solid rgba(244,230,208,0.12)" }}>
      <span style={T(30, P.boneDim)}>{k}</span>
      <span style={M(34, color)}>{v}</span>
    </div>
  );
  const nextFill = Math.min(1, p.escrow / p.nextAt);

  return (
    <AbsoluteFill style={{ background: "#07060f" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 630], [1.12, 1.3], clamp)})`, transformOrigin: "50% 75%" }}>
        <Night w={W} h={Hh} t={t} hz={0.7} moon={[0.82, 0.5]} glow={0.6 + flare * 0.4} />
        <Circle
          w={W}
          h={Hh}
          t={t}
          cx={540}
          cy={1120}
          rx={430}
          ry={90}
          ape={190}
          fire={250}
          heat={heat}
          n={7}
          lap={1 / 13}
          front={coins.map((c) => (
            <div key={c.i} style={{ position: "absolute", left: c.x - 30, top: c.y - 30, width: 60, height: 60, borderRadius: "50%", background: P.flame, display: "grid", placeItems: "center", fontFamily: heavy, fontSize: 20, color: P.cave, boxShadow: "0 0 26px rgba(255,160,60,0.95)", transform: `rotate(${c.q * 620}deg)` }}>$A</div>
          ))}
        />
        <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 80%, transparent 40%, rgba(5,3,2,0.8) 85%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 80%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "#0b0806", opacity: interpolate(frame, [0, 16], [1, 0], clamp) }} />

      {/* 1 · hook */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 120, opacity: sceneOp(18, 130), translate: rise(18) }}>
        <p style={M(26, P.flame)}>update · {p.asOf}</p>
        <p style={{ ...H(116), marginTop: 22 }}>{p.minutesIn} minutes in.</p>
        <p style={{ ...H(116, P.fire) }}>Still burning.</p>
      </div>

      {/* 2 · the burns stack up */}
      <div style={{ ...card, top: 140, opacity: sceneOp(130, 340), translate: rise(130) }}>
        <p style={T(30, P.boneDim)}>in the fire so far</p>
        <p style={{ ...H(112, P.flame), marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{fmtN(shown)}</p>
        <p style={{ ...T(36), marginTop: 10 }}>$APEPYRE · {((shown / 1e9) * 100).toFixed(2)}% of supply</p>
        <div style={{ marginTop: 24 }}>
          {p.burns.map((b, i) => (
            <p key={b.tx} style={{ ...M(24, frame >= landAt[i] ? P.bone : "rgba(244,230,208,0.25)"), marginTop: 8 }}>
              burn #{i + 1} · {fmtN(b.amount)} · tx {b.tx.slice(0, 8)}…{b.tx.slice(-4)}
            </p>
          ))}
        </div>
      </div>

      {/* 3 · the cycles */}
      <div style={{ ...card, top: 140, opacity: sceneOp(330, 480), translate: rise(330) }}>
        <p style={H(64)}>The cycles</p>
        <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
          {[...p.cycles, "next" as const].map((c, i) => {
            const isNext = c === "next";
            const kind = isNext ? p.next : c;
            const col = kind === "burn" ? P.fire : P.banana;
            return (
              <div key={i} style={{ flex: 1, borderRadius: 18, padding: "20px 14px", textAlign: "center", border: `2px solid ${isNext ? "rgba(244,230,208,0.25)" : col}`, background: isNext ? "transparent" : "rgba(255,90,31,0.08)" }}>
                <p style={M(22, P.boneDim)}>{isNext ? "next" : `#${i + 1}`}</p>
                <p style={{ ...H(32, isNext ? P.bone : col), marginTop: 8 }}>{kind === "burn" ? "burn" : "keep"}</p>
              </div>
            );
          })}
        </div>
        <p style={{ ...T(28, P.boneDim), marginTop: 28 }}>
          Next: {p.next === "burn" ? "into the fire" : "bananas for later"} at {p.nextAt} ETH · the pile is at {Math.round(nextFill * 100)}%
        </p>
        <div style={{ marginTop: 14, height: 14, borderRadius: 14, background: "rgba(244,230,208,0.12)" }}>
          <div style={{ width: `${nextFill * interpolate(frame, [350, 400], [0, 100], clamp)}%`, height: "100%", borderRadius: 14, background: p.next === "burn" ? P.fire : P.banana }} />
        </div>
      </div>

      {/* 4 · the troop */}
      <div style={{ ...card, top: 150, opacity: sceneOp(470, 570), translate: rise(470) }}>
        <p style={H(64)}>The troop</p>
        <div style={{ marginTop: 20 }}>
          {row("holders", fmtN(p.holders))}
          {row("trades", fmtN(p.buys + p.sells))}
          {row("buys · sells", `${fmtN(p.buys)} · ${fmtN(p.sells)}`)}
        </div>
      </div>

      {/* 5 · end */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 140, opacity: interpolate(frame, [560, 580], [0, 1], clamp), translate: rise(560) }}>
        <p style={H(104)}>Throw it in.</p>
        <p style={{ ...T(34), marginTop: 18 }}>Every trade feeds the fire. The bot does the rest.</p>
        <div style={{ marginTop: 36, padding: "22px 30px", borderRadius: 20, background: "rgba(11,8,6,0.85)" }}>
          <p style={T(22, P.boneDim)}>CA</p>
          <p style={{ ...M(27, P.bone), marginTop: 6 }}>{p.ca}</p>
        </div>
        <p style={{ ...M(30, P.flame), marginTop: 28 }}>apepyre.fun · @apepyre</p>
      </div>
    </AbsoluteFill>
  );
};
