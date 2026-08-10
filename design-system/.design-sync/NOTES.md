# /design-sync notes — @bhc/design-system

Project: `BHC Design System` — https://claude.ai/design/p/ddb1c2c9-fbc0-4805-897b-d9c1b207c3f5
Shape: `package` (no Storybook anywhere in the repo). First sync: 2026-08-06.

## Fresh-clone setup (do this before any re-sync)

This package deliberately ships **no toolchain** — no lockfile, no `node_modules`, no build
script, because the locks are tested with plain `node --test` and no JSX build. The converter
needs React and a package root, so two symlinks have to be recreated per clone (both gitignored):

```sh
cd design-system
mkdir -p .ds-sync && cp -r "<skill-base-dir>"/{package-build,package-validate,package-capture,resync}.mjs \
  "<skill-base-dir>"/lib "<skill-base-dir>"/storybook .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json
(cd .ds-sync && npm i esbuild ts-morph @types/react react react-dom playwright)

ln -sfn .ds-sync/node_modules node_modules          # 1. makes the package root resolvable
mkdir -p node_modules/@bhc                           # 2. self-symlink so tokensPkg resolves
ln -sfn ../../.. node_modules/@bhc/design-system
```

**Why symlink 1 matters:** the converter derives the package root from `dirname(--node-modules)`.
Passing `--node-modules ./.ds-sync/node_modules` makes it treat `.ds-sync/` as the package and it
finds zero components. Always pass `--node-modules ./node_modules`.

**Why symlink 2 matters:** `copyTokens` in `lib/css.mjs` returns early unless `cfg.tokensPkg` is
set, and it resolves that name from `node_modules`. Tokens live in-package here, so the package
has to be resolvable by its own name for `tokens/tokens.css` to ship.

## The build command is a CSS bundle, not a JS build

`cfg.buildCmd` runs esbuild over `styles.css` into `dist/styles.css`, and `cfg.cssEntry` points at
that output. This is load-bearing:

- The converter copies `cssEntry` **verbatim** to `_ds_bundle.css` and does not rewrite `@import`s.
- Source `styles.css` starts with `@import './tokens.css'`, which would dangle at the bundle root
  → `[CSS_IMPORT_MISSING]` plus `[TOKENS_MISSING]` for all 48 vars.
- esbuild inlines the import, so the shipped component CSS is self-contained.

`dist/` is gitignored — it is a build artifact, regenerate it with `cfg.buildCmd`. Deliberately
**not** added to `package.json` as a script/devDependency, to preserve the repo's zero-toolchain
design. Run it before the converter on every re-sync.

## Why `componentSrcMap` and `docsMap` enumerate every component

Both are full enumerations rather than sparse exception lists — 22 entries each as of Phase 2, and
that is correct here:

- **`componentSrcMap`**: discovery reads PascalCase value exports from the shipped `.d.ts` tree via
  an entry `.d.ts`. There is no `src/index.d.ts` and no `types` field in `package.json`, so
  `exportedNames()` returns nothing → `[ZERO_MATCH]`. Pinning each `.jsx` path is the only route.
  **Add a new component here or it will not sync.**
- **`docsMap`**: sibling-doc discovery looks for `<Name>.md`/`.mdx`. This repo names them
  `<Name>.prompt.md`, which never matches, so each is pinned explicitly. These docs are excellent
  and worth binding — they become the uploaded `.prompt.md` the design agent reads.

## Component grouping comes from `@dsCard`, via frontmatter

`src/components/` is in the converter's `GENERIC_DIR` set, so the path-derived group resolves to
nothing and every component would land in `general`. Groups now come from `category:` frontmatter
prepended to each `.prompt.md`, **generated from the `@dsCard group="…"` marker in the sibling
`.html`** so the two cannot diverge. Regenerate with the snippet in git history for this file's
first commit, or add frontmatter by hand when adding a component.

**The groups are a closed set of four**, and the distribution across the 22 components today is
Navigation 6, Content 8, Trust 5, Actions 3. The per-component assignment is deliberately *not*
written out here — it went stale within one phase last time. It lives in each component's `@dsCard`
marker, is mirrored into that component's `.prompt.md` frontmatter, and `config.json`'s
`componentSrcMap` is the enumeration of which components exist. `delta 9` in `test/locks.test.js`
fails if a marker and its frontmatter disagree, if a group falls outside the four, or if a component
is absent from either map — so all three stay true without anyone maintaining a list.

## Fonts are vendored, not CDN-loaded

`[FONT_MISSING]` fired for Public Sans and Figtree. Resolved with the user's explicit approval on
2026-08-06 by vendoring the Latin + Latin-ext variable woff2 (normal + italic, 8 files, 168 KB)
from Google Fonts into `fonts/`, wired via `cfg.extraFonts`. Both are SIL OFL 1.1, embedding
permitted. `fonts/` **is committed** — it is a sync input, not a build artifact.

Per the DS spec these were "placeholder stacks; Claude Design picks the real pair". If the real
pair is chosen later, replace `fonts/` and the `--bhc-font-body`/`--bhc-font-display` stacks
together. Regenerate the sheet by re-fetching the `css2` URL with a Chrome UA and rewriting the
`url()`s to local filenames.

