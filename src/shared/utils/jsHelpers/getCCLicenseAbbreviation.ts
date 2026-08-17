interface CCLicenseInfo {
  type: string;
  version: string;
  jurisdiction?: string;
}

const extractCCValue = (url: string): CCLicenseInfo | null => {
  try {
    const urlObj = new URL(url);
    // Accept http/https (rights statements may store http; CC redirects to https)
    if (urlObj.hostname !== 'creativecommons.org') return null;

    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const baseType = pathParts[0]; // 'licenses' or 'publicdomain'
    const licenseType = pathParts[1]; // 'by', 'by-sa', 'zero', 'mark', etc.

    if ((baseType !== 'licenses' && baseType !== 'publicdomain') || !licenseType) {
      return null;
    }

    // Path shape: /licenses|publicdomain/{type}/{version}/[{jurisdiction}/]
    const versionIndex = pathParts.findIndex((part) => /^\d/.test(part));
    if (versionIndex === -1) return null;
    const versionSegment = pathParts[versionIndex];

    // Jurisdiction only appears after the version (never match license type like "by")
    let jurisdiction: string | undefined;
    const jurisdictionPart = pathParts
      .slice(versionIndex + 1)
      .find((part) => part === 'igo' || part === 'scotland' || /^[a-z]{2}$/i.test(part));

    if (jurisdictionPart) {
      if (jurisdictionPart === 'scotland') {
        jurisdiction = 'SC';
      } else if (jurisdictionPart === 'igo') {
        jurisdiction = 'IGO';
      } else {
        jurisdiction = jurisdictionPart.toUpperCase();
      }
    }

    return {
      type: licenseType,
      version: versionSegment,
      jurisdiction,
    };
  } catch {
    return null;
  }
};

export const getCCLicenseAbbreviation = (url: string | null): string | null => {
  // First extract the value from URL
  const info = url ? extractCCValue(url) : null;
  if (!info) return null;

  // Handle public domain cases
  if (info.type === 'zero') {
    return `CC0 ${info.version}`;
  }

  if (info.type === 'mark') {
    return `PDM ${info.version}`;
  }

  // For regular CC licenses, properly handle the casing
  const parts = info.type.split('-');
  const formattedParts = parts.map((part) => {
    // Special handling for 'by' and 'sa' to ensure proper casing
    return part.toUpperCase();
  });

  // Build the license string
  let license = `CC ${formattedParts.join('-')} ${info.version}`;

  // Add jurisdiction if present
  if (info.jurisdiction) {
    license += `-${info.jurisdiction}`;
  }

  return license;
};
