
import "server-only";

import { createClient } from "@sanity/client";

import { demoData } from "./demo";

import type {
  MenuData,
  Category,
} from "./types";

/* ==========================================================
   AURELLE — SANITY CMS DATA LAYER

   Features:
   - Sanity CMS integration
   - Published content only
   - 60-second cache revalidation
   - Custom menu update cache tag
   - Demo fallback when CMS is not configured
   - Error handling for unavailable CMS
   - Safe defaults for missing optional fields
   - Premium dark-menu defaults

   Compatible with:
   - MenuBook.tsx
   - Sanity Studio
   - Existing menu schemas
   - Next.js App Router
   ========================================================== */

/* ----------------------------------------------------------
   01 — ENVIRONMENT CONFIGURATION
   ---------------------------------------------------------- */

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

const readToken =
  process.env.SANITY_API_READ_TOKEN;

const apiVersion = "2026-01-01";

const REVALIDATE_SECONDS = 60;

/* ----------------------------------------------------------
   02 — DEFAULT VISUAL SETTINGS
   ---------------------------------------------------------- */

const DEFAULT_SETTINGS = {
  orderingEnabled: false,
  accent: "#FF9416",
  paper: "#11100F",
  typography: "classic",
} as const;

/* ----------------------------------------------------------
   03 — SANITY GROQ QUERY

   Fetch:
   - Café identity
   - Categories
   - Published menu items
   - Food photography
   - Editorial artwork
   - Today's special
   - Website visual settings
   ---------------------------------------------------------- */

const menuQuery = `{
  "cafe": *[
    _type == "cafeSettings"
  ][0] {
    name,
    tagline,
    story,
    "logo": logo.asset->url,
    address,
    phone,
    whatsapp,
    instagram,
    maps,
    hours[] {
      day,
      time
    }
  },

  "categories": *[
    _type == "menuCategory"
  ] | order(
    displayOrder asc,
    _createdAt asc
  ) {
    "id": _id,
    title,
    description,
    theme,
    accent,
    "image": image.asset->url,
    "artwork": artwork.asset->url,
    "background": background.asset->url,

    "items": *[
      _type == "menuItem" &&
      category._ref == ^._id &&
      hidden != true
    ] | order(
      displayOrder asc,
      _createdAt asc
    ) {
      "id": _id,
      name,
      description,
      price,
      currency,
      "image": image.asset->url,
      imageAlt,
      ingredients,
      dietary,
      "available": coalesce(
        available,
        true
      )
    }
  },

  "special": *[
    _type == "todaysSpecial"
  ][0] {
    enabled,
    text,
    "artwork": artwork.asset->url,

    "item": item-> {
      "id": _id,
      name,
      description,
      price,
      currency,
      "image": image.asset->url,
      imageAlt,
      ingredients,
      dietary,
      "available": coalesce(
        available,
        true
      ),
      hidden
    }
  },

  "settings": *[
    _type == "menuSettings"
  ][0] {
    orderingEnabled,
    accent,
    paper,
    typography,
    "coverImage": coverImage.asset->url
  }
}`;

/* ----------------------------------------------------------
   04 — SANITY CLIENT
   ---------------------------------------------------------- */

function getSanityClient() {
  if (!projectId) {
    throw new Error(
      "Sanity project ID is not configured.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,

    useCdn: false,

    token: readToken || undefined,

    perspective: "published",
  });
}

/* ----------------------------------------------------------
   05 — CATEGORY NORMALIZATION
   ---------------------------------------------------------- */

function normalizeCategories(
  categories: Category[],
): Category[] {
  return categories.map((category) => ({
    ...category,

    items: (category.items || []).map(
      (item) => ({
        ...item,

        currency: item.currency || "INR",

        available: item.available ?? true,

        dietary: item.dietary || [],

        ingredients: item.ingredients || [],
      }),
    ),
  }));
}

/* ----------------------------------------------------------
   06 — MAIN MENU FETCHER
   ---------------------------------------------------------- */

export async function getMenu(): Promise<MenuData> {
  /*
   * DEMO MODE
   *
   * Use demonstration data only when
   * Sanity is not configured.
   */

  if (!projectId) {
    return demoData;
  }

  try {
    const client = getSanityClient();

    const data = await client.fetch<MenuData>(
      menuQuery,
      {},
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
          tags: ["menu"],
        },
      },
    );

    /* ------------------------------------------------------
       VALIDATE REQUIRED CONTENT
       ------------------------------------------------------ */

    if (
      !data ||
      !data.cafe ||
      !Array.isArray(data.categories)
    ) {
      throw new Error(
        "Publish café settings and menu categories in Sanity Studio.",
      );
    }

    if (
      typeof data.cafe.name !== "string" ||
      !data.cafe.name.trim()
    ) {
      throw new Error(
        "A café name is required in Sanity Studio.",
      );
    }

    /*
     * An empty category array is valid.
     * The owner may intentionally publish
     * an empty menu.
     */

    /* ------------------------------------------------------
       NORMALIZE CATEGORIES
       ------------------------------------------------------ */

    const categories = normalizeCategories(
      data.categories,
    );

    /* ------------------------------------------------------
       TODAY'S SPECIAL
       ------------------------------------------------------ */

    const specialItem = data.special?.item;

    const special =
      data.special?.enabled &&
      specialItem &&
      !(
        specialItem as typeof specialItem & {
          hidden?: boolean;
        }
      ).hidden
        ? {
            ...data.special,
            enabled: true,
            item: {
              ...specialItem,
              currency:
                specialItem.currency || "INR",
              available:
                specialItem.available ?? true,
              dietary:
                specialItem.dietary || [],
              ingredients:
                specialItem.ingredients || [],
            },
          }
        : {
            enabled: false,
          };

    /* ------------------------------------------------------
       RETURN PRODUCTION MENU
       ------------------------------------------------------ */

    return {
      ...data,

      demo: false,

      cafe: {
        ...data.cafe,

        tagline:
          data.cafe.tagline || "",

        story:
          data.cafe.story || "",

        address:
          data.cafe.address || "",

        phone:
          data.cafe.phone || "",

        whatsapp:
          data.cafe.whatsapp || "",

        instagram:
          data.cafe.instagram || "",

        maps:
          data.cafe.maps || "",

        hours:
          data.cafe.hours || [],
      },

      categories,

      special,

      settings: {
        orderingEnabled:
          data.settings?.orderingEnabled ??
          DEFAULT_SETTINGS.orderingEnabled,

        accent:
          data.settings?.accent ||
          DEFAULT_SETTINGS.accent,

        paper:
          data.settings?.paper ||
          DEFAULT_SETTINGS.paper,

        typography:
          data.settings?.typography ||
          DEFAULT_SETTINGS.typography,

        coverImage:
          data.settings?.coverImage,
      },
    };
  } catch (error) {
    /* ------------------------------------------------------
       SERVER-SIDE ERROR LOGGING
       ------------------------------------------------------ */

    console.error(
      "[Aurelle CMS] Menu loading failed:",
      error instanceof Error
        ? error.message
        : "Unknown Sanity error",
    );

    /*
     * Never replace production content
     * with demo dishes after a CMS failure.
     *
     * The route's error.tsx handles
     * the customer-facing message.
     */

    throw new Error(
      "The menu is temporarily unavailable. Please ask a member of the café team.",
    );
  }
}
