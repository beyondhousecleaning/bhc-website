# Phase 1: Platform Foundation & Design System Integration - Context

**Gathered:** 2026-08-08
**Status:** Ready for planning
**Source:** Derived from already-locked planning artifacts (`.planning/PROJECT.md` Key Decisions
D1–D14, `.planning/ROADMAP.md` Phase 1, `.planning/REQUIREMENTS.md` REQ-nap-consistency,
`docs/design/design-system.md` §4 locks) — **not** from a fresh `/gsd:discuss-phase` session.

> **Why no discuss-phase.** The project was handed off fully planned with the instruction not to
> re-derive decisions. Every decision below is a restatement of an existing locked decision with a
> Phase-1 scope applied — no new design decisions were invented here. Items that genuinely are
> still open are listed under **Open — needs Sam** and are non-blocking.

<domain>
## Phase Boundary

**In scope.** Stand up the Next.js application shell on Vercel and wire in the
`design-system/` package that already exists in this repo. Fix the sitewide NAP bug
structurally (not cosmetically) so it cannot regress. Put the design-system's existing lock
tests into this project's CI.

**Explicitly NOT in scope for Phase 1:**
- Designing components. The 6 existing components (Button, Hero, Breadcrumbs, RatingBadge,
  NAPFooter, InterlinkBlock) are inputs, not deliverables.
- Building the ~15 remaining components (ReviewRail, BeforeAfterSlider, ServiceCard, TownCard,
  ProcessSteps, FAQAccordion, Header, Footer, SkipLink, SectionBand, Prose, CTABand, ReviewCard,
  TrustBar, QuoteFormEntry, StickyCallBar) — that is Phase 2.
- Any programmatic location×service page generation, the towns data file, or hub-and-spoke IA —
  that is Phase 3.
- Full JSON-LD schema coverage and the complete 11-lock CI suite — that is Phase 5. Phase 1
  lands only the locks the design-system package already enforces (4, 5, 7) plus the harness
  that later phases extend.
- Migrating or 301-ing any live URL. The live Webflow site keeps serving production until a
  later cutover; Phase 1 ships to a Vercel URL, not to the apex domain.

**Proof-of-integration bar.** Phase 1 is done when at least one real page renders Hero,
Breadcrumbs, RatingBadge, InterlinkBlock, Button and NAPFooter *from the package* — an import
that compiles is not proof; a rendered page is.
</domain>

<decisions>
## Implementation Decisions

### Platform & hosting

- **D-01** — Next.js on Vercel. Not Webflow, not any other host. (Restates PROJECT.md D5.)
  The design-system package was built assuming this stack.
- **D-02** — The app is a new Next.js application inside this existing repo, consuming
  `design-system/` as a local **npm workspace** package (`@bhc/design-system`, already named
  and `private: true`) — not a relative-path import, not a copied directory. The design-system
  package is **not** republished, restructured, or moved. *(Confirmed empirically in
  01-RESEARCH.md: npm workspaces + Turbopack builds the raw `.jsx` with no build step.)*
- **D-03** — Phase 1 deploys to a Vercel-assigned preview/production URL only. The apex domain
  `www.beyondhousecleaning.com` stays pointed at the live Webflow site until a later cutover
  phase. Nothing in Phase 1 may take the live site down.

### Design system integration

- **D-04** — `design-system/tokens.css` is the single source of truth for colour, type and
  spacing and is imported unmodified. Do not fork it, do not inline its values, do not
  substitute neutral greys for the warm off-whites. (Restates D6, D11, D12.)
- **D-05** — The 6 existing components are consumed as-is from
  `design-system/src/components/`. If a component genuinely cannot render under Next.js
  without a change, the change goes **into the package** (keeping `.jsx`/`.html`/`.d.ts`/
  `.prompt.md` shape intact and lock tests green), never into a divergent copy inside the app.
  This is the anti-drift rule from D9.
- **D-06** — The package ships untranspiled `.jsx` from a plain `"type": "module"` Node
  package with no build step. The Next.js app must be configured to compile it (the standard
  lever is `transpilePackages`); resolving this is a Phase 1 task, not an assumption.
- **D-07** — Components render server-side by default. Anything that would force the
  design-system's server-rendered output into client-only JS is a regression of the whole
  point of the rebuild (CI Locks 3 and 9) and is not acceptable.

### NAP — the phase's one hard requirement (REQ-nap-consistency)

- **D-08** — Exactly one `tel:` sitewide, and the `href` digits must equal the displayed
  digits. The mechanism is already built: `formatPhone.js` derives the display string *from*
  the dial string, so there is no prop for displayed text and the two cannot diverge. Phase 1
  uses that mechanism; it does not reimplement phone formatting in the app.
  (Restates REQ-nap-consistency + CI Lock 4.)
- **D-09** — The canonical number is `+447861936533` — the `NAPFooter` package default, and
  the number the live site *displays* on all 115 pages. The two wrong numbers being retired
  are `07441918832` (what the live footer actually dials) and `+447575709361` (a third number
  on `/get-a-quote`). Neither may appear anywhere in the new app. See **Open — needs Sam**.
