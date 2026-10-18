import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GROUND, SCENE_H, digbySprite, drawCard, drawScene, layoutFor, type CardArt, type SceneState } from "../../../../src/components/digby/canvas";
import { IDLE, YAWN } from "../../../../src/components/digby/pixels";
import { PAL, Pixels, T, TAGLINE, TICKER, stepIn, useTick } from "./brand";

const yard = (o: Partial<SceneState>): SceneState => ({ stage: 3, lantern: 0, graves: 0, newGraveAt: -999, digging: false, burial: null, pokedAt: -99, ...o });

/** The night sky above a scene, so a canvas sitting lower in the frame carries on upward. */
const Sky: React.FC<{ children?: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: PAL.sky0 }}>{children}</AbsoluteFill>;

/* ═════════ Profile picture (1000×1000): Digby under the moon, safe for a round crop ═════════ */
function portrait(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = PAL.sky0;
  ctx.fillRect(0, 0, 50, 50);
  ctx.fillStyle = PAL.sky1;
  ctx.fillRect(0, 20, 50, 12);
  ctx.fillStyle = PAL.sky2;
  ctx.fillRect(0, 32, 50, 12);
  for (let x = 0; x < 50; x += 2) {
    ctx.fillStyle = PAL.sky1;
    ctx.fillRect(x, 19, 1, 1);
    ctx.fillStyle = PAL.sky2;
    ctx.fillRect(x + 1, 31, 1, 1);
  }
  ctx.fillStyle = PAL.star;
  [[5, 6], [12, 13], [22, 4], [30, 15], [44, 24], [3, 24], [26, 26]].forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
  ctx.fillStyle = PAL.moon;
  for (let dy = -5; dy <= 5; dy++) {
    const half = Math.floor(Math.sqrt(25 - dy * dy));
    ctx.fillRect(39 - half, 11 + dy, half * 2 + 1, 1);
  }
  ctx.fillStyle = PAL.moonS;
  ctx.fillRect(37, 9, 2, 1);
  ctx.fillRect(40, 13, 1, 1);
  ctx.fillStyle = PAL.fence;
  ctx.fillRect(0, 36, 50, 1);
  for (let x = 1; x < 50; x += 6) ctx.fillRect(x, 34, 1, 10);
  ctx.fillStyle = PAL.grassH;
  ctx.fillRect(0, 44, 50, 1);
  ctx.fillStyle = PAL.grass;
  ctx.fillRect(0, 45, 50, 1);
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(0, 46, 50, 4);
  ctx.drawImage(digbySprite(3, IDLE[t % 8]), 8, 14);
}

export const DigbyLogo: React.FC = () => (
  <AbsoluteFill>
    <Pixels w={50} h={50} scale={20} draw={(ctx) => portrait(ctx, 0)} />
  </AbsoluteFill>
);

/* ═════════ X header (1500×500): the yard before launch, plot #1 dug and staked ═════════ */
export const DigbyBanner: React.FC = () => (
  <Sky>
    <Pixels w={300} h={96} scale={5} draw={(ctx) => drawScene(ctx, 300, 3, yard({ stage: 1, ghosts: 0 }))} style={{ position: "absolute", left: 0, bottom: 0 }} />
    <div style={{ position: "absolute", left: 64, top: 64 }}>
      <p style={T.logo(128)}>DIGBY</p>
      <p style={{ ...T.sub(40), marginTop: 18 }}>{TAGLINE}</p>
      <p style={{ ...T.tag(20), marginTop: 22 }}>{TICKER} · Robinhood Chain</p>
    </div>
  </Sky>
);

/* ═════════ Prelaunch video (1080×1350, 15 s) ═════════ */
// The 135-pixel yard at 8× fills the width; text sits in the sky above and the dirt below.
const PW = 135;
const PRE_SCALE = 8;
const PRE_TOP = 300;
const LINES: { from: number; to: number; text: string }[] = [
  { from: 0, to: 96, text: "Every token sent to 0x⁠…⁠dEaD had to go somewhere." },
  { from: 96, to: 186, text: "Somebody has to bury it." },
  { from: 186, to: 300, text: "Plot #1 is already dug." },
  { from: 300, to: 372, text: "The lantern lights at launch." },
];

