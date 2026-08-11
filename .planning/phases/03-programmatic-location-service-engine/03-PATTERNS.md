---
phase: 3
slug: programmatic-location-service-engine
status: draft
created: 2026-08-11
---

# Phase 3: Programmatic Location × Service Engine — Pattern Map

**Mapped:** 2026-08-11
**Files analyzed:** 20 (7 new, 13 modified)
**Analogs found:** 18 / 20
**Sources:** `03-UI-SPEC.md` (design contract), `03-RESEARCH.md` (measured — supersedes the UI-SPEC on conflict), `03-VALIDATION.md` (Wave 0 list)

> **Read this before the analogs.** Unlike Phase 2 (64 near-identical component files), this phase
> creates **seven new files that generate 406 pages**. There is one strong analog for each and it is
> almost always the *same* one — `web/app/services/[service]/page.jsx` + `web/content/services.js`
> is the pair Phase 2 built explicitly as the rehearsal for this phase, and its own header says so
> at lines 8-21. The leverage is copying it precisely, not inventing.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match |
|---|---|---|---|---|
| `web/app/location/[region]/[town]/[service]/page.jsx` | route (dynamic, 3 segments) | build-time SSG, request-response | `web/app/services/[service]/page.jsx` | **exact** |
| `web/app/locations/[town]/page.jsx` | route (dynamic, 1 segment) | build-time SSG | `web/app/services/[service]/page.jsx` | **exact** |
| `web/app/locations/page.jsx` | route (static) | build-time SSG | `web/app/page.jsx` | **exact** |
| `web/content/towns.js` | data module + module-load guards | transform / lookup | `web/content/services.js` (shape) + `web/content/reviews.js:277-344` (guards) | **exact** (two analogs) |
| `web/content/service-variants.js` | copy deck (56+56 fragments) | static data | `web/content/services.js` `prose:` block arrays | role-match |
| `web/content/town-prose.js` | copy deck (58×2 fragments) | static data | `web/content/services.js` `prose:` block arrays | role-match |
| `web/content/county-notes.js` | copy deck (45 fragments) | static data | `web/content/faqs.js` `SERVICE_FAQS` (keyed literal) | role-match |
| `web/content/services.js` | data module — 4 records corrected, 2 slugs renamed, 1 record added | static data | itself (in-place) | n/a |
| `web/content/nav.js` | nav data — labels follow crumbs, +2 entries | static data | itself (in-place) | n/a |
| `web/content/reviews.js` | data module — key renames + `reviewsForCombo()` | lookup | its own `reviewsForService` at `reviews.js:350-356` | **exact** |
| `web/content/faqs.js` | data module — key renames + **new** drift guard | lookup | `web/content/reviews.js:330-344` | **exact** |
| `web/next.config.mjs` | config — `redirects()` | edge routing | none in repo — `03-RESEARCH.md` §Code Examples is the verified source | **none** |
| `web/scripts/check-redirects.mjs` | CI script (new file) | file-read + assert | `web/scripts/check-budget.mjs` | **exact** |
| `web/scripts/check-html-locks.mjs` | CI harness — deltas 16-29 | file-read + assert | itself (in-place rewrite) | n/a |
| `design-system/src/components/InterlinkBlock/geo.js` | package util — add `metaFor` | pure transform | itself (in-place, backwards-compatible) | n/a |
| `design-system/styles.css` | stylesheet — 3 new classes | static | `.bhc-section__action` (plan 02-16 precedent) | role-match |
| `web/app/page.jsx` | route — FAQ band `paper`→`tint`, + InterlinkBlock | SSG | itself (in-place) | n/a |
| `web/app/not-found.jsx` | route — `RECOVERY_LINKS` grows by one | SSG | itself (in-place, `not-found.jsx:64-68`) | n/a |
| `package.json` | config — `verify` gains `check:redirects` | n/a | itself (`package.json:5-11`) | n/a |
| `.github/workflows/ci.yml` | CI config — `build` job gains a step | n/a | itself (the two existing script steps) | n/a |

---

## Pattern Assignments

### `web/app/location/[region]/[town]/[service]/page.jsx` (route, dynamic ×3)

**Analog:** `web/app/services/[service]/page.jsx` — read it whole; it is 206 lines of which ~95 are
the header comment that explains every decision this file must repeat.

**Imports pattern** (`services/[service]/page.jsx:96-119`) — package barrel, then `@/content/*`,
alphabetised within each group, no `next/link`, no CSS import:

