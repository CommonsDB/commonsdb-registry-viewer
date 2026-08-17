'use client';

import { useEffect } from 'react';
import i18next, { type i18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next, useTranslation as useI18nextTranslation } from 'react-i18next';

import { useLocale } from '~/hooks';

import { getOptions, LANGUAGE_COOKIE, type Locales, NAMESPACE, supportedLocales } from './settings';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // detect on the client
    detection: {
      order: ['cookie'],
      lookupCookie: LANGUAGE_COOKIE,
      caches: ['cookie'],
    },
    preload: runsOnServerSide ? supportedLocales : [],
  });

/**
 * Client-side translation hook.
 *
 * Keys are plain dotted paths into `common.json` — `t('column.declarer')`.
 */
export function useTranslation() {
  const lng = useLocale();
  const { t, i18n } = useI18nextTranslation(NAMESPACE);

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- runsOnServerSide is constant for the lifetime of a bundle
    useSyncLanguage(i18n, lng);
  }

  return { t, i18n };
}

/** Keeps i18next in sync with the locale resolved by the server. */
function useSyncLanguage(i18n: i18n, lng: Locales) {
  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return;
    i18n.changeLanguage(lng);
  }, [lng, i18n]);
}
