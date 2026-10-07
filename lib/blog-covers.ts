/**
 * The animated covers for blog articles: one drawing per kind of article, in
 * the style of the covers drawn by hand for the first three (public/blog) and
 * of the artwork on the service cards. A category picks its drawing in the
 * Studio; each article then gets its own variation of it, worked out from the
 * article's address, so two articles in a category don't look the same.
 *
 * The result is a plain SVG animated with CSS, served by app/blog-cover and
 * shown with an ordinary <img>.
 */

export const COVER_STYLES = ["checklist", "bars", "orbits", "pipeline", "code", "signal"] as const;
export type CoverStyle = (typeof COVER_STYLES)[number];

export const isCoverStyle = (value: unknown): value is CoverStyle => COVER_STYLES.includes(value as CoverStyle);

export const coverPath = (style: CoverStyle, slug: string) => `/blog-cover/${style}/${slug}.svg`;

const BG = "#03060D";
const PANEL = "#080E1A";
const LINE = "#1E2E47";
const BLUE = "#2563EB";
const LIGHT = "#3B82F6";

/** The same numbers every time for the same article. */
function random(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    /** A number from min up to max. */
    between: (min: number, max: number) => min + next() * (max - min),
    /** A whole number from min to max, both included. */
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    chance: (p: number) => next() < p,
  };
}
type Random = ReturnType<typeof random>;

const n = (value: number) => value.toFixed(1).replace(/\.0$/, "");

type Drawing = { css: string; body: string; label: string };

/** A finished article's checklist: rows ticked off one after another. */
function checklist(r: Random): Drawing {
  const rows = r.int(4, 5);
  const x = r.between(470, 610);
  const top = 450 - (rows * 96 + 60) / 2;
  const cycle = rows * 0.7 + 3;
  let body = `<rect x="${n(x)}" y="${n(top)}" width="520" height="${rows * 96 + 60}" rx="24" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>`;
  for (let i = 0; i < rows; i++) {
    const y = top + 54 + i * 96;
    const width = r.between(190, 330);
    body += `<rect x="${n(x + 48)}" y="${n(y)}" width="44" height="44" rx="10" fill="none" stroke="${BLUE}" stroke-width="2" opacity="0.7"/>`;
    body += `<path class="tick" style="animation-delay: ${n(i * 0.7)}s" d="M${n(x + 59)} ${n(y + 23)}l9 9 16-18" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += `<rect x="${n(x + 122)}" y="${n(y + 8)}" width="${n(width)}" height="10" rx="5" fill="${LINE}"/>`;
    body += `<rect x="${n(x + 122)}" y="${n(y + 28)}" width="${n(width * r.between(0.45, 0.75))}" height="8" rx="4" fill="${LINE}" opacity="0.6"/>`;
  }
  const sealX = x + 520 + r.between(70, 150);
  const sealY = 450 + r.between(-150, 150);
  body += `<circle class="ripple" cx="${n(sealX)}" cy="${n(sealY)}" r="46" fill="none" stroke="${BLUE}" stroke-width="2" opacity="0.6"/>`;
  body += `<circle cx="${n(sealX)}" cy="${n(sealY)}" r="46" fill="${BG}" stroke="${BLUE}" stroke-width="2"/>`;
  body += `<path d="M${n(sealX - 18)} ${n(sealY + 1)}l12 12 24-27" fill="none" stroke="${LIGHT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return {
    label: "A checklist being ticked off",
    css: `.tick { opacity: 0; animation: tick ${n(cycle)}s ease-in-out infinite; }
    @keyframes tick { 0% { opacity: 0; } 6%, 88% { opacity: 1; } 100% { opacity: 0; } }`,
    body,
  };
}

