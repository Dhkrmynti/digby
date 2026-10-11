---
name: VOID
description: Deadsky Observatory's night shift on dEaD-1. Control-room night, strip-chart paper, a pen trace, a red marker, and the ring.
colors:
  night: "#06080f"
  panel: "#10172a"
  panel-line: "#26324d"
  star: "#d3dbec"
  star-dim: "#919db8"
  paper: "#f1ede1"
  paper-face: "#f8f4ea"
  grid: "#e0703f"
  pen: "#1c2a6b"
  pen-soft: "#4a5577"
  marker: "#cf3228"
  ring: "#ffad42"
  ring-hot: "#ffe2a6"
  fuel: "#5cc2ab"
  fuel-ink: "#1d7262"
typography:
  display-hero:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "30svh"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 6.4vw, 5.8rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 3.6vw, 3.2rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  reading:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    fontFeature: "\"tnum\", \"lnum\""
  hand:
    fontFamily: "Reenie Beanie, Bradley Hand, cursive"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  strip: "4px"
  schematic: "6px"
  module: "8px"
  bar: "10px"
  pill: "999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "40px"
  gutter-desktop: "64px"
  section-top: "112px"
  section-bottom: "96px"
  slip-x: "32px"
  slip-y: "20px"
components:
  button-ring:
    backgroundColor: "{colors.ring}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-ring-hover:
    backgroundColor: "{colors.ring-hot}"
    textColor: "{colors.night}"
  button-ghost:
    textColor: "{colors.star}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-ghost-hover:
    textColor: "{colors.ring-hot}"
  button-pen:
    textColor: "{colors.pen}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-pen-hover:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.paper}"
  paper-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    padding: "20px 32px"
  ca-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.star}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 20px"
  icon-button:
    textColor: "{colors.star-dim}"
    rounded: "{rounded.pill}"
    size: "40px"
  status-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.star}"
    rounded: "{rounded.bar}"
    padding: "16px 20px"
  log-tag-burn:
    backgroundColor: "{colors.ring}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  log-tag-buyback:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: VOID

## Overview

**Creative North Star: "The Night Shift on dEaD-1"**

The whole system is a radio observatory's control room at night, watching one black hole. Two materials carry everything: the blue-black night of the room and the sky, and pale strip-chart paper ruled in recorder orange that the instruments print onto. Readings are set in a condensed instrument face and in mono; the observer's notes are scrawled over the paper in a red marker hand. The only warm light in the room is the hole's amber photon ring, and it glows brighter as the accretion disk fills.

Density is split on purpose. Data sits in tight bands on paper slips and the observing-log strip; around them the night sky is left empty. Paper slips are physical objects: they sit slightly rotated (between -2deg and 1.5deg), carry sprocket holes down both edges, and throw a deep soft shadow onto the night. Motion follows instrument physics: needles swing ballistically, the recorder pen draws as you scroll, digits re-ink when a live value changes. Every motion has a still, complete reduced-motion fallback.

This world rejects the generic dark crypto hero (counter, CA box, stat cards) and the generic space-neon template. The black hole is drawn live on canvas, never shown as a stock nebula or glow blob.

**Key Characteristics:**
- Blue-black night field with pale, orange-ruled strip-chart paper as the only light surface.
- Four voices: condensed uppercase display, plain grotesk text, tabular mono readings, red marker hand.
- Amber ring light means live or actionable; red marker means the observer's annotation; teal means observatory fuel.
- Paper slips sit slightly rotated, with sprocket holes and a deep drop shadow.
- Scroll-driven instrument motion (pinned orbit, recorder trace, ballistic needle), always gated by prefers-reduced-motion.

## Colors

A night-dominant palette: one cool dark family, one warm paper family, and three signal inks used sparingly, each with a single meaning.

