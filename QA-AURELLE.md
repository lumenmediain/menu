# Aurelle refinement validation

- Production build: passed, including TypeScript validation.
- ESLint: passed for application, Sanity, configuration, and test files.
- Data tests: 4 passed (pagination, item preservation, empty menus, assets and currency).
- Existing browser suite: 58 passed; keyboard, curved page turns, reverse turns, previews, focus restoration, contact, reduced motion, all categories and continuation pages.
- Accessibility: no violations in desktop/mobile axe scans; no browser exceptions.
- Additional page-fit suite: 51 checks passed at 320x568, 390x844, 844x390, and 1440x900. No menu content overflow or items below the reserved footer.
- Local category/cover screenshots visually inspected. Existing local photos and pizza cutout reused.
- No new dependencies, external font requests, image generation, or paid services.
- Sanity normalization and queries retained. Live CMS publishing could not be exercised without a configured Sanity project.

Preview: http://localhost:4400
Fit report: .shots/aurelle-fit.json
Interaction/accessibility report: .shots/report.json
## Correction: photography and composition

Root cause: only globals.css and aurelle.css were imported. Fixed 110–190px image heights, aggressive masks, short-screen display:none rules, and automatic cover spacing suppressed the photographic composition. Legacy category selectors remained active in globals.css.

Correction: removed 184 legacy presentation rules; defined one visual system with flexible image tracks, full photographic cover, larger menu typography, framed contact control, animated photography and two steam wisps. Pizza artwork is clipped to its own image area so it cannot overlap text. No changes to pagination, page physics, gestures, menu content, or Sanity queries.

Verification: final production build and TypeScript passed; changed component lint passed. Browser suite: 58 checks passed, including accessibility scans (zero violations). All-page fit and loaded-image checks: 51 passed across 320x568, 390x844, 844x390, and 1440x900. Representative renders reviewed in .shots/correction/contact-sheet.png. Final pizza overlap correction rechecked at both phone sizes and desktop; contact panels and normal/reduced motion verified.

Current preview: http://localhost:4402
Live Sanity publishing remains untested without a configured project.

## Cinematic scenes validation

Production build, TypeScript, changed-source ESLint, and 4 data tests passed. Existing browser suite: 58 checks passed, zero browser exceptions and zero desktop/mobile axe violations. Scene rendering/fit suite: 75 page/spread checks passed at 360x740, 390x844, 430x932, 1440x900, 320x568 and 844x390. Representative category renders reviewed in .shots/scenes/contact-sheet.png. After narrowing pizza text away from the illuminated food, 15 pizza/continuation checks passed across all six viewports; final phone and desktop screenshots inspected. Normal steam, reduced-motion disabling and contact focus restoration verified.

Preview: http://localhost:4403
Supplied burger/sandwich artwork is available for matching CMS categories; those categories are absent from the current demo. Other categories use existing photographs with CSS composition. No image generation or paid API operations occurred. Live Sanity publishing remains unverified because no project is configured locally.

## Background assignment correction

Assignments and crop metadata now live in src/lib/menu-backgrounds.ts. Cover uses coffee-cup.jpg unless a cover is explicitly configured in CMS; it never falls back to a special, pizza, or the first category. Category identity is resolved before any broad theme; missing ice-cream artwork cannot inherit dessert/cake art. Each category page has exactly one page-scene image and no extra category photograph.

Custom artwork present: pizza, burger, sandwich. Missing custom artwork: coffee/brand cover, coffee, breakfast, cake/dessert, ice cream, mocktail. Existing same-category photographs are explicitly catalogued as fallbacks; the beverage fallback is the existing iced-latte photo, not claimed to be a mocktail. Unknown categories without configured images get no fabricated or unrelated asset.

Side-composed backgrounds use one dish per leaf to keep complete descriptions in their text-safe area. Other pagination stays unchanged. Continuations retain a compact category title, omit the repeated introduction, and use per-category alternate positions. Authored CMS cover images remain full-page; only the existing coffee-photo fallback needs the photographic mask/scrim.

Validation: production build (including TypeScript), changed-source ESLint and 8 data/mapping tests passed. All-page background/image/fit checks: 82 passed across six mobile/desktop viewports. Book/keyboard/contact/preview/reduced-motion/accessibility browser suite: 63 passed, with zero axe violations. Cover, category compositions and coffee/pizza continuations visually inspected. Live Sanity publishing remains unverified without a configured project.

Current preview: http://localhost:4403
