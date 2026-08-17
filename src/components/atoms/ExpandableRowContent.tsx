'use client';
import React, { type FC, useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import { useTranslation } from '~/shared/utils/i18n/client';
import { DeclarationConflictModal } from '../organisms';
import { Tooltip } from 'flowbite-react';
import { InfoTooltip } from './InfoTooltip';
import { ContentDisplay } from './ContentDisplay';
import type { TableDropdownOption } from '~/config/tables';
import type { DeclarationRow } from '~/shared/utils';

/** Reads a dynamically-keyed field as display text. */
const field = (item: DeclarationRow, key: string): string => {
  const value = item[key as keyof DeclarationRow];
  return value == null ? '' : String(value);
};

/** Builds the conflict-modal shape from a row. */
const toConflictDeclaration = (row: DeclarationRow) => ({
  cidV1: row.declarationId ?? '',
  declarer: row.declarer ?? '',
  rightsStatement: row.rightsStatementTag?.label ?? '',
  timestamp: row.declarationDate ?? '',
});

interface IExpandableRowContentProps {
  item: DeclarationRow;
  dropdownOptions: readonly TableDropdownOption[];
  allItems: DeclarationRow[];
  methodsToProcessValues: {
    [key: string]: (value: string) => string;
  };
}

export const ExpandableRowContent: FC<IExpandableRowContentProps> = ({
  item,
  dropdownOptions,
  allItems,
  methodsToProcessValues,
}) => {
  const { t } = useTranslation();
  const [isDeclarationConflictModalOpen, setIsDeclarationConflictModalOpen] = useState(false);

  const { fullWidthOptions, nonFullWidthOptions, threeColOptions } = dropdownOptions.reduce(
    (acc, option) => {
      if (option.isFullWidth) {
        acc.fullWidthOptions.push(option);
      } else if (option.isThreeCol) {
        acc.threeColOptions.push(option);
      } else {
        acc.nonFullWidthOptions.push(option);
      }
      return acc;
    },
    {
      fullWidthOptions: [] as TableDropdownOption[],
      nonFullWidthOptions: [] as TableDropdownOption[],
      threeColOptions: [] as TableDropdownOption[],
    },
  );

  const DropdownOption = ({
    label,
    optionKey: key,
    hasCopyOption,
    hasWarning,
    isLink,
    isFullWidth,
  }: {
    label: string;
    optionKey: string;
    hasCopyOption?: boolean;
    hasWarning?: boolean;
    isLink?: boolean;
    isFullWidth?: boolean;
  }) => (
    <div className="mr-3 flex flex-row items-center gap-2" key={key}>
      <p className="w-32 min-w-32 text-sm text-paper-400">{t(label)}</p>
      <div
        className={`text-sm ${isFullWidth ? 'full-width' : 'min-w-[70%] max-w-[70%] overflow-hidden'} flex items-center gap-1`}
      >
        {hasWarning && (
          <>
            <Tooltip content={t('conflict.tooltip')} trigger="hover" placement="bottom">
              <button
                type="button"
                aria-label={t('conflict.title')}
                onClick={() => setIsDeclarationConflictModalOpen(true)}
              >
                <IoWarning className="size-5 text-warning" />
              </button>
            </Tooltip>
            {isDeclarationConflictModalOpen && (
              <DeclarationConflictModal
                isOpen={isDeclarationConflictModalOpen}
                onClose={() => setIsDeclarationConflictModalOpen(false)}
                declaration={toConflictDeclaration(item)}
                declarationsWithConflicts={allItems
                  .filter(
                    (other) =>
                      other.iscc === item.iscc && other.declarationId !== item.declarationId,
                  )
                  .map(toConflictDeclaration)}
              />
            )}
          </>
        )}
        <ContentDisplay
          content={
            methodsToProcessValues?.[key]
              ? methodsToProcessValues[key](field(item, key))
              : field(item, key)
          }
          copyContent={field(item, key)}
          hasCopyOption={hasCopyOption}
          isLink={isLink}
          isFullWidth={isFullWidth}
          linkUrl={field(item, `${key}Link`) || field(item, key) || '/'}
        />
      </div>
    </div>
  );

  return (
    <div className="dark:bg-paper-70 rounded-[4px] bg-paper-50 p-[16px] text-gray-700">
      {fullWidthOptions.map(({ label, key, hasCopyOption, isLink }) => {
        return (
          <div className="mb-4" key={key}>
            <DropdownOption
              optionKey={key}
              label={label}
              hasCopyOption={hasCopyOption}
              hasWarning={Boolean(item[`${key}Warning` as keyof DeclarationRow])}
              isLink={isLink}
              isFullWidth={true}
            />
          </div>
        );
      })}
      <div className="grid grid-cols-2 gap-4">
        {nonFullWidthOptions.map(({ label, key, hasCopyOption, isLink }) => {
          return (
            <DropdownOption
              optionKey={key}
              label={label}
              key={key}
              hasCopyOption={hasCopyOption}
              hasWarning={Boolean(item[`${key}Warning` as keyof DeclarationRow])}
              isLink={isLink}
            />
          );
        })}
      </div>
      {threeColOptions.length > 0 &&
        (() => {
          const stackedOptions = threeColOptions.filter((o) => !o.isPdRationale);
          const pdOption = threeColOptions.find((o) => o.isPdRationale);
          return (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-2">
                {stackedOptions.map(({ label, key, hasCopyOption, isLink }) => (
                  <DropdownOption
                    optionKey={key}
                    label={label}
                    key={key}
                    hasCopyOption={hasCopyOption}
                    isLink={isLink}
                  />
                ))}
              </div>
              <div>
                {pdOption &&
                  (() => {
                    const name = field(item, pdOption.key);
                    const tooltip = field(item, `${pdOption.key}Tooltip`);
                    return (
                      <div className="mr-3 flex flex-row items-center gap-2">
                        <p className="w-32 min-w-32 text-sm text-paper-400">{t(pdOption.label)}</p>
                        {name ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-paper-950">
                            {name}
                            {tooltip && <InfoTooltip content={tooltip} align="end" />}
                          </span>
                        ) : (
                          <span className="text-sm text-paper-300">—</span>
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          );
        })()}
    </div>
  );
};
