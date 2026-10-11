import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, mono } from "./brand";
import { Bulb, Headstone, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type ZeroDaysProps = { readonly burials: number; readonly buried: number };

/* ═════════ 22 · GIF: "0 days without a burial" (720×720, seamless 4 s) ═════════ */
export const ZeroDays: React.FC<ZeroDaysProps> = ({ burials, buried }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // 0..4

  // the digit tries to roll from 0 to 1, Mort shows up, the bell rings, it slams back to 0
  const roll = interpolate(t, [0.8, 1.6, 2.35, 2.5], [0, 0.62, 0.62, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const eyes = interpolate(t, [1.5, 1.7, 3.2, 3.5], [0, 1, 1, 0], clamp);
  const ding = t >= 2.3 && t < 3.3;
  const shake = t >= 2.35 && t < 2.6 ? Math.sin(t * 90) * 8 : 0;
  const dingScale = interpolate(t, [2.3, 2.45], [0.4, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });

  return (
    <AbsoluteFill>
      <Night glow={ding ? 1.2 : 0.7} />
      <Motes count={22} period={4} />

      {/* the safety sign */}
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 50,
          height: 420,
          borderRadius: 20,
          background: C.ticket,
          border: `8px solid ${C.ink}`,
          boxShadow: ding ? "0 0 50px rgba(255,207,58,0.55)" : "0 24px 40px -20px rgba(0,0,0,0.8)",
          translate: `${shake}px 0`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 26,
          color: C.ink,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bulb key={i} size={16} lit={ding ? true : i % 2 === Math.floor(t * 2) % 2} />
          ))}
        </div>
        <div style={{ fontFamily: display, fontSize: 30, marginTop: 16, letterSpacing: "0.04em" }}>THIS GRAVEYARD HAS GONE</div>
        {/* the flip counter */}
        <div style={{ position: "relative", width: 170, height: 190, marginTop: 14, borderRadius: 14, background: C.ink, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: `${-roll * 190}px` }}>
            {["0", "1"].map((d) => (
              <div key={d} style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 150, color: C.bulb }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 93, height: 4, background: C.night }} />
        </div>
        <div style={{ fontFamily: display, fontSize: 34, marginTop: 14 }}>DAYS WITHOUT A BURIAL</div>
      </div>

      {/* DING! */}
      {ding ? (
        <div style={{ position: "absolute", right: 52, top: 16, rotate: "12deg", scale: `${dingScale}`, fontFamily: display, fontSize: 58, color: C.bulb, textShadow: `0 0 20px ${C.bulb}, 0 4px 0 ${C.signDeep}` }}>DING!</div>
      ) : null}

      {/* Mort, leaning in to fix the sign */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 488, display: "flex", justifyContent: "center", opacity: eyes }}>
        <MortEyes size={30} look={t < 2.3 ? -0.6 : 0} grin={t > 2.5 && t < 3.2} />
      </div>

      {/* today's graves */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 74, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 14 }}>
        {new Array(burials).fill(0).map((_, i) => (
          <Headstone key={i} width={62} height={78 + (i % 2) * 12} shape={i % 3 === 2 ? 1 : 0} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 64, height: 12, borderRadius: 6, background: C.nightDeep }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: mono, fontSize: 22, color: C.dust }}>
        {burials} burials today · {fmt(buried)} $GRAVE buried
      </div>
    </AbsoluteFill>
  );
};
