/**
 * Central config for the six example apps. Prices live here (not scattered
 * across components) so they are trivial to change later.
 */

export type ExampleAppId =
  | "warehouse-picking"
  | "sales-app"
  | "management-dashboard"
  | "customer-ordering-portal"
  | "supplier-portal"
  | "custom-workflow";

export type ExampleApp = {
  id: ExampleAppId;
  name: string;
  description: string;
  /** Odoo models the app reads from or writes to. Shown in the mono face. */
  models: string[];
  priceFrom: number;
  /** Whether the preview reads real data (live or snapshot) or is a static mock. */
  demo: "live" | "static";
};

export const EXAMPLE_APPS: ExampleApp[] = [
  {
    id: "warehouse-picking",
    name: "Warehouse Picking",
    description:
      "Mobile-first picking interface connected to Odoo Inventory.",
    models: ["stock.picking", "stock.move.line"],
    priceFrom: 590,
    demo: "live",
  },
  {
    id: "sales-app",
    name: "Sales App",
    description: "Simple mobile order interface for sales reps.",
    models: ["res.partner", "product.product", "sale.order"],
    priceFrom: 690,
    demo: "live",
  },
  {
    id: "management-dashboard",
    name: "Management Dashboard",
    description:
      "Live sales, margin, inventory and purchasing data from Odoo.",
    models: ["sale.order", "stock.quant", "purchase.order"],
    priceFrom: 490,
    demo: "live",
  },
  {
    id: "customer-ordering-portal",
    name: "Customer Ordering Portal",
    description: "Branded ordering experience connected directly to Odoo Sales.",
    models: ["product.product", "sale.order", "res.partner"],
    priceFrom: 890,
    demo: "static",
  },
  {
    id: "supplier-portal",
    name: "Supplier Portal",
    description:
      "Let suppliers interact with purchase orders without navigating Odoo.",
    models: ["purchase.order", "stock.picking"],
    priceFrom: 790,
    demo: "static",
  },
  {
    id: "custom-workflow",
    name: "Custom Workflow",
    description: "Tell us the Odoo workflow you wish were easier.",
    models: ["hr.expense"],
    priceFrom: 390,
    demo: "static",
  },
];

export function formatPriceFrom(amount: number): string {
  return `From $${amount.toLocaleString("en-US")}`;
}
