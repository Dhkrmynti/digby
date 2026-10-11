import { AbsoluteFill } from "remotion";
import { CA, P, SITE, TAGLINE } from "./brand";
import { Bonfire, Cave, H, M, T } from "./parts";
import { Pyre } from "./Pyre";
import { PaintBananas, PaintCatches, PaintFeed, PaintIntoFire, PaintKindling, PaintWoodpile } from "./Paintings";

/* ═════════ Profile picture (1000×1000) ═════════ */
export const PyreLogo: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1000} h={1000} t={2} lx={0.8} ly={0.4} light={1.2} />
    <div style={{ position: "absolute", left: 30, top: 60, width: 940 }}>
      <Pyre still hold="torch" outfit="fur" flame={0.9} viewBox="60 40 440 440" className="" />
    </div>
  </AbsoluteFill>
);

/* ═════════ X header (1500×500) ═════════ */
export const PyreBanner: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1500} h={500} t={3} lx={0.78} ly={0.9} />
    <Bonfire x={1010} y={500} w={240} t={3} heat={0.8} />
    <div style={{ position: "absolute", left: 1200, top: 130, width: 290 }}>
      <Pyre still hold="torch" outfit="fur" viewBox="60 60 400 440" className="" />
    </div>
    <div style={{ position: "absolute", left: 420, top: 140 }}>
      <p style={H(96)}>APE PYRE</p>
      <p style={{ ...H(40, P.fire), marginTop: 18 }}>{TAGLINE}</p>
      <p style={{ ...M(18, P.boneDim), marginTop: 24 }}>$PYRE · Robinhood Chain · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Link preview (1200×630) ═════════ */
export const PyreOg: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1200} h={630} t={4} lx={0.7} ly={0.9} />
    <Bonfire x={640} y={630} w={300} t={4} heat={1} />
    <div style={{ position: "absolute", left: 880, top: 220, width: 320 }}>
      <Pyre still hold="torch" outfit="fur" viewBox="60 60 400 440" className="" />
    </div>
    <div style={{ position: "absolute", left: 64, top: 110, width: 560 }}>
      <p style={H(88)}>Everything goes in</p>
      <p style={{ ...H(88, P.fire), marginTop: 4 }}>the fire.</p>
      <p style={{ ...M(20, P.boneDim), marginTop: 30 }}>$PYRE · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: meet Pyre (1080×1350) ═════════ */
export const PostMeetPyre: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1080} h={1350} t={5} lx={0.4} ly={0.9} />
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={H(112)}>This is Pyre.</p>
      <p style={{ ...T(32), marginTop: 22, maxWidth: 880 }}>First ape to find fire. Hasn't been impressed by anything since. He just keeps feeding it.</p>
    </div>
    <Bonfire x={90} y={1350} w={460} t={5} heat={0.9} />
    <div style={{ position: "absolute", left: 470, top: 640, width: 640 }}>
      <Pyre still hold="torch" outfit="fur" viewBox="60 60 400 440" className="" />
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: launch (1080×1350) ═════════ */
export const PostPyreLive: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1080} h={1350} t={6} lx={0.5} ly={0.6} light={1.3} />
    <p style={{ ...M(26, P.flame), position: "absolute", left: 76, top: 80 }}>now live on Robinhood Chain · Pons</p>
    <Bonfire x={240} y={820} w={600} t={6} heat={1} />
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 84 }}>
      <p style={H(110)}>The fire is lit.</p>
      <div style={{ marginTop: 34, borderRadius: 18, background: "rgba(11,8,6,0.8)", padding: "22px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, border: "1.5px solid rgba(244,230,208,0.2)" }}>
        <span style={{ ...T(20), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>contract address</span>
        <span style={M(24)}>{CA}</span>
      </div>
      <p style={{ ...M(20, P.boneDim), marginTop: 22 }}>$PYRE · Pons · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: how it works, as paintings (1600×900) ═════════ */
const STEPS = [
  { name: "Kindling", text: "Every $PYRE trade on Pons pays a creator fee in ETH.", art: <PaintKindling /> },
  { name: "The woodpile", text: "Fees pile up in the Pons fee escrow.", art: <PaintWoodpile /> },
  { name: "It catches", text: "At 0.01 ETH the bot moves. Every other time, 0.02.", art: <PaintCatches /> },
  { name: "Feed the fire", text: "The bot claims the fees and buys $PYRE.", art: <PaintFeed /> },
  { name: "Into the fire", text: "Burn cycles send it all to 0x…dEaD.", art: <PaintIntoFire /> },
  { name: "Bananas for later", text: "Keep cycles send the ETH to the treasury.", art: <PaintBananas /> },
];
export const PostPyreHow: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1600} h={900} t={7} lx={0.5} ly={0.5} light={1.4} />
    <p style={{ ...H(84), position: "absolute", left: 70, top: 56 }}>How the fire gets fed</p>
    <div style={{ position: "absolute", left: 70, right: 70, top: 220, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 26 }}>
      {STEPS.map((s, i) => (
        <div key={s.name} style={{ marginTop: (i % 2) * 40 }}>
          <div style={{ height: 170 }}>{s.art}</div>
          <p style={{ ...M(14, P.boneDim), marginTop: 10 }}>{String(i + 1).padStart(2, "0")} / 06</p>
          <p style={{ ...H(30, i === 5 ? P.banana : P.bone), marginTop: 8 }}>{s.name}</p>
          <p style={{ ...T(20, P.bone), marginTop: 10 }}>{s.text}</p>
        </div>
      ))}
    </div>
    <p style={{ ...M(18, P.boneDim), position: "absolute", left: 70, bottom: 50 }}>Every burn is on-chain · {SITE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: hook (1080×1350) ═════════ */
export const PostPyreHook: React.FC = () => (
  <AbsoluteFill>
    <Cave w={1080} h={1350} t={8} lx={0.5} ly={1} light={1.3} />
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={H(104)}>Discovered fire.</p>
      <p style={{ ...H(104, P.fire), marginTop: 6 }}>Unimpressed.</p>
      <p style={{ ...T(30, P.bone), marginTop: 26, fontWeight: 600 }}>Pyre feeds it anyway. Every $PYRE trade is another stick.</p>
    </div>
    <Bonfire x={60} y={1350} w={560} t={8} heat={1} />
    <div style={{ position: "absolute", left: 500, top: 700, width: 620 }}>
      <Pyre still hold="torch" outfit="fur" viewBox="60 60 400 440" className="" />
    </div>
  </AbsoluteFill>
);
