/**
 * Hex, the witch cat. Original character: round head, an oversized patched
 * hat, half-lidded yellow eyes, one tiny fang, a wooden spoon. `stir` (deg)
 * swings the spoon arm for frame-driven renders; on the site CSS animates it.
 */
interface HexProps {
  stir?: number;
  /** show the arm and spoon */
  spoon?: boolean;
  /** how far the lids droop (0 open, 1 nearly shut) */
  bored?: number;
  viewBox?: string;
  className?: string;
  title?: string;
  still?: boolean;
}

const C = {
  fur: '#1f1a1a',
  furLight: '#332b2b',
  furEdge: '#0f0b0b',
  ear: '#5a2a2a',
  eye: '#ffd23f',
  eyeDeep: '#e0a800',
  nose: '#ff8fb1',
  fang: '#fff6e6',
  hat: '#630000',
  hatDark: '#4a0000',
  band: '#EDEBDD',
  patch: '#7a4a2a',
  stitch: '#EDEBDD',
  spoon: '#a8693a',
  spoonDark: '#6e4021',
};
const INK = { stroke: '#0b0710', strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function Hex({ stir, spoon = true, bored = 0.5, viewBox = '0 0 500 560', className, title, still = false }: HexProps) {
  const lid = 14 + Math.max(0, Math.min(1, bored)) * 12;
  return (
    <svg viewBox={viewBox} overflow="visible" className={`${className ?? ''}${still ? '' : ' hex-alive'}`} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {/* tail, curling up behind */}
      <path className="hex-tail" style={{ transformOrigin: '330px 500px' }} d="M330 500 C420 500 450 420 420 360 C400 320 360 330 372 360" fill="none" stroke={C.furEdge} strokeWidth="34" strokeLinecap="round" />
      <path className="hex-tail" style={{ transformOrigin: '330px 500px' }} d="M330 500 C420 500 450 420 420 360 C400 320 360 330 372 360" fill="none" stroke={C.fur} strokeWidth="26" strokeLinecap="round" />

      {/* body: a loaf, sitting */}
      <path d="M150 556 C130 470 160 380 250 372 C340 380 370 470 350 556 Z" fill={C.fur} {...INK} />
      <path d="M200 556 C196 500 214 440 250 432 C286 440 304 500 300 556 Z" fill={C.furLight} opacity="0.55" />
      <ellipse cx="200" cy="552" rx="34" ry="14" fill={C.fur} {...INK} />
      <ellipse cx="300" cy="552" rx="34" ry="14" fill={C.fur} {...INK} />

      {/* head */}
      <path d="M150 196 L134 92 L214 150 Z" fill={C.fur} {...INK} />
      <path d="M160 178 L152 120 L198 152 Z" fill={C.ear} />
      <path d="M350 196 L366 92 L286 150 Z" fill={C.fur} {...INK} />
      <path d="M340 178 L348 120 L302 152 Z" fill={C.ear} />
      <ellipse cx="250" cy="250" rx="128" ry="112" fill={C.fur} {...INK} />
      <ellipse cx="216" cy="196" rx="54" ry="26" fill={C.furLight} opacity="0.5" />

      {/* eyes: big, yellow, unimpressed */}
      <g>
        <ellipse cx="200" cy="248" rx="34" ry="30" fill={C.eye} {...INK} strokeWidth={3.5} />
        <ellipse cx="300" cy="248" rx="34" ry="30" fill={C.eye} {...INK} strokeWidth={3.5} />
        <ellipse cx="204" cy="256" rx="8" ry="16" fill="#120b0c" />
        <ellipse cx="304" cy="256" rx="8" ry="16" fill="#120b0c" />
        <circle cx="194" cy="250" r="4" fill="#fff" opacity="0.9" />
        <circle cx="294" cy="250" r="4" fill="#fff" opacity="0.9" />
        {/* the lids */}
        <path className="hex-lid" style={{ transformOrigin: '200px 218px' }} d={`M164 248 C164 214 236 214 236 248 L236 ${218 + lid} Z`} fill={C.fur} />
        <path className="hex-lid" style={{ transformOrigin: '300px 218px' }} d={`M264 248 C264 214 336 214 336 248 L336 ${218 + lid} Z`} fill={C.fur} />
        <path d={`M164 ${232 + lid * 0.5} C190 ${224 + lid * 0.6} 214 ${224 + lid * 0.6} 236 ${236 + lid * 0.4}`} fill="none" {...INK} strokeWidth={5} />
        <path d={`M264 ${236 + lid * 0.4} C286 ${224 + lid * 0.6} 310 ${224 + lid * 0.6} 336 ${232 + lid * 0.5}`} fill="none" {...INK} strokeWidth={5} />
      </g>

      {/* nose, mouth, one fang */}
      <path d="M242 286 L258 286 L250 296 Z" fill={C.nose} {...INK} strokeWidth={2.5} />
      <path d="M250 296 C246 308 232 310 226 302 M250 296 C254 308 268 310 274 302" fill="none" {...INK} strokeWidth={3.5} />
      <path d="M260 305 L264 318 L268 305 Z" fill={C.fang} stroke="#0b0710" strokeWidth="2" strokeLinejoin="round" />
      {/* whiskers */}
      <path d="M150 284 L96 274 M152 298 L98 304 M350 284 L404 274 M348 298 L402 304" stroke={C.stitch} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* the hat: oversized, bent tip, patched */}
      <g>
        <ellipse cx="250" cy="162" rx="176" ry="34" fill={C.hatDark} {...INK} />
        <path d="M150 158 C170 110 200 60 238 22 C262 -2 300 -8 318 10 C296 6 282 22 286 44 C292 80 330 120 350 158 Z" fill={C.hat} {...INK} />
        <path d="M156 146 C210 162 290 162 344 146 L350 158 C290 176 210 176 150 158 Z" fill={C.band} {...INK} strokeWidth={3} />
        <rect x="230" y="144" width="40" height="26" rx="5" fill="none" stroke="#e8b54a" strokeWidth="6" />
        <path d="M262 74 L304 82 L298 120 L256 112 Z" fill={C.patch} {...INK} strokeWidth={3} />
        <path d="M266 86 L272 84 M268 98 L274 96 M290 88 L296 90 M288 104 L294 106" stroke={C.stitch} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="200" cy="96" r="5" fill={C.band} opacity="0.8" />
        <circle cx="224" cy="60" r="3.5" fill={C.band} opacity="0.7" />
      </g>

      {/* arm and spoon: the paw over the rim, the spoon down into the brew */}
      {spoon ? (
        <g className="hex-stir" style={{ transformOrigin: '330px 420px', transform: stir !== undefined ? `rotate(${stir}deg)` : undefined }}>
          <path d="M330 420 C362 404 388 380 404 356" fill="none" stroke="#0b0710" strokeWidth="40" strokeLinecap="round" />
          <path d="M330 420 C362 404 388 380 404 356" fill="none" stroke={C.fur} strokeWidth="32" strokeLinecap="round" />
          <path d="M404 352 L560 444" stroke={C.spoonDark} strokeWidth="16" strokeLinecap="round" />
          <path d="M404 352 L560 444" stroke={C.spoon} strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="404" cy="356" rx="22" ry="18" fill={C.fur} {...INK} />
          <path d="M392 350 L392 360 M404 346 L404 358 M416 350 L416 360" stroke="#0b0710" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}
