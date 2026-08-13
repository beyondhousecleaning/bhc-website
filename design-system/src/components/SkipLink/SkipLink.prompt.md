---
category: Navigation
---

# SkipLink

**WCAG 2.4.1 Bypass Blocks.** One anchor, off-canvas until focused, offering a jump past the global
navigation to the page's content.

## It adds no CSS

`.bhc-skip-link` has been in `styles.css` since Phase 1 (`styles.css:51-62`): `position: absolute`,
`top: calc(-1 * var(--bhc-space-16))`, animating to `top: var(--bhc-space-4)` on `:focus`, paper on
ink at 15.81:1. This component is a wrapper over shipped rules.

**Do not append a `styles.css` block for it.** A second definition of the same class in the same
file is a silent last-one-wins, and the whole reason this component is four lines is that the styling
question was settled two phases ago.

## Placement, and the one thing that makes it work

| Requirement | Where it lives | What breaks without it |
|---|---|---|
| First element inside `<body>`, before `Header` | the root layout (plan 02-13) | the link is not the first tab stop, so it is not a bypass |
| `<main id="main" tabIndex={-1}>` | `layout.jsx:69`, already shipped | **the link appears to work and does not** |

The `tabIndex={-1}` is the load-bearing half. A fragment jump to an element that is not focusable
moves the *viewport* in Safari and Chrome but leaves *focus* where it was, so the next Tab press
returns to the first nav item — the user is back exactly where the link was meant to take them past.
`tabIndex={-1}` renders as `tabindex="-1"`, makes the element programmatically focusable without
adding a tab stop, and is what actually moves the ring.

Plan 02-02 added that wrapper. This component's contract is only that `href` names an element which
has it.

## Why there is no `as` prop

Nine of the sixteen components take `as?: ElementType` per UI-SPEC §13-J. This one does not, and the
omission is deliberate rather than an oversight: §13-J's escape hatch exists so a router link
component can be substituted for a link to a *route*. This link's destination is a same-document
fragment. A router link would intercept the click, push a history entry, and skip the native
fragment-navigation focus behaviour described above — which is the entire mechanism.

## Accessibility

The label is real text, not an icon, and the component is never `display: none` or `aria-hidden`.
Off-canvas positioning keeps it in the tab order; a visually-hidden technique that removed it from
the accessibility tree would defeat the criterion it exists to satisfy.

No `:focus-visible` rule of its own — `<a>` is already covered by the shipped base rule at
`styles.css:45-49`, and `styles.css`'s focus-override section is the last section of the file and is
the only place the indicator is ever scoped.

## Don't

- Don't restyle `.bhc-skip-link` or add a CSS block for this component. The rules ship already.
- Don't point `href` at an element without `tabindex="-1"`. That is the failure this whole doc is about.
- Don't render it anywhere but first inside `<body>`. A skip link that is not the first tab stop is
  not a skip link.
- Don't add an `as` prop. A router link breaks fragment navigation, which is the mechanism.
- Don't hide it with `display: none`, `visibility: hidden` or `aria-hidden`. All three remove it from
  the tab order.
