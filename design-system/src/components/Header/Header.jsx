/**
 * Header — Beyond House Cleaning
 *
 * ONE <header>, ONE <nav aria-label="Primary">, ONE <ul class="bhc-nav__list">,
 * every navigation link in the DOM exactly once, and no JavaScript at all.
 *
 * THE RESPONSIVE MECHANISM, AND THE THING NOBODY MAY "TIDY".
 * The <details class="bhc-nav__disclosure"> below is a STATE CARRIER WITH NO
 * CONTENT: it holds a <summary> and nothing else. The one <ul> is its SIBLING,
 * not its child, and a sibling combinator in styles.css shows the list when the
 * disclosure is open. A user agent only hides a <details>'s own children, so a
 * sibling is untouched by it and an ordinary stylesheet rule can drive it.
 *
 * Someone will eventually move the <ul> inside the <details> because the empty
 * element looks like a mistake. It is not, and doing that breaks desktop
 * navigation outright: a closed <details>'s non-summary children are hidden by
 * the UA through the details-content slot, which no `display` rule overrides,
 * so hiding the toggle at desktop width would leave the nav permanently
 * invisible. The two rejected alternatives and the reason each fails are
 * written out in Header.prompt.md. Read that before restructuring this.
 *
 * The nested Services disclosure is a DIFFERENT case and is ordinary usage: it
 * contains its own <ul>, opens on click at every width, and is absolutely
 * positioned below its summary at desktop width.
 *
 * THE NavItem RENDERING RULE, WHICH IS LOAD-BEARING.
 * An item WITH children renders as a nested <details> whose <summary> carries
 * the LABEL, and its own `href` is NEVER emitted, whether or not one is
 * present. An item WITHOUT children renders as a single <a href>. Two
 * independent reasons: /services 404s in Phase 2, so a linked parent would fail
 * the internal-link resolution lock on all 18 pages; and giving the parent one
 * of its children's hrefs would put the same href in the DOM twice. The nav
 * data ships the Services item with no href today — this rule means the
 * component stays correct if a later data edit adds one.
 *
 * NO <h1>. The brand is an <a> carrying aria-label="Beyond House Cleaning —
 * home". A <div> or <span> styled at heading size is the exact live-site bug
 * that cost 101 of 115 pages their <h1>: if it looks like a heading it is a
 * heading element, and here it is neither — it is a link to the home page.
 *
 * THE LOGO IS A TYPOGRAPHIC WORDMARK, NOT THE RASTER FILE. assets/logo/ holds
 * a 189 KB PNG and a 679 KB JPG of the mark brand-brief.md is replacing, at a
 * resolution that renders about 20px tall in a 48px header. Shipping it would
 * put a superseded logo on roughly 410 pages. The `logo` prop takes a ReactNode
 * so the SVG lockup drops in later with no API change and no page edits.
 *
 * THE PHONE NUMBER IS NOT RESTATED HERE. `phone` defaults to CANONICAL_PHONE
 * from src/phone.js; formatPhone() supplies the label and toDial() the href,
 * both derived from that one value, so they cannot diverge. There is no prop
 * for the displayed text. This is one of the four tel: links a fully composed
 * page carries — Header, StickyCallBar, NAPFooter and QuoteFormEntry's
 * fallback.
 */

import { Button } from '../Button/Button.jsx';
import { formatPhone, toDial } from '../NAPFooter/formatPhone.js';
import { CANONICAL_PHONE } from '../../phone.js';

const DEFAULT_WORDMARK = <span className="bhc-header__wordmark">Beyond House Cleaning</span>;

export function Header({
  /** A ReactNode. Defaults to the typographic wordmark — see the header. */
  logo = DEFAULT_WORDMARK,
  nav = [],
  cta,
  /** Omit it. The one number arrives from src/phone.js. */
  phone = CANONICAL_PHONE,
  /* UI-SPEC §13-J. Defaults to 'a'; nothing in Phase 2 passes it. */
  as: As = 'a',
  className = '',
}) {
  const dial = toDial(phone);

  /*
    One string, one text node. Built here rather than interpolated beside a
    literal in JSX because plan 02-02's delta 2(d) reads a tel: link's rendered
    TEXT CONTENT and compares its digits to the href's, and a serialiser may
    put a separator between two adjacent text nodes mid-number.
  */
  const phoneLabel = formatPhone(phone);

  /*
    The NAPFooter guard idiom (NAPFooter.jsx:105-123). This component sits in
    the root layout, so a single malformed entry in a Phase-3 nav data file
    would 500 EVERY route rather than break one list.
  */
  const items = nav.filter(Boolean);

  return (
    <header className={['bhc-header', className].filter(Boolean).join(' ')}>
      <div className="bhc-container bhc-header__inner">
        <As className="bhc-header__brand" href="/" aria-label="Beyond House Cleaning — home">
          {logo}
        </As>

        <nav aria-label="Primary" className="bhc-nav">
          {/*
            State carrier only. Its sole child is the <summary>; the list below
            is a SIBLING. Do not move the <ul> in here — see the file header.
          */}
          <details className="bhc-nav__disclosure">
            <summary className="bhc-nav__toggle" aria-controls="primary-nav" aria-label="Menu">
              {/* Decorative: the summary's aria-label already names the control. */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </summary>
          </details>

          <ul className="bhc-nav__list" id="primary-nav">
            {items.map((item) => {
              const children = (item.children || []).filter(Boolean);

              if (children.length) {
                return (
                  <li className="bhc-nav__item" key={item.label}>
                    <details className="bhc-nav__submenu">
                      <summary className="bhc-nav__summary">
                        <span>{item.label}</span>
                        {/* Decorative: the summary text beside it names the control. */}
                        <svg
                          className="bhc-nav__chevron"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="m4 6 4 4 4-4" />
                        </svg>
                      </summary>
                      <ul className="bhc-nav__sublist">
                        {children.map((child) => (
                          <li key={child.label}>
                            <As className="bhc-nav__link" href={child.href}>
                              {child.label}
                            </As>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              }

              /*
                An item with neither children nor an href has no destination.
                It renders as text rather than an <a> with no href, which is
                not focusable, not activatable and announced as a link.
              */
              return (
                <li className="bhc-nav__item" key={item.label}>
                  {item.href ? (
                    <As className="bhc-nav__link" href={item.href}>
                      {item.label}
                    </As>
                  ) : (
                    <span className="bhc-nav__link">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/*
          CSS-gated, never conditionally rendered — that is what keeps the whole
          header a server render. Hidden below 768px, which is the exact width
          at which StickyCallBar leaves, so no viewport is without a one-tap
          call action and no viewport shows both.
        */}
        <div className="bhc-header__actions">
          <As className="bhc-header__phone" href={`tel:${dial}`}>
            {phoneLabel}
          </As>
          {cta ? (
            <Button href={cta.href} variant="primary" size="md" as={As}>
              {cta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
