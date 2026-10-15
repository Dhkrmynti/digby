/**
 * A press-conference parody: the chair of the "Canopy Reserve" (a sloth in a suit, no real person,
 * name or seal) steps up, says "Hello everyone.", and the screen behind fills with green candles.
 * The chart has no axis, prices or numbers: it is a meme, not a price claim.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SITE, TICKER, serif, type } from "./brand";
import { SlothHead, chip } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NAVY = "#1d2b4a";
const NAVY_D = "#131d33";
const GREEN = "#2fbf71";
const RED = "#d9534f";

/** The chair: a sloth in a dark suit with a tie, from the chest up. 300×300 box. */
function Chair({ eyes, mouth }: { eyes: "calm" | "wide"; mouth: number }) {
  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <g transform="translate(70 52) scale(1.6)">
        <SlothHead traits={[2, 0, eyes === "wide" ? 0 : 1, 0]} startled={eyes === "wide"} />
      </g>
      <path d="M30 300 C 30 220, 80 190, 150 190 C 220 190, 270 220, 270 300 Z" fill={NAVY_D} stroke={C.ink} strokeWidth="5" />
      <path d="M120 192 L150 250 L180 192 Z" fill="#faf6ea" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M150 204 L140 218 L150 290 L160 218 Z" fill="#b3402a" stroke={C.ink} strokeWidth="3.5" strokeLinejoin="round" />
      {/* the mouth opens while he talks */}
      {mouth > 0 ? <ellipse cx="150" cy="166" rx={9} ry={3 + mouth * 7} fill={C.ink} /> : null}
    </svg>
  );
}

/** The screen: candles, red then a green run that leaves the top. `k` (0..1) is how much has printed. */
function Candles({ k, w, h }: { k: number; w: number; h: number }) {
  const N = 22;
  const cw = w / N;
  let close = h * 0.62;
  const bars = Array.from({ length: N }, (_, i) => {
    const open = close;
    const up = i >= 6;
    // a small dip, then each green candle bigger than the last
    const move = up ? -(h * 0.03 + (i - 6) * h * 0.012) : h * (0.02 + ((i * 7) % 5) * 0.006) * (i % 3 === 1 ? -0.5 : 1);
    close = open + move;
    const hi = Math.min(open, close) - h * 0.02;
    const lo = Math.max(open, close) + h * 0.02;
    return { i, open, close, hi, lo, up: close < open };
  });
  const shown = Math.floor(k * N);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "hidden" }}>
      <rect width={w} height={h} fill="#0d1424" />
      {[0.2, 0.4, 0.6, 0.8].map((y) => (
        <path key={y} d={`M0 ${h * y} H${w}`} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" />
      ))}
      {bars.slice(0, shown + 1).map((b) => {
        const grow = b.i === shown ? (k * N) % 1 : 1;
        const top = Math.min(b.open, b.close);
        const body = Math.max(6, Math.abs(b.close - b.open)) * grow;
        const x = b.i * cw + cw * 0.2;
        const col = b.up ? GREEN : RED;
        return (
          <g key={b.i}>
            <path d={`M${x + cw * 0.3} ${b.hi} V${b.lo}`} stroke={col} strokeWidth="3" />
            <rect x={x} y={b.up ? b.open - body : top} width={cw * 0.6} height={body} fill={col} />
          </g>
        );
      })}
    </svg>
  );
}

