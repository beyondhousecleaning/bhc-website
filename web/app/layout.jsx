/**
 * Root layout — Beyond House Cleaning
 *
 * LOCK 4 / D-08 / D-11: exactly one tel: sitewide, and its href digits MUST
 *         equal the displayed digits.
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
 * when the two are separate inputs. `NAPFooter` derives
 * both from a single `phone` prop, and this layout passes NO `phone` prop at
 * all — the canonical number lives once, as the package default at
 * NAPFooter.jsx:33. An app-side restatement would be a second place the number
 * can be wrong, which is the exact defect REQ-nap-consistency exists to kill.
 * (.design-sync/previews/NAPFooter.tsx:38 does pass it — that is a prop demo,
 * not app guidance.)
 *
 * <NAPFooter /> is rendered HERE and nowhere else in the app, ever. That is
 * what makes D-11 structural rather than a convention someone has to remember,
 * and it is what the "exactly one <footer>" assertion checks.
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

import { NAPFooter } from '@bhc/design-system';

export const metadata = {
  /* `.com`, not `.co.uk`. PROJECT.md's opening line is a typo; the live
     sitemap, 120 doc occurrences and NAPFooter.jsx:27's SITE constant agree. */
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

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        {children}

        {/* No `phone` prop. See the header. */}
        <NAPFooter
          areaServed={['Leamington Spa', 'Warwick', 'Kenilworth', 'Coventry']}
          hours="Mon–Sat, 8am–7pm"
        />
      </body>
    </html>
  );
}
