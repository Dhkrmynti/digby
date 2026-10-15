/**
 * "Red candles? Hang on." A sloth lounges in its hammock while red candles drop off a chart and
 * pile up in the hammock: it scoops the dip without getting up. No prices, no promises: the chart
 * has no axis or numbers, the only claim is the engine's own mechanic (fees buy $HANG and burn it).
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, SlothHead, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#d9534f";
const SCREEN = "#0d1424";

/** Red candles stepping down a dark screen; `k` (0..1) is how many have printed. */
function RedChart({ k, w, h }: { k: number; w: number; h: number }) {
  const N = 14;
  const cw = w / N;
  const shown = Math.floor(k * N);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <rect width={w} height={h} fill={SCREEN} />
      {[0.25, 0.5, 0.75].map((y) => (
        <path key={y} d={`M0 ${h * y} H${w}`} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" />
      ))}
      {Array.from({ length: Math.min(N, shown + 1) }, (_, i) => {
        const top = h * 0.12 + i * h * 0.055;
        const body = h * (0.05 + (i % 3) * 0.015) * (i === shown ? (k * N) % 1 : 1);
        const x = i * cw + cw * 0.2;
        return (
          <g key={i}>
            <path d={`M${x + cw * 0.3} ${top - 10} V${top + body + 10}`} stroke={RED} strokeWidth="3" />
            <rect x={x} y={top} width={cw * 0.6} height={body} fill={RED} />
          </g>
        );
      })}
    </svg>
  );
}

/** One red candle as an object: wick and body. */
function Candle({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 20 60" width={size * 0.33} height={size}>
      <path d="M10 0 V60" stroke={C.ink} strokeWidth="5" />
      <path d="M10 0 V60" stroke={RED} strokeWidth="2.5" />
      <rect x="2" y="12" width="16" height="36" fill={RED} stroke={C.ink} strokeWidth="2.5" />
    </svg>
  );
}

/** The hammock with the sloth lying in it, and whatever it has scooped. `sag` deepens the dip. */
function Lounger({ sag, yawn, scooped }: { sag: number; yawn: number; scooped: number }) {
  const d = 92 + sag * 40;
  return (
    <svg viewBox="0 0 520 300" width={520} height={300} style={{ overflow: "visible" }}>
      <path d="M20 0 L44 120 M500 0 L476 120" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
      <path d={`M40 116 Q260 ${116 + d * 2.2} 480 116 Q260 ${116 + d * 1.1} 40 116 Z`} fill={C.mango} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d={`M90 150 Q260 ${150 + d * 1.5} 430 150`} fill="none" stroke={C.ink} strokeOpacity="0.4" strokeWidth="3" />
      {/* the sloth, lying back with an arm behind its head */}
      <ellipse cx="300" cy={118 + sag * 22} rx="110" ry="34" fill="#9b9a93" stroke={C.ink} strokeWidth="4" />
      <g transform={`translate(70 ${30 + sag * 22}) scale(1.25)`}>
        <SlothHead traits={[2, 4, yawn > 0.5 ? 2 : 0, 0]} asleep={yawn > 0.5} />
      </g>
      {/* the scooped candles, hugged on its belly */}
      {Array.from({ length: scooped }, (_, i) => (
        <g key={i} transform={`translate(${230 + ((i * 41) % 150)} ${78 + sag * 22 - Math.floor(i / 4) * 14}) rotate(${((i * 37) % 60) - 30})`}>
          <path d="M0 -24 V24" stroke={C.ink} strokeWidth="5" />
          <path d="M0 -24 V24" stroke={RED} strokeWidth="2.5" />
          <rect x="-7" y="-14" width="14" height="28" fill={RED} stroke={C.ink} strokeWidth="2.5" />
        </g>
      ))}
      {yawn > 0.2 && yawn < 0.9 ? <ellipse cx="132" cy={115 + sag * 22} rx="11" ry={4 + yawn * 9} fill={C.ink} /> : null}
    </svg>
  );
}

