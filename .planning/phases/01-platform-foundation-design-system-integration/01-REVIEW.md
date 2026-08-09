---
phase: 01-platform-foundation-design-system-integration
reviewed: 2026-08-09T14:19:45Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - .github/workflows/ci.yml
  - design-system/package.json
  - design-system/src/components/Breadcrumbs/Breadcrumbs.jsx
  - design-system/src/components/NAPFooter/NAPFooter.jsx
  - design-system/src/components/RatingBadge/RatingBadge.jsx
  - design-system/src/jsonLd.js
  - design-system/test/locks.test.js
  - package.json
  - web/app/layout.jsx
  - web/app/page.jsx
  - web/next.config.mjs
  - web/package.json
  - web/public/robots.txt
  - web/scripts/check-budget.mjs
  - web/scripts/check-html-locks.mjs
findings:
  critical: 5
  warning: 18
  info: 0
  total: 23
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-08-09T14:19:45Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

The phase ships a two-package workspace plus three enforcement scripts that are explicitly framed as *locks* — assertions that are supposed to make the live site's regressions structurally impossible. The scaffolding is sound and every check currently passes (I ran the build output through both scripts: 18/18 HTML locks green, budget green at 168.5 KB / 500 KB). The defects are almost all in the enforcement layer itself, and they matter more than ordinary bugs because the whole phase's value proposition is "these locks cannot be silently bypassed."

Five of the checks either fail open, measure nothing, or assert something that can never be false. I verified each of these empirically rather than by inspection:

- `node --test design-system/test/*.test.js` **exits 0 with zero tests** when the glob matches nothing (confirmed on Node v22.23.1, the exact version CI pins). Delete or rename the lock suite and the D-13 gate stays green.
- `check-budget.mjs` `continue`s past any script it cannot resolve on disk, with no skip counter and no failure — so the budget can report `0.0 KB` and exit 0.
- The D-14b "no external-origin script" regex only matches when `src` is the *first* attribute. `<script async src="https://www.googletagmanager.com/gtm.js">` — the single most likely way anyone adds GA/GTM — scores **0 matches** (verified).
- `formatPhone` returns its raw input on the fallback branch, so display and href *can* diverge, contradicting the module's own "the two cannot diverge" claim; and `toDial` prefixes `+44` onto any non-`44` number, producing `tel:+4414155552671` from `+1 415 555 2671` while displaying `+1 415 555 2671` — a case SC-2b's normalisation does **not** catch.
- `RatingBadge` emits a `LocalBusiness` node with no `@id`, while `NAPFooter` emits `HomeAndConstructionBusiness` at `@id: {site}/#business`. The AggregateRating therefore attaches to a second, orphaned entity — the exact opposite of the component's stated purpose ("outputs AggregateRating for the entity graph").

Everything in the phase-context "not a defect" list was respected and is not reported here (zero-dep design system, deliberate noindex, no address in HTML, `safeJsonLd` not re-exported). On the specific question posed: **the `<` → `<` escaping is sufficient** for the `<script type="application/ld+json">` sink — it defeats both `</script>` and `<!--` — and all three emitters use it correctly. The gap is that nothing *enforces* its use (WR-13).

## Critical Issues

### CR-01: The design-system lock gate fails open — a non-matching test glob exits 0

**File:** `.github/workflows/ci.yml:44`, `design-system/package.json:16`, `package.json:6`
**Issue:** The `locks` job runs `node --test design-system/test/*.test.js`. Bash leaves a non-matching glob as a literal, and Node's test runner then treats the argument as a glob pattern of its own. A glob that resolves to zero files is **not an error** — the runner prints `# tests 0 / # pass 0 / # fail 0` and exits 0.

Verified on Node v22.23.1 (the version CI pins):

```
$ node --test /tmp/rv/nope/*.test.js
1..0
# tests 0
# fail 0
unquoted-nomatch exit=0
```

Contrast with an explicit path, which does fail correctly:

```
$ node --test /tmp/rv/definitely-missing.mjs
Could not find '/tmp/rv/definitely-missing.mjs'
explicit-missing exit=1
```

