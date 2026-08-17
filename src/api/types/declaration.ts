/**
 * The CommonsDB declaration model, as returned by the registry search endpoints.
 *
 * A declaration is a signed statement by a data supplier about the rights status
 * of a work. Rights fields appear in up to three places for historical reasons —
 * `commonsDbRegistry` is the current location, with `supplierMetadata` and
 * `supplierData` retained for declarations made under earlier schema versions.
 * Readers should resolve them in that order; `resolveRightsFields` does this.
 */

/** Rights information carried by a declaration, wherever it happens to live. */
export interface IRightsFields {
  /** URL of the source record at the supplying institution. */
  location?: string;
  /** URL identifying the licence or public-domain statement. */
  rightsStatement?: string;
  /** Wikidata Q-identifier justifying a public-domain claim, e.g. `Q71887839`. */
  pdRationale?: string;
}

/** Verifiable credential attributing a declaration to its signer. */
export interface IDeclarationCredential {
  credentialSubject: {
    /** DID of the signing key. */
    id: string;
    /** Human-readable identity the supplier asserts for itself. */
    sameAs?: string;
  };
}

/** Metadata the supplier published alongside the declaration. */
export interface IDeclarationPublicMetadata extends Record<string, unknown> {
  /** Declaration time, as a Unix timestamp in milliseconds. */
  timestamp?: number | string;
  /** Base64 preview image, with or without a `data:` prefix. */
  thumbnail?: string;
  /** CID of the declaration this one replaces, if any. */
  supersedes?: string;
  credentials?: IDeclarationCredential[];
  /** Legacy rights location, superseded by `commonsDbRegistry`. */
  supplierMetadata?: IRightsFields;
  /** Legacy rights location, superseded by `commonsDbRegistry`. */
  supplierData?: IRightsFields;
}

/** The signed body of a declaration. */
export interface IDeclarationDocument {
  /** JWT signature over the declaration, verifiable by the public. */
  signature: string;
  /** RFC 3161 timestamp authority counter-signature. */
  tsaSignature?: { tsq?: string };
  declarationMetadata: {
    publicMetadata: IDeclarationPublicMetadata;
    /** Current location of the rights fields. */
    commonsDbRegistry?: IRightsFields;
  };
  metaInternal: {
    /** Content identifier of the declaration itself; used as the declaration ID. */
    cidV1: string;
    /** ISCC of the declared work, prefixed with `ISCC:`. */
    isccCode: string;
  };
}

/** One result from a registry search. */
export interface ISearchResult {
  docBody: IDeclarationDocument;
  /** Similarity to the queried ISCC. Absent for non-ISCC lookups. */
  score?: number;
}

/** A superseded declaration, summarised for the history modal. */
export interface IPreviousDeclaration {
  declarationId: string;
  iscc: string;
  cidV1: string;
  location: string;
  rightsStatement: string;
  timestamp: number | string;
}

/** A search result with its supersession chain attached. */
export interface ISearchResultWithPreviousDeclarations extends ISearchResult {
  previousDeclarations?: IPreviousDeclaration[];
}

/**
 * Resolves the rights fields of a declaration across the three schema versions.
 *
 * Fields are resolved independently: a declaration may carry its location in
 * `commonsDbRegistry` while its rights statement remains in `supplierMetadata`.
 */
export function resolveRightsFields(result: ISearchResult | undefined): IRightsFields {
  const metadata = result?.docBody?.declarationMetadata;
  const sources = [
    metadata?.commonsDbRegistry,
    metadata?.publicMetadata?.supplierMetadata,
    metadata?.publicMetadata?.supplierData,
  ];

  return {
    location: sources.find((source) => source?.location)?.location,
    rightsStatement: sources.find((source) => source?.rightsStatement)?.rightsStatement,
    pdRationale: sources.find((source) => source?.pdRationale)?.pdRationale,
  };
}
