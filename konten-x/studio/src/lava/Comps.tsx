/**
 * Lava Pit ($LAVA) X kit: profile picture, banner, a looping GIF and a 30 s demo.
 * Brr, the penguin miner, is the site's own sprite (graveburn/src/components/lava). All original art.
 * The demo shows how the engine works with its real thresholds (0.01 ETH burn, 0.02 ETH chest);
 * it shows no made-up totals.
 */
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TAGLINE, TICKER, body, display, label, mono } from "./brand";
import { BLOCK, BRR, CHEST, MARK, ORE, Pix, Sprite } from "./sprites";
import { Flames, LavaPool, Pit, T_HIT } from "./Pit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (n: number) => Math.abs(Math.sin(n * 78.233 + 1.3) * 12345.678) % 1;

/** "LAVA PIT" in the site's pixel type: lava orange and bone, with a hard block shadow. */
function Title({ size, drop = 1, style }: { size: number; drop?: number; style?: CSSProperties }) {
  const sh = Math.max(4, Math.round(size / 14));
  const letters = "LAVA PIT".split("");
  return (
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 0.9, letterSpacing: size * 0.04, display: "flex", ...style }}>
      {letters.map((c, i) => {
        const k = Math.max(0, Math.min(1, drop * letters.length - i));
        return (
          <span
            key={i}
            style={{
              color: i < 4 ? C.flame : C.star,
              textShadow: `0 ${sh}px 0 #000, ${sh}px ${sh}px 0 #000`,
              width: c === " " ? size * 0.35 : undefined,
              transform: `translateY(${(1 - k) * -size * 1.4}px)`,
              opacity: k > 0 ? 1 : 0,
            }}
          >
            {c === " " ? " " : c}
          </span>
        );
      })}
    </div>
  );
}

function Stars({ n, w, h, t = 0 }: { n: number; w: number; h: number; t?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const s = rnd(i + 5) > 0.8 ? 6 : 4;
        return <div key={i} style={{ position: "absolute", left: rnd(i) * w, top: rnd(i + 40) * h, width: s, height: s, background: C.star, opacity: 0.35 + 0.55 * Math.abs(Math.sin(t * 2 + i)) }} />;
      })}
    </>
  );
}

/** Grass on dirt, the top of the mine. */
function Ground({ top, w, h = 70 }: { top: number; w: number; h?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, top, width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, background: C.dirt }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.28, background: C.grass }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.28, height: 8, backgroundImage: `repeating-linear-gradient(90deg, ${C.grass} 0 16px, transparent 16px 32px)` }} />
    </div>
  );
}

const cave: CSSProperties = {
  background: C.night,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 62px, rgba(0,0,0,0.5) 62px 66px), repeating-linear-gradient(90deg, transparent 0 126px, rgba(0,0,0,0.4) 126px 130px)`,
};

const chip = (fs: number, bg: string, fg: string): CSSProperties => ({ display: "inline-block", fontFamily: label, fontSize: fs, padding: `${fs * 0.35}px ${fs * 0.6}px`, background: bg, color: fg, boxShadow: `${fs * 0.2}px ${fs * 0.2}px 0 #000` });

/* ═════════ X profile picture (1000×1000): Brr's face over the lava, centred for the round crop ═════════ */
export const LavaLogo: React.FC = () => (
  <AbsoluteFill style={{ background: C.night, alignItems: "center", justifyContent: "center" }}>
    <svg width={1000} height={1000} viewBox="0 0 40 40" shapeRendering="crispEdges">
      <rect width={40} height={40} fill={C.sky} />
      <rect y={18} width={40} height={22} fill={C.skyLow} />
      {[3, 9, 31, 36, 6, 34].map((x, i) => (
        <rect key={i} x={x} y={[6, 3, 4, 9, 12, 14][i]} width={1} height={1} fill={C.star} opacity={0.8} />
      ))}
      <LavaPool x0={0} x1={40} y={31} h={9} t={0.3} />
      <Flames x0={0} x1={40} y={31} t={0.35} blaze={0.75} seed={4} />
      <Sprite rows={MARK} x={5} y={4} px={2} />
    </svg>
  </AbsoluteFill>
);

