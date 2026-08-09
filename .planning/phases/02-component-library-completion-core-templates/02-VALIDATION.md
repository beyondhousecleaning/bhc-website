---
phase: 2
slug: component-library-completion-core-templates
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `02-RESEARCH.md` § Validation Architecture. Every command below was run green in this worktree at baseline.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` (built in, Node 22.23.1) — **no third-party test framework, by decision D-12** |
| **Config file** | none — `design-system/test/run-locks.mjs` is both the runner and the fail-closed gate |
| **Quick run command** | `npm run test:locks` (design-system only, zero install, ~60 ms) |
| **Full suite command** | `npm run verify` → `test:locks && build && check:html && check:budget` |
| **Estimated runtime** | ~60 ms quick; ~35 s full (build dominates) |

Baseline at phase start: **14** design-system locks pass, **21** built-HTML locks pass, budget 168.5 KB JS gzip / 191.3 KB page. Green.

**This phase installs zero packages.** Any plan proposing `npm install` has misread the constraints.

---

## Sampling Rate

- **After every task commit:** `npm run test:locks`
- **After every plan wave:** `npm run verify`
- **Before `/gsd:verify-work`:** full suite green **and** the CI run green on the branch
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| SC | Behaviour | Test Type | Automated Command | File Exists |
|----|-----------|-----------|-------------------|-------------|
| SC-1 | All 16 components exist with the four-file shape, `@dsCard` on line 1, agreeing `category:`, registered in both `.design-sync` maps | unit (fs scan) | `npm run test:locks` | ❌ W0 — delta 9 |
| SC-2 | 17 app routes + `not-found` prerender; exactly one `<h1>` each | integration | `npm run check:html` | ⚠️ W0 — single-page today; deltas 1, 3, 4 |
| SC-2 | Landmarks: one `<header>`, one `<main id="main">`, one `<footer>` per app page | integration | `npm run check:html` | ❌ W0 — delta 5 |
| SC-2 | Every internal `<a href="/…">` resolves to a prerendered route | integration | `npm run check:html` | ❌ W0 — delta 6 |
| SC-3 | `data-bhc-photo-state="pending"` renders where BeforeAfterSlider has no pairs | integration | `npm run check:html` | ❌ W0 — delta 8 |
| SC-4 | `FAQPage` appears zero times in any built HTML | integration | `npm run check:html` | ❌ W0 — delta 7 |
| D-08/D-11 | Exactly one `tel:` inside `<footer>`; ≤3 per page; all hrefs digit-identical; any `tel:` text content with ≥7 digits equals its own href | integration | `npm run check:html` | ⚠️ W0 — **must be re-scoped (delta 2) or CI goes red on build 1** |
| D-07/§8 | **Every** route's client-reference manifest declares zero first-party client modules; no `use client` under `web/app` **or** `design-system/src` | integration | `npm run check:html` | ⚠️ W0 — **proven hole**, delta 11 |
| §9.3/§10 | At most one `aria-current="page"` per page | integration | `npm run check:html` | ❌ W0 — delta 12 |
| §10 | `toDial`/`formatPhone` reject malformed input rather than degrading | unit | `npm run test:locks` | ❌ W0 — delta 13 |
| §1/§7.16 | No `<svg>` in package source carries `alt`; every `<svg>` has `aria-hidden="true"` or `role="img"` + non-empty `aria-label` | unit (source scan) | `npm run test:locks` | ❌ W0 — delta 14 (passes on landing; all existing SVGs comply) |
| D-14 | Worst-page transfer weight under budget | script | `npm run check:budget` | ⚠️ W0 — single-page today; rewrite to worst-page |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 is not optional here. Four currently-green locks turn **red** on the first Phase 2 build (SC-4b breadcrumbs asserted on Home which has none; SC-4d InterlinkBlock which `return null`s until Phase 3; SC-4f's exactly-3-JSON-LD count; and the D-15 robots-meta lock once delta 1 globs). Delta 1 and those corrections must land in **one commit**, or `main` blocks.

- [ ] `web/scripts/check-html-locks.mjs` — rewrite around `.next/prerender-manifest.json` (NOT a directory walk, and NOT `routes-manifest.json`, which omits SSG-expanded pages and would silently under-assert Phase 3). Deltas 1–8, 11, 12 **plus** the four unlisted corrections. One atomic change.
- [ ] `web/scripts/check-budget.mjs` — worst-page measurement; optionally close WR-05.
- [ ] `design-system/test/locks.test.js` — deltas 9, 13, 14; raise the `previews.length >= 6` floor.
- [ ] `design-system/test/run-locks.mjs` — `MIN_TESTS` raised to the exact post-phase count.
- [ ] `web/content/*.js` — the data modules the templates and the expectation table both read.
- [ ] `web/jsconfig.json` — `@/*` alias (verified working).

No framework install is needed. Nothing here adds a dependency.

---

## Manual-Only Verifications

| Behavior | Why Manual | Test Instructions |
|----------|-----------|-------------------|
| Composed pages look right at 375 px and at desktop | ROADMAP marks this phase `UI hint: yes`. No grep settles visual correctness — markup presence is machine-checkable, visual hierarchy is not. | Open the deployed preview at desktop width and at 375 px. Confirm per-template band order matches UI-SPEC §4, nothing overlaps, nothing is unstyled, and there is no horizontal scroll. |
| Keyboard and screen-reader behaviour of `<details>` nav, FAQAccordion and ReviewRail | The zero-JS patterns are build-verified but not AT-tested. `<h3>` inside `<summary>` has inconsistent heading exposure across browser/AT pairs (UI-SPEC §7.9 caveat). | Tab through the nav, FAQ and review rail. Confirm every control is reachable, focus is visible on both the navy CTABand and orange fills, and the FAQ opens and closes from the keyboard. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
