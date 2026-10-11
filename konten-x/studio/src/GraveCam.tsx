import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, Coin, GraveMark, Headstone, MortEyes, Motes, Night, WageTin } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toClock = (min: number) => {
  const total = Math.floor(min * 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

export type CamGrave = {
  readonly time: string; // UTC hh:mm the grave was dug
  readonly tokens: number;
};

type GraveCamProps = {
  readonly from: string; // camera start, UTC hh:mm
  readonly to: string; // camera end, UTC hh:mm
  readonly date: string;
  readonly graves: CamGrave[];
  readonly wages: number;
  readonly totalBuried: number;
  readonly feesEth: string;
  readonly boxFill: number; // 0..1 at the end of the tape
  readonly quietFrom: string; // UTC hh:mm of the last grave, start of the quiet stretch
};

// Timeline (30 fps, 540 frames = 18 s)
const TAPE_START = 75; // hook ends, timelapse rolls
const TAPE_END = 420; // clock reaches "now"
const END_CARD = 426;

/* ═════════ Video: 8 hours of graveyard CCTV (1080×1350, 18 s) ═════════ */
export const GraveCam: React.FC<GraveCamProps> = ({ from, to, date, graves, wages, totalBuried, feesEth, boxFill, quietFrom }) => {
  const f = useCurrentFrame();
  const start = toMin(from);
  const end = toMin(to);
  const hours = Math.round((end - start) / 60);
  const clock = interpolate(f, [TAPE_START, TAPE_END], [start, end], clamp);
  const speed = Math.round((((end - start) * 60) / ((TAPE_END - TAPE_START) / 30)) / 100) * 100;

  // When each grave pops: the frame where the tape clock passes its real time
  const at = graves.map((g) => Math.round(interpolate(toMin(g.time), [start, end], [TAPE_START, TAPE_END])));
  // Wage rides alternate with burials: one between each pair of graves
  const wageAt = new Array(wages).fill(0).map((_, i) => (at[i + 1] !== undefined ? Math.round((at[i] + at[i + 1]) / 2) : at[i] + 12));
  const shown = at.filter((a) => f >= a).length;
  const paid = wageAt.filter((a) => f >= a).length;
  const buried = graves.slice(0, shown).reduce((a, g) => a + g.tokens, 0);
  const lastPop = shown > 0 ? at[shown - 1] : -99;
  const quiet = clock >= toMin(quietFrom) + 15 && f < END_CARD;

  // Camera shake right after a grave pops (harder for big ones)
  const since = f - lastPop;
  const kick = shown > 0 && since < 8 ? (1 - since / 8) * (4 + Math.sqrt(graves[shown - 1].tokens / 1e6) * 2.4) : 0;
  const shakeX = (random(`sx${f}`) - 0.5) * kick * 2;
  const shakeY = (random(`sy${f}`) - 0.5) * kick * 2;

  const hook = interpolate(f, [0, 4, 66, 76], [0, 1, 1, 0], clamp);
  const sceneDim = interpolate(f, [0, 70, 80, END_CARD - 6, END_CARD + 10], [0.35, 0.35, 1, 1, 0.22], clamp);
  const endCard = interpolate(f, [END_CARD, END_CARD + 14], [0, 1], clamp);
  const staticBurst = interpolate(f, [0, 10], [1, 0], clamp) + interpolate(f, [TAPE_END - 2, TAPE_END + 4, END_CARD + 6], [0, 0.9, 0], clamp);

  const slam = (t: number) => ({
    opacity: interpolate(f, [t, t + 3], [0, 1], clamp),
    scale: `${interpolate(f, [t, t + 10], [1.7, 1], { ...clamp, easing: expo })}`,
  });

  // Headstone sizing: area tracks tokens buried
  const stoneW = (tokens: number) => 64 + Math.sqrt(tokens / 1e6) * 34;
  const back = graves.slice(0, 7).map((g, i) => ({ g, i }));
  const front = graves.slice(7).map((g, i) => ({ g, i: i + 7 }));

  const stone = ({ g, i }: { g: CamGrave; i: number }) => {
    const w = stoneW(g.tokens);
    const h = w * 1.28;
    const rise = interpolate(f, [at[i], at[i] + 12], [h + 20, 0], { ...clamp, easing: expo });
    const big = w > 150;
    return (
      <div key={i} style={{ position: "relative", width: w, height: h }}>
        <div style={{ translate: `0 ${rise}px` }}>
          <Headstone width={w} height={h} shape={(i % 3) as 0 | 1 | 2} style={{ paddingTop: h * 0.24, boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.18)" }}>
            <div style={{ fontFamily: display, fontSize: big ? 26 : 17, opacity: 0.75 }}>#{i + 1}</div>
            <div style={{ fontFamily: display, fontSize: big ? 40 : Math.max(18, w * 0.2), marginTop: 2 }}>{(g.tokens / 1e6).toFixed(1)}M</div>
            {big ? <div style={{ fontFamily: display, fontSize: 18, marginTop: 6, opacity: 0.7 }}>R.I.P.</div> : null}
          </Headstone>
        </div>
        {/* dirt kicked up */}
        {f >= at[i] && f < at[i] + 18
          ? new Array(9).fill(0).map((_, k) => {
              const p = (f - at[i]) / 18;
              const dx = (random(`dx${i}${k}`) - 0.5) * w * 1.6;
              const dy = -(40 + random(`dy${i}${k}`) * 90);
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: w / 2 + dx * p,
                    bottom: dy * p * (1 - p) * 3,
                    width: 9,
                    height: 9,
                    borderRadius: 3,
                    background: "#3a2648",
                    opacity: 1 - p,
                  }}
                />
              );
            })
          : null}
        {/* floating amount */}
        {f >= at[i] && f < at[i] + 34 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: h + 14 + (f - at[i]) * 2.2,
              translate: "-50% 0",
              whiteSpace: "nowrap",
              fontFamily: display,
              fontSize: big ? 40 : 28,
              color: C.bulb,
              textShadow: "0 0 14px rgba(255,207,58,0.7), 0 3px 0 #000",
              opacity: interpolate(f - at[i], [0, 4, 24, 34], [0, 1, 1, 0]),
              zIndex: 5,
            }}
          >
            +{fmt(g.tokens)}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep, overflow: "hidden" }}>
      {/* ── the scene, as the camera sees it ── */}
      <AbsoluteFill style={{ opacity: sceneDim, translate: `${shakeX}px ${shakeY}px`, scale: "1.02" }}>
        <Night glow={0.4 + (shown / graves.length) * 0.7} glowY="30%" />
        <Motes count={34} />

        {/* moon */}
        <div style={{ position: "absolute", left: 780, top: 380, width: 130, height: 130, borderRadius: "50%", background: C.ticket, opacity: 0.85, boxShadow: "0 0 80px 10px rgba(241,230,204,0.25)" }} />
        <div style={{ position: "absolute", left: 812, top: 366, width: 130, height: 130, borderRadius: "50%", background: C.night, opacity: 0.9 }} />

        {/* treeline, where Mort watches from */}
        <svg width={1080} height={300} viewBox="0 0 1080 300" style={{ position: "absolute", left: 0, top: 560 }}>
          <path d="M0 300V170l60-40 50 30 70-70 60 50 80-60 70 60 90-80 60 50 80-30 70 40 90-60 70 50 80-40 60 30 60-20 70 40V300Z" fill="#120a19" />
          <path d="M0 300V220l90-30 120 20 140-40 160 30 150-20 140 30 130-20 150 20V300Z" fill="#0b0610" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center" }}>
          <MortEyes
            size={quiet ? 30 : 18}
            look={quiet ? 0 : Math.sin(f / 9)}
            blink={quiet ? Math.floor(f / 4) % 18 === 0 : Math.floor(f / 5) % 13 === 0}
            glow={quiet ? 1 : 0.5 + (shown / graves.length) * 0.5}
          />
        </div>

        {/* back row of graves */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 1350 - 990, height: 420, overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 14 }}>
          {back.map(stone)}
        </div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 980, height: 360, background: "linear-gradient(180deg, #24163a 0%, #160d22 40%, #0e0714 100%)", borderTop: `4px solid ${C.plumLine}` }} />

        {/* front row of graves + Mort's wage tin */}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 1350 - 1170, height: 360, overflow: "hidden", display: "flex", alignItems: "flex-end", gap: 22 }}>
          {front.map(stone)}
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative" }}>
            {wageAt.map((a, k) =>
              f >= a - 10 && f < a ? (
                <div key={k} style={{ position: "absolute", left: 60, top: interpolate(f, [a - 10, a], [-200, 30]) }}>
                  <Coin size={44} kind="eth" />
                </div>
              ) : null,
            )}
            <div style={{ scale: `${1 + (f - (wageAt[paid - 1] ?? -99) < 6 ? 0.08 : 0)}`, transformOrigin: "bottom center" }}>
              <WageTin width={150} label={`x${paid}`} />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 1160, height: 200, background: "#0e0714" }} />
      </AbsoluteFill>

      {/* ── CCTV look: scanlines, grain, vignette ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {new Array(14).fill(0).map((_, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: random(`ny${f}${k}`) * 1350,
              height: 1 + random(`nh${f}${k}`) * 3,
              background: "rgba(246,238,221,0.08)",
            }}
          />
        ))}
      </AbsoluteFill>
      {staticBurst > 0 ? (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: staticBurst }}>
          {new Array(60).fill(0).map((_, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: random(`sb${f}${k}`) * 1350,
                height: 4 + random(`sh${f}${k}`) * 26,
                background: random(`sc${f}${k}`) > 0.5 ? "rgba(246,238,221,0.55)" : "rgba(14,7,20,0.9)",
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}

      {/* ── HUD ── */}
      <AbsoluteFill style={{ opacity: 1 - endCard }}>
        <div style={{ position: "absolute", top: 44, left: 52, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.cream, letterSpacing: "0.04em" }}>
          CAM 01 · MORT’S GRAVEYARD
        </div>
        <div style={{ position: "absolute", top: 40, right: 52, display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontWeight: 700, fontSize: 32, color: C.sign }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.sign, opacity: Math.floor(f / 12) % 2 ? 1 : 0.25, boxShadow: `0 0 12px ${C.sign}` }} />
          REC
        </div>

        {/* counters */}
        <div style={{ position: "absolute", top: 120, left: 52, right: 52, display: "flex", justifyContent: "space-between", opacity: interpolate(f, [TAPE_START - 4, TAPE_START + 8], [0, 1], clamp) }}>
          <div>
            <div style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVES DUG</div>
            <div style={{ fontFamily: display, fontSize: 96, lineHeight: 1, color: C.cream, fontVariantNumeric: "tabular-nums", scale: `${since < 8 ? interpolate(since, [0, 8], [1.25, 1]) : 1}`, transformOrigin: "left center" }}>
              {String(shown).padStart(2, "0")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: display, fontSize: 24, color: C.dust }}>$GRAVE BURIED</div>
            <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.4, color: C.bulb, fontVariantNumeric: "tabular-nums", textShadow: "0 0 18px rgba(255,207,58,0.45)" }}>{fmt(buried)}</div>
          </div>
        </div>

        {/* quiet stretch */}
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            opacity: quiet ? interpolate(clock, [toMin(quietFrom) + 15, toMin(quietFrom) + 30], [0, 1], clamp) : 0,
          }}
        >
          <div style={{ fontFamily: sign, fontSize: 76, lineHeight: 1, color: C.cream, textShadow: shade }}>quiet… too quiet.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22, padding: "12px 24px", borderRadius: 12, background: "rgba(14,7,20,0.75)", border: `3px solid ${C.plumLine}` }}>
            <Bulb size={26} lit={Math.floor(f / 8) % 2 === 0} />
            <span style={{ fontFamily: display, fontSize: 30, color: C.cream }}>COIN BOX</span>
            <div style={{ width: 260, height: 26, borderRadius: 13, background: C.plum, border: `3px solid ${C.ink}`, overflow: "hidden" }}>
              <div style={{ width: `${boxFill * 100}%`, height: "100%", background: C.sign }} />
            </div>
            <span style={{ fontFamily: display, fontSize: 30, color: C.bulb }}>{Math.round(boxFill * 100)}%</span>
          </div>
          <div style={{ fontFamily: display, fontSize: 26, color: C.dust, marginTop: 16 }}>
            NEXT: <span style={{ color: C.slime }}>MORT’S PAYCHECK</span> · THEN <span style={{ color: C.bulb }}>GRAVE #{graves.length + 1}</span>
          </div>
        </div>

        {/* timestamp + timelapse */}
        <div style={{ position: "absolute", bottom: 46, left: 52, fontFamily: mono, fontWeight: 700, fontSize: 34, color: C.cream, fontVariantNumeric: "tabular-nums" }}>
          {date} {toClock(clock)} UTC
        </div>
        <div style={{ position: "absolute", bottom: 46, right: 52, fontFamily: mono, fontWeight: 700, fontSize: 34, color: f >= TAPE_START && f < TAPE_END ? C.bulb : C.dustDim }}>
          {f >= TAPE_START && f < TAPE_END ? `▶▶ x${speed.toLocaleString("en-US")}` : "▶ LIVE"}
        </div>
      </AbsoluteFill>

      {/* ── hook ── */}
      <AbsoluteFill style={{ opacity: hook, alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.05, color: C.cream, ...slam(4) }}>WE LEFT A CAMERA</div>
        <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.05, color: C.cream, ...slam(14) }}>IN MORT’S GRAVEYARD</div>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.bulb, marginTop: 14, textShadow: "0 0 30px rgba(255,207,58,0.5)", ...slam(26) }}>
          {hours} HOURS.
        </div>
        <div style={{ fontFamily: sign, fontSize: 70, color: C.sign, marginTop: 30, textShadow: shade, ...slam(44) }}>watch the ground.</div>
      </AbsoluteFill>

      {/* ── end card ── */}
      <AbsoluteFill style={{ opacity: endCard, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ translate: `0 ${interpolate(f, [END_CARD, END_CARD + 24], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MortEyes size={42} grin />
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.cream, ...slam(END_CARD + 6) }}>{hours} HOURS.</div>
            <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.bulb, ...slam(END_CARD + 16) }}>{graves.length} GRAVES.</div>
            <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.slime, ...slam(END_CARD + 26) }}>{wages} PAYCHECKS.</div>
          </div>
          <div style={{ opacity: interpolate(f, [END_CARD + 40, END_CARD + 52], [0, 1], clamp) }}>
            <div style={{ fontFamily: display, fontSize: 50, color: C.cream, marginTop: 44 }}>{fmt(totalBuried)} $GRAVE</div>
            <div style={{ fontFamily: body, fontSize: 32, color: C.dust, marginTop: 6 }}>
              buried at 0x…dEaD ({((totalBuried / 1e9) * 100).toFixed(2)}% of supply) · {feesEth} ETH of fees claimed
            </div>
            <div style={{ fontFamily: sign, fontSize: 62, color: C.cream, marginTop: 40, textShadow: shade }}>The camera stays on.</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 30 }}>
              <GraveMark size={56} />
              <span style={{ fontFamily: display, fontSize: 32, color: C.dust }}>GRAVEBURN.FUN</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
