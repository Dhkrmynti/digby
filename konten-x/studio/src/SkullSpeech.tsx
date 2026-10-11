import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Motes } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type SkullSpeechProps = { readonly burned: number; readonly graves: number; readonly next: string };

/** The Chair of the Graveyard Reserve: a skull in a dark suit. `talk` 0..1 opens the jaw. */
export const Chair: React.FC<{ talk: number; look: number }> = ({ talk, look }) => {
  const jaw = talk * 26;
  return (
    <svg width={520} height={620} viewBox="-260 -330 520 620" style={{ overflow: "visible" }}>
      {/* suit */}
      <path d="M-230 300 C-220 120 -150 70 -60 60 L60 60 C150 70 220 120 230 300 Z" fill="#141022" stroke={C.ink} strokeWidth="6" />
      <path d="M-60 60 L0 210 L60 60 Z" fill="#f6eedd" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-14 74 L14 74 L22 190 L0 222 L-22 190 Z" fill={C.sign} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-60 60 L-108 190 L-40 140 Z" fill="#1e1830" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 60 L108 190 L40 140 Z" fill="#1e1830" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      {/* lapel pin: a tiny headstone */}
      <path d="M-128 128 v-14 a8 8 0 0 1 16 0 v14 z" fill={C.bulb} stroke={C.ink} strokeWidth="3" />
      {/* skull */}
      <g transform={`rotate(${look * 4})`}>
        {/* jaw (moves) */}
        <g transform={`translate(0 ${jaw})`}>
          <path d="M-70 -20 C-74 30 -40 58 0 58 C40 58 74 30 70 -20 Z" fill="#efe6d2" stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
          {[-36, -18, 0, 18, 36].map((x) => (
            <rect key={x} x={x - 7} y={-22} width={14} height={20} rx={3} fill="#fffaf0" stroke={C.ink} strokeWidth="3" />
          ))}
        </g>
        {/* cranium */}
        <path d="M-118 -110 C-118 -250 118 -250 118 -110 C118 -60 100 -30 74 -18 L-74 -18 C-100 -30 -118 -60 -118 -110 Z" fill="#f4ecdb" stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
        {[-36, -18, 0, 18, 36].map((x) => (
          <rect key={x} x={x - 7} y={-34} width={14} height={18} rx={3} fill="#fffaf0" stroke={C.ink} strokeWidth="3" />
        ))}
        {/* eye sockets with Mort's glow */}
        {[-48, 48].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={-104} rx={34} ry={38} fill="#1a1022" stroke={C.ink} strokeWidth="5" />
            <circle cx={x + look * 8} cy={-100} r={11} fill={C.bulb} style={{ filter: `drop-shadow(0 0 8px ${C.bulb})` }} />
          </g>
        ))}
        <path d="M0 -70 L-14 -44 L14 -44 Z" fill="#1a1022" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
        {/* a crack, for character */}
        <path d="M60 -196 L48 -170 L62 -154 L52 -136" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** The podium with the Reserve's seal and two microphones. */
export const Podium: React.FC = () => (
  <svg width={560} height={360} viewBox="0 0 560 360">
    <path d="M60 30 H500 L470 360 H90 Z" fill="#3a2350" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
    <rect x="40" y="10" width="480" height="36" rx="8" fill="#4a2e63" stroke={C.ink} strokeWidth="7" />
    <circle cx="280" cy="180" r="92" fill={C.ticket} stroke={C.ink} strokeWidth="6" />
    <circle cx="280" cy="180" r="76" fill="none" stroke={C.ink} strokeWidth="2.5" />
    <path d="M254 214 v-44 a26 26 0 0 1 52 0 v44 z" fill="#8f879a" stroke={C.ink} strokeWidth="4" />
    <path d="M280 170 v26 M268 180 h24" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
    <path id="seal" d="M210 180 A70 70 0 0 1 350 180" fill="none" />
    <text fontFamily={display} fontSize="15" fill={C.ink} letterSpacing="2">
      <textPath href="#seal" startOffset="50%" textAnchor="middle">GRAVEYARD RESERVE</textPath>
    </text>
    {[230, 330].map((x, i) => (
      <g key={x} transform={`rotate(${i ? 14 : -14} ${x} 20)`}>
        <rect x={x - 4} y={-70} width="8" height="90" rx="4" fill="#2b2b33" />
        <rect x={x - 13} y={-104} width="26" height="40" rx="12" fill="#202027" stroke="#55556a" strokeWidth="3" />
      </g>
    ))}
  </svg>
);

