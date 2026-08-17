import { type ISearchResult, resolveRightsFields } from '~/api/types/declaration';
import { privateRightsStatements, publicRightsStatements } from '~/shared/constants';

/**
 * Finds works whose declarations disagree on rights status.
 *
 * Declarations for the same work should agree. Results are grouped by ISCC —
 * a similarity or declarer search legitimately returns *different* works under
 * different licences, which is not a conflict. Within one ISCC, a mix of
 * public-domain/open statements and restrictive ones — or a statement we do not
 * recognise — flags that work so a user does not act on one declaration while
 * another contradicts it.
 *
 * @returns The set of ISCC codes whose declarations conflict.
 */
export const getConflictingIsccs = (data: ISearchResult[]): Set<string> => {
  const statementsByIscc = new Map<string, (string | undefined)[]>();

  for (const item of data) {
    const iscc = item.docBody?.metaInternal?.isccCode;
    if (!iscc) continue;

    const statements = statementsByIscc.get(iscc) ?? [];
    statements.push(resolveRightsFields(item).rightsStatement);
    statementsByIscc.set(iscc, statements);
  }

  const conflicting = new Set<string>();

  statementsByIscc.forEach((statements, iscc) => {
    if (statements.length <= 1) return;

    if (!(statements.every(isPublic) || statements.every(isPrivate))) {
      conflicting.add(iscc);
    }
  });

  return conflicting;
};

const isPublic = (statement?: string) => matches(publicRightsStatements, statement);

const isPrivate = (statement?: string) => matches(privateRightsStatements, statement);

/**
 * Matches a declaration's rights statement against a known list.
 *
 * Declarations carry the statement as a full URL, but the lists are maintained
 * as bare identifiers, so a suffix comparison is what lines the two up.
 */
function matches(known: readonly string[], statement?: string): boolean {
  if (!statement) return false;

  return known.some((candidate) => candidate.endsWith(statement) || statement.endsWith(candidate));
}
