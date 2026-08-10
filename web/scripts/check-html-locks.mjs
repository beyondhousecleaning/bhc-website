/**
 * Built-HTML lock assertions — every prerendered page, not just the home page.
 *
 * The design system's locks are assertions rather than guidance because the
 * live site regressed silently on nearly all of them. This file is the second
 * half of that idea: design-system/test/locks.test.js scans package SOURCE,
 * this scans the files `next build` writes to DISK. Reading the on-disk
 * artifacts is the point — it proves the output is server-rendered without
 * running a browser, which is exactly what Locks 3 and 9 exist to guarantee. A
 * browser-based check would pass even if the content were client-injected.
 *
 * The live-site defects that motivate the NAP group: the footer DISPLAYS
 * +44 7861 936533 and DIALS 07441918832 on all 115 pages, with a third number
 * (+447575709361) on /get-a-quote. Three numbers, one business.
 *
 * Covers: SC-1b, SC-2a…2e, SC-4a…4g, D-04, D-07, D-10, D-14b, D-15, and
 * UI-SPEC §12 deltas 1, 2, 3, 4, 5, 6, 7, 11 and 12.
 *
 *   node --test web/scripts/check-html-locks.mjs
 *
 * ---------------------------------------------------------------------------
 * THREE STRUCTURAL RULES FOR ANYONE EDITING THIS FILE
 * ---------------------------------------------------------------------------
 *
 * 1. EVERY LOCK IS ONE LOOPING TEST whose failure message names the offending
 *    route. Not one suite per page. 18 routes x ~14 assertions is 250 test
 *    cases and a MIN_TESTS-style floor that has to be recomputed every time a
 *    route is added — actively hostile to Phase 3's ~336 pages. One looping
 *    test per lock keeps the count stable at the number of INVARIANTS, which is
 *    the thing such a floor is actually meant to protect.
 *
 * 2. THE RSC FLIGHT PAYLOAD IS INLINED IN THE HTML, SO BARE SUBSTRING COUNTS
 *    DOUBLE-COUNT. Measured on this repo:
 *
 *      `application/ld+json` bare                -> 6   (wrong)
 *      `<script[^>]*type="application/ld+json"`  -> 3   (correct)
 *      `bhc-interlink__list` bare                -> 2   (wrong)
 *      `class="[^"]*bhc-interlink__list`         -> 1   (correct)
 *      `BreadcrumbList` bare                     -> 2   (wrong)
 *      `"@type":"BreadcrumbList"`                -> 1   (correct)
 *
 *    The extra hit is the serialised `"className":"bhc-interlink__list"` inside
 *    the flight payload. EVERY class-name COUNT in this file therefore uses the
 *    `class="[^"]*…` form. Tag-form (`<h1`, `<footer`) and attribute-form
 *    (`href="tel:`, `aria-current="page"`, `data-…`) regexes are safe, because
 *    the payload serialises those as JSON keys rather than as markup.
 *    Zero-assertions are safe in either form — double-counting a zero is still
 *    zero, and scanning the payload too only makes them stricter.
 *
 * 3. A SCANNER MUST NOT MATCH ITS OWN SOURCE. This file greps build output for
 *    retired phone digits and greps repo source for a client directive; earlier
 *    revisions were bitten twice by a comment that named the very string being
 *    banned. Both markers are assembled from fragments for that reason.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';

// No third-party imports, ever. Enforcement code that depends on the supply
// chain it is meant to survive is not enforcement. No DOM parser either — the
// analog proves regex-against-string is sufficient for every assertion here.
// This also keeps the `locks`-adjacent property that the CI `build` job needs
// nothing beyond `npm ci` for the app itself.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(ROOT, '..');
const digits = (s) => String(s).replace(/\D/g, '');

/*
  Verbatim from design-system/test/locks.test.js — do not re-derive it, and
  change both or neither.

  WR-02. The single original form was `/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/`:
  case-sensitive, with `\s?` permitting at most ONE whitespace character. It
  missed `cv32 6eq`, `CV32&nbsp;6EQ` and `CV32  6EQ` — every one of which is a
  plausible way a Phase-3 data file puts a residential postcode onto ~336
  prerendered pages.

  Two patterns rather than one widened pattern, and the split is load-bearing:

    SPACED  — any case, one or more separators required.
    COMPACT — uppercase only, no separator, i.e. exactly today's coverage.

  Simply adding the `i` flag to the zero-separator form makes the lock FLAKY,
  not stronger: a UK postcode's shape (1-2 letters, 1-2 digits, optional
  letter, digit, 2 letters) is also the shape of a lowercase build hash, and
  Next's per-build id is random. Measured on a real build, `o5h8fd--6Limf2FJodaMt`
  in the RSC flight payload matched, failing SC-2d on a page carrying no
  address at all. A lock that fails at random gets deleted, and then it catches
  nothing forever.

  Known residual gap, stated rather than papered over: an all-lowercase
  compact postcode (`cv326eq`) is not matched, because nothing distinguishes it
  from a build hash. It is also the least likely form to reach rendered copy —
  the three forms this fix does close are the ones a human or a data file
  actually produces.

  `\s` already covers the U+00A0 a prerenderer may emit in place of `&nbsp;`;
  the entity alternatives cover the case where it emits the entity instead.
*/
const POSTCODE_SPACED = /\b[A-Z]{1,2}\d{1,2}[A-Z]?(?:\s|&nbsp;|&#160;|&#xa0;)+\d[A-Z]{2}\b/i;
const POSTCODE_COMPACT = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}\b/;
const findPostcode = (text) =>
  (text.match(POSTCODE_SPACED) || text.match(POSTCODE_COMPACT) || [null])[0];

/*
  WR-04. A UK street line: house number, optional letter, one or two
  capitalised name words, then a thoroughfare type. Case-sensitive on the name
  words on purpose — requiring the capitalisation is what keeps it off ordinary
  prose like "3 bedroom deep clean" while still catching "12 High Street" and
  "84 Acacia Road", which is the exact case SC-2d's own comment named and then
  did not check.

  ASSUMPTION A1, recorded at the point of risk. Phase 2 adds roughly a thousand
  words of prose to each of seventeen pages — the first time this heuristic
  meets real copy at volume, and Phase 3 multiplies that by ~336. A match needs
  a leading number, capitalised name words AND a thoroughfare noun all in
  sequence, so the false-positive risk is low but not zero: an illustrative
  sentence like "84 Acacia Road" in body copy would trip it. That is why the
  failure message below prints the MATCHED LINE — a false positive must be
  diagnosable in seconds, not bisected.
*/
const STREET_LINE =
  /\b\d{1,4}[a-zA-Z]?\s+(?:[A-Z][a-z]+\s+){1,2}(?:Road|Rd|Street|St|Avenue|Ave|Lane|Ln|Close|Drive|Dr|Way|Court|Crescent|Terrace|Grove|Gardens|Place|Park|Hill|Walk|Row|Mews)\b/;

