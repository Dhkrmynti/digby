import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Coin, GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type Buy = { readonly time: string; readonly usd: number; readonly eth: number; readonly tokens: number };
type WaitedProps = { readonly early: Buy; readonly late: Buy; readonly burned: number; readonly gap: string };

/** A pile of $GRAVE coins; `count` sets how big the bag looks. */
const Pile: React.FC<{ count: number }> = ({ count }) => {
  const rows: number[] = [];
  let left = count;
  for (let r = 5; r >= 1 && left > 0; r--) {
    const n = Math.min(r, left);
    rows.push(n);
    left -= n;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", height: 300, justifyContent: "flex-start" }}>
      {rows.map((n, i) => (
        <div key={i} style={{ display: "flex", marginTop: -34 }}>
          {Array.from({ length: n }).map((_, j) => (
            <Coin key={j} size={96} style={{ marginLeft: -12 }} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Panel: React.FC<{ b: Buy; mood: "happy" | "sad"; coins: number }> = ({ b, mood, coins }) => {
  const happy = mood === "happy";
  return (
    <div style={{ flex: 1, borderRadius: 22, background: happy ? "#1d2a14" : "#2a1418", border: `5px solid ${happy ? C.slime : C.sign}`, padding: "22px 20px 26px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)" }}>
      <div style={{ fontFamily: display, fontSize: 30, color: happy ? C.slime : C.sign }}>{b.time} UTC</div>
      <div style={{ fontFamily: sign, fontSize: 46, color: C.cream, marginTop: 4 }}>{happy ? "Mort, early" : "Mort, 4h later"}</div>
      <div style={{ marginTop: 18 }}>
        <Pile count={coins} />
      </div>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.dust, marginTop: 14 }}>
        ~${b.usd} · {b.eth} ETH
      </div>
      <div style={{ fontFamily: display, fontSize: 52, lineHeight: 1.05, color: C.cream, marginTop: 6 }}>{fmt(b.tokens)}</div>
      <div style={{ fontFamily: display, fontSize: 24, color: C.dust }}>$GRAVE</div>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: 30, marginTop: 14, color: happy ? C.slime : C.sign }}>{happy ? "big bag. 😌" : "…smaller bag. 🫠"}</div>
    </div>
  );
};

/* ═════════ 56 · "POV: you waited 4 hours." (1080×1350) ═════════ */
export const PostWaited: React.FC<WaitedProps> = ({ early, late, burned, gap }) => {
  const perEthEarly = early.tokens / early.eth;
  const perEthLate = late.tokens / late.eth;
  const less = (1 - perEthLate / perEthEarly) * 100;
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={22} />

      <div style={{ position: "absolute", left: 50, right: 50, top: 50, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 30, color: C.bulb }}>POV:</div>
        <div style={{ fontFamily: sign, fontSize: 88, lineHeight: 1.02, color: C.cream, marginTop: 4 }}>you waited {gap}</div>
        <div style={{ fontFamily: sign, fontSize: 88, lineHeight: 1.02, color: C.bulb }}>to buy $GRAVE.</div>
      </div>

      <div style={{ position: "absolute", left: 50, right: 50, top: 300, display: "flex", gap: 26 }}>
        <Panel b={early} mood="happy" coins={12} />
        <Panel b={late} mood="sad" coins={8} />
      </div>

      {/* the verdict */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 1040, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: C.sign, color: C.cream, fontFamily: display, fontSize: 34, padding: "12px 26px", borderRadius: 12, rotate: "-2deg", whiteSpace: "nowrap" }}>
          {gap.toUpperCase()} LATER · {Math.round(less)}% LESS $GRAVE PER ETH
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: C.dust, marginTop: 22 }}>
          both bags got buried anyway. <span style={{ color: C.cream }}>{fmt(burned)} $GRAVE</span> in 0x…dEaD.
        </div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={44} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: sign, fontSize: 34, color: C.bulb }}>“don’t wait.” · NFA</span>
          <MortEyes size={22} look={-0.5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
