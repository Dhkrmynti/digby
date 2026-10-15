import { loadFont as loadDela } from "@remotion/google-fonts/DelaGothicOne";
import { loadFont as loadSchibsted } from "@remotion/google-fonts/SchibstedGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/RedHatMono";

// Palette from sealed-tomb/src/styles/tokens.css
export const C = {
  sky: "#d5d9d8",
  skyDeep: "#c3c8c6",
  sun: "#ece7da",
  stone: "#cbc1ad",
  stoneHi: "#d8cfbd",
  stoneLo: "#b4a890",
  shade: "#a29681",
  joint: "#8a7f6b",
  sand: "#d5bd93",
  sandFar: "#cbb48c",
  soot: "#1e1d1a",
  sootSoft: "#3f3b34",
  ochre: "#a3311b",
  ochreLit: "#e4643f",
  gold: "#d4a62c",
  goldHi: "#e7c35e",
  tomb: "#15120f",
  tombWall: "#201b16",
  tombLift: "#2a241d",
  dust: "#e9deca",
  dustSoft: "#c4b8a3",
  torch: "#e8a948",
  flame: "#f6d36b",
  wood: "#6b4f37",
  woodHi: "#8e6c4c",
} as const;

export const display = loadDela("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadSchibsted("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;

export const SITE = "sealedtomb.fun";
export const TICKER = "$TOMB";
export const TAGLINE = "What goes in the tomb stays in the tomb.";
