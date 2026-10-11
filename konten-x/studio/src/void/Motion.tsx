import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { body, DEAD_SHORT, display, mono, SITE, TAGLINE, V } from "./brand";
import { Night, Note, Paper, VoidHole } from "./parts";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const H = (size: number, color: string = V.star): React.CSSProperties => ({ fontFamily: display, fontWeight: 900, fontSize: size, lineHeight: 0.88, textTransform: "uppercase", color, margin: 0 });
const label = (size: number, color: string = V.starDim): React.CSSProperties => ({ fontFamily: body, fontWeight: 600, fontSize: size, letterSpacing: "0.14em", textTransform: "uppercase", color });

/* ═════════ GIF loop (600×600, 4s) ═════════ */
export const VoidLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // a slow breath of the ring that returns to where it started
  const glow = 0.9 + 0.25 * Math.sin((frame / durationInFrames) * Math.PI * 2);
  return (
    <AbsoluteFill>
      <Night glow={0.7} />
      <VoidHole width={600} height={600} t={frame / fps} shadow={0.24} glow={glow} />
    </AbsoluteFill>
  );
};

/* ═════════ Teaser (1080×1350, 12s) ═════════ */
export const VoidTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <Night glow={0.5} />
      <div style={{ position: "absolute", left: 0, top: 200, width: 1080, height: 800, opacity: interpolate(frame, [0, 70], [0, 1], { ...clamp, easing: ease }), scale: interpolate(frame, [0, 300], [0.75, 1.15], { ...clamp, easing: ease }) }}>
        <VoidHole width={1080} height={800} t={t} shadow={0.25} glow={interpolate(frame, [0, 120, 260], [0.3, 1, 1.3], clamp)} feed={interpolate(frame, [150, 230], [0, 1], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 240, ...H(320) }}>
        <span style={{ opacity: interpolate(frame, [80, 120], [0, 1], clamp), translate: `${interpolate(frame, [80, 130], [-120, 0], { ...clamp, easing: ease })}px 0` }}>V</span>
        <span style={{ opacity: interpolate(frame, [80, 120], [0, 1], clamp), translate: `${interpolate(frame, [80, 130], [120, 0], { ...clamp, easing: ease })}px 0` }}>ID</span>
      </div>
      <p style={{ ...H(90), position: "absolute", left: 0, right: 0, bottom: 210, textAlign: "center", opacity: interpolate(frame, [190, 230], [0, 1], clamp), translate: `0 ${interpolate(frame, [190, 240], [30, 0], { ...clamp, easing: ease })}px` }}>
        {TAGLINE}
      </p>
      <p style={{ ...label(26), position: "absolute", left: 0, right: 0, bottom: 140, textAlign: "center", opacity: interpolate(frame, [250, 280], [0, 1], clamp) }}>
        $VOID · Robinhood Chain · {SITE}
      </p>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 24s): one orbit, start to horizon ═════════ */
const Scene: React.FC<{ title: string; text: string; side?: "left" | "right" }> = ({ title, text, side = "left" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", [side]: 110, top: 260, width: 640, opacity: interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [0, 30], [30, 0], { ...clamp, easing: ease })}px` }}>
      <p style={H(110)}>{title}</p>
      <p style={{ fontFamily: body, fontSize: 38, lineHeight: 1.45, color: V.star, marginTop: 26 }}>{text}</p>
    </div>
  );
};

export const VoidDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // disk fills over scene 2, feeds through scenes 3–4
  const fill = interpolate(frame, [120, 270], [0.1, 1], clamp);
  const feed = interpolate(frame, [280, 330, 560, 600], [0, 1, 1, 0], clamp);
  const holeX = interpolate(frame, [0, 110, 140], [0, 0, 380], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Night glow={0.6} />
      <div style={{ position: "absolute", left: holeX, top: 0, width: 1920, height: 1080 }}>
        <VoidHole width={1920} height={1080} t={t} shadow={0.26} glow={0.5 + fill * 0.7} feed={feed} />
      </div>

      {/* 0–4s: the name */}
      <Sequence durationInFrames={130}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 330, ...H(380), opacity: interpolate(frame, [0, 30, 100, 125], [0, 1, 1, 0], clamp) }}>
          <span>V</span>
          <span>ID</span>
        </div>
        <p style={{ ...H(80), position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", opacity: interpolate(frame, [20, 50, 100, 125], [0, 1, 1, 0], clamp) }}>{TAGLINE}</p>
      </Sequence>

      {/* 4–9s: the disk fills */}
      <Sequence from={130} durationInFrames={150}>
        <Scene title="The disk" text="Every $VOID buy and sell pays a creator fee in ETH. It spirals into the accretion disk until it goes critical." />
        <div style={{ position: "absolute", left: 110, bottom: 140, width: 640 }}>
          <div style={label(22)}>disk filled · {Math.round(fill * 100)}%</div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 99, background: V.panelLine }}>
            <div style={{ height: 10, width: `${fill * 100}%`, borderRadius: 99, background: V.ring }} />
          </div>
        </div>
      </Sequence>

      {/* 9–14s: the pull and the feed */}
      <Sequence from={280} durationInFrames={150}>
        <Scene title="The pull" text="The Watcher, our bot, claims the fees and market-buys $VOID with them. Nobody presses a button." />
      </Sequence>

      {/* 14–19s: falls in, or fuel */}
      <Sequence from={430} durationInFrames={150}>
        <Scene title="Falls in" text={`Odd orbits: every $VOID bought is sent to ${DEAD_SHORT}, forever. Even orbits fuel the observatory (creator wallet), logged in full.`} />
      </Sequence>

      {/* 19–24s: the log and the way in */}
      <Sequence from={580} durationInFrames={140}>
        <div style={{ position: "absolute", left: 110, top: 200, width: 700, opacity: interpolate(frame - 580, [0, 20], [0, 1], clamp) }}>
          <Paper width={700} rotate={-1.2}>
            <div style={{ fontFamily: mono, fontSize: 22, color: V.penSoft }}>chan 1 · dEaD-1</div>
            <svg width="600" height="160" style={{ display: "block", marginTop: 14 }}>
              <path
                d={`M0 80 L240 80 L270 ${80 - interpolate(frame - 580, [20, 45], [0, 70], clamp)} L300 ${80 + interpolate(frame - 580, [20, 45], [0, 40], clamp)} L330 80 L600 80`}
                fill="none"
                stroke={V.pen}
                strokeWidth={3}
              />
            </svg>
            <Note size={56} style={{ opacity: interpolate(frame - 580, [45, 60], [0, 1], clamp) }}>
              fall recorded. tx on the log.
            </Note>
          </Paper>
          <p style={{ ...H(96), marginTop: 70 }}>{SITE}</p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
