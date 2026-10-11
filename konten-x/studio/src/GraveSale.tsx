import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Bulb, GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const cardboard = "#c99d62";
const cardboardDark = "#a87b45";
const marker = "#24131f";

type GraveSaleProps = {
  readonly burned: number;
  readonly graves: number;
  readonly boxFill: number; // 0..1
  readonly next: "burial" | "wages";
};

/** A paper price tag on a string. */
const Tag: React.FC<{ readonly children: React.ReactNode; readonly rotate: number; readonly style?: React.CSSProperties }> = ({ children, rotate, style }) => (
  <div style={{ position: "absolute", rotate: `${rotate}deg`, transformOrigin: "top center", ...style }}>
    <svg width={4} height={60} style={{ display: "block", margin: "0 auto" }}>
      <line x1={2} y1={0} x2={2} y2={60} stroke={C.ticket} strokeWidth={3} opacity={0.8} />
    </svg>
    <div
      style={{
        position: "relative",
        background: C.ticket,
        color: C.ink,
        padding: "26px 20px 16px",
        borderRadius: 10,
        clipPath: "polygon(22% 0, 78% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)",
        textAlign: "center",
        boxShadow: "0 16px 24px -10px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ position: "absolute", left: "50%", top: 8, width: 12, height: 12, borderRadius: "50%", background: C.night, translate: "-50% 0" }} />
      {children}
    </div>
  </div>
);

const Shovel: React.FC<{ readonly style?: React.CSSProperties }> = ({ style }) => (
  <svg width={150} height={420} viewBox="0 0 150 420" style={style}>
    <rect x={64} y={10} width={22} height={270} rx={8} fill="#7a4e2c" stroke={C.ink} strokeWidth={4} />
    <path d="M48 14h54v26H48Z" fill="#7a4e2c" stroke={C.ink} strokeWidth={4} />
    <path d="M58 272h34l8 18H50Z" fill={C.rail} stroke={C.ink} strokeWidth={4} />
    <path d="M30 290h90v60c0 30-20 58-45 66-25-8-45-36-45-66Z" fill={C.dust} stroke={C.ink} strokeWidth={4} />
    <path d="M44 304v44c0 20 14 40 31 48" fill="none" stroke={C.cream} strokeWidth={4} opacity={0.6} strokeLinecap="round" />
  </svg>
);

/* ═════════ Post: Graveyard sale, everything must go (1080×1350) ═════════ */
export const PostGraveSale: React.FC<GraveSaleProps> = ({ burned, graves, boxFill, next }) => {
  const burial = next === "burial";
  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={1} glowY="5%" />
      <Motes count={30} />

      {/* headline */}
      <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 30, color: C.sign, letterSpacing: "0.04em" }}>CHART’S DOWN. MORT’S OPEN.</div>
        <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 10 }}>Dirt is cheap</div>
        <div style={{ fontFamily: sign, fontSize: 96, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>today.</div>
      </div>

      {/* Mort, in the trees */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: 0.9 }}>
        <MortEyes size={22} look={-0.6} glow={0.8} />
      </div>

      {/* headstones with price tags */}
      <div style={{ position: "absolute", left: 40, top: 520 }}>
        <Headstone width={180} height={330} shape={0} style={{ paddingTop: 80 }}>
          <div style={{ fontFamily: display, fontSize: 20 }}>HERE LIES</div>
          <div style={{ fontFamily: display, fontSize: 24, marginTop: 4 }}>YOUR FOMO</div>
        </Headstone>
        <Tag rotate={-8} style={{ left: 60, top: 150, width: 170 }}>
          <div style={{ fontFamily: display, fontSize: 18, opacity: 0.6 }}>WAS</div>
          <div style={{ fontFamily: display, fontSize: 28, textDecoration: "line-through", textDecorationColor: C.sign, textDecorationThickness: 3 }}>PRICEY</div>
        </Tag>
      </div>
      <div style={{ position: "absolute", right: 40, top: 480 }}>
        <Headstone width={190} height={370} shape={2} style={{ paddingTop: 110 }}>
          <div style={{ fontFamily: display, fontSize: 20 }}>PLOT</div>
          <div style={{ fontFamily: display, fontSize: 40, marginTop: 2 }}>#{graves + 1}</div>
          <div style={{ fontFamily: display, fontSize: 16, marginTop: 4, opacity: 0.7 }}>RESERVED</div>
        </Headstone>
        <Tag rotate={7} style={{ left: -70, top: 170, width: 190 }}>
          <div style={{ fontFamily: display, fontSize: 18, opacity: 0.6 }}>NOW</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.signDeep }}>DIRT</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.signDeep, lineHeight: 1 }}>CHEAP</div>
        </Tag>
      </div>

      {/* the yard-sale sign on its stake, Mort's shovel leaning behind it */}
      <Shovel style={{ position: "absolute", left: 300, top: 560, rotate: "-17deg" }} />
      <div style={{ position: "absolute", left: 523, top: 620, width: 34, height: 300, background: "#6b4426", border: `4px solid ${C.ink}`, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 250, top: 330, width: 580, rotate: "-3deg", filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.6))" }}>
        <div
          style={{
            position: "relative",
            background: `radial-gradient(120% 90% at 30% 20%, #d8ae73 0%, ${cardboard} 55%, ${cardboardDark} 100%)`,
            border: `4px solid ${C.ink}`,
            borderRadius: 6,
            padding: "30px 30px 26px",
            textAlign: "center",
            color: marker,
            clipPath: "polygon(0 2%, 4% 0, 30% 1.5%, 62% 0, 97% 1%, 100% 5%, 99% 40%, 100% 96%, 96% 100%, 60% 98.5%, 22% 100%, 1% 98%, 0.5% 60%)",
          }}
        >
          {/* tape */}
          <div style={{ position: "absolute", left: -10, top: 12, width: 90, height: 30, background: "rgba(241,230,204,0.55)", rotate: "-30deg" }} />
          <div style={{ position: "absolute", right: -10, top: 12, width: 90, height: 30, background: "rgba(241,230,204,0.55)", rotate: "30deg" }} />
          <div style={{ fontFamily: sign, fontSize: 70, lineHeight: 1, color: C.signDeep }}>Graveyard</div>
          <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.signDeep, marginTop: -2 }}>SALE!</div>
          <div style={{ height: 5, background: marker, borderRadius: 3, margin: "16px 30px 14px", rotate: "-1deg" }} />
          <div style={{ fontFamily: display, fontSize: 44, lineHeight: 1.05 }}>EVERYTHING</div>
          <div style={{ fontFamily: display, fontSize: 44, lineHeight: 1.05 }}>MUST GO</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, marginTop: 10, rotate: "-2deg" }}>(to 0x000…dEaD)</div>
        </div>
      </div>

      {/* ground */}
      <div style={{ position: "absolute", left: -20, right: -20, top: 900, height: 60, background: "linear-gradient(180deg, #2a1838 0%, #170d1f 100%)", borderTop: `4px solid ${C.plumLine}`, borderRadius: "50% 50% 0 0 / 30px 30px 0 0" }} />

      {/* the reason: Mort's next ride */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 980, display: "flex", gap: 22 }}>
        <div style={{ flex: 1.25, background: C.ticket, color: C.ink, borderRadius: 14, padding: "22px 26px" }}>
          <div style={{ fontFamily: display, fontSize: 22, color: C.ticketDim }}>MORT’S NEXT RIDE</div>
          <div style={{ fontFamily: sign, fontSize: 46, lineHeight: 1.05, color: burial ? C.signDeep : "#3d7a0c", marginTop: 4 }}>
            {burial ? `Burial · grave #${graves + 1}` : "Mort’s wages"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <Bulb size={22} lit />
            <span style={{ fontFamily: display, fontSize: 22 }}>COIN BOX</span>
            <div style={{ flex: 1, height: 22, borderRadius: 11, background: "rgba(42,22,38,0.15)", border: `3px solid ${C.ink}`, overflow: "hidden" }}>
              <div style={{ width: `${boxFill * 100}%`, height: "100%", background: C.sign }} />
            </div>
            <span style={{ fontFamily: display, fontSize: 24, color: C.signDeep }}>{Math.round(boxFill * 100)}%</span>
          </div>
          <div style={{ fontFamily: body, fontSize: 25, lineHeight: 1.35, marginTop: 14 }}>
            Same fee ETH, cheaper $GRAVE. <b>A dip makes the next grave bigger.</b>
          </div>
        </div>
        <div style={{ flex: 0.75, background: "rgba(14,7,20,0.8)", border: `3px solid ${C.plumLine}`, borderRadius: 14, padding: "22px 22px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: display, fontSize: 20, color: C.dust }}>ALREADY GONE</div>
          <div style={{ fontFamily: display, fontSize: 44, lineHeight: 1.1, color: C.bulb, fontVariantNumeric: "tabular-nums" }}>{(burned / 1e6).toFixed(2)}M</div>
          <div style={{ fontFamily: body, fontSize: 22, color: C.cream, marginTop: 6 }}>
            $GRAVE in {graves} graves
          </div>
          <div style={{ fontFamily: body, fontSize: 22, color: C.dust }}>{((burned / 1e9) * 100).toFixed(2)}% of supply · {fmt(burned)}</div>
        </div>
      </div>

      {/* footer */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: body, fontStyle: "italic", fontSize: 24, color: C.dust }}>Not financial advice. Gravedigger advice.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GraveMark size={40} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
