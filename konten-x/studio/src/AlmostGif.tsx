import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, mono, sign } from "./brand";
import { Bulb, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type AlmostGifProps = { readonly burned: number; readonly goalPct: number };

/* ═════════ 47 · GIF: so close to the bell (720×720, seamless 4 s) ═════════ */
export const AlmostGif: React.FC<AlmostGifProps> = ({ burned, goalPct }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps; // 0..4
  const pct = (burned / 1e9) * 100;
  const toGo = Math.max(0, (goalPct / 100) * 1e9 - burned);

  const TOP = 190;
  const BOT = 615;
  const y = (p: number) => BOT - (p / goalPct) * (BOT - TOP);

  // the hammer swings, the puck flies, stalls under the bell, wobbles, slides back down
  const swing = interpolate(t, [0, 0.1, 0.45, 0.6, 3.6, 4], [0, 32, -8, 0, 0, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const up = interpolate(t, [0.5, 1.4], [0, pct], { ...clamp, easing: Easing.out(Easing.cubic) });
  const back = interpolate(t, [3.1, 3.9], [0, pct], { ...clamp, easing: Easing.in(Easing.quad) });
  const level = Math.max(0, up - back);
  const wobble = t > 1.4 && t < 2.2 ? Math.sin(t * 40) * 4 * (2.2 - t) : 0;
  const near = t > 1.4 && t < 3.1;
  const bellShake = near ? Math.sin(t * 50) * 3 : 0;
  const label = interpolate(t, [1.45, 1.6, 3.0, 3.15], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <Night glow={0.8} glowY="20%" />
      <Motes count={16} period={4} />

      {/* title */}
      <div style={{ position: "absolute", left: 330, right: 30, top: 60 }}>
        <div style={{ fontFamily: sign, fontSize: 62, lineHeight: 1, color: C.cream }}>so close</div>
        <div style={{ fontFamily: sign, fontSize: 62, lineHeight: 1, color: C.bulb }}>to the bell.</div>
      </div>

      {/* the bell */}
      <div style={{ position: "absolute", left: 70, top: 70, rotate: `${bellShake}deg`, transformOrigin: "50% 0%" }}>
        <svg width="160" height="130" viewBox="0 0 200 160">
          <path d="M40 120 C40 50 70 20 100 20 C130 20 160 50 160 120 Z" fill={C.bulb} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
          <rect x="24" y="116" width="152" height="22" rx="10" fill={C.bulb} stroke={C.ink} strokeWidth="8" />
          <text x="100" y="94" textAnchor="middle" fontFamily={display} fontSize="40" fill={C.ink}>{goalPct}%</text>
        </svg>
      </div>

      {/* tower */}
      <div style={{ position: "absolute", left: 125, top: TOP, width: 50, height: BOT - TOP, borderRadius: 25, background: C.plum, border: `6px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 137, top: y(level), width: 26, height: Math.max(0, BOT - y(level) - 6), borderRadius: 13, background: C.sign }} />
      {[1, 2, 3, 4].map((p) => (
        <div key={p} style={{ position: "absolute", left: 40, top: y(p) - 14, fontFamily: display, fontSize: 22, color: C.dust }}>{p}%</div>
      ))}
      {Array.from({ length: 6 }).map((_, i) => {
        const by = TOP + 70 + i * 66;
        return (
          <div key={i} style={{ position: "absolute", left: 186, top: by }}>
            <Bulb size={13} lit={by > y(level)} />
          </div>
        );
      })}
      {/* puck */}
      <div style={{ position: "absolute", left: 110, top: y(level) - 30 + wobble, width: 80, height: 54, borderRadius: 14, background: C.sign, border: `6px solid ${C.ink}`, boxShadow: "0 0 30px rgba(215,38,61,0.8)" }} />

      {/* the base pad and the hammer */}
      <div style={{ position: "absolute", left: 80, top: BOT, width: 140, height: 26, borderRadius: 8, background: C.ticket, border: `5px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 150, top: 488, rotate: `${swing}deg`, transformOrigin: "100% 100%" }}>
        <svg width="190" height="190" viewBox="0 0 190 190">
          <rect x="70" y="40" width="16" height="150" rx="7" fill="#8a5a33" stroke={C.ink} strokeWidth="5" transform="rotate(-40 78 115)" />
          <rect x="10" y="20" width="90" height="56" rx="12" fill={C.rail} stroke={C.ink} strokeWidth="6" transform="rotate(-40 55 48)" />
        </svg>
      </div>

      {/* the read-out */}
      <div style={{ position: "absolute", left: 330, right: 30, top: 300, opacity: label }}>
        <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1, color: C.bulb }}>{pct.toFixed(2)}%</div>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.cream, marginTop: 10 }}>{fmt(toGo)} $GRAVE to go</div>
      </div>
      <div style={{ position: "absolute", left: 360, top: 470, opacity: label }}>
        <MortEyes size={26} look={-0.8} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: display, fontSize: 21, color: C.dust }}>
        {fmt(burned)} $GRAVE BURIED · GRAVEBURN.FUN
      </div>
    </AbsoluteFill>
  );
};