```jsx
import {
  BeforeAfterSlider,
  Breadcrumbs,
  CTABand,
  FAQAccordion,
  Hero,
  ProcessSteps,
  Prose,
  ReviewRail,
  SectionBand,
} from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { PROCESS_STEPS } from '@/content/process.js';
import { REVIEWS_ANCHOR, reviewsForService } from '@/content/reviews.js';
import {
  BREADCRUMB_HOME,
  SERVICES,
  SERVICE_ACTIONS,
  SERVICE_CTA,
  SERVICE_HEADINGS,
  bySlug,
} from '@/content/services.js';
import { RATING } from '@/content/site.js';
```

Phase 3 adds `InterlinkBlock` to the barrel import and `@/content/towns.js` to the content group.

**The static-params triple** (`services/[service]/page.jsx:130-140`) — this exact three-export shape
is what the combo route copies, with the leaf returning all three segment keys:

```jsx
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const record = bySlug(service);
  return { title: record.title, description: record.description };
}
```

Combo form (from `03-RESEARCH.md` Pattern 1, measured in the 426-route probe) — parent segments get
**no** `generateStaticParams` at all:

```jsx
export function generateStaticParams() {
  const out = [];
  for (const town of PUBLISHED_TOWNS) {          // never the raw TOWNS array
    for (const service of town.services) {       // the town's OWN six
      out.push({ region: town.urlRegion, town: town.slug, service });
    }
  }
  return out;
}
```

**`await params` is mandatory in both exports** (`services/[service]/page.jsx:137` and `:143`).
Next 16 removed sync access; a sync read is a build error, and per Pitfall 8 an un-awaited `params`
drops the route out of `prerender-manifest.json` and therefore out of every lock at once.

**Core render pattern** (`services/[service]/page.jsx:142-205`) — a fragment, no wrapper div, bands
in tone order, every string from a content module:

```jsx
export default async function Page({ params }) {
  const { service } = await params;
  const record = bySlug(service);

  return (
    <>
      <Breadcrumbs items={[BREADCRUMB_HOME, { label: record.crumb }]} />

      <Hero
        eyebrow={record.eyebrow}
        heading={record.h1}
        lead={record.lead}
        rating={RATING}
        actions={SERVICE_ACTIONS}
      />

      <SectionBand>
        <Prose>{renderBlocks(record.prose)}</Prose>
      </SectionBand>

      <SectionBand tone="warm" heading={SERVICE_HEADINGS.photos}>
        <BeforeAfterSlider />
      </SectionBand>

      <SectionBand tone="tint" heading={SERVICE_HEADINGS.process}>
        <ProcessSteps steps={PROCESS_STEPS} />
      </SectionBand>

      <SectionBand tone="warm">
        <ReviewRail reviews={reviewsForService(service)} id={REVIEWS_ANCHOR} />
      </SectionBand>

      <SectionBand heading={SERVICE_HEADINGS.faqs}>
        <FAQAccordion items={record.faqs} />
      </SectionBand>

      <CTABand heading={SERVICE_CTA.heading} actions={SERVICE_CTA.actions} />
    </>
  );
}
```

Deltas the combo template applies to that skeleton (UI-SPEC §9.5): three crumbs become four;
the FAQ band takes `tone="tint"`; two `<InterlinkBlock>`s go between the rail and the FAQ band;
`BeforeAfterSlider` keeps its no-`pairs` form.

**The `geo.js` boundary mapping** — the single most dangerous line in the phase (Pitfall 5). Copy it
verbatim at every call site:

```js
// geo.js:46,56 build `/location/${town.region}/...`; towns.js calls that field
// `urlRegion`, and TownCard.region is the DISPLAY county. Opposite meanings, same name.
const forGeo = (t) => ({ ...t, region: t.urlRegion });
nearestTowns(forGeo(town), PUBLISHED_TOWNS.map(forGeo), 5);
```

**Error handling** — there is none, deliberately, and that is the pattern. `bySlug` returns
`undefined` on a miss and `dynamicParams = false` means the miss cannot happen; the comment at
`services/[service]/page.jsx:121-129` and `services.js:1008-1014` both state why. Do not add a
try/catch or a `notFound()` call.

---

### `web/app/locations/[town]/page.jsx` (route, dynamic ×1)

**Analog:** `web/app/services/[service]/page.jsx` — same three exports, same fragment render, same
`await params`. The differences are data-shaped only:

- `generateStaticParams()` returns `PUBLISHED_TOWNS.map((t) => ({ town: t.slug }))`.
- Six `ServiceCard`s with `headingLevel={3}` — see `web/content/home.js:157-230` for the shipped
  `ServiceCard` data shape (`title` / `href` / `summary` / `includes`) and, critically, its
  `hrefFor` idiom at `home.js:78-90`: hrefs are **read off another module and throw on a miss**,
  never restated.
