'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { navigation } from '~/config/navigation';
import { site } from '~/config/site';
import { HOME_ROUTE } from '~/shared/constants';
import { matchPath } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

import { SidebarNavItem } from './SidebarNavItem';

const NAV_ICON_STYLES = 'ml-2 mr-2 h-6 w-6';

interface SidebarHeaderProps {
  /** Current pathname, used to highlight the active item. */
  pathName: string;
}

/** Registry logo and primary navigation. */
export const SidebarHeader: FC<SidebarHeaderProps> = ({ pathName }) => {
  const { t } = useTranslation();

  // External destinations are grouped after the in-app pages.
  const internalItems = navigation.filter((item) => !item.isExternal);
  const externalItems = navigation.filter((item) => item.isExternal);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Link href={HOME_ROUTE}>
        <Image src={site.navLogo} height={100} alt={site.name} />
      </Link>
      <div className="flex w-full flex-col items-center gap-2">
        {[...internalItems, ...externalItems].map(({ Icon, text, path, isExternal }) => (
          <SidebarNavItem
            key={path}
            icon={<Icon className={NAV_ICON_STYLES} />}
            text={t(text)}
            path={path}
            isActive={!isExternal && matchPath(pathName, path)}
            isExternal={isExternal}
          />
        ))}
      </div>
    </div>
  );
};
