import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type DeparturesProps = { readonly burned: number; readonly buys: number; readonly sells: number; readonly window: string };

/** A split-flap cell row: each character on its own little flap. */
const Flaps: React.FC<{ text: string; color: string; size?: number }> = ({ text, color, size = 34 }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {text.split("").map((ch, i) => (
      <div
        key={i}
        style={{
          width: size * 0.78,
          height: size * 1.3,
          borderRadius: 4,
          background: "linear-gradient(180deg, #1d1428 0 49%, #0b0610 49% 51%, #170f20 51% 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: mono,
          fontWeight: 700,
          fontSize: size,
          color,
        }}
      >
        {ch === " " ? "" : ch}
      </div>
    ))}
  </div>
);

/* ═════════ 52 · "Bearish → Bullish." Mort's departure board (1080×1350) ═════════ */
export const PostDepartures: React.FC<DeparturesProps> = ({ burned, buys, sells, window }) => {
  const rows = [
    { time: "NOW ", train: "BEAR EXPRESS", to: "0x…dEaD   ", status: "DEPARTED", color: C.sign, icon: "🐻" },
    { time: "SOON", train: "BULL RUN    ", to: "THE MOON  ", status: "BOARDING", color: C.slime, icon: "🐂" },
  ];
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={24} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 28, color: C.sign, letterSpacing: "0.04em" }}>• MORT’S GHOST TRAIN · STATION BOARD •</div>
        <div style={{ fontFamily: sign, fontSize: 100, lineHeight: 1.02, color: C.cream, marginTop: 16, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>
          Bearish <span style={{ color: C.dust }}>→</span>
        </div>
        <div style={{ fontFamily: sign, fontSize: 100, lineHeight: 1.02, color: C.slime, textShadow: "0 5px 0 rgba(42,22,38,0.6), 0 0 40px rgba(166,255,77,0.35)" }}>Bullish.</div>
        <div style={{ fontFamily: body, fontWeight: 600, fontSize: 32, color: C.dust, marginTop: 14 }}>the bear just caught the last train to the graveyard.</div>
      </div>

      {/* the board */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 450, borderRadius: 20, background: "#0b0610", border: `8px solid ${C.ink}`, boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9), inset 0 0 0 3px #2a1838", padding: "26px 26px 30px" }}>
        {/* bulbs on the frame */}
        <div style={{ position: "absolute", left: 30, right: 30, top: -14, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 13 }).map((_, i) => (
            <Bulb key={i} size={18} lit={i % 2 === 0} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: display, fontSize: 22, color: C.bulb, padding: "0 6px 14px", borderBottom: `3px solid #2a1838` }}>
          <span style={{ width: 120 }}>TIME</span>
          <span style={{ flex: 1, paddingLeft: 60 }}>TRAIN</span>
          <span style={{ width: 200, textAlign: "right" }}>STATUS</span>
        </div>
        {rows.map((r) => (
          <div key={r.train} style={{ padding: "22px 6px", borderBottom: `3px solid #2a1838` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Flaps text={r.time} color={C.cream} size={28} />
              <span style={{ fontSize: 42 }}>{r.icon}</span>
              <Flaps text={r.train} color={C.cream} size={28} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.dust }}>
                to <Flaps text={r.to} color={C.bulb} size={26} />
              </div>
              <div style={{ border: `4px solid ${r.color}`, borderRadius: 8, padding: "6px 14px", fontFamily: display, fontSize: 30, color: r.color, boxShadow: r.color === C.slime ? `0 0 24px rgba(166,255,77,0.45)` : "none", rotate: r.color === C.sign ? "-4deg" : "0deg" }}>
                {r.status}
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 18, fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.bulb, textAlign: "center" }}>
          ⚠ next departure: minutes away. mind the gap. ⚠
        </div>
      </div>

      {/* proof strip */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 1035, display: "flex", justifyContent: "center", gap: 14, fontFamily: mono, fontWeight: 700, fontSize: 25 }}>
        <span style={{ background: C.ticket, color: C.ink, padding: "8px 16px", borderRadius: 8 }}>{window}: {buys} buys · {sells} sells</span>
        <span style={{ background: C.plum, color: C.cream, padding: "8px 16px", borderRadius: 8 }}>{fmt(burned)} $GRAVE buried</span>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <MortEyes size={26} look={0.4} />
        <span style={{ fontFamily: sign, fontSize: 46, color: C.bulb }}>“all aboard.”</span>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={46} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <span style={{ fontFamily: body, fontSize: 22, color: C.dustDim, fontStyle: "italic" }}>NFA · train times are vibes</span>
      </div>
    </AbsoluteFill>
  );
};
