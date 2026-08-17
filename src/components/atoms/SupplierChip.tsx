'use client';

import { type CSSProperties, type FC } from 'react';
import clsx from 'clsx';

interface ISupplierChipProps {
  label: string;
  /** Color associated with this supplier — used both for off-state text/dot and on-state background. */
  color?: string;
  /** When true the chip is filled with `color` (or black for the all-suppliers chip). */
  isOn: boolean;
  /** When true, render as the special "All suppliers" chip (uses ink/black instead of supplier color). */
  isAll?: boolean;
  /** When true, render as a slightly thicker label (the demo uses font-weight: 600 for the all-suppliers chip). */
  emphasized?: boolean;
  onClick?: () => void;
  title?: string;
}

const FILTERBAR_NEUTRAL_COLOR = '#0E0D0B';

export const SupplierChip: FC<ISupplierChipProps> = ({
  label,
  color,
  isOn,
  isAll,
  emphasized,
  onClick,
  title,
}) => {
  const fillColor = isAll ? FILTERBAR_NEUTRAL_COLOR : color;

  const chipStyle: CSSProperties = isOn
    ? {
        backgroundColor: fillColor,
        borderColor: fillColor,
        color: '#fff',
      }
    : color
      ? { color }
      : {};

  const swatchStyle: CSSProperties = {
    backgroundColor: isOn ? '#fff' : color || FILTERBAR_NEUTRAL_COLOR,
    opacity: isOn ? 1 : 0.55,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={clsx(
        'inline-flex max-w-full items-center gap-2 rounded-full border border-paper-200 bg-white px-3 py-1.5 transition-colors',
        'text-[12.5px] font-medium text-paper-700',
        emphasized && 'text-xs font-semibold',
        !isOn && 'hover:border-paper-700 hover:text-paper-950',
      )}
      style={chipStyle}
    >
      {!isAll && <span className="size-2 shrink-0 rounded-full" style={swatchStyle} />}
      <span className="max-w-[200px] truncate">{label}</span>
    </button>
  );
};
