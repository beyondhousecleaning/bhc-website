/**
 * Phone formatting — pure, no React.
 *
 * Lives apart from NAPFooter.jsx so Lock 4 can be tested without a JSX
 * toolchain. It is also the whole mechanism behind the lock: the displayed
 * string is DERIVED from the dial string, so the two cannot diverge.
 *
 * The live site displays +44 7861 936533 and dials 07441918832 on all 115
 * pages. That is only possible when display and href are separate inputs.
 */

/** Digits only. */
export const digitsOf = (value) => String(value).replace(/\D/g, '');

/**
 * Normalise any UK mobile/landline form to E.164-ish dial format.
 * `07861936533` and `+44 7861 936533` both become `+447861936533`.
 */
export function toDial(value) {
  const d = digitsOf(value);
  if (d.startsWith('44')) return `+${d}`;
  return `+44${d.replace(/^0/, '')}`;
}

/**
 * Human-readable form, derived from the same value as the href.
 * `+447861936533` -> `+44 7861 936533`
 */
export function formatPhone(value) {
  const national = digitsOf(toDial(value)).slice(2);
  if (national.length !== 10) return String(value);
  return `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
}
