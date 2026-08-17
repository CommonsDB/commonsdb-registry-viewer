'use client';

import { type FC, useMemo } from 'react';

import { useSearchQuery } from '~/api/queries';
import { searchTableColumns, searchTableDropdownOptions } from '~/config/tables';
import { useDeclarationsTable } from '~/hooks';
import { getConflictingIsccs } from '~/shared/utils';

import { Table } from '../molecules';

interface DeclarationsTableProps {
  /** Identifier to search for: an ISCC, declaration ID or declarer DID. */
  query?: string;
}

/** Search results for the explorer page. */
export const DeclarationsTable: FC<DeclarationsTableProps> = ({ query }) => {
  const { data, isFetching, isError } = useSearchQuery(query ?? '');

  const results = data?.results;
  const conflictingIsccs = useMemo(() => getConflictingIsccs(results ?? []), [results]);

  const { rows, sortConfig, isDataFullyLoaded, onSort, onLoadMore } = useDeclarationsTable({
    results,
    conflictingIsccs,
  });

  return (
    <div className="table-container relative w-full grow overflow-hidden rounded-[16px] border pb-mainContentPadding">
      <Table
        data={rows}
        columns={searchTableColumns}
        dropdownOptions={searchTableDropdownOptions}
        sortConfig={sortConfig}
        isExpandable
        isLoading={isFetching}
        isError={isError}
        isDataFullyLoaded={isDataFullyLoaded}
        onLoadMore={onLoadMore}
        onSort={onSort}
      />
    </div>
  );
};
