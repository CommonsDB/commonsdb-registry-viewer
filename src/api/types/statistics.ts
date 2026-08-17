/* ─── BE response DTOs ─────────────────────────────────────────────────────
 *
 * These are the shapes the backend returns. Colors are intentionally NOT here
 * — the FE owns the palette (see `~/shared/constants/statisticsColors`).
 * Components should consume the FE-enriched view types below.
 * ────────────────────────────────────────────────────────────────────────── */

export interface IStatisticsSupplierApi {
  id: string;
  name: string;
  short?: string;
}

export interface IGetStatisticsSuppliersResponse {
  suppliers: IStatisticsSupplierApi[];
}

export interface IStatisticsKpiValue {
  value: number;
  /** Change vs the previous period; omitted when a trend would be misleading. */
  delta?: number;
  periodDays: number;
  label?: string;
  percent?: boolean;
  integer?: boolean;
}

export interface IGetStatisticsOverviewResponse {
  declarations: IStatisticsKpiValue;
  suppliers: IStatisticsKpiValue;
  updatedAt: string;
}

export type TStatisticsGranularity = 'monthly' | 'quarterly';

export interface IStatisticsTimeBucket {
  label: string;
  bucketStart: string;
}

export interface IStatisticsTimeSeries {
  supplierId: string;
  values: number[];
}

export interface IGetDeclarationsOverTimeResponse {
  granularity: TStatisticsGranularity;
  buckets: IStatisticsTimeBucket[];
  series: IStatisticsTimeSeries[];
}

export interface IStatisticsDistributionItemApi {
  id: string;
  name: string;
  value: number;
}

export interface IGetStatisticsDistributionApiResponse {
  items: IStatisticsDistributionItemApi[];
  total: number;
}

export interface IStatisticsPdRationaleItem {
  id: string;
  name: string;
  long?: string;
  full?: string;
  value: number;
}

export interface IGetStatisticsPdRationaleResponse {
  items: IStatisticsPdRationaleItem[];
  total: number;
}

/* ─── Combined endpoint ─────────────────────────────────────────────────────
 *
 * The backend exposes a single GET /statistics route that returns every
 * section in one payload. Suppliers come back keyed by their raw DID — the FE
 * maps those to friendly names/colors (see `~/shared/constants/statisticsColors`).
 * ────────────────────────────────────────────────────────────────────────── */

/** Per-declarer breakdown so the UI can filter every chart by supplier. */
export interface IGetStatisticsByDeclarer {
  license: IGetStatisticsDistributionApiResponse;
  media: IGetStatisticsDistributionApiResponse;
  pdRationale: IGetStatisticsPdRationaleResponse;
}

export interface IGetStatisticsResponse {
  suppliers: IStatisticsSupplierApi[];
  overview: IGetStatisticsOverviewResponse;
  declarationsOverTime: IGetDeclarationsOverTimeResponse;
  licenseDistribution: IGetStatisticsDistributionApiResponse;
  mediaTypes: IGetStatisticsDistributionApiResponse;
  pdRationale: IGetStatisticsPdRationaleResponse;
  /**
   * Distributions keyed by supplier id (raw DID from the backend; re-keyed to
   * canonical UI ids by `mergeStatisticsBySupplier`). Optional so the UI keeps
   * working against an older backend that doesn't send it yet.
   */
  byDeclarer?: Record<string, IGetStatisticsByDeclarer>;
}

/* ─── FE view types ────────────────────────────────────────────────────────
 *
 * What components actually consume after the FE injects its color palette.
 * ────────────────────────────────────────────────────────────────────────── */

export interface IStatisticsSupplier extends IStatisticsSupplierApi {
  color: string;
}

export interface IStatisticsDistributionItem extends IStatisticsDistributionItemApi {
  color: string;
}

export interface IGetStatisticsDistributionResponse {
  items: IStatisticsDistributionItem[];
  total: number;
}
