/** The kinds of identifier the explorer search box accepts. */
export type SearchStringType = 'iscc' | 'declarerId' | 'declarationId';

const ISCC_PREFIX = 'ISCC:';

/** ISCC codes are base32 (RFC 4648) and case-significant. */
const ISCC_BODY = /^[A-Z2-7]{16,}$/;

/** `did:key` identifiers are multibase base58btc, which excludes 0, O, I and l. */
const DID_KEY = /^did:key:z[1-9A-HJ-NP-Za-km-z]{20,}$/;

/**
 * Classifies a search string so the caller can pick the right registry endpoint.
 *
 * Recognition is by shape rather than by length: ISCC codes vary in length with
 * their unit composition, and pinning exact lengths silently misroutes valid
 * codes to the declaration-ID endpoint. Anything unrecognised is treated as a
 * declaration ID, which is the registry's most permissive lookup.
 */
export const getSearchStringType = (searchString: string): SearchStringType => {
  const trimmed = searchString.trim();

  if (DID_KEY.test(trimmed)) {
    return 'declarerId';
  }

  const isccBody = trimmed.startsWith(ISCC_PREFIX) ? trimmed.slice(ISCC_PREFIX.length) : trimmed;

  if (ISCC_BODY.test(isccBody)) {
    return 'iscc';
  }

  return 'declarationId';
};
