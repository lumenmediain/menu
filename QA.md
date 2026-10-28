# Pizza-first Agency Agents review: 28 October 2026

Scoped pizza visual redesign reviewed by UI Designer/Visual Storyteller, Frontend Developer and Evidence Collector. Final build, lint, typecheck, four data tests, 58 existing browser checks, four native touch checks and 14 pizza-specific checks passed. Pizza axe analysis contains no violations and browser exceptions are empty. First/continuation phone pages, desktop, small-phone internal scrolling, preview/focus return and a paused curl were visually inspected after fixes. The engine substring, structural CSS, pagination/types and Sanity query/schema/config hashes match the task baseline exactly, independently checked by frontend and QA. See PIZZA-REDESIGN.md for exact boundaries and provenance. Other categories were not changed. Authenticated Sanity publishing and physical-device testing remain unverified.

# Dark restaurant redesign verification: 28 October 2026

Final production build passed. Full ESLint, TypeScript and four data tests passed. The production browser suite passed 58 checks, including all desktop spreads and mobile category copy fitting inside the paper, forward/backward turns, distinct facet transforms, rapid reversal, corner dragging, dish/contact dialogs, focus restoration, reduced motion, Studio and 404. Four native touch checks passed. The touch test now accepts the uppercase visual heading when matching Coffee. Desktop/mobile axe results contain zero violations and the regression suite reports zero browser exceptions.

Visually reviewed mobile cover, pizza, breakfast, dessert, drinks, desktop spread and a paused page turn. Corrected the portrait dessert focal position and desktop/mobile photo spacing after review. The final dessert image shows the plated tiramisu. The existing geometry, gesture state machine, scroll behavior, viewport sizing and pagination were left unchanged. Sanity queries and schemas were left unchanged; no credentials or live project were available for authenticated publication checks.

Presentation changes: src/app/dark-menu.css (new), src/app/layout.tsx, src/app/icon.svg, the Page content and decorative CulinarySketch in src/components/MenuBook.tsx, demo category titles/palette in src/lib/demo.ts, local Anton/Caveat font files with OFL licenses, tests/browser.mjs, tests/touch.mjs, README.md, DESIGN.md and QA.md. No new runtime dependencies or environment variables.

Independent screenshot review estimated Design 7.8, Usability 8.0, Creativity 7.4, Content 7.5 (internal estimate, not an award rating). Its dessert-crop concern was corrected and sparse continuation photography enlarged; real, consistently lit dish photography remains the most useful improvement. Demo imagery and labels are retained honestly. No new frame-rate or deployment claim is made.

Earlier verification follows for context.

# Verification update: 28 October 2026

Latest refinement: production build, full ESLint, TypeScript and four data tests passed. The final production build passed 52 browser checks and four native touch checks. New checks cover contact access without page navigation, suppression of book shortcuts while contact is open, and focus restoration. Desktop inner spread and mobile cover screenshots were visually inspected. Contact positioning was adjusted and the production suite rerun.

Modified files: src/components/MenuBook.tsx, src/app/globals.css, tests/browser.mjs, README.md, DESIGN.md, QA.md. No dependencies or environment variables were added. Sanity authenticated publishing and physical-device performance remain unverified. Earlier performance measurements below remain historical; no new 60 FPS claim is made.

# Verification · 27 October 2026

## Current book-only revision

