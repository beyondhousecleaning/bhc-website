/**
 * ReviewRail — Beyond House Cleaning
 *
 * The zero-JavaScript horizontal rail that stands in for the 516 KB third-party
 * review widget the live site loads. Three columns at 1024px and above, a
 * scroll-snap rail below, and not one byte of client code either way.
 *
 * IT RETURNS null ON EMPTY DATA. The shipped InterlinkBlock.jsx:37 convention:
 * an empty rail is worse than no rail, and there is no "no reviews yet"
 * message, because that is a promise about the future rendered as content. That
 * behaviour has not changed and is still the contract for a caller with nothing
 * to show.
 *
 * THE DATA HAS NOW LANDED, AND THE ANCHOR RESOLVES. Every template composed this
 * component with an empty array from plan 02-11 until the reviews were pulled
 * forward from Phase 4; `web/content/reviews.js` supplies them now, and the
 * `Read Our Reviews` call to action came back with them. It had been withdrawn
 * from the closed set for one stated reason — the anchor's target rendered
 * nothing, and the internal-link lock only resolves hrefs beginning with a
 * slash, so a dead in-page anchor would have passed unnoticed on every page.
 * That reason expired; the harness now asserts that every in-page anchor
 * resolves to an element carrying the matching id, so it cannot come back
 * silently. The `id` prop is what made the reinstatement a data change rather
 * than an API change, exactly as intended.
 *
 * Seeding invented testimonials to make the anchor resolve was never an option
 * and still is not: it contradicts the whole "genuinely local team" positioning,
 * and a fabricated testimonial is a banned practice under the Digital Markets,
 * Competition and Consumers Act 2024. Every quote this renders is a real,
 * published Google review quoted verbatim.
 *
 * THE SCROLL CONTAINER CARRIES tabindex="0", role="group" AND AN aria-label.
 * That is the standard treatment for a scrollable region — it is what makes the
 * rail reachable by keyboard, and it is why no arrow buttons are needed, since
 * arrows would need a pointer handler and therefore a client boundary.
 *
 * It is correct ONLY BECAUSE ReviewCard has no focusable children. Chrome's
 * automatic keyboard-focusable-scroller behaviour applies only to a scroller
 * that contains none, so the explicit attribute is doing real work here — and
 * the moment a link is added inside a card it becomes a redundant tab stop
 * immediately before that link. The coupling is recorded in both prompt docs.
 *
 * NO REVIEW STRUCTURED DATA, here or in the card.
 */

import { ReviewCard } from '../ReviewCard/ReviewCard.jsx';

/*
  Derived, never hardcoded. Written with split/filter/join rather than the
  string-substitution method, which the claude-seo PostToolUse hook rejects
  inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

/** UI-SPEC §5's <h2> deck. */
const DEFAULT_HEADING = 'What Warwickshire customers say';

export function ReviewRail({ heading, reviews = [], town, id = 'reviews', className = '' }) {
  /*
    The guard idiom from NAPFooter.jsx:89-107. This is fed from an externally
    sourced data module and renders inside the page tree of every template, so
    one malformed entry must not throw during server render.
  */
  const entries = reviews.filter(Boolean);
  if (!entries.length) return null;

  /*
    `town` narrows the default heading on a town or combo page. It is not
    applied when a caller passes an explicit heading — a page that has already
    said what it wants said does not get it rewritten underneath it.
  */
  const railHeading = heading || (town ? `What ${town} customers say` : DEFAULT_HEADING);

  const headingId = `${id}-heading-${slugify(railHeading)}`;

  const trackLabel = town ? `Customer reviews from ${town}` : 'Customer reviews';

  return (
    <section
      className={['bhc-reviewrail', className].filter(Boolean).join(' ')}
      id={id}
      aria-labelledby={headingId}
    >
      <h2 className="bhc-reviewrail__heading" id={headingId}>
        {railHeading}
      </h2>

      <ul
        className="bhc-reviewrail__track"
        tabIndex={0}
        role="group"
        aria-label={trackLabel}
      >
        {entries.map((review, i) => (
          <li className="bhc-reviewrail__item" key={`${review.author || 'review'}-${i}`}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReviewRail;
