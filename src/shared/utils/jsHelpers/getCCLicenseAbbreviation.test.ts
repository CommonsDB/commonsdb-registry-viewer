import { describe, expect, it } from 'vitest';

import { getCCLicenseAbbreviation } from './getCCLicenseAbbreviation';

describe('getCCLicenseAbbreviation', () => {
  it('abbreviates a public domain dedication', () => {
    expect(getCCLicenseAbbreviation('https://creativecommons.org/publicdomain/zero/1.0/')).toBe(
      'CC0 1.0',
    );
  });

  it('abbreviates a public domain mark', () => {
    expect(getCCLicenseAbbreviation('https://creativecommons.org/publicdomain/mark/1.0/')).toBe(
      'PDM 1.0',
    );
  });

  it('abbreviates a standard licence', () => {
    expect(getCCLicenseAbbreviation('https://creativecommons.org/licenses/by-sa/4.0/')).toBe(
      'CC BY-SA 4.0',
    );
  });

  it('appends an IGO jurisdiction', () => {
    expect(getCCLicenseAbbreviation('https://creativecommons.org/licenses/by-sa/3.0/igo/')).toBe(
      'CC BY-SA 3.0-IGO',
    );
  });

  it('accepts http as well as https', () => {
    expect(getCCLicenseAbbreviation('http://creativecommons.org/licenses/by/4.0/')).toBe(
      'CC BY 4.0',
    );
  });

  it('rejects a non-Creative-Commons host', () => {
    expect(getCCLicenseAbbreviation('https://example.org/licenses/by/4.0/')).toBeNull();
  });

  it('returns null for missing or malformed input', () => {
    expect(getCCLicenseAbbreviation(null)).toBeNull();
    expect(getCCLicenseAbbreviation('not a url')).toBeNull();
  });
});
