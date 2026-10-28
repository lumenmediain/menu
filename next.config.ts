
import type { NextConfig } from "next";

/**
 * AURELLE — NEXT.JS CONFIGURATION
 *
 * Supports:
 * - Sanity CMS image hosting
 * - Local food photography
 * - Transparent pizza artwork
 * - Optimized image delivery
 * - Modern image formats
 * - Production deployments
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Sanity CMS image hosting
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],

    // Modern browser image formats
    formats: ["image/avif", "image/webp"],

    // Responsive image sizes
    deviceSizes: [
      360, 390, 414, 640, 750,
      828, 1080, 1200, 1920,
    ],

    imageSizes: [
      32, 48, 64, 96, 128, 256, 384,
    ],
  },

  // Remove the X-Powered-By response header
  poweredByHeader: false,
};

export default nextConfig;
