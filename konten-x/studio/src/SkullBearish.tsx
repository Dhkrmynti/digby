import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Motes } from "./parts";
import { Chair, Podium } from "./SkullSpeech";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type Window = { readonly label: string; readonly sells: number; readonly buys: number; readonly soldM: number; readonly boughtM: number };
type SkullBearishProps = {
  readonly burned: number;
  readonly graves: number;
  readonly todayBurials: number;
  readonly todayTokens: number;
  readonly hour: Window;
  readonly three: Window;
  readonly asOf: string;
};

/** The press-room screen. Three modes: falling chart, flow numbers, burial counter. */
const Screen: React.FC<{ f: number; p: SkullBearishProps; scale: number }> = ({ f, p, scale }) => {
  const mode = f < 136 ? "chart" : f < 216 ? "flow" : "buried";
  const fallN = Math.floor(interpolate(f, [66, 120], [3, 9], clamp));
  const counter = interpolate(f, [222, 280], [p.burned - p.todayTokens, p.burned], { ...clamp, easing: expo });
  return (
    <div style={{ width: 400, height: 280, borderRadius: 16, background: "#0e0714", border: `5px solid ${C.ink}`, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.9)", scale: `${scale}`, transformOrigin: "100% 0%", overflow: "hidden", position: "relative", padding: "14px 18px" }}>
      {mode === "chart" ? (
        <>
          <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: C.dust }}>$GRAVE · today</div>
          <svg width="364" height="220" viewBox="0 0 364 220" style={{ position: "absolute", left: 18, top: 44 }}>
            {[50, 100, 150].map((y) => (
              <path key={y} d={`M0 ${y} H364`} stroke="#2a1838" strokeWidth="2" strokeDasharray="4 8" />
            ))}
            {Array.from({ length: fallN }).map((_, i) => {
              const x = 8 + i * 39;
              const y = 18 + i * 20;
              return (
                <g key={i}>
                  <path d={`M${x + 11} ${y - 8} V${y + 42}`} stroke={C.sign} strokeWidth="3" />
                  <rect x={x} y={y} width="22" height="30" rx="3" fill={C.sign} />
                </g>
              );
            })}
          </svg>
          <div style={{ position: "absolute", right: 10, bottom: 6, fontFamily: mono, fontSize: 11, color: C.dustDim }}>illustration</div>
        </>
      ) : mode === "flow" ? (
        <>
          <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: C.dust }}>CURVE FLOW · {p.asOf}</div>
          {[p.hour, p.three].map((w, i) => (
            <div key={w.label} style={{ marginTop: i ? 14 : 16, opacity: interpolate(f, [140 + i * 14, 150 + i * 14], [0, 1], clamp) }}>
              <div style={{ fontFamily: display, fontSize: 18, color: C.dust }}>{w.label.toUpperCase()}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 4, fontFamily: mono, fontWeight: 700, fontSize: 24 }}>
                <span style={{ color: C.sign }}>{w.sells} sells · {w.soldM.toFixed(1)}M</span>
              </div>
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.slime }}>{w.buys} buys · {w.boughtM.toFixed(1)}M</div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: C.dust }}>$GRAVE IN 0x…dEaD</div>
          <div style={{ fontFamily: display, fontSize: 40, color: C.cream, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{fmt(counter)}</div>
          <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.bulb, marginTop: 6 }}>{((counter / 1e9) * 100).toFixed(2)}% of supply</div>
          <div style={{ marginTop: 18, display: "inline-block", border: `4px solid ${C.slime}`, borderRadius: 8, padding: "4px 12px", fontFamily: display, fontSize: 22, color: C.slime, rotate: "-4deg", opacity: interpolate(f, [282, 290], [0, 1], clamp) }}>
            +{fmt(p.todayTokens)} TODAY
          </div>
        </>
      )}
    </div>
  );
};

