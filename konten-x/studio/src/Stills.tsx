import { AbsoluteFill } from "remotion";
import { body, C, DEAD_SHORT, display, mono, sign } from "./brand";
import { Arch, Bulb, Coin, GraveMark, Headstone, MortEyes, Motes, Night, RideCar, SignBoard, Striker, Ticket, Track, Tunnel, WageTin } from "./parts";

const signShadow = `0 4px 0 rgba(42,22,38,0.55)`;

/* ═════════ 01 · X profile picture (1000×1000, shown as a circle) ═════════ */
export const Logo: React.FC = () => {
  const n = 30;
  return (
    <AbsoluteFill>
      <Night glow={0.9} glowY="50%" />
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <Bulb key={i} size={30} lit={i % 3 !== 0} style={{ position: "absolute", left: 500 + 395 * Math.cos(a) - 15, top: 500 + 395 * Math.sin(a) - 15 }} />;
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))", translate: "0 20px" }}>
          <GraveMark size={600} glow />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ═════════ 02 · X header (1500×500) ═════════ */
export const Banner: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.9} glowY="0%" />
    <Motes count={40} />
    <Track width={1500} offset={0} style={{ position: "absolute", left: 0, top: 438 }} />
    <div style={{ position: "absolute", left: 1175, top: 140 }}>
      <Tunnel width={300} open={0.5}>
        <MortEyes size={30} look={-0.6} />
      </Tunnel>
    </div>
    <div style={{ position: "absolute", left: 920, top: 362 }}>
      <RideCar width={170} spin={20} />
    </div>
    <div style={{ position: "absolute", left: 360, top: 92 }}>
      <div style={{ fontFamily: sign, fontSize: 80, lineHeight: 0.95, color: C.cream, textShadow: signShadow }}>Mort’s Ghost Train</div>
      <div style={{ fontFamily: display, fontSize: 30, color: C.bulb, marginTop: 18, textShadow: "0 0 18px rgba(255,207,58,0.45)" }}>EVERY TRADE DIGS A GRAVE.</div>
      <div style={{ fontFamily: mono, fontSize: 22, color: C.dust, marginTop: 16 }}>$GRAVE · buyback &amp; burial · Robinhood Chain</div>
    </div>
  </AbsoluteFill>
);

/* ═════════ 05 · Admit one (1080×1350) ═════════ */
export const PostAdmitOne: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.8} />
    <Motes count={45} />
    <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.cream, textShadow: signShadow }}>Your ticket</div>
      <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.bulb, textShadow: signShadow }}>to the graveyard.</div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 360, rotate: "-4deg" }}>
      <Ticket width={860} notch={26}>
        <div style={{ padding: "54px 70px 46px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: display, fontSize: 26, color: C.ticketDim }}>
            <span>ADMIT ONE</span>
            <span>RIDE № ∞</span>
          </div>
          <div style={{ fontFamily: sign, fontSize: 88, lineHeight: 1, marginTop: 18 }}>Mort’s Ghost Train</div>
          <div style={{ fontFamily: body, fontSize: 32, lineHeight: 1.35, marginTop: 18, color: "#4a3644" }}>
            One ride through Mort’s graveyard, under the blocks of Robinhood Chain.
          </div>
          <div style={{ borderTop: `4px dashed rgba(42,22,38,0.35)`, margin: "34px 0" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: display, fontSize: 24, color: C.ticketDim }}>FARE</div>
              <div style={{ fontFamily: display, fontSize: 104, lineHeight: 1, color: C.sign }}>$GRAVE</div>
            </div>
            <GraveMark size={170} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 24, lineHeight: 1.4, marginTop: 26, color: "#4a3644" }}>
            Valid on every trade. No refunds:
            <br />
            nothing comes back from {DEAD_SHORT}.
          </div>
        </div>
      </Ticket>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: display, fontSize: 30, color: C.dust }}>
      EVERY TRADE DIGS A GRAVE.
    </div>
  </AbsoluteFill>
);

