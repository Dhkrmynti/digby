import { AbsoluteFill } from "remotion";
import { body, CA, DEAD_SHORT, display, mono, SITE, TAGLINE, V } from "./brand";
import { Mark, Night, Note, Paper, VoidHole } from "./parts";

const H = (size: number, color: string = V.star): React.CSSProperties => ({
  fontFamily: display,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 0.88,
  textTransform: "uppercase",
  color,
  margin: 0,
});
const label = (size: number, color: string = V.starDim): React.CSSProperties => ({
  fontFamily: body,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
});

/* ═════════ Profile picture (1000×1000, shown as a circle) ═════════ */
export const VoidLogo: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <VoidHole width={1000} height={1000} t={4} shadow={0.25} glow={1.1} />
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): keep the bottom-left clear for the avatar ═════════ */
export const VoidBanner: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.7} />
    <div style={{ position: "absolute", left: 740, top: -100, width: 1000, height: 700 }}>
      <VoidHole width={1000} height={700} t={6} shadow={0.22} glow={1} />
    </div>
    <div style={{ position: "absolute", left: 430, top: 110 }}>
      <p style={H(132)}>Black Void</p>
      <p style={{ ...H(56, V.ringHot), marginTop: 18 }}>{TAGLINE}</p>
      <p style={{ ...label(20), marginTop: 22 }}>$VOID · Robinhood Chain · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Link preview (1200×630) ═════════ */
export const VoidOg: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <div style={{ position: "absolute", left: 0, top: -40, width: 1200, height: 560 }}>
      <VoidHole width={1200} height={560} t={5} shadow={0.3} glow={1.05} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 182, display: "flex", justifyContent: "center", gap: 210, ...H(250) }}>
      <span>V</span>
      <span>ID</span>
    </div>
    <p style={{ ...H(60), position: "absolute", left: 0, right: 0, bottom: 52, textAlign: "center" }}>{TAGLINE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: Meet dEaD-1 (1080×1350) ═════════ */
export const PostMeetVoid: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <div style={{ position: "absolute", left: 0, top: 120, width: 1080, height: 760 }}>
      <VoidHole width={1080} height={760} t={8} shadow={0.27} glow={1} />
    </div>
    <div style={{ position: "absolute", left: 80, top: 80 }}>
      <p style={{ ...H(132), textTransform: "none" }}>Meet dEaD-1.</p>
      <p style={{ ...label(22), marginTop: 18 }}>Catalogue name of a black hole · nickname: the Void</p>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 90 }}>
      <Paper width="100%" rotate={-1.2}>
        <p style={{ fontFamily: body, fontSize: 34, lineHeight: 1.45, margin: 0, color: V.pen }}>
          Every token ever sent to {DEAD_SHORT} piled up in one place. It got so heavy the address folded in on itself. Light stopped coming back.
        </p>
        <Note size={54} style={{ marginTop: 16 }}>
          now it eats $VOID.
        </Note>
      </Paper>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: launch, "now observing" (1080×1350) ═════════ */
