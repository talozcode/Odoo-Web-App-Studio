import type { Metadata } from "next";
import { Smartphone } from "lucide-react";
import { OdooCluster } from "@/components/marketing/odoo-cluster";
import { ApiLink } from "@/components/marketing/api-link";

/**
 * Source for the social preview card. Not a public page: noindex, excluded
 * from the sitemap and disallowed in robots. Rendered at exactly 1200x630
 * and screenshotted into src/app/opengraph-image.png so the card uses the
 * site's own diagram and type instead of a generated bitmap.
 */
export const metadata: Metadata = {
  title: "Preview card",
  robots: { index: false, follow: false },
};

export default function OgPreviewPage() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-[var(--background)] px-16 py-14"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        OdooWebApps<span className="text-[var(--odoo-teal)]">.com</span>
      </p>

      <div className="mt-8 grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-8">
        <div>
          <h1 className="text-[60px] font-bold leading-[1.02] tracking-tight text-[var(--foreground)]">
            Odoo doesn&apos;t have to feel like Odoo.
          </h1>
          <p className="mt-6 max-w-md text-2xl leading-snug text-[var(--muted-foreground)]">
            Small web apps connected to the Odoo you already run.
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-[370px]">
            <OdooCluster />
          </div>
          <ApiLink label="API" className="-ml-2" />
          <p className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] border-[1.75px] border-[var(--odoo-teal)] bg-[var(--background)] px-4 py-2.5 text-base font-semibold text-[var(--foreground)]">
            <Smartphone aria-hidden="true" className="h-5 w-5 text-[var(--odoo-teal)]" />
            Your app
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2 bg-[var(--odoo-teal)]" />
    </div>
  );
}
