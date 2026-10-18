import { useMemo, type ReactElement, type ReactNode } from 'react';

/**
 * The handheld: an egg-shaped virtual-pet toy in tangerine plastic, drawn on a 72 by 94
 * pixel grid (8 rows of keyring above the shell). It is cracked: it was thrown into 0x…dEaD.
 * The LCD and the three buttons are real HTML laid over the art, so they stay live and clickable.
 */

const W = 72;
const TOP = 8; // rows of keyring above the shell
const H = 86 + TOP;
const CX = 36;
const CY = 46;

/** The screen, in grid units on the shell (before the keyring offset). */
export const LCD_BOX = { x: 14, y: 22, w: 44, h: 32 };
/** Where the screen's centre sits on the whole drawing, 0..1 (used to zoom into it). */
export const LCD_CENTER = { x: (LCD_BOX.x + LCD_BOX.w / 2) / W, y: (TOP + LCD_BOX.y + LCD_BOX.h / 2) / H };
export const LCD_SIZE = { w: LCD_BOX.w / W, h: LCD_BOX.h / H };

const BUTTONS = [
  { x: 23, y: 66, r: 4 },
  { x: 36, y: 70, r: 5 },
  { x: 49, y: 66, r: 4 },
];

// Mirrors of --color-ink, --color-shell(-hi/-lo) and --color-bezel in index.css: SVG fill attributes cannot read CSS variables
const INK = '#2a1633';
const SHELL = '#ff7a2f';
const SHELL_HI = '#ffa565';
const SHELL_LO = '#e0571a';
const BEZEL = '#3d2147';

/** half width of an egg (taller on top) at row y, for radii shrunk by `inset` and centre shifted by dx/dy */
function span(y: number, inset = 0, dx = 0, dy = 0): [number, number] | null {
  const cy = CY + dy;
  const rTop = 44 - inset;
  const rBot = 38 - inset;
  const t = y + 0.5 < cy ? (cy - (y + 0.5)) / rTop : (y + 0.5 - cy) / rBot;
  if (t >= 1) return null;
  const hw = Math.round((34 - inset) * Math.sqrt(1 - t * t));
  if (hw <= 0) return null;
  return [CX + dx - hw, CX + dx + hw];
}

function disc(cx: number, cy: number, r: number, fill: string, key: string) {
  const out: ReactElement[] = [];
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.round(Math.sqrt(r * r - dy * dy) + 0.25);
    out.push(<rect key={`${key}${dy}`} x={cx - half} y={cy + dy} width={half * 2} height={1} fill={fill} />);
  }
  return out;
}

function useShell() {
  return useMemo(() => {
    const r: ReactElement[] = [];
    for (let y = 0; y < 86; y++) {
      const o = span(y);
      if (!o) continue;
      r.push(<rect key={`o${y}`} x={o[0]} y={y} width={o[1] - o[0]} height={1} fill={INK} />);
      const i = span(y, 2);
      if (!i) continue;
      r.push(<rect key={`i${y}`} x={i[0]} y={y} width={i[1] - i[0]} height={1} fill={SHELL} />);
      // light from the top left: what the inner egg covers but a copy shifted down-right does not
      const lit = span(y, 2, 4, 4);
      const hiEnd = lit ? Math.min(lit[0], i[1]) : i[1];
      if (hiEnd > i[0]) r.push(<rect key={`h${y}`} x={i[0]} y={y} width={hiEnd - i[0]} height={1} fill={SHELL_HI} />);
      const dark = span(y, 2, -3, -3);
      const loStart = dark ? Math.max(dark[1], i[0]) : i[0];
      if (i[1] > loStart && y > 20) r.push(<rect key={`l${y}`} x={loStart} y={y} width={i[1] - loStart} height={1} fill={SHELL_LO} />);
    }
    return r;
  }, []);
}

function Keyring() {
  // a steel ring through a hole at the top of the shell
  const ring: ReactElement[] = [];
  for (let dy = -6; dy <= 6; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= 6.3 && d >= 3.6) ring.push(<rect key={`${dx},${dy}`} x={CX + dx} y={TOP - 4 + dy} width={1} height={1} fill={d > 5.4 || d < 4.4 ? INK : dx + dy < 0 ? '#e9e3ee' : '#a79bb0'} />);
    }
  }
  return <g>{ring}</g>;
}

interface DeviceProps {
  /** what the LCD shows */
  children: ReactNode;
  /** the three buttons: feed (left), the big one (middle), right */
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
  lcdClassName?: string;
}

