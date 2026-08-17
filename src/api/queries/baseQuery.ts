import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

/**
 * Wraps `useQuery` so callers work with the response body rather than the
 * `AxiosResponse` envelope.
 */
export const useBaseQuery = <TData>(
  options: UseQueryOptions<AxiosResponse<TData>, AxiosError, TData, QueryKey>,
): UseQueryResult<TData, AxiosError> =>
  useQuery<AxiosResponse<TData>, AxiosError, TData, QueryKey>({
    select: (response: AxiosResponse<TData>) => response.data,
    ...options,
  });
