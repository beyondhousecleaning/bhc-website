---
phase: 01-platform-foundation-design-system-integration
plan: 04
subsystem: deploy
tags: [vercel, deployment, root-directory, node-22, deployment-protection, d-03, d-09, d-10, d-15, robots]

# Dependency graph
requires:
  - "01-02: the `web/` Next.js app and the committed root `package-lock.json` Vercel installs from"
  - "01-03: `npm run verify` and the retired-number list in `web/scripts/check-html-locks.mjs`"
  - "01-05: the deliberately-failing `__ci-gate-probe.test.js` had to be gone before `npm run verify` globbed `design-system/test/*.test.js`"
provides:
  - "Vercel project `bhc-website` (`prj_JOjTPePirfNMQUshAioLkqXXBxXY`) — Root Directory `web`, Node 22.x, framework-default build, no custom domain"
  - "A live, publicly reachable deployment at https://bhc-website-nine.vercel.app serving the design system in server-rendered HTML"
  - "D-09 CLOSED: `+447861936533` confirmed by Sam as the number that actually reaches BHC"
  - "D-03 proven by comparison against a recorded DNS baseline, not by assertion"
affects: [phase-02-components, phase-03-programmatic-pages, phase-05-cutover]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vercel project configured via the REST API with the CLI's own credential, so every setting is readable back as JSON and drift is detectable by diff rather than by memory"
    - "Production deployments are promoted from the phase branch by explicit `target: production` on POST /v13/deployments — `link.productionBranch` stays `main`, so no ungated branch silently becomes production"
    - "Verification fetches the live response to a file with `curl -fsS` before grepping, so a bad URL fails loudly instead of feeding grep empty input and faking a pass"

key-files:
  created: []
  modified:
    - web/app/layout.jsx

key-decisions:
  - "Vercel project created by an agent via the REST API rather than by Sam in the dashboard — Sam explicitly authorised this and the CLI was already authenticated as `beyondhousecleaning`"
  - "`nodeVersion` is not accepted by POST /v11/projects (it 400s as an additional property); it is set by a follow-up PATCH /v9/projects/{id}. New projects default to 24.x, so the PATCH is mandatory, not cosmetic"
  - "`link.productionBranch` deliberately left at `main`, not repointed at the phase branch — `main` has no `web/` directory, so an accidental production build from it fails and cannot take the alias"
  - "Vercel Deployment Protection left ON at its default Standard Protection; the production alias is exempt by design, so no `x-vercel-protection-bypass` token was needed and every generated URL is still 302'd to SSO"
  - "D-09 resolved by human confirmation, no code change — the retired numbers stay retired and asserted-against"

patterns-established:
  - "The live deployment is verified against the same assertions as the on-disk build, over the raw HTTP body with no JavaScript executed — three independent surfaces now carry the same D-10/D-15/NAP rules (package source, built artifact, live response)"

requirements-completed: [REQ-nap-consistency]

# Metrics
duration: 20min
completed: 2026-08-09
---

# Phase 01 Plan 04: Vercel Connection and Canonical Number Summary

**Phase 1's one hard external dependency is closed: `bhc-website` is a real Vercel project with Root Directory `web` and Node 22, its production deployment answers `200` at https://bhc-website-nine.vercel.app carrying all six design-system components, one correct `tel:` link and three JSON-LD blocks in raw server-rendered HTML with no JavaScript executed — while `www.beyondhousecleaning.com` still resolves byte-for-byte to the Webflow baseline captured before any of it started, and Sam has confirmed `+447861936533` is the number that reaches the business.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-08-09T13:52Z
- **Completed:** 2026-08-09T14:12Z
- **Tasks:** 3 (2 pre-resolved human gates, 1 auto)
- **Files:** 1 modified (a comment-only Rule 3 fix; the two files in `files_modified` are untouched, as the confirmed-number path requires)

## Human Gates — Both Pre-Resolved by Sam

Neither gate was re-paused on. Both were answered by Sam through the orchestrator before execution began, and both answers are recorded here so the cutover phase does not re-ask.

