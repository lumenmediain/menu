import { defineField, defineType } from "sanity";
const color = (name: string, title: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: "string",
    initialValue,
    description:
      "Six-digit hex colour, e.g. #233e32. Check text contrast after changing.",
    validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/),
  });
const image = (name: string, title: string) =>
  defineField({ name, title, type: "image", options: { hotspot: true } });
const url = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "url",
    validation: (r) => r.uri({ scheme: ["https"] }),
  });
export const schemaTypes = [
  defineType({
    name: "cafeSettings",
    title: "Café information",
    type: "document",
    fields: [
      defineField({
        name: "name",
        title: "Café name",
        type: "string",
        validation: (r) => r.required().max(30),
      }),
      image("logo", "Logo"),
      defineField({
        name: "tagline",
        type: "string",
        validation: (r) => r.max(60),
      }),
      defineField({
        name: "story",
        title: "Our story",
        type: "text",
        rows: 4,
        validation: (r) => r.max(320),
      }),
      defineField({
        name: "address",
        type: "text",
        rows: 2,
        validation: (r) => r.max(160),
      }),
      defineField({
        name: "phone",
        title: "Phone (include country code)",
        type: "string",
      }),
      defineField({
        name: "whatsapp",
        title: "WhatsApp number (include country code)",
        type: "string",
      }),
      url("instagram", "Instagram URL"),
      url("maps", "Google Maps URL"),
      defineField({
        name: "hours",
        title: "Opening hours",
        type: "array",
        validation: (r) => r.max(7),
        of: [
          {
            type: "object",
            fields: [
              defineField({
                name: "day",
                type: "string",
                validation: (r) => r.required().max(24),
              }),
              defineField({
                name: "time",
                type: "string",
                validation: (r) => r.required().max(30),
              }),
            ],
            preview: { select: { title: "day", subtitle: "time" } },
          },
        ],
      }),
    ],
  }),
  defineType({
    name: "menuCategory",
    title: "Menu categories",
    type: "document",
    fields: [
      defineField({
        name: "title",
        title: "Category name",
        type: "string",
        validation: (r) => r.required().max(40),
      }),
      defineField({
        name: "description",
        type: "text",
        rows: 2,
        validation: (r) => r.max(100),
      }),
      defineField({
        name: "displayOrder",
        type: "number",
        initialValue: 0,
        validation: (r) => r.integer().min(0),
      }),
      image("image", "Category photograph"),
      image("artwork", "Decorative artwork"),
      image("background", "Portrait menu background (keep upper half clear for text)"),
      defineField({
        name: "theme",
        title: "Page composition",
        type: "string",
        initialValue: "coffee",
        options: {
          list: [
            { title: "Arched coffee photograph", value: "coffee" },
            { title: "Morning editorial", value: "breakfast" },
            { title: "Stone oven / circular photo", value: "pizza" },
            { title: "Dessert feature", value: "dessert" },
            { title: "Fresh drinks", value: "drinks" },
          ],
        },
        validation: (r) => r.required(),
      }),
      color("accent", "Optional accent", "#233e32"),
    ],
    orderings: [
      {
        title: "Menu order",
        name: "menuOrder",
        by: [{ field: "displayOrder", direction: "asc" }],
      },
    ],
  }),
  defineType({
    name: "menuItem",
    title: "Menu items",
    type: "document",
    fields: [
      defineField({
        name: "name",
        type: "string",
        validation: (r) => r.required().max(45),
      }),
      defineField({
        name: "description",
        type: "text",
        rows: 3,
        validation: (r) => r.max(110),
      }),
      defineField({
        name: "price",
        type: "number",
        validation: (r) => r.required().min(0).max(99999),
      }),
      defineField({
        name: "currency",
        type: "string",
        initialValue: "INR",
        options: { list: ["INR", "USD", "EUR", "GBP", "AED", "AUD"] },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "category",
        type: "reference",
        to: [{ type: "menuCategory" }],
        validation: (r) => r.required(),
      }),
      image("image", "Dish photograph"),
      defineField({
        name: "imageAlt",
        title: "Image description",
        type: "string",
        validation: (r) => r.max(140),
      }),
      defineField({
        name: "ingredients",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "dietary",
        title: "Dietary information",
        type: "array",
        of: [{ type: "string" }],
        options: {
          list: [
            "Vegetarian",
            "Vegan",
            "Gluten-free",
            "Contains nuts",
            "Contains dairy",
            "Contains eggs",
            "Contains gluten",
          ],
        },
      }),
      defineField({
        name: "available",
        title: "Available today",
        type: "boolean",
        initialValue: true,
        description: "Unavailable items remain visible with a clear status.",
      }),
      defineField({
        name: "hidden",
        title: "Hide from menu",
        type: "boolean",
        initialValue: false,
        description: "Hide seasonal dishes without deleting them.",
      }),
      defineField({
        name: "displayOrder",
        type: "number",
        initialValue: 0,
        validation: (r) => r.integer().min(0),
      }),
    ],
    preview: {
      select: { title: "name", subtitle: "category.title", media: "image" },
    },
    orderings: [
      {
        title: "Menu order",
        name: "menuOrder",
        by: [{ field: "displayOrder", direction: "asc" }],
      },
    ],
  }),
  defineType({
    name: "todaysSpecial",
    title: "Today’s special",
    type: "document",
    fields: [
      defineField({ name: "enabled", type: "boolean", initialValue: true }),
      defineField({
        name: "item",
        title: "Featured dish",
        type: "reference",
        to: [{ type: "menuItem" }],
        options: { filter: "hidden != true" },
      }),
      defineField({
        name: "text",
        title: "Promotional text",
        type: "string",
        validation: (r) => r.max(80),
      }),
      image("artwork", "Promotional photograph"),
    ],
  }),
  defineType({
    name: "menuSettings",
    title: "Design & features",
    type: "document",
    fields: [
      defineField({
        name: "orderingEnabled",
        title: "Ordering enabled (reserved for future release)",
        type: "boolean",
        initialValue: false,
        readOnly: true,
        description:
          "Version one is an informational menu. Ordering UI is deliberately not implemented.",
      }),
      color("accent", "Brand ink / cover colour", "#233e32"),
      color("paper", "Paper colour", "#faf6ec"),
      defineField({
        name: "typography",
        title: "Typography",
        type: "string",
        initialValue: "classic",
        options: {
          list: [
            { title: "Classic editorial", value: "classic" },
            { title: "Modern sans serif", value: "modern" },
          ],
        },
      }),
      image("coverImage", "Cover artwork"),
    ],
  }),
];
