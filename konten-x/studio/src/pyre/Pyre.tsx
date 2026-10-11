import { useId } from 'react';

/**
 * Pyre, the ape, after the creator's own drawing: grey fur, tan face, heavy
 * sleepy lids, a big muzzle and a pout, inked by hand. `char` (0–1) singes
 * him, `flame` (0–1) sizes the lighter flame.
 */
interface PyreProps {
  char?: number;
  flame?: number;
  /** show the hand and lighter (legacy) */
  lighter?: boolean;
  /** what he holds: a torch (cave), a lighter, or nothing */
  hold?: 'torch' | 'lighter' | 'none';
  /** arms raised for the dance around the fire */
  arms?: 'down' | 'up';
  /** full body (torso and legs, for the dance) or the portrait bust */
  body?: 'bust' | 'full';
  /** frame-driven swing (degrees) for renders where CSS animation does not run */
  armSwing?: number;
  legSwing?: number;
  /** fur body (cave) or the plain hoodie */
  outfit?: 'fur' | 'hoodie';
  viewBox?: string;
  className?: string;
  title?: string;
  still?: boolean;
}

const C = {
  fur: '#8a8580',
  furShade: '#6c6762',
  skin: '#e3bd8f',
  skinShade: '#c99c6c',
  eye: '#f4efe4',
  ink: '#1d1a17',
  hoodie: '#2b2621',
  hoodieLine: '#4a423a',
  fire: '#ff5a1f',
  flame: '#ffb347',
  flameCore: '#fff3c4',
  metal: '#b9b2a6',
};

