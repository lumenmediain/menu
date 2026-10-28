
import type { Metadata } from "next";
import { getMenu } from "@/lib/sanity";
import MenuBook from "@/components/MenuBook";

/**
 * AURELLE — PREMIUM DIGITAL CAFE MENU
 *
 * Menu content is managed through Sanity CMS.
 * Book animations, page flipping, and interactions
 * remain handled by the MenuBook component.
 */

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Aurelle | Café & Restaurant Menu",

  description:
    "Explore the Aurelle café menu. Freshly brewed coffee, handcrafted pizzas, delicious breakfasts, and irresistible desserts.",

  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const menuData = await getMenu();

  return (
    <div id="main-content">
      <MenuBook data={menuData} />
    </div>
  );
}
