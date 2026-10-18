---
name: MUNCH
description: The virtual pet that eats its own supply. A tangerine handheld in a blister pack, a grey-green LCD with ink pixels, bubblegum keys, stepped motion.
colors:
  shell: "#ff7a2f"
  shell-hi: "#ffa565"
  shell-lo: "#e0571a"
  bubble: "#ff3d7f"
  bubble-lo: "#c41f5c"
  sun: "#ffd166"
  jar: "#5ec8f2"
  jar-ink: "#12607f"
  lcd: "#c4cfa1"
  lcd-ink: "#2f3a22"
  lcd-soft: "#45502f"
  lcd-mid: "#8a9666"
  lcd-ghost: "#b4c091"
  ink: "#2a1633"
  ink-2: "#3a2245"
  ink-soft: "#5c3a63"
  cream: "#fff3e2"
  pet-body: "#8a5cff"
  mouth: "#4a1240"
typography:
  logo:
    fontFamily: "Bagel Fat One, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(3.6rem, 10vw, 7.4rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Bagel Fat One, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Bagel Fat One, Arial Rounded MT Bold, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.25
  lcd-headline:
    fontFamily: "DotGothic16, Courier New, monospace"
    fontSize: "clamp(2.2rem, 4.6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
  lcd-title:
    fontFamily: "DotGothic16, Courier New, monospace"
    fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)"
    fontWeight: 400
    lineHeight: 1.25
  lcd-label:
    fontFamily: "DotGothic16, Courier New, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Gabarito Variable, Gabarito, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.625
  body-strong:
    fontFamily: "Gabarito Variable, Gabarito, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.25
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    fontFeature: "\"tnum\", \"lnum\""
rounded:
  none: "0px"
  speech: "14px"
  panel: "18px"
  card: "22px"
  pill: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "40px"
  gutter-lg: "64px"
  container: "84rem"
  header: "64px"
  header-sm: "72px"
components:
  button-buy:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-buy-hover:
    backgroundColor: "#ff5c93"
    textColor: "{colors.ink}"
  button-chip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.05rem"
  button-chip-hover:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
  button-chip-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "1rem 1.6rem"
  button-lcd:
    backgroundColor: "{colors.lcd}"
    textColor: "{colors.lcd-ink}"
    typography: "{typography.lcd-label}"
    rounded: "{rounded.none}"
    padding: "0.45rem 0.9rem"
  button-lcd-hover:
    backgroundColor: "{colors.lcd-ink}"
    textColor: "{colors.lcd}"
  ca-field:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.45rem 0.4rem 1.1rem"
  card-cardboard:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "40px"
  panel-printed:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "16px"
  lcd-window:
    backgroundColor: "{colors.lcd}"
    textColor: "{colors.lcd-ink}"
    rounded: "{rounded.none}"
    padding: "28px"
  lcd-menu-item-active:
    backgroundColor: "{colors.lcd-ink}"
    textColor: "{colors.lcd}"
    typography: "{typography.lcd-label}"
    rounded: "{rounded.none}"
  sticker:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "6.2rem"
  speech-bubble:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.lcd-label}"
    rounded: "{rounded.speech}"
    padding: "0.45rem 0.85rem"
---

# Design System: MUNCH

## Overview

**Creative North Star: "The Toy on the Peg"**

The page is the toy, not a page about a toy. You meet MUNCH the way you would in a shop: a tangerine cardboard backer card with a die-cut hang tab, a clear blister bubble, and inside it a pixel egg-shaped handheld whose screen already shows the live pet, what it has eaten and how hungry it is. Scrolling lifts the device out and dives into its LCD; from there every chapter (life, feeding, meals, jar, status) is a menu on the handheld's grey-green screen, wayfound by the screen's own sticky icon strip. The box then turns to its printed back for the story, and MUNCH opens its mouth and eats the screen.

