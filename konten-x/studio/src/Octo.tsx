import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type OctoProps = { readonly burned: number; readonly graves: number };

const Side: React.FC<{ emoji: string; size: number; word: string; vote: string; tone: string; deep: string; tilt: string }> = ({ emoji, size, word, vote, tone, deep, tilt }) => (
  <div style={{ flex: 1, height: 580, borderRadius: 28, background: `linear-gradient(180deg, ${tone}, ${deep})`, border: `7px solid ${C.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "34px 10px 30px", rotate: tilt, boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
    <div style={{ fontSize: size, lineHeight: 1, height: 250, display: "flex", alignItems: "center" }}>{emoji}</div>
    <div style={{ fontFamily: display, fontSize: 62, color: C.cream, textShadow: "0 5px 0 rgba(14,7,20,0.55)" }}>{word}</div>
    <div style={{ background: C.cream, color: C.ink, borderRadius: 999, padding: "10px 26px", fontFamily: display, fontSize: 30 }}>{vote}</div>
  </div>
);

/* ═════════ 62 · "OCTOBULL or OCTOBEAR?" (1080×1350) ═════════ */
export const PostOcto: React.FC<OctoProps> = ({ burned, graves }) => (
  <AbsoluteFill>
    <Night glow={0.9} />
    <Motes count={24} />

    {/* calendar tab */}
    <div style={{ position: "absolute", left: 340, right: 340, top: 40, height: 64, borderRadius: "16px 16px 0 0", background: C.sign, border: `5px solid ${C.ink}`, borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 30, color: C.cream }}>
      OCTOBER 2026
    </div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 104, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 108, lineHeight: 1, color: C.cream, textShadow: "0 6px 0 rgba(42,22,38,0.7)" }}>
        <span style={{ color: C.slime }}>Octobull</span> or <span style={{ color: C.sign }}>Octobear</span>?
      </div>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: 30, color: C.dust, marginTop: 14 }}>pick one. no fence-sitting in the graveyard.</div>
    </div>

    <div style={{ position: "absolute", left: 50, right: 50, top: 395, display: "flex", gap: 40, alignItems: "center" }}>
      <Side emoji="🐂" size={300} word="OCTOBULL" vote="❤️ LIKE" tone="#7fcf3a" deep="#2f6b14" tilt="-2deg" />
      <Side emoji="🐻" size={220} word="OCTOBEAR" vote="🔁 REPOST" tone="#e0465a" deep="#7a1020" tilt="2deg" />
    </div>
    {/* VS badge */}
    <div style={{ position: "absolute", left: 540 - 72, top: 612, width: 144, height: 144, borderRadius: "50%", background: C.bulb, border: `7px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 58, color: C.ink, boxShadow: "0 0 50px rgba(255,207,58,0.6)" }}>
      VS
    </div>

    {/* Mort's answer */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 1000, display: "flex", alignItems: "center", gap: 30 }}>
      <Headstone width={150} height={170} shape={0} style={{ paddingTop: 54, flexShrink: 0 }}>
        <div style={{ fontFamily: display, fontSize: 20 }}>R.I.P.</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 16, marginTop: 4 }}>supply</div>
      </Headstone>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <MortEyes size={24} look={0.3} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>MORT’S ANSWER:</span>
        </div>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1, color: C.bulb, marginTop: 8 }}>Octobury.</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: C.cream, marginTop: 10 }}>
          he digs either way. {graves} burials · {fmt(burned)} $GRAVE so far.
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={42} />
        <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <span style={{ fontFamily: body, fontSize: 21, color: C.dustDim, fontStyle: "italic" }}>a vote, not a prediction · NFA</span>
    </div>
  </AbsoluteFill>
);
