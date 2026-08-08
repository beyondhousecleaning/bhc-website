---
phase: 01-platform-foundation-design-system-integration
plan: 03
subsystem: ci
tags: [github-actions, node-test, zero-dependency, performance-budget, gzip, nap-locks, robots]

# Dependency graph
requires:
  - "01-01: the lock suite it runs is the 10-test `design-system/test/locks.test.js`"
  - "01-02: `web/.next/server/app/index.html` — the built artifact every assertion reads, plus the root workspace and `package-lock.json` that `npm ci` needs"
provides:
  - "`web/scripts/check-html-locks.mjs` — 18 zero-dependency assertions against the built HTML, built CSS, `web/app` source and `web/public/robots.txt`"
  - "`web/scripts/check-budget.mjs` — the D-14/D-14a gzip transfer-weight gate, printing measurements as well as gating"
  - "`.github/workflows/ci.yml` — the repo's first CI: two jobs (`locks`, `build`), read-only token, green on every push"
  - "`npm run verify` — lock suite → build → HTML locks → budget, in one command, ~3.3 s locally"
affects: [01-04-vercel-connection, 01-05-branch-protection, phase-02-components, phase-03-programmatic-pages, phase-05-cutover]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Enforcement code is zero-dependency by rule: `node:`-prefixed built-ins only, no DOM parser, no size measurement tool, no test framework beyond built-in `node:test`"
    - "Every lock has a negative control — a check that cannot fail is not a check"
    - "Assertions read the file `next build` writes to disk, never a browser DOM, because the on-disk artifact is what proves server-rendering"
    - "A verify block that observes CI must match on `gh run list --commit \"$SHA\"`, never `--limit 1`, which can return a stale green run"

key-files:
  created:
    - web/scripts/check-html-locks.mjs
    - web/scripts/check-budget.mjs
    - .github/workflows/ci.yml
  modified:
    - package.json

key-decisions:
  - "`check-html-locks.mjs` uses `node:test` + `node:assert/strict` (house convention, per-lock TAP naming which lock failed); `check-budget.mjs` is a plain script because its printed numbers are half its value"
  - "`actions/checkout@v7` and `actions/setup-node@v7` — majors confirmed at execution time (`v7.0.1` / `v7.0.0`), not the `v4` research assumption A2"
  - "Page total is gzip JS + raw HTML bytes (191.3 KB), following the research-verified script, not the gzip-everything figure (175.5 KB) 01-02 reported informationally"
  - "The JSON-LD open tag is matched as a literal string rather than a regex, so the file's own text carries the criterion it enforces"
  - "Section banners are 79 characters, matching the six real banners in `locks.test.js`, not the 76 the plan's acceptance criterion states"

patterns-established:
  - "Two independent enforcement layers per NAP/address rule: `locks.test.js` scans package source, `check-html-locks.mjs` scans built output"
  - "The budget's measurement basis is documented at the point of measurement, so a future reader cannot fail Phase 1 on a blank page by measuring uncompressed bytes"

requirements-completed: [REQ-nap-consistency]

# Metrics
duration: 8min
completed: 2026-08-08
---

# Phase 01 Plan 03: CI Lock Enforcement Summary

**Every Phase 1 criterion that can be checked without a browser is now a mechanical assertion — 18 against the built HTML, CSS, app source and robots.txt, plus a gzip transfer-weight budget — running as two GitHub Actions jobs that both went green on the pushed HEAD, with four negative controls proving each gate can actually fail.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-08-08T21:22Z
- **Completed:** 2026-08-08T21:30Z
- **Tasks:** 3
- **Files:** 4 (3 created, 1 modified)

## Accomplishments

- **Success Criterion 3 is met in the strong sense.** The lock suite does not merely exist — it runs
  on every push, on bare `node --test` with no `npm ci` and no test framework, and a failure exits
  non-zero. D-13's remaining half (required status checks on `main`) is a repo-admin action that
  Plan 05 hands to Sam; everything on this side of that setting is done.
- **The gates are proven to fail, not assumed to.** Four negative controls, all run and all passing:
  injecting a postcode + a retired number + a second `<footer>`; injecting a `streetAddress` key;
  renaming the built CSS that declares `--bhc-ink`; and lowering the JS budget below the measured
  figure. Each made the command exit non-zero; each restore returned it to exit 0.
