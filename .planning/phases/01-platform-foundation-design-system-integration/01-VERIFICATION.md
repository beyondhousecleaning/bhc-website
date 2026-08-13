---
phase: 01-platform-foundation-design-system-integration
verified: 2026-08-09T14:30:45Z
status: human_needed
score: 4/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open https://bhc-website-nine.vercel.app in a desktop browser, then in a mobile browser (or DevTools device emulation at 375px)."
    expected: "The page looks like a coherent BHC page: Figtree/Public Sans render (not a system fallback), the breadcrumb trail sits above the hero, the hero heading 'Deep Cleaning in Warwick' is the visually dominant element, the 4.9/175 rating badge is legible on the warm band, the interlink list is a readable list of three service links, the 'Get a Free Quote' button is a filled primary button, and the footer NAP block sits at the bottom. Nothing overlaps, nothing is unstyled, no horizontal scroll at 375px."
    why_human: "SC-4 says the five components must 'render correctly'. Grep proves the markup, class hooks, server-rendered JSON-LD, all 61 design tokens and all 8 woff2 files are present and served (all verified below), but only a human eye can confirm the composed result is visually correct rather than merely structurally present. ROADMAP marks this phase 'UI hint: yes'."
  - test: "Tap the footer phone number '+44 7861 936533' on a real mobile handset."
    expected: "The dialler opens pre-filled with +44 7861 936533 and, if dialled, reaches Beyond House Cleaning."
    why_human: "The digit-equality between label and href is machine-verified on the live HTML. That the number physically reaches the business is Sam's confirmation (recorded in 01-04) and cannot be re-derived from code. This is a one-tap confirmation that closes D-09 on the real device path rather than on the string."
deferred:
  - truth: "The scaffold page links to /get-a-quote, /locations and three /location/<region>/<town>/<service> URLs, all of which return 404 on the live deployment."
    addressed_in: "Phase 2 and Phase 3"
    evidence: "Phase 2 SC-2: 'Home, all 6 Service pages, and all ~8 Utility pages render on the new site'. Phase 3 SC-2: '/locations, /locations/<town>, and /location/<region>/<town>/<service> all resolve — no 404s'."
  - truth: "robots.txt disallows all crawling, which conflicts with the eventual production requirement that it allow crawling."
    addressed_in: "Phase 5 (and the cutover it implies)"
    evidence: "Phase 5 SC-4: 'robots.txt allows crawling (User-agent: * present)'. The conflict is deliberate and documented in web/public/robots.txt's EXPIRY note — the two apply to different hosts (pre-cutover Vercel URL vs production apex)."
  - truth: "Only 3 of the 11 design-system CI locks are implemented; the performance budget is measured but is not yet a phase criterion."
    addressed_in: "Phase 5"
    evidence: "Phase 5 SC-2: 'All 11 docs/design/design-system.md CI locks pass in the build pipeline'. Phase 5 SC-3 owns the JS/page budget on a representative combo page."
  - truth: "RatingBadge's AggregateRating attaches to an anonymous LocalBusiness node rather than to the #business entity NAPFooter emits."
    addressed_in: "Phase 5"
    evidence: "Phase 5 SC-1: 'LocalBusiness+areaServed (no streetAddress), Organization+sameAs, WebSite, Service+areaServed, BreadcrumbList, and AggregateRating (entity-graph only) are all present in server-rendered HTML on the correct pages'."
---

# Phase 1: Platform Foundation & Design System Integration — Verification Report

**Phase Goal:** The Next.js site is live on Vercel with the existing design system wired in, and the sitewide NAP bug is permanently fixed from day one.
**Verified:** 2026-08-09T14:30:45Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

