import "server-only";
import { cache } from "react";
import {
  getOdooConfig,
  mergeTraces,
  readGroup,
  searchCount,
  searchRead,
  type OdooConfig,
} from "./client";
import snapshotJson from "./snapshot.json";
import type {
  DemoData,
  DemoKpis,
  DemoPicking,
  DemoResult,
  DemoSalesSeed,
  DemoSnapshot,
  RpcTrace,
} from "./types";

/**
 * Two implementations of the same interface: one talks to the live demo
 * Odoo, one reads the bundled snapshot of the Odoo demo dataset. The site
 * always renders; the readout under each demo says which one it got.
 */
export interface DemoDataSource {
  pickings(): Promise<DemoResult<DemoPicking[]>>;
  salesSeed(): Promise<DemoResult<DemoSalesSeed>>;
  kpis(): Promise<DemoResult<DemoKpis>>;
}

const snapshot = snapshotJson as DemoSnapshot;

function snapshotTrace(model: string, method: string, records: number): RpcTrace {
  return {
    model,
    method,
    summary: `${method} ${model}`,
    ms: 0,
    records,
    at: snapshot.generatedAt,
  };
}

export const snapshotSource: DemoDataSource = {
  async pickings() {
    return {
      data: snapshot.pickings,
      source: "snapshot",
      trace: snapshotTrace("stock.picking", "search_read", snapshot.pickings.length),
      fetchedAt: snapshot.generatedAt,
    };
  },
  async salesSeed() {
    return {
      data: snapshot.salesSeed,
      source: "snapshot",
      trace: snapshotTrace("res.partner", "search_read", snapshot.salesSeed.partners.length),
      fetchedAt: snapshot.generatedAt,
    };
  },
  async kpis() {
    return {
      data: snapshot.kpis,
      source: "snapshot",
      trace: snapshotTrace("sale.order", "read_group", snapshot.kpis.salesByDay.length),
      fetchedAt: snapshot.generatedAt,
    };
  },
};

// Odoo renders product_id as "[FURN_7777] Office Chair"; the demo wants the
// name only.
function stripInternalRef(displayName: string): string {
  return displayName.replace(/^\[[^\]]+\]\s*/, "");
}

type Many2one = [number, string] | false;

export function liveSource(config: OdooConfig): DemoDataSource {
  return {
    async pickings() {
      const pickings = await searchRead<{ id: number; name: string; partner_id: Many2one }>(
        config,
        "stock.picking",
        [
          ["picking_type_code", "=", "outgoing"],
          ["state", "in", ["assigned", "confirmed", "waiting"]],
        ],
        ["name", "partner_id"],
        { limit: 3, order: "name asc" }
      );
      const ids = pickings.result.map((p) => p.id);
      const moves = await searchRead<{
        id: number;
        picking_id: Many2one;
        product_id: Many2one;
        product_uom_qty: number;
      }>(
        config,
        "stock.move",
        [["picking_id", "in", ids]],
        ["picking_id", "product_id", "product_uom_qty"],
        { order: "id asc" }
      );

      const data: DemoPicking[] = pickings.result.map((picking) => ({
        id: picking.id,
        name: picking.name,
        partner: picking.partner_id ? picking.partner_id[1] : "",
        lines: moves.result
          .filter((move) => move.picking_id && move.picking_id[0] === picking.id)
          .map((move) => ({
            id: move.id,
            product: move.product_id ? stripInternalRef(move.product_id[1]) : "",
            quantity: move.product_uom_qty,
          })),
      }));

      const trace = mergeTraces(pickings.trace, [moves.trace]);
      return { data, source: "live", trace, fetchedAt: trace.at };
    },

    async salesSeed() {
      const [partners, products] = await Promise.all([
        searchRead<{ id: number; name: string }>(
          config,
          "res.partner",
          [
            ["customer_rank", ">", 0],
            ["is_company", "=", true],
          ],
          ["name"],
          { limit: 3, order: "name asc" }
        ),
        searchRead<{ id: number; name: string; list_price: number; currency_id: Many2one }>(
          config,
          "product.product",
          [
            ["sale_ok", "=", true],
            ["is_storable", "=", true],
          ],
          ["name", "list_price", "currency_id"],
          { limit: 3, order: "name asc" }
        ),
      ]);

      const data: DemoSalesSeed = {
        partners: partners.result.map((p) => ({ id: p.id, name: p.name })),
        products: products.result.map((p) => ({
          id: p.id,
          name: stripInternalRef(p.name),
          price: p.list_price,
        })),
        currency: products.result[0]?.currency_id
          ? products.result[0].currency_id[1]
          : "USD",
      };
      const trace = mergeTraces(partners.trace, [products.trace]);
      return { data, source: "live", trace, fetchedAt: trace.at };
    },

    async kpis() {
      const [sales, quants, openPos] = await Promise.all([
        readGroup<{
          "date_order:day": string;
          amount_untaxed: number;
          amount_total: number;
          margin: number;
        }>(
          config,
          "sale.order",
          [["state", "=", "sale"]],
          ["amount_untaxed:sum", "amount_total:sum", "margin:sum"],
          ["date_order:day"],
          { orderby: "date_order desc", limit: 7 }
        ),
        readGroup<{ quantity: number }>(
          config,
          "stock.quant",
          [["location_id.usage", "=", "internal"]],
          ["quantity:sum"],
          []
        ),
        searchCount(config, "purchase.order", [
          ["state", "=", "purchase"],
          ["receipt_status", "in", ["pending", "partial"]],
        ]),
      ]);

      const days = [...sales.result].reverse();
      const untaxed = days.reduce((sum, d) => sum + (d.amount_untaxed ?? 0), 0);
      const margin = days.reduce((sum, d) => sum + (d.margin ?? 0), 0);

      const data: DemoKpis = {
        currency: "USD",
        salesRecent: days.reduce((sum, d) => sum + (d.amount_total ?? 0), 0),
        marginPct: untaxed > 0 ? Math.round((margin / untaxed) * 100) : 0,
        onHandUnits: Math.round(quants.result[0]?.quantity ?? 0),
        openPurchaseOrders: openPos.result,
        salesByDay: days.map((d) => d.amount_total ?? 0),
      };
      const trace = mergeTraces(sales.trace, [quants.trace, openPos.trace]);
      return { data, source: "live", trace, fetchedAt: trace.at };
    },
  };
}

export function isLiveConfigured(): boolean {
  return getOdooConfig() !== null;
}

async function withFallback<T>(
  live: (() => Promise<DemoResult<T>>) | null,
  fallback: () => Promise<DemoResult<T>>
): Promise<DemoResult<T>> {
  if (!live) return fallback();
  try {
    return await live();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[odoo-demo] live call failed, using snapshot:", error);
    }
    return fallback();
  }
}

/**
 * Per-request memoised entry point. Every demo on a page shares one fetch
 * per dataset, and any dataset whose live call fails comes from the
 * snapshot on its own without affecting the others.
 */
export const getDemoData = cache(async (): Promise<DemoData> => {
  const config = getOdooConfig();
  const live = config ? liveSource(config) : null;

  const [pickings, salesSeed, kpis] = await Promise.all([
    withFallback(live ? () => live.pickings() : null, () => snapshotSource.pickings()),
    withFallback(live ? () => live.salesSeed() : null, () => snapshotSource.salesSeed()),
    withFallback(live ? () => live.kpis() : null, () => snapshotSource.kpis()),
  ]);

  return { pickings, salesSeed, kpis };
});
