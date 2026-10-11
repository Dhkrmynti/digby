import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Coin, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, Track, Tunnel } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ 03 · GIF: the ride loop (600×600, seamless 4 s) ═════════ */
const PERIOD = 4;
const SPEED = 102; // px/s: 408 px per loop = 12 ties = 2 headstones, so the loop closes
export const RideLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const travel = t * SPEED;
  const bob = Math.sin((t / PERIOD) * Math.PI * 2 * 4) * 3;
  const coinP = (t % 1) / 1;
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={24} period={PERIOD} />
      <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 38, color: C.cream }}>EVERY TRADE</div>
        <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1, color: C.bulb, textShadow: "0 4px 0 rgba(42,22,38,0.55)" }}>digs a grave.</div>
      </div>
      {/* headstones sliding past, behind the track */}
      {[0, 1, 2, 3].map((i) => {
        const x = 640 - ((travel + i * 204) % 816);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 372 }}>
            <Headstone width={70} height={96} shape={i % 2 === 0 ? 0 : 1} style={{ paddingTop: 26 }}>
              <div style={{ fontFamily: display, fontSize: 11 }}>HERE LIES</div>
              <div style={{ fontFamily: display, fontSize: 13 }}>$GRAVE</div>
            </Headstone>
          </div>
        );
      })}
      <Track width={600} offset={travel} style={{ position: "absolute", left: 0, top: 466 }} />
      {/* a fee coin dropping into the car every second */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: interpolate(coinP, [0, 0.7], [170, 380], { ...clamp, easing: Easing.in(Easing.quad) }),
          opacity: interpolate(coinP, [0, 0.1, 0.65, 0.75], [0, 1, 1, 0], clamp),
        }}
      >
        <Coin size={44} kind="eth" />
      </div>
      <div style={{ position: "absolute", left: 175, top: 386 + bob }}>
        <RideCar width={200} spin={(t / PERIOD) * 720} />
      </div>
      <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: display, fontSize: 24, color: C.dust }}>
        $GRAVE · MORT’S GHOST TRAIN
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ 11 · Video: tunnel POV (1080×1350, 12 s) ═════════ */
export const TunnelPOV: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 110], [0.55, 1.15], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const open = interpolate(f, [100, 150], [0, 0.85], { ...clamp, easing: expo });
  const eyes = interpolate(f, [150, 175], [0, 1], clamp);
  const blink = f > 212 && f < 218;
  const grin = f > 240 && f < 268;
  const typed = "something is in the tunnel…";
  const endCard = interpolate(f, [280, 300], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.4} />
      <Motes count={40} />
      {/* rails converging into the tunnel */}
      <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{ position: "absolute", inset: 0, opacity: 1 - endCard }}>
        <path d="M120 1350 L470 900" stroke={C.rail} strokeWidth="14" />
        <path d="M960 1350 L610 900" stroke={C.rail} strokeWidth="14" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const p = (((f / 30) * 0.8 + i / 6) % 1);
          const y = 900 + p * p * 450;
          const half = 70 + p * p * 420;
          return <rect key={i} x={540 - half} y={y} width={half * 2} height={6 + p * 18} fill={C.plum} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - endCard }}>
        <div style={{ scale: `${zoom}`, translate: "0 -40px" }}>
          <Tunnel width={720} open={open}>
            <div style={{ opacity: eyes }}>
              <MortEyes size={70} look={Math.sin(f / 22) * 0.6} blink={blink} grin={grin} />
            </div>
          </Tunnel>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: mono, fontSize: 46, color: C.cream, opacity: interpolate(f, [140, 160], [1, 0], clamp) }}>
        {typed.slice(0, Math.floor(f / 3))}
        <span style={{ opacity: Math.floor(f / 10) % 2 ? 1 : 0 }}>▌</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          width: "100%",
          textAlign: "center",
          fontFamily: sign,
          fontSize: 92,
          lineHeight: 1,
          color: C.bulb,
          textShadow: "0 4px 0 rgba(42,22,38,0.55)",
          opacity: interpolate(f, [190, 210, 275, 290], [0, 1, 1, 0], clamp),
          translate: `0 ${interpolate(f, [190, 215], [30, 0], { ...clamp, easing: expo })}px`,
        }}
      >
        every trade
        <br />
        digs a grave.
      </div>
      <AbsoluteFill style={{ opacity: endCard, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <GraveMark size={300} glow />
        <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, marginTop: 30, textShadow: "0 4px 0 rgba(42,22,38,0.55)" }}>Mort’s Ghost Train</div>
        <div style={{ fontFamily: display, fontSize: 52, color: C.bulb, marginTop: 22 }}>$GRAVE</div>
        <div style={{ fontFamily: body, fontSize: 34, color: C.dust, marginTop: 16 }}>Buyback &amp; burial on Robinhood Chain</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