/* ═════════ 06 · Meet Mort (1080×1350) ═════════ */
export const PostMeetMort: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.55} />
    <Motes count={50} />
    <div style={{ position: "absolute", top: 76, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 150, lineHeight: 0.95, color: C.cream, textShadow: signShadow }}>Meet Mort.</div>
      <div style={{ fontFamily: display, fontSize: 36, color: C.bulb, marginTop: 18 }}>YOU’LL ONLY EVER SEE HIS EYES.</div>
    </div>
    <div style={{ position: "absolute", left: 170, top: 360 }}>
      <Tunnel width={740} open={0.58}>
        <MortEyes size={68} look={0.15} />
      </Tunnel>
    </div>
    <div style={{ position: "absolute", left: 100, right: 100, top: 1130, textAlign: "center", fontFamily: body, fontSize: 34, lineHeight: 1.38, color: C.cream }}>
      He keeps a graveyard under Robinhood Chain. Every trade drops a coin in his box. When it’s full, he buries the supply.
    </div>
  </AbsoluteFill>
);

/* ═════════ 07 · How it works (1600×900) ═════════ */
const STOPS = [
  { name: "Coin Box", text: "Every $GRAVE trade drops an ETH fee in Mort’s box." },
  { name: "Claim", text: "When the box is full, Mort’s bot claims it. 24/7." },
  { name: "Buy-back", text: "Burial rides market-buy $GRAVE on-chain." },
  { name: "Fork", text: "Odd rides get buried at 0x…dEaD. Even rides pay Mort’s wages." },
];
export const PostHowItWorks: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.7} />
    <div style={{ position: "absolute", left: 90, top: 64 }}>
      <div style={{ fontFamily: sign, fontSize: 112, lineHeight: 1, color: C.cream, textShadow: signShadow }}>One track. Four stops.</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 270, display: "flex", gap: 30 }}>
      {STOPS.map((s) => (
        <SignBoard key={s.name} style={{ flex: 1, padding: "30px 30px 34px" }}>
          <div style={{ fontFamily: sign, fontSize: 50, lineHeight: 1, textShadow: signShadow }}>{s.name}</div>
          <div style={{ fontFamily: body, fontSize: 25, lineHeight: 1.35, marginTop: 16 }}>{s.text}</div>
        </SignBoard>
      ))}
    </div>
    {/* the track, splitting at the end */}
    <Track width={1180} style={{ position: "absolute", left: 0, top: 690 }} />
    <svg width="420" height="300" viewBox="0 0 420 300" style={{ position: "absolute", left: 1180, top: 590 }}>
      <path d="M0 122 C 120 122, 150 40, 300 40" fill="none" stroke={C.bulb} strokeWidth="10" strokeLinecap="round" />
      <path d="M0 122 C 120 122, 150 210, 300 210" fill="none" stroke={C.slime} strokeWidth="10" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 1490, top: 560 }}>
      <Headstone width={64} height={86} shape={0} />
    </div>
    <div style={{ position: "absolute", left: 1484, top: 742 }}>
      <WageTin width={76} label="" />
    </div>
    <div style={{ position: "absolute", left: 110, top: 616 }}>
      <RideCar width={200} spin={15} />
    </div>
    <div style={{ position: "absolute", left: 90, bottom: 56, fontFamily: display, fontSize: 26, color: C.dust }}>
      $GRAVE · <span style={{ color: C.bulb }}>BURIAL</span> ON ODD RIDES · <span style={{ color: C.slime }}>WAGES</span> ON EVEN RIDES · ALL ON-CHAIN
    </div>
  </AbsoluteFill>
);

