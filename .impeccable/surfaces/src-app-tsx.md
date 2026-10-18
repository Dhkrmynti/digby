---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: public landing + live burn tracker (src/App.tsx)

Mode: Persuade. Visitors arrive from X/Telegram (phone first), want to verify the burn is real, copy the CA, and buy. Brand: MUNCH ($MUNCH), a pixel virtual pet that hatched inside a cracked handheld sent to 0x…dEaD and only eats $MUNCH. Tone: cute on the surface, deadpan underneath ("nom." / "no refunds."). Keep runs shown openly as "the snack jar" (project wallet).

Constraints: UI and lore only. useBurnEngine, web3 utils, contracts, bot, /memex logic, thresholds and data flow stay untouched. Persisted ledger keys stay readable. Nothing of Lava Pit, Brr, the Void, the ghost train or Sherwood survives on the public page.

## Direction contract

THESIS: The page is a toy. The first viewport is MUNCH's retail blister pack; scrolling lifts the handheld out of the blister and dives into its LCD, where the live pet, its hunger, its feedings and its log are shown as the device's own menus; the box then flips to its printed back for the story, and MUNCH eats the screen at the end. It refuses the dark crypto hero (counter, CA box, stat cards) and the neon retro-arcade costume.

OWN-WORLD: Tangerine translucent plastic and printed cardboard (shell #ff7a2f family) with deep plum ink outlines; a grey-green reflective LCD (#c4cfa1) with ink pixels and ghost-pixel grid; bubblegum-pink device buttons for the primary action; candy sky-blue for the snack jar. Bagel Fat One embossed on plastic, DotGothic16 for everything shown on the LCD, Gabarito for explanation, JetBrains Mono for addresses. Pixel sprites drawn as crisp SVG grids; stepped motion.

STORY: The visitor sees the live eaten total and % of supply on the pet's LCD inside the pack, takes CA and BUY $MUNCH from the pack's action strip, dives into the screen, learns MUNCH evolves with real % burned (egg, munchlet, chomper, MUNCH) and where it stands now, follows one feeding (hunger fills, auto-feeder claims, buys, MUNCH eats at 0x…dEaD, or the snack jar), reads every meal with its tx, checks the pet's live status, reads the back of the box, and is eaten into the close.

FIRST VIEWPORT: A tangerine cardboard backer card filling the viewport, die-cut hang tab at top. MUNCH logo embossed huge across the top. Centre: a clear plastic blister holding the pixel egg-shaped handheld; its LCD shows the pet sprite at its real stage, EATEN total, % gone, and the hunger bar. Printed callouts with arrows either side of the blister. Bottom action strip printed on the card: CA field, pink BUY $MUNCH button, "feed it" toy button. Phones: logo, device, BUY + CA above the fold, callouts below.

FORM: Toy retail packaging + virtual-pet LCD menus (user-pinned lore: Tamagotchi-style pet, pixel, with character), position 1 on the ordered list. seed: none (user-pinned lore; the direction roll was not run because the user chose the world in a structured question before the build). Signature interactions: pinned zoom from blister into the LCD; pinned horizontal evolution track with the live "MUNCH is here" marker; sticky LCD icon menu that tracks the chapter; box flip to the back; finale mouth swallow.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
