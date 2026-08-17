'use client';

import { type FC } from 'react';
import clsx from 'clsx';
import type { IStatisticsDistributionItem } from '~/api/types/statistics';
import { fmtStatCompact, fmtStatPct } from '~/shared/utils';

interface IDonutLegendProps {
  items: IStatisticsDistributionItem[];
  total: number;
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}

export const DonutLegend: FC<IDonutLegendProps> = ({
  items,
  total,
  hoveredIndex,
  onHoverChange,
}) => (
  <div className="text-[13px]">
    {items.map((item, i) => {
      const fraction = total > 0 ? item.value / total : 0;
      const isDimmed = hoveredIndex != null && hoveredIndex !== i;
      return (
        <div
          key={item.id}
          onMouseEnter={() => onHoverChange(i)}
          onMouseLeave={() => onHoverChange(null)}
          className={clsx(
            'grid cursor-pointer items-baseline gap-2.5 rounded border-b border-paper-200 px-1 py-2 last:border-b-0 hover:bg-paper-50',
            isDimmed && 'opacity-40',
          )}
          style={{ gridTemplateColumns: '12px 1fr auto auto' }}
        >
          <span className="size-3 rounded-[3px]" style={{ background: item.color }} />
          <span className="font-medium text-paper-950">{item.name}</span>
          <span className="text-[12.5px] tabular-nums text-paper-700">
            {fmtStatPct(fraction, 1)}
          </span>
          <span className="min-w-[70px] text-right text-xs tabular-nums text-paper-300">
            {fmtStatCompact(item.value)}
          </span>
        </div>
      );
    })}
  </div>
);
