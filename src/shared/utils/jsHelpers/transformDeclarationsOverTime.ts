import type {
  IGetDeclarationsOverTimeResponse,
  IStatisticsTimeBucket,
  IStatisticsTimeSeries,
} from '~/api/types/statistics';

export type TStatisticsViewGranularity = 'monthly' | 'quarterly' | 'cumulative';

export interface ITransformedDeclarationsOverTime {
  buckets: IStatisticsTimeBucket[];
  series: IStatisticsTimeSeries[];
}

/**
 * Groups monthly buckets into calendar quarters.
 *
 * Bucket dates are ISO strings, which `Date` parses as UTC — so the quarter is
 * derived with UTC getters. Local getters would shift `2024-04-01` to March for
 * any viewer west of UTC and label the bucket Q1. Grouping is by actual
 * calendar quarter rather than every-3-buckets, so a series that starts
 * mid-quarter still labels correctly.
 */
const toQuarterly = (
  source: IGetDeclarationsOverTimeResponse,
): ITransformedDeclarationsOverTime => {
  const qBuckets: IStatisticsTimeBucket[] = [];
  const qSeries: IStatisticsTimeSeries[] = source.series.map((series) => ({
    supplierId: series.supplierId,
    values: [],
  }));

  let currentQuarter: string | null = null;

  source.buckets.forEach((bucket, index) => {
    const date = new Date(bucket.bucketStart);
    const quarter = `Q${Math.floor(date.getUTCMonth() / 3) + 1} '${String(
      date.getUTCFullYear(),
    ).slice(-2)}`;

    if (quarter !== currentQuarter) {
      currentQuarter = quarter;
      qBuckets.push({ label: quarter, bucketStart: bucket.bucketStart });
      qSeries.forEach((series) => series.values.push(0));
    }

    source.series.forEach((series, seriesIndex) => {
      const values = qSeries[seriesIndex].values;
      values[values.length - 1] += series.values[index] ?? 0;
    });
  });

  return { buckets: qBuckets, series: qSeries };
};

const toCumulative = (
  source: IGetDeclarationsOverTimeResponse,
): ITransformedDeclarationsOverTime => ({
  buckets: source.buckets,
  series: source.series.map((series) => {
    let running = 0;
    return {
      supplierId: series.supplierId,
      values: series.values.map((value) => (running += value)),
    };
  }),
});

/**
 * Reshapes a monthly time-series response into the requested view granularity.
 * Quarterly groups by calendar quarter; Cumulative emits a running total.
 */
export const transformDeclarationsOverTime = (
  source: IGetDeclarationsOverTimeResponse,
  granularity: TStatisticsViewGranularity,
): ITransformedDeclarationsOverTime => {
  if (granularity === 'quarterly') return toQuarterly(source);
  if (granularity === 'cumulative') return toCumulative(source);
  return { buckets: source.buckets, series: source.series };
};