### Primary
- **Photon Ring Amber** (ring): the hole's light. Reserved for live state and the primary action: the BUY $VOID button, the live fallen total (in Ring Hot), the status lamp when the Watcher is live, the odd-orbit "falls in" reading on night surfaces, the orbit progress bar, and interactive response (hover borders, focus outline, text selection, caret). The sky's central glow mixes it in at 3% to 10% by the `--hearth` disk-fill value, so the room literally warms as the disk approaches critical mass.
- **Ring Hot** (ring-hot): the hottest part of the ring. Hover state of the primary action, ghost-button hover text, and the live fallen numerals inside the shadow.

### Secondary
- **Observer's Marker Red** (marker): the observer's hand. All handwritten annotations (notes on slips, log-row remarks, the Void's quotes, the drawn arrows of the orbit notes), the accretion meter's past-critical arc and ticks (85% to 100%), the "falls in" reading on paper, and hover/close states on paper controls.

### Tertiary
- **Observatory Fuel Teal** (fuel): the keep orbit. Even-orbit readings on night, the "Observatory fuel" heading and fuel-orbit labels, the fuel branch of the Watcher schematic.
- **Fuel Ink** (fuel-ink): fuel teal dark enough to read on paper (the meter's "fuel" next-orbit reading, the schematic's fuel wire and module).

### Neutral
- **Control-Room Night** (night): page background, the sky base, button text on amber, the meter's needle and pivot, the code pane in the schematic modal.
- **Console Panel** (panel): raised night surfaces: the CA field (at 80%), the Watcher status bar.
- **Panel Line** (panel-line): every hairline on night: ghost-button and icon-button borders, list dividers, footer rule, scrollbar thumb, inactive progress segments.
- **Starlight** (star): primary text on night, display headings, ghost-button text.
- **Dim Starlight** (star-dim): secondary text on night: paragraphs, nav labels, captions.
- **Chart Paper** (paper): the strip-chart paper; background of every slip, the log strip, the drawer, the schematic, and paper chips (copy button, header CA chip).
- **Paper Face** (paper-face): the brighter instrument face printed on paper (meter dial face, schematic module fill, the drawer search field). Used as a literal hex in three components, not a theme token.
- **Recorder Grid Orange** (grid): only ever the paper's ruling, mixed to 42% for the major 40px grid and 16% for the minor 8px grid. Never text, never fill.
- **Pen Blue-Black** (pen): all text and strokes on paper: the recorder trace, slip titles, readings, schematic lines, pen buttons.
- **Soft Pen** (pen-soft): secondary text on paper: labels, timestamps, units.

The theme also declares `night-2`, `paper-shade` and `marker-deep`; no shipped surface uses them, so they are held in reserve and not recorded as system tokens.

### Legacy aliases (operator panel only)
The theme still declares `soot`, `char`, `wood`, `bark`, `ember`, `flame`, `hot`, `ash`, `ash-light`, `plaque`, `plaque-ink`, `cold` and `--font-sign`, plus the helper classes `.plaque`, `.btn-coal` and `.sign-lettering`. They exist only so the hidden `/memex` operator panel keeps rendering; each is a remap onto a VOID token (for example `ember` and `flame` resolve to ring, `plaque` to paper, `cold` to fuel). They are not part of the public system. Never use them on public surfaces.

### Named Rules
**The Photon Ring Rule.** Amber is the hole's light: live readings, the primary action, and interactive response. It is never body copy, never a static fill on paper, never decoration.

**The Three Inks Rule.** Each signal ink has one meaning: amber is live, red is the observer's hand, teal is fuel. A burn reads amber on night and marker red on paper (amber does not hold on cream); fuel reads fuel on night and fuel-ink on paper.

**The Ruling Is Not Ink Rule.** Recorder orange exists only as the paper's grid. It is the measuring surface, not an accent.

## Typography

**Display Font:** Big Shoulders Display (with Arial Narrow, sans-serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace) for readings
**Hand Font:** Reenie Beanie (with Bradley Hand, cursive) for the observer's notes

**Character:** A condensed instrument face stamped in heavy uppercase does the shouting; a plain grotesk does the explaining; mono prints the numbers as a recorder would; and a loose marker hand talks back over all of it. All four are self-hosted variable or single-weight woff2 files.

### Hierarchy
- **Display Hero** (900, 30svh on desktop, clamp(5.5rem, 30vw, 9rem) on phones, 0.86): the VOID name only, split as V and ID around the hole on desktop, stacked above it on phones.
- **Display** (900, clamp(3rem, 6.4vw, 5.8rem), 0.86, uppercase, -0.01em): section headings ("The observing log", "How an address became a black hole"). The finale heading runs larger, clamp(3.6rem, 10vw, 6rem).
- **Headline** (900, clamp(2.2rem, 3.6vw, 3.2rem)): the tagline under the hole, Observatory fuel heading, card titles at clamp(2rem, 2.8vw, 2.5rem), orbit step names at clamp(2rem, 3.2vw, 2.8rem).
- **Title** (900, 1.55rem): slip titles on paper ("Observer notes", "Accretion disk"); fall numbers at 1.15rem; button text uses the display face at 800, 0.04em to 0.05em tracking.
- **Live numerals** (display face, 900, sized in container units to fill the shadow, tabular): the fallen total inside the hole, auto-sized from its digit count; log amounts at clamp(1.8rem, 3vw, 2.4rem).
- **Body** (400, 1.02rem to 1.15rem, leading-relaxed 1.625): explanatory paragraphs, held to 44ch to 54ch.
- **Label** (600, 0.62rem to 0.75rem, 0.12em, uppercase): field and reading labels, nav links, the tokenomics line.
- **Reading** (JetBrains Mono 400, 0.78rem to 1rem, tabular lining numerals): addresses, ETH amounts, timestamps, tx hashes, the recorder's header print.
- **Hand** (Reenie Beanie 400, 1.5rem to 2rem, line-height 1, marker red): annotations, the Void's quotes, log remarks (rotated -2deg on log rows).

### Named Rules
**The Four Voices Rule.** Every string belongs to exactly one voice: display for names and headings, grotesk for explanation, mono for readings, hand for the observer. Never set a reading in the grotesk or an explanation in the hand.

**The Tabular Readings Rule.** Every live number uses tabular lining numerals so digits hold still while they change.

## Layout

Containers run at 84rem (header, hero, orbit) and 80rem (log, watcher, discovery, footer), with gutters of 16px on phones, 40px from 640px, 64px from 1024px. Sections breathe on a 112px top / 96px bottom rhythm; display headings sit 48px to 64px above their content. Section heads use a two-column split on desktop: heading left, a 48ch to 50ch explanatory paragraph right-aligned and bottom-aligned.

The first viewport centres the hole at 54svh on desktop (min(92vw, 26rem) on phones), with the fallen total inside its shadow. Under it, a three-column grid (17rem / fluid / 17.5rem) puts the observer-notes slip left, the tagline, CA and BUY centre, and the accretion meter slip right. On phones the order collapses to: name, hole, tagline and actions, meter, notes, so BUY sits above the fold.

Breakpoints: 640px, 768px and 1024px from Tailwind defaults; 900px is the orbit sequence's pin threshold; 700px halves the canvas particle count. On desktop a pen thread runs down the left margin from the hero to the log strip.

**The Empty Sky Rule.** Dense data lives on paper; the night around it stays empty. Do not fill the sky between slips with stat tiles or decoration.

## Elevation & Depth

Depth is physical, not tonal: paper floats over the night, and the hole emits light. Night surfaces are flat and separated by hairlines (panel-line). Paper always casts one deep, soft shadow. Amber elements glow rather than cast.

### Shadow Vocabulary
- **Paper drop** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.85)`): every paper surface, built into the paper material.
- **Ring glow** (`box-shadow: 0 12px 30px -10px rgba(255, 173, 66, 0.75)`, hover `0 18px 40px -12px rgba(255, 173, 66, 0.9)`): the primary action only.
- **Lamp glow** (`box-shadow: 0 0 10px 2px rgba(255, 173, 66, 0.6)`): the live status lamp and the margin thread's pen tip.
- **Header settle** (`box-shadow: 0 12px 30px -18px rgba(0, 0, 0, 0.9)`): the fixed header once scrolled, with night at 90% and a backdrop blur.
- **Photon ring** (`box-shadow: 0 0 0 2px rgba(255,226,166,0.9), 0 0 60px 12px rgba(255,173,66,0.45), 0 0 160px 40px rgba(255,173,66,0.18)`): the finale's swallowing circle only.

### Named Rules
**The Paper Floats Rule.** Only paper casts a shadow. Night surfaces never do; they are divided by a 1px to 1.5px panel-line hairline.

**The Light Is Emitted Rule.** Amber never casts a dark shadow; it glows.

## Shapes

Two families. Controls are full pills (999px): every button, the CA field, icon buttons, chips, log tags, filter tabs, the search field. Paper and instrument surfaces are nearly square: the log strip at 4px, the schematic at 6px, modal and schematic modules at 8px, the status bar and meter dial at 10px. Slips themselves are square-cornered and cut by sprocket holes: 4px radius holes on a 24px pitch, 10px in from each edge, masked down both long sides. The hole, the mark and the finale circle are true circles. Annotation arrows are drawn hand strokes with round caps (2.5px).

## Components

### Buttons
Rounded, stamped and confident: condensed uppercase display at 800 weight on a pill.
- **Shape:** full pill (999px), inline-flex with a 0.5rem to 0.55rem icon gap.
- **Primary (Ring):** amber fill, night text, tracking 0.04em, ring glow. Hero size 14px by 32px at 1.25rem; finale 16px by 36px at 1.3rem; modal 8px by 20px at 0.95rem.
- **Hover / Focus:** Ring lifts 2px, brightens to Ring Hot and deepens its glow over 0.3s on the expo-out curve; presses 1px down on active. Focus everywhere is a 2px ring outline at 3px offset.
- **Ghost (night):** transparent, star text, 1.5px panel-line border; hover turns the border amber and the text Ring Hot. Secondary actions next to BUY (chart, full log, copy CA).
- **Pen (paper):** transparent on paper, pen text, 1.5px pen border at 60%; hover fills pen with paper text. Every action that lives on paper.
- **Icon button:** 40px circle, panel-line border, star-dim icon; hover turns border and icon amber.

### Chips
- **Paper chip:** a pill of chart paper on night carrying a mono or display label in pen (the copy chip inside the CA field, the header CA chip, which lifts 2px on hover).
- **Log tags (drawer):** small pills in display 0.85rem: burn is amber on night text, buyback is pen with paper text, trigger and default are outlined in pen.
- **Filter tabs:** display 0.95rem pills; selected is pen fill with paper text, unselected is pen-soft text darkening to pen.

### Cards / Containers
- **Paper slip:** chart paper with the orange ruling, sprocket holes, pen text, paper drop shadow, 20px by 32px padding, rotated -2deg to 1.5deg on desktop. Observer notes, the accretion meter and discovery entries are all slips; discovery entries step down 64px per column and alternate rotation.
- **Status bar:** console panel, panel-line border, 10px radius, 16px by 20px padding.
- **Background:** see Colors. **Shadow Strategy:** see Elevation. **Border:** none on paper; hairline on night.

### Inputs / Fields
- **CA field:** a full-width pill (max 34rem) in panel at 80% with a panel-line border; label over mono address on the left, paper copy chip on the right. Hover turns the border amber. Before launch it is replaced by a dashed panel-line pill saying the address arrives at launch.
- **Search (drawer):** a paper-face pill with a pen border at 30%, mono 0.82rem, a 14px search icon; focus darkens the border to full pen.

### Navigation
Fixed header, 64px on phones and 72px from 640px, transparent at the top and settling to night at 90% with a blur and header shadow after 24px of scroll. Mark plus "Void" in display 1.9rem on the left (the mark rotates -30deg on hover over 0.7s); section links in label 0.74rem star-dim, turning amber on hover, hidden below 768px; icon buttons and the paper CA chip on the right (CA chip from 1024px).

### Black Hole (signature)
dEaD-1 drawn live on a 2D canvas with additive light: a lensed starfield, a tilted disk (tilt 0.24) with its lensed arc over the shadow, and a photon ring whose glow follows the disk fill. It speeds up while a feed is running and siphons particles off as a fuel jet on even orbits. It pauses when off screen and draws a still frame under reduced motion. The shadow can hold content (the fallen total) at a fixed fraction of the short side.

### Accretion Meter (signature)
A VU-style dial on a paper slip: a paper-face rounded dial, pen ticks across a 112deg sweep, marker red from 85% to CRIT, a night needle and pivot. The needle swings ballistically (`elastic.out(1.1, 0.35)`, 1.6s, 0.4s delay) to the disk-fill fraction. Below it, a reading list (label left, mono right) and the next orbit in display, with a marker-hand status line.

### Observing Log (signature)
The strip-chart recorder unspooled: a paper strip with sprockets, a mono header printed across the top, then 112px rows. One continuous pen trace (1.5px, pen) runs down the left; it holds a jittered noise floor and spikes at each fall, sized logarithmically by amount, and is drawn row by row with scroll. Each row: fall number and timestamp, the amount in display numerals, the tx in mono with an external-link icon, and a rotated marker remark.

### Orbit Sequence (signature)
Five steps (disk, critical mass, the pull, the feed, the fork). From 900px it pins for 400% of the viewport: the step text crossfades, the hole scales from 0.86 to 1.08, and each step's marker note with a hand-drawn arrow fades in beside the hole; a five-segment progress bar fills in amber. Below 900px or under reduced motion, a sticky hole follows whichever step is in view and the steps stack with 34svh gaps.

### Live Number
Counts up once with an expo-out ease when it enters view, then re-inks only the digits that change (0.7s fade-from-blur, 0.2em rise). The real value renders without JavaScript.

### Finale
On desktop the last section scrolls 220svh: a black circle with the photon-ring shadow scales from 0.18 to 9, swallowing the screen, and the closing heading and BUY are written into the dark. Without motion or below 1024px, the section is a plain centred close.

## Do's and Don'ts

### Do:
- **Do** put every dense reading on chart paper (paper, pen text, 42%/16% orange ruling at 40px/8px) and leave the night around it empty.
- **Do** reserve Photon Ring Amber (#ffad42) for live state, the primary action and interactive response.
- **Do** write the observer's annotations in the marker hand (Reenie Beanie, 1.5rem to 2rem, marker red), with drawn arrows where they point at something.
- **Do** show the keep orbit openly in fuel teal (fuel on night, fuel-ink on paper).
- **Do** set every live number in tabular lining numerals, in mono for readings and in the display face for headline totals.
- **Do** gate every animation behind prefers-reduced-motion and give it a still, complete fallback.
- **Do** use pill controls (999px) and nearly square paper (4px to 10px).

### Don't:
- **Don't** build the dark crypto hero: a big counter, a CA box and a row of stat cards.
- **Don't** use generic space-neon: stock nebulae, purple-cyan gradients, glowing grids on black.
- **Don't** use recorder orange as an accent or text; it is only the paper's ruling.
- **Don't** put amber text or fills on paper; a burn on paper reads in marker red.
- **Don't** give night surfaces drop shadows; only paper floats.
- **Don't** use the legacy alias tokens or helpers (soot, ember, plaque, btn-coal, sign-lettering and the rest) on public surfaces; they exist only for /memex.
