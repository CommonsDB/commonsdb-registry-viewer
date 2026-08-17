'use client';

import { type FC, useMemo } from 'react';
import type { IStatisticsPdRationaleItem } from '~/api/types/statistics';
import { fmtStatNum, fmtStatPct } from '~/shared/utils';
import { InfoTooltip } from '~/components/atoms';
import { STATISTICS_PD_RATIONALE_BAR_COLOR } from '~/shared/constants';

interface IHorizontalBarsChartProps {
  items: IStatisticsPdRationaleItem[];
  total: number;
  /** CSS color used for every bar's fill (single-color ranking). */
  barColor?: string;
}

const INSIDE_LABEL_THRESHOLD = 0.18;

export const HorizontalBarsChart: FC<IHorizontalBarsChartProps> = ({
  items,
  total,
  barColor = STATISTICS_PD_RATIONALE_BAR_COLOR,
}) => {
  const sorted = useMemo(() => [...items].sort((a, b) => b.value - a.value), [items]);
  const max = useMemo(() => Math.max(1, ...sorted.map((i) => i.value)), [sorted]);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((item, idx) => {
        const fillFrac = item.value / max;
        const ofTotal = total > 0 ? item.value / total : 0;
        const showInside = fillFrac > INSIDE_LABEL_THRESHOLD;

        return (
          <div
            key={item.id}
            className="grid items-center gap-4 text-[13px]"
            style={{ gridTemplateColumns: '260px 1fr 110px' }}
          >
            <div className="grid items-start gap-2.5" style={{ gridTemplateColumns: '22px 1fr' }}>
              <span className="pt-0.5 text-[11.5px] font-medium tabular-nums text-paper-300">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-snug text-paper-950">
                  {item.name}
                  {item.full && <InfoTooltip content={item.full} align="start" />}
                </span>
                {item.long && (
                  <div className="mt-0.5 text-xs font-normal leading-snug text-paper-300">
                    {item.long}
                  </div>
                )}
              </div>
            </div>

            <div className="relative h-[22px] rounded bg-paper-50">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-end rounded pr-2 transition-[width] duration-500"
                style={{
                  width: `${fillFrac * 100}%`,
                  background: barColor,
                }}
              >
                {showInside && (
                  <span className="text-[11px] font-medium tabular-nums text-white">
                    {fmtStatPct(ofTotal, 1)}
                  </span>
                )}
              </div>
              {!showInside && (
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums text-paper-700"
                  style={{ left: `calc(${fillFrac * 100}% + 6px)` }}
                >
                  {fmtStatPct(ofTotal, 1)}
                </span>
              )}
            </div>

            <div className="text-right text-[12.5px] tabular-nums text-paper-700">
              {fmtStatNum(item.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
