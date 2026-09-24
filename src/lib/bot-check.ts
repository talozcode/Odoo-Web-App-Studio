import "server-only";

/**
 * Spam defence for the contact form, in three layers:
 *
 * 1. A honeypot: a field people never see, which form-filling bots fill.
 * 2. A minimum fill time: nobody writes a real enquiry in under three
 *    seconds, but a script posts instantly.
 * 3. Cloudflare Turnstile, the visible check box, when its keys are set.
 *    Without TURNSTILE_SECRET_KEY it is skipped, so the form keeps working
 *    before the widget exists and the first two layers still apply.
 *
 * Layers 1 and 2 answer bots with a fake success, so they learn nothing
 * about what tripped them. Turnstile failures get a real message, because a
 * person can fail it too.
 */

import { HONEYPOT_FIELD, STARTED_AT_FIELD, TURNSTILE_FIELD } from "./bot-fields";

const MIN_FILL_MS = 3000;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type BotVerdict =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "too-fast" | "no-timestamp"; silent: true }
  | { ok: false; reason: "turnstile"; silent: false };

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    // Cloudflare unreachable: fail closed would lock out every real
    // enquiry during an outage, so let it through and log it. The
    // honeypot and timing checks have already run.
    console.error("[bot-check] turnstile verification unavailable", error);
    return true;
  }
}

export async function checkForBot(formData: FormData, ip: string | null): Promise<BotVerdict> {
  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") {
    return { ok: false, reason: "honeypot", silent: true };
  }

  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return { ok: false, reason: "no-timestamp", silent: true };
  }
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, reason: "too-fast", silent: true };
  }

  const token = String(formData.get(TURNSTILE_FIELD) ?? "");
  if (!(await verifyTurnstile(token, ip))) {
    return { ok: false, reason: "turnstile", silent: false };
  }

  return { ok: true };
}
