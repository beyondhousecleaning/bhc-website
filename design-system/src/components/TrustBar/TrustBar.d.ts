import type { ReactNode } from 'react';

export interface TrustItem {
  label: string;
  /**
   * Decorative only — the label beside it already names the claim, so the
   * component wraps it in `aria-hidden="true"`. Omit it to use nothing; the
   * three default items each ship their own glyph.
   */
  icon?: ReactNode;
}

export interface TrustBarProps {
  /**
   * Renders an `<h2>` above the bar. Defaults to `Why people book us again`.
   * Pass `null` when a `SectionBand` already supplies the section heading —
   * that is the composed case, and it renders the bare `<ul>`.
   */
  heading?: string | null;
  /**
   * Defaults to the closed set of three: `DBS-checked cleaners`,
   * `Fully insured`, `Satisfaction guarantee`. There is no fourth claim, and
   * the rating is deliberately not among them — `RatingBadge` states it once
   * per page and a second statement dilutes both.
   *
   * An empty array renders nothing at all rather than an empty bar.
   */
  items?: TrustItem[];
  /**
   * The BAR's ground, not the section's — an ink bar sits on a paper band.
   *
   * There is deliberately no dark-blue member and one must not be added:
   * `--bhc-sponge` on `--bhc-navy` measures 2.49:1 and fails. On `--bhc-ink`
   * it is 6.59:1, which is why `ink` is the one ground where the glyphs take
   * sponge. An unknown value degrades to `paper`.
   */
  tone?: 'paper' | 'tint' | 'ink';
  className?: string;
}

export declare function TrustBar(props: TrustBarProps): JSX.Element | null;
export default TrustBar;
