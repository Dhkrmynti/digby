import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadSpline } from "@remotion/google-fonts/SplineSans";
import { loadFont as loadSplineMono } from "@remotion/google-fonts/SplineSansMono";

// Palette from suneater/src/index.css (Sun Eater · tidal disruption)
export const S = {
  space: "#06050c",
  space2: "#0d0b18",
  space3: "#161327",
  orbit: "#2c2746",
  star: "#ece9f6",
  starDim: "#a9a3c2",
  plasma: "#ffb347",
  plasmaHot: "#fff1c9",
  flare: "#ff6b2c",
  jet: "#8f8cff",
} as const;

export const wide = loadUnbounded("normal", { weights: ["600", "800"], subsets: ["latin"] }).fontFamily;
export const body = loadSpline("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadSplineMono("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;

export const SITE = "suneater.fun";
export const HANDLE = "@suneaterfun";
export const CA = "0x5a86be6d6473146b147a4aa3dae42c28d3c3c2db";
export const TAGLINE = "It is eating the sun.";