const INK = { stroke: C.ink, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function Pyre({ char = 0, flame = 0.6, lighter = true, hold, arms = 'down', body = 'bust', armSwing, legSwing, outfit = 'fur', viewBox = '0 0 500 500', className, title, still = false }: PyreProps) {
  const holding = hold ?? (lighter ? 'torch' : 'none');
  const id = useId().replace(/:/g, '');
  const c = Math.max(0, Math.min(1, char));
  const f = 0.5 + Math.max(0, Math.min(1, flame)) * 0.7;

  return (
    <svg viewBox={viewBox} className={`${className ?? ''}${still ? '' : ' pyre-alive'}`} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={C.flame} stopOpacity="0.75" />
          <stop offset="1" stopColor={C.flame} stopOpacity="0" />
        </radialGradient>
      </defs>

      {body === 'full' ? (
        <>
          {/* legs and torso, under the shoulders */}
          <g className="pyre-leg-l" style={{ transformOrigin: '190px 560px', transform: legSwing !== undefined ? `rotate(${legSwing}deg)` : undefined }}>
            <path d="M176 556 C166 592 156 612 146 626 L204 632 C210 612 212 590 212 560 Z" fill={C.fur} {...INK} />
            <ellipse cx="166" cy="632" rx="34" ry="13" fill={C.skin} {...INK} />
          </g>
          <g className="pyre-leg-r" style={{ transformOrigin: '310px 560px', transform: legSwing !== undefined ? `rotate(${-legSwing}deg)` : undefined }}>
            <path d="M324 556 C334 592 344 612 354 626 L296 632 C290 612 288 590 288 560 Z" fill={C.fur} {...INK} />
            <ellipse cx="334" cy="632" rx="34" ry="13" fill={C.skin} {...INK} />
          </g>
          <path d="M112 460 C100 530 128 580 180 590 L320 590 C372 580 400 530 388 460 Z" fill={C.fur} {...INK} />
          <ellipse cx="250" cy="530" rx="72" ry="52" fill={C.skin} {...INK} strokeWidth={3} />
        </>
      ) : null}
      {arms === 'up' ? (
        <>
          {/* arms up: drawn behind the head, waving from the shoulders */}
          <g className="pyre-arm-l" style={{ transformOrigin: '150px 440px', transform: armSwing !== undefined ? `rotate(${armSwing}deg)` : undefined }}>
            <path d="M150 440 C118 384 100 322 108 258" stroke={C.ink} strokeWidth="44" strokeLinecap="round" fill="none" />
            <path d="M150 440 C118 384 100 322 108 258" stroke={C.fur} strokeWidth="36" strokeLinecap="round" fill="none" />
            <circle cx="106" cy="244" r="22" fill={C.skin} {...INK} />
          </g>
          <g className="pyre-arm-r" style={{ transformOrigin: '350px 440px', transform: armSwing !== undefined ? `rotate(${-armSwing}deg)` : undefined }}>
            <path d="M350 440 C382 384 400 322 392 258" stroke={C.ink} strokeWidth="44" strokeLinecap="round" fill="none" />
            <path d="M350 440 C382 384 400 322 392 258" stroke={C.fur} strokeWidth="36" strokeLinecap="round" fill="none" />
            <circle cx="394" cy="244" r="22" fill={C.skin} {...INK} />
          </g>
        </>
      ) : null}
      {outfit === 'hoodie' ? (
        <>
          <path d="M78 500 C88 438 150 404 212 398 L292 398 C354 404 414 438 424 500 Z" fill={C.hoodie} {...INK} />
          <path d="M196 404 C214 440 290 440 308 404" stroke={C.hoodieLine} strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* shoulders and chest, all fur */}
          {body === 'full' ? (
            <>
              <path d="M78 500 C86 440 146 402 214 396 L290 396 C358 402 418 440 426 500 C410 530 380 520 388 470 L112 470 C120 520 92 530 78 500 Z" fill={C.fur} />
              <path d="M78 500 C86 440 146 402 214 396 L290 396 C358 402 418 440 426 500" fill="none" {...INK} />
            </>
          ) : (
            <path d="M78 500 C86 440 146 402 214 396 L290 396 C358 402 418 440 426 500 Z" fill={C.fur} {...INK} />
          )}
          <path d="M206 420 C226 470 280 470 300 420 C292 452 268 476 252 478 C236 476 214 452 206 420 Z" fill={C.skin} {...INK} strokeWidth={3} />
          <path d="M120 470 L132 452 M150 448 L158 430 M352 448 L346 430 M384 470 L374 452" stroke={C.furShade} strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {/* long neck */}
      <path d="M214 318 L206 412 Q252 428 300 412 L292 312 Z" fill={C.fur} {...INK} />
      <path d="M222 352 L218 392 M282 348 L286 388" stroke={C.furShade} strokeWidth="3" strokeLinecap="round" />

      {/* far ear */}
      <path d="M352 214 C384 196 414 216 410 252 C406 286 376 300 350 288" fill={C.fur} {...INK} />
      <path d="M360 228 C382 222 396 238 392 256 C388 274 372 280 358 274" fill={C.skin} {...INK} strokeWidth={3} />

      {/* head */}
      <path d="M178 196 C186 136 236 104 290 108 C344 112 376 158 372 214 C370 250 360 280 344 300 L214 312 C190 290 174 248 178 196 Z" fill={C.fur} {...INK} />
      {/* the tuft */}
      <path d="M268 112 L284 86 L290 108 L306 84 L308 112 L324 96" fill="none" {...INK} strokeWidth={3.5} />
      <path d="M200 160 C214 142 232 134 250 132 M332 150 C344 160 352 176 354 190" stroke={C.furShade} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* near ear */}
      <path d="M190 210 C150 186 110 210 116 254 C122 296 160 310 196 290" fill={C.fur} {...INK} />
      <path d="M182 226 C156 214 134 232 138 258 C142 282 164 290 186 280" fill={C.skin} {...INK} strokeWidth={3} />
      <path d="M170 238 C158 238 152 252 160 264" fill="none" {...INK} strokeWidth={3} />

      {/* face: brow and cheeks */}
      <path d="M222 214 C238 196 270 196 290 206 C304 196 336 194 352 210 C362 226 356 250 344 262 L230 268 C216 252 212 230 222 214 Z" fill={C.skin} {...INK} />

      {/* heavy, sleepy lids */}
      <g>
        <ellipse cx="254" cy="236" rx="22" ry="12" fill={C.eye} {...INK} strokeWidth={3} />
        <ellipse className="pyre-pupil" cx="256" cy="242" rx="7" ry="5" fill={C.ink} />
        <path className="pyre-lid" d="M230 240 C234 222 274 220 278 240 Z" fill={C.skin} />
        <path d="M228 241 C238 234 268 233 280 240" fill="none" {...INK} strokeWidth={5} />
        <path d="M236 254 C246 258 262 258 272 254" fill="none" stroke={C.skinShade} strokeWidth="3" strokeLinecap="round" />

        <ellipse cx="320" cy="232" rx="20" ry="11" fill={C.eye} {...INK} strokeWidth={3} />
        <ellipse className="pyre-pupil" cx="322" cy="238" rx="6.5" ry="4.5" fill={C.ink} />
        <path className="pyre-lid" d="M298 236 C302 219 338 218 342 236 Z" fill={C.skin} />
        <path d="M296 237 C306 230 332 229 344 236" fill="none" {...INK} strokeWidth={5} />
        <path d="M304 249 C312 253 328 253 336 249" fill="none" stroke={C.skinShade} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* the muzzle */}
      <path d="M244 262 C224 296 220 362 248 396 C268 416 318 416 338 394 C358 362 354 296 332 262 C314 252 262 252 244 262 Z" fill={C.skin} {...INK} />
      <path d="M262 258 C258 270 258 280 262 288 M312 256 C316 268 316 278 312 286" fill="none" {...INK} strokeWidth={3} />
      <ellipse cx="270" cy="294" rx="10" ry="5.5" fill={C.ink} transform="rotate(-14 270 294)" />
      <ellipse cx="310" cy="294" rx="10" ry="5.5" fill={C.ink} transform="rotate(14 310 294)" />
      <path d="M254 300 C252 284 266 276 280 284 M326 300 C328 284 314 276 300 284" fill="none" {...INK} strokeWidth={3.5} />
      <path d="M244 330 C252 344 258 352 262 356 M334 330 C328 344 322 352 318 356" fill="none" stroke={C.skinShade} strokeWidth="3" strokeLinecap="round" />
      {/* the pout */}
      <path d="M250 372 C272 364 310 364 330 372" fill="none" {...INK} strokeWidth={4.5} />
      <path d="M256 374 C274 390 308 390 324 374" fill="none" {...INK} strokeWidth={3} />

      {/* soot */}
      <g fill={C.ink} opacity={c * 0.5}>
        <ellipse cx="212" cy="176" rx="18" ry="9" />
        <ellipse cx="342" cy="320" rx="14" ry="8" />
        <ellipse cx="240" cy="330" rx="12" ry="7" />
      </g>

      {/* the lighter */}
      {holding === 'lighter' ? (
        <g>
          <circle className="pyre-glow" cx="404" cy="300" r={60 * f} fill={`url(#${id}-glow)`} />
          <g className="pyre-flame" style={{ transformOrigin: '404px 334px', transform: `scale(${f})` }}>
            <path d="M404 266 C424 292 422 318 404 334 C386 318 384 292 404 266 Z" fill={C.flame} />
            <path d="M404 290 C414 306 412 322 404 330 C396 322 394 306 404 290 Z" fill={C.flameCore} />
          </g>
          <rect x="390" y="334" width="28" height="12" rx="3" fill={C.metal} {...INK} strokeWidth={3} />
          <rect x="388" y="344" width="32" height="52" rx="6" fill={C.fire} {...INK} strokeWidth={3} />
          <g {...INK}>
            <path d="M374 372 L436 372 Q446 372 446 384 L446 436 Q446 448 434 448 L382 448 Q370 448 370 436 L370 380 Q370 372 374 372 Z" fill={C.fur} />
            <rect x="362" y="370" width="66" height="20" rx="10" fill={C.skin} />
            <rect x="360" y="389" width="66" height="20" rx="10" fill={C.skin} />
            <rect x="362" y="408" width="64" height="20" rx="10" fill={C.skin} />
            <rect x="366" y="427" width="58" height="19" rx="9.5" fill={C.skin} />
            <path d="M432 380 Q452 360 440 346 Q430 338 420 352 L414 372" fill={C.skin} />
          </g>
        </g>
      ) : null}
      {holding === 'torch' ? (
        <g>
          <circle className="pyre-glow" cx="412" cy="236" r={80 * f} fill={`url(#${id}-glow)`} />
          <path d="M398 450 L420 262" stroke="#5a3a22" strokeWidth="16" strokeLinecap="round" />
          <path d="M398 450 L420 262" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <path d="M408 274 Q422 262 434 274 L430 290 Q420 284 410 290 Z" fill="#3a2414" {...INK} strokeWidth={3} />
          <g className="pyre-flame" style={{ transformOrigin: '421px 274px', transform: `scale(${f})` }}>
            <path d="M421 196 C450 230 448 262 421 278 C394 262 392 230 421 196 Z" fill={C.fire} />
            <path d="M421 216 C440 240 438 262 421 274 C404 262 402 240 421 216 Z" fill={C.flame} />
            <path d="M421 240 C430 252 428 264 421 270 C414 264 412 252 421 240 Z" fill={C.flameCore} />
          </g>
          <g {...INK}>
            <rect x="374" y="392" width="54" height="18" rx="9" fill={C.skin} />
            <rect x="372" y="408" width="54" height="18" rx="9" fill={C.skin} />
            <rect x="374" y="424" width="52" height="18" rx="9" fill={C.skin} />
            <path d="M424 398 Q444 384 436 370 Q428 362 418 374 L412 392" fill={C.skin} />
          </g>
        </g>
      ) : null}
    </svg>
  );
}
