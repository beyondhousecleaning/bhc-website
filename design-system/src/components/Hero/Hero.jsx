/**
 * Hero — Beyond House Cleaning
 *
 * LOCK 1: exactly one <h1> per page, and it carries the service and/or town.
 *
 * The live site breaks this on 101 of 115 pages, and it was caused by a DESIGN
 * pattern rather than a coding mistake — a two-line animated hero where the
 * keyword line was demoted to a styled <div>:
 *
 *   <h1 class="heading-style-h1">Reliable &amp; Affordable</h1>
 *   <div class="heading-style-h1">Deep Cleaning Services in Warwick</div>
 *
 * Result: 0 of 95 location-page H1s contain their town name.
 *
 * The props are deliberately split so that markup cannot be got wrong.
 * `eyebrow` is decoration and renders as a <p>. `heading` is ALWAYS the <h1>.
 * There is no prop that lets the adjective line become the heading.
 */

import { RatingBadge } from '../RatingBadge/RatingBadge.jsx';
import { Button } from '../Button/Button.jsx';

export function Hero({
  eyebrow,
  heading,
  lead,
  rating,
  actions = [],
  image,
  align = 'split',
  className = '',
}) {
  if (!heading) {
    throw new Error('Hero: `heading` is required — it renders the page <h1>.');
  }

  return (
    <section className={['bhc-hero', className].filter(Boolean).join(' ')}>
      <div className="bhc-container">
        <div
          className="bhc-hero__grid"
          style={align === 'centered' ? { gridTemplateColumns: '1fr', textAlign: 'center', justifyItems: 'center' } : undefined}
        >
          <div className="bhc-hero__copy">
            {rating ? (
              <div className="bhc-hero__rating">
                <RatingBadge {...rating} bare />
              </div>
            ) : null}

            {/* Decoration. Never the heading. */}
            {eyebrow ? <p className="bhc-hero__eyebrow">{eyebrow}</p> : null}

            {/* The keyword line. Always the <h1>. */}
            <h1 className="bhc-hero__heading">{heading}</h1>

            {lead ? <p className="bhc-hero__lead">{lead}</p> : null}

            {actions.length ? (
              <div className="bhc-hero__actions">
                {actions.map((action, i) => (
                  <Button
                    key={action.href || i}
                    href={action.href}
                    variant={action.variant || (i === 0 ? 'primary' : 'secondary')}
                    size="lg"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          {image && align !== 'centered' ? (
            <div className="bhc-hero__media">
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.sizes || '(min-width: 900px) 50vw, 100vw'}
                alt={image.alt}
                width={image.width}
                height={image.height}
                /* LCP element — never lazy, always high priority */
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Hero;
