'use client';

import type { FC } from 'react';
import { MdWarning } from 'react-icons/md';

import { externalLinks } from '~/config/site';
import { useTranslation } from '~/shared/utils/i18n/client';

import { Card } from './Card';
import { StaticCounter } from './StaticCounter';

/** Live declaration count and the early-release disclaimer. */
export const SidebarApiCard: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Card
        label={t('declarationsChecked')}
        // 15px + nowrap: at 16px the label wraps when the sidebar's classic
        // scrollbar (15px) shrinks the card below the text's natural width.
        titleClass="text-aside-text text-center !text-[15px] whitespace-nowrap"
        backgroundColor="bg-aside-card"
        mainTextColor="text-aside-card-content"
        borderColor="border-aside-card-border"
        positionClass="!gap-2"
        content={<StaticCounter className="text-paper-950" />}
      />
      <Card
        content={t('disclaimer.description')}
        link={externalLinks.documentation}
        linkLabel={t('btn.documentation')}
        backgroundColor="bg-aside-card"
        mainTextColor="text-aside-card-content"
        borderColor="border-aside-card-border"
        linkColor="text-aside-card-link"
        positionClass="!gap-2 items-start"
        additionalContent={
          <div className="flex items-center gap-1">
            <MdWarning size={16} className="text-warning" />
            <p className="font-semibold text-paper-950">{t('disclaimer.title')}</p>
          </div>
        }
      />
    </div>
  );
};
