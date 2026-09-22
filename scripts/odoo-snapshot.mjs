#!/usr/bin/env node
/**
 * Regenerate src/lib/odoo/snapshot.json from the live demo Odoo so the
 * fallback the site ships is real data, not hand-authored. Mirrors the
 * queries in src/lib/odoo/demo-source.ts.
 *
 *   ODOO_DEMO_URL=https://demo-odoo.odoowebapps.com ODOO_DEMO_DB=odoo_demo \
 *   ODOO_DEMO_LOGIN=api-demo ODOO_DEMO_API_KEY=... node scripts/odoo-snapshot.mjs
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const url = process.env.ODOO_DEMO_URL?.replace(/\/+$/, "");
const db = process.env.ODOO_DEMO_DB;
const login = process.env.ODOO_DEMO_LOGIN;
const apiKey = process.env.ODOO_DEMO_API_KEY;
if (!url || !db || !login || !apiKey) {
  console.error("Set ODOO_DEMO_URL, ODOO_DEMO_DB, ODOO_DEMO_LOGIN and ODOO_DEMO_API_KEY");
  process.exit(1);
}

async function rpc(service, method, args) {
  const res = await fetch(`${url}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "call", params: { service, method, args } }),
  });
  const payload = await res.json();
  if (payload.error) throw new Error(payload.error.data?.message ?? payload.error.message);
  return payload.result;
}

const uid = await rpc("common", "authenticate", [db, login, apiKey, {}]);
if (!uid) throw new Error("authentication failed");
const call = (model, method, args, kwargs = {}) =>
  rpc("object", "execute_kw", [db, uid, apiKey, model, method, args, kwargs]);
const stripRef = (s) => s.replace(/^\[[^\]]+\]\s*/, "");

const pickings = await call(
  "stock.picking",
  "search_read",
  [[["picking_type_code", "=", "outgoing"], ["state", "in", ["assigned", "confirmed", "waiting"]]]],
  { fields: ["name", "partner_id"], limit: 3, order: "name asc" }
);
const moves = await call("stock.move", "search_read", [[["picking_id", "in", pickings.map((p) => p.id)]]], {
  fields: ["picking_id", "product_id", "product_uom_qty"],
  order: "id asc",
});

const partners = await call("res.partner", "search_read", [[["customer_rank", ">", 0], ["is_company", "=", true]]], {
  fields: ["name"],
  limit: 3,
  order: "name asc",
});
const products = await call("product.product", "search_read", [[["sale_ok", "=", true], ["is_storable", "=", true]]], {
  fields: ["name", "list_price", "currency_id"],
  limit: 3,
  order: "name asc",
});

const sales = await call(
  "sale.order",
  "read_group",
  [[["state", "=", "sale"]], ["amount_untaxed:sum", "amount_total:sum", "margin:sum"], ["date_order:day"]],
  { lazy: false, orderby: "date_order desc", limit: 7 }
);
const quants = await call("stock.quant", "read_group", [[["location_id.usage", "=", "internal"]], ["quantity:sum"], []], {
  lazy: false,
});
const openPos = await call("purchase.order", "search_count", [
  [["state", "=", "purchase"], ["receipt_status", "in", ["pending", "partial"]]],
]);

const days = [...sales].reverse();
const untaxed = days.reduce((s, d) => s + (d.amount_untaxed ?? 0), 0);
const margin = days.reduce((s, d) => s + (d.margin ?? 0), 0);

const snapshot = {
  generatedAt: new Date().toISOString(),
  generatedBy: "scripts/odoo-snapshot.mjs against the live demo instance",
  pickings: pickings.map((p) => ({
    id: p.id,
    name: p.name,
    partner: p.partner_id ? p.partner_id[1] : "",
    lines: moves
      .filter((m) => m.picking_id && m.picking_id[0] === p.id)
      .map((m) => ({ id: m.id, product: m.product_id ? stripRef(m.product_id[1]) : "", quantity: m.product_uom_qty })),
  })),
  salesSeed: {
    currency: products[0]?.currency_id ? products[0].currency_id[1] : "USD",
    partners: partners.map((p) => ({ id: p.id, name: p.name })),
    products: products.map((p) => ({ id: p.id, name: stripRef(p.name), price: p.list_price })),
  },
  kpis: {
    currency: "USD",
    salesRecent: days.reduce((s, d) => s + (d.amount_total ?? 0), 0),
    marginPct: untaxed > 0 ? Math.round((margin / untaxed) * 100) : 0,
    onHandUnits: Math.round(quants[0]?.quantity ?? 0),
    openPurchaseOrders: openPos,
    salesByDay: days.map((d) => d.amount_total ?? 0),
  },
};

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "odoo", "snapshot.json");
await writeFile(out, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`wrote ${out}`);