Truths are the four ROADMAP Success Criteria (the contract). Plan frontmatter must_haves were
merged in; they add detail (D-01…D-15) but subtract nothing. All evidence below was re-derived
by this verifier — no SUMMARY.md claim was accepted as evidence.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A Next.js app is deployed to Vercel and reachable at a live URL, built from `design-system/tokens.css`. | ✓ VERIFIED | `https://bhc-website-nine.vercel.app` → HTTP 200, 23,513 bytes. Live CSS bundle `/_next/static/immutable/chunks/44r6a9z031y91.css` (12,095 bytes) contains **all 61** custom properties declared in `design-system/tokens.css` — **0 missing** — and `--bhc-ink:` appears **exactly once** (proves one unforked token layer, not a duplicated import). 8 `@font-face` rules present; all 8 woff2 files fetch **200** from `/_next/static/immutable/media/`, proving Plan 01's `./fonts/*` exports-map fix works end-to-end on the wire. Workspace linkage is a real symlink: `node_modules/@bhc/design-system -> ../../design-system`. |
| 2 | Every rendered page uses a single shared NAPFooter showing exactly one phone number, and the `tel:` link's digits match the displayed digits exactly — no street address or postcode anywhere. | ✓ VERIFIED | Against the **live raw HTTP body, no JS executed**: exactly **1** `<footer>`; exactly **1** `href="tel:"` = `tel:+447861936533`; label `class="bhc-footer__phone"` = `+44 7861 936533`; digit comparison `447861936533 == 447861936533` → **equal**. Full NAP block present: name `Beyond House Cleaning`, area `Serving Warwickshire, Coventry and the West Midlands`, hours `Mon–Sat, 8am–7pm`. Absent: UK-postcode regex → **no match**; `streetAddress` → absent; `"address"` → absent; both retired numbers (`07441918832`, `447575709361`) → absent. Structurally: `NAPFooter` is rendered once, in `web/app/layout.jsx:65`, with **no `phone` prop** — the number exists in exactly one place, `NAPFooter.jsx:34`. See WARNING W-1 on the residual robustness limit. |
| 3 | The design-system's existing lock tests (`design-system/test/locks.test.js`) run as part of this project's build/CI pipeline. | ✓ VERIFIED | Not just "run" — **run and gate**, on three independent proofs. (a) CI run `31317680021` logs show the `locks` job executing `node --test design-system/test/*.test.js` and emitting per-test TAP (`ok 1 - Lock 4: display string is derived from the dial string`, …). (b) The red/green pair is real: run `31279674172` (probe commit `bc965a3`) concluded **failure** and I confirmed the failing job was `locks` specifically (`locks failure / build success`); run `31279722315` on the revert `b73d78f` concluded **success**. (c) Enforcement is binding: ruleset `20595020`, `enforcement: active`, `target: branch`, `include: [refs/heads/main]`, contexts `locks` + `build`, `strict_required_status_checks_policy: true`, `bypass_actors: []`. Probe file confirmed removed — `design-system/test/` contains only `locks.test.js`. Locally `npm run test:locks` → **10/10 pass, exit 0**. See WARNING W-2 on fail-open fragility. |
| 4 | Hero, Breadcrumbs, RatingBadge, InterlinkBlock and Button render correctly from the design-system package on at least one real page (proof of integration, not just import). | ✓ VERIFIED (pending visual human check) | All six markers present in the **live** server-rendered body with no JS: `bhc-hero__heading`, `bhc-breadcrumbs__list`, `bhc-rating__value`, `bhc-interlink__list`, `bhc-btn--primary`, `bhc-footer__phone`. Exactly **1** `<h1>`. **3** `application/ld+json` blocks on the wire — `BreadcrumbList`, `LocalBusiness`+`AggregateRating`, `HomeAndConstructionBusiness` — parsed and validated as JSON by this verifier. `use client` absent from both `web/app/**` and the built HTML, so these are genuine RSC renders and not a hydration payload. Components are substantive, not stubs (Hero 97 / NAPFooter 125 / RatingBadge 81 / Breadcrumbs 69 / Button 67 / InterlinkBlock 64 lines) and all are exported from the package barrel `design-system/src/index.js`. Visual correctness routed to human verification. |

