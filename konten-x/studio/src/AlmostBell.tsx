import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;

type AlmostBellProps = { readonly burned: number; readonly graves: number; readonly latest: { n: number; tokens: number; tx: string }; readonly goalPct: number };

/* ═════════ 44 · "This close to the bell." 5% high striker (1080×1350) ═════════ */
export const PostAlmostBell: React.FC<AlmostBellProps> = ({ burned, graves, latest, goalPct }) => {
  const pct = (burned / 1e9) * 100;
  const toGo = Math.max(0, (goalPct / 100) * 1e9 - burned);
  const TOP = 290; // tower top (y of the bell base)
  const BOT = 1150; // tower base
  const y = (p: number) => BOT - (p / goalPct) * (BOT - TOP);
  const puckY = y(pct);
  return (
    <AbsoluteFill>
      <Night glow={0.9} glowY="20%" />
      <Motes count={30} />

      {/* title */}
      <div style={{ position: "absolute", left: 470, right: 50, top: 70 }}>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>This close</div>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.bulb, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>to the bell.</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 34, lineHeight: 1.3, color: C.dust, marginTop: 96 }}>
          {pct.toFixed(2)}% of $GRAVE is in the ground.
          <br />
          <span style={{ color: C.bulb }}>{fmt(toGo)} $GRAVE</span> until the bell rings at {goalPct}%.
        </div>
      </div>

      {/* the bell */}
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <svg width="200" height="160" viewBox="0 0 200 160">
          <path d="M40 120 C40 50 70 20 100 20 C130 20 160 50 160 120 Z" fill={C.bulb} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
          <rect x="24" y="116" width="152" height="22" rx="10" fill={C.bulb} stroke={C.ink} strokeWidth="7" />
          <circle cx="100" cy="146" r="12" fill={C.ink} />
          <text x="100" y="92" textAnchor="middle" fontFamily={display} fontSize="34" fill={C.ink}>{goalPct}%</text>
        </svg>
      </div>

      {/* the tower and its scale */}
      <div style={{ position: "absolute", left: 220, top: TOP, width: 60, height: BOT - TOP, borderRadius: 30, background: C.plum, border: `7px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 234, top: puckY, width: 32, height: BOT - puckY - 8, borderRadius: 16, background: C.sign }} />
      {[1, 2, 3, 4].map((p) => (
        <div key={p} style={{ position: "absolute", left: 100, top: y(p) - 18, width: 110, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: display, fontSize: 28, color: C.dust, width: 60, textAlign: "right" }}>{p}%</span>
          <span style={{ width: 36, height: 6, background: C.rail }} />
        </div>
      ))}
      {/* the puck, just short of the bell */}
      <div style={{ position: "absolute", left: 200, top: puckY - 44, width: 100, height: 70, borderRadius: 18, background: C.sign, border: `7px solid ${C.ink}`, boxShadow: "0 0 40px rgba(215,38,61,0.8)" }} />
      <div style={{ position: "absolute", left: 312, top: puckY - 40, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 40, height: 6, background: C.bulb }} />
        <span style={{ fontFamily: display, fontSize: 36, color: C.bulb }}>{pct.toFixed(2)}%</span>
      </div>
      {/* bulbs along the tower */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 296, top: TOP + 120 + i * 90 }}>
          <Bulb size={16} lit={TOP + 120 + i * 90 > puckY} />
        </div>
      ))}

      {/* the newest grave */}
      <div style={{ position: "absolute", left: 520, top: 560 }}>
        <Headstone width={430} height={430} shape={0} style={{ paddingTop: 110, justifyContent: "flex-start" }}>
          <div style={{ fontFamily: display, fontSize: 26 }}>NEWEST GRAVE · #{latest.n}</div>
          <div style={{ fontFamily: display, fontSize: 58, lineHeight: 1, marginTop: 18 }}>{fmt(latest.tokens)}</div>
          <div style={{ fontFamily: display, fontSize: 28, marginTop: 6 }}>$GRAVE</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 20 }}>bought back, then buried.</div>
          <div style={{ fontFamily: mono, fontSize: 20, marginTop: 10 }}>tx {short(latest.tx)}</div>
        </Headstone>
      </div>
      <div style={{ position: "absolute", left: 470, right: 40, top: 982, height: 22, borderRadius: 11, background: C.nightDeep }} />
      <div style={{ position: "absolute", left: 880, top: 920 }}>
        <MortEyes size={26} look={-0.6} />
      </div>

      <div style={{ position: "absolute", left: 470, right: 40, top: 1050, fontFamily: display, fontSize: 30, lineHeight: 1.3, color: C.cream }}>
        {graves} GRAVES · {fmt(burned)} $GRAVE BURIED
      </div>
      <div style={{ position: "absolute", left: 470, right: 40, top: 1150, display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={46} />
        <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: body, fontSize: 22, color: C.dustDim, fontStyle: "italic" }}>
        every burial verifiable on-chain
      </div>
    </AbsoluteFill>
  );
};
