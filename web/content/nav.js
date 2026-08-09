/**
 * Sitewide navigation data — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias is stable at
 * any route depth.
 *
 * THE INVARIANT THIS FILE EXISTS TO HOLD:
 *
 *   Every one of the 17 Phase 2 routes is reachable from every page, and
 *   nothing here points anywhere else.
 *
 * Both halves matter and they fail differently. Miss a route and it is an
 * orphan — served, indexed if it is ever crawled, and linked from nothing.
 * Add an href that is not a route and every page on the site carries a link to
 * a 404. Plan 02-02's delta 6 enforces the second half against the real
 * `prerender-manifest.json` once the layout renders this data, so an invented
 * href turns CI red rather than shipping. The first half is enforced here, by
 * this file being the only place the sitewide link set is written down.
 *
 * The 17: `/`, the six `/services/*` pages, and the ten utility pages
 * (`/about-us`, `/checklist`, `/contact-us`, `/customer-login`,
 * `/customer-service-agreement`, `/get-a-quote`, `/gift-cards`,
 * `/privacy-policy`, `/terms-of-service`, `/work-with-us`). Home is reachable
 * from the header brand link, which `Header` owns, so it does not appear below.
 *
 * 02-RESEARCH.md § "The Route Inventory, Resolved", consequence 1: descoping a
 * route is not a smaller scope, it is a broken build. Do not shorten these
 * lists to match a plan that ships fewer pages — ship the pages.
 *
 * SHAPES. `FOOTER_COLUMNS` matches `FooterColumn`/`FooterLink` from
 * `NAPFooter.d.ts` exactly, because `Footer` passes it straight through.
 * `NAV` matches `NavItem` from UI-SPEC §7.1, in which `href` is OPTIONAL.
 * `NAPFooter` guards with `.filter(Boolean)` and `(col.links || [])` because it
 * sits in the root layout and one malformed entry would 500 every route rather
 * than break one list — the data here is what that guard is guarding against.
 * Author it to shape; do not rely on the guard.
 *
 * No street address, no postcode, no phone digits — D-04 / Lock 5. The one
 * phone number lives in `design-system/src/phone.js` and nowhere else.
 */

/**
 * The Header nav tree for Phase 2.
 *
 * THE SERVICES ITEM CARRIES NO `href` OF ITS OWN. This is deliberate and there
 * are two independent reasons, either of which alone settles it:
 *
 *   1. The services index route does not exist in Phase 2 — it 404s. A link to
 *      it would appear on all 18 pages and fail delta 6, which resolves every
 *      internal href against the prerender manifest. Phase 3 owns the index.
 *   2. Giving it one of its children's hrefs instead would put that href in the
 *      DOM twice, and plan 02-10's Header acceptance fails on any duplicated
 *      internal href.
 *
 * Instead it is a disclosure. Plan 02-10 task 2 renders a `NavItem` that has
 * `children` as a `<summary>` and never emits its `href` — so even if one were
 * added here it would not reach the DOM, which is a silent inconsistency rather
 * than a working link. Leave it absent.
 *
 * Service slugs are TODAY'S LIVE SLUGS, not the D14 canonical taxonomy
 * (UI-SPEC §13-C). The four 301s are Phase 3's, and because the service page is
 * one data-driven dynamic route, that rename is a data change here rather than
 * a template change.
 *
 * Phase 3 inserts `{ label: 'Areas We Cover', href: '/locations' }` into this
 * array once that route resolves — after Services, before About.
 */
export const NAV = [
  {
    label: 'Services',
    children: [
      { label: 'Deep Cleaning', href: '/services/deep-cleaning' },
      { label: 'Regular House Cleaning', href: '/services/standard-home-cleaning' },
      { label: 'Move-In Cleaning', href: '/services/move-in-cleaning' },
      { label: 'Move-Out Cleaning', href: '/services/move-out-cleaning' },
      { label: 'Short-Term Rental Cleaning', href: '/services/short-term-rental-cleaning' },
      { label: 'Builders Clean', href: '/services/post-construction-cleaning' },
    ],
  },
  { label: 'About', href: '/about-us' },
  { label: 'Checklist', href: '/checklist' },
  { label: 'Contact', href: '/contact-us' },
];

/**
 * The three Footer link columns, from UI-SPEC §7.2.
 *
 * Three, not four. §7.2's table has four rows, but the fourth is the legal
 * bottom row, which `Footer` passes to `NAPFooter` as its `legal` prop — a
 * separate slot with its own styling and its own position below the columns.
 * Modelling it as a fourth `FooterColumn` would render it as a headed nav
 * landmark in the column grid, which is not what §7.2 draws.
 *
 * Labels here are the reader's words, not the slug's: `What's Included` for
 * `/checklist` and `Work With Us` for the careers page both read as what the
 * page is for. The `<h1>` deck in UI-SPEC §5 is the page's own wording and the
 * two are allowed to differ.
 */
export const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'Deep Cleaning', href: '/services/deep-cleaning' },
      { label: 'Regular House Cleaning', href: '/services/standard-home-cleaning' },
      { label: 'Move-In Cleaning', href: '/services/move-in-cleaning' },
      { label: 'Move-Out Cleaning', href: '/services/move-out-cleaning' },
      { label: 'Short-Term Rental Cleaning', href: '/services/short-term-rental-cleaning' },
      { label: 'Builders Clean', href: '/services/post-construction-cleaning' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Work With Us', href: '/work-with-us' },
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    heading: 'Customers',
    links: [
      { label: "What's Included", href: '/checklist' },
      { label: 'Get a Quote', href: '/get-a-quote' },
      { label: 'Customer Login', href: '/customer-login' },
    ],
  },
];

/**
 * The footer's legal bottom row — `NAPFooter`'s `legal` prop, NOT a column.
 * Same `FooterLink` shape.
 *
 * These three carry the last three of the 17 routes. Between `NAV`,
 * `FOOTER_COLUMNS` and this row, all 16 non-home routes are linked from every
 * page; drop this export and three pages become orphans with nothing failing.
 */
export const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Customer Service Agreement', href: '/customer-service-agreement' },
];
