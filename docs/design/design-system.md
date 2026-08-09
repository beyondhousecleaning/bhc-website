# Design system — Beyond House Cleaning

Agreed 2026-08-06. The contract between Claude Design (visual design) and Claude Code (build).

Companion doc: [`brand-brief.md`](brand-brief.md) — positioning, visual direction and the logo brief.
Evidence base: [`../research/seo-audit-2026-08-06.md`](../research/seo-audit-2026-08-06.md).

## How this gets used

```
~/projects/bhc-website/design-system/     tokens.css + React components   ← built from this doc
$ cd ~/projects/bhc-website/design-system
$ claude
› /design-sync                            ← Sam runs; reads tokens + components, pushes to Claude Design
```

`/design-sync` is **user-invoked only** — it cannot be run on Sam's behalf. The sync reads the
local package directly, so the package is the artifact that matters; this doc is its
specification.

Precedent for the package shape: the **Project BK V3** design system (46 components, each with
`.jsx` / `.html` / `.d.ts` / `.prompt.md`, plus `styles.css` and `_ds_manifest.json`). Match it.

Target Claude Design project: pick at sync time — `/design-sync` can create a new system or
update an existing one. There is an empty `Design System` project (`f655f4ff-…`, correct type,
writable) if a new one isn't wanted, though a specific name matches the existing convention
better (*Olivia Terry — Portfolio Design System*).

## Decisions locked

| Decision | Choice | Rationale |
|---|---|---|
| Colour strategy | **Blue structures the site, orange owns actions, brand marks go orange-forward** | Arbor Trail's palette is near-identical to ours; orange is the only differentiator, and it matters most where we appear beside competitors (SERP favicon, map pack, GBP thumbnail) |
| Visual direction | **B — warm local craft** | Before/afters are the highest-converting element; "genuine local team" is the winnable position against Fantastic Services and Care.com |
| Prescriptiveness | **Lock what SEO needs, leave the visual open** | The design physically cannot regress the audit findings; Claude Design keeps real latitude |
| Deliverable | **Tokens as code + React components**, not markdown | Prevents the design→build drift that markdown handoffs always produce |

---

## 1. Tokens

### Colour

Every pairing below was measured, not eyeballed. Two of the logo's own colours fail WCAG AA
in the roles they're currently used for, which is why the roles are constrained.

```css
:root {
  /* Ink & structure */
  --ink:           #0B2340;   /* body, headings — 15.8:1 on white */
  --ink-muted:     #4A5A72;   /* secondary text, captions */

  /* Brand blue */
  --navy:          #2064B1;   /* section surfaces; white text OK at 5.97:1 */
  --blue:          #197EC7;   /* mid step, borders on tint */
  --cyan:          #0DA6E8;   /* surfaces OK with ink (5.75:1); NEVER with white (2.75:1) */

  /* Action — orange */
  --action:        #F06C24;   /* CTAs, links, active states. Ink label, 5.17:1 */
  --action-hover:  #C2410C;   /* hover/press; safe with white at 5.18:1 */
  --sponge:        #F78C34;   /* the mark, warm tints, illustration */

  /* Warm neutrals */
  --paper:         #FFFFFF;
  --paper-warm:    #FBF8F5;   /* section bands */
  --paper-tint:    #F5EFE8;   /* cards, quiet blocks */
  --line:          #E4DAD0;   /* borders */

  /* Feedback */
  --success:       #1B7A4C;
  --warning:       #B45309;
  --danger:        #B42318;
}
```

#### Measured contrast

| Pairing | Ratio | AA normal | Verdict |
|---|---|---|---|
| `--ink` on `--paper` | **15.81:1** | ✅ | Body text |
| `--ink` on `--paper-warm` | 14.94:1 | ✅ | Body on section bands |
| `--ink` on `--paper-tint` | 13.84:1 | ✅ | Body on cards |
| `--ink-muted` on `--paper` | 7.01:1 | ✅ | Secondary text |
| `--ink` on `--sponge` | 6.59:1 | ✅ | Ink on the light orange |
| White on `--navy` | 5.97:1 | ✅ | Navy section surfaces |
| **`--ink` on `--action`** | **5.17:1** | ✅ | **The CTA pairing** |
| White on `--action-hover` | 5.18:1 | ✅ | Where white-on-orange is unavoidable |
| `--ink` on `--cyan` | 5.75:1 | ✅ | Cyan surfaces are fine **with ink** |
| White on `--blue` | 4.33:1 | ❌ | Large text only — not a surface for body copy |
| ~~White on `--action`~~ | **3.05:1** | ❌ | **Never.** Orange buttons take ink labels |
| ~~White on `--cyan`~~ | **2.75:1** | ❌ | **Never.** Fails even large text |

