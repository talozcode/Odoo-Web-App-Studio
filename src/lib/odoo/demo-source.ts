import "server-only";
import { cache } from "react";
import {
  getOdooConfig,
  mergeTraces,
  OdooRpcError,
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

// Keeps the hero card a sane height whatever the demo picking contains.
const MAX_PICKING_LINES = 6;

type SalesDay = {
  "date_order:day": string;
  amount_untaxed: number;
  amount_total: number;
  margin?: number;
};

const SALES_DOMAIN = [["state", "=", "sale"]];
const SALES_GROUPBY = ["date_order:day"];
const SALES_OPTIONS = { orderby: "date_order desc", limit: 7 };

/**
 * sale.order.margin only exists with sale_margin installed. Ask for it, and
 * if Odoo rejects the field fall back to the same query without it rather
 * than losing the whole dashboard to the snapshot.
 */
async function readSalesByDay(config: OdooConfig) {
  try {
    return await readGroup<SalesDay>(
      config,
      "sale.order",
      SALES_DOMAIN,
      ["amount_untaxed:sum", "amount_total:sum", "margin:sum"],
      SALES_GROUPBY,
      SALES_OPTIONS
    );
  } catch (error) {
    if (error instanceof OdooRpcError && /margin/i.test(error.message)) {
      return readGroup<SalesDay>(
        config,
        "sale.order",
        SALES_DOMAIN,
        ["amount_untaxed:sum", "amount_total:sum"],
        SALES_GROUPBY,
        SALES_OPTIONS
      );
    }
    throw error;
  }
}

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
          .slice(0, MAX_PICKING_LINES)
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
      const [sales, quants, openPos, company] = await Promise.all([
        readSalesByDay(config),
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
        searchRead<{ currency_id: Many2one }>(config, "res.company", [], ["currency_id"], {
          limit: 1,
          order: "id asc",
        }),
      ]);

      const days = [...sales.result].reverse();
      const untaxed = days.reduce((sum, d) => sum + (d.amount_untaxed ?? 0), 0);
      const hasMargin = days.some((d) => typeof d.margin === "number");
      const margin = days.reduce((sum, d) => sum + (d.margin ?? 0), 0);
      const currency = company.result[0]?.currency_id ? company.result[0].currency_id[1] : "USD";

      const data: DemoKpis = {
        currency,
        salesRecent: days.reduce((sum, d) => sum + (d.amount_total ?? 0), 0),
        marginPct: hasMargin && untaxed > 0 ? Math.round((margin / untaxed) * 100) : null,
        onHandUnits: Math.round(quants.result[0]?.quantity ?? 0),
        openPurchaseOrders: openPos.result,
        salesByDay: days.map((d) => d.amount_total ?? 0),
      };
      const trace = mergeTraces(sales.trace, [quants.trace, openPos.trace, company.trace]);
      return { data, source: "live", trace, fetchedAt: trace.at };
    },
  };
}

export function isLiveConfigured(): boolean {
  return getOdooConfig() !== null;
}

/** Live writes need both a configured instance and an explicit opt-in. */
export function isDemoWritesEnabled(): boolean {
  return process.env.DEMO_WRITES_ENABLED === "1" && isLiveConfigured();
}

/**
 * A live call that succeeds with nothing to show (no open pickings before
 * the nightly reset, say) is treated like a failure: the snapshot always has
 * a complete picture.
 */
function isUsable(data: unknown): boolean {
  if (Array.isArray(data)) return data.length > 0;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if ("partners" in record && "products" in record) {
      return (
        Array.isArray(record.partners) &&
        record.partners.length > 0 &&
        Array.isArray(record.products) &&
        record.products.length > 0
      );
    }
    if ("salesByDay" in record) {
      return Array.isArray(record.salesByDay) && record.salesByDay.length > 0;
    }
  }
  return Boolean(data);
}

async function withFallback<T>(
  name: string,
  live: (() => Promise<DemoResult<T>>) | null,
  fallback: () => Promise<DemoResult<T>>
): Promise<DemoResult<T>> {
  if (!live) return fallback();
  try {
    const result = await live();
    if (isUsable(result.data)) return result;
    console.warn(`[odoo-demo] live ${name} returned nothing usable, using snapshot`);
    return fallback();
  } catch (error) {
    // Logged in every environment: a build that silently fell back to the
    // snapshot is exactly the thing an operator needs to see.
    console.warn(`[odoo-demo] live ${name} failed, using snapshot:`, error instanceof Error ? error.message : error);
    return fallback();
  }
}

function liveOrNull() {
  const config = getOdooConfig();
  return config ? liveSource(config) : null;
}

// One memoised getter per dataset, so a page that only needs pickings never
// triggers the dashboard's calls.
export const getPickings = cache(() => {
  const live = liveOrNull();
  return withFallback("pickings", live ? () => live.pickings() : null, () => snapshotSource.pickings());
});

export const getSalesSeed = cache(() => {
  const live = liveOrNull();
  return withFallback("salesSeed", live ? () => live.salesSeed() : null, () => snapshotSource.salesSeed());
});

export const getKpis = cache(() => {
  const live = liveOrNull();
  return withFallback("kpis", live ? () => live.kpis() : null, () => snapshotSource.kpis());
});

/** All three datasets, for callers that want everything at once. */
export const getDemoData = cache(async (): Promise<DemoData> => {
  const [pickings, salesSeed, kpis] = await Promise.all([getPickings(), getSalesSeed(), getKpis()]);
  return { pickings, salesSeed, kpis };
});
