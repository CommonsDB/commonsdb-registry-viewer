'use client';

import type { FC } from 'react';
import { usePathname } from 'next/navigation';

import { LandingContainer, PageTitle } from '~/components/atoms';
import { toCamelCase } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

/** Page header showing the title of the current section. */
export const Header: FC = () => {
  const { t } = useTranslation();
  const section = usePathname()?.split('/')[1] ?? '';

  return (
    <LandingContainer className="sticky top-0 z-50 bg-aside-header-primary">
      <div className="flex h-landingHeaderHeight items-center justify-between">
        <PageTitle>{t(`pageTitle.${toCamelCase(section)}`)}</PageTitle>
      </div>
    </LandingContainer>
  );
};
