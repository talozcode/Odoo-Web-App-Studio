import { CONTACT_SECTION_ID } from "@/config/site";
import { ContactForm } from "./contact-form";

/**
 * The page's closing section and its second surface block. The form is the
 * call to action; no separate "final CTA" banner repeats it.
 */
export function ContactSection() {
  return (
    <section id={CONTACT_SECTION_ID} className="bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            There&apos;s probably one part of Odoo your team wishes were
            simpler.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)]">
            Describe the workflow as it happens today. We&apos;ll tell you
            honestly whether it should become a small app, roughly what it
            would cost, and what we would need from your Odoo to build it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            You will hear back from the person who would build it, not a
            sales desk.
          </p>
        </div>

        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
