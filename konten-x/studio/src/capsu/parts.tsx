import { C, TOPS, display, dot } from "./brand";

export const D = (size: number, color: string = C.plate, weight = 900): React.CSSProperties => ({ margin: 0, fontFamily: display, fontWeight: weight, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.02em", color });
export const L = (size: number, color: string = C.led): React.CSSProperties => ({ margin: 0, fontFamily: dot, fontSize: size, letterSpacing: "0.06em", lineHeight: 1.2, color });

/** One capsule. `face` makes it the mascot. */
export const Capsule: React.FC<{ size: number; top?: string; face?: boolean; rot?: number; style?: React.CSSProperties }> = ({ size, top = C.pink, face, rot = 0, style }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ transform: `rotate(${rot}deg)`, ...style }}>
    <circle cx="24" cy="24" r="20" fill="#fff" />
    <path d="M4 24a20 20 0 0 1 40 0Z" fill={top} />
    <rect x="4" y="22.2" width="40" height="3.6" fill={C.ink} />
    <circle cx="24" cy="24" r="20" fill="none" stroke={C.ink} strokeWidth="3.6" />
    <path d="M11.5 17.5a14 14 0 0 1 6.2-6.4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".9" />
    {face ? (
      <>
        <circle cx="17.5" cy="32" r="2.2" fill={C.ink} />
        <circle cx="30.5" cy="32" r="2.2" fill={C.ink} />
        <path d="M21 35.2a3.6 3.6 0 0 0 6 0" fill="none" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
      </>
    ) : null}
  </svg>
);

/**
 * The drum window. `p` is 0–1 through a loop: the two rings of capsules make whole turns in
 * opposite directions, so the motion repeats without a seam. `stir` scales how far they travel.
 */
export const Drum: React.FC<{ size: number; p: number; bezel?: number; mascot?: boolean }> = ({ size, p, bezel = size * 0.045, mascot = true }) => {
  const R = size / 2 - bezel;
  const outer = 9;
  const inner = 5;
  const cap = R * 0.34;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: C.interior, border: `${bezel}px solid ${C.plate}`, boxSizing: "border-box", boxShadow: "0 30px 60px -20px rgba(5,8,60,0.8), inset 0 14px 40px rgba(4,6,50,0.8)", overflow: "hidden" }}>
      {Array.from({ length: outer }, (_, i) => {
        const a = (i / outer + p) * Math.PI * 2;
        const wob = Math.sin((p * 2 + i * 0.37) * Math.PI * 2) * R * 0.03;
        return <Capsule key={`o${i}`} size={cap} top={TOPS[i % 4]} rot={(p * 360 * 2 + i * 71) % 360} style={{ position: "absolute", left: R + Math.cos(a) * (R * 0.72 + wob) - cap / 2, top: R + Math.sin(a) * (R * 0.72 + wob) - cap / 2 }} />;
      })}
      {Array.from({ length: inner }, (_, i) => {
        const a = (i / inner - p) * Math.PI * 2 + 0.5;
        return <Capsule key={`i${i}`} size={cap} top={TOPS[(i + 2) % 4]} rot={(-p * 360 + i * 53) % 360} style={{ position: "absolute", left: R + Math.cos(a) * R * 0.38 - cap / 2, top: R + Math.sin(a) * R * 0.38 - cap / 2 }} />;
      })}
      {mascot ? <Capsule size={cap * 1.5} top={C.body} face rot={Math.sin(p * Math.PI * 2) * 10} style={{ position: "absolute", left: R - cap * 0.75, top: R - cap * 0.75 + Math.sin(p * Math.PI * 4) * R * 0.03 }} /> : null}
      <div style={{ position: "absolute", inset: "5%", borderRadius: "50%", border: `${size * 0.012}px solid transparent`, borderTopColor: "rgba(255,255,255,0.3)", transform: "rotate(-38deg)" }} />
    </div>
  );
};

/** A white die-cut sticker. */
export const Sticker: React.FC<{ children: React.ReactNode; rot?: number; pad?: number; radius?: number; style?: React.CSSProperties }> = ({ children, rot = 0, pad = 30, radius = 30, style }) => (
  <div style={{ display: "inline-block", background: C.plate, color: C.ink, borderRadius: radius, padding: pad, transform: `rotate(${rot}deg)`, boxShadow: "0 18px 40px -14px rgba(6,9,60,0.65)", ...style }}>{children}</div>
);

const CAPS: [number, number, number][] = [
  [150, 300, 0], [205, 322, 1], [262, 318, 2], [312, 286, 3], [128, 250, 2], [182, 268, 3], [238, 270, 0],
  [292, 236, 1], [158, 208, 1], [214, 218, 2], [268, 196, 3], [196, 166, 0], [246, 150, 1],
];

