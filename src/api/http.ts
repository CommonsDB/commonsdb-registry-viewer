import axios from 'axios';

import { ISCC_SERVICE_URL } from '~/config/env';

/**
 * Client for this application's own API routes.
 *
 * The base URL is relative on purpose: the routes are served by the same
 * deployment, so there is nothing to configure and no origin to keep in sync.
 */
export const internalApi = axios.create({ baseURL: '/' });

/**
 * Client for the external ISCC generation service.
 *
 * Used by the explorer's drag-and-drop search to fingerprint a local file. This
 * is the only upstream the browser talks to directly; the registry itself is
 * always proxied.
 */
export const isccApi = axios.create({ baseURL: ISCC_SERVICE_URL });

/** Headers that defeat intermediary caching for registry reads. */
export const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
} as const;
