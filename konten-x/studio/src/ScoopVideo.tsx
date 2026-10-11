import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { Coin, GraveMark, Headstone, MortEyes, Motes, Night } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const scene = (f: number, from: number, to: number) => interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);

export type Buyback = { readonly n: number; readonly time: string; readonly tokens: number; readonly eth: number };
type ScoopVideoProps = {
  readonly buybacks: Buyback[]; // one per grave, oldest first
  readonly dip: number; // index of the grave bought right after the biggest red candle
  readonly burned: number;
  readonly trades: number; // swaps in the last hour
  readonly asOf: string;
};

/** ETH Mort paid per 1M $GRAVE: his real buyback price. */
const price = (b: Buyback) => (b.eth / b.tokens) * 1e6;
const rate = (b: Buyback) => b.tokens / b.eth / 1e6; // M $GRAVE per ETH

const BuybackCandles: React.FC<{ data: Buyback[]; dip: number; f: number; from: number }> = ({ data, dip, f, from }) => {
  const W = 940, H = 520, padY = 50;
  const ps = data.map(price);
  const lo = Math.min(...ps) * 0.85, hi = Math.max(...ps) * 1.08;
  const y = (v: number) => padY + (1 - (v - lo) / (hi - lo)) * (H - padY * 2);
  const step = (W - 80) / (data.length - 1);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${padY + i * ((H - padY * 2) / 3)} H${W}`} stroke={C.plumLine} strokeWidth="2" strokeDasharray="6 10" />
      ))}
      {data.slice(1).map((b, k) => {
        const i = k + 1;
        const at = from + k * 6;
        const g = interpolate(f, [at, at + 8], [0, 1], { ...clamp, easing: expo });
        const o = ps[i - 1], c = ps[i];
        const red = c < o;
        const x = 40 + i * step - 18;
        const top = y(Math.max(o, c)), bot = y(Math.min(o, c));
        const h = Math.max(8, bot - top) * g;
        const isDip = i === dip;
        return (
          <g key={i} opacity={g > 0 ? 1 : 0}>
            <path d={`M${x + 18} ${top - 14} V${top + Math.max(8, bot - top) + 14}`} stroke={red ? C.sign : C.slime} strokeWidth="4" opacity={g} />
            <rect x={x} y={red ? top : bot - h} width={36} height={h} rx="5" fill={red ? C.sign : C.slime} stroke={C.ink} strokeWidth="3" />
            {isDip ? <rect x={x - 14} y={top - 28} width={64} height={bot - top + 56} rx="12" fill="none" stroke={C.bulb} strokeWidth="4" strokeDasharray="8 8" opacity={interpolate(f, [at + 12, at + 20], [0, 1], clamp)} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

/* ═════════ 31 · Video: red candle = scoop time, on Mort's real buybacks (1080×1350, 16 s) ═════════ */
export const ScoopVideo: React.FC<ScoopVideoProps> = ({ buybacks, dip, burned, trades, asOf }) => {
  const f = useCurrentFrame();
  const before = buybacks[dip - 1];
  const after = buybacks[dip];
  const drop = (1 - price(after) / price(before)) * 100;
  const more = rate(after) / rate(before);

  // A · hook: a red candle crashes in
  const a = scene(f, 0, 84);
  const fall = interpolate(f, [4, 22], [-700, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shake = f >= 22 && f < 36 ? Math.sin(f * 2.4) * 12 : 0;
  const flash = interpolate(f, [22, 24, 38], [0, 0.28, 0], clamp);
  const slam = (at: number) => ({
    opacity: interpolate(f, [at, at + 3], [0, 1], clamp),
    scale: `${interpolate(f, [at, at + 10], [1.8, 1], { ...clamp, easing: expo })}`,
  });

  // B · the real buyback chart
  const b = scene(f, 80, 236);

  // C · before vs after the dip
  const c = scene(f, 232, 372);

  // D · end card
  const d = interpolate(f, [366, 380], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <Night glow={0.7} glowY={f > 232 ? "50%" : "0%"} />
      <Motes count={36} />

      {/* ── A ── */}
      <AbsoluteFill style={{ opacity: a, translate: `${shake}px 0` }}>
        <div style={{ position: "absolute", left: 470, top: 380 + fall, width: 140, height: 460, borderRadius: 16, background: C.sign, border: `6px solid ${C.ink}`, boxShadow: "0 0 60px rgba(215,38,61,0.6)" }}>
          <div style={{ position: "absolute", left: 64, top: -90, width: 8, height: 90, background: C.sign }} />
          <div style={{ position: "absolute", left: 64, bottom: -110, width: 8, height: 110, background: C.sign }} />
        </div>
        <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: 130, lineHeight: 1, color: C.sign, ...slam(26) }}>RED CANDLE?</div>
        </div>
        <div style={{ position: "absolute", top: 1030, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: sign, fontSize: 64, lineHeight: 1.05, color: C.dust, textShadow: shade, ...slam(42) }}>Most people panic.</div>
          <div style={{ fontFamily: sign, fontSize: 80, lineHeight: 1.05, color: C.bulb, textShadow: shade, whiteSpace: "nowrap", ...slam(56) }}>Mort grabs the shovel.</div>
        </div>
        <AbsoluteFill style={{ background: C.sign, opacity: flash, mixBlendMode: "screen" }} />
      </AbsoluteFill>

      {/* ── B ── */}
      <AbsoluteFill style={{ opacity: b }}>
        <div style={{ position: "absolute", top: 70, left: 70, right: 70 }}>
          <div style={{ fontFamily: display, fontSize: 28, color: C.sign }}>● REAL DATA · {asOf}</div>
          <div style={{ fontFamily: sign, fontSize: 76, lineHeight: 1.05, color: C.cream, textShadow: shade, marginTop: 12 }}>The price Mort paid,</div>
          <div style={{ fontFamily: sign, fontSize: 76, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>grave by grave.</div>
        </div>
        <div style={{ position: "absolute", left: 70, top: 380, width: 940, height: 520, borderRadius: 24, overflow: "hidden", background: `linear-gradient(180deg, ${C.plum}, ${C.nightDeep})`, border: `5px solid ${C.plumLine}` }}>
          <BuybackCandles data={buybacks} dip={dip} f={f} from={96} />
          <div style={{ position: "absolute", left: 24, top: 16, fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.dust }}>ETH per 1M $GRAVE · {buybacks.length} buybacks</div>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 930, display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.dust }}>
          <span>{buybacks[0].time}</span>
          <span>{buybacks[buybacks.length - 1].time} UTC</span>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 1010, textAlign: "center", opacity: interpolate(f, [176, 188], [0, 1], clamp) }}>
          <div style={{ fontFamily: display, fontSize: 46, color: C.bulb }}>
            BIGGEST RED CANDLE: −{drop.toFixed(0)}%
          </div>
          <div style={{ fontFamily: body, fontSize: 32, color: C.cream, marginTop: 12 }}>
            between grave #{before.n} and grave #{after.n}. Watch what Mort did.
          </div>
        </div>
      </AbsoluteFill>

      {/* ── C ── */}
      <AbsoluteFill style={{ opacity: c }}>
        <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.cream, textShadow: shade }}>Same shovel.</div>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb, textShadow: shade }}>Cheaper dirt.</div>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 330, height: 560, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
          {[before, after].map((g, i) => {
            const at = 250 + i * 34;
            const up = interpolate(f, [at, at + 22], [500, 0], { ...clamp, easing: expo });
            const h = i === 0 ? 380 : 540;
            return (
              <div key={i} style={{ translate: `0 ${up}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: display, fontSize: 26, color: i ? C.sign : C.dust, marginBottom: 12 }}>{i ? "AFTER THE RED CANDLE" : "BEFORE"}</div>
                <Headstone width={380} height={h} shape={i ? 0 : 1} style={{ paddingTop: i ? 120 : 60 }}>
                  <div style={{ fontFamily: display, fontSize: 30 }}>GRAVE #{g.n}</div>
                  <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, marginTop: 6 }}>{g.time} UTC</div>
                  <div style={{ fontFamily: display, fontSize: i ? 58 : 46, lineHeight: 1, marginTop: 22 }}>{fmt(g.tokens)}</div>
                  <div style={{ fontFamily: display, fontSize: 26, marginTop: 6 }}>$GRAVE</div>
                  <div style={{ fontFamily: body, fontSize: 24, fontWeight: 600, marginTop: 18 }}>for {g.eth.toFixed(4)} ETH</div>
                  <div style={{ fontFamily: display, fontSize: 24, marginTop: 10, color: i ? "#3f5a1c" : C.stoneInk }}>{Math.round(rate(g))}M PER ETH</div>
                </Headstone>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 886, height: 26, borderRadius: 13, background: "#5a3d2a", border: `4px solid ${C.ink}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: interpolate(f, [300, 312], [0, 1], clamp) }}>
          <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1, color: C.slime, scale: `${interpolate(f, [300, 314], [0.5, 1], { ...clamp, easing: pop })}` }}>
            {more.toFixed(2)}× MORE
          </div>
          <div style={{ fontFamily: display, fontSize: 36, color: C.cream, marginTop: 10 }}>$GRAVE PER ETH, STRAIGHT INTO 0x…dEaD</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", gap: 18, opacity: interpolate(f, [316, 326], [0, 1], clamp) }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ translate: `0 ${Math.sin((f + i * 8) / 6) * 8}px` }}>
              <Coin size={56} kind="grave" />
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* ── D ── */}
      <AbsoluteFill style={{ opacity: d, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ translate: `0 ${interpolate(f, [366, 390], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MortEyes size={40} grin />
          <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, textShadow: shade, marginTop: 40 }}>
            <span style={{ color: C.sign }}>Red</span> candle?
          </div>
          <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.bulb, textShadow: shade }}>Grab the shovel.</div>
          <div style={{ fontFamily: display, fontSize: 32, color: C.cream, marginTop: 44 }}>
            {buybacks.length} GRAVES · {fmt(burned)} $GRAVE ({((burned / 1e9) * 100).toFixed(2)}%) BURIED
          </div>
          <div style={{ fontFamily: display, fontSize: 28, color: C.dust, marginTop: 12 }}>{trades} TRADES IN THE LAST HOUR · DEX PAID ✓</div>
          <div style={{ fontFamily: body, fontSize: 26, color: C.dustDim, marginTop: 30, fontStyle: "italic" }}>Not financial advice. Gravedigger advice.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
            <GraveMark size={52} />
            <span style={{ fontFamily: display, fontSize: 30, color: C.dust }}>GRAVEBURN.FUN</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
