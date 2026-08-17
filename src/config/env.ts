/**
 * Typed access to the application's environment configuration.
 *
 * Two rules govern this file:
 *
 * 1. Anything prefixed with `NEXT_PUBLIC_` is inlined into the client bundle by
 *    Next.js and is therefore public. Never put a credential behind that prefix.
 * 2. Server-only values are read through {@link serverEnv}, which throws on a
 *    missing value. Route handlers call it at request time so a misconfigured
 *    deployment fails loudly instead of issuing `fetch("undefined/v1/...")`.
 *
 * `process.env.X` is referenced literally rather than through a dynamic lookup
 * because Next.js performs a build-time textual substitution; `process.env[key]`
 * would not be replaced.
 */

/** Base URL of the ISCC generation service used by the file-upload search. */
export const ISCC_SERVICE_URL = process.env.NEXT_PUBLIC_ISCC_SERVICE_URL ?? '';

/** Public base URL of the CommonsDB metadata API, used to build citable links. */
export const METADATA_PUBLIC_URL =
  process.env.NEXT_PUBLIC_METADATA_PUBLIC_URL ?? 'https://api.commonsdb.org/v1/metadata-pub';

interface ServerEnv {
  /** Base URL of the CommonsDB registry API that this app proxies. */
  registryApiUrl: string;
  /** Bearer token for the registry API. Server-only — never exposed to the browser. */
  registryApiToken: string;
}

/**
 * Reads and validates the server-only configuration.
 *
 * @throws Error when a required variable is missing, so the caller can return a
 *         500 rather than forwarding a malformed request upstream.
 */
export function getServerEnv(): ServerEnv {
  const registryApiUrl = process.env.REGISTRY_API_URL;
  const registryApiToken = process.env.REGISTRY_API_TOKEN;

  if (!registryApiUrl) {
    throw new Error('REGISTRY_API_URL is not configured');
  }

  if (!registryApiToken) {
    throw new Error('REGISTRY_API_TOKEN is not configured');
  }

  return { registryApiUrl, registryApiToken };
}
