/** Writes the favicon: Digby's hooded skull as crisp SVG rects. Run: npx tsx konten-x/render/mark.ts */
import { writeFileSync } from 'node:fs';
import { buildHead } from '../../src/components/digby/pixels';

const g = buildHead(3);
const rects = g.runs().map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.c}"/>`).join('');
writeFileSync('public/digby-mark.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.w} ${g.h}" shape-rendering="crispEdges">${rects}</svg>\n`);
console.log('public/digby-mark.svg');