- **D-10 is enforced in both halves.** The postcode regex alone passes a `streetAddress` schema field
  or a "12 High Street" line carrying no postcode. The second assertion closes that, which is the
  lock Phase 3 inherits when data-file values feed these components at ~336-page scale.
- **SC-1b became a gate rather than a one-time check.** `--bhc-ink` must be declared **exactly once**
  across `web/.next/static/**/*.css` — zero means the token pipeline broke or `tokens.css` was
  forked, more than one means both stylesheets were imported and every token is duplicated.
- **The budget is measured the way D-14a defines it, with the reasoning in the file.** 168.5 KB gzip
  against a 500 KB budget; the same page read uncompressed is 550.9 KB and would "fail" a budget it
  meets with room to spare.
- **Nothing was installed.** The repo still has zero `dependencies` and zero `devDependencies` at the
  root, and zero `devDependencies` anywhere.

## Task Commits

Each task was committed atomically:

1. **Task 1: check-html-locks.mjs — the built-HTML lock suite** — `6218092` (test)
2. **Task 2: check-budget.mjs — the transfer-weight performance gate** — `c49e418` (test)
3. **Task 3: the GitHub Actions gate and the root verify scripts** — `0823c38` (ci)

## Files Created/Modified

| File | Lines | What it is |
|------|-------|------------|
| `web/scripts/check-html-locks.mjs` | 212 | 18 `node:test` assertions — SC-1b, SC-2a…2e, SC-4a…4g, D-14b, D-15 |
| `web/scripts/check-budget.mjs` | 82 | Plain script — the D-14/D-14a gzip transfer-weight gate |
| `.github/workflows/ci.yml` | 63 | The repo's first CI — two jobs, read-only token |
| `package.json` | 13 | Root scripts: `check:html`, `check:budget`, `verify` added to the existing two |

## The 18 Assertions

| # | ID | Assertion |
|---|-----|-----------|
| 1 | SC-2a | exactly one `href="tel:` in the built HTML |
| 2 | SC-2b | `tel:` href digits equal `bhc-footer__phone` label digits, leading `44` stripped |
| 3 | SC-2c | none of `07441918832`, `447441918832`, `447575709361` appears |
| 4 | SC-2d | the verbatim UK postcode regex does not match — **no comment-stripping step** |
| 5 | SC-2d | neither `streetAddress` nor the `"address"` JSON key appears |
| 6 | SC-2e | exactly one `<footer` |
| 7 | SC-4a | exactly one `<h1`, and `bhc-hero__heading` carries the town name |
| 8 | SC-4b | `bhc-breadcrumbs__list` and `"@type":"BreadcrumbList"` both present |
| 9 | SC-4c | `bhc-rating__value">4.9` present |
| 10 | SC-4d | `bhc-interlink__list` present |
| 11 | SC-4e | `bhc-btn--primary` present |
| 12 | SC-4f | exactly three `<script type="application/ld+json"` **in the file on disk** |
| 13 | SC-4g | the built HTML carries no client directive |
| 14 | SC-4g | no file under `web/app` declares a client directive (recursive walk, no shelling out) |
| 15 | SC-1b | `--bhc-ink:` declared exactly once across `web/.next/static/**/*.css` |
| 16 | D-14b | no `<script src="http…` external-origin tag |
| 17 | D-15 | a `name="robots"` meta whose content includes `noindex` |
| 18 | D-15 | `web/public/robots.txt` (comments stripped) has `User-agent: *`, `Disallow: /`, no `Allow:` |

`# tests 18 · # pass 18 · # fail 0`, in 67 ms.

## Measured Figures

| Measurement | Value | Budget | Headroom |
|-------------|-------|--------|----------|
| JS, gzip transfer weight (6 script tags) | **168.5 KB** | 500 KB | 34% used |
| Page, gzip JS + HTML bytes | **191.3 KB** | 1024 KB | 19% used |
| Same JS read uncompressed (the D-14a trap) | 550.9 KB | — | would "fail" 500 KB |

The 168.5 KB reproduces 01-RESEARCH.md's probe and 01-02's measurement to the decimal.

