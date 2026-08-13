/**
 * The three legal pages — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias resolves at any
 * route depth. Copy and string handling live in `.js`; only `blocks.jsx` in this
 * directory returns elements.
 *
 * WHAT THIS FILE IS FOR. `/privacy-policy`, `/terms-of-service` and
 * `/customer-service-agreement` are the last three of ROADMAP Success Criterion
 * 2's ten utility routes, and they are the reason the real count is ten rather
 * than the roadmap's "~8". The footer's Legal row in `nav.js` links all three by
 * name, and delta 6 resolves every internal href against the prerender
 * manifest — so shipping two of the three is not a smaller scope, it is a red
 * build. The `h1` on each record is character-for-character the UI-SPEC §5 deck
 * and character-for-character `PAGE_EXPECTATIONS` in
 * `web/scripts/check-html-locks.mjs`. Change one and the build goes red in the
 * right place.
 *
 * THE RECORD SHAPE IS `utility.js`'s, deliberately — `path`, `crumb`, `h1`,
 * `eyebrow`, `lead`, `title`, `description`, `prose` — so the two modules read
 * identically and a route file composed against one composes against the other.
 * What legal pages do NOT carry is the `outbound` and `callout` fields: UI-SPEC
 * §9.4 gives them no conversion furniture at all.
 *
 * TITLES. `titleFor` appends ` | Beyond House Cleaning` (24 characters), and all
 * three subjects here are the `<h1>` verbatim: 38, 40 and 50 characters against
 * Lock 8's 60 cap. None of them needs the shorter-subject treatment the two
 * `utility.js` titles needed.
 *
 * NO ADDRESS, NO POSTCODE, NO PHONE NUMBER, NO EMAIL ADDRESS — D-04 / Lock 5,
 * and this file is the single most likely place in the whole site to breach it.
 * Legal boilerplate templates habitually open with a registered-office block and
 * close with a data-protection contact line, and both are exactly the shapes
 * that are banned here. There is no such block below and there never will be.
 * Every "get in touch about this" route in the copy points at the contact page
 * in words; the canonical phone number lives once in
 * `design-system/src/phone.js` and reaches these pages only through `NAPFooter`
 * in the layout.
 *
 * This header does not INSTANCE any of those banned shapes either — no sample
 * address, no sample postcode, no sample number. `check-html-locks.mjs`'s
 * `STREET_LINE` and postcode heuristics and this plan's own source-level scan
 * are substring and regex matchers with no notion of "this one is only an
 * example", so a comment that quotes the shape it warns about fails the gate it
 * exists to explain. This repo has been bitten by that ten times now. Describe
 * the shape; never write one.
 *
 * VOICE — UI-SPEC §5. Plain UK English, short sentences, the second person.
 * Legal registers drift towards an archaic third-person formula that nobody
 * reads; the specimen word for it is not quoted here because the acceptance
 * grep for this file matches it. UK vocabulary throughout — `flat`, `skirting
 * boards`, `tenancy` — never the US forms, which the same grep also covers.
 *
 * BLOCK SHAPE. `prose` is an array authored against `blocks.jsx`:
 *
 *   { type: 'p',  text: string }
 *   { type: 'h2', text: string }
 *   { type: 'h3', text: string }
 *   { type: 'ul', text: string[] }   // `text` carries the items
 *
 * There is no `h1` block type and there must never be one: Lock 1 allows
 * exactly one `<h1>` per page and it belongs to `Hero`'s `heading` prop.
 *
 * NOT LEGAL ADVICE, AND WORTH SAYING ONCE. These are readable, honest,
 * UK-appropriate documents written to the facts of how the business actually
 * operates. They are not a solicitor's work and nobody has signed them off. The
 * retention periods, the notice window and the cancellation charge below are the
 * conservative defaults; if Sam has a different policy, each is a one-string
 * edit here and no template changes.
 */

import { BRAND, RATING, titleFor } from './site.js';

/**
 * The review signal every description opens with, composed rather than typed,
 * so a description cannot disagree with the badge rendered on the same page.
 * Same fragment `utility.js` uses.
 */
const RATED = `Rated ${RATING.rating} by ${RATING.count} ${RATING.source} reviews.`;

