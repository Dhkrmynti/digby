/**
 * The first burn of $TOMB, as a post (PNG) and a clip (video). Every figure comes in through props,
 * read off the engine and checked on chain; amounts are cut, never rounded up.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, body, display, mono } from "./brand";
import { Brazier, Mask, TombBlock, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type BurnProps = { round: number; burned: number; eth: number; pct: number; burnTx: string; when: string; next: string };

export const FIRST_BURN: BurnProps = {
  round: 1,
  burned: 4724956.757,
  eth: 0.012997876,
  pct: 0.4724,
  burnTx: "0x1947629212d01fd7eace61792f6a25dedf0d6684b129e8517714fd49ddbf0387",
  when: "15 Oct 2026 · 10:33 UTC",
  next: "next: 0.02 ETH → treasury",
};

const cut = (n: number, dp: number) => (Math.floor(n * 10 ** dp) / 10 ** dp).toFixed(dp);
const whole = (n: number) => Math.floor(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 10)}…${h.slice(-6)}`;

const tombWall = {
  background: C.tomb,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, rgba(0,0,0,0.45) 58px 62px), repeating-linear-gradient(90deg, transparent 0 118px, rgba(0,0,0,0.35) 118px 122px)`,
} as const;

function Embers({ t, x, y, spread, rise, n = 14 }: { t: number; x: number; y: number; spread: number; rise: number; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = (t + i / n) % 1;
        const ex = x + ((((i * 37) % 100) / 100) - 0.5) * spread + Math.sin((k + i) * 6.28) * 10;
        return <div key={i} style={{ position: "absolute", left: ex, top: y - k * rise, width: 9, height: 9, background: i % 3 ? C.ochreLit : C.flame, opacity: Math.sin(k * Math.PI) }} />;
      })}
    </>
  );
}

/** The inscription: the burn carved as a record, with its proof. */
function Record({ p, show = 1 }: { p: BurnProps; show?: number }) {
  return (
    <div style={{ background: C.stoneHi, border: `6px solid ${C.soot}`, boxShadow: `14px 14px 0 rgba(0,0,0,0.45)`, padding: "30px 36px", width: 900, opacity: show, transform: `translateY(${(1 - show) * 40}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontWeight: 600, fontSize: 24, color: C.sootSoft, textTransform: "uppercase" }}>
        <span>Burn #{p.round} · sink run</span>
        <span>{p.when}</span>
      </div>
      <p style={{ margin: "18px 0 0", fontFamily: display, fontSize: 104, lineHeight: 1, color: C.ochre }}>{whole(p.burned)}</p>
      <p style={{ margin: "6px 0 0", fontFamily: display, fontSize: 40, color: C.soot }}>{TICKER} into the brazier</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 26, borderTop: `4px solid ${C.soot}`, paddingTop: 20, fontFamily: mono, color: C.soot }}>
        <div>
          <div style={{ fontSize: 20, color: C.sootSoft }}>FEES SPENT</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{cut(p.eth, 4)} ETH</div>
        </div>
        <div>
          <div style={{ fontSize: 20, color: C.sootSoft }}>OF SUPPLY</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{cut(p.pct, 2)}%</div>
        </div>
        <div>
          <div style={{ fontSize: 20, color: C.sootSoft }}>SENT TO</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>0x…dEaD</div>
        </div>
      </div>
      <p style={{ margin: "20px 0 0", fontFamily: mono, fontSize: 22, color: C.sootSoft }}>proof: {short(p.burnTx)}</p>
    </div>
  );
}

/* ═════════ PNG (1080×1350): the first burn, inscribed ═════════ */
export const TombBurnPost: React.FC<BurnProps> = (p) => (
  <AbsoluteFill style={{ ...tombWall, overflow: "hidden", fontFamily: body }}>
    <div style={{ position: "absolute", left: "50%", top: 1060, width: 1300, height: 1300, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,0.32), transparent 60%)` }} />
    <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "center", gap: 26 }}>
      <Mask size={130} bg={C.ochre} />
      <div>
        <p style={chip(26, C.torch, C.soot)}>The brazier is lit</p>
        <p style={{ margin: "14px 0 0", fontFamily: display, fontSize: 70, lineHeight: 1, color: C.dust, textTransform: "uppercase" }}>First burn.</p>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 330 }}>
      <Record p={p} />
    </div>
    <Brazier size={250} t={0.2} blaze={1.15} style={{ position: "absolute", left: 415, top: 870 }} />
    <Embers t={0.35} x={540} y={1030} spread={260} rise={240} />
    <p style={{ position: "absolute", left: 0, right: 0, bottom: 74, margin: 0, textAlign: "center", fontFamily: mono, fontWeight: 600, fontSize: 30, color: C.torch }}>{p.next} · then back to the fire</p>
    <p style={{ position: "absolute", left: 0, right: 0, bottom: 28, margin: 0, textAlign: "center", fontFamily: mono, fontSize: 22, color: C.dustSoft }}>
      {TICKER} · {SITE} · every number is on chain · not financial advice
    </p>
  </AbsoluteFill>
);

