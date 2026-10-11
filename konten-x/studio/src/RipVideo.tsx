import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const scene = (f: number, from: number, to: number) => interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);

type RipVideoProps = { readonly died: string; readonly graves: number; readonly burned: number; readonly next: number };

const Bubble: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 1, style }) => (
  <div
    style={{
      background: C.cream,
      color: C.ink,
      borderRadius: `${8 * size}px ${30 * size}px ${30 * size}px ${30 * size}px`,
      padding: `${10 * size}px ${26 * size}px ${14 * size}px`,
      boxShadow: "0 14px 24px -12px rgba(0,0,0,0.8)",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <div style={{ fontFamily: body, fontSize: 16 * size, color: C.ticketDim, fontWeight: 600 }}>anon · replying to $GRAVE</div>
    <div style={{ fontFamily: body, fontSize: 48 * size, fontWeight: 700, lineHeight: 1.05 }}>dex paid?</div>
  </div>
);

const Flower: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <svg width={46} height={90} viewBox="0 0 46 90" style={{ scale: `${s}`, transformOrigin: "50% 100%" }}>
    <path d="M23 88 V34" stroke="#4c8a12" strokeWidth="4" />
    <path d="M23 60 q-14 -4 -16 -16 q12 2 16 14" fill="#4c8a12" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={23} cy={22} rx={8} ry={14} fill={c} stroke={C.ink} strokeWidth="2.5" transform={`rotate(${a} 23 30)`} />
    ))}
    <circle cx={23} cy={30} r={6} fill={C.bulb} stroke={C.ink} strokeWidth="2.5" />
  </svg>
);

const SPAM = 18;
const GROUND = 1010;

