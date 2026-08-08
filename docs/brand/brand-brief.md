# Brand brief — Beyond House Cleaning

Agreed 2026-08-06. Written for **Claude Design**, which designs the logo and the page layouts.

Companion doc: [`../design/design-system.md`](../design/design-system.md) — tokens, components,
templates and the SEO locks. Source material: [`logo-audit.md`](logo-audit.md),
[`photo-spec.md`](photo-spec.md), [`../research/competitor-arbor-trail.md`](../research/competitor-arbor-trail.md).

## Positioning in one line

A **genuinely local Warwickshire cleaning team** — not a national booking platform, and not a
faceless cleaning corporation.

That is a competitive position, not a slogan. The businesses actually appearing alongside BHC
in search are **Fantastic Services** and **Care.com** — national platforms with no local
identity. "A real team that lives here" is the thing they structurally cannot claim.

## Visual direction — B, "warm local craft"

Chosen from four candidates.

| | |
|---|---|
| **Type & shape** | Humanist sans, rounded corners, generous whitespace, subtle texture |
| **Imagery** | Before/after pairs and real people lead the page |
| **Reads as** | A real local team, not a call centre |

**Layout comes from Arbor Trail; the look does not.** Their section order is proven and worth
copying closely — hero → services → why-choose → process → before/afters → CTA → FAQ → footer.
Their *appearance* is what we are deliberately avoiding, for a specific reason set out below.

Rejected alternatives, and why:

- **Bold trades confidence** — proven (it is literally Arbor Trail at ~$200k/mo) and lowest
  risk, but walks straight into the clone problem.
- **Clean editorial** — most distinctive and ages well, but reads cold and premium for a
  mid-market cleaning service.
- **Bright & energetic** — differentiated and strong on mobile, but the gap between this done
  well and done badly is very wide.

## The clone problem, and the orange

`goals.md` says *"model Arbor Trail's layout closely — make colours, photography and copy our
own."* The difficulty is that **their palette is already ours**:

| | Arbor Trail | BHC logo (measured) |
|---|---|---|
| Navy | `#112d4e`, `#0d3b66` | `#2064B1` |
| Cyan | `#00bcf4` | `#0DA6E8` |
| Pale tint | `#eef7ff` (cold) | — |
| **Orange** | **none** | **`#F06C24`, `#F78C34`** |

Take their layout *and* their blue and BHC becomes a visual clone of a Detroit cleaning
company. Blue is also the default for the entire UK cleaning category, so it is the opposite of
distinctive.

**The decision: split the palette by context.**

- **On the site** — blue structures (headers, section surfaces, trust), **orange owns every
  action** (buttons, links, active states).
- **On the brand marks** — **orange-forward**: favicon, square badge, GBP profile photo, social
  avatar.

The reasoning is about where differentiation actually pays. A blue favicon in a SERP, or a blue
thumbnail in a map pack, is invisible among competitors. An orange one is not. On-page, blue
still does the trust work it does well.

**Also warm, not cold, neutrals.** Arbor Trail bands sections in `#eef7ff`, a cold blue tint.
BHC uses warm off-whites (`#FBF8F5`, `#F5EFE8`). Same blues, completely different temperature —
this single choice does most of the "warm local" work and costs nothing.

Full token list and the measured contrast ratios: [`../design/design-system.md`](../design/design-system.md) §1.

⚠️ Two accessibility constraints that shape the design, both measured:

- **Orange buttons take dark-navy labels, never white.** White on `#F06C24` is 3.05:1 against a
  4.5:1 requirement. Ink-on-orange is 5.17:1 — and looks better besides.
- **Cyan never carries white text.** White on `#0DA6E8` is 2.75:1 — it fails even large text,
  and it is exactly the failure the logo audit spotted in the current wordmark. Cyan *is* fine
  as a surface with dark-navy on top (5.75:1), so cyan panels are allowed; cyan-with-white is
  not.

