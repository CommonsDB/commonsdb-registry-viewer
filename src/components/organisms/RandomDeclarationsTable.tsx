'use client';

import type { FC } from 'react';

import { useRandomDeclarationsQuery } from '~/api/queries';
import { randomDeclarationsDropdownOptions, randomDeclarationsTableColumns } from '~/config/tables';
import { useDeclarationsTable } from '~/hooks';

import { Table } from '../molecules';

/** A random sample of registry declarations. */
export const RandomDeclarationsTable: FC = () => {
  const { data, isFetching, isError } = useRandomDeclarationsQuery();

  const { rows, sortConfig, isDataFullyLoaded, onSort, onLoadMore } = useDeclarationsTable({
    results: data?.results,
  });

  return (
    <div className="table-container relative w-full grow overflow-hidden rounded-[16px] border pb-mainContentPadding">
      <Table
        data={rows}
        columns={randomDeclarationsTableColumns}
        dropdownOptions={randomDeclarationsDropdownOptions}
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
