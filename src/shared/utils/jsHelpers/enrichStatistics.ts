import type {
  IGetStatisticsByDeclarer,
  IGetStatisticsDistributionApiResponse,
  IGetStatisticsDistributionResponse,
  IGetStatisticsPdRationaleResponse,
  IGetStatisticsResponse,
  IStatisticsDistributionItem,
  IStatisticsDistributionItemApi,
  IStatisticsSupplier,
  IStatisticsSupplierApi,
  IStatisticsTimeSeries,
} from '~/api/types/statistics';
import {
  getPdRationaleMeta,
  PD_RATIONALE_REGISTRY,
  getStatisticsLicenseColor,
  getStatisticsMediaColor,
  getStatisticsSupplierMeta,
  resolveSupplierCanonicalId,
} from '~/shared/constants';

const OTHER_UNSPECIFIED_PATTERN = /^(other|unspecified|unknown)$/i;

const isOtherCategory = (item: IStatisticsDistributionItemApi): boolean =>
  OTHER_UNSPECIFIED_PATTERN.test(item.id) || OTHER_UNSPECIFIED_PATTERN.test(item.name);

const enrichItems = (
  items: IStatisticsDistributionItemApi[],
  resolver: (id: string) => string,
): IStatisticsDistributionItem[] => items.map((it) => ({ ...it, color: resolver(it.id) }));

/**
 * Sum one or more distribution payloads element-wise by item id, preserving any
 * extra per-item fields (e.g. pd-rationale `long`/`full`) from the first hit and
 * re-sorting by value desc. Used to merge per-declarer breakdowns.
 */
const mergeDistroParts = <T extends IStatisticsDistributionItemApi>(
  parts: Array<{ items: T[]; total: number }>,
): { items: T[]; total: number } => {
  const byId = new Map<string, T>();
  let total = 0;
  for (const part of parts) {
    for (const it of part.items) {
      const prev = byId.get(it.id);
      if (prev) prev.value += it.value;
      else byId.set(it.id, { ...it });
      total += it.value;
    }
  }
  const items = Array.from(byId.values()).sort((a, b) => b.value - a.value);
  return { items, total };
};

export const enrichStatisticsSuppliers = (
  suppliers: IStatisticsSupplierApi[],
): IStatisticsSupplier[] =>
  suppliers.map((s) => {
    const meta = getStatisticsSupplierMeta(s.id);
    return {
      ...s,
      // The API returns the raw DID as the name; prefer the FE friendly name.
      name: meta.name,
      short: s.short ?? meta.short,
      color: meta.color,
    };
  });

/**
 * Subtract one or more distribution payloads from an aggregate element-wise by
 * item id, dropping items that reach zero and recomputing the total. Used to
 * remove hidden declarers' contributions from the backend aggregates.
 *
 * The headline KPI subtracts hidden totals derived from the time series, while
 * distributions subtract from the per-declarer breakdowns. In practice the
 * backend already excludes test declarers, so both paths are defensive; if a
 * payload ever carries hidden data in one source but not the other, the two
 * corrections can diverge slightly.
 */
const subtractDistroParts = <T extends IStatisticsDistributionItemApi>(
  aggregate: { items: T[]; total: number },
  parts: Array<{ items: IStatisticsDistributionItemApi[]; total: number }>,
): { items: T[]; total: number } => {
  if (parts.length === 0) return aggregate;
  const hiddenById = new Map<string, number>();
  for (const part of parts) {
    for (const it of part.items) {
      hiddenById.set(it.id, (hiddenById.get(it.id) ?? 0) + it.value);
    }
  }
  const items = aggregate.items
    .map((it) => ({
      ...it,
      value: Math.max(0, it.value - (hiddenById.get(it.id) ?? 0)),
    }))
    .filter((it) => it.value > 0);
  return { items, total: items.reduce((sum, it) => sum + it.value, 0) };
};

/**
 * Collapse backend declarers into canonical UI suppliers — UI-only.
 *
 * The backend keeps every declarer DID separate (on purpose). On the UI we:
 *   - merge DIDs that map to the same canonical id (e.g. the two Wikimedia
 *     Sverige declarers become a single supplier + a single time-series), and
 *   - drop DIDs mapped to `null` (hidden suppliers).
 *
 * Hidden declarers are also subtracted from the aggregate distributions
 * (license / media / pd rationale, via their `byDeclarer` breakdowns) and from
 * the declarations KPI (via their time-series totals), so the "all suppliers"
 * view matches what is actually shown.
 */
