import React from "react";
import { AbsoluteFill } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, MortEyes, Motes, Night } from "./parts";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type Burial = { readonly n: number; readonly time: string; readonly tokens: number };
type WrappedProps = { readonly burials: readonly Burial[]; readonly burned: number };

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const Card: React.FC<{ bg: string; ink: string; label: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ bg, ink, label, children, style }) => (
  <div style={{ background: bg, color: ink, borderRadius: 22, padding: "22px 26px", boxShadow: "0 24px 40px -24px rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", ...style }}>
    <div style={{ fontFamily: display, fontSize: 20, opacity: 0.75, width: "100%" }}>{label}</div>
    {children}
  </div>
);

/* ═════════ 53 · Graveyard Wrapped, day one (1080×1350) ═════════ */
export const PostWrapped: React.FC<WrappedProps> = ({ burials, burned }) => {
  const top = [...burials].sort((a, b) => b.tokens - a.tokens)[0];
  const byHour = new Map<number, number>();
  burials.forEach((b) => byHour.set(Number(b.time.slice(0, 2)), (byHour.get(Number(b.time.slice(0, 2))) || 0) + 1));
  const [busyHour, busyCount] = [...byHour.entries()].sort((a, b) => b[1] - a[1])[0];
  let nap = { gap: 0, from: "", to: "" };
  for (let i = 1; i < burials.length; i++) {
    const gap = toMin(burials[i].time) - toMin(burials[i - 1].time);
    if (gap > nap.gap) nap = { gap, from: burials[i - 1].time, to: burials[i].time };
  }
  const pct = (burned / 1e9) * 100;
  const hh = (h: number) => String(h).padStart(2, "0");

  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={22} />

      <div style={{ position: "absolute", left: 60, right: 60, top: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: display, fontSize: 26, color: C.slime }}>YOUR DAY ONE IN THE GROUND</div>
          <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 0.98, color: C.cream, marginTop: 8 }}>Graveyard</div>
          <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 0.98, color: C.bulb }}>Wrapped.</div>
        </div>
        <GraveMark size={150} glow />
      </div>

      {/* grid of cards */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 320, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <Card bg={C.slime} ink={C.ink} label="TOTAL BURIED" style={{ gridColumn: "1 / span 2", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: display, fontSize: 78, lineHeight: 1, marginTop: 6 }}>{fmt(burned)}</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 28, marginTop: 6 }}>$GRAVE · {pct.toFixed(2)}% of supply</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: display, fontSize: 96, lineHeight: 1 }}>{burials.length}</div>
            <div style={{ fontFamily: display, fontSize: 24 }}>BURIALS</div>
          </div>
        </Card>

        <Card bg={C.bulb} ink={C.ink} label="YOUR TOP GRAVE">
          <div style={{ fontFamily: display, fontSize: 54, lineHeight: 1.05, marginTop: 10 }}>{fmt(top.tokens)}</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 6 }}>grave #{top.n} · {top.time} UTC</div>
        </Card>

        <Card bg={C.sign} ink={C.cream} label="BUSIEST SHIFT">
          <div style={{ fontFamily: display, fontSize: 54, lineHeight: 1.05, marginTop: 10 }}>{hh(busyHour)}:00–{hh(busyHour + 1)}:00</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 6 }}>{busyCount} burials in one hour (UTC)</div>
        </Card>

        <Card bg={C.ticket} ink={C.ink} label="LONGEST NAP">
          <div style={{ fontFamily: display, fontSize: 54, lineHeight: 1.05, marginTop: 10 }}>
            {Math.floor(nap.gap / 60)}h {nap.gap % 60}m
          </div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 6 }}>
            {nap.from} → {nap.to} UTC. even Mort sleeps.
          </div>
        </Card>

        <Card bg={C.plum} ink={C.cream} label="TOP GENRE" style={{ border: `3px solid ${C.plumLine}` }}>
          <div style={{ fontFamily: sign, fontSize: 60, lineHeight: 1.05, marginTop: 8, color: C.bulb }}>Deflation</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 6, color: C.dust }}>on repeat, all day.</div>
        </Card>

        <Card bg="#0b0610" ink={C.cream} label="YOUR TOP DESTINATION" style={{ gridColumn: "1 / span 2", border: `3px solid ${C.plumLine}`, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, marginTop: 8, color: C.bulb }}>0x…dEaD</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, marginTop: 4, color: C.dust }}>100% of plays. return rate: 0%.</div>
          </div>
          <MortEyes size={30} look={-0.3} />
        </Card>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1180, fontFamily: sign, fontSize: 42, color: C.bulb, textAlign: "center" }}>
        “see you in the ground tomorrow.”
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: display, fontSize: 26, color: C.dust }}>$GRAVE · GRAVEBURN.FUN</span>
        <span style={{ fontFamily: body, fontSize: 21, color: C.dustDim, fontStyle: "italic" }}>every burial on-chain</span>
      </div>
    </AbsoluteFill>
  );
};
