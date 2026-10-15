/**
 * Posts made from real on-chain numbers. Every figure comes in through props, read off the engine
 * and checked on the chain; nothing here is made up. Defaults are the first burn, 14 Oct 2026.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, Hanger, chip } from "./parts";

export type BurnProps = {
  n: number;
  burned: number;
  eth: string;
  supply: number;
  date: string;
  buyTx: string;
  burnTx: string;
};

export const FIRST_BURN: BurnProps = {
  n: 1,
  burned: 4434601.037219792,
  eth: "0.013084",
  supply: 1_000_000_000,
  date: "14 Oct 2026",
  buyTx: "0xd8868df7df39a6978bd940fed17f14455a6ef5cd56be7489db36bd72d1c40b8a",
  burnTx: "0x6ef528fe20f37cbdb7cc8ae9bd6a19f71c7536b10363e0258fcd180d575ac675",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// rounded down, so a figure is never larger than what is on chain
const whole = (n: number) => Math.floor(n).toLocaleString("en-US");
const shortTx = (h: string) => `${h.slice(0, 10)}…${h.slice(-6)}`;

/** The field-journal page: what the fire ate, with the proof. `k` (0..1) runs the count and the flare. */
function Page({ p, k, flick }: { p: BurnProps; k: number; flick: number }) {
  const pct = (p.burned / p.supply) * 100;
  const sweat = k > 0.6;
  return (
    <AbsoluteFill style={{ background: C.sky, fontFamily: serif, overflow: "hidden" }}>
      {/* ruled journal lines */}
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />
      <div style={{ position: "absolute", left: 70, top: 64 }}>
        <p style={chip(26)}>Field note #{p.n} · {p.date}</p>
      </div>
      <p style={{ position: "absolute", left: 70, top: 132, margin: 0, fontWeight: 900, fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.03em", color: C.ink, width: 940 }}>
        {p.n === 1 ? "First burn." : `Burn #${p.n}.`}
        <br />
        The sloth didn't let go.
      </p>

      {/* the sloth over the fire; the fire grows as the count runs */}
      <Bough width={1180} height={44} leaves={6} style={{ left: -60, top: 400 }} />
      <Hanger traits={[0, 1, 0, 0]} width={220} sway={Math.sin(flick * Math.PI * 2) * 3} startled={k > 0.3} style={{ position: "absolute", left: 640, top: 422 }} />
      {sweat
        ? [
            [668, 560],
            [838, 548],
            [852, 600],
          ].map(([x, y], i) => (
            <svg key={i} viewBox="0 0 20 28" width={22} height={30} style={{ position: "absolute", left: x, top: y + Math.sin(flick * 6 + i) * 3 }}>
              <path d="M10 1 C 14 10, 19 15, 19 19 A 9 9 0 0 1 1 19 C 1 15, 6 10, 10 1 Z" fill="#8fc6e8" stroke={C.ink} strokeWidth="2" />
            </svg>
          ))
        : null}
      {sweat ? (
        <div style={{ position: "absolute", left: 880, top: 470, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.ink, transform: "rotate(8deg)" }}>*sweats*</div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250, background: C.leafD, borderTop: `6px solid ${C.ink}` }} />
      <Campfire size={300} flick={flick} blaze={1 + k * 0.45} style={{ position: "absolute", left: 600, top: 790 }} />

      {/* the count */}
      <div style={{ position: "absolute", left: 70, top: 500, width: 560 }}>
        <p style={{ margin: 0, fontFamily: type, fontSize: 26, color: C.muted, textTransform: "uppercase" }}>on the fire</p>
        <p style={{ margin: "4px 0 0", fontWeight: 900, fontSize: 92, lineHeight: 1, color: C.fire, textShadow: `4px 4px 0 ${C.ink}` }}>{whole(p.burned * k)}</p>
        <p style={{ margin: "6px 0 0", fontWeight: 700, fontSize: 40, color: C.ink }}>{TICKER}</p>
        <p style={{ margin: "22px 0 0", fontFamily: type, fontSize: 25, lineHeight: 1.5, color: C.ink }}>
          bought with {p.eth} ETH of fees
          <br />
          {pct.toFixed(2)}% of all {TICKER}, gone
          <br />
          nobody got paid. it just burned.
        </p>
      </div>

      {/* the proof */}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontFamily: type, fontSize: 23, lineHeight: 1.5, color: C.paper }}>
          buy&nbsp;&nbsp;{shortTx(p.buyTx)}
          <br />
          burn {shortTx(p.burnTx)} → 0x…dEaD
        </div>
        <p style={chip(26)}>{SITE}</p>
      </div>
    </AbsoluteFill>
  );
}

