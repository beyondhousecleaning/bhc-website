---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: 03-03 complete (the domestic-cleaning 8x8 variant grid). npm run verify exit 0 at 21 + 39 tests, 19 routes, unchanged budget.
last_updated: "2026-08-13T12:28:00.250Z"
last_activity: 2026-08-13
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 44
  completed_plans: 24
  percent: 55
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-08)

**Core value:** Every technical and content decision serves organic + Google Maps visibility for `cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and five new postcode areas (B, DY, TF, WS, WV).
**Current focus:** Phase 03 — programmatic-location-service-engine

## Current Position

Phase: 03 (programmatic-location-service-engine) — EXECUTING
Plan: 4 of 24
Status: 03-03 COMPLETE — the first of the seven service-variant copy decks, in two commits
        (`a3aa922`, `8e2c986`). `web/content/variants/domestic-cleaning.js` exports `A_VARIANTS[8]`
        (service detail, 300-353 words each, one section heading + two paragraphs + one list) and
        `B_VARIANTS[8]` (how the job runs, 251-287 words each, one sub-heading + three paragraphs,
        no list). 4,798 authored words. The two axes are ORTHOGONAL by construction — A is eight
        subjects inside the house, B is eight stages of a visit — which is what keeps the 8x8 grid a
        grid. Measured: all-16 mean 5-gram Jaccard **0.0003** / worst 0.0158, and **TF-IDF cosine
        mean 0.0709**, which is the metric that actually detects paraphrase (a paraphrase deck sits
        at 0.736 there while passing the lexical gate at 0.05). Also measured against the six
        shipped `services.js` prose decks, worst 0.0088 — this is new prose, not recycled house
        copy, and that check caught two B passages drafted with `services.js`'s own examples. The
        plan's sibling sweep ran and reported `compared against 0 sibling deck(s)`: **vacuous, a
        legitimate pass, and NOT coverage** — 03-03 through 03-08 are wave-mates with no ordering,
        and 03-17 task 1 is the gate that actually holds over all 6,216 cross-deck pairs.
        `npm run verify` exit 0 at **21 + 39** tests, still **19** routes, JS unchanged at 129.8 KB,
        worst page 299.5 KB — identical to the 03-02 baseline in every figure, which is correct: no
        route imports this module yet. **No requirement was marked complete** (see the Decisions
        entry). Ready to execute 03-04.

        03-02 before it: `buildInterlinks` takes an optional `metaFor(destination, miles)` formatter
        defaulting to today's distance string; the geometry is published as a **`./geo` exports
        subpath** so a bare `node` process can import it without touching the barrel's `.jsx`; the
        review rail's default `<h2>` is now `What our customers say` in all four files; and
        `.bhc-jump-links`, `.bhc-town-group` (+ `__back`) and `.bhc-interlink + .bhc-interlink`
        exist as token-only classes above the focus-override banner. Three commits (`3ec4bf0`,
        `162a7c1`, `373c1fb`), no package installed, zero dependencies still.

        03-01 before that: Wave 0's lock-harness rewrite landed as one commit (`5120f5b`) against
        one build, taking the harness from 37 to 39 tests so the generated pages in waves 1+ cannot
        redden `main`.

        **STILL THE STANDING GATE — carried from Phase 2, not resolved by anything above:** 02-15
        task 2 is a `checkpoint:human-verify` and has NOT been answered — the twelve visual and
        keyboard checks in 02-15-SUMMARY.md still need Sam. Phase 2 is NOT verified (14/15), which
        is why `completed_phases` is 1 rather than 2.
        `www.beyondhousecleaning.com` still on Webflow, untouched.

        **02-16 (2026-08-11, no PLAN.md — Phase 4 work pulled forward at Sam's request):** eighteen
        real, verbatim Google reviews now render as server HTML on seven routes (six cards on `/`,
        three on each service page) from `web/content/reviews.js`. The withdrawn `Read Our Reviews`
        CTA is restored and resolves. Audit a3 and the content half of b5 are closed. `npm run
        verify` exit 0 at **20 + 37** tests (was 20 + 31); JS unchanged at 129.8 KB, worst page
        298.4 -> 299.4 KB. NOT yet pushed or CI-run at the time of writing — 02-15's checkpoint is
        still the phase gate.
        When re-running 02-15's twelve visual checks, note two are now different: the home page has
        a seventh band (the review rail, `warm`, between ProcessSteps and the FAQs) and the trust
        band has a `Read Our Reviews` action under it. Since 03-02 the rail's heading reads
        `What our customers say` rather than naming a county, on the home page and all six service
        pages.
Last activity: 2026-08-13

Progress: [██████░░░░] 55%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: - min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: n/a

*Updated after each plan completion*
| Phase 01 P01 | 4 | 3 tasks | 6 files |
| Phase 01 P02 | 6min | 3 tasks | 7 files |
| Phase 01 P03 | 8min | 3 tasks | 4 files |
| Phase 01 P05 | 65min | 2 tasks | 1 files |
| Phase 01 P04 | 20min | 3 tasks | 1 files |
| Phase 02 P01 | 32min | 3 tasks | 18 files |
| Phase 02 P02 | 25min | 3 tasks | 6 files |
| Phase 02 P04 | 30min | 2 tasks tasks | 19 files files |
| Phase 02 P05 | 15min | 2 tasks tasks | 19 files files |
| Phase 02 P06 | 22min | 2 tasks tasks | 6 files files |
| Phase 02 P07 | 41min | 3 tasks | 19 files |
| Phase 02 P08 | 45min | 3 tasks | 9 files |
| Phase 02 P09 | 6min | 2 tasks tasks | 5 files files |
| Phase 02 P10 | 38min | 3 tasks tasks | 19 files files |
| Phase Phase 02 PP11 | 15min | 2 tasks tasks | 2 files files |
| Phase 02 P12 | 55min | 3 tasks | 3 files |
| Phase 02 P13 | 52min | 3 tasks tasks | 3 files files |
| Phase 02 P15 | 18min | 1 of 2 tasks tasks | 0 files files |
| Phase 02 P16 | 95min | 5 tasks | 14 files |
| Phase 03 P01 | 34min | 3 tasks | 1 file |
| Phase 03 P02 | 41min | 3 tasks | 10 files |
| Phase 03 P03 | 41min | 2 tasks | 1 file |

## Accumulated Context

### Decisions

Full decision log (D1–D14, all locked) lives in `.planning/PROJECT.md` Key Decisions table.
Highlights a fresh session needs immediately:

- D5: Next.js on Vercel. D2: URL pattern `/location/<region>/<town>/<service>` preserved, zero
  redirects for the 95 existing pages; new `/locations`/`/locations/<town>` index/hub layer uses
  a different (plural) prefix to avoid collision.

- D4: no street address/postcode anywhere, ever (CI Lock #5).
- D14: canonical UK-vocabulary service taxonomy locked — 8 concepts, 4 slugs need 301s.
- The design-system package (`design-system/`) already exists: `tokens.css` + 6 built components
  (Button, Hero, Breadcrumbs, RatingBadge, NAPFooter, InterlinkBlock), 8 passing lock tests.
  Phase 1 integrates this, it does not design it.

- [Phase ?]: 01-01: safeJsonLd escapes < in all JSON-LD payloads; package-internal, deliberately NOT exported from design-system/src/index.js
- [Phase ?]: 01-01: design-system exports map now exposes wildcard ./fonts/* (not a single fonts.css entry) so the 8 sibling .woff2 files resolve through the package boundary
- [Phase ?]: 01-01: design-system lock suite is now 10 tests, not 8 — update any doc or CI job that hardcodes 8
- [Phase 01]: 01-02: repo is an npm workspace [web, design-system] with a committed root package-lock.json; @bhc/design-system resolves via symlink and needs no build step
- [Phase 01]: 01-02: the app passes NO phone prop to NAPFooter — the canonical +447861936533 stays single-sourced as the package default; that is what makes REQ-nap-consistency structural
- [Phase 01]: 01-02: CI gates in this project are plain substring greps over web/app, so explanatory comments must NOT contain the substring they describe (use client, tokens.css) — carry this into Plan 03's check script
- [Phase ?]: 01-03: CI gate lives in GitHub Actions, not the Vercel build — Root Directory sandboxing forbids .. traversal and a red preview does not block a merge (D-13)
- [Phase ?]: 01-03: actions/checkout and actions/setup-node pinned to v7 — majors confirmed at execution time; research assumption A2 said v4
- [Phase ?]: 01-03: enforcement code stays zero-dependency — node: built-ins only, no DOM parser, no size tool, no test framework beyond node:test
- [Phase ?]: 01-05: repo made PUBLIC (Sam, Route B) — GitHub Free gives a private personal repo neither branch protection nor rulesets, so this was the only zero-cost route to D-13; .planning/ and docs/research/ are now world-readable
- [Phase ?]: 01-05: main is gated by repository ruleset 20595020 (active, refs/heads/main, locks + build required, strict on, bypass_actors empty) — verify via rules/branches/main; branches/main/protection 404s and that is expected, not a failure
- [Phase ?]: 01-05: required status checks now gate direct pushes to main too, not just merges — a push whose head commit has not passed locks and build is rejected
- [Phase 01]: 01-04: Vercel project bhc-website (prj_JOjTPePirfNMQUshAioLkqXXBxXY) is LIVE at https://bhc-website-nine.vercel.app — Root Directory web, Node 22.x, framework-default build, NO custom domain; D-03 intact, apex still Webflow 198.202.211.1
- [Phase 01]: 01-04: D-09 CLOSED — Sam confirmed 2026-08-09 that +447861936533 IS the number that reaches BHC; no code change taken, and 07441918832 / +447575709361 stay retired and asserted-against at check-html-locks.mjs:86
- [Phase 01]: 01-04: Vercel Deployment Protection is ON (Standard, ssoProtection=all_except_custom_domains) — only the production alias bhc-website-nine.vercel.app is public (200); every generated/team/branch URL 302s to Vercel SSO, so no bypass token exists or is needed
- [Phase 01]: 01-04: Vercel POST /v11/projects REJECTS nodeVersion and defaults new projects to Node 24.x — the follow-up PATCH /v9/projects/{id} to 22.x is mandatory, not cosmetic; link.productionBranch stays main deliberately (main has no web/, so an accidental build from it fails and cannot take the alias)
- [Phase ?]: 02-01: explicitly-international phone values are exempt from toDial's national-length check — CR-04's no-fabricated-+44 guarantee depends on it
- [Phase 02]: 02-01: styles.css was the deviation, not UI-SPEC — .bhc-interlink__heading moves to --bhc-text-2xl, the settled <h2> size for all 16 new components
- [Phase 02]: 02-01: Button gains as?: ElementType despite not being one of the sixteen — UI-SPEC 13-J is scoped by 'link-bearing', not by 'new'
- [Phase 02]: 02-01: node cannot import .jsx in this repo — component behaviour checks must assert over built HTML or compile through Next's bundled SWC binding (transformSync takes source, isModule, Buffer)
- [Phase ?]: 02-02: RatingBadge.emitSchema is OFF on every Phase 2 template — the bare badge satisfies Lock 3 and 17 orphaned AggregateRating nodes would worsen the deferred CR-05
- [Phase ?]: 02-02: Dormant locks are gated and assert the INVERSE (INTERLINK_LOCK_ACTIVE, NO_RATING_YET, NO_PRIMARY_CTA_YET) so the plan that should re-enable them finds the build red
- [Phase ?]: 02-02: The tel: cap is 4 per page, not 3 — QuoteFormEntry's fallback is the fourth link; exactly one tel: inside <footer> remains the real NAP invariant
- [Phase ?]: 02-02: The budget gates on the modern noModule-excluded JS figure and reports the legacy polyfill separately (WR-06); page weight is gzip JS + gzip HTML + gzip CSS + raw woff2 (WR-05)
- [Phase ?]: 02-04: ProcessSteps wraps its list in a <section> when a heading is passed — an <ol>'s content model is li/script/template only, so a heading inside it is hoisted out and takes the counter-reset with it
- [Phase ?]: 02-04: the two scoped focus overrides are the LAST section of design-system/styles.css — every later plan appends its component block above the banner, never below it
- [Phase ?]: 02-04: .bhc-section__intro sets --bhc-ink-muted directly, which is 1.10:1 on navy — it now flips to --bhc-paper on .bhc-section--navy; run the same direct-colour check over TrustBar, ReviewCard and StickyCallBar
- [Phase ?]: 02-04: Prose width='narrow' maps to --bhc-container-narrow (800px), which is WIDER than the 68ch default measure — the locked token set allows no other mapping; Phase 5 should rename the prop
- [Phase ?]: 02-05: a whole-card link is ONE anchor plus a stretched ::after, never a wrapper link — an <a> may not contain interactive content, so a wrapper plus a title link is parsed into two sibling links
- [Phase ?]: 02-05: lightningcss emits ::after as the single-colon :after in built CSS — measured; no lock may grep built CSS for the double-colon form
- [Phase ?]: 02-05: when a CI grep polices a token, the full explanation goes in the .prompt.md (no scanner reads it) and the .jsx says only that the thing is absent — FAQAccordion names the schema type in neither .jsx nor .html
- [Phase ?]: 02-05: QuoteFormEntry's tel: label is built as ONE string, not interpolated — delta 2(d) reads rendered text content and a serialiser can separate adjacent text nodes mid-number
- [Phase ?]: 02-05: the SWC probe must await loadBindings() before transform() — getBindingsSync() throws 'bindings not loaded yet'; this is the third plan blocked by node having no JSX loader
- [Phase 02]: 02-06: web/content IS genuinely reached by the client-directive scan — proven, a scratch file there turned check:html red at SC-4g test 24, then reverted
- [Phase 02]: 02-06: AREA_SERVED and HOURS are named exports in web/content/site.js — plan 02-13 MUST thread them through Footer to NAPFooter or 18 pages silently lose areaServed City nodes with a fully green CI
- [Phase 02]: 02-06: the Services NavItem carries NO href — /services 404s (delta 6) and a child's href would duplicate in the DOM (02-10); 02-10 renders a childed NavItem as a <summary> and never emits its href anyway
- [Phase 02]: 02-06: the SWC probe also needs jsc.transform.react.runtime='automatic' — without it SWC emits React.createElement and the module throws 'React is not defined'; this is the FOURTH plan blocked by node having no JSX loader
- [Phase 02]: 02-06: two UTILITY titles overrun Lock 8's 60-char cap when the h1 is reused verbatim — /about-us 61, /contact-us 62; plan 02-11 owns the fix (a shorter title subject, NOT a shorter h1); recorded in titleFor's JSDoc
- [Phase ?]: 02-07: ReviewCard stars inherit --bhc-ink, not RatingBadge's orange: --bhc-action on --bhc-paper-tint measures 2.68:1 (fails 1.4.11's 3:1 for a meaningful graphic); --bhc-ink is 13.85:1
- [Phase ?]: 02-07: BeforeAfterSlider never returns null — the pending state with data-bhc-photo-state is ROADMAP SC-3, and it is the one empty-data component in the package that renders more rather than nothing
- [Phase ?]: 02-07: a focusable scroll track (tabindex=0 + role=group + aria-label) is correct only while it holds nothing focusable — ReviewRail depends on ReviewCard having no link, and BeforeAfterSlider keeps its one link outside the track in the figcaption
- [Phase ?]: 02-07: delta 14's extractor reads raw source, so an explanatory comment naming the defective SVG form fails the file it explains — sixth scanner self-collision this phase, and the first inside a component header comment
- [Phase ?]: 02-07: delta 9 now covers EIGHTEEN component directories, not the twelve the 02-07 plan's criterion carried forward — 02-14 should raise the preview floor against the real number
- [Phase ?]: 02-08: utility titles that overrun Lock 8 are fixed with a shorter title SUBJECT, never a shorter <h1> — the <h1>s are Success Criterion 2 copy
- [Phase ?]: 02-08: /customer-login and /gift-cards outbound hrefs default to the LIVE SITE's own page for that route — no portal or provider URL exists anywhere in the repo; both MUST be swapped before cutover or each becomes a link to itself, and delta 6 never inspects an absolute URL
- [Phase ?]: 02-08: NO_PRIMARY_CTA_YET is down to /_not-found — the self-restoring inverse fired exactly as designed when /get-a-quote gained QuoteFormEntry's primary Button; 02-13 owns the last entry
- [Phase ?]: 02-08: the ninth and tenth scanner self-collisions — an illustrative street line and the three banned CTA phrases both failed the greps their own comments explained; explanations must describe a banned shape, never instance it
- [Phase 02]: 02-09: the three legal routes are in NO_PRIMARY_CTA_YET, not given a CTA — UI-SPEC 9.4 forbids the CTABand and SC-4e demands a primary Button, and nothing sitewide supplies one until 02-13 composes Header; 02-13 now empties FOUR entries, not one
- [Phase 02]: 02-09: all ten UI-SPEC 5 utility routes now prerender — the footer Legal row cannot point at a 404 when 02-13 renders the Footer; 13 routes in the manifest, all static
- [Phase 02]: 02-09: the satisfaction promise now lives in THREE places (process.js step 3, legal.js SATISFACTION, TrustBar's third claim) and all three move together on UI-SPEC 14-1; legal.js keeps a literal rather than importing process.js, so the agreement can diverge later
- [Phase 02]: 02-09: the legal retention periods, cancellation notice and late-cancellation charge are conservative defaults nobody has signed off — each is one string in web/content/legal.js; confirm with Sam and get a solicitor read before cutover
- [Phase ?]: 02-10: Footer forwards areaServed and hours UNDEFAULTED — an omission must produce JSON-LD with no areaServed key (visible) rather than a list the component invented (unfindable)
- [Phase ?]: 02-10: Footer takes NO 'as' prop despite UI-SPEC 7.2 — it renders no anchors, so the prop could only be dropped silently; the substitution point is NAPFooter, and omitting it makes a typed caller's mistake a compile error
- [Phase ?]: 02-10: Footer filters 'legal' and 'social' as well as 'columns' — NAPFooter maps those two UNGUARDED (NAPFooter.jsx:131 and the sameAs map), so those filters are the only thing between a null entry and a 500 on all 18 pages
- [Phase ?]: 02-10: Header's phone + CTA show from 768px, not UI-SPEC 7.1's 1024px — StickyCallBar leaves at exactly 768px, so a literal reading left 768-1023 with no one-tap call action; the two are now exactly complementary
- [Phase ?]: 02-10: all sixteen Phase 2 components now exist — delta 9 walks TWENTY-TWO component directories and both .design-sync maps hold 22 keys; 02-14 should raise the previews floor against that number
- [Phase ?]: 02-10: the fifth consecutive plan blocked by node having no JSX loader — the SWC probe (await loadBindings, jsc.transform.react.runtime='automatic', .jsx specifiers rewritten to .js) is now the standing route for any component-behaviour criterion
- [Phase ?]: 02-11: Home's band sequence measured on the built markup half is paper -> warm -> paper -> tint -> paper -> navy; Hero is bhc-hero, NOT a bhc-section, so its paper-warm ground sits outside the modifier list and the sequence correctly opens on paper
- [Phase ?]: 02-11: a null-rendering component gets NO SectionBand wrapper — banding ReviewRail would emit a headless empty section and put two paper grounds adjacent until Phase 4; rendered bare it contributes nothing and still needs no template change when the data lands
- [Phase ?]: 02-11: home.js owns section headings, CTA labels AND metadata, not just body copy — page.jsx carries no copy literal at all, which is what keeps the claude-seo .jsx substring ban from ever binding on a template
- [Phase ?]: 02-11: check:html is 29/30 until 02-12 lands — delta 6 fails on the six /services/* hrefs by design (wave-mate dependency stated in the plan objective); PAGE_EXPECTATIONS already holds all six entries, so no harness change is needed, only the routes
- [Phase ?]: 02-11: ROADMAP SC-3 is now demonstrably satisfied — data-bhc-photo-state="pending" renders exactly once on /, and the same attribute is Phase 4's machine-readable hand-off when it backfills real pairs
- [Phase ?]: 02-12: the six service pages ship as ONE dynamic SSG route plus one data module, not six directories — which is what makes UI-SPEC 13-C's deferral of the canonical-slug rename to Phase 3 a data change rather than a template change
- [Phase ?]: 02-12: SC-4g's count tripwire now measures built page.js route ENTRIES, not prerendered pages — Next emits one client-reference manifest per entry, so the old comparison failed on any generateStaticParams route and would have under-counted by ~330 in Phase 3
- [Phase ?]: 02-12: the service BeforeAfterSlider band takes tone warm rather than UI-SPEC 9.3's summary-listed paper — with the prose band on paper they would be two identical adjacent grounds, which section 4 forbids
- [Phase 02]: 02-13: the layout renders Footer and NEVER the footer component it wraps — grep -c NAPFooter web/app/layout.jsx must stay 0, or two <footer> landmarks ship on all 18 pages
- [Phase 02]: 02-13: AREA_SERVED and HOURS are threaded through Footer from web/content/site.js — all four areaServed City nodes verified INSIDE the JSON-LD block on all 18 pages (a page-wide includes() would pass falsely, Warwick is a substring of Warwickshire)
- [Phase 02]: 02-13: NO_RATING_YET and NO_PRIMARY_CTA_YET are now EMPTY sets, kept rather than deleted — every app page is held to the positive SC-4c/SC-4e lock; a route may be added back only with a spec clause naming it
- [Phase 02]: 02-13: EXPECTED_APP_ROUTES is 18 and is the ONLY guard against a route silently opting into dynamic rendering — it then leaves prerender-manifest.json and every assertion, so the suite would go green by having less to check; Phase 3 must grow it with every route it adds
- [Phase 02]: 02-13: delta 8 counts data-bhc-photo-state="pending" by splitting on the full attribute=value string — the BARE attribute name is inflated by the RSC flight payload (measured 2 vs 1), same trap as bare class names
- [Phase 02]: 02-13: /get-a-quote and /customer-login now sit EXACTLY on the tel: cap of four — Header + StickyCallBar + footer is three on every page, so there is no headroom for a fifth tel: anywhere
- [Phase 02]: 02-13: Next 16 emits a hidden <div hidden> Suspense preamble as the first child of <body>, so 'skip link is first in body' is false on a correct build — assert 'first FOCUSABLE element', which is what WCAG 2.4.1 requires
- [Phase ?]: 02-15: the phase-start budget baseline is NOT comparable to the phase-end figure — WR-06 removed the 38.7 KB noModule polyfill from the JS number and WR-05 added raw woff2 to the page number, both inside Phase 2; the app's modern JS is unchanged from the one-page scaffold
- [Phase ?]: 02-15: all four ROADMAP Phase 2 Success Criteria proven against build output — 22 four-file components, 18 static app routes each with exactly one h1 (incl. the four previously-headless utility pages), data-bhc-photo-state=pending on exactly 7 pages with two labelled role=img panels, and zero FAQPage occurrences while closed FAQ answers still ship in the HTML
- [Phase ?]: 02-15: CI run 31385409769 is green on branch head c68f520 for BOTH required checks (locks 6s, build 20s); ruleset 20595020 re-read live — active, contexts exactly [locks, build], strict true, bypass_actors empty
- [Phase 02]: 02-16: the review aggregate is the PUBLISHED 4.9/175, never recomputed — the 166 extracted reviews average 4.98 because the widget only carries reviews that HAVE comment text, so a recomputed mean overstates the rating against what Google shows; REVIEW_AGGREGATE re-exports site.js RATING so there is still exactly one of it
- [Phase 02]: 02-16: the 320-char quote cap is honoured by SELECTION, not truncation — every shipped quote already fits (271 max, 90 min), so a whole review reaches each card and no ellipsis is ever authored; that excluded the only review naming a town
- [Phase 02]: 02-16: review text is quoted VERBATIM including typos and doubled spaces; the only repair was re-decoding the extract as UTF-8 (it had been read a byte at a time), and surnames are cut to an initial per the shipped ReviewCard.d.ts author contract — no date and no town exist in the payload, so ReviewCard.d.ts `date` became optional rather than eighteen fabricated months shipping
- [Phase 02]: 02-16: a null-rendering component gets no SectionBand; a CONTENT-rendering one does — ReviewRail is now banded `warm` on all seven rail routes, giving Home `paper warm paper tint warm paper navy` and each service page `paper warm tint warm paper navy`; `warm` twice is fine, §4's rule is adjacency not frequency
- [Phase 02]: 02-16: RatingBadge built `from {count} {source} reviews` from ADJACENT JSX CHILDREN, which React serialises as five text nodes with `<!-- -->` markers between them — the phrase rendered correctly and existed nowhere contiguously in the served bytes; any phrase a lock or a crawler must find has to be assembled in JS first
- [Phase 02]: 02-16: check:html is now 37 tests, not 31 — SC-4h (review prose extracted from the MARKUP HALF, ≥40 chars, counted per route via the new `reviewCards` field in PAGE_EXPECTATIONS), SC-4i (the figure contiguous in HTML and present in every meta description; NO_META_DESCRIPTION={/_not-found} asserted in the inverse) and delta 15 (every in-page anchor resolves to an id on its own page)
- [Phase 02]: 02-16: delta 6 only ever resolved hrefs beginning with a slash, and that gap is the SOLE reason UI-SPEC §5 revision 1 deleted the `Read Our Reviews` CTA — delta 15 closes it, and the CTA is restored with its label and href authored in reviews.js beside the constant the rail's id is built from
- [Phase 02]: 02-16: `.bhc-section__action` is a plain class in SectionBand's CSS block (the .bhc-service-card__grid arrangement), NOT an `actions` prop — a band that carries its own CTA is a second, weaker CTA surface on all 18 call sites, competing with CTABand above the footer
- [Phase 02]: 02-16: UI-SPEC §5 gained a Revision 2 note, §7.14 was rewritten and §13-P is struck through as REVERSED — the spec had said the CTA was withdrawn and Phase 4 would supply the data, both now false and both would have misinformed Phase 3 planning
- [Phase 02]: 02-16: twelfth avoided scanner self-collision — the CTA label lives in reviews.js (no grep polices it) precisely so home.js can explain the restoration without instancing the string its own acceptance check greps for
- [Phase ?]: 03-01: the lock harness classifies routes by template rule, not by route literal — expectationsFor keeps its signature and its throw, with the 20-entry literal keeping precedence so hand-authored copy is still asserted verbatim
- [Phase ?]: 03-01: MIN_APP_ROUTES is a hard-coded integer (18 today) and is never derived from PUBLISHED_TOWNS or any content module — a floor computed from the code it guards asserts only that the code agrees with itself. Raised by the plan that lands routes: batch 1 = 167, full rollout = 426
- [Phase ?]: 03-01: INTERLINK_LOCK_ACTIVE was deleted and replaced by a per-template requirement plus a self-restoring INTERLINK_PENDING set (7 routes), NOT flipped to true — under true the lock asserts n >= 1 on every app page and reddens 12 correct pages. Plan 03-19 empties the set, 03-23 asserts it empty
- [Phase ?]: 03-01: EXPECTED_METADATA_ROUTES is empty and asserted equal to the built metadata routes in both directions — Phase 5 adds the sitemap route string to it in the same commit as app/sitemap.js, or the build goes red rather than silently unasserted
- [Phase 03]: 03-02: the design-system publishes a `./geo` exports subpath pointing at the plain .js geometry — the barrel routes those functions through InterlinkBlock.jsx, so `.` cannot be imported by bare node; a lock asserts the target's exact path AND its extension, because a .jsx target still resolves inside Next and breaks only outside it
- [Phase 03]: 03-02: buildInterlinks takes an optional metaFor(destination, miles) whose default is today's distance string — the geography belongs in the ORDERING (which is all SC-4 requires) and call sites at page scale return the destination's COUNTY; returning undefined suppresses the line, since InterlinkBlock renders the meta span only when truthy
- [Phase 03]: 03-02: ReviewRail's default heading is `What our customers say` SITEWIDE and names no county — no review in the data carries a town and none may be invented one (02-16), so a county is a claim the data cannot support and is false outside Warwickshire; the `town` prop is kept but passed by NO template (§13-J), so Phase 4's decision stays a data change rather than a breaking API change
- [Phase 03]: 03-02: the three new CSS classes declare `min-height: 44px` outright — --bhc-text-sm is a clamp whose mobile end plus a --bhc-space-2 pad computes to 42.9px, which looks like it clears the 44 × 44 target and does not; .bhc-jump-links applies its flex row to itself AND to a nested ul so the class works on the nav or on the list
- [Phase 03]: 03-02: the state SDK's write verbs are still unsafe on this project — `state.record-metric` alone flipped `status` to completed, `completed_phases` to 2 and `percent` to 33, and doubled the words in the row it appended; every STATE.md field here was repaired by hand and the metric row rewritten
- [Phase 03]: 03-03: the variant-deck module header states the block shape in words rather than in block literals - a conventional block-shape comment would take the h2/h3 grep counts to 9 and the h1 count to 1, failing the three greps that police it
- [Phase 03]: 03-03: the seven variant decks measure distinctness with BOTH metrics - 5-gram Jaccard is lexical and cannot see paraphrase (a paraphrase deck measures 0.05 and passes), TF-IDF cosine can (the same deck measures 0.736); domestic-cleaning lands at 0.0709 mean
- [Phase 03]: 03-03: a vacuous sibling sweep is recorded as vacuous, never as coverage - the wave-1 variant plans have no ordering between them, so 'compared against 0 sibling decks' is a legitimate pass that proves nothing; each deck therefore also measures against the six shipped services.js prose decks, which IS non-vacuous (worst 0.0088)
- [Phase 03]: 03-03: no requirement marked complete by a copy-deck plan - 20 of phase 03's 24 plans claim REQ-content-depth-bar and REQ-programmatic-page-scale, both of which are measurements over built HTML and a route count; the plan that lands batch 1's routes owns them
- [Phase 03]: 03-03: CONFIRMED REPEAT of 03-02's finding — the state SDK's write verbs corrupt this STATE.md every time. `state.update-progress` flipped `completed_phases` 1 -> 2 (Phase 2 is unverified at 14/15) and `percent` 52 -> 33 while writing 55% into the body bar; `state.advance-plan` replaced the Status line and orphaned the whole narrative under it; `state.record-metric` and `state.add-decision` reject positional args and need `--phase/--plan/--duration/--summary` flags, and add-decision labels an entry `[Phase ?]` without `--phase`. All four fields repaired by hand, both times. Any future executor should diff STATE.md against a snapshot after every SDK write rather than trusting the handler's own JSON

### Pending Todos

None yet.

### Blockers/Concerns

- **Before/after photography (not a phase gate):** all 199 existing Canva exports are unusable
  (old logo burned in, ~530×690px recoverable, BEFORE/AFTER labels baked into the image). Sam
  needs to pull originals from canva.com → Projects → Uploads. Phase 2 ships BeforeAfterSlider
  with a placeholder state so this never blocks the critical path; Phase 4 backfills real photos
  once available. Re-check with Sam before Phase 4 starts. **This is now the ONLY Phase 4 item
  still stubbed** — 02-16 closed the reviews half on 2026-08-11.

- **Refreshing the reviews (not a blocker):** `reviews_raw.json` was a build input and has been
  deleted. Re-extracting from the widget payload is the route to newer reviews. The 4.9 / 175
  aggregate is a SEPARATE, manually verified figure in `web/content/site.js` and must not be
  recomputed from whatever that extract contains — see 02-16-REVIEWS-SUMMARY.md for the arithmetic.
  Fabricated or embellished review text is a banned practice under the DMCC Act 2024.

- **Fresh-session handoff:** this roadmap was produced for a new Opus 5 session to execute.
  PROJECT.md's Context section is the condensed version of 5 source docs
  (`docs/goals.md`, `docs/design/design-system.md`, `docs/brand/brand-brief.md`,
  `docs/brand/photo-spec.md`, `docs/research/seo-audit-2026-08-06.md`) — read PROJECT.md +
  ROADMAP.md + REQUIREMENTS.md first; only fall back to `.planning/intel/` source files if a
  specific detail is missing.

- **claude-seo plugin hook:** `PostToolUse` on `.jsx/.tsx/.html/...` writes blocks (exit 2) on the
  case-insensitive substring `REPLACE`. Watch for false positives during schema/copy work
  (e.g. legitimate text containing "replacement"); `claude plugin disable claude-seo` if it
  becomes a problem.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Ops (off-site) | OPS-01/02/03 — GBP citation building, review-generation system, dedicated local-SEO project skill | v2, tracked in REQUIREMENTS.md | Initial roadmap, 2026-08-08 |
| Map-pack expansion | EXPAND-01 — second staffed premises/GBP for B/DY/TF/WS/WV | v2, tracked in REQUIREMENTS.md | Initial roadmap, 2026-08-08 |
| Content (post-cutover) | BATCH-02..05 — town + hub prose for the 37 towns outside batch 1, ~29,400 authored words (~800/town). `PUBLISHED_BATCHES` cannot be incremented without it: `towns.js`'s prose-coverage guard fails at module load. No phase owns it; it is post-cutover work paced by the 2-4 week indexation interval SC-5 requires. | Backlog, not in the v1 roadmap | Phase 3 planning, 2026-08-11 |

## Session Continuity

Last session: 2026-08-13T12:28:00.239Z
Stopped at: 03-03 complete (the domestic-cleaning 8x8 variant grid: A_VARIANTS[8] + B_VARIANTS[8],
            4,798 authored words, TF-IDF cosine mean 0.0709). npm run verify exit 0 at 21 + 39
            tests, 19 routes, budget unchanged at 129.8 KB JS / 299.5 KB worst page. Two commits,
            one new file, no package installed, zero dependencies still. No requirement marked
            complete. The sibling sweep was vacuous (0 sibling decks) and is recorded as such.
            Phase 2's 02-15 task 2 remains an open blocking `checkpoint:human-verify` — 12 checks
            pending Sam, three of which have now changed under them (the review band, the
            `Read Our Reviews` action, and the rail's heading). The branch is not pushed.
Resume file: None
