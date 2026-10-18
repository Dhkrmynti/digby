---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/digby"]
---
# Surface: public landing + live burn tracker (src/App.tsx)

Mode: Persuade. Visitors arrive from X/Telegram (phone first), want to verify the burn is real, copy the CA, and buy. Brand: DIGBY ($DIGBY), a hooded skeleton gravedigger who keeps the pixel graveyard at 0x…dEaD and buries every bought-back $DIGBY. Tone: grumpy, deadpan, a little cosy ("another one for the ground."). Wage runs shown openly as "Digby's wages" (project wallet).

Constraints: UI and lore only. useBurnEngine, web3 utils, contracts, bot, /memex logic, thresholds and data flow stay untouched. Persisted ledger keys stay readable. Nothing of MUNCH, Lava Pit, the Void, the ghost train or Sherwood survives on the public page.

## Direction contract
THESIS: The page is the graveyard and the ground under it. The first viewport is the live yard; scrolling sinks the camera below the grass and the page continues underground, then comes back up into the night for the register, turns to parchment for the story, and ends under the moon.
OWN-WORLD: night sky violet-black, wet dirt browns, grey stone with moss, Digby's hood violet, one ecto-green light for live and actionable things. Pixelify Sans, Silkscreen, Atkinson Hyperlegible, JetBrains Mono. All art built in code (src/components/digby/pixels.ts), canvas at 1× scaled pixelated.
FIRST VIEWPORT: the live graveyard canvas (headstones = real burials, lantern = fee escrow, Digby digs when the engine runs), wordmark in the sky; under the grass the buried total, % of supply, graves, lantern, Buy, Chart, CA, Poke Digby.
SIGNATURE MOTION: the descent below the grass; the shaft with the falling coin lighting each step; headstones and stage cards rising out of the ground; the parchment unrolling; the closing line dropping word by word. All stepped.
