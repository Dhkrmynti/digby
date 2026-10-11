import { AbsoluteFill } from "remotion";
import { body, CA, mono, S, SITE, TAGLINE } from "./brand";
import { Mark, Space, Tidal, W } from "./parts";

const label = (size: number, color: string = S.starDim): React.CSSProperties => ({ fontFamily: body, fontWeight: 600, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color });
const text = (size: number, color: string = S.star): React.CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.45, color, margin: 0 });

/* ═════════ Profile picture (1000×1000) ═════════ */
export const SunLogo: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <Tidal width={1000} height={1000} t={6} reach={0.25} hole={[0.6, 0.44]} sun={[0.22, 0.66]} scale={1.15} stars={false} />
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): bottom-left stays clear for the avatar ═════════ */
export const SunBanner: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <Tidal width={1500} height={500} t={7} reach={0.12} hole={[0.91, 0.46]} sun={[0.76, 0.56]} scale={1.05} />
    <div style={{ position: "absolute", left: 420, top: 120 }}>
      <p style={W(84)}>Sun Eater</p>
      <p style={{ ...W(40, S.plasmaHot), marginTop: 14 }}>{TAGLINE}</p>
      <p style={{ ...label(18), marginTop: 22 }}>$EATER · Robinhood Chain · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Link preview (1200×630) ═════════ */
export const SunOg: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <Tidal width={1200} height={630} t={8} reach={0.15} hole={[0.68, 0.42]} sun={[0.24, 0.5]} scale={1.05} />
    <div style={{ position: "absolute", left: 64, bottom: 56 }}>
      <p style={W(76)}>It is eating</p>
      <p style={W(76)}>the sun.</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: launch, "now eating" (1080×1350) ═════════ */
