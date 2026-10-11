import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, sign } from "./brand";
import { Coin, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ═════════ 37 · GIF: red candle drops, Mort scoops it (720×720, seamless 4 s) ═════════ */
export const ScoopGif: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // 0..4

  // a red candle drops into the dirt, the shovel scoops the coins out, repeat
  const drop = interpolate(t, [0.2, 0.9], [-420, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const thud = t > 0.9 && t < 1.15 ? Math.sin(t * 110) * 6 : 0;
  const sink = interpolate(t, [1.0, 1.6], [0, 1], clamp);
  const dig = interpolate(t, [1.4, 1.9, 2.3, 2.9], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shovelRot = interpolate(dig, [0, 1], [32, -18]);
  const shovelX = interpolate(dig, [0, 1], [70, -30]);
  const shovelY = interpolate(dig, [0, 1], [-40, 40]);
  const toss = interpolate(t, [2.2, 3.1], [0, 1], clamp);
  const grin = t > 2.3 && t < 3.6;
  const fadeIn = interpolate(t, [0, 0.15], [0, 1], clamp);
  const fadeOut = interpolate(t, [3.75, 4], [1, 0], clamp);
  const label = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.7 + toss * 0.4} glowY="70%" />
      <Motes count={16} period={4} />

      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 28, textAlign: "center", opacity: label }}>
        <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1, color: C.cream, textShadow: "0 4px 0 rgba(42,22,38,0.6)" }}>
          <span style={{ color: C.sign }}>red</span> candle?
        </div>
        <div style={{ fontFamily: display, fontSize: 52, lineHeight: 1.15, color: C.bulb }}>SCOOP SZN.</div>
      </div>

      <AbsoluteFill style={{ translate: `${thud}px 0` }}>
        {/* the falling red candle */}
        <div style={{ position: "absolute", left: 310, top: 300 + drop + sink * 120, opacity: Math.min(interpolate(t, [0.45, 0.6], [0, 1], clamp), 1 - sink), clipPath: `inset(-60px -10px calc(${sink * 100}% - 50px) -10px)` }}>
          <div style={{ position: "absolute", left: 46, top: -50, width: 8, height: 50, background: C.sign }} />
          <div style={{ width: 100, height: 170, borderRadius: 12, background: C.sign, border: `6px solid ${C.ink}` }} />
          <div style={{ position: "absolute", left: 46, top: 170, width: 8, height: 40, background: C.sign }} />
        </div>

        {/* coins flung out of the dirt by the shovel */}
        {[0, 1, 2, 3, 4].map((i) => {
          const p = Math.max(0, toss - i * 0.06);
          const x = 360 + (i - 2) * 26 + p * (i - 2) * 70 - p * 120;
          const y = 520 - Math.sin(Math.min(1, p) * Math.PI) * (170 + i * 20) - p * 30;
          return p > 0 && p < 1 ? (
            <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, rotate: `${p * 540}deg` }}>
              <Coin size={52} kind="grave" />
            </div>
          ) : null;
        })}

        {/* the dirt pile */}
        <svg width="720" height="260" viewBox="0 0 720 260" style={{ position: "absolute", left: 0, bottom: 0 }}>
          <path d="M0 260 V170 Q180 120 360 110 Q540 120 720 170 V260 Z" fill="#5a3d2a" stroke={C.ink} strokeWidth="6" />
          <path d="M140 160 Q360 70 580 160" fill="none" stroke="#7a5236" strokeWidth="10" strokeLinecap="round" />
          {[180, 300, 420, 540].map((x, i) => (
            <circle key={x} cx={x} cy={175 + (i % 2) * 14} r="12" fill={C.bulb} stroke={C.ink} strokeWidth="3" opacity={0.85} />
          ))}
        </svg>

        {/* Mort's shovel */}
        <div style={{ position: "absolute", left: 420 + shovelX, top: 230 + shovelY, rotate: `${shovelRot}deg`, transformOrigin: "50% 100%" }}>
          <svg width="90" height="330" viewBox="0 0 90 330">
            <rect x="37" y="0" width="16" height="240" rx="7" fill="#8a5a33" stroke={C.ink} strokeWidth="5" />
            <rect x="18" y="-6" width="54" height="20" rx="9" fill="#8a5a33" stroke={C.ink} strokeWidth="5" />
            <path d="M8 236 h74 v42 q-37 50 -74 0 Z" fill="#8f879a" stroke={C.ink} strokeWidth="5" />
          </svg>
        </div>

        {/* Mort watching */}
        <div style={{ position: "absolute", left: 70, top: 330 }}>
          <MortEyes size={30} look={toss > 0 ? -0.3 : 0.5} grin={grin} />
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: display, fontSize: 24, color: C.cream, opacity: label }}>
        $GRAVE · NFA, GRAVEDIGGER ADVICE
      </div>
    </AbsoluteFill>
  );
};
