import { describe, expect, it } from 'vitest';

import type { ISearchResult } from '~/api/types/declaration';

import { composeDataBySupersedes } from './composeDataBySupersedes';

/** Builds a minimal search result; `supersedes` is the CID it replaces. */
function declaration(cid: string, supersedes?: string): ISearchResult {
  return {
    docBody: {
      signature: `sig-${cid}`,
      declarationMetadata: {
        publicMetadata: { timestamp: 1_700_000_000_000, supersedes },
        commonsDbRegistry: { location: `https://example.org/${cid}`, rightsStatement: 'CC0' },
      },
      metaInternal: { cidV1: cid, isccCode: `ISCC:${cid.toUpperCase()}` },
    },
  };
}

describe('composeDataBySupersedes', () => {
  it('returns independent declarations untouched', () => {
    const data = [declaration('a'), declaration('b')];

    const result = composeDataBySupersedes(data);

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.previousDeclarations === undefined)).toBe(true);
  });

  it('keeps only the head of a supersession chain', () => {
    // c supersedes b, b supersedes a.
    const data = [declaration('a'), declaration('b', 'a'), declaration('c', 'b')];

    const result = composeDataBySupersedes(data);

    expect(result).toHaveLength(1);
    expect(result[0].docBody.metaInternal.cidV1).toBe('c');
  });

  it('attaches the chain newest-first', () => {
    const data = [declaration('a'), declaration('b', 'a'), declaration('c', 'b')];

    const [head] = composeDataBySupersedes(data);

    expect(head.previousDeclarations?.map((item) => item.cidV1)).toEqual(['b', 'a']);
  });

  it('carries rights fields onto the previous declarations', () => {
    const data = [declaration('a'), declaration('b', 'a')];

    const [head] = composeDataBySupersedes(data);

    expect(head.previousDeclarations?.[0]).toMatchObject({
      cidV1: 'a',
      location: 'https://example.org/a',
      rightsStatement: 'CC0',
    });
  });

  it('terminates on a self-superseding declaration', () => {
    const data = [declaration('a', 'a')];

    // Would spin forever without a cycle guard.
    expect(() => composeDataBySupersedes(data)).not.toThrow();
  });

  it('terminates on a mutually-superseding pair', () => {
    const data = [declaration('a', 'b'), declaration('b', 'a')];

    expect(() => composeDataBySupersedes(data)).not.toThrow();
  });

  it('handles an empty result set', () => {
    expect(composeDataBySupersedes([])).toEqual([]);
  });
});
