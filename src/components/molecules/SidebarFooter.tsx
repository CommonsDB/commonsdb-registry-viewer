'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Divider } from '~/components/atoms';
import { externalLinks, site } from '~/config/site';
import { useTranslation } from '~/shared/utils/i18n/client';

import CoFundedByEULogo from '../../../public/co-funded-by-eu-logo.svg';
import OperatorLogo from '../../../public/liccium-nav-logo-32.svg';

/** Funding acknowledgement and operator attribution. */
export const SidebarFooter: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col px-2">
      <div className="my-4 flex w-full flex-col text-aside-text">
        <Image src={CoFundedByEULogo} height={32} alt="Co-funded by the European Union" />
        <p className="mt-2 text-xs text-paper-300">{t('sidebar.coFundedByEu')}</p>
      </div>
      <Divider />
      <Link
        href={externalLinks.operator}
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 flex w-full flex-col gap-2 text-aside-text transition-opacity hover:opacity-80"
      >
        <div className="flex w-full flex-row items-center gap-1">
          <Image
            src={OperatorLogo}
            height={32}
            alt="Liccium"
            className={site.invertFooterLogo ? 'brightness-0 invert' : ''}
          />
          <p className="text-[13.8px] font-semibold">Liccium</p>
        </div>
        <p className="text-xs text-paper-300">{t('sidebar.poweredBy')}</p>
      </Link>
    </div>
  );
};