| Gate | Sam's answer | Consequence |
|------|--------------|-------------|
| **Task 1 — the Vercel project** | "Create it yourself via the Vercel CLI" | The project was created by this agent. `npx vercel whoami` → `beyondhousecleaning`, already authenticated. |
| **Task 3 — the canonical number** | **"`+447861936533` IS the number that reaches BHC"** | No-change path taken. `NAPFooter.jsx` untouched; the retired list in `check-html-locks.mjs` unextended. **D-09 is closed.** |

## Accomplishments

- **Success Criterion 1 is met in the strong sense.** Not "a build succeeded somewhere" — a specific
  public URL returns `200` and its raw HTTP body carries `bhc-hero__heading`,
  `bhc-breadcrumbs__list`, `bhc-rating__value`, `bhc-interlink__list`, `bhc-btn--primary` and
  `class="bhc-footer__phone"`. No browser, no headless runner, no JavaScript. That is what makes it
  proof of server rendering rather than a smoke test.
- **D-03 is proven, not asserted.** The apex DNS was captured to `/tmp/bhc-apex-baseline.txt`
  *before* the Vercel project existed and re-read after the deployment was promoted. Identical both
  times, and `https://www.beyondhousecleaning.com` still returns `HTTP/2 200` from Webflow. The
  Vercel project has exactly one domain and it is the auto-assigned `*.vercel.app`.
- **D-10 and D-15 now hold on a third, independent surface.** They were already enforced against the
  package source (`locks.test.js`) and the built artifact (`check-html-locks.mjs`). They are now
  verified against the live HTTP response — the only surface a search engine or a member of the
  public can actually reach.
- **Deployment Protection turned out to be the strongest available configuration by default.** Every
  generated and branch URL 302s to Vercel SSO; only the production alias is public. So the
  pre-cutover build is publicly *verifiable* at exactly one address and publicly *discoverable* at
  none — with `noindex` and `Disallow: /` on top of that.
- **No custom domain, no DNS change, nothing installed.** Zero package-manager installs.

## The Deployment

**Live URL: <https://bhc-website-nine.vercel.app>** (written to `/tmp/bhc-deploy-url`)

| Field | Value |
|-------|-------|
| Vercel project | `bhc-website` |
| Project ID | `prj_JOjTPePirfNMQUshAioLkqXXBxXY` |
| Vercel account | `beyondhousecleaning` (`admin@beyondhousecleaning.com`) |
| Git link | `github.com/beyondhousecleaning/bhc-website`, repoId `1325091264` |
| Deployed commit | `08a6cde2cc9cfdd8cf5a2c9109ebde50550b7e51` on `worktree-phase-1-platform-foundation` |
| Deployment ID | `dpl_3ivsH7fAieQxrEikHRCrzBN2uzw8` (`READY` / `PROMOTED`) |

Two production deployments were promoted, the second because Task 3's fix moved the branch tip and
the live URL should serve the branch's final state rather than an intermediate commit:

| # | Commit | Deployment | Build time | Result |
|---|--------|-----------|-----------|--------|
| 1 | `fe45b8a` | `dpl_CLzsCnPFYccrj3VdtsUUAEyNjKq9` | **17.2 s** | READY, PROMOTED |
| 2 | `08a6cde` | `dpl_3ivsH7fAieQxrEikHRCrzBN2uzw8` | **10.0 s** | READY, PROMOTED — **this is what is live** |

Confirmed live by `data-dpl-id="dpl_3ivsH7fAieQxrEikHRCrzBN2uzw8"` in the served HTML.

## Vercel Project Settings — Exact API Readback

`GET /v9/projects/prj_JOjTPePirfNMQUshAioLkqXXBxXY`, recorded verbatim so T-01-22 (settings drift
outside version control) is detectable later by comparison rather than by memory:

