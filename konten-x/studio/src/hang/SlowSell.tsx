/**
 * "A sloth tries to sell $HANG." The claw inches toward a big red SELL button while the clock runs
 * from minutes to days; the sloth falls asleep first, the phone slips into the fire. The one figure
 * shown (burned so far) is a prop read off the chain; nothing here is about price.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, SlothHead, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#d9534f";
const FUR = "#bfa784";

export const SLOW_SELL = { burned: 9584618.448 };

/** The phone with its one button. */
function Phone({ pressGlow = 0 }: { pressGlow?: number }) {
  return (
    <svg viewBox="0 0 220 400" width={220} height={400}>
      <rect x="6" y="6" width="208" height="388" rx="30" fill="#1c1c22" stroke={C.ink} strokeWidth="8" />
      <rect x="22" y="40" width="176" height="300" rx="10" fill="#0d1424" />
      <text x="110" y="92" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="24" fill="#cfd8ea">{TICKER}</text>
      <path d="M40 150 L80 170 L110 160 L150 200 L180 190" fill="none" stroke="#5d6b88" strokeWidth="4" />
      <rect x="40" y="236" width="140" height="74" rx="14" fill={RED} stroke="#fff" strokeOpacity={0.3 + pressGlow * 0.7} strokeWidth="5" />
      <text x="110" y="284" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="34" fill="#fff">SELL</text>
      <rect x="85" y="356" width="50" height="12" rx="6" fill="#3a3a44" />
    </svg>
  );
}