export const PostNowObserving: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.9} />
    <div style={{ position: "absolute", left: 0, top: 230, width: 1080, height: 700 }}>
      <VoidHole width={1080} height={700} t={10} shadow={0.27} glow={1.15} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 410, display: "flex", justifyContent: "center", gap: 236, ...H(300) }}>
      <span>V</span>
      <span>ID</span>
    </div>
    <div style={{ position: "absolute", left: 80, top: 80, display: "flex", alignItems: "center", gap: 18 }}>
      <Mark size={64} />
      <span style={label(26, V.ringHot)}>Now observing · live on Robinhood Chain</span>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 90 }}>
      <p style={H(84)}>{TAGLINE}</p>
      <div style={{ marginTop: 34, borderRadius: 999, border: `2px solid ${V.panelLine}`, background: V.panel, padding: "22px 34px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={label(20)}>contract address</span>
        <span style={{ fontFamily: mono, fontSize: 25, color: V.star }}>{CA}</span>
      </div>
      <p style={{ ...label(22, V.starDim), marginTop: 26 }}>$VOID · {SITE}</p>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: how it works (1600×900) ═════════ */
const STEPS = [
  { n: "01", name: "The disk", text: "Every $VOID buy and sell pays a creator fee in ETH. It spirals into the accretion disk." },
  { n: "02", name: "Critical mass", text: "When the disk holds enough ETH, it goes critical." },
  { n: "03", name: "The pull", text: "The Watcher, our bot, claims it all. Nobody presses a button." },
  { n: "04", name: "The feed", text: "On a feeding orbit the ETH market-buys $VOID." },
  { n: "05", name: "Falls in", text: `Every $VOID bought is sent to ${DEAD_SHORT}. Gone for good.` },
];
export const PostHowVoidWorks: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.5} />
    <div style={{ position: "absolute", left: 80, top: 70 }}>
      <p style={H(110)}>One orbit, from fee to horizon</p>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 260, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 22 }}>
      {STEPS.map((s, i) => (
        <Paper key={s.n} width="100%" height={470} rotate={i % 2 ? 1 : -1} pad={34}>
          <div style={{ fontFamily: mono, fontSize: 22, color: V.marker }}>{s.n}/05</div>
          <div style={{ ...H(54, V.pen), marginTop: 12 }}>{s.name}</div>
          <p style={{ fontFamily: body, fontSize: 25, lineHeight: 1.4, margin: "16px 0 0", color: V.pen }}>{s.text}</p>
        </Paper>
      ))}
    </div>
    <p style={{ ...label(22), position: "absolute", left: 80, bottom: 60 }}>Even orbits: the fees fuel the observatory (creator wallet), logged in full · {SITE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: two orbits, told straight (1080×1350) ═════════ */
export const PostTwoOrbits: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.6} />
    <div style={{ position: "absolute", left: 80, top: 80 }}>
      <p style={H(120)}>Two orbits.</p>
      <p style={{ ...H(120, V.starDim) }}>Nothing hidden.</p>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 430, display: "grid", gap: 40 }}>
      <Paper width="100%" rotate={-1}>
        <div style={label(22, V.marker)}>odd orbit</div>
        <div style={{ ...H(96, V.pen), marginTop: 10 }}>Falls in</div>
        <p style={{ fontFamily: body, fontSize: 32, lineHeight: 1.4, margin: "14px 0 0", color: V.pen }}>
          The fees buy $VOID and every token bought is sent to {DEAD_SHORT}.
        </p>
      </Paper>
      <Paper width="100%" rotate={1}>
        <div style={label(22, V.fuelInk)}>even orbit</div>
        <div style={{ ...H(96, V.fuelInk), marginTop: 10 }}>Observatory fuel</div>
        <p style={{ fontFamily: body, fontSize: 32, lineHeight: 1.4, margin: "14px 0 0", color: V.pen }}>
          The fees go to the creator wallet. Every one is in the observing log.
        </p>
      </Paper>
    </div>
    <p style={{ ...label(22), position: "absolute", left: 80, bottom: 70 }}>$VOID · {SITE}</p>
  </AbsoluteFill>
);

/* ═════════ Post: flat line, before the first fall (1080×1350) ═════════ */
export const PostFlatLine: React.FC = () => {
  const d = Array.from({ length: 130 }, (_, i) => `${i === 0 ? "M" : "L"}${60 + Math.sin(i * 1.7) * 3 + Math.sin(i * 0.31) * 2} ${i * 7}`).join(" ");
  return (
    <AbsoluteFill>
      <Night glow={0.4} />
      <div style={{ position: "absolute", left: 80, top: 80 }}>
        <p style={H(120)}>The observing log</p>
        <p style={{ ...label(22), marginTop: 16 }}>chan 1 · dEaD-1 · falls recorded: 0</p>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 330, bottom: 90 }}>
        <Paper width="100%" height="100%" rotate={-0.6}>
          <svg width="160" height="900" style={{ position: "absolute", left: 60, top: 30 }}>
            <path d={d} fill="none" stroke={V.pen} strokeWidth={2.4} />
          </svg>
          <div style={{ marginLeft: 210, marginTop: 280 }}>
            <Note size={78} rotate={-3}>
              flat line.
            </Note>
            <Note size={78} rotate={-3} style={{ marginTop: 6 }}>
              waiting for the first fall.
            </Note>
            <p style={{ fontFamily: body, fontSize: 30, lineHeight: 1.45, margin: "40px 0 0", color: V.penSoft }}>
              When it lands, the pen spikes and the transaction goes on the log.
            </p>
          </div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Post: hook, "Nothing escapes." (1080×1350) ═════════ */
