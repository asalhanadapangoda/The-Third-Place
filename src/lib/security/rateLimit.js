/**
 * Lightweight sliding-window rate limiter for API routes and Server Actions.
 * For multi-region/high-scale production deployments, back this with Upstash Redis.
 */
const store = new Map();
const MAX_ENTRIES = 5000;

function cleanupExpired(now) {
  if (store.size < MAX_ENTRIES) return;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  cleanupExpired(now);

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000)
    );
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: 0,
  };
}

export async function getClientIp() {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

export async function verifySameOrigin() {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const origin = h.get("origin");
    const host = h.get("host");
    if (!origin || !host) return true; // Non-browser or same-origin navigation
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
