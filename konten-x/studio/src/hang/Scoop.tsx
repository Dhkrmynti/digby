/**
 * Three "scoop the red" posts (1080×1350): shopping the red aisle, a scoop of red candles, and a
 * bucket out in the red rain. Jokes about holding through red days; no prices, no promises.
 */
import { AbsoluteFill } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Hanger, SlothHead, chip } from "./parts";

const RED = "#d9534f";
const FUR = "#bfa784";

function Page({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <AbsoluteFill style={{ background: C.sky, fontFamily: serif, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 64, top: 58 }}>
        <p style={chip(24)}>{tag}</p>
      </div>
      {children}
      <div style={{ position: "absolute", right: 64, bottom: 40 }}>
        <p style={chip(26)}>
          {TICKER} · {SITE}
        </p>
      </div>
      <p style={{ position: "absolute", left: 64, bottom: 52, margin: 0, fontFamily: type, fontSize: 19, color: C.paper, opacity: 0.8 }}>meme, not financial advice</p>
    </AbsoluteFill>
  );
}

const H1 = (size: number): React.CSSProperties => ({ margin: 0, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color: C.ink });

/** A red candle drawn into an SVG at (x, y), `h` tall, turned by `r` degrees. */
function Candle({ x, y, h, r = 0 }: { x: number; y: number; h: number; r?: number }) {
  const w = h * 0.3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M0 ${-h / 2} V${h / 2}`} stroke={C.ink} strokeWidth="6" />
      <path d={`M0 ${-h / 2} V${h / 2}`} stroke={RED} strokeWidth="3" />
      <rect x={-w / 2} y={-h * 0.3} width={w} height={h * 0.6} fill={RED} stroke={C.ink} strokeWidth="3" />
    </g>
  );
}

/** A sloth standing, from the knees up, in a 300×420 box; its paws reach to (paws). */
function Standing({ traits, paws }: { traits: [number, number, number, number]; paws: [number, number][] }) {
  return (
    <g>
      <ellipse cx="150" cy="300" rx="105" ry="130" fill={FUR} stroke={C.ink} strokeWidth="7" />
      <ellipse cx="150" cy="320" rx="62" ry="88" fill="#e6d9bd" />
      {paws.map(([x, y], i) => (
        <g key={i} fill="none" strokeLinecap="round">
          <path d={`M${i ? 220 : 80} 250 Q ${(x + (i ? 220 : 80)) / 2} ${Math.max(y, 250) + 40} ${x} ${y}`} stroke={C.ink} strokeWidth="40" />
          <path d={`M${i ? 220 : 80} 250 Q ${(x + (i ? 220 : 80)) / 2} ${Math.max(y, 250) + 40} ${x} ${y}`} stroke={FUR} strokeWidth="28" />
        </g>
      ))}
      <g transform="translate(55 30) scale(1.9)">
        <SlothHead traits={traits} />
      </g>
    </g>
  );
}

/* ═════════ 1. The red aisle ═════════ */
export const ScoopAisle: React.FC = () => (
  <Page tag="Field note · shopping">
    <p style={{ ...H1(84), position: "absolute", left: 64, top: 130, width: 960 }}>
      Red candles
      <br />
      in aisle 3. 🛒
    </p>
    {/* the shelf sign */}
    <div style={{ position: "absolute", right: 70, top: 330, background: RED, border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "14px 26px", transform: "rotate(4deg)" }}>
      <p style={{ margin: 0, fontWeight: 900, fontSize: 52, color: "#fff" }}>RED DAY</p>
      <p style={{ margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: "#fff" }}>everything on the shelf is red</p>
    </div>
    <svg viewBox="0 0 1080 760" width={1080} height={760} style={{ position: "absolute", left: 0, top: 470 }}>
      {/* shelves full of red candles */}
      {[90, 290].map((y) => (
        <g key={y}>
          <rect x="560" y={y + 150} width="480" height="20" fill={C.bark} stroke={C.ink} strokeWidth="5" />
          {Array.from({ length: 8 }, (_, i) => (
            <Candle key={i} x={600 + i * 56} y={y + 100} h={90} r={(i % 3) * 4 - 4} />
          ))}
        </g>
      ))}
      {/* the sloth with its basket */}
      <g transform="translate(110 160)">
        <Standing traits={[3, 2, 1, 0]} paws={[[130, 400], [340, 330]]} />
      </g>
      <g transform="translate(250 470)">
        <path d="M0 0 H260 L230 150 H30 Z" fill="#faf6ea" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
        <path d="M40 0 Q130 -110 220 0" fill="none" stroke={C.ink} strokeWidth="9" />
        {Array.from({ length: 7 }, (_, i) => (
          <Candle key={i} x={45 + i * 30} y={-18 - (i % 2) * 14} h={80} r={(i * 17) % 40 - 20} />
        ))}
        <path d="M20 40 H240 M30 90 H230" stroke={C.ink} strokeOpacity="0.3" strokeWidth="4" />
      </g>
    </svg>
    <p style={{ position: "absolute", left: 560, top: 1080, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.ink }}>the sloth went shopping.<br />slowly.</p>
  </Page>
);

/* ═════════ 2. One scoop of red ═════════ */
export const ScoopCone: React.FC = () => (
  <Page tag="Field note · dessert">
    <p style={{ ...H1(84), position: "absolute", left: 64, top: 130, width: 960 }}>
      One scoop
      <br />
      of <span style={{ color: RED }}>red</span>, please. 🍨
    </p>
    <svg viewBox="0 0 1080 820" width={1080} height={820} style={{ position: "absolute", left: 0, top: 380 }}>
      {/* the giant scoop, heaped with red candles */}
      <g transform="translate(350 180) rotate(-18)">
        <path d="M0 260 L0 40" stroke={C.ink} strokeWidth="44" strokeLinecap="round" />
        <path d="M0 260 L0 40" stroke="#c9ced8" strokeWidth="30" strokeLinecap="round" />
        <path d="M-130 40 A130 110 0 0 1 130 40 Z" fill="#c9ced8" stroke={C.ink} strokeWidth="8" />
        {Array.from({ length: 11 }, (_, i) => (
          <Candle key={i} x={-110 + (i % 6) * 44} y={-20 - Math.floor(i / 6) * 60 - (i % 2) * 14} h={100} r={(i * 23) % 50 - 25} />
        ))}
      </g>
      {/* the sloth, holding the scoop up */}
      <g transform="translate(130 300)">
        <Standing traits={[0, 1, 4, 0]} paws={[[300, 130], [270, 30]]} />
      </g>
    </svg>
    <div style={{ position: "absolute", right: 70, top: 900, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "16px 24px", transform: "rotate(-3deg)", fontFamily: type, fontSize: 28, lineHeight: 1.5, color: C.ink }}>
      flavour of the day: <b style={{ color: RED }}>red</b>
      <br />
      toppings: patience
    </div>
  </Page>
);

/* ═════════ 3. Red rain, one bucket ═════════ */
export const ScoopRain: React.FC = () => (
  <Page tag="Forecast · today">
    <p style={{ ...H1(80), position: "absolute", left: 64, top: 130, width: 960 }}>
      Forecast: <span style={{ color: RED }}>red.</span>
      <br />
      The sloth brought
      <br />a bucket. 🪣
    </p>
    <svg viewBox="0 0 1080 900" width={1080} height={900} style={{ position: "absolute", left: 0, top: 330 }}>
      {/* the rain of red candles */}
      {Array.from({ length: 26 }, (_, i) => (
        <Candle key={i} x={40 + ((i * 167) % 1000)} y={110 + ((i * 97) % 420)} h={60} r={18} />
      ))}
      {/* the bough and the sloth hanging under its leaf umbrella, bucket on a claw */}
      <foreignObject x="0" y="0" width="1080" height="900">
        <div style={{ position: "relative", width: 1080, height: 900 }}>
          <Bough width={760} height={40} leaves={4} style={{ left: 320, top: 270 }} />
          <Hanger traits={[4, 1, 0, 0]} width={200} sway={-4} style={{ position: "absolute", left: 600, top: 288 }} />
        </div>
      </foreignObject>
      <g transform="translate(610 600)">
        <path d="M0 0 L20 170 H200 L220 0 Z" fill="#9aa5b8" stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
        <path d="M0 0 Q110 -90 220 0" fill="none" stroke={C.ink} strokeWidth="7" />
        {Array.from({ length: 8 }, (_, i) => (
          <Candle key={i} x={30 + i * 24} y={-14 - (i % 3) * 10} h={70} r={(i * 29) % 50 - 25} />
        ))}
      </g>
    </svg>
    <p style={{ position: "absolute", left: 64, top: 1050, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, lineHeight: 1.45, color: C.ink }}>
      others ran for cover.
      <br />
      the sloth held a bucket.
    </p>
  </Page>
);

/* ═════════ 4. A sloth's daily schedule: mostly hanging, one trip down to scoop ═════════ */
export const ScoopSchedule: React.FC = () => {
  const rows: [string, string, string?][] = [
    ["06:00", "hang"],
    ["09:00", "hang, but harder"],
    ["12:00", "climb down. scoop the red.", RED],
    ["16:00", "arrive back on the branch"],
    ["16:01", "nap (still hanging)"],
    ["all day", `the fire burns ${TICKER}`, C.fire],
  ];
  return (
    <Page tag="Field note · routine">
      <p style={{ ...H1(80), position: "absolute", left: 64, top: 130, width: 960 }}>
        A sloth's
        <br />
        daily schedule.
      </p>
      {/* the trunk the board is nailed to */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, bottom: 150, background: `repeating-linear-gradient(90deg, ${C.bark} 0 30px, #6b4e33 30px 34px, ${C.bark} 34px 62px)`, borderLeft: `6px solid ${C.ink}`, borderRight: `6px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 390, background: "#e4cf9f", border: `6px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: "26px 34px 30px", transform: "rotate(-1.5deg)" }}>
        {[28, 742].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 14, width: 16, height: 16, borderRadius: "50%", background: "#8a8f99", border: `3px solid ${C.ink}` }} />
        ))}
        {rows.map(([t, what, col], i) => (
          <div key={t} style={{ display: "flex", gap: 26, alignItems: "baseline", padding: "12px 0", borderTop: i ? `3px dashed rgba(28,36,26,0.4)` : "none" }}>
            <span style={{ flex: "none", width: 150, fontFamily: type, fontWeight: 700, fontSize: 34, color: C.ink }}>{t}</span>
            <span style={{ fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: col ?? C.ink }}>{what}</span>
          </div>
        ))}
      </div>
      {/* the sloth hanging off the side of the board, a red candle tucked under an arm */}
      <Bough width={420} height={34} leaves={2} style={{ right: -40, top: 958 }} />
      <Hanger traits={[2, 4, 1, 0]} width={170} sway={-6} style={{ position: "absolute", right: 70, top: 980 }} />
      <svg viewBox="0 0 60 120" width={40} height={80} style={{ position: "absolute", right: 150, top: 1090, transform: "rotate(-30deg)" }}>
        <Candle x={30} y={60} h={100} />
      </svg>
      <p style={{ position: "absolute", left: 160, top: 1050, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, lineHeight: 1.45, color: C.paper2, width: 560, textShadow: `2px 2px 0 ${C.ink}` }}>
        not hanging? check the time.
        <br />
        it's probably 12:00.
      </p>
    </Page>
  );
};

