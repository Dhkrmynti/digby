import { loadFont as loadBagel } from "@remotion/google-fonts/BagelFatOne";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

// Palette from gulpfish/src/index.css (GULP · a dive to the trench floor)
export const G = {
  surface: "#0f6f86",
  twilight: "#0a3a58",
  midnight: "#071f36",
  abyss: "#04111f",
  hadal: "#02070d",
  foam: "#e8f5f2",
  foamDim: "#a9cbd2",
  lure: "#d8ff4f",
  plum: "#3d2a4f",
  plumInk: "#1a1024",
  bone: "#f2ecd8",
} as const;

export const fat = loadBagel("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadBricolage("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadJetBrains("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

export const SITE = "gulpfish.fun";
export const HANDLE = "@gulpfishfun";
export const CA = "[CA]";
export const TAGLINE = "Nothing comes back up.";
