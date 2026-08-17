import { MdDescription, MdHome, MdInsertChart, MdMenuBook, MdViewList } from 'react-icons/md';
import type { IconType } from 'react-icons/lib';

import { ROUTES } from '~/shared/constants';

import { externalLinks } from './site';

export interface NavigationItem {
  Icon: IconType;
  /** Translation key resolved at render time. */
  text: string;
  path: string;
  /** External links open in a new tab and are grouped below the internal ones. */
  isExternal?: boolean;
}

/** Sidebar navigation, in display order. */
export const navigation: readonly NavigationItem[] = [
  {
    Icon: MdHome,
    text: 'btn.explorer',
    path: ROUTES.EXPLORER,
  },
  {
    Icon: MdViewList,
    text: 'btn.randomDeclarations',
    path: ROUTES.RANDOM_DECLARATIONS,
  },
  {
    Icon: MdInsertChart,
    text: 'btn.statistics',
    path: ROUTES.STATISTICS,
  },
  {
    Icon: MdMenuBook,
    text: 'btn.aboutCommonsDb',
    path: externalLinks.about,
    isExternal: true,
  },
  {
    Icon: MdDescription,
    text: 'btn.documentation',
    path: externalLinks.documentation,
    isExternal: true,
  },
] as const;
