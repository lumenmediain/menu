
/* ==========================================================
   AURELLE — MENU TYPES & UTILITIES

   Compatible with:
   - MenuBook.tsx
   - Sanity CMS
   - demo.ts
   - Pizza editorial layouts
   - Dynamic menu pagination

   No changes to book-turning mechanics.
   ========================================================== */

/* ----------------------------------------------------------
   01 — SHARED TYPES
   ---------------------------------------------------------- */

export type MenuTheme =
  | "coffee"
  | "breakfast"
  | "pizza"
  | "dessert"
  | "drinks";

export type TypographyStyle =
  | "classic"
  | "modern";

export type OpeningHours = {
  day: string;
  time: string;
};

/* ----------------------------------------------------------
   02 — MENU ITEM
   ---------------------------------------------------------- */

export type MenuItem = {
  id: string;

  name: string;
  description: string;

  price: number;
  currency: string;

  image?: string;
  imageAlt?: string;

  ingredients?: string[];
  dietary?: string[];

  available: boolean;
};

/* ----------------------------------------------------------
   03 — MENU CATEGORY
   ---------------------------------------------------------- */

export type Category = {
  id: string;

  title: string;
  description: string;

  image?: string;

  /**
   * Optional transparent editorial artwork.
   *
   * Example:
   * /images/pizza-cutout.webp
   *
   * Used for cinematic food compositions.
   */
  artwork?: string;

  /** Full-page portrait artwork with clear space for live menu text. */
  background?: string;

  theme: MenuTheme;

  /**
   * Optional category-specific accent.
   * Example: #FF9416
   */
  accent?: string;

  items: MenuItem[];
};

/* ----------------------------------------------------------
   04 — CAFÉ INFORMATION
   ---------------------------------------------------------- */

export type Cafe = {
  name: string;
  tagline: string;
  story: string;

  logo?: string;

  address: string;

  phone: string;
  whatsapp: string;
  instagram: string;
  maps: string;

  hours: OpeningHours[];
};

/* ----------------------------------------------------------
   05 — TODAY'S SPECIAL
   ---------------------------------------------------------- */

export type TodaysSpecial = {
  enabled: boolean;

  text?: string;
  artwork?: string;

  item?: MenuItem;
};

/* ----------------------------------------------------------
   06 — MENU SETTINGS
   ---------------------------------------------------------- */

export type MenuSettings = {
  orderingEnabled: boolean;

  accent: string;
  paper: string;

  typography: TypographyStyle;

  coverImage?: string;
};

/* ----------------------------------------------------------
   07 — COMPLETE MENU DATA
   ---------------------------------------------------------- */

export type MenuData = {
  demo: boolean;

  cafe: Cafe;

  categories: Category[];

  special: TodaysSpecial;

  settings: MenuSettings;
};

/* ----------------------------------------------------------
   08 — BOOK PAGE
   ---------------------------------------------------------- */

export type BookPage = {
  kind: "cover" | "category" | "info";

  category?: Category;

  continuation?: boolean;

  number: number;
};

/* ==========================================================
   09 — PAGINATION
   ========================================================== */

/**
 * Divides menu categories into individual book pages.
 *
 * Each category begins on its own page.
 *
 * Large categories continue onto additional pages.
 *
 * Capacity is limited to 1–4 menu items per page.
 *
 * The book's page-turning logic remains separate.
 */

export function paginate(
  data: MenuData,
  capacity = 4,
  categoryCapacities: Record<string, number> = {},
): BookPage[] {
  const safeCapacity = Number.isFinite(capacity)
    ? Math.floor(capacity)
    : 4;

  const itemsPerPage = Math.max(
    1,
    Math.min(4, safeCapacity),
  );

  const pages: BookPage[] = [
    {
      kind: "cover",
      number: 1,
    },
  ];

  for (const category of data.categories) {
    const items = category.items ?? [];
    const requestedCapacity = categoryCapacities[category.id];
    const categoryCapacity = Number.isFinite(requestedCapacity)
      ? Math.max(1, Math.min(itemsPerPage, Math.floor(requestedCapacity)))
      : itemsPerPage;

    /*
     * Even empty categories receive one page.
     * This preserves the editorial section layout.
     */

    const pageCount = Math.max(
      1,
      Math.ceil(items.length / categoryCapacity),
    );

    for (
      let pageIndex = 0;
      pageIndex < pageCount;
      pageIndex++
    ) {
      const start =
        pageIndex * categoryCapacity;

      const end =
        start + categoryCapacity;

      pages.push({
        kind: "category",

        category: {
          ...category,
          items: items.slice(start, end),
        },

        continuation:
          pageIndex > 0,

        number:
          pages.length + 1,
      });
    }
  }

  /*
   * Final page contains café information,
   * opening hours, and contact details.
   */

  pages.push({
    kind: "info",
    number: pages.length + 1,
  });

  return pages;
}

/* ==========================================================
   10 — CURRENCY FORMATTING
   ========================================================== */

const currencyFormatters = new Map<
  string,
  Intl.NumberFormat
>();

/**
 * Formats item prices using their currency.
 *
 * Examples:
 *
 * INR  → ₹490
 * USD  → $12
 * CAD  → CA$12
 * EUR  → €12
 *
 * Currency formatting uses the en-IN locale.
 */

export function money(
  item: MenuItem,
): string {
  const currency = (
    item.currency || "INR"
  ).toUpperCase();

  let formatter =
    currencyFormatters.get(currency);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        },
      );
    } catch {
      formatter = new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        },
      );
    }

    currencyFormatters.set(
      currency,
      formatter,
    );
  }

  return formatter.format(
    Number.isFinite(item.price)
      ? item.price
      : 0,
  );
}
