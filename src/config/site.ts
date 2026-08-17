import CdbHeroImage from '../../public/cdb-image.png';
import CdbNavLogo from '../../public/cdb-nav-logo.svg';

/**
 * Static identity of this deployment.
 *
 * The viewer serves exactly one registry — CommonsDB — so these values are code,
 * not configuration. Nothing here is environment-driven.
 */
export const site = {
  name: 'CommonsDB Explorer',
  description:
    'Discover and verify declarations about Public Domain and openly licensed works in the CommonsDB registry.',
  navLogo: CdbNavLogo,
  heroImage: CdbHeroImage,
  /** Rendered inverted (white) against the dark sidebar. */
  invertFooterLogo: true,
} as const;

/** Destinations outside this application. */
export const externalLinks = {
  about: 'https://www.commonsdb.org/about/',
  documentation: 'https://docs.commonsdb.org/getting-started',
  operator: 'https://liccium.com/',
} as const;
