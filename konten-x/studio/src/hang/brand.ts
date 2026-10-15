import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";

// Palette from hang-on/src/styles/tree.css
export const C = {
  paper: "#f1ecdc",
  paper2: "#faf6ea",
  ink: "#1c241a",
  sky: "#e2ebcf",
  leaf: "#3f7d4a",
  leafD: "#234a2e",
  leafL: "#5d9a52",
  mango: "#f29a2e",
  bark: "#7a5a3c",
  barkD: "#3b2a1d",
  soil: "#17130f",
  red: "#b3402a",
  muted: "#5d6455",
  fire: "#e8541a",
  flame: "#ffd35a",
} as const;

export const serif = loadFraunces("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily;
export const type = loadCourier("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const SITE = "hangon.fun";
export const TICKER = "$HANG";
export const TAGLINE = "Don't let go.";
