import type { AxiosResponse } from 'axios';

import { getRandomDeclarations, type IGetDeclarationsSearchResponse } from '~/api/requests';
import type { TQueryOptions } from '~/api';
import { QUERY_KEYS } from '~/shared/constants';
import { composeDataBySupersedes } from '~/shared/utils';

import { useBaseQuery } from './baseQuery';

type RandomDeclarationsResponse = Pick<IGetDeclarationsSearchResponse, 'results'>;

/**
 * A random sample of declarations.
 *
 * `staleTime: 0` keeps the sample fresh on revisit — caching it would defeat
 * the point of the page.
 */
export const useRandomDeclarationsQuery = (options?: TQueryOptions<RandomDeclarationsResponse>) =>
  useBaseQuery<RandomDeclarationsResponse>({
    queryKey: [QUERY_KEYS.GET_RANDOM_DECLARATIONS],
    queryFn: ({ signal }) =>
      getRandomDeclarations({ signal }).then(
        (response: AxiosResponse<RandomDeclarationsResponse>) => ({
          ...response,
          data: { results: composeDataBySupersedes(response.data?.results ?? []) },
        }),
      ),
    staleTime: 0,
    ...options,
  });