```json
{"id":"prj_JOjTPePirfNMQUshAioLkqXXBxXY","name":"bhc-website","framework":"nextjs",
 "rootDirectory":"web","nodeVersion":"22.x","buildCommand":null,"installCommand":null,
 "outputDirectory":null,"devCommand":null,
 "ssoProtection":{"deploymentType":"all_except_custom_domains"},"passwordProtection":null,
 "link":{"type":"github","org":"beyondhousecleaning","repo":"bhc-website","productionBranch":"main"}}
```

| Setting the plan pinned | Required | Configured | ✓ |
|---|---|---|---|
| Root Directory | `web` | `web` | ✅ |
| Node.js version | 22 | `22.x` | ✅ |
| Framework preset | auto-detected Next.js | `nextjs` | ✅ |
| Build Command | framework default | `null` (⇒ `next build`) | ✅ |
| Install Command | framework default | `null` | ✅ |
| Output Directory | framework default | `null` | ✅ |
| Custom domain | **none** (D-03) | none — see below | ✅ |
| Lock tests chained into the Vercel build | **no** (Pitfall 4) | no — `buildCommand` is `null`, contains no `..` | ✅ |

`GET /v9/projects/{id}/domains` returns exactly one entry:

```json
[{"name":"bhc-website-nine.vercel.app","apexName":"vercel.app","verified":true,"gitBranch":null}]
```

No custom domain. D-03's procedural control held.

## Deployment Protection — Recorded, Because Task 2 Depended On It

**Vercel Deployment Protection is ENABLED**, at the default *Standard Protection*
(`ssoProtection.deploymentType = "all_except_custom_domains"`). It was not disabled.

Measured, per-URL:

| URL | Status | Meaning |
|-----|--------|---------|
| `https://bhc-website-nine.vercel.app` (production alias) | **200** | public — this is the verification target |
| `https://bhc-website-3y9len4gs-beyond-house-cleaning.vercel.app` (generated) | **302** → `vercel.com/sso-api?...` | protected |
| `https://bhc-website-beyond-house-cleaning.vercel.app` (team alias) | **302** → SSO | protected |
| `https://bhc-website-git-worktree-phase-1-p-631469-...vercel.app` (branch alias) | **302** → SSO | protected |

**Consequence for Task 2: no `x-vercel-protection-bypass` header was needed, and no bypass token was
created.** The plan warned not to misread a 401 as a broken deployment; the inverse also had to be
checked and was — the production alias is exempt from Standard Protection because it *is* the
project's production domain, so its `200` is a genuine public fetch and not an artefact of an
authenticated session. The 302s above are the control proving protection is actually on rather than
silently off.

Net effect: the pre-cutover build is reachable at exactly one address, carries `noindex` on every
page and `Disallow: /` at host level, and every other address it has is behind SSO.

## Live Verification — Full Output

All checks below ran against the promoted deployment `dpl_3ivsH7fAieQxrEikHRCrzBN2uzw8`, over the
raw HTTP response body, with **no JavaScript executed**.

```
http_code=200
live HTML OK — all assertions pass
  tel href      : +447861936533
  phone label   : +44 7861 936533
  ld+json blocks: 3
  <footer> count: 1
  <h1> count    : 1
  bytes         : 23513

robots_http_code=200
D-15 crawl block served
postcode_grep_exit=1
address_grep_exit=1
external_script_grep_exit=1
```

