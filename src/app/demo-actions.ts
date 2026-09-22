"use server";

import { headers } from "next/headers";
import { callButton, create, getOdooConfig, mergeTraces, searchRead } from "@/lib/odoo/client";
import { getSalesSeed, isDemoWritesEnabled } from "@/lib/odoo/demo-source";
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
const MAX_LINES = 10;

function isValidInput(input: unknown): input is CreateDemoOrderInput {
  if (!input || typeof input !== "object") return false;
  const candidate = input as Record<string, unknown>;
  return (
    Number.isInteger(candidate.partnerId) &&
    Array.isArray(candidate.productIds) &&
    candidate.productIds.length > 0 &&
    candidate.productIds.length <= MAX_LINES &&
    candidate.productIds.every((id) => Number.isInteger(id))
  );
}

/**
 * Create and confirm a sale order in the demo Odoo from the sales app demo.
 * Rate limited before anything touches Odoo; only partners and products the
 * page itself offered are accepted; every order is tagged so it is
 * recognisable in Odoo; the nightly reset clears them all.
 */
export async function createDemoSaleOrder(input: CreateDemoOrderInput): Promise<CreateDemoOrderResult> {
  const config = getOdooConfig();
  if (!config || !isDemoWritesEnabled()) {
    return { ok: false, reason: "offline", message: "The live demo is not connected right now." };
  }
  if (!isValidInput(input)) {
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

  const seed = await getSalesSeed();
  if (seed.source !== "live") {
    return { ok: false, reason: "offline", message: "The live demo is not reachable right now." };
  }

  const uniqueIds = [...new Set(input.productIds)];
  const partner = seed.data.partners.find((p) => p.id === input.partnerId);
  const products = seed.data.products.filter((p) => uniqueIds.includes(p.id));
  if (!partner || products.length === 0 || products.length !== uniqueIds.length) {
    return { ok: false, reason: "invalid", message: "Pick a customer and at least one product." };
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
    // Odoo's error text can name access rules and records; keep it server side.
    console.error("[odoo-demo] createDemoSaleOrder failed:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "failed", message: "Odoo did not accept the order. The order stays local." };
  }
}
