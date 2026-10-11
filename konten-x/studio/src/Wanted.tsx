import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Coin, GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;

type WantedProps = { readonly burned: number; readonly graves: number; readonly latest: { n: number; tokens: number; tx: string } };

const PAPER = "#ead9b4";
const PAPER_INK = "#3a2416";

const Nail: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #c9c2d6, #4a4458 70%)", boxShadow: "0 3px 4px rgba(0,0,0,0.6)" }} />
);
const BulletHole: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 26 * s, height: 26 * s, borderRadius: "50%", background: "radial-gradient(circle, #0e0714 35%, #5b3b22 45%, rgba(91,59,34,0) 70%)" }} />
);

/* ═════════ 54 · WANTED: dead, not alive (1080×1350) ═════════ */
export const PostWanted: React.FC<WantedProps> = ({ burned, graves, latest }) => {
  const pct = (burned / 1e9) * 100;
  return (
    <AbsoluteFill>
      <Night glow={0.6} />
      {/* wooden wall */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #2a1a22 0 128px, #22141c 128px 134px, #2e1d26 134px 270px)", opacity: 0.9 }} />
      <Motes count={18} />

      {/* the poster */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 60,
          bottom: 150,
          background: `radial-gradient(120% 90% at 50% 40%, ${PAPER} 55%, #cdb487 100%)`,
          color: PAPER_INK,
          rotate: "-1.2deg",
          boxShadow: "0 40px 70px -30px rgba(0,0,0,0.95)",
          clipPath: "polygon(0 1%, 4% 0, 30% 0.6%, 62% 0, 96% 0.8%, 100% 0, 99.4% 30%, 100% 62%, 99.2% 97%, 100% 100%, 70% 99.3%, 35% 100%, 3% 99.4%, 0 100%, 0.6% 60%, 0 28%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "44px 56px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: sign, fontSize: 168, lineHeight: 0.9, letterSpacing: "0.02em" }}>WANTED</div>
        <div style={{ width: "100%", height: 0, borderTop: `5px double ${PAPER_INK}`, marginTop: 10 }} />
        <div style={{ fontFamily: display, fontSize: 42, marginTop: 14, color: C.signDeep }}>DEAD. NOT ALIVE.</div>

        {/* mugshot */}
        <div style={{ marginTop: 22, width: 380, height: 300, border: `6px solid ${PAPER_INK}`, background: "repeating-linear-gradient(180deg, #d9c79f 0 29px, #b9a27a 29px 31px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Coin size={210} />
          <div style={{ position: "absolute", bottom: -4, left: "50%", translate: "-50% 50%", background: PAPER_INK, color: PAPER, fontFamily: mono, fontWeight: 700, fontSize: 22, padding: "6px 14px", whiteSpace: "nowrap" }}>INMATE: $GRAVE SUPPLY</div>
        </div>

        <div style={{ fontFamily: sign, fontSize: 52, lineHeight: 1.05, marginTop: 44 }}>The $GRAVE Supply</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontStyle: "italic", fontSize: 28, marginTop: 6 }}>for crimes against scarcity</div>

        <div style={{ display: "flex", gap: 26, marginTop: 26, width: "100%" }}>
          <div style={{ flex: 1, border: `4px solid ${PAPER_INK}`, padding: "12px 10px" }}>
            <div style={{ fontFamily: display, fontSize: 20 }}>ALREADY CAUGHT</div>
            <div style={{ fontFamily: display, fontSize: 40, lineHeight: 1.1, marginTop: 4 }}>{fmt(burned)}</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 20 }}>{pct.toFixed(2)}% · {graves} graves</div>
          </div>
          <div style={{ flex: 1, border: `4px solid ${PAPER_INK}`, padding: "12px 10px", background: "rgba(158,21,40,0.08)" }}>
            <div style={{ fontFamily: display, fontSize: 20 }}>REWARD</div>
            <div style={{ fontFamily: sign, fontSize: 40, lineHeight: 1.1, marginTop: 4, color: C.signDeep }}>a smaller supply</div>
          </div>
        </div>

        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 23, lineHeight: 1.5, marginTop: 22 }}>
          LAST SEEN: on the Pons curve, Robinhood Chain
          <br />
          IF FOUND, DELIVER TO: 0x…dEaD
        </div>
        <div style={{ fontFamily: mono, fontSize: 19, marginTop: 8, opacity: 0.8 }}>
          latest capture: grave #{latest.n} · {fmt(latest.tokens)} $GRAVE · tx {short(latest.tx)}
        </div>
        <div style={{ marginTop: 26, rotate: "-4deg", border: `5px solid ${C.signDeep}`, borderRadius: 10, padding: "8px 22px", color: C.signDeep, fontFamily: display, fontSize: 30, opacity: 0.9 }}>
          STILL AT LARGE: {fmt(1e9 - burned)}
        </div>
      </div>

      <Nail x={110} y={78} />
      <Nail x={950} y={70} />
      <Nail x={104} y={1170} />
      <Nail x={956} y={1178} />
      <BulletHole x={820} y={210} />
      <BulletHole x={180} y={560} s={0.8} />
      <BulletHole x={870} y={760} s={1.1} />

      {/* sheriff's signature */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <MortEyes size={26} look={0.3} />
          <span style={{ fontFamily: sign, fontSize: 38, color: C.bulb }}>— Sheriff Mort</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={42} />
          <span style={{ fontFamily: display, fontSize: 24, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
