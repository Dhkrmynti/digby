import React from "react";
import { AbsoluteFill } from "remotion";
import { C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;
const PAPER = "#efe4c8";
const INK = "#1d1712";
const serif = "Georgia, 'Times New Roman', serif";

type Obit = { readonly n: number; readonly tokens: number; readonly tx: string };
type GazetteProps = { readonly burned: number; readonly graves: number; readonly record: Obit; readonly latest: Obit[]; readonly date: string };

const Rule: React.FC<{ double?: boolean }> = ({ double }) => (
  <div style={{ borderTop: `${double ? 5 : 2}px ${double ? "double" : "solid"} ${INK}`, margin: "10px 0" }} />
);

/* ═════════ 43 · The Graveyard Gazette, front page (1080×1350) ═════════ */
export const PostGazette: React.FC<GazetteProps> = ({ burned, graves, record, latest, date }) => (
  <AbsoluteFill>
    <Night glow={0.6} />
    <Motes count={20} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 50, bottom: 50, background: PAPER, color: INK, padding: "34px 44px", rotate: "-1deg", boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
      {/* masthead */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 18, fontWeight: 700 }}>
        <span>{date}</span>
        <span>ROBINHOOD CHAIN EDITION</span>
        <span>PRICE: ONE TRADE</span>
      </div>
      <Rule double />
      <div style={{ fontFamily: sign, fontSize: 98, lineHeight: 1, textAlign: "center", letterSpacing: "0.01em" }}>The Graveyard Gazette</div>
      <div style={{ textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: 22, marginTop: 6 }}>“All the supply that’s fit to bury.” · Est. by Mort</div>
      <Rule double />

      {/* headline */}
      <div style={{ fontFamily: display, fontSize: 64, lineHeight: 1.02, textAlign: "center", marginTop: 14 }}>
        {fmt(burned)} $GRAVE
        <br />
        CONFIRMED DEAD
      </div>
      <div style={{ textAlign: "center", fontFamily: serif, fontSize: 26, fontStyle: "italic", marginTop: 10 }}>
        {((burned / 1e9) * 100).toFixed(2)}% of the supply now underground. Next of kin: 0x…dEaD.
      </div>
      <Rule />

      {/* three columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 26, marginTop: 8 }}>
        <div>
          <div style={{ fontFamily: display, fontSize: 26, lineHeight: 1.1 }}>{graves} BURIALS, ZERO SURVIVORS</div>
          <p style={{ fontFamily: serif, fontSize: 21, lineHeight: 1.35, margin: "10px 0 0" }}>
            Every one of the {graves} burials went straight from Mort’s wallet to the dead address. Witnesses report the tokens “did not come back.” Each burial has its own tx on-chain.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <Headstone width={150} height={170} shape={0} style={{ paddingTop: 46 }}>
              <div style={{ fontFamily: display, fontSize: 14 }}>R.I.P.</div>
              <div style={{ fontFamily: display, fontSize: 20, marginTop: 4 }}>{(burned / 1e6).toFixed(1)}M</div>
              <div style={{ fontFamily: display, fontSize: 13 }}>$GRAVE</div>
            </Headstone>
          </div>
        </div>
        <div style={{ borderLeft: `2px solid ${INK}`, paddingLeft: 22 }}>
          <div style={{ fontFamily: display, fontSize: 26, lineHeight: 1.1 }}>RECORD STILL STANDS</div>
          <p style={{ fontFamily: serif, fontSize: 21, lineHeight: 1.35, margin: "10px 0 0" }}>
            Burial #{record.n} remains the biggest grave ever dug: <b>{fmt(record.tokens)} $GRAVE</b> in a single tx.
          </p>
          <div style={{ fontFamily: mono, fontSize: 16, marginTop: 8 }}>tx {short(record.tx)}</div>
          <div style={{ fontFamily: display, fontSize: 24, marginTop: 22, lineHeight: 1.1 }}>WEATHER</div>
          <p style={{ fontFamily: serif, fontSize: 21, lineHeight: 1.35, margin: "8px 0 0" }}>Foggy over the graveyard. 0% chance of return.</p>
        </div>
        <div style={{ borderLeft: `2px solid ${INK}`, paddingLeft: 22 }}>
          <div style={{ fontFamily: display, fontSize: 26, lineHeight: 1.1 }}>OBITUARIES</div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {latest.map((o) => (
              <div key={o.n} style={{ fontFamily: serif, fontSize: 19, lineHeight: 1.3, borderBottom: `1px dashed ${INK}`, paddingBottom: 8 }}>
                <b>#{o.n}</b> · {fmt(o.tokens)} $GRAVE
                <div style={{ fontFamily: mono, fontSize: 14 }}>tx {short(o.tx)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Rule />
      <div style={{ fontFamily: display, fontSize: 24, marginTop: 4 }}>CLASSIFIEDS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 10 }}>
        {[
          ["LOST", `${fmt(burned)} $GRAVE. Last seen heading to 0x…dEaD. Do not look for them.`],
          ["HELP WANTED", "None. Mort digs alone. Has a shovel. Works nights."],
          ["FOR SALE", "Plots in the graveyard. Prior owners: paper hands."],
        ].map(([h, t]) => (
          <div key={h} style={{ border: `2px solid ${INK}`, padding: "10px 12px" }}>
            <div style={{ fontFamily: display, fontSize: 18 }}>{h}</div>
            <div style={{ fontFamily: serif, fontSize: 18, lineHeight: 1.3, marginTop: 4 }}>{t}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 44, right: 44, bottom: 30 }}>
        <Rule double />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GraveMark size={40} />
            <span style={{ fontFamily: display, fontSize: 24 }}>$GRAVE · GRAVEBURN.FUN</span>
          </div>
          <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 20 }}>every burial verifiable on-chain</span>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, color: C.cream }} />
  </AbsoluteFill>
);
