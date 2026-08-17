'use client';

import { type FC, useMemo, useState } from 'react';
import clsx from 'clsx';
import type {
  IStatisticsSupplier,
  IStatisticsTimeBucket,
  IStatisticsTimeSeries,
} from '~/api/types/statistics';
import { fmtStatCompact, fmtStatNum } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

interface IStackedBarsChartProps {
  buckets: IStatisticsTimeBucket[];
  series: IStatisticsTimeSeries[];
  suppliers: IStatisticsSupplier[];
  /** When non-null, only these supplier ids contribute to the rendered stacks. */
  activeIds: string[] | null;
}

const niceMaxOf = (max: number): number => {
  if (max <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const step = Math.ceil(max / pow / 5) * pow;
  const nice = Math.ceil(max / step) * step;
  // The axis draws ticks at quarters; a max divisible by 4 keeps the rounded
  // tick labels aligned with their actual positions.
  return Math.ceil(nice / 4) * 4;
};

/** First bar: anchor left; last bar: anchor right; others stay centered. */
const tooltipPositionClass = (index: number, count: number): string => {
  if (index === 0) return 'left-0';
  if (index === count - 1) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
};

export const StackedBarsChart: FC<IStackedBarsChartProps> = ({
  buckets,
  series,
  suppliers,
  activeIds,
}) => {
  const { t } = useTranslation();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const activeSet = useMemo(
    () =>
      activeIds && activeIds.length ? new Set(activeIds) : new Set(suppliers.map((s) => s.id)),
    [activeIds, suppliers],
  );

  const seriesById = useMemo(() => {
    const map = new Map<string, number[]>();
    series.forEach((s) => map.set(s.supplierId, s.values));
    return map;
  }, [series]);

  const stacks = useMemo(
    () =>
      buckets.map((bucket, i) => {
        const parts = suppliers.map((s) => {
          const raw = seriesById.get(s.id)?.[i] ?? 0;
          return {
            id: s.id,
            name: s.name,
            color: s.color,
            value: activeSet.has(s.id) ? raw : 0,
          };
        });
        const total = parts.reduce((a, b) => a + b.value, 0);
        return { bucket, parts, total };
      }),
    [buckets, suppliers, seriesById, activeSet],
  );

  const niceMax = useMemo(() => niceMaxOf(Math.max(1, ...stacks.map((s) => s.total))), [stacks]);

  const ticks = useMemo(
    () =>
      [0, 0.25, 0.5, 0.75, 1].map((p) => ({
        p,
        v: Math.round(niceMax * p),
      })),
    [niceMax],
  );

  return (
    <div className="relative grid h-80 gap-2.5" style={{ gridTemplateColumns: '48px 1fr' }}>
      <div className="relative text-[11px] text-paper-300">
        {ticks.map((tick) => (
          <div
            key={tick.p}
            className="absolute right-0 -translate-y-1/2 tabular-nums"
            style={{ top: `${(1 - tick.p) * 100}%` }}
          >
            {fmtStatCompact(tick.v)}
          </div>
        ))}
      </div>

      <div className="relative border-b border-l border-paper-200">
        <div className="pointer-events-none absolute inset-0">
          {ticks.map((tick) => (
            <div
              key={tick.p}
              className="absolute inset-x-0 border-t border-dashed border-black/10"
              style={{ top: `${(1 - tick.p) * 100}%` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-stretch px-0.5">
          {stacks.map((stack, i) => (
            <div
              key={`${stack.bucket.label}-${i}`}
              className="relative mx-0.5 flex h-full flex-1 cursor-pointer flex-col-reverse"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
            >
              {stack.parts
                .filter((p) => p.value > 0)
                .map((p, segIdx) => (
                  <div
                    key={p.id}
                    className={clsx(
                      'w-full transition-[height,opacity] duration-300',
                      segIdx === stack.parts.filter((x) => x.value > 0).length - 1 &&
                        'rounded-t-[2px]',
                    )}
                    style={{
                      background: p.color,
                      height: `${(p.value / niceMax) * 100}%`,
                      opacity: hoverIdx === i ? 0.92 : 1,
                    }}
                    title={p.name}
                  />
                ))}

              {hoverIdx === i && (
                <div
                  className={clsx(
                    'pointer-events-none absolute z-20 -mt-2.5 min-w-[280px] -translate-y-full rounded-md bg-aside-primary px-3 py-2.5 text-xs leading-relaxed text-white shadow-tooltip',
                    tooltipPositionClass(i, stacks.length),
                  )}
                >
                  <div className="mb-1 flex justify-between gap-3.5 opacity-70">
                    <span>{stack.bucket.label}</span>
                    <span />
                  </div>
                  {stack.parts
                    .filter((p) => p.value > 0)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between gap-3.5 tabular-nums"
                        style={{ opacity: activeSet.has(p.id) ? 1 : 0.4 }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block size-2 rounded-sm align-middle"
                            style={{ background: p.color }}
                          />
                          {p.name}
                        </span>
                        <span>{fmtStatNum(p.value)}</span>
                      </div>
                    ))}
                  <div className="mt-1.5 flex justify-between gap-3.5 border-t border-white/15 pt-1.5 font-semibold tabular-nums">
                    <span>{t('statistics.chart.total')}</span>
                    <span>{fmtStatNum(stack.total)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-full mt-2.5 flex px-0.5 text-[11px] text-paper-300">
          {stacks.map((stack, i) => (
            <span
              key={`${stack.bucket.label}-x-${i}`}
              className="mx-0.5 flex-1 whitespace-nowrap text-center"
            >
              {i % 2 === 0 ? stack.bucket.label : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
