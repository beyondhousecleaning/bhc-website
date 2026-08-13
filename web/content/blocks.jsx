/**
 * renderBlocks — the one prose-block to element mapping.
 *
 * THE ONLY `.jsx` IN `web/content/`, and it is worth saying why, because the
 * rule for this directory is otherwise "plain `.js` data modules only".
 *
 * It returns elements, so it cannot be a data module. What makes it safe to sit
 * beside them is what it does NOT contain: no copy, and no string handling of
 * any kind. The `claude-seo` PostToolUse hook rejects a `.jsx` write containing
 * the case-insensitive substring `REPLACE`, which every `.replace(` call carries
 * and which ordinary British prose carries too — so the moment this file grew
 * either, it would stop being writable. Every sibling in this directory holds
 * the copy; this file holds only the mapping. Keep the split.
 *
 * ONE RENDERER, THREE CONSUMERS. Plans 02-08, 02-09 and 02-12 all import it —
 * home, the six service pages and the utility pages. It lands here in wave 3
 * rather than inside one of them because 02-08 and 02-09 are wave-mates: if
 * either owned the file, the other would import something that did not exist yet.
 * Nothing inlines its own copy of this mapping.
 *
 * IT MUST NEVER EMIT AN `<h1>`. Lock 1 allows exactly one `<h1>` per page and it
 * belongs to `Hero`'s `heading` prop. A block array is authored data, and a
 * second `<h1>` arriving from data would fail Lock 1 on every page that block
 * appears on, with the cause sitting in a content file rather than in a
 * template. The enforcement is structural: there is no `h1` entry in the map
 * below, so a `{ type: 'h1' }` block is simply dropped like any other
 * unrecognised type. Do not add one. `Prose`'s own contract says the same thing
 * from the other side — its outline starts at `<h2>`.
 *
 * NO CLASSES OF ITS OWN. `Prose` styles its descendants through `:where()`,
 * which keeps specificity at zero, so these elements need no `bhc-` class to
 * pick up the reading measure and the vertical rhythm. Adding one here would
 * fork the typography away from the container that owns it.
 *
 * A NOTE ON THE ONE DIRECTIVE THAT MUST NEVER APPEAR IN THIS DIRECTORY. Plan
 * 02-02's delta 11 scans `web/app`, `web/content` and `design-system/src` with a
 * plain substring grep for the directive that marks a module as a browser
 * component. It is a substring grep, so even an explanatory comment naming it
 * turns `check:html` red — this repo has tripped over a scanner matching its own
 * explanation six times now. Refer to it as "the client directive", as
 * `web/app/page.jsx` does. It does not belong here in any case: this is a server
 * module and it renders static markup.
 */

/**
 * The block-type map. Each entry takes the block and its key and returns one
 * element.
 *
 * `ul` is the odd one: its `text` field carries the ITEMS, an array of strings,
 * not a single string. That is the shape the consumer plans author against, and
 * it is stated on `renderBlocks` below.
 */
const RENDERERS = {
  p: (block, key) => <p key={key}>{block.text}</p>,
  h2: (block, key) => <h2 key={key}>{block.text}</h2>,
  h3: (block, key) => <h3 key={key}>{block.text}</h3>,
  ul: (block, key) => (
    <ul key={key}>
      {(Array.isArray(block.text) ? block.text : []).map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ),
};

/**
 * Map an authored block array to elements.
 *
 * The block shape, fixed by this plan and consumed by 02-08, 02-09 and 02-12:
 *
 *   { type: 'p',  text: string }
 *   { type: 'h2', text: string }
 *   { type: 'h3', text: string }
 *   { type: 'ul', text: string[] }   // `text` carries the items
 *
 * KEYED BY INDEX, deliberately. Blocks are authored data with no natural id, and
 * the array is static at build time — there is no reorder, no insert and no
 * filter happening at runtime for an index key to go wrong against.
 *
 * AN UNRECOGNISED `type` RENDERS NOTHING RATHER THAN THROWING, and so does a
 * null entry. This is the same instinct as `NAPFooter`'s `.filter(Boolean)`
 * guard and for the same reason: these arrays are consumed inside the root
 * layout's page tree, so a typo in one content file would take down a whole
 * route during server render rather than leaving a gap in one section. A missing
 * paragraph is a content bug someone notices; a 500 is an outage.
 */
export function renderBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : [])
    .map((block, i) => {
      if (!block) return null;
      const render = RENDERERS[block.type];
      return render ? render(block, i) : null;
    })
    .filter(Boolean);
}

export default renderBlocks;
