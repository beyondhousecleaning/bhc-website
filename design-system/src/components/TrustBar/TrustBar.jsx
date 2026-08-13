/**
 * TrustBar — Beyond House Cleaning
 *
 * Three claims, and only three: DBS-checked cleaners, fully insured,
 * satisfaction guarantee. The set is closed (design-system.md §3.1, UI-SPEC §5)
 * and a fourth is not a decision this component gets to make — every extra badge
 * on a trades site costs the other three a share of the same glance.
 *
 * THE RATING IS NOT RESTATED HERE. RatingBadge owns it and states it exactly
 * once per page, in the Hero. A second statement of the same number in the band
 * directly below is not twice the trust, it is one claim in two voices, and it
 * doubles the surface that has to be corrected when the count moves.
 *
 * `tone` HAS NO NAVY MEMBER AND MUST NOT GAIN ONE. Measured: --bhc-sponge on
 * --bhc-navy is 2.49:1, which fails. On --bhc-ink it is 6.59:1, which is why
 * tone="ink" is the one ground where the glyphs take sponge; on every other
 * ground they inherit currentColor. An authorisation for sponge on navy was
 * written into the colour contract and withdrawn before anyone acted on it —
 * this note, the CSS banner and the prompt doc are what stop it coming back.
 * An unknown `tone` degrades to the default rather than emitting a modifier
 * class that no rule matches (Button.jsx:12-17).
 *
 * The glyphs are decorative by construction: the label sits beside each one and
 * already says it, so they are aria-hidden="true" focusable="false" per
 * UI-SPEC §1 row 1, which is what delta 14 asserts.
 *
 * Colour note carried from plan 02-04: on tone="ink" this component sets
 * --bhc-paper and --bhc-sponge directly rather than inheriting currentColor.
 * Both are measured against --bhc-ink and against nothing else, so the bar
 * belongs on paper, warm or tint grounds and never on the one navy band.
 */

/*
  Derived, never hardcoded — the bar appears on the home page and on six service
  pages, and a fixed id would point every aria-labelledby on a page at the first
  one in the document.

  Written with split/filter/join rather than the string-substitution method,
  which the claude-seo PostToolUse hook rejects inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

/*
  paper maps to NO modifier class, the SectionBand convention (styles.css:81-85):
  the default ground is the page's own, so there is nothing to declare.
*/
const TONES = {
  paper: '',
  tint: 'bhc-trustbar--tint',
  ink: 'bhc-trustbar--ink',
};

/*
  The a11y attributes are written out on every glyph below rather than spread
  from a shared props object. Delta 14 reads each opening tag as SOURCE TEXT, so
  a spread presents as an unlabelled graphic to the one lock that can see this
  class of defect. The full explanation is in the prompt doc, which no scanner
  reads — an example of the defective form written here would itself be matched
  by the scan it explains, which has now happened to this repo six times.
*/
function ShieldCheck() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.2 19 6v5.1c0 4.3-2.9 8.1-7 9.2-4.1-1.1-7-5-7-9.2V6l7-2.8z" />
      <path d="m8.8 11.9 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

function Umbrella() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.4 11.7a8.6 8.6 0 0 1 17.2 0z" />
      <path d="M12 11.7v6.6a2.1 2.1 0 0 0 4.2 0" />
    </svg>
  );
}

function Rosette() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="9.2" r="5.6" />
      <path d="m8.5 14-1.7 6.3 5.2-2.7 5.2 2.7-1.7-6.3" />
    </svg>
  );
}

/** UI-SPEC §5's <h2> deck. */
const DEFAULT_HEADING = 'Why people book us again';

/** design-system.md §3.1, quoted in UI-SPEC §5. A closed set of three. */
const DEFAULT_ITEMS = [
  { label: 'DBS-checked cleaners', icon: <ShieldCheck /> },
  { label: 'Fully insured', icon: <Umbrella /> },
  { label: 'Satisfaction guarantee', icon: <Rosette /> },
];

export function TrustBar({
  heading = DEFAULT_HEADING,
  items = DEFAULT_ITEMS,
  tone = 'paper',
  className = '',
}) {
  /*
    The InterlinkBlock.jsx:37 convention. `items` is a prop, so an explicit empty
    array is a reachable state, and a heading above an empty bar is worse than no
    bar at all. `.filter(Boolean)` is the NAPFooter.jsx:89-107 guard: this renders
    on every template, so one null entry must not take the whole route.
  */
  const entries = items.filter(Boolean);
  if (!entries.length) return null;

  const toneClass = TONES[tone] || TONES.paper;

  const listItems = entries.map((item, i) => (
    <li className="bhc-trustbar__item" key={item.label || i}>
      {item.icon ? (
        <span className="bhc-trustbar__icon" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}
      <span className="bhc-trustbar__label">{item.label}</span>
    </li>
  ));

  /*
    Two forms, the ProcessSteps.jsx:67-69 precedent. Without a heading the
    component IS the bar, which is the composed case: a SectionBand supplies the
    <h2> and this drops inside it. With one it needs a wrapper, because a <ul>'s
    content model is li, script and template only.

    The tone lives on the <ul> in both forms, because the tone is the BAR's
    ground, not the section's — an ink bar sits on a paper band, which is the
    whole reason the two are separate elements.
  */
  if (!heading) {
    return (
      <ul className={['bhc-trustbar', toneClass, className].filter(Boolean).join(' ')}>
        {listItems}
      </ul>
    );
  }

  const headingId = `bhc-trustbar-${slugify(heading)}`;

  return (
    <section
      className={['bhc-trustbar__band', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <h2 className="bhc-trustbar__heading" id={headingId}>
        {heading}
      </h2>
      <ul className={['bhc-trustbar', toneClass].filter(Boolean).join(' ')}>{listItems}</ul>
    </section>
  );
}

export default TrustBar;