const read = (path, hint) => {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    console.error(`cannot read ${path}\n  ${hint}`);
    process.exit(1);
  }
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const BUILD_HINT =
  'run `npm run build --workspace @bhc/web` first — these locks assert against build output, not source';

/* --- Route enumeration (delta 1) ----------------------------------------- */

/*
  `.next/prerender-manifest.json`, and never a directory walk.

  - It is the ROUTE list, already expanded, so there is no `index.html -> /`
    reverse-engineering and no exposure to a future filename scheme.
  - The obvious-looking alternative is the `staticRoutes` array in Next's OTHER
    route manifest, and it is WRONG: measured on a probe build, that array
    OMITTED every `generateStaticParams`-expanded page. Using it would silently
    under-assert Phase 3's entire 336-page engine. Its filename is deliberately
    not written anywhere in this file — the acceptance check for this rewrite
    greps this file for that name and requires zero hits, and a comment warning
    against a string is still an occurrence of the string. (This repo has been
    bitten by exactly that four times; see rule 3 in the header.)

  File mapping, measured: a nested route emits BOTH a directory (holding its
  manifest and chunks) and a sibling `.html`.
*/
const manifest = JSON.parse(
  read(join(ROOT, '.next/prerender-manifest.json'), BUILD_HINT)
);

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

// Read every page exactly once, at module load: O(pages) reads in total rather
// than O(pages x assertions).
const PAGES = Object.keys(manifest.routes)
  .sort()
  .map((route) => ({
    route,
    file: fileFor(route),
    compute: manifest.routes[route].compute,
    html: read(join(ROOT, '.next/server/app', fileFor(route)), BUILD_HINT),
  }));

/*
  `_global-error` does NOT render RootLayout. It is Next's own error document,
  `<html id="__next_error__">` with no `lang`, no `<footer>`, no `tel:`, no
  robots meta, no stylesheet, no JSON-LD and no `bhc-*` class. It DOES carry
  exactly one `<h1>` ("This page couldn't load"), so it needs NO exclusion from
  the one-`<h1>` lock and DOES need excluding from every landmark, NAP, robots,
  JSON-LD and lang assertion.

  UI-SPEC §9.5 states the opposite on every one of those clauses — it claims
  `_global-error.html` renders RootLayout and has no `<h1>`, and calls it "the
  single documented exclusion from the one-<h1> lock and from nothing else".
  That is exactly backwards. The table above was measured on this repo's build
  and reproduced twice. Trust the measurement, not the spec paragraph.

  `_not-found` is deliberately NOT in this set: it does render RootLayout.
*/
const FRAMEWORK_ONLY = new Set(['/_global-error']);
const APP_PAGES = PAGES.filter((p) => !FRAMEWORK_ONLY.has(p.route));

/*
  Routes that must exist — all eighteen of them, asserted in BOTH directions, so
  neither a missing route nor a shrinking site can pass quietly.

  WHAT THIS FLOOR ACTUALLY GUARDS, because it is not obvious and it is the whole
  reason the constant exists rather than the suite simply iterating whatever the
  manifest happens to hold (02-RESEARCH.md § Pitfall 9): a route that silently
  opts into DYNAMIC rendering — one `cookies()`, one `headers()`, one
  `export const dynamic`, one un-awaited `params` — disappears from
  `prerender-manifest.json`. It therefore disappears from `PAGES`, from
  `APP_PAGES`, and from every single assertion in this file. Without a floor the
  suite would go GREEN by having less to check, and the page would ship
  unasserted: no `<h1>` check, no NAP check, no postcode check, no robots check.
  Every one of the ~336 Phase 3 pages inherits the same exposure, so this list
  grows with the site rather than being retired.
*/
const EXPECTED_APP_ROUTES = new Set([
  '/',

  // The six service routes — one dynamic entry, six prerendered pages.
  '/services/deep-cleaning',
  '/services/standard-home-cleaning',
  '/services/move-in-cleaning',
  '/services/move-out-cleaning',
  '/services/short-term-rental-cleaning',
  '/services/post-construction-cleaning',

  // The ten UI-SPEC §5 utility routes.
  '/about-us',
  '/checklist',
  '/contact-us',
  '/customer-login',
  '/customer-service-agreement',
  '/get-a-quote',
  '/gift-cards',
  '/privacy-policy',
  '/terms-of-service',
  '/work-with-us',

  // A real §9.4 template since plan 02-13, and it renders RootLayout.
  '/_not-found',
]);

/*
  `InterlinkBlock` returns `null` until town data exists, so its marker is
  absent on all seventeen Phase 2 pages. PHASE 3 flips this to `true` when it
  supplies that data. While it is `false` the lock asserts the INVERSE — that no
  page renders the marker — which makes the gate self-restoring: the moment a
  page does render an InterlinkBlock, this test fails and forces the flip. A
  deleted lock is never restored; a dormant one is invisible debt; a
  self-restoring one is neither.
*/
const INTERLINK_LOCK_ACTIVE = false;

/*
  BOTH SETS ARE NOW EMPTY, AND THEY STAY THAT WAY. They are kept rather than
  deleted because each is asserted in the INVERSE while non-empty, which is what
  made them self-restoring — and because an empty exemption set is the honest
  record that every app page is now held to the positive lock. A route may be
  added here only with a spec clause naming it, never to quiet a red run.

  How they emptied, in order, because the sequence is the argument for writing
  gaps down as gated sets rather than as comments:

    `/get-a-quote` left NO_PRIMARY_CTA_YET in plan 02-08. It was seeded against
    the wave-1 stub — a Hero with a rating but no actions — and 02-08 gave it
    the full §9.4 template, whose `QuoteFormEntry` renders a primary Button. The
    inverse assertion failed and forced the entry out. Nobody had to remember.

    THE THREE LEGAL ROUTES were a different case, added by plan 02-09. They are
    not unfinished: UI-SPEC §9.4's legal variation gives them Breadcrumbs, a
    centred Hero and `Prose width="narrow"` and NOTHING ELSE — no CTABand, no
    BeforeAfterSlider, no QuoteFormEntry — because a page somebody reads to find
    out what happens to their data is not a conversion surface. They carried no
    primary Button because nothing supplied one SITEWIDE. Plan 02-13's layout
    composition put §5's `Get a Free Quote` Button in `Header` on every page, so
    all three failed the inverse assertion at once and came out together. None
    of them was given a CTA of its own; that would have breached §9.4.

    `/_not-found` left BOTH sets in plan 02-13, which swapped Next's built-in
    404 document for `app/not-found.jsx` — a real template with a centred Hero,
    a `RatingBadge` and three recovery links.
*/
const NO_RATING_YET = new Set([]);
const NO_PRIMARY_CTA_YET = new Set([]);

