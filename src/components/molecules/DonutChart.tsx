'use client';

import { type FC, useMemo } from 'react';
import clsx from 'clsx';
import type { IStatisticsDistributionItem } from '~/api/types/statistics';
import { fmtStatCompact, fmtStatPct } from '~/shared/utils';

interface IDonutChartProps {
  items: IStatisticsDistributionItem[];
  total: number;
  /** Index of the currently-hovered slice (shared with DonutLegend). */
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}

const RADIUS = 96;
const STROKE = 32;
const HOVER_STROKE = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 0.006 * CIRCUMFERENCE;

export const DonutChart: FC<IDonutChartProps> = ({ items, total, hoveredIndex, onHoverChange }) => {
  const segments = useMemo(() => {
    let cursor = 0;
    return items.map((item) => {
      const fraction = total > 0 ? item.value / total : 0;
      const rawLength = fraction * CIRCUMFERENCE;
      // The inter-slice gap is only subtracted when the slice can afford it —
      // otherwise a sliver would collapse to nothing.
      const length = rawLength > GAP ? rawLength - GAP : rawLength;
      const segment = {
        ...item,
        fraction,
        length,
        offset: cursor,
      };
      cursor += rawLength;
      return segment;
    });
  }, [items, total]);

  const hovered = hoveredIndex != null ? segments[hoveredIndex] : null;
  const hasSelection = hovered != null;

  return (
    <div className="relative size-60">
      <svg viewBox="-120 -120 240 240" className="size-full overflow-visible">
        {segments.map((seg, i) =>
          seg.fraction === 0 ? null : (
            <circle
              key={seg.id}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeDasharray={`${Math.max(0.01, seg.length)} ${CIRCUMFERENCE - seg.length}`}
              strokeDashoffset={-seg.offset}
              transform="rotate(-90)"
              onMouseEnter={() => onHoverChange(i)}
              onMouseLeave={() => onHoverChange(null)}
              className={clsx(
                'cursor-pointer transition-[stroke-width,opacity] duration-200',
                hasSelection && hoveredIndex !== i && 'opacity-[0.22]',
              )}
              style={{
                strokeWidth: hoveredIndex === i ? HOVER_STROKE : STROKE,
                strokeLinecap: 'butt',
              }}
            />
          ),
        )}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute inset-0 grid place-content-center px-7 text-center">
          <div className="text-balance break-words text-base font-semibold leading-tight text-paper-950">
            {hovered.name}
          </div>
          <div className="mt-1.5 text-xs tabular-nums text-paper-300">
            {fmtStatPct(hovered.fraction, 1)} · {fmtStatCompact(hovered.value)}
          </div>
        </div>
      )}
    </div>
  );
};