/* ═════════ Clip (1080×1350, 10 s): "Hello everyone." → the candles go green ═════════ */
export const HangFedClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const say = "Hello everyone.";
  const typed = Math.floor(interpolate(frame, [40, 85], [0, say.length], clamp));
  const talking = frame >= 40 && frame < 95;
  const mouth = talking ? Math.abs(Math.sin(frame * 0.9)) : 0;
  const k = interpolate(frame, [110, 230], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const wide = frame > 175;
  const shake = frame > 200 && frame < 260 ? Math.sin(frame * 2.3) * 4 : 0;
  const flash = [20, 33, 52, 97, 140, 180, 205].some((f) => frame >= f && frame < f + 3);
  const end = spring({ frame: frame - 250, fps, config: { damping: 12, stiffness: 140 } });
  const zoom = interpolate(frame, [100, 240], [1, 1.06], clamp);

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${shake}px)` }}>
        {/* the backdrop curtain and the screen */}
        <AbsoluteFill style={{ background: `repeating-linear-gradient(90deg, ${NAVY} 0 60px, #22335a 60px 120px)` }} />
        <div style={{ position: "absolute", left: 120, top: 120, border: `8px solid ${C.ink}`, boxShadow: "0 0 0 6px #3a4b72" }}>
          <Candles k={k} w={824} h={470} />
          <p style={{ position: "absolute", left: 18, top: 12, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 30, color: "#cfe8d8" }}>{TICKER}</p>
          {k > 0.85 ? <p style={{ position: "absolute", right: 18, top: 10, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 34, color: GREEN }}>▲▲▲</p> : null}
        </div>

        {/* the podium with its microphones */}
        <div style={{ position: "absolute", left: 330, top: 540, transform: "scale(1.4)", transformOrigin: "50% 100%" }}>
          <Chair eyes={wide ? "wide" : "calm"} mouth={mouth} />
        </div>
        <svg viewBox="0 0 600 140" width={600} height={140} style={{ position: "absolute", left: 240, top: 790 }}>
          {[230, 300, 370].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 140 L${x + (i - 1) * 18} 40`} stroke="#2a2a2a" strokeWidth="7" strokeLinecap="round" />
              <rect x={x + (i - 1) * 18 - 11} y="18" width="22" height="34" rx="10" fill="#3b3b3b" stroke={C.ink} strokeWidth="3" />
            </g>
          ))}
        </svg>
        <div style={{ position: "absolute", left: 220, right: 220, top: 900, height: 420, background: "#5a3a22", border: `6px solid ${C.ink}`, borderBottom: "none" }}>
          <div style={{ margin: "40px auto 0", width: 300, height: 140, borderRadius: "50%", border: `5px solid ${C.mango}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ margin: 0, fontFamily: serif, fontWeight: 900, fontSize: 34, lineHeight: 1.05, textAlign: "center", color: C.mango }}>
              CANOPY
              <br />
              RESERVE
            </p>
          </div>
          <p style={{ margin: "26px 0 0", textAlign: "center", fontFamily: type, fontSize: 24, color: "#e8d7c0" }}>the chair · press briefing</p>
        </div>

        {/* "Hello everyone." */}
        {typed > 0 ? (
          <div style={{ position: "absolute", left: 640, top: 600, background: "#faf6ea", border: `5px solid ${C.ink}`, borderRadius: 26, padding: "14px 26px", boxShadow: `6px 6px 0 ${C.ink}`, opacity: frame < 105 ? 1 : interpolate(frame, [105, 115], [1, 0], clamp) }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap" }}>{say.slice(0, typed)}</p>
          </div>
        ) : null}
      </AbsoluteFill>

      {/* camera flashes */}
      {flash ? <AbsoluteFill style={{ background: "#ffffff", opacity: 0.55 }} /> : null}

      {/* the close */}
      {frame > 250 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 40 }}>
          <div style={{ transform: `scale(${end}) rotate(-3deg)` }}>
            <p style={{ ...chip(44, GREEN, C.ink), border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}` }}>{TICKER} · {SITE}</p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 30, bottom: 16, margin: 0, fontFamily: type, fontSize: 18, color: "#c7d0e6", opacity: 0.8 }}>parody · not a real central bank · not a real price chart</p>
    </AbsoluteFill>
  );
};

/* ═════════ Burn briefing (1080×1350, 12 s): "Hello everyone." → the screen shows this round's burn ═════════ */
export type BriefingProps = { round: number; burnNo: number; burned: number; before: number; total: number; supply: number; eth: string; burnTx: string; when: string };

export const BRIEFING_R7: BriefingProps = {
  round: 7,
  burnNo: 4,
  burned: 3378332.553,
  before: 9584618.448,
  total: 12962951.001,
  supply: 1_000_000_000,
  eth: "0.0102",
  burnTx: "0xd226f2119cb51a06f1caaf3591ce583e47567649d19befbf309aac27b59ccafc",
  when: "14 Oct 2026 · 10:55 UTC",
};

const floorFmt = (n: number) => Math.floor(n).toLocaleString("en-US");

export const HangFedBurn: React.FC<BriefingProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const say = "Hello everyone.";
  const typed = Math.floor(interpolate(frame, [40, 85], [0, say.length], clamp));
  const talking = (frame >= 40 && frame < 95) || (frame >= 205 && frame < 250);
  const mouth = talking ? Math.abs(Math.sin(frame * 0.9)) : 0;
  const k = interpolate(frame, [110, 200], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const kt = interpolate(frame, [210, 260], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = [20, 33, 52, 97, 150, 200, 262].some((f) => frame >= f && frame < f + 3);
  const end = spring({ frame: frame - 290, fps, config: { damping: 12, stiffness: 140 } });
  const pct = ((p.before + (p.total - p.before) * kt) / p.supply) * 100;
  const shake = frame > 120 && frame < 200 ? Math.sin(frame * 2.1) * 3 : 0;

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", fontFamily: serif }}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(90deg, ${NAVY} 0 60px, #22335a 60px 120px)` }} />

      {/* the screen: the fire, and this round's count */}
      <div style={{ position: "absolute", left: 120, top: 110, width: 824, height: 470, background: "#0d1424", border: `8px solid ${C.ink}`, boxShadow: "0 0 0 6px #3a4b72", overflow: "hidden", transform: `translateX(${shake}px)` }}>
        <p style={{ position: "absolute", left: 18, top: 12, margin: 0, fontFamily: type, fontWeight: 700, fontSize: 28, color: "#cfe8d8" }}>
          {TICKER} · round #{p.round} · burn
        </p>
        {frame >= 110 ? (
          <>
            {/* tokens dropping into the fire */}
            {Array.from({ length: 8 }, (_, i) => {
              const t = interpolate(frame, [115 + i * 9, 140 + i * 9], [0, 1], clamp);
              if (t <= 0 || t >= 1) return null;
              return (
                <p key={i} style={{ position: "absolute", left: 120 + ((i * 61) % 200), top: 60 + t * 300, margin: 0, transform: `rotate(${t * 360}deg)`, ...chip(20, C.mango) }}>
                  {TICKER}
                </p>
              );
            })}
            <div style={{ position: "absolute", left: 90, top: 150 }}>
              <svg viewBox="0 0 120 120" width={290} height={290}>
                <g transform={`translate(60 104) scale(${(1 + k * 0.4) * (1 + Math.sin(frame / 4) * 0.04)} ${(1 + k * 0.4) * (1 + Math.cos(frame / 5) * 0.06)}) translate(-60 -104)`}>
                  <path d="M60 104 C 30 100, 26 70, 40 52 C 42 64, 48 66, 50 58 C 48 40, 56 24, 66 14 C 66 32, 78 38, 82 52 C 86 46, 88 40, 86 34 C 100 50, 100 96, 60 104 Z" fill="#e8541a" stroke={C.ink} strokeWidth="3" />
                  <path d="M60 102 C 44 98, 42 80, 50 70 C 52 78, 56 80, 58 74 C 58 62, 64 54, 70 48 C 70 60, 78 66, 78 78 C 80 90, 72 100, 60 102 Z" fill={C.mango} />
                  <path d="M60 100 C 54 98, 52 90, 56 84 C 58 88, 60 88, 62 84 C 64 90, 66 96, 60 100 Z" fill={C.flame} />
                </g>
                <path d="M18 106 L102 92" stroke={C.ink} strokeWidth="13" strokeLinecap="round" />
                <path d="M18 106 L102 92" stroke={C.bark} strokeWidth="8" strokeLinecap="round" />
                <path d="M22 92 L100 108" stroke={C.ink} strokeWidth="13" strokeLinecap="round" />
                <path d="M22 92 L100 108" stroke="#8a6644" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ position: "absolute", left: 420, top: 120, width: 380 }}>
              <p style={{ margin: 0, fontFamily: type, fontSize: 22, color: "#9fb0cf", textTransform: "uppercase" }}>burned this round</p>
              <p style={{ margin: "4px 0 0", fontWeight: 900, fontSize: 64, lineHeight: 1, color: C.mango }}>{floorFmt(p.burned * k)}</p>
              <p style={{ margin: "4px 0 0", fontFamily: type, fontSize: 22, color: "#cfd8ea" }}>
                {TICKER} for {p.eth} ETH of fees
              </p>
              {frame >= 205 ? (
                <>
                  <p style={{ margin: "26px 0 0", fontFamily: type, fontSize: 22, color: "#9fb0cf", textTransform: "uppercase" }}>on the fire, all rounds</p>
                  <p style={{ margin: "4px 0 0", fontWeight: 900, fontSize: 52, lineHeight: 1, color: "#faf6ea" }}>{floorFmt(p.before + (p.total - p.before) * kt)}</p>
                  <p style={{ margin: "4px 0 0", fontFamily: type, fontSize: 22, color: "#cfd8ea" }}>{pct.toFixed(2)}% of supply</p>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {/* the chair at the podium */}
      <div style={{ position: "absolute", left: 330, top: 540, transform: "scale(1.4)", transformOrigin: "50% 100%" }}>
        <Chair eyes={frame > 160 && frame < 205 ? "wide" : "calm"} mouth={mouth} />
      </div>
      <svg viewBox="0 0 600 140" width={600} height={140} style={{ position: "absolute", left: 240, top: 790 }}>
        {[230, 300, 370].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 140 L${x + (i - 1) * 18} 40`} stroke="#2a2a2a" strokeWidth="7" strokeLinecap="round" />
            <rect x={x + (i - 1) * 18 - 11} y="18" width="22" height="34" rx="10" fill="#3b3b3b" stroke={C.ink} strokeWidth="3" />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 220, right: 220, top: 900, height: 420, background: "#5a3a22", border: `6px solid ${C.ink}`, borderBottom: "none" }}>
        <div style={{ margin: "40px auto 0", width: 300, height: 140, borderRadius: "50%", border: `5px solid ${C.mango}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 34, lineHeight: 1.05, textAlign: "center", color: C.mango }}>
            CANOPY
            <br />
            RESERVE
          </p>
        </div>
        <p style={{ margin: "26px 0 0", textAlign: "center", fontFamily: type, fontSize: 24, color: "#e8d7c0" }}>burn briefing · round #{p.round}</p>
        <p style={{ margin: "8px 0 0", textAlign: "center", fontFamily: type, fontSize: 20, color: "#bfae98" }}>{p.when}</p>
      </div>

      {/* what he says */}
      {typed > 0 && frame < 110 ? (
        <div style={{ position: "absolute", left: 640, top: 600, background: "#faf6ea", border: `5px solid ${C.ink}`, borderRadius: 26, padding: "14px 26px", boxShadow: `6px 6px 0 ${C.ink}` }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap" }}>{say.slice(0, typed)}</p>
        </div>
      ) : null}
      {frame >= 205 && frame < 290 ? (
        <div style={{ position: "absolute", left: 560, top: 620, background: "#faf6ea", border: `5px solid ${C.ink}`, borderRadius: 26, padding: "12px 22px", boxShadow: `6px 6px 0 ${C.ink}`, transform: `scale(${spring({ frame: frame - 205, fps, config: { damping: 12 } })})` }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: 36, color: C.ink, whiteSpace: "nowrap" }}>Burn #{p.burnNo}. No questions.</p>
        </div>
      ) : null}

      {flash ? <AbsoluteFill style={{ background: "#ffffff", opacity: 0.55 }} /> : null}

      {/* the close */}
      {frame >= 290 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(19,29,51,${0.9 * end})` }}>
          <div style={{ transform: `scale(${end})`, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 70, lineHeight: 1.05, color: "#faf6ea" }}>
              "Hello everyone.
              <br />
              We burned {floorFmt(p.burned)} {TICKER}."
            </p>
            <p style={{ margin: "24px 0 0", fontFamily: type, fontWeight: 700, fontSize: 30, color: C.mango }}>
              round #{p.round} · burn #{p.burnNo} · {floorFmt(p.total)} on the fire
            </p>
            <p style={{ margin: "14px 0 0", fontFamily: type, fontSize: 22, color: "#9fb0cf" }}>
              proof: {p.burnTx.slice(0, 12)}…{p.burnTx.slice(-6)} → 0x…dEaD
            </p>
            <p style={{ ...chip(34), marginTop: 26 }}>
              {TICKER} · {SITE}
            </p>
          </div>
        </AbsoluteFill>
      ) : null}
      <p style={{ position: "absolute", left: 30, bottom: 16, margin: 0, fontFamily: type, fontSize: 18, color: "#c7d0e6", opacity: 0.8 }}>parody · not a real central bank · every number is on chain</p>
    </AbsoluteFill>
  );
};