| # | Assertion | Source | Result |
|---|-----------|--------|--------|
| 1 | deployment returns `200` | `curl -w '%{http_code}'` | **200** |
| 2 | `bhc-hero__heading` present | live body | ✅ |
| 3 | `bhc-breadcrumbs__list` present | live body | ✅ |
| 4 | `bhc-rating__value` present | live body | ✅ |
| 5 | `bhc-interlink__list` present | live body | ✅ |
| 6 | `bhc-btn--primary` present | live body | ✅ |
| 7 | `class="bhc-footer__phone"` present | live body | ✅ |
| 8 | exactly one `href="tel:` | live body | **1** — `tel:+447861936533` |
| 9 | href digits == label digits (leading `44` stripped) | live body | **equal** — `7861936533` both sides |
| 10 | none of `07441918832` / `447441918832` / `447575709361` | live body | **none** |
| 11 | exactly three `<script type="application/ld+json"` | live body | **3** |
| 12 | `name="robots"` meta whose content includes `noindex` | live body | ✅ `content="noindex, nofollow"` |
| 13 | UK postcode regex does not match | live body | **no match** (grep exit 1) |
| 14 | no `streetAddress` | live body | **absent** |
| 15 | no `"address"` JSON key | live body | **absent** |
| 16 | exactly one `<footer` | live body | **1** |
| 17 | exactly one `<h1` | live body | **1** |
| 18 | no `<script src="http` external origin (D-14b) | live body | **none** |
| 19 | no injected Vercel analytics/insights script | live body | **none** — `_vercel` does not appear |
| 20 | `/robots.txt` returns 200 | live | **200** |
| 21 | `/robots.txt` (comments stripped) has `Disallow: /` | live | ✅ |
| 22 | `/robots.txt` (comments stripped) has `User-agent: *` | live | ✅ |
| 23 | `/robots.txt` contains no `Allow:` line | live | **0 matches** |

Checks 13 and 14 follow the plan's `<verification>` note exactly: the body was fetched to a file
with `curl -fsS` **first**, so a bad URL would have failed loudly rather than handing grep empty
input and manufacturing a vacuous pass.

### Live response vs. the local build

The live HTML is **23,513 bytes**; the local `web/.next/server/app/index.html` is **23,370**. Not a
discrepancy and not a content difference — the Vercel builder emits immutable assets under
`/_next/static/immutable/chunks/…` where the local build writes `/_next/static/chunks/…`, and the
content hashes differ between the two builds. Every semantic assertion above passes identically on
both. Byte-equality was never the criterion; string equivalence of the rendered markup is, and it
holds.

## D-03 — The Live Site Is Untouched

Baseline captured **before** the Vercel project was created, then re-read after the deployment was
promoted:

| | `dig +short www.beyondhousecleaning.com` |
|---|---|
| Baseline (`/tmp/bhc-apex-baseline.txt`, pre-Vercel) | `cdn.webflow.COM.` → `198.202.211.1` |
| After deployment | `cdn.webflow.COM.` → `198.202.211.1` |

**Identical.** `dig +short beyondhousecleaning.com` → `198.202.211.1` (Webflow), and
`curl -sSI https://www.beyondhousecleaning.com` → `HTTP/2 200`. No Vercel address appears anywhere in
the resolution chain. Nothing in this plan touched DNS, and the Vercel project has no custom domain
to touch it with.

## D-09 — The Canonical Number, Confirmed

**Sam confirmed `+447861936533` is the number that actually reaches Beyond House Cleaning.**
Confirmed 2026-08-09, human-verified, not inferred from code.

The no-change path was therefore taken, exactly as the plan specifies:

| | Required on the confirmed path | Actual |
|---|---|---|
| `design-system/src/components/NAPFooter/NAPFooter.jsx` | untouched | **untouched** — `git status` clean for this path |
| `web/scripts/check-html-locks.mjs` | untouched; retired list unextended | **untouched** — still `['07441918832','447441918832','447575709361']` at line 86 |

`07441918832` and `+447575709361` remain retired and remain asserted-against on every push.

Pre-confirmation assertions, all run:

| Check | Result |
|-------|--------|
| exactly one `phone = '<number>'` default in `NAPFooter.jsx` | ✅ **1** — `+447861936533` |
| no `phone =` assignment anywhere under `web/app` | ✅ none |
| no literal UK phone number anywhere under `web/app` | ✅ none *(after the Rule 3 fix below)* |
| the single `tel:` in the built HTML dials the package default | ✅ `+447861936533` |
| `design-system/test/__ci-gate-probe.test.js` absent when `npm run verify` ran | ✅ absent; `design-system/test/` contains only `locks.test.js` |
| `npm run verify` | ✅ **exit 0** — 10/10 lock tests, 18/18 HTML locks, 168.5 KB / 500 KB JS, 191.3 KB / 1024 KB page |