**Score:** 4/4 truths verified

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|--------------|----------|
| 1 | Scaffold page links to `/get-a-quote`, `/locations` and 3 `/location/...` URLs — all confirmed **404** live | Phase 2, Phase 3 | Phase 2 SC-2 (Home/Service/Utility pages); Phase 3 SC-2 ("all resolve — no 404s") |
| 2 | `robots.txt` disallows all crawling | Phase 5 / cutover | Phase 5 SC-4 ("robots.txt allows crawling"); conflict is deliberate and documented in the file's EXPIRY note — different hosts |
| 3 | Only 3 of 11 CI locks implemented; budget not yet a phase criterion | Phase 5 | Phase 5 SC-2 ("All 11 … CI locks pass"), Phase 5 SC-3 (budget on a representative combo page) |
| 4 | `AggregateRating` on an anonymous `LocalBusiness` node, not `#business` | Phase 5 | Phase 5 SC-1 (full entity graph, "AggregateRating (entity-graph only)") |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `design-system/src/jsonLd.js` | `safeJsonLd` escaping helper | ✓ VERIFIED | Exists, 26 lines, exports `safeJsonLd`; escapes `<` → `<`. Lossless round-trip proven by locks.test.js:172 |
| `design-system/package.json` | exports map exposing `./fonts/*` | ✓ VERIFIED | `"./fonts/*": "./fonts/*"` present; `files` includes `fonts`. Proven live: 8/8 woff2 serve 200 |
| `design-system/test/locks.test.js` | 10 lock assertions incl. 2 JSON-LD escape locks | ✓ VERIFIED | 10/10 pass locally and in CI; both `safeJsonLd` locks present (lines 164, 172) |
| `package.json` (root) | npm workspace + verify scripts | ✓ VERIFIED | `workspaces: ["web","design-system"]`; `verify` chains test:locks → build → check:html → check:budget |
| `package-lock.json` | committed lockfile | ✓ VERIFIED | Present, 31,451 bytes; `npm ci` succeeds in every CI `build` job |
| `web/next.config.mjs` | `transpilePackages` | ✓ VERIFIED | `transpilePackages: ['@bhc/design-system']` |
| `web/app/layout.jsx` | single CSS import site + single NAPFooter | ✓ VERIFIED | 72 lines; imports `fonts/fonts.css` + `styles.css` (never `tokens.css` directly); one `<NAPFooter>`, no `phone` prop; `robots: {index:false, follow:false}` |
| `web/app/page.jsx` | proof-of-integration page | ✓ VERIFIED | 83 lines; renders all 5 remaining components with real props |
| `web/public/robots.txt` | D-15 crawl block | ✓ VERIFIED | `User-agent: *` / `Disallow: /`, served verbatim at the live `/robots.txt` |
| `web/scripts/check-html-locks.mjs` | 18 built-HTML assertions | ✓ VERIFIED | 213 lines, zero third-party imports; **18/18 pass** when I ran it |
| `web/scripts/check-budget.mjs` | gzip transfer-weight gate | ✓ VERIFIED (see W-3) | 83 lines; measured 168.5 KB JS / 500 KB and 191.3 KB page / 1024 KB; I confirmed **6/6** script tags resolve on disk today |
| `.github/workflows/ci.yml` | two-job gate | ✓ VERIFIED | 64 lines; `locks` (zero-install) + `build` jobs; both are required status checks on `main` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `NAPFooter.jsx` | `jsonLd.js` | `safeJsonLd(schema)` | ✓ WIRED | import line 25, call line 119 |
| `Breadcrumbs.jsx` | `jsonLd.js` | `safeJsonLd(schema)` | ✓ WIRED | import line 15, call line 63 |
| `RatingBadge.jsx` | `jsonLd.js` | `safeJsonLd({…})` | ✓ WIRED | import line 16, call line 62. **Zero** bare `JSON.stringify` remains in any `dangerouslySetInnerHTML` |
| `web/app/layout.jsx` | `@bhc/design-system/styles.css` | global CSS import | ✓ WIRED | line 38; `tokens.css` deliberately not imported directly, and the `--bhc-ink`-once lock proves no double import |
| `web/app/layout.jsx` | `@bhc/design-system/fonts/fonts.css` | global CSS import | ✓ WIRED | line 37; 8 `@font-face` in the live bundle, 8/8 assets 200 |
| `web/app/layout.jsx` | `NAPFooter` | rendered once, no `phone` prop | ✓ WIRED | line 65; 1 `<footer>` live |
| `web/app/page.jsx` | `@bhc/design-system` | barrel import | ✓ WIRED | lines 25-31; all 5 markers live |
| `check-html-locks.mjs` | `web/.next/server/app/index.html` | `readFileSync` of build output | ✓ WIRED | line 58; asserts on-disk artifact, not a DOM |
| `check-budget.mjs` | `node:zlib gzipSync` | transfer-weight measurement | ✓ WIRED | line 24/71 |
| `ci.yml` | `design-system/test/*.test.js` | `node --test`, no `npm ci` | ✓ WIRED | line 44; CI logs confirm execution |
| Vercel project | `web/` | Root Directory = `web`, Node 22 | ✓ WIRED | Live deployment serves the `web/` build; on-disk and live HTML carry identical markers |
| GitHub ruleset 20595020 | `locks` + `build` | required status checks on `main` | ✓ WIRED | Verified directly via `gh api .../rules/branches/main` and `.../rulesets/20595020` |

