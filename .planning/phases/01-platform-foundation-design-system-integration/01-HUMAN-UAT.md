---
status: partial
phase: 01-platform-foundation-design-system-integration
source: [01-VERIFICATION.md]
started: 2026-08-09T14:30:45Z
updated: 2026-08-09T14:30:45Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual rendering of the five integrated components

Open https://bhc-website-nine.vercel.app in a desktop browser, then in a mobile browser (or DevTools device emulation at 375px).

expected: The page looks like a coherent BHC page — Figtree/Public Sans render (not a system fallback), the breadcrumb trail sits above the hero, the hero heading "Deep Cleaning in Warwick" is the visually dominant element, the 4.9/175 rating badge is legible on the warm band, the interlink list is a readable list of three service links, "Get a Free Quote" is a filled primary button, and the footer NAP block sits at the bottom. Nothing overlaps, nothing is unstyled, no horizontal scroll at 375px.

why_human: SC-4 requires the five components "render correctly". Markup, class hooks, server-rendered JSON-LD, all 61 design tokens and all 8 woff2 files are machine-verified as present and served — but only an eye confirms the composed result is visually right rather than merely structurally present.

note: The links to /get-a-quote, /locations and the three /location/... URLs return 404. That is expected at this phase — those routes are Phase 2 and Phase 3 scope, not bugs.

result: [pending]

### 2. Dial the footer number on a real handset

Tap the footer phone number "+44 7861 936533" on a real mobile handset.

expected: The dialler opens pre-filled with +44 7861 936533 and, if dialled, reaches Beyond House Cleaning.

why_human: Digit equality between the label and the href is machine-verified on the live HTML. That the number physically reaches the business is human-only — this closes D-09 on the real device path rather than on the string.

result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps
