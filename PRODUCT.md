# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose

VOID ($VOID) is a memecoin on Robinhood Chain (chain ID 4663, Pons Family v2) with an autonomous buyback-and-burn engine. Trading generates creator fees in ETH that accumulate in a Fee Escrow. When the escrow passes the claim threshold, a 24/7 bot claims the fees and, on burn cycles, market-buys the token on the DEX (Pons curve before graduation, Uniswap v4 after) and sends it to `0x000000000000000000000000000000000000dEaD`. Cycles alternate: odd cycles burn, even cycles keep (fees go to the creator/treasury wallet). See `useBurnEngine` and `bot/pons-burn-bot.ts`.

The public website is a read-only tracker and landing page. A hidden `/memex` route is the operator admin panel.

This project is a separate copy of the BLAZE site (`../mburn-2`); BLAZE stays live and untouched.

## Users

- **Primary:** crypto traders and memecoin buyers on Robinhood Chain deciding whether to buy, usually arriving from X/Telegram on a phone or desktop. Their job: verify the burn is real, copy the CA, buy.
- **Secondary:** existing holders ("Observers") checking that falls keep happening.
- **Operator:** the creator, using `/memex` to configure the engine.

## Positioning

The first viewport must prove the burn is real: the live fallen total, the share of supply gone, and the primary Buy action sit in the first view. Lore supports the proof. Tone: deadpan, cosmic, a little ominous.

## Lore & terminology (confirmed 2026-10-10, replaces Mort's Ghost Train and Sherwood)

- Name and ticker: **Black Void ($VOID)**. Domain: **blackvoid.fun** (confirmed 2026-10-10). Tagline: "Everything falls in."
- Story: every token ever sent to 0x…dEaD piled up until the address collapsed into a black hole, catalogued **dEaD-1** and nicknamed **the Void**. **Deadsky Observatory** watches it; its night bot, **the Watcher**, feeds it. The Void speaks rarely ("more.").
- Fee Escrow → **the accretion disk**; claim threshold → **critical mass**; claim → **the pull**; buyback → **the feed**; burn → **falls in / crosses the horizon**; dead address → **the event horizon**; cycles → **orbits** (odd orbit: falls in; even orbit: **observatory fuel**); burn log → **the observing log**; holders → **Observers**; the bot → **the Watcher**.
- Keep cycles are shown openly as observatory fuel, never hidden.
- The CA comes from the bot / admin panel as before.

## Constraints

- Change UI and lore copy only. Never change backend, bot, hooks (`useBurnEngine`), web3 utils, contracts, thresholds, features, handlers, data flow, or tokenomics.
- Existing tokenomics claims ("0% TAX", "LP LOCKED", "100% BURN", "Zero team allocation") belong to the user. "100% BURN" contradicts the keep cycles; the user was asked on 2026-10-07 and chose to keep the line as is. Do not raise it again or rewrite it unasked.
- Persisted data keys (`burnedJollyburn`, `burnedMuseburn`, `burnedIncinerator`, `jollyburn_*` storage keys) must stay readable.

## Open decisions

- X account: `@blackvoidrh` (https://x.com/blackvoidrh), confirmed 2026-10-10.
- Final CA for the new token.
