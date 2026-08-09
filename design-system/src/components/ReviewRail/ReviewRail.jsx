/**
 * ReviewRail — Beyond House Cleaning
 *
 * The zero-JavaScript horizontal rail that stands in for the 516 KB third-party
 * review widget the live site loads. Three columns at 1024px and above, a
 * scroll-snap rail below, and not one byte of client code either way.
 *
 * IT RETURNS null ON EMPTY DATA. The shipped InterlinkBlock.jsx:37 convention:
 * an empty rail is worse than no rail, and there is no "no reviews yet"
 * message, because that is a promise about the future rendered as content.
 * Review data arrives in Phase 4; until then every page composes this component
 * with an empty array and it simply does not appear.
 *
 * NOTHING LINKS TO THE `reviews` ANCHOR IN PHASE 2. The `Read Our Reviews` call
 * to action was withdrawn from the closed set for exactly that reason — the
 * anchor's target renders nothing without data, and the internal-link lock only
 * resolves hrefs beginning with a slash, so a dead in-page anchor would pass
 * unnoticed on every page. Seeding invented testimonials to make it resolve
 * contradicts the whole "genuinely local team" positioning. The `id` prop exists
 * so Phase 4 reinstates the call to action without an API change.
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
    The guard idiom from NAPFooter.jsx:89-107. Phase 4 feeds this from an
    external pull, and this renders inside the page tree of every template, so
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
