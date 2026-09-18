import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";

export function FinalCta() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          There&apos;s probably one part of Odoo your team wishes were
          simpler.
        </h2>
        <p className="mt-4 text-lg text-white/70">Let&apos;s turn it into an app.</p>
        <div className="mt-8">
          <ButtonLink href={`#${CONTACT_SECTION_ID}`}>
            Tell us what you want to simplify
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
