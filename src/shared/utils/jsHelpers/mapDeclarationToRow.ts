import type { StaticImageData } from 'next/image';

import {
  type IPreviousDeclaration,
  type ISearchResult,
  type ISearchResultWithPreviousDeclarations,
  resolveRightsFields,
} from '~/api/types/declaration';
import { METADATA_PUBLIC_URL } from '~/config/env';
import { getPdRationaleMeta, PD_RATIONALE_REGISTRY, ROUTES } from '~/shared/constants';

import { getCCLicenseAbbreviation } from './getCCLicenseAbbreviation';
import { getDeclarerData, isUnknownDeclarer } from './getDeclarerData';
import { getUTCDate } from './getUTCDate';

/**
 * A declaration flattened into the fields the table renders.
 *
 * A `<field>Link` companion turns `<field>` into a hyperlink; see
 * `TableDropdownOption.isLink`.
 */
export interface DeclarationRow {
  declarationDate?: string;
  declarationId?: string;
  declarationIdLink?: string;
  iscc?: string;
  signature?: string;
  signatureLink?: string;
  declarerId?: string;
  location?: string;
  rightsStatement?: string;
  rightsStatementTag?: { label: string | null };
  rightsStatementWarning?: boolean;
  rightsStatementTagWarning?: boolean;
  distance?: string;
  pdRationale?: string;
  pdRationaleTooltip?: string;
  declarer?: string;
  declarerLogo?: string | StaticImageData;
  declarerLogoLink?: string;
  previousDeclarations?: IPreviousDeclaration[];
}

/** Matches a bare Wikidata Q-identifier, e.g. `Q71887839`. */
const WIKIDATA_QID = /^Q\d+$/;

/** Matches a Q-identifier at the end of a Wikidata entity URL. */
const WIKIDATA_ENTITY_URL = /\/entity\/(Q\d+)$/;

/**
 * Flattens a registry search result into a table row.
 *
 * @param result     One declaration from the registry.
 * @param hasWarning Whether this work's declarations carry conflicting
 *                   rights statements — see `getConflictingIsccs`.
 */
export const mapDeclarationToRow = (
  result: ISearchResultWithPreviousDeclarations,
  hasWarning = false,
): DeclarationRow => {
  const { docBody } = result;
  const publicMetadata = docBody?.declarationMetadata?.publicMetadata;
  const { location, rightsStatement } = resolveRightsFields(result);
  const declarationId = docBody?.metaInternal?.cidV1;
  const iscc = docBody?.metaInternal?.isccCode;
  const credentialSubject = publicMetadata?.credentials?.[0]?.credentialSubject;

  return {
    declarationDate: getUTCDate(publicMetadata?.timestamp),
    declarationId,
    declarationIdLink: declarationId
      ? `${METADATA_PUBLIC_URL}/${encodeURIComponent(declarationId)}`
      : undefined,
    iscc,
    signature: docBody?.signature,
    // The signature is a public JWT; the link lets anyone decode and verify it.
    signatureLink: docBody?.signature
      ? `https://www.jwt.io/#token=${encodeURIComponent(docBody.signature)}`
      : undefined,
    declarerId: credentialSubject?.id,
    location,
    rightsStatement,
    rightsStatementTag: { label: getCCLicenseAbbreviation(rightsStatement ?? null) },
    rightsStatementWarning: hasWarning,
    rightsStatementTagWarning: hasWarning,
    distance: result.score != null ? `${result.score}` : undefined,
    ...resolvePdRationale(result),
    ...resolveDeclarer(result),
    declarerLogoLink: iscc ? `${ROUTES.EXPLORER}/${stripIsccPrefix(iscc)}` : undefined,
    previousDeclarations: result.previousDeclarations,
  };
};

/**
 * Resolves the public-domain rationale to a human-readable label.
 *
 * Suppliers express it either as a bare Q-identifier in `pdRationale` or as a
 * Wikidata entity URL in the rights statement itself.
 */
function resolvePdRationale(
  result: ISearchResult,
): Pick<DeclarationRow, 'pdRationale' | 'pdRationaleTooltip'> {
  const { pdRationale, rightsStatement } = resolveRightsFields(result);

  const qId =
    pdRationale?.match(WIKIDATA_QID)?.[0] ?? rightsStatement?.match(WIKIDATA_ENTITY_URL)?.[1];

  if (!qId || !PD_RATIONALE_REGISTRY[qId]) {
    return {};
  }

  const meta = getPdRationaleMeta(qId);

  return {
    pdRationale: meta.name,
    pdRationaleTooltip: meta.full ?? meta.long ?? undefined,
  };
}

/**
 * Resolves the declarer's display name and preview image.
 *
 * A declaration's own thumbnail wins when present. Otherwise the row falls back
 * to the data supplier's logo, and the name to whatever identity the credential
 * asserts.
 */
function resolveDeclarer(result: ISearchResult): Pick<DeclarationRow, 'declarer' | 'declarerLogo'> {
  const publicMetadata = result.docBody?.declarationMetadata?.publicMetadata;
  const credentialSubject = publicMetadata?.credentials?.[0]?.credentialSubject;
  const knownDeclarer = getDeclarerData(credentialSubject?.id);
  const thumbnail = publicMetadata?.thumbnail;

  return {
    // A registered supplier's name takes precedence: `sameAs` is self-asserted,
    // and for legacy keys it resolves to a deprecated label.
    declarer: isUnknownDeclarer(knownDeclarer)
      ? credentialSubject?.sameAs ?? knownDeclarer.name
      : knownDeclarer.name,
    declarerLogo: thumbnail ? toDataUri(thumbnail) : knownDeclarer.logo ?? undefined,
  };
}

/** Thumbnails arrive either as a bare base64 payload or a complete data URI. */
function toDataUri(thumbnail: string): string {
  return thumbnail.startsWith('data:image') ? thumbnail : `data:image/jpeg;base64,${thumbnail}`;
}

function stripIsccPrefix(iscc: string): string {
  return iscc.startsWith('ISCC:') ? iscc.slice('ISCC:'.length) : iscc;
}
