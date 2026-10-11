import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type BackProps = { readonly buys: number; readonly sells: number; readonly netM: number; readonly window: string; readonly burned: number };

/** A green candle clawing out of a grave. */
const RisingCandle: React.FC<{ x: number; base: number; h: number; tilt: number }> = ({ x, base, h, tilt }) => (
  <div style={{ position: "absolute", left: x, top: base - h, rotate: `${tilt}deg`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", left: 30, top: -40, width: 10, height: h + 40, background: C.slime, border: `3px solid ${C.ink}`, borderRadius: 5 }} />
    <div style={{ position: "relative", width: 70, height: h, borderRadius: 12, background: C.slime, border: `6px solid ${C.ink}`, boxShadow: "0 0 30px rgba(166,255,77,0.55)" }} />
  </div>
);

/* ═════════ 45 · "Back from the dead." GRAVE is green again (1080×1350) ═════════ */
export const PostBackFromDead: React.FC<BackProps> = ({ buys, sells, netM, window, burned }) => (
  <AbsoluteFill>
    <Night glow={1} glowY="15%" />
    <Motes count={36} />

    {/* the moon with Mort's eyes */}
    <div style={{ position: "absolute", right: 70, top: 70, width: 250, height: 250, borderRadius: "50%", background: "#f6eedd", border: `8px solid ${C.ink}`, boxShadow: "0 0 80px rgba(246,238,221,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: 50, top: 60, width: 40, height: 40, borderRadius: "50%", background: "#e2d6bd" }} />
      <div style={{ position: "absolute", left: 150, top: 150, width: 56, height: 56, borderRadius: "50%", background: "#e2d6bd" }} />
      <div style={{ position: "absolute", left: 140, top: 50, width: 26, height: 26, borderRadius: "50%", background: "#e2d6bd" }} />
    </div>

    {/* coffin rocket on its way */}
    <div style={{ position: "absolute", left: 560, top: 330, rotate: "40deg" }}>
      <svg width="200" height="300" viewBox="0 0 200 300">
        <path d="M70 230 Q100 300 130 230 Q120 280 100 300 Q80 280 70 230 Z" fill={C.bulb} stroke={C.ink} strokeWidth="5" />
        <path d="M60 30 L140 30 L160 90 L130 240 L70 240 L40 90 Z" fill="#6b4226" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
        <path d="M100 70 V160 M75 100 H125" stroke={C.bulb} strokeWidth="9" strokeLinecap="round" />
        <path d="M40 90 L10 170 L60 150" fill={C.sign} stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
        <path d="M160 90 L190 170 L140 150" fill={C.sign} stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
      </svg>
    </div>

    {/* title */}
    <div style={{ position: "absolute", left: 70, top: 80, width: 600 }}>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 0.95, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>Back from</div>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 0.95, color: C.slime, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>the dead.</div>
      <div style={{ fontFamily: display, fontSize: 40, color: C.bulb, marginTop: 24 }}>$GRAVE IS GREEN AGAIN.</div>
    </div>

    {/* green candles rising out of the graves */}
    <RisingCandle x={110} base={980} h={260} tilt={-6} />
    <RisingCandle x={330} base={980} h={360} tilt={4} />
    <RisingCandle x={560} base={980} h={470} tilt={-3} />
    <RisingCandle x={790} base={980} h={590} tilt={5} />
    {[70, 290, 520, 750].map((x, i) => (
      <div key={x} style={{ position: "absolute", left: x + 10, top: 960 }}>
        <Headstone width={150} height={120} shape={(i % 2) as 0 | 1} style={{ paddingTop: 40 }}>
          <div style={{ fontFamily: display, fontSize: 18 }}>R.I.P.</div>
          <div style={{ fontFamily: display, fontSize: 14 }}>red candle</div>
        </Headstone>
      </div>
    ))}
    {/* dirt flying off the open graves */}
    <div style={{ position: "absolute", left: 40, right: 40, top: 1070, height: 26, borderRadius: 13, background: "#3a2418" }} />

    {/* the proof */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 1116, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(14,7,20,0.8)", border: `3px solid ${C.slime}`, borderRadius: 16, padding: "14px 22px" }}>
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.cream }}>
        {window}: <span style={{ color: C.slime }}>{buys} buys</span> · {sells} sells
      </span>
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.slime }}>+{netM.toFixed(1)}M net bought</span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={46} />
        <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <span style={{ fontFamily: body, fontSize: 22, color: C.dustDim, fontStyle: "italic" }}>{fmt(burned)} $GRAVE still buried · NFA</span>
      <MortEyes size={22} grin />
    </div>
  </AbsoluteFill>
);
