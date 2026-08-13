/**
 * ServiceCard — Beyond House Cleaning
 *
 * The six keyword-bearing links out of the Home page, and the same card on
 * every town hub. It is the component that turns "we do cleaning" into six
 * crawlable destinations with their own <h1>s.
 *
 * ONE LINK PER CARD, and that is the whole design.
 *
 * The obvious way to make a whole card clickable is to wrap it in an <a> and
 * keep the title link inside. That is not merely redundant: an <a> may not have
 * interactive content as a descendant, so the parser splits the pair into two
 * sibling links, and a six-card grid then announces TWELVE links to a screen
 * reader listing them — half of which have no useful name because their text is
 * the card's whole body. Here the anchor is the title, and the card-sized hit
 * area comes from a stretched pseudo-element on that same anchor. One element,
 * one accessible name, the full card as the target.
 *
 * The card treatment is deliberately identical to the shipped
 * .bhc-interlink__link (styles.css:260-277) — --bhc-paper ground, --bhc-line
 * border, hover to an --bhc-action border plus --bhc-shadow-md, all transitions
 * through --bhc-dur/--bhc-ease. Service cards and interlink cards appear on the
 * same page from Phase 3 onward, and two card families on one page reads as two
 * sites (UI-SPEC §7.6).
 *
 * `headingLevel` exists because this grid nests under a section <h2>: the
 * default <h3> keeps the outline legal there, and a bare grid whose band supplies
 * no heading takes 2.
 *
 * Colour note carried from plan 02-04: this card sets --bhc-ink and
 * --bhc-ink-muted DIRECTLY rather than inheriting currentColor, so it is
 * illegible on the one navy band (--bhc-ink-muted on --bhc-navy is 1.10:1).
 * It belongs on paper, warm or tint grounds only.
 */

/*
  Lookup with a fallback, per Button.jsx:12-17 — an unknown level degrades to
  the default instead of rendering an <hundefined>.
*/
const HEADING_TAGS = { 2: 'h2', 3: 'h3', 4: 'h4' };

/** UI-SPEC §7.6: up to three bullets. A fourth turns a card into a page. */
const MAX_INCLUDES = 3;

export function ServiceCard({
  title,
  href,
  summary,
  icon,
  includes = [],
  headingLevel = 3,
  /*
    UI-SPEC §13-J. Defaults to 'a'; one line here turns the contract's least
    reversible default — plain <a href> sitewide — into a data change.
  */
  as: As = 'a',
  className = '',
}) {
  const Heading = HEADING_TAGS[headingLevel] || HEADING_TAGS[3];

  /*
    T-02-19 / T-02-28. From Phase 3 `includes` is a data-module field, and this
    grid renders on the home page and six service pages, so one null entry must
    not throw during server render. Same guard idiom as NAPFooter.jsx:89-107.
  */
  const bullets = includes.filter(Boolean).slice(0, MAX_INCLUDES);

  return (
    <article className={['bhc-service-card', className].filter(Boolean).join(' ')}>
      {/*
        Decorative by construction: the title beside it says the same thing.
        aria-hidden here rather than on the caller's SVG, so a call site that
        forgets it still passes delta 14's intent.
      */}
      {icon ? (
        <span className="bhc-service-card__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}

      <Heading className="bhc-service-card__title">
        <As className="bhc-service-card__link" href={href}>
          {title}
        </As>
      </Heading>

      {summary ? <p className="bhc-service-card__summary">{summary}</p> : null}

      {bullets.length ? (
        <ul className="bhc-service-card__includes">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default ServiceCard;
