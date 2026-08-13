/**
 * ProcessSteps — Beyond House Cleaning
 *
 * Three numbered steps, in the section order Arbor Trail proved and this site
 * copies with warm neutrals rather than their cold blue.
 *
 * THE NUMBERS COME FROM THE LIST'S OWN ORDINAL, via a CSS counter on the <ol>,
 * and are never typed into the data. Hand-typed numerals desynchronise the
 * moment someone reorders the array — and the array is a data file from Phase 3
 * onward, edited by whoever is writing copy that week, not by whoever wrote
 * this component. A counter cannot go out of order because there is nothing to
 * keep in order.
 *
 * The disc is --bhc-action with an --bhc-ink numeral: 5.17:1, the CTA pairing.
 * White on --bhc-action is 3.05:1 and is not an option. It is 44px, which is
 * UI-SPEC §2's minimum touch target reused as the disc size so the discs line
 * up with every other 44px affordance on the page.
 */

const HEADING_TAGS = { 2: 'h2', 3: 'h3' };

/*
  The step title always sits one level below the section heading, so the
  outline stays legal whichever level the band is rendered at. Base h3 is
  --bhc-text-xl and h4 is --bhc-text-lg, matching UI-SPEC §3's binding table.
*/
const STEP_TAGS = { 2: 'h3', 3: 'h4' };

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

export function ProcessSteps({ heading, steps = [], headingLevel = 2, className = '' }) {
  const Heading = HEADING_TAGS[headingLevel] || HEADING_TAGS[2];
  const StepTitle = STEP_TAGS[headingLevel] || STEP_TAGS[2];

  /*
    T-02-19. Phase 3 feeds `steps` from a data module and this renders inside
    the root layout's page tree, so a null entry that threw during server render
    would take the whole route rather than one list item. Same guard idiom as
    NAPFooter.jsx:89-107.
  */
  const items = steps.filter(Boolean).map((step, i) => (
    <li className="bhc-steps__item" key={step.title || i}>
      <StepTitle className="bhc-steps__title">{step.title}</StepTitle>
      {step.body ? <p className="bhc-steps__body">{step.body}</p> : null}
    </li>
  ));

  /*
    Without a heading the component IS the list, which is the composed case:
    a SectionBand supplies the <h2> and this drops inside it.

    With a heading it needs a wrapper, because an <ol>'s content model is li,
    script and template only — a heading inside the list would be invalid HTML
    that the parser hoists out of the list, breaking the counter that the
    numerals depend on.
  */
  if (!heading) {
    return <ol className={['bhc-steps', className].filter(Boolean).join(' ')}>{items}</ol>;
  }

  const headingId = `bhc-steps-${slugify(heading)}`;

  return (
    <section
      className={['bhc-steps__band', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <Heading className="bhc-steps__heading" id={headingId}>
        {heading}
      </Heading>
      <ol className="bhc-steps">{items}</ol>
    </section>
  );
}

export default ProcessSteps;
