import type { AxiosRequestConfig } from 'axios';

import { INTERNAL_API } from '~/shared/constants';
import { getSearchStringType } from '~/shared/utils';

import { internalApi, NO_CACHE_HEADERS } from '../http';
import type { IGetDeclarationsSearchResponse } from './types';

/**
 * Looks up declarations for a search string.
 *
 * The registry exposes a different endpoint per identifier kind, so the string
 * is classified first — see `getSearchStringType`.
 */
export const getDeclarationsSearch = (query: string, config?: AxiosRequestConfig) => {
  const endpoint = resolveSearchEndpoint(query);

  return internalApi.get<IGetDeclarationsSearchResponse>(endpoint, {
    headers: NO_CACHE_HEADERS,
    ...config,
  });
};

function resolveSearchEndpoint(query: string): string {
  switch (getSearchStringType(query)) {
    case 'iscc':
      return INTERNAL_API.searchByIscc(query);
    case 'declarerId':
      return INTERNAL_API.searchByDeclarerId(query);
    case 'declarationId':
    default:
      return INTERNAL_API.searchByDeclarationId(query);
  }
}
