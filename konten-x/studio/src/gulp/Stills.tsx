import { AbsoluteFill } from "remotion";
import { body, CA, G, mono, SITE, TAGLINE } from "./brand";
import { F, Water } from "./parts";
import { Gulp } from "./Gulp";

const text = (size: number, color: string = G.foam): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.45, color, margin: 0 });
const tag = (size: number, color: string = G.lure): React.CSSProperties => ({ fontFamily: mono, fontSize: size, color, margin: 0, letterSpacing: "0.02em" });

/* ═════════ Profile picture (1000×1000) ═════════ */
export const GulpLogo: React.FC = () => (
  <AbsoluteFill>
    <Water w={1000} h={1000} depth={0.35} />
    <div style={{ position: "absolute", left: 0, top: 60, width: 1000 }}>
      <Gulp still glow={0.75} open={0.3} viewBox="120 0 640 640" className="" />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): bottom-left stays clear for the avatar ═════════ */
export const GulpBanner: React.FC = () => (
  <AbsoluteFill>
    <Water w={1500} h={500} depth={0.25} shafts />
    <div style={{ position: "absolute", right: -40, top: 30, width: 760 }}>
      <Gulp still glow={0.8} open={0.25} viewBox="150 10 760 450" className="" />
    </div>
    <div style={{ position: "absolute", left: 420, top: 110 }}>
      <p style={F(120)}>GULP</p>
      <p style={{ ...F(46, G.lure), marginTop: 16 }}>{TAGLINE}</p>
      <p style={{ ...tag(20, G.foamDim), marginTop: 22 }}>$GULP · Robinhood Chain · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Link preview (1200×630) ═════════ */
export const GulpOg: React.FC = () => (
  <AbsoluteFill>
    <Water w={1200} h={630} depth={0.2} shafts />
    <div style={{ position: "absolute", right: -60, top: 40, width: 760 }}>
      <Gulp still glow={0.8} open={0.3} viewBox="150 10 760 450" className="" />
    </div>
    <div style={{ position: "absolute", left: 64, bottom: 60, width: 560 }}>
      <p style={F(92)}>Nothing comes back up.</p>
      <p style={{ ...tag(22, G.lure), marginTop: 22 }}>$GULP · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: meet Gulp (1080×1350) ═════════ */
export const PostMeetGulp: React.FC = () => (
  <AbsoluteFill>
    <Water w={1080} h={1350} depth={0.45} />
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={F(118)}>This is Gulp.</p>
      <p style={{ ...text(32, G.foamDim), marginTop: 26, maxWidth: 860 }}>
        He lives at the bottom of the Mariana Trench, 10,994 m down. He is always hungry and never impressed.
      </p>
    </div>
    <div style={{ position: "absolute", left: -60, top: 400, width: 1200 }}>
      <Gulp still glow={0.6} open={0.2} viewBox="150 10 760 450" className="" />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 76, borderTop: `2px solid rgba(232,245,242,0.2)`, paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <p style={text(32)}>Every $GULP trade is bait.</p>
      <p style={tag(24)}>{SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: launch (1080×1350) ═════════ */
export const PostGulpLive: React.FC = () => (
  <AbsoluteFill>
    <Water w={1080} h={1350} depth={0.3} shafts />
    <p style={{ ...tag(26), position: "absolute", left: 76, top: 80 }}>now live on Robinhood Chain · Pons</p>
    <div style={{ position: "absolute", left: -40, top: 170, width: 1160 }}>
      <Gulp still glow={1} open={0.85} viewBox="150 10 760 450" className="" />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 84 }}>
      <p style={F(124)}>Nothing comes</p>
      <p style={F(124, G.lure)}>back up.</p>
      <div style={{ marginTop: 36, borderRadius: 999, background: "rgba(4,17,31,0.6)", padding: "22px 34px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <span style={text(22, G.foamDim)}>contract address</span>
        <span style={{ fontFamily: mono, fontSize: 26, color: G.foam }}>{CA}</span>
      </div>
      <p style={{ ...tag(22, G.foamDim), marginTop: 24 }}>$GULP · Pons · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: how it works, as a dive (1600×900) ═════════ */
const STOPS = [
  { d: "200 m", name: "Bait", text: "Every $GULP trade on Pons pays a creator fee in ETH." },
  { d: "1,000 m", name: "The lure", text: "Fees pile up in the escrow. The lure glows brighter." },
  { d: "4,000 m", name: "Full glow", text: "At 0.01 ETH, Gulp strikes. Every other strike waits for 0.02." },
  { d: "6,500 m", name: "The strike", text: "The bot claims the fees and buys $GULP. No button." },
  { d: "10,994 m", name: "Dragged down", text: "Burn strikes send it all to 0x…dEaD. Snack strikes go to the treasury." },
];
export const PostGulpHow: React.FC = () => (
  <AbsoluteFill>
    <Water w={1600} h={900} depth={0.6} />
    <p style={{ ...F(96), position: "absolute", left: 80, top: 66 }}>How Gulp eats</p>
    <div style={{ position: "absolute", left: 80, right: 80, top: 250, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 30 }}>
      {STOPS.map((s, i) => (
        <div key={s.name} style={{ position: "relative", paddingTop: 34, marginTop: i * 46 }}>
          <span style={{ position: "absolute", left: 0, top: 0, width: 18, height: 18, borderRadius: 99, border: `3px solid ${G.lure}`, background: G.abyss }} />
          <p style={tag(20)}>{s.d}</p>
          <p style={{ ...F(44, i === 4 ? G.lure : G.foam), marginTop: 12 }}>{s.name}</p>
          <p style={{ ...text(25, G.foamDim), marginTop: 14 }}>{s.text}</p>
        </div>
      ))}
    </div>
    <p style={{ ...tag(22, G.foamDim), position: "absolute", left: 80, bottom: 56 }}>Every strike is on-chain · {SITE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: hook (1080×1350) ═════════ */
export const PostGulpHook: React.FC = () => (
  <AbsoluteFill>
    <Water w={1080} h={1350} depth={0.95} />
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={F(124)}>If you can see</p>
      <p style={F(124)}>the light,</p>
      <p style={F(124, G.lure)}>it's too late.</p>
    </div>
    <div style={{ position: "absolute", left: -60, top: 450, width: 1100 }}>
      <Gulp still glow={1} open={1} viewBox="150 10 760 450" className="" />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 76 }}>
      <p style={text(30)}>Every $GULP trade makes the lure brighter. At full glow, Gulp drags $GULP to the trench floor.</p>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", borderTop: `2px solid rgba(232,245,242,0.2)`, paddingTop: 20 }}>
        <span style={tag(22, G.foamDim)}>$GULP · Robinhood Chain</span>
        <span style={tag(22)}>{SITE}</span>
      </div>
    </div>
  </AbsoluteFill>
);
