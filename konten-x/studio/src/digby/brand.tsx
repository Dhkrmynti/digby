import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPixelify } from "@remotion/google-fonts/PixelifySans";
import { loadFont as loadSilk } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadAtkinson } from "@remotion/google-fonts/AtkinsonHyperlegible";
import { PAL } from "../../../../src/components/digby/pixels";

// DIGBY's own art and palette, straight from the site (src/components/digby), so the posts match the web pixel for pixel.
export { PAL };
export const display = loadPixelify("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
export const label = loadSilk("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadAtkinson("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const TICKER = "$DIGBY";
export const TAGLINE = "He buries the supply.";

/** The sprite clock: the site steps at 8 fps, so every video does too, whatever its frame rate. */
export const useTick = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.floor((frame * 8) / fps);
};

/** A canvas of art pixels scaled up whole, redrawn every frame. */
export const Pixels: React.FC<{ w: number; h: number; scale: number; draw: (ctx: CanvasRenderingContext2D) => void; style?: CSSProperties }> = ({ w, h, scale, draw, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    draw(ctx);
  });
  return <canvas ref={ref} width={w} height={h} style={{ width: w * scale, height: h * scale, imageRendering: "pixelated", display: "block", ...style }} />;
};

// Pixelify draws "fi" as one glyph that reads like an A; keep every letter separate
const flat: CSSProperties = { fontVariantLigatures: "none", fontFeatureSettings: '"liga" 0, "clig" 0' };

export const T = {
  logo: (size: number): CSSProperties => ({
    ...flat,
    fontFamily: display,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 0.92,
    margin: 0,
    color: PAL.bone,
    textShadow: `${size * 0.05}px ${size * 0.05}px 0 ${PAL.hood}, ${size * 0.1}px ${size * 0.1}px 0 ${PAL.ol}`,
  }),
  head: (size: number, color: string = PAL.bone): CSSProperties => ({ ...flat, fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 1.05, margin: 0, color }),
  sub: (size: number, color: string = PAL.bone): CSSProperties => ({ ...flat, fontFamily: display, fontWeight: 500, fontSize: size, lineHeight: 1.15, margin: 0, color }),
  tag: (size: number, color: string = PAL.eye): CSSProperties => ({ fontFamily: label, fontSize: size, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, color }),
  body: (size: number, color: string = PAL.bone): CSSProperties => ({ fontFamily: body, fontSize: size, lineHeight: 1.4, margin: 0, color }),
};

/** Stepped reveal: 0 before `at`, then up to 1 in `steps` hard steps over `len` frames. */
export const stepIn = (frame: number, at: number, len = 10, steps = 5) => {
  if (frame < at) return 0;
  if (frame >= at + len) return 1;
  return Math.ceil(((frame - at) / len) * steps) / steps;
};
