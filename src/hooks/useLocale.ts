import { useContext } from 'react';

import { LocaleContext } from '~/components/providers';

export const useLocale = () => {
  return useContext(LocaleContext);
};
