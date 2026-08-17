'use client';

import { type FC, useState } from 'react';
import { DonutChart, DonutLegend, StatisticsCard } from '~/components/molecules';
import type { IStatisticsDistributionItem } from '~/api/types/statistics';

interface IDistributionPanelProps {
  title: string;
  description?: string;
  items: IStatisticsDistributionItem[];
  total: number;
}

export const DistributionPanel: FC<IDistributionPanelProps> = ({
  title,
  description,
  items,
  total,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <StatisticsCard title={title} description={description}>
      <div className="grid items-center gap-7" style={{ gridTemplateColumns: '1fr 240px' }}>
        <DonutLegend
          items={items}
          total={total}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        />
        <DonutChart
          items={items}
          total={total}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        />
      </div>
    </StatisticsCard>
  );
};