/* ═════════ X banner (1500×500): the title left, the pit right; the avatar corner (bottom left) stays plain ═════════ */
export const LavaBanner: React.FC = () => (
  <AbsoluteFill style={{ background: C.sky, overflow: "hidden" }}>
    <Stars n={40} w={1500} h={180} t={0.4} />
    <div style={{ position: "absolute", left: 1290, top: 34, width: 56, height: 56, background: C.star, boxShadow: "6px 6px 0 rgba(0,0,0,0.35)" }} />
    <Ground top={186} w={1500} h={60} />
    <div style={{ position: "absolute", left: 0, top: 246, width: 1500, height: 254, ...cave }} />
    <div style={{ position: "absolute", left: 640, top: 160, width: 860, height: 340, overflow: "hidden", border: `6px solid #000`, borderRight: 0, borderBottom: 0 }}>
      <div style={{ position: "absolute", left: 0, top: -150 }}>
        <Pit width={860} p={0.56} t={0.4} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 40 }}>
      <Title size={128} />
    </div>
    <p style={{ position: "absolute", left: 84, top: 262, margin: 0, fontFamily: display, fontSize: 40, color: C.star, textShadow: "3px 3px 0 #000" }}>{TAGLINE}</p>
    <div style={{ position: "absolute", right: 30, bottom: 22, ...chip(22, C.flame, C.night) }}>
      {TICKER} · {SITE.toUpperCase()}
    </div>
  </AbsoluteFill>
);

/* ═════════ GIF (600×600, 4 s loop): one throw, one blast ═════════ */
export const LavaLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const p = frame / durationInFrames;
  const t = frame / fps;
  const hit = p >= T_HIT + 0.02 && p < 0.86;
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -70, top: 110 }}>
        <Pit width={740} p={p} t={t} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 24, display: "flex", justifyContent: "center" }}>
        <Title size={76} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 528, textAlign: "center" }}>
        <span style={{ ...chip(26, hit ? C.hot : C.flame, C.night), fontFamily: hit ? mono : label, fontWeight: 700 }}>{hit ? `$LAVA → 0x…dEaD` : "buy it back · drop it in"}</span>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 30 s) ═════════ */

function Scene({ dur, children, style }: { dur: number; children: ReactNode; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o, overflow: "hidden", ...style }}>{children}</AbsoluteFill>;
}

function Caption({ eyebrow, title, top = 70, at = 0 }: { eyebrow: string; title: ReactNode; top?: number; at?: number }) {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 18], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", left: 110, right: 110, top, opacity: k, transform: `translateY(${(1 - k) * 24}px)` }}>
      <p style={{ margin: 0, fontFamily: label, fontSize: 30, color: C.flame, letterSpacing: 2 }}>{eyebrow}</p>
      <p style={{ margin: "14px 0 0", fontFamily: display, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: C.star, textShadow: "5px 5px 0 #000" }}>{title}</p>
    </div>
  );
}

/** 1 · Title: the letters drop, Brr is on the grass. */
function S1() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = interpolate(f, [6, 40], [0, 1], clamp);
  const brr = spring({ frame: f - 30, fps, config: { damping: 11, stiffness: 140 } });
  const sub = interpolate(f, [50, 70], [0, 1], clamp);
  return (
    <Scene dur={150} style={{ background: C.sky }}>
      <Stars n={70} w={1920} h={560} t={f / 30} />
      <div style={{ position: "absolute", left: 1600, top: 90, width: 90, height: 90, background: C.star, boxShadow: "10px 10px 0 rgba(0,0,0,0.35)" }} />
      <Ground top={640} w={1920} h={110} />
      <div style={{ position: "absolute", left: 0, top: 750, width: 1920, height: 330, ...cave }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <Title size={230} drop={drop} />
      </div>
      <p style={{ position: "absolute", left: 0, right: 0, top: 430, margin: 0, textAlign: "center", fontFamily: display, fontSize: 56, color: C.star, textShadow: "4px 4px 0 #000", opacity: sub }}>
        {TAGLINE}
      </p>
      <div style={{ position: "absolute", left: 1440, top: 640 - 180 + (1 - brr) * -700 }}>
        <Pix rows={BRR} px={10} />
      </div>
      <p style={{ position: "absolute", left: 0, right: 0, top: 860, margin: 0, textAlign: "center", fontFamily: body, fontWeight: 500, fontSize: 38, color: C.ash, opacity: interpolate(f, [80, 100], [0, 1], clamp) }}>
        Brr took a wrong turn off an iceberg. Now he works the lava pit.
      </p>
    </Scene>
  );
}