/*
  THE SATISFACTION PROMISE IS SHARED WITH `process.js` STEP 3, AND IT IS
  AWAITING SAM (UI-SPEC §14-1).

  The sentence in the "If a clean is not right" section of the Customer Service
  Agreement is `PROCESS_STEPS[2].body` verbatim. That is deliberate: the process
  band and the service agreement can appear on the same visit, and a page that
  promises a 24-hour re-clean beside an agreement that promises nothing is worse
  than either alone.

  It is the conservative default — NO time window and NO re-clean commitment —
  for the reason `process.js` gives: a promise the business has not agreed to is
  worse than a vague one. If BHC operates a specific policy it goes in verbatim,
  and it must go into BOTH places in the same edit. `TrustBar`'s third claim
  ("Satisfaction guarantee") is the third place and should be revisited in the
  same breath.

  It is a literal here rather than an import from `process.js` on purpose. An
  import would make the two strings identical forever, which reads like a
  feature until the day the agreement needs a clause the process step must not
  carry — at which point the shared constant is unpickable. Two literals plus
  this comment is the honest coupling.
*/
const SATISFACTION = "We clean, you check. Not happy with something? Tell us and we'll put it right.";

/**
 * The three records, keyed by path.
 *
 * Each carries: `path`, `crumb` (the breadcrumb label, which for these three is
 * the `<h1>` — they are short enough that a reader's word for the page and the
 * heading are the same word), `h1`, `eyebrow`, `lead`, `title`, `description`
 * and `prose`.
 */
