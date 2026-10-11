import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./brand";

/** The night over the fairground: aubergine, a red glow from the signs above, a violet haze below. */
export const Night: React.FC<{ readonly glow?: number; readonly glowY?: string }> = ({ glow = 0.6, glowY = "0%" }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.night,
      backgroundImage: [
        `radial-gradient(90% 60% at 50% ${glowY}, rgba(215,38,61,${0.22 * glow}) 0%, rgba(23,13,31,0) 62%)`,
        "radial-gradient(70% 50% at 50% 112%, #2b1240 0%, rgba(23,13,31,0) 70%)",
      ].join(","),
    }}
  />
);

/** Floating motes over the graveyard: dust and the odd slime-green wisp. */
export const Motes: React.FC<{ readonly count?: number; readonly period?: number }> = ({ count = 40, period }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`m${i}${k}`);
        const base = 10 + r("c") * 10;
        const cycle = period ? period / Math.max(1, Math.round(period / base)) : base;
        const p = (((T / cycle + r("o")) % 1) + 1) % 1;
        const wisp = r("w") < 0.25;
        const x = r("x") * width + Math.sin(p * Math.PI * 2) * 24;
        const y = height + 20 - p * (height + 40);
        const size = wisp ? 4 + r("z") * 3 : 2 + r("z") * 2.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: wisp ? C.slime : C.dust,
              opacity: Math.sin(p * Math.PI) * (wisp ? 0.7 : 0.35),
              boxShadow: wisp ? `0 0 ${size * 3}px ${C.slime}` : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** A marquee bulb. */
export const Bulb: React.FC<{ readonly size: number; readonly lit: boolean; readonly style?: React.CSSProperties }> = ({ size, lit, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: lit
        ? `radial-gradient(circle at 40% 36%, #ffffff 0%, ${C.bulbHot} 30%, ${C.bulb} 70%, #d99a12 100%)`
        : "radial-gradient(circle at 38% 34%, #6a5530 0%, #3a2c22 55%, #241a1c 100%)",
      boxShadow: lit ? `0 0 ${size * 0.6}px ${size * 0.12}px rgba(255,207,58,0.85), 0 0 ${size * 1.6}px ${size * 0.3}px rgba(255,170,40,0.35)` : "none",
      ...style,
    }}
  />
);

/**
 * The painted arch over the ride entrance with its ring of bulbs.
 * `chase` 0..1 rotates which bulbs are dimmed (one in three).
 */
export const Arch: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly chase?: number;
  readonly lit?: number; // 0..1 how many bulbs are lit (arrival)
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ width, height, chase = 0, lit = 1, children, style }) => {
  const pts: { x: number; y: number }[] = [];
  const side = 5;
  const arc = 34;
  for (let i = 0; i < side; i++) pts.push({ x: 3.2, y: 94 - i * ((94 - 47) / side) });
  for (let i = 0; i <= arc; i++) {
    const a = Math.PI - (i / arc) * Math.PI;
    pts.push({ x: 50 + 46.8 * Math.cos(a), y: 47 - 41 * Math.sin(a) });
  }
  for (let i = side - 1; i >= 0; i--) pts.push({ x: 96.8, y: 94 - i * ((94 - 47) / side) });
  const bulb = Math.max(10, width * 0.011);
  const step = Math.floor(chase * 3) % 3;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="archpaint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2364b" />
            <stop offset="60%" stopColor={C.sign} />
            <stop offset="100%" stopColor="#a8182c" />
          </linearGradient>
        </defs>
        <path d="M0 100V47A50 47 0 0 1 100 47V100Z" fill="url(#archpaint)" />
        <path d="M6.2 100V47.5A43.8 38.5 0 0 1 93.8 47.5V100" fill="none" stroke={C.cream} strokeOpacity="0.8" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 100V47A50 47 0 0 1 100 47V100" fill="none" stroke={C.ink} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      {pts.map((p, i) => (
        <Bulb
          key={i}
          size={bulb}
          lit={i / pts.length < lit && (i + step) % 3 !== 0}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, translate: "-50% -50%" }}
        />
      ))}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

