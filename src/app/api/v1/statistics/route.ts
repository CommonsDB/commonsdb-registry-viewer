import type { NextRequest } from 'next/server';

import { rateLimitResponse } from '~/server/rateLimit';

import { proxyRegistryRequest } from '~/server/registry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Aggregate registry statistics powering the dashboard and sidebar counter. */
export async function GET(_req: NextRequest) {
  const limited = rateLimitResponse(_req);
  if (limited) return limited;

  return proxyRegistryRequest({
    label: 'statistics',
    path: '/v1/statistics',
  });
}
