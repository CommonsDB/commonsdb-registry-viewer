'use client';

import { type FC } from 'react';
import { StatKpiCard } from '~/components/atoms';
import type { IStatisticsKpiValue } from '~/api/types/statistics';
import { useTranslation } from '~/shared/utils/i18n/client';

interface IStatisticsKpisProps {
  declarations: IStatisticsKpiValue;
  suppliers: IStatisticsKpiValue;
}

export const StatisticsKpis: FC<IStatisticsKpisProps> = ({ declarations, suppliers }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      <StatKpiCard
        label={t('statistics.kpi.totalDeclarations')}
        value={declarations.value}
        delta={declarations.delta}
        periodDays={declarations.periodDays}
        percent={declarations.percent}
        integer={declarations.integer}
      />
      <StatKpiCard
        label={t('statistics.kpi.dataSuppliers')}
        value={suppliers.value}
        delta={suppliers.delta}
        periodDays={suppliers.periodDays}
        percent={suppliers.percent}
        integer={suppliers.integer ?? true}
      />
    </div>
  );
};