export const LEGAL_PAGES = {
  '/privacy-policy': {
    path: '/privacy-policy',
    crumb: 'Privacy Policy',
    h1: 'Privacy Policy',
    eyebrow: 'How we handle your details',
    lead:
      'What we collect when you ask for a price or book a clean, why we hold it, how long we ' +
      'keep it, and how to ask for a copy or have it deleted.',
    /* 14 + 24 = 38. */
    title: titleFor('Privacy Policy'),
    description: `${RATED} How ${BRAND} collects, uses and stores your personal data, and the UK GDPR rights you have over it.`,
    prose: [
      {
        type: 'p',
        text:
          `This policy covers the personal information ${BRAND} collects through this website ` +
          'and through the bookings we take: what we hold, why we hold it, who else sees it, ' +
          'and how long we keep it. It applies to anyone who asks us for a price, books a ' +
          'clean, or gets in touch.',
      },
      { type: 'h2', text: 'What we collect' },
      {
        type: 'p',
        text:
          'Only what we need to price a clean, turn up at the right home on the right day, and ' +
          'take payment for the work. In practice that is:',
      },
      {
        type: 'ul',
        text: [
          'Your name, phone number and the email you contact us on, so we can reply and confirm a visit',
          'Where the home we are cleaning is, and enough about it — rooms, floors, anything unusual — to work out how long a clean takes',
          'What you have asked for: the type of clean, the extras, and how often you would like us',
          'Anything you tell us we should know before we arrive, such as how to get in, a pet, or an allergy in the house',
          'A record of the visits we have carried out and the payments taken for them',
        ],
      },
      {
        type: 'p',
        text:
          'We do not ask for anything sensitive, and you should not send us anything sensitive ' +
          'either. If you tell us about a health condition because it changes how we clean, we ' +
          'note the practical part and nothing else.',
      },
      { type: 'h2', text: 'Why we hold it, and the lawful basis' },
      {
        type: 'p',
        text:
          'UK GDPR requires us to say not just what we do with your information but the lawful ' +
          'basis for doing it. Ours are short:',
      },
      {
        type: 'ul',
        text: [
          'To give you a price and answer your questions — because you asked us to, and we are taking steps at your request before a contract',
          'To carry out a clean you have booked — because we have a contract with you',
          'To take payment and keep our accounts straight — because the law requires us to keep those records',
          'To ask how a clean went and to run the business properly — because we have a legitimate interest in doing so, and you can tell us to stop at any time',
        ],
      },
      { type: 'h2', text: 'Marketing' },
      {
        type: 'p',
        text:
          'We do not sell your details to anybody, and we do not hand them to other companies ' +
          'to market to you. If we send you an offer it is because you asked us to, and every ' +
          'one of those messages carries a way to stop them. Stopping marketing does not stop ' +
          'the messages about a booking you have made — you still get those, because you need ' +
          'them.',
      },
      { type: 'h2', text: 'How long we keep it' },
      {
        type: 'p',
        text:
          'An enquiry that never becomes a booking is kept for a year, so we can pick up where ' +
          'we left off if you come back to us. Booking and payment records are kept for six ' +
          'years after your last visit, because that is what HMRC requires of a business like ' +
          'ours. After that they go, and we do not keep a copy.',
      },
      { type: 'h2', text: 'Who else sees it' },
      {
        type: 'p',
        text:
          'The cleaner coming to your home sees what they need to do the job — where they are ' +
          'going, when, what has been asked for, and any note you left about getting in or ' +
          'about a pet. They do not see your payment details.',
      },
      {
        type: 'p',
        text:
          'Beyond that, your information is handled by the suppliers who run the systems we ' +
          'use: our booking system, our payment provider, and the services that send our ' +
          'emails and text messages. They act on our instructions, they are bound by contract, ' +
          'and they may not use your information for their own purposes.',
      },
      { type: 'h2', text: 'Payments' },
      {
        type: 'p',
        text:
          'Card details are handled by our payment provider and never reach us. We can see ' +
          'that a payment was taken and the last few digits of the card; we cannot see the ' +
          'full number, and neither can the cleaner who came to your home.',
      },
      { type: 'h2', text: 'Your rights' },
      {
        type: 'p',
        text:
          'UK GDPR gives you a set of rights over what we hold about you, and none of them ' +
          'costs anything to use. You can:',
      },
      {
        type: 'ul',
        text: [
          'Ask for a copy of everything we hold about you',
          'Ask us to correct anything that is wrong',
          'Ask us to delete it, where we are not required to keep it',
          'Ask us to stop using it for a particular purpose, or to restrict what we do with it',
          'Ask us to send it on to another provider in a portable form',
          'Withdraw a consent you gave us, at any time',
        ],
      },
      {
        type: 'p',
        text:
          'Ask through our contact page and we will deal with it within a month. We may need ' +
          'to check you are who you say you are first, which usually means confirming a detail ' +
          'of a booking only you would know.',
      },
      { type: 'h2', text: 'Cookies and this website' },
      {
        type: 'p',
        text:
          'This site sets only what it needs to work. We do not run advertising trackers on ' +
          'it, and we do not build a profile of you from the pages you read. If that ever ' +
          'changes, this page says so first and you will be asked before anything non-essential ' +
          'is set.',
      },
      { type: 'h2', text: 'If you are unhappy with how we have handled it' },
      {
        type: 'p',
        text:
          'Tell us first, through our contact page. Most of it we can put right the same week. ' +
          "You also have the right to complain to the Information Commissioner's Office, " +
          'the UK regulator for data protection, and you can do that whether or not you have ' +
          'spoken to us.',
      },
      { type: 'h2', text: 'Changes to this policy' },
      {
        type: 'p',
        text:
          'We update this page when what we do changes, and the version on it is the one that ' +
          'applies. If a change materially affects you, we will tell you rather than leaving ' +
          'you to find it.',
      },
    ],
  },

  '/terms-of-service': {
    path: '/terms-of-service',
    crumb: 'Terms of Service',
    h1: 'Terms of Service',
    eyebrow: 'Using this website',
    lead:
      'The terms you accept by using this site. The terms covering a clean we carry out for ' +
      'you are in our Customer Service Agreement.',
    /* 16 + 24 = 40. */
    title: titleFor('Terms of Service'),
    description: `${RATED} The terms for using the ${BRAND} website — accuracy, copyright, links out, and the limits of our liability.`,
    prose: [
      {
        type: 'p',
        text:
          'These terms cover your use of this website and nothing else. They are not the terms ' +
          'of a clean — those are in our Customer Service Agreement, which is the document ' +
          'that applies once you have booked. By using this site you accept what is set out ' +
          'below.',
      },
      { type: 'h2', text: 'Who we are' },
      {
        type: 'p',
        text:
          `This site is run by ${BRAND}, a domestic cleaning company working across ` +
          'Warwickshire and the West Midlands. Our contact page is the way to reach us about ' +
          'anything on it.',
      },
      { type: 'h2', text: 'The information on this site' },
      {
        type: 'p',
        text:
          'We keep these pages accurate and current, and we would rather say nothing than say ' +
          'something we cannot stand behind. Even so, what is here is general information ' +
          'about our services rather than advice about your particular home, and nothing on ' +
          'the site forms a contract on its own.',
      },
      { type: 'h2', text: 'Prices and quotes' },
      {
        type: 'p',
        text:
          'Any figure shown on this site is a guide. The price that binds us is the one we ' +
          'send you for your home, after you have told us the rooms, the extras and how often ' +
          'you would like us. That price is fixed for the work described and it stands unless ' +
          'the work changes. A price quoted for one home does not carry across to another.',
      },
      { type: 'h2', text: 'What belongs to us' },
      {
        type: 'p',
        text:
          'The words, photographs, layout and branding on this site are ours. You are welcome ' +
          'to read them, print a page and share a link to it. You may not copy the content ' +
          'onto another website, sell it, or pass it off as your own. If you would like to ' +
          'quote something, ask us through the contact page — the answer is usually yes.',
      },
      { type: 'h2', text: 'Links to other websites' },
      {
        type: 'p',
        text:
          'Some pages link out to sites we do not run, such as our booking system. We check a ' +
          'link before we put it there, but we have no control over what happens on the other ' +
          'side of it and we cannot be responsible for it. A link is not an endorsement of ' +
          'everything on the site it points at.',
      },
      { type: 'h2', text: 'Keeping the site up' },
      {
        type: 'p',
        text:
          'We do our best to keep this site available and quick. We cannot promise it will ' +
          'never be down, and we may change or take down any page without telling you first. ' +
          'If you need something from us and the site is not working, ring us — the number is ' +
          'at the foot of every page.',
      },
      { type: 'h2', text: 'What we are not liable for' },
      {
        type: 'p',
        text:
          'Nothing here limits our liability for death or personal injury caused by our ' +
          'negligence, for fraud, or for anything else the law says cannot be limited. We ' +
          'would not want it to.',
      },
      {
        type: 'p',
        text:
          'Beyond that, we are not liable for loss you suffer through relying on the general ' +
          'information on this site rather than on a price or an answer we have given you ' +
          'directly. Liability for the work we carry out in your home is dealt with by the ' +
          'Customer Service Agreement, not by these terms.',
      },
      { type: 'h2', text: 'Law' },
      {
        type: 'p',
        text:
          'These terms are governed by the law of England and Wales, and the courts of England ' +
          'and Wales deal with any dispute about them. Nothing in them affects your statutory ' +
          'rights as a consumer.',
      },
      { type: 'h2', text: 'Changes to these terms' },
      {
        type: 'p',
        text:
          'We update this page when the site changes. The version here is the one that applies ' +
          'from the day it goes up.',
      },
    ],
  },

  '/customer-service-agreement': {
    path: '/customer-service-agreement',
    crumb: 'Customer Service Agreement',
    h1: 'Customer Service Agreement',
    eyebrow: 'The terms of a clean',
    lead:
      'What a booking includes, how we get in, how to move or cancel a visit, when payment is ' +
      'due, and what happens if a clean is not right.',
    /* 26 + 24 = 50. */
    title: titleFor('Customer Service Agreement'),
    description: `${RATED} What a ${BRAND} booking includes — access, cancellations, payment, and what we do if a clean is not right.`,
    prose: [
      {
        type: 'p',
        text:
          'This is the agreement covering a clean we carry out for you. It applies from the ' +
          'moment you accept a price from us, and it sits alongside our Terms of Service, ' +
          'which cover the website. It is written in plain English on purpose: an agreement ' +
          'you cannot read protects nobody.',
      },
      { type: 'h2', text: 'What a booking includes' },
      {
        type: 'p',
        text:
          'Every clean covers the same list of work, whichever cleaner comes. That list, and ' +
          'what a deep clean adds on top of it, is set out in full on our checklist page. We ' +
          'give you the hours behind a price as well as the price, so you can see what you are ' +
          'paying for.',
      },
      {
        type: 'p',
        text:
          'If something you want is not on the list, tell us before we start and we will price ' +
          'it in. We would far rather quote you properly than skip a job and hope you do not ' +
          'notice.',
      },
      { type: 'h2', text: 'Prices, and what changes them' },
      {
        type: 'p',
        text:
          'The price we send you is fixed for the work described, and we hold it. It changes ' +
          'only if the work does — a home much bigger than described, a room nobody mentioned, ' +
          'or an extra you add later. We tell you the new price before we do the extra work, ' +
          'never after.',
      },
      { type: 'h2', text: 'Getting into your home' },
      {
        type: 'p',
        text:
          'You need to give us a way in on the day. Most customers let us in themselves, leave ' +
          'a key somewhere we have agreed, or give us a code for a key safe. Whichever you ' +
          'choose, we treat it as confidential and only the people who need it hold it.',
      },
      {
        type: 'p',
        text:
          'If we cannot get in and cannot reach you, we wait a short while and then have to ' +
          'move on to the next home. A visit we could not carry out because we could not get ' +
          'in is chargeable, because the time was held for you and cannot be sold to anyone ' +
          'else.',
      },
      { type: 'h2', text: 'Your cleaner' },
      {
        type: 'p',
        text:
          'We send the same cleaner back to you each visit wherever we can manage it, because ' +
          'somebody who knows your home does a better job than somebody starting from ' +
          'scratch. Everyone who works for us is DBS-checked before their first job, and we ' +
          'are insured for the work we do in your home.',
      },
      {
        type: 'p',
        text:
          'Holidays and illness happen. When your usual cleaner cannot come we tell you, and ' +
          'we offer you either somebody else or another day. You can take whichever suits.',
      },
      { type: 'h2', text: 'Moving or cancelling a visit' },
      {
        type: 'ul',
        text: [
          "Give us a day's notice or more and there is nothing to pay — move it, skip it or cancel it",
          'Less than that and we may charge for the visit, because the slot was held for you and cannot be filled',
          'If we have to cancel on you, we tell you as early as we can and there is nothing to pay',
        ],
      },
      {
        type: 'p',
        text:
          'A regular booking can be paused or stopped whenever you like. Tell us before your ' +
          'next visit and it will not happen.',
      },
      { type: 'h2', text: 'Payment' },
      {
        type: 'p',
        text:
          'Payment is due on the day of the clean unless we have agreed something else with ' +
          'you in writing. We take card payments through our payment provider, so the details ' +
          'go to them rather than to us. Tips are entirely up to you and never expected.',
      },
      {
        type: 'p',
        text:
          'For a regular booking we take payment after each visit rather than up front. If a ' +
          'payment fails we tell you rather than quietly stopping the visits, and we will not ' +
          'come again until it is sorted.',
      },
      { type: 'h2', text: 'If a clean is not right' },
      { type: 'p', text: SATISFACTION },
      {
        type: 'p',
        text:
          'Tell us as soon as you spot it rather than saving it up: the sooner we hear, the ' +
          'more we can do about it. The quickest route is the phone number at the foot of ' +
          'every page, and our contact page works too.',
      },
      { type: 'h2', text: 'Breakages and accidents' },
      {
        type: 'p',
        text:
          'Things get broken occasionally, and when we break something we tell you rather than ' +
          'hoping you will not notice. We are insured for it. If something in your home is ' +
          'fragile, precious or simply not to be touched, say so before the first visit and we ' +
          'will leave it alone.',
      },
      { type: 'h2', text: 'What we will not do' },
      {
        type: 'ul',
        text: [
          'Outside windows above the ground floor',
          'Anything that needs more than a step stool to reach',
          'Clearing hoarded rooms, or anything biohazardous',
          'Shifting heavy furniture single-handed',
          'Work we judge unsafe, or a home where our cleaner does not feel safe',
        ],
      },
      {
        type: 'p',
        text:
          'That last one is the only occasion we will leave a home part-way through a visit. ' +
          'It is rare, we always tell you why, and we do not charge you for time we did not ' +
          'work.',
      },
      { type: 'h2', text: 'Ending a regular booking' },
      {
        type: 'p',
        text:
          "Either of us can end a regular booking with a week's notice, and you do not " +
          'have to give a reason. Anything already carried out is payable; anything not yet ' +
          'carried out is not. If you come back to us later, we pick it up again.',
      },
      { type: 'h2', text: 'Law' },
      {
        type: 'p',
        text:
          'This agreement is governed by the law of England and Wales. Nothing in it affects ' +
          'your statutory rights as a consumer.',
      },
    ],
  },
};

/**
 * Look a record up by route path.
 *
 * Returns `undefined` for an unknown path rather than throwing, for the reason
 * `utility.js`'s `byPath` gives: this is read at module scope by a route file
 * inside the root layout's page tree, and a throw there takes the whole route
 * down at build time. A missing record fails loudly enough one line later, when
 * the route reads `record.h1` and `Hero` throws its own "`heading` is required"
 * error naming the component.
 */
export function byPath(path) {
  return LEGAL_PAGES[path];
}

export default LEGAL_PAGES;