So renaming `locks.test.js`, moving it into a subdirectory, or a future `test/helpers/` reorganisation turns the D-13 gate into a no-op that still reports green. The same hole is in `design-system/package.json`'s `test` script and therefore in the root `test:locks` and `verify` chains. The workflow comment at line 10 states "a lock suite that runs but does not gate is not a lock" — this is a lock suite that can stop running without anyone noticing.

**Fix:** Assert a minimum test count, or enumerate the files explicitly. The cheapest robust form:

```yaml
      - name: Design-system lock tests (D-12)
        run: |
          shopt -s nullglob
          files=(design-system/test/*.test.js)
          if [ ${#files[@]} -eq 0 ]; then
            echo "::error::no design-system lock tests matched — the D-13 gate would have passed vacuously"
            exit 1
          fi
          node --test "${files[@]}"
        shell: bash
```

Apply the same guard to `design-system/package.json`'s `test` script (or point it at an explicit `test/locks.test.js`).

---

### CR-02: The performance budget silently skips every script it cannot resolve — it can pass measuring 0 bytes

**File:** `web/scripts/check-budget.mjs:67-72`
**Issue:**

```js
for (const s of srcs) {
  const f = join(ROOT, '.next', s.replace('/_next/', ''));
  if (!existsSync(f)) continue;   // <-- silent
  js += gzipSync(readFileSync(f)).length;
}
```

Nothing counts or reports the skips. If the on-disk layout changes (a Next minor bump, an `assetPrefix`, a `distDir` override, a static-export switch), `existsSync` returns false for *every* entry, `js` stays 0, `page` becomes just the HTML bytes (~23 KB), and the script prints `JS (gzip): 0.0 KB / 500 KB (6 script tags)` and **exits 0**. D-14 then gates nothing while looking healthy.

The same `continue` also means an external-origin script contributes **zero** to the JS budget: `join(ROOT, '.next', 'https://cdn.example.com/lib.js')` never exists on disk. Combined with CR-03, a third-party bundle is invisible to both the budget gate and the third-party gate.

`s.replace('/_next/', '')` is also unanchored and non-global, so it rewrites the first occurrence anywhere in the string rather than a known prefix.

**Fix:** Fail on any unresolved script, and reject non-relative sources outright:

```js
let js = 0;
const unresolved = [];
for (const s of srcs) {
  if (!s.startsWith('/_next/')) {
    unresolved.push(`${s} (not a local /_next/ asset — external scripts are not budgeted)`);
    continue;
  }
  const f = join(ROOT, '.next', s.slice('/_next/'.length));
  if (!existsSync(f)) { unresolved.push(`${s} -> ${f} missing`); continue; }
  js += gzipSync(readFileSync(f)).length;
}
if (unresolved.length) {
  console.error('BUDGET MEASUREMENT INCOMPLETE — refusing to report a verdict:');
  for (const u of unresolved) console.error(`  ${u}`);
  process.exit(1);
}
if (srcs.length === 0) {
  console.error('no <script src> tags found in built HTML — the budget measured nothing');
  process.exit(1);
}
```

---

### CR-03: The "no third-party script" lock (D-14b) is bypassed by attribute ordering

**File:** `web/scripts/check-html-locks.mjs:192`
**Issue:** `html.match(/<script src="http[^"]*"/g)` only matches when `src` is the **first** attribute on the tag. React renders DOM attributes in JSX source order, so the idiomatic way to add an analytics tag puts `async` first and slips straight through. Verified:

```
'<script src="https://x.com/a.js">'                             -> 1 match
'<script async src="https://www.googletagmanager.com/gtm.js">'  -> 0 matches
'<script src="//cdn.x.com/a.js">'                               -> 0 matches
'<script defer data-x src="https://x">'                         -> 0 matches
```

The comment above the assertion claims "Adding GTM, GA4 or Trustmary without sign-off fails here." It does not. Protocol-relative `//host/...` URLs are missed too, as is an inline third-party snippet injected via `dangerouslySetInnerHTML` (which is how Trustmary and most tag managers are actually installed). Note the built page today contains 11 `<script>` tags of which only 6 have `src` — 2 are inline RSC payload scripts the assertion never inspects.

**Fix:** Parse each script tag, then inspect its `src`, and separately reject inline scripts that are not the JSON-LD blocks:

