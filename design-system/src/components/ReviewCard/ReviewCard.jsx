/**
 * ReviewCard — Beyond House Cleaning
 *
 * One customer review, on the card that ReviewRail scrolls. The live site holds
 * its reviews inside a 516 KB third-party widget, so none of them is indexed
 * content; this renders them as server HTML at a marginal cost of nothing.
 *
 * THE STAR GLYPH IS IMPORTED, NOT RESTATED. `Star` is exported by
 * RatingBadge.jsx precisely so its path data lives in one file. Two copies of a
 * path string is the second-source defect this phase exists to remove.
 *
 * THE ATTRIBUTION IS DELIBERATELY NOT A NESTED <footer>. That is legal HTML
 * inside an <article>, and it is what the element is for — but the built-HTML
 * suite asserts EXACTLY ONE <footer> per page, and a rail of three cards would
 * put four on the home page. A <p> with a <cite> carries the same meaning and
 * costs nothing.
 *
 * THERE IS NO -webkit-line-clamp, AND THERE MAY NOT BE. With no client
 * JavaScript there is no "read more", so a CSS clamp hides text from sighted
 * users that screen readers still receive, and the loss widens at 200% zoom
 * (WCAG 1.4.4). THE QUOTE IS CAPPED AT 320 CHARACTERS AT THE DATA LAYER,
 * truncated at a word boundary with an ellipsis at ingest, so what ships is
 * exactly what displays. Phase 4's review pull must honour that cap — it is a
 * property of the data contract, not of the CSS.
 *
 * THIS COMPONENT EMITS NO REVIEW STRUCTURED DATA. Self-serving and
 * widget-sourced review markup are both ineligible for review rich results, and
 * the aggregate figure is entity-graph only, emitted once per page by
 * RatingBadge.
 *
 * NO LINK INSIDE THE CARD, and that is load-bearing. ReviewRail's scroll
 * container carries tabindex="0", which is correct ONLY because this card has no
 * focusable children — a link in here would turn that explicit tab stop into a
 * redundant one immediately before the link itself.
 *
 * Colour: the stars inherit --bhc-ink rather than taking the orange
 * RatingBadge's stars take. Measured on this card's --bhc-paper-tint ground,
 * --bhc-action is 2.68:1, which fails 1.4.11's 3:1 for a graphic that carries
 * meaning; --bhc-ink is 13.85:1. The same glyph on a white ground in RatingBadge
 * is 3.05:1 and passes, which is why the two differ.
 */

import { Star } from '../RatingBadge/RatingBadge.jsx';

export function ReviewCard({ review, className = '' }) {
  /*
    Phase 4 feeds this from an external pull and the rail maps over an array, so
    a single malformed entry must not throw during server render and take the
    whole route with it. The rail filters nulls; this is the second belt.
  */
  if (!review) return null;

  const { quote, author, town, rating = 5, date, source } = review;

  const rounded = Math.round(rating);

  /*
    Built once into a const, the RatingBadge.jsx:45 pattern: the wrapper is the
    meaningful graphic, the individual glyphs are aria-hidden inside it.
  */
  const starLabel = source
    ? `Rated ${rating} out of 5 on ${source}`
    : `Rated ${rating} out of 5`;

  /*
    Assembled as ONE string rather than interpolated beside the <cite>. Adjacent
    JSX text nodes serialise with a separator between them, and the attribution
    line is read as text content by anything that scans it.
  */
  const meta = [town, date].filter(Boolean).join(' · ');

  return (
    <article className={['bhc-review', className].filter(Boolean).join(' ')}>
      <span className="bhc-review__stars" role="img" aria-label={starLabel}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= rounded} />
        ))}
      </span>

      <blockquote className="bhc-review__quote">
        <p>{quote}</p>
      </blockquote>

      <p className="bhc-review__by">
        <cite>{author}</cite>
        {meta ? ` · ${meta}` : null}
      </p>
    </article>
  );
}

export default ReviewCard;
