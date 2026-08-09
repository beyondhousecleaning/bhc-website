import type { ElementType } from 'react';

export interface QuoteFormEntryProps {
  /** Defaults to UI-SPEC §5's `<h2>`: *Get a free quote in under two minutes*. */
  heading?: string;
  /**
   * The reassurance list. Defaults to the three in UI-SPEC §5 — *No obligation*,
   * *Fixed price before we start*, *DBS-checked, insured cleaners*. Null entries
   * are filtered; an empty array renders no list.
   */
  bullets?: string[];
  /** The quote-flow destination. Defaults to `/get-a-quote`. */
  href?: string;
  /**
   * **Omit it.** Defaults to the canonical number in `src/phone.js`; the
   * displayed text and the `tel:` href are both derived from this one value, so
   * they cannot diverge — there is deliberately no prop for the displayed text.
   *
   * A malformed value **throws** rather than rendering `tel:+44`, which would
   * otherwise be an empty interactive element on every page carrying this panel.
   */
  phone?: string;
  /** Sets the panel's `id` and derives the heading id from it. */
  id?: string;
  /**
   * The element rendered for both actions. Defaults to `'a'`. UI-SPEC §13-J's
   * one-line escape hatch; nothing in Phase 2 passes it.
   */
  as?: ElementType;
  className?: string;
}

export declare function QuoteFormEntry(props: QuoteFormEntryProps): JSX.Element;
export default QuoteFormEntry;