/* ═════════ 08 · The Daily Grave obituary (1080×1350) ═════════ */
export const PostObituary: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.nightDeep }}>
    <AbsoluteFill style={{ margin: 36, background: C.ticket, color: C.ink, padding: "46px 56px", rotate: "-1deg" }}>
      <div style={{ textAlign: "center", borderBottom: `5px double ${C.ink}`, paddingBottom: 14 }}>
        <div style={{ fontFamily: sign, fontSize: 116, lineHeight: 1 }}>The Daily Grave</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: display, fontSize: 20, marginTop: 14, color: C.ticketDim }}>
          <span>ROBINHOOD CHAIN EDITION</span>
          <span>PRICE: ONE TRADE</span>
        </div>
      </div>
      <div style={{ fontFamily: display, fontSize: 30, letterSpacing: "0.12em", marginTop: 24, color: C.sign }}>OBITUARIES</div>
      <div style={{ fontFamily: sign, fontSize: 72, lineHeight: 1.02, marginTop: 10 }}>Local supply keeps shrinking. Gravedigger denies everything.</div>
      <div style={{ display: "flex", gap: 34, marginTop: 30 }}>
        <div style={{ flex: 1.15, fontFamily: body, fontSize: 25, lineHeight: 1.45, color: "#3a2834" }}>
          Another piece of the $GRAVE supply was laid to rest this week at {DEAD_SHORT}, the graveyard under Robinhood Chain.
          <br />
          <br />
          Witnesses say a trade dropped a coin into a box, the box filled up, and a ghost train rolled past. By morning there was a new headstone.
          <br />
          <br />
          “I just dig,” said Mort, the night gravedigger, from the dark of his tunnel.
        </div>
        <div style={{ flex: 0.85, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", height: 400, background: C.night, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 60 }}>
              <MortEyes size={34} look={-0.4} />
            </div>
            <Headstone width={170} height={230} shape={0} style={{ paddingTop: 70 }}>
              <div style={{ fontFamily: display, fontSize: 20 }}>HERE LIES</div>
              <div style={{ fontFamily: display, fontSize: 28, marginTop: 6 }}>SUPPLY</div>
            </Headstone>
          </div>
          <div style={{ fontFamily: body, fontSize: 19, fontStyle: "italic", marginTop: 10, color: C.ticketDim }}>Mort’s eyes, photographed at the scene.</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 46, borderTop: `3px solid ${C.ink}`, paddingTop: 16, fontFamily: mono, fontSize: 24, textAlign: "center" }}>
        Services held at {DEAD_SHORT}. In lieu of flowers, trade $GRAVE.
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ═════════ 09 · Ring the bell (1080×1350) ═════════ */
export const PostRingTheBell: React.FC = () => (
  <AbsoluteFill>
    <Night glow={1} glowY="10%" />
    <Motes count={40} />
    <div style={{ position: "absolute", left: 70, top: 150, scale: "1.75", transformOrigin: "0 0" }}>
      <Striker height={640} fill={1} ring />
    </div>
    <div style={{ position: "absolute", left: 250, top: 120, rotate: "-10deg", fontFamily: display, fontSize: 70, color: C.bulb, textShadow: "0 0 26px rgba(255,207,58,0.85)" }}>
      DING!
    </div>
    <div style={{ position: "absolute", left: 380, right: 70, top: 300 }}>
      <div style={{ fontFamily: sign, fontSize: 104, lineHeight: 1, color: C.cream, textShadow: signShadow }}>Every trade swings the hammer.</div>
      <div style={{ fontFamily: display, fontSize: 40, color: C.bulb, marginTop: 34 }}>RING THE BELL →</div>
      <div style={{ fontFamily: display, fontSize: 40, color: C.bulb }}>SOMETHING GETS BURIED.</div>
      <div style={{ fontFamily: body, fontSize: 32, lineHeight: 1.4, color: C.dust, marginTop: 34 }}>
        When Mort’s coin box fills, the bell rings: his bot claims the fees, buys $GRAVE and buries it at {DEAD_SHORT}.
      </div>
    </div>
    <div style={{ position: "absolute", left: 380, bottom: 70, display: "flex", alignItems: "center", gap: 18 }}>
      <GraveMark size={64} />
      <span style={{ fontFamily: display, fontSize: 34, color: C.cream }}>$GRAVE</span>
    </div>
  </AbsoluteFill>
);

