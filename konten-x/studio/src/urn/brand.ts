import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadHanken } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Palette from urn/src/styles/skull.css
export const C = {
  ink: "#17121c",
  paper: "#f3ead8",
  paper2: "#fffaf0",
  plum: "#3a2550",
  plum2: "#432d5c",
  plumD: "#2a1a3a",
  velvet: "#8c2433",
  velvetD: "#6e1a27",
  velvetL: "#a32c3e",
  gold: "#e9b53c",
  ember: "#ff6a1a",
  flame: "#ffd35a",
  ash: "#cfc6b8",
  ashD: "#8f8477",
  coal: "#1b1517",
  wood: "#b07a48",
  muted: "#6a6158",
  urn: "#e8662a",
  urnD: "#b8451a",
  bone: "#f3ead8",
} as const;

export const disp = loadFraunces("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily;
export const body = loadHanken("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const SITE = "urnskull.fun";
export const TICKER = "$URN";
export const TAGLINE = "Rest in ashes.";