export const mergeStatisticsBySupplier = (
  stats: IGetStatisticsResponse,
): IGetStatisticsResponse => {
  // Suppliers: re-key to canonical id, drop hidden ones, dedupe.
  const seen = new Set<string>();
  const suppliers: IStatisticsSupplierApi[] = [];
  for (const supplier of stats.suppliers) {
    const canonicalId = resolveSupplierCanonicalId(supplier.id);
    if (canonicalId === null || seen.has(canonicalId)) continue;
    seen.add(canonicalId);
    suppliers.push({ id: canonicalId, name: canonicalId, short: supplier.short });
  }

  // Time-series: group by canonical id and sum element-wise, drop hidden ones.
  // Hidden declarers' totals are tallied so the declarations KPI can exclude them.
  let hiddenDeclarations = 0;
  const seriesByCanonical = new Map<string, number[]>();
  for (const series of stats.declarationsOverTime.series) {
    const canonicalId = resolveSupplierCanonicalId(series.supplierId);
    if (canonicalId === null) {
      hiddenDeclarations += series.values.reduce((sum, v) => sum + (v ?? 0), 0);
      continue;
    }
    const acc = seriesByCanonical.get(canonicalId);
    if (!acc) {
      seriesByCanonical.set(canonicalId, [...series.values]);
    } else {
      series.values.forEach((v, i) => {
        acc[i] = (acc[i] ?? 0) + (v ?? 0);
      });
    }
  }
  const series: IStatisticsTimeSeries[] = Array.from(
    seriesByCanonical.entries(),
    ([supplierId, values]) => ({ supplierId, values }),
  );

  // Per-declarer breakdowns: re-key to canonical id, sum merged DIDs, drop
  // hidden. Hidden breakdowns are kept aside to subtract from the aggregates.
  const hiddenBreakdowns: IGetStatisticsByDeclarer[] = [];
  let byDeclarer: Record<string, IGetStatisticsByDeclarer> | undefined;
  if (stats.byDeclarer) {
    byDeclarer = {};
    for (const [did, entry] of Object.entries(stats.byDeclarer)) {
      const canonicalId = resolveSupplierCanonicalId(did);
      if (canonicalId === null) {
        hiddenBreakdowns.push(entry);
        continue;
      }
      const existing = byDeclarer[canonicalId];
      byDeclarer[canonicalId] = existing
        ? {
            license: mergeDistroParts([existing.license, entry.license]),
            media: mergeDistroParts([existing.media, entry.media]),
            pdRationale: mergeDistroParts([existing.pdRationale, entry.pdRationale]),
          }
        : {
            license: mergeDistroParts([entry.license]),
            media: mergeDistroParts([entry.media]),
            pdRationale: mergeDistroParts([entry.pdRationale]),
          };
    }
  }

  return {
    ...stats,
    suppliers,
    overview: {
      ...stats.overview,
      declarations: {
        ...stats.overview.declarations,
        value: Math.max(0, stats.overview.declarations.value - hiddenDeclarations),
      },
      suppliers: { ...stats.overview.suppliers, value: suppliers.length },
    },
    declarationsOverTime: { ...stats.declarationsOverTime, series },
    licenseDistribution: subtractDistroParts(
      stats.licenseDistribution,
      hiddenBreakdowns.map((h) => h.license),
    ),
    mediaTypes: subtractDistroParts(
      stats.mediaTypes,
      hiddenBreakdowns.map((h) => h.media),
    ),
    pdRationale: subtractDistroParts(
      stats.pdRationale,
      hiddenBreakdowns.map((h) => h.pdRationale),
    ),
    byDeclarer,
  };
};

/**
 * Resolve a distribution for the current supplier selection.
 *
 * `selectedIds === null` means "all suppliers" → return the backend aggregate.
 * Otherwise sum the per-declarer breakdowns for the selected ids. Falls back to
 * the aggregate when the backend hasn't sent `byDeclarer` yet.
 */
export const selectLicenseDistribution = (
  stats: IGetStatisticsResponse,
  selectedIds: string[] | null,
): IGetStatisticsDistributionApiResponse => {
  if (selectedIds === null || !stats.byDeclarer) return stats.licenseDistribution;
  return mergeDistroParts(
    selectedIds
      .map((id) => stats.byDeclarer?.[id]?.license)
      .filter((p): p is IGetStatisticsDistributionApiResponse => !!p),
  );
};

export const selectMediaDistribution = (
  stats: IGetStatisticsResponse,
  selectedIds: string[] | null,
): IGetStatisticsDistributionApiResponse => {
  if (selectedIds === null || !stats.byDeclarer) return stats.mediaTypes;
  return mergeDistroParts(
    selectedIds
      .map((id) => stats.byDeclarer?.[id]?.media)
      .filter((p): p is IGetStatisticsDistributionApiResponse => !!p),
  );
};

export const selectPdRationale = (
  stats: IGetStatisticsResponse,
  selectedIds: string[] | null,
): IGetStatisticsPdRationaleResponse => {
  if (selectedIds === null || !stats.byDeclarer) return stats.pdRationale;
  return mergeDistroParts(
    selectedIds
      .map((id) => stats.byDeclarer?.[id]?.pdRationale)
      .filter((p): p is IGetStatisticsPdRationaleResponse => !!p),
  );
};

/**
 * "Other/unspecified" buckets below this count are dropped from distribution
 * charts as noise. Totals are recomputed from the kept items, so chart totals
 * can read slightly lower than the headline declaration count.
 */
const MIN_OTHER_CATEGORY_VALUE = 100;

export const enrichLicenseDistribution = (
  source: IGetStatisticsDistributionApiResponse,
): IGetStatisticsDistributionResponse => {
  const filtered = source.items.filter(
    (it) => !(isOtherCategory(it) && it.value < MIN_OTHER_CATEGORY_VALUE),
  );
  return {
    total: filtered.reduce((sum, it) => sum + it.value, 0),
    items: enrichItems(filtered, getStatisticsLicenseColor),
  };
};

export const enrichMediaDistribution = (
  source: IGetStatisticsDistributionApiResponse,
): IGetStatisticsDistributionResponse => ({
  total: source.total,
  items: enrichItems(source.items, getStatisticsMediaColor),
});

export const enrichPdRationale = (
  source: IGetStatisticsPdRationaleResponse,
): IGetStatisticsPdRationaleResponse => {
  const enriched = source.items
    .filter((it) => !(isOtherCategory(it) && it.value < MIN_OTHER_CATEGORY_VALUE))
    .map((item) => {
      const meta = getPdRationaleMeta(item.id);
      return {
        ...item,
        // An unknown id falls back to the backend-supplied name rather than
        // displaying the raw identifier.
        name: PD_RATIONALE_REGISTRY[item.id] ? meta.name : item.name ?? meta.name,
        long: item.long ?? meta.long,
        full: item.full ?? meta.full,
      };
    });
  return {
    total: enriched.reduce((sum, it) => sum + it.value, 0),
    items: enriched,
  };
};
