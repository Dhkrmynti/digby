import { loadFont as loadRounded } from "@remotion/google-fonts/MPLUSRounded1c";
import { loadFont as loadDot } from "@remotion/google-fonts/DotGothic16";

// Palette from raffle-engine/src/styles/capsu.css
export const C = {
  body: "#2b3fe6",
  bodyDeep: "#1f2fc4",
  interior: "#141c7a",
  ink: "#0d1030",
  plate: "#ffffff",
  coin: "#ffd028",
  pink: "#ff4f86",
  mint: "#2fd6a8",
  orange: "#ff8a3d",
  led: "#ffc53a",
  ledBg: "#0a0c1e",
  onBody2: "#d5dbff",
} as const;
export const TOPS = [C.pink, C.coin, C.mint, C.orange];

export const display = loadRounded("normal", { weights: ["500", "800", "900"], subsets: ["latin"] }).fontFamily;
export const dot = loadDot("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const SITE = "capsu.fun";
export const TAGLINE = "One capsule drops. One holder takes the whole pot.";
