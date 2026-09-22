import Link from "next/link";
import { Plug, Wallet, Wrench, LayoutGrid, type LucideIcon } from "lucide-react";
import { GUIDES, type GuideTopic } from "@/config/guides";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURED_SLUGS = [
  "odoo-api-examples-python-javascript",
  "how-much-does-a-custom-odoo-app-cost",
  "odoo-19-json-2-api",
  "odoo-api-key-setup",
  "odoo-barcode-app-buy-or-build",
  "odoo-customization-vs-custom-apps",
];

const FEATURED = FEATURED_SLUGS.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(
  (guide): guide is NonNullable<typeof guide> => Boolean(guide)
);

const TOPIC_ICON: Record<GuideTopic, LucideIcon> = {
  api: Plug,
  cost: Wallet,
  build: Wrench,
  apps: LayoutGrid,
  adoption: Wrench,
};

const TOPIC_TONE: Record<GuideTopic, "teal" | "purple"> = {
  api: "purple",
  cost: "teal",
  build: "purple",
  apps: "teal",
  adoption: "purple",
};

/**
 * Six guides as cards with a topic icon chip, matching the /guides index so
 * the two never look like different sites.
 */
export function GuidesSection() {
  return (
    <section id="guides" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="The questions people ask before they write to us"
            description="Written the way we would explain it in a scoping call."
          />
          <Link
            href="/guides"
            className="text-sm font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
          >
            All {GUIDES.length} guides
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((guide) => {
            const Icon = TOPIC_ICON[guide.topic];
            const toneVar = TOPIC_TONE[guide.topic] === "teal" ? "var(--odoo-teal)" : "var(--odoo-purple)";
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--border)] p-5 transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
              >
                <span
                  aria-hidden="true"
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklab, ${toneVar} 12%, transparent)` }}
                >
                  <Icon className="h-4 w-4" style={{ color: toneVar }} />
                </span>
                <h3 className="text-base font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--odoo-teal)]">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {guide.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
