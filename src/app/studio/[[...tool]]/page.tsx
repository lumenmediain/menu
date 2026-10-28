
import Link from "next/link";
import Studio from "@/components/Studio";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aurelle | Menu Studio",
  description: "Manage your café menu, categories, and dishes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  const isConfigured = Boolean(projectId && dataset);

  if (!isConfigured) {
    return (
      <main className="error-page">
        <p className="eyebrow">MENU STUDIO</p>

        <h1>Your café, your menu.</h1>

        <p>
          Your menu management studio is not connected yet.
          Add your Sanity project ID and dataset to{" "}
          <code>.env.local</code>, then restart the development
          server.
        </p>

        <p>
          Refer to <code>README.md</code> for setup instructions,
          publishing configuration, and access controls.
        </p>

        <Link className="pill" href="/">
          Back to the demo menu ↗
        </Link>
      </main>
    );
  }

  return <Studio />;
}
