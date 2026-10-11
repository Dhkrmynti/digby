import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, heavy, mono, P, SITE } from "./brand";
import { Circle, Night } from "./circle";
import { Pyre } from "./Pyre";
import { Flames, Logs } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const H = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: heavy, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color, margin: 0 });
const T = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.45, color, margin: 0 });
const M = (size: number, color: string = P.bone): React.CSSProperties => ({ fontFamily: mono, fontSize: size, color, margin: 0 });
const fmtN = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export type HookProps = { burns: { amount: number; tx: string }[]; asOf: string; ca: string };

/* ═════════ PNG (1080×1350): the bonfire's receipt ═════════ */
export const PyreReceipt: React.FC<HookProps> = ({ burns, asOf, ca }) => {
  const total = burns.reduce((a, b) => a + b.amount, 0);
  const ink = "#1d1a17";
  const line = (k: string, v: string, bold = false, color = ink) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginTop: 14 }}>
      <span style={{ ...M(26, ink), fontWeight: bold ? 700 : 400 }}>{k}</span>
      <span style={{ ...M(26, color), fontWeight: bold ? 700 : 400 }}>{v}</span>
    </div>
  );
  const dash = <div style={{ borderTop: `3px dashed ${ink}`, opacity: 0.45, margin: "24px 0" }} />;
  // torn edge, top and bottom
  const zig = (flip: boolean) => (
    <svg viewBox="0 0 640 24" width="100%" height="24" preserveAspectRatio="none" style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}>
      <path d={`M0 24 ${Array.from({ length: 33 }, (_, i) => `L${i * 20} ${i % 2 ? 4 : 22}`).join(" ")} L640 24 Z`} fill="#f4ecdc" />
    </svg>
  );
  return (
    <AbsoluteFill>
      <Night w={1080} h={1350} t={2} hz={0.8} moon={[0.82, 0.08]} glow={1.4} />
      <div style={{ position: "absolute", left: -60, right: -60, bottom: -40, height: 520 }}>
        <Flames w={1200} h={520} t={3} heat={1} />
      </div>
      <p style={{ ...H(78), position: "absolute", left: 70, top: 64 }}>The fire sent</p>
      <p style={{ ...H(78, P.fire), position: "absolute", left: 70, top: 146 }}>a receipt.</p>
      <div style={{ position: "absolute", left: 200, top: 280, width: 680, transform: "rotate(-3deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
        {zig(false)}
        <div style={{ background: "#f4ecdc", padding: "34px 44px 30px" }}>
          <p style={{ ...H(46, ink), textAlign: "center" }}>APE PYRE BONFIRE</p>
          <p style={{ ...M(20, "#5a5048"), textAlign: "center", marginTop: 8 }}>open 24/7 · {asOf}</p>
          {dash}
          {burns.map((b, i) => line(`burn #${i + 1}`, `${fmtN(b.amount)} $APEPYRE`))}
          {dash}
          {line("TOTAL IN THE FIRE", fmtN(total), true, "#c8360c")}
          {line("share of supply", `${((total / 1e9) * 100).toFixed(2)}%`)}
          {line("paid with", "trading fees")}
          {line("change", "ash")}
          {line("refunds", "lol")}
          {dash}
          <p style={{ ...M(18, "#5a5048"), textAlign: "center" }}>sent to 0x…dEaD · verify on-chain</p>
          <p style={{ ...M(18, "#5a5048"), textAlign: "center", marginTop: 6 }}>tx {burns[burns.length - 1].tx.slice(0, 12)}…</p>
          <p style={{ ...H(30, ink), textAlign: "center", marginTop: 18 }}>THANK YOU, COME BURN AGAIN</p>
        </div>
        {zig(true)}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={M(24, P.bone)}>CA {ca.slice(0, 10)}…{ca.slice(-6)}</span>
        <span style={M(24, P.flame)}>{SITE}</span>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Video (1080×1350, 13s): POV, your fee goes in the fire ═════════ */
export const HookPOV: React.FC<HookProps> = ({ burns, asOf, ca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const total = burns.reduce((a, b) => a + b.amount, 0);

  // beat sheet (30fps)
  const coinIn = interpolate(frame, [40, 60], [0, 1], { ...clamp, easing: ease }); // coin drops into Pyre's hand
  const throwP = interpolate(frame, [120, 146], [0, 1], clamp); // the toss
  const land = 146;
  const flare = Math.max(0, 1 - Math.abs(frame - land) / 16);
  const heat = 0.55 + flare * 0.9 + interpolate(frame, [land, land + 40], [0, 0.2], clamp);
  const shake = flare * Math.sin(frame * 3.1) * 12;
  const flash = flare * 0.55;
  const count = interpolate(frame, [230, 300], [0, total], { ...clamp, easing: Easing.out(Easing.cubic) });

  // coin path: from the top (your trade) into his hand, then arcing into the fire
  const hand = { x: 990, y: 1150 };
  const fire = { x: 330, y: 930 };
  const coin =
    frame < 40
      ? null
      : throwP <= 0
        ? { x: hand.x, y: interpolate(coinIn, [0, 1], [-80, hand.y]), r: coinIn * 360 }
        : throwP < 1
          ? { x: interpolate(throwP, [0, 1], [hand.x, fire.x]), y: hand.y - Math.sin(throwP * Math.PI) * 420 + throwP * (fire.y - hand.y), r: 360 + throwP * 720 }
          : null;

  return (
    <AbsoluteFill style={{ background: "#07060f", transform: `translateX(${shake}px)` }}>
      <Night w={1080} h={1350} t={t} hz={0.72} moon={[0.12, 0.42]} glow={0.7 + flare * 0.5} />
      {/* the troop in the background, small */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
        <Circle w={1080} h={1350} t={t} cx={540} cy={1000} rx={470} ry={60} ape={110} fire={1} heat={0} n={6} lap={1 / 15} />
      </div>
      {/* the bonfire, big, on the left */}
      <div style={{ position: "absolute", left: fire.x - 220, top: 1010, width: 440 }}>
        <div style={{ position: "absolute", left: -40, bottom: 120, width: 520, height: 640 }}>
          <Flames w={520} h={640} t={t} heat={heat} />
        </div>
        <div style={{ position: "relative" }}>
          <Logs w={440} />
        </div>
      </div>
      {/* Pyre, big, on the right */}
      <div style={{ position: "absolute", left: 560, top: 640, width: 560, transform: `rotate(${interpolate(throwP, [0, 0.3, 1], [0, -8, 2], clamp)}deg)`, transformOrigin: "50% 100%" }}>
        <Pyre still body="bust" hold="none" outfit="fur" viewBox="40 40 440 460" className="" />
      </div>
      {coin ? (
        <div style={{ position: "absolute", left: coin.x - 34, top: coin.y - 34, width: 68, height: 68, borderRadius: "50%", background: P.flame, display: "grid", placeItems: "center", fontFamily: heavy, fontSize: 18, color: P.cave, boxShadow: "0 0 30px rgba(255,160,60,0.95)", transform: `rotate(${coin.r}deg)` }}>fee</div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 30% 75%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 70%, transparent 50%, rgba(5,3,2,0.7) 90%)" }} />

      {/* captions */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [0, 10, 100, 112], [0, 1, 1, 0], clamp) }}>
        <p style={H(86)}>POV: you traded</p>
        <p style={H(86, P.fire)}>$APEPYRE</p>
        <p style={{ ...T(36), marginTop: 22, opacity: interpolate(frame, [50, 64], [0, 1], clamp) }}>Pyre, holding your trading fee:</p>
        <p style={{ ...T(30, P.boneDim), marginTop: 10, opacity: interpolate(frame, [86, 98], [0, 1], clamp) }}>(looks at it. not impressed.)</p>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 130, opacity: interpolate(frame, [150, 162, 220, 232], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [150, 170], [30, 0], { ...clamp, easing: ease })}px` }}>
        <p style={H(110)}>Everything</p>
        <p style={H(110)}>goes in</p>
        <p style={H(110, P.fire)}>the fire.</p>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 120, opacity: interpolate(frame, [228, 242], [0, 1], clamp) }}>
        <p style={T(32, P.boneDim)}>already in the fire · {asOf}</p>
        <p style={{ ...H(112, P.flame), marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{fmtN(count)}</p>
        <p style={{ ...T(36), marginTop: 8 }}>$APEPYRE · {((total / 1e9) * 100).toFixed(2)}% of supply</p>
        <p style={{ ...M(26, P.flame), marginTop: 30, opacity: interpolate(frame, [310, 325], [0, 1], clamp) }}>{SITE} · CA {ca.slice(0, 8)}…{ca.slice(-4)}</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ PNG (1080×1350): Pyre's to-do list ═════════ */
const marker = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const PyreTodo: React.FC<HookProps> = ({ burns, asOf, ca }) => {
  const total = burns.reduce((a, b) => a + b.amount, 0);
  const ink = "#1d2a52";
  const items: { text: string; done: boolean; note?: string }[] = [
    { text: "find fire", done: true },
    { text: "be unimpressed by it", done: true },
    { text: "get the troop dancing", done: true },
    { text: `burn ${(total / 1e6).toFixed(2)}M $APEPYRE`, done: true, note: `${((total / 1e9) * 100).toFixed(2)}% gone` },
    { text: "burn more", done: false, note: "every trade" },
    { text: "sleep", done: false, note: "never" },
  ];
  const box = (done: boolean) => (
    <svg viewBox="0 0 40 40" width="46" height="46" style={{ flexShrink: 0 }}>
      <path d="M5 6 L35 4 L36 35 L4 36 Z" fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      {done ? <path d="M9 20 L18 30 L38 2" fill="none" stroke="#c8360c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
  return (
    <AbsoluteFill>
      <Night w={1080} h={1350} t={5} hz={0.82} moon={[0.84, 0.5]} glow={1.5} />
      <div style={{ position: "absolute", left: -80, right: -80, bottom: -60, height: 460 }}>
        <Flames w={1240} h={460} t={6} heat={0.9} />
      </div>
      {/* the note, pinned with a stick */}
      <div style={{ position: "absolute", left: 120, top: 120, width: 840, transform: "rotate(2deg)", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
        <div style={{ backgroundColor: "#f3e9d0", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 77px, rgba(29,42,82,0.16) 77px 79px), linear-gradient(180deg,#f8f0dc,#ebdfc1)", padding: "60px 60px 54px", borderRadius: 6 }}>
          <p style={{ fontFamily: marker, fontSize: 60, color: ink, margin: 0 }}>pyre's to-do</p>
          <div style={{ marginTop: 26 }}>
            {items.map((it) => (
              <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 22, height: 79 }}>
                {box(it.done)}
                <span style={{ fontFamily: marker, fontSize: 40, color: ink, whiteSpace: "nowrap", textDecoration: it.done ? "line-through" : "none", textDecorationColor: "rgba(200,54,12,0.7)", textDecorationThickness: 4 }}>{it.text}</span>
                {it.note ? <span style={{ fontFamily: marker, fontSize: 28, color: "#c8360c", marginLeft: "auto", whiteSpace: "nowrap", transform: "rotate(-4deg)" }}>{it.note}</span> : null}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", top: -22, width: 26, height: 70, marginLeft: -13, background: "#5a3a22", borderRadius: 8, border: "3px solid #1d1a17", transform: "rotate(-8deg)" }} />
      </div>
      {/* Pyre peeking from the bottom right */}
      <div style={{ position: "absolute", right: -30, bottom: 30, width: 380 }}>
        <Pyre still body="bust" hold="torch" outfit="fur" flame={1} viewBox="60 40 440 460" className="" />
      </div>
      <div style={{ position: "absolute", left: 50, bottom: 50, padding: "18px 24px", borderRadius: 16, background: "rgba(11,8,6,0.82)" }}>
        <p style={M(22, P.boneDim)}>burns read on-chain · {asOf}</p>
        <p style={{ ...M(24, P.bone), marginTop: 8 }}>CA {ca.slice(0, 10)}…{ca.slice(-6)}</p>
        <p style={{ ...M(26, P.flame), marginTop: 8 }}>{SITE} · @apepyre</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Video (1080×1350, 16s): scoop the dip ═════════ */
// an illustrative chart: green climb, then one long red candle
const CANDLES = [
  [60, 52, 64, 50], [52, 46, 55, 44], [46, 40, 48, 38], [40, 44, 46, 37], [44, 36, 46, 34], [36, 30, 38, 28],
  [30, 34, 36, 28], [34, 27, 36, 25], [27, 22, 29, 20],
] as const; // open, close, high, low (lower = higher on screen)

export const ScoopDip: React.FC<HookProps> = ({ ca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const dip = interpolate(frame, [40, 70], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }); // the red candle drops
  const scoopIn = interpolate(frame, [110, 135], [0, 1], { ...clamp, easing: ease });
  const scoopSwing = interpolate(frame, [140, 165, 190], [0, 1, 0.2], clamp);
  const barP = interpolate(frame, [240, 290], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tossP = interpolate(frame, [330, 356], [0, 1], clamp);
  const flare = Math.max(0, 1 - Math.abs(frame - 356) / 16);
  const shake = flare * Math.sin(frame * 3.1) * 10;

  const chartX = 140, chartY = 300, cw = 800, ch = 420;
  const sy = (v: number) => chartY + (v / 100) * ch;
  const cwid = 54, gap = 34;
  const coins = Array.from({ length: 9 }, (_, i) => {
    const q = interpolate(frame, [140 + i * 4, 172 + i * 4], [0, 1], clamp);
    if (q <= 0) return null;
    const x0 = 905 + (i % 3) * 12, y0 = sy(90);
    return { i, x: interpolate(q, [0, 1], [x0, 400 + (i % 3) * 30]), y: interpolate(q, [0, 1], [y0, 1150 - Math.floor(i / 3) * 20]) - Math.sin(q * Math.PI) * 160, q };
  }).filter(Boolean) as { i: number; x: number; y: number; q: number }[];

  return (
    <AbsoluteFill style={{ background: "#07060f", transform: `translateX(${shake}px)` }}>
      <Night w={1080} h={1350} t={t} hz={0.82} moon={[0.82, 0.08]} glow={0.6 + flare * 0.6} />

      {/* scene 1–2: the chart (illustration) */}
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [0, 10, 220, 236], [0, 1, 1, 0], clamp) }}>
        <svg width="1080" height="1350" style={{ position: "absolute", inset: 0 }}>
          <rect x={chartX - 30} y={chartY - 40} width={cw + 60} height={ch + 380} rx="28" fill="rgba(11,8,6,0.78)" />
          {CANDLES.map(([o, c, hi, lo], i) => {
            const x = chartX + i * (cwid + gap);
            const up = c < o;
            return (
              <g key={i}>
                <line x1={x + cwid / 2} x2={x + cwid / 2} y1={sy(hi > lo ? lo : hi) - 4} y2={sy(Math.max(hi, lo)) + 4} stroke={up ? "#3ddc84" : "#ff4d4d"} strokeWidth="4" />
                <rect x={x} y={sy(Math.min(o, c))} width={cwid} height={Math.max(6, Math.abs(sy(o) - sy(c)))} rx="6" fill={up ? "#3ddc84" : "#ff4d4d"} />
              </g>
            );
          })}
          {/* the big red one */}
          {(() => {
            const x = chartX + CANDLES.length * (cwid + gap) - 10;
            const top = sy(22);
            const bot = sy(22 + dip * 68);
            return (
              <g>
                <line x1={x + cwid / 2} x2={x + cwid / 2} y1={top - 10} y2={bot + 16} stroke="#ff4d4d" strokeWidth="5" />
                <rect x={x} y={top} width={cwid + 6} height={Math.max(6, bot - top)} rx="6" fill="#ff4d4d" />
              </g>
            );
          })()}
        </svg>
        <p style={{ ...M(20, P.boneDim), position: "absolute", left: chartX - 10, top: chartY - 30 }}>illustration</p>
        <p style={{ ...H(110, "#ff4d4d"), position: "absolute", left: 70, top: 110, opacity: interpolate(frame, [60, 74, 112, 124], [0, 1, 1, 0], clamp) }}>Red candle?</p>
      </div>

      {/* Pyre with the scoop */}
      <div style={{ position: "absolute", left: 600, top: 760 + (1 - scoopIn) * 600, width: 520 }}>
        <Pyre still body="bust" hold="none" outfit="fur" viewBox="40 40 440 460" className="" />
      </div>
      <svg viewBox="0 0 300 200" width="400" height="266" style={{ position: "absolute", left: 330, top: 1080 + (1 - scoopIn) * 600, transform: `rotate(${10 - scoopSwing * 25}deg)`, transformOrigin: "90% 60%" }}>
        <path d="M270 120 L170 110" stroke="#5a3a22" strokeWidth="18" strokeLinecap="round" />
        <path d="M170 80 Q90 70 40 100 Q30 150 80 160 Q140 168 172 140 Z" fill="#b9b2a6" stroke="#1d1a17" strokeWidth="6" strokeLinejoin="round" />
        <path d="M60 110 Q100 100 150 108" stroke="#fff" strokeWidth="5" opacity="0.5" fill="none" />
      </svg>
      {coins.map((c) => (
        <div key={c.i} style={{ position: "absolute", left: c.x - 24, top: c.y - 24, width: 48, height: 48, borderRadius: "50%", background: P.flame, display: "grid", placeItems: "center", fontFamily: heavy, fontSize: 15, color: P.cave, boxShadow: "0 0 18px rgba(255,160,60,0.9)", opacity: interpolate(frame, [220, 232], [1, 0], clamp) }}>$A</div>
      ))}
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [125, 138, 220, 232], [0, 1, 1, 0], clamp) }}>
        <p style={H(96)}>Pyre sees</p>
        <p style={H(96, P.flame)}>a discount.</p>
      </div>

      {/* scene 3: same ETH, more $APEPYRE */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [232, 246, 318, 330], [0, 1, 1, 0], clamp) }}>
        <p style={H(92)}>Same ETH.</p>
        <p style={H(92, P.flame)}>More $APEPYRE.</p>
        <div style={{ marginTop: 50, padding: "34px 40px", borderRadius: 26, background: "rgba(11,8,6,0.82)", width: 560 }}>
          <p style={T(26, P.boneDim)}>what 0.01 ETH buys (illustration)</p>
          <p style={{ ...M(24, P.bone), marginTop: 22 }}>before the red candle</p>
          <div style={{ marginTop: 10, height: 30, width: `${50 * barP}%`, borderRadius: 10, background: "rgba(244,230,208,0.35)" }} />
          <p style={{ ...M(24, P.flame), marginTop: 22 }}>after the red candle</p>
          <div style={{ marginTop: 10, height: 30, width: `${95 * barP}%`, borderRadius: 10, background: P.flame }} />
        </div>
      </div>

      {/* scene 4: the bot burns more too */}
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [318, 332], [0, 1], clamp) }}>
        <div style={{ position: "absolute", left: 120, top: 1000, width: 420 }}>
          <div style={{ position: "absolute", left: -40, bottom: 110, width: 500, height: 600 }}>
            <Flames w={500} h={600} t={t} heat={0.6 + flare * 0.9} />
          </div>
          <div style={{ position: "relative" }}>
            <Logs w={420} />
          </div>
        </div>
        {tossP > 0 && tossP < 1 ? (
          <div style={{ position: "absolute", left: interpolate(tossP, [0, 1], [820, 330]) - 30, top: 1000 - Math.sin(tossP * Math.PI) * 380 - 30, width: 60, height: 60, borderRadius: "50%", background: P.flame, display: "grid", placeItems: "center", fontFamily: heavy, fontSize: 18, color: P.cave, boxShadow: "0 0 26px rgba(255,160,60,0.95)", transform: `rotate(${tossP * 700}deg)` }}>fee</div>
        ) : null}
        <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [330, 344, 398, 410], [0, 1, 1, 0], clamp) }}>
          <p style={H(80)}>And on a dip,</p>
          <p style={H(80)}>every buyback</p>
          <p style={H(80, P.fire)}>burns more.</p>
          <p style={{ ...T(30, P.boneDim), marginTop: 22 }}>The bot spends the same fees. Lower price, more $APEPYRE into the fire.</p>
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 30% 78%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flare * 0.5, mixBlendMode: "screen" }} />

      {/* end */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [410, 424], [0, 1], clamp) }}>
        <p style={H(118)}>Scoop</p>
        <p style={H(118, P.flame)}>the dip.</p>
        <p style={{ ...H(46, P.fire), marginTop: 20 }}>Everything goes in the fire.</p>
        <div style={{ marginTop: 34, padding: "20px 28px", borderRadius: 18, background: "rgba(11,8,6,0.85)", width: 760 }}>
          <p style={T(20, P.boneDim)}>CA</p>
          <p style={{ ...M(25, P.bone), marginTop: 4 }}>{ca}</p>
        </div>
        <p style={{ ...M(28, P.flame), marginTop: 22 }}>{SITE} · @apepyre</p>
        <p style={{ ...T(22, P.boneDim), marginTop: 14 }}>Not financial advice. Memecoins are risky; only use what you can afford to lose.</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Video (1080×1350, 16s): paper hands are kindling ═════════ */
export type PaperProps = HookProps & { sells: number; nextKind: "burn" | "keep"; nextAt: number };

// a paper cut-out hand, the meme
const PaperHand: React.FC<{ crumple?: number }> = ({ crumple = 0 }) => (
  <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ transform: `scale(${1 - crumple * 0.55}) rotate(${crumple * 160}deg)` }}>
    <path
      d="M60 230 L52 140 L30 112 Q20 98 34 92 Q46 88 58 104 L66 114 L62 40 Q62 26 74 26 Q86 26 86 40 L88 100 L92 22 Q92 8 104 8 Q116 8 116 22 L114 100 L122 32 Q124 18 136 20 Q148 22 146 36 L138 106 L152 58 Q156 46 167 50 Q178 54 174 68 L156 150 L148 230 Z"
      fill="#f4ecdc"
      stroke="#1d1a17"
      strokeWidth="5"
      strokeLinejoin="round"
      style={{ filter: crumple > 0 ? `url(#crumple)` : undefined }}
    />
    <path d="M70 170 L140 162 M74 196 L136 190" stroke="#1d1a17" strokeWidth="3" opacity={0.25 + crumple * 0.5} />
    <text x="100" y="215" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="26" fill="#c8360c">SELL</text>
  </svg>
);

export const PaperHands: React.FC<PaperProps> = ({ burns, asOf, ca, sells, nextKind, nextAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const total = burns.reduce((a, b) => a + b.amount, 0);
  const handIn = interpolate(frame, [10, 34], [0, 1], { ...clamp, easing: ease });
  const crumple = interpolate(frame, [100, 128], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const throwP = interpolate(frame, [150, 178], [0, 1], clamp);
  const land = 178;
  const flare = Math.max(0, 1 - Math.abs(frame - land) / 16);
  const shake = flare * Math.sin(frame * 3.1) * 12;
  const fire = { x: 330, y: 960 };
  const start = { x: 760, y: 560 };
  const pos =
    throwP <= 0
      ? { x: start.x, y: interpolate(handIn, [0, 1], [-260, start.y]) + Math.sin(t * 2) * 10 }
      : { x: interpolate(throwP, [0, 1], [start.x, fire.x]), y: start.y - Math.sin(throwP * Math.PI) * 300 + throwP * (fire.y - start.y) };
  const sellCount = interpolate(frame, [240, 290], [0, sells], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: "#07060f", transform: `translateX(${shake}px)` }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="crumple"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="14" /></filter>
      </svg>
      <Night w={1080} h={1350} t={t} hz={0.74} moon={[0.82, 0.48]} glow={0.7 + flare * 0.5} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.8 }}>
        <Circle w={1080} h={1350} t={t} cx={540} cy={1010} rx={470} ry={60} ape={110} fire={1} heat={0} n={6} lap={1 / 15} />
      </div>
      <div style={{ position: "absolute", left: fire.x - 220, top: 1040, width: 440 }}>
        <div style={{ position: "absolute", left: -40, bottom: 120, width: 520, height: 640 }}>
          <Flames w={520} h={640} t={t} heat={0.55 + flare * 0.95} />
        </div>
        <div style={{ position: "relative" }}>
          <Logs w={440} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 760, width: 520 }}>
        <Pyre still body="bust" hold="none" outfit="fur" viewBox="40 40 440 460" className="" />
      </div>
      {throwP < 1 ? (
        <div style={{ position: "absolute", left: pos.x - 120, top: pos.y - 140, width: 240, height: 280, transform: `rotate(${throwP * 540}deg)` }}>
          <PaperHand crumple={crumple} />
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 30% 76%, rgba(255,200,120,0.9), rgba(255,110,40,0.35) 45%, transparent 75%)", opacity: flare * 0.55, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 70%, transparent 50%, rgba(5,3,2,0.7) 90%)" }} />

      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [14, 26, 140, 150], [0, 1, 1, 0], clamp) }}>
        <p style={H(100)}>Paper hands?</p>
        <p style={{ ...T(36), marginTop: 22, opacity: interpolate(frame, [60, 74], [0, 1], clamp) }}>Every sell pays a fee too.</p>
        <p style={{ ...T(36, P.flame), marginTop: 6, opacity: interpolate(frame, [96, 108], [0, 1], clamp) }}>Pyre has a use for that.</p>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 120, opacity: interpolate(frame, [182, 194, 232, 242], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [182, 200], [30, 0], { ...clamp, easing: ease })}px` }}>
        <p style={H(104)}>Thanks for</p>
        <p style={H(104, P.fire)}>the firewood.</p>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, padding: "40px 46px", borderRadius: 28, background: "rgba(11,8,6,0.82)", opacity: interpolate(frame, [240, 252, 360, 372], [0, 1, 1, 0], clamp) }}>
        <p style={T(28, P.boneDim)}>sells so far · {asOf}</p>
        <p style={{ ...H(120, P.flame), marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{fmtN(sellCount)}</p>
        <p style={{ ...T(32), marginTop: 6 }}>every one of them paid into the woodpile</p>
        <div style={{ borderTop: "1px solid rgba(244,230,208,0.15)", marginTop: 26, paddingTop: 22 }}>
          <p style={M(28, P.bone)}>in the fire: {fmtN(total)} $APEPYRE · {((total / 1e9) * 100).toFixed(2)}%</p>
          <p style={{ ...M(28, P.flame), marginTop: 10 }}>next up: {nextKind === "burn" ? "into the fire" : "bananas for later"} at {nextAt} ETH</p>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 110, opacity: interpolate(frame, [372, 386], [0, 1], clamp) }}>
        <p style={H(104)}>Buy or sell,</p>
        <p style={H(104, P.fire)}>the fire eats.</p>
        <div style={{ marginTop: 34, padding: "20px 28px", borderRadius: 18, background: "rgba(11,8,6,0.85)", width: 760 }}>
          <p style={T(20, P.boneDim)}>CA</p>
          <p style={{ ...M(25, P.bone), marginTop: 4 }}>{ca}</p>
        </div>
        <p style={{ ...M(28, P.flame), marginTop: 22 }}>{SITE} · @apepyre</p>
        <p style={{ ...T(22, P.boneDim), marginTop: 14 }}>Not financial advice.</p>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ PNG (1080×1350): new on the site, the fees in the open ═════════ */
export type FeesProps = { asOf: string; pile: number; target: number; next: "burn" | "keep"; claimed: number; kept: number; cycles: number };

export const PyreFees: React.FC<FeesProps> = ({ asOf, pile, target, next, claimed, kept, cycles }) => {
  const fire = claimed - kept;
  const fill = Math.min(1, pile / target);
  const share = claimed > 0 ? fire / claimed : 0;
  const e = (n: number) => `${n.toFixed(4)} ETH`;
  const panel: React.CSSProperties = { padding: "34px 40px", borderRadius: 26, background: "rgba(11,8,6,0.86)", border: "1.5px solid rgba(244,230,208,0.12)" };
  return (
    <AbsoluteFill>
      <Night w={1080} h={1350} t={4} hz={0.86} moon={[0.82, 0.07]} glow={1.4} />
      <div style={{ position: "absolute", left: -80, right: -80, bottom: -70, height: 380 }}>
        <Flames w={1240} h={380} t={5} heat={0.85} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 70 }}>
        <p style={{ ...M(24, P.cave), display: "inline-block", background: P.flame, padding: "8px 16px", borderRadius: 10, fontWeight: 700 }}>NEW on apepyre.fun</p>
        <p style={{ ...H(100), marginTop: 24 }}>Watch the</p>
        <p style={H(100, P.fire)}>woodpile grow.</p>
        <p style={{ ...T(32), marginTop: 18, maxWidth: 900 }}>Every fee, live on the site: what's on the pile right now, and where every claimed fee went.</p>
      </div>

      <div style={{ ...panel, position: "absolute", left: 70, right: 70, top: 560 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={T(28, P.bone)}>
            on the pile · next: <span style={{ color: next === "burn" ? P.flame : P.banana }}>{next === "burn" ? "into the fire" : "bananas for later"}</span>
          </span>
          <span style={M(28, P.flame)}>{Math.round(fill * 100)}%</span>
        </div>
        <div style={{ marginTop: 18, height: 26, borderRadius: 26, background: "rgba(244,230,208,0.1)", overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 26, background: "linear-gradient(90deg,#e2430e,#ffb347)" }} />
        </div>
        <p style={{ ...M(26, P.bone), marginTop: 14 }}>{e(pile)} / {target} ETH</p>
      </div>

      <div style={{ ...panel, position: "absolute", left: 70, right: 70, top: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={T(28, P.bone)}>all fees claimed by the bot</span>
          <span style={H(48)}>{e(claimed)}</span>
        </div>
        <div style={{ marginTop: 18, height: 26, borderRadius: 26, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${share * 100}%`, background: P.fire }} />
          <div style={{ width: `${(1 - share) * 100}%`, background: P.banana }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
          <div>
            <p style={T(24, P.flame)}>🔥 into the fire</p>
            <p style={{ ...M(30, P.bone), marginTop: 6 }}>{e(fire)}</p>
          </div>
          <div>
            <p style={T(24, P.banana)}>🍌 bananas for later</p>
            <p style={{ ...M(30, P.bone), marginTop: 6 }}>{e(kept)}</p>
          </div>
          <div>
            <p style={T(24, P.boneDim)}>cycles</p>
            <p style={{ ...M(30, P.bone), marginTop: 6 }}>{cycles}</p>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 70, right: 70, bottom: 54, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={M(22, P.boneDim)}>live readings · {asOf}</span>
        <span style={M(26, P.flame)}>apepyre.fun/#fees</span>
      </div>
    </AbsoluteFill>
  );
};
