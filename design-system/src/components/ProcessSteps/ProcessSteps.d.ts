export interface Step {
  /** Renders the step's heading — an `<h3>` under an `<h2>` band, `<h4>` under an `<h3>`. */
  title: string;
  body: string;
}

export interface ProcessStepsProps {
  /**
   * Renders the section heading and wraps the list in a `<section>`. Omit it
   * when a `SectionBand` already supplies the `<h2>`, and the component renders
   * the bare `<ol>`.
   *
   * A heading cannot go inside the `<ol>`: its content model is `li`, `script`
   * and `template` only, and a hoisted heading would break the counter.
   */
  heading?: string;
  /**
   * **No step carries its own number.** The numerals come from a CSS counter on
   * the `<ol>`, so reordering this array cannot desynchronise them. Defaults to
   * `[]` and null entries are filtered — a malformed data-file entry must not
   * throw during server render.
   */
  steps: Step[];
  /** The section heading's level. Step titles always sit one level below it. */
  headingLevel?: 2 | 3;
  className?: string;
}

export declare function ProcessSteps(props: ProcessStepsProps): JSX.Element;
export default ProcessSteps;
