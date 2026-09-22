import { Database, ShieldCheck, Smartphone, ArrowLeftRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  {
    icon: Database,
    title: "Odoo",
    description:
      "Your existing products, customers, orders, inventory, accounting and business data remain in Odoo.",
    tone: "text-[var(--odoo-purple)]",
    fill: "bg-[var(--odoo-purple)]/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure API",
    description:
      "Your app is built to do exactly what your team needs, talking to Odoo through its API without installing anything or changing a line of Odoo's own code.",
    tone: "text-[var(--odoo-teal)]",
    fill: "bg-[var(--odoo-teal)]/10",
  },
  {
    icon: Smartphone,
    title: "Your app",
    description: "Your users get an interface designed specifically for their job.",
    tone: "text-[var(--foreground)]",
    fill: "bg-[var(--foreground)]/[0.06]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border)] bg-[var(--odoo-teal)]/[0.04]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="Your Odoo stays exactly where it is." />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] ${step.fill}`}>
                <step.icon aria-hidden="true" className={`h-6 w-6 ${step.tone}`} />
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--muted-foreground)]">
                Step {index + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-xs items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)]">
          <ArrowLeftRight aria-hidden="true" className="h-3.5 w-3.5 text-[var(--odoo-teal)]" />
          Data flows both ways: your app can read from and write back to Odoo
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-base font-medium leading-relaxed text-[var(--foreground)]">
          Odoo remains your system of record. We&apos;re simply giving people
          a better way to interact with the parts they need.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--muted-foreground)]">
          Because nothing is installed or modified inside Odoo itself,
          there&apos;s no custom code sitting in your database to clash with
          another module or break the next time Odoo upgrades.
        </p>
      </div>
    </section>
  );
}
