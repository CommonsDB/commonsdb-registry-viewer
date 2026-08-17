import { NextResponse } from 'next/server';

import { getServerEnv } from '~/config/env';

/**
 * Server-side client for the CommonsDB registry API.
 *
 * Every browser-facing route under `src/app/api/v1` goes through here so that
 * the registry credential, error handling and cache policy live in one place
 * rather than being copy-pasted per route.
 */

/** Upper bound on any path segment forwarded upstream. */
const MAX_SEGMENT_LENGTH = 256;

/**
 * Characters permitted in a dynamic path segment.
 *
 * Next.js decodes percent-escapes before handing us `params`, so an encoded
 * `%2F` arrives as a literal `/`. Without this check such a value would let a
 * caller reshape the upstream path — with our bearer token attached. Identifiers
 * the registry uses (ISCC codes, CIDs, `did:key:` DIDs) need only these.
 */
const SAFE_SEGMENT = /^[A-Za-z0-9:_.-]+$/;

/** True when `segment` is safe to interpolate into an upstream URL. */
export function isSafeSegment(segment: string): boolean {
  return segment.length > 0 && segment.length <= MAX_SEGMENT_LENGTH && SAFE_SEGMENT.test(segment);
}

/** 400 response for a segment that failed {@link isSafeSegment}. */
export function invalidParameterResponse(name: string): NextResponse {
  return NextResponse.json({ error: `Invalid ${name}` }, { status: 400 });
}

/** Headers that keep a proxied response out of every cache between us and the browser. */
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
} as const;

interface ProxyOptions<T> {
  /** Path on the registry API, e.g. `/v1/search/${iscc}`. Must already be escaped. */
  path: string;
  /** Shapes a successful upstream body into this route's response payload. */
  transform?: (body: unknown) => T;
  /** Included in server logs to identify the failing route. */
  label: string;
}

/**
 * Forwards a request to the registry and maps the result to a `NextResponse`.
 *
 * Upstream failures are surfaced with their own status rather than being
 * flattened into an empty 200 — a client cannot otherwise distinguish "the
 * registry rejected our token" from "no declarations matched".
 */
export async function proxyRegistryRequest<T>({
  path,
  transform,
  label,
}: ProxyOptions<T>): Promise<NextResponse> {
  let registryApiUrl: string;
  let registryApiToken: string;

  try {
    ({ registryApiUrl, registryApiToken } = getServerEnv());
  } catch (error) {
    console.error(`[${label}] configuration error:`, error);
    return NextResponse.json({ error: 'Registry is not configured' }, { status: 500 });
  }

  let response: Response;

  try {
    response = await fetch(`${registryApiUrl}${path}`, {
      headers: { Authorization: `Bearer ${registryApiToken}` },
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`[${label}] request to registry failed:`, error);
    return NextResponse.json({ error: 'Failed to reach the registry' }, { status: 502 });
  }

  if (!response.ok) {
    console.error(`[${label}] registry responded with ${response.status}`);
    return NextResponse.json(
      { error: 'Registry request failed' },
      { status: response.status, headers: NO_STORE_HEADERS },
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    console.error(`[${label}] registry returned a malformed body:`, error);
    return NextResponse.json({ error: 'Malformed registry response' }, { status: 502 });
  }

  return NextResponse.json(transform ? transform(body) : body, { headers: NO_STORE_HEADERS });
}

/** Narrows an unknown upstream body to its `results` array. */
export function extractResults(body: unknown): unknown[] {
  if (body && typeof body === 'object' && Array.isArray((body as { results?: unknown }).results)) {
    return (body as { results: unknown[] }).results;
  }

  return [];
}
