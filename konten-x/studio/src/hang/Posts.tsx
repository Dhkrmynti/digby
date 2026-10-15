/**
 * Static posts (1080×1350) about red candles and holding on. No prices and no promises: the only
 * claim any of them makes is the engine's own mechanic, which is on chain (fees buy $HANG and burn it).
 */
import { AbsoluteFill } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, Hanger, SlothHead, chip } from "./parts";

const RED = "#d9534f";
const GREEN = "#2fbf71";

/** The journal page every post sits on: ruled lines, a tag, the site in the corner. */
function Page({ tag, children, ground = true }: { tag: string; children: React.ReactNode; ground?: boolean }) {
  return (
    <AbsoluteFill style={{ background: C.sky, fontFamily: serif, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />
      {ground ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: C.leafD, borderTop: `6px solid ${C.ink}` }} /> : null}
      <div style={{ position: "absolute", left: 64, top: 60 }}>
        <p style={chip(26)}>{tag}</p>
      </div>
      {children}
      <div style={{ position: "absolute", right: 64, bottom: 46 }}>
        <p style={chip(28)}>
          {TICKER} · {SITE}
        </p>
      </div>
      <p style={{ position: "absolute", left: 64, bottom: 58, margin: 0, fontFamily: type, fontSize: 19, color: C.paper, opacity: 0.8 }}>meme, not financial advice</p>
    </AbsoluteFill>
  );
}

/** A red candle object, `h` pixels tall. */
function RedCandle({ h, style }: { h: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 60" width={h / 3} height={h} style={style}>
      <path d="M10 0 V60" stroke={C.ink} strokeWidth="5" />
      <path d="M10 0 V60" stroke={RED} strokeWidth="2.5" />
      <rect x="2" y="12" width="16" height="36" fill={RED} stroke={C.ink} strokeWidth="2.5" />
    </svg>
  );
}

const H1 = (size: number): React.CSSProperties => ({ margin: 0, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color: C.ink });

/* ═════════ 1. Sloth diet: red candles ═════════ */
export const PostSlothDiet: React.FC = () => (
  <Page tag="Field note · diet">
    <p style={{ ...H1(96), position: "absolute", left: 64, top: 140, width: 950 }}>
      What sloths eat
      <br />
      on red days.
    </p>
    <Bough width={1200} height={44} leaves={6} style={{ left: -60, top: 420 }} />
    <Hanger traits={[3, 1, 0, 0]} width={250} sway={-4} style={{ position: "absolute", left: 140, top: 442 }} />
    {/* a red candle in its mouth, like a leaf */}
    <RedCandle h={120} style={{ position: "absolute", left: 300, top: 600, transform: "rotate(68deg)" }} />
    {/* the plate: a big leaf piled with red candles */}
    <svg viewBox="0 0 420 120" width={420} height={120} style={{ position: "absolute", left: 90, top: 960 }}>
      <path d="M10 70 C 80 10, 340 10, 410 70 C 340 120, 80 120, 10 70 Z" fill={C.leafL} stroke={C.ink} strokeWidth="5" />
      <path d="M30 70 H390" stroke={C.ink} strokeOpacity="0.4" strokeWidth="3" />
    </svg>
    {Array.from({ length: 9 }, (_, i) => (
      <RedCandle key={i} h={86} style={{ position: "absolute", left: 150 + i * 30, top: 935 - (i % 3) * 18, transform: `rotate(${(i * 23) % 50 - 25}deg)` }} />
    ))}
    <p style={{ position: "absolute", left: 120, top: 1090, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.ink }}>second helping, please.</p>
    {/* the menu board */}
    <div style={{ position: "absolute", right: 70, top: 500, width: 470, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: "26px 30px 30px", transform: "rotate(2deg)" }}>
      <p style={{ margin: 0, fontWeight: 900, fontSize: 46, color: C.ink }}>Today's menu</p>
      <div style={{ marginTop: 14, borderTop: `3px dashed ${C.ink}`, paddingTop: 14, fontFamily: type, fontSize: 30, lineHeight: 1.6, color: C.ink }}>
        <div>
          leaves <span style={{ float: "right" }}>sold out</span>
        </div>
        <div>
          <b style={{ color: RED }}>red candles</b> <span style={{ float: "right" }}>on special</span>
        </div>
        <div>
          panic <span style={{ float: "right" }}>not served</span>
        </div>
      </div>
      <p style={{ margin: "18px 0 0", fontFamily: type, fontSize: 24, lineHeight: 1.4, color: C.muted }}>sloths eat slow. very slow. they finish the plate.</p>
    </div>
  </Page>
);

