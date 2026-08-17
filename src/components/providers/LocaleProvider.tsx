'use client';

import { createContext } from 'react';

import { FALLBACK_LOCALE, type Locales } from '~/shared/utils/i18n/settings';

export const LocaleContext = createContext<Locales>(FALLBACK_LOCALE);

export function LocaleProvider({ children, value }: { children: React.ReactNode; value: Locales }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
