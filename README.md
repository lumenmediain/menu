# Folio · interactive café menu

A working Next.js App Router, React and TypeScript application. The customer interface is only a physical-style menu book; Sanity Studio lives separately at `/studio`.

## Run

Requires Node 22.12+ (tested with Node 24) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

Production and checks:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- -p 4400
# In another terminal:
npx playwright install chromium
npm run test:browser
node tests/touch.mjs
node tests/performance.mjs
```

`TEST_URL` overrides the browser suite's http://localhost:4400 target. The suite saves desktop/mobile screenshots and an axe accessibility report under `.shots/`. Unit tests exercise pagination, item preservation, currency formatting, demo assets and the disabled ordering boundary.

## What is implemented

- A book that fills the available screen: desktop paired sheets and mobile single leaves. There is no surrounding website header, hero, navigation bar, control panel, or footer.
- Textured charcoal cover, orange-gold typography, culinary line artwork, local demo food photography, an editable daily special, five distinct category compositions, and a café closing page.
- Physically layered paper block: fine alternating sheet lines, changing left/right stack depth, cover thickness, restrained corner rounding and gutter shading.
- Customers turn the paper directly: corner taps, corner/edge dragging, touch swipes, or arrow keys. Accessible buttons are integrated into the folded paper corners; there are no external navigation buttons or counters.
- An interrupt-safe turn state machine with one queued destination. Incomplete/cancelled drags settle home. Viewport and motion preference changes safely clear the active sheet.
- Dish photography/details in native modal dialogs; Escape, focus containment, backdrop dismissal and focus restoration. Unavailable dishes remain inspectable and visibly labeled.
- Café details and contact links live on the final printed leaf. Empty demo phone/social/map data produces explanatory text rather than fake working links.
- Reduced-motion and missing-3D fallbacks perform direct page changes.
- Sanity Studio, singleton settings, schemas and server-only published-content reads with 60-second cache revalidation.

## How the page curl works

`src/components/MenuBook.tsx` divides the animated sheet into 32 connected narrow facets (24 on mobile). A progress parameter drives a nonuniform tangent angle across the width. The engine integrates those tangents to locate each facet in 3D, so their edges stay connected. Outer sections lead, inner sections follow, and a restrained wave relaxes toward the completed state. A small vertical offset depends on the grabbed corner. Cubic acceleration/deceleration brings the sheet to rest without spring bounce.

Each facet clips an inert, aria-hidden copy of the front and reverse printed content. Surface shading and glints vary with its tangent; a blurred projected shadow travels across the receiving spread. DOM text and buttons remain accessible on the resting pages. Only an active turn schedules `requestAnimationFrame`; it is cancelled during cleanup.

This is a lightweight geometric approximation, **not** a cloth/finite-element simulation. It has faceted curvature at extreme views and a stylized rather than physically exact diagonal corner curl. A WebGL mesh would smooth those limits but adds text-texture rendering, memory, and accessibility complexity. Validate motion on target café devices before launch; 60 FPS is a target, not a guarantee.

## Connect Sanity

1. Create one Sanity project for this café at https://www.sanity.io/manage. Use a `production` dataset.
2. Copy `.env.example` to `.env.local` and fill the project ID and dataset. Restart Next.js after changing environment configuration.
3. Add `http://localhost:3000`, your test port if used, and the deployed website origin under the project's **API → CORS origins**. Permit credentials only for the Studio origins that need authenticated editing.
4. Visit `/studio` and sign in to Sanity. The Studio uses Sanity authentication and project roles; seeing the route does not grant write access.
5. Publish **Café information** and **Design & features**. Add categories, then menu items referencing those categories. Set numeric display orders to reorder categories/items. Add and publish **Today's special** if desired.
6. Invite the owner as an appropriate editor role. Keep admin rights limited. Use a separate project/dataset and restricted membership for another independent café; this is not a multi-tenant permissions architecture.

### Environment variables

| Variable                        | Required                  | Use                                                            |
| ------------------------------- | ------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | For live CMS              | Public project identifier; blank selects demo mode             |
| `NEXT_PUBLIC_SANITY_DATASET`    | For live CMS              | Dataset name, defaults to `production`                         |
| `SANITY_API_READ_TOKEN`         | Only for private datasets | Server-only Viewer/read token; never exposed to client code    |
| `NEXT_PUBLIC_SITE_URL`          | At deployment             | Absolute website origin for canonical URLs, robots and sitemap |

No write token is needed by the frontend. Do not prefix private credentials with `NEXT_PUBLIC_`. Do not commit `.env.local`. Public datasets intentionally allow public published menu reads; use a private dataset and server-only read token if that is inappropriate for your café.

### Publishing and refresh

