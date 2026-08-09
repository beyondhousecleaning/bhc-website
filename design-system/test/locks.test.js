/**
 * Lock assertions.
 *
 * The design system's locks are written as assertions precisely so they can be
 * tested rather than hoped for. The live site regressed silently on nearly all
 * of them; guidance caught none.
 *
 *   node --test test/
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the PURE modules — node --test cannot parse JSX, and the locks are
// deliberately implemented in plain JS so they are testable without a build.
import { formatPhone, toDial } from '../src/components/NAPFooter/formatPhone.js';
import { distanceMiles, nearestTowns, buildInterlinks } from '../src/components/InterlinkBlock/geo.js';
import { safeJsonLd } from '../src/jsonLd.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const digits = (s) => String(s).replace(/\D/g, '');

/* --- Lock 4 — href digits must equal displayed digits -------------------- */

test('Lock 4: display string is derived from the dial string', () => {
  // Both input forms must converge on one displayed number.
  assert.equal(formatPhone('+447861936533'), '+44 7861 936533');
  assert.equal(formatPhone('07861936533'), '+44 7861 936533');
  assert.equal(formatPhone('+44 7861 936533'), '+44 7861 936533');
});

test('Lock 4: the live-site bug is impossible through this API', () => {
  // Live footer: DISPLAYS +44 7861 936533, DIALS 07441918832.
  const wrong = '07441918832';
  const display = formatPhone(wrong);

  // Whatever is displayed always matches what is dialled, nationally.
  assert.equal(digits(display).replace(/^44/, ''), digits(wrong).replace(/^0/, ''));

  // And it is NOT the number the live site displays alongside it.
  assert.notEqual(display, '+44 7861 936533');
});

test('Lock 4: the displayed string is never the raw input, on any branch', () => {
  // CR-04. formatPhone's fallback used to return String(value) unchanged, so
  // any value it could not render as a UK national number displayed one number
  // beside an href that dialled another — the live-site bug, reintroduced
  // through the very API written to prevent it. The invariant is unconditional:
  // whatever is displayed is a rendering of whatever is dialled.
  const inputs = [
    '+447861936533', // canonical
    '07861936533', // national
    '+44 7861 936533', // spaced international
    '07441918832', // the number the live footer actually dials
    '+1 415 555 2671', // explicit non-UK
    '078619365333', // one digit too many
    '0786193653', // one digit too few
    '', // empty
    '+44', // country code only
    'call us', // not a number at all
  ];
  for (const input of inputs) {
    assert.equal(
      digits(formatPhone(input)),
      digits(toDial(input)),
      `display/href divergence for ${JSON.stringify(input)}: ` +
        `displays ${formatPhone(input)}, dials ${toDial(input)}`
    );
  }
});

test('Lock 4: toDial does not fabricate +44 onto an explicit non-UK number', () => {
  // CR-04. `+1 415 555 2671` used to dial +4414155552671 — a UK number that
  // does not exist — and SC-2b passed it, because normalising both sides with
  // /^44/ strips the fabricated prefix off the href and the real `1` then
  // matches on both sides by coincidence.
  assert.equal(toDial('+1 415 555 2671'), '+14155552671');
  assert.equal(formatPhone('+1 415 555 2671'), '+14155552671');
  assert.equal(toDial('+353 1 234 5678'), '+35312345678');

  // …and the canonical UK forms are byte-identical to before the fix.
  assert.equal(toDial('+447861936533'), '+447861936533');
  assert.equal(toDial('07861936533'), '+447861936533');
  assert.equal(toDial('+44 7861 936533'), '+447861936533');
  assert.equal(formatPhone('+447861936533'), '+44 7861 936533');
  assert.equal(formatPhone('07861936533'), '+44 7861 936533');
});

test('Lock 4: NAPFooter markup contains exactly one tel: link', () => {
  const html = readFileSync(
    join(ROOT, 'src/components/NAPFooter/NAPFooter.html'),
    'utf8'
  );
  const tels = html.match(/href="tel:[^"]+"/g) || [];
  assert.equal(tels.length, 1, `expected 1 tel: link, found ${tels.length}`);

  // …and its digits match the visible label.
  const href = tels[0].match(/tel:([^"]+)/)[1];
  const label = html.match(/class="bhc-footer__phone"[^>]*>([^<]+)</)[1];
  assert.equal(digits(href).replace(/^44/, ''), digits(label).replace(/^44/, ''));
});

/* --- Lock 5 — no street address or postcode ------------------------------ */

test('Lock 5: no UK postcode appears in any component output', () => {
  const POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(jsx|html|css)$/.test(e.name)) files.push(p);
    }
  };
  walk(join(ROOT, 'src'));
  files.push(join(ROOT, 'styles.css'), join(ROOT, 'tokens.css'));

  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    // Strip comments — the docs legitimately reference CV32 6EQ as the thing NOT to ship.
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/<!--[\s\S]*?-->/g, '');
    assert.ok(!POSTCODE.test(stripped), `postcode found in rendered output of ${f}`);
  }
});

