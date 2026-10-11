import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Headstone, MortEyes, Motes, Night, Ticket } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const short = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1e3)}K`);

type Burial = { readonly n: number; readonly tokens: number; readonly eth: number };
type DirtProps = { readonly burials: readonly Burial[]; readonly burned: number };

/* ═════════ 49 · "Dirt got 8x pricier." (1080×1350) ═════════ */
// Each headstone is as tall as the $GRAVE that 0.01 ETH bought on that burial's buyback.
export const PostDirtPrices: React.FC<DirtProps> = ({ burials, burned }) => {
  const per = burials.map((b) => ({ ...b, dirt: (b.tokens / b.eth) * 0.01 }));
  const first = per[0];
  const last = per[per.length - 1];
  const ratio = first.dirt / last.dirt;
  const max = Math.max(...per.map((p) => p.dirt));
  const chartH = 440;
  const colW = (920 - (per.length - 1) * 8) / per.length;

  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <Motes count={24} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 64, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 30, color: C.sign, letterSpacing: "0.04em" }}>• MORT’S DIRT PRICES •</div>
        <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1.02, color: C.cream, marginTop: 14, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>
          Dirt got <span style={{ color: C.bulb }}>{Math.floor(ratio)}x</span>
        </div>
        <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1.02, color: C.bulb, textShadow: "0 5px 0 rgba(42,22,38,0.6)" }}>pricier.</div>
        <div style={{ fontFamily: body, fontWeight: 600, fontSize: 32, color: C.dust, marginTop: 14 }}>Same shovel. Smaller holes.</div>
      </div>

      {/* the two price tags */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 420, display: "flex", justifyContent: "space-between" }}>
        {[
          { tag: `GRAVE #${first.n}`, p: first, color: C.ink },
          { tag: `GRAVE #${last.n}`, p: last, color: C.signDeep },
        ].map(({ tag, p, color }) => (
          <Ticket key={tag} width={430}>
            <div style={{ padding: "24px 44px", textAlign: "center" }}>
            <div style={{ fontFamily: display, fontSize: 24, color: C.ticketDim }}>{tag}</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, marginTop: 6 }}>0.01 ETH bought</div>
            <div style={{ fontFamily: display, fontSize: 46, lineHeight: 1.1, color, marginTop: 4 }}>{fmt(p.dirt)}</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.ticketDim }}>$GRAVE of dirt</div>
            </div>
          </Ticket>
        ))}
      </div>

      {/* the shrinking graves */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 620, height: chartH + 70 }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, height: chartH, display: "flex", alignItems: "flex-end", gap: 8 }}>
          {per.map((p, i) => {
            const h = Math.max(46, (p.dirt / max) * (chartH - 40));
            const edge = i === 0 || i === per.length - 1;
            return (
              <div key={p.n} style={{ width: colW, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 15, color: edge ? C.bulb : C.dust, marginBottom: 6, whiteSpace: "nowrap" }}>{short(p.dirt)}</div>
                <Headstone
                  width={colW}
                  height={h}
                  shape={0}
                  style={{ background: edge ? C.ticket : C.stone, boxShadow: edge ? `0 0 24px rgba(255,207,58,0.35)` : "none", paddingTop: 14 }}
                >
                  {h > 70 ? <div style={{ width: colW * 0.4, height: 3, background: C.stoneInk, opacity: 0.5, borderRadius: 2 }} /> : null}
                </Headstone>
              </div>
            );
          })}
        </div>
        {/* the dirt line */}
        <div style={{ position: "absolute", left: -20, right: -20, bottom: 22, height: 14, background: "#3a2433", borderRadius: 7 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -8, display: "flex", gap: 8 }}>
          {per.map((p) => (
            <div key={p.n} style={{ width: colW, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 16, color: C.dustDim }}>
              #{p.n}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 80, right: 80, top: 1168, textAlign: "center", fontFamily: body, fontWeight: 600, fontSize: 27, color: C.dust, lineHeight: 1.4 }}>
        each stone = $GRAVE that 0.01 ETH bought back on that burial.
        <br />
        <span style={{ color: C.cream }}>{fmt(burned)} $GRAVE</span> in 0x…dEaD · {per.length} graves, all on-chain.
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GraveMark size={46} />
          <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: sign, fontSize: 30, color: C.bulb }}>“dirt ain’t cheap no more.”</span>
          <MortEyes size={24} look={-0.4} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
