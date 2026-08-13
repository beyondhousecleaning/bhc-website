/**
 * CTABand — Beyond House Cleaning
 *
 * The one dark band on the page, ALWAYS immediately above the footer, and never
 * more than one per page (UI-SPEC §4). It is the closing ask, and it is the
 * reason the two scoped focus overrides at the end of styles.css exist.
 *
 * It composes SectionBand rather than re-implementing the band. Vertical
 * padding is --bhc-section-y in exactly one place in this package and this
 * component is not going to become the second one.
 *
 * Two measured rules ride on the navy ground:
 *
 *   - Button variant="secondary" is an outlined INK button. Ink on --bhc-navy
 *     is 2.65:1, so it does not read as an outline, it reads as nothing. The
 *     second action is `ghost`, which is currentColor — --bhc-paper here, at
 *     5.97:1. A `secondary` passed in anyway is coerced to `ghost` below.
 *   - --bhc-focus-ring is --bhc-action-hover, which is 1.15:1 on navy. The
 *     scoped override in styles.css swaps it for --bhc-paper at 5.97:1.
 *     Without it a keyboard user loses their position on every page of the
 *     site, since every page carries one of these.
 */

import { SectionBand } from '../SectionBand/SectionBand.jsx';
import { Button } from '../Button/Button.jsx';

/*
  Lookup with a fallback, per Button.jsx:12-17. `tone` is the SectionBand tone
  this band is allowed to take — navy or tint, nothing else. An unknown value
  degrades to navy.
*/
const TONES = { navy: 'navy', tint: 'tint' };

/*
  Outlined ink on navy is 2.65:1. Rather than let a call site ship an invisible
  button, the band swaps it for the variant that works on its own ground.
*/
const resolveVariant = (requested, band) =>
  band === 'navy' && requested === 'secondary' ? 'ghost' : requested;

export function CTABand({ heading, lead, actions = [], tone = 'navy', id, className = '' }) {
  if (!heading) {
    throw new Error('CTABand: `heading` is required — the band is the closing ask on every page.');
  }

  const band = TONES[tone] || TONES.navy;

  return (
    <SectionBand
      tone={band}
      heading={heading}
      intro={lead}
      width="narrow"
      id={id}
      className={['bhc-cta', className].filter(Boolean).join(' ')}
    >
      {/*
        T-02-19: `actions` arrives from a data module in Phase 3 and this band
        is on every route, so a null entry must not throw during server render.
        Same guard idiom as NAPFooter.jsx:89-107.
      */}
      {actions.length ? (
        <div className="bhc-cta__actions">
          {actions.filter(Boolean).map((action, i) => (
            <Button
              key={action.href || i}
              href={action.href}
              variant={resolveVariant(action.variant || (i === 0 ? 'primary' : 'ghost'), band)}
              size="lg"
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </SectionBand>
  );
}

export default CTABand;
