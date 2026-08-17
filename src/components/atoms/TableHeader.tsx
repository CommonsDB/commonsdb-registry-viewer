import type { FC } from 'react';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';

import type { TableColumn } from '~/config/tables';
import type { SortConfig } from '~/hooks';
import { useTranslation } from '~/shared/utils/i18n/client';

interface ITableHeaderProps {
  columns: readonly TableColumn[];
  sortConfig: SortConfig | null;
  isExpandable?: boolean;
  onSort: (key: string) => void;
}

const alignment = {
  right: { cell: 'text-right', content: 'justify-end' },
  center: { cell: 'text-center', content: 'justify-center' },
  left: { cell: 'text-left', content: 'justify-start' },
} as const;

export const TableHeader: FC<ITableHeaderProps> = ({
  columns,
  sortConfig,
  isExpandable,
  onSort,
}) => {
  const { t } = useTranslation();

  return (
    <thead className="dark:bg-paper-70 sticky top-0 z-10 bg-paper-50 text-sm text-gray-700 dark:text-gray-400">
      <tr>
        {columns.map(({ label, key, sortable, position = 'left', className }) => (
          <th
            key={key}
            scope="col"
            aria-sort={ariaSort(sortConfig, key)}
            className={`p-[18.5px] font-semibold ${
              sortable ? 'cursor-pointer select-none' : ''
            } ${className ?? ''} ${alignment[position].cell}`}
            onClick={() => sortable && onSort(key)}
          >
            <div className={`flex items-center gap-1 ${alignment[position].content}`}>
              {label ? t(label) : null}
              {sortable && (
                <div className="flex flex-col">
                  <IoCaretUpOutline
                    className={`size-4 ${
                      sortConfig?.key === key && sortConfig.direction === 'asc'
                        ? 'text-paper-950'
                        : 'text-gray-400'
                    }`}
                  />
                  <IoCaretDownOutline
                    className={`-mt-1 size-4 ${
                      sortConfig?.key === key && sortConfig.direction === 'desc'
                        ? 'text-paper-950'
                        : 'text-gray-400'
                    }`}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
        {/* Spacer for the row-expansion control. */}
        {isExpandable && (
          <th scope="col" className="w-fit p-[18.5px] font-semibold">
            <span className="sr-only">Expand row</span>
          </th>
        )}
      </tr>
    </thead>
  );
};

function ariaSort(
  sortConfig: SortConfig | null,
  key: string,
): 'ascending' | 'descending' | undefined {
  if (sortConfig?.key !== key) return undefined;

  return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
}
