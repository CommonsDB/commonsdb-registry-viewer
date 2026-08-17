import { describe, expect, it } from 'vitest';

import { transformDeclarationsOverTime } from './transformDeclarationsOverTime';

const source = {
  granularity: 'monthly' as const,
  buckets: [
    { label: 'Jan', bucketStart: '2024-01-01' },
    { label: 'Feb', bucketStart: '2024-02-01' },
    { label: 'Mar', bucketStart: '2024-03-01' },
    { label: 'Apr', bucketStart: '2024-04-01' },
  ],
  series: [{ supplierId: 'wikimedia-se', values: [1, 2, 3, 4] }],
};

describe('transformDeclarationsOverTime', () => {
  it('passes monthly data through untouched', () => {
    expect(transformDeclarationsOverTime(source, 'monthly')).toEqual({
      buckets: source.buckets,
      series: source.series,
    });
  });

  it('labels quarters from UTC dates', () => {
    // 2024-04-01 parses as UTC; local getters would label it Q1 west of UTC.
    const { buckets } = transformDeclarationsOverTime(source, 'quarterly');

    expect(buckets.map((bucket) => bucket.label)).toEqual(["Q1 '24", "Q2 '24"]);
  });

  it('sums values per calendar quarter', () => {
    const { series } = transformDeclarationsOverTime(source, 'quarterly');

    expect(series[0].values).toEqual([6, 4]);
  });

  it('groups by calendar quarter even when the series starts mid-quarter', () => {
    const midQuarter = {
      granularity: 'monthly' as const,
      buckets: [
        { label: 'Feb', bucketStart: '2024-02-01' },
        { label: 'Mar', bucketStart: '2024-03-01' },
        { label: 'Apr', bucketStart: '2024-04-01' },
      ],
      series: [{ supplierId: 's', values: [1, 1, 1] }],
    };

    const { buckets, series } = transformDeclarationsOverTime(midQuarter, 'quarterly');

    expect(buckets.map((bucket) => bucket.label)).toEqual(["Q1 '24", "Q2 '24"]);
    expect(series[0].values).toEqual([2, 1]);
  });

  it('accumulates a running total for the cumulative view', () => {
    const { series } = transformDeclarationsOverTime(source, 'cumulative');

    expect(series[0].values).toEqual([1, 3, 6, 10]);
  });
});
