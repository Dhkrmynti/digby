import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, MortEyes, Motes, Night, Ticket } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;

type DingProps = { readonly burned: number; readonly graves: number; readonly goalPct: number; readonly ringer: { n: number; tokens: number; tx: string } };

/* ═════════ 51 · "DING!" the 5% bell rang (1080×1350) ═════════ */
export const PostDing: React.FC<DingProps> = ({ burned, graves, goalPct, ringer }) => {
  const pct = (burned / 1e9) * 100;
  const TOP = 330;
  const BOT = 1150;
  const y = (p: number) => BOT - (p / goalPct) * (BOT - TOP);
  return (
    <AbsoluteFill>
      <Night glow={1.2} glowY="18%" />
      <Motes count={30} />

      {/* the bell, ringing */}
      <div style={{ position: "absolute", left: 100, top: 120, rotate: "-9deg" }}>
        <svg width="300" height="230" viewBox="-50 -10 300 230" style={{ overflow: "visible" }}>
          {/* shock lines */}
          {[
            [-40, 30, -10, 50],
            [-46, 90, -12, 92],
            [-36, 150, -6, 132],
            [240, 30, 210, 50],
            [246, 90, 212, 92],
            [236, 150, 206, 132],
          ].map(([x1, y1, x2, y2], i) => (
            <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={C.bulbHot} strokeWidth="9" strokeLinecap="round" />
          ))}
          <path d="M40 140 C40 60 70 26 100 26 C130 26 160 60 160 140 Z" fill={C.bulb} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 30px ${C.bulb})` }} />
          <rect x="24" y="136" width="152" height="22" rx="10" fill={C.bulb} stroke={C.ink} strokeWidth="7" />
          <circle cx="112" cy="168" r="12" fill={C.ink} />
          <text x="100" y="110" textAnchor="middle" fontFamily={display} fontSize="36" fill={C.ink}>{goalPct}%</text>
        </svg>
      </div>

      {/* the tower, full */}
      <div style={{ position: "absolute", left: 220, top: TOP, width: 60, height: BOT - TOP, borderRadius: 30, background: C.plum, border: `7px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 234, top: TOP + 8, width: 32, height: BOT - TOP - 16, borderRadius: 16, background: C.sign, boxShadow: `0 0 40px rgba(215,38,61,0.7)` }} />
      {[1, 2, 3, 4].map((p) => (
        <div key={p} style={{ position: "absolute", left: 100, top: y(p) - 18, width: 110, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: display, fontSize: 28, color: C.dust, width: 60, textAlign: "right" }}>{p}%</span>
          <span style={{ width: 36, height: 6, background: C.rail }} />
        </div>
      ))}
      {/* the puck, slammed into the bell */}
      <div style={{ position: "absolute", left: 200, top: TOP - 30, width: 100, height: 70, borderRadius: 18, background: C.sign, border: `7px solid ${C.ink}`, boxShadow: "0 0 50px rgba(255,207,58,0.9)" }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 296, top: TOP + 110 + i * 90 }}>
          <Bulb size={16} lit />
        </div>
      ))}
      {/* the hammer, dropped */}
      <svg width="260" height="120" viewBox="0 0 260 120" style={{ position: "absolute", left: 40, top: 1150, rotate: "-8deg" }}>
        <rect x="70" y="52" width="180" height="16" rx="8" fill="#8a5a3c" stroke={C.ink} strokeWidth="5" />
        <rect x="10" y="20" width="76" height="80" rx="12" fill={C.stone} stroke={C.ink} strokeWidth="6" />
      </svg>

      {/* DING */}
      <div style={{ position: "absolute", left: 440, right: 40, top: 70, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 168, lineHeight: 0.9, color: C.bulb, rotate: "-5deg", textShadow: `0 10px 0 ${C.signDeep}, 0 0 60px rgba(255,207,58,0.45)` }}>DING!</div>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.02, color: C.cream, marginTop: 40, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>5% buried.</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 32, lineHeight: 1.35, color: C.dust, marginTop: 22 }}>
          <span style={{ color: C.cream }}>{fmt(burned)} $GRAVE</span>
          <br />
          {pct.toFixed(2)}% of supply · {graves} graves
        </div>
      </div>

      {/* the prize ticket */}
      <div style={{ position: "absolute", left: 470, top: 600, rotate: "3deg" }}>
        <Ticket width={540}>
          <div style={{ padding: "30px 50px", textAlign: "center", color: C.ink }}>
            <div style={{ fontFamily: display, fontSize: 26, color: C.sign }}>★ WINNER ★</div>
            <div style={{ fontFamily: sign, fontSize: 46, lineHeight: 1.05, marginTop: 8 }}>Your prize:</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 30, lineHeight: 1.3, marginTop: 10 }}>
              nothing comes back.
              <br />
              ever.
            </div>
            <div style={{ height: 0, borderTop: `3px dashed ${C.ticketDim}`, margin: "20px 0 14px" }} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.ticketDim }}>
              bell rung by grave #{ringer.n}
              <br />
              {fmt(ringer.tokens)} $GRAVE
            </div>
            <div style={{ fontFamily: mono, fontSize: 20, color: C.ticketDim, marginTop: 4 }}>tx {short(ringer.tx)}</div>
          </div>
        </Ticket>
      </div>

      {/* Mort moves the bell */}
      <div style={{ position: "absolute", left: 470, right: 50, top: 1010, display: "flex", alignItems: "center", gap: 22 }}>
        <MortEyes size={28} look={-0.8} />
        <div style={{ fontFamily: sign, fontSize: 40, lineHeight: 1.1, color: C.bulb }}>
          “nice. now move
          <br />
          the bell to 10%.”
        </div>
      </div>

      <div style={{ position: "absolute", left: 470, right: 40, top: 1180, display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={46} />
        <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: body, fontSize: 22, color: C.dustDim, fontStyle: "italic" }}>
        every burial verifiable on-chain at 0x…dEaD
      </div>
    </AbsoluteFill>
  );
};
