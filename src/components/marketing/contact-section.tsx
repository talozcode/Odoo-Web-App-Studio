import { MessageSquareText } from "lucide-react";
import { CONTACT_SECTION_ID } from "@/config/site";
import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section
      id={CONTACT_SECTION_ID}
      className="border-b border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--odoo-teal)]/10">
            <MessageSquareText aria-hidden="true" className="h-6 w-6 text-[var(--odoo-teal)]" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            What&apos;s annoying you about Odoo?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)]">
            Tell us the workflow. We&apos;ll tell you whether it should
            become a simple app.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
