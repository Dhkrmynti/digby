import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, MortEyes, Motes, Night, SignBoard } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type ClearanceProps = { readonly window: string; readonly sells: number; readonly soldM: number; readonly buys: number; readonly boughtM: number; readonly burned: number };

const CANDLES: [number, number][] = [
  [250, 300], [300, 345], [330, 390], [380, 430], [410, 470], [450, 520], [500, 590], [560, 690],
];

/* ═════════ 45 · RED CANDLE CLEARANCE: time to scoop (1080×1350) ═════════ */
export const PostClearance: React.FC<ClearanceProps> = ({ window, sells, soldM, buys, boughtM, burned }) => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={26} />

    {/* the hanging clearance sign */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 120, top: -30, width: 5, height: 40, background: C.rail }} />
        <div style={{ position: "absolute", right: 120, top: -30, width: 5, height: 40, background: C.rail }} />
        <SignBoard style={{ padding: "26px 60px 30px", textAlign: "center", rotate: "-2deg" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 10 }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <Bulb key={i} size={16} lit={i % 2 === 0} />
            ))}
          </div>
          <div style={{ fontFamily: display, fontSize: 70, lineHeight: 1, color: C.cream }}>RED CANDLE</div>
          <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.bulb }}>CLEARANCE</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: C.cream, marginTop: 8 }}>everything must go (six feet down)</div>
        </SignBoard>
      </div>
    </div>

    {/* the chart diving into the dirt */}
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{ position: "absolute", inset: 0 }}>
      {CANDLES.map(([top, bottom], i) => {
        const x = 90 + i * 72;
        return (
          <g key={i}>
            <path d={`M${x + 22} ${top + 70} V${bottom + 120}`} stroke={C.sign} strokeWidth="5" />
            <rect x={x} y={top + 90} width="44" height={bottom - top} rx="6" fill={C.sign} stroke={C.ink} strokeWidth="4" />
          </g>
        );
      })}
      {/* dirt mound with the last candle sinking in */}
      <path d="M420 1010 Q660 820 1080 900 V1060 H420 Z" fill="#5a3d2a" stroke={C.ink} strokeWidth="6" />
      <path d="M520 960 Q700 870 900 900" fill="none" stroke="#7a5236" strokeWidth="10" strokeLinecap="round" />
      {/* the shovel stuck in it */}
      <g transform="translate(820 600) rotate(18)">
        <rect x="-8" y="0" width="16" height="250" rx="7" fill="#8a5a33" stroke={C.ink} strokeWidth="5" />
        <rect x="-30" y="-14" width="60" height="22" rx="10" fill="#8a5a33" stroke={C.ink} strokeWidth="5" />
        <path d="M-40 246 h80 v46 q-40 54 -80 0 Z" fill="#8f879a" stroke={C.ink} strokeWidth="5" />
      </g>
      {/* SCOOP HERE flag */}
      <g transform="translate(640 830) rotate(-6)">
        <path d="M0 0 V-120" stroke={C.cream} strokeWidth="5" />
        <path d="M0 -120 H150 L130 -95 L150 -70 H0 Z" fill={C.bulb} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
        <text x="66" y="-88" textAnchor="middle" fontFamily={display} fontSize="24" fill={C.ink}>SCOOP</text>
      </g>
    </svg>

    {/* Mort, delighted */}
    <div style={{ position: "absolute", left: 930, top: 540 }}>
      <MortEyes size={30} grin />
    </div>

    {/* the line */}
    <div style={{ position: "absolute", left: 70, right: 70, top: 1070, textAlign: "left" }}>
      <div style={{ fontFamily: sign, fontSize: 66, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>
        It’s red. <span style={{ color: C.bulb }}>Grab a shovel.</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1170, display: "flex", justifyContent: "space-between", background: "rgba(14,7,20,0.85)", border: `3px solid ${C.sign}`, borderRadius: 14, padding: "12px 20px" }}>
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.cream }}>
        {window}: <span style={{ color: C.sign }}>{sells} sells dumped {soldM.toFixed(0)}M</span>
      </span>
      <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.cream }}>
        {buys} buys took {boughtM.toFixed(0)}M
      </span>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={44} />
        <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <span style={{ fontFamily: body, fontSize: 21, color: C.dustDim, fontStyle: "italic" }}>{fmt(burned)} $GRAVE buried · NFA, gravedigger advice</span>
    </div>
  </AbsoluteFill>
);
