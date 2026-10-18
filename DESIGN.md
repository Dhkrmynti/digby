---
name: DIGBY
description: A pixel graveyard at 0x…dEaD, kept by a hooded skeleton with a shovel. Night sky, wet dirt, moss on grey stone, one ecto-green light. Everything steps at 8 fps.
colors:
  ink: "#100c1b"
  ink-2: "#19132c"
  ink-soft: "#2f2549"
  cream: "#ece5d0"
  mist: "#a39bba"
  ecto: "#9dff7a"
  ecto-lo: "#4f9a3a"
  gold: "#f2c14e"
  stone: "#8a879a"
  stone-lo: "#625f73"
  dirt: "#2a1c17"
  dirt-2: "#4a3328"
  grass: "#3d5c3a"
  moss: "#5f8a4e"
  hood: "#4e3b6b"
  moon: "#f1e6bf"
  blood: "#c43a4e"
typography:
  display:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontWeight: 700
  label:
    fontFamily: "Silkscreen, Courier New, monospace"
    textTransform: uppercase
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
---

# Design System: DIGBY

## Overview

The page is the graveyard. The hero is a live pixel scene (`Graveyard.tsx`): Digby, the fee lantern on its post, one headstone per real burial, a ghost for each of the latest six. Below the grass the page goes underground (the topsoil stats, then the deeper dirt of "The night shift"), comes back up into the night for the grave register and the night watch, turns to parchment for the story, and ends under the moon.

All art is drawn in code on small grids (`src/components/digby/pixels.ts`) with an automatic one-pixel ink outline, painted to canvas at 1× and scaled up with `image-rendering: pixelated`. The site and the X kit (`konten-x/render/`) use the same code, so they never drift.

## Colors

- **Night** `ink` / `ink-2` / `ink-soft`: page ground, panels (`.slab`), lines.
- **Bone** `cream`, with `mist` for secondary text.
- **Ecto green** `ecto`: the one light in the yard. Only for live and actionable things: the buy button, live dots, the current stage, progress fills, focus rings.
- **Yard materials**: `stone` (headstones), `dirt` / `dirt-2` (underground sections), `grass`, `moss`, `hood` (Digby's robe, the logo extrusion), `moon`.
- **Gold** for wages and the underground section's labels. **Blood** only for the "RIP!" of the burial alert.
- Legacy names (`paper`, `pen`, `lcd`, `bubble`, …) are remapped in `index.css` for the log drawer and `/memex`.

### Named rules

- One green per view region. If two things glow, one of them is wrong.
- No rounded corners. Pixel edges, stepped shadows, stepped clip-paths (`.headstone`).
- No gradients except light: the lantern halo and the moon glow.

## Typography

- **Pixelify Sans** for the wordmark, headings and numbers.
- **Silkscreen** for labels, buttons and anything that reads like a stamp, always uppercase with a little tracking.
- **Atkinson Hyperlegible** for running text.
- **JetBrains Mono** for addresses and tx hashes.

## Components

- **Graveyard** (`Graveyard.tsx`): canvas 96 art pixels tall, as wide as the box allows (128–288). Plays the full burial (dig, coin drops, fill, headstone rises, RIP bubble) when a fresh burn lands, digs while the engine is mid-run, yawns now and then.
- **SpriteCard** (`Sprite.tsx`): 48×44 framed sprite scenes (idle, dig, yawn, rip, ghost, tomb, lantern, coin, sack) on one shared 8 fps clock that pauses off screen.
- **Headstone** (`.headstone`): the grave register's cards, stone with a stepped arch, moss and a darker base.
- **RIP alert** (`RipAlert.tsx`): bottom toast with the grave bell. `?rip` or `?rip=1234567` plays a demo.
- **Buttons**: `.btn-buy` (green, stepped edge, the only primary), `.btn-chip` (quiet outline), `.ca-field` (contract address strip).

## Motion

Stepped, never eased smooth: sprites at 8 fps, CSS and GSAP `steps()` for UI. All scroll motion is GSAP ScrollTrigger inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, from an already-visible default, so reduced motion (and a failed script) shows the finished page.

- **The descent (focal moment):** as the hero scrolls away, the yard's camera sinks below the grass (`depth` in `drawScene`), past roots, stones and one coffin under every real headstone, into the topsoil stats. The name lifts off the sky in 8 steps.
- **The shaft:** in "The night shift" a shaft is dug down the left of the steps as you scroll (scrubbed, 32 steps) and a spinning $DIGBY coin falls down it; each step lights (gold frame) when the coin reaches it.
- **Rising:** the five stage cards come up out of the ground (stepped clip from below); grave headstones rise in six steps as they enter.
- **The parchment:** the story unrolls down out of the night (scrubbed clip-path, 12 steps).
- **The last word:** "Another one for the ground." drops in one word at a time, like clods off a shovel.
- **Nav:** the current chapter is lit in ecto green with a pixel underline.

## Do's and Don'ts

Do: keep every number live from the engine, show wage runs as openly as burials, keep thresholds in `stages.ts`.

Don't: add rounded cards, add a second accent colour, draw art outside `pixels.ts`, or show a headstone that is not a real burial on the live site.
