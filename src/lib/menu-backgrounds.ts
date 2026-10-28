import type { Category, MenuSettings } from "./types";

type BackgroundKey = "cover" | "coffee" | "breakfast" | "pizza" | "burgers" | "sandwiches" | "desserts" | "iceCream" | "beverages";
type BackgroundSpec = {
  artwork: string | null;
  fallback: string | null;
  foodSide: "left" | "right" | "bottom";
  position: string;
  continuationPosition: string;
};

/** Only real, inspected files belong here. Null means matching custom artwork is missing. */
export const menuBackgrounds: Record<BackgroundKey, BackgroundSpec> = {
  cover: { artwork: null, fallback: "/images/coffee-cup.jpg", foodSide: "bottom", position: "50% 58%", continuationPosition: "50% 58%" },
  coffee: { artwork: null, fallback: "/images/coffee-cup.jpg", foodSide: "bottom", position: "50% 64%", continuationPosition: "64% 58%" },
  breakfast: { artwork: null, fallback: "/images/breakfast.jpg", foodSide: "bottom", position: "52% 58%", continuationPosition: "66% 65%" },
  pizza: { artwork: "/images/scenes/pizza.webp", fallback: null, foodSide: "right", position: "50% 50%", continuationPosition: "62% 43%" },
  burgers: { artwork: "/images/scenes/burger.webp", fallback: null, foodSide: "right", position: "50% 50%", continuationPosition: "62% 45%" },
  sandwiches: { artwork: "/images/scenes/sandwich.webp", fallback: null, foodSide: "left", position: "50% 50%", continuationPosition: "38% 45%" },
  desserts: { artwork: null, fallback: "/images/dessert.jpg", foodSide: "bottom", position: "50% 85%", continuationPosition: "65% 80%" },
  iceCream: { artwork: null, fallback: null, foodSide: "right", position: "50% 50%", continuationPosition: "62% 45%" },
  // The existing beverage photo depicts the iced latte on the demo menu, not a mocktail.
  beverages: { artwork: null, fallback: "/images/cold-brew.jpg", foodSide: "bottom", position: "50% 60%", continuationPosition: "62% 55%" },
};

export function backgroundKey(category: Pick<Category, "id" | "title">): Exclude<BackgroundKey, "cover"> | undefined {
  const name = `${category.id} ${category.title}`.toLowerCase().replace(/[_-]/g, " ");
  // Match ice cream before desserts; a broad CMS theme must never assign cake to ice cream.
  if (/ice\s*cream|gelato/.test(name)) return "iceCream";
  if (/sandwich/.test(name)) return "sandwiches";
  if (/burger/.test(name)) return "burgers";
  if (/pizza/.test(name)) return "pizza";
  if (/coffee|espresso/.test(name)) return "coffee";
  if (/breakfast|brunch/.test(name)) return "breakfast";
  if (/dessert|cake|sweet/.test(name)) return "desserts";
  if (/beverage|drink|mocktail|cocktail/.test(name)) return "beverages";
}

export function resolveCategoryBackground(category: Category, continuation = false) {
  const key = backgroundKey(category);
  const spec = key ? menuBackgrounds[key] : undefined;
  const artwork = category.background || spec?.artwork;
  const src = artwork || category.image || spec?.fallback || undefined;
  return {
    key,
    src,
    composed: Boolean(artwork),
    foodSide: artwork ? spec?.foodSide || "right" : "bottom",
    position: (continuation ? spec?.continuationPosition : spec?.position) || "50% 50%",
  };
}

export function resolveCoverBackground(settings: Pick<MenuSettings, "coverImage">) {
  return settings.coverImage || menuBackgrounds.cover.artwork || menuBackgrounds.cover.fallback!;
}

/** Side-composed art needs a narrow, short text block, not smaller type over the food. */
export function backgroundPageLimits(categories: Category[]): Record<string, number> {
  return Object.fromEntries(categories.flatMap((category) => {
    const background = resolveCategoryBackground(category);
    return background.composed && background.foodSide !== "bottom" ? [[category.id, 1]] : [];
  }));
}
