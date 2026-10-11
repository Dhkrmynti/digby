import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { body, C, display, sign } from "./brand";
import { Coin, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, Striker, Track, Tunnel } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";

/** Fades a scene in and out inside [from, to). */
const scene = (f: number, from: number, to: number) => interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);

/* ═════════ 13 · Video: "POV: you just sold $GRAVE" (1080×1350, 12 s) ═════════ */
export const SellPOV: React.FC = () => {
  const f = useCurrentFrame();

  // A · the hook: a finger hits SELL
  const a = scene(f, 0, 64);
  const press = interpolate(f, [26, 30, 36], [1, 0.9, 1], clamp);
  const cursorX = interpolate(f, [4, 26], [860, 600], { ...clamp, easing: expo });
  const cursorY = interpolate(f, [4, 26], [1180, 820], { ...clamp, easing: expo });
  const flash = interpolate(f, [28, 31, 44], [0, 0.45, 0], clamp);
  const shake = f >= 28 && f < 40 ? Math.sin(f * 2.3) * 10 : 0;

  // B · the fee flies to Mort
  const b = scene(f, 58, 156);
  const coinP = interpolate(f, [64, 100], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const coinX = interpolate(coinP, [0, 1], [500, 500]);
  const coinY = interpolate(coinP, [0, 1], [1180, 620]) - Math.sin(coinP * Math.PI) * 120;
  const eaten = f >= 100;
  const grin = f > 112 && f < 150;

  // C · the bell
  const c = scene(f, 150, 228);
  const fill = interpolate(f, [160, 196], [0.55, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const ring = f >= 196;

  // D · the burial
  const d = scene(f, 222, 304);
  const stone = interpolate(f, [244, 272], [1, 0], { ...clamp, easing: expo });

  // E · the card
  const e = interpolate(f, [298, 312], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.6 + (ring ? 0.4 : 0)} />
      <Motes count={40} />

      {/* ── A ── */}
      <AbsoluteFill style={{ opacity: a, translate: `${shake}px 0` }}>
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: 60, color: C.dust }}>POV:</div>
          <div style={{ fontFamily: display, fontSize: 104, lineHeight: 1.02, color: C.cream, marginTop: 10 }}>
            YOU JUST
            <br />
            SOLD <span style={{ color: C.sign }}>$GRAVE</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 720,
            width: 500,
            height: 190,
            borderRadius: 28,
            background: C.sign,
            border: `6px solid ${C.ink}`,
            boxShadow: `0 ${18 * press}px 0 ${C.signDeep}`,
            scale: `${press}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
            fontSize: 110,
            color: C.cream,
          }}
        >
          SELL
        </div>
        <svg width="90" height="110" viewBox="0 0 24 30" style={{ position: "absolute", left: cursorX, top: cursorY }}>
          <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z" fill={C.cream} stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <AbsoluteFill style={{ background: C.sign, opacity: flash, mixBlendMode: "screen" }} />
      </AbsoluteFill>

      {/* ── B ── */}
      <AbsoluteFill style={{ opacity: b }}>
        <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: display, fontSize: 56, color: C.cream, lineHeight: 1.15 }}>
          {f < 108 ? (
            <>
              …BUT EVERY SELL
              <br />
              <span style={{ color: C.bulb }}>PAYS A FEE.</span>
            </>
          ) : (
            <span style={{ fontFamily: sign, fontSize: 88, color: C.bulb, textShadow: shade }}>“thanks for the coin.”</span>
          )}
        </div>
        <div style={{ position: "absolute", left: 220, top: 380 }}>
          <Tunnel width={640} open={0.6}>
            <MortEyes size={62} look={eaten ? 0 : interpolate(coinP, [0, 1], [0.2, 0])} grin={grin} />
          </Tunnel>
        </div>
        {!eaten ? (
          <div style={{ position: "absolute", left: coinX - 60, top: coinY - 60, rotate: `${coinP * 540}deg`, scale: `${interpolate(coinP, [0.8, 1], [1, 0.4], clamp)}` }}>
            <Coin size={120} kind="eth" />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: body, fontSize: 36, color: C.dust, opacity: interpolate(f, [116, 130], [0, 1], clamp) }}>
          – Mort, the gravedigger
        </div>
      </AbsoluteFill>

      {/* ── C ── */}
      <AbsoluteFill style={{ opacity: c }}>
        <div style={{ position: "absolute", left: 110, top: 210, scale: "1.6", transformOrigin: "0 0" }}>
          <Striker height={620} fill={fill} ring={ring} />
        </div>
        <div style={{ position: "absolute", left: 420, right: 70, top: 300 }}>
          <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.1, color: C.cream }}>
            FEES FILL
            <br />
            THE BOX…
          </div>
          <div
            style={{
              fontFamily: display,
              fontSize: 150,
              color: C.bulb,
              marginTop: 60,
              textShadow: "0 0 34px rgba(255,207,58,0.85)",
              opacity: ring ? 1 : 0,
              scale: `${interpolate(f, [196, 210], [0.5, 1], { ...clamp, easing: pop })}`,
              transformOrigin: "0 50%",
            }}
          >
            DING!
          </div>
          <div style={{ fontFamily: body, fontSize: 38, lineHeight: 1.35, color: C.dust, marginTop: 30, opacity: interpolate(f, [204, 216], [0, 1], clamp) }}>
            Mort’s bot claims the box and buys $GRAVE back.
          </div>
        </div>
      </AbsoluteFill>

      {/* ── D ── */}
      <AbsoluteFill style={{ opacity: d }}>
        <div style={{ position: "absolute", top: 140, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.02, color: C.cream, textShadow: shade }}>
            Your exit fee
            <br />
            <span style={{ color: C.bulb }}>just dug a grave.</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 380, top: 560, translate: `0 ${stone * 380}px`, opacity: 1 - stone * 0.6 }}>
          <Headstone width={320} height={420} shape={0} style={{ paddingTop: 130 }}>
            <div style={{ fontFamily: display, fontSize: 34 }}>HERE LIES</div>
            <div style={{ fontFamily: display, fontSize: 54, marginTop: 8 }}>$GRAVE</div>
            <div style={{ fontFamily: body, fontSize: 26, marginTop: 16 }}>Bought back. Buried.</div>
          </Headstone>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 980, height: 30, background: C.nightDeep }} />
        <Track width={1080} offset={f * 9} style={{ position: "absolute", left: 0, top: 1100 }} />
        <div style={{ position: "absolute", left: interpolate(f, [222, 304], [-260, 1100]), top: 1006 }}>
          <RideCar width={240} spin={f * 12} />
        </div>
      </AbsoluteFill>

      {/* ── E ── */}
      <AbsoluteFill style={{ opacity: e, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ translate: `0 ${interpolate(f, [298, 320], [40, 0], { ...clamp, easing: expo })}px` }}>
          <GraveMark size={250} glow />
          <div style={{ fontFamily: display, fontSize: 70, lineHeight: 1.1, color: C.cream, marginTop: 34 }}>BUY OR SELL.</div>
          <div style={{ fontFamily: sign, fontSize: 130, lineHeight: 1, color: C.bulb, textShadow: shade }}>Mort wins.</div>
          <div style={{ fontFamily: display, fontSize: 46, color: C.cream, marginTop: 40 }}>$GRAVE</div>
          <div style={{ fontFamily: body, fontSize: 34, color: C.dust, marginTop: 10 }}>graveburn.fun</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