/** A segmented fee bar, like the site's. */
function FeeBar({ fill, width }: { fill: number; width: number }) {
  const cells = 16;
  return (
    <div style={{ display: "flex", gap: 6, padding: 10, width, background: "#000", border: `6px solid ${C.line}` }}>
      {Array.from({ length: cells }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 64, background: fill * cells > i + 0.5 ? C.fuel : C.panel, boxShadow: fill * cells > i + 0.5 ? `inset 0 -10px 0 ${C.fuelInk}` : "none" }} />
      ))}
    </div>
  );
}

/** 2 · Every trade drops ETH ore into the escrow; the bar fills to 0.01 ETH. */
function S2() {
  const f = useCurrentFrame();
  const fill = interpolate(f, [30, 150], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const full = fill >= 1;
  return (
    <Scene dur={180} style={cave}>
      <Caption eyebrow="STEP 1 · TRADING FEES" title={<>Every {TICKER} trade drops ETH ore.</>} />
      {Array.from({ length: 14 }, (_, i) => {
        const at = 22 + i * 9;
        const k = interpolate(f, [at, at + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (k <= 0 || k >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 280 + ((i * 397) % 1300), top: 260 + k * 360, transform: `rotate(${Math.floor(k * 4) * 90}deg)` }}>
            <Pix rows={ORE} px={16} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 260, top: 690 }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: 1400, fontFamily: label, fontSize: 30, color: C.ash, marginBottom: 14 }}>
          <span>FEE ESCROW</span>
          <span style={{ fontFamily: mono, color: full ? C.hot : C.star }}>{(0.01 * fill).toFixed(4)} / 0.01 ETH</span>
        </div>
        <FeeBar fill={fill} width={1400} />
        <p style={{ margin: "26px 0 0", fontFamily: body, fontWeight: 500, fontSize: 36, color: full ? C.hot : C.ash }}>
          {full ? "The bar is full. Brr's shift starts." : "Creator fees pile up in the Pons fee escrow."}
        </p>
      </div>
    </Scene>
  );
}

/** 3 · The throw: claim, buy back, into the lava. */
function S3() {
  const f = useCurrentFrame();
  const p = interpolate(f, [50, 200], [0, 1], clamp);
  const steps = ["CLAIM 0.01 ETH", `BUY ${TICKER}`, "INTO THE LAVA"];
  const stepOn = f < 60 ? 0 : f < 80 ? 1 : 2;
  const gone = p > T_HIT + 0.02;
  const pop = interpolate(f, [125, 140], [0, 1], { ...clamp, easing: ease });
  return (
    <Scene dur={240} style={{ background: "#161210" }}>
      <div style={{ position: "absolute", left: 0, top: -90 }}>
        <Pit width={1920} p={p} t={f / 30} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 260, background: "linear-gradient(#000c, #0000)" }} />
      <Caption eyebrow="STEP 2 · BRR'S SHIFT" title="Brr claims it, buys it back, and throws it in." top={50} />
      <div style={{ position: "absolute", left: 110, top: 250, display: "flex", gap: 22 }}>
        {steps.map((s, i) => (
          <span key={s} style={{ ...chip(30, i <= stepOn ? (i === 2 ? C.lava : C.flame) : C.panel, i <= stepOn ? C.night : C.ash), color: i <= stepOn ? (i === 2 ? C.star : C.night) : C.ash }}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
      {gone ? (
        <div style={{ position: "absolute", right: 120, top: 360, opacity: pop, transform: `scale(${0.8 + pop * 0.2})`, transformOrigin: "right top", textAlign: "right" }}>
          <p style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: 64, color: C.hot, textShadow: "5px 5px 0 #000" }}>{TICKER} → 0x…dEaD</p>
          <p style={{ margin: "8px 0 0", fontFamily: label, fontSize: 30, color: C.star, textShadow: "3px 3px 0 #000" }}>GONE FOR GOOD</p>
        </div>
      ) : null}
    </Scene>
  );
}

/** 4 · The two-step run: odd runs burn, even runs fill the chest. */
function S4() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const runs = [
    { kind: "burn", eth: "0.01" },
    { kind: "chest", eth: "0.02" },
    { kind: "burn", eth: "0.01" },
    { kind: "chest", eth: "0.02" },
  ];
  const on = Math.min(3, Math.floor(Math.max(0, f - 40) / 26));
  return (
    <Scene dur={180} style={cave}>
      <Caption eyebrow="STEP 3 · THE NEXT RUN" title="Every other run fills the chest." />
      <div style={{ position: "absolute", left: 110, right: 110, top: 380, display: "flex", gap: 30, alignItems: "stretch" }}>
        {runs.map((r, i) => {
          const k = spring({ frame: f - 20 - i * 8, fps, config: { damping: 14 } });
          const lit = i === on;
          return (
            <div key={i} style={{ flex: 1, background: lit ? C.panel : "#1a1512", border: `6px solid ${lit ? (r.kind === "burn" ? C.flame : C.block) : C.line}`, padding: "28px 26px", opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
              <p style={{ margin: 0, fontFamily: label, fontSize: 26, color: C.ash }}>RUN {i + 1}</p>
              <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                {r.kind === "burn" ? (
                  <svg width={170} height={140} viewBox="0 0 34 28" shapeRendering="crispEdges">
                    <Flames x0={1} x1={33} y={27} t={f / 30 + i} blaze={lit ? 1.4 : 0.8} seed={i + 2} />
                    <Sprite rows={BLOCK} x={13} y={lit ? 8 : 4} />
                  </svg>
                ) : (
                  <Pix rows={CHEST} px={11} />
                )}
              </div>
              <p style={{ margin: 0, fontFamily: display, fontWeight: 700, fontSize: 46, color: r.kind === "burn" ? C.flame : C.block }}>{r.kind === "burn" ? "BUY + BURN" : "TO THE CHEST"}</p>
              <p style={{ margin: "6px 0 0", fontFamily: mono, fontSize: 30, color: C.star }}>at {r.eth} ETH</p>
            </div>
          );
        })}
      </div>
      <p style={{ position: "absolute", left: 110, right: 110, top: 880, margin: 0, fontFamily: body, fontWeight: 500, fontSize: 36, color: C.ash }}>
        Odd runs buy {TICKER} back and burn it. Even runs send 0.02 ETH to the treasury chest. Then again, 24/7.
      </p>
    </Scene>
  );
}

/** 5 · The sign-off. */
function S5() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f - 6, fps, config: { damping: 12 } });
  return (
    <Scene dur={150} style={{ background: C.night }}>
      <svg style={{ position: "absolute", left: 0, top: 820 }} width={1920} height={260} viewBox="0 0 192 26" shapeRendering="crispEdges">
        <LavaPool x0={0} x1={192} y={12} h={14} t={f / 30} />
        <Flames x0={0} x1={192} y={12} t={f / 30} blaze={0.9} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", transform: `scale(${0.6 + k * 0.4})` }}>
        <Pix rows={MARK} px={20} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: k }}>
        <Title size={170} />
      </div>
      <p style={{ position: "absolute", left: 0, right: 0, top: 580, margin: 0, textAlign: "center", fontFamily: label, fontSize: 52, color: C.hot, textShadow: "4px 4px 0 #000", opacity: interpolate(f, [24, 40], [0, 1], clamp) }}>
        {TICKER} · {SITE.toUpperCase()}
      </p>
      <p style={{ position: "absolute", left: 0, right: 0, top: 672, margin: 0, textAlign: "center", fontFamily: body, fontWeight: 500, fontSize: 36, color: C.ash, opacity: interpolate(f, [40, 56], [0, 1], clamp) }}>
        On Robinhood Chain · every drop is on chain · not financial advice
      </p>
    </Scene>
  );
}

export const LavaDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={150}>
      <S1 />
    </Sequence>
    <Sequence from={150} durationInFrames={180}>
      <S2 />
    </Sequence>
    <Sequence from={330} durationInFrames={240}>
      <S3 />
    </Sequence>
    <Sequence from={570} durationInFrames={180}>
      <S4 />
    </Sequence>
    <Sequence from={750} durationInFrames={150}>
      <S5 />
    </Sequence>
  </AbsoluteFill>
);

