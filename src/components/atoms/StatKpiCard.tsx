'use client';

import { type FC } from 'react';
import clsx from 'clsx';
import { useCountUp } from '~/hooks';
import { fmtStatDelta, fmtStatNum } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

interface IStatKpiCardProps {
  label: string;
  value: number;
  delta?: number;
  periodDays: number;
  percent?: boolean;
  integer?: boolean;
}

export const StatKpiCard: FC<IStatKpiCardProps> = ({
  label,
  value,
  delta,
  periodDays,
  percent,
  integer,
}) => {
  const { t } = useTranslation();
  const animated = useCountUp(value);

  let display: string;
  let suffix: string | null = null;

  if (percent) {
    display = (animated * 100).toFixed(1).replace('.', ',');
    suffix = '%';
  } else if (integer) {
    display = String(Math.round(animated));
  } else {
    display = fmtStatNum(animated);
  }

  const isUp = (delta ?? 0) >= 0;

  return (
    <div className="rounded-[10px] border border-paper-200 bg-white px-6 py-5">
      <div className="mb-3 text-xs font-medium text-paper-300">{label}</div>
      <div className="mb-2 text-[42px] font-bold tabular-nums leading-none tracking-tight text-paper-950">
        {display}
        {suffix && <span className="ml-0.5 text-2xl text-paper-700">{suffix}</span>}
      </div>
      {delta !== undefined && (
        <div
          className={clsx(
            'inline-flex items-center gap-1.5 text-xs font-medium',
            isUp ? 'text-green-500' : 'text-raspberry-500',
          )}
        >
          <span aria-hidden>{isUp ? '↑' : '↓'}</span>
          <span>{fmtStatDelta(delta)}</span>
          <span className="ml-1 font-normal text-paper-300">
            {t('statistics.kpi.deltaPeriod', { days: periodDays })}
          </span>
        </div>
      )}
    </div>
  );
};
