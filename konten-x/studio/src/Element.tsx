import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type ElementProps = { readonly burned: number; readonly graves: number };

const Tile: React.FC<{ n: string; sym: string; name: string; tone: string; dim?: boolean; note?: string }> = ({ n, sym, name, tone, dim, note }) => (
  <div style={{ width: 150, height: 150, borderRadius: 12, background: tone, border: `4px solid ${C.ink}`, opacity: dim ? 0.55 : 1, padding: "8px 10px", display: "flex", flexDirection: "column", color: C.ink, position: "relative" }}>
    <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 18 }}>{n}</div>
    <div style={{ fontFamily: body, fontWeight: 900, fontSize: 58, lineHeight: 1, marginTop: 2, textAlign: "center", letterSpacing: "-0.03em" }}>{sym}</div>
    <div style={{ fontFamily: body, fontWeight: 700, fontSize: 18, textAlign: "center", marginTop: 6 }}>{name}</div>
    {note ? <div style={{ position: "absolute", left: -22, right: -22, top: 162, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 17, lineHeight: 1.3, color: C.dust }}>{note}</div> : null}
  </div>
);

/* ═════════ 60 · "New element discovered: Gravium (Gv)" (1080×1350) ═════════ */
export const PostElement: React.FC<ElementProps> = ({ burned, graves }) => {
  const pct = (burned / 1e9) * 100;
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={24} />

      <div style={{ position: "absolute", left: 50, right: 50, top: 50, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 28, color: C.slime }}>⚗ BREAKING SCIENCE ⚗</div>
        <div style={{ fontFamily: sign, fontSize: 70, lineHeight: 1.02, color: C.cream, marginTop: 8, whiteSpace: "nowrap" }}>New element discovered.</div>
      </div>

      {/* the big tile */}
      <div style={{ position: "absolute", left: 70, top: 250, width: 430, height: 500, borderRadius: 26, background: `linear-gradient(160deg, ${C.slime}, #6fd12a)`, border: `8px solid ${C.ink}`, boxShadow: "0 0 80px rgba(166,255,77,0.35), 0 40px 60px -30px rgba(0,0,0,0.9)", padding: "22px 28px", color: C.ink, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontWeight: 700, fontSize: 30 }}>
          <span>{graves}</span>
          <span style={{ fontSize: 22, opacity: 0.8 }}>burials</span>
        </div>
        <div style={{ fontFamily: body, fontWeight: 900, fontSize: 220, lineHeight: 1, letterSpacing: "-0.04em", textAlign: "center", marginTop: 6 }}>Gv</div>
        <div style={{ fontFamily: sign, fontSize: 60, lineHeight: 1, textAlign: "center", marginTop: 10 }}>Gravium</div>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, textAlign: "center", marginTop: 22 }}>{fmt(burned)}</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, textAlign: "center", opacity: 0.75 }}>atomic mass ($GRAVE buried)</div>
      </div>

      {/* properties sheet */}
      <div style={{ position: "absolute", left: 540, right: 60, top: 250, background: C.ticket, color: C.ink, borderRadius: 18, border: `5px solid ${C.ink}`, padding: "22px 26px", boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: display, fontSize: 26, color: C.sign }}>PROPERTIES</div>
        {[
          ["Group", "deflationary metals"],
          ["State at room temp.", "buried"],
          ["Half-life", "forever"],
          ["Found in", `0x…dEaD (${pct.toFixed(2)}%)`],
          ["Reactivity", "reacts violently with red candles"],
          ["Discovered by", "Mort, 2026"],
        ].map(([k, v]) => (
          <div key={k} style={{ borderBottom: `2px dashed ${C.ticketDim}`, padding: "10px 0" }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.ticketDim }}>{k}</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 27, lineHeight: 1.2, marginTop: 2 }}>{v}</div>
          </div>
        ))}
        <div style={{ fontFamily: body, fontStyle: "italic", fontSize: 19, marginTop: 12, color: C.ticketDim }}>does not occur naturally outside the graveyard.</div>
      </div>

      {/* neighbours on the table */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 880, fontFamily: display, fontSize: 22, color: C.dust }}>ITS NEIGHBOURS ON MORT’S PERIODIC TABLE</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 925, display: "flex", justifyContent: "space-between" }}>
        <Tile n="1" sym="Mo" name="Mort" tone={C.bulb} note="noble. never sells" />
        <Tile n="2" sym="Sh" name="Shovel" tone={C.stone} note="tool, not a metal" />
        <Tile n="3" sym="Dt" name="Dirt" tone="#b48a5e" note="always more of it" />
        <Tile n="4" sym="Rc" name="Red Candle" tone={C.sign} note="highly unstable" />
        <Tile n="0" sym="Ph" name="Paper Hands" tone="#6e6680" dim note="decays instantly" />
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={42} />
          <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: sign, fontSize: 32, color: C.bulb }}>“peer-reviewed by me.”</span>
          <MortEyes size={20} look={-0.5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