- One `InterlinkBlock` (nearby, 6 towns), no `BeforeAfterSlider` (UI-SPEC §10.5).

---

### `web/app/locations/page.jsx` (route, static)

**Analog:** `web/app/page.jsx` — the static-route metadata form, which is **not** `generateMetadata`
(`services/[service]/page.jsx:29-32` says so explicitly):

```jsx
export const metadata = { title: HOME_TITLE, description: HOME_DESCRIPTION };

export default function Page() {
  return (
    <>
      <Hero ... />
      <SectionBand heading={HOME_HEADINGS.trust}> ... </SectionBand>
      <SectionBand tone="warm" heading={HOME_HEADINGS.services} intro={HOME_INTRO}> ... </SectionBand>
```

**Element structure is authored in the route; every label comes from `towns.js`** (UI-SPEC §9.3).
The `.bhc-jump-links` `<nav>` and the `.bhc-town-group` sections are hand-written JSX in this file —
that is precedented by `not-found.jsx:80-99`, which authors an inline action row rather than adding
a component. Note `not-found.jsx:83-88` uses an inline `style` object with `var(--bhc-*)` values;
UI-SPEC §7.5 chooses the *other* branch here (three real classes in `design-system/styles.css`)
because these repeat across 58 cards rather than appearing once.

---

### `web/content/towns.js` (data module + module-load guards) — the phase's structural core

**Analog A — module shape:** `web/content/services.js:1-151`. The house style, all of which
`towns.js` inherits:

- A long `/** … */` header that states *what the file is for*, *what breaks if it drifts*, and
  *which lock catches it*. `services.js`'s header is 84 lines for 6 records; `towns.js` carries 58
  towns, 7 combo services, a Latin square and four guards, so its header is load-bearing.
- Named exports of plain arrays/objects, plus one or two lookup functions at the bottom.
- Cross-module imports at the top: `import { serviceFaqs } from './faqs.js';` and
  `import { AREA_LONG, describe, titleFor } from './site.js';` (`services.js:86-87`).
- `.js`, never `.jsx` — `services.js:4-8` and Pitfall 7. The `claude-seo` `PostToolUse` hook rejects
  a `.jsx` write containing the case-insensitive substring `REPLACE`, which `.replace(` contains.
  **Every string helper in this phase stays in a `.js` sibling.**

**Analog B — the module-load drift guard.** `web/content/reviews.js:330-344` is the exact idiom
delta 29 and the `COMBO_SERVICES` ↔ `services.js` noun assertion copy:

```js
/*
  Drift guard, evaluated at module load. `services.js` owns the slug set; this
  module must cover it exactly — no service without reviews, and no key here for
  a service that no longer exists.
*/
const declaredSlugs = Object.keys(SERVICE_REVIEWS).sort().join(', ');
const actualSlugs = SERVICES.map((service) => service.slug)
  .sort()
  .join(', ');

if (declaredSlugs !== actualSlugs) {
  throw new Error(
    `reviews.js: SERVICE_REVIEWS covers [${declaredSlugs}] but services.js ships [${actualSlugs}] — they have drifted apart`
  );
}
```

**Analog C — throw-on-miss lookup.** `web/content/reviews.js:277-286`, the `hrefFor` idiom
`home.js:78-90` established:

```js
const byId = new Map(REVIEWS.map((entry) => [entry.id, entry]));

const pick = (...ids) =>
  ids.map((id) => {
    const found = byId.get(id);
    if (!found) {
      throw new Error(`reviews.js: no review with id "${id}" — a selection and REVIEWS have drifted apart`);
    }
    return found;
  });
```

Note the message shape every guard in this repo uses: `<file>: <what was found> — <what it means>`.
The em-dash clause is what makes a red build actionable. Copy it.

**What `towns.js` adds that has no analog** (`03-RESEARCH.md` Pattern 2 — write it exactly):

```js
export const PUBLISHED_BATCHES = 1;                       // the one-line batch lever
export const PUBLISHED_TOWNS = TOWNS.filter((t) => t.batch <= PUBLISHED_BATCHES);

if (PUBLISHED_TOWNS.length === 0) {
  throw new Error('towns.js: PUBLISHED_TOWNS is empty — /locations has no rendered empty state');
}
```