## Task Commits

Tasks 1 and 2 mutated no tracked file — Task 1 is a Vercel account action (evidence is the API
readback above) and Task 2 is read-only verification. Task 3 took the confirmed, no-change path; its
single commit is the Rule 3 fix described below, not a phone-number change.

1. **Task 1** — no repository mutation. Vercel project `prj_JOjTPePirfNMQUshAioLkqXXBxXY` created and two production deployments promoted.
2. **Task 2** — no repository mutation. Read-only live verification.
3. **Task 3** — `08a6cde` (docs): keep retired phone digits out of `web/app` comments.

Branch pushed: `fe45b8a..08a6cde`. **CI run `31317442122` on `08a6cde`: `success`** — `locks` success, `build` success. No merge or push to `main` was attempted.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Task 3's own `web/app` gate failed on a doc comment, not on a defect**

- **Found during:** Task 3, at the pre-confirmation assertion run
- **Issue:** The plan's second Task 3 `<verify>` command walks `web/app` and rejects any file matching
  `/\+?44\d{9,}|\b07\d{9}\b/`. `web/app/layout.jsx` lines 9-10 failed it — the root layout's header
  comment quoted both retired numbers verbatim (`07441918832` and `+447575709361`) in order to
  explain the live Webflow display-vs-dial bug that `NAPFooter`'s single-input design exists to make
  unexpressible. This was **not** a code defect: there is no `phone =` assignment in the app, the
  built HTML has never contained either number, and all 18 built-HTML locks and the live response
  were clean of them throughout. It is the identical *documentation-versus-gate collision* 01-02
  recorded for `use client` / the token stylesheet, arriving through a gate 01-02's greps did not
  cover — its checks were scoped to those two substrings, and `check-html-locks.mjs` reads built
  output, where comments are already stripped.
- **Why fixed rather than waived:** the phase's stated invariant is that no literal UK number lives
  anywhere under `web/app`. Waiving it would have left that invariant nearly-true and a latent
  trip-wire for any future source-level gate — and STATE.md already carries 01-02's explicit rule
  that explanatory comments must not contain the substring they describe.
- **Fix:** reworded the comment to name the divergence without the digits, and to point at
  `web/scripts/check-html-locks.mjs`, which enumerates the retired list **once**, as constants, and
  asserts it never reaches built output. The explanation is preserved; the literals now live in
  exactly one file, and that file is the one enforcing them.
- **Files modified:** `web/app/layout.jsx` (comment-only: 8 insertions, 3 deletions; no markup,
  import, metadata or behaviour change)
- **Scope note:** `web/app/layout.jsx` is **not** in this plan's `files_modified`, which declares only
  the two conditional Task 3 write-path files. Recorded explicitly rather than folded in silently.
  Both declared files remain untouched, which is what the confirmed-number path requires.
- **Commit:** `08a6cde`

### Clarifications (no code impact)

**2. `POST /v11/projects` rejects `nodeVersion`, and new projects default to Node 24**

- **Found during:** Task 1
- **Detail:** Passing `nodeVersion` at creation returns
  `400 bad_request: "Invalid request: should NOT have additional property nodeVersion."` The project
  was created without it and came back **`"nodeVersion": "24.x"`** — Vercel's current default, three
  majors above the pin `ci.yml` uses. A follow-up `PATCH /v9/projects/{id}` with `{"nodeVersion":"22.x"}`
  set it. **The PATCH is mandatory, not cosmetic:** creating the project alone would have left it on
  24.x, silently diverging from CI. Worth knowing for anyone re-creating this project.

**3. `link.productionBranch` is `main`, and the production deployments came from the phase branch anyway**

