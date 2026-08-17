/**
 * Routes served by this application's own API layer (`src/app/api/v1`).
 *
 * The browser never talks to the CommonsDB registry directly — these handlers
 * proxy it so the registry credential stays on the server.
 */
export const INTERNAL_API = {
  searchByIscc: (iscc: string) => `api/v1/search-iscc/${encodeURIComponent(iscc)}`,
  searchByDeclarationId: (decId: string) => `api/v1/search-dec-id/${encodeURIComponent(decId)}`,
  searchByDeclarerId: (declarerId: string) =>
    `api/v1/search-declarer-id/${encodeURIComponent(declarerId)}`,
  randomDeclarations: 'api/v1/random-declarations',
  statistics: 'api/v1/statistics',
} as const;

/** Endpoint on the external ISCC service used to fingerprint an uploaded file. */
export const ISCC_GENERATE_ENDPOINT = 'v2/entries/generate-iscc';