/* ═════════ 2. Paper hands vs sloth hands ═════════ */
export const PostSlothHands: React.FC = () => (
  <Page tag="Field note · grip test">
    <p style={{ ...H1(92), position: "absolute", left: 64, top: 140, width: 960 }}>
      Paper hands
      <br />
      vs sloth hands.
    </p>
    <div style={{ position: "absolute", left: 540, top: 380, bottom: 150, width: 6, background: C.ink, opacity: 0.25 }} />
    {/* left: a paper hand slipping off the branch */}
    <Bough width={470} height={40} leaves={3} style={{ left: 40, top: 470 }} />
    <svg viewBox="0 0 200 220" width={240} height={264} style={{ position: "absolute", left: 160, top: 560, transform: "rotate(18deg)" }}>
      <path d="M40 210 L40 110 L30 40 Q30 22 44 24 Q56 26 58 44 L64 92 L66 20 Q68 4 82 6 Q96 8 94 26 L94 90 L100 28 Q104 12 118 16 Q130 20 126 38 L120 96 L132 54 Q138 40 150 46 Q160 52 154 70 L140 140 Q130 190 120 210 Z" fill="#faf6ea" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 140 L110 160 M58 170 L102 186" stroke={C.ink} strokeOpacity="0.3" strokeWidth="3" />
    </svg>
    <svg viewBox="0 0 40 120" width={34} height={110} style={{ position: "absolute", left: 120, top: 640 }}>
      <path d="M20 4 V100 M6 86 L20 104 L34 86" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 9" />
    </svg>
    <Campfire size={170} flick={0.3} style={{ position: "absolute", left: 180, top: 1020 }} />
    <p style={{ position: "absolute", left: 80, top: 860, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 34, color: C.ink, width: 420 }}>
      paper hands:
      <br />
      <span style={{ color: RED }}>let go at the first red candle.</span>
    </p>
    {/* right: a sloth still gripping */}
    <Bough width={500} height={40} leaves={3} style={{ left: 570, top: 470 }} />
    <Hanger traits={[0, 4, 1, 0]} width={220} sway={2} style={{ position: "absolute", left: 710, top: 490 }} />
    <p style={{ position: "absolute", left: 600, top: 860, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 34, color: C.ink, width: 430 }}>
      sloth hands:
      <br />
      <span style={{ color: GREEN }}>three claws. no plans to let go.</span>
    </p>
  </Page>
);

/* ═════════ 3. How to read a red candle ═════════ */
export const PostReadRed: React.FC = () => {
  const steps: [string, string][] = [
    ["Yawn.", "It is a candle. It is red. It is fine."],
    ["Scoop.", "Pull a few into the hammock. Slowly."],
    ["Hang on.", "Three claws on the branch. Nap."],
  ];
  return (
    <Page tag="Field guide · page 1">
      <p style={{ ...H1(78), position: "absolute", left: 64, top: 140, width: 980 }}>
        How to read
        <br />a <span style={{ color: RED }}>red candle</span>
        <br />
        <span style={{ fontSize: 52 }}>(sloth edition)</span>
      </p>
      <ol style={{ position: "absolute", left: 64, right: 64, top: 470, margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 40 }}>
        {steps.map(([h, t], i) => (
          <li key={h} style={{ display: "flex", alignItems: "center", gap: 30, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "20px 28px", transform: `rotate(${[-1, 1, -0.6][i]}deg)` }}>
            <span style={{ flex: "none", width: 92, height: 92, borderRadius: "50%", background: [RED, C.mango, GREEN][i], border: `5px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 52, color: C.ink }}>{i + 1}</span>
            <span>
              <b style={{ display: "block", fontWeight: 900, fontSize: 56, lineHeight: 1, color: C.ink }}>{h}</b>
              <span style={{ fontFamily: type, fontSize: 30, color: C.ink }}>{t}</span>
            </span>
            <svg viewBox="0 0 100 100" width={110} height={110} style={{ marginLeft: "auto", flex: "none" }}>
              <SlothHead traits={[[2, 3, 4][i] as 2 | 3 | 4, [0, 4, 1][i], [0, 3, 2][i], 0]} asleep={i === 2} />
            </svg>
          </li>
        ))}
      </ol>
    </Page>
  );
};

/* ═════════ 4. The fire doesn't check the chart ═════════ */
export const PostFireNoChart: React.FC = () => (
  <Page tag="Field note · the fire">
    <p style={{ ...H1(96), position: "absolute", left: 64, top: 140, width: 960 }}>
      The fire doesn't
      <br />
      check the chart.
    </p>
    {/* two little screens either side: red and green, the fire in the middle doesn't care */}
    {[
      { x: 70, col: RED, label: "red day" },
      { x: 720, col: GREEN, label: "green day" },
    ].map(({ x, col, label }) => (
      <div key={label} style={{ position: "absolute", left: x, top: 470, width: 290 }}>
        <svg viewBox="0 0 290 190" width={290} height={190}>
          <rect x="3" y="3" width="284" height="184" fill="#0d1424" stroke={C.ink} strokeWidth="6" />
          {Array.from({ length: 7 }, (_, i) => {
            const y = col === RED ? 40 + i * 16 : 140 - i * 16;
            return <rect key={i} x={22 + i * 37} y={y} width={20} height={28} fill={col} />;
          })}
        </svg>
        <p style={{ margin: "10px 0 0", fontFamily: type, fontWeight: 700, fontSize: 30, color: C.ink, textAlign: "center" }}>{label}</p>
      </div>
    ))}
    <Campfire size={360} flick={0.2} style={{ position: "absolute", left: 360, top: 520 }} />
    <p style={{ position: "absolute", left: 64, right: 64, top: 940, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 34, lineHeight: 1.45, color: C.ink, textAlign: "center" }}>
      red or green, every trade's fee
      <br />
      buys {TICKER} and throws it on the fire.
    </p>
  </Page>
);
