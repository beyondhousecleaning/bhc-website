---
phase: 02-component-library-completion-core-templates
plan: 03
wave: 2
status: complete
completed: 2026-08-09
closed_out_by: orchestrator
key-files:
  modified:
    - design-system/test/locks.test.js
    - design-system/test/run-locks.mjs
---

# 02-03 — Source Locks (deltas 9, 13, 14)

## What was built

Three source-scanning locks were added to `design-system/test/locks.test.js`, and `MIN_TESTS` in `design-system/test/run-locks.mjs` was raised from 14 to the exact post-plan count of **20**.

| Delta | Lock | What it asserts |
|-------|------|-----------------|
| 9 | Component shape | Every component ships its four files (`.jsx`/`.html`/`.d.ts`/`.prompt.md`) and is registered in **both** `.design-sync` maps. Paired with a matcher self-test that the `@dsCard` line form is accepted and near-misses rejected. |
| 13 | Phone throw | `toDial` throws on every unrenderable value, and `formatPhone` inherits the throw so the display cannot silently degrade. Locks in 02-01's CR-04 follow-up. |
| 14 | Inline SVG a11y | Every inline `<svg>` in package source is either `aria-hidden="true"` or carries `role="img"` with a non-empty `aria-label`. Paired with a matcher self-test. |

Each new lock ships with a companion assertion proving the matcher itself still accepts compliant forms and rejects non-compliant ones — so a matcher that silently stops matching cannot masquerade as a passing lock.

## Verification

`npm run verify` exits **0**:

- `test:locks` — **20/20** pass (was 14)
- `check:html` — **30/30** pass (unchanged)
- `check:budget` — JS 129.8 KB / 500 KB, page 286.8 KB / 1024 KB (unchanged; this plan touched no shipped code)

`MIN_TESTS = 20` matches the actual count, so a vacuous run still fails closed.

## Hand-offs

- `EXPECTED_APP_ROUTES` (3 → 18) remains owned by **02-13**; the `previews.length` floor (6 → 22) by **02-14**. This plan raised neither.
- The self-restoring inverse gates from wave 1 — `INTERLINK_LOCK_ACTIVE`, `NO_RATING_YET`, `NO_PRIMARY_CTA_YET` — were left untouched, as planned.

## Note on how this plan was closed out

The executor completed and committed all three tasks (`6784f74`, `8d6b105`, `535d570`) but was interrupted before writing this SUMMARY or updating tracking. The orchestrator verified the committed state independently — 20/20 and 30/30 green, working tree clean, `MIN_TESTS` consistent with the real count — and closed the plan out rather than re-running it, which would have duplicated work against an already-correct tree. No code was changed during close-out.

## Self-Check: PASSED
