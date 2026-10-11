import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame } from "remotion";
import { body, C, DEAD, DEAD_SHORT, display, sign } from "./brand";
import { Arch, Coin, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, SignBoard, Striker, Track, Tunnel, WageTin } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expo = Easing.bezier(0.16, 1, 0.3, 1);
const shade = "0 5px 0 rgba(42,22,38,0.55)";

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], clamp) }}>{children}</AbsoluteFill>;
};

const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: interpolate(f, [at, at + 12], [0, 1], clamp), translate: `0 ${interpolate(f, [at, at + 22], [50, 0], { ...clamp, easing: expo })}px`, ...style }}>
      {children}
    </div>
  );
};

/** Step caption: big sign line, top-left. */
const Caption: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <div style={{ position: "absolute", left: 130, top: 110, width: 900 }}>
    <Rise at={4}>
      <div style={{ fontFamily: display, fontSize: 40, color: C.bulb }}>{n}</div>
    </Rise>
    <Rise at={10}>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1.02, color: C.cream, textShadow: shade }}>{children}</div>
    </Rise>
  </div>
);

/* 1 · The marquee lights up */
const Marquee: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Fade dur={dur}>
      <Night glow={interpolate(f, [0, 40], [0.2, 1], clamp)} />
      <Arch width={1700} height={620} style={{ position: "absolute", left: 110, top: 110 }} lit={interpolate(f, [0, 34], [0, 1], clamp)} chase={(f / 10) % 3 / 3}>
        <div style={{ textAlign: "center", paddingTop: 210 }}>
          <Rise at={18}>
            <div style={{ fontFamily: sign, fontSize: 150, lineHeight: 1, color: C.cream, textShadow: shade }}>Mort’s Ghost Train</div>
          </Rise>
          <Rise at={40}>
            <div style={{ fontFamily: display, fontSize: 58, color: C.bulb, marginTop: 30, textShadow: "0 0 24px rgba(255,207,58,0.5)" }}>EVERY TRADE DIGS A GRAVE.</div>
          </Rise>
        </div>
      </Arch>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, bottom: 0, background: C.plum }} />
    </Fade>
  );
};

/* 2 · Meet Mort */
const MeetMort: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Fade dur={dur}>
      <Night glow={0.4} />
      <Motes count={40} />
      <div style={{ position: "absolute", left: 1040, top: 150 }}>
        <Tunnel width={720} open={interpolate(f, [10, 50], [0, 0.6], { ...clamp, easing: expo })}>
          <div style={{ opacity: interpolate(f, [40, 60], [0, 1], clamp) }}>
            <MortEyes size={66} look={Math.sin(f / 18) * 0.7} blink={f > 92 && f < 98} />
          </div>
        </Tunnel>
      </div>
      <div style={{ position: "absolute", left: 130, top: 300, width: 820 }}>
        <Rise at={20}>
          <div style={{ fontFamily: sign, fontSize: 150, lineHeight: 1, color: C.cream, textShadow: shade }}>Meet Mort.</div>
        </Rise>
        <Rise at={36}>
          <div style={{ fontFamily: body, fontSize: 46, lineHeight: 1.35, color: C.dust, marginTop: 30 }}>
            He keeps a graveyard under Robinhood Chain. You’ll only ever see his eyes.
          </div>
        </Rise>
      </div>
    </Fade>
  );
};