/** The headstone-with-eyes brand mark. */
export const GraveMark: React.FC<{ readonly size: number; readonly bg?: boolean; readonly glow?: boolean }> = ({ size, bg = false, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    {bg ? <rect width="40" height="40" rx="9" fill={C.night} /> : null}
    <path d="M9 37V17.5C9 10.6 13.9 5 20 5s11 5.6 11 12.5V37Z" fill={C.ticket} stroke={C.ink} strokeWidth="1.6" />
    <rect x="5" y="34.5" width="30" height="3.5" rx="1.2" fill={C.sign} />
    <ellipse cx="16" cy="18" rx="2.6" ry="3.4" fill={C.ink} />
    <ellipse cx="24" cy="18" rx="2.6" ry="3.4" fill={C.ink} />
    <circle cx="16.8" cy="17" r="1" fill={C.bulb} style={glow ? { filter: `drop-shadow(0 0 1px ${C.bulb})` } : undefined} />
    <circle cx="24.8" cy="17" r="1" fill={C.bulb} style={glow ? { filter: `drop-shadow(0 0 1px ${C.bulb})` } : undefined} />
    <path d="M15 26.5h10" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** Mort, as he is always seen: two glowing eyes in the dark. */
export const MortEyes: React.FC<{
  readonly size: number; // eye height in px
  readonly look?: number; // -1..1
  readonly blink?: boolean;
  readonly grin?: boolean;
  readonly glow?: number; // 0..1
}> = ({ size, look = 0, blink = false, grin = false, glow = 1 }) => {
  const w = size * 0.82;
  const gap = size * 1.25;
  return (
    <div style={{ display: "flex", gap, alignItems: "center" }}>
      {[0, 1].map((i) =>
        grin ? (
          <svg key={i} width={w * 1.4} height={size} viewBox="0 0 28 20">
            <path d="M3 15q11-14 22 0" fill="none" stroke={C.bulb} strokeWidth="4" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${C.bulb})` }} />
          </svg>
        ) : (
          <div
            key={i}
            style={{
              position: "relative",
              width: w,
              height: blink ? size * 0.1 : size,
              borderRadius: "50%",
              background: C.bulb,
              opacity: 0.55 + glow * 0.45,
              boxShadow: `0 0 ${size * 0.5 * glow}px ${size * 0.08}px rgba(255,207,58,${0.8 * glow})`,
            }}
          >
            {!blink ? (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "52%",
                  width: w * 0.42,
                  height: w * 0.42,
                  borderRadius: "50%",
                  background: C.night,
                  translate: `${-50 + look * 40}% -50%`,
                }}
              />
            ) : null}
          </div>
        ),
      )}
    </div>
  );
};

/** The tunnel mouth with two plank doors; `open` 0 closed .. 1 wide. Children sit in the gap. */
export const Tunnel: React.FC<{ readonly width: number; readonly open?: number; readonly children?: React.ReactNode }> = ({ width, open = 0.3, children }) => {
  const h = width;
  const door = (side: -1 | 1) => (
    <g style={{ transformOrigin: side < 0 ? "40px 300px" : "260px 300px", scale: `${1 - open * 0.75} 1` } as React.CSSProperties}>
      {side < 0 ? (
        <path d="M40 300V132C40 98 60 70 92 54L150 50V300Z" fill="#33204a" stroke="#120919" strokeWidth="2" />
      ) : (
        <path d="M260 300V132C260 98 240 70 208 54L150 50V300Z" fill="#33204a" stroke="#120919" strokeWidth="2" />
      )}
      {(side < 0 ? [70, 100, 128] : [172, 200, 230]).map((x) => (
        <line key={x} x1={x} y1={70} x2={x} y2={300} stroke="#170d1f" strokeWidth="2" />
      ))}
      <path d={side < 0 ? "M46 196L144 168M46 268L144 240" : "M254 196L156 168M254 268L156 240"} stroke="#170d1f" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
  return (
    <div style={{ position: "relative", width, height: h }}>
      <svg width={width} height={h} viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tunneldark" cx="50%" cy="62%" r="60%">
            <stop offset="0%" stopColor="#05020a" />
            <stop offset="100%" stopColor="#1d0f29" />
          </radialGradient>
        </defs>
        <path d="M18 300V128C18 62 77 14 150 14s132 48 132 114v172Z" fill={C.plum} stroke={C.plumLine} strokeWidth="3" />
        <path d="M40 300V132C40 78 89 38 150 38s110 40 110 94v168Z" fill="url(#tunneldark)" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: "40%", display: "flex", justifyContent: "center" }}>{children}</div>
      <svg width={width} height={h} viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
        {door(-1)}
        {door(1)}
      </svg>
    </div>
  );
};

/** Perforated ticket stock. */
export const Ticket: React.FC<{ readonly width: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties; readonly notch?: number }> = ({
  width,
  children,
  style,
  notch = 18,
}) => (
  <div style={{ filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.55))", width, ...style }}>
    <div
      style={{
        background: C.ticket,
        color: C.ink,
        borderRadius: 16,
        WebkitMask: `radial-gradient(circle at 0 50%, transparent ${notch}px, #000 ${notch + 0.5}px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent ${notch}px, #000 ${notch + 0.5}px) right / 51% 100% no-repeat`,
        mask: `radial-gradient(circle at 0 50%, transparent ${notch}px, #000 ${notch + 0.5}px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent ${notch}px, #000 ${notch + 0.5}px) right / 51% 100% no-repeat`,
      }}
    >
      {children}
    </div>
  </div>
);

/** A painted sign board: sign red with a cream pinstripe. */
export const SignBoard: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties; readonly radius?: number }> = ({
  children,
  style,
  radius = 18,
}) => (
  <div
    style={{
      position: "relative",
      background: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18)), ${C.sign}`,
      color: C.cream,
      borderRadius: radius,
      boxShadow: "0 22px 44px -20px rgba(0,0,0,0.8)",
      ...style,
    }}
  >
    <div style={{ position: "absolute", inset: 9, border: `3px solid rgba(246,238,221,0.75)`, borderRadius: radius - 6, pointerEvents: "none" }} />
    {children}
  </div>
);

const STONE_SHAPES = ["999px 999px 8px 8px", "28px 28px 8px 8px", "8px"];
/** A flat cut headstone. shape 0 arch, 1 shoulder, 2 gothic point. */
export const Headstone: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly shape?: 0 | 1 | 2;
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ width, height, shape = 0, children, style }) => (
  <div
    style={{
      width,
      height,
      background: C.stone,
      color: C.stoneInk,
      borderRadius: STONE_SHAPES[shape],
      clipPath: shape === 2 ? "polygon(0 15%, 50% 0, 100% 15%, 100% 100%, 0 100%)" : undefined,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** The ride car; `spin` in degrees turns the wheels. */
export const RideCar: React.FC<{ readonly width: number; readonly spin?: number; readonly eyes?: boolean }> = ({ width, spin = 0, eyes = true }) => (
  <svg width={width} height={width * (130 / 220)} viewBox="0 0 220 130">
    <path d="M18 42h150l26 30v26H18Z" fill={C.sign} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <path d="M30 54h130l16 20" fill="none" stroke={C.cream} strokeWidth="3" strokeLinecap="round" />
    <path d="M30 42V22c0-6 5-10 10-10h40" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
    <circle cx="190" cy="66" r="10" fill={C.bulb} stroke={C.ink} strokeWidth="3" />
    {eyes ? (
      <>
        <ellipse cx="70" cy="30" rx="5" ry="6" fill={C.bulb} />
        <ellipse cx="86" cy="30" rx="5" ry="6" fill={C.bulb} />
      </>
    ) : null}
    {[56, 154].map((cx) => (
      <g key={cx} transform={`rotate(${spin} ${cx} 104)`}>
        <circle cx={cx} cy="104" r="18" fill={C.ink} stroke={C.rail} strokeWidth="4" />
        <path d={`M${cx - 14} 104h28M${cx} 90v28`} stroke={C.dustDim} strokeWidth="3" />
      </g>
    ))}
  </svg>
);

/** Two rails on ties; `offset` scrolls the ties (px) to fake motion. */
export const Track: React.FC<{ readonly width: number; readonly offset?: number; readonly style?: React.CSSProperties }> = ({ width, offset = 0, style }) => {
  const gap = 34;
  const n = Math.ceil(width / gap) + 2;
  return (
    <svg width={width} height={44} viewBox={`0 0 ${width} 44`} style={style}>
      {new Array(n).fill(0).map((_, i) => {
        const x = ((i * gap - (offset % gap)) + gap) % (n * gap) - gap;
        return <rect key={i} x={x} y={6} width={14} height={36} rx={2} fill={C.plum} />;
      })}
      <rect y={12} width={width} height={5} fill={C.rail} />
      <rect y={30} width={width} height={5} fill={C.rail} />
    </svg>
  );
};

/** A gold $GRAVE coin (headstone stamp) or an ETH fee coin. */
export const Coin: React.FC<{ readonly size: number; readonly kind?: "grave" | "eth"; readonly style?: React.CSSProperties }> = ({ size, kind = "grave", style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    {kind === "grave" ? (
      <>
        <circle cx="50" cy="50" r="47" fill={C.bulb} stroke={C.ink} strokeWidth="5" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#d99a12" strokeWidth="3" />
        <path d="M36 74V46c0-9 6-16 14-16s14 7 14 16v28Z" fill={C.ink} />
        <ellipse cx="45" cy="48" rx="2.6" ry="3.4" fill={C.bulb} />
        <ellipse cx="55" cy="48" rx="2.6" ry="3.4" fill={C.bulb} />
      </>
    ) : (
      <>
        <circle cx="50" cy="50" r="47" fill={C.cream} stroke={C.ink} strokeWidth="5" />
        <polygon points="50,18 70,52 50,63 30,52" fill={C.ink} />
        <polygon points="50,67 70,56 50,84 30,56" fill={C.ink} opacity="0.85" />
      </>
    )}
  </svg>
);

/** The high striker: fees drive the puck up to the bell. */
export const Striker: React.FC<{ readonly height: number; readonly fill: number; readonly ring?: boolean }> = ({ height, fill, ring = false }) => {
  const tower = height - 90;
  return (
    <div style={{ position: "relative", width: 120, height, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Bulb size={64} lit={ring} style={{ border: `5px solid ${C.ink}` }} />
      <div style={{ position: "relative", width: 34, height: tower, marginTop: 4, borderRadius: 999, border: `5px solid ${C.ink}`, background: C.plum, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: C.sign }} />
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 22 + fill * tower, width: 70, height: 22, translate: "-50% 50%", borderRadius: 6, border: `5px solid ${C.ink}`, background: C.bulb }} />
      <div style={{ width: 110, height: 16, borderRadius: 4, background: C.ink, marginTop: 4 }} />
    </div>
  );
};

/** Mort's wage tin. */
export const WageTin: React.FC<{ readonly width: number; readonly label?: string }> = ({ width, label = "WAGES" }) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 200 220">
    <ellipse cx="100" cy="206" rx="78" ry="10" fill={C.nightDeep} />
    <path d="M28 64h144v128c0 8-32 16-72 16s-72-8-72-16Z" fill={C.rail} stroke={C.ink} strokeWidth="4" />
    <rect x="44" y="108" width="112" height="52" rx="8" fill={C.slime} stroke={C.ink} strokeWidth="3" />
    <text x="100" y="142" textAnchor="middle" fontFamily="Bungee" fontSize="20" fill={C.ink}>
      {label}
    </text>
    <ellipse cx="100" cy="64" rx="76" ry="16" fill={C.dustDim} stroke={C.ink} strokeWidth="4" />
    <rect x="80" y="58" width="40" height="8" rx="4" fill={C.nightDeep} />
  </svg>
);