/*
  Per-route expectations. Delta 3 replaces the old hardcoded single-town
  constant — which asserted that the one page in the site said "Warwick" — with
  this table. (That constant's declaration is not quoted here: the acceptance
  check for this rewrite greps this file for it and requires zero hits.)

  It is a LITERAL, deliberately, and not a table derived from the same content
  modules the pages render. For Phase 2's seventeen hand-authored pages the
  literal also checks that THE COPY IS RIGHT; a derived table can only ever
  check "did the generator drop the field". Phase 3 may swap the IMPLEMENTATION
  of `expectationsFor` to a derived form for ~336 generated pages without
  touching a single call site — and should record in that change what it trades
  away.

  `h1` values are stored as PLAIN text with a literal `&`. Built HTML renders it
  as `&amp;`, and twelve of these headings contain "Warwickshire & the West
  Midlands"; `h1TextOf` decodes before comparing, and a regression guard below
  proves the decoder still does so.

  `/_global-error` is deliberately NOT a key. It is in FRAMEWORK_ONLY, every
  expectation-driven assertion iterates APP_PAGES, and it has no `<h1>` of ours
  to describe. (Recorded here, above the literal, rather than inside it: the
  acceptance criterion for this table greps the literal itself for that name.)

  The table may be COMPLETE BEFORE THE ROUTES ARE — every loop iterates over
  routes that actually exist. `expectationsFor` throws on an unknown route, so a
  new route arriving WITHOUT an expectation is a hard failure, not a silent gap.
*/
const PAGE_EXPECTATIONS = {
  // Home. Permanent: UI-SPEC §9.2 has no Breadcrumbs on `/`, so 1 JSON-LD
  // block (NAPFooter's) is the steady state, not a wave-1 artifact.
  '/': {
    h1: 'Professional House Cleaning in Warwickshire & the West Midlands',
    hasBreadcrumbs: false,
    ldJsonBlocks: 1,
  },

  // The six service routes (UI-SPEC §5, today's live slugs — §13-C defers the
  // canonical-slug rename to Phase 3, where it is a data change).
  '/services/deep-cleaning': { h1: 'Deep Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/services/standard-home-cleaning': { h1: 'Regular House Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/services/move-in-cleaning': { h1: 'Move-In Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/services/move-out-cleaning': { h1: 'Move-Out Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/services/short-term-rental-cleaning': { h1: 'Short-Term Rental Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/services/post-construction-cleaning': { h1: 'Post-Construction Cleaning in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },

  // The ten utility routes (UI-SPEC §5). All ten ship, so no nav or footer link
  // can point at a 404 (delta 6).
  '/about-us': { h1: 'The Team Behind Beyond House Cleaning', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/contact-us': { h1: 'Contact Our Warwickshire Cleaning Team', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/get-a-quote': { h1: 'Get a Free Cleaning Quote', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/checklist': { h1: "What's Included in Every Clean", hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/work-with-us': { h1: 'Cleaning Jobs in Warwickshire & the West Midlands', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/gift-cards': { h1: 'House Cleaning Gift Cards', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/customer-login': { h1: 'Manage Your Cleaning Bookings', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/privacy-policy': { h1: 'Privacy Policy', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/terms-of-service': { h1: 'Terms of Service', hasBreadcrumbs: true, ldJsonBlocks: 2 },
  '/customer-service-agreement': { h1: 'Customer Service Agreement', hasBreadcrumbs: true, ldJsonBlocks: 2 },

  // MEASURED, not aspirational. `app/not-found.jsx` is a real §9.4 template
  // rendered inside our RootLayout, so this heading is ours and not the
  // framework's. `hasBreadcrumbs: false` and one tag-form JSON-LD block (the
  // footer's business node) are PERMANENT: a 404 has no position in the
  // hierarchy to describe, and a trail here would add a second block.
  '/_not-found': { h1: "We Couldn't Find That Page", hasBreadcrumbs: false, ldJsonBlocks: 1 },
};

const expectationsFor = (route) => {
  if (!Object.prototype.hasOwnProperty.call(PAGE_EXPECTATIONS, route)) {
    throw new Error(
      `no PAGE_EXPECTATIONS entry for ${route} — a new route must declare its <h1>, breadcrumb and JSON-LD expectations here`
    );
  }
  return PAGE_EXPECTATIONS[route];
};

/* --- shared extractors --------------------------------------------------- */

const count = (html, re) => (html.match(re) || []).length;

// `&amp;` LAST, always: decoding it first would let `&amp;lt;` become `<`.
const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const stripTags = (s) => s.replace(/<[^>]*>/g, '');

const h1TextOf = (html) => {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  return m ? decodeEntities(stripTags(m[1])).replace(/\s+/g, ' ').trim() : null;
};

// Attribute form (`href="tel:`) — safe against the flight payload, which
// serialises attributes as JSON keys rather than as markup.
const TEL_HREF = /href="tel:([^"]*)"/g;
const TEL_ANCHOR = /<a\b[^>]*\bhref="tel:([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;

const nationalise = (value) => digits(value).replace(/^44/, '');

/* --- delta 1 / delta 13 — the route set itself --------------------------- */

test('delta 1: every prerendered route is enumerated, static, and present on disk', () => {
  assert.ok(PAGES.length, 'prerender-manifest.json lists no routes at all — its shape changed');

  for (const p of PAGES) {
    // A route that silently opts into dynamic rendering disappears from the
    // manifest and therefore from every assertion below. Fail loudly instead.
    assert.equal(
      p.compute,
      'static',
      `${p.route}: compute is "${p.compute}", not "static" — a dynamic route is invisible to every lock in this file`
    );
    assert.ok(p.html.length, `${p.route}: ${p.file} is empty`);
  }

  for (const route of EXPECTED_APP_ROUTES) {
    assert.ok(
      PAGES.some((p) => p.route === route),
      `expected route ${route} is not in prerender-manifest.json — it stopped being prerendered`
    );
  }

  assert.ok(
    APP_PAGES.length >= EXPECTED_APP_ROUTES.size,
    `expected >= ${EXPECTED_APP_ROUTES.size} prerendered app pages, found ${APP_PAGES.length}`
  );
});

test('delta 1: every app route declares an expectation, and the table is honest', () => {
  // `expectationsFor` throws on an unknown route; calling it for every app page
  // is what turns "someone added a route and forgot the table" into a failure.
  for (const p of APP_PAGES) {
    const e = expectationsFor(p.route);
    assert.equal(typeof e.h1, 'string', `${p.route}: expectation has no h1 string`);
    assert.equal(typeof e.hasBreadcrumbs, 'boolean', `${p.route}: expectation has no hasBreadcrumbs boolean`);
    assert.equal(typeof e.ldJsonBlocks, 'number', `${p.route}: expectation has no ldJsonBlocks number`);
  }

  assert.throws(
    () => expectationsFor('/zz-route-that-does-not-exist'),
    /no PAGE_EXPECTATIONS entry/,
    'expectationsFor must throw for an unknown route, or a new route is a silent gap'
  );
});

/* --- Lock 4 / Lock 5 / D-11 — the NAP contract --------------------------- */

/*
  Delta 2 replaces the old page-wide "exactly one tel: link" assertion, which
  was an artifact of the site having one page.

  THE TEL: LINK BUDGET — a fully composed Phase 2 page carries up to FOUR
  `tel:` links. Do NOT "tighten" this back to three; that turns /get-a-quote
  red. All four, and the component that supplies each:

    1. Header, desktop only (>= 1024px), labelled `+44 7861 936533`  §7.1
    2. StickyCallBar, mobile only, labelled `Call` + an aria-label    §7.12
    3. NAPFooter — the ONE inside <footer>                            §7.2, D-08
    4. QuoteFormEntry's tel: fallback, on pages rendering it          §7.11, §5

  Links 1 and 2 are mutually exclusive at any viewport but BOTH are in the DOM,
  because both are CSS-gated rather than conditionally rendered — that is what
  keeps the whole render server-side.

  `design-system.md:362` says "exactly one tel: IN THE FOOTER". That, clause (a),
  is the real NAP invariant; the cap is the blast-radius limit.
*/
const TEL_LINKS_PER_PAGE_MAX = 4;

test('SC-2a / delta 2: exactly one tel: in the footer, at most four per page', () => {
  for (const p of APP_PAGES) {
    const open = p.html.indexOf('<footer');
    assert.ok(open !== -1, `${p.route}: no <footer> in built HTML`);
    const close = p.html.indexOf('</footer>', open);
    assert.ok(close !== -1, `${p.route}: <footer> is never closed`);

    const inFooter = count(p.html.slice(open, close), TEL_HREF);
    assert.equal(inFooter, 1, `${p.route}: expected exactly 1 tel: between <footer> and </footer>, found ${inFooter}`);

    const all = count(p.html, TEL_HREF);
    assert.ok(
      all <= TEL_LINKS_PER_PAGE_MAX,
      `${p.route}: ${all} tel: links, cap is ${TEL_LINKS_PER_PAGE_MAX} (Header, StickyCallBar, NAPFooter, QuoteFormEntry)`
    );
  }
});

test('SC-2b / delta 2: every tel: on a page dials the same number, and any digits shown match it', () => {
  for (const p of APP_PAGES) {
    // (c) every tel: href on the page is digit-identical after normalising a
    // leading 44. The live bug is one business with three numbers.
    const hrefs = [...p.html.matchAll(TEL_HREF)].map((m) => m[1]);
    assert.ok(hrefs.length, `${p.route}: no tel: link at all`);
    const canonical = nationalise(hrefs[0]);
    for (const href of hrefs) {
      assert.equal(
        nationalise(href),
        canonical,
        `${p.route}: tel:${href} does not dial the same number as tel:${hrefs[0]}`
      );
    }

    // (d) RENDERED TEXT CONTENT, not the raw tag string. StickyCallBar's label
    // is the digit-free word `Call` carrying aria-label="Call Beyond House
    // Cleaning" — scanning the raw tag would read that aria-label as if it were
    // visible text. Seven digits is the threshold below which a number cannot
    // be a phone number.
    for (const m of p.html.matchAll(TEL_ANCHOR)) {
      const shown = digits(decodeEntities(stripTags(m[2])));
      if (shown.length < 7) continue;
      assert.equal(
        shown.replace(/^44/, ''),
        nationalise(m[1]),
        `${p.route}: link text "${stripTags(m[2]).trim()}" does not match its own href tel:${m[1]}`
      );
    }
  }
});

test('SC-2c: no retired phone number appears anywhere in any built page', () => {
  /*
    WR-16. The list used to be hand-written as
    ['07441918832', '447441918832', '447575709361'] — the first number in both
    national and international form, the second in international form only. The
    national form of the third number is the one most likely to be pasted off a
    business card or carried over from a Webflow export, and it passed.

    Both forms are now derived from one list of national numbers, so the pair
    cannot drift again. The digits are assembled rather than written out: this
    file greps the build for these very strings, and a lock that matches its own
    source is a collision this phase has already hit twice.
  */
  const RETIRED_NATIONAL = [
    '0744' + '1918832', // what the live footer actually dials on all 115 pages
    '0757' + '5709361', // the third number, on /get-a-quote
  ];

  for (const p of APP_PAGES) {
    for (const national of RETIRED_NATIONAL) {
      for (const form of [national, `44${national.slice(1)}`]) {
        assert.ok(!p.html.includes(form), `${p.route}: retired number ${form} found in built HTML`);
      }
    }
  }
});

test('SC-2d: no UK postcode appears in any built page', () => {
  // Deliberately NO comment-stripping step here. The analog strips source
  // comments because the docs legitimately name CV32 6EQ as the thing not to
  // ship; prerendered HTML has no source comments, so a strip step would only
  // ever be a hole.
  for (const p of APP_PAGES) {
    const found = findPostcode(p.html);
    assert.ok(!found, `${p.route}: postcode found in built HTML: ${found}`);
  }
});

test('SC-2d: the postcode matcher still matches the forms it is meant to', () => {
  // WR-02 regression guard. SC-2d passes today because nothing renders an
  // address at all, so a matcher that quietly stopped matching would read
  // green forever. These are the forms the single original pattern missed.
  const [a, n, d, t] = ['CV', '32', '6', 'EQ'];
  const mustMatch = [
    `${a}${n} ${d}${t}`,
    `${a}${n}${d}${t}`,
    `${a}${n}  ${d}${t}`,
    `${a}${n}&nbsp;${d}${t}`,
    `${a}${n}&#160;${d}${t}`,
    `${a}${n}\u00a0${d}${t}`, // U+00A0, written as an escape on purpose
    `${a}${n} ${d}${t}`.toLowerCase(),
    `<p class="bhc-footer__area">Warwick ${a}${n} ${d}${t}</p>`.toLowerCase(),
  ];
  for (const form of mustMatch) {
    assert.ok(findPostcode(form), `postcode form not matched: ${JSON.stringify(form)}`);
  }

  // …and it stays quiet on the copy the page actually renders, and on the
  // lowercase build-hash shape that made a naive `i` flag flaky.
  const mustNotMatch = [
    'Serving Warwickshire, Coventry and the West Midlands',
    'Mon–Sat, 8am–7pm',
    'Deep Cleaning in Warwick',
    'o5h8fd--6Limf2FJodaMt',
    '/_next/static/chunks/2y4wans9ulj_u.js',
  ];
  for (const clean of mustNotMatch) {
    assert.equal(findPostcode(clean), null, `false positive on ${JSON.stringify(clean)}`);
  }
});

test('SC-2d: no street address field reaches any built page', () => {
  // D-10 forbids a street address as well as a postcode, and the postcode regex
  // alone catches neither a streetAddress schema field nor a "12 High Street"
  // line carrying no postcode. Trivially absent today — NAPFooter emits
  // areaServed and no address by construction — but this is the lock Phase 3
  // inherits when data-file values feed these components at ~336-page scale.
  for (const p of APP_PAGES) {
    for (const token of ['streetAddress', '"address"']) {
      assert.ok(!p.html.includes(token), `${p.route}: address token ${token} found in built HTML`);
    }

    // WR-04: and now the case the comment above names. `12 High Street` carries
    // no postcode and no schema field, so neither the postcode matcher nor the
    // token list saw it. NAPFooter's `serviceArea` prop is free text rendered
    // straight into the footer — a Phase-3 data file putting a street line there
    // used to pass every assertion in this file. Assumption A1 above: the
    // matched line is printed so a false positive on real prose is diagnosable
    // immediately.
    const found = p.html.match(STREET_LINE);
    assert.ok(!found, `${p.route}: street-address line found in built HTML: ${found && found[0]}`);
  }
});

test('SC-2d: the street-address heuristic matches the line its comment names', () => {
  // Same reasoning as the postcode regression guard: this lock passes today
  // because nothing renders an address, so a matcher that stopped matching
  // would read green forever.
  for (const line of [
    '12 High Street',
    '84 Acacia Road',
    '1a Mill Lane',
    '<p class="bhc-footer__area">Serving 7 Church Crescent and nearby</p>',
    '221 Baker Street, London',
  ]) {
    assert.ok(STREET_LINE.test(line), `street line not matched: ${JSON.stringify(line)}`);
  }

  // …and it stays quiet on the copy the footer and hero actually render.
  for (const clean of [
    'Serving Warwickshire, Coventry and the West Midlands',
    'Mon–Sat, 8am–7pm',
    'Deep Cleaning in Warwick',
    '4.9 from 175 reviews',
    '3 Bedroom Deep Clean',
  ]) {
    assert.ok(!STREET_LINE.test(clean), `false positive on ${JSON.stringify(clean)}`);
  }
});

/* --- delta 4 / delta 5 / delta 12 — headings and landmarks --------------- */

test('delta 4: exactly one <h1> on EVERY prerendered page', () => {
  // PAGES, not APP_PAGES. `_global-error.html` carries exactly one <h1> of its
  // own and needs no exclusion — this is the single assertion in this file that
  // covers it, and UI-SPEC §9.5 is wrong to call it an exclusion here.
  for (const p of PAGES) {
    const n = count(p.html, /<h1/g);
    assert.equal(n, 1, `${p.route}: expected 1 <h1>, found ${n}`);
  }
});

test('delta 4 / SC-4a: every app page renders the <h1> its expectation names', () => {
  for (const p of APP_PAGES) {
    const actual = h1TextOf(p.html);
    assert.equal(
      actual,
      expectationsFor(p.route).h1,
      `${p.route}: <h1> is "${actual}", expected "${expectationsFor(p.route).h1}"`
    );
  }
});

test('delta 4: the <h1> extractor decodes entities', () => {
  // Without this guard twelve pages fail at once for a reason that looks like a
  // copy bug: `&` renders as `&amp;`, and twelve of the seventeen Phase 2 <h1>s
  // contain "Warwickshire & the West Midlands".
  assert.equal(
    h1TextOf('<h1 class="bhc-hero__heading">Deep Cleaning in Warwickshire &amp; the West Midlands</h1>'),
    'Deep Cleaning in Warwickshire & the West Midlands'
  );
  assert.equal(h1TextOf('<h1>What&#39;s Included in Every Clean</h1>'), "What's Included in Every Clean");
  assert.equal(h1TextOf('<h1><span>404</span></h1>'), '404');
});

test('delta 5: one <header>, one primary <nav>, one <main id="main">, one <footer> and one skip link per app page', () => {
  /*
    All four landmark clauses plus the skip link, now that plan 02-13 composes
    `SkipLink`, `Header` and `Footer` into the root layout.

    THE SKIP LINK IS ASSERTED HERE RATHER THAN NOWHERE because its absence is
    SILENT: no page looks different without it, nothing else counts it, and it
    is the first focusable element on every page — the whole of WCAG 2.4.1's
    bypass mechanism. `class="[^"]*bhc-skip-link` and not a bare class name: the
    inlined RSC flight payload carries a serialised `"className":"bhc-skip-link"`
    too, so the bare form reads 2 on a correct page (rule 2 in the header).

    TWO <footer> LANDMARKS IS THE FAILURE MODE THIS CATCHES ON ALL 18 PAGES AT
    ONCE. The layout renders the footer COMPOSITION component and never the
    component it wraps; rendering both would emit two, and the whole structural
    argument behind REQ-nap-consistency is that the NAP block exists once.
  */
  for (const p of APP_PAGES) {
    const headers = count(p.html, /<header/g);
    assert.equal(headers, 1, `${p.route}: expected 1 <header>, found ${headers}`);

    const navs = count(p.html, /<nav aria-label="Primary"/g);
    assert.equal(navs, 1, `${p.route}: expected 1 <nav aria-label="Primary">, found ${navs}`);

    const mains = count(p.html, /<main id="main"/g);
    assert.equal(mains, 1, `${p.route}: expected 1 <main id="main">, found ${mains}`);

    const footers = count(p.html, /<footer/g);
    assert.equal(footers, 1, `${p.route}: expected 1 <footer>, found ${footers}`);

    const skips = count(p.html, /class="[^"]*bhc-skip-link/g);
    assert.equal(skips, 1, `${p.route}: expected 1 skip link, found ${skips}`);
  }
});

test('SC-2e: exactly one <footer> per app page (D-11: NAPFooter lives in the layout only)', () => {
  for (const p of APP_PAGES) {
    const footers = count(p.html, /<footer/g);
    assert.equal(footers, 1, `${p.route}: expected 1 <footer>, found ${footers}`);
  }
});

test('delta 12: at most one aria-current="page" per app page', () => {
  // Attribute form, so the flight payload cannot inflate it. This passes
  // trivially in Phase 2, where every breadcrumb trail is two crumbs long. It
  // exists for Phase 3's ~336 trails, every one of which has an intermediate
  // crumb — the §9.3 defect, caught permanently rather than fixed once.
  for (const p of APP_PAGES) {
    const n = count(p.html, /aria-current="page"/g);
    assert.ok(n <= 1, `${p.route}: ${n} elements carry aria-current="page", at most 1 is allowed`);
  }
});

/* --- delta 6 — no dead internal link ------------------------------------- */

// Served from web/public, so they are real URLs that are not prerendered routes.
const PUBLIC_FILES = new Set(['/robots.txt']);

test('delta 6: every internal link resolves to a prerendered route', () => {
  const routes = new Set(Object.keys(manifest.routes));
  const dead = [];

  for (const p of APP_PAGES) {
    // Scoped to `<a` on purpose: a bare `href="/…"` sweep would drag every
    // `/_next/` asset link, preload and stylesheet into the set.
    for (const m of p.html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)/g)) {
      const raw = m[1];
      if (raw.startsWith('/_next/')) continue;
      const url = raw.length > 1 ? raw.replace(/\/$/, '') : raw;
      if (PUBLIC_FILES.has(url)) continue;
      if (!routes.has(url)) dead.push(`${p.route} -> ${url}`);
    }
  }

  assert.deepEqual(dead, [], `internal link(s) pointing at a URL that is not prerendered: ${dead.join(', ')}`);
});

/* --- SC 4 / Locks 1, 2, 3, 6, 9 — component integration ------------------ */

test('SC-4b: breadcrumbs render exactly where the expectation says, and nowhere else', () => {
  // Route-conditional, and the NEGATIVE half is what keeps it non-vacuous while
  // breadcrumbs are rare: UI-SPEC §9.2 has no Breadcrumbs on `/`, and the lock
  // as written before this rewrite asserted that the home page violated its own
  // contract. Class-name COUNT uses the `class="` form (see rule 2 in the
  // header); the JSON-LD marker uses the serialised `"@type":` form, which the
  // flight payload also inflates.
  for (const p of APP_PAGES) {
    const wanted = expectationsFor(p.route).hasBreadcrumbs;
    const trail = count(p.html, /class="[^"]*bhc-breadcrumbs__list/g);
    const schema = count(p.html, /"@type":"BreadcrumbList"/g);

    if (wanted) {
      assert.ok(trail >= 1, `${p.route}: expected a visible breadcrumb trail, found none`);
      assert.ok(schema >= 1, `${p.route}: expected BreadcrumbList JSON-LD, found none`);
    } else {
      assert.equal(trail, 0, `${p.route}: breadcrumb trail rendered on a page whose contract has none`);
      assert.equal(schema, 0, `${p.route}: BreadcrumbList JSON-LD on a page whose contract has no breadcrumbs`);
    }
  }
});

test('SC-4c: RatingBadge renders server-side on every templated page', () => {
  for (const p of APP_PAGES) {
    const present = p.html.includes('bhc-rating__value">4.9');
    if (NO_RATING_YET.has(p.route)) {
      // Self-restoring: when plan 02-13 gives this route a real template, this
      // assertion fails and forces NO_RATING_YET to be emptied.
      assert.equal(present, false, `${p.route} now renders a RatingBadge — remove it from NO_RATING_YET`);
      continue;
    }
    assert.ok(present, `${p.route}: no server-rendered rating value in built HTML`);
  }
  assert.ok(
    APP_PAGES.some((p) => !NO_RATING_YET.has(p.route)),
    'every app page is exempt from SC-4c — the lock would be vacuous'
  );
});

test('SC-4d: InterlinkBlock — gated, not deleted', () => {
  for (const p of APP_PAGES) {
    const n = count(p.html, /class="[^"]*bhc-interlink__list/g);
    if (INTERLINK_LOCK_ACTIVE) {
      assert.ok(n >= 1, `${p.route}: no InterlinkBlock in built HTML`);
    } else {
      // The inverse, so the gate restores itself. `InterlinkBlock` returns null
      // without town data, so no Phase 2 page renders one; the moment one does,
      // this fails and INTERLINK_LOCK_ACTIVE must be flipped to true.
      assert.equal(
        n,
        0,
        `${p.route}: an InterlinkBlock now renders — set INTERLINK_LOCK_ACTIVE = true so the positive lock takes over`
      );
    }
  }
});

/*
  Delta 8 — the photo placeholder, and the pages that carry one.

  `BeforeAfterSlider` is the ONE component in the package that renders MORE
  without data rather than nothing: given no pairs it emits a labelled,
  finished-looking figure marked `pending`, so no page is blocked on photography
  that does not exist. That is ROADMAP Success Criterion 3, and this is what
  makes it assertable instead of aspirational.

  In Phase 2 exactly seven templates render the slider: Home and the six service
  pages. Every other app page must carry the attribute NOWHERE — the negative
  half is what keeps this from being a lock that would pass on a page that
  accidentally rendered a second slider, and it is the half PHASE 4 INVERTS as
  it backfills real pairs: a backfilled page emits a state that is not
  `pending`, this assertion goes red for that route, and the route moves out of
  the list below. The marker is the machine-readable hand-off between the two
  phases, not decoration.

  THE ATTRIBUTE-WITH-VALUE FORM IS LOAD-BEARING, and it was measured rather than
  assumed. On a correct build the bare attribute NAME reads 2 on every slider
  page — the flight payload serialises the prop key — while
  `data-bhc-photo-state="pending"` reads 1. The negative half tests the bare
  name deliberately: it is a ZERO assertion, so double-counting cannot inflate
  it and scanning the payload as well only makes it stricter.

  Counted by splitting on a plain string rather than with a global regex, so
  nothing here can be mistaken for a bare class-name count by the self-check
  that polices rule 2.
*/
const PHOTO_STATE_ATTR = 'data-bhc-photo-state';
const PHOTO_PENDING_MARKER = `${PHOTO_STATE_ATTR}="pending"`;

const PHOTO_PLACEHOLDER_ROUTES = new Set([
  '/',
  '/services/deep-cleaning',
  '/services/standard-home-cleaning',
  '/services/move-in-cleaning',
  '/services/move-out-cleaning',
  '/services/short-term-rental-cleaning',
  '/services/post-construction-cleaning',
]);

const occurrences = (html, marker) => html.split(marker).length - 1;

test('delta 8 / SC-3: the photo placeholder renders on exactly the seven slider pages', () => {
  for (const p of APP_PAGES) {
    if (PHOTO_PLACEHOLDER_ROUTES.has(p.route)) {
      const n = occurrences(p.html, PHOTO_PENDING_MARKER);
      assert.equal(
        n,
        1,
        `${p.route}: expected exactly 1 pending photo placeholder, found ${n} — if Phase 4 has backfilled real pairs here, remove this route from PHOTO_PLACEHOLDER_ROUTES`
      );
      continue;
    }

    // Zero assertion, so the bare attribute name is the stricter form.
    assert.ok(
      !p.html.includes(PHOTO_STATE_ATTR),
      `${p.route}: a BeforeAfterSlider renders on a page whose template has none — add the route to PHOTO_PLACEHOLDER_ROUTES or remove the slider`
    );
  }

  assert.ok(
    APP_PAGES.some((p) => PHOTO_PLACEHOLDER_ROUTES.has(p.route)),
    'no app page is in PHOTO_PLACEHOLDER_ROUTES — the positive half of this lock would be vacuous'
  );
});

test('SC-4e: Button renders from the package', () => {
  for (const p of APP_PAGES) {
    const present = /class="[^"]*bhc-btn--primary/.test(p.html);
    if (NO_PRIMARY_CTA_YET.has(p.route)) {
      // Self-restoring, same reasoning as NO_RATING_YET: plan 02-08 gives
      // /get-a-quote a CTA and plan 02-13 gives /_not-found one.
      assert.equal(present, false, `${p.route} now renders a primary Button — remove it from NO_PRIMARY_CTA_YET`);
      continue;
    }
    assert.ok(present, `${p.route}: no bhc-btn--primary in built HTML`);
  }
  assert.ok(
    APP_PAGES.some((p) => !NO_PRIMARY_CTA_YET.has(p.route)),
    'every app page is exempt from SC-4e — the lock would be vacuous'
  );
});

