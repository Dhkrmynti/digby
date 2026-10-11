import { AbsoluteFill, random } from "remotion";
import { C, display, mono, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const shade = "0 5px 0 rgba(42,22,38,0.55)";

type ReceiptProps = {
  readonly date: string;
  readonly shift: string;
  readonly graves: number[]; // $GRAVE buried per grave, in order
  readonly burned: number; // dead address total
  readonly feesEth: string;
  readonly burialEth: string;
  readonly wageEth: string;
  readonly wages: number;
};

const Row: React.FC<{ readonly l: React.ReactNode; readonly r: React.ReactNode; readonly bold?: boolean; readonly size?: number }> = ({ l, r, bold, size = 25 }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: mono, fontWeight: bold ? 700 : 400, fontSize: size, lineHeight: 1.3 }}>
    <span style={{ whiteSpace: "nowrap" }}>{l}</span>
    <span style={{ flex: 1, borderBottom: `3px dotted rgba(42,22,38,0.35)`, translate: "0 -6px" }} />
    <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{r}</span>
  </div>
);

const Rule: React.FC<{ readonly double?: boolean }> = ({ double }) => (
  <div style={{ margin: "12px 0", borderTop: `${double ? 6 : 3}px ${double ? "double" : "dashed"} rgba(42,22,38,${double ? 0.7 : 0.45})` }} />
);

// Thermal paper torn edge, as a zigzag mask
const zig = (top: boolean) => {
  const teeth = 28;
  const pts = new Array(teeth + 1).fill(0).map((_, i) => `${(i / teeth) * 100}% ${top ? (i % 2 ? 0 : 14) : i % 2 ? 100 : 0}px`);
  return top ? `polygon(${pts.join(",")}, 100% 100%, 0 100%)` : `polygon(0 0, 100% 0, ${pts.reverse().join(",")})`;
};

/* ═════════ Post: Mort's receipt (1080×1350) ═════════ */
export const PostReceipt: React.FC<ReceiptProps> = ({ date, shift, graves, burned, feesEth, burialEth, wageEth, wages }) => {
  const bars = new Array(64).fill(0).map((_, i) => 2 + Math.floor(random(`bar${i}`) * 4) * 2);
  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={1.1} glowY="10%" />
      <Motes count={30} />

      {/* headline */}
      <div style={{ position: "absolute", top: 52, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1, color: C.cream, textShadow: shade }}>Mort printed</div>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>the receipt.</div>
      </div>

      {/* the receipt */}
      <div style={{ position: "absolute", left: 230, top: 260, width: 620, rotate: "-2.2deg", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
        <div style={{ height: 14, background: "#f7f1e1", clipPath: zig(true) }} />
        <div
          style={{
            background: "linear-gradient(180deg, #f7f1e1 0%, #f1e8d2 55%, #ebe0c6 100%)",
            color: C.ink,
            padding: "14px 40px 22px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <GraveMark size={64} />
            <div style={{ fontFamily: display, fontSize: 34, marginTop: 6 }}>MORT’S GRAVEYARD</div>
            <div style={{ fontFamily: mono, fontSize: 21, opacity: 0.75 }}>under the blocks · Robinhood Chain</div>
            <div style={{ fontFamily: mono, fontSize: 21, opacity: 0.75 }}>
              {date} · SHIFT {shift} UTC
            </div>
          </div>
          <Rule />
          <Row l="ITEM" r="$GRAVE" bold size={22} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28 }}>
            {graves.map((g, i) => (
              <Row key={i} l={`GRAVE #${String(i + 1).padStart(2, "0")}`} r={`${(g / 1e6).toFixed(2)}M`} size={21} />
            ))}
          </div>
          <Rule />
          <Row l="FEES CLAIMED" r={`${feesEth} ETH`} />
          <Row l={<span style={{ paddingLeft: 26 }}>SPENT ON BURIALS</span>} r={`${burialEth} ETH`} />
          <Row l={<span style={{ paddingLeft: 26 }}>MORT’S WAGES x{wages}</span>} r={`${wageEth} ETH`} />
          <Rule double />
          <Row l="TOTAL BURIED" r={fmt(burned)} bold size={30} />
          <Row l="SHARE OF SUPPLY" r={`${((burned / 1e9) * 100).toFixed(2)}%`} bold size={30} />
          <Rule />
          <Row l="DELIVERED TO" r="0x000…dEaD" size={22} />
          <Row l="REFUNDS" r="NEVER" size={22} />
          <Row l="CHANGE DUE" r="0.00" size={22} />
          <Row l="CASHIER" r="MORT" size={22} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 3, height: 64, marginTop: 18 }}>
            {bars.map((w, i) => (
              <div key={i} style={{ width: w, height: i % 9 === 0 ? 64 : 56, background: C.ink, opacity: i % 3 === 2 ? 0 : 1 }} />
            ))}
          </div>
          <div style={{ textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 22, marginTop: 10 }}>THANK YOU FOR DYING WITH US</div>
          <div style={{ textAlign: "center", fontFamily: mono, fontSize: 19, opacity: 0.7 }}>every trade digs a grave · no returns</div>
        </div>
        <div style={{ height: 14, background: "#ebe0c6", clipPath: zig(false) }} />

        {/* PAID stamp */}
        <div
          style={{
            position: "absolute",
            right: -64,
            top: 34,
            rotate: "-16deg",
            padding: "8px 22px",
            border: `7px solid ${C.sign}`,
            borderRadius: 14,
            color: C.sign,
            fontFamily: display,
            fontSize: 50,
            lineHeight: 1,
            textAlign: "center",
            opacity: 0.88,
            mixBlendMode: "multiply",
          }}
        >
          BURIED
          <div style={{ fontSize: 20, marginTop: 4 }}>IN FULL</div>
        </div>
      </div>

      {/* Mort, peeking from the dark */}
      <div style={{ position: "absolute", left: 70, top: 1150 }}>
        <MortEyes size={30} look={0.8} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 1196, fontFamily: sign, fontSize: 34, color: C.bulb, rotate: "-4deg" }}>“keep it.”</div>
      <div style={{ position: "absolute", right: 64, bottom: 56, fontFamily: display, fontSize: 28, color: C.dust }}>GRAVEBURN.FUN</div>
    </AbsoluteFill>
  );
};
