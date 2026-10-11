import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { body, C, DEAD_SHORT, display, mono, sign } from "./brand";
import { Arch, Bulb, Coin, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, Striker, Ticket, Track } from "./parts";

/* Content built on real on-chain numbers. Every value comes in through props
   (set in Root.tsx from the bot status + chain reads), so it can be re-rendered as the graveyard grows. */
export type LiveData = {
  readonly burned: number; // $GRAVE in 0x…dEaD
  readonly burials: number;
  readonly wages: number;
  readonly lastBurial: number; // tokens in the most recent burial
  readonly lastBurialEth: string; // fee ETH that bought it
  readonly wageEth: string;
  readonly date: string;
  readonly claimTx: string;
  readonly buyTx: string;
  readonly burnTx: string;
  readonly wageTx: string;
  readonly next: "burial" | "wages";
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number) => `${((n / 1e9) * 100).toFixed(2)}%`;
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`;

/* ═════════ 15 · The first grave is dug (1080×1350) ═════════ */
export const PostFirstGrave: React.FC<LiveData> = (d) => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={45} />
    <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 112, lineHeight: 1, color: C.cream, textShadow: shade }}>The first grave</div>
      <div style={{ fontFamily: sign, fontSize: 112, lineHeight: 1, color: C.bulb, textShadow: shade }}>is dug.</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center" }}>
      <Headstone width={560} height={700} shape={0} style={{ paddingTop: 170 }}>
        <div style={{ fontFamily: display, fontSize: 44 }}>HERE LIES</div>
        <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1, marginTop: 18 }}>{fmt(d.lastBurial)}</div>
        <div style={{ fontFamily: display, fontSize: 46, marginTop: 6 }}>$GRAVE</div>
        <div style={{ fontFamily: body, fontSize: 30, fontWeight: 600, marginTop: 30 }}>Burial #1 · {d.date}</div>
        <div style={{ fontFamily: body, fontSize: 30, marginTop: 10 }}>Bought at market. Buried by dawn.</div>
        <div style={{ fontFamily: mono, fontSize: 26, marginTop: 34 }}>tx {short(d.burnTx)}</div>
      </Headstone>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1050, height: 26, borderRadius: 13, background: C.nightDeep }} />
    <div style={{ position: "absolute", right: 110, top: 940 }}>
      <MortEyes size={34} look={-0.8} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: display, fontSize: 40, color: C.cream }}>
      {pct(d.lastBurial)} OF THE SUPPLY · GONE FOREVER
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: display, fontSize: 28, color: C.dust }}>
      $GRAVE · GRAVEBURN.FUN
    </div>
  </AbsoluteFill>
);

/* ═════════ 17 · Ride manifest, day one (1080×1350) ═════════ */
const Line: React.FC<{ l: React.ReactNode; r: React.ReactNode; color?: string }> = ({ l, r, color }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "12px 0", color }}>
    <span>{l}</span>
    <span style={{ flex: 1, borderBottom: "3px dotted rgba(42,22,38,0.35)", translate: "0 -7px" }} />
    <span style={{ fontWeight: 700 }}>{r}</span>
  </div>
);

export const PostManifest: React.FC<LiveData> = (d) => (
  <AbsoluteFill>
    <Night glow={0.7} />
    <Motes count={35} />
    <div style={{ position: "absolute", top: 64, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 100, lineHeight: 1, color: C.cream, textShadow: shade }}>Day one,</div>
      <div style={{ fontFamily: sign, fontSize: 100, lineHeight: 1, color: C.bulb, textShadow: shade }}>on the record.</div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 330, rotate: "-2deg" }}>
      <Ticket width={860} notch={24}>
        <div style={{ padding: "46px 64px 50px", fontFamily: mono, fontSize: 30 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: sign, fontSize: 72, lineHeight: 1 }}>Ride Manifest</div>
            <div style={{ fontFamily: display, fontSize: 22, color: C.ticketDim, marginTop: 10 }}>MORT’S GHOST TRAIN · {d.date.toUpperCase()}</div>
          </div>
          <div style={{ borderTop: "4px dashed rgba(42,22,38,0.35)", margin: "26px 0 10px" }} />
          <div style={{ fontFamily: display, fontSize: 26, color: C.sign, marginTop: 14 }}>RIDE #1 · BURIAL</div>
          <Line l="Fees claimed" r={`${d.lastBurialEth} ETH`} />
          <Line l="$GRAVE bought & buried" r={fmt(d.lastBurial)} />
          <div style={{ fontSize: 24, color: C.ticketDim }}>burn tx {short(d.burnTx)}</div>
          <div style={{ fontFamily: display, fontSize: 26, color: "#4c8a12", marginTop: 26 }}>RIDE #2 · MORT’S WAGES</div>
          <Line l="Fees to creator wallet" r={`${d.wageEth} ETH`} />
          <div style={{ fontSize: 24, color: C.ticketDim }}>tx {short(d.wageTx)}</div>
          <div style={{ borderTop: "4px dashed rgba(42,22,38,0.35)", margin: "26px 0 10px" }} />
          <Line l="Total in the graveyard" r={`${fmt(d.burned)} $GRAVE`} />
          <Line l="Next ride" r={d.next === "burial" ? "BURIAL" : "WAGES"} />
        </div>
      </Ticket>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: display, fontSize: 28, color: C.dust }}>
      EVERY RIDE ON-CHAIN · GRAVEBURN.FUN
    </div>
  </AbsoluteFill>
);

/* ═════════ 18 · New high score (1080×1350) ═════════ */
export const PostHighScore: React.FC<LiveData> = (d) => (
  <AbsoluteFill>
    <Night glow={1.1} glowY="20%" />
    <Motes count={50} />
    <Arch width={1000} height={300} style={{ position: "absolute", left: 40, top: 40 }} lit={1} chase={0.6}>
      <div style={{ textAlign: "center", paddingTop: 112 }}>
        <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.bulb, textShadow: "0 0 26px rgba(255,207,58,0.7), 0 5px 0 #9e1528" }}>NEW HIGH SCORE</div>
      </div>
    </Arch>
    <div style={{ position: "absolute", left: 90, right: 90, top: 390, borderRadius: 24, background: C.nightDeep, border: `6px solid ${C.plumLine}`, padding: "40px 50px 46px" }}>
      <div style={{ fontFamily: display, fontSize: 30, color: C.dust, letterSpacing: "0.1em" }}>BIGGEST BURIAL IN ONE RIDE</div>
      <div style={{ fontFamily: display, fontSize: 130, lineHeight: 1, color: C.slime, marginTop: 22, textShadow: "0 0 30px rgba(166,255,77,0.55)" }}>{fmt(d.lastBurial)}</div>
      <div style={{ fontFamily: display, fontSize: 40, color: C.cream, marginTop: 8 }}>$GRAVE → <span style={{ fontFamily: mono, fontSize: 38 }}>{DEAD_SHORT}</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, fontFamily: display, fontSize: 30 }}>
        <span style={{ color: C.dust }}>PLAYER</span>
        <span style={{ color: C.bulb }}>MORT</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: display, fontSize: 30 }}>
        <span style={{ color: C.dust }}>COINS SPENT</span>
        <span style={{ color: C.cream }}>{d.lastBurialEth} ETH</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: display, fontSize: 30 }}>
        <span style={{ color: C.dust }}>SUPPLY ERASED</span>
        <span style={{ color: C.cream }}>{pct(d.lastBurial)}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 74, lineHeight: 1.05, color: C.cream, textShadow: shade }}>Can the next ride beat it?</div>
      <div style={{ fontFamily: display, fontSize: 34, color: C.bulb, marginTop: 20 }}>INSERT COIN: TRADE $GRAVE</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dust }}>GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 16 · Video: the supply counter (1080×1350, 10 s) ═════════ */
export const SupplyCounter: React.FC<LiveData> = (d) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [30, 190], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const eating = f >= 30 && f < 195;
  const outro = interpolate(f, [205, 225], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Night glow={0.6 + p * 0.5} />
      <Motes count={50} />
      <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 56, color: C.bulb, textShadow: shade }}>$GRAVE outside the graveyard</div>
        <div style={{ fontFamily: display, fontSize: 140, lineHeight: 1, color: C.cream, fontVariantNumeric: "tabular-nums", marginTop: 34, textShadow: eating ? "0 0 30px rgba(215,38,61,0.7)" : "none" }}>
          {fmt(1e9 - d.burned * p)}
        </div>
        <div style={{ fontFamily: display, fontSize: 88, color: C.sign, fontVariantNumeric: "tabular-nums", marginTop: 20, opacity: interpolate(f, [26, 34], [0, 1], clamp) }}>
          −{fmt(d.burned * p)}
        </div>
        <div style={{ fontFamily: mono, fontSize: 32, color: C.dust, marginTop: 10 }}>buried at {DEAD_SHORT}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", gap: 30, alignItems: "flex-end" }}>
        {new Array(d.burials).fill(0).map((_, i) => (
          <div key={i} style={{ translate: `0 ${interpolate(f, [60 + i * 30, 100 + i * 30], [260, 0], { ...clamp, easing: expo })}px` }}>
            <Headstone width={180} height={240} shape={i % 2 === 0 ? 0 : 1} style={{ paddingTop: 80 }}>
              <div style={{ fontFamily: display, fontSize: 22 }}>BURIAL #{i + 1}</div>
            </Headstone>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1060, height: 24, borderRadius: 12, background: C.nightDeep }} />
      <div style={{ position: "absolute", right: 140, top: 760 }}>
        <MortEyes size={36} grin={!eating && f > 195} blink={f > 120 && f < 126} />
      </div>
      <AbsoluteFill style={{ opacity: outro, justifyContent: "flex-end", alignItems: "center", paddingBottom: 90, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 86, lineHeight: 1, color: C.cream, textShadow: shade, translate: `0 ${(1 - outro) * 40}px` }}>
          It only goes <span style={{ color: C.bulb }}>one way.</span>
        </div>
        <div style={{ fontFamily: display, fontSize: 30, color: C.dust, marginTop: 20 }}>$GRAVE · GRAVEBURN.FUN</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ═════════ 19 · Video: replay of burial #1 (1080×1350, 15 s) ═════════ */
const Step: React.FC<{ n: string; title: string; detail: React.ReactNode; tx: string; at: number }> = ({ n, title, detail, tx, at }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{ opacity: o, translate: `${interpolate(f, [at, at + 20], [-60, 0], { ...clamp, easing: expo })}px 0`, display: "flex", gap: 26, alignItems: "flex-start" }}>
      <Bulb size={34} lit={f >= at + 6} style={{ marginTop: 10, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: display, fontSize: 30, color: C.dust }}>{n}</div>
        <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1, color: C.cream, textShadow: shade }}>{title}</div>
        <div style={{ fontFamily: body, fontSize: 34, color: C.cream, marginTop: 8 }}>{detail}</div>
        <div style={{ fontFamily: mono, fontSize: 26, color: C.dustDim, marginTop: 6 }}>tx {short(tx)}</div>
      </div>
    </div>
  );
};

export const BurialReplay: React.FC<LiveData> = (d) => {
  const f = useCurrentFrame();
  const end = interpolate(f, [330, 350], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <Motes count={40} />
      <AbsoluteFill style={{ opacity: 1 - end }}>
        <div style={{ position: "absolute", top: 70, left: 90 }}>
          <div style={{ fontFamily: display, fontSize: 40, color: C.sign, opacity: Math.floor(f / 15) % 2 ? 1 : 0.4 }}>● REPLAY</div>
          <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 8 }}>Burial #1</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.bulb, marginTop: 10 }}>{d.date.toUpperCase()} · ON-CHAIN</div>
        </div>
        <div style={{ position: "absolute", left: 90, right: 80, top: 390, display: "flex", flexDirection: "column", gap: 44 }}>
          <Step n="STOP 1" title="The box is full" detail={<>Mort claims <b>{d.lastBurialEth} ETH</b> of trading fees.</>} tx={d.claimTx} at={30} />
          <Step n="STOP 2" title="Buy-back" detail={<>The ETH buys <b>{fmt(d.lastBurial)} $GRAVE</b> at market.</>} tx={d.buyTx} at={110} />
          <Step n="STOP 3" title="Burial" detail={<>Every one of them goes to <b>{DEAD_SHORT}</b>. Forever.</>} tx={d.burnTx} at={190} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 1176, width: "100%" }}>
          <Track width={1080} offset={f * 8} />
        </div>
        <div style={{ position: "absolute", left: interpolate(f, [0, 330], [-240, 1080]), top: 1100 }}>
          <RideCar width={220} spin={f * 10} />
        </div>
        <div style={{ position: "absolute", right: 90, top: 980, opacity: interpolate(f, [270, 285], [0, 1], clamp) }}>
          <Coin size={110} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <GraveMark size={220} glow />
        <div style={{ fontFamily: display, fontSize: 100, lineHeight: 1, color: C.bulb, marginTop: 30 }}>{fmt(d.lastBurial)}</div>
        <div style={{ fontFamily: sign, fontSize: 70, color: C.cream, marginTop: 14, textShadow: shade }}>$GRAVE buried.</div>
        <div style={{ fontFamily: display, fontSize: 36, color: C.dust, marginTop: 26 }}>NEXT RIDE: {d.next === "burial" ? "BURIAL" : "WAGES"}</div>
        <div style={{ fontFamily: body, fontSize: 32, color: C.dust, marginTop: 10 }}>graveburn.fun</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


/* ═════════ 20 · Mort paid more, got less (1080×1350) ═════════ */
type Burial = { readonly n: number; readonly tokens: number; readonly eth: number; readonly tx: string };
type PaidMoreProps = { readonly a: Burial; readonly b: Burial; readonly burned: number };

const PriceTag: React.FC<{ eth: number }> = ({ eth }) => (
  <Ticket width={260} notch={9}>
    <div style={{ padding: "10px 22px 12px", textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 17, color: C.ticketDim }}>MORT PAID</div>
      <div style={{ fontFamily: display, fontSize: 30, lineHeight: 1.1 }}>{eth.toFixed(4)} ETH</div>
    </div>
  </Ticket>
);

const Stone: React.FC<{ d: Burial; shape: 0 | 1; h: number }> = ({ d, shape, h }) => (
  <Headstone width={330} height={h} shape={shape} style={{ paddingTop: shape === 0 ? 110 : 60, paddingBottom: 26, justifyContent: "flex-start" }}>
    <div style={{ fontFamily: display, fontSize: 26 }}>BURIAL #{d.n}</div>
    <div style={{ fontFamily: display, fontSize: 46, lineHeight: 1, marginTop: 14 }}>{fmt(d.tokens)}</div>
    <div style={{ fontFamily: display, fontSize: 26, marginTop: 6 }}>$GRAVE</div>
    <div style={{ fontFamily: mono, fontSize: 20, marginTop: 14 }}>tx {short(d.tx)}</div>
    <div style={{ marginTop: "auto", rotate: d.n % 2 ? "-3deg" : "3deg" }}>
      <PriceTag eth={d.eth} />
    </div>
  </Headstone>
);

export const PostPaidMore: React.FC<PaidMoreProps> = ({ a, b, burned }) => {
  const ratio = b.eth / b.tokens / (a.eth / a.tokens);
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={40} />
      <div style={{ position: "absolute", top: 64, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 108, lineHeight: 1, color: C.cream, textShadow: shade }}>Mort paid more.</div>
        <div style={{ fontFamily: sign, fontSize: 108, lineHeight: 1, color: C.bulb, textShadow: shade }}>Got less.</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, height: 560, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
        <Stone d={a} shape={0} h={560} />
        <Stone d={b} shape={1} h={400} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 852, height: 24, borderRadius: 12, background: C.nightDeep }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 930, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 40, lineHeight: 1.2, color: C.cream }}>
          EACH $GRAVE COST MORT <span style={{ color: C.slime }}>{ratio.toFixed(1)}×</span> MORE ON BURIAL #{b.n}.
        </div>
        <div style={{ fontFamily: body, fontSize: 30, color: C.dust, marginTop: 14 }}>
          {fmt(burned)} $GRAVE in the graveyard ({pct(burned)} of supply). He keeps digging anyway.
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center" }}>
        <MortEyes size={38} look={0.5} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
    </AbsoluteFill>
  );
};

/* ═════════ 23 · Mort's plot map: 100 plots, 1 plot = 1% of supply (1080×1350) ═════════ */
type PlotMapProps = { readonly burned: number; readonly burials: number; readonly date: string };

export const PostPlotMap: React.FC<PlotMapProps> = ({ burned, burials, date }) => {
  const plots = (burned / 1e9) * 100; // e.g. 3.2
  const full = Math.floor(plots);
  const partial = plots - full;
  const cell = 72;
  const cellH = 52;
  const gap = 10;
  return (
    <AbsoluteFill>
      <Night glow={0.75} />
      <Motes count={36} />
      <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 30, color: C.sign, letterSpacing: "0.08em" }}>● MORT’S PLOT MAP · {date}</div>
        <div style={{ fontFamily: sign, fontSize: 112, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 14 }}>
          {full} plots <span style={{ color: C.bulb }}>full.</span>
        </div>
      </div>

      {/* the map: a 10×10 graveyard, one plot = 1% of the 1B supply */}
      <div
        style={{
          position: "absolute",
          left: (1080 - (cell * 10 + gap * 9) - 56) / 2,
          top: 262,
          padding: 28,
          borderRadius: 22,
          background: C.ticket,
          border: `6px solid ${C.ink}`,
          boxShadow: "0 30px 50px -24px rgba(0,0,0,0.85)",
          rotate: "-1.2deg",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${cell}px)`, gap }}>
          {new Array(100).fill(0).map((_, i) => {
            const isFull = i < full;
            const isDigging = i === full && partial > 0;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  height: cellH,
                  borderRadius: 8,
                  border: `3px ${isFull || isDigging ? "solid" : "dashed"} ${isFull || isDigging ? C.ink : "rgba(42,22,38,0.28)"}`,
                  background: isFull ? C.stone : "transparent",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFull ? (
                  <svg width={30} height={36} viewBox="0 0 40 46">
                    <path d="M6 44V18C6 9.7 12.3 3 20 3s14 6.7 14 15v26Z" fill={C.stoneInk} />
                    <path d="M20 13v16M13 19h14" stroke={C.stone} strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                ) : null}
                {isDigging ? (
                  <>
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${partial * 100}%`, background: "#5a3d2a" }} />
                    <svg width={30} height={34} viewBox="0 0 40 44" style={{ position: "relative" }}>
                      <path d="M28 4 14 30" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
                      <path d="M9 27l9 6-5 8c-3 2-7 0-8-3Z" fill={C.ink} />
                    </svg>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: display, fontSize: 22, color: C.ink }}>
          <span>1 PLOT = 1% OF $GRAVE</span>
          <span style={{ color: C.signDeep }}>PLOT {full + 1}: DIGGING…</span>
        </div>
      </div>

      {/* the receipt */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1040, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 44, lineHeight: 1.15, color: C.cream }}>
          {fmt(burned)} <span style={{ color: C.bulb }}>$GRAVE</span> BURIED
        </div>
        <div style={{ fontFamily: body, fontSize: 30, color: C.dust, marginTop: 10 }}>
          {pct(burned)} of supply · {burials} burials · sent to {DEAD_SHORT}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", fontFamily: sign, fontSize: 48, color: C.bulb, textShadow: shade }}>Every trade picks up the shovel.</div>
      <div style={{ position: "absolute", right: 60, top: 1250 }}>
        <MortEyes size={26} look={-0.7} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
    </AbsoluteFill>
  );
};

/* ═════════ 24 · Mort's tally wall: trades in one hour (1080×1350) ═════════ */
type TallyProps = { readonly trades: number; readonly wallets: number; readonly window: string; readonly burned: number };

const TallyGroup: React.FC<{ n: number; seed: number }> = ({ n, seed }) => {
  const j = (k: number) => Math.sin(seed * 12.9898 + k * 78.233) * 1.6; // hand-scratched wobble
  return (
    <svg width={46} height={51} viewBox="0 0 40 44">
      {new Array(Math.min(n, 4)).fill(0).map((_, k) => (
        <path key={k} d={`M${6 + k * 8 + j(k)} 4 L${5 + k * 8 - j(k + 1)} 40`} stroke={C.bulb} strokeWidth="3.2" strokeLinecap="round" />
      ))}
      {n >= 5 ? <path d={`M1 ${33 + j(9)} L39 ${10 - j(7)}`} stroke={C.sign} strokeWidth="3.6" strokeLinecap="round" /> : null}
    </svg>
  );
};

export const PostTallyWall: React.FC<TallyProps> = ({ trades, wallets, window, burned }) => {
  const groups = Math.floor(trades / 5);
  const rest = trades % 5;
  return (
    <AbsoluteFill>
      <Night glow={0.8} />
      <Motes count={34} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 28, color: C.sign, letterSpacing: "0.08em" }}>● {window} · ON-CHAIN</div>
        <div style={{ fontFamily: sign, fontSize: 118, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 14 }}>
          {trades} trades.
        </div>
        <div style={{ fontFamily: sign, fontSize: 118, lineHeight: 1, color: C.bulb, textShadow: shade }}>One hour.</div>
      </div>

      {/* the crypt wall Mort scratches a mark on for every trade */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 340,
          height: 440,
          borderRadius: "36px 36px 10px 10px",
          background: `linear-gradient(180deg, ${C.plum}, ${C.nightDeep})`,
          border: `5px solid ${C.plumLine}`,
          padding: "26px 30px 26px 52px",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), 0 30px 50px -26px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 6px", justifyContent: "flex-start" }}>
          {new Array(groups).fill(0).map((_, i) => (
            <TallyGroup key={i} n={5} seed={i + 1} />
          ))}
          {rest ? <TallyGroup n={rest} seed={999} /> : null}
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 22 }}>
          <MortEyes size={26} look={-0.8} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: body, fontSize: 30, color: C.dust }}>
        One mark per trade · {wallets} wallets · every one paid the shovel
      </div>

      {/* old way vs Mort's way */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 870, display: "flex", gap: 26 }}>
        <div style={{ flex: 1, borderRadius: 18, border: `3px dashed ${C.rail}`, padding: "22px 24px", color: C.dustDim }}>
          <div style={{ fontFamily: display, fontSize: 24 }}>THE OLD WAY</div>
          <div style={{ fontFamily: body, fontSize: 28, lineHeight: 1.3, marginTop: 10, textDecoration: "line-through", textDecorationColor: C.sign, textDecorationThickness: 3 }}>
            Dev burns when they remember. Maybe.
          </div>
        </div>
        <div style={{ flex: 1.15, borderRadius: 18, background: C.ticket, border: `5px solid ${C.ink}`, padding: "22px 24px", color: C.ink, rotate: "1.2deg" }}>
          <div style={{ fontFamily: display, fontSize: 24, color: C.signDeep }}>MORT’S WAY</div>
          <div style={{ fontFamily: body, fontSize: 28, fontWeight: 600, lineHeight: 1.3, marginTop: 10 }}>
            Every trade pays a fee. The bot buys back and buries. Nobody has to remember.
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1112, textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 56, color: C.cream, textShadow: shade }}>
          This is how burns <span style={{ color: C.bulb }}>should</span> work.
        </div>
        <div style={{ fontFamily: display, fontSize: 26, color: C.dust, marginTop: 14 }}>
          {fmt(burned)} $GRAVE BURIED SO FAR ({pct(burned)})
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
    </AbsoluteFill>
  );
};

/* ═════════ 25 · "dex paid?" answered with Mort's payment ledger (1080×1350) ═════════ */
type DexPaidProps = { readonly graves: number[]; readonly wages: number; readonly burned: number; readonly date: string; readonly after?: string; readonly goal?: number };

export const PostDexPaid: React.FC<DexPaidProps> = ({ graves, wages, burned, date, after = "", goal = 0 }) => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={34} />

    {/* the reply everyone keeps leaving */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 56, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, rotate: "-2deg" }}>
        <div style={{ width: 74, height: 74, borderRadius: "50%", background: C.plumLine, border: `4px solid ${C.rail}`, flexShrink: 0 }} />
        <div style={{ background: C.cream, color: C.ink, borderRadius: "8px 30px 30px 30px", padding: "16px 34px 20px", boxShadow: "0 18px 30px -16px rgba(0,0,0,0.8)" }}>
          <div style={{ fontFamily: body, fontSize: 22, color: C.ticketDim, fontWeight: 600 }}>anon · 2m · replying to $GRAVE</div>
          <div style={{ fontFamily: body, fontSize: 70, fontWeight: 700, lineHeight: 1.05 }}>dex paid?</div>
        </div>
      </div>
    </div>

    {/* Mort's answer: the ledger */}
    <div style={{ position: "absolute", left: 100, right: 100, top: 262, rotate: "1deg" }}>
      <div style={{ background: C.ticket, color: C.ink, borderRadius: 18, border: `6px solid ${C.ink}`, padding: "28px 40px 30px", boxShadow: "0 30px 50px -24px rgba(0,0,0,0.9)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${C.ink}`, paddingBottom: 12 }}>
          <span style={{ fontFamily: display, fontSize: 32 }}>MORT’S PAY LEDGER</span>
          <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ticketDim }}>{date}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: `2px dashed rgba(42,22,38,0.35)` }}>
          <span style={{ fontFamily: display, fontSize: 30 }}>DEXSCREENER</span>
          <span style={{ fontFamily: display, fontSize: 30, color: C.signDeep, border: `4px dashed ${C.signDeep}`, borderRadius: 10, padding: "2px 16px", rotate: "-6deg" }}>{after ? `AFTER ${after.toUpperCase()}` : "MAYBE AFTER…"}</span>
        </div>

        {graves.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "9px 0", borderBottom: `2px dashed rgba(42,22,38,0.2)` }}>
            <span style={{ fontFamily: display, fontSize: 27, width: 180 }}>GRAVE #{i + 1}</span>
            <span style={{ flex: 1, fontFamily: mono, fontSize: 30, fontWeight: 700 }}>{fmt(t)} $GRAVE</span>
            <span style={{ fontFamily: display, fontSize: 24, color: "#3f7a0c" }}>PAID ✓</span>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontFamily: display, fontSize: 24, color: C.ticketDim }}>
          <span>MORT’S WAGES: {wages}× PAID ✓</span>
          <span>{pct(burned)} BURIED</span>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.cream, textShadow: shade }}>Dex paid? hmm…</div>
      <div style={{ fontFamily: sign, fontSize: 74, lineHeight: 1.1, color: C.bulb, textShadow: shade }}>
        maybe after{" "}
        {after ? (
          <span style={{ borderBottom: `6px solid ${C.bulb}` }}>{after}.</span>
        ) : (
          <span style={{ display: "inline-block", width: 300, borderBottom: `6px solid ${C.bulb}`, translate: "0 -14px" }} />
        )}
      </div>
      <div style={{ fontFamily: display, fontSize: 30, color: C.cream, marginTop: 22 }}>
        {goal ? (
          <>
            {graves.length} DUG · <span style={{ color: C.sign }}>{goal - graves.length} TO GO</span> · EVERY TRADE HANDS MORT THE SHOVEL
          </>
        ) : (
          `${fmt(burned)} $GRAVE IN 0x…dEaD`
        )}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1218, display: "flex", justifyContent: "center" }}>
      <MortEyes size={24} grin />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 26 · Red candle = scoop season (1080×1350) ═════════ */
