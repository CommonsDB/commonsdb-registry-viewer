'use client';

import Image from 'next/image';

import { Section } from '~/components/molecules';
import { site } from '~/config/site';
import { useTranslation } from '~/shared/utils/i18n/client';

/** Explorer landing view, shown before a search has been made. */
export default function ExplorerPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <Section
        title={t('home.hero.title')}
        content={
          <>
            <p className="mb-1 text-paper-700">{t('home.hero.description.part1')}</p>
            <p className="text-paper-700">{t('home.hero.description.part2')}</p>
          </>
        }
        image={<Image src={site.heroImage} alt="" priority />}
        sectionClassName="flex bg-white"
      />
    </div>
  );
}
