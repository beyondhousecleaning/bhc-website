---
phase: 1
slug: platform-foundation-design-system-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `01-RESEARCH.md` § Validation Architecture (measured, not assumed).

**Governing principle for this phase:** every assertion except the Vercel URL check reads the
static HTML `next build` writes to disk (`web/.next/server/app/index.html`). That is deliberate —
it proves output is *server-rendered* without running a browser, which is exactly what CI Locks 3
and 9 exist to guarantee.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` (Node built-in) + `node:assert/strict` — **zero dependencies**, per D-12 |
| **Config file** | none (deliberate — do not add a test framework) |
| **Quick run command** | `node --test design-system/test/*.test.js` |
| **Full suite command** | `npm run test:locks && npm run build -w @bhc/web && node web/scripts/check-html-locks.mjs && node web/scripts/check-budget.mjs` |
| **Estimated runtime** | ~80 ms quick · ~30–60 s full (dominated by `next build`) |
| **Exit-code gating** | **Verified in research** — exits 0 on 8/8 pass, exits 1 when any test fails |

---

## Sampling Rate

- **After every task commit:** `node --test design-system/test/*.test.js` (~80 ms, no install)
- **After every plan wave:** full suite command above
- **Before `/gsd:verify-work`:** full suite green in GitHub Actions **as a required status check**,
  plus the Vercel deployment URL confirmed reachable
- **Max feedback latency:** ~80 s

---

## Per-Task Verification Map

Task IDs are assigned when plans are written; this table is keyed by success criterion so the
planner can attach each row to the task that delivers it. Every row below is automated except
where marked **manual**.

| ID | Success Criterion / Decision | Behaviour | Test Type | Automated Command / Assertion | File Exists | Status |
|----|------|-----------|-----------|-------------------------------|-------------|--------|
| SC-1a | SC 1 | `next build` succeeds from a clean checkout, no design-system build step | build | `npm ci && npm run build -w @bhc/web` | ❌ W0 | ⬜ pending |
| SC-1b | SC 1 | Built CSS carries the design tokens (proves "built from `tokens.css`") | integration | assert `--bhc-ink` present in `web/.next/static/chunks/*.css` | ❌ W0 | ⬜ pending |
| SC-1c | SC 1 | Deployed and reachable at a live Vercel URL | **manual** | `curl -sf <deployment-url> \| grep -q bhc-hero__heading` — **blocked on Sam connecting the Vercel project** | ❌ human | ⬜ pending |
| SC-2a | SC 2 / REQ-nap-consistency / Lock 4 | Exactly one `tel:` in rendered HTML | integration | `(html.match(/href="tel:/g) \|\| []).length === 1` | ❌ W0 | ⬜ pending |
| SC-2b | SC 2 / REQ-nap-consistency / Lock 4 | `tel:` href digits equal displayed digits | integration | extract `href="tel:X"` + `bhc-footer__phone` label; assert normalised digits equal | ❌ W0 | ⬜ pending |
| SC-2c | SC 2 / D-09 | Neither retired number appears anywhere | integration | HTML contains neither `07441918832`/`447441918832` nor `447575709361` | ❌ W0 | ⬜ pending |
| SC-2d | SC 2 / D-10 / Lock 5 | No UK postcode or street address in rendered output | integration | UK-postcode regex does **not** match the HTML (incl. inside JSON-LD) | ❌ W0 | ⬜ pending |
| SC-2e | SC 2 / D-11 | Exactly one `<footer>` per page | integration | `(html.match(/<footer/g) \|\| []).length === 1` | ❌ W0 | ⬜ pending |
| SC-2f | SC 2 / Lock 4 unit | `formatPhone`/`toDial` derivation holds | unit | `node --test design-system/test/locks.test.js` | ✅ **passing 8/8** | ✅ green |
| SC-3a | SC 3 / D-12 | Lock tests execute in CI | ci | `node --test design-system/test/*.test.js` as a GitHub Actions job | ❌ W0 | ⬜ pending |
| SC-3b | SC 3 / D-13 | A lock failure **fails the build** | ci | verified locally (injected failing test → exit 1); in CI confirm via throwaway failing commit, then revert. **Also needs the job set as a required status check** | ❌ W0 + human | ⬜ pending |
| SC-4a | SC 4 / Lock 1 | Hero renders → exactly one `<h1>` carrying the keyword line | integration | one `<h1` present, contains the town name | ❌ W0 | ⬜ pending |
| SC-4b | SC 4 / Lock 2 | Breadcrumbs render → visible trail + `BreadcrumbList` JSON-LD | integration | `bhc-breadcrumbs__list` and `"@type":"BreadcrumbList"` in HTML | ❌ W0 | ⬜ pending |
| SC-4c | SC 4 / Lock 3 | RatingBadge renders server-side | integration | `bhc-rating__value">4.9` present in static HTML | ❌ W0 | ⬜ pending |
| SC-4d | SC 4 / Lock 6 precursor | InterlinkBlock renders | integration | `bhc-interlink__list` present | ❌ W0 | ⬜ pending |
| SC-4e | SC 4 | Button renders from the package | integration | `bhc-btn--primary` present | ❌ W0 | ⬜ pending |
| SC-4f | SC 4 / Lock 9 | All JSON-LD server-rendered, none client-injected | integration | 3 × `<script type="application/ld+json">` in the **file on disk** | ❌ W0 | ⬜ pending |
| SC-4g | D-07 | Zero client components | integration | no `use client` in HTML and none in `web/app/**` | ❌ W0 | ⬜ pending |
| D-14 | D-14 / D-14a | Performance budget holds (**transfer weight**) | integration | `node web/scripts/check-budget.mjs` — gzip, <500 KB JS, <1 MB page | ❌ W0 | ⬜ pending |
| D-14b | D-14 | No third-party script imported | integration | no external-origin `<script src="http…` in the HTML | ❌ W0 | ⬜ pending |
| D-15 | D-15 | Vercel deployment is not indexable pre-cutover | integration | served `robots.txt` contains `Disallow: /` (or equivalent noindex) | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Test infrastructure that must exist before the assertions above can run. The repo currently has
**no CI and no root `package.json`**.

- [ ] `package.json` (repo root) — `workspaces: ["web","design-system"]` + a `test:locks` script
- [ ] `web/package.json`, `web/next.config.mjs`, `web/app/layout.jsx`, `web/app/page.jsx` — the app
- [ ] `web/scripts/check-html-locks.mjs` — SC-2a…2e, SC-4a…4g, D-14b, D-15. Zero-dependency,
      mirroring the existing `locks.test.js` style
- [ ] `web/scripts/check-budget.mjs` — the D-14/D-14a transfer-weight gate
- [ ] `.github/workflows/ci.yml` — the gate itself
- [ ] `design-system/package.json` — add `"./fonts/*"` to `exports`, `"fonts"` to `files`
      (required; without it the font import fails `ERR_PACKAGE_PATH_NOT_EXPORTED`)
- [ ] `design-system/src/jsonLd.js` + call-sites — JSON-LD escaping (see Security note below)
- [ ] Framework install: **none needed** — `node --test` is built in (D-12)

---

## Manual-Only Verifications

| Behaviour | Requirement | Why Manual | Test Instructions |
|-----------|-------------|------------|-------------------|
| Live Vercel URL reachable | SC 1 | No Vercel project exists for this repo; an agent cannot create/authorise one | Sam connects the repo in Vercel, sets **Root Directory = `web`**, then `curl -sf <url> \| grep -q bhc-hero__heading` |
| CI job is a **required** status check | SC 3 / D-13 | Branch-protection settings are a GitHub repo admin action | In repo Settings → Branches, mark the CI job required. Without this, CI runs but does not gate — which D-13 forbids |
| Canonical phone number is correct | REQ-nap-consistency | Code cannot know which number actually reaches BHC | Sam confirms `+447861936533` is live. One-line constant change if not |

---

## Security Note (carried from research)

`NAPFooter` (and any component emitting JSON-LD) interpolates values into
`dangerouslySetInnerHTML` via `JSON.stringify`. That is unsafe against a `</script>` sequence in
any interpolated value. Research recommends a shared `design-system/src/jsonLd.js` escaping
helper applied at all JSON-LD call-sites. Keep it in `.js`, not `.jsx` — the `claude-seo` hook
blocks `.jsx` writes containing `.replace(`.

Low exploitability today (all values are hardcoded), but every later phase feeds
*data-file-driven* town and service names into these same components at ~336-page scale, so
fixing it in Phase 1 is materially cheaper than after Phase 3.

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify or a declared Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without an automated verify
- [ ] Wave 0 covers every ❌ reference above
- [ ] No watch-mode flags in any command
- [ ] Feedback latency < 80 s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
