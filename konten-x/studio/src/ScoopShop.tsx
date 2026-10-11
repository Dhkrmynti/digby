import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type ScoopShopProps = { readonly window: string; readonly sells: number; readonly soldM: number; readonly buys: number; readonly boughtM: number; readonly burned: number };

/** One ice-cream scoop, red-candle flavor: a scoop with a little candle wick on top. */
const Scoop: React.FC<{ x: number; y: number; r: number; tone: string }> = ({ x, y, r, tone }) => (
  <g>
    <path
      d={`M${x - r} ${y} a${r} ${r} 0 0 1 ${2 * r} 0 q${-r * 0.2} ${r * 0.35} ${-r * 0.4} ${r * 0.1} q${-r * 0.3} ${r * 0.35} ${-r * 0.6} 0 q${-r * 0.3} ${r * 0.35} ${-r * 0.6} 0 q${-r * 0.2} ${r * 0.3} ${-r * 0.4} ${-r * 0.1} Z`}
      fill={tone}
      stroke={C.ink}
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* a highlight */}
    <path d={`M${x - r * 0.55} ${y - r * 0.45} q${r * 0.2} ${-r * 0.3} ${r * 0.55} ${-r * 0.35}`} stroke="rgba(255,255,255,0.45)" strokeWidth="9" fill="none" strokeLinecap="round" />
    {/* sprinkles */}
    {[-0.45, -0.1, 0.3].map((k, i) => (
      <rect key={i} x={x + k * r} y={y - r * (0.5 + (i % 2) * 0.2)} width={18} height={7} rx={3} fill={i === 1 ? C.bulb : C.slime} transform={`rotate(${i * 50 - 30} ${x + k * r} ${y - r * 0.5})`} />
    ))}
  </g>
);

/* ═════════ 58 · "Scoop time, gravers." Mort's Scoop Shop (1080×1350) ═════════ */
export const PostScoopShop: React.FC<ScoopShopProps> = ({ window, sells, soldM, buys, boughtM, burned }) => (
  <AbsoluteFill>
    <Night glow={1} glowY="15%" />
    <Motes count={22} />

    {/* awning */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, display: "flex" }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ flex: 1, background: i % 2 ? C.cream : C.sign, borderBottomLeftRadius: 45, borderBottomRightRadius: 45, boxShadow: "0 10px 14px -8px rgba(0,0,0,0.6)" }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 128, display: "flex", justifyContent: "space-between" }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Bulb key={i} size={16} lit={i % 2 === 0} />
      ))}
    </div>

    {/* headline */}
    <div style={{ position: "absolute", left: 50, right: 50, top: 168, textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 28, color: C.bulb }}>• MORT’S SCOOP SHOP • OPEN NOW •</div>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, marginTop: 10, textShadow: "0 6px 0 rgba(42,22,38,0.7)" }}>
        Scoop time,
      </div>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.bulb, textShadow: "0 6px 0 rgba(42,22,38,0.7)" }}>gravers.</div>
    </div>

    {/* the cone */}
    <svg width="480" height="760" viewBox="0 -60 480 760" style={{ position: "absolute", left: 40, top: 430 }}>
      <defs>
        <clipPath id="cone">
          <path d="M120 360 L240 680 L360 360 Z" />
        </clipPath>
      </defs>
      {/* cone */}
      <path d="M120 360 L240 680 L360 360 Z" fill="#d9a35b" stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
      <g clipPath="url(#cone)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={`a${i}`} d={`M${60 + i * 50} 360 l140 320`} stroke="#a8713a" strokeWidth="5" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={`b${i}`} d={`M${420 - i * 50} 360 l-140 320`} stroke="#a8713a" strokeWidth="5" />
        ))}
      </g>
      {/* scoops, stacked */}
      <Scoop x={240} y={355} r={130} tone={C.sign} />
      <Scoop x={240} y={215} r={112} tone="#e8475c" />
      <Scoop x={240} y={95} r={94} tone={C.signDeep} />
      {/* tiny headstone on top */}
      <path d="M214 14 v-38 a26 26 0 0 1 52 0 v38 z" fill={C.stone} stroke={C.ink} strokeWidth="6" />
      <ellipse cx="232" cy="-20" rx="3.5" ry="4.5" fill={C.ink} />
      <ellipse cx="248" cy="-20" rx="3.5" ry="4.5" fill={C.ink} />
      {/* drips */}
      <path d="M150 380 q0 40 12 40 q12 0 12 -40" fill={C.sign} stroke={C.ink} strokeWidth="5" />
      <path d="M300 385 q0 28 10 28 q10 0 10 -28" fill={C.sign} stroke={C.ink} strokeWidth="5" />
    </svg>

    {/* menu board */}
    <div style={{ position: "absolute", left: 530, right: 50, top: 520, background: "#16221a", border: `8px solid #6b4a2e`, borderRadius: 14, padding: "24px 26px", boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)", color: C.cream }}>
      <div style={{ fontFamily: display, fontSize: 24, color: C.slime }}>FLAVOR OF THE HOUR</div>
      <div style={{ fontFamily: sign, fontSize: 54, lineHeight: 1.05, color: C.sign, marginTop: 6 }}>Red Candle</div>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, lineHeight: 1.45, marginTop: 14, color: C.cream }}>
        {window}:
        <br />
        {sells} sells dumped {soldM.toFixed(1)}M
        <br />
        {buys} buys took {boughtM.toFixed(1)}M
      </div>
      <div style={{ height: 0, borderTop: `3px dashed rgba(246,238,221,0.35)`, margin: "16px 0" }} />
      <div style={{ fontFamily: display, fontSize: 22, color: C.slime }}>SIZES</div>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: 26, lineHeight: 1.45, marginTop: 6 }}>
        🥄 1 scoop
        <br />
        🥄🥄 2 scoops
        <br />
        🪣 the whole tub
      </div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.dust, marginTop: 12 }}>no refunds. melted bags not accepted.</div>
    </div>

    <div style={{ position: "absolute", left: 530, right: 50, top: 1085, display: "flex", alignItems: "center", gap: 16 }}>
      <MortEyes size={24} look={-0.7} />
      <span style={{ fontFamily: sign, fontSize: 36, lineHeight: 1.1, color: C.bulb }}>“dirt’s cheap. grab a spoon.”</span>
    </div>

    <div style={{ position: "absolute", left: 60, right: 60, bottom: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GraveMark size={42} />
        <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
      </div>
      <span style={{ fontFamily: body, fontSize: 21, color: C.dustDim, fontStyle: "italic" }}>{fmt(burned)} $GRAVE buried · NFA</span>
    </div>
  </AbsoluteFill>
);