type ScoopProps = { readonly burned: number; readonly best: Burial };

// [open, close, high, low] in chart units (0 = bottom, 100 = top)
const CANDLES: [number, number, number, number][] = [
  [30, 46, 50, 27], [46, 62, 66, 42], [62, 78, 84, 58], [78, 72, 86, 66], [72, 60, 75, 55],
  [60, 64, 68, 56], [64, 48, 66, 44], [48, 36, 51, 31], [36, 40, 44, 33], [40, 26, 42, 22], [26, 16, 29, 11],
];

const ScoopChart: React.FC = () => {
  const W = 940, H = 470, pad = 30, cw = 50, step = 66;
  const y = (v: number) => H - pad - (v / 100) * (H - pad * 2);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${pad + i * ((H - pad * 2) / 3)} H${W}`} stroke={C.plumLine} strokeWidth="2" strokeDasharray="6 10" />
      ))}
      {CANDLES.map(([o, c, h, l], i) => {
        const x = 34 + i * step;
        const up = c >= o;
        const col = up ? C.slime : C.sign;
        return (
          <g key={i}>
            <path d={`M${x + cw / 2} ${y(h)} V${y(l)}`} stroke={col} strokeWidth="4" />
            <rect x={x} y={y(Math.max(o, c))} width={cw} height={Math.max(6, Math.abs(y(o) - y(c)))} rx="5" fill={col} stroke={C.ink} strokeWidth="3" />
          </g>
        );
      })}
      {/* the dirt pile the last candle fell into */}
      <path d={`M${W - 250} ${H} Q${W - 150} ${H - 120} ${W - 30} ${H - 20} L${W} ${H} Z`} fill="#5a3d2a" stroke={C.ink} strokeWidth="4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={W - 210 + i * 34} cy={H - 34 - (i % 2) * 22 - (i === 2 ? 30 : 0)} r="14" fill={C.bulb} stroke={C.ink} strokeWidth="3" />
      ))}
      {/* Mort's shovel, mid-scoop */}
      <g transform={`translate(${W - 120} ${H - 250}) rotate(28)`}>
        <rect x="-7" y="0" width="14" height="190" rx="6" fill="#8a5a33" stroke={C.ink} strokeWidth="4" />
        <rect x="-26" y="-14" width="52" height="18" rx="8" fill="#8a5a33" stroke={C.ink} strokeWidth="4" />
        <path d="M-34 186 h68 v36 q-34 40 -68 0 Z" fill={C.stone} stroke={C.ink} strokeWidth="4" />
      </g>
    </svg>
  );
};

export const PostScoop: React.FC<ScoopProps> = ({ burned, best }) => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={30} />
    <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 28, color: C.dust, letterSpacing: "0.08em" }}>● MORT’S TRADING ADVICE</div>
      <div style={{ fontFamily: sign, fontSize: 108, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 14 }}>
        <span style={{ color: C.sign }}>Red</span> candle?
      </div>
      <div style={{ fontFamily: sign, fontSize: 108, lineHeight: 1, color: C.bulb, textShadow: shade }}>Grab the shovel.</div>
    </div>

    <div style={{ position: "absolute", left: 70, top: 312, width: 940, height: 470, borderRadius: 24, overflow: "hidden", background: `linear-gradient(180deg, ${C.plum}, ${C.nightDeep})`, border: `5px solid ${C.plumLine}` }}>
      <ScoopChart />
      <div style={{ position: "absolute", right: 34, top: 26, fontFamily: display, fontSize: 30, color: C.bulb, border: `4px dashed ${C.bulb}`, borderRadius: 12, padding: "4px 16px", rotate: "4deg" }}>
        SCOOP ZONE ↓
      </div>
      <div style={{ position: "absolute", left: 40, top: 26, fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.dust }}>$GRAVE · 1m</div>
      <div style={{ position: "absolute", right: 290, bottom: 26 }}>
        <MortEyes size={22} look={0.8} />
      </div>
    </div>

    {/* you vs Mort */}
    <div style={{ position: "absolute", left: 70, right: 70, top: 816, display: "flex", gap: 24 }}>
      <div style={{ flex: 1, borderRadius: 18, border: `3px solid ${C.plumLine}`, background: "rgba(42,24,56,0.6)", padding: "20px 24px" }}>
        <div style={{ fontFamily: display, fontSize: 24, color: C.dust }}>YOU</div>
        <div style={{ fontFamily: body, fontSize: 30, fontWeight: 700, lineHeight: 1.25, color: C.cream, marginTop: 8 }}>
          See red. Scoop cheap dirt.
        </div>
      </div>
      <div style={{ flex: 1.25, borderRadius: 18, background: C.ticket, border: `5px solid ${C.ink}`, padding: "20px 24px", color: C.ink, rotate: "1deg" }}>
        <div style={{ fontFamily: display, fontSize: 24, color: C.signDeep }}>MORT</div>
        <div style={{ fontFamily: body, fontSize: 28, fontWeight: 600, lineHeight: 1.25, marginTop: 8 }}>
          Scoops too. Same fee ETH, cheaper $GRAVE, <b>bigger grave.</b>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 70, right: 70, top: 1018, textAlign: "center", fontFamily: body, fontSize: 28, color: C.dust, lineHeight: 1.4 }}>
      Proof: grave #{best.n} was dug at the cheapest dirt so far.
      <br />
      <span style={{ fontFamily: mono, fontWeight: 700, color: C.cream }}>
        {best.eth.toFixed(4)} ETH → {fmt(best.tokens)} $GRAVE buried
      </span>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1140, textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 30, color: C.bulb }}>{fmt(burned)} $GRAVE ALREADY SCOOPED INTO 0x…dEaD</div>
      <div style={{ fontFamily: body, fontSize: 24, color: C.dustDim, marginTop: 14, fontStyle: "italic" }}>Not financial advice. Gravedigger advice.</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 27 · Dex paid: coming soon (Mort skipped the countdown) (1080×1350) ═════════ */
type DexSoonProps = { readonly graves: number; readonly burned: number; readonly date: string; readonly promised: number; readonly paid?: boolean };

export const PostDexSoon: React.FC<DexSoonProps> = ({ graves, burned, date, promised, paid = false }) => (
  <AbsoluteFill>
    <Night glow={0.9} />
    <Motes count={34} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 56, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, rotate: "-2deg" }}>
        <div style={{ width: 74, height: 74, borderRadius: "50%", background: C.plumLine, border: `4px solid ${C.rail}`, flexShrink: 0 }} />
        <div style={{ background: C.cream, color: C.ink, borderRadius: "8px 30px 30px 30px", padding: "16px 34px 20px", boxShadow: "0 18px 30px -16px rgba(0,0,0,0.8)" }}>
          <div style={{ fontFamily: body, fontSize: 22, color: C.ticketDim, fontWeight: 600 }}>anon · 2m · replying to $GRAVE</div>
          <div style={{ fontFamily: body, fontSize: 70, fontWeight: 700, lineHeight: 1.05 }}>dex paid?</div>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 100, right: 100, top: 262, rotate: "1deg" }}>
      <div style={{ background: C.ticket, color: C.ink, borderRadius: 18, border: `6px solid ${C.ink}`, padding: "28px 40px 30px", boxShadow: "0 30px 50px -24px rgba(0,0,0,0.9)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${C.ink}`, paddingBottom: 12 }}>
          <span style={{ fontFamily: display, fontSize: 32 }}>MORT’S PAY LEDGER</span>
          <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.ticketDim }}>{date}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", borderBottom: `2px dashed rgba(42,22,38,0.35)` }}>
          <span style={{ fontFamily: display, fontSize: 32 }}>DEXSCREENER</span>
          {paid ? (
            <span style={{ fontFamily: display, fontSize: 36, color: C.cream, background: "#3f7a0c", border: `4px solid ${C.ink}`, borderRadius: 10, padding: "4px 22px", rotate: "-6deg", boxShadow: "0 0 30px rgba(166,255,77,0.6)" }}>
              PAID ✓
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: display, fontSize: 30, color: C.ink, background: C.bulb, border: `4px solid ${C.ink}`, borderRadius: 10, padding: "4px 18px", rotate: "-5deg", boxShadow: `0 0 26px rgba(255,207,58,0.7)` }}>
              PROCESSING
              <span style={{ display: "flex", gap: 6 }}>
                {[1, 0.6, 0.3].map((o, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: C.ink, opacity: o }} />
                ))}
              </span>
            </span>
          )}
        </div>

        {/* every grave paid so far, one stone each */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "24px 0 18px", justifyContent: "center" }}>
          {new Array(graves).fill(0).map((_, i) => (
            <Headstone key={i} width={graves > 10 ? 54 : 64} height={84} shape={i % 3 === 1 ? 1 : 0} style={{ paddingTop: 22 }}>
              <div style={{ fontFamily: display, fontSize: 18 }}>#{i + 1}</div>
              <div style={{ fontFamily: display, fontSize: 20, color: "#3f7a0c" }}>✓</div>
            </Headstone>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: `2px dashed rgba(42,22,38,0.35)`, fontFamily: display, fontSize: 24, color: C.ticketDim }}>
          <span>{graves} GRAVES PAID ✓</span>
          <span>{pct(burned)} BURIED</span>
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 50, color: C.dust, textDecoration: "line-through", textDecorationColor: C.sign, textDecorationThickness: 6 }}>
        maybe after grave #{promised}
      </div>
      <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1.05, color: C.cream, textShadow: shade, marginTop: 26 }}>{paid ? "Mort couldn’t wait." : "Mort got impatient."}</div>
      {paid ? (
        <div style={{ fontFamily: sign, fontSize: 150, lineHeight: 1, color: C.slime, textShadow: `0 0 40px rgba(166,255,77,0.55), ${shade}`, marginTop: 26 }}>Dex paid. ✓</div>
      ) : (
        <>
          <div style={{ fontFamily: sign, fontSize: 116, lineHeight: 1, color: C.bulb, textShadow: `0 0 34px rgba(255,207,58,0.55), ${shade}`, marginTop: 18 }}>Dex paid:</div>
          <div style={{ fontFamily: sign, fontSize: 116, lineHeight: 1, color: C.bulb, textShadow: `0 0 34px rgba(255,207,58,0.55), ${shade}` }}>coming soon.</div>
        </>
      )}
      <div style={{ fontFamily: display, fontSize: 26, color: C.dust, marginTop: 26 }}>{fmt(burned)} $GRAVE IN 0x…dEaD</div>
      {paid ? (
        <div style={{ display: "inline-block", marginTop: 40, fontFamily: display, fontSize: 30, color: C.ink, background: C.ticket, border: `5px solid ${C.ink}`, borderRadius: 14, padding: "12px 28px", rotate: "-1.5deg" }}>
          LOGO UP · SOCIALS UP · GO FIND MORT
        </div>
      ) : null}
    </div>
    <div style={{ position: "absolute", right: 64, top: 1236 }}>
      <MortEyes size={24} grin />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 29 · R.I.P. "dex paid?" — Mort buries the question (1080×1350) ═════════ */