/* ═════════ Post (1080×1350): the burn, counted ═════════ */
export const HangBurnPost: React.FC<BurnProps> = (p) => <Page p={p} k={1} flick={0.3} />;

/* ═════════ Clip (1080×1350, 8 s): the count runs up, the fire flares, the sloth sweats and holds on ═════════ */
export const HangBurnClip: React.FC<BurnProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [20, 150], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const land = spring({ frame: frame - 160, fps, config: { damping: 10, stiffness: 160 } });
  return (
    <AbsoluteFill>
      <Page p={p} k={k} flick={frame / 24} />
      {frame > 160 ? (
        <div style={{ position: "absolute", left: 80, top: 880, transform: `rotate(-6deg) scale(${land})` }}>
          <p style={{ ...chip(34, C.paper2), border: `5px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}` }}>still hanging on</p>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ═════════ Status report (1080×1350): where the tree stands, every figure read off the engine and the chain ═════════ */
export type StatusProps = {
  when: string;
  rounds: number;
  burns: { n: number; burned: number; eth: string }[];
  burned: number;
  supply: number;
  feesETH: string;
  burnETH: string;
  treasuryETH: string;
  holders: number;
  next: "burn" | "treasury";
  escrow: number;
  target: number;
};

export const STATUS_NOW: StatusProps = {
  when: "14 Oct 2026 · 10:03 UTC",
  rounds: 4,
  burns: [
    { n: 1, burned: 4434601.04, eth: "0.0131" },
    { n: 3, burned: 2682922.47, eth: "0.0120" },
  ],
  burned: 7117523.504,
  supply: 1_000_000_000,
  feesETH: "0.0678",
  burnETH: "0.0251",
  treasuryETH: "0.0427",
  holders: 41,
  next: "burn",
  escrow: 0.0034,
  target: 0.01,
};

export const HangStatusPost: React.FC<StatusProps> = (p) => {
  const pct = (p.burned / p.supply) * 100;
  const fill = Math.max(0, Math.min(1, p.escrow / p.target));
  const row = (k: string, v: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `2px dashed rgba(28,36,26,0.35)`, fontFamily: type, fontSize: 28, color: C.ink }}>
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.sky, fontFamily: serif, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />
      <div style={{ position: "absolute", left: 64, top: 58 }}>
        <p style={chip(26)}>Status report · {p.when}</p>
      </div>
      <p style={{ position: "absolute", left: 64, top: 126, margin: 0, fontWeight: 900, fontSize: 82, lineHeight: 0.98, color: C.ink, width: 960 }}>
        Status: still
        <br />
        hanging on.
      </p>

      {/* the sloth over a bigger fire, top right */}
      <Bough width={560} height={40} leaves={3} style={{ left: 600, top: 330 }} />
      <Hanger traits={[0, 1, 0, 0]} width={150} sway={-3} style={{ position: "absolute", left: 790, top: 350 }} />
      <Campfire size={220} flick={0.25} blaze={1.15} style={{ position: "absolute", left: 755, top: 560 }} />

      {/* the big number */}
      <div style={{ position: "absolute", left: 64, top: 360, width: 640 }}>
        <p style={{ margin: 0, fontFamily: type, fontSize: 26, color: C.muted, textTransform: "uppercase" }}>on the fire so far</p>
        <p style={{ margin: "4px 0 0", fontWeight: 900, fontSize: 104, lineHeight: 1, color: C.fire, textShadow: `4px 4px 0 ${C.ink}` }}>{whole(p.burned)}</p>
        <p style={{ margin: "8px 0 0", fontWeight: 700, fontSize: 38, color: C.ink }}>
          {TICKER} · {pct.toFixed(2)}% of supply
        </p>
        <div style={{ marginTop: 18, fontFamily: type, fontSize: 25, lineHeight: 1.55, color: C.ink }}>
          {p.burns.map((b) => (
            <div key={b.n}>
              burn #{b.n}: {whole(b.burned)} for {b.eth} ETH
            </div>
          ))}
        </div>
      </div>

      {/* the ledger */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 820, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: "18px 30px 24px" }}>
        {row("rounds done", `${p.rounds} (${p.burns.length} burns)`)}
        {row("fees collected", `${p.feesETH} ETH`)}
        {row("bought & burned with", `${p.burnETH} ETH`)}
        {row("to the treasury", `${p.treasuryETH} ETH`)}
        {row("holders on the tree", String(p.holders))}
        <div style={{ paddingTop: 12, borderTop: `2px dashed rgba(28,36,26,0.35)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: type, fontSize: 28, color: C.ink }}>
            <span>next: {p.next}</span>
            <b>
              {p.escrow.toFixed(4)} / {p.target} ETH
            </b>
          </div>
          <div style={{ marginTop: 10, height: 26, border: `3px solid ${C.ink}`, background: C.paper }}>
            <div style={{ height: "100%", width: `${fill * 100}%`, background: C.mango, borderRight: `3px solid ${C.ink}` }} />
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", right: 64, bottom: 30 }}>
        <p style={chip(26)}>{SITE}</p>
      </div>
      <p style={{ position: "absolute", left: 64, bottom: 40, margin: 0, fontFamily: type, fontSize: 20, color: C.muted }}>every number is on chain · live on the site</p>
    </AbsoluteFill>
  );
};

/* ═════════ Cycle post (1080×1350): "buyback & burn #N done", tally marks carved into the bark ═════════ */
export type CycleProps = {
  when: string;
  burnNo: number;
  round: number;
  burned: number;
  eth: string;
  total: number;
  supply: number;
  burnETH: string;
  treasuryETH: string;
  holders: number;
  next: string;
  buyTx: string;
  burnTx: string;
};

export const CYCLE_NOW: CycleProps = {
  when: "14 Oct 2026 · 10:18 UTC",
  burnNo: 3,
  round: 5,
  burned: 2467094.943,
  eth: "0.0117",
  total: 9584618.448,
  supply: 1_000_000_000,
  burnETH: "0.0368",
  treasuryETH: "0.0427",
  holders: 42,
  next: "treasury, then the fire again",
  buyTx: "0xd69a267404be556555cd78105e58175c7aa3fb7abf538a442b36f952812311c0",
  burnTx: "0x2fc62a9670a2f6f4029455c6bb4f80cbf35a08398ae715469a18209fe789149c",
};

export const HangCyclePost: React.FC<CycleProps> = (p) => {
  const pct = (p.total / p.supply) * 100;
  return (
    <AbsoluteFill style={{ background: C.sky, fontFamily: serif, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />
      {/* the trunk on the right, with one tally mark carved per burn */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 330, background: `repeating-linear-gradient(90deg, ${C.bark} 0 30px, #6b4e33 30px 34px, ${C.bark} 34px 62px)`, borderLeft: `6px solid ${C.ink}` }} />
      <svg viewBox="0 0 240 300" width={240} height={300} style={{ position: "absolute", right: 45, top: 250 }}>
        <rect x="6" y="6" width="228" height="288" rx="26" fill="#e4cf9f" stroke={C.ink} strokeWidth="6" />
        {Array.from({ length: p.burnNo }, (_, i) => (
          <path key={i} d={`M${46 + i * 40} 60 L${40 + i * 40} 240`} stroke={C.ink} strokeWidth="12" strokeLinecap="round" />
        ))}
        {p.burnNo >= 5 ? <path d="M30 210 L210 90" stroke={C.ink} strokeWidth="12" strokeLinecap="round" /> : null}
      </svg>
      <p style={{ position: "absolute", right: 45, top: 568, width: 240, margin: 0, textAlign: "center", fontFamily: type, fontWeight: 700, fontSize: 26, color: C.paper2 }}>burns so far</p>
      {/* the sloth clinging to the trunk, claws out, still carving */}
      <Hanger traits={[0, 1, 0, 0]} width={170} sway={-14} style={{ position: "absolute", right: 250, top: 600 }} />

      <div style={{ position: "absolute", left: 64, top: 58 }}>
        <p style={chip(24)}>Round #{p.round} · {p.when}</p>
      </div>
      <p style={{ position: "absolute", left: 64, top: 126, margin: 0, fontWeight: 900, fontSize: 86, lineHeight: 0.96, letterSpacing: "-0.02em", color: C.ink, width: 660 }}>
        Buyback
        <br />
        &amp; burn <span style={{ color: C.fire }}>#{p.burnNo}</span>
        <br />
        done.
      </p>

      <div style={{ position: "absolute", left: 64, top: 470, width: 620 }}>
        <p style={{ margin: 0, fontFamily: type, fontSize: 26, color: C.muted, textTransform: "uppercase" }}>this one</p>
        <p style={{ margin: "2px 0 0", fontWeight: 900, fontSize: 84, lineHeight: 1, color: C.fire, textShadow: `4px 4px 0 ${C.ink}` }}>{whole(p.burned)}</p>
        <p style={{ margin: "6px 0 0", fontFamily: type, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: C.ink }}>
          {TICKER}, bought with {p.eth} ETH
          <br />
          of fees, straight to 0x…dEaD
        </p>
      </div>

      <Campfire size={230} flick={0.35} blaze={1.15} style={{ position: "absolute", left: 470, top: 760 }} />

      <div style={{ position: "absolute", left: 64, top: 760, width: 400, fontFamily: type, color: C.ink }}>
        <p style={{ margin: 0, fontSize: 24, textTransform: "uppercase", color: C.muted }}>on the fire so far</p>
        <p style={{ margin: "2px 0 0", fontFamily: serif, fontWeight: 900, fontSize: 56, lineHeight: 1 }}>{whole(p.total)}</p>
        <p style={{ margin: "6px 0 0", fontWeight: 700, fontSize: 26 }}>
          {TICKER} · {pct.toFixed(2)}% of supply
        </p>
      </div>

      {/* the ledger strip */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1030, background: C.paper2, border: `5px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: "14px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontFamily: type, color: C.ink }}>
        {[
          ["burned with", `${p.burnETH} ETH`],
          ["to treasury", `${p.treasuryETH} ETH`],
          ["holders", String(p.holders)],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 20, textTransform: "uppercase", color: C.muted }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
      <p style={{ position: "absolute", left: 64, top: 1172, margin: 0, fontFamily: type, fontSize: 24, color: C.ink }}>next: {p.next}</p>

      <div style={{ position: "absolute", left: 64, bottom: 30, fontFamily: type, fontSize: 21, lineHeight: 1.5, color: C.muted }}>
        buy&nbsp;&nbsp;{p.buyTx.slice(0, 10)}…{p.buyTx.slice(-6)}
        <br />
        burn {p.burnTx.slice(0, 10)}…{p.burnTx.slice(-6)} → 0x…dEaD
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 34 }}>
        <p style={chip(24)}>{SITE}</p>
      </div>
    </AbsoluteFill>
  );
};
