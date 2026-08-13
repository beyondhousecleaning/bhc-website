import type { ReactNode } from 'react';

export interface FaqItem {
  /** Rendered as an `<h3>` inside the `<summary>`. Keep it a real question. */
  question: string;
  /**
   * A `ReactNode`, so an answer may be several paragraphs or a list. It ships
   * in the served HTML whether the item is open or closed — that is the half of
   * SC-4 that holds unconditionally.
   */
  answer: ReactNode;
}

export interface FAQAccordionProps {
  /**
   * Renders the section `<h2>` and wires `aria-labelledby` to it. Omit it when a
   * `SectionBand` already supplies the heading; the component then renders the
   * bare list.
   */
  heading?: string;
  /** Empty (or all-null) renders nothing at all — an empty FAQ is worse than none. */
  items: FaqItem[];
  /**
   * The index that starts expanded, so an answer is visible above the fold.
   * Defaults to `0`. Pass `-1` for an all-closed accordion.
   *
   * It sets `open` on that one item. The `<details>` carry **no `name`**, so
   * opening a second question never collapses the first — exclusive-accordion
   * behaviour takes away the answer the reader may still be using.
   */
  defaultOpen?: number;
  /** Sets the section's `id` and derives the heading id from it. */
  id?: string;
  className?: string;
}

export declare function FAQAccordion(props: FAQAccordionProps): JSX.Element | null;
export default FAQAccordion;
