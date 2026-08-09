/**
 * Built-HTML lock assertions.
 *
 * The design system's locks are assertions rather than guidance because the
 * live site regressed silently on nearly all of them. This file is the second
 * half of that idea: design-system/test/locks.test.js scans package SOURCE,
 * this scans the file `next build` writes to DISK. Reading the on-disk artifact
 * is the point — it proves the output is server-rendered without running a
 * browser, which is exactly what Locks 3 and 9 exist to guarantee. A
 * browser-based check would pass even if the content were client-injected.
 *
 * The live-site defects that motivate the NAP group: the footer DISPLAYS
 * +44 7861 936533 and DIALS 07441918832 on all 115 pages, with a third number
 * (+447575709361) on /get-a-quote. Three numbers, one business.
 *
 * Covers: SC-1b, SC-2a…2e, SC-4a…4g, D-04, D-07, D-10, D-14b, D-15.
 *
 *   node --test web/scripts/check-html-locks.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';

// No third-party imports, ever. Enforcement code that depends on the supply
// chain it is meant to survive is not enforcement. No DOM parser either — the
// analog proves regex-against-string is sufficient for every assertion here.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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
*/
const STREET_LINE =
  /\b\d{1,4}[a-zA-Z]?\s+(?:[A-Z][a-z]+\s+){1,2}(?:Road|Rd|Street|St|Avenue|Ave|Lane|Ln|Close|Drive|Dr|Way|Court|Crescent|Terrace|Grove|Gardens|Place|Park|Hill|Walk|Row|Mews)\b/;

// The scaffold page's town (web/app/page.jsx). Phase 2 replaces that page with
// real templates — update this constant with it.
const TOWN = 'Warwick';

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

const HTML_PATH = join(ROOT, '.next/server/app/index.html');
const html = read(
  HTML_PATH,
  'run `npm run build --workspace @bhc/web` first — these locks assert against build output, not source'
);

/* --- Lock 4 / Lock 5 / D-11 — the NAP contract --------------------------- */

test('SC-2a: the built page contains exactly one tel: link', () => {
  const tels = html.match(/href="tel:[^"]+"/g) || [];
  assert.equal(tels.length, 1, `expected 1 tel: link, found ${tels.length}: ${tels.join(', ')}`);
});

