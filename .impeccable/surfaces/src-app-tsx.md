---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: public landing + live burn tracker (src/App.tsx)

Mode: Persuade. Visitors arrive from X/Telegram (phone first), want to verify the burn is real, copy the CA, and buy. Brand: VOID ($VOID). Lore: every token ever sent to 0x…dEaD piled up until the address collapsed into a black hole, catalogued dEaD-1 and nicknamed the Void. Deadsky Observatory watches it; its night bot, the Watcher, feeds it. Tone: deadpan, cosmic, a little ominous. Keep cycles shown openly as "observatory fuel".

Constraints: UI and lore only. useBurnEngine, web3 utils, contracts, bot, /memex logic, thresholds and data flow stay untouched. Persisted ledger keys stay readable. Nothing of the ghost train or Sherwood survives.

## Direction contract
THESIS: The site is Deadsky Observatory's night shift on dEaD-1. A strip-chart recorder unspools down the page as you scroll; its pen traces the hole's signal and every burn is a spike annotated by the observer's red pen. It refuses the dark crypto hero with counter, CA box and stat cards, and refuses the generic space-neon template.
OWN-WORLD: Control-room night (blue-black) holding pale chart paper ruled in recorder orange. Blue-black pen trace, red marker annotations in a hand, amber photon ring that brightens only with live accretion. Condensed instrument display type, plain grotesk text, mono for readings, a marker hand for notes. Meters with ballistic needles.
STORY: The visitor sees the live fallen total written inside the hole's shadow, takes the CA and BUY $VOID under it, reads the accretion meter, follows one orbit through disk, critical mass, the pull, the feed and the fork (odd: falls in; even: observatory fuel), reads every fall as a spike on the observing log with its tx, inspects the Watcher's wiring, and ends inside the dark.
FIRST VIEWPORT: Night field. A canvas black hole sits centred at about 64svh: black shadow, amber photon ring, tilted disk with lensed arc. Inside the shadow, the live fallen $VOID total in large condensed numerals with % of supply. VOID set huge behind/above. Under the hole: tagline, CA and the BUY $VOID action. Left margin: a chart-paper slip of observer notes (dead address, falls, supply). Right margin: the accretion meter slip with a VU needle at critical-mass fraction and next orbit named. On phones the hole is full width and BUY sits above the fold.
FORM: Radio-observatory strip-chart recorder and observing log, position 4 on the ordered list, seed key 0823a40b. Signature interaction: pinned orbit sequence where the black hole's disk fills, pulls and feeds as you scroll; then the observing-log strip whose pen trace draws with scroll, spiking at each real burn. Raises: ballistic needle with overshoot (vu-meter bridge), hand annotations with drawn arrows (zine), dense data band against empty sky (obi sleeve).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
