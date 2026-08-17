import { type Declarer, DECLARERS, UNKNOWN_DECLARER_NAME } from '~/shared/constants/declarations';

/** A declarer the viewer could not attribute to a known data supplier. */
export interface UnknownDeclarer {
  name: typeof UNKNOWN_DECLARER_NAME;
  logo: null;
}

const UNKNOWN: UnknownDeclarer = { name: UNKNOWN_DECLARER_NAME, logo: null };

/**
 * Resolves a declarer DID to its data supplier.
 *
 * Matching is by substring because credentials sometimes carry a DID with a
 * fragment or method-specific suffix appended.
 */
export const getDeclarerData = (declarerId = ''): Declarer | UnknownDeclarer =>
  DECLARERS.find((declarer) => declarerId.includes(declarer.did)) ?? UNKNOWN;

/** True when `declarer` could not be attributed to a known data supplier. */
export const isUnknownDeclarer = (
  declarer: Declarer | UnknownDeclarer,
): declarer is UnknownDeclarer => declarer.logo === null;
