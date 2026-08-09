/**
 * Performance budget gate (D-14) — worst page across every prerendered route.
 *
 * The budget is a lock like any other: the live site ships 1,901 KB of
 * JavaScript on every page, and nothing in that build ever objected. This
 * script objects, with an exit code.
 *
 * It is a plain script rather than a node:test file because its printed
 * measurements are worth as much as its verdict — a number that moves between
 * commits is the early warning; the threshold is only the backstop. It always
 * prints every figure before it decides.
 *
 * WORST PAGE, NOT AGGREGATE, AND NOT ONE PAGE. A visitor loads one page, so an
 * aggregate over the site is meaningless; and a single hardcoded `index.html`
 * stopped representing the site the moment route 2 existed. Every route in
 * `.next/prerender-manifest.json` is measured, the maximum is reported, and the
 * route that produced each maximum is NAMED — a budget that says "191 KB"
 * without saying which page is not actionable at 18 routes, let alone at
 * Phase 3's ~336.
 *
 * A GREEN BUDGET IS NOT EVIDENCE OF A GREEN CLIENT BOUNDARY. Measured during
 * Phase 2 planning: adding a whole client component to a route moved this
 * number by 0.2 KB. `SC-4g` in check-html-locks.mjs is the real client-boundary
 * lock. Do not read this script's verdict as covering D-07.
 *
 * Deliberately NOT in scope here, and deliberately Phase 5: third-party script
 * auditing (Lock 10), image weight and true total page weight including media,
 * and Lighthouse / Core Web Vitals. All three need real pages and real photos,
 * and Phase 5 already owns the representative-combo-page budget.
 *
 *   node web/scripts/check-budget.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/*
  D-14a — READ THIS BEFORE CHANGING EITHER NUMBER.

  Both budgets are TRANSFER WEIGHT: the compressed bytes that actually cross
  the wire. They are NOT uncompressed bytes on disk.

  The evidence: the 1,901 KB figure these budgets are benchmarked against was
  itself measured as transfer weight — docs/research/seo-audit-2026-08-06.md:75,
  "Measured transfer weight, mobile UA, gzip/br enabled". Comparing uncompressed
  bytes against it is not like-for-like.

  Why this matters enough to write down at the point of measurement: a bare
  Next.js 16 App Router page ships 550.9 KB of uncompressed JavaScript but only
  168.5 KB gzipped. A future reader who measures uncompressed reads 551 KB on an
  essentially blank page, concludes Phase 1 failed its own budget, and is wrong.

  There is no free signal to fall back on: Next.js 16 removed the `size` and
  `First Load JS` columns from build output as inaccurate for RSC
  architectures, so this explicit check is the only measurement that exists.

  Gzip is the conservative proxy. Vercel serves brotli, which is roughly 10-15%
  smaller again, so a gzip-based gate can only ever be stricter than reality.

  WR-05, CLOSED HERE. The page figure used to add the RAW byte length of the
  HTML to the GZIPPED JavaScript total, under a label claiming both were
  gzipped, while omitting CSS and the eight self-hosted woff2
  faces entirely. Measured on the Phase 1 build: HTML was 22.8 KB raw against
  4.2 KB gzipped, a 5x overstatement, and the omitted CSS + fonts were ~154 KB.
  The two errors pointed in OPPOSITE directions, which destroyed the number as
  the trend signal this header calls its primary value. The page figure is now
  gzipped JS + gzipped HTML + gzipped CSS + raw woff2 bytes, and the printed
  label names all four. woff2 is already compressed and is not meaningfully
  re-compressible, so its raw size IS its transfer weight.

  Both font and CSS totals are counted in FULL for every route, which is
  deliberately conservative: a real visitor fetches only the subsets their text
  needs, so the true first-visit weight is lower than reported. A budget that
  errs high is a budget; one that errs low is decoration.
*/
const JS_BUDGET_KB = 500; // D-14, transfer weight
const PAGE_BUDGET_KB = 1024; // D-14, transfer weight

