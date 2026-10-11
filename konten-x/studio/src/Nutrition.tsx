import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type NutritionProps = {
  readonly burned: number;
  readonly graves: number;
  readonly biggest: { n: number; tokens: number };
  readonly smallest: { n: number; tokens: number };
};

const LABEL_INK = "#111";
const Bar: React.FC<{ h: number }> = ({ h }) => <div style={{ height: h, background: LABEL_INK, margin: "6px 0" }} />;
const Row: React.FC<{ left: React.ReactNode; right?: React.ReactNode; indent?: boolean; bold?: boolean; line?: boolean }> = ({ left, right, indent, bold, line = true }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: line ? `2px solid ${LABEL_INK}` : "none", paddingLeft: indent ? 30 : 0, fontWeight: bold ? 900 : 500 }}>
    <span>{left}</span>
    <span style={{ fontWeight: 900 }}>{right}</span>
  </div>
);

/* ═════════ 55 · $GRAVE Nutrition Facts (1080×1350) ═════════ */
export const PostNutrition: React.FC<NutritionProps> = ({ burned, graves, biggest, smallest }) => {
  const pct = (burned / 1e9) * 100;
  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <Motes count={22} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 88, lineHeight: 1, color: C.cream }}>
          Read the <span style={{ color: C.bulb }}>label.</span>
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: C.dust, marginTop: 10 }}>every serving goes straight to the graveyard.</div>
      </div>

      {/* the label */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 215,
          width: 780,
          background: "#fbf8f0",
          color: LABEL_INK,
          border: `5px solid ${LABEL_INK}`,
          padding: "16px 24px 20px",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontSize: 29,
          rotate: "1.2deg",
          boxShadow: "0 40px 60px -30px rgba(0,0,0,0.95)",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>Nutrition Facts</div>
        <div style={{ height: 2, background: LABEL_INK, margin: "8px 0" }} />
        <Row left={`${graves} servings per graveyard`} line={false} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 900 }}>
          <span>Serving size</span>
          <span>1 burial</span>
        </div>
        <Bar h={18} />
        <div style={{ fontSize: 20, fontWeight: 900 }}>Amount per serving</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 54, fontWeight: 900 }}>Avg. burial</span>
          <span style={{ fontSize: 54, fontWeight: 900 }}>{fmt(burned / graves)}</span>
        </div>
        <Bar h={10} />
        <div style={{ textAlign: "right", fontSize: 20, fontWeight: 900, paddingBottom: 4, borderBottom: `2px solid ${LABEL_INK}` }}>% of supply*</div>
        <Row bold left={`Total buried ${fmt(burned)}`} right={`${pct.toFixed(2)}%`} />
        <Row indent left={`Biggest serving (#${biggest.n})`} right={fmt(biggest.tokens)} />
        <Row indent left={`Smallest serving (#${smallest.n})`} right={fmt(smallest.tokens)} />
        <Row bold left="Returned from 0x…dEaD" right="0%" />
        <Row bold left="Paper hands" right="0g" />
        <Row indent left="Regret" right="0g" />
        <Row bold left="Deflation" right="100%" />
        <Bar h={18} />
        <div style={{ fontSize: 21, lineHeight: 1.35 }}>
          * % of the 1,000,000,000 $GRAVE supply sitting in 0x000…dEaD. Burials verifiable on-chain.
        </div>
        <div style={{ height: 2, background: LABEL_INK, margin: "10px 0" }} />
        <div style={{ fontSize: 23, lineHeight: 1.4 }}>
          <b>INGREDIENTS:</b> dirt, creator fees, one shovel, Mort.
          <br />
          <b>CONTAINS:</b> deflation. May contain traces of red candles.
          <br />
          <b>STORAGE:</b> keep in a cool, dark place (0x…dEaD). Do not dig up.
        </div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={44} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: sign, fontSize: 32, color: C.bulb, whiteSpace: "nowrap" }}>“zero calories. zero survivors.”</span>
          <MortEyes size={22} look={-0.5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
