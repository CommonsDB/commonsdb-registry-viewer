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

/** A declaration and its supersession chain, looked up by declaration ID. */
export async function GET(_req: NextRequest, { params }: { params: { decId: string } }) {
  const limited = rateLimitResponse(_req);
  if (limited) return limited;

  const { decId } = params;

  if (!isSafeSegment(decId)) {
    return invalidParameterResponse('declaration ID');
  }

  return proxyRegistryRequest({
    label: 'search-dec-id',
    path: `/v1/getFullById/${encodeURIComponent(decId)}`,
    transform: (body) => ({ results: extractResults(body) }),
  });
}