/* ═════════ 10 · Two shifts, honestly (1080×1350) ═════════ */
export const PostTwoShifts: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.6} />
    <Motes count={35} />
    <div style={{ position: "absolute", top: 76, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 118, lineHeight: 1, color: C.cream, textShadow: signShadow }}>Mort works</div>
      <div style={{ fontFamily: sign, fontSize: 118, lineHeight: 1, color: C.cream, textShadow: signShadow }}>two shifts.</div>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 400, display: "flex", gap: 40 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ height: 380, display: "flex", alignItems: "flex-end" }}>
          <Headstone width={250} height={340} shape={0} style={{ paddingTop: 110 }}>
            <div style={{ fontFamily: display, fontSize: 26 }}>HERE LIES</div>
            <div style={{ fontFamily: display, fontSize: 36, marginTop: 6 }}>$GRAVE</div>
          </Headstone>
        </div>
        <div style={{ fontFamily: display, fontSize: 40, color: C.bulb, marginTop: 34 }}>ODD RIDES</div>
        <div style={{ fontFamily: sign, fontSize: 64, color: C.cream, marginTop: 6 }}>Burial</div>
        <div style={{ fontFamily: body, fontSize: 28, lineHeight: 1.38, color: C.dust, marginTop: 14 }}>The fees buy $GRAVE and bury it at {DEAD_SHORT}. Forever.</div>
      </div>
      <div style={{ width: 4, background: C.plumLine, borderRadius: 2 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ height: 380, display: "flex", alignItems: "flex-end" }}>
          <WageTin width={270} label="WAGES" />
        </div>
        <div style={{ fontFamily: display, fontSize: 40, color: C.slime, marginTop: 34 }}>EVEN RIDES</div>
        <div style={{ fontFamily: sign, fontSize: 64, color: C.cream, marginTop: 6 }}>Mort’s wages</div>
        <div style={{ fontFamily: body, fontSize: 28, lineHeight: 1.38, color: C.dust, marginTop: 14 }}>The fees go to the creator wallet. A gravedigger has to eat.</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: display, fontSize: 28, color: C.dust }}>
      NOTHING HIDDEN. EVERY RIDE IS ON-CHAIN.
    </div>
  </AbsoluteFill>
);

/* ═════════ 12 · Link preview / Open Graph (1200×630) ═════════ */
export const OgImage: React.FC = () => (
  <AbsoluteFill>
    <Night glow={0.9} />
    <Arch width={1200} height={370} style={{ position: "absolute", left: 0, top: 0 }} lit={1} chase={0.4}>
      <div style={{ textAlign: "center", paddingTop: 108 }}>
        <div style={{ fontFamily: sign, fontSize: 92, lineHeight: 1, color: C.cream, textShadow: signShadow }}>Mort’s Ghost Train</div>
        <div style={{ fontFamily: display, fontSize: 34, color: C.bulb, marginTop: 20 }}>EVERY TRADE DIGS A GRAVE.</div>
      </div>
    </Arch>
    <div style={{ position: "absolute", left: 0, right: 0, top: 370, bottom: 0, background: C.plum }} />
    <div style={{ position: "absolute", left: 470, top: 330 }}>
      <Tunnel width={260} open={0.55}>
        <MortEyes size={24} />
      </Tunnel>
    </div>
    <div style={{ position: "absolute", left: 70, top: 440 }}>
      <div style={{ fontFamily: display, fontSize: 56, color: C.cream }}>$GRAVE</div>
      <div style={{ fontFamily: mono, fontSize: 24, color: C.dust, marginTop: 8 }}>Robinhood Chain · buyback &amp; burial</div>
    </div>
    <div style={{ position: "absolute", right: 80, top: 450, display: "flex", gap: 18, alignItems: "flex-end" }}>
      <Headstone width={72} height={100} shape={0} />
      <Headstone width={64} height={86} shape={1} />
      <Coin size={70} />
    </div>
  </AbsoluteFill>
);

