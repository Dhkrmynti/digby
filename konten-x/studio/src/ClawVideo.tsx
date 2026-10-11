import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, Coin, GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type ClawProps = { readonly before: number; readonly after: number; readonly graves: number; readonly lastTokens: number };

// cabinet geometry
const CAB_L = 130;
const CAB_R = 950;
const RAIL_Y = 380;
const CHUTE_X = 270;
const PILE_X = 690;

/** The claw: a hub with two prongs; `open` 0 closed .. 1 open. */
const Claw: React.FC<{ x: number; y: number; open: number }> = ({ x, y, open }) => {
  const a = 8 + open * 28;
  return (
    <svg width="160" height="150" viewBox="-80 -20 160 150" style={{ position: "absolute", left: x - 80, top: y - 20, overflow: "visible" }}>
      <rect x="-26" y="-14" width="52" height="34" rx="8" fill={C.rail} stroke={C.ink} strokeWidth="5" />
      <circle cx="0" cy="22" r="10" fill={C.bulb} stroke={C.ink} strokeWidth="4" />
      {[-1, 1].map((s) => (
        <g key={s} transform={`rotate(${s * a} 0 22)`}>
          <path d={`M0 22 L${s * 30} 72 L${s * 16} 112`} stroke={C.ink} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M0 22 L${s * 30} 72 L${s * 16} 112`} stroke="#c9c2d6" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
};

/* ═════════ 59 · Video: Mort's claw machine (1080×1350, 14 s) ═════════ */
export const ClawVideo: React.FC<ClawProps> = ({ before, after, graves, lastTokens }) => {
  const f = useCurrentFrame();

  // claw path
  const x = interpolate(f, [0, 30, 66, 168, 214], [520, 520, PILE_X, PILE_X, CHUTE_X], { ...clamp, easing: ease });
  const wobble = f >= 128 && f < 214 ? Math.sin(f / 3.2) * interpolate(f, [128, 214], [10, 3], clamp) : 0;
  const drop = interpolate(f, [70, 108, 126, 164], [0, 420, 420, 60], { ...clamp, easing: ease });
  const clawY = RAIL_Y + 40 + drop;
  const open = f < 70 ? 0.7 : f < 108 ? 1 : f < 122 ? interpolate(f, [108, 122], [1, 0.1], clamp) : f < 216 ? 0.1 : interpolate(f, [216, 224], [0.1, 1], clamp);
  const holding = f >= 120 && f < 222;
  const fall = interpolate(f, [222, 250], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });

  const counter = interpolate(f, [248, 292], [before, after], { ...clamp, easing: ease });
  const buried = f >= 248;
  const flash = interpolate(f, [248, 252, 266], [0, 0.6, 0], clamp);

  const scene = interpolate(f, [0, 8, 330, 346], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [340, 356], [0, 1], clamp);

  const hook = interpolate(f, [0, 10, 56, 66], [0, 1, 1, 0], clamp);
  const caption = (text: string, a: number, b: number) => {
    const o = interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], clamp);
    return o > 0 ? (
      <div key={text} style={{ position: "absolute", left: 50, right: 50, top: 1160, textAlign: "center", opacity: o }}>
        <span style={{ display: "inline-block", background: "rgba(14,7,20,0.88)", padding: "12px 26px", borderRadius: 12, fontFamily: body, fontWeight: 700, fontSize: 42, color: C.cream }}>{text}</span>
      </div>
    ) : null;
  };

  // pile coins (the three on top get grabbed)
  const pile = Array.from({ length: 16 }).map((_, i) => {
    const row = i < 6 ? 0 : i < 11 ? 1 : i < 14 ? 2 : 3;
    const inRow = [0, 6, 11, 14][row];
    const n = [6, 5, 3, 2][row];
    return { x: PILE_X - (n * 62) / 2 + (i - inRow) * 62 + 31, y: 1000 - row * 46, i };
  });
  const grabbed = new Set([12, 14, 15]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <AbsoluteFill style={{ opacity: scene }}>
        <Night glow={0.9} glowY="10%" />
        <Motes count={18} />

        {/* marquee with the live counter */}
        <div style={{ position: "absolute", left: CAB_L - 20, right: 1080 - CAB_R - 20, top: 120, height: 200, borderRadius: 26, background: C.sign, border: `8px solid ${C.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px rgba(215,38,61,0.45)" }}>
          <div style={{ position: "absolute", inset: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }}>
            {Array.from({ length: 13 }).map((_, i) => (
              <Bulb key={i} size={14} lit={(i + Math.floor(f / 6)) % 2 === 0} />
            ))}
          </div>
          <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1, color: C.cream }}>Mort’s Claw</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.bulb, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
            BURIED: {fmt(buried ? counter : before)} $GRAVE
          </div>
        </div>

        {/* the cabinet */}
        <div style={{ position: "absolute", left: CAB_L, right: 1080 - CAB_R, top: 330, height: 790, borderRadius: 20, background: "linear-gradient(180deg, rgba(42,24,56,0.55), rgba(14,7,20,0.85))", border: `10px solid ${C.ink}`, boxShadow: "inset 0 0 0 4px #463056" }} />
        {/* glass glare */}
        <div style={{ position: "absolute", left: CAB_L + 40, top: 380, width: 40, height: 600, background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0))", rotate: "8deg" }} />
        {/* rail */}
        <div style={{ position: "absolute", left: CAB_L + 20, right: 1080 - CAB_R + 20, top: RAIL_Y, height: 14, borderRadius: 7, background: C.rail, border: `3px solid ${C.ink}` }} />

        {/* chute to the dead address */}
        <div style={{ position: "absolute", left: CHUTE_X - 95, top: 860, width: 190, height: 250, background: "#0b0610", border: `8px solid ${C.ink}`, borderTop: "none", borderRadius: "0 0 14px 14px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 18 }}>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.bulb }}>0x…dEaD</span>
        </div>
        <div style={{ position: "absolute", left: CHUTE_X - 105, top: 852, width: 210, height: 16, borderRadius: 8, background: C.bulb, border: `4px solid ${C.ink}` }} />
        <div style={{ position: "absolute", left: CHUTE_X - 60, top: 905, fontFamily: display, fontSize: 22, color: C.dust }}>↓ DROP</div>

        {/* supply label and pile */}
        <div style={{ position: "absolute", left: PILE_X - 110, top: 1040, width: 220, textAlign: "center", fontFamily: display, fontSize: 22, color: C.dust }}>SUPPLY</div>
        {pile.map((c) => (grabbed.has(c.i) && f >= 120 ? null : <Coin key={c.i} size={70} style={{ position: "absolute", left: c.x - 35, top: c.y - 35 }} />))}

        {/* the cable and claw */}
        <div style={{ position: "absolute", left: x + wobble * 0.3 - 3, top: RAIL_Y + 10, width: 6, height: clawY - RAIL_Y - 10, background: "#c9c2d6" }} />
        <div style={{ position: "absolute", left: x - 34, top: RAIL_Y - 14, width: 68, height: 30, borderRadius: 8, background: C.rail, border: `4px solid ${C.ink}` }} />
        <div style={{ position: "absolute", left: 0, top: 0, rotate: `${wobble * 0.4}deg`, transformOrigin: `${x}px ${RAIL_Y}px`, width: 1080, height: 1350 }}>
          {/* coins in the claw, then falling into the chute */}
          {holding || (f >= 222 && fall < 1)
            ? [-26, 0, 26].map((dx, k) => {
                const hx = x + dx;
                const hy = clawY + 96 - (k === 1 ? 18 : 0);
                const ty = 900 + k * 4;
                const yy = holding ? hy : hy + (ty - hy) * fall;
                const xx = holding ? hx : hx + (CHUTE_X + dx * 0.4 - hx) * fall;
                return <Coin key={k} size={66} style={{ position: "absolute", left: xx - 33, top: yy - 33, rotate: `${f * (k - 1) * 4}deg` }} />;
              })
            : null}
          <Claw x={x} y={clawY} open={open} />
        </div>

        {/* BURIED pop */}
        {f >= 248 && f < 330 ? (
          <div style={{ position: "absolute", left: CHUTE_X - 40, top: 720, rotate: "-10deg", scale: `${interpolate(f, [248, 262], [0.3, 1], { ...clamp, easing: pop })}`, fontFamily: display, fontSize: 64, color: C.slime, textShadow: "0 6px 0 rgba(14,7,20,0.8)" }}>
            BURIED!
          </div>
        ) : null}
        {f >= 262 && f < 330 ? (
          <div style={{ position: "absolute", left: CHUTE_X - 40, top: 800, fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.cream, opacity: interpolate(f, [262, 270], [0, 1], clamp) }}>
            +{fmt(lastTokens)} $GRAVE
          </div>
        ) : null}

        {/* hook and captions */}
        <div style={{ position: "absolute", left: 50, right: 50, top: 1150, textAlign: "center", opacity: hook }}>
          <span style={{ display: "inline-block", background: C.bulb, color: C.ink, padding: "12px 28px", borderRadius: 12, fontFamily: display, fontSize: 42, rotate: "-2deg" }}>MORT FOUND A CLAW MACHINE.</span>
        </div>
        {caption("claw machines never win…", 74, 160)}
        {caption("…unless you’re Mort.", 166, 244)}
        {caption(`grave #${graves}. real burial, on-chain.`, 270, 334)}

        <AbsoluteFill style={{ background: C.slime, opacity: flash * 0.5, pointerEvents: "none" }} />
        {flash > 0.2
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: "absolute", left: CHUTE_X - 60 + random(`s${i}`) * 120, top: 820 - random(`t${i}`) * 80, width: 14, height: 14, borderRadius: "50%", background: C.bulb }} />
            ))
          : null}
      </AbsoluteFill>

      {/* end card */}
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ translate: `0 ${interpolate(f, [340, 364], [40, 0], { ...clamp, easing: ease })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Headstone width={170} height={200} shape={0} style={{ paddingTop: 70 }}>
            <div style={{ fontFamily: display, fontSize: 22 }}>#{graves}</div>
          </Headstone>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.02, color: C.cream, marginTop: 36 }}>Mort never</div>
          <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.02, color: C.bulb }}>misses.</div>
          <div style={{ fontFamily: display, fontSize: 34, color: C.cream, marginTop: 36 }}>
            {graves} GRAVES · {fmt(after)} $GRAVE
          </div>
          <div style={{ fontFamily: display, fontSize: 28, color: C.slime, marginTop: 10 }}>{((after / 1e9) * 100).toFixed(2)}% OF SUPPLY BURIED</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 40 }}>
            <GraveMark size={46} />
            <span style={{ fontFamily: display, fontSize: 30, color: C.dust }}>GRAVEBURN.FUN</span>
          </div>
          <div style={{ marginTop: 26 }}>
            <MortEyes size={26} look={0} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
