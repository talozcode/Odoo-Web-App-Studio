import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  Plug,
  Wallet,
  Wrench,
  LayoutGrid,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { GUIDES, GUIDE_TOPICS, type GuideTopic } from "@/config/guides";
import { SITE_URL } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Odoo Guides: API, Cost, Upgrades & Customization",
  description:
    "Practical, technically accurate guides on Odoo integration, customization, API development, upgrade risk, and the real cost of a custom Odoo app.",
  path: "/guides",
});

const TOPIC_ICON: Record<GuideTopic, LucideIcon> = {
  api: Plug,
  cost: Wallet,
  build: Wrench,
  apps: LayoutGrid,
  adoption: AlertTriangle,
};

// Alternate the two brand colours across topic sections instead of one
// repeated everywhere; purple stays reserved for Odoo-side meaning.
const TOPIC_TONE: Record<GuideTopic, "teal" | "purple"> = {
  api: "purple",
  cost: "teal",
  build: "purple",
  apps: "teal",
  adoption: "purple",
};

export default function GuidesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Odoo guides",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}/guides/${guide.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Guides", url: `${SITE_URL}/guides` }])} />
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Straight answers about building on Odoo
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              No vague marketing copy. These are the same practical
              explanations we&apos;d give in a real scoping conversation, written
              down so you don&apos;t have to ask first.
            </p>
          </div>
        </section>

        {GUIDE_TOPICS.map((topic, topicIndex) => {
          const guides = GUIDES.filter((g) => g.topic === topic.id);
          if (guides.length === 0) return null;
          const Icon = TOPIC_ICON[topic.id];
          const tone = TOPIC_TONE[topic.id];
          const toneVar = tone === "teal" ? "var(--odoo-teal)" : "var(--odoo-purple)";

          return (
            <section
              key={topic.id}
              className={cn(
                "border-b border-[var(--border)]",
                topicIndex % 2 === 1 && "bg-[var(--surface)]"
              )}
            >
              <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in oklab, ${toneVar} 12%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: toneVar }} />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                      {topic.label}
                    </h2>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {topic.blurb}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
                    >
                      <h3 className="text-base font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--odoo-teal)]">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {guide.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <SiteFooter />
    </>
  );
}