/** Rising bars with a line across them: figures, surveys, adoption. */
function bars(r: Random): Drawing {
  const count = r.int(6, 8);
  const width = 76;
  const gap = 44;
  const left = 800 - (count * width + (count - 1) * gap) / 2;
  const base = 700;
  let body = `<path d="M${n(left - 60)} ${base}H${n(1600 - left + 60)}" stroke="${LINE}" stroke-width="2"/>`;
  let height = r.between(110, 170);
  let tallest = { x: 0, y: base };
  for (let i = 0; i < count; i++) {
    height = Math.min(470, Math.max(90, height + r.between(-30, 95)));
    const x = left + i * (width + gap);
    const filled = i >= count - 2 || r.chance(0.2);
    body += `<rect class="bar" style="animation-delay: ${n(i * 0.25)}s" x="${n(x)}" y="${n(base - height)}" width="${width}" height="${n(height)}" rx="10" fill="${filled ? BLUE : PANEL}" stroke="${BLUE}" stroke-width="2" opacity="${filled ? 0.9 : 0.75}"/>`;
    if (base - height < tallest.y) tallest = { x: x + width / 2, y: base - height };
  }
  const mark = base - r.between(230, 330);
  body += `<path class="dash" d="M${n(left - 60)} ${n(mark)}H${n(1600 - left + 60)}" stroke="${LIGHT}" stroke-width="2" stroke-dasharray="10 12" opacity="0.7"/>`;
  body += `<circle class="ripple" cx="${n(tallest.x)}" cy="${n(tallest.y - 34)}" r="14" fill="none" stroke="#FFFFFF" stroke-width="2"/>`;
  body += `<circle class="pulse" cx="${n(tallest.x)}" cy="${n(tallest.y - 34)}" r="9" fill="#FFFFFF"/>`;
  return {
    label: "A bar chart with rising bars",
    css: `.bar { transform-box: fill-box; transform-origin: bottom; animation: bar 4.5s ease-in-out infinite; }
    @keyframes bar { 0%, 100% { transform: scaleY(0.88); } 50% { transform: scaleY(1); } }
    .dash { animation: dash 3s linear infinite; }
    @keyframes dash { to { stroke-dashoffset: -44; } }`,
    body,
  };
}

/** Points circling a centre at different speeds: trends, outlooks. */
function orbits(r: Random): Drawing {
  const rings = [150, 245, 340];
  let body = "";
  for (const radius of rings) {
    body += `<circle cx="800" cy="450" r="${radius}" fill="none" stroke="${LINE}" stroke-width="2"${radius === 245 ? ' stroke-dasharray="4 14"' : ""}/>`;
  }
  rings.forEach((radius, ring) => {
    const points = r.int(1, ring + 1);
    const seconds = r.between(18, 30) + ring * 10;
    const reverse = r.chance(0.5);
    for (let i = 0; i < points; i++) {
      // A negative delay starts the point part-way round its ring.
      const delay = -seconds * ((i + r.between(0, 0.6)) / points);
      const big = r.chance(0.4);
      body += `<g class="orbit" style="animation-duration: ${n(seconds)}s; animation-delay: ${n(delay)}s${reverse ? "; animation-direction: reverse" : ""}">`;
      body += `<circle cx="${800 + radius}" cy="450" r="${big ? 20 : 12}" fill="${big ? PANEL : "#FFFFFF"}" stroke="${big ? BLUE : "none"}" stroke-width="2"/>`;
      if (big) body += `<circle class="pulse" cx="${800 + radius}" cy="450" r="7" fill="${LIGHT}"/>`;
      body += `</g>`;
    }
  });
  body += `<circle class="ripple" cx="800" cy="450" r="58" fill="none" stroke="${BLUE}" stroke-width="2" opacity="0.6"/>`;
  body += `<circle cx="800" cy="450" r="58" fill="${BG}" stroke="${BLUE}" stroke-width="2" opacity="0.7"/>`;
  body += `<circle cx="800" cy="450" r="30" fill="${BLUE}"/>`;
  return {
    label: "Points circling a centre",
    css: `.orbit { transform-origin: 800px 450px; animation: orbit linear infinite; }
    @keyframes orbit { to { transform: rotate(360deg); } }`,
    body,
  };
}

