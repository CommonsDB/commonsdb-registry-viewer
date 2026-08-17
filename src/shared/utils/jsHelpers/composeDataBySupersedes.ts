import type {
  IPreviousDeclaration,
  ISearchResult,
  ISearchResultWithPreviousDeclarations,
} from '~/api/types/declaration';
import { resolveRightsFields } from '~/api/types/declaration';

/**
 * Collapses supersession chains so each work appears once in the results.
 *
 * A declaration may supersede an earlier one via `publicMetadata.supersedes`,
 * which holds the CID of its predecessor. Search returns every link in the
 * chain; this keeps only the head — the declaration nothing else supersedes —
 * and attaches the rest, newest first, as `previousDeclarations`.
 */
export const composeDataBySupersedes = (
  data: ISearchResult[],
): ISearchResultWithPreviousDeclarations[] => {
  /** CID of a declaration -> its position in `data`. */
  const indexByCid = new Map<string, number>();
  /** CID of a declaration -> CID of the declaration it supersedes. */
  const predecessorByCid = new Map<string, string>();
  /** Every CID that is superseded by some other declaration in this result set. */
  const supersededCids = new Set<string>();

  data.forEach((item, index) => {
    const cid = item.docBody?.metaInternal?.cidV1;
    if (!cid) return;

    indexByCid.set(cid, index);

    const supersedes = item.docBody?.declarationMetadata?.publicMetadata?.supersedes;
    if (supersedes) {
      predecessorByCid.set(cid, supersedes);
      supersededCids.add(supersedes);
    }
  });

  const heads = data.filter((item) => {
    const cid = item.docBody?.metaInternal?.cidV1;
    return !cid || !supersededCids.has(cid);
  });

  return heads.map((head) => {
    const previousDeclarations = collectChain(head, predecessorByCid, indexByCid, data);

    return previousDeclarations.length ? { ...head, previousDeclarations } : head;
  });
};

/** Walks a supersession chain from `head` back to its earliest declaration. */
function collectChain(
  head: ISearchResult,
  predecessorByCid: Map<string, string>,
  indexByCid: Map<string, number>,
  data: ISearchResult[],
): IPreviousDeclaration[] {
  const chain: IPreviousDeclaration[] = [];
  // A declaration that (transitively) supersedes itself would otherwise loop
  // forever and hang the render thread. The registry should never emit one, but
  // this code runs on data we do not control.
  const visited = new Set<string>();

  let cursor = head.docBody?.metaInternal?.cidV1;

  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);

    const predecessorCid = predecessorByCid.get(cursor);
    if (!predecessorCid) break;

    const index = indexByCid.get(predecessorCid);
    if (index !== undefined) {
      chain.push(toPreviousDeclaration(data[index]));
    }

    cursor = predecessorCid;
  }

  return chain;
}

function toPreviousDeclaration(item: ISearchResult): IPreviousDeclaration {
  const { location, rightsStatement } = resolveRightsFields(item);

  return {
    declarationId: item.docBody?.metaInternal?.cidV1 ?? '',
    iscc: item.docBody?.metaInternal?.isccCode ?? '',
    cidV1: item.docBody?.metaInternal?.cidV1 ?? '',
    location: location ?? '',
    rightsStatement: rightsStatement ?? '',
    timestamp: item.docBody?.declarationMetadata?.publicMetadata?.timestamp ?? 0,
  };
}