- Removed the customer website header, hero, chapter navigation, external buttons/counters, instructions, sound/help, side text and footer from both JSX and CSS. The visible application is the book plus an opened dish preview.
- The book fits desktop, 390 × 844 phone, 320 × 568 small phone, and landscape viewports without document scrolling. Normal phone leaves fit all menu copy; exceptionally short displays keep overflow scrollable inside the paper.
- Three dishes per leaf, two on short displays; pagination retains all dishes and remaps the current item/category when capacity changes. Café details remain on the final leaf. No Sanity schemas, credentials, or fetch/revalidation behavior were changed.
- `npm run test:browser`: 49 book-only checks passed, including DOM removal, viewport fit, all category leaves, corner taps and dragging, rapid reversal, keyboard navigation, dish previews and focus return, reduced motion, separate Studio and 404.
- `node tests/touch.mjs`: four native touch checks passed (incomplete, cancelled, forward, backward). Internal page scroll regions explicitly use `touch-action: pan-y` so horizontal swipes stay with the book engine.
- Four data tests passed, including compact pagination preserving every dish. Lint, TypeScript and production build passed. axe reports zero desktop/mobile violations, with zero browser exceptions.
- Current screenshots: `.shots/desktop-cover.png`, `desktop-inner.png`, `desktop-turn.png`, `mobile-cover.png`, per-category `mobile-*.png`, and `mobile-information.png`.

The measurements and critic score below describe the earlier surrounding-layout build; they are historical, not new performance or visual claims for this revision. The connected-facet curl retains its known slow-CPU and extreme-angle limitations.

## Earlier build verification

Tested the production Next.js build served locally on port 4400.

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 3 passed (pagination, empty content and demo integrity).
- `npm run build`: passed.
- `npm run test:browser`: 37 checks passed. Forward/backward turns, rapid reversal, arrow keys, distinct facet transforms, previews, modal focus containment/return, absence of ordering actions, contact access, mobile page fit, reduced motion, incomplete/completed edge dragging, 320px overflow, Studio setup state and 404.
- `node tests/touch.mjs`: 4 native Chromium touch checks passed: incomplete swipe, touch cancellation, forward and backward swipes.
- axe on desktop and mobile: zero violations; zero browser exceptions in the regression suite.
- `npm audit --omit=dev`: zero known vulnerabilities. Targeted transitive overrides are recorded in package.json/package-lock.json.

Screenshots and machine-readable results are generated in ignored `.shots/`. Tests are reusable from `tests/`.

## Local diagnostic performance

390 × 844 mobile viewport; production server; 150 ms emulated latency; 200,000 download bytes/second. These are local lab observations, not real customer field measurements.

- With 4× CPU slowdown: LCP 1,616 ms; CLS 0. Median sampled frame interval 16.7 ms, but startup and rendering pauses caused a 533 ms p95 and a 1,150 ms maximum. **The turn does not sustain 60 FPS under this slowdown.**
- Without CPU slowdown: LCP 1,560 ms; CLS 0. Median frame interval 16.7 ms, mean 21.9 ms and p95 49.9 ms. There is still room to improve the mount/composite cost of DOM facets.

Copies of printed content are inert and aria-hidden, and reuse React-escaped markup from the measurement rack instead of mounting duplicate React component trees. Mobile uses 24 facets rather than desktop's 32; paper texture filters are omitted from moving facets. Further performance work could prerender sheet textures or add an opt-in simpler transition mode for slow hardware. Reduced-motion currently gives immediate, complete navigation.

## Independent visual review

Final separate critic estimate: Design 8.0, Usability 7.4, Creativity 7.6, Content 7.5; weighted 7.70/10. This is an internal estimate, not an official award score. Remaining findings were discoverability of horizontally scrolling mobile chapters and the need for device-based motion profiling. The menu uses an edge fade and centers the active chapter, but a more explicit scroll cue could improve discoverability.

## Verification limits

- No Sanity account/project credentials were supplied. Schemas, query typing, server/client separation, Studio setup state and Next.js build were verified; authenticated editing and real publish-to-frontend propagation require a configured project.
- Images, café identity, address, prices and opening hours are labeled demo content. Replace and verify them before launch.
- The turn is connected faceted geometry with a stylized corner lift, not a continuous physical simulation. Fine seams can be visible at extreme angles.
- Browser tests used Chromium, including real touch input dispatched through CDP. Safari/iOS and physical Android testing remain recommended.
- Local implementation only; nothing has been deployed.
