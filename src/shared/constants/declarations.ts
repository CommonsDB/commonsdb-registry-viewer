import type { StaticImageData } from 'next/image';

import europeanaLogo from '../../../public/europeana.png';
import wikimediaLogo from '../../../public/wikimedia.png';

export interface Declarer {
  /** Stable slug for this data supplier. */
  id: string;
  /** Display name shown in the declarations table. */
  name: string;
  /** Logo shown when a declaration carries no thumbnail of its own. */
  logo: StaticImageData;
  /**
   * Decentralised identifier of the supplier's signing key.
   *
   * A declaration is attributed by matching its credential subject against
   * these, so a supplier that rotates keys needs an entry per key.
   */
  did: string;
}

/**
 * Data suppliers whose declarations the viewer can attribute by name and logo.
 *
 * Declarations from any other signer fall back to the `sameAs` value carried in
 * the credential, and finally to "Unknown" — see `getDeclarerData`.
 */
export const DECLARERS: readonly Declarer[] = [
  {
    // Current key — VC issued by did:web:openfuture.eu, valid from 2026-06-10.
    id: 'wikimedia',
    name: 'Wikimedia Sverige',
    logo: wikimediaLogo,
    did: 'did:key:zDnaeefYHtFD4cWwqVwmjekeX91cfwxsfGUAzZ7bp3YpwBFEP',
  },
  {
    // Legacy key — still attributed for declarations made before the rotation.
    id: 'wikimedia',
    name: 'Wikimedia Sverige',
    logo: wikimediaLogo,
    did: 'did:key:zXwpTavXRsnsLBEdeqTeqpazBrDAb7gqWkXPKv11HS1dKLU43k3WtyEJN9z1EskYcKPDbkufVufwvVTFk6XXegSJLQjf',
  },
  {
    // Current key — VC issued by did:web:openfuture.eu, valid from 2026-06-24.
    id: 'europeana',
    name: 'Europeana Foundation',
    logo: europeanaLogo,
    did: 'did:key:zDnaenZiNNf79yY2bntzQ16nVFAuGMgUEXpvEhWVU9LuovXj8',
  },
  {
    // Legacy key — still attributed for declarations made before the rotation.
    id: 'europeana',
    name: 'Europeana Foundation',
    logo: europeanaLogo,
    did: 'did:key:zXwpS3znFpTwEPepQh9pDBEXJe15DjPeCQyhJ1gv5ukdtCoHsMkSahUM1Br5Zufb7EqkzbYaGayuNqa9Yn1cRV2ECvsS',
  },
] as const;

/** Name used when a declaration's signer is not a known data supplier. */
export const UNKNOWN_DECLARER_NAME = 'Unknown';