The server queries only published documents with `useCdn: false` and `next: { revalidate: 60 }`. Next.js refreshes stale cached menu content on subsequent requests, with no code changes or redeployment. The first request after expiry may receive the old response while background revalidation runs; a later reload sees the published update. An already-open tab does not automatically change while a customer reads. Drafts stay in Studio until published. See [Next.js fetch caching](https://nextjs.org/docs/app/api-reference/functions/fetch) and [Sanity embedded Studio](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs).

Blank project ID runs the complete labeled demo. A configured project with a missing dataset, invalid credentials or missing café document shows an error state instead of silently presenting demo food as the real café. A deliberately empty category list remains empty.

### Content and design guardrails

Schemas constrain category headings, descriptions and dish copy. The book paginates at three dishes per leaf, or two on short displays, instead of shrinking text. Continuation leaves retain photography and a composed layout. Exceptionally long content or enlarged text can scroll inside its paper area; the book and document stay within the viewport. Use short printed-menu descriptions; longer ingredients belong in the preview. Page compositions, brand/paper colours, classic/modern typography, logo and art are separate from product data. Colour fields accept hex values; the owner must preserve accessible contrast when choosing a new palette. Uploaded Sanity images use Next Image responsive optimization. Replace illustration/photography where it does not accurately portray the actual dish, and enter image alt text.

## Source map

- `src/components/MenuBook.tsx`: book pages, turn geometry/state machine, gestures, dialogs and controls.
- `src/app/globals.css`: visual system, cloth/paper texture, layered edges, 3D facets and responsive layouts.
- `src/lib/types.ts`: data contracts, currency formatting and bounded pagination.
- `src/lib/demo.ts`: clearly labeled fictional café and sample dishes.
- `src/lib/sanity.ts`: server-only GROQ content query and revalidation.
- `sanity/schemaTypes.ts`, `sanity.config.ts`: editable schemas and singleton Studio structure.
- `src/app/studio/[[...tool]]/page.tsx`, `src/components/Studio.tsx`: administrative route and demo setup state.
- `src/app/`: metadata, icon, robots, sitemap, error and 404 routes.
- `public/images/`: local demo images and source credits.
- `tests/`: data integrity and end-to-end browser checks.
- `DESIGN.md`: inspection, visual direction, animation decisions and tradeoffs.

## Future ordering

`MenuData.settings.orderingEnabled` is the explicit feature boundary, false by default and read-only in this release's Studio. The preview consumes a stable `MenuItem` object so a future ordering module can extend it without replacing the menu. No cart, checkout, payment provider, order endpoints, or customer data collection is implemented.

## Before showing this as a real café

Replace the demo identity, address, photographs and prices with verified café content. Add real phone/WhatsApp numbers and full HTTPS social/map links. Check dietary information with the kitchen. Live Sanity editing requires your project and account; it cannot be verified end to end without them. Deploy to a Node-compatible Next.js host with the environment variables above. This workspace implementation has not been deployed or connected to a real café account.

## Latest refinement

The exposed side edges now use vertical sheet striations, distinct from the horizontal bottom paper block. Stack depth interpolates during turns and resets after cancelled drags. Mobile swipe direction is resolved from the gesture even when it starts in the opposite half of the opening or closing leaf. Unsupported 3D transforms use the same direct-navigation gesture fallback as reduced motion.

## Dark restaurant edition

The current visual direction follows black printed restaurant menus: charcoal paper, warm orange display type, ivory dish names and dotted price leaders. `src/app/dark-menu.css` is the presentation layer loaded after the existing structural CSS. It does not modify book geometry, gesture handling, pagination or animation timing. `Page` adds theme-specific handwritten annotations and decorative culinary sketches while continuing to render dynamic categories/items. Pizza uses a masked oven photograph, breakfast overlapping photographs, coffee an oval light vignette, desserts a trailing photo, and drinks an arched composition. Continuation pages retain their category theme and larger imagery when space permits.

Anton and Caveat are locally hosted in `public/fonts/`; their OFL licenses are included. No font service, animation package, remote food-image request, new environment variable, schema migration or CMS query change was introduced. Existing credited photographs remain demo placeholders. There is no burger category or burger photograph in the supplied project; add real licensed caf? photography through Sanity if one is needed. Actual cheesecake/brownie/lemonade photographs should replace the shared illustrative demo photos before a commercial presentation.

## Pizza-first Agency Agents prototype

The latest pass changes only pizza presentation. See [PIZZA-REDESIGN.md](PIZZA-REDESIGN.md) for the installed specialist roles, agreed design, review evidence, generated-asset provenance and unchanged-engine verification. The existing category artwork field now demonstrates transparent cutout photography; category images remain the fallback. Run `node tests/pizza.mjs` against the production server for pizza-specific screenshots and interaction checks. Other categories were not redesigned in this pass.
