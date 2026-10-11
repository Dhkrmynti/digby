import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type BullCandleProps = { readonly burned: number; readonly buys: number; readonly sells: number; readonly window: string };

/* ═════════ 52 · "Bearish → BULLISH." red candles, then one giant green (1080×1350) ═════════ */
export const PostBullCandle: React.FC<BullCandleProps> = ({ burned, buys, sells, window }) => {
  // the red stretch: drifting down, each candle [open, close] as y in px (down = lower)
  const reds = [
    [700, 760], [740, 800], [785, 830], [815, 880], [860, 900], [885, 945], [930, 975], [960, 1010], [995, 1040], [1020, 1060],
  ];
  const X0 = 70;
  const STEP = 62;
  const W = 40;
  const GX = X0 + reds.length * STEP + 30; // the green candle's x
  const GW = 150;
  const base = 1060; // green opens where the reds bottomed out
  return (
    <AbsoluteFill>
      <Night glow={0.9} glowY="10%" />
      {/* green glow behind the giant candle */}
      <AbsoluteFill style={{ background: `radial-gradient(40% 70% at ${GX + GW / 2}px 40%, rgba(166,255,77,0.22), transparent 70%)` }} />
      <Motes count={26} />

      {/* chart grid */}
      {[300, 450, 600, 750, 900, 1050].map((y) => (
        <div key={y} style={{ position: "absolute", left: 40, right: 40, top: y, height: 0, borderTop: "2px dashed rgba(70,48,86,0.7)" }} />
      ))}
      <div style={{ position: "absolute", left: 50, top: 312, fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dust }}>$GRAVE · 1m</div>

      {/* the red candles */}
      {reds.map(([o, c], i) => {
        const x = X0 + i * STEP;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x + W / 2 - 3, top: o - 22, width: 6, height: c - o + 44, background: C.sign, borderRadius: 3 }} />
            <div style={{ position: "absolute", left: x, top: o, width: W, height: c - o, background: C.sign, borderRadius: 5, border: `3px solid ${C.signDeep}` }} />
          </React.Fragment>
        );
      })}

      {/* the giant green candle, breaking through the top of the frame */}
      <div style={{ position: "absolute", left: GX + GW / 2 - 6, top: -40, width: 12, height: base + 90, background: C.slime, borderRadius: 6, boxShadow: `0 0 30px ${C.slime}` }} />
      <div style={{ position: "absolute", left: GX, top: -20, width: GW, height: base + 20 + 10, background: `linear-gradient(180deg, #d9ff9e 0%, ${C.slime} 30%, #6fd12a 100%)`, borderRadius: 12, border: `6px solid #3f7a12`, boxShadow: `0 0 80px rgba(166,255,77,0.65)` }} />
      {/* speed lines */}
      {[[-60, 220, 140], [GW + 30, 300, 180], [-50, 520, 120], [GW + 24, 640, 150], [-64, 820, 110]].map(([dx, y, h], i) => (
        <div key={i} style={{ position: "absolute", left: GX + dx, top: y, width: 8, height: h, borderRadius: 4, background: "rgba(166,255,77,0.55)" }} />
      ))}
      {/* the ground it burst out of */}
      <svg width="360" height="80" viewBox="0 0 360 80" style={{ position: "absolute", left: GX + GW / 2 - 180, top: base + 26 }}>
        <path d="M0 40 L60 20 L90 46 L130 12 L180 36 L230 8 L270 42 L310 18 L360 40 L360 80 L0 80 Z" fill="#3a2433" />
        {[[40, 10], [300, 6], [100, 0], [250, 2]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="16" height="16" rx="3" fill="#5a3a4a" transform={`rotate(${i * 25} ${x + 8} ${y + 8})`} />
        ))}
      </svg>

      {/* headline over the red side */}
      <div style={{ position: "absolute", left: 50, top: 70, width: 640 }}>
        <div style={{ fontFamily: sign, fontSize: 86, lineHeight: 1, color: C.cream, textShadow: "0 5px 0 rgba(42,22,38,0.7)" }}>
          Bearish <span style={{ color: C.sign }}>→</span>
        </div>
        <div style={{ fontFamily: display, fontSize: 112, lineHeight: 1, color: C.slime, marginTop: 6, rotate: "-3deg", textShadow: "0 7px 0 #2f5c0d, 0 0 40px rgba(166,255,77,0.45)" }}>BULLISH.</div>
      </div>

      {/* labels */}
      <div style={{ position: "absolute", left: X0, top: 600, fontFamily: display, fontSize: 26, color: C.sign, rotate: "8deg" }}>R.I.P. red candles</div>
      <div style={{ position: "absolute", left: GX - 230, top: 400, fontFamily: sign, fontSize: 40, lineHeight: 1.05, color: C.slime, textAlign: "right", width: 210, rotate: "-6deg" }}>
        back
        <br />
        from the
        <br />
        dead.
      </div>

      {/* bottom: Mort watching it go, proof, footer */}
      <div style={{ position: "absolute", left: 70, top: 1120, display: "flex", alignItems: "center", gap: 18 }}>
        <MortEyes size={26} look={0.9} />
        <span style={{ fontFamily: sign, fontSize: 40, color: C.bulb }}>“…oh. oh my.”</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1196, display: "flex", gap: 12, fontFamily: mono, fontWeight: 700, fontSize: 22 }}>
        <span style={{ background: C.ticket, color: C.ink, padding: "6px 14px", borderRadius: 8 }}>{window}: {buys} buys · {sells} sells</span>
        <span style={{ background: C.plum, color: C.cream, padding: "6px 14px", borderRadius: 8 }}>{fmt(burned)} $GRAVE buried</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={42} />
          <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <span style={{ fontFamily: body, fontSize: 20, color: C.dustDim, fontStyle: "italic" }}>illustration · NFA</span>
      </div>
    </AbsoluteFill>
  );
};
