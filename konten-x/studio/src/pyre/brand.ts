import { loadFont as loadDela } from "@remotion/google-fonts/DelaGothicOne";
import { loadFont as loadFamiljen } from "@remotion/google-fonts/FamiljenGrotesk";
import { loadFont as loadMartian } from "@remotion/google-fonts/MartianMono";

// Palette from apepyre/src/index.css (APE PYRE · a cave, a bonfire, an ape)
export const P = {
  cave: "#120c08",
  cave2: "#1c130d",
  rock: "#2c2018",
  rockLight: "#4a3628",
  ochre: "#c8642c",
  ochreLight: "#e48e52",
  charcoal: "#0b0806",
  bone: "#f4e6d0",
  boneDim: "#c9b49a",
  fire: "#ff5a1f",
  flame: "#ffb347",
  banana: "#ffd23d",
} as const;

export const heavy = loadDela("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadFamiljen("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMartian("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const SITE = "apepyre.fun";
export const HANDLE = "@apepyre";
export const CA = "[CA]";
export const TAGLINE = "Everything goes in the fire.";
