
"use client";

import { NextStudio } from "next-sanity/studio";
import { Suspense } from "react";
import config from "../../sanity.config";

/**
 * AURELLE — MENU MANAGEMENT STUDIO
 *
 * Sanity CMS manages:
 * - Café information
 * - Menu categories
 * - Food and drink items
 * - Prices and availability
 * - Food photography
 * - Today's specials
 *
 * Authentication and permissions are
 * configured through Sanity.
 */

export default function Studio() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <NextStudio config={config} />
    </Suspense>
  );
}

function StudioLoading() {
  return (
    <main
      className="studio-loading"
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        padding: "24px",
        background: "#11100f",
        color: "#fff5e8",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "3px",
          color: "#f3b65a",
        }}
      >
        AURELLE STUDIO
      </span>

      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(28px, 6vw, 44px)",
          fontWeight: 400,
          margin: 0,
        }}
      >
        Preparing your menu studio.
      </h1>

      <p
        style={{
          color: "#c9bdb0",
          fontSize: "14px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Your café management workspace is loading.
      </p>
    </main>
  );
}
