# Aurelle Café design

Existing Next.js / React / Sanity stack; no added dependencies or generated assets.
Audience: QR menu visitors, primarily phones. All café details remain demonstration content.
Concept: a nocturnal culinary journal. The existing turning sheet is the signature; photographs emerge from dark paper, with champagne typography and silver captions.
Palette: ground #050505, paper #0B0B0C, ink #F2EEE6, secondary #BFC3C7, foil #D6B675.
Typography: Georgia display and dish names; Arial UI and descriptions. Existing system fonts avoid network requests and incompatible poster/script fonts.
Composition: typographic cover with a photographic special; coffee vignette, wide breakfast crop, transparent pizza, low dessert crop, arched beverages. Aligned menu rows remain free of photo overlaps.
Motion: existing curved sheet engine, subtle CSS steam, responsive hover movement. Reduced motion is immediate.
Pagination: one item on very short sheets, two on compact sheets, three on taller sheets. Footer reserves space for contact and page numbers.
Reference: https://www.behance.net/gallery/241033195/Cote-Cendre-Fine-Dining-Menu-Page-Experience (food-led hierarchy and restraint).
Efficiency: one coordinated implementation and existing validation; no generators, downloads, new libraries, or unrelated features.

Correction: category photography now fills the space remaining after complete text, instead of fixed-height photo slots. The cover uses an integrated full-page coffee photograph. One visual stylesheet owns category, cover and contact presentation; removed conflicting legacy rules. Keep image areas visible at every supported viewport and clip oversized artwork within its track.

## Supplied artwork implementation

The owner's pizza, burger and sandwich PNGs were optimized to WebP (261/271/295 KB) with their original compositions retained. Pizza uses the original full-page artwork; the demo cover shares that culinary identity. Burger and sandwich scenes resolve by CMS category title/id when those categories exist; no categories, prices or dishes were fabricated.

All category text is live HTML in the scene's negative space. Existing coffee, breakfast, dessert and beverage photos are composed through CSS as lower-page images with upper dark scrims; no additional matching illustrations/backgrounds were generated. An optional category background image field is available in Sanity and included in the category query. A configured background takes priority over local scene mappings.

Existing pagination, page physics, keyboard/swipe handling and data content remain intact. CSS steam, oven lighting, glass reflections and restrained entrances respect reduced motion and are disabled on measurement/turn clones.
