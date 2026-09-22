import { SectionHeading } from "@/components/ui/section-heading";

// A genuine sequence, so numbering it is honest.
const STEPS = [
  {
    title: "Odoo keeps the data",
    description:
      "Products, customers, orders, stock, accounting. All of it stays in your Odoo, exactly as it is today.",
  },
  {
    title: "The app talks to Odoo through its API",
    description:
      "It reads what it needs and writes decisions back, over the same JSON-RPC interface Odoo's own clients use. Nothing is installed or modified inside Odoo.",
  },
  {
    title: "Your users get one screen for their job",
    description:
      "A picker sees pickings. A rep sees customers and products. A supplier sees their purchase orders. Nobody has to learn Odoo to use it.",
  },
];

const ODOO_OWNS: { label: string; models: string[] }[] = [
  { label: "Accounting", models: ["account.move"] },
  { label: "Inventory", models: ["stock.picking", "stock.quant"] },
  { label: "Sales", models: ["sale.order"] },
  { label: "Purchasing", models: ["purchase.order"] },
  { label: "Manufacturing", models: ["mrp.production"] },
  { label: "Master data", models: ["res.partner", "product.product"] },
];

const WE_BUILD = [
  "Focused interfaces for one team",
  "Mobile workflows for the floor",
  "Portals for customers and suppliers",
  "Dashboards on live numbers",
  "Specialist tools Odoo has no screen for",
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          align="left"
          title="Your Odoo stays exactly where it is."
          description="We don't customise Odoo and we don't replace it. We put a small, separate app next to it."
        />

        <ol className="mt-12 grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="text-3xl font-semibold tabular-nums text-[var(--odoo-teal)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[var(--border)] pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              Odoo stays responsible for
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {ODOO_OWNS.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="text-sm text-[var(--foreground)]">{item.label}</dt>
                  <dd className="font-mono text-xs text-[var(--odoo-purple)]">
                    {item.models.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">We build</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {WE_BUILD.map((item) => (
                <li key={item} className="text-sm text-[var(--foreground)]">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
              Because nothing lives inside your Odoo database, there is no
              custom code to clash with another module or to break the next
              time Odoo upgrades. If Odoo changes an API field, the app is
              adjusted; your Odoo is untouched.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