/** Steps in a row with something passing from one to the next: automation. */
function pipeline(r: Random): Drawing {
  const steps = r.int(3, 4);
  const size = { w: 190, h: 130 };
  const span = steps === 3 ? 380 : 300;
  const first = 800 - ((steps - 1) * span) / 2;
  const points = Array.from({ length: steps }, (_, i) => ({ x: first + i * span, y: 450 + (i % 2 ? 1 : -1) * r.between(20, 95) }));
  let lines = "";
  let boxes = "";
  points.forEach((p, i) => {
    const next = points[i + 1];
    if (next) {
      const from = { x: p.x + size.w / 2, y: p.y };
      const to = { x: next.x - size.w / 2, y: next.y };
      lines += `<path d="M${n(from.x)} ${n(from.y)}L${n(to.x)} ${n(to.y)}" stroke="${BLUE}" stroke-width="2" opacity="0.55"/>`;
      lines += `<circle class="packet" style="--dx: ${n(to.x - from.x)}px; --dy: ${n(to.y - from.y)}px; animation-delay: ${n(i * 0.8)}s" cx="${n(from.x)}" cy="${n(from.y)}" r="8" fill="#FFFFFF"/>`;
    }
    const last = i === steps - 1;
    boxes += `<rect class="halo" style="animation-delay: ${n(i * 0.8)}s" x="${n(p.x - size.w / 2)}" y="${n(p.y - size.h / 2)}" width="${size.w}" height="${size.h}" rx="20" fill="none" stroke="${LIGHT}" stroke-width="3"/>`;
    boxes += `<rect x="${n(p.x - size.w / 2)}" y="${n(p.y - size.h / 2)}" width="${size.w}" height="${size.h}" rx="20" fill="${last ? BLUE : PANEL}" stroke="${BLUE}" stroke-width="2"/>`;
    const bar = last ? "#FFFFFF" : LINE;
    boxes += `<rect x="${n(p.x - 58)}" y="${n(p.y - 22)}" width="${n(r.between(70, 116))}" height="10" rx="5" fill="${bar}" opacity="${last ? 0.9 : 1}"/>`;
    boxes += `<rect x="${n(p.x - 58)}" y="${n(p.y + 2)}" width="${n(r.between(40, 90))}" height="8" rx="4" fill="${bar}" opacity="0.6"/>`;
    boxes += `<circle class="pulse" style="animation-delay: ${n(i * 0.8)}s" cx="${n(p.x + 62)}" cy="${n(p.y - 38)}" r="6" fill="${last ? "#FFFFFF" : LIGHT}"/>`;
  });
  return {
    label: "Steps in a row with data passing between them",
    css: `.packet { opacity: 0; animation: packet ${n(steps * 0.8)}s ease-in-out infinite; }
    @keyframes packet { 0% { transform: translate(0, 0); opacity: 0; } 8%, 26% { opacity: 1; } 34%, 100% { transform: translate(var(--dx), var(--dy)); opacity: 0; } }
    .halo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: halo ${n(steps * 0.8)}s ease-out infinite; }
    @keyframes halo { 0% { transform: scale(1); opacity: 0.9; } 30%, 100% { transform: scale(1.14); opacity: 0; } }`,
    body: lines + boxes,
  };
}

/** A window with lines of code being written: engineering. */
function code(r: Random): Drawing {
  const x = r.between(380, 460);
  const y = 190;
  const w = 1600 - 2 * x;
  const h = 520;
  const lines = r.int(6, 7);
  const cycle = lines * 0.55 + 3.5;
  let body = `<rect x="${n(x)}" y="${y}" width="${n(w)}" height="${h}" rx="22" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>`;
  body += `<path d="M${n(x)} ${y + 62}H${n(x + w)}" stroke="${LINE}" stroke-width="2"/>`;
  [0, 1, 2].forEach((i) => (body += `<circle cx="${n(x + 38 + i * 28)}" cy="${y + 31}" r="8" fill="${i === 0 ? BLUE : LINE}"/>`));
  let indent = 0;
  let end = { x: 0, y: 0 };
  for (let i = 0; i < lines; i++) {
    indent = Math.max(0, Math.min(2, indent + r.int(-1, 1)));
    const lx = x + 78 + indent * 46;
    const ly = y + 112 + i * 58;
    const first = r.between(70, 150);
    const second = r.between(110, Math.min(300, w - 300 - indent * 46));
    body += `<text x="${n(x + 34)}" y="${n(ly + 14)}" font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="18" fill="${LINE}">${String(i + 1).padStart(2, "0")}</text>`;
    body += `<g class="type" style="animation-delay: ${n(i * 0.55)}s">`;
    body += `<rect x="${n(lx)}" y="${n(ly)}" width="${n(first)}" height="14" rx="7" fill="${r.chance(0.6) ? BLUE : LIGHT}"/>`;
    body += `<rect x="${n(lx + first + 16)}" y="${n(ly)}" width="${n(second)}" height="14" rx="7" fill="${r.chance(0.25) ? "#FFFFFF" : LINE}" opacity="0.9"/>`;
    body += `</g>`;
    end = { x: lx + first + 16 + second + 14, y: ly - 5 };
  }
  body += `<rect class="cursor" x="${n(end.x)}" y="${n(end.y)}" width="12" height="24" rx="2" fill="#FFFFFF"/>`;
  return {
    label: "A code editor with lines being written",
    css: `.type { transform-box: fill-box; transform-origin: left; animation: type ${n(cycle)}s ease-out infinite; }
    @keyframes type { 0% { transform: scaleX(0); opacity: 0; } 2% { opacity: 1; } 9%, 90% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }
    .cursor { animation: cursor 1.1s steps(1) infinite; }
    @keyframes cursor { 50% { opacity: 0; } }`,
    body,
  };
}