---

## Logo brief

The current mark is raster-only, 2.72:1, with 29% dead margin top and bottom — in a 48px header
it renders about 20px tall. Full diagnosis in [`logo-audit.md`](logo-audit.md).

### Rebuild as SVG first

Everything else depends on it. No lockup, favicon or recolour is possible from the current PNG.

### Lockup family

| Variant | Use | Priority |
|---|---|---|
| **Square badge / icon** | Favicon, GBP profile photo, social avatars, app icon | **First** — this is the orange-forward mark |
| Horizontal primary | Site header, invoices, email signature | Second |
| Stacked | Narrow/mobile, van livery, square-ish slots | Third |
| One-colour navy + white knockout | Single-colour print, dark backgrounds, watermarks | Fourth |

The square badge comes first, reversing the usual order. It is the variant that does not exist
today, and it is where the orange-forward decision is expressed — it appears in exactly the
competitive contexts (SERP, map pack, social) where BHC currently looks like everyone else.
The simplified sponge is the natural candidate for it.

### Fixes required

| Problem | Fix |
|---|---|
| 29% dead margin top and bottom, 10% each side | Crop the artboard to the ink box so the mark fills its space |
| Arced wordmark fights the nav baseline and loses legibility small | Reduce the curvature, or set the wordmark straight and let the swipe carry the motion |
| `HOUSE CLEANING` far smaller than `BEYOND`; smears below ~120px | Raise its relative size so both survive at small scale |
| White on the light end of the gradient is 2.75:1 | Darken the gradient's left end, or add a darker underlay behind `BEYOND` |
| Sponge reads as a generic blob when small | Simplify to a recognisable silhouette — it becomes the square icon |
| No variant family | The four lockups above |

### Constraints

- Work **inside the locked tokens** — the palette is fixed, the logo is drawn to it, not the
  other way round. The logo audit asks for exactly this: *"lock the palette to named tokens so
  the site, GBP, van and uniforms all match."*
- Must be legible as a **16px favicon** and as a **1:1 GBP thumbnail**.
- Must work in one colour and knocked out white.
- Existing van, uniform and social assets are in the current blue/orange, so the palette stays
  compatible with them.

---

## Photography

Before/afters are, per [`photo-spec.md`](photo-spec.md), *"the highest-converting element on a
cleaning site."* Direction B is built around them, which makes them the critical path for
step 2.

🔴 **Blocked.** All 199 files in the Canva export are unusable: 1080×1080 composited social
posts with the **old logo burned in** and `BEFORE`/`AFTER` labels over the photo, leaving about
530×690px of recoverable image per half. Two independent disqualifiers — thumbnail resolution,
and shipping a logo we are replacing.

**Action:** pull originals from **canva.com → Projects → Uploads** (supports bulk multi-select).

Until then, Claude Design should work with placeholders and treat the slider as specified but
unfilled. Getting the originals pays twice: a real before/after slider, and automated
regeneration of all 199 social composites in the new brand.

**Direction:** real homes, real light, matched framing. No stock photography of models in
tabards — it reads instantly as a national platform, which is the exact opposite of the
positioning.

---

## What not to do

| Avoid | Why |
|---|---|
| **Poppins** | Arbor Trail's face, and the most templated choice in the trades category |
| **Inter** | Reads as a default |
| Cold grey or cold blue section tints | The single clearest tell that separates us from Arbor Trail |
| White text on orange, or white text on cyan | Measured accessibility failures — 3.05:1 and 2.75:1. Ink on either is fine |
| Stock photography of models | Contradicts the entire "genuinely local" position |
| A serif display face | Reads artisan-bakery; cleaning is a practical purchase |
| Designing an FAQ block around rich results | Google retired FAQ rich results on 2026-05-07 |
| A two-line hero where the keyword line is not the `<h1>` | The exact pattern that broke 101 of 115 live pages |
