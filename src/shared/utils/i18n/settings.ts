import type { InitOptions } from 'i18next';

export const FALLBACK_LOCALE = 'en';

/**
 * Locales with a complete translation file under `locales/`.
 *
 * Adding a language means adding `locales/<code>/common.json` and listing the
 * code here — nothing else in the app is locale-aware.
 */
export const supportedLocales = ['en'] as const;
export type Locales = (typeof supportedLocales)[number];

/** Cookie the locale is read from and written to. */
export const LANGUAGE_COOKIE = 'preferred_language';

/** Single translation namespace; every key lives in `common.json`. */
export const NAMESPACE = 'common';

export function getOptions(lang: string = FALLBACK_LOCALE): InitOptions {
  return {
    supportedLngs: supportedLocales,
    fallbackLng: FALLBACK_LOCALE,
    lng: lang,
    ns: NAMESPACE,
    defaultNS: NAMESPACE,
  };
}