- **D-10** — No street address and no UK postcode in any rendered output, anywhere, ever —
  including inside JSON-LD, since JSON-LD ships in page HTML. The registered office
  (CV32 6EQ) is residential. (Restates D4 / CI Lock 5.)
- **D-11** — Every page uses one shared NAPFooter instance. There is no second footer, no
  page-local phone number, and no hardcoded `tel:` outside the component.

### CI / testing

- **D-12** — `design-system/test/locks.test.js` runs in this project's build/CI pipeline. It
  currently has 8 passing tests covering Lock 4 (3 tests), Lock 5, Lock 7, the `@dsCard`
  preview convention, and 2 `nearestTowns` geo tests. It runs on bare `node --test` with zero
  dependencies — do not add a test framework to make it run.
- **D-13** — CI must fail the build when a lock test fails. A lock suite that runs but does not
  gate is not a lock. The remaining 8 page-level locks (1, 2, 3, 6, 8, 9, 10, 11) are Phase 5
  work; Phase 1 only has to make the harness exist and gate.

### Performance

- **D-14** — The performance budget is live from the first commit: <500 KB JS, <1 MB total page
  weight, no third-party script >50 KB without explicit sign-off. The current site ships 1.9 MB
  of JS. Phase 1 must not import Trustmary, GTM, or any analytics/tag manager by default.
- **D-14a** — **The budget is measured as transfer weight (gzip/brotli over the wire), not
  uncompressed bytes on disk.** Evidence: the audit's own 1.9 MB benchmark for the live site was
  measured as transfer weight (`docs/research/seo-audit-2026-08-06.md:75`), so comparing
  uncompressed bytes against it is not like-for-like. Measured in 01-RESEARCH.md: a bare App
  Router page is 550.9 KB uncompressed but **168.5 KB gzip = 34% of the 500 KB budget**. Read as
  uncompressed, Phase 1 would fail the budget on a blank page, which is obviously not the intent.
  Note Next.js 16 removed `First Load JS` from build output, so budget enforcement must be an
  explicit check — there is no free signal.
- **D-15** — **The Vercel deployment must not be indexable until domain cutover.** The live
  Webflow site holds all 95 pages' ranking equity; letting Google index a second, complete copy
  of the same content at a `*.vercel.app` URL risks duplicate-content dilution against the exact
  keywords the whole project exists to win. Phase 1 ships `Disallow: /` (or an equivalent
  noindex) on the Vercel deployment. ROADMAP Phase 5's "robots.txt allows crawling
  (`User-agent: *` present)" criterion applies to the **production apex domain after cutover** —
  the two are not in conflict, and the cutover phase is what flips it.

### Canonical facts (corrections, not decisions)

- **The live domain is `https://www.beyondhousecleaning.com`** — `.com`, not `.co.uk`.
  PROJECT.md's opening sentence says `.co.uk`; that is a typo. The live sitemap
  (`docs/research/current-site-sitemap-2026-08-06.xml`) and 120 occurrences across `docs/` and
  `design-system/` all say `.com`, and `NAPFooter.jsx` already hardcodes
  `SITE = 'https://www.beyondhousecleaning.com'`. Plans must use `.com`.
- Review signal as of 2026-08-06: **175 reviews at 4.9★**. Phase 1 renders this via the
  existing RatingBadge; making it complete across every template is Phase 4.

### Claude's Discretion

Not specified by any locked decision — the planner and executor choose:
- Next.js version and router specifics, and the exact `next.config` shape.
- TypeScript vs JavaScript for the app. 01-RESEARCH.md recommends **JavaScript**, because the
  package's `exports` map has no `types` condition and TS would force a further package change;
  the planner may still choose TS if it accepts that cost.
- Directory name and location of the Next.js app within the repo (research used `web/`).
- Which single page serves as the proof-of-integration page, and its content (it is a
  scaffold, not final copy — real templates are Phase 2).
- CI runner (GitHub Actions vs Vercel build step vs both) and how lint/typecheck are wired.
- Font loading strategy, given `design-system/fonts/` exists and D8 leaves the final typeface
  open.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project decisions and scope
- `.planning/PROJECT.md` — Key Decisions D1–D14, Constraints, Context. The condensed source of
  truth; **read this instead of the original `docs/` source material.**
- `.planning/ROADMAP.md` — Phase 1 goal + its 4 success criteria, and what belongs to Phases 2–6.
- `.planning/REQUIREMENTS.md` — REQ-nap-consistency (the only requirement mapped to Phase 1).

### Design system (the thing being integrated)
- `design-system/package.json` — package name `@bhc/design-system`, `"type": "module"`,
  exports map (`.`, `./tokens.css`, `./styles.css`), `test` script, React >=18 peer dep.
- `design-system/tokens.css` — locked colour/type/spacing tokens (D6, D11, D12).
- `design-system/styles.css` — base/reset and type layer.
- `design-system/src/index.js` — the package's public surface.
- `design-system/src/components/NAPFooter/NAPFooter.jsx` — the Lock 4 + Lock 5 mechanism, the
  `SITE` constant, and the emitted `HomeAndConstructionBusiness` JSON-LD.
