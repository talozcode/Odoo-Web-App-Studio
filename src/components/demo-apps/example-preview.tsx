import { ExampleApp } from "@/config/examples";
import { WarehousePickingDemo } from "./warehouse-picking-demo";
import { SalesAppDemo } from "./sales-app-demo";
import { DashboardDemo } from "./dashboard-demo";
import { CustomerPortalPreview } from "./customer-portal-preview";
import { SupplierPortalPreview } from "./supplier-portal-preview";
import { CustomWorkflowPreview } from "./custom-workflow-preview";

/**
 * Maps an example app's config entry to the demo component that renders its
 * live preview. Keeping this in one place means the examples section stays a
 * simple map over config data instead of a chain of conditionals.
 */
export function ExamplePreview({ app }: { app: ExampleApp }) {
  switch (app.id) {
    case "warehouse-picking":
      return <WarehousePickingDemo />;
    case "sales-app":
      return <SalesAppDemo />;
    case "management-dashboard":
      return <DashboardDemo />;
    case "customer-ordering-portal":
      return <CustomerPortalPreview />;
    case "supplier-portal":
      return <SupplierPortalPreview />;
    case "custom-workflow":
      return <CustomWorkflowPreview />;
    default:
      return null;
  }
}
