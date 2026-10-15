/**
 * Five update posts (1080×1350), each a different joke on the same live numbers. Every figure is
 * read off the engine and checked on the chain; big numbers are rounded down so none is larger
 * than what is on chain. Change NOW and render again for the next update.
 */
import { AbsoluteFill } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { Bough, Campfire, Hanger, SlothHead, chip, type Traits } from "./parts";

export const NOW = {
  when: "14 Oct 2026 · 10:07 UTC",
  supply: 1_000_000_000,
  burned: 7117523.504,
  holders: 43,
  feesETH: "0.0678",
  burnETH: "0.0251",
  treasuryETH: "0.0427",
  escrow: 0.006528,
  target: 0.01,
  next: "burn",
  rounds: [
    { n: 1, kind: "burn", eth: "0.0131", burned: 4434601.037, tx: "0x6ef528fe…5ac675" },
    { n: 2, kind: "treasury", eth: "0.0215", burned: 0, tx: "0xd6606f97…436af" },
    { n: 3, kind: "burn", eth: "0.0120", burned: 2682922.467, tx: "0x358ef5e8…581c2b" },
    { n: 4, kind: "treasury", eth: "0.0213", burned: 0, tx: "0xee8f4d6b…6f7270" },
  ],
};
export type Now = typeof NOW;

const whole = (n: number) => Math.floor(n).toLocaleString("en-US");
const H1 = (size: number): React.CSSProperties => ({ margin: 0, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.02em", color: C.ink });

function Page({ tag, when, children, dark = false }: { tag: string; when: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <AbsoluteFill style={{ background: dark ? "#0d1424" : C.sky, fontFamily: serif, overflow: "hidden" }}>
      {dark ? null : <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 46px, rgba(28,36,26,0.08) 46px 48px)` }} />}
      <div style={{ position: "absolute", left: 64, top: 58 }}>
        <p style={chip(24)}>
          {tag} · {when}
        </p>
      </div>
      {children}
      <div style={{ position: "absolute", right: 64, bottom: 40 }}>
        <p style={chip(26)}>
          {TICKER} · {SITE}
        </p>
      </div>
      <p style={{ position: "absolute", left: 64, bottom: 52, margin: 0, fontFamily: type, fontSize: 19, color: dark ? "#9fb0cf" : C.muted }}>every number is on chain</p>
    </AbsoluteFill>
  );
}

/* ═════════ 1. Sloth Mart receipt ═════════ */
export const UpdReceipt: React.FC<Now> = (p) => (
  <Page tag="Update" when={p.when}>
    <p style={{ ...H1(78), position: "absolute", left: 64, top: 124 }}>The fire's receipt.</p>
    <div style={{ position: "absolute", left: 170, right: 170, top: 290, background: "#fffdf6", border: `4px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: "34px 40px 30px", fontFamily: type, color: C.ink, transform: "rotate(-1.5deg)" }}>
      <p style={{ margin: 0, textAlign: "center", fontWeight: 700, fontSize: 40 }}>SLOTH MART</p>
      <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: 22 }}>the foot of the tree · open 24/7</p>
      <div style={{ margin: "20px 0", borderTop: `3px dashed ${C.ink}` }} />
      {p.rounds.map((r) => (
        <div key={r.n} style={{ display: "flex", justifyContent: "space-between", fontSize: 26, lineHeight: 1.75 }}>
          <span>
            #{r.n} {r.kind === "burn" ? `🔥 ${whole(r.burned)} ${TICKER}` : "🏦 treasury"}
          </span>
          <span>{r.eth}</span>
        </div>
      ))}
      <div style={{ margin: "16px 0", borderTop: `3px dashed ${C.ink}` }} />
      {[
        ["fees in", `${p.feesETH} ETH`],
        ["burned", `${whole(p.burned)} ${TICKER}`],
        ["to treasury", `${p.treasuryETH} ETH`],
        ["paid to holders", "0.0000 ETH"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 27, fontWeight: 700, lineHeight: 1.7 }}>
          <span>{k}</span>
          <span>{v}</span>
        </div>
      ))}
      <div style={{ margin: "16px 0 14px", borderTop: `3px dashed ${C.ink}` }} />
      <p style={{ margin: 0, textAlign: "center", fontSize: 24 }}>no refunds. no paper hands.</p>
      <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: 24 }}>thank you for hanging on</p>
      <div style={{ marginTop: 18, height: 64, backgroundImage: `repeating-linear-gradient(90deg, ${C.ink} 0 4px, transparent 4px 7px, ${C.ink} 7px 9px, transparent 9px 14px, ${C.ink} 14px 20px, transparent 20px 23px)` }} />
    </div>
  </Page>
);

