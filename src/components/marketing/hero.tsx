import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";
import { ExamplePreview } from "@/components/demo-apps/example-preview";

/**
 * The hero leads with the product itself: a working picking app reading a
 * real Odoo (or the bundled snapshot of Odoo's demo dataset when the live
 * instance is unreachable), with the ORM call that produced it printed
 * underneath. The copy sits to the left; the proof sits on the right, on
 * the page's first of two surface blocks.
 */
export function Hero() {
  return (
    <section id="top" className="overflow-hidden border-b border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
        <div className="px-4 py-16 sm:px-6 sm:py-20 lg:py-28 lg:pr-16 lg:pl-8">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Odoo doesn&apos;t have to feel like Odoo.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--muted-foreground)]">
            We build small, fast web apps connected to the Odoo you already
            run. Your warehouse team, sales reps, customers or suppliers get
            one screen made for their one job. Odoo stays the system of
            record and nothing is installed inside it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
          <p className="mt-10 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
            Built on 5+ years of hands-on Odoo implementation and automation
            work. The demos on this page are working apps built the way we
            build for clients: against Odoo&apos;s API, with the call that
            produced each screen printed underneath.
          </p>
        </div>

        <div className="relative border-t border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6 lg:border-l lg:border-t-0 lg:px-14 lg:py-28">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-full hidden w-[50vw] bg-[var(--surface)] lg:block"
          />
          <div className="relative mx-auto flex max-w-sm flex-col gap-4">
            <ExamplePreview appId="warehouse-picking" withReadout animateIn />
            <p className="text-xs text-[var(--muted-foreground)]">
              Working demo. Scan a line or tap it to mark it picked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
