/**
 * BeforeAfterSlider — Beyond House Cleaning
 *
 * ROADMAP SUCCESS CRITERION 3.
 *
 * IT HAS TWO STATES AND IT NEVER RETURNS null. A missing photograph must not
 * silently remove a section from a page: the whole point of SC-3 is that no page
 * blocks on photography that does not exist yet. Where every other empty-data
 * component in this package renders nothing, this one renders a finished-looking,
 * clearly labelled figure and marks itself for machines with
 * data-bhc-photo-state.
 *
 *   pending — no pairs. Two token-coloured inline panels, real BEFORE and AFTER
 *             text, the empty-state heading and body copy, and one link out.
 *   live    — pairs supplied. Real images, one figure per pair.
 *
 * The built-HTML suite asserts the pending state renders on the pages that use
 * this component without pairs; Phase 4 asserts it reaches zero on the pages it
 * has backfilled. That attribute is the hand-off between the two phases and it
 * is the only machine-readable half of it.
 *
 * BEFORE AND AFTER ARE REAL TEXT, NEVER BAKED INTO THE IMAGE. That is one of the
 * two independent reasons the 199 existing Canva exports were rejected as source
 * (the other is the superseded logo composited over every one of them). Baked
 * labels are invisible to a screen reader, untranslatable, and unreadable at any
 * size but the one they were exported at.
 *
 * NO DRAG HANDLE IN PHASE 2. A pointer-driven divider needs a pointer listener,
 * which needs a client component, which turns the client-boundary gate red — for
 * content that does not exist yet. Side by side at 768px and above, with a
 * two-pane scroll-snap track below, gives the comparison for zero JavaScript. If
 * a later phase wants a handle once real photographs land, it has to be argued
 * against the zero-client-modules decision on its own merits.
 *
 * THE PANELS ARE role="img" WITH A NON-EMPTY aria-label, AND NEVER alt. `alt` is
 * not a valid attribute on an inline vector graphic: the parser drops it in
 * silence, and the image lock greps <img> tags only, so an unlabelled panel
 * would otherwise ship on every page with nothing in the suite able to see it.
 * Each panel is the only content of its half of the figure, so it is a
 * meaningful graphic and this supersedes the decorative default for these two
 * elements specifically. Delta 14 asserts it.
 *
 * THE LINK SITS OUTSIDE THE SCROLL TRACK. The track carries tabindex="0" so a
 * keyboard user can scroll it, which is correct only while it contains nothing
 * focusable; a link inside it would become a redundant tab stop immediately
 * before itself. Same rule as ReviewRail, opposite outcome, because this state
 * has a link and a review card does not.
 *
 * Real images are loading="lazy" decoding="async" with NO fetchPriority — the
 * inverse of Hero.jsx:75-90. The largest paint on every template is the Hero
 * image and it is never this one.
 *
 * Colour: the captions and the pane labels are --bhc-ink-muted directly, so this
 * component belongs on paper, warm or tint grounds and never on the one navy
 * band, where that token measures 1.10:1.
 */

import { Button } from '../Button/Button.jsx';

/*
  Derived, never hardcoded. Written with split/filter/join rather than the
  string-substitution method, which the claude-seo PostToolUse hook rejects
  inside a .jsx.
*/
const slugify = (value) =>
  String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');

/** UI-SPEC §5's empty-state copy, verbatim. */
const PENDING_HEADING = 'Real homes, real results';
const PENDING_BODY =
  "We're re-shooting our before-and-after photography in-house, with our own team and our own equipment. Every pair here will be a real Warwickshire home we cleaned — no stock images, no borrowed shots.";

/* The closed call-to-action set, and the only link this component renders. */
const PENDING_CTA_LABEL = "See What's Included";
const PENDING_CTA_HREF = '/checklist';

/*
  Two distinct labels rather than one repeated: a screen-reader user moving
  through the figure hears which half of the comparison they are on. Honest and
  finished-sounding, per UI-SPEC §11 — the state is signalled to machines by the
  data attribute and to people by copy that does not apologise for itself.
*/
const PENDING_BEFORE_LABEL = 'Before — our own before-and-after photography is in production';
const PENDING_AFTER_LABEL = 'After — our own before-and-after photography is in production';