/** Waves leaving a point and reaching a stack of notes: announcements, news. */
function signal(r: Random): Drawing {
  const sx = r.between(400, 500);
  const sy = 450 + r.between(-60, 60);
  const cards = 3;
  const cx = r.between(1010, 1090);
  let body = "";
  [150, 250, 350].forEach((radius, i) => {
    // An arc opening to the right, a little under a quarter of a circle.
    const dx = radius * Math.cos(Math.PI / 4.4);
    const dy = radius * Math.sin(Math.PI / 4.4);
    body += `<path class="wave" style="animation-delay: ${n(i * 0.45)}s" d="M${n(sx + dx)} ${n(sy - dy)}A${radius} ${radius} 0 0 1 ${n(sx + dx)} ${n(sy + dy)}" fill="none" stroke="${BLUE}" stroke-width="3" stroke-linecap="round"/>`;
  });
  body += `<circle class="ripple" cx="${n(sx)}" cy="${n(sy)}" r="50" fill="none" stroke="${BLUE}" stroke-width="2" opacity="0.6"/>`;
  body += `<circle cx="${n(sx)}" cy="${n(sy)}" r="50" fill="${BG}" stroke="${BLUE}" stroke-width="2" opacity="0.7"/>`;
  body += `<circle cx="${n(sx)}" cy="${n(sy)}" r="26" fill="${BLUE}"/>`;
  for (let i = 0; i < cards; i++) {
    const y = 450 + (i - 1) * 150 - 55;
    const x = cx + (i === 1 ? 0 : r.between(20, 70));
    const delay = 1.3 + i * 0.35;
    body += `<rect class="halo" style="animation-delay: ${n(delay)}s" x="${n(x)}" y="${n(y)}" width="300" height="110" rx="18" fill="none" stroke="${LIGHT}" stroke-width="3"/>`;
    body += `<rect x="${n(x)}" y="${n(y)}" width="300" height="110" rx="18" fill="${PANEL}" stroke="${i === 1 ? BLUE : LINE}" stroke-width="2"/>`;
    body += `<circle class="pulse" style="animation-delay: ${n(delay)}s" cx="${n(x + 44)}" cy="${n(y + 55)}" r="14" fill="${i === 1 ? BLUE : LINE}"/>`;
    body += `<rect x="${n(x + 78)}" y="${n(y + 36)}" width="${n(r.between(120, 180))}" height="10" rx="5" fill="${LINE}"/>`;
    body += `<rect x="${n(x + 78)}" y="${n(y + 60)}" width="${n(r.between(70, 130))}" height="8" rx="4" fill="${LINE}" opacity="0.6"/>`;
  }
  return {
    label: "Waves travelling from a point to a stack of messages",
    css: `.wave { opacity: 0.15; animation: wave 2.7s ease-in-out infinite; }
    @keyframes wave { 0%, 100% { opacity: 0.15; } 30% { opacity: 0.95; } 60% { opacity: 0.15; } }
    .halo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: halo 2.7s ease-out infinite; }
    @keyframes halo { 0% { transform: scale(1); opacity: 0.9; } 40%, 100% { transform: scale(1.1); opacity: 0; } }`,
    body,
  };
}

const DRAWINGS: Record<CoverStyle, (r: Random) => Drawing> = { checklist, bars, orbits, pipeline, code, signal };

export function coverSvg(style: CoverStyle, seed: string) {
  const r = random(`${style}:${seed}`);
  // The light behind the drawing sits somewhere different for each article.
  const glow = { x: r.between(560, 1040), y: r.between(360, 540), radius: r.between(300, 380) };
  const { css, body, label } = DRAWINGS[style](r);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="${label}">
  <style>
    .glow { animation: glow 5s ease-in-out infinite; }
    @keyframes glow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
    .pulse { animation: pulse 2.4s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
    .ripple { transform-box: fill-box; transform-origin: center; animation: ripple 2.6s ease-out infinite; }
    @keyframes ripple { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
    ${css}
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .tick, .packet { opacity: 1 !important; } .packet, .halo { display: none; } }
  </style>
  <defs>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#121D30" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fade" cx="50%" cy="50%" r="70%">
      <stop offset="0.55" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="${BG}"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <rect width="1600" height="900" fill="url(#fade)"/>
  <circle class="glow" cx="${n(glow.x)}" cy="${n(glow.y)}" r="${n(glow.radius)}" fill="url(#glow)"/>
  ${body}
</svg>
`;
}
