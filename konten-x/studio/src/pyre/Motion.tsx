import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { P, SITE, TAGLINE } from "./brand";
import { Bonfire, Cave, H, M } from "./parts";
import { Pyre } from "./Pyre";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ═════════ GIF loop (600×600, 4s): by the fire ═════════ */
export const PyreLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <Cave w={600} h={600} t={t} lx={0.4} ly={0.9} />
      <Bonfire x={20} y={600} w={300} t={t} heat={0.85} />
      <div style={{ position: "absolute", left: 280, top: 250, width: 330 }}>
        <Pyre still hold="torch" outfit="fur" flame={0.7 + Math.sin(t * 6) * 0.2} viewBox="60 60 400 440" className="" />
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ Teaser (1080×1350, 12s): darkness, a spark, the fire, the ape ═════════ */
export const PyreTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const light = interpolate(frame, [60, 200], [0, 1.3], { ...clamp, easing: Easing.in(Easing.quad) });
  const heat = interpolate(frame, [70, 220], [0.05, 1], clamp);
  return (
    <AbsoluteFill>
      <Cave w={1080} h={1350} t={t} lx={0.45} ly={0.85} light={light} />
      <div style={{ opacity: interpolate(frame, [60, 90], [0, 1], clamp) }}>
        <Bonfire x={160} y={1250} w={520} t={t} heat={heat} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 620, width: 560, opacity: interpolate(frame, [150, 210], [0, 1], clamp) }}>
        <Pyre still hold="torch" outfit="fur" viewBox="60 60 400 440" className="" />
      </div>
      <p style={{ ...H(80), position: "absolute", left: 76, top: 110, opacity: interpolate(frame, [10, 40, 120, 140], [0, 1, 1, 0], clamp) }}>In the beginning,</p>
      <p style={{ ...H(80), position: "absolute", left: 76, top: 210, opacity: interpolate(frame, [40, 70, 120, 140], [0, 1, 1, 0], clamp) }}>it was dark.</p>
      <p style={{ ...H(80, P.fire), position: "absolute", left: 76, top: 110, opacity: interpolate(frame, [150, 180, 240, 260], [0, 1, 1, 0], clamp) }}>Then one ape</p>
      <p style={{ ...H(80, P.fire), position: "absolute", left: 76, top: 210, opacity: interpolate(frame, [170, 200, 240, 260], [0, 1, 1, 0], clamp) }}>found fire.</p>
      <p style={{ ...H(84), position: "absolute", left: 76, right: 76, top: 140, opacity: interpolate(frame, [270, 300], [0, 1], clamp), translate: `0 ${interpolate(frame, [270, 310], [30, 0], { ...clamp, easing: ease })}px` }}>{TAGLINE}</p>
      <p style={{ ...M(24, P.boneDim), position: "absolute", left: 76, top: 360, opacity: interpolate(frame, [300, 325], [0, 1], clamp) }}>$PYRE · Robinhood Chain · {SITE}</p>
    </AbsoluteFill>
  );
};