> Note: `gsd-sdk query verify.key-links` reported false negatives on 5 of these links (e.g. `Invalid regex pattern: safeJsonLd\\(\\{`) — a backslash-escaping defect in the SDK's pattern handling, not a wiring defect. Every one was re-verified by direct file read at the line numbers above.

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `NAPFooter.jsx` | `display` / `dial` | `formatPhone(phone)` / `toDial(phone)`, `phone` defaulting to `+447861936533` at line 34 | Yes — live HTML shows `+44 7861 936533` / `tel:+447861936533` | ✓ FLOWING |
| `NAPFooter.jsx` | `schema` (JSON-LD) | built from `businessName`, `dial`, `areaServed` props | Yes — live JSON-LD carries `telephone: +447861936533` and 4 `City` nodes | ✓ FLOWING |
| `web/app/page.jsx` | component props | literal scaffold values (explicitly declared scaffold; Phase 2 replaces) | Yes — all values reach the live HTML (`4.9`, `175`, `Deep Cleaning in Warwick`) | ✓ FLOWING |
| Built CSS | `--bhc-*` tokens | `design-system/tokens.css` via `styles.css` `@import` | Yes — 61/61 tokens present in the live bundle | ✓ FLOWING |
| Live fonts | `url(../media/*.woff2)` | `design-system/fonts/fonts.css` via the `./fonts/*` exports map | Yes — 8/8 fetch 200, `font/woff2` | ✓ FLOWING |

No hollow props, no empty-array renders, no static-fallback data sources found.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full verify pipeline is green | `npm run verify` | design-system 10/10; check-html-locks 18/18; budget 168.5 KB JS / 191.3 KB page; exit 0 | ✓ PASS |
| Design-system locks pass standalone with no install | `npm run test:locks` | `# pass 10 # fail 0`, exit 0 | ✓ PASS |
| Live URL reachable | `curl -sI https://bhc-website-nine.vercel.app` | HTTP 200, 23,513 bytes | ✓ PASS |
| Live robots.txt blocks crawlers | `curl -s .../robots.txt` | `User-agent: *` / `Disallow: /` | ✓ PASS |
| Live NAP digit equality (no JS) | digit-compare of `tel:` href vs `.bhc-footer__phone` label | `447861936533 == 447861936533` | ✓ PASS |
| Live token pipeline | fetch bundled CSS, diff against `tokens.css` | 61/61 tokens present, 0 missing, `--bhc-ink:` ×1 | ✓ PASS |
| Live font assets | fetch all 8 woff2 from bundled URLs | 8/8 → 200 `font/woff2` | ✓ PASS |
| Webflow site untouched (D-03) | `dig +short www.beyondhousecleaning.com` | `cdn.webflow.COM.` → `198.202.211.1`; apex also `198.202.211.1` | ✓ PASS |
| Budget resolves every script it counts | re-ran resolution loop against build output | 6 script tags, **0 unresolved** | ✓ PASS |
| External-script lock has nothing to catch today | order-independent regex over built HTML | 0 external-origin `<script src="http…">` | ✓ PASS |