/* 3 · Trades fill the coin box */
const CoinBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const drops = [20, 38, 56, 74, 92];
  const landed = drops.filter((d) => f >= d + 16).length;
  const fill = landed / drops.length;
  return (
    <Fade dur={dur}>
      <Night glow={0.5 + fill * 0.5} />
      <Caption n="01">Every trade drops a coin in Mort’s box.</Caption>
      {drops.map((d, i) => {
        const p = interpolate(f, [d, d + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        return (
          <div key={i} style={{ position: "absolute", left: 1330 + (i % 2 ? 40 : -40), top: interpolate(p, [0, 1], [-120, 520]), opacity: f >= d && f < d + 17 ? 1 : 0 }}>
            <Coin size={90} kind="eth" />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1250, top: 520, width: 260, height: 220, borderRadius: 18, background: C.plum, border: `6px solid ${C.cream}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: C.bulb, transition: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 34, color: C.ink }}>COINS</div>
      </div>
      <div style={{ position: "absolute", left: 1640, top: 260 }}>
        <Striker height={560} fill={fill} ring={fill >= 1} />
      </div>
      <Rise at={110} style={{ position: "absolute", left: 130, top: 640 }}>
        <div style={{ fontFamily: display, fontSize: 64, color: C.bulb }}>DING! THE BOX IS FULL.</div>
      </Rise>
    </Fade>
  );
};

/* 4 · Claim and buy back */
const BuyBack: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const eth = interpolate(f, [20, 55], [980, 1300], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Fade dur={dur}>
      <Night glow={0.7} />
      <Caption n="02">Mort’s bot claims it and buys $GRAVE.</Caption>
      <div style={{ position: "absolute", left: eth, top: 560, opacity: f < 56 ? 1 : 0 }}>
        <Coin size={130} kind="eth" />
      </div>
      <SignBoard style={{ position: "absolute", left: 1330, top: 470, width: 200, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: display, fontSize: 40, rotate: "-90deg", whiteSpace: "nowrap" }}>BUY-BACK</div>
      </SignBoard>
      {new Array(6).fill(0).map((_, i) => {
        const s = 58 + i * 6;
        const p = interpolate(f, [s, s + 24], [0, 1], { ...clamp, easing: expo });
        return (
          <div key={i} style={{ position: "absolute", left: interpolate(p, [0, 1], [1380, 1580 + (i % 3) * 100]), top: interpolate(p, [0, 1], [600, 480 + Math.floor(i / 3) * 120]), opacity: p > 0 ? 1 : 0 }}>
            <Coin size={100} />
          </div>
        );
      })}
      <Rise at={30} style={{ position: "absolute", left: 130, top: 600, width: 900 }}>
        <div style={{ fontFamily: body, fontSize: 42, lineHeight: 1.4, color: C.dust }}>No buttons. A bot runs the ride 24/7, on the Pons curve and on Uniswap v4 after graduation.</div>
      </Rise>
    </Fade>
  );
};

/* 5 · The burial */
const Burial: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sink = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const rise = interpolate(f, [60, 95], [1, 0], { ...clamp, easing: expo });
  return (
    <Fade dur={dur}>
      <Night glow={0.6} />
      <Caption n="03">Then he buries it.</Caption>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 1270 + i * 120, top: 420 + sink * 420, opacity: 1 - sink }}>
          <Coin size={100} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 1150, right: 120, top: 860, height: 26, borderRadius: 13, background: C.nightDeep }} />
      <div style={{ position: "absolute", left: 1300, top: 460, translate: `0 ${rise * 420}px`, clipPath: "inset(0 0 0 0)" }}>
        <Headstone width={320} height={400} shape={0} style={{ paddingTop: 120 }}>
          <div style={{ fontFamily: display, fontSize: 34 }}>HERE LIES</div>
          <div style={{ fontFamily: display, fontSize: 52, marginTop: 8 }}>$GRAVE</div>
          <div style={{ fontFamily: body, fontSize: 24, marginTop: 14 }}>Bought at market.</div>
          <div style={{ fontFamily: body, fontSize: 24 }}>Buried by dawn.</div>
        </Headstone>
      </div>
      <Rise at={70} style={{ position: "absolute", left: 130, top: 560, width: 900 }}>
        <div style={{ fontFamily: body, fontSize: 44, lineHeight: 1.4, color: C.dust }}>
          Every token bought is sent to the dead address. Nobody has the key. It never comes back.
        </div>
        <div style={{ fontFamily: "Courier Prime, monospace", fontSize: 30, color: C.cream, marginTop: 24 }}>{DEAD}</div>
      </Rise>
    </Fade>
  );
};

/* 6 · The fork, honestly */
const Fork: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [20, 60], [0, 1], { ...clamp, easing: expo });
  return (
    <Fade dur={dur}>
      <Night glow={0.6} />
      <Caption n="04">Odd rides bury. Even rides pay Mort.</Caption>
      <Track width={900} offset={f * 6} style={{ position: "absolute", left: 0, top: 760 }} />
      <svg width="900" height="500" viewBox="0 0 900 500" style={{ position: "absolute", left: 900, top: 560 }}>
        <path d="M0 222 C 250 222, 330 60, 640 60" fill="none" stroke={C.bulb} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        <path d="M0 222 C 250 222, 330 400, 640 400" fill="none" stroke={C.slime} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
      </svg>
      <div style={{ position: "absolute", left: 1560, top: 480, opacity: draw }}>
        <Headstone width={130} height={170} shape={0} />
        <div style={{ fontFamily: display, fontSize: 30, color: C.bulb, marginTop: 10 }}>BURIAL</div>
      </div>
      <div style={{ position: "absolute", left: 1555, top: 830, opacity: draw }}>
        <WageTin width={140} label="" />
        <div style={{ fontFamily: display, fontSize: 30, color: C.slime }}>WAGES</div>
      </div>
      <div style={{ position: "absolute", left: 260, top: 664 }}>
        <RideCar width={220} spin={f * 8} />
      </div>
      <Rise at={30} style={{ position: "absolute", left: 130, top: 860, width: 820 }}>
        <div style={{ fontFamily: body, fontSize: 38, lineHeight: 1.4, color: C.dust }}>Wage rides send the fees to the creator wallet. Nothing hidden: every ride is on-chain.</div>
      </Rise>
    </Fade>
  );
};

/* 7 · Outro */
const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Fade dur={dur}>
      <Night glow={1} />
      <Motes count={50} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Rise at={4}>
          <GraveMark size={260} glow />
        </Rise>
        <Rise at={14}>
          <div style={{ fontFamily: sign, fontSize: 140, lineHeight: 1, color: C.cream, marginTop: 20, textShadow: shade }}>Every trade digs a grave.</div>
        </Rise>
        <Rise at={26}>
          <div style={{ fontFamily: display, fontSize: 64, color: C.bulb, marginTop: 30 }}>$GRAVE</div>
        </Rise>
        <Rise at={34}>
          <div style={{ fontFamily: body, fontSize: 36, color: C.dust, marginTop: 14 }}>
            Mort’s Ghost Train · Robinhood Chain · {DEAD_SHORT}
          </div>
        </Rise>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, bottom: 40, width: "100%", display: "flex", justifyContent: "center", opacity: interpolate(f, [30, 50], [0, 0.5], clamp) }}>
        <Track width={1920} offset={f * 4} />
      </div>
    </Fade>
  );
};

// 900 frames @ 30 fps = 30 s
export const Demo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night }}>
    <Series>
      <Series.Sequence name="Marquee" durationInFrames={90}>
        <Marquee dur={90} />
      </Series.Sequence>
      <Series.Sequence name="Meet Mort" durationInFrames={120}>
        <MeetMort dur={120} />
      </Series.Sequence>
      <Series.Sequence name="Coin box" durationInFrames={150}>
        <CoinBox dur={150} />
      </Series.Sequence>
      <Series.Sequence name="Buy-back" durationInFrames={150}>
        <BuyBack dur={150} />
      </Series.Sequence>
      <Series.Sequence name="Burial" durationInFrames={150}>
        <Burial dur={150} />
      </Series.Sequence>
      <Series.Sequence name="Fork" durationInFrames={120}>
        <Fork dur={120} />
      </Series.Sequence>
      <Series.Sequence name="Outro" durationInFrames={120}>
        <Outro dur={120} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