/** A long sloth arm from (x0, y0) to its claw at (x1, y1). */
function Arm({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + 60;
  const d = `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`;
  const a = Math.atan2(y1 - my, x1 - mx);
  return (
    <g>
      <path d={d} fill="none" stroke={C.ink} strokeWidth="46" strokeLinecap="round" />
      <path d={d} fill="none" stroke={FUR} strokeWidth="34" strokeLinecap="round" />
      {/* three claws */}
      {[-0.45, 0, 0.45].map((o) => (
        <path key={o} d={`M${x1} ${y1} q${Math.cos(a + o) * 30} ${Math.sin(a + o) * 30} ${Math.cos(a + o + 0.6) * 44} ${Math.sin(a + o + 0.6) * 44}`} fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
      ))}
    </g>
  );
}

export const HangSlowSell: React.FC<typeof SLOW_SELL> = ({ burned }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });

  // the claw creeps toward the button, slower and slower, never quite there
  const reach = interpolate(frame, [40, 230], [0, 0.93], { ...clamp, easing: Easing.out(Easing.cubic) });
  // the clock: seconds, then minutes, hours, days
  const clockT = interpolate(frame, [40, 230], [0, 1], clamp);
  const minutes = Math.floor(Math.pow(clockT, 2.2) * 3 * 24 * 60);
  const clock = minutes < 60 ? `${minutes} min` : minutes < 24 * 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${Math.floor(minutes / 1440)} days ${Math.floor((minutes % 1440) / 60)} h`;
  const asleep = frame > 215;
  const yawn = interpolate(frame, [180, 196, 212], [0, 1, 0], clamp);
  // the phone slips out of the other paw and drops into the fire
  const drop = interpolate(frame, [240, 272], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flare = interpolate(frame, [270, 285, 320], [1, 1.6, 1.25], clamp);
  const end = pop(300);

  const phoneX = 600;
  const phoneY = 470 + drop * 520;
  const btnX = phoneX + 110;
  const btnY = 470 + 273;
  const clawX = interpolate(reach, [0, 1], [300, btnX - 10]);
  const clawY = interpolate(reach, [0, 1], [880, btnY + 20]);

  return (
    <AbsoluteFill style={{ background: C.sky, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />

      <p style={{ position: "absolute", left: 60, right: 60, top: 54, margin: 0, fontWeight: 900, fontSize: 80, lineHeight: 0.98, color: C.ink, transform: `scale(${pop(4)})`, transformOrigin: "0 50%" }}>
        A sloth tries
        <br />
        to sell {TICKER}.
      </p>

      {/* the clock, fast-forwarding */}
      {frame >= 40 && frame < 300 ? (
        <div style={{ position: "absolute", right: 60, top: 250, textAlign: "right" }}>
          <p style={{ margin: 0, fontFamily: type, fontSize: 24, color: C.muted }}>time spent reaching ⏩ x{Math.round(1 + clockT * 9999)}</p>
          <p style={{ margin: "4px 0 0", fontFamily: type, fontWeight: 700, fontSize: 48, color: C.ink }}>{clock}</p>
        </div>
      ) : null}

      <Bough width={1200} height={44} leaves={6} style={{ left: -60, top: 380 }} />

      {/* the sloth, hanging by one arm, phone in the other paw */}
      <svg viewBox="0 0 1080 1350" width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
        <path d="M250 404 L262 600" stroke={C.ink} strokeWidth="46" strokeLinecap="round" />
        <path d="M250 404 L262 600" stroke={FUR} strokeWidth="34" strokeLinecap="round" />
        <ellipse cx="270" cy="800" rx="120" ry="150" fill={FUR} stroke={C.ink} strokeWidth="8" />
        <ellipse cx="270" cy="830" rx="70" ry="100" fill="#e6d9bd" />
        {/* the other paw, holding the phone until it slips */}
        {drop === 0 ? <Arm x0={220} y0={780} x1={phoneX + 20} y1={phoneY + 330} /> : <Arm x0={220} y0={780} x1={330} y1={960} />}
        <g transform="translate(150 520) scale(2.4)">
          <SlothHead traits={[0, 1, 0, 0]} asleep={asleep} />
        </g>
        {yawn > 0.15 ? <ellipse cx="270" cy="696" rx="16" ry={6 + yawn * 16} fill={C.ink} /> : null}
        {asleep ? (
          <text x="400" y="560" fontFamily="serif" fontWeight="900" fontSize="54" fill={C.ink}>
            z z z
          </text>
        ) : null}
      </svg>

      {/* the phone */}
      <div style={{ position: "absolute", left: phoneX, top: phoneY, transform: `rotate(${drop * 140}deg)`, opacity: 1 - Math.max(0, drop - 0.9) * 10 }}>
        <Phone pressGlow={reach > 0.85 ? Math.abs(Math.sin(frame * 0.4)) : 0} />
      </div>

      {/* the reaching arm, drawn over the phone so the claw is seen creeping up on the button */}
      <svg viewBox="0 0 1080 1350" width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
        <Arm x0={330} y0={760} x1={clawX} y1={clawY} />
      </svg>

      {/* the ground and the fire */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <Campfire size={280} flick={frame / 22} blaze={flare} style={{ position: "absolute", left: 590, top: 960 }} />
      {frame >= 272 && frame < 300 ? (
        <div style={{ position: "absolute", left: 300, top: 1010, transform: `rotate(-6deg) scale(${pop(272)})` }}>
          <p style={chip(30, "#faf6ea")}>the phone is on the fire too</p>
        </div>
      ) : null}

      {/* the close */}
      {frame >= 300 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(226,235,207,${0.88 * end})` }}>
          <div style={{ transform: `scale(${end})`, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 100, lineHeight: 1, color: C.ink }}>
              Too slow to sell.
              <br />
              Hang on.
            </p>
            <p style={{ margin: "34px 0 0", fontFamily: type, fontWeight: 700, fontSize: 32, color: C.ink }}>
              meanwhile, on the fire: {Math.floor(burned).toLocaleString("en-US")} {TICKER}
            </p>
            <p style={{ ...chip(36), marginTop: 26 }}>
              {TICKER} · {SITE}
            </p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 24, bottom: 10, margin: 0, fontFamily: type, fontSize: 18, color: C.paper, opacity: 0.75 }}>meme · not financial advice</p>
    </AbsoluteFill>
  );
};