/* ═════════ 30 · Video: R.I.P. "dex paid?" (1080×1350, 14 s) ═════════ */
export const RipVideo: React.FC<RipVideoProps> = ({ died, graves, burned, next }) => {
  const f = useCurrentFrame();

  // A · the spam
  const a = scene(f, 0, 100);
  const shown = Math.min(SPAM, Math.max(0, Math.floor((f - 4) / 3.4)));
  const slamA = (at: number) => ({
    opacity: interpolate(f, [at, at + 3], [0, 1], clamp),
    scale: `${interpolate(f, [at, at + 10], [1.9, 1], { ...clamp, easing: expo })}`,
  });

  // B · the bill gets paid
  const b = scene(f, 96, 184);
  const stampAt = 128;
  const stamp = interpolate(f, [stampAt, stampAt + 8], [2.4, 1], { ...clamp, easing: expo });
  const flash = interpolate(f, [stampAt + 2, stampAt + 4, stampAt + 18], [0, 0.5, 0], clamp);
  const shakeB = f >= stampAt + 2 && f < stampAt + 14 ? Math.sin(f * 2.1) * 9 : 0;

  // C · the burial
  const c = scene(f, 180, 336);
  const rise = interpolate(f, [236, 280], [1, 0], { ...clamp, easing: expo });
  const dirt = f >= 236 && f < 262;

  // D · end card
  const d = interpolate(f, [330, 344], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.7 + (f >= stampAt && f < 184 ? 0.4 : 0)} glowY={f > 180 ? "55%" : "0%"} />
      <Motes count={40} />

      {/* ── A · every reply ── */}
      <AbsoluteFill style={{ opacity: a }}>
        {new Array(shown).fill(0).map((_, i) => {
          const x = 10 + random(`x${i}`) * 680;
          const y = 140 + random(`y${i}`) * 980;
          const r = (random(`r${i}`) - 0.5) * 18;
          const s = 0.8 + random(`s${i}`) * 0.5;
          const at = 4 + i * 3.4;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, rotate: `${r}deg`, scale: `${interpolate(f, [at, at + 6], [0.4, 1], { ...clamp, easing: pop })}` }}>
              <Bubble size={s} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: display, fontSize: 30, color: C.sign }}>
          ● “DEX PAID?” COUNTER: {shown}
          {shown >= SPAM ? "+" : ""}
        </div>
        {f >= 66 ? (
          <AbsoluteFill style={{ background: "rgba(14,7,20,0.72)", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ fontFamily: display, fontSize: 120, lineHeight: 1.05, color: C.cream, ...slamA(66) }}>EVERY.</div>
            <div style={{ fontFamily: display, fontSize: 120, lineHeight: 1.05, color: C.bulb, ...slamA(74) }}>SINGLE.</div>
            <div style={{ fontFamily: display, fontSize: 120, lineHeight: 1.05, color: C.sign, ...slamA(82) }}>REPLY.</div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      {/* ── B · Mort pays the bill ── */}
      <AbsoluteFill style={{ opacity: b, translate: `${shakeB}px 0` }}>
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.05, color: C.cream, textShadow: shade }}>So Mort</div>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>paid the bill.</div>
        </div>
        <div style={{ position: "absolute", left: 110, right: 110, top: 520, rotate: "1deg" }}>
          <div style={{ background: C.ticket, color: C.ink, borderRadius: 18, border: `6px solid ${C.ink}`, padding: "28px 40px 34px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${C.ink}`, paddingBottom: 12 }}>
              <span style={{ fontFamily: display, fontSize: 32 }}>MORT’S PAY LEDGER</span>
              <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.ticketDim }}>{died.split("·")[1]?.trim()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 30 }}>
              <span style={{ fontFamily: display, fontSize: 40 }}>DEXSCREENER</span>
              <span style={{ position: "relative", width: 300, height: 76 }}>
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 28, color: C.ticketDim, border: `4px dashed ${C.ticketDim}`, borderRadius: 10, opacity: f < stampAt ? 1 : 0 }}>
                  UNPAID
                </span>
                {f >= stampAt ? (
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 44, color: C.cream, background: "#3f7a0c", border: `5px solid ${C.ink}`, borderRadius: 12, rotate: "-7deg", scale: `${stamp}`, boxShadow: "0 0 34px rgba(166,255,77,0.7)" }}>
                    PAID ✓
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: display, fontSize: 34, color: C.slime, opacity: interpolate(f, [stampAt + 10, stampAt + 20], [0, 1], clamp) }}>
          LOGO UP · SOCIALS UP · DEX PAID ✓
        </div>
        <AbsoluteFill style={{ background: C.slime, opacity: flash, mixBlendMode: "screen" }} />
      </AbsoluteFill>

      {/* ── C · the burial ── */}
      <AbsoluteFill style={{ opacity: c }}>
        <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", opacity: interpolate(f, [186, 198], [0, 1], clamp) }}>
          <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.cream, textShadow: shade }}>Then he buried</div>
          <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>the question.</div>
        </div>

        {/* bubbles drop into the hole */}
        {[0, 1, 2, 3].map((i) => {
          const at = 194 + i * 8;
          const p = interpolate(f, [at, at + 26], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          return (
            <div key={i} style={{ position: "absolute", left: 330 + (i % 2) * 60, top: interpolate(p, [0, 1], [300, GROUND + 40]), rotate: `${(i % 2 ? 1 : -1) * p * 50}deg`, opacity: p >= 1 ? 0 : 1 }}>
              <Bubble size={0.8} />
            </div>
          );
        })}

        {/* the stone rises out of the ground */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, height: GROUND - 330, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <div style={{ translate: `0 ${rise * 700}px` }}>
            <Headstone width={580} height={640} shape={0} style={{ paddingTop: 140 }}>
              <div style={{ fontFamily: display, fontSize: 40 }}>R.I.P.</div>
              <div style={{ fontFamily: body, fontSize: 28, fontWeight: 600, marginTop: 8 }}>here lies the question</div>
              <div style={{ fontFamily: body, fontSize: 88, fontWeight: 700, lineHeight: 1, marginTop: 20, letterSpacing: "-0.02em" }}>“dex paid?”</div>
              <div style={{ width: 360, height: 4, background: C.stoneInk, opacity: 0.35, marginTop: 30, borderRadius: 2 }} />
              <div style={{ fontFamily: body, fontSize: 27, marginTop: 22, lineHeight: 1.4 }}>
                asked in every reply.
                <br />
                answered once.
              </div>
              <div style={{ fontFamily: mono, fontSize: 23, fontWeight: 700, marginTop: 22 }}>✝ {died}</div>
              <div style={{ fontFamily: display, fontSize: 21, marginTop: 10, color: "#3f5a1c" }}>CAUSE OF DEATH: DEX PAID ✓</div>
            </Headstone>
          </div>
        </div>
        {/* dirt kick */}
        {dirt
          ? new Array(10).fill(0).map((_, i) => {
              const t = (f - 236) / 26;
              const dx = (random(`dx${i}`) - 0.5) * 700 * t;
              const dy = -Math.sin(t * Math.PI) * (120 + random(`dy${i}`) * 140);
              return <div key={i} style={{ position: "absolute", left: 530 + dx, top: GROUND - 10 + dy, width: 18, height: 18, borderRadius: 6, background: "#5a3d2a", border: `3px solid ${C.ink}` }} />;
            })
          : null}
        <div style={{ position: "absolute", left: 40, right: 40, top: GROUND - 6, height: 30, borderRadius: 15, background: "#5a3d2a", border: `4px solid ${C.ink}` }} />
        {/* flowers */}
        {[
          { x: 250, c: C.sign, at: 282 },
          { x: 306, c: C.bulb, at: 288 },
          { x: 724, c: C.slime, at: 294 },
          { x: 780, c: C.sign, at: 300 },
        ].map((fl, i) => (
          <div key={i} style={{ position: "absolute", left: fl.x, top: GROUND - 88 }}>
            <Flower c={fl.c} s={interpolate(f, [fl.at, fl.at + 10], [0, 1], { ...clamp, easing: pop })} />
          </div>
        ))}
        <div style={{ position: "absolute", right: 60, top: GROUND - 70, opacity: interpolate(f, [290, 300], [0, 1], clamp) }}>
          <MortEyes size={24} grin={f > 304} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: GROUND + 70, textAlign: "center", fontFamily: display, fontSize: 28, color: C.dust, opacity: interpolate(f, [296, 308], [0, 1], clamp) }}>
          GRAVE #{graves + 1}? NO. THIS ONE’S A BONUS.
        </div>
      </AbsoluteFill>

      {/* ── D · next question ── */}
      <AbsoluteFill style={{ opacity: d, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ translate: `0 ${interpolate(f, [330, 354], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GraveMark size={170} glow />
          <div style={{ fontFamily: sign, fontSize: 72, color: C.cream, textShadow: shade, marginTop: 40 }}>Next question:</div>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.05, color: C.bulb, textShadow: shade, whiteSpace: "nowrap", scale: `${interpolate(f, [348, 362], [0.6, 1], { ...clamp, easing: pop })}` }}>
            “wen grave #{next}?”
          </div>
          <div style={{ fontFamily: display, fontSize: 32, color: C.cream, marginTop: 44 }}>
            {graves} GRAVES · {fmt(burned)} $GRAVE BURIED
          </div>
          <div style={{ fontFamily: display, fontSize: 28, color: C.slime, marginTop: 16 }}>DEX PAID ✓</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.dust, marginTop: 40 }}>GRAVEBURN.FUN</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
