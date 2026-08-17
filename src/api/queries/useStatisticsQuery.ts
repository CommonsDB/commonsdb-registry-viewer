import { getStatistics } from '~/api/requests';
import type { TQueryOptions } from '~/api';
import type { IGetStatisticsResponse } from '~/api/types/statistics';
import { QUERY_KEYS } from '~/shared/constants';

import { useBaseQuery } from './baseQuery';

/** Aggregate registry statistics, shared by the dashboard and sidebar counter. */
export const useStatisticsQuery = (options?: TQueryOptions<IGetStatisticsResponse>) =>
  useBaseQuery<IGetStatisticsResponse>({
    queryKey: [QUERY_KEYS.GET_STATISTICS],
    queryFn: ({ signal }) => getStatistics({ signal }),
    staleTime: 5 * 60 * 1000,
    // The dashboard shows a "live" badge; refresh on the same cadence.
    refetchInterval: 5 * 60 * 1000,
    ...options,
  });