/* ═════════ Video (1080×1350, 12 s): offering → brazier → inscription ═════════ */
export const TombBurnClip: React.FC<BurnProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } });

  // 0–60: the offering fills; 60–150: the block drops, the fire flares; 150+: the inscription
  const fill = interpolate(frame, [10, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const drop = interpolate(frame, [80, 118], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flare = interpolate(frame, [118, 130, 200], [1, 1.6, 1.1], clamp);
  const count = interpolate(frame, [150, 210], [0, p.burned], { ...clamp, easing: Easing.out(Easing.cubic) });
  const recordIn = pop(150);
  const fireUp = frame < 150 ? 0 : interpolate(frame, [150, 175], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ ...tombWall, overflow: "hidden", fontFamily: body }}>
      <div style={{ position: "absolute", left: "50%", top: interpolate(fireUp, [0, 1], [880, 1150]), width: 1300, height: 1300, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, rgba(232,169,72,${0.22 + (flare - 1) * 0.35}), transparent 60%)` }} />

      {/* headline */}
      <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "center", gap: 26, opacity: pop(0) }}>
        <Mask size={120} bg={C.ochre} />
        <div>
          <p style={chip(24, C.torch, C.soot)}>{TICKER} · burn #{p.round}</p>
          <p style={{ margin: "12px 0 0", fontFamily: display, fontSize: 64, lineHeight: 1, color: C.dust, textTransform: "uppercase" }}>{frame < 150 ? "The offering is full." : "First burn."}</p>
        </div>
      </div>

      {/* the offering bar */}
      {frame < 150 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 300, opacity: interpolate(frame, [130, 150], [1, 0], clamp) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontWeight: 600, fontSize: 30, color: C.dust }}>
            <span>fee escrow</span>
            <span>{cut(p.eth * fill, 4)} ETH</span>
          </div>
          <div style={{ marginTop: 12, height: 40, border: `6px solid ${C.dust}`, background: C.tombLift }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: C.ochreLit }} />
          </div>
          <p style={{ margin: "14px 0 0", fontFamily: mono, fontSize: 26, color: C.dustSoft }}>{frame > 60 ? `claimed → buy ${TICKER} → into the fire` : "every trade leaves an offering"}</p>
        </div>
      ) : null}

      {/* the block and the brazier */}
      {frame >= 80 && frame < 120 ? <TombBlock size={190} style={{ position: "absolute", left: 445, top: interpolate(drop, [0, 1], [420, 820]), transform: `rotate(${drop * 40}deg)` }} /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(fireUp, [0, 1], [700, 1000]) }}>
        <Brazier size={interpolate(fireUp, [0, 1], [400, 220])} t={frame / 20} blaze={flare} style={{ position: "absolute", left: interpolate(fireUp, [0, 1], [340, 430]), top: 0 }} />
      </div>
      <Embers t={(frame % 50) / 50} x={540} y={interpolate(fireUp, [0, 1], [930, 1140])} spread={280} rise={420} />

      {/* the inscription */}
      {frame >= 150 ? (
        <div style={{ position: "absolute", left: 90, top: 290 }}>
          <Record p={{ ...p, burned: count }} show={recordIn} />
        </div>
      ) : null}

      {/* the close */}
      {frame >= 240 ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 790, textAlign: "center", opacity: pop(240) }}>
          <p style={{ margin: 0, fontFamily: display, fontSize: 40, lineHeight: 1.15, color: C.ochreLit, textTransform: "uppercase" }}>What goes in the tomb stays in the tomb.</p>
          <p style={{ margin: "10px 0 0", fontFamily: mono, fontWeight: 600, fontSize: 28, color: C.torch }}>{p.next}</p>
        </div>
      ) : null}
      <p style={{ position: "absolute", left: 0, right: 0, bottom: 26, margin: 0, textAlign: "center", fontFamily: mono, fontSize: 22, color: C.dustSoft }}>
        {SITE} · every number is on chain · not financial advice
      </p>
    </AbsoluteFill>
  );
};
