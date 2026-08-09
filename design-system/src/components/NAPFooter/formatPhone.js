/**
 * Phone formatting — pure, no React.
 *
 * Lives apart from NAPFooter.jsx so Lock 4 can be tested without a JSX
 * toolchain. It is also the whole mechanism behind the lock: the displayed
 * string is DERIVED from the dial string, so the two cannot diverge.
 *
 * The live site displays +44 7861 936533 and dials 07441918832 on all 115
 * pages. That is only possible when display and href are separate inputs.
 *
 * Two ways that guarantee used to leak (CR-04), both closed here:
 *
 *   1. formatPhone's fallback returned `String(value)` — the RAW INPUT — for
 *      anything it could not render as a UK national number, while toDial kept
 *      normalising. Display and href were then two different numbers again,
 *      which is exactly the failure this module claims to make impossible. The
 *      fallback now returns toDial(value), so the displayed string is a
 *      rendering of the dialled digits on EVERY branch, formatted or not.
 *
 *   2. toDial prefixed +44 onto anything not already starting 44, so
 *      `+1 415 555 2671` became `tel:+4414155552671` — a UK number that does
 *      not exist — while the label still read +1 415 555 2671. Worse, the
 *      SC-2b built-HTML lock PASSED that case: it normalises both sides with
 *      .replace(/^44/, ''), which strips the fabricated 44 off the href, and
 *      the real 1 then matched on both sides by coincidence. An explicit `+`
 *      with a country code other than 44 is now taken at its word.
 *
 * Neither change alters the canonical numbers: `+447861936533` and
 * `07861936533` produce byte-identical output to before.
 */

/** Digits only. */
export const digitsOf = (value) => String(value).replace(/\D/g, '');

/** UK national significant number length (mobile and geographic alike). */
const UK_NATIONAL_LEN = 10;

/** The caller wrote an explicit international prefix. */
const isExplicitlyInternational = (value) => /^\s*\+/.test(String(value));

/**
 * Normalise any UK mobile/landline form to E.164-ish dial format.
 * `07861936533` and `+44 7861 936533` both become `+447861936533`.
 *
 * A value that already declares a non-UK country code is passed through with
 * its own code rather than having +44 fabricated onto the front of it.
 */
export function toDial(value) {
  const d = digitsOf(value);
  if (d.startsWith('44')) return `+${d}`;
  if (isExplicitlyInternational(value)) return `+${d}`;
  return `+44${d.replace(/^0/, '')}`;
}

/**
 * Human-readable form, derived from the same value as the href.
 * `+447861936533` -> `+44 7861 936533`
 *
 * Anything that is not a UK national number falls back to the dial string
 * itself — never to the raw input. Unformatted is acceptable; disagreeing with
 * the href is not.
 */
export function formatPhone(value) {
  const dial = toDial(value);
  const national = dial.startsWith('+44') ? dial.slice(3) : '';
  if (national.length !== UK_NATIONAL_LEN) return dial;
  return `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
}
