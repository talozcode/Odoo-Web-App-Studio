import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";
import { BRAND_TAGLINE } from "@/config/brand";
import { OdooCluster } from "./odoo-cluster";
import { ApiConnector } from "./api-connector";
import { TodaysPicksCard } from "@/components/demo-apps/todays-picks-card";

export function Hero() {
  return (
    <section id="top" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            {BRAND_TAGLINE}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Odoo doesn&apos;t have to feel like Odoo.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)]">
            We build fast, beautiful web apps connected to your existing
            Odoo. Give your team, customers and suppliers exactly what they
            need — and nothing they don&apos;t.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={`#${CONTACT_SECTION_ID}`}>
              Tell us what you want to simplify
            </ButtonLink>
            <ButtonLink href="#examples" variant="secondary">
              See examples
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <div className="flex justify-center">
            <OdooCluster />
          </div>

          <ApiConnector
            orientation="vertical"
            className="mx-auto hidden h-40 lg:flex"
          />
          <ApiConnector className="flex lg:hidden" />

          <div className="flex justify-center">
            <TodaysPicksCard />
          </div>
        </div>
      </div>
    </section>
  );
}