**Two content-module conventions to carry:** `services.js:61-74` records that no address, postcode,
phone number, email or price may appear — and that *a comment naming the exact shape a scanner bans
is itself an occurrence of it*. `site.js:107-111` records the ampersand rule (`&` literal, never the
entity — the lock's extractor decodes before comparing). Both apply to 58 town rows.

---

### `web/content/service-variants.js` · `town-prose.js` · `county-notes.js` (copy decks)

**Analog:** the `prose:` block arrays inside `web/content/services.js` (see
`services.js:162-297` for the `deep-cleaning` record — one full ~1,000-word deck).

**Block shape**, fixed by `web/content/blocks.jsx:53-64` and restated at `services.js:51-59`:

```js
{ type: 'p',  text: string }
{ type: 'h2', text: string }
{ type: 'h3', text: string }
{ type: 'ul', text: string[] }   // `text` carries the items
```

There is **no `h1` block type and there must never be one** — Lock 1 allows exactly one `<h1>` and
it belongs to `Hero.heading` (`services.js:58-59`). `renderBlocks` renders an unrecognised type as
nothing rather than throwing (`blocks.jsx:78-84`), so a typo'd `type` silently drops a paragraph —
delta 22's word count is what catches it.

**String-concatenation style** (`services.js:166-171`) — implicit-concat with a trailing space on
each line, so a diff of an 82,600-word corpus stays reviewable:

```js
      {
        type: 'p',
        text:
          "A deep clean isn't a longer version of your usual clean. It's a different job. We work " +
          'top to bottom through the whole house, one room at a time, and we go after the things ' +
          'that build up so slowly you stop seeing them: the film on the extractor, the limescale ' +
          'round the shower head, the grease down the side of the hob, the dust on top of the door ' +
          'frames.',
      },
```

**Keyed-literal shape for the county notes:** `web/content/faqs.js:90-92`, `const SERVICE_FAQS = {
'deep-cleaning': [ … ] }` — a slug-keyed object literal of arrays, private (`const`, not exported)
with an exported accessor. `county-notes.js` is the same shape on a `[service][county]` key.

**Anti-pattern to state in the plan** (Pitfall 9): `services.js:43-49` already records the rule —
*"Six rephrasings of one page would be the exact near-duplicate shape the depth bar exists to
prevent"*, and each of the six shipped records is angled differently (the deposit, the turnaround
window, the two dust passes). A task worded *"write 8 variations of the deep-cleaning copy"* has
already failed; the eight variants must be eight different **angles** (a different room, a different
customer, a different failure mode), because delta 23's Jaccard is lexical and cannot see paraphrase.

---

### `web/content/faqs.js` (modified — the silent-failure fix)

**Analog:** `web/content/reviews.js:330-344`, quoted above. `faqs.js` is the only one of the three
coupled modules without a guard, and its current accessor fails silently:

```js
/**
 * The FAQ set for a service slug. Returns `[]` for an unknown slug rather than
 * throwing — `FAQAccordion` renders nothing at all on empty items (UI-SPEC §11),
 * so an unrecognised slug drops the band instead of 500ing the route. Phase 3's
 * canonical-slug rename is then a key change in this file.
 */
export function serviceFaqs(slug) {
  return SERVICE_FAQS[slug] || [];
}
```
— `faqs.js:294-302`

