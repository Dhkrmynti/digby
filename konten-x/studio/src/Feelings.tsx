import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type Eyes = "dot" | "happy" | "x" | "star" | "wide" | "up" | "angry";
type Mouth = "smile" | "grin" | "flat" | "wavy" | "o";
type Mood = { readonly label: string; readonly eyes: Eyes; readonly mouth: Mouth; readonly sweat?: boolean; readonly tint?: string };

/** A headstone with a face. */
const Face: React.FC<{ m: Mood }> = ({ m }) => {
  const ink = C.stoneInk;
  const eye = (cx: number) => {
    switch (m.eyes) {
      case "happy":
        return <path d={`M${cx - 9} 62 Q${cx} 50 ${cx + 9} 62`} stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
      case "x":
        return <path d={`M${cx - 8} 50 L${cx + 8} 66 M${cx + 8} 50 L${cx - 8} 66`} stroke={ink} strokeWidth="5" strokeLinecap="round" />;
      case "star":
        return <path d={`M${cx} 46 L${cx + 4} 55 L${cx + 13} 56 L${cx + 6} 62 L${cx + 8} 71 L${cx} 66 L${cx - 8} 71 L${cx - 6} 62 L${cx - 13} 56 L${cx - 4} 55 Z`} fill={C.bulb} stroke={ink} strokeWidth="2.5" />;
      case "wide":
        return (
          <g>
            <circle cx={cx} cy={58} r={11} fill="#fffaf0" stroke={ink} strokeWidth="3.5" />
            <circle cx={cx} cy={58} r={4} fill={ink} />
          </g>
        );
      case "up":
        return (
          <g>
            <ellipse cx={cx} cy={58} rx={7} ry={9} fill={ink} />
            <circle cx={cx + 1} cy={52} r={2.6} fill={C.bulb} />
          </g>
        );
      case "angry":
        return (
          <g>
            <ellipse cx={cx} cy={60} rx={6} ry={7} fill={ink} />
            <path d={cx < 60 ? `M${cx - 10} 46 L${cx + 8} 52` : `M${cx + 10} 46 L${cx - 8} 52`} stroke={ink} strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      default:
        return (
          <g>
            <ellipse cx={cx} cy={58} rx={7} ry={9} fill={ink} />
            <circle cx={cx + 1.5} cy={55} r={2.4} fill={C.bulb} />
          </g>
        );
    }
  };
  const mouth = () => {
    switch (m.mouth) {
      case "grin":
        return <path d="M40 84 Q60 108 80 84 Z" fill={ink} />;
      case "flat":
        return <path d="M46 90 H74" stroke={ink} strokeWidth="5" strokeLinecap="round" />;
      case "wavy":
        return <path d="M42 92 q6 -8 12 0 t12 0 t12 0" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
      case "o":
        return <ellipse cx="60" cy="92" rx="7" ry="9" fill={ink} />;
      default:
        return <path d="M44 86 Q60 100 76 86" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" />;
    }
  };
  return (
    <svg width="150" height="150" viewBox="0 0 120 130">
      <path d="M14 126 V52 C14 22 34 6 60 6 C86 6 106 22 106 52 V126 Z" fill={m.tint || C.stone} stroke={ink} strokeWidth="5" />
      <rect x="4" y="118" width="112" height="10" rx="3" fill="#3a2433" />
      {eye(44)}
      {eye(76)}
      {mouth()}
      {m.sweat ? <path d="M98 40 q6 10 0 16 q-6 -6 0 -16 Z" fill="#7fd3ff" stroke={ink} strokeWidth="2" /> : null}
    </svg>
  );
};

type FeelingsProps = { readonly burned: number; readonly graves: number };

const MOODS: Mood[] = [
  { label: "bullish & buried", eyes: "dot", mouth: "grin", tint: "#a7d27a" },
  { label: "diamond bones", eyes: "star", mouth: "smile" },
  { label: "touching graveyard grass", eyes: "happy", mouth: "smile" },
  { label: "refreshing 0x…dEaD every 5 min", eyes: "wide", mouth: "o" },
  { label: "“should’ve bought more”", eyes: "dot", mouth: "wavy", sweat: true },
  { label: "already picked my plot", eyes: "happy", mouth: "grin", tint: C.ticket },
  { label: "red candle? scoop szn", eyes: "angry", mouth: "flat" },
  { label: "waiting for the 10% bell", eyes: "up", mouth: "o" },
  { label: "dead inside (in a good way)", eyes: "x", mouth: "smile", tint: "#b9a6c9" },
];

/* ═════════ 57 · "1 day as a $GRAVE holder. how we feeling, gravers?" (1080×1350) ═════════ */
export const PostFeelings: React.FC<FeelingsProps> = ({ burned, graves }) => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={22} />

    <div style={{ position: "absolute", left: 50, right: 50, top: 46, textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 28, color: C.slime }}>DAY 1 AS A $GRAVE HOLDER</div>
      <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.02, color: C.cream, marginTop: 8 }}>how we feeling,</div>
      <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.02, color: C.bulb }}>gravers?</div>
    </div>

    <div style={{ position: "absolute", left: 50, right: 50, top: 300, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
      {MOODS.map((m, i) => (
        <div key={m.label} style={{ background: "rgba(42,24,56,0.85)", border: `3px solid ${C.plumLine}`, borderRadius: 20, padding: "14px 10px 16px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: 10, width: 46, height: 46, borderRadius: "50%", background: C.bulb, color: C.ink, fontFamily: display, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <Face m={m} />
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: C.cream, textAlign: "center", marginTop: 6, minHeight: 60, display: "flex", alignItems: "center" }}>{m.label}</div>
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 50, right: 50, top: 1135, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: C.bulb, color: C.ink, fontFamily: display, fontSize: 34, padding: "10px 26px", borderRadius: 12, rotate: "-1.5deg" }}>REPLY WITH YOUR NUMBER ↓</span>
    </div>

    <div style={{ position: "absolute", left: 60, right: 60, bottom: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={42} />
        <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 24, color: C.dust }}>
          day 1: {graves} graves · {fmt(burned)} buried
        </span>
        <MortEyes size={20} look={-0.4} />
      </div>
    </div>
  </AbsoluteFill>
);