test('SC-4f: each app page emits exactly the JSON-LD blocks its expectation names', () => {
  /*
    In the FILE, not in a hydrated DOM — that is what proves none of them is
    client-injected (Lock 9).

    TAG FORM, never the bare marker. Measured on this repo: the bare string
    `application/ld+json` returns 6 on a page carrying 3 blocks, because the RSC
    flight payload inlines a serialised copy of every one.

    DECISION recorded here because this assertion is where it bites:
    `RatingBadge.emitSchema` is OFF on every Phase 2 template. Emitting
    seventeen orphaned AggregateRating nodes would make the deferred CR-05
    seventeen times worse for Phase 5 to unwind, and the visible badge already
    satisfies Lock 3 in `bare` mode. So the steady state is 1 block on Home
    (NAPFooter's) and 2 elsewhere (NAPFooter + Breadcrumbs) — never 3, which is
    what this assertion demanded before the rewrite.
  */
  const OPEN_TAG = /<script[^>]*type="application\/ld\+json"/g;
  for (const p of APP_PAGES) {
    const n = count(p.html, OPEN_TAG);
    assert.equal(
      n,
      expectationsFor(p.route).ldJsonBlocks,
      `${p.route}: expected ${expectationsFor(p.route).ldJsonBlocks} JSON-LD block(s) on disk, found ${n}`
    );
  }
});

