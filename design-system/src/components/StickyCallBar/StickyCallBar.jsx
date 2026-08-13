/**
 * StickyCallBar — Beyond House Cleaning
 *
 * A fixed two-action bar at the bottom of the viewport below 768px, and
 * nothing at all at 768px and above. A deliberate competitive addition:
 * cleaning enquiries are mobile and phone-first, and the reference competitor
 * has no equivalent.
 *
 * THE CALL LABEL IS THE SINGLE WORD `Call`, WITH NO DIGITS, AND THAT IS A
 * DECISION RATHER THAN BREVITY. A one-word link is ambiguous out of context
 * for a screen-reader user listing a page's links, which is why the anchor
 * carries aria-label="Call Beyond House Cleaning". It also matters to the
 * lock: plan 02-02's delta 2(d) reads an anchor's rendered TEXT CONTENT and
 * compares its digits to the href's, so a digit-free label is out of that
 * clause's scope entirely — while a label reading `Call 07861 936533` would
 * FAIL it, because the normalisation strips a leading 44 and not a leading 0.
 * If a digit-bearing label is ever wanted here it must render exactly
 * `+44 7861 936533`, which is what formatPhone() produces and nothing else
 * does.
 *
 * `Get a Quote`, not `Get a Free Quote`. The bar is 375px wide and splits
 * 50/50; the long form is the label everywhere else on the site.
 *
 * THE NUMBER IS NOT RESTATED HERE. `phone` defaults to CANONICAL_PHONE from
 * src/phone.js and toDial() derives the href from it. A malformed value throws
 * rather than degrading to `tel:+44` — this bar renders on every page, and the
 * alternative to a build failure is an empty interactive element on all of
 * them (WCAG 2.4.4).
 *
 * This is one of the FOUR tel: links a fully composed page carries. See the
 * prompt doc for the budget.
 */

import { Button } from '../Button/Button.jsx';
import { toDial } from '../NAPFooter/formatPhone.js';
import { CANONICAL_PHONE } from '../../phone.js';

export function StickyCallBar({
  quoteHref = '/get-a-quote',
  /** Omit it. The one number arrives from src/phone.js. */
  phone = CANONICAL_PHONE,
  /* UI-SPEC §13-J. Defaults to 'a'; nothing in Phase 2 passes it. */
  as: As = 'a',
  className = '',
}) {
  const dial = toDial(phone);

  return (
    <div className={['bhc-callbar', className].filter(Boolean).join(' ')}>
      <Button
        className="bhc-callbar__action"
        href={`tel:${dial}`}
        variant="secondary"
        size="lg"
        as={As}
        aria-label="Call Beyond House Cleaning"
      >
        Call
      </Button>
      <Button
        className="bhc-callbar__action"
        href={quoteHref}
        variant="primary"
        size="lg"
        as={As}
      >
        Get a Quote
      </Button>
    </div>
  );
}

export default StickyCallBar;
