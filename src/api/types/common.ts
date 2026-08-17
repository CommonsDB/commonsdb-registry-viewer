import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

/**
 * Caller-supplied overrides for a query hook.
 *
 * `queryFn` and `queryKey` are owned by the hook, so they are excluded.
 */
export type TQueryOptions<TData> = Omit<
  UseQueryOptions<AxiosResponse<TData>, AxiosError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;
