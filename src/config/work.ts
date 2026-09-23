/**
 * Real, shipped apps, described without identifying the clients: a group of
 * companies in food production, wholesale, retail and catering, all running
 * Odoo 18. Everything here is in production use.
 *
 * Rules for this file: no company or brand names, no domains, no
 * screenshots that have not been through scripts/sanitize-check.py and
 * owner sign-off. Images are optional; each case reads complete without one.
 */

export type WorkImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type WorkCase = {
  slug: string;
  title: string;
  /** Who uses it, in one line. */
  users: string;
  /** What it replaced, in one line. */
  replaced: string;
  /** Odoo models the app reads or writes. Shown in the mono face. */
  models: string[];
  /** Two or three sentences on what it does. */
  summary: string;
  /** Optional concrete, true figures. */
  facts?: string[];
  images?: WorkImage[];
  /** Short labels for the flow diagram drawn with each case. */
  diagram: { users: string; app: string; kind: "phone" | "screen" | "cron" };
};

export const WORK_CONTEXT =
  "Apps in daily use across a group of companies in food production, wholesale, retail and catering, all running Odoo 18. Each one sits next to their Odoo, connected through the API.";

export const WORK_CASES: WorkCase[] = [
  {
    slug: "barcode-picking",
    title: "Barcode picking for the warehouse floor",
    users: "Pickers on phones, logged in with their Odoo user",
    replaced: "Printed pick lists, hand-written quantities, re-keying into Odoo later",
    models: ["stock.picking", "stock.move.line", "stock.lot"],
    summary:
      "A mobile web app that lists the day's transfers, lets a picker scan each line and writes the picked quantities and lots straight back to the transfer. It checks lot expiry as lines are picked so short-dated stock is caught on the floor, not by the customer.",
    facts: ["Installs to the phone home screen", "Every write is logged for audit"],
    diagram: { users: "Pickers", app: "Picking app", kind: "phone" },
  },
  {
    slug: "wholesale-ordering-portal",
    title: "Wholesale ordering portal for B2B customers",
    users: "Trade customers ordering for their own shops and kitchens",
    replaced: "Orders arriving by phone and chat, typed into Odoo by staff",
    models: ["sale.order", "product.product", "product.pricelist", "res.partner", "account.move"],
    summary:
      "Customers log in, see their own prices and only the products relevant to them, and place an order that lands in Odoo as a confirmed sale order. Stock shown is scoped to the warehouse that actually ships to them. Invoices are emailed by the portal's own scheduler; one of Odoo's mail rules had to be scoped so customers were not emailed twice.",
    facts: ["Live on the client's own domain", "Per-customer product visibility, by design"],
    diagram: { users: "Trade customers", app: "Ordering portal", kind: "screen" },
    images: [
      {
        src: "/work/wholesale-ordering-portal/quick-order.webp",
        width: 1600,
        height: 697,
        alt: "The portal's Quick Order screen: a search box for building an order by product name or SKU",
      },
    ],
  },
  {
    slug: "kitchen-production-board",
    title: "Kitchen production board",
    users: "Cooks and bakers at each site",
    replaced: "Printed manufacturing order lists and a shared terminal",
    models: ["mrp.production", "stock.warehouse.orderpoint", "mrp.bom"],
    summary:
      "A read-only board on a screen in each kitchen showing what to make today, in what order, for which customers. It is driven entirely by Odoo's automatic manufacturing orders and min/max replenishment rules. Getting the board right meant fixing lead times on 184 bills of materials and 113 replenishment rules in Odoo first.",
    diagram: { users: "Kitchen staff", app: "Production board", kind: "screen" },
    images: [
      {
        src: "/work/kitchen-production-board/board.webp",
        width: 1600,
        height: 784,
        alt: "The production board listing open manufacturing orders grouped by overdue, today and upcoming",
      },
    ],
  },
  {
    slug: "container-planning",
    title: "Container and shipment planning",
    users: "The purchasing and logistics team",
    replaced: "One spreadsheet per container",
    models: ["purchase.order", "stock.picking", "product.packaging"],
    summary:
      "Plan a container against open purchase orders, see the cubic metres fill up as products are added, and keep a register of every shipment. Carton dimensions are measured once per packaging group and inherited by every product in it, so the volume maths is right the first time.",
    facts: ["2,855 products, 1,312 measured cartons", "974 automated tests"],
    diagram: { users: "Purchasing", app: "Container planner", kind: "screen" },
    images: [
      {
        src: "/work/container-planning/dashboard.webp",
        width: 1600,
        height: 784,
        alt: "The container planning dashboard listing recent plans with their stream, coverage, box count and status",
      },
    ],
  },
  {
    slug: "catering-orders",
    title: "Catering orders across companies",
    users: "Event staff taking orders at several locations",
    replaced: "Paper forms and a phone call to head office",
    models: ["sale.order", "res.company", "res.partner"],
    summary:
      "One order form that knows which company in the group the order belongs to and creates the sale order there, with the right customer and the right products. Multi-company access is the whole difficulty; the form is the easy part.",
    diagram: { users: "Event staff", app: "Catering orders", kind: "phone" },
    images: [
      {
        src: "/work/catering-orders/customer-select.webp",
        width: 1600,
        height: 784,
        alt: "The catering app's customer step: a list of branches, each with its own lead time",
      },
    ],
  },
  {
    slug: "quality-forms",
    title: "HACCP quality forms tied to production",
    users: "Production staff and the quality lead",
    replaced: "Paper checklists filed in binders",
    models: ["mrp.production"],
    summary:
      "Five critical control point forms filled in on a phone, each one linked to the manufacturing order it belongs to so an inspector can go from a batch to its records in one step. Records live outside Odoo; the link to the MO is what makes them useful.",
    diagram: { users: "Production staff", app: "Quality forms", kind: "phone" },
  },
  {
    slug: "expenses",
    title: "Expense submission from the phone",
    users: "Anyone in the group who spends money on its behalf",
    replaced: "Receipts in envelopes",
    models: ["hr.expense", "hr.employee"],
    summary:
      "Enter the expense, pick the category, submit. It appears in Odoo against the right employee and company, ready for approval in the standard flow. Deliberately tiny.",
    diagram: { users: "Everyone", app: "Expenses", kind: "phone" },
    images: [
      {
        src: "/work/expenses/form.webp",
        width: 1600,
        height: 784,
        alt: "The expense submission form: vendor and company at the top, one expense block below",
      },
    ],
  },
  {
    slug: "delivery-board",
    title: "Delivery board across cities",
    users: "Dispatch and the drivers and couriers they book",
    replaced: "A shared spreadsheet and a lot of phone calls",
    models: ["stock.picking", "res.partner", "sale.order"],
    summary:
      "One board for every outbound delivery, from booked to in transit to delivered, across drivers, couriers and cargo companies serving different cities. Each card is created from an Odoo transfer and status changes post back, with customers notified by message as their delivery moves.",
    facts: ["19 deliveries completed in the last 30 days from this snapshot alone"],
    diagram: { users: "Dispatch", app: "Delivery board", kind: "screen" },
    images: [
      {
        src: "/work/delivery-board/dashboard.webp",
        width: 1600,
        height: 697,
        alt: "The delivery board dashboard: counts by status and a list of upcoming and recently updated deliveries",
      },
    ],
  },
  {
    slug: "digests-and-automations",
    title: "Digests and automations inside Odoo",
    users: "Purchasing, shop managers, the kitchen",
    replaced: "Someone remembering to check",
    models: ["ir.cron", "mail.template", "stock.warehouse.orderpoint", "pos.session", "account.move"],
    summary:
      "Not every improvement needs an app. A daily replenishment digest to purchasing, an end-of-day summary to each shop manager when a session closes, and a nightly list of point-of-sale invoices still unpaid are scheduled actions and mail templates configured inside Odoo. Knowing when not to build is part of the job.",
    diagram: { users: "Managers", app: "Scheduled digests", kind: "cron" },
  },
];

export const HOMEPAGE_WORK_SLUGS = [
  "barcode-picking",
  "wholesale-ordering-portal",
  "kitchen-production-board",
  "container-planning",
];

export function workCaseBySlug(slug: string): WorkCase | undefined {
  return WORK_CASES.find((c) => c.slug === slug);
}