type RipProps = { readonly died: string; readonly graves: number; readonly burned: number; readonly next: number };

const Flower: React.FC<{ x: number; c: string; r?: number }> = ({ x, c, r = 0 }) => (
  <svg width={46} height={90} viewBox="0 0 46 90" style={{ position: "absolute", left: x, bottom: 0, rotate: `${r}deg`, transformOrigin: "50% 100%" }}>
    <path d="M23 88 V34" stroke="#4c8a12" strokeWidth="4" />
    <path d="M23 60 q-14 -4 -16 -16 q12 2 16 14" fill="#4c8a12" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={23} cy={22} rx={8} ry={14} fill={c} stroke={C.ink} strokeWidth="2.5" transform={`rotate(${a} 23 30)`} />
    ))}
    <circle cx={23} cy={30} r={6} fill={C.bulb} stroke={C.ink} strokeWidth="2.5" />
  </svg>
);

export const PostRipDexPaid: React.FC<RipProps> = ({ died, graves, burned, next }) => (
  <AbsoluteFill>
    <Night glow={0.85} glowY="55%" />
    <Motes count={40} />
    <div style={{ position: "absolute", top: 48, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 28, color: C.slime, letterSpacing: "0.08em" }}>● DEX PAID ✓ · {died}</div>
      <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.cream, textShadow: shade, marginTop: 14 }}>
        Mort buried
      </div>
      <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>one more thing.</div>
    </div>

    {/* the stone */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <Headstone width={600} height={660} shape={0} style={{ paddingTop: 150, boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
        <div style={{ fontFamily: display, fontSize: 40 }}>R.I.P.</div>
        <div style={{ fontFamily: body, fontSize: 30, fontWeight: 600, marginTop: 10 }}>here lies the question</div>
        <div style={{ fontFamily: body, fontSize: 92, fontWeight: 700, lineHeight: 1, marginTop: 22, letterSpacing: "-0.02em" }}>“dex paid?”</div>
        <div style={{ width: 380, height: 4, background: C.stoneInk, opacity: 0.35, marginTop: 34, borderRadius: 2 }} />
        <div style={{ fontFamily: body, fontSize: 28, marginTop: 26, lineHeight: 1.4 }}>
          asked in every reply.
          <br />
          answered once.
        </div>
        <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, marginTop: 26 }}>✝ {died}</div>
        <div style={{ fontFamily: display, fontSize: 22, marginTop: 12, color: "#3f5a1c" }}>CAUSE OF DEATH: DEX PAID ✓</div>
      </Headstone>
    </div>

    {/* flowers + dirt */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, height: 90 }}>
      <div style={{ position: "relative", width: 700, height: 90, margin: "0 auto" }}>
        <Flower x={40} c={C.sign} r={-8} />
        <Flower x={96} c={C.bulb} r={6} />
        <Flower x={560} c={C.slime} r={-6} />
        <Flower x={612} c={C.sign} r={10} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 960, height: 26, borderRadius: 13, background: "#5a3d2a", border: `4px solid ${C.ink}` }} />
    <div style={{ position: "absolute", right: 56, top: 912 }}>
      <MortEyes size={22} grin />
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 26, color: C.dust }}>
        {graves} GRAVES DUG · {fmt(burned)} $GRAVE ({pct(burned)}) IN 0x…dEaD
      </div>
      <div style={{ fontFamily: sign, fontSize: 52, lineHeight: 1.1, color: C.cream, textShadow: shade, marginTop: 30 }}>Next question:</div>
      <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>“wen grave #{next}?”</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 32 · "It's quiet… too quiet." Graveyard status right now (1080×1350) ═════════ */
