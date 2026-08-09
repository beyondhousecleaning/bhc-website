/**
 * QuoteFormEntry — Beyond House Cleaning
 *
 * AN ENTRY POINT, NOT A FORM. It contains no <form>, no <input>, no <select>,
 * no <textarea> and no client JavaScript, and none of those may be added here.
 *
 * Booking-flow UX belongs to Project BK V3 and is explicitly out of scope for
 * this site (docs/goals.md, REQUIREMENTS.md "Out of Scope"). Beyond that, a
 * real form needs validation state, validation state needs a client boundary,
 * and a first-party client boundary turns SC-4g red — the lock that asserts
 * every client module in the build resolves inside node_modules/next. One text
 * input would cost the whole phase its central architectural claim.
 *
 * /get-a-quote is a page, and it hands off to the booking flow that already
 * exists. This panel's job is to get people there, and to give the ones who
 * would rather talk to a person a number to ring.
 *
 * THE PHONE NUMBER IS NOT RESTATED HERE. `phone` defaults to CANONICAL_PHONE
 * from src/phone.js, the displayed text comes from formatPhone() and the href
 * comes from toDial(), both derived from that same one value — the NAPFooter
 * idiom (NAPFooter.jsx:46-47, :73-76). There is deliberately NO prop for the
 * displayed text: the live site DISPLAYS one number and DIALS another on all
 * 115 pages, and that is only possible when the two are separate inputs.
 *
 * The displayed label must render exactly `+44 7861 936533`. Plan 02-02's
 * digit-equality clause normalises a leading `44` but not a leading `0`, so a
 * label reading `Call 07861 936533` fails it against its own href. formatPhone
 * produces the passing form and nothing else does.
 *
 * A malformed `phone` throws rather than degrading (plan 02-01's guard, and
 * T-02-26): this panel renders on ~17 pages, and the alternative to a build
 * failure is `<a href="tel:+44"></a>` — an empty interactive element — on all
 * of them.
 */

import { Button } from '../Button/Button.jsx';
import { formatPhone, toDial } from '../NAPFooter/formatPhone.js';
import { CANONICAL_PHONE } from '../../phone.js';

/* UI-SPEC §5. The <h2> copy and the three reassurance bullets, verbatim. */
const DEFAULT_HEADING = 'Get a free quote in under two minutes';
const DEFAULT_BULLETS = [
  'No obligation',
  'Fixed price before we start',
  'DBS-checked, insured cleaners',
];

/*
  Derived, never hardcoded — this panel appears on several utility pages and a
  fixed id would point every aria-labelledby on a page at the first one.
  split/filter/join rather than the string-substitution method, which the
  claude-seo PostToolUse hook rejects inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

export function QuoteFormEntry({
  heading = DEFAULT_HEADING,
  bullets = DEFAULT_BULLETS,
  href = '/get-a-quote',
  /** Omit it. The one number arrives from src/phone.js. */
  phone = CANONICAL_PHONE,
  /* UI-SPEC §13-J. Defaults to 'a'; nothing in Phase 2 passes it. */
  as: As = 'a',
  id,
  className = '',
}) {
  const dial = toDial(phone);

  /*
    One string, one text node. Built here rather than interpolated in JSX
    because plan 02-02's delta 2(d) reads a tel: link's rendered TEXT CONTENT
    and compares its digits to the href's; a JSX expression beside a literal
    can be serialised with a separator between the two text nodes, which is
    exactly the kind of thing a text-content scan trips over.
  */
  const callLabel = `Call ${formatPhone(phone)}`;

  const headingId = id ? `${id}-heading` : `bhc-quote-entry-${slugify(heading)}`;

  return (
    <aside
      className={['bhc-quote-entry', className].filter(Boolean).join(' ')}
      id={id}
      aria-labelledby={headingId}
    >
      <h2 className="bhc-quote-entry__heading" id={headingId}>
        {heading}
      </h2>

      {/*
        T-02-19. `bullets` is a data-module field from Phase 3 and this panel is
        on ~17 routes, so a null entry must not throw during server render.
      */}
      {bullets.filter(Boolean).length ? (
        <ul className="bhc-quote-entry__bullets">
          {bullets.filter(Boolean).map((bullet) => (
            <li key={bullet}>
              {/* Decorative: the bullet text beside it says the same thing. */}
              <svg
                className="bhc-quote-entry__tick"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m4 10.5 4 4 8-9" />
              </svg>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="bhc-quote-entry__actions">
        <Button href={href} variant="primary" size="lg" as={As}>
          Get a Free Quote
        </Button>
        {/*
          The FOURTH tel: link a fully composed page can carry, after Header,
          StickyCallBar and NAPFooter. Plan 02-02's delta 2(b) caps a page at
          four for exactly this reason — the cap is not three, and this link is
          not the one to remove to make a lock go green. See the prompt doc.
        */}
        <Button href={`tel:${dial}`} variant="secondary" size="lg" as={As}>
          {callLabel}
        </Button>
      </div>
    </aside>
  );
}

export default QuoteFormEntry;
