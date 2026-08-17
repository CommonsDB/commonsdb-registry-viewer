import React, { forwardRef } from 'react';

interface ITableLoadingIndicatorProps {
  isLoading: boolean;
  isDataFullyLoaded: boolean;
  columnsCount: number;
  isEmpty?: boolean;
}

export const TableLoadingIndicator = forwardRef<HTMLDivElement, ITableLoadingIndicatorProps>(
  ({ isLoading, isDataFullyLoaded, columnsCount, isEmpty }, ref) => {
    if (isDataFullyLoaded) return null;

    if (isEmpty && isLoading) {
      return (
        <tr className="border-paper-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <td colSpan={columnsCount + 1} className="px-2">
            <div className="absolute inset-0 flex min-h-[200px] items-center justify-center bg-white">
              <div
                ref={ref}
                className="size-8 animate-spin rounded-full border-b-2 border-raspberry-500"
              ></div>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="border-paper-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <td colSpan={columnsCount + 1} className="p-2">
          <div ref={ref} className="flex justify-center">
            {isLoading && (
              <div className="size-6 animate-spin rounded-full border-b-2 border-raspberry-500"></div>
            )}
          </div>
        </td>
      </tr>
    );
  },
);

TableLoadingIndicator.displayName = 'TableLoadingIndicator';
