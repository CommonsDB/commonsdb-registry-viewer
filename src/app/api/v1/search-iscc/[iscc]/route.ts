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

/** Declarations matching an ISCC content code. */
export async function GET(_req: NextRequest, { params }: { params: { iscc: string } }) {
  const limited = rateLimitResponse(_req);
  if (limited) return limited;

  const { iscc } = params;

  if (!isSafeSegment(iscc)) {
    return invalidParameterResponse('ISCC');
  }

  return proxyRegistryRequest({
    label: 'search-iscc',
    path: `/v1/search/${encodeURIComponent(iscc)}`,
    transform: (body) => ({ iscc, results: extractResults(body) }),
  });
}