/* ═════════ 14 · Trending on GMGN (1080×1350) ═════════ */
type TrendingProps = {
  /** Optional rank text such as "#3"; leave empty unless it is on a real screenshot. */
  readonly rank: string;
};

const DarkRide: React.FC<{ readonly w: number }> = ({ w }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 30px", borderTop: `3px solid ${C.plumLine}`, opacity: 0.55 }}>
    <Bulb size={22} lit={false} />
    <div style={{ height: 22, width: w, borderRadius: 6, background: C.plumLine }} />
    <div style={{ flex: 1 }} />
    <div style={{ height: 22, width: 120, borderRadius: 6, background: C.plumLine }} />
  </div>
);

export const PostTrending: React.FC<TrendingProps> = ({ rank }) => (
  <AbsoluteFill>
    <Night glow={1.1} />
    <Motes count={50} />
    <Arch width={1000} height={330} style={{ position: "absolute", left: 40, top: 40 }} lit={1} chase={0.35}>
      <div style={{ textAlign: "center", paddingTop: 116 }}>
        <div style={{ fontFamily: display, fontSize: 96, lineHeight: 1, color: C.bulb, textShadow: "0 0 26px rgba(255,207,58,0.7), 0 5px 0 #9e1528" }}>NOW TRENDING</div>
        <div style={{ fontFamily: sign, fontSize: 40, color: C.cream, marginTop: 14, textShadow: signShadow }}>Spotted on GMGN</div>
      </div>
    </Arch>

    {/* tonight's rides board */}
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 420,
        borderRadius: 22,
        background: C.plum,
        boxShadow: "0 30px 60px -24px rgba(0,0,0,0.9)",
        padding: "26px 0 18px",
      }}
    >
      <div style={{ position: "absolute", inset: 12, border: `3px solid rgba(246,238,221,0.22)`, borderRadius: 14, pointerEvents: "none" }} />
      <div style={{ fontFamily: display, fontSize: 30, color: C.dust, padding: "0 30px 16px", letterSpacing: "0.08em" }}>TONIGHT’S RIDES</div>
      <DarkRide w={300} />
      <DarkRide w={240} />
      <div style={{ height: 150 }} />
      <DarkRide w={280} />
      <DarkRide w={210} />
    </div>

    {/* the lit row, popping off the board */}
    <SignBoard style={{ position: "absolute", left: 40, right: 40, top: 640, height: 170, rotate: "-2.5deg", display: "flex", alignItems: "center", gap: 24, padding: "0 40px", boxShadow: "0 0 70px rgba(255,207,58,0.45), 0 30px 50px -20px rgba(0,0,0,0.9)" }}>
      {rank ? <div style={{ fontFamily: display, fontSize: 78, color: C.bulb }}>{rank}</div> : null}
      <GraveMark size={96} />
      <div>
        <div style={{ fontFamily: sign, fontSize: 52, lineHeight: 1, whiteSpace: "nowrap", textShadow: signShadow }}>Mort’s Ghost Train</div>
        <div style={{ fontFamily: display, fontSize: 30, color: C.bulbHot, marginTop: 10 }}>$GRAVE</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Bulb key={i} size={18} lit />
          ))}
        </div>
        <div style={{ fontFamily: display, fontSize: 40, color: C.ink, background: C.bulb, borderRadius: 10, padding: "8px 18px" }}>TRENDING</div>
      </div>
    </SignBoard>

    {/* Mort, peeking from below the board */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center" }}>
      <MortEyes size={40} look={-0.3} />
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}>
      <div style={{ fontFamily: sign, fontSize: 70, lineHeight: 1, color: C.cream, textShadow: signShadow }}>The line is out the door.</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: display, fontSize: 30, color: C.dust }}>
      $GRAVE · GRAVEBURN.FUN
    </div>
  </AbsoluteFill>
);
