
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Aurelle",
  description:
    "This page seems to have slipped out of our menu. Return to Aurelle and explore something delicious.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      className="error-page"
      aria-labelledby="not-found-title"
    >
      <p className="eyebrow">A LOOSE LEAF · 404</p>

      <h1 id="not-found-title">
        This page
        <br />
        slipped out.
      </h1>

      <p>
        Looks like this page wandered off the menu.
        Don&apos;t worry, there&apos;s still plenty to discover.
      </p>

      <div className="error-actions">
        <Link className="pill" href="/">
          Back to the menu ↗
        </Link>
      </div>

      <p className="error-footnote">
        GOOD FOOD. GOOD MOMENTS.
      </p>
    </main>
  );
}