**Note on the page figure:** 191.3 KB here vs the 175.5 KB 01-02 reported. Not a discrepancy —
different formulae. This script follows the research-verified logic (`gzip JS + Buffer.byteLength(html)`,
i.e. raw HTML bytes); 01-02's informational table gzipped the HTML and added the CSS. Both are far
below 1 MB. The stricter of the two is the one that gates.

## CI

**Run:** https://github.com/beyondhousecleaning/bhc-website/actions/runs/31279392066
**HEAD asserted against:** `0823c381dc9bfc4aa7191e6a8213cbc3188f545d` — matched via
`gh run list --commit "$SHA"`, so the observed run is provably the one for this commit rather than a
stale earlier green run.

| Job | Steps | Duration | Result |
|-----|-------|----------|--------|
| `locks` | checkout → setup-node 22 → `node --test design-system/test/*.test.js` | **8 s** | ✅ success |
| `build` | checkout → setup-node 22 + npm cache → `npm ci` → workspace build → HTML locks → budget | **34 s** | ✅ success |

Run conclusion: `success`. The `locks` job has **no** install step and **no** cache — the
design-system package has zero dependencies, so it returns a verdict even when the app build is
broken, and a compromised registry cannot affect the lock verdict (T-01-SC).

**Action majors pinned — verified at execution time, not assumed:**

| Action | Research assumption (A2) | `gh api …/releases/latest` | Pinned |
|--------|--------------------------|----------------------------|--------|
| `actions/checkout` | `v4` | **`v7.0.1`** | `@v7` |
| `actions/setup-node` | `v4` | **`v7.0.0`** | `@v7` |

Assumption A2 was wrong by three majors. This is exactly why the plan required confirming it.

## Negative Controls

All four run, all four passed, all four restored:

