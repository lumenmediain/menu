
"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Menu experience error:", error);
    }
  }, [error]);

  return (
    <main
      className="error-page"
      role="alert"
      aria-labelledby="error-title"
    >
      <p className="eyebrow">A LITTLE PAUSE</p>

      <h1 id="error-title">
        Something interrupted your experience.
      </h1>

      <p>
        Our menu is taking a little moment.
        Please try again, or ask our café team
        for a printed menu.
      </p>

      <div className="error-actions">
        <button
          type="button"
          className="pill"
          onClick={() => reset()}
        >
          Try again ↻
        </button>

        <Link href="/" className="pill">
          Back to menu
        </Link>
      </div>

      <p className="error-footnote">
        GOOD FOOD. GOOD MOMENTS.
      </p>
    </main>
  );
}