test('delta 7: FAQPage schema appears on no page at all', () => {
  // D13 / SC-4: the FAQAccordion is markup, not schema — Google retired FAQ
  // rich results for most sites, and emitting it invites a manual action for no
  // gain. A BARE substring grep is correct here precisely BECAUSE the assertion
  // is zero: double-counting a zero is still zero, and scanning the inlined
  // flight payload as well makes this strictly stricter. PAGES, not APP_PAGES.
  for (const p of PAGES) {
    assert.ok(!p.html.includes('FAQPage'), `${p.route}: FAQPage schema found in built HTML`);
  }
});

/* --- delta 11 — the client boundary, both halves ------------------------- */

test('SC-4g: no client-reference manifest declares a first-party client module', () => {
  /*
    WR-03. This slot used to hold a substring test for the directive against
    rendered HTML, which can never fail: the directive is a compile-time marker
    consumed by the bundler and Next never emits it into rendered output. It
    read as a lock and covered nothing.

    Delta 11(i). The replacement then read ONE manifest, the root route's, as a
    single hardcoded path — and a probe PROVED
    that hole: a client component used only on a non-root route produced
    firstParty=1 in that route's OWN manifest while the root manifest stayed at
    firstParty=0, so the lock passed. Next emits one manifest per route entry,
    so every one must be read.

    A readdirSync recursion rather than a shell glob: dynamic-segment
    directories contain literal `[` and `]`, which a glob may mangle.

    THE TRIPWIRE COUNTS ROUTE ENTRIES, NOT PRERENDERED PAGES, and the
    distinction only became visible when the first `generateStaticParams` route
    landed. Next emits ONE manifest per route ENTRY — one `page.js` in
    `.next/server/app` — so `app/services/[service]` contributes a single
    manifest while contributing six prerendered pages. Comparing against
    `APP_PAGES.length` therefore fails on a correct build the moment a dynamic
    route exists (measured: 14 manifests, 18 pages), and would go on to
    under-count by ~330 in Phase 3. Comparing against the built `page.js` files
    is the invariant the paragraph above actually states, and it stays exact
    rather than an inequality that happens to hold.
  */
  const built = walk(join(ROOT, '.next/server/app'));
  const manifests = built.filter((f) => f.endsWith('page_client-reference-manifest.js'));
  const routeEntries = built.filter((f) => f.endsWith(`${sep}page.js`));

  assert.ok(
    manifests.length >= routeEntries.length,
    `found ${manifests.length} client-reference manifest(s) for ${routeEntries.length} route entr(ies) — the build layout changed and this lock is no longer reading every route`
  );

  for (const file of manifests) {
    const context = createContext({});
    runInContext(readFileSync(file, 'utf8'), context);
    const rsc = runInContext('globalThis.__RSC_MANIFEST', context);
    assert.ok(rsc, `${file}: no __RSC_MANIFEST — the manifest shape changed`);

    const entries = Object.values(rsc).flatMap((m) => Object.keys(m.clientModules || {}));
    assert.ok(entries.length, `${file}: declares no client modules at all — the manifest shape changed`);

    const firstParty = entries.filter((id) => !id.includes('/node_modules/next/'));
    assert.deepEqual(
      firstParty,
      [],
      `${file}: first-party client component(s) in the build — D-07 forbids them: ${firstParty.join(', ')}`
    );
  }
});