Three hard rules fall out:

1. **Orange fills take `--ink` labels, not white.** White-on-orange is 3.05:1 against a 4.5:1
   requirement — the bug most cleaning sites ship. Ink-on-orange also simply looks better:
   warmer and more considered than the generic trades button.
2. **`--cyan` never carries white text** (2.75:1). It *is* usable as a surface with `--ink` on
   top (5.75:1) — so cyan panels are allowed, cyan-with-white is not. The logo's existing
   white-on-cyan wordmark is the failure the logo audit spotted.
3. **`--blue` is not a body-text surface.** White on it is 4.33:1 — fine for large display
   text, not for paragraphs. Use `--navy` when white copy sits on blue.

Note there is no blue as dark as `--ink`. The logo's "navy" is really a mid-blue, which is why
it reads weak as body text. `--ink` extends the family downward rather than replacing it.

#### Why the neutrals are warm

Arbor Trail bands its sections in `#eef7ff` — a **cold blue** tint. Warm off-whites
(`--paper-warm`, `--paper-tint`) against the same blue family is most of what separates "warm
local team" from "cleaning corp", and it costs nothing. This is the quietest token doing the
most work; do not substitute neutral greys.

### Type

Type is **not** an SEO lock, so these are constraints and starting points. Claude Design picks
the final faces.

**Rules:**

- **Humanist, not geometric.** Geometric means Poppins, which is both Arbor Trail's face and
  the most templated choice in the trades category.
- **Not Poppins. Not Inter.** Both read as defaults.
- **Two families maximum**, one variable file each.
- **Self-hosted `woff2`, subset to Latin.** The live site loads `webfont.js` from
  `ajax.googleapis.com` — a render-blocking third party. That does not survive the rebuild.
- Starting candidates: **Public Sans** or **Source Sans 3** for body; **Figtree** or
  **Bricolage Grotesque** for display. Avoid a serif display — it reads artisan, and cleaning
  is a practical purchase.

**Scale** — 1.25 ratio, fluid between bounds:

| Token | Mobile → Desktop | Use |
|---|---|---|
| `--text-xs` | 12 → 13 | Captions, legal |
| `--text-sm` | 14 → 15 | Meta, breadcrumbs |
| `--text-base` | 16 → 17 | Body |
| `--text-lg` | 18 → 20 | Lead paragraphs |
| `--text-xl` | 22 → 25 | H3 |
| `--text-2xl` | 27 → 31 | H2 |
| `--text-3xl` | 34 → 44 | H1 |

