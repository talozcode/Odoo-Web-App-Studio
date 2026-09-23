import Link from "next/link";
import { Smartphone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";
import { ExamplePreview } from "@/components/demo-apps/example-preview";
import { OdooCluster } from "./odoo-cluster";
import { ApiLink } from "./api-link";

/**
 * The hero says the whole idea in one picture: Odoo's modules feed one
 * database, and a small app reaches it through the API. The app in the
 * picture is real: a working picking screen reading the demo Odoo (or the
 * bundled snapshot when live is unreachable), with the ORM call underneath.
 *
 * The copy block is kept deliberately tight so the diagram and the working
 * demo are both visible on a 900px-tall screen: the proof is the point.
 */
export function Hero() {
  return (
    <section id="top" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-8">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Odoo doesn&apos;t have to feel like Odoo.
        </h1>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
            We build small, fast web apps connected to the Odoo you already
            run. Your team, customers or suppliers get one screen made for
            their one job. Odoo stays the system of record; no custom code
            goes inside it.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:shrink-0">
            <ButtonLink href={`#${CONTACT_SECTION_ID}`}>
              Tell us what you want to simplify
            </ButtonLink>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
            >
              How it works
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-sm flex-col px-4 py-8 sm:px-6 sm:py-10 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-start lg:px-8 lg:py-12">
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <OdooCluster animated />
          </div>

          <ApiLink animated label="API" className="hidden lg:block" />

          {/* Stacked, the pill sits directly on top of the card it labels;
              side by side, it sits on the end of the API link. */}
          <p className="z-10 mt-6 inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] border-[1.75px] border-[var(--odoo-teal)] bg-[var(--background)] px-3.5 py-2 text-[13px] font-semibold text-[var(--foreground)] lg:mt-0 lg:mr-10">
            <Smartphone aria-hidden="true" className="h-4 w-4 text-[var(--odoo-teal)]" />
            Your app
          </p>

          <div className="mt-3 flex w-full flex-col gap-3 lg:mt-0 lg:w-96 lg:shrink-0">
            <ExamplePreview appId="warehouse-picking" withReadout animateIn />
            <p className="text-xs text-[var(--muted-foreground)]">
              Working demo. Scan a line or tap it to mark it picked.
            </p>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
          Built on 5+ years of hands-on Odoo implementation and automation work.
          Every demo on this page is a working app with the Odoo call behind it
          printed underneath.
        </p>
      </div>
    </section>
  );
}