### Probe Execution

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| CI gate red-run proof (D-13) | `gh run view 31279674172 --json jobs` | `locks failure / build success` on probe commit `bc965a3` | ✓ PASS |
| CI gate green-after-revert (D-13) | `gh run view 31279722315` | `conclusion: success` on revert commit `b73d78f` | ✓ PASS |
| Fail-open reproduction (CR-01) | `node --test 'design-system/test/*.test.js'` in an empty dir, Node v22.23.1 | `# tests 0 # pass 0 # fail 0`, **exit 0** | ✗ CONFIRMED HOLE (see W-2) |
| Phone divergence reproduction (CR-04) | direct import of `formatPhone`/`toDial` | `+1 415 555 2671` → display `+1 415 555 2671`, dial `+4414155552671`, **and the SC-2b lock still passes** | ✗ CONFIRMED HOLE (see W-1) |

No `scripts/*/tests/probe-*.sh` convention exists in this repo; the phase's probe equivalent is the CI red/green pair above, which I re-executed via the GitHub API rather than trusting the SUMMARY.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| REQ-nap-consistency | 01-01, 01-02, 01-03, 01-04, 01-05 (all five) | Footer displayed `+44 7861 936533` but dialled `07441918832`; `/get-a-quote` dialled a third number. Acceptance: (a) exactly one `tel:` in the footer, href digits = displayed digits (CI Lock #4); (b) consistent NAP block — name, service-area statement, one phone, hours — no street address (D4). | ✓ SATISFIED | (a) Live: 1 `tel:`, 1 `<footer>`, digits equal; gated by `check-html-locks.mjs` SC-2a/2b/2c and by `locks.test.js` Lock 4; both retired numbers asserted-absent and confirmed absent live. (b) All four NAP elements render live; no postcode, no `streetAddress`, no `"address"` key. Structural: one `NAPFooter` in the root layout, one number literal in the whole codebase (`NAPFooter.jsx:34`), no `phone` prop anywhere in `web/app`. |

**Orphaned requirements check:** `grep "Phase 1" .planning/REQUIREMENTS.md` maps exactly one
requirement to this phase — `REQ-nap-consistency` — and all five plans declare it. **No orphaned
requirements.** Traceability table already reads `Complete`, which this verification supports.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | `TBD` / `FIXME` / `XXX` / `TODO` / `HACK` / `PLACEHOLDER` across `web/app`, `web/scripts`, `design-system/src`, `design-system/test`, `.github` | — | **Zero occurrences.** Debt-marker gate passes cleanly. |
| — | — | "coming soon" / "not yet implemented" / "placeholder" in source | — | **Zero occurrences.** |
| — | — | Stub returns (`return null`, `return []`, `=> {}`) in rendered paths | — | None. All six components return substantive JSX; all data reaches the live HTML. |
| `design-system/test/__ci-gate-probe.test.js` | — | Temporary failing probe | ✓ CLEAN | Reverted in `b73d78f`; file confirmed absent; `design-system/test/` contains only `locks.test.js`; working tree clean. |

## Warnings

None of the following fails a Success Criterion. All are recorded because this phase's value
proposition is specifically *"these locks cannot be silently bypassed"*, and each one narrows that
claim. I formed these severities independently of `01-REVIEW.md`; where I agree with the reviewer
I say so, and where I think the framing understates the issue I say that too.

**W-1 — `formatPhone`/`toDial` can diverge, and the SC-2b lock does not catch the divergence.**
`formatPhone` (`formatPhone.js:31`) returns `String(value)` unchanged whenever the national part is
not 10 digits, while `toDial` still normalises. I reproduced the reviewer's CR-04 case and then
tested it against the gate, which the review did not do: `phone="+1 415 555 2671"` renders the label
`+1 415 555 2671` beside `href="tel:+4414155552671"` — a genuine display/dial divergence — and
**SC-2b passes it**, because both sides strip a leading `44` and the resulting digit strings
coincide (`14155552671`). `locks.test.js` Lock 4 passes it for the same reason. So this specific
class of divergence is caught by *neither* layer.

