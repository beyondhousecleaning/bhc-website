---
phase: 01-platform-foundation-design-system-integration
plan: 01
subsystem: ui
tags: [design-system, npm-exports, json-ld, schema-org, xss, node-test, esm]

# Dependency graph
requires: []
provides:
  - "`@bhc/design-system` exposes `./fonts/*` through its exports map — `import '@bhc/design-system/fonts/fonts.css'` now resolves through the package boundary"
  - "`design-system/src/jsonLd.js` — package-internal `safeJsonLd(obj)` serialiser that escapes `<`"
  - "All three JSON-LD emitters (NAPFooter, Breadcrumbs, RatingBadge) serialise through `safeJsonLd`; zero bare `JSON.stringify` remains in any component `.jsx`"
  - "Lock suite grown 8 → 10 tests, still zero-dependency `node --test`"
affects: [01-02-root-layout, 01-03-ci-locks, phase-03-programmatic-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure string-manipulation logic lives in `.js`, never `.jsx` (two reasons: `node --test` has no JSX transform; the `claude-seo` hook blocks `.jsx` writes containing the substring every `.replace(` call carries)"
    - "Package-internal helpers are deliberately absent from `src/index.js` — widening the public surface invites an app-side reimplementation"
    - "A fix is not done until it is a lock test in the same suite that gates CI"

key-files:
  created:
    - design-system/src/jsonLd.js
  modified:
    - design-system/package.json
    - design-system/src/components/NAPFooter/NAPFooter.jsx
    - design-system/src/components/Breadcrumbs/Breadcrumbs.jsx
    - design-system/src/components/RatingBadge/RatingBadge.jsx
    - design-system/test/locks.test.js

key-decisions:
  - "Wildcard `./fonts/*` exports entry, not a single `./fonts/fonts.css` entry — fonts.css references eight sibling .woff2 files the bundler must also resolve through the package boundary"
  - "`safeJsonLd` is NOT re-exported from `design-system/src/index.js` — package-internal plumbing, kept off the public surface"
  - "RatingBadge's inlined object literal was NOT hoisted to a `schema` const to match its siblings — unrequested churn on a D-05-locked component"
  - "New lock banner matches the file's actual 79-char banner width, not the 76 the plan's acceptance criterion stated"

patterns-established:
  - "JSON-LD serialisation: every `dangerouslySetInnerHTML` JSON-LD payload in this package goes through `safeJsonLd`, enforced by test not convention"

requirements-completed: [REQ-nap-consistency]

# Metrics
duration: 4min
completed: 2026-08-08
---

# Phase 01 Plan 01: Design-System Package Fixes Summary

**`@bhc/design-system` now exports `./fonts/*` (unblocking the root layout's font import) and routes all three JSON-LD emitters through a new `safeJsonLd` escape, locked by 2 new tests — 10/10 passing with zero dependencies and no build step.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-08-08T21:02:25Z
- **Completed:** 2026-08-08T21:06:02Z
- **Tasks:** 3
- **Files modified:** 6 (5 modified, 1 created)

## Accomplishments

- **Fonts subpath is reachable.** The `exports` map is an allowlist, so every subpath not listed is
  unreachable even when the file is physically present. `import '@bhc/design-system/fonts/fonts.css'`
  previously failed with `ERR_PACKAGE_PATH_NOT_EXPORTED` (Turbopack: `Module not found`). Plan 02's
  root layout is now unblocked.
- **The JSON-LD script-injection sink is closed.** All three emitters interpolated values into
  `dangerouslySetInnerHTML` via bare `JSON.stringify`, which does not escape `</script>`. Fixed at a
  cost of two lines per component rather than a Phase-3 retrofit across ~336 pages.
- **The escape is a lock, not a hope.** Two new tests in the same zero-dependency harness that gates
  Locks 4, 5 and 7 — a future edit reintroducing bare `JSON.stringify` now fails CI.
- **Nothing else moved.** Zero rendered markup, class name, prop or default changed on any component
  (D-05). Package still has zero `dependencies`, zero `devDependencies`, one npm script, no build
  step and no `dist/`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Expose design-system/fonts through the package exports map** — `bc72977` (fix)
2. **Task 2: Add safeJsonLd and apply it at all three JSON-LD call-sites** — `d16011c` (fix)
3. **Task 3: Turn the JSON-LD escape into a lock test** — `e9a32e7` (test)

## Files Created/Modified

- `design-system/package.json` — exports map + files array (see exact diff below)
- `design-system/src/jsonLd.js` (**new**, 26 lines) — the `safeJsonLd` serialiser
- `design-system/src/components/NAPFooter/NAPFooter.jsx` — import at L25, call-site at L119
- `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx` — import at L15, call-site at L63
- `design-system/src/components/RatingBadge/RatingBadge.jsx` — import at L16, call-site at L62
- `design-system/test/locks.test.js` — `safeJsonLd` import at L21, new section + 2 tests at L161-181

### The exact `package.json` diff

```diff
     ".": "./src/index.js",
     "./tokens.css": "./tokens.css",
-    "./styles.css": "./styles.css"
+    "./styles.css": "./styles.css",
+    "./fonts/*": "./fonts/*"
   },
-  "files": ["src", "tokens.css", "styles.css"],
+  "files": ["src", "tokens.css", "styles.css", "fonts"],
```

`exports` now has exactly four keys: `.`, `./tokens.css`, `./styles.css`, `./fonts/*`.
No `types` condition, no `sideEffects`, no version bump, no dependency block, no extra script.

### The `safeJsonLd` implementation line

```js
/** Serialise JSON-LD safely for inline <script> embedding. */
export const safeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
```

Named export only, no `export default` — matching `formatPhone.js` and `geo.js`. The block-comment
header names both reasons the logic is in a `.js` file (no JSX transform under `node --test`; the
`claude-seo` hook blocks `.jsx` writes containing the substring every `.replace(` call carries) and
what it defends against (a `</script>` in an interpolated value breaking out of the inline block —
harmless today, material from Phase 3 when ~56 town names arrive from a data file).

### Call-site line numbers after the edit

| File | Import | Serialiser call |
|------|--------|-----------------|
| `NAPFooter.jsx` | L25 | L119 — `safeJsonLd(schema)` |
| `Breadcrumbs.jsx` | L15 | L63 — `safeJsonLd(schema)` |
| `RatingBadge.jsx` | L16 | L62 — `safeJsonLd({` (inlined literal, swapped in place) |

## Verification Results

Run from the repo root with **no `node_modules` anywhere** (confirmed absent):

| Check | Result |
|-------|--------|
| `node --test design-system/test/*.test.js` | `# tests 10`, `# pass 10`, `# fail 0` |
| `safeJsonLd({n:'</script>'})` | `{"n":"</script>"}` — no literal `</script>`, parses back exactly |
| `grep -rn "JSON\.stringify" design-system/src/components/ --include='*.jsx'` | no matches |
| `grep -rn "\.replace(" design-system/src --include='*.jsx'` | no matches |
| `grep -rn "use client" design-system/src` | no matches |
| `grep -n "safeJsonLd" design-system/src/index.js` | no matches — helper absent from public barrel |
| `git diff --name-status HEAD~3 HEAD` | exactly 6 paths, all under `design-system/`; no `.html`, `.d.ts` or `.prompt.md` touched |
| `ls design-system/node_modules design-system/dist` | neither exists |
| package manifest assertions | no `dependencies`, no `devDependencies`, no `types`, `scripts` still a single `test` entry |

**Final TAP counts: 10 pass, 0 fail** (8 pre-existing + 2 added).

## Decisions Made

- **Wildcard `./fonts/*` rather than a single `./fonts/fonts.css`.** `fonts.css` references eight
  sibling `.woff2` files; a single-file entry would resolve the stylesheet and then fail on every
  face.
- **`safeJsonLd` stays off `src/index.js`.** It is package-internal plumbing. Exporting it would
  widen the public surface for no consumer benefit and invite an app-side reimplementation — the
  exact second-source-of-truth failure mode this package exists to prevent.
- **RatingBadge keeps its inlined object literal.** Hoisting a `schema` const to match its two
  siblings would be unrequested churn on a D-05-locked component.

## Deviations from Plan

No functional deviations — no deviation rule was triggered and no auto-fix was required. Three
acceptance-criterion clarifications, all cosmetic arithmetic in the plan text rather than code
changes:

**1. `package.json` diff is 3 insertions / 2 deletions, not the 2/2 the criterion stated**
- **Found during:** Task 1
- **Detail:** Adding a fourth `exports` key necessarily adds one line *and* appends a comma to the
  preceding `"./styles.css"` line. 2/2 is arithmetically unreachable for this edit. The diff is
  minimal and matches the plan's `<action>` text exactly.

**2. Two `.jsx` files changed 3 lines, not the "at most 2" the criterion stated**
- **Found during:** Task 2
- **Detail:** `Breadcrumbs.jsx` and `RatingBadge.jsx` had no import block, so the new import needs a
  blank separator line to match house formatting: +3/−1 rather than +2/−1. `NAPFooter.jsx`, which
  already had an import, is +2/−1 as specified. No markup, class, prop or default changed in any of
  the three.

**3. The new section banner is 79 characters, not the 76 the criterion stated**
- **Found during:** Task 3
- **Detail:** The criterion also said "matching the existing banners". Measured, all five existing
  banners in `locks.test.js` are 79 characters. The two requirements conflict; matching the actual
  file was the correct resolution, and the new banner is byte-consistent with its five neighbours.

---

**Total deviations:** 0 auto-fixed (0 bugs, 0 missing-critical, 0 blocking, 0 architectural)
**Impact on plan:** None. Plan executed as written; the three notes above are corrections to
acceptance-criterion arithmetic, not to the implementation.

## Issues Encountered

- **`impeccable` design hook flagged 3 `broken-image` findings in `locks.test.js`** (L87, L100,
  L102). All three are **false positives**: they are the pre-existing Lock 7 test's regex literal
  (`/<img\b[^>]*>/g`) and its failure-message string, not image markup. The lines are untouched by
  this plan and out of scope. Left unchanged; no ignore comment added.
- **`grep --include=*.jsx` needs quoting under zsh** — unquoted, zsh attempts to glob it and the
  verification command fails with `no matches found` rather than running. Re-ran with
  `--include='*.jsx'`. Worth carrying into Plan 03's CI script, which will run similar greps.

## Known Stubs

None. No placeholder values, no hardcoded empty data, no TODO/FIXME introduced.

## Threat Flags

None. This plan closed a threat surface (T-01-01) and introduced none. No new network endpoint, auth
path, file access pattern, or schema change at a trust boundary. Threat register dispositions
delivered: T-01-01 **mitigated** (Task 2 + Task 3), T-01-03 **mitigated** (Task 1's verify asserts
both dependency keys absent), T-01-04 **mitigated** (Task 3), T-01-SC **N/A** — zero package-manager
installs occurred.

## User Setup Required

None — no external service configuration required by this plan. (The Vercel project connection
remains an open Sam-gated item for a later plan in this phase, per 01-CONTEXT.md Open Question 3.)

## Next Phase Readiness

- **Plan 02 is unblocked.** `import '@bhc/design-system/fonts/fonts.css'` now resolves. Reminder
  carried from 01-PATTERNS.md: import `styles.css` only (it already `@import`s `tokens.css`, and
  that is its *only* `@import` — `fonts.css` is deliberately outside the closure, which is why this
  exports fix was needed).
- **Plan 03's CI harness has a larger target.** The lock suite is now 10 tests, not 8. Any CI job or
  doc that hardcodes "8 passing lock tests" needs updating — including `.planning/PROJECT.md`,
  `.planning/STATE.md` and `01-CONTEXT.md` D-12, all of which currently say 8.
- **Phase 3 inherits a safe serialiser.** When ~56 town names and 8 service names start feeding these
  three components from a data file, the `</script>` breakout is already closed and locked.
- No blockers.

---
*Phase: 01-platform-foundation-design-system-integration*
*Completed: 2026-08-08*