export const DigbyPrelaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTick();
  const l = layoutFor(PW);
  // the camera leans in on the stake in hard steps, then backs off
  const zIn = stepIn(frame, 196, 24, 6);
  const zOut = stepIn(frame, 292, 12, 3);
  const zoom = 1 + 0.9 * zIn * (1 - zOut);
  const stakeX = ((l.front[0] + 8) / PW) * 100;
  const end = stepIn(frame, 372, 12, 4);
  const line = LINES.find((x) => frame >= x.from && frame < x.to);
  const lineIn = line ? stepIn(frame, line.from, 8, 4) : 0;
  return (
    <Sky>
      <div style={{ position: "absolute", left: 0, top: PRE_TOP, width: 1080, height: SCENE_H * PRE_SCALE, overflow: "hidden" }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: `${stakeX}% ${((GROUND - 8) / SCENE_H) * 100}%` }}>
          <Pixels w={PW} h={SCENE_H} scale={PRE_SCALE} draw={(ctx) => drawScene(ctx, PW, t, yard({ stage: 1, pokedAt: frame >= 300 ? Math.floor((300 * 8) / 30) : -99 }))} />
        </div>
      </div>
      <AbsoluteFill style={{ top: PRE_TOP + SCENE_H * PRE_SCALE, background: PAL.dirt }} />

      {line ? (
        <div style={{ position: "absolute", left: 72, right: 72, top: 92, opacity: lineIn, transform: `translateY(${(1 - lineIn) * 24}px)` }}>
          <p style={T.head(68)}>{line.text}</p>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 72, right: 72, top: PRE_TOP + SCENE_H * PRE_SCALE + 64, opacity: 1 - end }}>
        <p style={T.tag(26, PAL.moon)}>{TICKER} · Robinhood Chain</p>
        <p style={{ ...T.body(34, PAL.bone), marginTop: 16 }}>Every trade lights his lantern. Every full lantern is a burial.</p>
      </div>

      {/* end card */}
      <AbsoluteFill style={{ background: PAL.sky0, opacity: end, justifyContent: "center", padding: 88 }}>
        <p style={T.logo(200)}>DIGBY</p>
        <p style={{ ...T.sub(64), marginTop: 28 }}>{TAGLINE}</p>
        <p style={{ ...T.sub(44, PAL.moon), marginTop: 18 }}>Nothing comes back up.</p>
        <p style={{ ...T.tag(32), marginTop: 64 }}>{TICKER} · launching soon</p>
        <p style={{ ...T.tag(24, PAL.moon), marginTop: 14 }}>on Robinhood Chain</p>
      </AbsoluteFill>
    </Sky>
  );
};

/* ═════════ Launch GIF (720×720, 8 fps): the first burial, plot #1 becomes grave #1 ═════════ */
export const LAUNCH_GIF_FRAMES = 64;
export const DigbyLaunchGif: React.FC = () => {
  const t = useCurrentFrame(); // the composition runs at 8 fps, so a frame is a sprite tick
  const burial = t < 53 ? t : null;
  return (
    <Sky>
      <Pixels
        w={120}
        h={96}
        scale={6}
        draw={(ctx) =>
          drawScene(ctx, 120, t, yard({ stage: 1, lantern: t < 6 ? 1 : 0.1, graves: t < 25 ? 0 : 1, newGraveAt: 25, burial, ghosts: 1 }))
        }
        style={{ position: "absolute", left: 0, bottom: 0 }}
      />
      <div style={{ position: "absolute", left: 40, right: 40, top: 30 }}>
        <p style={T.head(64)}>{TICKER} is live</p>
        <p style={{ ...T.tag(20), marginTop: 12 }}>grave #1 is open · CA below</p>
      </div>
    </Sky>
  );
};

