/**
 * Shapes shared by the live Odoo data source, the bundled snapshot and the
 * demo components. Demos only ever see these types, never raw Odoo records,
 * so swapping live for snapshot (or the other way round) is invisible to them.
 */

export type DemoSource = "live" | "snapshot";

/** One line of the mono readout under a demo: what was called and how fast. */
export type RpcTrace = {
  /** Primary model the call was about, e.g. "stock.picking". */
  model: string;
  /** Odoo ORM method, e.g. "search_read". */
  method: string;
  /** Short human summary when several calls were combined. */
  summary: string;
  /** Wall-clock milliseconds for the whole round trip (all calls). */
  ms: number;
  /** Records returned by the primary call. */
  records: number;
  /** ISO timestamp of when the call completed. */
  at: string;
};

export type DemoPickingLine = {
  id: number;
  product: string;
  quantity: number;
};

export type DemoPicking = {
  id: number;
  name: string;
  partner: string;
  lines: DemoPickingLine[];
};

export type DemoPartner = { id: number; name: string };

export type DemoProduct = { id: number; name: string; price: number };

export type DemoSalesSeed = {
  partners: DemoPartner[];
  products: DemoProduct[];
  currency: string;
};

export type DemoKpis = {
  currency: string;
  /** Sum of confirmed sale orders over the seven most recent order days. */
  salesRecent: number;
  /** Margin over the same orders, as a percentage of untaxed sales. */
  marginPct: number;
  /** Units on hand across internal locations. */
  onHandUnits: number;
  /** Confirmed purchase orders not yet fully received. */
  openPurchaseOrders: number;
  /** Daily sales for the same seven days, oldest first. */
  salesByDay: number[];
};

export type DemoResult<T> = {
  data: T;
  source: DemoSource;
  trace: RpcTrace;
  fetchedAt: string;
};

export type DemoData = {
  pickings: DemoResult<DemoPicking[]>;
  salesSeed: DemoResult<DemoSalesSeed>;
  kpis: DemoResult<DemoKpis>;
};

export type DemoSnapshot = {
  generatedAt: string;
  generatedBy: string;
  pickings: DemoPicking[];
  salesSeed: DemoSalesSeed;
  kpis: DemoKpis;
};
