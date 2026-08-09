import type { ReactNode } from 'react';

export interface SectionBandProps {
  /**
   * The band's ground. `paper` emits no modifier class at all — there is no
   * `.bhc-section--paper` rule, by design. An unknown value degrades to
   * `paper` rather than emitting `bhc-section--undefined`.
   *
   * At most ONE `navy` band per page, and it is `CTABand` (UI-SPEC §4).
   */
  tone?: 'paper' | 'warm' | 'tint' | 'navy';
  /** Renders the band's heading. Omit it and no `<h2>` and no `aria-labelledby` are emitted. */
  heading?: string;
  /**
   * `2` (the default) renders an `<h2>` at `--bhc-text-2xl`; `3` renders an
   * `<h3>` at `--bhc-text-xl`, per UI-SPEC §3's binding table. Use `3` only
   * when the band is nested under another section's `<h2>`.
   */
  headingLevel?: 2 | 3;
  /** The lead paragraph under the heading — `.bhc-section__intro`, `--bhc-text-lg`. */
  intro?: string;
  /** Maps to `bhc-container`, `bhc-container--narrow` (800px) or `bhc-container--wide` (1440px). */
  width?: 'default' | 'narrow' | 'wide';
  /**
   * Anchor target for the `<section>`. The heading's own id is derived from it
   * (`{id}-heading`), or from a slug of the heading when it is absent — never
   * hardcoded, because a page carries several bands.
   */
  id?: string;
  className?: string;
  children: ReactNode;
}

export declare function SectionBand(props: SectionBandProps): JSX.Element;
export default SectionBand;
