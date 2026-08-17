/**
 * Friendly labels for public-domain rationale identifiers returned by the API.
 *
 * Production data uses Wikidata Q-codes (jurisdiction groups and copyright
 * determination methods). Labels follow Wikidata Help:Copyrights terminology.
 * Legacy slugs (pma70, pdusgov, …) are retained for older registry records.
 */

export interface IPdRationaleMeta {
  name: string;
  long?: string;
  full?: string;
}

/** Wikidata Q-id or legacy slug → display metadata. */
export const PD_RATIONALE_REGISTRY: Record<string, IPdRationaleMeta> = {
  // ── Observed in production (Wikidata) ─────────────────────────────────────
  Q88088423: {
    name: 'PD by holder',
    long: 'Dedicated to the public domain by the copyright holder',
    full: 'This work has been dedicated to the public domain by the copyright holder.',
  },
  Q60671452: {
    name: 'PD US Gov',
    long: 'US Government work (17 U.S.C. §105)',
    full: "This work is in the public domain in the United States because it is a work prepared by an officer or employee of the U.S. Government as part of that person's official duties.",
  },
  Q60332278: {
    name: 'PMA 100',
    long: 'Countries with 100 years pma or shorter',
    full: "This work is in the public domain in countries and areas where the copyright term is the author's life plus 100 years or fewer.",
  },
  Q114785307: {
    name: 'PMA 95',
    long: 'Countries with 95 years pma',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 95 years or fewer.",
  },
  Q114785302: {
    name: 'PMA 90',
    long: 'Countries with 90 years pma',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 90 years or fewer.",
  },
  Q61830521: {
    name: 'PMA 80',
    long: 'Countries with 80 years pma or shorter',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 80 years or fewer.",
  },
  Q117408984: {
    name: 'PMA 75',
    long: 'Countries with 75 years pma or shorter',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 75 years or fewer.",
  },
  Q59542795: {
    name: 'PMA 70',
    long: 'Countries with 70 years pma or shorter',
    full: "This work is in the public domain in countries and areas where the copyright term is the author's life plus 70 years or fewer.",
  },
  Q59621182: {
    name: 'PMA 50',
    long: 'Countries with 50 years pma or shorter',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 50 years or fewer.",
  },

  // ── Legacy slug identifiers ─────────────────────────────────────────────────
  pma100: {
    name: 'PMA 100',
    long: 'Life + 100 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 100 years or fewer.",
  },
  pma95: {
    name: 'PMA 95',
    long: 'Life + 95 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 95 years or fewer.",
  },
  pma90: {
    name: 'PMA 90',
    long: 'Life + 90 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 90 years or fewer.",
  },
  pma80: {
    name: 'PMA 80',
    long: 'Life + 80 years or shorter',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 80 years or fewer.",
  },
  pma75: {
    name: 'PMA 75',
    long: 'Life + 75 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 75 years or fewer.",
  },
  pma70: {
    name: 'PMA 70',
    long: 'Life + 70 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 70 years or fewer.",
  },
  pma50: {
    name: 'PMA 50',
    long: 'Life + 50 years or fewer',
    full: "This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 50 years or fewer.",
  },
  pdusgov: {
    name: 'PD US Gov',
    long: 'US Government work (17 U.S.C. §105)',
    full: "This work is in the public domain in the United States because it is a work prepared by an officer or employee of the United States Government as part of that person's official duties under Title 17, Chapter 1, Section 105 of the US Code.",
  },
  pdown: {
    name: 'PD by holder',
    long: 'Dedicated to the public domain by the copyright holder',
    full: 'This work has been dedicated to the public domain by the copyright holder.',
  },
};

export const getPdRationaleMeta = (id: string): IPdRationaleMeta =>
  PD_RATIONALE_REGISTRY[id] ?? { name: id };
