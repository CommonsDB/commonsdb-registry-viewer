'use client';

import { type FC, useMemo } from 'react';
import clsx from 'clsx';
import type { IStatisticsSupplier, IStatisticsTimeSeries } from '~/api/types/statistics';
import type { TStatisticsViewGranularity } from '~/shared/utils';
import { fmtStatCompact } from '~/shared/utils';

interface ISupplierIndexProps {
  suppliers: IStatisticsSupplier[];
  series: IStatisticsTimeSeries[];
  /** When non-null, suppliers not in this set are visually dimmed. */
  activeIds: string[] | null;
  granularity: TStatisticsViewGranularity;
}

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const SupplierIndex: FC<ISupplierIndexProps> = ({
  suppliers,
  series,
  activeIds,
  granularity,
}) => {
  const activeSet = useMemo(
    () => (activeIds && activeIds.length ? new Set(activeIds) : null),
    [activeIds],
  );

  const totalsById = useMemo(() => {
    const map = new Map<string, number>();
    series.forEach((s) => {
      const total =
        granularity === 'cumulative' ? s.values[s.values.length - 1] ?? 0 : sum(s.values);
      map.set(s.supplierId, total);
    });
    return map;
  }, [series, granularity]);

  return (
    <div className="mt-11 flex flex-col gap-1.5 text-[12.5px]">
      {suppliers.map((s) => (
        <div
          key={s.id}
          className={clsx(
            'grid items-center gap-2.5 text-paper-700',
            activeSet && !activeSet.has(s.id) && 'opacity-40',
          )}
          style={{ gridTemplateColumns: '10px 1fr auto' }}
        >
          <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
          <span>{s.name}</span>
          <span className="text-xs tabular-nums text-paper-300">
            {fmtStatCompact(totalsById.get(s.id) ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
};