## Known render warns

Nothing outstanding — the final validate run exits clean with zero warnings. Warns seen and
resolved during the first sync, for reference:

- `[GRID_OVERFLOW] NAPFooter (wide)` — footers are full-width by nature. Fixed permanently with
  `cfg.overrides.NAPFooter: {"cardMode": "column"}`. Do not remove that override.

Plan 02-10 added the same `{"cardMode": "column"}` override for **`Header`, `Footer` and
`StickyCallBar`**, pre-emptively and for the identical reason: all three are full-width site chrome —
a header bar, the footer that composes `NAPFooter`, and a fixed mobile call bar — so each has the
shape that produced the original `NAPFooter` warn. `cfg.overrides` now holds four entries and they
are all one shape. None of the other eighteen needs one; a component that starts warning `wide`
should get an override here rather than a layout change, because the warn is about the card, not the
component.

## Render-harness artifacts — do not chase these

- **`© 2024` in NAPFooter screenshots.** `package-capture.mjs:102` pins the browser clock to
  `2024-05-15` for deterministic screenshots. `NAPFooter` uses `new Date().getFullYear()`, so the
  captured year is always 2024 regardless of the real date. The component is correct.

## Finding for the design system itself (not a sync issue)

**`RatingBadge` cannot be used on dark surfaces.** `.bhc-rating__value` sets `--bhc-ink` and
`.bhc-rating__count` sets `--bhc-ink-muted` directly, instead of inheriting `currentColor`. On a
`--bhc-navy` band both are effectively illegible while the stars (which *do* use `currentColor`)
still read. An `OnNavy` preview cell was written, seen to fail, and replaced with
`SurfacesItSupports`, which documents the three light surfaces that work.

Not patched — the sync ships the repo's real code and does not rewrite components. If a rating on
navy is ever wanted, the fix is `color: inherit` on those two rules plus a contrast re-check.
The conventions header currently documents the limitation for the design agent.

## Preview authoring

**Every one of the 22 components has an authored `.html` preview** at
`src/components/<Name>/<Name>.html`. That file is the canonical composition: it carries the
`@dsCard` marker the group is read from, it is what `Lock 7`, `delta 9` and `delta 14` scan, and its
count is a floor in the lock suite (22, the exact number, so a vanished preview turns the suite red).

**Authored `.tsx` sync previews exist for the original six only** — `Button`, `Hero`, `Breadcrumbs`,
`RatingBadge`, `NAPFooter`, `InterlinkBlock` (28 cells, all graded `good`). Their compositions were
ported from the `.html` previews — including the hero's honest data-URI placeholder for the
still-blocked photography, and the "the live-site bug this prevents" caption blocks.

The sixteen components added in Phase 2 have **no** `.design-sync/previews/*.tsx`, so Claude Design
generates their cards from the component and its inferred props instead of showing curated cells.
This was a deliberate decision (02-RESEARCH assumption A7) and its consequence is cosmetic and
reversible: the components sync, the docs sync, the tokens sync, and only the *card composition* is
generated rather than authored. Anyone who wants an authored one drops a `<Name>.tsx` in this
directory — no config entry, no lock, nothing else to change.

`InterlinkBlock.tsx` calls the real `buildInterlinks` / `nearestTowns` over a real town list with
coordinates copied from `test/locks.test.js`, so the "N miles away" strings are computed, not
written. If those coordinates change in the test, the preview drifts from the test's fixture —
they are duplicated, not shared.

## Re-sync risks — what can silently go stale

1. **The two symlinks are gitignored.** A fresh clone has neither, and the failure mode is quiet:
   missing symlink 1 gives `[ZERO_MATCH]` (0 components, "tokens-only DS"), missing symlink 2
   silently ships no `tokens/` and 48 undefined vars. Recreate both first.
2. **`dist/styles.css` is gitignored.** Forget `cfg.buildCmd` and the converter copies a stale or
   absent stylesheet. When in doubt, re-run it — output is deterministic.
3. **New components are invisible by default.** They need a `componentSrcMap` entry, a `docsMap`
   entry, and `category:` frontmatter. None of the three is auto-discovered in this repo.
4. **Town coordinates are duplicated** between `test/locks.test.js` and
   `.design-sync/previews/InterlinkBlock.tsx` (see above).
5. **Fonts were fetched over the network** on 2026-08-06 at Figtree v9 / Public Sans v21. A future
   re-fetch may pull different revisions; the committed woff2s are the source of truth, so there is
   no need to re-fetch unless the type choice changes.
6. **Only partially verified:** the previews were graded from headless-Chromium screenshots at a
   single viewport. Responsive behaviour, hover/focus states and motion were never rendered —
   `--bhc-dur*`, `--bhc-ease` and `--bhc-focus-ring` are documented but unexercised.
7. **`package.json` has no `types` field.** Adding one (or a `src/index.d.ts` barrel) would let
   discovery work natively and make `componentSrcMap` unnecessary — worth doing if the component
   count grows. It has: 6 → 22 in Phase 2, with every one of the sixteen hand-registered in two
   maps. Risk 3 above is now the most expensive line in this file, and this is its permanent fix.
