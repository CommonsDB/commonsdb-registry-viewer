'use client';
import React, { type FC, type ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Tooltip } from 'flowbite-react';
import { IoChevronDownOutline, IoOpenOutline, IoWarning } from 'react-icons/io5';
import { MdArrowForwardIos } from 'react-icons/md';

import type { TableColumn } from '~/config/tables';
import type { DeclarationRow } from '~/shared/utils';
import { isSafeExternalUrl, openExternalUrl } from '~/shared/utils/url';
import { useTranslation } from '~/shared/utils/i18n/client';

import { DeclarationConflictModal } from '../organisms';
import { PreviousDeclarationsModal } from '../organisms/PreviousDeclarationsModal';
import { Tag } from './Tag';

/** A declaration flattened for display. */
export type TableItem = DeclarationRow;

/** Reads a dynamically-keyed field as display text. */
const field = (item: TableItem, key: string): string => {
  const value = item[key as keyof TableItem];
  return value == null ? '' : String(value);
};

/** Builds the conflict-modal shape from a row. */
const toConflictDeclaration = (row: TableItem) => ({
  cidV1: row.declarationId ?? '',
  declarer: row.declarer ?? '',
  rightsStatement: row.rightsStatementTag?.label ?? '',
  timestamp: row.declarationDate ?? '',
});

/** Rows that describe the same work as `item` but disagree on rights. */
const conflictingRows = (item: TableItem, allItems: TableItem[]) =>
  allItems
    .filter((other) => other.iscc === item.iscc && other.declarationId !== item.declarationId)
    .map(toConflictDeclaration);

interface TableImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

const TableImage: FC<TableImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = 'object-contain',
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Reset state when src changes
  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  if (!imgSrc || (hasError && !fallbackSrc)) {
    return null;
  }

  return (
    <Image src={imgSrc} alt={alt} fill className={className} onError={handleError} unoptimized />
  );
};

interface ITableRowProps {
  item: TableItem;
  allItems: TableItem[];
  columns: readonly TableColumn[];
  isExpanded: boolean;
  isExpandable?: boolean;
  isLastRow?: boolean;
  onToggle: () => void;
  methodsToProcessValues: {
    [key: string]: (value: string) => string;
  };
  children?: ReactNode;
}

export const TableRow: FC<ITableRowProps> = ({
  item,
  columns,
  allItems,
  isExpanded,
  isExpandable,
  isLastRow,
  onToggle,
  methodsToProcessValues,
  children,
}) => {
  const { t } = useTranslation();
  const [isPreviousDeclarationsModalOpen, setIsPreviousDeclarationsModalOpen] = useState(false);
  const [isDeclarationConflictModalOpen, setIsDeclarationConflictModalOpen] = useState(false);

  const declarerLogoFallback =
    typeof item.declarerLogo === 'string' ? item.declarerLogo : undefined;

  const getCellByType = (type: string | undefined, key: string) => {
    const itemValue = field(item, key);
    const tagLabel = (item[key as keyof TableItem] as { label?: string | null } | undefined)?.label;

    switch (type) {
      case 'tag':
        return (
          <div className="flex justify-center">
            {tagLabel && (
              <React.Fragment>
                <Tag className="mr-0 bg-inactive/10 text-inactive">{tagLabel}</Tag>
                {item[`${key}Warning` as keyof TableItem] && (
                  <Tooltip content={t('conflict.tooltip')} trigger="hover" placement="bottom">
                    <button
                      type="button"
                      aria-label={t('conflict.title')}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeclarationConflictModalOpen(true);
                      }}
                    >
                      <IoWarning className="size-5 text-warning" />
                    </button>
                  </Tooltip>
                )}
              </React.Fragment>
            )}
            {isDeclarationConflictModalOpen && (
              <DeclarationConflictModal
                isOpen={isDeclarationConflictModalOpen}
                onClose={() => setIsDeclarationConflictModalOpen(false)}
                declaration={toConflictDeclaration(item)}
                declarationsWithConflicts={conflictingRows(item, allItems)}
              />
            )}
          </div>
        );
      case 'image':
        return (
          <div className="relative mx-auto size-[82px]">
            <TableImage src={itemValue} alt={key} fallbackSrc={declarerLogoFallback} />
          </div>
        );
      case 'imageWithLink':
        return (
          <div className="relative mx-auto size-[82px]">
            <Link href={field(item, `${key}Link`)}>
              <TableImage src={itemValue} alt={key} fallbackSrc={declarerLogoFallback} />
            </Link>
          </div>
        );
      case 'buttonWithModal':
        return (
          <>
            <Button
              className="w-fit border-paper-500 bg-paper-500 p-0.5 text-paper-950 hover:bg-paper-200"
              size="xs"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setIsPreviousDeclarationsModalOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <span>{t('previousDeclarations.title')}</span>
                <MdArrowForwardIos className="size-3" />
              </div>
            </Button>
            {isPreviousDeclarationsModalOpen && (
              <PreviousDeclarationsModal
                isOpen={isPreviousDeclarationsModalOpen}
                onClose={() => setIsPreviousDeclarationsModalOpen(false)}
                declarationId={item.declarationId ?? ''}
                declaration={{
                  location: item.location ?? '',
                  rightsStatement: item.rightsStatement ?? '',
                  declarationId: item.declarationId ?? '',
                  iscc: item.iscc ?? '',
                  cidV1: item.declarationId ?? '',
                  timestamp: item.declarationDate ?? '',
                }}
                declarations={item.previousDeclarations}
                isLoading={false}
              />
            )}
          </>
        );
      default:
        return methodsToProcessValues[key] ? methodsToProcessValues[key](itemValue) : itemValue;
    }
  };

  const renderCell = (key: string, type: string | undefined) => {
    if (key === 'location') {
      const url = field(item, key);
      // The location URL comes from registry data — only render the open-in-new
      // button for plain web URLs.
      if (!isSafeExternalUrl(url)) return ' ';

      return (
        <button
          type="button"
          aria-label={t('column.location')}
          onClick={(e) => {
            e.stopPropagation();
            openExternalUrl(url);
          }}
          className="rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          <IoOpenOutline className="size-6 text-raspberry-500 transition-transform" />
        </button>
      );
    }

    return item[key as keyof TableItem] ? getCellByType(type, key) : ' ';
  };

  return (
    <React.Fragment>
      <tr
        onClick={(e) => {
          // Buttons and links inside cells handle their own clicks.
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('a')) {
            onToggle();
          }
        }}
        className={`bg-white ${isLastRow ? 'border-b-0' : ''} ${isExpanded ? 'border-t' : 'border-y'} cursor-pointer border-paper-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800`}
      >
        {columns.map(({ key, type, position, className }) => (
          <td
            key={key}
            className={`text-paper-600 px-6 py-4 text-sm font-normal ${
              position === 'right'
                ? 'text-right'
                : position === 'center'
                  ? 'text-center'
                  : 'text-left'
            } ${className || ''}`}
          >
            <div
              className={`${
                position === 'right'
                  ? 'flex justify-end'
                  : position === 'center'
                    ? 'flex justify-center'
                    : 'flex justify-start'
              }`}
            >
              {renderCell(key, type)}
            </div>
          </td>
        ))}
        {isExpandable && (
          <td className="px-6 py-4 text-right">
            <button
              type="button"
              aria-label={t('table.expandRow')}
              aria-expanded={isExpanded}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <IoChevronDownOutline
                className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </td>
        )}
      </tr>
      {isExpandable && isExpanded && (
        <tr className="border-paper-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <td colSpan={columns.length + 1} className="p-2">
            {children}
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
