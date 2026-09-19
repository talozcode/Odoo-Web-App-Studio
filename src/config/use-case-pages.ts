import type { ExampleAppId } from "./examples";

/**
 * Routing + navigation metadata for the seven dedicated use-case landing
 * pages. The actual page copy lives in each route's page.tsx (it's too
 * specific to be usefully templated as data), but the slug/label/example
 * mapping lives here once so the homepage example cards, the footer, and
 * the sitemap all stay in sync instead of hand-listing seven paths three
 * different times.
 */
export type UseCasePageMeta = {
  slug: string;
  /** Short label used in the footer's compact link list. */
  navLabel: string;
  /** Which EXAMPLE_APPS entry this page expands on, if any. */
  exampleId?: ExampleAppId;
};

export const USE_CASE_PAGES: UseCasePageMeta[] = [
  { slug: "odoo-warehouse-app", navLabel: "Warehouse app", exampleId: "warehouse-picking" },
  { slug: "odoo-sales-app", navLabel: "Sales / mobile ordering app", exampleId: "sales-app" },
  { slug: "odoo-dashboard", navLabel: "Management dashboard", exampleId: "management-dashboard" },
  {
    slug: "odoo-customer-portal",
    navLabel: "Customer portal",
    exampleId: "customer-ordering-portal",
  },
  { slug: "odoo-supplier-portal", navLabel: "Supplier portal", exampleId: "supplier-portal" },
  { slug: "custom-odoo-web-app", navLabel: "Custom Odoo web app", exampleId: "custom-workflow" },
  { slug: "odoo-api-development", navLabel: "Odoo API development" },
];

/**
 * Named without a "use" prefix on purpose: that prefix would make React's
 * hooks lint rules treat this plain lookup as a hook (which cannot be
 * called from inside a .map() callback, as the homepage example cards do).
 */
export function findUseCasePageByExampleId(
  exampleId: ExampleAppId
): UseCasePageMeta | undefined {
  return USE_CASE_PAGES.find((page) => page.exampleId === exampleId);
}