- **Found during:** Task 1
- **Detail:** Vercel set `productionBranch: "main"` at creation. It was deliberately left there
  rather than repointed at `worktree-phase-1-platform-foundation`. Production deployments were
  promoted by passing `target: "production"` explicitly on `POST /v13/deployments` with
  `gitSource.ref` set to the phase branch, which is what the CLI's `--prod` does. Rationale: `main`
  currently has no `web/` directory (Phase 1 lives entirely on the phase branch), so a Vercel build
  triggered from `main` fails at the Root Directory step and a failed deployment never takes the
  alias — the live URL cannot be silently clobbered. When Phase 1 merges, `main` becomes the correct
  production source with no settings change needed. **Operational consequence to know:** pushes to
  the phase branch now produce *preview* deployments (SSO-protected), not production ones; the
  production alias stays pinned until something is explicitly promoted.

**4. The Vercel build is faster than the plan's "well under a minute" expectation**

- **Detail:** 17.2 s cold, 10.0 s warm, both including `npm ci` from the workspace root and
  `next build`. The build log path the plan predicted — npm installing from the workspace root, then
  `next build` prerendering `/` as static content — is what ran.

---

**Total deviations:** 1 auto-fixed (0 bugs, 0 missing-critical, 1 blocking, 0 architectural)
**Impact on plan:** None on scope or output. Both `files_modified` entries are untouched, as the
confirmed-number path requires. One file outside `files_modified` received a comment-only fix,
declared above.

## Issues Encountered

- **The worktree isolation guard refused the plan's `<verify>` one-liners as written.** Commands of
  the form `DEPLOY_URL=$(cat …); curl -sS -o /tmp/… -w "…" "$DEPLOY_URL" | grep -q '^200$' && echo …`
  combine substitution, redirection and a pipe, and are rejected as unverifiable. Run as plain
  separate commands with the URL substituted literally — same guarantee. 01-02, 01-03 and 01-05 all
  hit the same guard; it is now a standing property of this worktree, not a one-off.
- **The Vercel CLI credential is at `~/Library/Application Support/com.vercel.cli/auth.json` on
  macOS**, not `~/.local/share/com.vercel.cli/`. `jq` against the wrong path fails silently enough
  that `curl` then sends `Bearer null` and the API returns a null-shaped body rather than an error.
- **`grep -c '<script'` on the live HTML returns `1`, not the script-tag count.** The response is a
  single line, and `-c` counts matching *lines*. Any future count assertion on this HTML must use
  `grep -o … | wc -l` or a `match()` in Node, as the assertion script does.

## Known Stubs

