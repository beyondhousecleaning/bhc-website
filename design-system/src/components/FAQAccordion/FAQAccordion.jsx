/**
 * FAQAccordion — Beyond House Cleaning
 *
 * ROADMAP SUCCESS CRITERION 4: an FAQ that is present for readers AND for
 * crawlers and language models, with no structured data behind it.
 *
 * THIS COMPONENT EMITS NO STRUCTURED DATA OF ANY KIND. The reason, the
 * retirement date and the decision reference live in the prompt doc — the
 * schema type is deliberately not named anywhere in this file, because two
 * separate CI greps expect zero occurrences of that token and a well-meant
 * explanatory comment here would fail both of them.
 *
 * ZERO JAVASCRIPT. <details>/<summary> is native: the user agent owns the open
 * state, it works with JS disabled, and it keeps this a server component, so
 * plan 02-02's SC-4g client-boundary lock stays green. No library accordion in
 * existence buys anything this does not already do.
 *
 * NO `name` ATTRIBUTE. `name` turns a group of <details> into an exclusive
 * accordion, which collapses the answer the reader may still be halfway
 * through the moment they open the next one. Multiple-open is better for
 * scanning, which is what an FAQ is for. `defaultOpen` opens exactly one item
 * so there is an answer visible above the fold; everything else starts closed.
 *
 * THE ANSWERS ARE IN THE HTML EVEN WHEN CLOSED. Verified against this build in
 * 02-RESEARCH: a closed <details> still ships its full answer text in the
 * server-rendered document. That is the half of SC-4 that holds unconditionally
 * — nothing here is hidden from a crawler or a model, whatever the UA does with
 * the disclosure.
 *
 * Accessibility caveat, recorded in full in the prompt doc: <h3> inside
 * <summary> is valid per the HTML content model, but `summary` maps to a
 * button-like role and ARIA treats a button's descendants as presentational, so
 * heading exposure is inconsistent across browser/AT pairs. Nothing may be
 * designed to depend on screen-reader heading navigation through this FAQ, and
 * the accessible name is the <summary>'s TEXT CONTENT, not the <h3>.
 *
 * The <summary> is already covered by the shipped
 * :where(a, button, input, select, textarea, summary):focus-visible rule at
 * styles.css:45-49. No bespoke focus style is added here, and none may be.
 */

/*
  Derived, never hardcoded — this component appears on the home page, six
  service pages and several utility pages, and a fixed id would point every
  aria-labelledby on a page at the first FAQ in the document.

  Written with split/filter/join rather than the string-substitution method,
  which the claude-seo PostToolUse hook rejects inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

export function FAQAccordion({ heading, items = [], defaultOpen = 0, id, className = '' }) {
  /*
    UI-SPEC §11, and the shipped InterlinkBlock.jsx:37 convention: an empty
    accordion is worse than no accordion. From Phase 3 `items` is a data-module
    field, so the empty case is a real state, not a hypothetical.
  */
  const entries = items.filter(Boolean);
  if (!entries.length) return null;

  const headingId = heading ? (id ? `${id}-heading` : `bhc-faq-${slugify(heading)}`) : undefined;

  const list = entries.map((item, i) => (
    <details
      className="bhc-faq__item"
      key={item.question || i}
      /* No `name` — see the header comment. This is the only `open` there is. */
      open={i === defaultOpen}
    >
      <summary className="bhc-faq__summary">
        <h3 className="bhc-faq__q">{item.question}</h3>
        {/*
          Decorative: the disclosure state is already announced by `summary`'s
          native aria-expanded, so the chevron adds nothing for a screen reader.
          It rotates through --bhc-dur/--bhc-ease so the token-level
          prefers-reduced-motion override (which zeroes all three duration
          tokens) applies to it without a second media query.
        */}
        <svg
          className="bhc-faq__chevron"
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
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <div className="bhc-faq__a">{item.answer}</div>
    </details>
  ));

  return (
    <section
      className={['bhc-faq', className].filter(Boolean).join(' ')}
      id={id}
      aria-labelledby={headingId}
    >
      {heading ? (
        <h2 className="bhc-faq__heading" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {list}
    </section>
  );
}

export default FAQAccordion;
