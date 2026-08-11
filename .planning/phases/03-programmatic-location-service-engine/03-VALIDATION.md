---
phase: 3
slug: programmatic-location-service-engine
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-10
---

# Phase 3 — Validation Strategy

> Derived from `03-RESEARCH.md` § Validation Architecture. Every figure below was measured against a real 426-route probe built in this worktree, not estimated.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` + `node:assert/strict` — builtins only, no config file, no dependency (D-12) |
| **Config file** | none, by design |
| **Quick run command** | `node design-system/test/run-locks.mjs` — **222 ms**, zero install, route-count independent |
| **Full suite command** | `npm run verify` → `test:locks && build && check:html && check:budget` |
| **Measured cost at 426 routes** | build 5.6 s + html locks 0.94 s + budget 5.0 s + design locks 0.22 s ≈ **12 s** local, plus `npm ci` |

Baseline at phase start, all green: **20** design-system lock tests, **37** built-HTML locks, JS 129.8 KB / 500 KB, worst page 299.5 KB / 1024 KB, 19 routes.

**Scale is not the risk.** The probe measured a 426-route build at 5.6 s / 570 MB with zero routes falling out of the manifest, the harness at 937 ms over 39 MB of HTML, and the O(n²) similarity gate running *exhaustively* over all 60,378 pairs in 1.9 s / 40 MB. The UI-SPEC §10.3 sampling fallback is dead complexity and should not be built.

**This phase installs zero packages.**

---

## Sampling Rate

- **After every task commit:** `node design-system/test/run-locks.mjs` (222 ms, zero install)
- **After every wave / batch:** `npm run verify` (~12 s local plus install)
- **Phase gate:** full suite green in CI on both required jobs before `/gsd:verify-work`
- **Max feedback latency:** 60 seconds

---

## Phase Requirements → Test Map

| Req | Behaviour | Test type | Command | Exists? |
|-----|-----------|-----------|---------|---------|
| REQ-programmatic-page-scale | 426 routes exist, all `compute: "static"` | built-artifact | `check-html-locks.mjs` delta 1 + delta 26 floor | ⚠️ needs floor raised + sitemap filter |
| REQ-programmatic-page-scale | No route silently went dynamic | built-artifact | same, `compute === 'static'` | ✅ exists |
| REQ-fix-duplicate-coventry | 5 URLs redirect once; 90 resolve 200 with no hop | routing manifest | `web/scripts/check-redirects.mjs` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | 2 service slugs redirect; old slugs not prerendered | routing + route set | `check-redirects.mjs` + `EXPECTED_APP_ROUTES` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | One concept, one noun across `h1`/`crumb`/`title`/nav | module-load guard | assertion in `towns.js` comparing `COMBO_SERVICES` to `services.js` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | FAQ band survives the rename | module-load guard | key-set guard in `faqs.js`, mirroring `reviews.js:60` | ❌ **Wave 0** |
| REQ-content-depth-bar | ≥800 / ≥600 / ≥300 counted prose words | built-artifact | delta 22 | ❌ **Wave 0** |
| REQ-content-depth-bar | Similarity ceilings hold | built-artifact | delta 23 — ~2 s Jaccard + ~2 s masked + ~2.3 s cosine | ❌ **Wave 0** |
| REQ-content-depth-bar | `(a,b)` injective **and balanced** | module-load | delta 29 in `towns.js` | ❌ **Wave 0** |
| REQ-hub-and-spoke-architecture | Every internal link resolves | built-artifact | delta 6 — **already passes at 426 routes unmodified** | ✅ verified |
| REQ-hub-and-spoke-architecture | Every in-page anchor resolves | built-artifact | delta 15 — **already passes at 426 with 58 cards + 7 jump groups** | ✅ verified |
| REQ-hub-and-spoke-architecture | InterlinkBlock present per template | built-artifact | delta 16 (rewrite of SC-4d) | ❌ **Wave 0** |
| REQ-hub-and-spoke-architecture | Link count stays sane | built-artifact | delta 19, **per-template** | ❌ **Wave 0** |
| all | Budget holds | built-artifact | `check-budget.mjs` — **302.1 KB / 1024 KB verified at 426 routes** | ✅ verified |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 is not optional. Two pitfalls the research proved by reproduction:

1. **Adding `app/sitemap.js` crashes the whole harness at module load** — 37 tests collapse to 1 failure with a misleading "run npm build first". The non-HTML metadata-route filter must land *before* any sitemap work, and it also unblocks Phase 5.
2. **Four harness changes must land in one commit against one build** — the delta 18 template-rule expectation resolver, delta 16's per-template InterlinkBlock rule, delta 21's per-template photo-state rule, and delta 26's route floor. Landing them separately reddens the branch, and `main` has no bypass actors.

- [ ] `web/scripts/check-html-locks.mjs` — non-HTML metadata-route filter
- [ ] `web/scripts/check-html-locks.mjs` — deltas 18, 16, 21, 26 in **one** commit
- [ ] `web/scripts/check-redirects.mjs` — new; the 90-resolve / 5-redirect contract and the service 301s
- [ ] `web/content/towns.js` — module-load guards: `(a,b)` injective + balanced (delta 29), and `COMBO_SERVICES` ↔ `services.js` noun agreement
- [ ] `web/content/faqs.js` — key-set guard so a missed rename fails loudly instead of silently emptying the FAQ band
- [ ] Content fragments — see the front-loading note below

No framework install. Nothing here adds a dependency.

---

## The content risk, stated plainly

`web/content/` holds **12,649** authored words today. This phase needs roughly **82,600**.

Batching does **not** spread that evenly. **Batch 1 alone needs ~52,100 words — 63% of the corpus for 36% of the towns** — because the 112 service-variant fragments are a fixed 8×8 grid and a 21-town prefix exercises it in full. Delta 29's balance clause makes that unavoidable, and it is a property of the design rather than a scheduling mistake.

That block is town-independent, so it belongs **before** the town data, not inside batch 1. Any plan that treats content as evenly divisible across five batches will stall at batch 1.

This is the single largest work item in the phase and the most likely place for it to go wrong.

---

## Manual-Only Verifications

| Behavior | Why Manual | Instructions |
|----------|-----------|--------------|
| Composed pages look right at 375 px and desktop across the three new templates | ROADMAP marks the phase `UI hint: yes`. Band order and heading hierarchy are machine-checked; visual correctness is not. | Walk `/locations`, a town hub, and a combo page at both widths. Confirm band order matches UI-SPEC §9, nothing overlaps, no horizontal scroll. |
| Copy reads as written by a person, not assembled | Delta 23 measures *similarity*, not *quality*. 82,600 composed words can clear every ceiling and still read as spun. | Read three combo pages for the same service in different towns, end to end. |

**Carried forward:** Phase 2's `02-15` visual checkpoint is still unanswered, and this phase's §4 adjacency fix changes the FAQ band tone on Home and all six service pages — so those checks need re-running regardless. Batch both visual passes together rather than blocking.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [x] `nyquist_compliant: true`

**Approval:** pending
