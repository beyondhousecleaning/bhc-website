/**
 * The three process steps — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`. Consumed by `ProcessSteps`, whose `Step` shape is `{ title, body }`
 * (ProcessSteps.d.ts) and which renders the titles as `<h3>` under a
 * `SectionBand`'s `<h2>`.
 *
 * NO STEP CARRIES ITS OWN NUMBER. The numerals come from a CSS counter on the
 * `<ol>`, so reordering this array cannot desynchronise them and a hand-typed
 * "1." would render beside a generated one. Do not add a `number` field.
 *
 * Copy is UI-SPEC §5's ProcessSteps table verbatim.
 */

/**
 * STEP 3'S REMEDY WORDING IS A COMMERCIAL PROMISE AND IT IS AWAITING SAM.
 *
 * UI-SPEC §14-1: `design-system.md` §3.1 authorises the word "guarantee" on
 * `TrustBar`, but neither that claim nor this step says what is actually
 * promised. The wording shipping below is the deliberate conservative default —
 * it states NO time window and NO re-clean commitment, because a promise the
 * business has not agreed to is worse than a vague one, and this string renders
 * on every page that carries the process band.
 *
 * If BHC operates a specific policy (a 24-hour re-clean, say), it goes in
 * verbatim and it is a one-line data change here — no template edit, no
 * component change, no new prop. A specific promise converts better than a
 * vague one; only Sam can authorise it. `TrustBar`'s third claim
 * ("Satisfaction guarantee") should be revisited in the same breath so the two
 * cannot state different things on the same page.
 */
export const PROCESS_STEPS = [
  {
    title: 'Tell us about your home',
    body: "A two-minute form or one phone call. Rooms, extras, and how often you'd like us.",
  },
  {
    title: 'We match you with a local cleaner',
    body:
      'The same DBS-checked cleaner each visit wherever we can, so they learn your home ' +
      'rather than starting from scratch.',
  },
  {
    title: 'You get your evening back',
    body: "We clean, you check. Not happy with something? Tell us and we'll put it right.",
  },
];
