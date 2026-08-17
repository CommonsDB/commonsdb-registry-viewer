import type { NextRequest } from 'next/server';

import { rateLimitResponse } from '~/server/rateLimit';

import { extractResults, proxyRegistryRequest } from '~/server/registry';

// Without these the route sits in Next's full-route cache and every visitor
// receives the same "random" sample until the deployment is replaced.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** A random sample of declarations from the registry. */
export async function GET(_req: NextRequest) {
  const limited = rateLimitResponse(_req);
  if (limited) return limited;

  return proxyRegistryRequest({
    label: 'random-declarations',
    path: '/v1/random',
    transform: (body) => ({ results: extractResults(body) }),
  });
}
