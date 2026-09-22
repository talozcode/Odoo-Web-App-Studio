"use server";

import { headers } from "next/headers";
import { callButton, create, getOdooConfig, mergeTraces, OdooRpcError, searchRead } from "@/lib/odoo/client";
import { getDemoData } from "@/lib/odoo/demo-source";
import { allowDemoWrite } from "@/lib/odoo/rate-limit";
import type { RpcTrace } from "@/lib/odoo/types";

export type CreateDemoOrderInput = {
  partnerId: number;
  productIds: number[];
};

export type CreateDemoOrderResult =
  | { ok: true; name: string; id: number; trace: RpcTrace }
  | { ok: false; reason: "offline" | "rate-limited" | "invalid" | "failed"; message: string };

const DEMO_REF = "odoowebapps-demo";

function writesEnabled(): boolean {
  return process.env.DEMO_WRITES_ENABLED === "1" && getOdooConfig() !== null;
}

/**
 * Create and confirm a sale order in the demo Odoo from the sales app demo.
 * Only partners and products the page itself offered are accepted, every
 * order is tagged so it is recognisable in Odoo, and the nightly reset
 * clears them all.
 */
export async function createDemoSaleOrder(input: CreateDemoOrderInput): Promise<CreateDemoOrderResult> {
  const config = getOdooConfig();
  if (!config || !writesEnabled()) {
    return { ok: false, reason: "offline", message: "The live demo is not connected right now." };
  }

  const data = await getDemoData();
  if (data.salesSeed.source !== "live") {
    return { ok: false, reason: "offline", message: "The live demo is not reachable right now." };
  }

  const partner = data.salesSeed.data.partners.find((p) => p.id === input.partnerId);
  const products = data.salesSeed.data.products.filter((p) => input.productIds.includes(p.id));
  if (!partner || products.length === 0 || products.length !== new Set(input.productIds).size) {
    return { ok: false, reason: "invalid", message: "Pick a customer and at least one product." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowDemoWrite(ip)) {
    return {
      ok: false,
      reason: "rate-limited",
      message: "That is enough demo orders for a few minutes. Try again later.",
    };
  }

  try {
    const created = await create(config, "sale.order", {
      partner_id: partner.id,
      client_order_ref: DEMO_REF,
      origin: "odoowebapps.com",
      order_line: products.map((p) => [0, 0, { product_id: p.id, product_uom_qty: 1 }]),
    });
    const confirmed = await callButton(config, "sale.order", "action_confirm", [created.result]);
    const named = await searchRead<{ id: number; name: string }>(
      config,
      "sale.order",
      [["id", "=", created.result]],
      ["name"],
      { limit: 1 }
    );
    const name = named.result[0]?.name ?? `#${created.result}`;
    const trace = mergeTraces(created.trace, [confirmed.trace, named.trace], `create sale.order ${name}, action_confirm`);
    return { ok: true, name, id: created.result, trace };
  } catch (error) {
    const message = error instanceof OdooRpcError ? error.message : "Odoo did not accept the order.";
    return { ok: false, reason: "failed", message };
  }
}
