import { loadFont as loadRye } from "@remotion/google-fonts/Rye";
import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";

// Palette from graveburn/DESIGN.md ("Mort's Ghost Train")
export const C = {
  night: "#170d1f",
  nightDeep: "#0e0714",
  plum: "#2a1838",
  plumLine: "#463056",
  rail: "#6b5a78",
  sign: "#d7263d",
  signDeep: "#9e1528",
  bulb: "#ffcf3a",
  bulbHot: "#fff2b8",
  slime: "#a6ff4d",
  ticket: "#f1e6cc",
  ink: "#2a1626",
  ticketDim: "#6e5866",
  cream: "#f6eedd",
  dust: "#b7a9c4",
  dustDim: "#9686a6",
  stone: "#8f879a",
  stoneInk: "#1d1622",
} as const;

export const sign = loadRye("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const display = loadBungee("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const body = loadArchivo("normal", { weights: ["400", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadCourier("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const DEAD = "0x000000000000000000000000000000000000dEaD";
export const DEAD_SHORT = "0x000…dEaD";
export const TAGLINE = "Every trade digs a grave.";