Why this is a WARNING and not a BLOCKER: it is unreachable today and by construction. `layout.jsx`
passes **no `phone` prop**; the value comes solely from the single well-formed package default
`+447861936533`; there is exactly one `NAPFooter` instance; and no literal phone number exists
anywhere under `web/app` (I re-grepped). The *actual* live bug — a displayed number and an href
that are two independent inputs — **is** structurally dead, because there is no display prop at all.
SC-2 is met on the live site, on disk, and in CI.

What is weaker than claimed: `locks.test.js:35`'s test title, *"the live-site bug is impossible
through this API"*, and `formatPhone.js:6`'s *"the two cannot diverge"*. Those are the comments a
Phase 2/3 engineer will read before passing a `phone` prop from a data file. **Recommend** (cheap,
one line): make the `formatPhone` fallback return `toDial(value)` rather than the raw input, so
display can never be anything but a rendering of the dialled digits.

**W-2 — the design-system half of the CI gate fails open on rename.** Confirmed independently on
Node v22.23.1: `node --test <glob matching nothing>` prints `# tests 0 / # pass 0 / # fail 0` and
**exits 0**. `ci.yml:44`, `design-system/package.json:16` and root `package.json:6` all use that
form. Renaming, moving or deleting `locks.test.js` therefore leaves the `locks` required check
**green while asserting nothing**. SC-3 is satisfied today — the tests demonstrably run and
demonstrably gate — but the gate is not self-defending, which matters for a phase whose whole point
is that later phases inherit a lock they cannot silently bypass. **Recommend** a one-line assertion
that the suite ran a minimum expected number of tests, or a pre-step that fails if the file is
missing.

**W-3 — `check-budget.mjs` skips unresolvable scripts silently.** `check-budget.mjs:70`
(`if (!existsSync(f)) continue;`) has no skip counter and no failure path, so a change to Next.js's
asset path scheme would make the budget report `0.0 KB` and exit 0. I verified this is **not**
happening today: 6 script tags, 0 unresolved, 168.5 KB. Latent, not live. The budget is not a
Phase 1 criterion (Phase 5 SC-3 owns it), so this is a warning to carry forward.

**W-4 — the D-14b "no external script" lock is attribute-order dependent.** The regex
`/<script src="http[^"]*"/g` (`check-html-locks.mjs:192`) only matches when `src` is the *first*
attribute. `<script async src="https://www.googletagmanager.com/gtm.js">` — the single most likely
way GA/GTM gets added — scores 0 matches. I confirmed both the order-dependent and an
order-independent regex return 0 today (no external scripts exist), so nothing is currently
escaping. Phase 5 SC-2 owns Lock 10 and should not inherit this form.

**W-5 — the two D-15 layers are not independent, contrary to their own documentation.**
`web/public/robots.txt` states *"D-15 is enforced at two independent levels"*. They are not: a
compliant crawler that obeys `Disallow: /` never fetches the page and therefore never reads the
`noindex` meta tag, so a URL discovered by other means can still be indexed URL-only. Risk today is
low (the Vercel URL is not linked from anywhere public, and other deployment URLs sit behind Vercel
SSO). It matters at **cutover sequencing** — whoever flips this must allow crawling *before* or
*at the same time as* removing `noindex`, not after. Worth carrying into the cutover phase's notes.

**W-6 — `AggregateRating` attaches to an orphaned entity.** Parsed from the live HTML: the three
JSON-LD blocks are `BreadcrumbList` (no `@id`), `LocalBusiness` (**no `@id`**, carrying the
`AggregateRating`), and `HomeAndConstructionBusiness` (`@id: https://www.beyondhousecleaning.com/#business`).
The rating therefore hangs off a second, anonymous business node rather than the canonical one. This
does not affect Phase 1 SC-4 (RatingBadge renders, and renders server-side), and Phase 5 SC-1 owns
the entity graph — listed under Deferred above — but it will need fixing there rather than being
assumed correct.

