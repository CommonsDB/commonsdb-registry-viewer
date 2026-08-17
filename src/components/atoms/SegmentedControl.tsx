'use client';

import clsx from 'clsx';

export interface ISegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface ISegmentedControlProps<T extends string> {
  value: T;
  options: ReadonlyArray<ISegmentedControlOption<T>>;
  onChange: (next: T) => void;
  ariaLabel?: string;
}

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: ISegmentedControlProps<T>) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className="inline-flex rounded-lg border border-paper-200 bg-paper-50 p-[3px]"
  >
    {options.map((opt) => {
      const isOn = opt.value === value;
      return (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={isOn}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            isOn ? 'bg-paper-950 text-white' : 'text-paper-300 hover:text-paper-950',
          )}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);
