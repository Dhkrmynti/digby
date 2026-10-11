import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { body, S, SITE, TAGLINE } from "./brand";
import { Space, Tidal, W } from "./parts";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const label = (size: number, color: string = S.starDim): React.CSSProperties => ({ fontFamily: body, fontWeight: 600, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color });

/* ═════════ GIF loop (600×600, 4s) ═════════ */
export const SunLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Space />
      <Tidal width={600} height={600} t={frame / fps} reach={0.25} hole={[0.62, 0.45]} sun={[0.22, 0.62]} scale={1.15} />
    </AbsoluteFill>
  );
};

/* ═════════ Teaser (1080×1350, 12s): the sun is dragged in ═════════ */
export const SunTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Space />
      <div style={{ position: "absolute", left: 0, top: 180, width: 1080, height: 860, opacity: interpolate(frame, [0, 50], [0, 1], { ...clamp, easing: ease }) }}>
        <Tidal width={1080} height={860} t={frame / fps} reach={interpolate(frame, [0, 300], [0, 0.85], clamp)} swallow={interpolate(frame, [250, 300], [0, 1], clamp)} hole={[0.64, 0.45]} sun={[0.2, 0.58]} scale={1.1} />
      </div>
      <p style={{ ...W(96), position: "absolute", left: 76, top: 80, opacity: interpolate(frame, [30, 70], [0, 1], clamp) }}>The sun is</p>
      <p style={{ ...W(96, S.plasmaHot), position: "absolute", left: 76, top: 180, opacity: interpolate(frame, [60, 100], [0, 1], clamp) }}>on the menu.</p>
      <p style={{ ...W(84), position: "absolute", left: 76, right: 76, bottom: 170, opacity: interpolate(frame, [300, 330], [0, 1], clamp), translate: `0 ${interpolate(frame, [300, 340], [30, 0], { ...clamp, easing: ease })}px` }}>{TAGLINE}</p>
      <p style={{ ...label(24), position: "absolute", left: 76, bottom: 110, opacity: interpolate(frame, [320, 345], [0, 1], clamp) }}>$EATER · Robinhood Chain · {SITE}</p>
    </AbsoluteFill>
  );
};

/* ═════════ Demo (1920×1080, 24s): one cycle, start to horizon ═════════ */
const Scene: React.FC<{ title: string; text: string; color?: string }> = ({ title, text, color = S.star }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 110, bottom: 130, width: 760, opacity: interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], clamp), translate: `0 ${interpolate(frame, [0, 30], [30, 0], { ...clamp, easing: ease })}px` }}>
      <p style={W(84, color)}>{title}</p>
      <p style={{ fontFamily: body, fontSize: 36, lineHeight: 1.45, color: S.star, marginTop: 22 }}>{text}</p>
    </div>
  );
};

export const SunDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reach = interpolate(frame, [0, 600, 660], [0.05, 0.75, 0.9], clamp);
  const swallow = interpolate(frame, [620, 670], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Space />
      <Tidal width={1920} height={1080} t={frame / fps} reach={reach} swallow={swallow} hole={[0.68, 0.42]} sun={[0.3, 0.5]} />

      <Sequence durationInFrames={130}>
        <div style={{ position: "absolute", left: 110, bottom: 130, opacity: interpolate(frame, [0, 30, 100, 125], [0, 1, 1, 0], clamp) }}>
          <p style={W(120)}>It is eating</p>
          <p style={{ ...W(120), color: S.plasmaHot }}>the sun.</p>
        </div>
      </Sequence>
      <Sequence from={130} durationInFrames={150}>
        <Scene title="The stream" text="Every $EATER trade on Pons pays a creator fee in ETH. Each fee pulls another strand of the sun loose." />
      </Sequence>
      <Sequence from={280} durationInFrames={150}>
        <Scene title="The claim" text="When the fees reach critical pull, our bot sweeps and collects them. Nobody presses a button." />
      </Sequence>
      <Sequence from={430} durationInFrames={150}>
        <Scene title="A swallow" color={S.plasmaHot} text="Odd cycles: the ETH buys $EATER and every token bought is burned. Even cycles, the ejecta goes to the treasury." />
      </Sequence>
      <Sequence from={580} durationInFrames={140}>
        <div style={{ position: "absolute", left: 110, bottom: 130, opacity: interpolate(frame - 580, [60, 90], [0, 1], clamp) }}>
          <p style={W(110)}>Feed it.</p>
          <p style={{ ...W(64, S.plasma), marginTop: 18 }}>{SITE}</p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
