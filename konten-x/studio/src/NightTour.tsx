import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export type Burial = { readonly n: number; readonly time: string; readonly tokens: number };
type NightTourProps = { readonly burials: Burial[]; readonly burned: number };

const W = 168;
const H = 214;
const GAP = 28;
const ROWS = [5, 4, 4];
const ROW_Y = [420, 680, 940];
const SWEEP_FROM = 96;
const PER = 24;

/** Centre of stone i on the field. */
const spot = (i: number) => {
  let row = 0;
  let idx = i;
  while (idx >= ROWS[row]) {
    idx -= ROWS[row];
    row++;
  }
  const n = ROWS[row];
  const left = (1080 - (n * W + (n - 1) * GAP)) / 2;
  return { x: left + idx * (W + GAP) + W / 2, y: ROW_Y[row] + H / 2, left: left + idx * (W + GAP), top: ROW_Y[row] };
};

/* ═════════ 41 · Video: POV night tour of Mort's graveyard (1080×1350, 20 s) ═════════ */
export const NightTour: React.FC<NightTourProps> = ({ burials, burned }) => {
  const f = useCurrentFrame();
  const count = burials.length;
  const sweepEnd = SWEEP_FROM + count * PER;

  // the flashlight walks stone to stone
  const keys = burials.map((_, i) => SWEEP_FROM + i * PER);
  const pts = burials.map((_, i) => spot(i));
  const lx = keys.length ? interpolate(f, keys, pts.map((p) => p.x), { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 540;
  const ly = keys.length ? interpolate(f, keys, pts.map((p) => p.y), { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 675;
  const jitter = Math.sin(f * 0.7) * 4;
  const beamOn = interpolate(f, [80, 84], [0, 1], clamp);
  const flick = f >= 82 && f < 92 ? (Math.floor(f / 2) % 2 ? 0.3 : 1) : 1;
  const counted = Math.max(0, Math.min(count, Math.floor((f - SWEEP_FROM) / PER) + 1));
  const total = counted >= count ? burned : burials.slice(0, counted).reduce((a, b) => a + b.tokens, 0);

  // Mort shows up behind you
  const eyes = interpolate(f, [sweepEnd + 6, sweepEnd + 16, sweepEnd + 70, sweepEnd + 80], [0, 1, 1, 0], clamp);
  // lights on
  const lights = interpolate(f, [sweepEnd + 76, sweepEnd + 96], [0, 1], { ...clamp, easing: expo });
  const radius = 215 + lights * 1600;
  const hook = interpolate(f, [0, 8, 70, 82], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [sweepEnd + 100, sweepEnd + 116], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208" }}>
      {/* the graveyard, fully lit underneath */}
      <AbsoluteFill>
        <Night glow={0.5} />
        <Motes count={30} />
        {ROW_Y.map((y, r) => (
          <div key={r} style={{ position: "absolute", left: 40, right: 40, top: y + H - 8, height: 18, borderRadius: 9, background: "#2a1838" }} />
        ))}
        {burials.map((b, i) => {
          const p = spot(i);
          return (
            <div key={b.n} style={{ position: "absolute", left: p.left, top: p.top }}>
              <Headstone width={W} height={H} shape={(i % 3) as 0 | 1 | 2} style={{ paddingTop: i % 3 === 0 ? 46 : 34, justifyContent: "flex-start" }}>
                <div style={{ fontFamily: display, fontSize: 15 }}>HERE LIES</div>
                <div style={{ fontFamily: display, fontSize: 25, lineHeight: 1, marginTop: 8 }}>{fmt(b.tokens)}</div>
                <div style={{ fontFamily: display, fontSize: 14, marginTop: 2 }}>$GRAVE</div>
                <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, marginTop: 10 }}>#{b.n} · {b.time} UTC</div>
              </Headstone>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* the dark, with one flashlight hole */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle ${radius}px at ${lx + jitter}px ${ly}px, transparent 0, transparent ${radius * 0.72}px, rgba(5,2,8,${0.97 * (1 - lights)}) ${radius}px)`,
          opacity: beamOn ? flick : 1,
          backgroundColor: beamOn ? undefined : "#050208",
        }}
      />

      {/* Mort, right behind you */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center", opacity: eyes }}>
        <MortEyes size={42} look={-0.2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: eyes, fontFamily: sign, fontSize: 52, color: C.cream }}>
        …you’re not alone.
      </div>

      {/* the tour HUD */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 230, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: interpolate(f, [86, 96], [0, 1], clamp) * (1 - end) }}>
        <span style={{ fontFamily: display, fontSize: 30, color: C.sign }}>● NIGHT TOUR</span>
        <span style={{ fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.bulb }}>
          {counted}/{count} · {fmt(total)}
        </span>
      </div>

      {/* hook */}
      <AbsoluteFill style={{ opacity: hook, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ fontFamily: display, fontSize: 70, color: C.dust }}>POV:</div>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.cream, marginTop: 14 }}>
          you took the night tour of
        </div>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.bulb }}>Mort’s graveyard.</div>
        <div style={{ fontFamily: body, fontSize: 34, color: C.dust, marginTop: 40, opacity: interpolate(f, [40, 52], [0, 1], clamp) }}>*click*</div>
      </AbsoluteFill>

      {/* lights on: the full count */}
      <AbsoluteFill style={{ opacity: end }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", translate: `0 ${interpolate(f, [sweepEnd + 100, sweepEnd + 124], [-30, 0], { ...clamp, easing: expo })}px` }}>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>{count} graves.</div>
          <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.1, color: C.bulb, marginTop: 10 }}>{fmt(burned)} $GRAVE</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 34, color: C.cream, marginTop: 8 }}>none of them are coming back.</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: display, fontSize: 28, color: C.dust }}>{((burned / 1e9) * 100).toFixed(2)}% OF SUPPLY · EVERY ONE ON-CHAIN</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <GraveMark size={56} />
            <span style={{ fontFamily: display, fontSize: 32, color: C.cream }}>GRAVEBURN.FUN</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
