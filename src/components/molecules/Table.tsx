'use client';

import { type FC, useState } from 'react';
import clsx from 'clsx';

import {
  ExpandableRowContent,
  TableHeader,
  TableLoadingIndicator,
  TableRow,
  type TableItem,
} from '../atoms';
import type { TableColumn, TableDropdownOption } from '~/config/tables';
import { type SortConfig, useInfiniteScroll } from '~/hooks';
import { type DeclarationRow, formatTableValues } from '~/shared/utils';
import { useTranslation } from '~/shared/utils/i18n/client';

export type TData = DeclarationRow;

export interface ITableProps {
  data: DeclarationRow[];
  columns: readonly TableColumn[];
  dropdownOptions: readonly TableDropdownOption[];
  sortConfig: SortConfig | null;
  tableClassName?: string;
  isExpandable?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isDataFullyLoaded?: boolean;
  onLoadMore: () => void;
  onSort?: (key: string) => void;
}

/** Paginated, sortable table of declarations with expandable detail rows. */
export const Table: FC<ITableProps> = ({
  data,
  columns,
  dropdownOptions,
  sortConfig,
  tableClassName,
  isExpandable,
  isLoading,
  isError,
  isDataFullyLoaded,
  onLoadMore,
  onSort,
}) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const loaderRef = useInfiniteScroll(onLoadMore, isLoading ?? false, data.length);

  const isEmpty = !data.length;
  const fillHeight = isEmpty || isLoading;

  const toggleRow = (rowId: string) =>
    setExpandedRows((previous) => ({ ...previous, [rowId]: !previous[rowId] }));

  const handleSortChange = (key: string) => {
    onSort?.(key);
    // A re-sort reorders rows out from under any open detail panel.
    setExpandedRows({});
    document.querySelector('.table-container')?.scrollTo({ top: 0 });
  };

  return (
    <div
      className={clsx(
        'table-container relative w-full overflow-auto rounded-[16px] shadow-md',
        fillHeight && 'h-full',
        tableClassName,
      )}
    >
      <table
        className={clsx(
          'w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right',
          fillHeight && 'h-full',
        )}
      >
        <TableHeader
          columns={columns}
          sortConfig={sortConfig}
          isExpandable={isExpandable}
          onSort={handleSortChange}
        />
        <tbody className="relative">
          {data.map((item, index) => {
            const rowId = `${item.declarationId ?? ''}${index}`;

            return (
              <TableRow
                key={rowId}
                item={item as TableItem}
                allItems={data as TableItem[]}
                columns={columns}
                isExpandable={isExpandable}
                isExpanded={isExpandable ? Boolean(expandedRows[rowId]) : false}
                isLastRow={index === data.length - 1}
                onToggle={() => toggleRow(rowId)}
                methodsToProcessValues={formatTableValues}
              >
                <ExpandableRowContent
                  item={item as Record<string, string>}
                  allItems={data as Record<string, string>[]}
                  dropdownOptions={dropdownOptions}
                  methodsToProcessValues={formatTableValues}
                />
              </TableRow>
            );
          })}
          {isEmpty && !isLoading && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className={clsx(
                  'bg-white py-8 text-center',
                  isError ? 'text-danger' : 'text-gray-500',
                )}
              >
                {t(isError ? 'error.loadFailed' : 'noDataAvailable')}
              </td>
            </tr>
          )}
          <TableLoadingIndicator
            ref={loaderRef}
            isLoading={isLoading ?? false}
            isDataFullyLoaded={isDataFullyLoaded ?? false}
            columnsCount={columns.length}
            isEmpty={isEmpty}
          />
        </tbody>
      </table>
    </div>
  );
};
