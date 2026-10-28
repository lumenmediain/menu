
import type {
  Category,
  MenuData,
  MenuItem,
} from "./types";

/* ==========================================================
   AURELLE — PREMIUM CAFÉ DEMO DATA

   Editorial restaurant menu
   Dark chocolate • Warm orange • Cinematic photography

   Compatible with:
   - MenuBook.tsx
   - Sanity CMS fallback
   - Existing pagination
   - Pizza editorial artwork
   ========================================================== */

/* ----------------------------------------------------------
   01 — IMAGE PATH HELPER
   ---------------------------------------------------------- */

const imagePath = (name: string): string => {
  const filename =
    name === "coffee" ? "coffee-cup" : name;

  return `/images/${filename}.jpg`;
};

/* ----------------------------------------------------------
   02 — MENU ITEM FACTORY
   ---------------------------------------------------------- */

const item = (
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  dietary: string[] = ["Vegetarian"],
): MenuItem => ({
  id,
  name,
  description,
  price,
  currency: "INR",
  image: imagePath(image),
  imageAlt: name,
  available: true,
  dietary,
});

/* ==========================================================
   03 — MENU CATEGORIES
   ========================================================== */

const categories: Category[] = [
  /* --------------------------------------------------------
     COFFEE — GOOD DAYS START HERE
     -------------------------------------------------------- */

  {
    id: "coffee",

    title: "Coffee",

    description:
      "Thoughtfully sourced. Patiently brewed. Always a good idea.",

    theme: "coffee",

    image: "/images/coffee-cup.jpg",

    items: [
      item(
        "flat-white",
        "The perfect flat white",
        "Double espresso, silky microfoam, and a little everyday ritual.",
        220,
        "coffee",
      ),

      item(
        "espresso",
        "Espresso",
        "A beautifully bold little cup. Rich, smooth, and unapologetically strong.",
        150,
        "coffee",
        ["Vegan"],
      ),

      item(
        "cappuccino",
        "Classic cappuccino",
        "Rich espresso, velvety steamed milk, and a soft cloud of foam.",
        210,
        "coffee",
      ),

      item(
        "cold-brew",
        "Orange cold brew",
        "Slow-steeped coffee, fresh orange, and a bright citrus finish.",
        260,
        "cold-brew",
        ["Vegan"],
      ),
    ],
  },

  /* --------------------------------------------------------
     BREAKFAST — THE ART OF SLOW MORNINGS
     -------------------------------------------------------- */

  {
    id: "breakfast",

    title: "Breakfast",

    description:
      "Slow mornings, generous plates, and nowhere else to be.",

    theme: "breakfast",

    image: "/images/breakfast.jpg",

    items: [
      item(
        "avocado",
        "Sunny eggs on sourdough",
        "Free-range eggs, smashed avocado, fresh lemon, and toasted sourdough.",
        380,
        "breakfast",
        ["Contains eggs"],
      ),

      item(
        "croissant",
        "Butter, beautifully folded",
        "A golden all-butter croissant, cultured butter, and seasonal preserve.",
        240,
        "croissant",
      ),

      item(
        "eggs",
        "Soft scrambled eggs",
        "Slow-cooked free-range eggs, fresh chives, and toasted sourdough.",
        340,
        "breakfast",
        ["Contains eggs"],
      ),

      item(
        "granola",
        "The garden bowl",
        "House-made granola, thick yoghurt, seasonal fruit, and local honey.",
        310,
        "dessert",
      ),
    ],
  },

  /* --------------------------------------------------------
     PIZZA — FRESH FROM THE OVEN

     The transparent pizza artwork is rendered separately
     by MenuBook and styled by pizza-editorial.css.

     Artwork must exist at:
     public/images/pizza-cutout.webp
     -------------------------------------------------------- */

  {
    id: "pizza",

    title: "Pizza",

    description:
      "Slow-fermented dough. Blistered edges. Made to share.",

    theme: "pizza",

    image: "/images/pizza.jpg",

    artwork: "/images/pizza-cutout.webp",

    items: [
      item(
        "margherita",
        "The garden margherita",
        "San Marzano tomato, creamy mozzarella, fresh basil, and extra virgin olive oil.",
        490,
        "pizza",
      ),

      item(
        "mushroom",
        "Wild mushroom & thyme",
        "Roasted wild mushrooms, mozzarella, fresh thyme, and garlic cream.",
        580,
        "pizza",
      ),

      item(
        "pepper",
        "Charred pepper & pesto",
        "Fire-roasted sweet peppers, basil pesto, feta, and toasted pine nuts.",
        540,
        "pizza",
      ),

      item(
        "burrata",
        "Burrata, please",
        "Creamy burrata, sweet cherry tomatoes, fresh rocket, and balsamic glaze.",
        640,
        "pizza",
      ),
    ],
  },

  /* --------------------------------------------------------
     DESSERTS — SAVE A LITTLE ROOM
     -------------------------------------------------------- */

  {
    id: "dessert",

    title: "Desserts",

    description:
      "For the last bite. Or the very first. We won’t tell.",

    theme: "dessert",

    image: "/images/dessert.jpg",

    items: [
      item(
        "tiramisu",
        "Our little tiramisu",
        "Espresso-soaked sponge, whipped mascarpone, and a dusting of dark cocoa.",
        320,
        "dessert",
        ["Contains eggs"],
      ),

      item(
        "cheesecake",
        "Basque cheesecake",
        "A beautifully burnished top, soft creamy centre, and seasonal berry compote.",
        340,
        "dessert",
        ["Contains eggs"],
      ),

      item(
        "brownie",
        "Dark chocolate brownie",
        "Warm Belgian chocolate, flaky sea salt, and vanilla bean ice cream.",
        290,
        "dessert",
        ["Vegetarian", "Contains eggs"],
      ),

      item(
        "affogato",
        "One last coffee",
        "Vanilla bean ice cream melting beneath a freshly pulled espresso.",
        250,
        "coffee",
      ),
    ],
  },

  /* --------------------------------------------------------
     BEVERAGES — SIP SOMETHING BEAUTIFUL
     -------------------------------------------------------- */

  {
    id: "drinks",

    title: "Beverages",

    description:
      "A little sunshine, served over ice.",

    theme: "drinks",

    image: "/images/cold-brew.jpg",

    items: [
      item(
        "matcha",
        "Iced vanilla latte",
        "Double espresso, chilled milk, a little vanilla, and plenty of ice.",
        280,
        "cold-brew",
      ),

      item(
        "lemonade",
        "Basil & lime lemonade",
        "Freshly squeezed lime, garden basil, and sparkling water.",
        220,
        "cold-brew",
        ["Vegan"],
      ),

      item(
        "tea",
        "A proper pot of tea",
        "A comforting pot of Assam, Earl Grey, or fragrant chamomile.",
        190,
        "coffee",
        ["Vegan"],
      ),

      {
        ...item(
          "seasonal",
          "Seasonal berry fizz",
          "Seasonal berries, sparkling soda, fresh mint, and crushed ice.",
          250,
          "cold-brew",
          ["Vegan"],
        ),

        available: false,
      },
    ],
  },
];

