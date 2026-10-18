# DIGBY ($DIGBY) · X kit

| File | Pakai untuk |
|---|---|
| 01-logo-x.png (1000×1000), 01-logo-x-400.png | Foto profil X (Digby stage 3, aman buat crop bulat) |
| 02-banner-x.png (1500×500) | Header X (pojok kiri bawah dikosongin buat avatar) |
| 03-link-preview.png (1200×630) | Gambar preview link; versi yang sama ada di `public/og-image.png` |

Semua gambar dirender dari sprite yang sama dengan situs (`src/components/digby/pixels.ts` dan `canvas.ts`), lewat halaman `render/`. Cara render ulang:

1. `npm run dev` di root proyek.
2. Buka `http://localhost:5173/konten-x/render/index.html?shot=logo` (atau `banner`, `og`) dengan ukuran jendela yang pas (1000×1000, 1500×500, 1200×630), lalu screenshot. Chrome headless: `chrome --headless=new --window-size=1200,630 --screenshot=out.png <url>`.
3. Favicon: `npx tsx konten-x/render/mark.ts` (nulis `public/digby-mark.svg`).

Kit MUNCH yang lama dipindah ke `../arsip-konten/munch-x/`.

Catatan: X butuh URL absolut untuk `og:image`. Setelah domain ada, ganti `/og-image.png` di `index.html` jadi `https://<domain>/og-image.png`.

## Bio X
Digby keeps the graveyard at 0x…dEaD. Every $DIGBY trade lights his lantern; the night shift buys $DIGBY back and Digby buries it. Nothing comes back up.

## Post: perkenalan (pinned)
Every token ever sent to 0x…dEaD had to go somewhere.

Digby is the one who puts it there.

Every $DIGBY trade lights his fee lantern → the night shift buys $DIGBY → Digby buries it. One grave per burial. Nothing comes back up.
Every other shift pays his wages, in the open.

He levels up as the supply goes in the ground: Night Shift → Iron Spade → Lanternbearer → Keeper → The Undertaker.

## Post: lentera hampir penuh
The lantern is at [XX]%.

When it hits 0.01 ETH the night shift claims it, buys $DIGBY and hands Digby the shovel.

## Post: setelah burial pertama
RIP.

Grave #1 is up. Digby buried [JUMLAH] $DIGBY.
tx: [LINK TX]

Another one for the ground.

## Post: naik stage
Digby hit [X]% of the supply in the ground.

New gear: [GEAR]. Stage [N]: [NAMA STAGE].
