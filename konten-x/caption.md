# DIGBY ($DIGBY) · X kit

Semua gambar dan video dirender dari sprite yang sama dengan situs (`src/components/digby/`), lewat Remotion studio (`studio/src/digby/`). Jadi Digby di postingan sama persis dengan yang di web.

| File | Pakai untuk |
|---|---|
| 01-logo-x.png (1000×1000), 01-logo-x-400.png | Foto profil X (aman buat crop bulat) |
| 02-banner-x.png (1500×500) | Header X: kuburan sebelum launch, plot #1 udah digali (pojok kiri bawah aman buat avatar) |
| 03-link-preview.png (1200×630) | Preview link; versi yang sama ada di `public/og-image.png` |
| 04-prelaunch.mp4 (1080×1350, 15 dtk) | Video teaser sebelum launch |
| 05-launch.gif (720×720, loop) | Postingan launch: burial pertama, plot #1 jadi grave #1. CA ditaruh di caption |
| 06-hook-cara-kerja.png (1080×1350) | Hook: cara kerja burn dalam 4 langkah |
| 07-hook-stage.png (1600×900) | Hook: 5 tahap Digby, ngajak orang nebak tahap mana yang kebuka duluan |
| 08-hook-meme-no-refunds.png (1080×1080) | Meme: "sold your $DIGBY?" / "no refunds down here." |
| 09-template-rip.png (1080×1350) | Template tiap burial asli: isi jumlah dan tx, render ulang (lihat di bawah) |
| 10-hook-underground.mp4 (1080×1350, 11 dtk) | Hook: makam bertambah, kamera turun ke bawah tanah, satu peti per makam. Ada label "illustration" |

## Render ulang
```
cd konten-x/studio
npm ci
npx remotion still DigbyRip ../09-rip-grave-3.png --props='{"amount":"4,120,330","grave":3,"tx":"0xabc..."}'
npx remotion render DigbyPrelaunch ../04-prelaunch.mp4
npx remotion render DigbyLaunchGif ../05-launch.gif --codec=gif
```
Komposisi lain: `DigbyLogo`, `DigbyBanner`, `DigbyUnderground`, `DigbyHowItWorks`, `DigbyStages`, `DigbyNoRefunds`. Buka `npm run dev` buat lihat semuanya di Remotion Studio (folder "Digby").

Situs: https://digbyyard.fun. `og:image` di `index.html` udah pakai URL absolut `https://digbyyard.fun/og-image.png` (X butuh URL absolut).

---

## Batas karakter X
Post maksimal **280**, bio maksimal **160** (akun tanpa Premium). Cara X ngitung:
- Huruf, angka, tanda baca biasa: 1. Emoji dan beberapa simbol (misalnya `…`, `→`): 2.
- Link apa pun (termasuk `digbyyard.fun`) selalu dihitung 23, berapapun panjangnya.
- CA (alamat 0x…, 42 karakter) dihitung 42.

Angka di tiap judul di bawah udah dihitung dengan aturan itu, dalam kondisi terburuk (placeholder dihitung sepanjang isi aslinya). Kalau ngedit caption, jalanin `python hitung-caption.py` buat ngecek ulang.

## Bio X (146/160)
Digby keeps the graveyard at 0x…dEaD. Every $DIGBY trade lights his lantern; the bot buys $DIGBY back and Digby buries it. Nothing comes back up.

Kolom website di profil: digbyyard.fun

## Urutan posting yang aku saranin
1. **Beberapa hari sebelum launch:** ganti logo + banner, pin `04-prelaunch.mp4`.
2. **Selang-seling sebelum launch:** `06-hook-cara-kerja.png`, `07-hook-stage.png`, `08-hook-meme-no-refunds.png`, `10-hook-underground.mp4`.
3. **Saat launch:** `05-launch.gif` dengan CA di caption, terus pin.
4. **Tiap burial asli:** `09-template-rip.png` diisi jumlah dan tx-nya.

---

## Post: prelaunch (04-prelaunch.mp4, pin) (269/280)
Every token ever sent to 0x…dEaD had to go somewhere.

Somebody has to bury it.

Meet Digby. Every $DIGBY trade lights his lantern. When it's full, the bot buys $DIGBY back and Digby buries it. Nothing comes back up.

Plot #1 is dug. Launching soon on Robinhood Chain.

## Post: launch (05-launch.gif) (221/280)
$DIGBY is live.

Every trade lights the lantern. The bot buys $DIGBY back. Digby buries it at 0x…dEaD.

Plot #1 is waiting for its first headstone.

CA: [CA]

digbyyard.fun

## Post: cara kerja (06-hook-cara-kerja.png) (250/280)
How a $DIGBY trade becomes a grave:

1. You trade. A small fee lights the lantern.
2. The night shift claims it when it's full.
3. It buys $DIGBY on the open market.
4. Digby buries it at 0x…dEaD.

Every other shift pays Digby's wages. All on chain.

## Post: tahap (07-hook-stage.png) (199/280)
Digby levels up as the supply goes underground.

Night Shift, Iron Spade, Lanternbearer, Keeper, The Undertaker.

Unlocks at 0.5%, 1%, 2.5% and 5% of the supply buried.

Which one do we unlock first?

## Post: meme (08-hook-meme-no-refunds.png) (49/280)
sold your $DIGBY?

Digby: "no refunds down here."

## Post: underground (10-hook-underground.mp4) (125/280)
Every burial is a coffin under the yard.

The more you trade, the deeper Digby digs. Nothing he buries comes back up.

$DIGBY

## Post: tiap burial (09-template-rip.png) (134/280)
RIP.

Grave #[N] is up. Digby buried [JUMLAH] $DIGBY.
tx: [LINK TX]

Another one for the ground.

## Post: naik stage (163/280)
[X]% of the $DIGBY supply is in the ground.

Digby just unlocked stage [N]: [NAMA STAGE]. New gear: [GEAR].
