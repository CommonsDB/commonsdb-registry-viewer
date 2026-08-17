import type { AxiosResponse } from 'axios';

import { getDeclarationsSearch, type IGetDeclarationsSearchResponse } from '~/api/requests';
import type { TQueryOptions } from '~/api';
import { QUERY_KEYS } from '~/shared/constants';
import { composeDataBySupersedes } from '~/shared/utils';

import { useBaseQuery } from './baseQuery';

/**
 * Declarations matching a search string.
 *
 * Superseded declarations are folded into their successor's
 * `previousDeclarations` before reaching the table, so each work appears once.
 */
export const useSearchQuery = (
  query: string,
  options?: TQueryOptions<IGetDeclarationsSearchResponse>,
) =>
  useBaseQuery<IGetDeclarationsSearchResponse>({
    queryKey: [QUERY_KEYS.GET_DECLARATIONS_SEARCH, query],
    queryFn: ({ signal }) =>
      getDeclarationsSearch(query, { signal }).then(
        (response: AxiosResponse<IGetDeclarationsSearchResponse>) => ({
          ...response,
          data: {
            ...response.data,
            results: composeDataBySupersedes(response.data?.results ?? []),
          },
        }),
      ),
    enabled: Boolean(query),
    staleTime: 5_000,
    ...options,
  });
