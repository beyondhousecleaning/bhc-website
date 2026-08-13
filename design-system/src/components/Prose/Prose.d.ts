import type { ReactNode } from 'react';

export interface ProseProps {
  /**
   * Long-form body copy. **Never an `<h1>`** — `Prose` is a container and its
   * outline starts at `<h2>`. Lock 1 allows exactly one `<h1>` per page and it
   * comes from `Hero`; an `<h1>` passed in here breaks that lock on every page
   * the component appears on.
   */
  children: ReactNode;
  /**
   * `'prose'` (the default) is the `--bhc-container-prose` measure — 68ch,
   * roughly 578px at the base step. That is the readable measure for the
   * 800–1,100 word pages this component exists for.
   *
   * `'narrow'` widens the column to `--bhc-container-narrow` (800px). Despite
   * the name it is the **wider** of the two: it is named after the container
   * token it uses, and it exists for reference copy — legal clauses, checklist
   * tables, long link runs — that needs the horizontal room. Body copy keeps
   * the default measure.
   */
  width?: 'prose' | 'narrow';
  className?: string;
}

export declare function Prose(props: ProseProps): JSX.Element;
export default Prose;
