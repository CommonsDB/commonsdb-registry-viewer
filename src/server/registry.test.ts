import { describe, expect, it } from 'vitest';

import { extractResults, isSafeSegment } from './registry';

describe('isSafeSegment', () => {
  it('accepts the identifier shapes the registry uses', () => {
    expect(isSafeSegment('ISCC:KACYPXW445FTYNJ3')).toBe(true);
    expect(isSafeSegment('did:key:zXwpS3znFpTwEPepQh9')).toBe(true);
    expect(isSafeSegment('bafkreiec4dxlvxvzvhqoq6xzqjpfxk4tsmsjbxlqzbqxjw2n5rgqbxhq7a')).toBe(true);
  });

  it('rejects segments that could reshape the upstream path', () => {
    // Next decodes %2F before we see it, so this arrives as a literal slash.
    expect(isSafeSegment('../../admin')).toBe(false);
    expect(isSafeSegment('a/b')).toBe(false);
    expect(isSafeSegment('a?b=c')).toBe(false);
    expect(isSafeSegment('a#b')).toBe(false);
    expect(isSafeSegment('a b')).toBe(false);
  });

  it('rejects empty and oversized segments', () => {
    expect(isSafeSegment('')).toBe(false);
    expect(isSafeSegment('a'.repeat(257))).toBe(false);
  });
});

describe('extractResults', () => {
  it('returns the results array', () => {
    expect(extractResults({ results: [1, 2] })).toEqual([1, 2]);
  });

  it('returns an empty array for bodies without results', () => {
    expect(extractResults({})).toEqual([]);
    expect(extractResults(null)).toEqual([]);
    expect(extractResults({ results: 'nope' })).toEqual([]);
  });
});
