/**
 * "12:00": the sloth's schedule played out. Asleep on the branch, the alarm rings at noon, it climbs
 * down (fast-forwarded), scoops a pile of red candles, climbs back and is asleep again by 16:01.
 * The fire at the foot of the tree burns the whole time. No prices, no promises.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, Hanger, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#d9534f";

function Candle({ x, y, h, r = 0 }: { x: number; y: number; h: number; r?: number }) {
  return (
    <svg viewBox="0 0 20 60" width={h / 3} height={h} style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }}>
      <path d="M10 0 V60" stroke={C.ink} strokeWidth="5" />
      <path d="M10 0 V60" stroke={RED} strokeWidth="2.5" />
      <rect x="2" y="12" width="16" height="36" fill={RED} stroke={C.ink} strokeWidth="2.5" />
    </svg>
  );
}

/** Minutes past midnight at a frame: 11:59 → 12:00 (alarm) → fast-forward to 16:01. */
function clockAt(frame: number) {
  const m = interpolate(frame, [0, 40, 100, 180, 240, 320, 345], [719, 720, 720, 810, 840, 959, 961], clamp);
  const mins = Math.floor(m);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

const PILE: [number, number, number][] = Array.from({ length: 12 }, (_, i) => [520 + (i % 6) * 34 - (i >= 6 ? 17 : 0), 1010 - (i >= 6 ? 34 : 0), ((i * 37) % 50) - 25]);

export const HangNoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });

  const ring = frame >= 40 && frame < 100;
  const shake = ring ? Math.sin(frame * 2.6) * 10 : 0;
  const awake = frame >= 75 && frame < 330;
  const ff = (frame >= 100 && frame < 180) || (frame >= 240 && frame < 320);

  // the sloth's path: branch → down the trunk → the pile → back up
  const down = interpolate(frame, [100, 180], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const up = interpolate(frame, [240, 320], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const t = frame < 240 ? down : 1 - up;
  const x = interpolate(t, [0, 0.25, 1], [470, 330, 380]);
  const y = interpolate(t, [0, 1], [508, 820]);
  const sway = frame < 100 || frame > 320 ? Math.sin(frame / 18) * 3 : Math.sin(frame / 3) * 5;

  // the scoop: candles leave the pile one by one
  const taken = Math.floor(interpolate(frame, [185, 235], [0, PILE.length], clamp));
  const end = pop(380);

  return (
    <AbsoluteFill style={{ background: C.sky, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />

      {/* the trunk and the branch */}
      <div style={{ position: "absolute", left: 140, top: 0, width: 170, bottom: 0, background: `repeating-linear-gradient(90deg, ${C.bark} 0 30px, #6b4e33 30px 34px, ${C.bark} 34px 62px)`, borderLeft: `6px solid ${C.ink}`, borderRight: `6px solid ${C.ink}` }} />
      <Bough width={820} height={44} leaves={5} style={{ left: 300, top: 486 }} />

      {/* the headline changes with the hour */}
      <p style={{ position: "absolute", left: 360, right: 40, top: 60, margin: 0, fontWeight: 900, fontSize: 64, lineHeight: 1, color: C.ink }}>
        {frame < 40 ? "11:59. asleep." : frame < 100 ? "12:00. scooping time." : frame < 180 ? "going down…" : frame < 240 ? "scooping…" : frame < 330 ? "going back up…" : "16:01. asleep again."}
      </p>

      {/* the alarm clock */}
      <div style={{ position: "absolute", right: 60, top: 170, transform: `translateX(${shake}px) rotate(${shake / 2}deg)`, textAlign: "center" }}>
        <svg viewBox="0 0 160 160" width={150} height={150}>
          <circle cx="40" cy="30" r="22" fill={C.mango} stroke={C.ink} strokeWidth="6" />
          <circle cx="120" cy="30" r="22" fill={C.mango} stroke={C.ink} strokeWidth="6" />
          <circle cx="80" cy="88" r="62" fill={C.paper2} stroke={C.ink} strokeWidth="8" />
          <path d="M80 88 V50 M80 88 L106 100" stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
        </svg>
        <p style={{ margin: "4px 0 0", fontFamily: type, fontWeight: 700, fontSize: 46, color: C.ink }}>{clockAt(frame)}</p>
        {ring ? <p style={{ margin: 0, fontWeight: 900, fontSize: 40, color: RED }}>RING RING</p> : null}
        {ff ? <p style={{ margin: 0, fontFamily: type, fontWeight: 700, fontSize: 30, color: C.muted }}>⏩ x600</p> : null}
      </div>

      {/* the pile of red candles at the foot of the tree */}
      {PILE.slice(taken).map(([px, py, r], i) => (
        <Candle key={i + taken} x={px} y={py} h={90} r={r} />
      ))}
      {frame >= 185 && frame < 330 ? (
        <div style={{ position: "absolute", left: 560, top: 860, transform: `rotate(5deg) scale(${pop(185)})` }}>
          <p style={chip(30, "#faf6ea")}>scooped: {taken}</p>
        </div>
      ) : null}

      {/* the sloth */}
      <div style={{ position: "absolute", left: x, top: y }}>
        <Hanger traits={[0, 1, awake ? 0 : 2, 0]} width={180} sway={sway} />
        {/* the scooped candles, hugged */}
        {taken > 0
          ? Array.from({ length: Math.min(taken, 6) }, (_, i) => <Candle key={i} x={40 + i * 18} y={150 - (i % 2) * 10} h={70} r={((i * 29) % 40) - 20} />)
          : null}
        {frame >= 345 ? <p style={{ position: "absolute", left: 150, top: 40, margin: 0, fontWeight: 900, fontSize: 48, color: C.ink }}>z z z</p> : null}
      </div>

      {/* the ground and the fire, burning the whole time */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <Campfire size={240} flick={frame / 22} style={{ position: "absolute", left: 800, top: 900 }} />
      <p style={{ position: "absolute", left: 340, bottom: 70, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.paper2 }}>meanwhile, all day: the fire burns {TICKER}</p>

      {/* the close */}
      {frame >= 380 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(226,235,207,${0.88 * end})` }}>
          <div style={{ transform: `scale(${end})`, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 96, lineHeight: 1, color: C.ink }}>
              Back on the branch
              <br />
              by 16:00.
            </p>
            <p style={{ margin: "26px 0 0", fontWeight: 900, fontSize: 70, color: C.fire }}>Hang on.</p>
            <p style={{ ...chip(36), marginTop: 24 }}>
              {TICKER} · {SITE}
            </p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 24, bottom: 10, margin: 0, fontFamily: type, fontSize: 18, color: C.paper, opacity: 0.75 }}>meme · not financial advice</p>
    </AbsoluteFill>
  );
};