- `design-system/src/components/NAPFooter/formatPhone.js` — why display cannot diverge from href.
- `design-system/test/locks.test.js` — the 8 tests that must run in CI.
- `design-system/src/components/*/*.prompt.md` — per-component intent; read before changing any
  component.

### Design contract
- `docs/design/design-system.md` §4 "The locks" — the 11 CI assertions, with the rationale for
  Lock 4's exact phrasing. §"Schema to emit" lists which schema goes where (Phase 5 scope, but
  NAPFooter already emits part of it today).

### Evidence
- `docs/research/seo-audit-2026-08-06.md` — the measured defects the rebuild exists to fix.
- `docs/research/current-site-sitemap-2026-08-06.xml` — canonical live URLs and domain.

</canonical_refs>

<specifics>
## Specific Ideas

- The NAP fix is architectural, not a content edit. The correct outcome is "the app has no way
  to express a footer whose href and display disagree," which `formatPhone.js` already
  guarantees. A plan that just types the right number into a template has not delivered
  REQ-nap-consistency.
- `design-system/` has no build step and no `dist/` in version control (`dist/` and `ds-bundle/`
  are gitignored, and `node_modules/` is absent from a fresh clone). Anything Phase 1 does must
  work from a clean checkout with no design-system build.
- The `test` script is `node --test test/*.test.js` — it needs no `node_modules` at all. Keep it
  that way; wiring it into CI should be a one-line invocation, not a toolchain.
- `assets/` and `design-system/fonts/` already exist in the repo — check them before adding any
  new font or image pipeline.
- **Known required package change (measured, not speculative).** `design-system/package.json`'s
  `exports` map does not expose `fonts/`, so `import '@bhc/design-system/fonts/fonts.css'` fails
  with `ERR_PACKAGE_PATH_NOT_EXPORTED` (surfacing as a Turbopack `Module not found`). Fix:
  add `"./fonts/*"` to `exports` and `"fonts"` to `files`. Verified in 01-RESEARCH.md — build
  succeeds, all 8 `.woff2` emit to `.next/static/media/`, lock tests stay 8/8. This is the one
  sanctioned edit to the package under D-05.
- **Import `styles.css` only.** It already pulls in `tokens.css`; importing both duplicates every
  token declaration.
- **`claude-seo` hook collision (real, will fire).** Its PostToolUse hook blocks `.jsx`/`.tsx`
  writes containing the case-insensitive substring `REPLACE` — which means any `.replace(` call,
  including the standard JSON-LD escaping idiom. Mitigation: keep string-manipulation logic in
  `.js` files, which is already this package's own convention (`formatPhone.js`, `geo.js`). Do
  not disable the plugin as a first resort.
- `.claude/worktrees/` is gitignored; work for this phase happens on branch
  `worktree-phase-1-platform-foundation`.

</specifics>

<deferred>
## Deferred Ideas

- **Domain cutover** — pointing `www.beyondhousecleaning.com` at Vercel and retiring Webflow.
  Deliberately not Phase 1; Phase 1 ships to a Vercel URL. No phase currently owns cutover —
  worth adding to the roadmap before Phase 5 completes.
- **The other 8 CI locks** (1, 2, 3, 6, 8, 9, 10, 11) — Phase 5.
- **The ~15 remaining components** — Phase 2.
- **Before/after photography** — blocked on Sam pulling originals from
  canva.com → Projects → Uploads. Not a Phase 1 concern at all; BeforeAfterSlider ships with a
  placeholder in Phase 2 and backfills in Phase 4.
- **Off-site citations, review generation, second GBP** — v2, see REQUIREMENTS.md.

</deferred>

<open_questions>
## Open — needs Sam (non-blocking)

1. **Confirm `+447861936533` is the number that actually reaches BHC.** It is the design
   system's default and what the live site displays, so it is the right default to build on —
   but the live site has been *dialling* a different number (`07441918832`) on all 115 pages,
   so which one customers have actually been reaching is not self-evident from the code.
   Non-blocking: the architecture is number-agnostic and changing it is a one-line constant
   change. Confirm before domain cutover, not before Phase 1 execution.

2. **Analytics.** Phase 1 ships with no tag manager or analytics by default (D-14). If GA4 /
   GSC / a lightweight analytics tool should be present from day one, say so — otherwise it
   gets added in a later phase under the 50 KB third-party rule.

3. **Vercel project — the one true external dependency.** No Vercel project exists for this
   repo yet. Success Criterion 1 ("deployed to Vercel and reachable at a live URL") cannot be
   satisfied by an agent alone: Sam must connect the repo to Vercel and set **Root Directory =
   the app directory**. This must appear in the plan as an explicit human checkpoint, not as an
   autonomous task. Every other Phase 1 success criterion is verifiable locally against the
   built HTML on disk with no browser and no deployment — so this gates exactly one criterion,
   and the rest of the phase can complete without it.

</open_questions>

---

*Phase: 01-platform-foundation-design-system-integration*
*Context derived 2026-08-08 from locked planning artifacts (no discuss-phase session run)*