/* ═════════ Clip (1080×1350, 12 s): the chart goes red, the candles drop into the hammock ═════════ */
export const HangDipClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });

  const chartK = interpolate(frame, [10, 80], [0, 1], clamp);
  const yawn = interpolate(frame, [60, 80, 100], [0, 1, 0], clamp);
  // candles fall from the screen into the hammock, one every few frames
  const FALL = 10;
  const drops = Array.from({ length: FALL }, (_, i) => 110 + i * 9);
  const scooped = drops.filter((at) => frame >= at + 22).length;
  const sag = scooped / FALL;
  const screenGone = interpolate(frame, [110, 200], [0, 1], clamp);
  const fire = interpolate(frame, [240, 270], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const end = pop(300);

  return (
    <AbsoluteFill style={{ background: C.sky, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.07) 46px 48px)` }} />

      {/* headline, changing with the beat */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 54 }}>
        {frame < 110 ? (
          <p style={{ margin: 0, fontWeight: 900, fontSize: 92, lineHeight: 0.95, color: C.ink, transform: `scale(${pop(5)})`, transformOrigin: "0 50%" }}>
            Candles are <span style={{ color: RED }}>red.</span>
          </p>
        ) : frame < 225 ? (
          <p style={{ margin: 0, fontWeight: 900, fontSize: 92, lineHeight: 0.95, color: C.ink, transform: `scale(${pop(110)})`, transformOrigin: "0 50%" }}>
            The sloth is
            <br />
            scooping.
          </p>
        ) : (
          <p style={{ margin: 0, fontWeight: 900, fontSize: 80, lineHeight: 0.98, color: C.ink, transform: `scale(${pop(225)})`, transformOrigin: "0 50%" }}>
            Sloths don't panic.
            <br />
            They hang on.
          </p>
        )}
      </div>

      {/* the chart, shaken empty */}
      <div style={{ position: "absolute", left: 140, top: 300, border: `7px solid ${C.ink}`, opacity: 1 - screenGone * 0.85, transform: `rotate(${Math.sin(frame * 1.7) * (frame > 105 && frame < 200 ? 1.5 : 0)}deg)` }}>
        <RedChart k={chartK} w={800} h={300} />
        <p style={{ position: "absolute", left: 16, top: 10, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: "#f2c4c2" }}>{TICKER} ▼</p>
      </div>
      {drops.map((at, i) => {
        const t = interpolate(frame, [at, at + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (t <= 0 || t >= 1) return null;
        const x = interpolate(t, [0, 1], [200 + ((i * 71) % 620), 360 + ((i * 53) % 260)]);
        const y = interpolate(t, [0, 1], [380, 820]);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${t * 300 + i * 30}deg)` }}>
            <Candle size={70} />
          </div>
        );
      })}

      {/* the bough and the hammock */}
      <Bough width={1200} height={46} leaves={6} style={{ left: -60, top: 650 }} />
      <div style={{ position: "absolute", left: 280, top: 672 }}>
        <Lounger sag={sag} yawn={yawn} scooped={scooped} />
      </div>
      {scooped > 0 && frame < 300 ? (
        <div style={{ position: "absolute", right: 60, top: 760, transform: `rotate(6deg) scale(${pop(132)})` }}>
          <p style={chip(30, "#faf6ea")}>scooped: {scooped}</p>
        </div>
      ) : null}

      {/* the ground, and the fire that keeps going */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 90, bottom: 40, transform: `scale(${0.4 + fire * 0.6})`, transformOrigin: "50% 100%" }}>
        <Campfire size={220} flick={frame / 24} blaze={1 + fire * 0.2} />
      </div>
      {frame >= 240 ? (
        <p style={{ position: "absolute", left: 330, right: 60, bottom: 86, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.paper, opacity: fire }}>
          red or green, every trade's fee
          <br />
          buys {TICKER} and throws it on the fire.
        </p>
      ) : null}

      {/* the close */}
      {frame >= 300 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(226,235,207,${0.85 * end})` }}>
          <div style={{ transform: `scale(${end}) rotate(-3deg)`, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 120, lineHeight: 1, color: C.ink }}>Hang on.</p>
            <p style={{ ...chip(40), marginTop: 26 }}>
              {TICKER} · {SITE}
            </p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 24, bottom: 10, margin: 0, fontFamily: type, fontSize: 18, color: C.paper, opacity: 0.75 }}>meme, not a price chart · not financial advice</p>
    </AbsoluteFill>
  );
};