| # | Control | Injected / changed | Result |
|---|---------|--------------------|--------|
| A | NAP | `CV32 6EQ` + `07441918832` + a second `<footer>` into the built HTML | exit non-zero (3 failing assertions); restored → exit 0 |
| B | Street address | `"streetAddress":"12 High Street"` into the built HTML | exit non-zero; restored → exit 0 |
| C | Design tokens | renamed the built CSS declaring `--bhc-ink` | exit non-zero (`found 0`); restored → exit 0 |
| D | Budget | `JS_BUDGET_KB` lowered to 100 | exit **1**, printing `PERFORMANCE BUDGET EXCEEDED (D-14)`; restored → exit 0 |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run verify` | **exit 0** in **3.3 s** — lock suite → build → HTML locks → budget, in that order (criterion allows ~80 s) |
| `node --test design-system/test/*.test.js` | `# tests 10`, `# pass 10`, `# fail 0` |
| `node --test web/scripts/check-html-locks.mjs` | `# tests 18`, `# pass 18`, `# fail 0` |
| `node web/scripts/check-budget.mjs` | exit 0, prints both figures |
| Import-specifier parse of `check-html-locks.mjs` | every specifier starts with `node:`; zero third-party, zero relative |
| `grep -c "cheerio\|jsdom\|linkedom"` on the lock script | `0` |
| Coverage sweep (13 criterion tokens present in non-comment lines) | all present |
| Budget-script source assertions (`gzipSync`, `transfer weight`, `D-14`, no `statSync().size`, no shell size tool, no `size-limit`) | all pass |
| `ci.yml` structural assertions (7 required strings, no install in `locks`, no `../`, no lint step, `permissions: contents: read`, no `secrets.`) | all pass |
| Root `package.json` | five scripts present; **no** `dependencies`, **no** `devDependencies` |
| `git grep -n "devDependencies" -- package.json web/package.json design-system/package.json` | no matches |
| Banner widths in `check-html-locks.mjs` | all four are 79 chars, byte-consistent with `locks.test.js` |
| `git status --porcelain` | empty |

## Decisions Made

- **`node:test` for the HTML locks, a plain script for the budget.** The lock file benefits from TAP
  output naming exactly which of 18 assertions failed; the budget script's printed numbers are its
  early-warning signal, and a test harness would bury them.
- **GitHub Actions, not the Vercel build.** Recorded in a comment block at the top of `ci.yml`:
  Vercel's Root Directory sandbox cannot traverse `..` to the sibling package, npm hoists workspace
  deps to the workspace root so there is no `..`-free path either, and — decisively — a red Vercel
  preview does not block a merge, which is precisely what D-13 forbids.
- **Push-only trigger on `branches: ['**']`.** Required status checks match by job name against the
  head commit regardless of the triggering event, so push-only gates pull requests too without the
  double run `pull_request` would add.
- **A `TOWN` constant, not a hardcoded string buried in an assertion.** SC-4a asserts the hero
  heading carries the page's town; the constant is at module top with a comment saying Phase 2
  replaces the scaffold page and must update it.
- **The JSON-LD open tag is a literal string, split on, not a regex.** An escaped regex
  (`application\/ld\+json`) means the file does not textually contain the criterion it enforces,
  which defeats a coverage sweep. Literal-and-split is equally exact and self-documenting.

## Deviations from Plan

No deviation rule was triggered; no auto-fix was required. Four acceptance-criterion clarifications,
all resolved in favour of measured reality over plan text:

**1. Section banners are 79 characters, not the 76 the criterion stated**
- **Found during:** Task 1
- **Detail:** The criterion says "exactly 76 characters wide, matching `design-system/test/locks.test.js`".
  Measured, all six banners in that file are 79 characters. The two halves conflict; matching the
  actual file is the correct resolution. This is the identical finding 01-01 recorded for Task 3 —
  the "76" figure in the phase docs is stale and should be corrected to 79 wherever it appears.

**2. The walk helper uses `readdirSync(dir, { withFileTypes: true })`, not `readdirSync` + `statSync`**
- **Found during:** Task 1
- **Detail:** The plan's action text names `readdirSync`/`statSync`; the analog
  (`locks.test.js:66-72`, `94-97`, `111-116`) uses `withFileTypes` + `e.isDirectory()` in all three
  of its walks. PATTERNS.md calls this file the single most important pattern transfer in the phase
  and designates `locks.test.js` an **exact** analog, so the house form won. The stated intent —
  no shelling out, identical behaviour on macOS and the CI runner — is fully met, and the CI run
  confirms it on `ubuntu-latest`.

**3. Assertion count is 18, above both figures the plan gives**
- **Found during:** Task 1
- **Detail:** The plan states "at least 16 passing assertions" in the acceptance criteria and "at
  least 13 assertions" in the verification section. 18 satisfies both. The gap comes from splitting
  SC-4g into two tests (built HTML, then `web/app` source) and SC-2d into two (postcode, then street
  address), which the action text asks for but the counts did not add up.

**4. `actions/checkout` and `actions/setup-node` are `v7`, not the assumed `v4`**
- **Found during:** Task 3
- **Detail:** Research assumption A2 carried `v4` from training data and flagged it unverified.
  `gh api repos/actions/checkout/releases/latest` reports `v7.0.1` and `setup-node` reports `v7.0.0`.
  Pinned to `@v7` for both; the CI run proves both resolve.

---

**Total deviations:** 0 auto-fixed (0 bugs, 0 missing-critical, 0 blocking, 0 architectural)
**Impact on plan:** None on scope or output.

## Issues Encountered

- **The worktree isolation guard refuses compound shell commands** mixing `$( )` substitution with
  loops, pipes or redirects — the plan's SHA-polling verify one-liner could not be run as written.
  Run as plain separate commands instead: `git rev-parse HEAD`, then
  `gh run list --commit <sha> --json …`, then `gh run watch <id> --exit-status`. Same guarantee, and
  the SHA match is still explicit rather than trusting run ordering. 01-02 hit the same guard.
- **`gh run watch` prints a 403 on ANNOTATIONS** with the active `beyondhousecleaning` fine-grained
  PAT — GitHub cannot currently issue a fine-grained PAT with `checks:read`. Cosmetic only: the run
  status, per-job results and `--exit-status` code are all unaffected, and `gh run list --commit`
  independently confirmed `conclusion: success`.
- **A verify one-liner initially failed on `application/ld+json`.** The first draft matched the
  JSON-LD open tag with an escaped regex, so the literal string was absent from the file. Caught by
  the plan's own coverage sweep — which is the sweep working as designed — and fixed by switching to
  a literal `split`. Fixed before Task 1 was committed.

## Known Stubs

None introduced by this plan. No placeholder values, no `TODO`/`FIXME`, no component rendering from
a stubbed data source.

One forward-coupling worth naming, since it is a maintenance edge rather than a stub: the `TOWN`
constant in `check-html-locks.mjs` tracks the scaffold page's town (`Warwick`). When Phase 2 replaces
`web/app/page.jsx` with real templates, that constant moves with it. The comment at its declaration
says so.

## Threat Flags

None. This plan introduced no network endpoint, no auth path and no schema change at a trust
boundary. It added one new trust boundary — the GitHub Actions runner — and mitigated it in the same
commit.

Threat-register dispositions delivered by this plan:

| Threat ID | Disposition | Evidence |
|-----------|-------------|----------|
| T-01-12 | **mitigated** | `permissions: contents: read` at workflow level; no `secrets.` reference anywhere in `ci.yml`; workflow publishes nothing |
| T-01-SC | **mitigated** | `build` installs strictly via `npm ci` from the committed root lockfile; `locks` installs nothing at all, so a compromised registry cannot alter the lock verdict. **Zero package-manager installs occurred in this plan** |
| T-01-13 | **mitigated** | Four negative controls run and passed (A-D above). A check that cannot fail is not a check |
| T-01-14 | **OPEN — stated as such, per the register** | The failing exit code is delivered and proven. D-13 is not fully satisfied until both jobs are **required status checks on `main`** — a repo-admin action owned by Plan 05. Until that lands, CI reports but does not block a merge |
| T-01-15 | **mitigated** | Postcode regex (no comment-stripping) plus `streetAddress` / `"address"` assertions, on every push, over built output — a second independent layer above `locks.test.js`'s source scan |
| T-01-16 | **mitigated** | `noindex` meta and host-level `Disallow: /` both asserted on every push |
| T-01-17 | **mitigated** | D-14b: no `<script src="http` in the built HTML. Adding GTM, GA4 or Trustmary without sign-off now fails CI |
| T-01-18 | **mitigated** | Both scripts import `node:`-prefixed built-ins only, verified by parsing import specifiers rather than by grep; no DOM parser, no size measurement package, no test framework beyond built-in `node:test`; repo still has zero `devDependencies` |

## User Setup Required

**One Sam-gated item is created by this plan and owned by Plan 05:**

- **Mark `locks` and `build` as required status checks on `main`** (Settings → Branches → branch
  protection). Without it, CI runs and reports but does not block a merge — which is the precise
  thing D-13 forbids. Both job names now exist on the remote and are selectable.

Unchanged from earlier plans: **no Vercel project exists for this repo yet** (01-CONTEXT.md Open
Question 3) — Success Criterion 1's "deployed and reachable" half needs Sam to connect the repo with
Root Directory = `web` and Node 22. That is Plan 04.

## Next Phase Readiness

- **Plan 04 (Vercel) is unaffected by this plan and unblocked.** Leave the Vercel Build Command at
  its default `next build`; the gate is here, not there. Pin Vercel's Node setting to **22**, matching
  `ci.yml`.
- **Plan 05 (branch protection) has exactly one thing to do** and both job names to select: `locks`
  and `build`. The register entry T-01-14 stays open until it does.
- **Phase 2 must update two things when it replaces the scaffold page:** the `TOWN` constant in
  `check-html-locks.mjs`, and — if the page's component set changes — the SC-4b…4e class-name
  assertions. All four are single-line edits with named failure messages.
- **Phase 5 inherits the extension point.** The harness now covers 3 of the 11 page-level locks; the
  remaining 8, plus third-party script auditing (Lock 10), image/total page weight including media,
  and Lighthouse/Core Web Vitals, are Phase 5 and are named as out-of-scope in
  `check-budget.mjs`'s header so nobody re-discovers the boundary.
- **Correction to propagate:** the lock suite is **10** tests and the banner width is **79**
  characters. `.planning/PROJECT.md`, `.planning/STATE.md` and `01-CONTEXT.md` D-12 still say 8; the
  plan text says 76. Neither figure should be copied forward.
- No blockers.

## Self-Check: PASSED

All 5 claimed files verified present on disk (`web/scripts/check-html-locks.mjs`,
`web/scripts/check-budget.mjs`, `.github/workflows/ci.yml`, `package.json`, this SUMMARY).
All 3 claimed task commits verified in `git log` (`6218092`, `c49e418`, `0823c38`), and the CI run
`31279392066` verified as `conclusion: success` on `headSha 0823c38`.

---
*Phase: 01-platform-foundation-design-system-integration*
*Completed: 2026-08-08*
