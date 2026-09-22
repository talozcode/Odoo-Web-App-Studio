import Link from "next/link";
import { EXAMPLE_APPS } from "@/config/examples";
import { findUseCasePageByExampleId } from "@/config/use-case-pages";
import { ExamplePreview } from "@/components/demo-apps/example-preview";
import { SectionHeading } from "@/components/ui/section-heading";

const DEMO_IDS = ["sales-app", "management-dashboard"] as const;

/**
 * Two more working apps over the same Odoo: one that builds an order (and
 * writes it when live writes are on) and one that only reads. Each prints
 * the ORM calls behind it.
 */
export function LiveDemosSection() {
  return (
    <section id="demos" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          align="left"
          title="Two more apps on the same Odoo"
          description="Every screen here is a small app talking to one Odoo 18 database through its API. The line under each one is the actual call."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {DEMO_IDS.map((id) => {
            const app = EXAMPLE_APPS.find((a) => a.id === id);
            const page = findUseCasePageByExampleId(id);
            if (!app) return null;
            return (
              <article key={id} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {page ? (
                      <Link
                        href={`/${page.slug}`}
                        className="underline decoration-[var(--odoo-gray)]/60 underline-offset-4 hover:text-[var(--odoo-teal)] hover:decoration-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
                      >
                        {app.name}
                      </Link>
                    ) : (
                      app.name
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{app.description}</p>
                  <p className="mt-2 font-mono text-xs text-[var(--odoo-purple)]">
                    {app.models.join(", ")}
                  </p>
                </div>
                <ExamplePreview appId={id} withReadout />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