/* ═════════ Hook video: the supply goes underground (1080×1350, 11 s) ═════════ */
const UW = 180;
export const DigbyUnderground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTick();
  // a headstone every 14 frames for the first stretch, up to ten
  const graves = Math.min(10, Math.floor(frame / 14));
  const newGraveAt = Math.floor((graves * 14 * 8) / 30);
  // then the camera sinks below the grass, in steps
  const depth = stepIn(frame, 170, 60, 12);
  const lines = [
    { from: 0, text: "Every trade lights his lantern." },
    { from: 70, text: "Every full lantern is a burial." },
    { from: 170, text: "Every burial is a coffin under the yard." },
    { from: 245, text: "Nothing comes back up." },
  ];
  const line = [...lines].reverse().find((x) => frame >= x.from)!;
  const lineIn = stepIn(frame, line.from, 8, 4);
  return (
    <Sky>
      <Pixels
        w={UW}
        h={SCENE_H}
        scale={6}
        draw={(ctx) => drawScene(ctx, UW, t, yard({ stage: 2, lantern: (frame % 14) / 14, graves, newGraveAt, digging: frame < 140, depth }))}
        style={{ position: "absolute", left: 0, top: 330 }}
      />
      <AbsoluteFill style={{ top: 330 + SCENE_H * 6, background: PAL.dirt }} />
      <div style={{ position: "absolute", left: 72, right: 72, top: 96, opacity: lineIn, transform: `translateY(${(1 - lineIn) * 24}px)` }}>
        <p style={T.head(70)}>{line.text}</p>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, bottom: 96 }}>
        <p style={T.logo(96)}>DIGBY</p>
        <p style={{ ...T.tag(24, PAL.moon), marginTop: 18 }}>{TICKER} · buyback and burn on Robinhood Chain</p>
      </div>
      <p style={{ ...T.tag(16, PAL.starD), position: "absolute", right: 40, bottom: 40 }}>illustration</p>
    </Sky>
  );
};

/* ═════════ Hook still: how a burial works (1080×1350) ═════════ */
const Card: React.FC<{ art: CardArt; stage?: number; level?: number; scale?: number }> = ({ art, stage = 3, level, scale = 4 }) => (
  <Pixels w={48} h={44} scale={scale} draw={(ctx) => drawCard(ctx, art, stage, 8, level)} style={{ boxShadow: `0 0 0 6px ${PAL.dirtS}` }} />
);

export const HookHowItWorks: React.FC = () => {
  const rows: { art: CardArt; level?: number; head: string; text: string }[] = [
    { art: "lantern", level: 3, head: "You trade.", text: "A small fee in ETH lights Digby's lantern." },
    { art: "idle", head: "The night shift claims it.", text: "A bot, 24/7. When the lantern is full, it takes it." },
    { art: "coin", head: `It buys ${TICKER}.`, text: "Market buys on the open market. Every time." },
    { art: "tomb", head: "Digby buries it.", text: "Sent to 0x…dEaD. Gone from the supply for good." },
  ];
  return (
    <AbsoluteFill style={{ background: PAL.dirt, padding: 72 }}>
      <p style={T.head(84)}>Every trade digs a grave.</p>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 34 }}>
        {rows.map((r) => (
          <div key={r.head} style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <Card art={r.art} level={r.level} />
            <div>
              <p style={T.head(48)}>{r.head}</p>
              <p style={{ ...T.body(32), marginTop: 10, maxWidth: 640 }}>{r.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ ...T.body(26, PAL.moon), position: "absolute", left: 72, right: 72, bottom: 72 }}>
        Shifts take turns: odd ones bury, even ones pay Digby&apos;s wages to the project wallet. Both on chain.
      </p>
    </AbsoluteFill>
  );
};

