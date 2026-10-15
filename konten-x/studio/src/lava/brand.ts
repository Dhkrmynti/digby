import { loadFont as loadPixelify } from "@remotion/google-fonts/PixelifySans";
import { loadFont as loadSilk } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Palette from graveburn/src/index.css (Lava Pit)
export const C = {
  night: "#15110e",
  char: "#1d1714",
  panel: "#2a221d",
  line: "#3e332b",
  star: "#f4ecdc",
  ash: "#b5a896",
  paper: "#efe6d4",
  pen: "#2a1d14",
  lava: "#d9420f",
  lavaDeep: "#8f2108",
  flame: "#ff8a1f",
  hot: "#ffe066",
  block: "#f2b53c",
  blockShade: "#c47f1c",
  fuel: "#7fdcf0",
  fuelInk: "#1f6f86",
  grass: "#5fa83b",
  dirt: "#6b4a2f",
  sky: "#2b2350",
  skyLow: "#3a2f5e",
} as const;

export const display = loadPixelify("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
// Silkscreen is caps only: labels, never addresses
export const label = loadSilk("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
export const body = loadGrotesk("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const SITE = "lavapit.fun";
export const TICKER = "$LAVA";
export const TAGLINE = "Mine it. Drop it in the lava.";
