/**
 * TownCard — Beyond House Cleaning
 *
 * The denser sibling of ServiceCard, for the ~56 towns on /locations and the
 * nearby-towns grid on every town hub. At 56 cards a summary paragraph per card
 * is 56 paragraphs of near-identical copy, so this card is a title and ONE meta
 * line: "Warwickshire · 6 services".
 *
 * One anchor per card, same as ServiceCard and for the same reason: an <a> may
 * not contain interactive content, so a wrapper link plus a title link is parsed
 * into two sibling links — and at 56 cards that is 112 links in the a11y tree.
 * The card-sized hit area is a stretched pseudo-element on the title anchor.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO PROHIBITIONS ON `town`, because Phase 3 feeds this from a data file:
 *
 *   1. NEVER a bare postcode district as a town name. "CV32" is not a place
 *      anyone searches for or lives in; post towns and named suburbs only.
 *   2. NEVER a full postcode, anywhere in the rendered output. D4 and Lock 5 —
 *      the registered office is residential, and this component renders on ~56
 *      pages plus every town hub, so one bad data row publishes it site-wide.
 *      Lock 5 scans package source AND plan 02-02's SC-2d scans built HTML.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Colour note carried from plan 02-04: the meta line sets --bhc-ink-muted
 * DIRECTLY rather than inheriting currentColor, so this card must not sit on the
 * navy band — --bhc-ink-muted on --bhc-navy is 1.10:1.
 */

/*
  Lookup with a fallback, per Button.jsx:12-17 — an unknown level degrades to
  the default instead of rendering an <hundefined>.
*/
const HEADING_TAGS = { 2: 'h2', 3: 'h3', 4: 'h4' };

/** UI-SPEC §7.7's meta line, verbatim: "Warwickshire · 6 services". */
const META_SEPARATOR = ' · ';

export function TownCard({
  town,
  href,
  region,
  serviceCount,
  headingLevel = 3,
  /* UI-SPEC §13-J. Defaults to 'a'; nothing in Phase 2 passes it. */
  as: As = 'a',
  className = '',
}) {
  const Heading = HEADING_TAGS[headingLevel] || HEADING_TAGS[3];

  /*
    Both halves are optional and the separator only appears when both are
    present, so a data row missing `region` renders "6 services" rather than
    " · 6 services". Number-typed on purpose: a `serviceCount` of 0 is a town
    with no pages yet and renders no count at all rather than "0 services".
  */
  const meta = [
    region,
    typeof serviceCount === 'number' && serviceCount > 0 ? `${serviceCount} services` : '',
  ]
    .filter(Boolean)
    .join(META_SEPARATOR);

  return (
    <article className={['bhc-town-card', className].filter(Boolean).join(' ')}>
      <Heading className="bhc-town-card__title">
        <As className="bhc-town-card__link" href={href}>
          {town}
        </As>
      </Heading>
      {meta ? <p className="bhc-town-card__meta">{meta}</p> : null}
    </article>
  );
}

export default TownCard;
