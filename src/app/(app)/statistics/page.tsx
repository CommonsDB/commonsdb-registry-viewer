'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '~/shared/utils/i18n/client';
import { SupplierFilterBar } from '~/components/molecules';
import {
  DeclarationsOverTime,
  DistributionPanel,
  PdRationalePanel,
  StatisticsKpis,
} from '~/components/organisms';
import {
  enrichLicenseDistribution,
  enrichMediaDistribution,
  enrichPdRationale,
  enrichStatisticsSuppliers,
  mergeStatisticsBySupplier,
  selectLicenseDistribution,
  selectMediaDistribution,
  selectPdRationale,
  type TStatisticsViewGranularity,
} from '~/shared/utils';
import { useStatisticsQuery } from '~/api/queries';
import type { IGetStatisticsResponse } from '~/api/types/statistics';

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

const minutesAgo = (iso: string): number => {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 60_000));
};

const StatisticsLoadingSpinner = () => (
  <div className="flex size-full min-w-minWidthEntryList items-center justify-center">
    <div className="size-6 animate-spin rounded-full border-b-2 border-raspberry-500" />
  </div>
);

export default function StatisticsPage() {
  const { data, isError } = useStatisticsQuery();
  const { t } = useTranslation();

  if (isError) {
    return (
      <div className="flex size-full min-w-minWidthEntryList items-center justify-center">
        <p className="text-danger">{t('error.loadFailed')}</p>
      </div>
    );
  }

  if (!data) {
    return <StatisticsLoadingSpinner />;
  }

  return <StatisticsPageContent data={data} />;
}

function StatisticsPageContent({ data }: { data: IGetStatisticsResponse }) {
  const { t } = useTranslation();

  const stats = useMemo(() => mergeStatisticsBySupplier(data), [data]);

  const suppliers = useMemo(() => enrichStatisticsSuppliers(stats.suppliers), [stats.suppliers]);
  const overview = stats.overview;
  const timeSeries = stats.declarationsOverTime;

  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [granularity, setGranularity] = useState<TStatisticsViewGranularity>('monthly');

  const isAll = selectedSupplierIds.length === 0;
  // `null` selection means "all suppliers"; otherwise the chosen canonical ids.
  const selectionIds = isAll ? null : selectedSupplierIds;
  const activeIds = useMemo(
    () => (isAll ? suppliers.map((s) => s.id) : selectedSupplierIds),
    [isAll, suppliers, selectedSupplierIds],
  );

  // Exact per-declarer declaration totals come straight from the time series.
  const declarationsTotal = useMemo(() => {
    if (isAll) return overview.declarations.value;
    const totalById = new Map(timeSeries.series.map((s) => [s.supplierId, sum(s.values)]));
    return sum(activeIds.map((id) => totalById.get(id) ?? 0));
  }, [isAll, activeIds, overview.declarations.value, timeSeries.series]);

  // The delta/trend comes from the aggregate overview, so it is only shown for
  // the all-suppliers view — a per-supplier count with a global trend would lie.
  const filteredKpis = useMemo(
    () => ({
      declarations: {
        ...overview.declarations,
        value: declarationsTotal,
        delta: isAll ? overview.declarations.delta : undefined,
      },
      suppliers: {
        ...overview.suppliers,
        value: isAll ? overview.suppliers.value : activeIds.length,
        delta: isAll ? overview.suppliers.delta : undefined,
      },
    }),
    [overview, declarationsTotal, isAll, activeIds],
  );

  const licenseData = useMemo(
    () => enrichLicenseDistribution(selectLicenseDistribution(stats, selectionIds)),
    [stats, selectionIds],
  );
  const mediaData = useMemo(
    () => enrichMediaDistribution(selectMediaDistribution(stats, selectionIds)),
    [stats, selectionIds],
  );
  const pdRationaleData = useMemo(
    () => enrichPdRationale(selectPdRationale(stats, selectionIds)),
    [stats, selectionIds],
  );

  const [updatedMin, setUpdatedMin] = useState(0);
  useEffect(() => {
    setUpdatedMin(minutesAgo(overview.updatedAt));
    const id = setInterval(() => setUpdatedMin(minutesAgo(overview.updatedAt)), 30_000);
    return () => clearInterval(id);
  }, [overview.updatedAt]);

  return (
    <div className="flex size-full min-w-minWidthEntryList flex-col gap-3.5">
      <div className="-mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-paper-700">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          {t('statistics.meta.live')}
        </span>
        <span>{t('statistics.meta.updatedAgo', { minutes: updatedMin })}</span>
      </div>

      <SupplierFilterBar
        suppliers={suppliers}
        selectedIds={selectedSupplierIds}
        onChange={setSelectedSupplierIds}
      />

      <StatisticsKpis declarations={filteredKpis.declarations} suppliers={filteredKpis.suppliers} />

      <DeclarationsOverTime
        data={timeSeries}
        suppliers={suppliers}
        activeIds={isAll ? null : activeIds}
        granularity={granularity}
        onGranularityChange={setGranularity}
      />

      <DistributionPanel
        title={t('statistics.licenseChart.title')}
        description={t('statistics.licenseChart.description')}
        items={licenseData.items}
        total={licenseData.total}
      />

      <DistributionPanel
        title={t('statistics.mediaChart.title')}
        description={t('statistics.mediaChart.description')}
        items={mediaData.items}
        total={mediaData.total}
      />

      <PdRationalePanel items={pdRationaleData.items} total={pdRationaleData.total} />
    </div>
  );
}
