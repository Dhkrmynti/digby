import { loadFont as loadGrenze } from "@remotion/google-fonts/GrenzeGotisch";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadFragment } from "@remotion/google-fonts/FragmentMono";

// Palette from brewcat/src/index.css (noir, cotton, cherry, maroon)
export const B = {
  noir: "#1B1717",
  noir2: "#241e1e",
  noir3: "#322828",
  cotton: "#EDEBDD",
  cottonDim: "#cfccbe",
  cherry: "#810100",
  cherryText: "#e0574f",
  maroon: "#630000",
  copper: "#c9773a",
} as const;

export const spell = loadGrenze("normal", { weights: ["800"], subsets: ["latin"] }).fontFamily;
export const body = loadFigtree("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily;
export const mono = loadFragment("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const SITE = "brewcat.fun";
export const TAGLINE = "Nothing comes out of the cauldron.";
