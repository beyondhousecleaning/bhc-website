---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: awaiting-human-checkpoint
stopped_at: 02-15-PLAN.md task 2 — blocking human-verify checkpoint (12 visual + keyboard checks)
last_updated: "2026-08-10T13:49:33.491Z"
last_activity: 2026-08-10
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 20
  completed_plans: 19
  percent: 17
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-08)

**Core value:** Every technical and content decision serves organic + Google Maps visibility for `cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and five new postcode areas (B, DY, TF, WS, WV).
**Current focus:** Phase 02 — component-library-completion-core-templates

## Current Position

Phase: 02 (component-library-completion-core-templates) — EXECUTING
Plan: 15 of 15 — PAUSED at a blocking human checkpoint
Status: 02-15 task 1 COMPLETE (all four Success Criteria proven against build output; `npm run verify`
        exit 0 at 20 + 31 tests; CI run 31385409769 green on branch head c68f520 for both required
        checks). 02-15 task 2 is a `checkpoint:human-verify` and has NOT been answered — the twelve
        visual and keyboard checks in 02-15-SUMMARY.md need Sam. The phase is NOT verified.
        `www.beyondhousecleaning.com` still on Webflow, untouched.
Last activity: 2026-08-10

Progress: [█████████░] 93%

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

### Pending Todos

None yet.

### Blockers/Concerns

- **Before/after photography (not a phase gate):** all 199 existing Canva exports are unusable
  (old logo burned in, ~530×690px recoverable, BEFORE/AFTER labels baked into the image). Sam
  needs to pull originals from canva.com → Projects → Uploads. Phase 2 ships BeforeAfterSlider
  with a placeholder state so this never blocks the critical path; Phase 4 backfills real photos
  once available. Re-check with Sam before Phase 4 starts.

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

## Session Continuity

Last session: 2026-08-10T13:49:33.491Z
Stopped at: 02-15-PLAN.md task 2 — blocking `checkpoint:human-verify`, 12 checks pending Sam
Resume file: .planning/phases/02-component-library-completion-core-templates/02-15-SUMMARY.md
