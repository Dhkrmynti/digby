import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, G, mono, SITE, TAGLINE } from "./brand";
import { F, Water } from "./parts";
import { Gulp } from "./Gulp";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ GIF loop (600×600, 4s): the lure breathes ═════════ */
export const GulpLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const a = (frame / durationInFrames) * Math.PI * 2;
  return (
    <AbsoluteFill>
      <Water w={600} h={600} depth={0.55} t={frame / fps} />
      <div style={{ position: "absolute", left: 0, top: 70 + Math.sin(a) * 8, width: 600 }}>
        <Gulp still glow={0.55 + Math.sin(a) * 0.35} open={0.2 + Math.max(0, Math.sin(a * 2)) * 0.15} viewBox="150 10 760 450" className="" />
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Teaser (1080×1350, 12s): a light in the dark, then the strike ═════════ */
export const GulpTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const glow = interpolate(frame, [20, 250], [0.05, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const open = interpolate(frame, [262, 272, 300], [0.15, 1, 0.35], clamp);
  const flash = interpolate(frame, [266, 272, 296], [0, 0.85, 0], clamp);
  const reveal = interpolate(frame, [40, 260], [90, 1500], { ...clamp, easing: Easing.in(Easing.cubic) });
  // lure position inside the frame (Gulp at left 120, top 380, width 1000)
  const lx = 120 + (196 - 150) * (1000 / 760);
  const ly = 380 + (142 - 10) * (1000 / 760);
  return (
    <AbsoluteFill>
      <Water w={1080} h={1350} depth={1} t={t} />
      <div style={{ position: "absolute", left: 120, top: 380 + Math.sin(t * 1.2) * 6, width: 1000 }}>
        <Gulp still glow={glow} open={open} viewBox="150 10 760 450" className="" />
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}px ${ly}px, transparent ${reveal * 0.35}px, rgba(2,7,13,0.97) ${reveal}px)` }} />
      <AbsoluteFill style={{ background: G.lure, opacity: flash * 0.35 }} />
      <p style={{ ...F(92), position: "absolute", left: 76, top: 90, opacity: interpolate(frame, [30, 60, 200, 230], [0, 1, 1, 0], clamp) }}>Something is</p>
      <p style={{ ...F(92, G.lure), position: "absolute", left: 76, top: 186, opacity: interpolate(frame, [60, 90, 200, 230], [0, 1, 1, 0], clamp) }}>down here.</p>
      <p
        style={{
          ...F(100),
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 180,
          opacity: interpolate(frame, [300, 325], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [300, 340], [30, 0], { ...clamp, easing: ease })}px`,
        }}
      >
        {TAGLINE}
      </p>
      <p style={{ fontFamily: mono, fontSize: 26, color: G.lure, position: "absolute", left: 76, bottom: 116, margin: 0, opacity: interpolate(frame, [320, 345], [0, 1], clamp) }}>$GULP · Robinhood Chain · {SITE}</p>
      <p style={{ fontFamily: body, fontSize: 1, opacity: 0 }}>.</p>
    </AbsoluteFill>
  );
};
