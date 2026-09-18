import { EXAMPLE_APPS, formatPriceFrom } from "@/config/examples";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExamplePreview } from "@/components/demo-apps/example-preview";

export function ExamplesSection() {
  return (
    <section id="examples" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Example apps"
          title="One job. One simple app."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_APPS.map((app) => (
            <article
              key={app.id}
              className="flex flex-col rounded-xl border border-[var(--border)] p-6"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {app.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--odoo-teal)]">
                {app.flow}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {app.description}
              </p>

              <div className="mt-5 flex justify-center">
                <ExamplePreview app={app} />
              </div>

              <p className="mt-5 text-sm font-semibold text-[var(--foreground)]">
                {formatPriceFrom(app.priceFrom)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
