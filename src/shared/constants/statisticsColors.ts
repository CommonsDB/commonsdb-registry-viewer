/**
 * Statistics-page color palettes. Source of truth lives on the FE — the BE only
 * sends ids; the FE looks up the appropriate hex per category and resolver.
 *
 * To add a new supplier / license / media type, append it to the matching map
 * below; unknown ids fall back to a neutral grey so the UI never breaks.
 */

const FALLBACK_COLOR = '#7A7A7A';

/**
 * Supplier display registry, keyed by *canonical* UI supplier id.
 *
 * The backend returns suppliers keyed by their raw `did:key` (kept separate
 * there on purpose). The FE collapses DIDs into canonical suppliers via
 * `SUPPLIER_DID_TO_CANONICAL` below — e.g. the two Wikimedia Sverige DIDs are
 * merged into a single supplier *on the UI only*.
 */
export interface IStatisticsSupplierMeta {
  name: string;
  short?: string;
  color: string;
}

export const STATISTICS_SUPPLIER_REGISTRY: Record<string, IStatisticsSupplierMeta> = {
  'wikimedia-se': { name: 'Wikimedia Sverige', short: 'WMSE', color: '#6A994E' },
  europeana: { name: 'Europeana Foundation', short: 'EUR', color: '#F4A259' },
  'sound-and-vision': {
    name: 'Netherlands Institute for Sound & Vision',
    short: 'NISV',
    color: '#3A7CA5',
  },

  // Legacy slug form, still present in older registry records.
  wikimedia: { name: 'Wikimedia Sverige', short: 'WMSE', color: '#6A994E' },
};

/**
 * Maps a backend declarer DID (or legacy slug) to a canonical UI supplier id.
 * `null` means the declarer is hidden on the UI entirely.
 * Unknown ids pass through unchanged (rendered with a fallback label/color).
 */
export const SUPPLIER_DID_TO_CANONICAL: Record<string, string | null> = {
  // Both Wikimedia Sverige declarers collapse into one UI supplier.
  'did:key:zDnaeefYHtFD4cWwqVwmjekeX91cfwxsfGUAzZ7bp3YpwBFEP': 'wikimedia-se',
  'did:key:zXwpTavXRsnsLBEdeqTeqpazBrDAb7gqWkXPKv11HS1dKLU43k3WtyEJN9z1EskYcKPDbkufVufwvVTFk6XXegSJLQjf':
    'wikimedia-se',
  // Both Europeana Foundation declarers collapse into one UI supplier.
  'did:key:zXwpS3znFpTwEPepQh9pDBEXJe15DjPeCQyhJ1gv5ukdtCoHsMkSahUM1Br5Zufb7EqkzbYaGayuNqa9Yn1cRV2ECvsS':
    'europeana',
  'did:key:zDnaenZiNNf79yY2bntzQ16nVFAuGMgUEXpvEhWVU9LuovXj8': 'europeana',
  // Netherlands Institute for Sound & Vision.
  'did:key:zDnaerTAxXSab5HdNK7gHDQaPKVK5vD3T5hyNFZn1evDi2ata': 'sound-and-vision',
  // Test declarer — excluded on the backend too, hidden here defensively.
  'did:key:zXwpTXLLcPCJUmuMta9mU8xYTuGkTFErFtzh9enJXsQckkDDbN4amsCfi99gwcXPYy2Xar9psHXkWaWSemdv9YwuuVWh':
    null,
  // Test declarer — excluded on the backend too, hidden here defensively.
  'did:key:zDnaeu7EzKiY58ntGRyrbGe9n3ZLfAVbbhF52Zj6mQ7geJKE9': null,
  // Test declarer — hidden on the UI; its contributions are subtracted from
  // the aggregate statistics in `mergeStatisticsBySupplier`.
  'did:key:zDnaezYtcbVr7PFoYnuoqxnUpnPnRGG4VfENgPc7y1eegi33g': null,
};

/**
 * Resolve a backend supplier id (DID or legacy slug) to its canonical UI id.
 * Returns `null` when the supplier should be hidden.
 */
export const resolveSupplierCanonicalId = (id: string): string | null =>
  id in SUPPLIER_DID_TO_CANONICAL ? SUPPLIER_DID_TO_CANONICAL[id] : id;

// Deterministic palette for unknown suppliers.
const SUPPLIER_FALLBACK_PALETTE = [
  '#8E5EA8',
  '#C9B382',
  '#3A7CA5',
  '#EF4D5E',
  '#6A994E',
  '#F4A259',
];

const pickFallbackColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return SUPPLIER_FALLBACK_PALETTE[Math.abs(hash) % SUPPLIER_FALLBACK_PALETTE.length];
};

/** Shorten a `did:key:zXwp…SJLQjf` style id for display when no friendly name exists. */
export const truncateSupplierId = (id: string): string =>
  id.length > 22 ? `${id.slice(0, 14)}…${id.slice(-6)}` : id;

export const getStatisticsSupplierMeta = (id: string): IStatisticsSupplierMeta =>
  STATISTICS_SUPPLIER_REGISTRY[id] ?? {
    name: truncateSupplierId(id),
    color: pickFallbackColor(id),
  };

export const STATISTICS_LICENSE_COLORS: Record<string, string> = {
  pdm: '#1C2A3E',
  cc0: '#EF4D5E',
  ccby: '#F4A259',
  ccbysa: '#6A994E',
  ccbynd: '#3A7CA5',
  ccbync: '#8E5EA8',
  other: '#C9B382',
};

export const STATISTICS_MEDIA_COLORS: Record<string, string> = {
  image: '#EF4D5E',
  text: '#1C2A3E',
  audio: '#6A994E',
  video: '#3A7CA5',
  '3d': '#F4A259',
  mixed: '#8E5EA8',
};

export const getStatisticsSupplierColor = (id: string): string =>
  getStatisticsSupplierMeta(id).color;

export const getStatisticsLicenseColor = (id: string): string =>
  STATISTICS_LICENSE_COLORS[id] ?? FALLBACK_COLOR;

export const getStatisticsMediaColor = (id: string): string =>
  STATISTICS_MEDIA_COLORS[id] ?? FALLBACK_COLOR;

/**
 * Single brand colour used for the Public Domain Rationale ranking bars —
 * the chart is monochromatic by design (ranking, not a categorical split).
 */
export const STATISTICS_PD_RATIONALE_BAR_COLOR = '#EF4D5E';
