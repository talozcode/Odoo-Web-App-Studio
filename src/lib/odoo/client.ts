import "server-only";
import type { RpcTrace } from "./types";

/**
 * Minimal Odoo JSON-RPC client. Plain fetch against /jsonrpc, no library,
 * because the whole surface we need is authenticate + execute_kw.
 *
 * Every call is bounded by a short timeout so a slow or stopped demo
 * instance degrades the site to the bundled snapshot instead of hanging a
 * page render.
 */

export type OdooConfig = {
  url: string;
  db: string;
  login: string;
  apiKey: string;
};

export class OdooRpcError extends Error {
  constructor(
    message: string,
    readonly model?: string,
    readonly method?: string
  ) {
    super(message);
    this.name = "OdooRpcError";
  }
}

const RPC_TIMEOUT_MS = 2000;

export function getOdooConfig(): OdooConfig | null {
  const url = process.env.ODOO_DEMO_URL?.replace(/\/+$/, "");
  const db = process.env.ODOO_DEMO_DB;
  const login = process.env.ODOO_DEMO_LOGIN;
  const apiKey = process.env.ODOO_DEMO_API_KEY;
  if (!url || !db || !login || !apiKey) return null;
  return { url, db, login, apiKey };
}

type JsonRpcResponse<T> =
  | { jsonrpc: "2.0"; id: number; result: T }
  | {
      jsonrpc: "2.0";
      id: number;
      error: { message: string; data?: { message?: string; name?: string } };
    };

async function jsonRpc<T>(
  config: OdooConfig,
  service: "common" | "object",
  method: string,
  args: unknown[]
): Promise<T> {
  const response = await fetch(`${config.url}/jsonrpc`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "call",
      params: { service, method, args },
    }),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    // No cache option on purpose: an explicit no-store would force the whole
    // route dynamic and defeat the page-level revalidate. Fetch is not data
    // cached by default, so the call simply re-runs on each regeneration.
  });

  if (!response.ok) {
    throw new OdooRpcError(`HTTP ${response.status} from ${config.url}/jsonrpc`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;
  if ("error" in payload) {
    const detail = payload.error.data?.message ?? payload.error.message;
    throw new OdooRpcError(detail);
  }
  return payload.result;
}

// The uid is stable for the life of the API key, so cache it per process.
// The in-flight promise is cached too, so six parallel calls on a cold start
// share one authenticate round trip.
let cachedUid: { key: string; uid: number } | null = null;
let inflightAuth: { key: string; promise: Promise<number> } | null = null;

function configKey(config: OdooConfig) {
  return `${config.url}|${config.db}|${config.login}`;
}

export async function authenticate(config: OdooConfig): Promise<number> {
  const key = configKey(config);
  if (cachedUid?.key === key) return cachedUid.uid;
  if (inflightAuth?.key === key) return inflightAuth.promise;

  const promise = (async () => {
    const uid = await jsonRpc<number | false>(config, "common", "authenticate", [
      config.db,
      config.login,
      config.apiKey,
      {},
    ]);
    if (!uid) {
      throw new OdooRpcError("Authentication failed for the demo API user");
    }
    cachedUid = { key, uid };
    return uid;
  })();
  inflightAuth = { key, promise };
  try {
    return await promise;
  } finally {
    inflightAuth = null;
  }
}

function forgetUid(config: OdooConfig) {
  if (cachedUid?.key === configKey(config)) cachedUid = null;
}

export type RpcCall<T> = { result: T; trace: RpcTrace };

export async function executeKw<T>(
  config: OdooConfig,
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<RpcCall<T>> {
  const started = performance.now();
  const uid = await authenticate(config);
  let result: T;
  try {
    result = await jsonRpc<T>(config, "object", "execute_kw", [
      config.db,
      uid,
      config.apiKey,
      model,
      method,
      args,
      kwargs,
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // A rotated key or revoked user shows up as an access error; drop the
    // cached uid so the next call re-authenticates instead of failing forever.
    if (/AccessDenied|Access Denied|session|authentication/i.test(message)) {
      forgetUid(config);
    }
    throw new OdooRpcError(message, model, method);
  }
  const ms = Math.round(performance.now() - started);
  const records = Array.isArray(result) ? result.length : 1;
  return {
    result,
    trace: {
      model,
      method,
      summary: `${method} ${model}`,
      ms,
      records,
      at: new Date().toISOString(),
    },
  };
}

export function searchRead<T>(
  config: OdooConfig,
  model: string,
  domain: unknown[],
  fields: string[],
  options: { limit?: number; order?: string } = {}
) {
  return executeKw<T[]>(config, model, "search_read", [domain], {
    fields,
    ...options,
  });
}

export function searchCount(config: OdooConfig, model: string, domain: unknown[]) {
  return executeKw<number>(config, model, "search_count", [domain]);
}

export function readGroup<T>(
  config: OdooConfig,
  model: string,
  domain: unknown[],
  fields: string[],
  groupby: string[],
  options: { limit?: number; orderby?: string; lazy?: boolean } = {}
) {
  return executeKw<T[]>(config, model, "read_group", [domain, fields, groupby], {
    lazy: false,
    ...options,
  });
}

export function create(
  config: OdooConfig,
  model: string,
  values: Record<string, unknown>
) {
  return executeKw<number>(config, model, "create", [values]);
}

export function write(
  config: OdooConfig,
  model: string,
  ids: number[],
  values: Record<string, unknown>
) {
  return executeKw<boolean>(config, model, "write", [ids, values]);
}

export function callButton(config: OdooConfig, model: string, method: string, ids: number[]) {
  return executeKw<unknown>(config, model, method, [ids]);
}

/** Combine several call traces into one readout line. */
export function mergeTraces(primary: RpcTrace, others: RpcTrace[], summary?: string): RpcTrace {
  const all = [primary, ...others];
  return {
    ...primary,
    summary: summary ?? all.map((t) => `${t.method} ${t.model}`).join(", "),
    ms: all.reduce((sum, t) => sum + t.ms, 0),
    at: all[all.length - 1].at,
  };
}