```js
test('D-14b: no external-origin script tag in the built page', () => {
  const tags = html.match(/<script\b[^>]*>/g) || [];
  const external = tags.filter((t) => {
    const src = t.match(/\bsrc="([^"]*)"/);
    if (!src) return false;
    return !src[1].startsWith('/'); // internal assets are always root-relative
  });
  assert.equal(external.length, 0, `external-origin script tag: ${external.join(', ')}`);
});

test('D-14b: no unexpected inline script in the built page', () => {
  // Framework bootstrap + the 3 JSON-LD blocks are the only inline scripts allowed.
  const inline = (html.match(/<script(?![^>]*\bsrc=)[^>]*>/g) || [])
    .filter((t) => !t.includes('application/ld+json'));
  assert.ok(inline.length <= 2, `unexpected inline script(s): ${inline.join(', ')}`);
});
```

---

### CR-04: `formatPhone` can diverge from `toDial`, and `toDial` mangles any non-`+44` number

**File:** `design-system/src/components/NAPFooter/formatPhone.js:19-33`
**Issue:** Two defects in the module that is the entire mechanism behind Lock 4.

1. `formatPhone` returns `String(value)` **unchanged** when the national part is not exactly 10 digits (line 31), while `toDial` still returns a `+44…` string. Display and href are then two different numbers — precisely the live-site bug the file's header says is "only possible when display and href are separate inputs."
2. `toDial` blindly prefixes `+44` to anything not already starting with `44`, so a non-UK number is corrupted into a nonexistent UK number.

Verified against the real module:

```
"078619365333"    dial=+4478619365333   display="078619365333"     MATCH=false
"0786193653"      dial=+44786193653     display="0786193653"       MATCH=false
"+1 415 555 2671" dial=+4414155552671   display="+1 415 555 2671"  MATCH=true  <-- lock passes, href is garbage
""                dial=+44              display=""                 MATCH=true  <-- empty link text
```

The `+1` row is the dangerous one: SC-2b normalises both sides with `.replace(/^44/, '')`, which strips the *fabricated* `44` off the href and the *real* `1` prefix is preserved on both sides by coincidence, so the built-HTML lock reports green while every visitor who taps the footer dials a number that does not exist. On ~336 Phase-3 pages fed from a data file, that is silent lead loss — the exact failure class this component was written to eliminate.

`phone=""` produces `href="tel:+44"` wrapping empty link text (an empty interactive element, WCAG 2.4.4 failure).

**Fix:** Make the module fail loudly instead of degrading:

```js
const UK_NATIONAL_LEN = 10;

export function toDial(value) {
  const d = digitsOf(value);
  const national = d.startsWith('44') ? d.slice(2) : d.replace(/^0/, '');
  if (national.length !== UK_NATIONAL_LEN) {
    throw new Error(
      `Invalid UK phone number ${JSON.stringify(value)}: expected ${UK_NATIONAL_LEN} national digits, got ${national.length}`
    );
  }
  return `+44${national}`;
}

export function formatPhone(value) {
  const national = toDial(value).slice(3); // throws on bad input — never silently passes through
  return `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
}
```

Then add a lock test that asserts the throw, and add a `+1`-style case to `locks.test.js`.

---

### CR-05: RatingBadge's AggregateRating attaches to an orphaned entity, not the business node

**File:** `design-system/src/components/RatingBadge/RatingBadge.jsx:62-73` (vs `design-system/src/components/NAPFooter/NAPFooter.jsx:51-52`)
**Issue:** `NAPFooter` emits:

```json
{"@type":"HomeAndConstructionBusiness","@id":"https://www.beyondhousecleaning.com/#business","name":"Beyond House Cleaning", ...}
```

`RatingBadge` independently emits:

```json
{"@type":"LocalBusiness","name":"Beyond House Cleaning","aggregateRating":{...}}
```

No `@id`, no `sameAs`, no `mainEntityOfPage` — nothing links the two. Every page therefore declares **two unconnected business entities with the same name and different `@type`s**, and the rating hangs off the one that has no identity, no URL and no telephone. The component's own docstring says the schema "outputs AggregateRating for the entity graph"; as written it does the opposite — it fragments the graph. `RatingBadge` also has no `siteUrl`/`@id` prop, so a caller *cannot* fix this from the outside.

No lock catches it: `SC-4f` only counts three `ld+json` blocks, and `SC-4b` only greps for the literal `"@type":"BreadcrumbList"`. Nothing validates JSON-LD content.

**Fix:** Reference the canonical node instead of minting a new one.

```jsx
export function RatingBadge({ /* … */ siteUrl = 'https://www.beyondhousecleaning.com', ... }) {
  // …
  __html: safeJsonLd({
    '@context': 'https://schema.org',
    '@id': `${siteUrl}/#business`,   // same node NAPFooter declares
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(rating),
      reviewCount: String(count),
      bestRating: '5',
      worstRating: '1',
    },
  })
