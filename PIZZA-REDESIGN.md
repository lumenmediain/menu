# Folio: pizza-first cinematic prototype

## Installed Agency Agents collaboration

- [UI Designer](agency-agents/design/design-ui-designer.md): hierarchy, typography, mobile text zones.
- [Visual Storyteller](agency-agents/design/design-visual-storyteller.md): cinematic composition, oversized photographic silhouette, layered food details.
- [Frontend Developer](agency-agents/engineering/engineering-frontend-developer.md): minimal presentation-only implementation, existing CMS contract, snapshot compatibility, final code review.
- [Evidence Collector](agency-agents/testing/testing-evidence-collector.md): screenshot review, interaction evidence, independent unchanged-file verification.

The UI and visual specialists worked together on one design brief; frontend and QA exchanged constraints before implementation. Their two screenshot review passes identified and resolved script/intro collisions, prices over toppings, continuation spacing, and a small-phone footer collision. No remaining category was redesigned during this task.

## Agreed composition

Charcoal printed paper, oversized orange PIZZA type, warm handwritten annotations, ivory serif listings, orange prices and dotted leaders. An alpha-cutout pizza with a lifted slice, mozzarella strands, basil and tomatoes enters from the page edge. Desktop reserves a clear left text column and reveals the lifted slice on the right. Phone uses a dedicated integrated title/photo area followed by full-width listings. A true single-item continuation enlarges the food independently of short-screen two-item pagination. Small phones retain the existing internal scroll behavior.

## Implementation boundary

New `src/app/pizza-editorial.css` styles only pizza content. `MenuBook.tsx` changes are confined to the Page renderer: presentation classes, a pizza kicker and handwritten annotation. `src/app/layout.tsx` imports the stylesheet. `src/lib/demo.ts` assigns one demo artwork asset to pizza. All dishes, prices, availability and preview handlers remain dynamic.

Existing Sanity category `artwork` accepts the transparent hero; `image` remains the photographic fallback when artwork is absent. For the cutout composition upload a transparent PNG/WebP with generous margins and select the existing pizza composition. No schema, query, type, credential or environment changes were needed. Artwork is decorative editorial imagery; dish previews retain each item's photograph. Real authenticated publishing was not tested without a configured project.

`tsconfig.json` and `eslint.config.mjs` exclude the separately installed `design-tools/` applications and `agency-agents/` repository. The initial build showed unrelated nested React/Electron type conflicts. Folio source and Sanity remain checked; the external applications themselves were not modified.

## Evidence and verification

- Production build, full scoped lint, TypeScript and four data tests passed.
- 58 existing browser checks and four native touch checks passed.
- `node tests/pizza.mjs`: 14 checks cover first/continuation fit, alpha-image fit, preview/focus return, accessibility, small-screen reachability, desktop fit and artwork preservation during an active curl.
- Reviewed `.shots/pizza-mobile-first.png`, `pizza-mobile-continuation.png`, `pizza-desktop.png`, `pizza-small-top.png`, `pizza-small-bottom.png`, `pizza-preview.png` and `pizza-turn.png`.
- `.shots/pizza-baseline.json`, `MenuBook.before.txt` and `pizza-invariants.json` establish unchanged source boundaries. Frontend and QA independently verified the engine section starting at `const FACETS = 32;` through EOF, structural globals.css, types/pagination, Sanity query, schemas and Studio configuration.
- Exact engine SHA256 before and after: `2dbe80614c731314515aebbf28b7de685433a4f125e95432c9ceac8ed7955937` (UTF-8 substring, no newline normalization).

Run `npm.cmd run dev` for local development. For evidence, run `npm.cmd run build`, `npm.cmd run start -- -p 4400`, then `node tests/pizza.mjs`, `npm.cmd run test:browser` and `node tests/touch.mjs`. `TEST_URL` can override port 4400.

## Demo asset provenance

`public/images/pizza-cutout.webp` was created with the built-in image generation tool, then resized and encoded as an alpha WebP using the already available Sharp package. It is illustrative generated artwork, not a photograph of the actual café's dishes. The original source is retained in `.shots/pizza-cutout-source.png`; the original oven photo and its credit remain unchanged. Replace the generated cutout with actual café photography for a commercial menu. No new runtime dependency was added.

Final generation prompt:

> Create a premium food advertising photographic cutout asset for a cinematic black-and-orange Italian restaurant menu. Transparent alpha background, absolutely no text, no logos, no frame, no table or plate. One exceptionally appetizing whole Neapolitan margherita pizza seen from a close three-quarter overhead angle, glossy melted mozzarella, rich tomato sauce, fresh basil leaves, golden puffy blistered leopard-charred crust, warm amber raking light from upper left, detailed realistic food texture. A single triangular slice is lifted upward from the upper-right edge with several believable thin strands of melted mozzarella stretching down to the pizza. The pizza is fully visible with generous transparent margins, isolated clean silhouette suitable for art-directed compositing; no utensils or hands. A small separate natural cluster of fresh basil leaves and two cherry tomatoes near lower left of the pizza, with clear separation, all on transparent background. Photorealistic luxury restaurant food photography, not illustration, not 3D render. Square composition, whole pizza occupying bottom two thirds, lifted slice in upper-right third. Keep food richly saturated, warm, extremely appetizing, physically plausible.
