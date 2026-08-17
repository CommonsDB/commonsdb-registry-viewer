import { cookies } from 'next/headers';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { FALLBACK_LOCALE, getOptions, LANGUAGE_COOKIE, type Locales, NAMESPACE } from './settings';

async function initI18next(lang: Locales) {
  const instance = createInstance();

  await instance
    .use(initReactI18next)
    .use(resourcesToBackend((lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`)))
    .init(getOptions(lang));

  return instance;
}

/** Translation function for server components. */
export async function createTranslation() {
  const lang = getLocale();
  const instance = await initI18next(lang);

  return { t: instance.getFixedT(lang, NAMESPACE) };
}

/** Resolves the request's locale from the language cookie. */
export function getLocale(): Locales {
  return (cookies().get(LANGUAGE_COOKIE)?.value ?? FALLBACK_LOCALE) as Locales;
}