test('SC-2b: the tel: href digits equal the displayed digits', () => {
  const tels = html.match(/href="tel:[^"]+"/g) || [];
  const href = tels[0].match(/tel:([^"]+)/)[1];
  const label = html.match(/class="bhc-footer__phone"[^>]*>([^<]+)</)[1];

  // Nationally normalised on both sides: the live bug is a footer whose label
  // and href are two independent inputs that drifted apart.
  assert.equal(
    digits(href).replace(/^44/, ''),
    digits(label).replace(/^44/, ''),
    `href ${href} does not dial the displayed number ${label}`
  );
});

test('SC-2c: no retired phone number appears anywhere in the built page', () => {
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

  for (const national of RETIRED_NATIONAL) {
    for (const form of [national, `44${national.slice(1)}`]) {
      assert.ok(!html.includes(form), `retired number ${form} found in built HTML`);
    }
  }
});

test('SC-2d: no UK postcode appears in the built page', () => {
  // Deliberately NO comment-stripping step here. The analog strips source
  // comments because the docs legitimately name CV32 6EQ as the thing not to
  // ship; prerendered HTML has no source comments, so a strip step would only
  // ever be a hole.
  const found = findPostcode(html);
  assert.ok(!found, `postcode found in built HTML: ${found}`);
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

test('SC-2d: no street address field reaches the built page', () => {
  // D-10 forbids a street address as well as a postcode, and the postcode regex
  // alone catches neither a streetAddress schema field nor a "12 High Street"
  // line carrying no postcode. Trivially absent today — NAPFooter emits
  // areaServed and no address by construction — but this is the lock Phase 3
  // inherits when data-file values feed these components at ~336-page scale.
  for (const token of ['streetAddress', '"address"']) {
    assert.ok(!html.includes(token), `address token ${token} found in built HTML`);
  }

  // WR-04: and now the case the comment above names. `12 High Street` carries
  // no postcode and no schema field, so neither the postcode matcher nor the
  // token list saw it. NAPFooter's `serviceArea` prop is free text rendered
  // straight into the footer — a Phase-3 data file putting a street line there
  // used to pass every assertion in this file.
  const found = html.match(STREET_LINE);
  assert.ok(!found, `street-address line found in built HTML: ${found && found[0]}`);
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

test('SC-2e: the built page contains exactly one <footer>', () => {
  const footers = html.match(/<footer/g) || [];
  assert.equal(footers.length, 1, `expected 1 <footer>, found ${footers.length}`);
});

/* --- SC 4 / Locks 1, 2, 3, 6, 9 — component integration ------------------ */

test('SC-4a: Hero renders exactly one <h1> carrying the town name', () => {
  const h1s = html.match(/<h1/g) || [];
  assert.equal(h1s.length, 1, `expected 1 <h1>, found ${h1s.length}`);

  const heading = html.match(/bhc-hero__heading[^>]*>([^<]+)</);
  assert.ok(heading, 'no bhc-hero__heading element in built HTML');
  assert.ok(
    heading[1].includes(TOWN),
    `hero heading "${heading[1]}" does not carry the town name ${TOWN}`
  );
});

test('SC-4b: Breadcrumbs render a visible trail and BreadcrumbList JSON-LD', () => {
  for (const token of ['bhc-breadcrumbs__list', '"@type":"BreadcrumbList"']) {
    assert.ok(html.includes(token), `missing from built HTML: ${token}`);
  }
});

test('SC-4c: RatingBadge renders server-side', () => {
  assert.ok(html.includes('bhc-rating__value">4.9'), 'no server-rendered rating value in built HTML');
});

test('SC-4d: InterlinkBlock renders', () => {
  assert.ok(html.includes('bhc-interlink__list'), 'no bhc-interlink__list in built HTML');
});

test('SC-4e: Button renders from the package', () => {
  assert.ok(html.includes('bhc-btn--primary'), 'no bhc-btn--primary in built HTML');
});

test('SC-4f: all three JSON-LD blocks are in the file on disk', () => {
  // In the FILE, not in a hydrated DOM — that is what proves none of them is
  // client-injected (Lock 9).
  const OPEN_TAG = '<script type="application/ld+json"';
  const blocks = html.split(OPEN_TAG).length - 1;
  assert.equal(blocks, 3, `expected 3 JSON-LD blocks on disk, found ${blocks}`);
});

test('SC-4g: the build declares no first-party client component', () => {
  /*
    WR-03. This slot used to hold `assert.ok(!html.includes('use client'))`,
    which can never fail: the directive is a compile-time marker consumed by the
    bundler and Next never emits the string into rendered HTML. It read as a
    lock and covered nothing. Proven by probe — prepending the directive to
    RatingBadge.jsx and rebuilding left `html.includes(…)` false, so a real
    client component would have sailed past it.

    The real signal is the client-reference manifest. Every module Next will
    ship to the browser as a client component is enumerated there, so the
    falsifiable form of "D-07 forbids client components" is: every entry belongs
    to the framework's own bootstrap. The same probe makes THIS assertion fail,
    which is the whole difference.
  */
  const MANIFEST = join(ROOT, '.next/server/app/page_client-reference-manifest.js');
  const source = read(
    MANIFEST,
    'run `npm run build --workspace @bhc/web` first — this asserts against build output'
  );

  const context = createContext({});
  runInContext(source, context);
  const manifest = runInContext('globalThis.__RSC_MANIFEST', context);
  assert.ok(manifest, 'no __RSC_MANIFEST in the client-reference manifest — its shape changed');

  const entries = Object.values(manifest).flatMap((m) => Object.keys(m.clientModules || {}));
  assert.ok(entries.length, 'the manifest declares no client modules at all — its shape changed');

  const firstParty = entries.filter((id) => !id.includes('/node_modules/next/'));
  assert.deepEqual(
    firstParty,
    [],
    `first-party client component(s) in the build — D-07 forbids them: ${firstParty.join(', ')}`
  );
});

test('SC-4g: no file under web/app declares a client directive', () => {
  const DIRECTIVE = 'use client';
  for (const f of walk(join(ROOT, 'app'))) {
    const src = readFileSync(f, 'utf8');
    assert.ok(!src.includes(DIRECTIVE), `client directive in ${f} — D-07 forbids client components`);
  }
});

/* --- SC-1b / D-04 — built from tokens.css -------------------------------- */

test('SC-1b: --bhc-ink is declared exactly once across the built CSS', () => {
  // Zero means the token pipeline broke or the token stylesheet was forked;
  // more than one means both stylesheets were imported and every token
  // declaration is duplicated. This is what makes "built from the design
  // system's token layer" a permanent gate rather than a one-time check.
  const sheets = walk(join(ROOT, '.next/static')).filter((f) => f.endsWith('.css'));
  let count = 0;
  for (const f of sheets) count += (readFileSync(f, 'utf8').match(/--bhc-ink:/g) || []).length;
  assert.equal(
    count,
    1,
    `expected exactly 1 --bhc-ink declaration across ${sheets.length} built CSS file(s), found ${count}`
  );
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

test('D-14b: no external-origin script tag in the built page', () => {
  const external = externalScriptTags(html);
  assert.equal(external.length, 0, `external-origin script tag: ${external.join(', ')}`);
});

test('D-14b: the external-script detector is attribute-order independent', () => {
  // Regression guard for CR-03. Without this the assertion above can silently
  // stop catching anything and the built page will still be clean, so the lock
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

test('D-15: the built page carries a noindex robots meta tag', () => {
  const meta = html.match(/<meta[^>]*name="robots"[^>]*>/);
  assert.ok(meta, 'no name="robots" meta tag in built HTML');
  assert.match(meta[0], /content="[^"]*noindex/, `robots meta does not noindex: ${meta[0]}`);
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
