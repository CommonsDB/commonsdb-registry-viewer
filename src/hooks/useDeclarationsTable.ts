'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ISearchResultWithPreviousDeclarations } from '~/api/types/declaration';
import { type DeclarationRow, mapDeclarationToRow } from '~/shared/utils';

/** Rows revealed per infinite-scroll page. */
const PAGE_SIZE = 30;

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface UseDeclarationsTableOptions {
  results: ISearchResultWithPreviousDeclarations[] | undefined;
  /** ISCC codes whose declarations conflict — see `getConflictingIsccs`. */
  conflictingIsccs?: Set<string>;
}

export interface UseDeclarationsTableResult {
  rows: DeclarationRow[];
  sortConfig: SortConfig | null;
  isDataFullyLoaded: boolean;
  onSort: (key: string) => void;
  onLoadMore: () => void;
}

/**
 * Sorting and progressive disclosure for a declarations table.
 *
 * Declarations are mapped to rows once and then sorted as rows — the mapping is
 * not cheap and a comparator that re-derives both operands would run it
 * O(n log n) times per sort.
 */
export const useDeclarationsTable = ({
  results,
  conflictingIsccs,
}: UseDeclarationsTableOptions): UseDeclarationsTableResult => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // A new result set starts back at the first page — otherwise a fresh search
  // inherits the previous query's scroll depth.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setSortConfig(null);
  }, [results]);

  const allRows = useMemo(
    () =>
      (results ?? []).map((result) =>
        mapDeclarationToRow(
          result,
          conflictingIsccs?.has(result.docBody?.metaInternal?.isccCode ?? '') ?? false,
        ),
      ),
    [results, conflictingIsccs],
  );

  const sortedRows = useMemo(() => {
    if (!sortConfig) return allRows;

    return [...allRows].sort((a, b) => compareRows(a, b, sortConfig));
  }, [allRows, sortConfig]);

  const onSort = useCallback((key: string) => {
    setSortConfig((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
    setVisibleCount(PAGE_SIZE);
  }, []);

  const onLoadMore = useCallback(() => {
    setVisibleCount((current) => (current >= sortedRows.length ? current : current + PAGE_SIZE));
  }, [sortedRows.length]);

  return {
    rows: useMemo(() => sortedRows.slice(0, visibleCount), [sortedRows, visibleCount]),
    sortConfig,
    isDataFullyLoaded: visibleCount >= sortedRows.length,
    onSort,
    onLoadMore,
  };
};

function compareRows(a: DeclarationRow, b: DeclarationRow, { key, direction }: SortConfig): number {
  const order = direction === 'asc' ? 1 : -1;

  if (key === 'declarationDate') {
    // Formatted as `YYYY-MM-DD HH:mm:ss UTC`, so a lexicographic compare is
    // already chronological — and unlike Date.parse it cannot yield NaN.
    return order * (a.declarationDate ?? '').localeCompare(b.declarationDate ?? '');
  }

  const aValue = a[key as keyof DeclarationRow];
  const bValue = b[key as keyof DeclarationRow];

  return order * String(aValue ?? '').localeCompare(String(bValue ?? ''));
}