/** A small TV chart box. `pump` 0..1 grows the green candle. */
const ChartBox: React.FC<{ pump: number; scale: number }> = ({ pump, scale }) => {
  const reds = [0.48, 0.44, 0.47, 0.43, 0.41, 0.42, 0.4];
  return (
    <div style={{ width: 360, height: 250, borderRadius: 16, background: "#0e0714", border: `5px solid ${C.ink}`, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.9)", scale: `${scale}`, transformOrigin: "100% 0%", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: 10, fontFamily: mono, fontSize: 16, fontWeight: 700, color: C.dust }}>$GRAVE · 1m</div>
      <svg width="360" height="250" viewBox="0 0 360 250" style={{ position: "absolute", inset: 0 }}>
        {[60, 110, 160, 210].map((y) => (
          <path key={y} d={`M0 ${y} H360`} stroke="#2a1838" strokeWidth="2" strokeDasharray="4 8" />
        ))}
        {reds.map((v, i) => {
          const x = 24 + i * 34;
          const y = 250 - v * 250;
          return (
            <g key={i}>
              <path d={`M${x + 10} ${y - 12} V${y + 34}`} stroke={C.sign} strokeWidth="3" />
              <rect x={x} y={y} width="20" height="22" rx="3" fill={C.sign} />
            </g>
          );
        })}
        {/* the candle after "hello everyone" */}
        {pump > 0 ? (
          <g>
            <path d={`M${24 + 7 * 34 + 10} ${250 - 0.42 * 250 - pump * 150 - 18} V${250 - 0.4 * 250 + 10}`} stroke={C.slime} strokeWidth="4" />
            <rect x={24 + 7 * 34} y={250 - 0.42 * 250 - pump * 150} width="22" height={pump * 150 + 4} rx="3" fill={C.slime} />
          </g>
        ) : null}
      </svg>
      <div style={{ position: "absolute", right: 10, bottom: 8, fontFamily: mono, fontSize: 11, color: C.dustDim }}>illustration</div>
    </div>
  );
};

/* ═════════ 36 · Video: the Graveyard Reserve press conference (1080×1350, 12 s) ═════════ */
export const SkullSpeech: React.FC<SkullSpeechProps> = ({ burned, graves, next }) => {
  const f = useCurrentFrame();
  const sayHello = f >= 84 && f < 132;
  const sayBurn = f >= 214 && f < 288;
  const talk = sayHello || sayBurn ? (Math.sin(f * 0.9) + 1) / 2 : 0.05;
  const look = f < 70 ? Math.sin(f / 9) * 0.8 : f >= 150 && f < 200 ? 1 : 0;
  const pump = interpolate(f, [140, 168], [0, 1], { ...clamp, easing: pop });
  const zoom = interpolate(f, [138, 160, 196, 214], [1, 1.45, 1.45, 1], { ...clamp, easing: expo });
  const flashAt = [8, 20, 150, 158, 166];
  const flash = Math.max(...flashAt.map((a) => interpolate(f, [a, a + 2, a + 8], [0, 0.55, 0], clamp)));
  const scene = interpolate(f, [0, 10, 300, 316], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [310, 326], [0, 1], clamp);
  const sub = (text: string, at: number, until: number) => {
    const o = interpolate(f, [at, at + 6, until - 6, until], [0, 1, 1, 0], clamp);
    const shown = text.slice(0, Math.round(interpolate(f, [at, at + text.length * 1.4], [0, text.length], clamp)));
    return o > 0 ? (
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 236, textAlign: "center", opacity: o }}>
        <span style={{ display: "inline-block", background: "rgba(14,7,20,0.86)", padding: "12px 26px", borderRadius: 10, fontFamily: body, fontWeight: 700, fontSize: 46, color: C.cream }}>{shown}</span>
      </div>
    ) : null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <AbsoluteFill style={{ opacity: scene }}>
        {/* the drape behind the podium */}
        <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #22163a 0 46px, #1a102e 46px 70px, #261843 70px 110px)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 38%, rgba(255,207,58,0.16), transparent 70%)" }} />
        <Motes count={22} />

        {/* the Chair, behind the podium */}
        <div style={{ position: "absolute", left: 120, top: 270 }}>
          <Chair talk={talk} look={look} />
        </div>
        <div style={{ position: "absolute", left: 100, top: 700 }}>
          <Podium />
        </div>

        {/* the chart on the screen beside him */}
        <div style={{ position: "absolute", right: 30, top: 110 }}>
          <ChartBox pump={pump} scale={zoom} />
        </div>
        {f >= 150 && f < 214 ? (
          <div style={{ position: "absolute", right: 60, top: 520, fontFamily: display, fontSize: 72, color: C.slime, rotate: "-6deg", scale: `${interpolate(f, [150, 162], [0.4, 1], { ...clamp, easing: pop })}`, textShadow: "0 5px 0 rgba(14,7,20,0.7)" }}>
            GREEN.
          </div>
        ) : null}

        {/* lower third */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 110, display: "flex" }}>
          <div style={{ width: 150, background: C.sign, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 34, color: C.cream }}>
            <span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0.55 }}>● LIVE</span>
          </div>
          <div style={{ flex: 1, background: C.ticket, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
            <div style={{ fontFamily: display, fontSize: 30, color: C.ink }}>CHAIR OF THE GRAVEYARD RESERVE</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, color: C.ticketDim }}>remarks on the $GRAVE supply</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 56, background: "#0e0714", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ whiteSpace: "nowrap", fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.bulb, translate: `${1080 - f * 7}px 0` }}>
            $GRAVE · {graves} BURIALS · {fmt(burned)} $GRAVE IN 0x…dEaD · {((burned / 1e9) * 100).toFixed(2)}% OF SUPPLY BURIED · NEXT CYCLE: {next.toUpperCase()} · GRAVEBURN.FUN ·
          </div>
        </div>

        {sub("hello everyone.", 84, 132)}
        {sub("the graveyard reserve will keep burning.", 214, 296)}

        {/* camera flashes from the press pit */}
        <AbsoluteFill style={{ background: "#fffaf0", opacity: flash, pointerEvents: "none" }} />
        {flash > 0.2
          ? [0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 120 + random(`fx${Math.floor(f / 6)}${i}`) * 820, top: 1000 + random(`fy${i}`) * 80, width: 60, height: 60, borderRadius: "50%", background: "#fffaf0", filter: "blur(12px)" }} />
            ))
          : null}
      </AbsoluteFill>

      {/* end card */}
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ translate: `0 ${interpolate(f, [310, 334], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GraveMark size={180} glow />
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.cream, marginTop: 36 }}>The Graveyard Reserve</div>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb }}>has spoken.</div>
          <div style={{ fontFamily: display, fontSize: 34, color: C.cream, marginTop: 40 }}>
            {graves} BURIALS · {fmt(burned)} $GRAVE BURIED
          </div>
          <div style={{ fontFamily: display, fontSize: 26, color: C.dust, marginTop: 14 }}>monetary policy: dig.</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.dust, marginTop: 40 }}>GRAVEBURN.FUN</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
