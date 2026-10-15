/**
 * "Cycle complete": a treasury round played out. The fee meter fills, an ETH coin rolls down the
 * branch into the vault in the trunk, the sloth teller stamps the ledger, and the cycle wheel turns
 * back to the fire. Every figure comes in through props, read off the engine and checked on chain.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, SlothHead, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type TreasuryProps = { round: number; cycle: number; treasuryNo: number; eth: number; before: number; total: number; burned: number; tx: string; when: string };

export const TREASURY_R8: TreasuryProps = {
  round: 8,
  cycle: 4,
  treasuryNo: 4,
  eth: 0.022682,
  before: 0.062792,
  total: 0.085474,
  burned: 12962951.001,
  tx: "0x416505a0f88013495d2389d0035dda74cfad61dd9273c19e8efcb3fa90427b75",
  when: "14 Oct 2026 · 11:13 UTC",
};

/** ETH figures are cut, not rounded, so none reads larger than what moved on chain. */
const ethCut = (n: number, dp = 4) => (Math.floor(n * 10 ** dp) / 10 ** dp).toFixed(dp);

export const HangTreasury: React.FC<TreasuryProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });

  const fill = interpolate(frame, [20, 90], [0, Math.min(1, p.eth / 0.02)], clamp);
  // the coin rolls along the branch, then drops into the vault
  const roll = interpolate(frame, [100, 150], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const fall = interpolate(frame, [150, 172], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const coinX = interpolate(roll, [0, 1], [900, 360]);
  const coinY = 420 + fall * 260;
  const inVault = frame >= 172;
  const k = interpolate(frame, [172, 215], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const stamp = pop(222);
  const wheel = interpolate(frame, [255, 300], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const end = pop(320);

  return (
    <AbsoluteFill style={{ background: C.sky, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />

      <div style={{ position: "absolute", left: 60, top: 54 }}>
        <p style={chip(24)}>
          Round #{p.round} · {p.when}
        </p>
      </div>
      <p style={{ position: "absolute", left: 60, right: 60, top: 116, margin: 0, fontWeight: 900, fontSize: 78, lineHeight: 0.98, color: C.ink }}>
        {frame < 100 ? "Next stop: the treasury." : frame < 220 ? "Into the vault." : frame < 255 ? "Filed." : "Back to the fire."}
      </p>

      {/* the fee meter */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 230 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: type, fontWeight: 700, fontSize: 28, color: C.ink }}>
          <span>fee escrow → treasury</span>
          <span>{ethCut(p.eth * (fill / Math.min(1, p.eth / 0.02)) || 0)} / 0.02 ETH</span>
        </div>
        <div style={{ marginTop: 8, height: 26, border: `4px solid ${C.ink}`, background: C.paper }}>
          <div style={{ height: "100%", width: `${fill * 100}%`, background: C.mango, borderRight: fill > 0 ? `4px solid ${C.ink}` : undefined }} />
        </div>
      </div>

      {/* the trunk with the vault, and the branch the coin rolls down */}
      <div style={{ position: "absolute", left: 160, top: 330, width: 260, bottom: 0, background: `repeating-linear-gradient(90deg, ${C.bark} 0 30px, #6b4e33 30px 34px, ${C.bark} 34px 62px)`, borderLeft: `6px solid ${C.ink}`, borderRight: `6px solid ${C.ink}` }} />
      <Bough width={760} height={40} leaves={4} style={{ left: 400, top: 440, transform: "rotate(-6deg)", transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: 200, top: 640, width: 180, height: 200, borderRadius: "90px 90px 20px 20px", background: "#2a1c12", border: `7px solid ${C.ink}`, boxShadow: inVault ? `0 0 ${30 * (1 - k)}px ${C.mango}` : "none" }}>
        <p style={{ position: "absolute", left: 0, right: 0, top: -48, margin: 0, textAlign: "center", ...chip(22, C.paper2) }}>treasury</p>
        <div style={{ position: "absolute", left: 66, top: 70, width: 48, height: 48, borderRadius: "50%", border: `6px solid ${C.mango}` }} />
      </div>
      {!inVault ? (
        <div style={{ position: "absolute", left: coinX, top: coinY, width: 64, height: 64, borderRadius: "50%", background: C.mango, border: `5px solid ${C.ink}`, transform: `rotate(${-roll * 720}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: type, fontWeight: 700, fontSize: 18, color: C.ink }}>
          ETH
        </div>
      ) : null}

      {/* the teller and the ledger */}
      <div style={{ position: "absolute", left: 470, top: 640, width: 560, background: "#fffdf6", border: `5px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: "22px 28px", fontFamily: type, color: C.ink, transform: "rotate(-1deg)" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 26, textTransform: "uppercase", color: C.muted }}>ledger · treasury</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 30 }}>
          <span>this round</span>
          <b>{ethCut(p.eth * k)} ETH</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 30 }}>
          <span>all treasury</span>
          <b>{ethCut(p.before + (p.total - p.before) * k)} ETH</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 26, color: C.muted }}>
          <span>paid to holders</span>
          <span>0.0000 ETH</span>
        </div>
        {frame >= 222 ? (
          <div style={{ position: "absolute", right: -10, bottom: -62, transform: `rotate(-8deg) scale(${stamp})`, border: `5px solid ${C.red}`, padding: "6px 14px", color: C.red, fontWeight: 700, fontSize: 30, background: "rgba(255,253,246,0.85)" }}>
            FILED · treasury #{p.treasuryNo}
          </div>
        ) : null}
      </div>
      {/* the teller's head, with a green visor */}
      <svg viewBox="0 0 100 100" width={150} height={150} style={{ position: "absolute", left: 870, top: 480 }}>
        <SlothHead traits={[2, 0, 1, 0]} />
        <path d="M14 36 Q50 18 86 36 L90 44 Q50 30 10 44 Z" fill="#2fbf71" stroke={C.ink} strokeWidth="3" />
      </svg>

      {/* the cycle wheel: fire → treasury → back to fire */}
      <div style={{ position: "absolute", left: 520, top: 960, width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" width={220} height={220} style={{ transform: `rotate(${wheel}deg)` }}>
          <circle cx="110" cy="110" r="100" fill={C.paper2} stroke={C.ink} strokeWidth="7" />
          <path d="M110 10 V210" stroke={C.ink} strokeWidth="4" strokeDasharray="10 8" />
          <text x="60" y="122" textAnchor="middle" fontSize="54" transform={`rotate(${-wheel} 60 104)`}>🔥</text>
          <text x="160" y="122" textAnchor="middle" fontSize="54" transform={`rotate(${-wheel} 160 104)`}>🏦</text>
        </svg>
        <div style={{ position: "absolute", left: 96, top: -26, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `24px solid ${C.ink}` }} />
      </div>
      {frame >= 280 ? (
        <p style={{ position: "absolute", left: 760, top: 1030, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.ink, opacity: interpolate(frame, [280, 295], [0, 1], clamp) }}>
          next:
          <br />
          the fire again
        </p>
      ) : null}

      {/* the ground and the fire */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <Campfire size={170} flick={frame / 22} blaze={frame > 280 ? 1.2 : 0.9} style={{ position: "absolute", left: 40, top: 1080 }} />

      {/* the close */}
      {frame >= 320 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(226,235,207,${0.9 * end})` }}>
          <div style={{ transform: `scale(${end})`, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 92, lineHeight: 1, color: C.ink }}>
              Cycle #{p.cycle} complete.
            </p>
            <p style={{ margin: "14px 0 0", fontWeight: 900, fontSize: 64, color: C.fire }}>Back to the fire. 🔥</p>
            <p style={{ margin: "26px 0 0", fontFamily: type, fontWeight: 700, fontSize: 28, lineHeight: 1.5, color: C.ink }}>
              treasury #{p.treasuryNo}: {ethCut(p.eth)} ETH · total {ethCut(p.total)} ETH
              <br />
              on the fire so far: {Math.floor(p.burned).toLocaleString("en-US")} {TICKER}
            </p>
            <p style={{ margin: "12px 0 0", fontFamily: type, fontSize: 22, color: C.muted }}>
              proof: {p.tx.slice(0, 12)}…{p.tx.slice(-6)}
            </p>
            <p style={{ ...chip(34), marginTop: 22 }}>
              {TICKER} · {SITE}
            </p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 24, bottom: 10, margin: 0, fontFamily: type, fontSize: 18, color: C.paper, opacity: 0.75 }}>every number is on chain · not financial advice</p>
    </AbsoluteFill>
  );
};
