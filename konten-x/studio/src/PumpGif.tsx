import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, mono, sign } from "./brand";
import { Bulb, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type PumpGifProps = { readonly buys: number; readonly sells: number };

const MARKS = ["WARM", "HOT", "SPICY", "DING?", "HIGHER?", "???"];
const STEP = 150; // px between marks on the tower

/* ═════════ 33 · GIF: "let's see how high this goes" — Mort's high striker (720×720, 4 s loop) ═════════ */
export const PumpGif: React.FC<PumpGifProps> = ({ buys, sells }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // 0..4

  // the puck climbs; the camera follows it up the endless tower
  const climb = interpolate(t, [0.25, 3.0], [0, (MARKS.length - 1) * STEP], { ...clamp, easing: Easing.bezier(0.55, 0, 0.25, 1) });
  const fade = interpolate(t, [3.6, 4], [1, 0], clamp) * interpolate(t, [0, 0.15], [0, 1], clamp);
  const puckY = 330; // inside the clipped stage // puck stays put on screen, the tower slides down
  const reached = Math.floor((climb + 40) / STEP);
  const ding = t > 3.0 && t < 3.7;
  const shake = t > 3.0 && t < 3.25 ? Math.sin(t * 120) * 6 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.6 + Math.min(1, climb / 750) * 0.6} />
      <Motes count={18} period={4} />

      <AbsoluteFill style={{ opacity: fade, translate: `${shake}px 0` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 140, height: 500, overflow: "hidden" }}>
        {/* the tower: slides down as the puck climbs */}
        <div style={{ position: "absolute", left: 300, top: 0, width: 120, height: 500, zIndex: 2 }}>
          <div style={{ position: "absolute", left: 30, width: 60, top: puckY - 2000 + climb, height: 2600, borderRadius: 30, background: C.plum, border: `6px solid ${C.ink}` }} />
          <div style={{ position: "absolute", left: 38, width: 44, top: puckY + 24, height: 400, background: "#4c8a12" }} />
        </div>
        {/* marks */}
        {MARKS.map((m, i) => {
          const y = puckY - i * STEP + climb;
          if (y < -60 || y > 560) return null;
          const hit = i <= reached;
          return (
            <div key={m} style={{ position: "absolute", left: 0, right: 0, top: y - 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 200, textAlign: "right", fontFamily: display, fontSize: 34, color: hit ? C.bulb : C.dustDim, textShadow: hit ? "0 0 14px rgba(255,207,58,0.8)" : "none" }}>{m}</div>
              <div style={{ width: 120, height: 6, background: hit ? C.bulb : C.plumLine }} />
              <div style={{ width: 200 }} />
            </div>
          );
        })}
        {/* the puck: a green candle */}
        <div style={{ position: "absolute", zIndex: 3, left: 356, top: puckY - 70, width: 8, height: 140, borderRadius: 4, background: C.slime, border: `3px solid ${C.ink}` }} />
        <div style={{ position: "absolute", zIndex: 3, left: 326, top: puckY - 44, width: 68, height: 88, borderRadius: 12, background: C.slime, border: `5px solid ${C.ink}`, boxShadow: "0 0 30px rgba(166,255,77,0.85)" }} />
        {/* speed lines */}
        {t > 0.4 && t < 2.9
          ? [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 340 + i * 16, top: puckY + 40 + ((frame * 9 + i * 40) % 120), width: 6, height: 40, borderRadius: 3, background: C.cream, opacity: 0.5 }} />)
          : null}
        </div>

        {/* bulbs flash on the top mark */}
        {ding ? (
          <div style={{ position: "absolute", left: 440, top: 452, display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <Bulb key={i} size={22} lit={Math.floor(frame / 3) % 2 === i % 2} />
            ))}
          </div>
        ) : null}

        {/* Mort looks up */}
        <div style={{ position: "absolute", left: 520, top: 560 }}>
          <MortEyes size={30} look={-0.2} grin={ding} />
        </div>
      </AbsoluteFill>

      {/* the line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 52, lineHeight: 1.05, color: C.cream, textShadow: "0 4px 0 rgba(42,22,38,0.6)" }}>Let’s see how high</div>
        <div style={{ fontFamily: sign, fontSize: 52, lineHeight: 1.05, color: C.bulb, textShadow: "0 4px 0 rgba(42,22,38,0.6)" }}>this one goes. 👀</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.dust }}>
        last hour: {buys} buys · {sells} sells · $GRAVE
      </div>
    </AbsoluteFill>
  );
};
