import type { AxiosRequestConfig } from 'axios';

import { INTERNAL_API } from '~/shared/constants';
import type { IGetStatisticsResponse } from '~/api/types/statistics';

import { internalApi, NO_CACHE_HEADERS } from '../http';

/** Aggregate registry statistics for the dashboard. */
export const getStatistics = (config?: AxiosRequestConfig) =>
  internalApi.get<IGetStatisticsResponse>(INTERNAL_API.statistics, {
    headers: NO_CACHE_HEADERS,
    ...config,
  });