/*
  Delta 11(ii). THREE walk roots, and all three are scanned UNCONDITIONALLY:

    web/app             — the routes
    web/content         — every data module and the shared block renderer
    design-system/src   — all sixteen new components

  Neither of the last two was covered by either half of the old lock, and both
  receive this phase's new files. Do NOT add an `existsSync` filter and do NOT
  change `walk()`: a scan that skips a missing directory goes silently quiet the
  moment that directory is renamed, and then proves nothing forever.
  `web/content/.gitkeep` exists precisely so this stays unconditional from wave
  1, before plan 02-06 adds the first real file there.
*/
const DIRECTIVE_SCAN_ROOTS = [
  join(ROOT, 'app'), // web/app
  join(ROOT, 'content'), // web/content
  join(REPO, 'design-system', 'src'), // design-system/src
];

test('SC-4g: no source file in web/app, web/content or design-system/src declares a client directive', () => {
  // Assembled from fragments, not written literally — see rule 3 in the header.
  // Two earlier revisions of this repo's scanners matched their own source.
  const DIRECTIVE = ['use', 'client'].join(' ');

  for (const root of DIRECTIVE_SCAN_ROOTS) {
    const files = walk(root);
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      assert.ok(
        !src.includes(DIRECTIVE),
        `client directive in ${f} — D-07 forbids client components`
      );
    }
  }
});