/* ═════════ Hook still: the five stages (1600×900) ═════════ */
const STAGE_ROW = [
  { n: 1, name: "Night Shift", at: "day one" },
  { n: 2, name: "Iron Spade", at: "0.5% buried" },
  { n: 3, name: "Lanternbearer", at: "1% buried" },
  { n: 4, name: "Keeper", at: "2.5% buried" },
  { n: 5, name: "The Undertaker", at: "5% buried" },
];
export const HookStages: React.FC = () => (
  <Sky>
    <div style={{ position: "absolute", left: 80, top: 64 }}>
      <p style={T.head(76)}>Digby levels up as the supply goes underground.</p>
      <p style={{ ...T.sub(38, PAL.moon), marginTop: 16 }}>Which one do we unlock first?</p>
    </div>
    <AbsoluteFill style={{ top: 640, background: PAL.dirt, borderTop: `12px solid ${PAL.grass}` }} />
    <div style={{ position: "absolute", left: 40, right: 40, top: 370, display: "flex", justifyContent: "space-between" }}>
      {STAGE_ROW.map((s) => (
        <div key={s.n} style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Pixels w={34} h={30} scale={9} draw={(ctx) => ctx.drawImage(digbySprite(s.n, IDLE[0]), 0, 0)} />
          <p style={{ ...T.head(34), marginTop: 46, textAlign: "center" }}>{s.name}</p>
          <p style={{ ...T.tag(18, PAL.moon), marginTop: 12 }}>{s.at}</p>
        </div>
      ))}
    </div>
  </Sky>
);

/* ═════════ Hook still: the meme (1080×1080) ═════════ */
export const HookNoRefunds: React.FC = () => {
  const l = layoutFor(PW);
  const headX = (l.dx + 22) * PRE_SCALE;
  return (
    <Sky>
      <Pixels
        w={PW}
        h={SCENE_H}
        scale={PRE_SCALE}
        draw={(ctx) => {
          drawScene(ctx, PW, 2, yard({ stage: 2, graves: 2 }));
          ctx.drawImage(digbySprite(2, YAWN[3]), l.dx, GROUND - 30);
        }}
        style={{ position: "absolute", left: 0, bottom: 0 }}
      />
      <div style={{ position: "absolute", left: 64, right: 64, top: 64 }}>
        <p style={T.head(76)}>sold your {TICKER}?</p>
      </div>
      <div style={{ position: "absolute", left: headX - 40, top: 1080 - SCENE_H * PRE_SCALE + (GROUND - 46) * PRE_SCALE, background: PAL.bubble, padding: "18px 26px", boxShadow: `0 0 0 6px ${PAL.ol}` }}>
        <p style={{ ...T.head(44, PAL.ol) }}>no refunds down here.</p>
      </div>
    </Sky>
  );
};

/* ═════════ One more: the RIP card for each real burial, ready to fill (1080×1350) ═════════ */
export const PostRip: React.FC<{ amount: string; grave: number; tx: string }> = ({ amount, grave, tx }) => (
  <Sky>
    <Pixels
      w={PW}
      h={SCENE_H}
      scale={PRE_SCALE}
      draw={(ctx) => drawScene(ctx, PW, 31, yard({ stage: 1, graves: Math.max(1, grave), burial: 32 }))}
      style={{ position: "absolute", left: 0, top: 360 }}
    />
    <AbsoluteFill style={{ top: 360 + SCENE_H * PRE_SCALE, background: PAL.dirt }} />
    <div style={{ position: "absolute", left: 72, right: 72, top: 84 }}>
      <p style={T.tag(26)}>grave #{grave}</p>
      <p style={{ ...T.head(96), marginTop: 14 }}>{amount}</p>
      <p style={{ ...T.sub(44, PAL.moon), marginTop: 8 }}>{TICKER} buried at 0x…dEaD</p>
    </div>
    <div style={{ position: "absolute", left: 72, right: 72, bottom: 72 }}>
      <p style={T.sub(40)}>Another one for the ground.</p>
      <p style={{ ...T.tag(18, PAL.moon), marginTop: 16, wordBreak: "break-all" }}>tx {tx}</p>
    </div>
  </Sky>
);
