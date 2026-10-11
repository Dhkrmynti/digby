import { loadFont as loadShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadHanken } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadReenie } from "@remotion/google-fonts/ReenieBeanie";

// Palette from graveburn/DESIGN.md (Black Void · Deadsky Observatory)
export const V = {
  night: "#06080f",
  night2: "#0b1020",
  panel: "#10172a",
  panelLine: "#26324d",
  star: "#d3dbec",
  starDim: "#919db8",
  paper: "#f1ede1",
  paperFace: "#f8f4ea",
  grid: "#e0703f",
  pen: "#1c2a6b",
  penSoft: "#4a5577",
  marker: "#cf3228",
  ring: "#ffad42",
  ringHot: "#ffe2a6",
  fuel: "#5cc2ab",
  fuelInk: "#1d7262",
} as const;

export const display = loadShoulders("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily;
export const body = loadHanken("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadJetBrains("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;
export const hand = loadReenie("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const DEAD_SHORT = "0x…dEaD";
export const SITE = "blackvoid.fun";
export const HANDLE = "@blackvoidrh";
export const TAGLINE = "Everything falls in.";
export const CA = "0xeccdbf66de0d3283b46a32012dda41809902b8a1";