/* --- Lock 7 — every <img> has non-empty alt ------------------------------ */

test('Lock 7: every <img> in a preview has non-empty alt', () => {
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name.endsWith('.html')) out.push(p);
    }
    return out;
  };
  for (const f of walk(join(ROOT, 'src'))) {
    const html = readFileSync(f, 'utf8');
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      const alt = tag.match(/\balt="([^"]*)"/);
      assert.ok(alt && alt[1].trim().length, `<img> without usable alt in ${f}: ${tag}`);
    }
  }
});

/* --- Preview cards ------------------------------------------------------- */

test('every preview declares a @dsCard group on line 1', () => {
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name.endsWith('.html')) out.push(p);
    }
    return out;
  };
  const previews = walk(join(ROOT, 'src'));
  assert.ok(previews.length >= 6, 'expected a preview per component');
  for (const f of previews) {
    const first = readFileSync(f, 'utf8').split('\n')[0];
    assert.match(first, /^<!--\s*@dsCard group="[^"]+"\s*-->$/, `bad @dsCard marker in ${f}`);
  }
});

/* --- Interlink geometry -------------------------------------------------- */

test('nearestTowns is ordered by real distance and excludes self', () => {
  const towns = [
    { slug: 'warwick', name: 'Warwick', region: 'warwickshire', lat: 52.2819, lon: -1.5849 },
    { slug: 'leamington-spa', name: 'Leamington Spa', region: 'warwickshire', lat: 52.2852, lon: -1.5201 },
    { slug: 'kenilworth', name: 'Kenilworth', region: 'warwickshire', lat: 52.3417, lon: -1.5822 },
    { slug: 'coventry', name: 'Coventry', region: 'west-midlands', lat: 52.4068, lon: -1.5197 },
    { slug: 'telford', name: 'Telford', region: 'shropshire', lat: 52.6784, lon: -2.4453 },
  ];
  const near = nearestTowns(towns[0], towns, 3);

  assert.equal(near.length, 3);
  assert.ok(!near.some((n) => n.town.slug === 'warwick'), 'must exclude itself');
  assert.deepEqual(
    near.map((n) => n.town.slug),
    ['leamington-spa', 'kenilworth', 'coventry']
  );
  // Telford is ~55 miles away and must never surface as "nearby" for Warwick.
  assert.ok(distanceMiles(towns[0], towns[4]) > 40);
  // Ordering is strictly ascending.
  for (let i = 1; i < near.length; i++) {
    assert.ok(near[i].miles >= near[i - 1].miles);
  }
});

test('the audited pin distances reproduce', () => {
  const pin = { lat: 52.29358, lon: -1.55378 }; // 84 Acacia Road, CV32 6EQ
  const birmingham = { lat: 52.4797, lon: -1.9026 };
  const telford = { lat: 52.6784, lon: -2.4453 };

  // The SEO audit reports 18.8 and 46.2 miles. Allow a mile of geocoding slack.
  assert.ok(Math.abs(distanceMiles(pin, birmingham) - 18.8) < 1.5);
  assert.ok(Math.abs(distanceMiles(pin, telford) - 46.2) < 1.5);
});

/* --- JSON-LD escaping — no </script> breakout ---------------------------- */

test('JSON-LD escaping: a </script> in a value cannot break out of the block', () => {
  // Bare JSON.stringify emits </script> verbatim, which terminates the inline
  // script element and hands the remainder to the HTML parser as markup. Every
  // value is hardcoded today; from Phase 3 they come from a data file.
  const out = safeJsonLd({ name: 'a</script><script>alert(1)</script>' });
  assert.ok(!out.includes('</script>'), `unescaped </script> survived serialisation: ${out}`);
});

test('JSON-LD escaping: the escape does not corrupt the JSON payload', () => {
  // Escaping < is lossless — it is a valid JSON string escape, so the payload
  // still parses and round-trips to the exact input.
  const obj = {
    name: 'Beyond <House> Cleaning',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9' },
  };
  assert.deepEqual(JSON.parse(safeJsonLd(obj)), obj);
});
