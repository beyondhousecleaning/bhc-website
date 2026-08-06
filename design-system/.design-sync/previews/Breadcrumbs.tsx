import { Breadcrumbs } from '@bhc/design-system';

const Frame = ({ label, children }: any) => (
  <div style={{ padding: '32px 0 40px', background: 'var(--bhc-paper)' }}>
    <p
      style={{
        font: '600 12px/1 var(--bhc-font-body)',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--bhc-ink-muted)',
        margin: '0 0 16px',
        padding: '0 40px',
      }}
    >
      {label}
    </p>
    {children}
  </div>
);

/** The deepest real trail: a service-in-town combo page, four levels down. */
export const ComboPage = () => (
  <Frame label="Combo page — the deepest trail on the site">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Areas We Cover', href: '/locations' },
        { label: 'Warwickshire', href: '/location/warwickshire' },
        { label: 'Warwick', href: '/location/warwickshire/warwick' },
        { label: 'Deep Cleaning' },
      ]}
    />
  </Frame>
);

/** A town hub — three levels, final crumb is the current page. */
export const TownHub = () => (
  <Frame label="Town hub">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Areas We Cover', href: '/locations' },
        { label: 'Leamington Spa' },
      ]}
    />
  </Frame>
);

/** A service hub, off the services index rather than locations. */
export const ServiceHub = () => (
  <Frame label="Service hub">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'End of Tenancy Cleaning' },
      ]}
    />
  </Frame>
);

/** The shallowest case — one level below home. */
export const SingleLevel = () => (
  <Frame label="One level below home">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
  </Frame>
);

/**
 * The trail is only half the component — it also emits BreadcrumbList JSON-LD
 * inline, server-rendered, on every non-home page.
 */
export const WithSchema = () => (
  <div>
    <Frame label="Visible trail + inline BreadcrumbList JSON-LD">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Areas We Cover', href: '/locations' },
          { label: 'Coventry', href: '/location/west-midlands/coventry' },
          { label: 'Carpet Cleaning' },
        ]}
      />
    </Frame>
    <div style={{ padding: '0 40px 32px', background: 'var(--bhc-paper)' }}>
      <p
        style={{
          font: '600 12px/1 var(--bhc-font-body)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--bhc-danger)',
          margin: '0 0 12px',
        }}
      >
        Missing on 115 of 115 live pages
      </p>
      <p
        style={{
          font: '400 14px/1.6 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: 0,
          maxWidth: '70ch',
        }}
      >
        The live site ships neither the visible trail nor the markup. Note that the trail is only
        meaningful once its parents resolve — <code>/locations</code> and the region segment must
        exist, or a combo page is four levels deep behind three 404s.
      </p>
    </div>
  </div>
);