Body is 17px on desktop rather than 16. These are 800–1,100-word pages and content depth is the
one metric already beating the competition (821 unique words vs Arbor Trail's 353) — that
advantage is wasted if the prose is uncomfortable to read.

```css
--leading-tight: 1.15;   /* headings */
--leading-snug:  1.35;   /* leads */
--leading-body:  1.65;   /* body — generous, these are long pages */
--tracking-tight: -0.02em;  /* display sizes only */
```

### Spacing, radii, containers, motion

```css
/* 4px base */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-16: 64px;
--space-24: 96px; --space-32: 128px;

/* Rounded — part of "warm" */
--radius-sm: 6px;  --radius-md: 10px; --radius-lg: 16px;
--radius-xl: 24px; --radius-full: 9999px;

--shadow-sm: 0 1px 2px  rgba(11,35,64,.06);
--shadow-md: 0 4px 12px rgba(11,35,64,.08);
--shadow-lg: 0 12px 32px rgba(11,35,64,.10);

--container-prose:  68ch;    /* body measure — readability on long pages */
--container-narrow: 800px;
--container:        1200px;
--container-wide:   1440px;

--dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;
--ease: cubic-bezier(.2,.8,.2,1);
```

Section padding sits at the generous end of the scale (`--space-16` to `--space-24`) —
whitespace is half of "warm". All motion must respect `prefers-reduced-motion: reduce`.

Breakpoints: `480 / 768 / 1024 / 1280`.

---

## 2. Components

### Locked — the SEO layer depends on these

Each exists because the audit found it broken or missing.

| Component | Requirement | Live-site state |
|---|---|---|
| **Hero** | Renders a real `<h1>` containing service and/or town | H1 is `"Reliable & Affordable"` on 101 of 115 pages |
| **Breadcrumbs** | Visible trail + `BreadcrumbList` JSON-LD | 0 of 115 pages have any |
| **RatingBadge** | `4.9 ★ · 175 Google reviews` in server-rendered HTML | Locked inside a 516 KB JS bundle |
| **NAPFooter** | Name, service area, exactly one `tel:`, hours. No street address | Displays one number, dials another |
| **InterlinkBlock** | Geography-derived internal links | 4 hardcoded footer links serve 95 pages |

#### Hero — the H1 rule

The live bug was caused by a *design* pattern, not a coding mistake: a two-line animated hero
where line 1 is the `<h1>` and line 2 — the line carrying the keywords — is a styled `<div>`.

```html
<h1 class="heading-style-h1">Reliable &amp; Affordable</h1>
<div class="heading-style-h1">Deep Cleaning Services in Warwick</div>
```

**If a two-line hero is used again: the keyword line is the `<h1>`; the adjective line is
decoration.** Never the reverse. The component takes them as separate props so the markup
cannot be got wrong:

```ts
interface HeroProps {
  eyebrow?: string;        // "Reliable & Affordable" — decoration, renders as <p>
  heading: string;         // "Deep Cleaning in Warwick" — ALWAYS the <h1>
  lead?: string;
  rating?: RatingProps;
  actions: Action[];
  image: ResponsiveImage;  // LCP element — preloaded, AVIF/WebP
}
```

#### InterlinkBlock — the critical path

The one component that decides whether 336 pages works. Today a combo page has a median of
**4** inbound internal links, all from ad-hoc prose; four arbitrary combo pages sit in the
global footer with 114 each.

Links are **computed from geography**, never hand-picked, so they cannot rot:

```
/locations                                  → all ~56 towns
/locations/<town>                           → that town's 6 services + 6 nearest towns
/location/<region>/<town>/<service>         → breadcrumb up to the town hub
                                            → 5 sibling services, same town
                                            → same service, 5 nearest towns
```

That yields **~11 semantically meaningful inbound links per combo page**. "Nearest towns" is
derived from the postcode district data in
[`../research/service-area-coverage.md`](../research/service-area-coverage.md).

Two visual variants: a **service switcher** (same town, other services) and a **nearby towns**
row. Both must look deliberate rather than like an SEO footer dump — that is a design problem,
not a technical one.

```ts
interface InterlinkBlockProps {
  variant: 'services' | 'nearby';
  heading: string;
  links: { href: string; label: string; meta?: string }[];
}
```

### Standard

| Group | Components |
|---|---|
| **Global** | Header, Footer, Breadcrumbs, SkipLink |
| **Trust** | RatingBadge, ReviewCard, ReviewRail, TrustBar, BeforeAfterSlider |
| **Content** | Hero, SectionBand, Prose, ServiceCard, TownCard, ProcessSteps, FAQAccordion, CTABand |
| **Convert** | Button, QuoteFormEntry, StickyCallBar |

Three that need more thought than the rest:

- **BeforeAfterSlider** — the photo spec calls before/afters *"the highest-converting element
  on a cleaning site."* Worth over-investing in. **Blocked** on originals from Canva.
- **Prose** — unglamorous, but it carries 800–1,100 words on ~336 pages. Needs measure
  (`--container-prose`), rhythm and pull-quotes, not a wall of grey.
- **StickyCallBar** — cleaning enquiries are mobile and phone-first. Arbor Trail has no
  equivalent.

### Deliberately excluded

| Excluded | Reason |
|---|---|
| `FAQPage` schema for rich results | Google retired FAQ rich results on **2026-05-07**. Accordion stays for users; we don't design around dead markup |
| Blog templates beyond one article layout | One post exists and evidence ranks content 4th. Arbor Trail does ~$200k/mo on a single blog post |
| Trustmary widget | Replaced by server-rendered reviews. Removes 516 KB of JS |
| `AggregateRating` expecting SERP stars | Self-serving and third-party-widget review markup are both ineligible. Included for the entity graph only |

---

## 3. Page templates

~410 pages come from **6 templates**. The combo template alone is ~336 pages, so that is where
the effort belongs.

| # | Template | Instances | Today |
|---|---|---|---|
| 1 | Home | 1 | exists |
| 2 | Service `/services/<service>` | 6 | exists |
| 3 | **Locations index** `/locations` | 1 | **404** |
| 4 | **Town hub** `/locations/<town>` | ~56 | **1 of 56 exists** |
| 5 | **Combo** `/location/<region>/<town>/<service>` | ~336 | exists, H1 broken |
| 6 | Utility | ~8 | exists |

Templates 3 and 4 are the new build. They are what turns 336 near-orphans into a hierarchy —
today `/services`, `/locations`, `/location` and `/location/warwickshire` all return 404, so
the combo URLs are four levels deep with three missing parents.

### 5. Combo — the money template

```
Breadcrumb        Home › Locations › Warwick › Deep Cleaning
Hero      H1      Deep Cleaning in Warwick            ← real <h1>
RatingBadge       4.9 ★ · 175 Google reviews          ← server-rendered
Prose             800–1,100 unique words
Included          checklist
BeforeAfterSlider
ProcessSteps      3 steps
ReviewRail        town-filtered where available
──────────────────────────────────────────────
InterlinkBlock    services  — other 5 services in Warwick
InterlinkBlock    nearby    — deep cleaning in 5 nearest towns
──────────────────────────────────────────────
FAQAccordion · CTABand · NAPFooter
```

### 4. Town hub — the missing spoke

Breadcrumb · `H1 House Cleaning in Warwick` · genuinely local intro · **6 ServiceCards into the
combos** · reviews from that town · nearby-towns row · CTA.

### 3. Locations index

Breadcrumb · `H1 Areas We Cover` · TownCards grouped by region (Warwickshire, West Midlands,
Staffordshire, Shropshire, Worcestershire) · lazy-loaded static map.

### 2. Service

Breadcrumb · `H1 Deep Cleaning in Warwickshire & the West Midlands` · what's included ·
before/after filtered to service · process · reviews · **towns we cover for this service**
(InterlinkBlock into the combos) · FAQ · CTA.

### 1. Home

Hero with rating · TrustBar (DBS-checked · insured · guarantee) · 6 ServiceCards ·
BeforeAfterSlider · ProcessSteps · ReviewRail · locations teaser into `/locations` · FAQ ·
CTABand · NAPFooter.

### 6. Utility

About, contact, get-a-quote, checklist, work-with-us, gift cards, legal, one article layout.
Note four current utility pages have **no `<h1>` at all** (`/contact-us`, `/customer-login`,
`/gift-cards`, `/work-with-us`) — the template must not allow that.

---

## 4. The locks

Written as assertions because **each becomes a CI check at build time.** The live site
regressed silently on nearly all of these; guidance would not have caught any of them.

| # | Assertion | Catches |
|---|---|---|
| 1 | Exactly one `<h1>` per page, containing the service and/or town for its template | The 101-page H1 fragment |
| 2 | Breadcrumbs + `BreadcrumbList` on every non-home page | 0 of 115 today |
| 3 | Rating badge present in server-rendered HTML on every template | The 516 KB widget |
| 4 | Exactly one `tel:` in the footer, and **`href` digits must equal the displayed digits** | The footer showing one number and dialling another |
| 5 | No street address or UK postcode in any rendered output | The residential-address decision |
| 6 | InterlinkBlock present on service, town-hub and combo templates | 4 footer links serving 95 pages |
| 7 | Every `<img>` has non-empty `alt` | 1,230 of 2,183 missing |
| 8 | Title ≤60 chars and contains the town; description ≤155 chars | Already good — prevent regression |
| 9 | All JSON-LD server-rendered; none injected by client JS | Zero schema today |
| 10 | No third-party script >50 KB without explicit sign-off | Trustmary + GTM = 1,030 KB of 1.9 MB |
| 11 | Combo pages carry ≥800 unique body words | Protects the one metric beating Arbor Trail |

Lock 4 is deliberately phrased as *href digits must equal displayed digits* rather than "use
the correct number" — that is the assertion that would actually have caught the live bug.

Lock 11 exists because the safety margin on scaling to 336 pages comes from depth. Measured
pairwise similarity is 0.049 median against Arbor Trail's 0.100, with 821 unique words per page
against their 353. If new towns ship 300-word pages, that finding no longer applies to them.

### Schema to emit

All server-rendered:

| Schema | Where |
|---|---|
| `LocalBusiness` + `areaServed`, **no `streetAddress`** | Every page |
| `Organization` + `sameAs` | Home |
| `WebSite` | Home |
| `Service` + `areaServed` | Service and combo pages |
| `BreadcrumbList` | Every non-home page |
| `AggregateRating` | Home and about — entity graph only, not for SERP stars |

---

## 5. Package to build

```
design-system/
├── README.md
├── package.json
├── tokens.css                    # §1 verbatim — single source of truth
├── styles.css                    # base/reset + type
└── src/components/
    ├── Hero/                     # .jsx .html .d.ts .prompt.md  (BK V3 shape)
    ├── Breadcrumbs/
    ├── RatingBadge/
    ├── NAPFooter/
    ├── InterlinkBlock/
    └── Button/
```

**First sync: foundations plus the five locked components + Button.** The DesignSync guidance
is explicitly incremental — "one component at a time, never as a wholesale replace" — and BK
V3's 46 components were not built in one pass. The remaining ~15 follow once the direction has
been reacted to in Claude Design.

## Open dependencies

| Dependency | Blocks | Owner |
|---|---|---|
| Original photos from canva.com → Projects → Uploads | BeforeAfterSlider, and direction B generally | Sam |
| Final typeface pair | `tokens.css` type block | Claude Design |
| Logo SVG + lockup family | Header, favicon, NAPFooter | Claude Design — see [`brand-brief.md`](brand-brief.md) |