None introduced by this plan. The one carried-forward stub is unchanged and still sanctioned:
`web/app/page.jsx`'s scaffold copy and its three interlink URLs pointing at
`/location/<region>/<town>/<service>` routes that do not exist until Phase 3 (recorded in
01-02-SUMMARY.md § Known Stubs, sanctioned by 01-CONTEXT.md § Claude's Discretion).

That scaffold is now **publicly reachable** at the production alias. It is protected from the only
consequence that matters by the two D-15 controls verified live above: `noindex, nofollow` on every
page and a host-level `Disallow: /`.

## Threat Flags

None. This plan added no code path, no endpoint, no auth surface and no schema. It made an existing,
already-audited build publicly reachable at one address — the trust boundary the plan's own register
already names and dispositions.

Threat-register dispositions delivered by this plan:

| Threat ID | Disposition | Evidence |
|-----------|-------------|----------|
| T-01-19 | **mitigated, and more strongly than planned** | `noindex, nofollow` and `/robots.txt → Disallow: /` both verified *as served*, not merely on disk. On top of that, Deployment Protection is ON: the generated, team and branch URLs all 302 to Vercel SSO, so the build is discoverable at no address at all and verifiable at exactly one |
| T-01-20 | **mitigated** | The verbatim Lock 5 UK-postcode regex, plus `streetAddress` and `"address":`, all run against the live HTTP response body and all clean. The loop 01-03 opened on disk is now closed on the wire |
| T-01-21 | **mitigated** | DNS baseline recorded pre-Vercel and re-read post-deployment: identical. Apex still Webflow, `HTTP/2 200`. Project has exactly one domain and it is `*.vercel.app`. No DNS operation was performed at any point |
| T-01-22 | **mitigated** | All eight settings that matter are recorded above as verbatim API JSON, so drift is detectable by diff. The two settings that do *not* default correctly — `nodeVersion` (defaults 24.x) and `rootDirectory` (defaults null) — are called out by name |
| T-01-23 | **mitigated** | Escalated to a human as designed; Sam confirmed `+447861936533` reaches the business. Retired numbers stay asserted-against in `check-html-locks.mjs` |
| T-01-SC | **accepted, N/A** | Zero package-manager installs by this plan. The Vercel build installed from the committed `package-lock.json` audited in 01-02 (`npm ci`, `found 0 vulnerabilities`) |

## User Setup Required

**Nothing outstanding.** Both of this plan's human gates are closed, and with them the last two open
items in Phase 1:

- The Vercel project exists, is correctly configured and is deployed. Sam can see it at
  <https://vercel.com/beyond-house-cleaning/bhc-website>.
- The canonical number is confirmed.

One thing worth Sam knowing rather than doing: **the repository is public and the deployment is now
publicly reachable at <https://bhc-website-nine.vercel.app>.** It is blocked from indexing at two
levels, but it is not secret.

## Next Phase Readiness

- **Phase 1 is functionally complete.** All five plans are done; every success criterion is either
  mechanically asserted in CI or verified live above.
- **Phase 2 inherits a working deploy loop.** To ship a change: commit to the phase branch, push,
  then promote with `target: "production"` on `POST /v13/deployments`. Preview deployments are
  SSO-protected, so any external verification must target the production alias or carry a bypass
  token.
- **Phase 2 must not add a custom domain.** D-03 holds until the cutover phase, which no phase
  currently owns.
- **Phase 5 (cutover) inherits three concrete things:** (1) the D-09 answer, so it does not re-ask;
  (2) the exact settings JSON above, so a drift check is a diff; (3) two D-15 controls to flip
  together — `robots: { index: false, follow: false }` in `web/app/layout.jsx` and
  `web/public/robots.txt`. Flipping only one leaves the site uncrawlable.
- **Correction still to propagate (third restatement, still unfixed in the docs):** the lock suite is
  **10** tests and the section-banner width is **79** characters. `.planning/PROJECT.md`,
  `.planning/STATE.md` and `01-CONTEXT.md` D-12 still say 8; plan text says 76.
- **One new standing note:** any future source-level gate over `web/app` must be run against the
  comments as well as the code. This plan's Rule 3 fix is the second instance of that collision in
  the phase; both were documentation, neither was a defect, and both cost time to distinguish.
- No blockers.

## Self-Check: PASSED

- `web/app/layout.jsx` verified present and modified; `git diff --numstat` showed exactly one file.
- `design-system/src/components/NAPFooter/NAPFooter.jsx` and `web/scripts/check-html-locks.mjs`
  verified **unmodified** — `git status --short` listed neither.
- Commit `08a6cde` verified in `git log` and on `origin/worktree-phase-1-platform-foundation`.
- CI run `31317442122` verified `conclusion: success` on `headSha 08a6cde…`, both jobs green.
- Vercel project `prj_JOjTPePirfNMQUshAioLkqXXBxXY` verified via `GET /v9/projects/{id}`:
  `rootDirectory: "web"`, `nodeVersion: "22.x"`, `buildCommand: null`, one `*.vercel.app` domain.
- Deployment `dpl_3ivsH7fAieQxrEikHRCrzBN2uzw8` verified `READY`/`PROMOTED` and verified live by its
  `data-dpl-id` in the served HTML.
- `/tmp/bhc-deploy-url` verified non-empty and holding the production alias.
- This SUMMARY verified present at
  `.planning/phases/01-platform-foundation-design-system-integration/01-04-SUMMARY.md`.

---
*Phase: 01-platform-foundation-design-system-integration*
*Completed: 2026-08-09*