const fail = (...lines) => {
  for (const l of lines) console.error(l);
  process.exit(1);
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

/* --- routes -------------------------------------------------------------- */

// Same enumeration and the same file mapping as web/scripts/check-html-locks.mjs.
// Keep the two in step: a route the locks assert but the budget does not measure
// is a route that can regress silently.
const MANIFEST_PATH = join(ROOT, '.next/prerender-manifest.json');
if (!existsSync(MANIFEST_PATH)) {
  fail(
    `cannot read ${MANIFEST_PATH}`,
    '  run `npm run build --workspace @bhc/web` first — the budget is measured on build output'
  );
}
const routes = Object.keys(JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')).routes).sort();
if (routes.length === 0) fail('prerender-manifest.json lists no routes — the budget measured nothing');

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

/* --- shared assets, counted once in every route's page total ------------- */

const staticFiles = walk(join(ROOT, '.next/static'));

const cssFiles = staticFiles.filter((f) => f.endsWith('.css'));
let cssGz = 0;
for (const f of cssFiles) cssGz += gzipSync(readFileSync(f)).length;

// Raw, not gzipped: woff2 is already a compressed container.
const fontFiles = staticFiles.filter((f) => f.endsWith('.woff2'));
let fontBytes = 0;
for (const f of fontFiles) fontBytes += readFileSync(f).length;

/* --- per-route JS and HTML ----------------------------------------------- */

/*
  Attribute-order independent: React renders DOM attributes in JSX source
  order, so `<script async src="…">` is at least as likely as `src` first. The
  old `/<script src="([^"]+)"/` form saw only the latter, which meant a
  third-party bundle added the idiomatic way was not merely unresolvable —
  it was invisible to the measurement entirely.

  WR-06, CLOSED HERE. The whole TAG is captured, not just the src, so the
  `noModule` legacy polyfill can be identified and excluded from the headline
  figure. It was 38.7 KB gzipped — 23% of the reported 168.5 KB — and no modern
  browser fetches it, so leaving it in would mask a real 38 KB regression. It is
  still resolved, still weighed, and reported on its own line: excluded is not
  the same as unmeasured.
*/
const LOCAL_PREFIX = '/_next/';

const scriptTags = (html) =>
  (html.match(/<script\b[^>]*>/g) || [])
    .map((tag) => {
      const found = tag.match(/\bsrc="([^"]*)"/);
      return found ? { src: found[1], legacy: /\bnoModule\b/i.test(tag) } : null;
    })
    .filter(Boolean);

/*
  A skipped script used to `continue` silently. Nothing counted the skips and
  nothing failed, so a change to Next's on-disk asset layout (a minor bump, an
  assetPrefix, a distDir override, a static-export switch) would make every
  entry unresolvable, leave `js` at 0, and print "0.0 KB / 500 KB" with exit 0
  — a budget gate reporting perfect health while measuring nothing. The same
  silence gave every external-origin script a weight of zero, since
  .next/https:/cdn.example.com/lib.js never exists on disk.

  A measurement that cannot be completed is not a pass. It is a refusal.
*/
const unresolved = [];
const measured = [];

for (const route of routes) {
  const htmlPath = join(ROOT, '.next/server/app', fileFor(route));
  if (!existsSync(htmlPath)) {
    unresolved.push(`${route} -> ${htmlPath} does not exist`);
    continue;
  }
  const html = readFileSync(htmlPath, 'utf8');
  const tags = scriptTags(html);

  if (tags.length === 0) {
    unresolved.push(`${route} -> no <script src> tags in the built HTML; the budget measured nothing for this route`);
    continue;
  }

  let jsGz = 0;
  let legacyGz = 0;
  for (const { src, legacy } of tags) {
    if (!src.startsWith(LOCAL_PREFIX)) {
      unresolved.push(`${route} -> ${src} — not a local ${LOCAL_PREFIX} asset; external scripts cannot be budgeted`);
      continue;
    }
    const f = join(ROOT, '.next', src.slice(LOCAL_PREFIX.length));
    if (!existsSync(f)) {
      unresolved.push(`${route} -> ${src} -> ${f} does not exist`);
      continue;
    }
    const size = gzipSync(readFileSync(f)).length;
    if (legacy) legacyGz += size;
    else jsGz += size;
  }

  const htmlGz = gzipSync(Buffer.from(html)).length;
  measured.push({
    route,
    tags: tags.length,
    jsGz,
    legacyGz,
    htmlGz,
    page: jsGz + htmlGz + cssGz + fontBytes,
  });
}

if (unresolved.length) {
  fail('BUDGET MEASUREMENT INCOMPLETE — refusing to report a verdict:', ...unresolved.map((u) => `  ${u}`));
}
if (measured.length !== routes.length) {
  fail(`measured ${measured.length} of ${routes.length} routes — refusing to report a verdict`);
}

/* --- report -------------------------------------------------------------- */

const kb = (n) => (n / 1024).toFixed(1);
const worstBy = (key) => measured.reduce((a, b) => (b[key] > a[key] ? b : a));

const worstJs = worstBy('jsGz');
const worstHtml = worstBy('htmlGz');
const worstLegacy = worstBy('legacyGz');
const worstPage = worstBy('page');

console.log(`Measured ${measured.length} prerendered route(s).`);
console.log(`JS (gzip, modern):   ${kb(worstJs.jsGz)} KB / ${JS_BUDGET_KB} KB   worst: ${worstJs.route}  (${worstJs.tags} script tags)`);
console.log(`HTML (gzip):         ${kb(worstHtml.htmlGz)} KB              worst: ${worstHtml.route}`);
console.log(`CSS (gzip):          ${kb(cssGz)} KB              shared, ${cssFiles.length} file(s)`);
console.log(`Fonts (raw woff2):   ${kb(fontBytes)} KB            shared, ${fontFiles.length} file(s), already compressed`);
console.log(
  `EXCLUDED from the JS figure: noModule legacy polyfill, ${kb(worstLegacy.legacyGz)} KB gzip (worst: ${worstLegacy.route}). ` +
    'No modern browser fetches it; counting it masked a real 38 KB regression (WR-06).'
);
console.log(
  `Page (gzip JS + gzip HTML + gzip CSS + raw woff2): ${kb(worstPage.page)} KB / ${PAGE_BUDGET_KB} KB   worst: ${worstPage.route}`
);

if (worstJs.jsGz / 1024 > JS_BUDGET_KB || worstPage.page / 1024 > PAGE_BUDGET_KB) {
  fail('PERFORMANCE BUDGET EXCEEDED (D-14)');
}