```

And add a lock asserting the graph joins up:

```js
test('SC-4h: the AggregateRating attaches to the declared business node', () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]));
  const biz = blocks.find((b) => b['@id']?.endsWith('/#business'));
  const rated = blocks.find((b) => b.aggregateRating);
  assert.ok(biz, 'no @id-bearing business node');
  assert.equal(rated['@id'], biz['@id'], 'AggregateRating is on an orphaned entity');
});
```

## Warnings

### WR-01: `Disallow: /` defeats the `noindex` meta tag — the two D-15 layers are not independent

**File:** `web/public/robots.txt:26-27`, `web/app/layout.jsx:55`
**Issue:** The robots.txt comment (lines 15-18) claims "D-15 is enforced at two independent levels." They are not independent — they are in conflict. A URL disallowed in robots.txt is never fetched, so Googlebot never *sees* `<meta name="robots" content="noindex, nofollow">`. Google's documented behaviour is that a robots.txt-blocked URL can still be indexed as a URL-only listing if anything links to it. The disallow actively prevents the noindex from working.
**Fix:** For a pre-cutover deployment, either (a) allow crawling and serve `X-Robots-Tag: noindex` from `next.config.mjs` `headers()` so the directive is always visible, or (b) rely on Vercel Deployment Protection / HTTP auth and drop the "two independent levels" claim from the comment. Option (a):

```js
// next.config.mjs
async headers() {
  return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
}
```

### WR-02: The postcode lock misses lowercase, `&nbsp;` and multi-space postcodes

**File:** `web/scripts/check-html-locks.mjs:34`, `design-system/test/locks.test.js:64`
**Issue:** `/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/` has no `i` flag and `\s?` permits at most one whitespace character. Verified:

```
"CV32 6EQ"      -> true
"cv32 6eq"      -> false
"CV32&nbsp;6EQ" -> false   <-- HTML entity, very plausible in prerendered output
"CV32  6EQ"     -> false
```

For Lock 5 — whose stated purpose is preventing a residential address reaching ~336 pages — a case-sensitive matcher is a real hole once Phase 3 feeds these components from a data file.
**Fix:** `const POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?(?:\s|&nbsp;|&#160;)*\d[A-Z]{2}\b/i;` and normalise entities before matching. Keep the two copies in sync (the comment at `check-html-locks.mjs:33` already says "verbatim … do not re-derive it" — consider actually importing it rather than duplicating).

### WR-03: `SC-4g: the built page contains no client directive` is a vacuous assertion

**File:** `web/scripts/check-html-locks.mjs:156-159`
**Issue:** `assert.ok(!html.includes('use client'))`. Next.js never emits the directive string into rendered HTML — it is a compile-time marker consumed by the bundler. Verified: `grep -c 'use client' index.html` → `0`, and it would still be `0` with client components present. This assertion can never fail, so it provides zero coverage while reading as a lock. The companion source-scan test at line 161 is the one doing the work.
**Fix:** Delete it, or replace it with a real signal — e.g. assert the RSC flight payload contains no client-reference module ids, or assert `.next/server/app/index.html` renders the rating value *without* any corresponding client chunk. At minimum, drop the false assurance.

### WR-04: The street-address lock does not catch the case its own comment names

**File:** `web/scripts/check-html-locks.mjs:100-109`
**Issue:** The comment says the postcode regex "catches neither a streetAddress schema field nor a `12 High Street` line carrying no postcode" — and then the assertion only checks for the tokens `streetAddress` and `"address"`. It still does not catch `12 High Street`. The `serviceArea` prop on `NAPFooter` is free text rendered straight into the footer; a Phase-3 data file could put a street line there and every check passes.
**Fix:** Add a street-line heuristic over the rendered footer text:

```js
const STREET = /\b\d+[a-zA-Z]?\s+[A-Z][a-z]+\s+(Road|Rd|Street|St|Avenue|Ave|Lane|Ln|Close|Drive|Dr|Way|Court|Crescent|Terrace)\b/;
assert.ok(!STREET.test(html), `street-address line found in built HTML: ${html.match(STREET)?.[0]}`);
```

### WR-05: The budget's "Page" figure is neither transfer weight nor page weight

**File:** `web/scripts/check-budget.mjs:73-77`
**Issue:** The doc block (lines 30-35) states in capitals that "Both budgets are TRANSFER WEIGHT: the compressed bytes that actually cross the wire." The implementation contradicts it: `page = js + Buffer.byteLength(html)` adds **uncompressed** HTML, and the printed label `Page (gzip JS + HTML)` reads as if both are gzipped. Measured on the current build: HTML is 22.8 KB raw but 4.2 KB gzipped — a 5× overstatement. Meanwhile the figure **omits** CSS (2.9 KB gz) and the eight self-hosted woff2 files (~154 KB, already compressed and all render-blocking-adjacent). Real transfer weight is ~330 KB; the script reports 191.3 KB. The two errors point in opposite directions, so the number is not a reliable trend signal — which the header says is its primary value.
**Fix:** `const page = js + gzipSync(Buffer.from(html)).length + cssGz + fontBytes;` — or rename the metric to `HTML+JS` and state plainly in the doc block that CSS/fonts/images are out of scope until Phase 5.

### WR-06: The budget counts a `noModule` polyfill no modern browser fetches

**File:** `web/scripts/check-budget.mjs:62-72`
**Issue:** `/_next/static/chunks/0cz1d0mv5g_q7.js` carries `noModule=""` in the built HTML and is 38.7 KB gzipped — 23% of the reported 168.5 KB JS figure. Modern browsers skip `noModule` scripts entirely. The gate is stricter than reality (acceptable) but the printed number is the stated early-warning signal and it is materially wrong, and it will mask a real 38 KB regression.
**Fix:** Capture the whole tag and exclude `noModule`, reporting it separately:

```js
const tags = [...html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)>/g)];
const modern = tags.filter((m) => !/\bnoModule\b/.test(m[1] + m[3])).map((m) => m[2]);
```

### WR-07: The built-HTML locks inspect only `index.html`

**File:** `web/scripts/check-html-locks.mjs:58`
**Issue:** The build emits three prerendered pages — `index.html`, `_not-found.html`, `_global-error.html` — and every one renders `RootLayout`, therefore every one carries a `tel:` link and the business JSON-LD. Only `index.html` is asserted. I confirmed `_not-found.html` has 1 `tel:` link and **two** `name="robots"` meta tags (`content="noindex"` and `content="noindex, nofollow"`), neither of which any lock has seen. Phase 2 adds real templates and this scope gap silently widens to every new route.
**Fix:** Glob the prerendered set and run the assertions per file:

```js
const pages = walk(join(ROOT, '.next/server/app')).filter((f) => f.endsWith('.html'));
assert.ok(pages.length, 'no prerendered HTML found');
for (const p of pages) { /* run the NAP + robots + postcode assertions against each */ }
```

### WR-08: `NAPFooter` crashes on a `columns` entry without `links`

**File:** `design-system/src/components/NAPFooter/NAPFooter.jsx:89-100`
**Issue:** `col.links.map(...)` with no guard. A single malformed entry in a Phase-3 nav data file throws `Cannot read properties of undefined (reading 'map')` during server render, which in the App Router means a 500 for the whole route — the footer is in the root layout, so it takes down *every* page, not one. Same class of gap: `col.heading` is used as a React key with no uniqueness guarantee.
**Fix:** `{(col.links ?? []).map((l) => (…))}` and filter out entries lacking a `heading`.

### WR-09: The copyright year is frozen at build time

**File:** `design-system/src/components/NAPFooter/NAPFooter.jsx:105`
**Issue:** `new Date().getFullYear()` inside a statically prerendered server component evaluates once, at `next build`. From 1 January the footer shows the previous year on all ~336 pages until someone redeploys. On a local-services site the copyright year is a live-business trust signal and a well-known thin-content/staleness tell.
**Fix:** Either render it from a build-time constant with an explicit comment acknowledging the freeze, or accept a single tiny client boundary for that one span, or add a scheduled rebuild. Given D-07 forbids client components, the honest option is a documented constant plus a scheduled Vercel redeploy.

### WR-10: `mapsUrl` is rendered into `href` with no scheme validation

**File:** `design-system/src/components/NAPFooter/NAPFooter.jsx:82`
**Issue:** `<a href={mapsUrl} rel="noopener">` accepts any string. React 19 warns on `javascript:` URLs but does not block them. Today `mapsUrl` is hardcoded; from Phase 3 it comes from a data file, which is the same threat model `jsonLd.js` was written for. Separately, `rel="noopener"` without `target="_blank"` is inert.
**Fix:**

```jsx
const safeMapsUrl = /^https?:\/\//i.test(mapsUrl ?? '') ? mapsUrl : null;
// …
<a href={safeMapsUrl} target="_blank" rel="noopener noreferrer">Find us on Google</a>
```

### WR-11: `RatingBadge` accepts out-of-range ratings and emits invalid AggregateRating

**File:** `design-system/src/components/RatingBadge/RatingBadge.jsx:41-42, 66-72`
**Issue:** No validation or clamping. `rating={7}` renders five filled stars (`i <= 7` is true for all), the visible text reads "7", and the schema emits `ratingValue: "7"` against `bestRating: "5"` — invalid structured data that Google can flag as spammy review markup on every page it appears. `count={0}` emits `reviewCount: "0"`, also invalid. Separately, `Math.round(4.9)` paints 5/5 stars next to the text "4.9", so the visual and the number disagree (the `aria-label` is correct, so this is a sighted-user-only inconsistency).
**Fix:**

```js
const safeRating = Math.min(5, Math.max(1, Number(rating) || 0));
const safeCount = Math.max(1, Math.floor(Number(count) || 0));
```

…and use half-star rendering (or `Math.floor` plus a partial star) so 4.9 does not display as a perfect 5.

### WR-12: `Breadcrumbs` — `display: contents` on `<li>`, key collisions, and no href normalisation

**File:** `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx:29, 43`
**Issue:** Three separate problems in one component whose stated lock is "visible trail on every non-home page":
1. `style={{ display: 'contents' }}` on `<li>` — Chrome and Safari have long-standing bugs where `display: contents` removes the element from the accessibility tree, destroying the `ol`/`li` list semantics that make a breadcrumb announceable. It is also the only inline layout style in an otherwise class-driven design system.
2. `key={item.href || item.label}` — two crumbs with the same label and no href (plausible in generated town/service trails) produce duplicate React keys.
3. `` `${siteUrl}${item.href}` `` with no normalisation — an href lacking a leading slash yields `https://www.beyondhousecleaning.comwarwick` in the JSON-LD, and a trailing slash on `siteUrl` yields a double slash. Both are silently invalid URLs in structured data.

**Fix:** Move the layout to CSS (`.bhc-breadcrumbs__list { display: flex; }` with normal `li`), key on `${i}-${item.href ?? item.label}`, and build the URL with `new URL(item.href, siteUrl).toString()`.

### WR-13: Nothing enforces that JSON-LD goes through `safeJsonLd`

**File:** `design-system/src/jsonLd.js:26`
**Issue:** The escaping itself is correct — `<` → `<` defeats both `</script>` and `<!--`, and all three current emitters use it (verified). But `safeJsonLd` is deliberately not exported from `src/index.js`, and no test asserts that every `dangerouslySetInnerHTML` in the package routes through it. A Phase-3 component author reaching for `JSON.stringify` directly reintroduces the exact breakout the file was written to prevent, and every existing lock stays green. The file's own comment says the risk becomes "material from Phase 3" — the guard should land before the risk does.
**Fix:** Add a source-scanning lock:

```js
test('every JSON-LD emitter routes through safeJsonLd', () => {
  for (const f of walkJsx(join(ROOT, 'src'))) {
    const src = readFileSync(f, 'utf8');
    if (!src.includes('application/ld+json')) continue;
    assert.ok(src.includes('safeJsonLd('), `${f} emits JSON-LD without safeJsonLd`);
    assert.ok(!/JSON\.stringify/.test(src), `${f} calls JSON.stringify directly — use safeJsonLd`);
  }
});
```

Also guard the input: `safeJsonLd(undefined)` throws `TypeError: Cannot read properties of undefined (reading 'replace')` because `JSON.stringify(undefined)` returns `undefined`. Add `const s = JSON.stringify(obj); if (typeof s !== 'string') throw new Error('safeJsonLd: not serialisable');`.

### WR-14: Lock 5's source scan skips `.js` files — where the Phase-3 town data will live

**File:** `design-system/test/locks.test.js:70`
**Issue:** The walk filters on `/\.(jsx|html|css)$/`. `jsonLd.js`, `formatPhone.js` and `geo.js` are excluded — and `geo.js` is precisely the module documented as taking `allTowns` records. A postcode hardcoded into a town fixture there would never be seen by the Lock 5 test.
**Fix:** `/\.(jsx?|html|css)$/` (and keep the comment-stripping, which already handles `//` and `/* */`).

### WR-15: `page.jsx` violates the Breadcrumbs contract and links to four URLs that 404

**File:** `web/app/page.jsx:36-38, 45, 61-73, 78`
**Issue:** `Breadcrumbs.jsx:4` states the lock is "visible trail + BreadcrumbList JSON-LD on every **non-home** page." This *is* the home page (`/`), and it renders a `BreadcrumbList` claiming the trail `Home / Warwick` for a URL that is `/`. That is structured data that misdescribes the page's position in the hierarchy. `SC-4b` then asserts the BreadcrumbList must be present, so the lock enforces the contract violation. Additionally, `/get-a-quote` (twice) and the three `/location/warwickshire/warwick/*` links all 404 in this build — the only page in the app links exclusively to nonexistent URLs.
**Fix:** Either move the component demonstration to a `/warwick` scaffold route so the trail is truthful, or scope `SC-4b` to non-home routes and drop Breadcrumbs from `/`. Add a comment on the placeholder links noting they resolve in Phase 2 — right now nothing marks them as knowingly dead.

### WR-16: SC-2c's retired-number list omits the national form of the third number

**File:** `web/scripts/check-html-locks.mjs:86`
**Issue:** The list is `['07441918832', '447441918832', '447575709361']`. The first number is covered in both national (`07…`) and international (`447…`) form; the third is covered only in international form. `07575709361` — the form most likely to be pasted from a business card or a Webflow export — passes.
**Fix:** `for (const retired of ['07441918832', '447441918832', '07575709361', '447575709361'])`. Better still, derive both forms from a single list of national numbers so the pair cannot drift.

### WR-17: The D-15 robots-meta assertion inspects only the first match

**File:** `web/scripts/check-html-locks.mjs:197`
**Issue:** `html.match(/<meta[^>]*name="robots"[^>]*>/)` has no `g` flag, so only the first robots meta is checked. `_not-found.html` already ships **two** robots metas in this build, which shows multiple tags are a real occurrence rather than a hypothetical. A page emitting a permissive tag after a restrictive one would pass.
**Fix:** `matchAll` and assert every occurrence contains `noindex`, plus assert at least one exists.

### WR-18: No linter, no formatter, no Node-version pin in `package.json`

**File:** `package.json:5-11`, `web/package.json`, `design-system/package.json`, `.github/workflows/ci.yml:42,54`
**Issue:** CI runs zero static analysis. Next 16 removed `next lint` and nothing replaced it, so unused variables, unreachable code, missing `key` props and accessibility regressions have no gate at all — on a codebase heading for ~336 generated pages. Separately, "Node 22 is pinned" is asserted in the CI comment but the version is hand-copied into two `setup-node` steps with no `.nvmrc` and no `engines` field, so a local `node 20` install builds happily and diverges from CI and Vercel.
**Fix:** Add `eslint` + `eslint-config-next` and an `npm run lint` step to the `build` job; add `"engines": { "node": ">=22 <23" }` to the root `package.json` and a `.nvmrc` containing `22`, then use `node-version-file: .nvmrc` in both jobs so the pin lives in one place.

---

_Reviewed: 2026-08-09T14:19:45Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
