import { NAPFooter } from '@bhc/design-system';

const columns = [
  {
    heading: 'Services',
    links: [
      { label: 'Domestic Cleaning', href: '/services/domestic-cleaning' },
      { label: 'Deep Cleaning', href: '/services/deep-cleaning' },
      { label: 'End of Tenancy Cleaning', href: '/services/end-of-tenancy-cleaning' },
      { label: 'Apartment Cleaning', href: '/services/apartment-cleaning' },
      { label: 'Move-Out Cleaning', href: '/services/move-out-cleaning' },
      { label: 'Short-Term Rental Cleaning', href: '/services/short-term-rental-cleaning' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Areas We Cover', href: '/locations' },
      { label: 'What We Clean', href: '/checklist' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Work With Us', href: '/careers' },
    ],
  },
];

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Service Agreement', href: '/service-agreement' },
];

const areaServed = ['Warwick', 'Leamington Spa', 'Kenilworth', 'Coventry', 'Solihull', 'Rugby'];

/** The shipped footer. One tel:, no address, areaServed in the schema. */
export const Default = () => (
  <NAPFooter
    phone="+447861936533"
    columns={columns}
    legal={legal}
    areaServed={areaServed}
    mapsUrl="https://www.google.com/maps/place/?q=place_id:BeyondHouseCleaning"
  />
);

/**
 * Lock 4 in action. `phone` is the ONLY input — pass the messy national form
 * and the displayed string and the tel: href still derive from the same value.
 */
export const DerivedFromOneValue = () => (
  <div>
    <NAPFooter phone="07861 936533" columns={[columns[0]]} legal={legal} areaServed={areaServed} />
    <div style={{ padding: '32px 48px', background: 'var(--bhc-paper)' }}>
      <p
        style={{
          font: '600 12px/1 var(--bhc-font-body)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--bhc-danger)',
          margin: '0 0 12px',
        }}
      >
        The live-site bug this prevents
      </p>
      <p
        style={{
          font: '400 15px/1.6 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: 0,
          maxWidth: '70ch',
        }}
      >
        The footer on all 115 live pages displays <code>+44 7861 936533</code> and dials{' '}
        <code>07441918832</code>; a third number sits on <code>/get-a-quote</code>. Here
        <code> phone</code> was passed as <code>07861 936533</code> and both the label and the
        <code> tel:</code> href above were derived from it — there is no prop for display text, so
        they cannot diverge.
      </p>
    </div>
  </div>
);

/** Minimal — NAP block only, no nav columns. For thin landing templates. */
export const NapOnly = () => (
  <NAPFooter phone="+447861936533" areaServed={areaServed} legal={legal} />
);

/** A different service-area statement. Still no street address — Lock 5. */
export const AlternateServiceArea = () => (
  <NAPFooter
    phone="+447861936533"
    serviceArea="Covering Birmingham, Solihull and Sutton Coldfield — up to 20 miles"
    hours="Mon–Sat, 8am–7pm · Sun by arrangement"
    columns={columns}
    legal={legal}
    areaServed={['Birmingham', 'Solihull', 'Sutton Coldfield', 'Walsall']}
  />
);
