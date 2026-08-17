'use client';

import { type FC } from 'react';
import { useTranslation } from '~/shared/utils/i18n/client';
import { HorizontalBarsChart, StatisticsCard } from '~/components/molecules';
import type { IStatisticsPdRationaleItem } from '~/api/types/statistics';
import { STATISTICS_PD_RATIONALE_BAR_COLOR } from '~/shared/constants';

interface IPdRationalePanelProps {
  items: IStatisticsPdRationaleItem[];
  total: number;
}

export const PdRationalePanel: FC<IPdRationalePanelProps> = ({ items, total }) => {
  const { t } = useTranslation();

  return (
    <StatisticsCard
      title={t('statistics.pdRationale.title')}
      description={t('statistics.pdRationale.description')}
    >
      <HorizontalBarsChart
        items={items}
        total={total}
        barColor={STATISTICS_PD_RATIONALE_BAR_COLOR}
      />
    </StatisticsCard>
  );
};
