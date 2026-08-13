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
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
  //
  // Phase 2 narrows this test because it closes the OTHER half of the same
  // hole. CR-04 closed DIVERGENCE — display and href naming two different
  // numbers. It did not close DEGRADATION: both sides could still agree on
  // something unrenderable, so `formatPhone('') === toDial('') === '+44'`
  // passed the parity assertion while the page shipped
  // `<a href="tel:+44"></a>` — an empty interactive element, a WCAG 2.4.4
  // failure, across 17 pages x 4 tel: links in this phase alone. toDial now
  // throws on those inputs, so they move from the parity loop into a paired
  // rejection check. Parity is asserted for everything still renderable;
  // rejection is asserted for everything that is not. Neither half is weaker.
  const renderable = [
    '+447861936533', // canonical
    '07861936533', // national
    '+44 7861 936533', // spaced international
    '07441918832', // the number the live footer actually dials
    '+1 415 555 2671', // explicit non-UK — length is not ours to police
  ];
  for (const input of renderable) {
    assert.equal(
      digits(formatPhone(input)),
      digits(toDial(input)),
      `display/href divergence for ${JSON.stringify(input)}: ` +
        `displays ${formatPhone(input)}, dials ${toDial(input)}`
    );
  }

  // Both functions must reject, not just toDial — formatPhone inherits the
  // throw by calling toDial first, and asserting only one of them would let a
  // future "helpful" try/catch in formatPhone restore the degraded render
  // while this test stayed green.
  const unrenderable = [
    '078619365333', // one digit too many
    '0786193653', // one digit too few
    '', // empty
    '+44', // country code only
    'call us', // not a number at all
    undefined, // prop omitted with no default in scope
    null, // data file with a missing field
  ];
  for (const input of unrenderable) {
    assert.throws(
      () => toDial(input),
      TypeError,
      `toDial accepted an unrenderable value: ${JSON.stringify(input)}`
    );
    assert.throws(
      () => formatPhone(input),
      TypeError,
      `formatPhone accepted an unrenderable value: ${JSON.stringify(input)}`
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

/* --- Delta 13 — an unrenderable phone value throws, it does not degrade --- */

/*
  Delta 13. Phase 1 shipped ONE tel: link, in NAPFooter. From wave 2 there are three
  more consumers — Header, StickyCallBar and QuoteFormEntry — so the blast radius of a
  degraded render is 4 links x 17 pages this phase, and ~410 prerendered pages in
  Phase 3. The alternative to throwing is `<a href="tel:+44"></a>`: an empty
  interactive element, a WCAG 2.4.4 failure, on every one of them.

  Failing at build time, where one person sees it once, is strictly better. Pattern S6.

  The Lock 4 parity test above already exercises these inputs as part of its
  display/href invariant. These two tests assert the throw on its own terms, per
  function, so that narrowing or rewriting the parity test cannot take the rejection
  half with it — and so the failure message says which function stopped rejecting.
*/
const UNDIALABLE = [
  '', // empty — a data file with a blank field
  undefined, // prop omitted with no default in scope
  null, // data file with a missing field
  '+44', // country code only — the exact value that used to render tel:+44
  'call us', // not a number at all
  '078619365333', // one digit too many
  '0786193653', // one digit too few
];

test('delta 13: toDial throws on every unrenderable value', () => {
  for (const input of UNDIALABLE) {
    assert.throws(
      () => toDial(input),
      TypeError,
      `toDial accepted an unrenderable value instead of throwing: ${JSON.stringify(input)}`
    );
  }

  // The positive half, in the same test on purpose: a regression that threw on
  // EVERYTHING would satisfy the loop above while breaking every page that has a phone.
  assert.equal(toDial('+447861936533'), '+447861936533');
  assert.equal(toDial('07861936533'), '+447861936533');
});

test('delta 13: formatPhone inherits the throw, so the display cannot degrade either', () => {
  /*
    formatPhone calls toDial first and has no guard of its own, which is the design —
    but asserting only toDial would let a future "helpful" try/catch in formatPhone
    restore the degraded render while the other test stayed green.
  */
  for (const input of UNDIALABLE) {
    assert.throws(
      () => formatPhone(input),
      TypeError,
      `formatPhone accepted an unrenderable value instead of throwing: ${JSON.stringify(input)}`
    );
  }

  assert.equal(formatPhone('+447861936533'), '+44 7861 936533');
  assert.equal(formatPhone('07861936533'), '+44 7861 936533');
});

/* --- Lock 5 — no street address or postcode ------------------------------ */

/*
  WR-02. The single original form was `/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/`:
  case-sensitive, with `\s?` permitting at most ONE whitespace character. It
  missed `cv32 6eq`, `CV32&nbsp;6EQ` and `CV32  6EQ` — every one of which is a
  plausible way a Phase-3 data file puts a residential postcode into rendered
  output at ~336-page scale.

  Two patterns rather than one widened pattern:

    SPACED  — any case, one or more separators required.
    COMPACT — uppercase only, no separator, i.e. exactly today's coverage.

  Adding the `i` flag to the zero-separator form is flaky rather than stronger:
  a postcode's shape is also a lowercase build-hash's shape, and this constant
  is kept identical to the copy in web/scripts/check-html-locks.mjs, which
  scans prerendered HTML full of them. Residual gap, stated not papered over:
  an all-lowercase compact postcode (`cv326eq`) is not matched.

  Change both copies or neither.
*/
const POSTCODE_SPACED = /\b[A-Z]{1,2}\d{1,2}[A-Z]?(?:\s|&nbsp;|&#160;|&#xa0;)+\d[A-Z]{2}\b/i;
const POSTCODE_COMPACT = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}\b/;
const findPostcode = (text) =>
  (text.match(POSTCODE_SPACED) || text.match(POSTCODE_COMPACT) || [null])[0];

test('Lock 5: no UK postcode appears in any component output', () => {
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
    assert.ok(!findPostcode(stripped), `postcode found in rendered output of ${f}`);
  }
});

test('Lock 5: the postcode matcher still matches the forms it is meant to', () => {
  // WR-02 regression guard. Lock 5 passes today because no component carries a
  // postcode at all, so a matcher that quietly stopped matching would still
  // read green. These are the forms the original matcher missed.
  const [a, n, d, t] = ['CV', '32', '6', 'EQ'];
  for (const form of [
    `${a}${n} ${d}${t}`,
    `${a}${n}${d}${t}`,
    `${a}${n}  ${d}${t}`,
    `${a}${n}&nbsp;${d}${t}`,
    `${a}${n}&#160;${d}${t}`,
    `${a}${n}\u00a0${d}${t}`, // U+00A0, written as an escape on purpose
    `${a}${n} ${d}${t}`.toLowerCase(),
    `Serving ${a}${n} ${d}${t} and nearby`.toLowerCase(),
  ]) {
    assert.ok(findPostcode(form), `postcode form not matched: ${JSON.stringify(form)}`);
  }

  // …and it does not fire on ordinary copy, which would make the lock unusable,
  // nor on the lowercase build-hash shape that makes a naive `i` flag flaky.
  for (const clean of [
    'Serving Warwickshire, Coventry and the West Midlands',
    'Mon–Sat, 8am–7pm',
    'Deep Cleaning in Warwick',
    '4.9 from 175 reviews',
    'o5h8fd--6Limf2FJodaMt',
  ]) {
    assert.equal(findPostcode(clean), null, `false positive on ${JSON.stringify(clean)}`);
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

/* --- Delta 14 — inline SVG accessibility --------------------------------- */

/*
  Delta 14. Lock 7 above greps `<img>` tags ONLY, and `alt` is not a valid attribute on
  `<svg>` — the parser drops it silently. So an `<svg alt="…">` is an unlabelled graphic
  that no lock in this suite could see, and the package has no icon library: every icon
  in waves 2 to 5 is hand-authored inline SVG (UI-SPEC §1).

  The rule, from UI-SPEC §1, with RatingBadge as the shipped precedent for both halves:

    decorative (sits beside text that already says it)  -> aria-hidden="true"
    meaningful (the only content of its figure or link) -> role="img" + aria-label

  Every SVG in the package complies today, so this lock passes on landing. That is the
  point: it is a guard for the fourteen SVGs waves 2 to 5 will author — the TrustBar
  glyphs, the FAQAccordion chevron, the Header menu glyph and BeforeAfterSlider's two
  `role="img"` panels (§7.16) — not a repair of anything shipped.
*/

// Opening tags only. `[^>]*` spans newlines, so a multi-line JSX <svg …> is one match.
// Residual gap, stated rather than papered over: an attribute VALUE containing `>`
// (a ternary like {a > b}) would truncate the tag. No shipped SVG has one, and the
// consequence is a shorter tag, i.e. a false FAILURE, not a false pass.
const SVG_OPEN_TAG = /<svg\b[^>]*>/g;
const extractSvgTags = (src) => src.match(SVG_OPEN_TAG) || [];

// Handles both the HTML form (aria-label="…") and the JSX expression form
// (aria-label={label}), since BeforeAfterSlider builds its label into a const.
const ariaLabelOf = (tag) => {
  const quoted = tag.match(/\baria-label="([^"]*)"/);
  if (quoted) return quoted[1];
  const braced = tag.match(/\baria-label=\{([^}]*)\}/);
  if (!braced) return null;
  const expr = braced[1].trim();
  // {''} and {""} are an empty label wearing a costume.
  return /^(['"`])\s*\1$/.test(expr) ? '' : expr;
};

/** null when the tag is fine, otherwise the reason it is not. */
const svgA11yProblem = (tag) => {
  if (/\balt\s*=/.test(tag)) {
    return 'carries alt, which is invalid on <svg>, silently dropped, and invisible to Lock 7';
  }
  if (/\baria-hidden="true"/.test(tag) || /\baria-hidden=\{true\}/.test(tag)) return null;

  const label = ariaLabelOf(tag);
  const labelled = label !== null && label.trim().length > 0;
  if (/\brole="img"/.test(tag)) {
    return labelled ? null : 'has role="img" but no non-empty aria-label';
  }
  return 'has neither aria-hidden="true" nor role="img" with a non-empty aria-label';
};

test('delta 14: every inline <svg> in package source is hidden or labelled', () => {
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      // .jsx and .html only — .d.ts is types and .prompt.md is prose, neither renders.
      else if (/\.(jsx|html)$/.test(e.name)) out.push(p);
    }
    return out;
  };

  const files = walk(join(ROOT, 'src'));
  assert.ok(
    !files.some((f) => f.endsWith('.d.ts') || f.endsWith('.prompt.md')),
    'the delta 14 walk must not scan type declarations or documentation'
  );

  let seen = 0;
  for (const f of files) {
    for (const tag of extractSvgTags(readFileSync(f, 'utf8'))) {
      seen++;
      const problem = svgA11yProblem(tag);
      assert.equal(problem, null, `<svg> in ${f} ${problem}: ${tag}`);
    }
  }

  // Anti-vacuity floor: 16 inline SVGs ship today (10 in RatingBadge.html, 5 in
  // Hero.html, 1 in RatingBadge.jsx). An extractor that quietly stopped matching
  // would otherwise assert nothing while sixteen new components landed.
  assert.ok(seen >= 16, `expected at least 16 inline <svg> tags in package source, found ${seen}`);
});

test('delta 14: the <svg> a11y matcher still accepts compliant forms and rejects the rest', () => {
  /*
    Regression guard, per this file's strongest convention. Delta 14 is green on landing
    because every shipped SVG already complies, which is exactly the condition under
    which a broken matcher reads green — the same argument Lock 5's guard makes at :156.

    The fixtures are written literally rather than assembled: every source scan in this
    suite walks ROOT/src and this file is in ROOT/test, so nothing here can be matched
    by the scan it guards. See the delta 9 self-collision note above.
  */
  const compliant = [
    '<svg aria-hidden="true" focusable="false">', // decorative, UI-SPEC §1 row 1
    '<svg role="img" aria-label="Before-and-after comparison">', // meaningful, §7.16
    '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">', // the shipped Star
    '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" class="bhc-trust__icon">', // attribute order varies
    '<svg role="img" aria-label={label} viewBox="0 0 800 600">', // JSX expression label
    '<svg aria-hidden="true" />', // self-closing
    '<svg\n  role="img"\n  aria-label="After: the same kitchen, cleaned"\n  viewBox="0 0 800 600">', // multi-line JSX
  ];
  for (const tag of compliant) {
    assert.equal(extractSvgTags(tag).length, 1, `compliant <svg> not extracted: ${tag}`);
    assert.equal(svgA11yProblem(extractSvgTags(tag)[0]), null, `compliant <svg> rejected: ${tag}`);
  }

  const defective = [
    '<svg alt="star">', // the silently-dropped attribute this delta exists for
    '<svg alt="Before" aria-hidden="true">', // alt is wrong even when another mechanism is present
    '<svg width="16" height="16" viewBox="0 0 20 20">', // neither mechanism
    '<svg role="img">', // role without a label announces "image", nothing more
    '<svg role="img" aria-label="">', // empty label
    '<svg role="img" aria-label="   ">', // whitespace label
    "<svg role=\"img\" aria-label={''}>", // empty JSX expression label
    '<svg aria-hidden="false" focusable="false">', // hidden=false is not hidden
    '<svg aria-label="Kitchen">', // labelled but no role, so it is not exposed as an image
  ];
  for (const tag of defective) {
    assert.equal(extractSvgTags(tag).length, 1, `defective <svg> not extracted: ${tag}`);
    assert.ok(svgA11yProblem(extractSvgTags(tag)[0]), `defective <svg> wrongly accepted: ${tag}`);
  }

  // The extractor finds every tag in a document, not just the first.
  assert.equal(
    extractSvgTags('<p>a</p><svg aria-hidden="true"></svg><span/><svg role="img" aria-label="x"></svg>').length,
    2
  );
  // …and does not fire on prose that merely mentions the element.
  assert.equal(extractSvgTags('inline svg, hand-authored, never <img>').length, 0);
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
  /*
    Anti-vacuity floor, and it is the EXACT component count rather than an estimate:
    this walk visits every `.html` under `src`, and every component ships exactly one
    preview, so the two numbers are the same number. 22 = the 6 shipped in Phase 1 plus
    the 16 authored across waves 2 to 5 of Phase 2.

    At 6 it asserted nothing useful after this phase: a preview that silently vanished
    would leave 21 files, still clear the floor, and read green — which is precisely the
    regression the floor exists to catch. Whoever adds a component in Phase 3 raises it
    again, exactly as this plan did.
  */
  assert.ok(
    previews.length >= 22,
    `expected a preview per component: 22 (6 shipped in Phase 1 + 16 added in Phase 2), found ${previews.length}`
  );
  for (const f of previews) {
    const first = readFileSync(f, 'utf8').split('\n')[0];
    assert.match(first, /^<!--\s*@dsCard group="[^"]+"\s*-->$/, `bad @dsCard marker in ${f}`);
  }
});

/* --- Delta 9 — component shape and .design-sync registration ------------- */

/*
  Delta 9. `.design-sync/NOTES.md`, "Re-sync risks" item 3: a new component needs a
  `componentSrcMap` entry, a `docsMap` entry and `category:` frontmatter, and NONE of
  the three is auto-discovered in this repo. A component missing any of them is
  skipped by /design-sync **with no error at all** — it simply is not in the design
  project, and the next person to look assumes it is.

  Sixteen components are authored across waves 2 to 5 of this phase, so a half-shipped
  one has to fail here or it disappears quietly.

  Self-collision note, because this class of defect has bitten the repo repeatedly:
  every source scan in this suite walks `ROOT/src`, and this file lives in `ROOT/test`.
  The fixtures below therefore cannot be matched by the matchers they guard. That is
  belt and braces, not a licence — a scan added over `test/` would break it.
*/

// The converter cards components by these four group values only. A fifth would leave
// the component silently uncategorised — the same failure shape as not registering it.
const DS_GROUPS = ['Navigation', 'Content', 'Trust', 'Actions'];

/*
  The exact shipped form: no leading whitespace, straight quotes, a non-empty group,
  nothing after the comment. Deliberately identical to the inline matcher in the
  'every preview declares a @dsCard group' test above — change both or neither.
*/
const DS_CARD_LINE = /^<!--\s*@dsCard group="([^"]+)"\s*-->$/;