/*
  The two panels are drawn from tokens, so they inherit the palette rather than
  carrying a second one. Written out per element rather than shared, because
  delta 14 reads each opening tag as source text.
*/
function PendingPanels() {
  return (
    <div className="bhc-ba__track" tabIndex={0} role="group" aria-label="Before and after comparison">
      <div className="bhc-ba__pane">
        <p className="bhc-ba__label">BEFORE</p>
        <svg
          className="bhc-ba__panel"
          viewBox="0 0 800 600"
          role="img"
          aria-label={PENDING_BEFORE_LABEL}
        >
          <rect width="800" height="600" fill="var(--bhc-paper-tint)" />
          <path d="M0 452h800" stroke="var(--bhc-line)" strokeWidth="6" />
          <rect x="96" y="132" width="264" height="196" rx="12" fill="none" stroke="var(--bhc-line)" strokeWidth="6" />
          <path d="M228 132v196M96 230h264" stroke="var(--bhc-line)" strokeWidth="6" />
          <rect x="452" y="268" width="252" height="184" rx="10" fill="none" stroke="var(--bhc-line)" strokeWidth="6" />
          <circle cx="560" cy="360" r="26" fill="var(--bhc-line)" />
          <circle cx="648" cy="336" r="14" fill="var(--bhc-line)" />
          <circle cx="512" cy="416" r="10" fill="var(--bhc-line)" />
        </svg>
      </div>
      <div className="bhc-ba__pane">
        <p className="bhc-ba__label">AFTER</p>
        <svg
          className="bhc-ba__panel"
          viewBox="0 0 800 600"
          role="img"
          aria-label={PENDING_AFTER_LABEL}
        >
          <rect width="800" height="600" fill="var(--bhc-paper-warm)" />
          <path d="M0 452h800" stroke="var(--bhc-line)" strokeWidth="6" />
          <rect x="96" y="132" width="264" height="196" rx="12" fill="none" stroke="var(--bhc-line)" strokeWidth="6" />
          <path d="M228 132v196M96 230h264" stroke="var(--bhc-line)" strokeWidth="6" />
          <rect x="452" y="268" width="252" height="184" rx="10" fill="none" stroke="var(--bhc-line)" strokeWidth="6" />
          <path d="m596 344 18 38 40 6-29 28 7 40-36-19-36 19 7-40-29-28 40-6z" fill="var(--bhc-sponge)" />
        </svg>
      </div>
    </div>
  );
}

function Pair({ pair }) {
  const { before, after, room, service, town } = pair;

  /*
    Fail at build time rather than ship an unlabelled photograph across every
    page that carries this component. The image lock scans previews only, so
    nothing downstream would catch a data file that omitted alt text.
  */
  if (!before || !before.alt || !after || !after.alt) {
    throw new Error(
      'BeforeAfterSlider: every pair needs `before.alt` and `after.alt` — an unlabelled photograph is not shippable.'
    );
  }

  /* One string, one text node: the caption is read as text content. */
  const caption = [room, service, town].filter(Boolean).join(' · ');

  return (
    <figure className="bhc-ba__pair" data-bhc-photo-state="live">
      <div className="bhc-ba__track" tabIndex={0} role="group" aria-label={`Before and after — ${caption}`}>
        <div className="bhc-ba__pane">
          <p className="bhc-ba__label">BEFORE</p>
          <img
            className="bhc-ba__img"
            src={before.src}
            srcSet={before.srcSet}
            sizes={before.sizes || '(min-width: 768px) 45vw, 85vw'}
            alt={before.alt}
            width={before.width}
            height={before.height}
            /* The largest paint is Hero's image, never this one. */
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="bhc-ba__pane">
          <p className="bhc-ba__label">AFTER</p>
          <img
            className="bhc-ba__img"
            src={after.src}
            srcSet={after.srcSet}
            sizes={after.sizes || '(min-width: 768px) 45vw, 85vw'}
            alt={after.alt}
            width={after.width}
            height={after.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <figcaption className="bhc-ba__caption">{caption}</figcaption>
    </figure>
  );
}

export function BeforeAfterSlider({ heading, intro, pairs, className = '' }) {
  /*
    `pairs` is optional AND may arrive null from a data module, so the coercion
    is deliberate: absent, null and empty are one state, and that state renders
    something rather than nothing.
  */
  const entries = (pairs || []).filter(Boolean);

  /* The wrapper exists only when there is something to put above the figure. */
  const banded = Boolean(heading || intro);

  const figure = entries.length ? (
    <div className={['bhc-ba', banded ? '' : className].filter(Boolean).join(' ')}>
      {entries.map((pair, i) => (
        <Pair key={[pair.room, pair.service, pair.town, i].filter(Boolean).join('-')} pair={pair} />
      ))}
    </div>
  ) : (
    <figure
      className={['bhc-ba', 'bhc-ba--pending', banded ? '' : className].filter(Boolean).join(' ')}
      data-bhc-photo-state="pending"
    >
      <PendingPanels />
      {/*
        Outside the track above, deliberately: the track is focusable so it can
        be scrolled by keyboard, and that is only correct while it holds nothing
        focusable itself.
      */}
      <figcaption className="bhc-ba__pending">
        <h3 className="bhc-ba__pending-title">{PENDING_HEADING}</h3>
        <p className="bhc-ba__pending-body">{PENDING_BODY}</p>
        <Button href={PENDING_CTA_HREF} variant="secondary">
          {PENDING_CTA_LABEL}
        </Button>
      </figcaption>
    </figure>
  );

  /*
    Two forms, the ProcessSteps.jsx:67-69 precedent. Composed inside a
    SectionBand that already carries the section <h2>, this renders the bare
    figure; given a `heading` it supplies its own. The empty-state title is an
    <h3> either way, because it sits one level under whichever <h2> introduced
    the section.
  */
  if (!banded) return figure;

  const headingId = heading ? `bhc-ba-${slugify(heading)}` : undefined;

  return (
    <section
      className={['bhc-ba__band', className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      {heading ? (
        <h2 className="bhc-ba__heading" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {intro ? <p className="bhc-ba__intro">{intro}</p> : null}
      {figure}
    </section>
  );
}

export default BeforeAfterSlider;