/* ═════════ 61 · Video: "good afternoon." the bearish address (1080×1350, 15 s) ═════════ */
export const SkullBearish: React.FC<SkullBearishProps> = (p) => {
  const f = useCurrentFrame();
  const lines: [string, number, number][] = [
    ["good afternoon.", 16, 64],
    ["the chart has… seen better days.", 70, 132],
    ["the numbers, as promised.", 140, 210],
    ["we bought the dip anyway.", 218, 298],
    ["monetary policy: still dig.", 306, 362],
  ];
  const speaking = lines.some(([, a, b]) => f >= a && f < b - 8);
  const talk = speaking ? ((Math.sin(f * 0.7) + 1) / 2) * 0.7 : 0.03;
  const look = f >= 70 && f < 132 ? 1 : f >= 140 && f < 210 ? 0.6 : 0;
  const slump = interpolate(f, [0, 60], [0, 14], clamp);
  const zoom = interpolate(f, [66, 82, 118, 134, 140, 152, 196, 212, 222, 236, 284, 298], [1, 1.35, 1.35, 1, 1, 1.3, 1.3, 1, 1, 1.3, 1.3, 1], { ...clamp, easing: expo });
  const scene = interpolate(f, [0, 8, 366, 380], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [376, 392], [0, 1], clamp);
  const banner = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: pop });
  const flash = Math.max(...[6, 90, 228].map((a) => interpolate(f, [a, a + 2, a + 8], [0, 0.4, 0], clamp)));

  const sub = (text: string, at: number, until: number) => {
    const o = interpolate(f, [at, at + 5, until - 6, until], [0, 1, 1, 0], clamp);
    const shown = text.slice(0, Math.round(interpolate(f, [at, at + text.length * 1.1], [0, text.length], clamp)));
    return o > 0 ? (
      <div key={text} style={{ position: "absolute", left: 40, right: 40, bottom: 236, textAlign: "center", opacity: o }}>
        <span style={{ display: "inline-block", background: "rgba(14,7,20,0.88)", padding: "12px 24px", borderRadius: 10, fontFamily: body, fontWeight: 700, fontSize: 42, color: C.cream }}>{shown}</span>
      </div>
    ) : null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <AbsoluteFill style={{ opacity: scene }}>
        {/* a gloomier press room */}
        <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #1a1426 0 46px, #141020 46px 70px, #1d1630 70px 110px)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 38%, rgba(120,140,200,0.10), transparent 70%)" }} />
        <Motes count={10} />

        {/* rain */}
        {Array.from({ length: 70 }).map((_, i) => {
          const x = random(`rx${i}`) * 1120 - 20;
          const speed = 26 + random(`rs${i}`) * 14;
          const y = ((random(`ry${i}`) * 1400 + f * speed) % 1450) - 100;
          return <div key={i} style={{ position: "absolute", left: x - y * 0.12, top: y, width: 3, height: 46, background: "rgba(183,169,196,0.28)", rotate: "7deg", borderRadius: 2 }} />;
        })}

        {/* hook banner */}
        <div style={{ position: "absolute", left: 30, top: 40, scale: `${banner}`, transformOrigin: "0 50%", display: "flex", boxShadow: "0 16px 30px -16px rgba(0,0,0,0.9)" }}>
          <div style={{ background: C.sign, padding: "10px 18px", fontFamily: display, fontSize: 30, color: C.cream }}>LIVE</div>
          <div style={{ background: "#4a4458", padding: "10px 18px", fontFamily: display, fontSize: 30, color: C.cream }}>AFTERNOON ADDRESS</div>
        </div>

        <div style={{ position: "absolute", left: 120, top: 270 + slump }}>
          <Chair talk={talk} look={look} />
        </div>
        {/* a sweat drop, because it's red */}
        {f >= 70 && f < 300 ? (
          <svg width="40" height="60" viewBox="0 0 40 60" style={{ position: "absolute", left: 470, top: 360 + slump + ((f - 70) % 40) * 1.2, opacity: interpolate((f - 70) % 40, [0, 6, 32, 40], [0, 1, 1, 0]) }}>
            <path d="M20 4 q16 28 0 44 q-16 -16 0 -44 Z" fill="#7fd3ff" stroke={C.ink} strokeWidth="3" />
          </svg>
        ) : null}
        <div style={{ position: "absolute", left: 100, top: 700 }}>
          <Podium />
        </div>

        <div style={{ position: "absolute", right: 30, top: 120 }}>
          <Screen f={f} p={p} scale={zoom} />
        </div>
        {f >= 92 && f < 136 ? (
          <div style={{ position: "absolute", right: 70, top: 560, fontFamily: display, fontSize: 84, color: C.sign, rotate: "8deg", scale: `${interpolate(f, [92, 104], [0.4, 1], { ...clamp, easing: pop })}`, textShadow: "0 5px 0 rgba(14,7,20,0.8)" }}>
            RED.
          </div>
        ) : null}

        {/* lower third */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 110, display: "flex" }}>
          <div style={{ width: 150, background: C.sign, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 34, color: C.cream }}>
            <span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0.55 }}>● LIVE</span>
          </div>
          <div style={{ flex: 1, background: C.ticket, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
            <div style={{ fontFamily: display, fontSize: 30, color: C.ink }}>CHAIR OF THE GRAVEYARD RESERVE</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, color: C.ticketDim }}>afternoon remarks on the $GRAVE supply (it’s raining)</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 56, background: "#0e0714", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ whiteSpace: "nowrap", fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.sign, translate: `${1080 - f * 7}px 0` }}>
            $GRAVE · {p.hour.label.toUpperCase()}: {p.hour.sells} SELLS / {p.hour.buys} BUYS · <span style={{ color: C.bulb }}>{p.graves} BURIALS · {fmt(p.burned)} $GRAVE IN 0x…dEaD · {((p.burned / 1e9) * 100).toFixed(2)}% BURIED</span> · TODAY: +{fmt(p.todayTokens)} BURIED · GRAVEBURN.FUN ·
          </div>
        </div>

        {lines.map(([t, a, b]) => sub(t, a, b))}

        <AbsoluteFill style={{ background: "#fffaf0", opacity: flash, pointerEvents: "none" }} />
      </AbsoluteFill>

      {/* end card */}
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ translate: `0 ${interpolate(f, [376, 400], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GraveMark size={160} glow />
          <div style={{ fontFamily: display, fontSize: 28, color: C.sign, marginTop: 28 }}>AFTERNOON ADDRESS · {p.asOf}</div>
          <div style={{ fontFamily: sign, fontSize: 80, lineHeight: 1.05, color: C.cream, marginTop: 14 }}>The Graveyard Reserve</div>
          <div style={{ fontFamily: sign, fontSize: 80, lineHeight: 1.05, color: C.bulb }}>is still digging.</div>
          <div style={{ fontFamily: display, fontSize: 32, color: C.cream, marginTop: 36 }}>
            {p.graves} BURIALS · {fmt(p.burned)} $GRAVE
          </div>
          <div style={{ fontFamily: display, fontSize: 26, color: C.slime, marginTop: 10 }}>
            {((p.burned / 1e9) * 100).toFixed(2)}% BURIED · +{fmt(p.todayTokens)} TODAY
          </div>
          <div style={{ fontFamily: display, fontSize: 24, color: C.dust, marginTop: 18 }}>red days bury cheaper. NFA.</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.dust, marginTop: 34 }}>GRAVEBURN.FUN</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
