import type { AxiosRequestConfig } from 'axios';

import { INTERNAL_API } from '~/shared/constants';

import { internalApi, NO_CACHE_HEADERS } from '../http';
import type { IGetDeclarationsSearchResponse } from './types';

/** A random sample of declarations, for the random-declarations page. */
export const getRandomDeclarations = (config?: AxiosRequestConfig) =>
  internalApi.get<Pick<IGetDeclarationsSearchResponse, 'results'>>(
    INTERNAL_API.randomDeclarations,
    { headers: NO_CACHE_HEADERS, ...config },
  );