/* ═════════ 2. The fire's diet log: one log per burn, an empty slot for the next ═════════ */
export const UpdFireLog: React.FC<Now> = (p) => {
  const burns = p.rounds.filter((r) => r.kind === "burn");
  const logs = [...burns.map((b) => ({ label: `#${b.n} · ${whole(b.burned)}`, empty: false })), { label: `next · ${Math.floor((p.escrow / p.target) * 100)}% loaded`, empty: true }];
  return (
    <Page tag="Fire log" when={p.when}>
      <p style={{ ...H1(80), position: "absolute", left: 64, top: 124, width: 950 }}>
        Logs on the fire
        <br />
        so far.
      </p>
      <Campfire size={360} flick={0.3} blaze={1.1} style={{ position: "absolute", left: 360, top: 330 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, display: "grid", gap: 26 }}>
        {logs.map((l, i) => (
          <div key={l.label} style={{ position: "relative", height: 92, borderRadius: 46, background: l.empty ? "transparent" : i % 2 ? "#8a6644" : C.bark, border: `6px ${l.empty ? "dashed" : "solid"} ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)` }}>
            {l.empty ? null : <div style={{ position: "absolute", left: 18, width: 56, height: 56, borderRadius: "50%", background: "#e4cf9f", border: `5px solid ${C.ink}` }} />}
            <span style={{ fontFamily: type, fontWeight: 700, fontSize: 34, color: l.empty ? C.ink : C.paper2 }}>
              {l.label}
              {l.empty ? "" : ` ${TICKER}`}
            </span>
          </div>
        ))}
      </div>
    </Page>
  );
};

/* ═════════ 3. The tree is lighter ═════════ */
export const UpdLighter: React.FC<Now> = (p) => {
  const pct = (p.burned / p.supply) * 100;
  const left = p.supply - p.burned;
  return (
    <Page tag="Weigh-in" when={p.when}>
      <p style={{ ...H1(84), position: "absolute", left: 64, top: 124, width: 960 }}>
        The tree is
        <br />
        <span style={{ color: C.fire }}>{pct.toFixed(2)}% lighter.</span>
      </p>
      {/* a scale: the tree on one pan, the burned part already in the fire */}
      <svg viewBox="0 0 900 520" width={900} height={520} style={{ position: "absolute", left: 90, top: 380 }}>
        <path d="M450 80 V470 M330 470 H570" stroke={C.ink} strokeWidth="14" strokeLinecap="round" />
        <path d="M150 110 L750 70" stroke={C.ink} strokeWidth="12" strokeLinecap="round" />
        <path d="M150 110 L100 230 M150 110 L200 230 M750 70 L700 190 M750 70 L800 190" stroke={C.ink} strokeWidth="4" />
        <path d="M70 230 H230 Q150 280 70 230 Z" fill={C.mango} stroke={C.ink} strokeWidth="5" />
        <path d="M670 190 H830 Q750 240 670 190 Z" fill={C.mango} stroke={C.ink} strokeWidth="5" />
        {/* the tree on the left pan */}
        <rect x="138" y="150" width="24" height="80" fill={C.bark} stroke={C.ink} strokeWidth="4" />
        <circle cx="150" cy="140" r="56" fill={C.leaf} stroke={C.ink} strokeWidth="5" />
        <circle cx="118" cy="120" r="30" fill={C.leafL} stroke={C.ink} strokeWidth="4" />
        {/* a pinch of ash on the right pan */}
        <ellipse cx="750" cy="182" rx="18" ry="8" fill="#8f8477" stroke={C.ink} strokeWidth="3" />
      </svg>
      <p style={{ position: "absolute", left: 90, top: 690, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.ink, whiteSpace: "nowrap" }}>not burned yet:</p>
      <p style={{ position: "absolute", left: 90, top: 730, margin: 0, fontWeight: 900, fontSize: 52, color: C.leafD }}>{whole(left)}</p>
      <p style={{ position: "absolute", right: 90, top: 690, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: C.ink, textAlign: "right" }}>gone to ash:</p>
      <p style={{ position: "absolute", right: 90, top: 730, margin: 0, fontWeight: 900, fontSize: 52, color: C.fire, textAlign: "right" }}>{whole(p.burned)}</p>
      <p style={{ position: "absolute", left: 64, right: 64, top: 880, margin: 0, fontFamily: type, fontSize: 32, lineHeight: 1.5, color: C.ink, textAlign: "center" }}>
        out of {whole(p.supply)} {TICKER}.
        <br />
        the scale only goes one way. 🔥
      </p>
    </Page>
  );
};