/* ═════════ 5. Now hiring: professional hangers ═════════ */
export const NowHiring: React.FC = () => {
  const block = (h: string, items: string[], col: string = C.ink) => (
    <div style={{ marginTop: 18 }}>
      <p style={{ margin: 0, fontFamily: type, fontWeight: 700, fontSize: 26, letterSpacing: "0.08em", color: C.muted, textTransform: "uppercase" }}>{h}</p>
      {items.map((t) => (
        <p key={t} style={{ margin: "6px 0 0", fontWeight: 700, fontSize: 34, lineHeight: 1.2, color: col }}>
          · {t}
        </p>
      ))}
    </div>
  );
  return (
    <Page tag="Job board · the big tree">
      {/* the trunk the flyer is pinned to */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 120, bottom: 150, background: `repeating-linear-gradient(90deg, ${C.bark} 0 30px, #6b4e33 30px 34px, ${C.bark} 34px 62px)`, borderLeft: `6px solid ${C.ink}`, borderRight: `6px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 160, background: "#fffdf6", border: `6px solid ${C.ink}`, boxShadow: `12px 12px 0 ${C.ink}`, padding: "30px 40px 34px", transform: "rotate(1.5deg)" }}>
        <div style={{ position: "absolute", left: "50%", top: -14, width: 26, height: 26, marginLeft: -13, borderRadius: "50%", background: RED, border: `4px solid ${C.ink}` }} />
        <p style={{ margin: 0, fontWeight: 900, fontSize: 92, lineHeight: 0.95, letterSpacing: "-0.02em", color: C.ink }}>NOW HIRING</p>
        <p style={{ margin: "6px 0 0", fontWeight: 900, fontSize: 46, color: C.fire }}>professional hangers</p>
        {block("requirements", ["three claws, minimum", "can hold through a red candle", "naps on the job"])}
        {block("salary", ["none. nobody here is paid."], RED)}
        {block("benefits", [`the fire burns ${TICKER} every round`, "a branch with a view"], C.leafD)}
        <div style={{ display: "flex", gap: 8, marginTop: 26 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 70, borderLeft: i ? `3px dashed ${C.ink}` : "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
              <span style={{ fontFamily: type, fontWeight: 700, fontSize: 20, color: C.ink, writingMode: "vertical-rl" }}>{SITE}</span>
            </div>
          ))}
        </div>
      </div>
      {/* an applicant, already hanging off the bottom of the flyer */}
      <Bough width={460} height={34} leaves={2} style={{ right: -40, top: 1000 }} />
      <Hanger traits={[1, 2, 4, 0]} width={150} sway={-5} style={{ position: "absolute", right: 120, top: 1020 }} />
      <p style={{ position: "absolute", left: 140, top: 1080, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.paper2, textShadow: `2px 2px 0 ${C.ink}` }}>
        apply by not letting go.
      </p>
    </Page>
  );
};

/* ═════════ 6. A quiet chart: shhh, scooping in progress ═════════ */
export const ScoopQuiet: React.FC = () => (
  <Page tag="Field note · quiet hours">
    <p style={{ ...H1(84), position: "absolute", left: 64, top: 130, width: 960 }}>
      Chart's quiet.
      <br />
      <span style={{ color: C.muted }}>Shhh.</span>
    </p>
    {/* the library sign */}
    <div style={{ position: "absolute", right: 70, top: 262, background: C.leafD, border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "14px 24px", transform: "rotate(3deg)", textAlign: "center" }}>
      <p style={{ margin: 0, fontWeight: 900, fontSize: 44, color: C.paper2 }}>QUIET PLEASE</p>
      <p style={{ margin: "2px 0 0", fontFamily: type, fontWeight: 700, fontSize: 24, color: C.flame }}>scooping in progress</p>
    </div>
    {/* the flat little chart */}
    <div style={{ position: "absolute", left: 64, right: 64, top: 420, height: 270, background: "#0d1424", border: `7px solid ${C.ink}` }}>
      <p style={{ position: "absolute", left: 18, top: 12, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 26, color: "#cfd8ea" }}>{TICKER}</p>
      <p style={{ position: "absolute", right: 18, top: 12, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 26, color: "#9fb0cf" }}>volume: crickets 🦗</p>
      <svg viewBox="0 0 940 200" width={926} height={200} style={{ position: "absolute", left: 0, top: 60 }}>
        <path d="M0 100 H940" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
        {Array.from({ length: 22 }, (_, i) => {
          const up = i % 3 !== 1;
          const col = up ? "#2fbf71" : RED;
          const x = 22 + i * 42;
          return (
            <g key={i}>
              <path d={`M${x + 6} ${92 - (i % 2)} V${108 + (i % 2)}`} stroke={col} strokeWidth="2" />
              <rect x={x} y={98 - (i % 2)} width="12" height="4" fill={col} />
            </g>
          );
        })}
      </svg>
    </div>
    {/* the sloth, finger to its lips, quietly hugging a few candles */}
    <svg viewBox="0 0 1080 560" width={1080} height={560} style={{ position: "absolute", left: 0, top: 670 }}>
      <g transform="translate(90 80)">
        <Standing traits={[1, 3, 0, 0]} paws={[[150, 150], [250, 340]]} />
      </g>
      {/* the shushing claw at the mouth */}
      <path d="M230 245 V205" stroke={C.ink} strokeWidth="14" strokeLinecap="round" />
      <path d="M230 245 V205" stroke="#e6d9bd" strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: 4 }, (_, i) => (
        <Candle key={i} x={290 + i * 26} y={420 - (i % 2) * 12} h={70} r={(i * 23) % 40 - 20} />
      ))}
      <text x="300" y="170" fontFamily="serif" fontWeight="900" fontSize="54" fill={C.ink}>shhh…</text>
    </svg>
    <div style={{ position: "absolute", right: 64, top: 800, width: 470, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "18px 24px", transform: "rotate(-2deg)", fontFamily: type, fontSize: 28, lineHeight: 1.5, color: C.ink }}>
      nobody's looking.
      <br />
      more room on the branch.
      <br />
      <b>quiet or loud, every trade's fee still feeds the fire. 🔥</b>
    </div>
  </Page>
);
