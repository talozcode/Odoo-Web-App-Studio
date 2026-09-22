import { FAQ_ITEMS } from "@/config/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16 lg:px-8">
        <SectionHeading
          align="left"
          title="Questions, answered straight."
          description="The ones that come up in nearly every first conversation."
        />
        <div className="max-w-2xl">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
