import { describe, expect, it } from 'vitest';

import { getSearchStringType } from './getSearchStringType';

describe('getSearchStringType', () => {
  it('recognises an ISCC with its prefix', () => {
    expect(
      getSearchStringType('ISCC:KEC35N5H7KRHORSISH77QCAHMA7XROHPLLJAOT7DKXFDOCP4GTWSEFI'),
    ).toBe('iscc');
  });

  it('recognises a bare ISCC body', () => {
    expect(getSearchStringType('KEC35N5H7KRHORSISH77QCAHMA7XROHPLLJAOT7DKXFDOCP4GTWSEFI')).toBe(
      'iscc',
    );
  });

  it('recognises ISCCs of other lengths', () => {
    // Unit composition varies the length; a shorter code is still an ISCC.
    expect(getSearchStringType('ISCC:KACYPXW445FTYNJ3')).toBe('iscc');
  });

  it('recognises a declarer DID', () => {
    expect(
      getSearchStringType(
        'did:key:zXwpS3znFpTwEPepQh9pDBEXJe15DjPeCQyhJ1gv5ukdtCoHsMkSahUM1Br5Zufb7EqkzbYaGayuNqa9Yn1cRV2ECvsS',
      ),
    ).toBe('declarerId');
  });

  it('treats a CID as a declaration id', () => {
    expect(getSearchStringType('bafkreiec4dxlvxvzvhqoq6xzqjpfxk4tsmsjbxlqzbqxjw2n5rgqbxhq7a')).toBe(
      'declarationId',
    );
  });

  it('ignores surrounding whitespace', () => {
    expect(getSearchStringType('  ISCC:KACYPXW445FTYNJ3  ')).toBe('iscc');
  });

  it('falls back to declaration id for unrecognised input', () => {
    expect(getSearchStringType('hello world')).toBe('declarationId');
    expect(getSearchStringType('')).toBe('declarationId');
  });
});
