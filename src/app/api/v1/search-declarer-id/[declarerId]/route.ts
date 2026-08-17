import type { NextRequest } from 'next/server';

import { rateLimitResponse } from '~/server/rateLimit';

import {
  extractResults,
  invalidParameterResponse,
  isSafeSegment,
  proxyRegistryRequest,
} from '~/server/registry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Every declaration signed by a given declarer DID. */
export async function GET(_req: NextRequest, { params }: { params: { declarerId: string } }) {
  const limited = rateLimitResponse(_req);
  if (limited) return limited;

  const { declarerId } = params;

  if (!isSafeSegment(declarerId)) {
    return invalidParameterResponse('declarer ID');
  }

  return proxyRegistryRequest({
    label: 'search-declarer-id',
    path: `/v1/search/${encodeURIComponent(declarerId)}`,
    transform: (body) => ({ results: extractResults(body) }),
  });
}