/* --- SC-1b / D-04 — built from tokens.css, in exactly one stylesheet ----- */

test('SC-1b: --bhc-ink is declared exactly once across the built CSS', () => {
  // Zero means the token pipeline broke or the token stylesheet was forked;
  // more than one means both stylesheets were imported and every token
  // declaration is duplicated. This is what makes "built from the design
  // system's token layer" a permanent gate rather than a one-time check.
  const sheets = walk(join(ROOT, '.next/static')).filter((f) => f.endsWith('.css'));
  let n = 0;
  for (const f of sheets) n += count(readFileSync(f, 'utf8'), /--bhc-ink:/g);
  assert.equal(
    n,
    1,
    `expected exactly 1 --bhc-ink declaration across ${sheets.length} built CSS file(s), found ${n}`
  );
});

test('SC-1b: the app ships exactly one stylesheet, linked once per page', () => {
  /*
    Pitfall 7. A single well-meant route-level `import './x.css'` — "just this
    one page's layout" — produces a SECOND hashed chunk. That splits sixteen
    components' rules across two files, breaks the cascade order between them,
    and makes the assertion above ambiguous. layout.jsx is the only file in the
    app that imports CSS, and this is what keeps it that way.
  */
  const sheets = walk(join(ROOT, '.next/static')).filter((f) => f.endsWith('.css'));
  assert.equal(
    sheets.length,
    1,
    `expected exactly 1 built stylesheet, found ${sheets.length}: ${sheets.join(', ')}`
  );

  for (const p of APP_PAGES) {
    const links = count(p.html, /<link[^>]*rel="stylesheet"/g);
    assert.equal(links, 1, `${p.route}: expected 1 <link rel="stylesheet">, found ${links}`);
  }
});