Three materials carry everything: **printed tangerine cardboard** with plum ink outlines, **the LCD** (two inks plus a ghost-pixel matrix, no colour, no radius), and **candy plastic** for the keys (bubblegum for buy, sun-yellow for secondary keys). Plum ink is the world's outline and its night: it frames the pack, draws every sprite edge, and is the dark the pack hangs against. Density is toy-box generous on the card and instrument-dense on the LCD.

Motion is stepped, like an LCD refreshing: `steps()` easing for sprites, reveals and key presses; smooth easing only for physical camera moves (the pack zoom, the box flip). Everything degrades to a still, legible page under reduced motion.

The world explicitly refuses the dark crypto hero (giant counter, CA box, stat-card grid) and the neon retro-arcade costume; pixels here are a cheap handheld's, not an arcade cabinet's.

**Key Characteristics:**
- One continuous object: pack, then screen, then box back, then the mouth. Never a stack of generic sections.
- Plum ink outlines (3-4px) on every printed thing; no hairlines, no grey borders.
- The LCD is a separate material with its own two inks, square corners and DotGothic16 voice.
- All sprites are original pixel grids drawn as crisp SVG rects; one grid, two palettes (printed colour and LCD).
- Stepped motion everywhere except physical camera moves.

## Colors

A candy-toy palette on plum ink: tangerine card, bubblegum and sun keys, a sky-blue jar, and a desaturated grey-green screen that never takes colour.

### Primary
- **Tangerine Shell** (shell): the cardboard backer, the box back, the handheld's plastic. Carries a faint printed pellet pattern at 48px. Highlight and shade steps (shell-hi, shell-lo) are for the device's pixel plastic only.
- **Bubblegum Key** (bubble): the buy action and only the buy action, plus selection highlight and the caret. Its pressed skirt is bubble-lo.

### Secondary
- **Sun Sticker** (sun): the round price sticker, secondary device keys, hover fill on cream chips, and the focus halo.
- **Snack-Jar Sky** (jar, jar-ink): the snack jar (the project wallet) and nothing else; jar-ink is its text-safe form on light grounds.

### Tertiary
- **MUNCH Purple** (pet-body): the pet's own body in printed colour; it belongs to the mascot sprite, not to UI.
- **Inside the Mouth** (mouth): the finale's swallow fill and the sprite's mouth interior.

### Neutral
- **Plum Ink** (ink): outlines, print, page background, header, footer. ink-2 and ink-soft are raised plum and quiet plum strokes (sound toggle ring, secondary print).
- **Card Cream** (cream): printed panels, chips, CA pill, speech bubbles, light text on plum.
- **LCD Screen** (lcd) with **LCD Ink** (lcd-ink): the screen and its pixels. lcd-mid is the half-lit pixel (inactive sprite shading, rails), lcd-ghost the unlit pixel matrix and hover wash, lcd-soft secondary screen text.

### Named Rules
**The Gum Is Live Rule.** Bubblegum marks the one live, actionable key: buy. It is never a background, a heading colour or decoration.

**The Screen Has Two Inks Rule.** On the LCD only lcd, lcd-ink, lcd-mid and lcd-ghost exist. Sprites switch to the LCD palette (or its inverse for a selected item); no printed colour ever appears on the screen.

**The Backlight Is Rare Rule.** One chapter, Status, runs with the backlight on (`.lcd-night`): the same five LCD tokens swapped, so lit pixels sit on dark glass, entered across a three-density dither edge (`.lcd-dither`), never a gradient. Sprites there take the inverse palette. Do not invert a second chapter, or the swap stops meaning anything.

**The Jar Is Blue Rule.** Sky blue means the snack jar. Anything that is not the jar does not borrow it.