/* ==========================================================
   04 — COMPLETE DEMO MENU
   ========================================================== */

export const demoData: MenuData = {
  demo: true,

  /* --------------------------------------------------------
     CAFÉ IDENTITY
     -------------------------------------------------------- */

  cafe: {
    name: "Aurelle Café",

    tagline: "GOOD COFFEE. SLOW LIVING.",

    story:
      "A small pause in a busy world. We believe in the pleasure of a well-made coffee, food with a little soul, and conversations that last longer than planned.",

    address:
      "12 Garden Lane, Bengaluru (demo address)",

    phone: "",
    whatsapp: "",
    instagram: "",
    maps: "",

    hours: [
      {
        day: "Monday – Friday",
        time: "8:00 am – 10:00 pm",
      },

      {
        day: "Saturday – Sunday",
        time: "9:00 am – 11:00 pm",
      },
    ],
  },

  /* --------------------------------------------------------
     MENU CONTENT
     -------------------------------------------------------- */

  categories,

  /* --------------------------------------------------------
     TODAY'S SPECIAL
     -------------------------------------------------------- */

  special: {
    enabled: true,

    text:
      "A little sunshine on sourdough.",

    item:
      categories.find(
        (category) => category.id === "breakfast",
      )?.items[0],
  },

  /* --------------------------------------------------------
     VISUAL & APPLICATION SETTINGS
     -------------------------------------------------------- */

  settings: {
    orderingEnabled: false,

    accent: "#D6B675",

    paper: "#0B0B0C",

    typography: "classic",
  },
};
