import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;

export type Grave = { readonly n: number; readonly tokens: number; readonly time: string; readonly tx: string };
type PodiumProps = { readonly top: Grave[]; readonly graves: number; readonly burned: number };

const STEP = [
  { place: 1, h: 300, stone: 360, color: C.bulb, label: "1ST" },
  { place: 2, h: 210, stone: 300, color: C.ticket, label: "2ND" },
  { place: 3, h: 150, stone: 270, color: "#c98a4a", label: "3RD" },
];

/* ═════════ 42 · The biggest graves ever dug (1080×1350) ═════════ */
export const PostPodium: React.FC<PodiumProps> = ({ top, graves, burned }) => {
  const order = [1, 0, 2]; // 2nd, 1st, 3rd left to right
  return (
    <AbsoluteFill>
      <Night glow={0.85} />
      <Motes count={34} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 18 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <Bulb key={i} size={20} lit={i % 2 === 0} />
          ))}
        </div>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>The biggest graves</div>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.bulb, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>Mort ever dug.</div>
      </div>

      <div style={{ position: "absolute", left: 40, right: 40, bottom: 210, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 18 }}>
        {order.map((idx) => {
          const g = top[idx];
          const s = STEP[idx];
          return (
            <div key={s.place} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 320 }}>
              <Headstone width={s.stone * 0.82} height={s.stone} shape={idx === 0 ? 0 : 1} style={{ paddingTop: idx === 0 ? 70 : 44, justifyContent: "flex-start" }}>
                <div style={{ fontFamily: display, fontSize: 20 }}>HERE LIES</div>
                <div style={{ fontFamily: display, fontSize: idx === 0 ? 40 : 32, lineHeight: 1, marginTop: 10 }}>{fmt(g.tokens)}</div>
                <div style={{ fontFamily: display, fontSize: 18, marginTop: 4 }}>$GRAVE</div>
                <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, marginTop: 14, whiteSpace: "nowrap" }}>#{g.n} · {g.time} UTC</div>
                <div style={{ fontFamily: mono, fontSize: 16, marginTop: 6 }}>tx {short(g.tx)}</div>
              </Headstone>
              <div style={{ width: "100%", height: s.h, marginTop: -4, background: s.color, border: `6px solid ${C.ink}`, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 22 }}>
                <span style={{ fontFamily: display, fontSize: 64, color: C.ink }}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 196, height: 18, borderRadius: 9, background: C.nightDeep }} />

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 104, textAlign: "center", fontFamily: display, fontSize: 30, color: C.cream }}>
        {graves} GRAVES · {fmt(burned)} $GRAVE ({((burned / 1e9) * 100).toFixed(2)}%) IN 0x…dEaD
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={44} />
        <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <div style={{ position: "absolute", right: 60, bottom: 40, display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ fontFamily: body, fontSize: 22, color: C.dustDim, fontStyle: "italic" }}>every one on-chain</span>
        <MortEyes size={22} grin />
      </div>
    </AbsoluteFill>
  );
};