### Supporting tokens
`bezel` / `bezel-hi` (plum plastic round the screen), `mouth` (inside MUNCH's mouth), `bubble-hi` (buy hover), `cream-hi` (input and CA hover), and the `glass` set (`glass`, `glass-lit`, `glass-soft`, `glass-mid`, `glass-ghost`) that `.lcd-night` swaps in. Shadows mix from `ink` or `lcd-ink` with `color-mix()`; only white and black transparencies (light and shade on plastic) stay literal. Sprite palettes in `sprites.tsx` and the shell constants in `Device.tsx` stay hex, because SVG fill attributes cannot read variables and the X kit renders the sprites outside the browser.

### Legacy aliases (log drawer and /memex only)
The theme still declares the retired shared names `night`, `night-2`, `panel`, `panel-line`, `star`, `star-dim`, `paper`, `paper-shade`, `grid`, `pen`, `pen-soft`, `marker`, `marker-deep`, `ring`, `ring-hot`, `fuel`, `fuel-ink`, `soot`, `char`, `wood`, `bark`, `ember`, `flame`, `hot`, `ash`, `ash-light`, `plaque`, `plaque-ink`, `cold`, the font aliases `--font-display`, `--font-pixel`, `--font-hand`, `--font-sign`, and the helpers `.paper`, `.plaque`, `.btn-pen`, `.btn-ring`, `.btn-ghost`, `.btn-coal`, `.sign-lettering`. Each is a remap onto a MUNCH token (night/soot to ink, panel/char/wood to ink-2, star/paper/plaque to cream, ring/ember/flame to bubble, ring-hot to sun, fuel/cold to jar, marker to bubble-lo) so the full-log drawer and the hidden `/memex` operator panel keep rendering in-world. They are not part of the public system; new public surfaces use the MUNCH names. `star-dim` (#d9c3d6) is the one alias still used on the public page, as quiet footer text on plum.

## Typography

**Logo / Display Font:** Bagel Fat One (with Arial Rounded MT Bold, sans-serif)
**LCD Font:** DotGothic16 (with Courier New, monospace)
**Body Font:** Gabarito Variable (with system-ui, sans-serif)
**Mono Font:** JetBrains Mono, self-hosted (with ui-monospace) for addresses and hashes

**Character:** Bagel Fat One is the fat, embossed lettering printed on plastic and cardboard; DotGothic16 is what the handheld can draw; Gabarito is the friendly explanatory voice; JetBrains Mono is the only thing allowed to print a hex address.

### Hierarchy
- **Logo** (Bagel 400, clamp(3.6rem, 10vw, 7.4rem), 0.92): the MUNCH wordmark on the pack and the finale. Cream fill, plum stroke (0.035em) and a three-step plum extrusion, as if printed on the pack.
- **Display** (Bagel 400, clamp(2.4rem, 5vw, 4.4rem), 1): headings printed on cardboard (the box back), plum ink without extrusion.
- **Title** (Bagel 400, 1.35rem to clamp(1.5rem, 2.2vw, 1.9rem), tight): pack callouts and box-back panel titles.
- **LCD Headline** (DotGothic16 400, clamp(2.2rem, 4.6vw, 4rem), 1.02): every chapter heading inside the screen.
- **LCD Title** (DotGothic16 400, clamp(1.6rem, 2.4vw, 2.1rem)): stage names, feeding steps, the jar.
- **LCD Label** (DotGothic16 400, 0.8 to 0.9rem, uppercase): menu items, screen readouts, speech bubbles.
- **Body** (Gabarito 400, 1.05rem, 1.625): explanation on card and screen, held to 44-48ch.
- **Mono** (JetBrains Mono 400, 0.8rem, tabular): contract and dead addresses, tx hashes, chain ID.

### Named Rules
**The Screen Speaks Pixel Rule.** Anything the handheld would display (headings, readouts, menu labels, MUNCH's speech) is DotGothic16. Gabarito appears on the LCD only as explanatory body copy.

**The Embossed Logo Rule.** The stroked, extruded logo treatment is reserved for the MUNCH wordmark. Other Bagel headings are flat plum print.

## Layout

One centred container (84rem max) with gutters of 16px on phones, 40px from `sm`, 64px from `lg`; a fixed plum header 64px tall (72px from `sm`). The pack fills the first viewport as a 22px-rounded cardboard card inset from the plum page, with the blister centred, printed callouts with arrows either side on desktop, and the action strip (buy, CA pill, chart, log, feed it, speech bubble) printed along the bottom edge. On phones the order is logo, device, buy, CA, then the rest; callouts drop below the fold.

Inside the screen the whole chapter run sits on one continuous LCD surface, with a 12px plum bezel inset on both edges so you never leave the device, and the LCD icon menu sticky directly under the header. Chapters pair an LCD headline with right-aligned body on desktop and stack on phones. The life cycle is a pinned horizontal track of stage frames (min(80vw, 34rem) wide) above a progress rail carrying the live "here" pin. The box back returns to a cardboard card with three cream panels stepped down at 0, 40 and 80px offsets on desktop.

## Elevation & Depth

Depth is physical and printed, not ambient. Printed objects sit on the card with a solid plum outline instead of a shadow; pressable keys carry a solid plum skirt beneath them that collapses when pressed, the way a real rubber key travels. The blister is the only translucent material (white glare stripes, inner rim highlight, one soft drop shadow). The LCD is recessed with a single inset step. The scrolled header gains one soft drop to separate it from the pack.

### Shadow Vocabulary
- **Ink outline** (`box-shadow: 0 0 0 3px #2a1633` or `4px`): every printed chip, panel, pill, sticker and speech bubble.
- **Key skirt** (`box-shadow: 0 0 0 4px #2a1633, inset 0 -6px 0 #c41f5c, inset 0 4px 0 rgba(255,255,255,0.4), 0 7px 0 4px #2a1633`): the buy key at rest; 9px on hover, 1px on press. Chips use `0 4px 0 3px` and drop to 0 on press.
- **Logo extrusion** (`text-shadow: 0.03em 0.03em 0 #2a1633, 0.06em 0.06em 0 #2a1633, 0.09em 0.09em 0 #2a1633`): the wordmark only.
- **Card print edge** (`box-shadow: inset 0 0 0 4px #2a1633, inset 0 6px 0 4px rgba(255,255,255,0.18)`): cardboard cards.
- **Blister** (`box-shadow: inset 0 0 0 3px rgba(255,255,255,0.6), inset 0 -14px 24px rgba(255,255,255,0.16), 0 18px 30px -18px rgba(42,22,51,0.7)`): the plastic bubble.
- **LCD recess** (`box-shadow: inset 3px 3px 0 rgba(47,58,34,0.28)`): the device's own screen.
- **Sticker lift** (`0 10px 18px -8px rgba(42,22,51,0.6)` over its ink outline): the price sticker, slightly peeled off the plastic.

### Named Rules
**The Skirt Means Press Rule.** A solid offset under an element means it is a key you can press, and it must collapse on `:active`. Static cards, panels and text never get an offset skirt.

## Shapes

Two corner languages that never mix. Printed and plastic things are soft: cards 22px, panels 18px, speech bubbles 14px with a plum triangle tail, keys, chips and the CA pill fully round, the sticker a circle, the blister an egg-shaped bubble (46/38% elliptical radii). The LCD is square: windows, menu items, stage frames, LCD keys and progress rails have zero radius and 3-4px lcd-ink borders. Sprites and the device itself are pixel grids rendered with crisp edges at any size.

## Components

### Buttons
- **Buy key:** bubblegum, plum text in Bagel, fully round, plum outline and key skirt; lifts 2px on hover (fill `bubble-hi`), drops 6px on press. Stepped 80ms transitions. The only bubblegum on the page.
- **Printed chip:** cream pill with plum outline and 4px skirt, Gabarito 700 at 0.95rem; sun fill on hover, presses flat. Used for chart, log, feed it, header CA.
- **Dark chip:** cream ring and cream text on plum; inverts to cream fill on hover. For actions on the plum ground.
- **LCD key:** square, 3px lcd-ink border, DotGothic16 uppercase; inverts to lcd-ink fill on hover.
- **Ink key (`.btn-ink`):** plum-2 pill, cream Bagel label, plum outline and 5px skirt; ink-soft on hover, presses flat. The one submit action on a form (the /memex keeper settings), where bubblegum would break The Gum Is Live Rule.
- **Device keys:** the handheld's drawn buttons are pixel art; invisible round hit areas sit over them with Bagel labels printed beneath (feed, buy, log).
- **Focus:** 3px plum outline at 3px offset plus a 6px sun halo, everywhere.

### Chips
- **CA pill:** cream pill, plum outline, mono address with a copy key inside; before launch it is a dashed plum placeholder reading "The contract address is printed here at launch."

### Cards / Containers
- **Cardboard card:** tangerine with the printed pellet pattern, 22px corners, 4px inset plum print edge. The pack and the box back.
- **Printed panel:** cream, 18px corners, 4px plum ring, 16px padding; box-back story panels each holding a small LCD vignette.
- **LCD window:** a framed screen region with a 4px lcd-ink frame, square, 20-28px padding; meal log, status, feeding scene. Its title bar is an inverted lcd-ink strip.

### Navigation
- **Header:** plum, wordmark with the munchlet sprite (hops 4px on hover), lowercase Gabarito 600 links in cream that turn sun on hover, round sound toggle. Section links fade out while inside the screen.
- **LCD icon menu:** sticky strip of five pixel icons (life, feeding, meals, jar, status) under the header; the current chapter is inverted (lcd-ink fill, LCD_INV sprite), others wash lcd-ghost on hover. Labels hide on phones, icons stay.

### Pixel sprites (signature)
Every character, icon and the device are palette-letter grids rendered as SVG rects with `crispEdges`. The same grid takes the printed COLOR palette on cardboard and the two-ink LCD palette on the screen (LCD_INV when selected). Stages: egg, munchlet, chomper, MUNCH, chosen by the real share of supply burned.

### Meal alert (attention call)
When a real meal lands on chain while the page is open, a small handheld-shaped toast (shell rim, LCD window) rises from the bottom in stepped frames: blinking pixel "!", the pet chewing, "NOM!", the amount and the transaction. A square-wave chiptune plays only when sound is on. It stays up for 9 seconds and only counts meals from the last 15 minutes. `?nom` or `?nom=<amount>` plays a demo for recordings. While it is up, the pet on the pack chews too.

### Chapter change
Changing menu inside the screen sweeps one faint scan band down the viewport (`.lcd-refresh`, steps(4)), and the newly lit menu icon re-inks. Motion only. Reduced motion shows neither.

### Speech bubble and sticker
MUNCH talks in a cream, 14px bubble with a plum outline and a plum triangle tail, set in DotGothic16. The price sticker is a 6.2rem sun circle with a plum outline, slightly rotated off the plastic.

## Do's and Don'ts

### Do:
- **Do** outline every printed object in plum ink at 3-4px (`0 0 0 3px #2a1633`).
- **Do** switch sprites to the LCD palette whenever they appear on the screen.
- **Do** set anything the handheld displays in DotGothic16, and every hex address in JetBrains Mono.
- **Do** use `steps()` easing for sprite, reveal and press motion; keep smooth easing for the pack zoom and box flip only.
- **Do** keep square corners on the LCD and round, soft corners on cardboard and plastic.
- **Do** give every pressable key a skirt that collapses on `:active`.

### Don't:
- **Don't** use bubblegum for anything but the buy action, selection and the caret.
- **Don't** put printed colour (tangerine, bubblegum, sun, jar, purple) on the LCD.
- **Don't** build a dark crypto hero: no giant counter, standalone CA box or stat-card grid.
- **Don't** reach for neon arcade styling (glows, scanlines, CRT curvature, gradients on pixels).
- **Don't** add a skirt or offset shadow to static cards, panels or text.
- **Don't** use the legacy alias tokens or helpers (night, panel, star, paper, pen, ring, fuel, soot, ember, plaque, btn-coal and the rest) on public surfaces; they exist for the log drawer and /memex.
