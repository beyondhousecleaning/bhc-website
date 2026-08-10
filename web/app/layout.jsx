/**
 * Root layout — Beyond House Cleaning
 *
 * LOCK 4 / D-08 / D-11: exactly one tel: inside <footer>, at most four per
 *         page, and every href's digits MUST equal the displayed digits.
 * LOCK 5 / D-10: no street address and no UK postcode in rendered output.
 * D-15:   the pre-cutover deployment must not be indexable.
 *
 * The live Webflow site DISPLAYS one number and DIALS a different one on all
 * 115 pages, with a third number on /get-a-quote. The exact retired digits are
 * enumerated ONCE, in web/scripts/check-html-locks.mjs's retired list, which
 * asserts they never reach built output — they are deliberately not written
 * here, because a literal UK number anywhere under web/app is itself a second
 * place the number can be wrong, and this plan's gate greps this directory for
 * exactly that. That divergence between display and href is only expressible
 * when the two are separate inputs. Every phone-bearing component in the
 * package derives both from a single `phone` prop that defaults to the one
 * value in src/phone.js, and this layout passes NO `phone` prop to any of them
 * — not to Header, not to Footer, not to StickyCallBar. An app-side restatement
 * would be a second place the number can be wrong, which is the exact defect
 * REQ-nap-consistency exists to kill.
 * (.design-sync/previews/ does pass one — those are prop demos, not app
 * guidance.)
 *
 * THE BODY SHAPE, AND WHY IT IS THIS ORDER (UI-SPEC §9.1 / §10):
 *
 *   SkipLink        first, so it is the FIRST focusable element on the page —
 *                   WCAG 2.4.1 is not satisfied by a bypass link that arrives
 *                   after the navigation it bypasses.
 *   Header          one <header>, one <nav aria-label="Primary">.
 *   main#main       the skip-link target. `tabIndex={-1}` renders as
 *                   tabindex="-1" and is what actually MOVES FOCUS in Safari
 *                   and Chrome; without it both browsers scroll the viewport
 *                   and leave focus in the header, so the link appears to work
 *                   and does not.
 *   Footer          the ONE <footer> on every page — see below.
 *   StickyCallBar   fixed, below 768px only; CSS-gated, never conditionally
 *                   rendered, which is what keeps the whole page a server
 *                   render.
 *
 * ONE FOOTER SHAPE, NOT TWO. `Footer` is a composition layer that emits no
 * landmark of its own and renders exactly one footer component internally. This
 * layout renders `<Footer/>` and nothing else footer-shaped, ever. Rendering
 * both the composition layer and the component it wraps would put TWO <footer>
 * landmarks on all 18 pages and fail delta 5 everywhere at once. That is what
 * makes D-11 structural rather than a convention someone has to remember, and
 * it is what the "exactly one <footer>" assertion checks.
 *
 * `areaServed` AND `hours` ARE THREADED THROUGH `Footer` ON PURPOSE, AND THIS
 * IS NOT TIDYING. The footer component emits `areaServed` City nodes into the
 * sitewide HomeAndConstructionBusiness JSON-LD ONLY when the array it receives
 * is non-empty, and `Footer` forwards the prop UNDEFAULTED. Drop
 * `areaServed={AREA_SERVED}` below and all 18 pages silently lose `areaServed`
 * from their structured data with a fully green CI: nothing in the lock harness
 * counts City nodes, and the JSON-LD BLOCK count is unchanged because
 * `areaServed` is a property rather than a block. ROADMAP Phase 5 SC-1
 * explicitly requires LocalBusiness + `areaServed`, so the loss would surface
 * three phases later as a ranking defect with no failing test pointing at its
 * cause. `HOURS` travels with it so the pair cannot drift.
 *
 * This is also the ONLY file in the app that imports CSS.
 */

/* fonts.css is genuinely NOT in styles.css's import closure — styles.css:6 is
   its only @import and it pulls in the token layer. That is precisely why
   Plan 01's exports-map fix (`./fonts/*`) exists. Never import the token
   stylesheet directly alongside styles.css: doing so emits the entire token
   block twice. The CI gate for that is a plain substring grep over web/app,
   so the token subpath is not named in prose here either. */
import '@bhc/design-system/fonts/fonts.css';
import '@bhc/design-system/styles.css';

import { Footer, Header, SkipLink, StickyCallBar } from '@bhc/design-system';

import { FOOTER_COLUMNS, LEGAL, NAV } from '@/content/nav.js';
import { AREA_SERVED, HOURS } from '@/content/site.js';

export const metadata = {
  /* `.com`, not `.co.uk`. PROJECT.md's opening line is a typo; the live
     sitemap, 120 doc occurrences and the package's own SITE constant agree. */
  metadataBase: new URL('https://www.beyondhousecleaning.com'),
  title: 'Beyond House Cleaning — cleaners in Warwickshire & Coventry',
  /* D-15 — emits <meta name="robots" content="noindex, nofollow"> into every
     page's server-rendered HTML. This is the assertable half of the crawl
     block; web/public/robots.txt is the host-level half.

     This DELIBERATELY differs from ROADMAP Phase 5's "robots.txt allows
     crawling" criterion. The two apply to different hosts — this is the
     pre-cutover Vercel deployment, that is the production apex — and the live
     Webflow site holds all 95 pages' ranking equity until cutover flips it. */
  robots: { index: false, follow: false },
};

/* §5's CTA table: `Get a Free Quote` as a primary Button in the Header, on
   every page. This is the one thing that supplies a sitewide primary CTA, and
   it is what empties check-html-locks.mjs's NO_PRIMARY_CTA_YET set. */
const HEADER_CTA = { label: 'Get a Free Quote', href: '/get-a-quote' };

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        {/* First inside <body>, before Header. See the file header. */}
        <SkipLink />

        {/* No `phone` prop — the one number arrives from the package. */}
        <Header nav={NAV} cta={HEADER_CTA} />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        {/* No `phone` prop. AREA_SERVED and HOURS are load-bearing for the
            sitewide JSON-LD — see the file header before touching either. */}
        <Footer
          columns={FOOTER_COLUMNS}
          legal={LEGAL}
          areaServed={AREA_SERVED}
          hours={HOURS}
        />

        {/* No `phone` prop. Below 768px only, by CSS. */}
        <StickyCallBar />
      </body>
    </html>
  );
}