### Human Verification Required

#### 1. Visual rendering of the proof-of-integration page

**Test:** Open `https://bhc-website-nine.vercel.app` in a desktop browser, then at mobile width
(real handset or DevTools at 375px).
**Expected:** A coherent BHC page — Figtree/Public Sans actually render (not a system fallback);
breadcrumb trail above the hero; `Deep Cleaning in Warwick` visually dominant; the 4.9/175 rating
badge legible on the warm band; the interlink list readable as three service links; `Get a Free
Quote` a filled primary button; the NAP footer at the bottom. Nothing overlapping, nothing
unstyled, no horizontal scroll at 375px.
**Why human:** SC-4 requires the five components to *"render correctly"*. I proved the markup,
class hooks, server-rendered JSON-LD, all 61 tokens and all 8 font files are present and served —
but "present and served" is not "looks right". ROADMAP marks this phase `UI hint: yes`.
**Note:** the scaffold page's links (`/get-a-quote`, `/locations`, the three `/location/...` URLs)
all 404 today. That is expected and deferred to Phases 2 and 3 — please don't report it as a bug.

#### 2. Dial the footer number on a real handset

**Test:** Tap `+44 7861 936533` in the footer on a mobile device.
**Expected:** The dialler opens pre-filled with `+44 7861 936533` and reaches Beyond House Cleaning.
**Why human:** Label-vs-href digit equality is machine-verified on the live HTML. That the number
physically reaches the business is Sam's confirmation (recorded in 01-04, D-09 closed) and cannot be
re-derived from code. One tap closes it on the real device path rather than on the string.

### Gaps Summary

**No gaps. The phase goal is achieved.**

All four ROADMAP Success Criteria verify against the actual codebase and the actual live
deployment, and the single mapped requirement (`REQ-nap-consistency`) is satisfied on both of its
acceptance bullets. I re-derived every claim rather than reading it out of a SUMMARY: I ran
`npm run verify` myself (10/10 + 18/18 + budget green), fetched and parsed the live HTML and CSS,
fetched all 8 font assets, queried the GitHub ruleset and the red/green CI run pair directly, and
re-checked DNS to confirm the Webflow site was never touched.

On the question the orchestrator asked me to weigh — whether CR-04 makes the goal's *"permanently
fixed from day one"* claim false — my honest answer is **no, but it is narrower than the code's own
comments assert, and the assertion is the part that should be corrected.** Four independent layers
stand between this repo and a recurrence of the live bug: a single `NAPFooter` instance structurally
enforced by the root layout; a single number literal with no display prop, so display and href
cannot be independent inputs; retired numbers asserted-absent in CI; and label-vs-href digit
equality asserted against built HTML on every push, as a required status check with no bypass
actors. The live bug's actual mechanism — two independent inputs drifting apart — is dead.

What CR-04 shows is that a *different*, narrower failure mode survives: a future caller passing a
malformed or non-UK `phone` prop can produce a display string that is not a rendering of the dialled
digits, and the SC-2b lock will not catch it (I verified the lock passes that case, which the review
did not check). That is unreachable today and cheap to close. I have recorded it as **W-1**, not as
a gap, and recommended the one-line fix. It should be closed before Phase 3 feeds these components
from a data file.

The genuinely notable finding across this verification is that the defects cluster in the
*enforcement* layer, not the application — W-1 through W-4 are all cases of a lock that currently
passes for the right reason but would not necessarily fail for the right reason. None of them
invalidates Phase 1. All of them matter to Phase 5, which is contracted to make all 11 locks pass
and will inherit this harness.

Status is `human_needed` rather than `passed` solely because SC-4's "render correctly" has a visual
component that no grep can settle, and because a one-tap dial test is worth doing once on the real
number. Every automated check is green.

---

*Verified: 2026-08-09T14:30:45Z*
*Verifier: Claude (gsd-verifier)*