export const PostNothingEscapes: React.FC = () => (
  <AbsoluteFill>
    <Night glow={1} />
    <div style={{ position: "absolute", left: -260, top: 300, width: 1600, height: 900 }}>
      <VoidHole width={1600} height={900} t={12} shadow={0.36} glow={1.25} />
    </div>
    <div style={{ position: "absolute", left: 76, right: 76, top: 72 }}>
      <p style={{ ...H(196), letterSpacing: "-0.015em" }}>Nothing</p>
      <p style={{ ...H(196), letterSpacing: "-0.015em", color: V.ringHot }}>escapes.</p>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {["not light.", "not time.", "not $VOID supply."].map((l, i) => (
        <span key={l} style={{ fontFamily: body, fontWeight: 600, fontSize: i === 2 ? 46 : 40, color: i === 2 ? V.ringHot : V.star, letterSpacing: "0.02em", textShadow: "0 2px 16px #000" }}>
          {l}
        </span>
      ))}
    </div>
    <Note size={56} rotate={-7} style={{ position: "absolute", left: 800, top: 268, width: 240 }}>
      trust me,
      <br />
      we looked.
    </Note>
    <div style={{ position: "absolute", left: 76, right: 76, bottom: 76 }}>
      <p style={{ fontFamily: body, fontSize: 30, lineHeight: 1.4, color: V.star, margin: 0, maxWidth: 820 }}>
        Every trade feeds the disk. At critical mass the Watcher buys $VOID back and drops it into {DEAD_SHORT}.
      </p>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${V.panelLine}`, paddingTop: 22 }}>
        <span style={{ fontFamily: mono, fontSize: 22, color: V.starDim }}>{CA}</span>
        <span style={label(22, V.ring)}>{SITE}</span>
      </div>
    </div>
  </AbsoluteFill>
);

/* ═════════ Post: status report, real readings (1080×1350) ═════════ */
type StatusProps = { asOf: string; pendingEth: number; criticalEth: number; trades: number; buys: number; sells: number; holders: number; falls: number };
export const PostStatus: React.FC<StatusProps> = ({ asOf, pendingEth, criticalEth, trades, buys, sells, holders, falls }) => {
  const fill = Math.max(0, Math.min(1, pendingEth / criticalEth));
  const SWEEP = 56;
  const ang = -SWEEP + fill * SWEEP * 2;
  const polar = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [300 + Math.cos(rad) * r, 300 + Math.sin(rad) * r];
  };
  const angFor = (f: number) => -SWEEP + f * SWEEP * 2;
  const [rx1, ry1] = polar(angFor(0.85), 230);
  const [rx2, ry2] = polar(angFor(1), 230);
  const row = (k: string, v: string, accent?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1.5px solid rgba(28,42,107,0.18)`, padding: "14px 0" }}>
      <span style={label(22, V.penSoft)}>{k}</span>
      <span style={{ fontFamily: mono, fontSize: 34, color: accent ?? V.pen }}>{v}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <div style={{ position: "absolute", left: 640, top: -60, width: 600, height: 520, opacity: 0.85 }}>
        <VoidHole width={600} height={520} t={14} shadow={0.22} glow={0.6 + fill * 0.6} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 70 }}>
        <p style={label(24, V.ringHot)}>Deadsky Observatory · status</p>
        <p style={{ ...H(126), marginTop: 16 }}>Day 1:</p>
        <p style={{ ...H(126), color: V.ringHot }}>the disk</p>
        <p style={{ ...H(126), color: V.ringHot }}>is filling.</p>
      </div>
      <div style={{ position: "absolute", left: 76, right: 76, top: 530 }}>
        <Paper width="100%" rotate={-0.8} pad={46}>
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 36, alignItems: "center" }}>
            <svg viewBox="0 0 600 380" width="380" height="240">
              <rect x="10" y="20" width="580" height="350" rx="22" fill="#f8f4ea" stroke="#1c2a6b" strokeOpacity="0.35" strokeWidth="2" />
              <path d={`M${rx1} ${ry1} A230 230 0 0 1 ${rx2} ${ry2}`} fill="none" stroke={V.marker} strokeWidth="16" />
              {Array.from({ length: 21 }, (_, i) => i / 20).map((v) => {
                const major = Math.round(v * 20) % 5 === 0;
                const [x1, y1] = polar(angFor(v), major ? 200 : 212);
                const [x2, y2] = polar(angFor(v), 236);
                return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke={v >= 0.85 ? V.marker : V.pen} strokeWidth={major ? 5 : 2.5} />;
              })}
              <text x="300" y="258" textAnchor="middle" fontFamily={display} fontWeight={900} fontSize="44" fill={V.penSoft} letterSpacing="4">MASS</text>
              <g transform={`rotate(${ang} 300 300)`}>
                <line x1="300" y1="300" x2="300" y2="90" stroke="#06080f" strokeWidth="6" strokeLinecap="round" />
              </g>
              <circle cx="300" cy="300" r="18" fill="#06080f" />
            </svg>
            <div>
              <div style={label(22, V.penSoft)}>accretion disk</div>
              <div style={{ fontFamily: display, fontWeight: 900, fontSize: 120, lineHeight: 0.9, color: V.pen }}>{Math.round(fill * 100)}%</div>
              <div style={{ fontFamily: mono, fontSize: 26, color: V.penSoft, marginTop: 6 }}>
                {pendingEth.toFixed(4)} / {criticalEth} ETH
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            {row("trades", `${trades} (${buys} buys · ${sells} sells)`)}
            {row("wallets holding", String(holders))}
            {row("falls recorded", String(falls), V.marker)}
            {row("next orbit", "falls in", V.marker)}
          </div>
          <Note size={52} rotate={-3} style={{ marginTop: 12 }}>
            first fall lands at critical mass.
          </Note>
        </Paper>
      </div>
      <div style={{ position: "absolute", left: 76, right: 76, bottom: 40, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: mono, fontSize: 20, color: V.starDim }}>readings as of {asOf}</span>
        <span style={label(20, V.ring)}>{SITE}</span>
      </div>
    </AbsoluteFill>
  );
};