export const PostNowEating: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <div style={{ position: "absolute", left: 0, top: 160, width: 1080, height: 820 }}>
      <Tidal width={1080} height={820} t={9} reach={0.2} hole={[0.66, 0.45]} sun={[0.22, 0.6]} scale={1.1} />
    </div>
    <div style={{ position: "absolute", left: 76, top: 76, display: "flex", alignItems: "center", gap: 18 }}>
      <Mark size={58} />
      <span style={label(24, S.plasmaHot)}>Now eating · live on Robinhood Chain</span>
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 84 }}>
      <p style={W(104)}>It is eating</p>
      <p style={{ ...W(104), color: S.plasmaHot }}>the sun.</p>
      <div style={{ marginTop: 34, borderRadius: 999, border: `2px solid ${S.orbit}`, background: S.space2, padding: "22px 34px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={label(20)}>contract address</span>
        <span style={{ fontFamily: mono, fontSize: 28, color: S.star }}>{CA}</span>
      </div>
      <p style={{ ...label(22), marginTop: 24 }}>$EATER · Pons · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: the story (1080×1350) ═════════ */
export const PostCaught: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <div style={{ position: "absolute", left: 0, top: 330, width: 1080, height: 700 }}>
      <Tidal width={1080} height={700} t={10} reach={0.35} hole={[0.68, 0.45]} sun={[0.2, 0.58]} scale={1.15} />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={W(112)}>It caught</p>
      <p style={{ ...W(112), color: S.plasmaHot }}>the sun.</p>
      <p style={{ ...text(30, S.starDim), marginTop: 22, maxWidth: 860 }}>
        The sun wandered too close to a black hole. Now it is being torn into a stream of plasma, one strand at a time.
      </p>
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 84, borderTop: `2px solid ${S.orbit}`, paddingTop: 26 }}>
      <p style={text(32)}>Every $EATER trade pulls another strand loose.</p>
      <p style={{ ...label(22, S.plasma), marginTop: 16 }}>{SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: how it works (1600×900) ═════════ */
const STEPS = [
  { n: "01", name: "The stream", text: "Every $EATER trade on Pons pays a creator fee in ETH." },
  { n: "02", name: "Critical pull", text: "Fees build up until they reach the threshold." },
  { n: "03", name: "The claim", text: "Our bot sweeps and collects the fees. Nobody presses a button." },
  { n: "04", name: "A swallow", text: "Odd cycles: the ETH buys $EATER and every token bought is burned." },
  { n: "05", name: "The ejecta", text: "Even cycles: the ETH goes to the treasury, logged in full." },
];
export const PostSunHow: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <p style={{ ...W(92), position: "absolute", left: 80, top: 70 }}>How the sun is eaten</p>
    <div style={{ position: "absolute", left: 80, right: 80, top: 250, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 28 }}>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ borderTop: `2px solid ${S.orbit}`, paddingTop: 28, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: -6, width: 10, height: 10, borderRadius: 99, background: i === 4 ? S.jet : S.plasma, boxShadow: `0 0 14px 3px ${i === 4 ? "rgba(143,140,255,0.6)" : "rgba(255,179,71,0.6)"}` }} />
          <div style={{ fontFamily: mono, fontSize: 22, color: S.starDim }}>{s.n}/05</div>
          <div style={{ ...W(40, i === 4 ? S.jet : i === 3 ? S.plasmaHot : S.star), marginTop: 18 }}>{s.name}</div>
          <p style={{ ...text(26, S.starDim), marginTop: 18 }}>{s.text}</p>
        </div>
      ))}
    </div>
    <p style={{ ...label(22), position: "absolute", left: 80, bottom: 64 }}>Every burn is sent to 0x…dEaD, on-chain · {SITE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: swallow vs ejecta, told straight (1080×1350) ═════════ */
export const PostHalfIn: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <div style={{ position: "absolute", left: 0, top: 300, width: 1080, height: 760 }}>
      <Tidal width={1080} height={760} t={11} reach={0.3} hole={[0.66, 0.46]} sun={[0.22, 0.56]} scale={1.2} />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={W(84)}>Half falls in.</p>
      <p style={{ ...W(84, S.jet) }}>Half flies out.</p>
      <p style={{ ...text(26, S.starDim), marginTop: 18 }}>That is what a real black hole does to a star. It is also our cycle.</p>
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 84, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
      <div style={{ borderTop: `2px solid ${S.plasma}`, paddingTop: 22 }}>
        <div style={label(20, S.plasma)}>odd cycle</div>
        <div style={{ ...W(52, S.plasmaHot), marginTop: 10 }}>A swallow</div>
        <p style={{ ...text(26, S.star), marginTop: 12 }}>The fees buy $EATER and every token bought is burned.</p>
      </div>
      <div style={{ borderTop: `2px solid ${S.jet}`, paddingTop: 22 }}>
        <div style={label(20, S.jet)}>even cycle</div>
        <div style={{ ...W(52, S.jet), marginTop: 10 }}>The ejecta</div>
        <p style={{ ...text(26, S.star), marginTop: 12 }}>The fees go to the treasury. Every one is on the log.</p>
      </div>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: hook (1080×1350) ═════════ */
export const PostSunHook: React.FC = () => (
  <AbsoluteFill>
    <Space />
    <div style={{ position: "absolute", left: -160, top: 380, width: 1400, height: 820 }}>
      <Tidal width={1400} height={820} t={13} reach={0.55} hole={[0.62, 0.45]} sun={[0.22, 0.55]} scale={1.2} />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, top: 76 }}>
      <p style={W(120)}>The sun</p>
      <p style={W(120)}>has a</p>
      <p style={{ ...W(120), color: S.plasmaHot }}>deadline.</p>
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 76 }}>
      <p style={text(30)}>Every $EATER trade drags it closer to the horizon. Nothing that crosses comes back.</p>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", borderTop: `2px solid ${S.orbit}`, paddingTop: 20 }}>
        <span style={label(20)}>$EATER · Robinhood Chain</span>
        <span style={label(20, S.plasma)}>{SITE}</span>
      </div>
    </div>
  </AbsoluteFill>
);
