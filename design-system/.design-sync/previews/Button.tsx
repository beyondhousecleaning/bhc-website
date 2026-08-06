import { Button } from '@bhc/design-system';

const Row = ({ label, children, tone = 'muted' }: any) => (
  <div>
    <p
      style={{
        font: '600 12px/1 var(--bhc-font-body)',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: tone === 'danger' ? 'var(--bhc-danger)' : 'var(--bhc-ink-muted)',
        margin: '0 0 16px',
      }}
    >
      {label}
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {children}
    </div>
  </div>
);

/** The one real action on a page. Orange fill, ink label — 5.17:1. */
export const Primary = () => (
  <div style={{ padding: 40, background: 'var(--bhc-paper)' }}>
    <Row label="Primary — orange fill, ink label (5.17:1)">
      <Button href="/get-a-quote" size="sm">Get a Quote</Button>
      <Button href="/get-a-quote" size="md">Get a Quote</Button>
      <Button href="/get-a-quote" size="lg">Get a Quote</Button>
      <Button size="md" disabled>Fully booked</Button>
    </Row>
  </div>
);

/** The alternative action — never competing with the primary. */
export const Secondary = () => (
  <div style={{ padding: 40, background: 'var(--bhc-paper)' }}>
    <Row label="Secondary — outlined ink">
      <Button href="tel:+447861936533" variant="secondary" size="sm">Call Us</Button>
      <Button href="tel:+447861936533" variant="secondary" size="md">Call Us</Button>
      <Button href="/prices" variant="secondary" size="lg">See Our Prices</Button>
    </Row>
  </div>
);

/** Ghost exists only for navy surfaces, where an ink outline disappears. */
export const OnNavySurface = () => (
  <div style={{ padding: 40, background: 'var(--bhc-paper)' }}>
    <div
      style={{
        background: 'var(--bhc-navy)',
        padding: 32,
        borderRadius: 'var(--bhc-radius-lg)',
        color: '#fff',
      }}
    >
      <p
        style={{
          font: '600 12px/1 var(--bhc-font-body)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: '#C9D4E4',
          margin: '0 0 16px',
        }}
      >
        Ghost — navy surfaces only
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button href="/checklist" variant="ghost">See Our Checklist</Button>
        <Button href="/get-a-quote">Get a Quote</Button>
      </div>
    </div>
  </div>
);

/** With an icon on either side. Icons are decorative — aria-hidden by the component. */
export const WithIcons = () => (
  <div style={{ padding: 40, background: 'var(--bhc-paper-warm)' }}>
    <Row label="Icon slots — decoration, never the only label">
      <Button href="/get-a-quote" iconRight="→">Get a Quote</Button>
      <Button href="tel:+447861936533" variant="secondary" iconLeft="☎">Call Us</Button>
    </Row>
  </div>
);

/**
 * Shown so the failure is recognisable, not as an option.
 * White on orange is 3.05:1 against a 4.5:1 requirement.
 */
export const LabelContrast = () => (
  <div style={{ padding: 40, background: 'var(--bhc-paper)' }}>
    <Row label="Never — white on orange is 3.05:1" tone="danger">
      <span className="bhc-btn bhc-btn--md" style={{ background: 'var(--bhc-action)', color: '#fff' }}>
        Get a Quote
      </span>
      <Button href="/get-a-quote">Get a Quote</Button>
    </Row>
    <p style={{ font: '400 14px/1.5 var(--bhc-font-body)', color: 'var(--bhc-ink-muted)', margin: '12px 0 0' }}>
      Left fails AA. Right is the shipped primary — an ink label at 5.17:1.
    </p>
  </div>
);
