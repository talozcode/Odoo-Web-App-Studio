import type { ExampleAppId } from "@/config/examples";
import { getKpis, getPickings, getSalesSeed, isDemoWritesEnabled } from "@/lib/odoo/demo-source";
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
 * Server component: fetches only the dataset a demo needs (live Odoo, or the
 * bundled snapshot when live is unavailable) and renders the matching demo.
 * Keeping the switch here means pages never touch the data layer directly.
 */
export async function ExamplePreview({ appId, withReadout = false, animateIn }: ExamplePreviewProps) {
  switch (appId) {
    case "warehouse-picking": {
      const pickings = await getPickings();
      const picking = pickings.data[0];
      if (!picking) return null;
      return (
        <WarehousePickingDemo
          key={picking.id}
          picking={picking}
          animateIn={animateIn}
          readout={withReadout ? pickings : undefined}
        />
      );
    }
    case "sales-app": {
      const seed = await getSalesSeed();
      return (
        <SalesAppDemo
          key={seed.fetchedAt}
          seed={seed.data}
          writesEnabled={isDemoWritesEnabled() && seed.source === "live"}
          readout={withReadout ? seed : undefined}
        />
      );
    }
    case "management-dashboard": {
      const kpis = await getKpis();
      return (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <DashboardDemo kpis={kpis.data} />
          {withReadout ? <RpcReadout result={kpis} /> : null}
        </div>
      );
    }
    case "customer-ordering-portal": {
      const seed = await getSalesSeed();
      return <CustomerPortalPreview seed={seed.data} />;
    }
    case "supplier-portal":
      return <SupplierPortalPreview />;
    case "custom-workflow":
      return <CustomWorkflowPreview />;
    default:
      return null;
  }
}
