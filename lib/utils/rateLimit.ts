// Rate limiting with an optional durable backend.
//
// By default this uses an in-memory Map, which works for a single server
// process but resets on every redeploy/restart and does NOT share state
// across multiple serverless instances (a real gap on platforms like
// Vercel, which can run several instances of the same route in parallel).
//
// If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set (free tier
// available at upstash.com), rate limiting is backed by Redis instead, which
// is shared and durable across instances/redeploys. No extra npm package is
// needed — this just calls Upstash's REST API directly.

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // sweep expired entries every 5 min

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) rateLimitStore.delete(key);
  }
  lastCleanup = now;
}

function memoryRateLimit(identifier: string, maxRequests: number, windowMs: number): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return { success: true, remaining: maxRequests - entry.count, retryAfter: 0 };
  }

  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return { success: false, remaining: 0, retryAfter };
}

async function upstashRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null; // not configured — caller falls back to memory

  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const key = `ratelimit:${identifier}`;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        // NX: only set the expiry on the first increment of a window, so
        // the window is fixed rather than sliding under continuous traffic.
        ['EXPIRE', key, windowSeconds, 'NX'],
        ['TTL', key],
      ]),
      // Don't let a slow/unreachable Redis hang the request indefinitely.
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) return null; // fail open to memory fallback

    const results = (await response.json()) as Array<{ result: number }>;
    const count = Number(results[0]?.result ?? 0);
    const ttl = Number(results[2]?.result ?? windowSeconds);

    const success = count <= maxRequests;
    return {
      success,
      remaining: Math.max(0, maxRequests - count),
      retryAfter: success ? 0 : Math.max(ttl, 0),
    };
  } catch {
    return null; // Redis unreachable/timed out — fail open to memory fallback
  }
}

export async function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const durableResult = await upstashRateLimit(identifier, maxRequests, windowMs);
  if (durableResult) return durableResult;

  return memoryRateLimit(identifier, maxRequests, windowMs);
}

export function getRateLimitHeaders(
  maxRequests: number,
  remaining: number,
  retryAfter: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    ...(retryAfter > 0 && { 'Retry-After': retryAfter.toString() }),
  };
}