/* ═════════ 4. N sloths on the tree ═════════ */
export const UpdHolders: React.FC<Now> = (p) => {
  const perRow = 9;
  const rows = Math.ceil(p.holders / perRow);
  return (
    <Page tag="Census" when={p.when}>
      <p style={{ ...H1(88), position: "absolute", left: 64, top: 124, width: 960 }}>
        {p.holders} sloths
        <br />
        on the tree.
      </p>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 360 + r * 150, height: 150 }}>
          <Bough width={1200} height={30} leaves={0} style={{ left: -60, top: 14 }} />
          {Array.from({ length: Math.min(perRow, p.holders - r * perRow) }, (_, i) => {
            const k = r * perRow + i;
            const tr: Traits = [k % 5, (k * 3) % 5, (k * 7) % 6, 0];
            return (
              <svg key={i} viewBox="0 0 100 100" width={96} height={96} style={{ position: "absolute", left: 50 + i * 110 + (r % 2) * 30, top: 34, transform: `rotate(${((k * 13) % 14) - 7}deg)` }}>
                <SlothHead traits={tr} asleep={k % 6 === 0} />
              </svg>
            );
          })}
        </div>
      ))}
      <p style={{ position: "absolute", left: 64, right: 64, top: 360 + rows * 150 + 20, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 32, lineHeight: 1.5, color: C.ink }}>
        the branch is still holding.
        <br />
        room for more. sloths only.
      </p>
    </Page>
  );
};

/* ═════════ 5. Loading screen: the next burn ═════════ */
export const UpdLoading: React.FC<Now> = (p) => {
  const pct = Math.floor((p.escrow / p.target) * 100);
  const cells = 20;
  const lit = Math.round((pct / 100) * cells);
  return (
    <Page tag="Now loading" when={p.when} dark>
      <p style={{ position: "absolute", left: 0, right: 0, top: 170, margin: 0, textAlign: "center", fontFamily: type, fontWeight: 700, fontSize: 40, letterSpacing: "0.3em", color: "#9fb0cf" }}>NOW LOADING</p>
      <p style={{ position: "absolute", left: 0, right: 0, top: 230, margin: 0, textAlign: "center", fontWeight: 900, fontSize: 110, color: "#faf6ea" }}>NEXT BURN</p>
      <Bough width={700} height={36} leaves={3} style={{ left: 190, top: 400 }} />
      <Hanger traits={[0, 1, 0, 0]} width={150} sway={-4} style={{ position: "absolute", left: 465, top: 420 }} />
      <Campfire size={190} flick={0.4} blaze={0.6 + pct / 250} style={{ position: "absolute", left: 445, top: 620 }} />
      {/* the bar */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 860, display: "flex", gap: 8, padding: 10, border: `5px solid #faf6ea` }}>
        {Array.from({ length: cells }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 54, background: i < lit ? C.mango : "#1d2a44" }} />
        ))}
      </div>
      <p style={{ position: "absolute", left: 120, right: 120, top: 950, margin: 0, display: "flex", justifyContent: "space-between", fontFamily: type, fontWeight: 700, fontSize: 34, color: "#faf6ea" }}>
        <span>{pct}%</span>
        <span>
          {p.escrow.toFixed(4)} / {p.target} ETH
        </span>
      </p>
      <div style={{ position: "absolute", left: 120, right: 120, top: 1040, fontFamily: type, fontSize: 28, lineHeight: 1.55, color: "#cfd8ea" }}>
        <div>TIP: sloths don't sell. they nap.</div>
        <div>TIP: red or green, the fee still feeds the fire.</div>
      </div>
    </Page>
  );
};