export function Device({ children, left, center, right, className = '', lcdClassName = '' }: DeviceProps) {
  const shell = useShell();
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const slot = (b: (typeof BUTTONS)[number], node: ReactNode, i: number) =>
    node ? (
      <div
        key={i}
        className="absolute flex items-center justify-center"
        style={{ left: pct(b.x - b.r - 1, W), top: pct(TOP + b.y - b.r - 1, H), width: pct((b.r + 1) * 2, W), height: pct((b.r + 1) * 2 + 1, H) }}
      >
        {node}
      </div>
    ) : null;

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" shapeRendering="crispEdges" aria-hidden="true">
        <Keyring />
        <g transform={`translate(0 ${TOP})`}>
          {shell}
          {/* the crack it got on the way down */}
          <g fill={INK}>
            <rect x="55" y="6" width="1" height="3" />
            <rect x="54" y="9" width="1" height="2" />
            <rect x="55" y="11" width="1" height="2" />
            <rect x="53" y="13" width="2" height="1" />
            <rect x="52" y="14" width="1" height="3" />
            <rect x="56" y="12" width="2" height="1" />
            <rect x="58" y="13" width="1" height="2" />
          </g>
          <rect x="56" y="6" width="1" height="3" fill={SHELL_HI} />
          {/* a glint on the plastic */}
          <rect x="15" y="14" width="3" height="1" fill="#fff3e2" />
          <rect x="13" y="15" width="2" height="2" fill="#fff3e2" />
          {/* the bezel around the screen, corners stepped */}
          <rect x={LCD_BOX.x - 4} y={LCD_BOX.y - 3} width={LCD_BOX.w + 8} height={LCD_BOX.h + 6} fill={INK} />
          <rect x={LCD_BOX.x - 5} y={LCD_BOX.y - 1} width={LCD_BOX.w + 10} height={LCD_BOX.h + 2} fill={INK} />
          <rect x={LCD_BOX.x - 3} y={LCD_BOX.y - 2} width={LCD_BOX.w + 6} height={LCD_BOX.h + 4} fill={BEZEL} />
          <rect x={LCD_BOX.x - 3} y={LCD_BOX.y - 2} width={LCD_BOX.w + 6} height="1" fill="#5a3466" />
          {/* bezel print: three dots under the screen */}
          <rect x="33" y={LCD_BOX.y + LCD_BOX.h + 1} width="1" height="1" fill={SHELL} />
          <rect x="36" y={LCD_BOX.y + LCD_BOX.h + 1} width="1" height="1" fill={SHELL} />
          <rect x="39" y={LCD_BOX.y + LCD_BOX.h + 1} width="1" height="1" fill={SHELL} />
          {/* the buttons */}
          {BUTTONS.map((b, i) => (
            <g key={i}>
              {disc(b.x, b.y + 1, b.r + 1, INK, `s${i}`)}
              {disc(b.x, b.y, b.r + 1, INK, `o${i}`)}
              {disc(b.x, b.y, b.r, i === 1 ? '#ff3d7f' : '#ffd166', `f${i}`)}
              <rect x={b.x - Math.ceil(b.r / 2)} y={b.y - b.r + 1} width={2} height={1} fill="#fff3e2" />
            </g>
          ))}
        </g>
      </svg>

      <div
        data-lcd
        className={`lcd @container absolute overflow-hidden ${lcdClassName}`}
        style={{ left: pct(LCD_BOX.x, W), top: pct(TOP + LCD_BOX.y, H), width: pct(LCD_BOX.w, W), height: pct(LCD_BOX.h, H) }}
      >
        {children}
        {/* the crack it got on the way down, running into the screen */}
        <svg viewBox="0 0 44 32" className="pointer-events-none absolute inset-0 h-full w-full" shapeRendering="crispEdges" aria-hidden="true">
          <g fill="#2f3a22" opacity="0.75">
            <rect x="40" y="0" width="1" height="2" />
            <rect x="39" y="2" width="1" height="2" />
            <rect x="37" y="4" width="2" height="1" />
            <rect x="36" y="5" width="1" height="2" />
            <rect x="35" y="7" width="1" height="1" />
            <rect x="40" y="4" width="2" height="1" />
            <rect x="42" y="5" width="1" height="2" />
          </g>
          <rect x="41" y="0" width="1" height="2" fill="#e3ead0" opacity="0.8" />
        </svg>
      </div>

      {[left, center, right].map((node, i) => slot(BUTTONS[i], node, i))}
    </div>
  );
}