/**
 * The machine with its front off (same drawing as the site's cutaway), posed by numbers:
 * fill 0–1 coin box, coinY 0–1 a coin falling, lock 0–1, ring 0–1, crank and drum in degrees,
 * drop 0–1 capsule down the chute, open 0–1 capsule opening, step 1–4 which parts are bright.
 */
export const Machine: React.FC<{ w: number; fill?: number; coinY?: number; lock?: number; ring?: number; crank?: number; drum?: number; drop?: number; open?: number; step?: number }> = ({ w, fill = 0.12, coinY = -1, lock = 0, ring = 0, crank = 0, drum = 0, drop = -1, open = 0, step = 0 }) => {
  const dim = (n: number) => (step === 0 || step === n ? 1 : step > n ? 0.5 : 0.25);
  return (
    <svg viewBox="0 0 600 660" width={w} height={(w * 660) / 600} style={{ filter: "drop-shadow(0 30px 40px rgba(3,5,40,0.55))" }}>
      <rect x="14" y="14" width="572" height="632" rx="44" fill={C.body} stroke={C.ink} strokeWidth="5" />
      <rect x="40" y="40" width="520" height="416" rx="30" fill={C.interior} stroke={C.ink} strokeWidth="4" />
      <g opacity={dim(1)}>
        <rect x="446" y="64" width="78" height="20" rx="10" fill={C.ink} />
        <path d="M485 84v62" stroke={C.ink} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
        <rect x="430" y="150" width="110" height="150" rx="14" fill={C.ledBg} stroke={C.ink} strokeWidth="4" />
        <rect x="436" y={156 + 138 * (1 - fill)} width="98" height={138 * fill} rx="9" fill={C.coin} />
        <path d="M430 196h110" stroke={C.plate} strokeWidth="3" strokeDasharray="7 7" />
        {coinY >= 0 && coinY <= 1 ? (
          <g transform={`translate(485 ${74 + coinY * 150})`}>
            <circle r="15" fill={C.coin} stroke={C.ink} strokeWidth="4" />
            <path d="M0-7v14" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : null}
      </g>
      <circle cx="220" cy="240" r="156" fill="#101767" stroke={C.plate} strokeWidth="12" />
      <circle cx="220" cy="240" r="156" fill="none" stroke={C.coin} strokeWidth="12" strokeDasharray="981" strokeDashoffset={981 * (1 - ring)} transform="rotate(-90 220 240)" />
      <g transform={`rotate(${drum} 220 240)`}>
        {CAPS.map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 47) % 360})`}>
            <circle r="24" fill="#fff" />
            <path d="M-24 0a24 24 0 0 1 48 0Z" fill={TOPS[c]} />
            <rect x="-24" y="-2" width="48" height="4" fill={C.ink} />
            <circle r="24" fill="none" stroke={C.ink} strokeWidth="4" />
          </g>
        ))}
      </g>
      <g opacity={dim(2)}>
        <path d="M196 62v-22a24 24 0 0 1 48 0v22" fill="none" stroke={C.plate} strokeWidth="10" strokeLinecap="round" transform={`translate(0 ${-22 * (1 - lock)})`} />
        <rect x="178" y="58" width="84" height="58" rx="12" fill={C.coin} stroke={C.ink} strokeWidth="4" />
        <circle cx="220" cy="82" r="7" fill={C.ink} />
        <path d="M220 86v14" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g opacity={dim(3)}>
        <circle cx="485" cy="380" r="52" fill={C.plate} stroke={C.ink} strokeWidth="5" />
        <g transform={`rotate(${crank} 485 380)`}>
          <rect x="477" y="336" width="16" height="88" rx="8" fill={C.ink} />
          <circle cx="485" cy="340" r="15" fill={C.pink} stroke={C.ink} strokeWidth="4" />
          <circle cx="485" cy="380" r="9" fill={C.ink} />
        </g>
      </g>
      <g opacity={dim(4)}>
        <path d="M186 394v96a34 34 0 0 0 34 34h0a34 34 0 0 0 34-34v-96" fill={C.ledBg} stroke={C.ink} strokeWidth="4" />
        <rect x="120" y="524" width="200" height="92" rx="22" fill={C.ledBg} stroke={C.ink} strokeWidth="4" />
        <rect x="136" y="596" width="168" height="8" rx="4" fill={C.plate} opacity=".5" />
        {open > 0 ? (
          <g transform={`translate(0 ${34 * (1 - open)})`} opacity={open}>
            <rect x="188" y="518" width="64" height="40" rx="6" fill={C.plate} stroke={C.ink} strokeWidth="3.5" />
            <path d="M198 532h44M198 544h28" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : null}
        {drop >= 0 ? (
          <g transform={`translate(220 ${330 + 236 * Math.min(1, drop)})`}>
            <g transform={`translate(${-34 * open} ${-40 * open}) rotate(${-38 * open})`}>
              <path d="M-26 0a26 26 0 0 1 52 0Z" fill={C.mint} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
            </g>
            <path d="M-26 0a26 26 0 0 0 52 0Z" fill="#fff" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