type QuietProps = {
  readonly asOf: string;
  readonly graves: number;
  readonly burned: number;
  readonly lastBurial: string;
  readonly trades: number;
  readonly boxFill: number; // 0..1 toward the next ride's threshold
  readonly next: "burial" | "wages";
};

export const PostTooQuiet: React.FC<QuietProps> = ({ asOf, graves, burned, lastBurial, trades, boxFill, next }) => (
  <AbsoluteFill>
    <Night glow={0.55} />
    <Motes count={26} />
    <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 28, color: C.dust, letterSpacing: "0.08em" }}>● GRAVEYARD STATUS · {asOf}</div>
      <div style={{ fontFamily: sign, fontSize: 116, lineHeight: 1.02, color: C.cream, textShadow: shade, marginTop: 14 }}>It’s quiet…</div>
      <div style={{ fontFamily: sign, fontSize: 116, lineHeight: 1.02, color: C.bulb, textShadow: shade }}>too quiet.</div>
    </div>

    {/* the coin box meter */}
    <div style={{ position: "absolute", left: 70, top: 350, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ scale: "1.1", transformOrigin: "50% 0" }}>
        <Striker height={520} fill={boxFill} />
      </div>
      <div style={{ marginTop: 66, fontFamily: display, fontSize: 26, color: C.cream, textAlign: "center", lineHeight: 1.2 }}>
        COIN BOX
        <br />
        <span style={{ color: C.bulb, fontSize: 40 }}>{Math.round(boxFill * 100)}%</span>
      </div>
    </div>

    {/* Mort's night report */}
    <div style={{ position: "absolute", left: 300, right: 60, top: 360, rotate: "1.5deg" }}>
      <Ticket width={720} notch={20}>
        <div style={{ padding: "34px 44px 38px", fontFamily: mono, fontSize: 27 }}>
          <div style={{ fontFamily: sign, fontSize: 54, lineHeight: 1, textAlign: "center" }}>Mort’s Night Report</div>
          <div style={{ borderTop: "4px dashed rgba(42,22,38,0.35)", margin: "20px 0 6px" }} />
          <Line l="Graves dug" r={`${graves}`} />
          <Line l="$GRAVE buried" r={fmt(burned)} />
          <Line l="Share of supply" r={pct(burned)} />
          <Line l="Last burial" r={`${lastBurial} UTC`} />
          <Line l="Trades, last hour" r={`${trades}`} />
          <Line l="Dex" r="PAID ✓" color="#3f7a0c" />
          <div style={{ borderTop: "4px dashed rgba(42,22,38,0.35)", margin: "14px 0 6px" }} />
          <Line l="Next ride" r={next === "wages" ? "MORT’S WAGES" : "BURIAL"} color={C.signDeep} />
          <Line l="After that" r={next === "wages" ? `GRAVE #${graves + 1}` : `MORT’S WAGES`} />
        </div>
      </Ticket>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1106, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 58, color: C.cream, textShadow: shade }}>
        Quiet charts dig <span style={{ color: C.bulb }}>cheap graves.</span>
      </div>
      <div style={{ fontFamily: body, fontSize: 28, color: C.dust, marginTop: 14 }}>Mort is still on shift. The shovel never clocks out.</div>
    </div>
    <div style={{ position: "absolute", right: 70, top: 1236 }}>
      <MortEyes size={24} look={-0.7} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: display, fontSize: 26, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
  </AbsoluteFill>
);

