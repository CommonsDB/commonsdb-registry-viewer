'use client';

import { type FC, useMemo } from 'react';
import { SegmentedControl, type ISegmentedControlOption } from '~/components/atoms';
import { StackedBarsChart, StatisticsCard, SupplierIndex } from '~/components/molecules';
import type { IGetDeclarationsOverTimeResponse, IStatisticsSupplier } from '~/api/types/statistics';
import { transformDeclarationsOverTime, type TStatisticsViewGranularity } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

interface IDeclarationsOverTimeProps {
  data: IGetDeclarationsOverTimeResponse;
  suppliers: IStatisticsSupplier[];
  activeIds: string[] | null;
  granularity: TStatisticsViewGranularity;
  onGranularityChange: (next: TStatisticsViewGranularity) => void;
}

export const DeclarationsOverTime: FC<IDeclarationsOverTimeProps> = ({
  data,
  suppliers,
  activeIds,
  granularity,
  onGranularityChange,
}) => {
  const { t } = useTranslation();

  const transformed = useMemo(
    () => transformDeclarationsOverTime(data, granularity),
    [data, granularity],
  );

  const options: ReadonlyArray<ISegmentedControlOption<TStatisticsViewGranularity>> = [
    { value: 'monthly', label: t('statistics.timeChart.granularity.monthly') },
    { value: 'quarterly', label: t('statistics.timeChart.granularity.quarterly') },
    { value: 'cumulative', label: t('statistics.timeChart.granularity.cumulative') },
  ];

  const description = t(`statistics.timeChart.description.${granularity}`);

  return (
    <StatisticsCard
      title={t('statistics.timeChart.title')}
      description={description}
      headerRight={
        <SegmentedControl<TStatisticsViewGranularity>
          value={granularity}
          options={options}
          onChange={onGranularityChange}
          ariaLabel={t('statistics.timeChart.granularity.ariaLabel')}
        />
      }
    >
      <StackedBarsChart
        buckets={transformed.buckets}
        series={transformed.series}
        suppliers={suppliers}
        activeIds={activeIds}
      />
      <SupplierIndex
        suppliers={suppliers}
        series={transformed.series}
        activeIds={activeIds}
        granularity={granularity}
      />
    </StatisticsCard>
  );
};
