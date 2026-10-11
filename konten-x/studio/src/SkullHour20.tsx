import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { body, C, display, mono, sign } from "./brand";
import { GraveMark, Motes } from "./parts";
import { Chair, Podium } from "./SkullSpeech";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type SkullHour20Props = { readonly hours: number; readonly burned: number; readonly graves: number };

/** The press-room screen: the buried counter rolls up, then the 5% stamp lands. */
const Screen: React.FC<{ f: number; burned: number; scale: number }> = ({ f, burned, scale }) => {
  const shown = interpolate(f, [70, 132], [0, burned], { ...clamp, easing: expo });
  const pct = (shown / 1e9) * 100;
  const stamp = interpolate(f, [150, 162], [0, 1], { ...clamp, easing: pop });
  return (
    <div style={{ width: 390, height: 270, borderRadius: 16, background: "#0e0714", border: `5px solid ${C.ink}`, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.9)", scale: `${scale}`, transformOrigin: "100% 0%", overflow: "hidden", position: "relative", padding: "16px 20px" }}>
      <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, color: C.dust }}>$GRAVE IN 0x…dEaD</div>
      <div style={{ fontFamily: display, fontSize: 40, color: C.cream, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{fmt(shown)}</div>
      <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.bulb, marginTop: 6 }}>{pct.toFixed(2)}% of supply</div>
      {/* the supply bar with the 5% line */}
      <div style={{ position: "relative", height: 22, marginTop: 22, borderRadius: 6, background: "#2a1838", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, pct * 12)}%`, background: C.sign }} />
        <div style={{ position: "absolute", left: "60%", top: -2, bottom: -2, width: 4, background: C.bulb }} />
      </div>
      <div style={{ position: "relative", height: 20, fontFamily: mono, fontSize: 14, fontWeight: 700, color: C.dustDim }}>
        <span style={{ position: "absolute", left: "60%", translate: "-50% 0" }}>5%</span><span style={{ position: "absolute", left: 0 }}>0%</span>
      </div>
      {stamp > 0 ? (
        <div style={{ position: "absolute", right: 18, bottom: 16, rotate: "-8deg", scale: `${2.2 - stamp * 1.2}`, opacity: stamp, border: `5px solid ${C.slime}`, borderRadius: 10, padding: "4px 14px", fontFamily: display, fontSize: 28, color: C.slime, background: "rgba(14,7,20,0.85)" }}>
          5% ✓
        </div>
      ) : null}
    </div>
  );
};

/* ═════════ 50 · Video: the Graveyard Reserve, hour 20 address (1080×1350, 14 s) ═════════ */
export const SkullHour20: React.FC<SkullHour20Props> = ({ hours, burned, graves }) => {
  const f = useCurrentFrame();
  const lines: [string, number, number][] = [
    ["hello everyone.", 18, 66],
    [`${hours} hours in.`, 74, 136],
    ["5% of the supply is six feet under.", 144, 214],
    [`${graves} burials. zero survivors.`, 222, 284],
    ["rates? we don't do rates. we dig.", 292, 350],
  ];
  const speaking = lines.some(([, a, b]) => f >= a && f < b - 8);
  const talk = speaking ? (Math.sin(f * 0.9) + 1) / 2 : 0.05;
  const look = f < 16 ? Math.sin(f / 5) * 0.8 : f >= 150 && f < 200 ? 1 : 0;
  const zoom = interpolate(f, [140, 156, 196, 214], [1, 1.4, 1.4, 1], { ...clamp, easing: expo });
  const flashAt = [4, 12, 150, 156, 164, 228];
  const flash = Math.max(...flashAt.map((a) => interpolate(f, [a, a + 2, a + 8], [0, 0.55, 0], clamp)));
  const scene = interpolate(f, [0, 6, 352, 366], [0, 1, 1, 0], clamp);
  const end = interpolate(f, [360, 376], [0, 1], clamp);
  const breaking = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: pop });

  const sub = (text: string, at: number, until: number) => {
    const o = interpolate(f, [at, at + 5, until - 6, until], [0, 1, 1, 0], clamp);
    const shown = text.slice(0, Math.round(interpolate(f, [at, at + text.length * 1.2], [0, text.length], clamp)));
    return o > 0 ? (
      <div key={text} style={{ position: "absolute", left: 50, right: 50, bottom: 236, textAlign: "center", opacity: o }}>
        <span style={{ display: "inline-block", background: "rgba(14,7,20,0.86)", padding: "12px 26px", borderRadius: 10, fontFamily: body, fontWeight: 700, fontSize: 46, color: C.cream }}>{shown}</span>
      </div>
    ) : null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
      <AbsoluteFill style={{ opacity: scene }}>
        <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #22163a 0 46px, #1a102e 46px 70px, #261843 70px 110px)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 38%, rgba(255,207,58,0.16), transparent 70%)" }} />
        <Motes count={22} />

        {/* the hook: breaking banner */}
        <div style={{ position: "absolute", left: 30, top: 40, scale: `${breaking}`, transformOrigin: "0 50%", display: "flex", alignItems: "stretch", boxShadow: "0 16px 30px -16px rgba(0,0,0,0.9)" }}>
          <div style={{ background: C.sign, padding: "10px 18px", fontFamily: display, fontSize: 30, color: C.cream }}>BREAKING</div>
          <div style={{ background: C.bulb, padding: "10px 18px", fontFamily: display, fontSize: 30, color: C.ink }}>HOUR {hours} ADDRESS</div>
        </div>

        <div style={{ position: "absolute", left: 120, top: 270 }}>
          <Chair talk={talk} look={look} />
        </div>
        <div style={{ position: "absolute", left: 100, top: 700 }}>
          <Podium />
        </div>

        <div style={{ position: "absolute", right: 30, top: 120 }}>
          <Screen f={f} burned={burned} scale={zoom} />
        </div>

        {/* lower third */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 110, display: "flex" }}>
          <div style={{ width: 150, background: C.sign, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 34, color: C.cream }}>
            <span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0.55 }}>● LIVE</span>
          </div>
          <div style={{ flex: 1, background: C.ticket, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
            <div style={{ fontFamily: display, fontSize: 30, color: C.ink }}>CHAIR OF THE GRAVEYARD RESERVE</div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, color: C.ticketDim }}>hour {hours} remarks on the $GRAVE supply</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 56, background: "#0e0714", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ whiteSpace: "nowrap", fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.bulb, translate: `${1080 - f * 7}px 0` }}>
            $GRAVE · HOUR {hours} · {graves} BURIALS · {fmt(burned)} $GRAVE IN 0x…dEaD · {((burned / 1e9) * 100).toFixed(2)}% OF SUPPLY BURIED · 5% MILESTONE: CLEARED · GRAVEBURN.FUN ·
          </div>
        </div>

        {lines.map(([t, a, b]) => sub(t, a, b))}

        <AbsoluteFill style={{ background: "#fffaf0", opacity: flash, pointerEvents: "none" }} />
        {flash > 0.2
          ? [0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 120 + random(`fx${Math.floor(f / 6)}${i}`) * 820, top: 1000 + random(`fy${i}`) * 80, width: 60, height: 60, borderRadius: "50%", background: "#fffaf0", filter: "blur(12px)" }} />
            ))
          : null}
      </AbsoluteFill>

      {/* end card */}
      <AbsoluteFill style={{ opacity: end, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ translate: `0 ${interpolate(f, [360, 384], [40, 0], { ...clamp, easing: expo })}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GraveMark size={170} glow />
          <div style={{ fontFamily: display, fontSize: 30, color: C.sign, marginTop: 30 }}>HOUR {hours}</div>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.cream, marginTop: 14 }}>The Graveyard Reserve</div>
          <div style={{ fontFamily: sign, fontSize: 84, lineHeight: 1.05, color: C.bulb }}>has spoken.</div>
          <div style={{ fontFamily: display, fontSize: 34, color: C.cream, marginTop: 40 }}>
            {graves} BURIALS · {fmt(burned)} $GRAVE
          </div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.slime, marginTop: 12 }}>{((burned / 1e9) * 100).toFixed(2)}% OF SUPPLY BURIED</div>
          <div style={{ fontFamily: display, fontSize: 26, color: C.dust, marginTop: 20 }}>monetary policy: dig.</div>
          <div style={{ fontFamily: display, fontSize: 30, color: C.dust, marginTop: 36 }}>GRAVEBURN.FUN</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
