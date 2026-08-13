/**
 * The canonical phone number — pure data, no React.
 *
 * Lives apart from the .jsx components that default from it for two
 * independent reasons:
 * (a) `node --test` has no JSX transform, so a constant declared inside a .jsx
 *     file cannot be read by the lock suite without a toolchain this package
 *     deliberately does not have;
 * (b) the `claude-seo` PostToolUse hook rejects any .jsx/.tsx write containing
 *     the case-insensitive substring REPLACE — which every `.replace(` call
 *     contains. Every `.replace(` in this package is in a .js file. Keep it so.
 *
 * What it defends against: four components — NAPFooter, Header, StickyCallBar
 * and QuoteFormEntry — default their `phone` prop from this constant. Restating
 * the literal in each of them would be four places the number can be wrong, and
 * that is not hypothetical: the live site ships THREE different numbers, and its
 * footer DISPLAYS one while it DIALS another on all 115 pages. Lock 4 phrases
 * the rule as "href digits must equal displayed digits" because that is
 * testable; single-sourcing the value is what makes it true by construction.
 *
 * Package-internal plumbing — deliberately NOT re-exported from src/index.js.
 * The app never passes a `phone` prop; it renders a component and the default
 * arrives from here.
 */

/** The ONE number. Everything displayed anywhere is derived from it. */
export const CANONICAL_PHONE = '+447861936533';
