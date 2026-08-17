import { describe, expect, it } from 'vitest';

import type { ISearchResult } from '~/api/types/declaration';

import { getConflictingIsccs } from './checkForSearchWarnings';

const PUBLIC_STATEMENT = 'https://creativecommons.org/publicdomain/zero/1.0/';
const PRIVATE_STATEMENT = 'https://creativecommons.org/licenses/by/4.0/';

function declaration(iscc: string, rightsStatement: string, cid: string): ISearchResult {
  return {
    docBody: {
      signature: `sig-${cid}`,
      declarationMetadata: {
        publicMetadata: {},
        commonsDbRegistry: { rightsStatement },
      },
      metaInternal: { cidV1: cid, isccCode: iscc },
    },
  };
}

describe('getConflictingIsccs', () => {
  it('does not flag a single declaration', () => {
    expect(getConflictingIsccs([declaration('ISCC:A', PUBLIC_STATEMENT, 'a')]).size).toBe(0);
  });

  it('does not flag agreeing declarations for the same work', () => {
    const result = getConflictingIsccs([
      declaration('ISCC:A', PUBLIC_STATEMENT, 'a1'),
      declaration('ISCC:A', PUBLIC_STATEMENT, 'a2'),
    ]);

    expect(result.size).toBe(0);
  });

  it('flags a work whose declarations disagree', () => {
    const result = getConflictingIsccs([
      declaration('ISCC:A', PUBLIC_STATEMENT, 'a1'),
      declaration('ISCC:A', PRIVATE_STATEMENT, 'a2'),
    ]);

    expect(result).toEqual(new Set(['ISCC:A']));
  });

  it('does not flag different works with different licences', () => {
    // A declarer or similarity search legitimately returns unrelated works.
    const result = getConflictingIsccs([
      declaration('ISCC:A', PUBLIC_STATEMENT, 'a'),
      declaration('ISCC:B', PRIVATE_STATEMENT, 'b'),
    ]);

    expect(result.size).toBe(0);
  });

  it('flags only the conflicted work in a mixed result set', () => {
    const result = getConflictingIsccs([
      declaration('ISCC:A', PUBLIC_STATEMENT, 'a1'),
      declaration('ISCC:A', PRIVATE_STATEMENT, 'a2'),
      declaration('ISCC:B', PUBLIC_STATEMENT, 'b1'),
      declaration('ISCC:B', PUBLIC_STATEMENT, 'b2'),
    ]);

    expect(result).toEqual(new Set(['ISCC:A']));
  });
});
