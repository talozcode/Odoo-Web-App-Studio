import { FAQ_ITEMS } from "@/config/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="Questions, answered straight." />
        <div className="mt-10">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