/* --- D-14b / D-15 — no third-party script, no indexing ------------------- */

/**
 * Every <script> tag whose src is not a root-relative same-origin asset.
 *
 * The previous form was `/<script src="http[^"]*"/g`, which only matched when
 * `src` was the FIRST attribute. React renders DOM attributes in JSX source
 * order, so the idiomatic analytics snippet — `<script async src="…gtm.js">` —
 * put `async` first and scored zero matches. The assertion's own comment
 * claimed "Adding GTM, GA4 or Trustmary without sign-off fails here"; it did
 * not. Protocol-relative `//host/…` was missed too, and it is the form a
 * copy-pasted vendor snippet is most likely to arrive in.
 *
 * Internal Next.js assets are always root-relative and never protocol-relative,
 * so `/` followed by a non-`/` is the whole allowlist — no vendor host list to
 * maintain, and no scheme to enumerate.
 */
const externalScriptTags = (source) =>
  (source.match(/<script\b[^>]*>/g) || []).filter((tag) => {
    const found = tag.match(/\bsrc="([^"]*)"/);
    if (!found) return false; // inline script — a different assertion's job
    return !/^\/(?!\/)/.test(found[1]);
  });

test('D-14b: no external-origin script tag on any app page', () => {
  // Per page, not on the home page only: a vendor snippet added to one template
  // is exactly the shape this is meant to catch.
  for (const p of APP_PAGES) {
    const external = externalScriptTags(p.html);
    assert.equal(external.length, 0, `${p.route}: external-origin script tag: ${external.join(', ')}`);
  }
});

test('D-14b: the external-script detector is attribute-order independent', () => {
  // Regression guard for CR-03. Without this the assertion above can silently
  // stop catching anything and the built pages will still be clean, so the lock
  // reads green for the wrong reason. Each case below is a real installation
  // form: src-first, async-first, multi-attribute, and protocol-relative.
  const mustCatch = [
    '<script src="https://x.com/a.js">',
    '<script async src="https://www.googletagmanager.com/gtm.js">',
    '<script defer data-domain="x" src="https://plausible.io/js/script.js">',
    '<script src="//cdn.x.com/a.js">',
    '<script async src="//widget.trustmary.com/x">',
    '<script src="http://x.com/a.js" async="">',
  ];
  for (const tag of mustCatch) {
    assert.equal(externalScriptTags(tag).length, 1, `external script not caught: ${tag}`);
  }

  const mustAllow = [
    '<script src="/_next/static/chunks/a.js" async="">',
    '<script async="" src="/_next/static/chunks/a.js">',
    '<script src="/_next/static/chunks/a.js" noModule="">',
    '<script type="application/ld+json">',
    '<script>',
  ];
  for (const tag of mustAllow) {
    assert.equal(externalScriptTags(tag).length, 0, `false positive on an internal tag: ${tag}`);
  }
});

test('D-15: every robots meta tag on every app page says noindex', () => {
  /*
    WR-17. This used to be `html.match(/…/)` with no `g` flag, so only the FIRST
    robots meta was inspected. Multiple robots metas are not hypothetical:
    `_not-found.html` ships two. A page emitting a permissive tag after a
    restrictive one would have passed.

    Scoped to APP_PAGES, which is delta 1's trap: `_global-error.html` carries
    ZERO robots metas, so `assert.ok(metas.length)` fails on it the instant the
    harness stops reading only index.html. The exclusion and the globbing have
    to ship together.
  */
  for (const p of APP_PAGES) {
    const metas = [...p.html.matchAll(/<meta[^>]*name="robots"[^>]*>/g)].map((m) => m[0]);
    assert.ok(metas.length, `${p.route}: no name="robots" meta tag in built HTML`);
    for (const meta of metas) {
      assert.match(meta, /content="[^"]*noindex/, `${p.route}: robots meta does not noindex: ${meta}`);
    }
  }
});

test('D-15: robots.txt blocks every crawler at host level', () => {
  const txt = read(join(ROOT, 'public/robots.txt'), 'the host-level half of the D-15 crawl block is missing');
  // The file's own comments discuss the post-cutover rule, so read directives only.
  const rules = txt
    .split('\n')
    .filter((l) => !/^\s*#/.test(l))
    .join('\n');
  assert.ok(rules.includes('User-agent: *'), 'robots.txt has no `User-agent: *` group');
  assert.ok(rules.includes('Disallow: /'), 'robots.txt does not disallow the site');
  assert.ok(!/^\s*Allow:/m.test(rules), 'robots.txt contains an Allow rule — D-15 blocks everything pre-cutover');
});
