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
 *
 * A THIRD leak, closed in Phase 2: DEGRADATION. Divergence was fixed by making
 * display a rendering of the dial string — but both sides could still agree on
 * something unrenderable. `toDial('')` returned `+44` and `formatPhone('')`
 * agreed, so the parity assertion stayed green while the page shipped
 * `<a href="tel:+44"></a>`: an empty interactive element, a WCAG 2.4.4 failure,
 * and a dead tap target. Phase 2 takes the site from 1 tel: link to 4 per page
 * across 17 pages (~410 pages in Phase 3), so a value that cannot be rendered
 * now THROWS. It breaks the build, where one person sees it once, instead of
 * prerendering silently onto every page. See Pattern S6: fail loudly at build
 * time, never degrade.
 */

/** Digits only. */
export const digitsOf = (value) => String(value).replace(/\D/g, '');

/** UK national significant number length (mobile and geographic alike). */
const UK_NATIONAL_LEN = 10;

/** The caller wrote an explicit international prefix. */
const isExplicitlyInternational = (value) => /^\s*\+/.test(String(value));

/*
  Quoting the offending value by hand rather than reaching for the raw JSON
  serialiser. locks.test.js fails ANY file under src/ that names it, because a
  Phase-3 author using it in a JSON-LD emitter reintroduces the script-breakout
  that jsonLd.js exists to prevent. That scan is a plain substring match over
  the whole file — it cannot tell a message-formatting call from an emitter,
  and it cannot tell either from a comment mentioning one. Do not write the
  identifier here, in code or in prose. (This paragraph is why: the scan caught
  an earlier draft of this very comment.)
*/
const describe = (value) => (typeof value === 'string' ? `"${value}"` : String(value));

const reject = (value) => {
  throw new TypeError(`toDial: ${describe(value)} is not a dialable UK number`);
};

/**
 * Normalise any UK mobile/landline form to E.164-ish dial format.
 * `07861936533` and `+44 7861 936533` both become `+447861936533`.
 *
 * A value that already declares a non-UK country code is passed through with
 * its own code rather than having +44 fabricated onto the front of it.
 *
 * THROWS a TypeError rather than degrading. A value that is not a string, that
 * carries no digits at all, or whose UK national part is not exactly
 * UK_NATIONAL_LEN digits has no correct rendering — and the alternative to
 * throwing is prerendering a dead `tel:` onto every page. Explicitly
 * international values are exempt from the length check: their length is not
 * this module's to police, and passing them through unchanged is the CR-04
 * fix.
 */
export function toDial(value) {
  if (typeof value !== 'string') reject(value);

  const d = digitsOf(value);
  if (!d) reject(value);

  if (d.startsWith('44')) {
    if (d.length - 2 !== UK_NATIONAL_LEN) reject(value);
    return `+${d}`;
  }

  if (isExplicitlyInternational(value)) return `+${d}`;

  const national = d.replace(/^0/, '');
  if (national.length !== UK_NATIONAL_LEN) reject(value);
  return `+44${national}`;
}

/**
 * Human-readable form, derived from the same value as the href.
 * `+447861936533` -> `+44 7861 936533`
 *
 * Needs no guard of its own: it calls toDial FIRST, so an unrenderable value
 * throws there and both functions reject exactly the same inputs. What reaches
 * the fallback is now only the explicitly-international case, which displays
 * as its own dial string — unformatted is acceptable, disagreeing with the href
 * is not, and inventing a UK grouping for a foreign number would be both.
 */
export function formatPhone(value) {
  const dial = toDial(value);
  const national = dial.startsWith('+44') ? dial.slice(3) : '';
  if (national.length !== UK_NATIONAL_LEN) return dial;
  return `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
}
