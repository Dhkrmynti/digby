/**
 * Renders the $DIGBY X kit from the site's own sprites. Open with ?shot=logo|banner|og
 * at the matching window size and screenshot it (see ../caption.md).
 */
import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/pixelify-sans/500.css';
import '@fontsource/pixelify-sans/700.css';
import '@fontsource/silkscreen/400.css';
import { GROUND, digbySprite, drawScene, ghostSprite, layoutFor, ripBubble } from '../../src/components/digby/canvas';
import { PAL } from '../../src/components/digby/pixels';

const SCENE = { stage: 3, lantern: 0.75, graves: 5, newGraveAt: -999, digging: false, burial: null, pokedAt: -99, ghosts: 0 };

function Pixels({ w, h, scale, draw, style }: { w: number; h: number; scale: number; draw: (ctx: CanvasRenderingContext2D) => void; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
  });
  return <canvas ref={ref} width={w} height={h} style={{ width: w * scale, height: h * scale, imageRendering: 'pixelated', display: 'block', ...style }} />;
}

/** A square night with Digby standing in it, 50×50 art pixels. */
function portrait(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAL.sky0;
  ctx.fillRect(0, 0, 50, 50);
  ctx.fillStyle = PAL.sky1;
  ctx.fillRect(0, 20, 50, 12);
  ctx.fillStyle = PAL.sky2;
  ctx.fillRect(0, 32, 50, 12);
  for (let x = 0; x < 50; x += 2) {
    ctx.fillStyle = PAL.sky1;
    ctx.fillRect(x, 19, 1, 1);
    ctx.fillStyle = PAL.sky2;
    ctx.fillRect(x + 1, 31, 1, 1);
  }
  ctx.fillStyle = PAL.star;
  [[5, 6], [12, 13], [22, 4], [30, 15], [44, 24], [3, 24], [26, 26]].forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
  ctx.fillStyle = PAL.moon;
  for (let dy = -5; dy <= 5; dy++) {
    const half = Math.floor(Math.sqrt(25 - dy * dy));
    ctx.fillRect(39 - half, 11 + dy, half * 2 + 1, 1);
  }
  ctx.fillStyle = PAL.moonS;
  ctx.fillRect(37, 9, 2, 1);
  ctx.fillRect(40, 13, 1, 1);
  ctx.fillStyle = PAL.fence;
  ctx.fillRect(0, 36, 50, 1);
  for (let x = 1; x < 50; x += 6) ctx.fillRect(x, 34, 1, 10);
  ctx.fillStyle = PAL.grassH;
  ctx.fillRect(0, 44, 50, 1);
  ctx.fillStyle = PAL.grass;
  ctx.fillRect(0, 45, 50, 1);
  ctx.fillStyle = PAL.dirt;
  ctx.fillRect(0, 46, 50, 4);
  ctx.drawImage(digbySprite(3, { p: 'idle' }), 8, 14);
}

function ghostAt(ctx: CanvasRenderingContext2D, x: number, y: number, f: number) {
  ctx.globalAlpha = 0.85;
  ctx.drawImage(ghostSprite(f), x, y);
  ctx.globalAlpha = 1;
}

const title: CSSProperties = { fontFamily: '"Pixelify Sans", monospace', fontWeight: 700, color: PAL.bone, margin: 0, lineHeight: 0.92, textShadow: `0.05em 0.05em 0 ${PAL.hood}, 0.1em 0.1em 0 ${PAL.ol}` };
const sub: CSSProperties = { fontFamily: '"Pixelify Sans", monospace', fontWeight: 500, color: PAL.bone, margin: 0 };
const tag: CSSProperties = { fontFamily: 'Silkscreen, monospace', color: PAL.eye, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' };

function Logo() {
  return <Pixels w={50} h={50} scale={20} draw={portrait} />;
}

function Banner() {
  // 300×96 art pixels at 5× is 1500×480; the sky carries on above
  return (
    <div style={{ position: 'relative', width: 1500, height: 500, background: PAL.sky0, overflow: 'hidden' }}>
      <Pixels w={300} h={96} scale={5} draw={(ctx) => {
          drawScene(ctx, 300, 3, SCENE);
          ghostAt(ctx, 196, 22, 0);
          ghostAt(ctx, 226, 40, 1);
        }} style={{ position: 'absolute', left: 0, bottom: 0 }} />
      <div style={{ position: 'absolute', left: 64, top: 58 }}>
        <p style={{ ...tag, fontSize: 20 }}>$DIGBY · keeper of 0x…dEaD</p>
        <p style={{ ...title, fontSize: 120, marginTop: 14 }}>DIGBY</p>
        <p style={{ ...sub, fontSize: 38, marginTop: 14 }}>He buries the supply.</p>
      </div>
    </div>
  );
}

function Og() {
  // 240×96 at 5× is 1200×480, under a 150px band for the words
  return (
    <div style={{ position: 'relative', width: 1200, height: 630, background: PAL.sky0, overflow: 'hidden' }}>
      <Pixels
        w={240}
        h={96}
        scale={5}
        draw={(ctx) => {
          drawScene(ctx, 240, 3, SCENE);
          ghostAt(ctx, 150, 16, 0);
          ghostAt(ctx, 172, 36, 1);
          ripBubble(ctx, layoutFor(240).dx + 22, GROUND - 38);
        }}
        style={{ position: 'absolute', left: 0, bottom: 0 }}
      />
      <div style={{ position: 'absolute', left: 56, top: 44 }}>
        <p style={{ ...tag, fontSize: 20 }}>$DIGBY on Robinhood Chain</p>
        <p style={{ ...title, fontSize: 112, marginTop: 12 }}>DIGBY</p>
        <p style={{ ...sub, fontSize: 32, marginTop: 14, maxWidth: 560, lineHeight: 1.15 }}>He buries the supply. Nothing comes back up.</p>
      </div>
    </div>
  );
}

const shot = new URLSearchParams(location.search).get('shot') ?? 'og';
const View = shot === 'logo' ? Logo : shot === 'banner' ? Banner : Og;
ReactDOM.createRoot(document.getElementById('root')!).render(<View />);
