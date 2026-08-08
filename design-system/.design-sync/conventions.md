# Building with the Beyond House Cleaning design system

## Setup: there is no provider

Components are plain function components reading no React context. **Do not wrap anything in a
theme or provider** — none is exported and none is needed. The only requirement is that
`styles.css` is loaded; it `@import`s the tokens, the self-hosted brand faces, and the component
CSS. Every component renders unstyled without it and correct with it.

Named exports: `Button`, `Hero`, `Breadcrumbs`, `RatingBadge`, `NAPFooter`, `InterlinkBlock`, plus
four pure helpers — `buildInterlinks`, `nearestTowns`, `distanceMiles`, `formatPhone`.

## The styling idiom: `bhc-` classes + `var(--bhc-*)` tokens

Component internals are already classed — pass `className` only to add layout margins. For your
own markup, use these real classes and tokens; **never invent a `bhc-` name** and never hardcode a
hex value that a token already holds.

Layout and utility classes (the complete set available to you):

| Family | Names |
|---|---|
| Width | `bhc-container`, `bhc-container--narrow`, `bhc-container--wide` |
| Section bands | `bhc-section`, `bhc-section--warm`, `bhc-section--tint`, `bhc-section--navy` |
| A11y | `bhc-visually-hidden`, `bhc-skip-link` |

Token families (61 total, all `--bhc-` prefixed):

| Family | Examples |
|---|---|
| Colour | `--bhc-ink`, `--bhc-ink-muted`, `--bhc-navy`, `--bhc-blue`, `--bhc-cyan`, `--bhc-action`, `--bhc-action-hover`, `--bhc-sponge`, `--bhc-paper`, `--bhc-paper-warm`, `--bhc-paper-tint`, `--bhc-line`, `--bhc-success`, `--bhc-warning`, `--bhc-danger` |
| Space | `--bhc-space-1` … `--bhc-space-32` (1,2,3,4,6,8,12,16,24,32) |
| Type | `--bhc-font-body`, `--bhc-font-display`, `--bhc-text-xs` … `--bhc-text-3xl`, `--bhc-weight-normal/medium/semibold/bold`, `--bhc-leading-tight/snug/body`, `--bhc-tracking-tight` |
| Shape | `--bhc-radius-sm/md/lg/xl/full`, `--bhc-shadow-sm/md/lg` |
| Motion / focus | `--bhc-dur`, `--bhc-dur-fast`, `--bhc-dur-slow`, `--bhc-ease`, `--bhc-focus-ring`, `--bhc-focus-offset` |

Headings use `--bhc-font-display` (Figtree); body uses `--bhc-font-body` (Public Sans). Both ship
self-hosted — do not add a webfont link.

## Four rules that are not preferences

These were measured from the hex values, and breaking them ships failing contrast:

1. **Orange fills take ink labels, never white.** White on `--bhc-action` is 3.05:1 against a
   4.5:1 requirement; ink on orange is 5.17:1. `Button variant="primary"` already does this.
2. **Cyan never carries white text.** White on `--bhc-cyan` is 2.75:1 — it fails even large text.
   Cyan is fine as a *surface* with ink on top (5.75:1).
3. **`--bhc-navy` surfaces may carry white text** (5.97:1). On navy, use
   `Button variant="ghost"` — the secondary outline disappears there.
4. **`RatingBadge` is for light surfaces only.** Its value and count set `--bhc-ink` /
   `--bhc-ink-muted` directly rather than inheriting `currentColor`, so it renders illegibly on
   navy or any dark band.

Two structural rules the components enforce for you: `Hero`'s `heading` prop is always the page's
single `<h1>` (`eyebrow` is decoration and renders as a `<p>` — there is no prop that promotes
it), and `NAPFooter` derives both the displayed number and the `tel:` href from one `phone` prop,
so they cannot diverge.

## Where the truth lives

Read these before styling anything: `styles.css` and its `@import` closure (`tokens/tokens.css`
for every token value, `fonts/fonts.css`, `_ds_bundle.css` for the component classes), and each
component's `<Name>.prompt.md` — those carry the reasoning, the variant tables, and the measured
contrast ratios.

## An idiomatic composition

```jsx
<>
  <Hero
    eyebrow="Reliable & Affordable"
    heading="Deep Cleaning in Warwick"
    lead="DBS-checked local cleaners who turn up when they say they will."
    rating={{ rating: 4.9, count: 175, source: 'Google' }}
    actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
  />

  <section className="bhc-section bhc-section--warm">
    <div className="bhc-container">
      <h2 style={{ marginBottom: 'var(--bhc-space-6)' }}>What we clean</h2>
      <p style={{ color: 'var(--bhc-ink-muted)', maxWidth: '65ch' }}>
        Skirting boards to oven interiors, every surface back to new.
      </p>
      <Button href="/checklist" variant="secondary">See Our Checklist</Button>
    </div>
  </section>
</>
```

Library components carry the controls; `bhc-section` / `bhc-container` and `var(--bhc-*)` carry
your own layout glue.
