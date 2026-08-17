'use client';

import { type FC, type ReactNode } from 'react';

interface IStatisticsCardProps {
  title: string;
  description?: string;
  /** Optional content placed to the right of the heading row (e.g. a SegmentedControl). */
  headerRight?: ReactNode;
  children: ReactNode;
}

export const StatisticsCard: FC<IStatisticsCardProps> = ({
  title,
  description,
  headerRight,
  children,
}) => (
  <section className="rounded-[10px] border border-paper-200 bg-white p-6">
    <header className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[17px] font-semibold tracking-tight text-paper-950">{title}</h2>
        {description && (
          <p className="mt-1 max-w-[62ch] text-[13px] text-paper-300">{description}</p>
        )}
      </div>
      {headerRight}
    </header>
    {children}
  </section>
);