// The .prompt.md files are `---\ncategory: X\n---` by convention (NOTES.md, "Component
// grouping comes from @dsCard, via frontmatter"). Parsed with a plain regex on purpose:
// the `locks` CI job runs with no `npm ci`, so this suite stays on node: built-ins (D-12).
const frontmatterCategory = (src) => {
  const block = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const line = block[1].match(/^category:[ \t]*(.*?)[ \t]*$/m);
  return line ? line[1] : null;
};

test('delta 9: every component ships four files and is registered in both .design-sync maps', () => {
  const componentsDir = join(ROOT, 'src/components');
  const names = readdirSync(componentsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  // Anti-vacuity floor: six components shipped in Phase 1, sixteen more in Phase 2.
  // This floor and the preview floor above track the SAME set — one directory, one
  // `.html` — so plan 02-14 raised both to 22 together, as the previous wording of this
  // comment required. A deleted component directory has to fail here, not go quiet.
  assert.ok(names.length >= 22, `expected at least 22 components, found ${names.length}`);

  const cfg = JSON.parse(readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8'));
  const { componentSrcMap, docsMap } = cfg;
  assert.ok(componentSrcMap, '.design-sync/config.json declares no componentSrcMap');
  assert.ok(docsMap, '.design-sync/config.json declares no docsMap');

  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  for (const name of names) {
    const dir = join(componentsDir, name);
    const entries = readdirSync(dir, { withFileTypes: true });
    assert.ok(
      !entries.some((e) => e.isDirectory()),
      `${name}/ contains a subdirectory — component directories are flat`
    );
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);

    const canonical = [`${name}.jsx`, `${name}.html`, `${name}.d.ts`, `${name}.prompt.md`];
    for (const f of canonical) {
      assert.ok(
        files.includes(f),
        `${name} is missing ${f} — a component ships the implementation, the preview, the types and the doc, or it is half-shipped`
      );
    }

    /*
      NOT "exactly four files". `InterlinkBlock/geo.js` and `NAPFooter/formatPhone.js`
      are the package's documented pure-logic convention — plain .js so `node --test`
      can import them with no JSX build, the same reason `src/phone.js` is a .js one
      level up. A file-count rule would fail two shipped components on day one.
      Do not "tighten" this to a count; the rule is: the four canonical files, plus
      plain-.js siblings only.
    */
    for (const f of files) {
      if (canonical.includes(f)) continue;
      assert.ok(
        f.endsWith('.js'),
        `${name}/${f} is neither one of the four canonical files nor a plain .js pure-logic sibling`
      );
    }

    const firstLine = readFileSync(join(dir, `${name}.html`), 'utf8').split('\n')[0].replace(/\r$/, '');
    const marker = firstLine.match(DS_CARD_LINE);
    assert.ok(marker, `bad or missing @dsCard marker on line 1 of ${name}.html: ${JSON.stringify(firstLine)}`);
    const group = marker[1];

    assert.ok(
      DS_GROUPS.includes(group),
      `${name}.html declares group "${group}", which is not one of ${DS_GROUPS.join(', ')} — the component would card as uncategorised`
    );

    const category = frontmatterCategory(readFileSync(join(dir, `${name}.prompt.md`), 'utf8'));
    assert.ok(category, `${name}.prompt.md has no category: frontmatter — it would land in the converter's "general" group`);
    assert.equal(
      category,
      group,
      `${name}: @dsCard group "${group}" and prompt frontmatter category "${category}" disagree; the frontmatter is generated FROM the marker and the two cannot be allowed to drift`
    );

    assert.ok(has(componentSrcMap, name), `${name} is absent from componentSrcMap — /design-sync will skip it with no error`);
    assert.ok(has(docsMap, name), `${name} is absent from docsMap — its .prompt.md will not be uploaded, with no error`);
    assert.ok(
      existsSync(join(ROOT, componentSrcMap[name])),
      `componentSrcMap.${name} points at ${componentSrcMap[name]}, which does not exist`
    );
    assert.ok(
      existsSync(join(ROOT, docsMap[name])),
      `docsMap.${name} points at ${docsMap[name]}, which does not exist`
    );
  }

  // …and the other direction, so a renamed or deleted component leaves no stale entry
  // pointing at a directory that is gone.
  for (const [mapName, map] of [['componentSrcMap', componentSrcMap], ['docsMap', docsMap]]) {
    for (const key of Object.keys(map)) {
      assert.ok(
        names.includes(key),
        `${mapName} registers "${key}", but src/components/${key}/ does not exist — a stale entry from a rename or delete`
      );
    }
  }
});

test('delta 9: the @dsCard line matcher still matches the shipped form and rejects near-misses', () => {
  /*
    Regression guard, the convention Lock 5's guard at :156-185 establishes: delta 9
    passes today because all six components are correct, so a matcher that quietly
    stopped matching would still read green — and would then wave through sixteen new
    components. Both halves are asserted: what it must accept, and what it must reject.
  */
  for (const line of [
    '<!-- @dsCard group="Actions" -->',
    '<!-- @dsCard group="Navigation" -->',
    '<!--@dsCard group="Trust"-->', // the surrounding whitespace is optional
    '<!--   @dsCard group="Content"   -->',
  ]) {
    assert.match(line, DS_CARD_LINE, `shipped @dsCard form not matched: ${JSON.stringify(line)}`);
  }
  assert.equal('<!-- @dsCard group="Trust" -->'.match(DS_CARD_LINE)[1], 'Trust');

  /*
    The curly-quote fixture is built from codepoints rather than typed. A literal smart
    quote in source is invisible in review, and a raw U+00A0 typed in place of an escape
    has already slipped into this repo's sibling lock script once.
  */
  const CURLY_OPEN = String.fromCharCode(0x201c);
  const CURLY_CLOSE = String.fromCharCode(0x201d);

  for (const line of [
    ' <!-- @dsCard group="Actions" -->', // leading whitespace — line 1 must start with the comment
    `<!-- @dsCard group=${CURLY_OPEN}Actions${CURLY_CLOSE} -->`, // curly quotes
    '<!-- @dsCard -->', // no group= at all
    '<!-- @dsCard group="" -->', // empty group
    '<!-- @dsCard group="Actions" --><div>', // trailing content
    '<!-- @dsCard group="Actions" -->  extra', // trailing copy
    '<!-- dsCard group="Actions" -->', // missing the @ sigil
  ]) {
    assert.doesNotMatch(line, DS_CARD_LINE, `near-miss @dsCard form wrongly accepted: ${JSON.stringify(line)}`);
  }

  // The four groups are a closed set, not a suggestion.
  assert.deepEqual(DS_GROUPS, ['Navigation', 'Content', 'Trust', 'Actions']);
  assert.ok(!DS_GROUPS.includes('general'));

  // …and the frontmatter parser reads the value it is meant to, not the heading below it.
  assert.equal(frontmatterCategory('---\ncategory: Actions\n---\n\n# Button\n'), 'Actions');
  assert.equal(frontmatterCategory('---\ncategory: Navigation  \n---\n'), 'Navigation');
  assert.equal(frontmatterCategory('# Button\n\ncategory: Actions\n'), null);
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
  // D-10 is "no address anywhere", and this repo is public. The literal street
  // line and postcode that used to annotate this pin have been removed; the
  // coordinates themselves are superseded in Phase 3 by the Leamington Spa town
  // centroid, which sits 0.8 miles away and reproduces every distance below.
  const pin = { lat: 52.29358, lon: -1.55378 };
  const birmingham = { lat: 52.4797, lon: -1.9026 };
  const telford = { lat: 52.6784, lon: -2.4453 };

  // The SEO audit reports 18.8 and 46.2 miles. Allow a mile of geocoding slack.
  assert.ok(Math.abs(distanceMiles(pin, birmingham) - 18.8) < 1.5);
  assert.ok(Math.abs(distanceMiles(pin, telford) - 46.2) < 1.5);
});

test('buildInterlinks takes an optional per-link meta formatter and is unchanged without one', () => {
  /*
    `county` here is the DISPLAY county and `region` is the URL SEGMENT. They are
    two different fields with confusingly similar names — geo.js builds hrefs from
    `region`, and any call site that hands it a display county silently ships 426
    wrong URLs. The fixture keeps both so the distinction is exercised.
  */
  const warwick = { slug: 'warwick', name: 'Warwick', region: 'warwickshire', county: 'Warwickshire', lat: 52.2819, lon: -1.5849 };
  const towns = [
    warwick,
    { slug: 'leamington-spa', name: 'Leamington Spa', region: 'warwickshire', county: 'Warwickshire', lat: 52.2852, lon: -1.5201 },
    { slug: 'coventry', name: 'Coventry', region: 'west-midlands', county: 'West Midlands', lat: 52.4068, lon: -1.5197 },
  ];
  const service = { slug: 'deep-cleaning', name: 'Deep Cleaning', tagline: 'Top to bottom, once' };
  const allServices = [service, { slug: 'end-of-tenancy', name: 'End of Tenancy', tagline: 'Deposit back' }];
  const input = { town: warwick, service, allTowns: towns, allServices, nearbyCount: 2 };

  // 1. Backwards compatibility, proved rather than assumed: no formatter, and the
  //    nearby meta is still the distance string this module has always produced.
  const before = buildInterlinks(input);
  assert.match(before.nearby.links[0].meta, /^\d+\.\d+ miles away$/);
  assert.equal(before.nearby.links.length, 2);

  // 2. A formatter returning the destination's display county replaces it, and
  //    receives (destination, miles) — the miles being the real distance, so the
  //    geography is still available to the caller even when it is not published.
  const seen = [];
  const after = buildInterlinks({
    ...input,
    metaFor: (destination, miles) => {
      seen.push([destination.slug, miles]);
      return destination.county;
    },
  });
  assert.deepEqual(
    after.nearby.links.map((l) => l.meta),
    ['Warwickshire', 'West Midlands']
  );
  assert.deepEqual(seen.map(([slug]) => slug), ['leamington-spa', 'coventry']);
  assert.equal(seen[1][1], distanceMiles(warwick, towns[2]));
  for (const link of after.nearby.links) {
    assert.doesNotMatch(link.meta, /miles/, 'a formatted meta must not carry a distance');
  }

  // 3. Ordering is where the geography lives, and it is identical either way —
  //    the formatter changes one line of copy and nothing structural.
  assert.deepEqual(
    after.nearby.links.map((l) => l.href),
    before.nearby.links.map((l) => l.href)
  );
  assert.equal(after.nearby.links[0].href, '/location/warwickshire/leamington-spa/deep-cleaning');
  assert.equal(after.nearby.links[1].href, '/location/west-midlands/coventry/deep-cleaning');

  // 4. The services block's meta is the tagline and neither call touches it.
  assert.equal(before.services.links[0].meta, 'Deposit back');
  assert.equal(after.services.links[0].meta, 'Deposit back');

  // 5. Returning nothing suppresses the line — InterlinkBlock renders the span
  //    only for a truthy meta, so this is a supported way to have no second line.
  const bare = buildInterlinks({ ...input, metaFor: () => undefined });
  assert.equal(bare.nearby.links[0].meta, undefined);

  /*
    And the subpath that lets a bare `node` process import this file at all. The
    barrel routes these functions through a .jsx, which node cannot parse, so
    every plan in this phase that verifies computed links without a build depends
    on the exports entry below. Pointing it at a .jsx would still resolve inside
    the bundler and break only outside it — which is the quiet failure this asserts.
  */
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const geoEntry = pkg.exports['./geo'];
  assert.equal(geoEntry, './src/components/InterlinkBlock/geo.js');
  assert.ok(geoEntry.endsWith('.js') && !geoEntry.endsWith('.jsx'));
  assert.ok(existsSync(join(ROOT, geoEntry)), `exports["./geo"] points at ${geoEntry}, which does not exist`);
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

test('JSON-LD escaping: every emitter in the package routes through safeJsonLd', () => {
  /*
    WR-13. The escaping is correct and all three current emitters use it — but
    nothing MADE them. safeJsonLd is deliberately not re-exported from
    src/index.js, so a Phase-3 component author reaching for JSON.stringify
    directly reintroduces the exact </script> breakout this module exists to
    prevent, and every other lock in this file stays green while they do it.

    The marker is assembled rather than written literally: a source scan that
    matches its own scanner is how the `use client` and retired-phone-digit
    collisions in this phase happened twice already. (This file lives outside
    src/ so it is not walked today — the split is belt and braces.)
  */
  const LD_MARKER = ['application', '/', 'ld+json'].join('');
  const HELPER = 'jsonLd.js';

  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(p);
    }
    return out;
  };

  const sources = walk(join(ROOT, 'src'));
  const emitters = [];

  for (const f of sources) {
    const src = readFileSync(f, 'utf8');

    // The helper itself is the one place a raw serialiser call belongs.
    if (f.endsWith(HELPER)) continue;

    assert.ok(
      !src.includes('JSON.' + 'stringify'),
      `${f} serialises JSON-LD itself — import safeJsonLd from jsonLd.js instead`
    );

    if (!src.includes(LD_MARKER)) continue;
    emitters.push(f);
    assert.ok(
      src.includes('safeJsonLd('),
      `${f} emits a ${LD_MARKER} block without safeJsonLd — a </script> in any value breaks out`
    );
  }

  // If the scan finds nothing it is asserting nothing; the package has three
  // emitters today (NAPFooter, Breadcrumbs, RatingBadge).
  assert.ok(
    emitters.length >= 3,
    `expected at least 3 JSON-LD emitters, found ${emitters.length}: ${emitters.join(', ')}`
  );
});
