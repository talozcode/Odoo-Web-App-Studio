import type { ExampleAppId } from "@/config/examples";
import { getDemoData } from "@/lib/odoo/demo-source";
import { WarehousePickingDemo } from "./warehouse-picking-demo";
import { SalesAppDemo } from "./sales-app-demo";
import { DashboardDemo } from "./dashboard-demo";
import { CustomerPortalPreview } from "./customer-portal-preview";
import { SupplierPortalPreview } from "./supplier-portal-preview";
import { CustomWorkflowPreview } from "./custom-workflow-preview";
import { RpcReadout } from "./rpc-readout";

type ExamplePreviewProps = {
  appId: ExampleAppId;
  /** Show the mono call readout under demos that read from Odoo. */
  withReadout?: boolean;
  /** Passed through to the picking demo for the hero's mount stagger. */
  animateIn?: boolean;
};

/**
 * Server component: fetches the demo data (live Odoo, or the bundled
 * snapshot when live is unavailable) and renders the matching demo. Keeping
 * the switch here means pages never touch the data layer directly.
 */
export async function ExamplePreview({ appId, withReadout = false, animateIn }: ExamplePreviewProps) {
  const data = await getDemoData();

  switch (appId) {
    case "warehouse-picking": {
      const picking = data.pickings.data[0];
      if (!picking) return null;
      return (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <WarehousePickingDemo picking={picking} animateIn={animateIn} />
          {withReadout ? <RpcReadout result={data.pickings} /> : null}
        </div>
      );
    }
    case "sales-app":
      return (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <SalesAppDemo seed={data.salesSeed.data} />
          {withReadout ? <RpcReadout result={data.salesSeed} /> : null}
        </div>
      );
    case "management-dashboard":
      return (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <DashboardDemo kpis={data.kpis.data} />
          {withReadout ? <RpcReadout result={data.kpis} /> : null}
        </div>
      );
    case "customer-ordering-portal":
      return <CustomerPortalPreview seed={data.salesSeed.data} />;
    case "supplier-portal":
      return <SupplierPortalPreview />;
    case "custom-workflow":
      return <CustomWorkflowPreview />;
    default:
      return null;
  }
}