/* ═════════ 34 · Death certificate for the buried supply (1080×1350) ═════════ */
type CertProps = { readonly burned: number; readonly graves: number; readonly date: string; readonly lastTx: string; readonly milestone: number };

const CertRow: React.FC<{ k: string; v: React.ReactNode; big?: boolean }> = ({ k, v, big }) => (
  <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", alignItems: "baseline", gap: 16, padding: "13px 0", borderBottom: "2px dashed rgba(42,22,38,0.28)" }}>
    <span style={{ fontFamily: display, fontSize: 19, color: C.ticketDim, letterSpacing: "0.04em" }}>{k}</span>
    <span style={{ fontFamily: big ? display : mono, fontSize: big ? 40 : 27, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{v}</span>
  </div>
);

export const PostDeathCert: React.FC<CertProps> = ({ burned, graves, date, lastTx, milestone }) => {
  const toGo = Math.max(0, (milestone / 100) * 1e9 - burned);
  return (
    <AbsoluteFill>
      <Night glow={0.75} />
      <Motes count={30} />
      <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1, color: C.cream, textShadow: shade }}>It’s official.</div>
        <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>They’re dead.</div>
      </div>

      <div style={{ position: "absolute", left: 80, right: 80, top: 250, rotate: "-1.2deg" }}>
        <div style={{ position: "relative", background: C.ticket, color: C.ink, borderRadius: 10, padding: "40px 52px 44px", boxShadow: "0 40px 60px -30px rgba(0,0,0,0.9)" }}>
          <div style={{ position: "absolute", inset: 12, border: `3px solid ${C.ink}`, borderRadius: 4, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 19, border: "1.5px solid rgba(42,22,38,0.45)", borderRadius: 3, pointerEvents: "none" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: display, fontSize: 18, letterSpacing: "0.18em", color: C.ticketDim }}>MORT’S GRAVEYARD · ROBINHOOD CHAIN</div>
            <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1.05, marginTop: 10 }}>Certificate of Death</div>
            <div style={{ fontFamily: mono, fontSize: 20, color: C.ticketDim, marginTop: 6 }}>No. {graves}-GRAVE · issued {date}</div>
          </div>
          <div style={{ marginTop: 22, borderTop: `3px solid ${C.ink}` }}>
            <CertRow k="DECEASED" v={`${fmt(burned)} $GRAVE`} big />
            <CertRow k="SHARE OF SUPPLY" v={pct(burned)} />
            <CertRow k="CAUSE OF DEATH" v="your trading fees" />
            <CertRow k="PLACE OF DEATH" v={DEAD_SHORT} />
            <CertRow k="BURIALS" v={`${graves}, every one on-chain`} />
            <CertRow k="LAST BURIAL TX" v={short(lastTx)} />
            <CertRow k="CHANCE OF RETURN" v={<span style={{ color: C.sign }}>0.00%</span>} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26 }}>
            <div>
              <div style={{ fontFamily: sign, fontSize: 46, lineHeight: 1, color: C.ink }}>Mort</div>
              <div style={{ width: 220, borderTop: `2px solid ${C.ink}`, marginTop: 4 }} />
              <div style={{ fontFamily: display, fontSize: 15, color: C.ticketDim, marginTop: 6, letterSpacing: "0.08em" }}>GRAVEDIGGER ON DUTY</div>
            </div>
          </div>
          {/* the stamp */}
          <div
            style={{
              position: "absolute",
              right: 58,
              bottom: 58,
              rotate: "-14deg",
              border: `6px solid ${C.sign}`,
              borderRadius: 14,
              padding: "10px 22px",
              color: C.sign,
              textAlign: "center",
              opacity: 0.92,
            }}
          >
            <div style={{ fontFamily: display, fontSize: 40, lineHeight: 1 }}>CERTIFIED</div>
            <div style={{ fontFamily: display, fontSize: 52, lineHeight: 1 }}>DEAD</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 28, color: C.cream }}>
          NEXT CERTIFICATE AT {milestone}% · <span style={{ color: C.bulb }}>{fmt(toGo)} $GRAVE TO GO</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center" }}>
        <MortEyes size={28} grin />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: display, fontSize: 24, color: C.dustDim }}>$GRAVE · GRAVEBURN.FUN</div>
    </AbsoluteFill>
  );
};
