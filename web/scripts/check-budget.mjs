/**
 * Performance budget gate (D-14).
 *
 * The budget is a lock like any other: the live site ships 1,901 KB of
 * JavaScript on every page, and nothing in that build ever objected. This
 * script objects, with an exit code.
 *
 * It is a plain script rather than a node:test file because its printed
 * measurements are worth as much as its verdict — a number that moves between
 * commits is the early warning; the threshold is only the backstop. It always
 * prints both figures before it decides.
 *
 * Deliberately NOT in scope here, and deliberately Phase 5: third-party script
 * auditing (Lock 10), image weight and true total page weight including media,
 * and Lighthouse / Core Web Vitals. All three need real pages and real photos,
 * and Phase 5 already owns the representative-combo-page budget.
 *
 *   node web/scripts/check-budget.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
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
*/
const JS_BUDGET_KB = 500; // D-14, transfer weight
const PAGE_BUDGET_KB = 1024; // D-14, transfer weight

const HTML_PATH = join(ROOT, '.next/server/app/index.html');
if (!existsSync(HTML_PATH)) {
  console.error(`cannot read ${HTML_PATH}`);
  console.error('  run `npm run build --workspace @bhc/web` first — the budget is measured on build output');
  process.exit(1);
}

const html = readFileSync(HTML_PATH, 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);

// Every page-referenced script, resolved to its file and compressed. Scripts
// the page references but the build did not emit are skipped rather than
// guessed at.
let js = 0;
for (const s of srcs) {
  const f = join(ROOT, '.next', s.replace('/_next/', ''));
  if (!existsSync(f)) continue;
  js += gzipSync(readFileSync(f)).length;
}
const page = js + Buffer.byteLength(html);

const kb = (n) => (n / 1024).toFixed(1);
console.log(`JS (gzip): ${kb(js)} KB / ${JS_BUDGET_KB} KB  (${srcs.length} script tags)`);
console.log(`Page (gzip JS + HTML): ${kb(page)} KB / ${PAGE_BUDGET_KB} KB`);

if (js / 1024 > JS_BUDGET_KB || page / 1024 > PAGE_BUDGET_KB) {
  console.error('PERFORMANCE BUDGET EXCEEDED (D-14)');
  process.exit(1);
}
