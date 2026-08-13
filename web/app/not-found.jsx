/**
 * 404 — Beyond House Cleaning
 *
 * UI-SPEC §9.4's last bullet: a REAL template with a REAL <h1>, not Next's
 * built-in `404` document. WR-07 found that nothing in this repo had ever
 * inspected `_not-found.html`; plan 02-02's harness now globs every prerendered
 * page, so this file is asserted like any other route.
 *
 * IT RENDERS `RootLayout`, which is measured rather than assumed — the built
 * `_not-found.html` carries `lang="en-GB"`, two robots metas and one JSON-LD
 * block. So from plan 02-13 this page also carries the skip link, the header,
 * the primary nav, the footer, the sticky call bar and three `tel:` links, all
 * from the layout and none from here. (`_global-error.html` is the opposite
 * case — it renders Next's OWN document and none of this applies to it.)
 *
 * NO `Breadcrumbs`, AND THAT IS PERMANENT. A 404 has no position in the
 * hierarchy to describe, so `PAGE_EXPECTATIONS['/_not-found']` is
 * `hasBreadcrumbs: false` with **one** JSON-LD block — the footer's business
 * node, from the layout. A trail here would add a second block and turn SC-4f
 * red.
 *
 * NO `CTABand`. The three recovery links below ARE the recovery path, and a
 * navy band on an error page is noise rather than a conversion surface. The
 * built page is asserted to carry zero `bhc-section--navy`.
 *
 * NO SCHEMA-EMITTING PROP ON THE RATING, as on every Phase 2 template — the
 * prop's name is not written in this file at all, because plan 02-02's
 * acceptance greps this directory for it and a comment explaining an absence
 * that matches the grep policing that absence is a defect this phase has hit
 * eleven times.
 *
 * NO PHONE NUMBER AND NO CLIENT DIRECTIVE anywhere under `web/app`. Every
 * `tel:` on this page comes from the layout's components, which default from
 * the package's one canonical value.
 *
 * NO `metadata` EXPORT. `not-found.jsx` is not a page module — Next does not
 * read a metadata export from it — so the title and the D-15 robots block both
 * arrive from `RootLayout`, which is where they are asserted.
 */

import { Button, Hero, Prose, SectionBand } from '@bhc/design-system';

import { RATING } from '@/content/site.js';

/*
  UI-SPEC §5's error state, with ONE adaptation and it is recorded here rather
  than made silently.

  §5's body offers three destinations: our cleaning services, "the areas we
  cover", and the quote flow. The middle one is `/locations`, which does not
  exist until PHASE 3 — and every internal href on every built page is resolved
  against the real prerender manifest by delta 6, so shipping it would put a
  link to a 404 on the 404 page and turn CI red.

  So the first sentence is intact and the offer is §9.4's three named
  destinations instead: `/services/deep-cleaning`, `/` and `/get-a-quote`.
  PHASE 3 is the plan that can restore the areas link — it adds the route, and
  this array grows by one entry.
*/
const BODY =
  'That link may be out of date. Try our deep cleaning service, head back to ' +
  'the home page, or get a free quote in under a minute.';

const RECOVERY_LINKS = [
  { label: 'See Deep Cleaning', href: '/services/deep-cleaning', variant: 'secondary' },
  { label: 'Go to the Home Page', href: '/', variant: 'ghost' },
  { label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' },
];

export default function NotFound() {
  return (
    <>
      {/* The body copy lives in the Prose below, not in the hero's lead — one
          statement of it, in one place, as §9.4 draws the template. */}
      <Hero align="centered" heading="We Couldn't Find That Page" rating={RATING} />

      <SectionBand width="narrow">
        <Prose>
          <p>{BODY}</p>
        </Prose>

        {/* Inline layout rather than a new class: this is three buttons in a
            row on one page, and a `bhc-` class would need a rule in the shared
            stylesheet that nothing else uses. `gap` and the token spacing are
            the same values every other action row uses. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--bhc-space-3)',
            marginTop: 'var(--bhc-space-6)',
          }}
        >
          {RECOVERY_LINKS.map((link) => (
            <Button key={link.href} href={link.href} variant={link.variant} size="lg">
              {link.label}
            </Button>
          ))}
        </div>
      </SectionBand>
    </>
  );
}