`FAQAccordion` returns `null` on empty items (verified in the built bundle), so a missed rename
deletes the FAQ band from a page with **every lock green**. Add the `reviews.js` key-set guard;
keep the `|| []` return, because its stated reason (a band gap beats a 500 in the root layout, the
same instinct as `blocks.jsx:78-84` and `NAPFooter`'s `.filter(Boolean)`) is still correct at
runtime — the guard moves the failure to module load where it belongs.

---

### `web/content/reviews.js` (modified — `reviewsForCombo`)

**Analog:** its own `reviewsForService`, `reviews.js:346-356`:

```js
/**
 * The three reviews for one service page. Throws on an unknown slug, for the
 * same reason `bySlug` in `services.js` does.
 */
export function reviewsForService(slug) {
  const found = SERVICE_REVIEWS[slug];
  if (!found) {
    throw new Error(`reviews.js: no reviews declared for service slug "${slug}"`);
  }
  return found;
}
```

`reviewsForCombo(townSlug, serviceSlug)` is this function plus a deterministic rotation by the
town's index (UI-SPEC §10.4). Two hard constraints from plan 02-16 carried in the file's own
comments at `reviews.js:306-320`: no review carries a town and none may be invented one, and
`ReviewRail.town` is not used.

**The rename is what the guard exists for.** `reviews.js:321-328` keys on today's live slugs:
`'standard-home-cleaning'` and `'move-out-cleaning'` both change, and
`'apartment-cleaning'` must gain a trio, or the build goes red at module load. That is designed
behaviour (UI-SPEC §12, carried-forward note 1).

---

### `web/content/services.js` · `nav.js` (modified — the D14 rename)

**The coupling is written down in the files themselves and must be honoured as one change:**

- `services.js:23-27` — *"THE SLUGS MUST MATCH `nav.js` EXACTLY … a slug that drifts here does not
  404 quietly — it turns CI red on all eighteen pages at once."*
- `services.js:141-149` — *"Each label … matches the `nav.js` label exactly."* So correcting `h1`
  without `crumb` ships one-concept-one-noun broken in the breadcrumb.
- `nav.js:62-69` — already anticipates this phase: *"Phase 3 inserts `{ label: 'Areas We Cover',
  href: '/locations' }` into this array once that route resolves — after Services, before About."*
- `nav.js:47-60` — the Services item stays **href-less**; UI-SPEC §9.6 does not build `/services`.

The four records to correct are `services.js:151-1006`; the `h1`/`crumb`/`title` values sit in the
first ~8 lines of each record, e.g. `services.js:153-158`:

```js
  {
    slug: 'deep-cleaning',
    h1: `Deep Cleaning in ${AREA_LONG}`,
    crumb: 'Deep Cleaning',
    eyebrow: 'Top to bottom, once',
    title: titleFor('Deep Cleaning in Warwickshire'),
    description: describe('Deep cleaning'),
```

`titleFor` / `describe` live at `site.js:145-171`. **`describe()` hard-codes `across ${AREA_SHORT}`
and does not fit a combo page** (UI-SPEC §5) — the combo/hub description is a new form, and the
title fallback is a two-candidate chain, not a call to `titleFor`. `site.js:116-144`'s header is the
model for documenting a measured string function: it prints the measurement, names the two cases
that overrun, and says which plan owns the fix.

Also required in the same change (`03-RESEARCH.md` §Runtime & Coupled-State Inventory): the old slug
must be **removed from `services.js`**, or Next prerenders the page *and* redirects it — the page
ships in the manifest, gets asserted by every lock, and is unreachable.

---

### `web/scripts/check-redirects.mjs` (NEW)

**Analog:** `web/scripts/check-budget.mjs` — the repo's only standalone (non-`node:test`) CI script.
Copy its whole shape:

**Header pattern** (`check-budget.mjs:1-32`) — states why it is a plain script rather than a test,
what it deliberately does not cover, and the invocation line:

```js
/**
 * Performance budget gate (D-14) — worst page across every prerendered route.
 * …
 * It is a plain script rather than a node:test file because its printed
 * measurements are worth as much as its verdict — a number that moves between
 * commits is the early warning; the threshold is only the backstop. It always
 * prints every figure before it decides.
 * …
 *   node web/scripts/check-budget.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
```

**Refuse-to-verdict pattern** (`check-budget.mjs:209-214`) — the shape delta 24's "the 90 preserved
URLs" assertion needs, so a shrinking input set cannot pass quietly:

```js
if (unresolved.length) {
  fail('BUDGET MEASUREMENT INCOMPLETE — refusing to report a verdict:', ...unresolved.map((u) => `  ${u}`));
}
if (measured.length !== routes.length) {
  fail(`measured ${measured.length} of ${routes.length} routes — refusing to report a verdict`);
}
```

**Print-then-decide** (`check-budget.mjs:226-241`) — every figure to `console.log`, one `fail()` at
the bottom.

**Why this file must be separate** (Pitfall 6): the redirect assertions need
`.next/routes-manifest.json`, and that filename **may not appear** in `check-html-locks.mjs` — the
acceptance check for the Phase 2 rewrite greps that file for it and requires zero hits
(`check-html-locks.mjs:167-174`). Writing delta 24 there fails a gate that exists for a good reason.

**Wire-up** — `package.json:5-11` and the `build` job's two script steps in `.github/workflows/ci.yml`:

```json
    "check:html": "node --test web/scripts/check-html-locks.mjs",
    "check:budget": "node web/scripts/check-budget.mjs",
    "verify": "npm run test:locks && npm run build && npm run check:html && npm run check:budget"
```

Nothing goes into the `locks` job — it is zero-install by design and never touches build output
(`ci.yml`, the `locks` job comment; `03-RESEARCH.md` measured it route-count independent at 222 ms).

---

### `web/scripts/check-html-locks.mjs` (modified — deltas 16-29)

**Analog:** itself. The three structural rules at `check-html-locks.mjs:31-64` govern every delta:

```
 * 1. EVERY LOCK IS ONE LOOPING TEST whose failure message names the offending
 *    route. Not one suite per page. 18 routes x ~14 assertions is 250 test
 *    cases and a MIN_TESTS-style floor that has to be recomputed every time a
 *    route is added — actively hostile to Phase 3's ~336 pages.
 *
 * 2. THE RSC FLIGHT PAYLOAD IS INLINED IN THE HTML, SO BARE SUBSTRING COUNTS
 *    DOUBLE-COUNT. … EVERY class-name COUNT in this file therefore uses the
 *    `class="[^"]*…` form. … Zero-assertions are safe in either form.
 *
 * 3. A SCANNER MUST NOT MATCH ITS OWN SOURCE. This file greps build output for
 *    retired phone digits and greps repo source for a client directive; earlier
 *    revisions were bitten twice by a comment that named the very string being
 *    banned. Both markers are assembled from fragments for that reason.
```

**Rule 3 is the one that has fired twelve times in this repo.** Instances to imitate:
`check-html-locks.mjs:167-174` (the other route manifest's filename is never written),
`:351-352` (the retired single-town constant is not quoted), `:367-370` (`/_global-error` is named
above the literal, not inside it), `services/[service]/page.jsx:14-18` and `:70-75`,
`services.js:69-74` and `:78-83`. The fragment-assembly form is at `:1134-1135`:

```js
const PHOTO_STATE_ATTR = 'data-bhc-photo-state';
const PHOTO_PENDING_MARKER = `${PHOTO_STATE_ATTR}="pending"`;
```

**Delta 18 — the expectation resolver.** Current form, `check-html-locks.mjs:432-439`:

```js
const expectationsFor = (route) => {
  if (!Object.prototype.hasOwnProperty.call(PAGE_EXPECTATIONS, route)) {
    throw new Error(
      `no PAGE_EXPECTATIONS entry for ${route} — a new route must declare its <h1>, breadcrumb and JSON-LD expectations here`
    );
  }
  return PAGE_EXPECTATIONS[route];
};
```

`check-html-locks.mjs:354-360` **already grants the change and names its terms**: *"Phase 3 may swap
the IMPLEMENTATION of `expectationsFor` to a derived form … without touching a single call site —
and should record in that change what it trades away."* And `:500-514` is a test that asserts the
throw survives:

```js
  assert.throws(
    () => expectationsFor('/zz-route-that-does-not-exist'),
    /no PAGE_EXPECTATIONS entry/,
    'expectationsFor must throw for an unknown route, or a new route is a silent gap'
  );
```

Keep both the throw and that regression test. The 20-entry literal (`:385-430`) stays a literal.

**Delta 16** — the current self-restoring inverse, `check-html-locks.mjs:1087-1103`, is a rewrite not
a flip. `03-RESEARCH.md` verified that setting `INTERLINK_LOCK_ACTIVE = true` (`:267`) reddens the
ten utility routes, `/locations` and `/_not-found`.

**Delta 21** — `PHOTO_PLACEHOLDER_ROUTES` at `:1137-1145` is a seven-entry literal; the loop shape at
`:1149-1172` (positive branch counts the attribute-with-value form, negative branch tests the bare
attribute name because a zero assertion cannot be inflated) is exactly what the per-template rule
keeps.

**Delta 26** — `EXPECTED_APP_ROUTES` at `:231-256`, and its header at `:216-230` is already the
argument against deriving it: *"Without a floor the suite would go GREEN by having less to check."*
Type the batch-1 integer; never `PUBLISHED_TOWNS.length`.

**Pitfall 1 — the non-HTML route filter.** `PAGES` is built at module load, `:187-194`:

```js
const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

const PAGES = Object.keys(manifest.routes)
  .sort()
  .map((route) => ({
    route,
    file: fileFor(route),
    compute: manifest.routes[route].compute,
    html: read(join(ROOT, '.next/server/app', fileFor(route)), BUILD_HINT),
  }));
```

`read()` (`:139-146`) calls `process.exit(1)` on a miss, so `/sitemap.xml` → `sitemap.xml.html` →
the whole suite collapses to one failing test with a misleading build hint. The filter goes
**between** `Object.keys(...)` and `.map(...)`, and per the `NO_META_DESCRIPTION`/`PHOTO_*` precedent
must be asserted non-vacuous.

---

### `design-system/src/components/InterlinkBlock/geo.js` (modified — `metaFor`)

**Analog:** itself, `geo.js:39-63`. The change is one optional parameter with a default, keeping
today's string:

```js
export function buildInterlinks({ town, service, allTowns, allServices, nearbyCount = 5 }) {
  const nearby = {
    variant: 'nearby',
    heading: `${service.name} in nearby towns`,
    links: nearestTowns(town, allTowns, nearbyCount).map(({ town: t, miles }) => ({
      href: `/location/${t.region}/${t.slug}/${service.slug}`,
      label: `${service.name} in ${t.name}`,
      meta: `${miles.toFixed(1)} miles away`,
    })),
  };
```

`t.region` at `:46` and `:56` is the **URL segment**, and it is the source of the two-region trap.
The optional-with-fallback idiom to copy is `TownCard.jsx`'s `HEADING_TAGS[headingLevel] ||
HEADING_TAGS[3]` (a lookup with a default rather than a throw, itself citing `Button.jsx:12-17`).

Any change here is a **package** change under D-02/D-05/D-06: four-file shape, both `.design-sync`
registrations, and delta 9 in `design-system/test/locks.test.js:504` polices it. There is an existing
geo test at `locks.test.js:648-682` that must stay green.

---

### `web/next.config.mjs` (modified — `redirects()`)

**No analog in this repo** — the file is 26 lines and currently holds one key
(`next.config.mjs:21-26`). Its header (`:1-19`) is the pattern for *documenting what is deliberately
absent*, which the redirect table needs for the `statusCode` choice:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bhc/design-system'],
};

export default nextConfig;
```

Use `03-RESEARCH.md` §"The redirect table — verified, with the 301 correction" as the source; it was
built, inspected in two manifests, served and curled. Three things the plan must carry:
`statusCode: 301` not `permanent: true` (which emits 308); `statusCode` and `permanent` are mutually
exclusive; and the `/location/:region/:town` rule redirects garbage into a 404, which must be scoped
to the published slug set or documented as an accepted soft-404 generator.

---

## Shared Patterns

### Copy lives in `web/content/*.js`, never in `.jsx`

**Source:** `services/[service]/page.jsx:23-27`, restated at `services.js:4-8`, `nav.js:2-7`,
`faqs.js:4-9`.
**Apply to:** every file in this phase.

```
 * EVERY WORD ON THESE PAGES COMES FROM `@/content/services.js`. Two independent
 * reasons, either of which alone would settle it: the components are
 * framework-agnostic UI and must not carry site copy, and the `claude-seo`
 * PostToolUse hook rejects a `.jsx` write containing a common English verb that
 * ordinary prose keeps producing. Copy lives in `.js`. Keep it so.
```

At 82,600 words this is the difference between a working session and an unexplained exit-2
(Pitfall 7). `blocks.jsx` is the only `.jsx` in `web/content/` and it returns elements only.

### A scanner must not match the grep that polices it

**Source:** `check-html-locks.mjs:60-63` (rule 3), instanced at `:167-174`, `:351-352`, `:367-370`,
`:1130-1135`; and in route/content files at `services/[service]/page.jsx:14-18`, `:70-75`;
`services.js:69-74`, `:78-83`; `blocks.jsx:38-40`.
**Apply to:** `check-html-locks.mjs`, `check-redirects.mjs`, `towns.js`, and every explanatory
comment in the phase.

This fired **twelve times in Phase 2**. Two mitigations are in use: assemble the banned marker from
fragments (`:1134-1135`), or state the rule *above* the literal instead of inside it (`:367-370`).
Every new scanner in this phase needs one of the two chosen deliberately.

### Module-load drift guards over runtime checks

**Source:** `reviews.js:330-344` (key-set), `reviews.js:277-286` (throw-on-miss),
`home.js:78-90` (`hrefFor`), `services.js:1008-1017` (`bySlug`, no throw because
`dynamicParams = false` makes the miss impossible).
**Apply to:** `towns.js` (delta 29 injectivity + balance, `COMBO_SERVICES` ↔ `services.js` nouns,
`PUBLISHED_TOWNS.length > 0`), `faqs.js` (new key-set guard), `reviews.js` (existing, extended).

These run **before a single page is built** and fail in `next build` as well as in CI, which
`03-RESEARCH.md` calls the phase's cheapest gate. Message shape:
`` `<file>: <what was found> — <what it means>` ``.

### Band tone, and the two colour rules that are easy to break

**Source:** `services/[service]/page.jsx:37-61` (the whole band-order rationale),
`web/app/page.jsx:120-176` (the same sequence on Home).
**Apply to:** all three new templates, plus the eight shipped pages whose FAQ band moves
`paper` → `tint`.

`SectionBand` maps `{paper:'', warm:'bhc-section--warm', tint:'bhc-section--tint',
navy:'bhc-section--navy'}` — `paper` emits **no modifier class**, which is why a tone extractor has
to infer it. `ReviewCard` sets `--bhc-paper-tint` directly, so a rail inside a `tint` band is tint on
tint; `TownCard`'s meta line sets `--bhc-ink-muted` directly (its header records 1.10:1 on navy).
Neither may sit on `navy` or `ink`.

### The route/expectation handshake

**Source:** `check-html-locks.mjs:372-374` — *"The table may be COMPLETE BEFORE THE ROUTES ARE …
`expectationsFor` throws on an unknown route, so a new route arriving WITHOUT an expectation is a
hard failure, not a silent gap."*
**Apply to:** wave ordering. Expectations can and should land **before** the routes; routes landing
before expectations reddens seven locks at once (Pitfall 2, measured on the probe), and `main` is
strict with no bypass actors.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `web/next.config.mjs` `redirects()` | config | edge routing | No redirect has ever existed in this repo and no `vercel.json` exists. Use `03-RESEARCH.md` §Code Examples — it is a verified end-to-end artifact (built, two manifests inspected, `next start` + curl), which is stronger than an analog. |
| Delta 27, the band-adjacency assertion | CI lock | built-artifact | **See the correction below — the "shipped extractor" it says to extend does not exist.** |

---

## Corrections the planner must carry (found while mapping)

Three things the UI-SPEC asserts about existing code that are **not true of this worktree**. Each is
verified by direct read.

1. **There is no band-adjacency lock to extend.** Delta 27 reads *"Band-adjacency assertion extended
   to treat `.bhc-interlink` as a `paper` band … the shipped extractor reads `bhc-section--*`
   modifiers only"*. Grepped across `web/scripts/*.mjs`, `design-system/test/*` and the repo source:
   **zero** occurrences of `bhc-section--` outside the built `.next/` chunk and the component itself.
   Delta 27 is a **new lock written from scratch**, not a modification — a materially larger task
   than the delta table implies, and one that needs the `paper`-emits-no-class inference above.

2. **The registered-office pin coordinates, street address and postcode are already in the repo.**
   `design-system/test/locks.test.js:673`:

   ```js
   const pin = { lat: 52.29358, lon: -1.55378 }; // 84 Acacia Road, CV32 6EQ
   ```

   Lock 5 (`locks.test.js:224-245`) walks `design-system/src` only and strips comments before
   matching, so `test/` is unscanned and this passes. UI-SPEC §8.2 states the coordinates *"do not
   appear in a data file, a comment, a test fixture or a commit message"* — that is already false,
   and the phase whose §13-O rule this is should either widen Lock 5's walk to `test/` or record the
   exception explicitly. `towns.js` still must not carry them; the `leamington-spa` centroid is the
   origin.

3. **`INTERLINK_LOCK_ACTIVE = false` today** (`check-html-locks.mjs:267`) and the current SC-4d test
   asserts the **inverse** on every app page. The first rendered `InterlinkBlock` — on any of the 406
   new pages, on Home, or on a service page — turns it red. It is on the Wave 0 critical path, not a
   follow-up.

---

## Metadata

**Analog search scope:** `web/app/**`, `web/content/**`, `web/scripts/**`, `web/next.config.mjs`,
`design-system/src/components/**`, `design-system/test/**`, `package.json`,
`.github/workflows/ci.yml`
**Files read in full:** `web/app/services/[service]/page.jsx`,
`design-system/src/components/InterlinkBlock/geo.js`,
`design-system/src/components/InterlinkBlock/InterlinkBlock.jsx`,
`design-system/src/components/TownCard/TownCard.jsx`, `web/content/nav.js`, `web/next.config.mjs`
**Files read in targeted ranges:** `web/content/services.js`, `web/content/reviews.js`,
`web/content/faqs.js`, `web/content/site.js`, `web/content/blocks.jsx`, `web/content/home.js`,
`web/app/page.jsx`, `web/app/not-found.jsx`, `web/scripts/check-html-locks.mjs`,
`web/scripts/check-budget.mjs`, `design-system/test/locks.test.js`
**No project `CLAUDE.md` and no `.claude/skills/` or `.agents/skills/` directory exists in this
worktree** — conventions were derived from the source files' own headers, which are unusually
explicit and are the de-facto convention document.
**Pattern extraction date:** 2026-08-11
