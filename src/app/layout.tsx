
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./aurelle.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Aurelle | Café & Restaurant Menu",
    template: "%s | Aurelle",
  },

  description:
    "Discover the Aurelle café menu. Artisan coffee, freshly baked pizzas, delicious breakfasts, handcrafted desserts, and moments worth staying for.",

  applicationName: "Aurelle Café",

  keywords: [
    "Aurelle Café",
    "Aurelle Restaurant",
    "Digital Café Menu",
    "Coffee",
    "Pizza",
    "Breakfast",
    "Desserts",
    "Restaurant Menu",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Aurelle Café",
    title: "Aurelle | Café & Restaurant Menu",
    description:
      "Open the menu. Discover something delicious. Stay a little longer.",
    images: [
      {
        url: "/images/coffee-cup.jpg",
        width: 1200,
        height: 630,
        alt: "Aurelle Café — Coffee and dining experience",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aurelle | Café & Restaurant Menu",
    description:
      "Good coffee, generous plates, and slow moments.",
    images: ["/images/coffee-cup.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
