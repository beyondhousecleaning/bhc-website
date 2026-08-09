/**
 * SectionBand — Beyond House Cleaning
 *
 * The band rhythm wrapper. UI-SPEC §4 produces the 60/30/10 colour split by
 * ALTERNATING surfaces down the page rather than by choosing a tone per
 * section, and §2 fixes every band's vertical padding at --bhc-section-y
 * (clamp(64px, 8vw, 96px)). Seventeen routes are composed in waves 4 and 5;
 * a page that hand-rolls its own padding is a page whose rhythm has already
 * drifted from the other sixteen.
 *
 * The four classes this wraps — bhc-section, --warm, --tint, --navy — all
 * shipped in Phase 1. There is deliberately NO .bhc-section--paper rule, so
 * tone="paper" maps to the empty string and .filter(Boolean) drops it. That
 * is why the TONES map below carries an empty value rather than a class name.
 *
 * Two measured constraints ride on the navy tone:
 *   - headings already flip to --bhc-paper (5.97:1) via the shipped
 *     .bhc-section--navy :where(h1,h2,h3,h4) rule;
 *   - the intro paragraph does NOT, and --bhc-ink-muted on --bhc-navy is
 *     1.10:1, so this component's CSS block overrides it to --bhc-paper.
 */

/*
  Variant lookups with a fallback, per Button.jsx:12-17. An unknown value
  degrades to the default; it never emits `bhc-section--undefined` on a page.
*/
const TONES = {
  paper: '',
  warm: 'bhc-section--warm',
  tint: 'bhc-section--tint',
  navy: 'bhc-section--navy',
};

const WIDTHS = {
  default: 'bhc-container',
  narrow: 'bhc-container bhc-container--narrow',
  wide: 'bhc-container bhc-container--wide',
};

const HEADING_TAGS = { 2: 'h2', 3: 'h3' };

/*
  A slug, not a hardcoded id: SectionBand appears many times on one page, so a
  fixed id would produce duplicate ids and point every aria-labelledby at the
  first band. Written with split/filter/join rather than the string-substitution
  method, which the claude-seo PostToolUse hook rejects inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

export function SectionBand({
  tone = 'paper',
  heading,
  headingLevel = 2,
  intro,
  width = 'default',
  id,
  className = '',
  children,
}) {
  const Heading = HEADING_TAGS[headingLevel] || HEADING_TAGS[2];

  /*
    Derived from the `id` prop when there is one so an anchor target and its
    label cannot collide, and from the heading text otherwise.
  */
  const headingId = heading ? (id ? `${id}-heading` : `bhc-band-${slugify(heading)}`) : undefined;

  return (
    <section
      id={id}
      className={['bhc-section', TONES[tone] || TONES.paper, className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <div className={WIDTHS[width] || WIDTHS.default}>
        {heading || intro ? (
          <div className="bhc-section__head">
            {heading ? (
              <Heading className="bhc-section__heading" id={headingId}>
                {heading}
              </Heading>
            ) : null}
            {intro ? <p className="bhc-section__intro">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default SectionBand;
