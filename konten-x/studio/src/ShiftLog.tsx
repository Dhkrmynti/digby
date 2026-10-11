import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, Track, WageTin } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export type Ride = {
  readonly time: string; // real UTC time of the ride
  readonly kind: "burial" | "wages";
  readonly tokens?: number;
  readonly eth: number;
};

type ShiftLogProps = {
  readonly rides: Ride[];
  readonly totalBuried: number;
  readonly minutes: number;
  readonly next: "burial" | "wages";
};

const AT = [84, 140, 196, 252, 308]; // when each ride pops on screen

/* ═════════ 21 · Video: Mort's shift log (1080×1350, 15 s) ═════════ */
export const ShiftLog: React.FC<ShiftLogProps> = ({ rides, totalBuried, minutes, next }) => {
  const f = useCurrentFrame();
  const burials = rides.filter((r) => r.kind === "burial").length;
  const hook = interpolate(f, [0, 6, 64, 74], [0, 1, 1, 0], clamp);
  const log = interpolate(f, [70, 80, 372, 384], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [380, 394], [0, 1], clamp);
  const shown = rides.filter((_, i) => f >= AT[i]).length;
  const current = rides[Math.max(0, shown - 1)];
  const buriedSoFar = rides.slice(0, shown).reduce((a, r) => a + (r.tokens || 0), 0);
  const slam = (at: number) => ({
    opacity: interpolate(f, [at, at + 3], [0, 1], clamp),
    scale: `${interpolate(f, [at, at + 10], [1.8, 1], { ...clamp, easing: expo })}`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.6 + (shown / rides.length) * 0.5} />
      <Motes count={40} />

      {/* ── hook ── */}
      <AbsoluteFill style={{ opacity: hook, alignItems: "center", justifyContent: "center", textAlign: "center", gap: 10 }}>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.cream, ...slam(4) }}>{minutes} MINUTES.</div>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.bulb, ...slam(20) }}>{rides.length} RIDES.</div>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.sign, ...slam(36) }}>{burials} GRAVES.</div>
      </AbsoluteFill>

      {/* ── the shift log ── */}
      <AbsoluteFill style={{ opacity: log }}>
        <div style={{ position: "absolute", top: 60, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: display, fontSize: 30, color: C.sign, opacity: Math.floor(f / 15) % 2 ? 1 : 0.4 }}>● MORT’S SHIFT LOG</div>
            <div style={{ fontFamily: sign, fontSize: 70, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 6 }}>Day one</div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 64, fontWeight: 700, color: C.bulb, fontVariantNumeric: "tabular-nums" }}>{current ? current.time : "--:--"}</div>
        </div>

        <div style={{ position: "absolute", left: 70, right: 70, top: 230, display: "flex", flexDirection: "column", gap: 14 }}>
          {rides.map((r, i) => {
            const o = interpolate(f, [AT[i], AT[i] + 10], [0, 1], clamp);
            const burial = r.kind === "burial";
            return (
              <div
                key={i}
                style={{
                  opacity: o,
                  translate: `${interpolate(f, [AT[i], AT[i] + 16], [80, 0], { ...clamp, easing: expo })}px 0`,
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "16px 26px",
                  borderRadius: 16,
                  background: burial ? "rgba(215,38,61,0.22)" : "rgba(166,255,77,0.12)",
                  border: `3px solid ${burial ? C.sign : "#4c8a12"}`,
                }}
              >
                <Bulb size={26} lit={f >= AT[i] + 4} />
                <div style={{ fontFamily: mono, fontSize: 30, color: C.dust, width: 110 }}>{r.time}</div>
                <div style={{ fontFamily: display, fontSize: 30, color: burial ? C.bulb : C.slime, width: 230 }}>
                  #{i + 1} {burial ? "BURIAL" : "WAGES"}
                </div>
                <div style={{ flex: 1, textAlign: "right", fontFamily: display, fontSize: 32, color: C.cream }}>
                  {burial ? `${fmt(r.tokens || 0)} $GRAVE` : `${r.eth.toFixed(4)} ETH`}
                </div>
              </div>
            );
          })}
        </div>

        {/* the graveyard grows */}
        <div style={{ position: "absolute", left: 70, right: 70, top: 760, height: 270, display: "flex", alignItems: "flex-end", gap: 26, overflow: "hidden" }}>
          {rides.map((r, i) =>
            r.kind === "burial" ? (
              <div key={i} style={{ translate: `0 ${interpolate(f, [AT[i] + 4, AT[i] + 26], [260, 0], { ...clamp, easing: expo })}px` }}>
                <Headstone width={150} height={190 + (i % 3) * 20} shape={i % 4 === 0 ? 0 : 1} style={{ paddingTop: 60 }}>
                  <div style={{ fontFamily: display, fontSize: 20 }}>HERE LIES</div>
                  <div style={{ fontFamily: display, fontSize: 22, marginTop: 4 }}>{((r.tokens || 0) / 1e6).toFixed(1)}M</div>
                </Headstone>
              </div>
            ) : null,
          )}
          <div style={{ flex: 1 }} />
          <div style={{ scale: `${1 + rides.slice(0, shown).filter((r) => r.kind === "wages").length * 0.08}`, transformOrigin: "bottom right" }}>
            <WageTin width={150} label="" />
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 1028, height: 22, borderRadius: 11, background: C.nightDeep }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1072, textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: 26, color: C.dust }}>BURIED SO FAR</div>
          <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1, color: C.bulb, fontVariantNumeric: "tabular-nums", scale: `${f >= AT[shown - 1] && f < AT[shown - 1] + 10 ? interpolate(f, [AT[shown - 1], AT[shown - 1] + 10], [1.15, 1], { ...clamp, easing: pop }) : 1}` }}>
            {fmt(buriedSoFar)}
          </div>
        </div>
        <Track width={1080} offset={f * 9} style={{ position: "absolute", left: 0, top: 1270 }} />
        <div style={{ position: "absolute", left: interpolate(f, [70, 384], [-240, 1080]), top: 1196 }}>
          <RideCar width={200} spin={f * 12} />
        </div>
      </AbsoluteFill>

      {/* ── end card ── */}
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ translate: `0 ${interpolate(f, [380, 404], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MortEyes size={44} grin />
          <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 34 }}>Mort is still</div>
          <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.bulb, textShadow: shade }}>on shift.</div>
          <div style={{ fontFamily: display, fontSize: 52, color: C.cream, marginTop: 40 }}>{fmt(totalBuried)} $GRAVE</div>
          <div style={{ fontFamily: body, fontSize: 34, color: C.dust, marginTop: 8 }}>
            in the graveyard ({((totalBuried / 1e9) * 100).toFixed(2)}% of supply)
          </div>
          <div style={{ fontFamily: display, fontSize: 30, color: next === "burial" ? C.bulb : C.slime, marginTop: 30 }}>
            NEXT RIDE: {next === "burial" ? "BURIAL" : "MORT’S WAGES"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 34 }}>
            <GraveMark size={56} />
            <span style={{ fontFamily: display, fontSize: 32, color: C.dust }}>GRAVEBURN.FUN</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
