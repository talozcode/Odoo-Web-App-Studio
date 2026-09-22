import "server-only";

/**
 * Soft, in-memory rate limit for demo writes. It is per serverless instance,
 * so it bounds abuse rather than guaranteeing a global ceiling; the nightly
 * database reset is the hard backstop.
 */
const WINDOW_MS = 10 * 60 * 1000;
const PER_KEY_LIMIT = 10;
const GLOBAL_LIMIT = 200;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let globalBucket: Bucket = { count: 0, resetAt: 0 };

function take(bucket: Bucket, limit: number, now: number): boolean {
  if (now >= bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function allowDemoWrite(key: string): boolean {
  const now = Date.now();

  // Per-key first, so one noisy visitor cannot burn the global allowance.
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { count: 0, resetAt: 0 };
    buckets.set(key, bucket);
  }
  const allowed = take(bucket, PER_KEY_LIMIT, now) && take(globalBucket, GLOBAL_LIMIT, now);

  // Keep the map from growing without bound on a long-lived instance.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }
  return allowed;
}

export function resetDemoWriteLimits() {
  buckets.clear();
  globalBucket = { count: 0, resetAt: 0 };
}
