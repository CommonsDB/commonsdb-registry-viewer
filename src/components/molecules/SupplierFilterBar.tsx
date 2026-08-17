'use client';

import { type FC } from 'react';
import { SupplierChip } from '~/components/atoms';
import type { IStatisticsSupplier } from '~/api/types/statistics';
import { useTranslation } from '~/shared/utils/i18n/client';

interface ISupplierFilterBarProps {
  suppliers: IStatisticsSupplier[];
  /** Empty array means "all suppliers". */
  selectedIds: string[];
  onChange: (next: string[]) => void;
}

export const SupplierFilterBar: FC<ISupplierFilterBarProps> = ({
  suppliers,
  selectedIds,
  onChange,
}) => {
  const { t } = useTranslation();

  const isAll = selectedIds.length === 0;

  const toggle = (id: string) => {
    // Single-select: clicking the active chip clears back to "all", any other
    // click replaces the selection with the clicked supplier.
    if (selectedIds.length === 1 && selectedIds[0] === id) {
      onChange([]);
      return;
    }
    onChange([id]);
  };

  const clear = () => onChange([]);

  return (
    <div className="rounded-[10px] border border-paper-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-paper-300">
          {t('statistics.filter.label')}
        </span>
        <SupplierChip
          label={t('statistics.filter.allSuppliers')}
          isOn={isAll}
          isAll
          emphasized
          onClick={clear}
        />
        {suppliers.map((s) => {
          const isOn = !isAll && selectedIds.includes(s.id);
          return (
            <SupplierChip
              key={s.id}
              label={s.name}
              color={s.color}
              isOn={isOn}
              onClick={() => toggle(s.id)}
              title={s.name}
            />
          );
        })}
        {!isAll && (
          <button
            type="button"
            onClick={clear}
            className="ml-1 shrink-0 text-xs font-medium text-raspberry-500 hover:text-raspberry-600"
          >
            {t('statistics.filter.clear')}
          </button>
        )}
      </div>
    </div>
  );
};
