import { type NextRequest, NextResponse } from 'next/server';

/**
 * Best-effort per-IP rate limiting for the registry proxy.
 *
 * The proxy attaches a server-held credential to every upstream request, so an
 * unthrottled deployment lets any visitor burn the registry quota. This
 * limiter is in-memory: on serverless platforms each instance keeps its own
 * counters, so it caps bursts per instance rather than enforcing a global
 * ceiling. For hard guarantees put a platform-level rule (e.g. a WAF rate
 * limit) in front of `/api/*`.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

/** Counters are pruned lazily; this caps memory if a flood rotates IPs. */
const MAX_TRACKED_CLIENTS = 10_000;

interface WindowState {
  count: number;
  resetAt: number;
}

const windows = new Map<string, WindowState>();

function clientKey(req: NextRequest): string {
  // On Vercel and most proxies the client address is the first entry.
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/**
 * Returns a 429 response when the caller has exceeded the window, else null.
 */
export function rateLimitResponse(req: NextRequest): NextResponse | null {
  const now = Date.now();
  const key = clientKey(req);
  const state = windows.get(key);

  if (!state || now >= state.resetAt) {
    if (windows.size >= MAX_TRACKED_CLIENTS) {
      windows.clear();
    }
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  state.count += 1;

  if (state.count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((state.resetAt - now) / 1000)) },
      },
    );
  }

  return null;
}
