/**
 * Central config for the six example app cards shown in the "One job. One
 * simple app." section. Prices live here (not scattered across components)
 * so they are trivial to change later.
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
  flow: string;
  description: string;
  priceFrom: number;
  /** Which demo-app component renders the preview for this card. */
  demo: "picking" | "sales" | "dashboard" | "static";
};

export const EXAMPLE_APPS: ExampleApp[] = [
  {
    id: "warehouse-picking",
    name: "Warehouse Picking",
    flow: "Orders → Scan → Done",
    description:
      "Mobile-first picking interface connected to Odoo Inventory.",
    priceFrom: 590,
    demo: "picking",
  },
  {
    id: "sales-app",
    name: "Sales App",
    flow: "Customer → Products → Submit",
    description: "Simple mobile order interface for sales reps.",
    priceFrom: 690,
    demo: "sales",
  },
  {
    id: "management-dashboard",
    name: "Management Dashboard",
    flow: "The numbers that actually matter.",
    description:
      "Live sales, margin, inventory and purchasing data from Odoo.",
    priceFrom: 490,
    demo: "dashboard",
  },
  {
    id: "customer-ordering-portal",
    name: "Customer Ordering Portal",
    flow: "Your customers order. Odoo receives it.",
    description: "Branded ordering experience connected directly to Odoo Sales.",
    priceFrom: 890,
    demo: "static",
  },
  {
    id: "supplier-portal",
    name: "Supplier Portal",
    flow: "PO → Confirm → Done",
    description:
      "Let suppliers interact with purchase orders without navigating Odoo.",
    priceFrom: 790,
    demo: "static",
  },
  {
    id: "custom-workflow",
    name: "Custom Workflow",
    flow: "Your process. Simplified.",
    description: "Tell us the Odoo workflow you wish were easier.",
    priceFrom: 390,
    demo: "static",
  },
];

export function formatPriceFrom(amount: number): string {
  return `From $${amount.toLocaleString("en-US")}`;
}
