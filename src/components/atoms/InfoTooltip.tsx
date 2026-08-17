'use client';

import { type FC, type ReactNode } from 'react';

interface IInfoTooltipProps {
  /** Tooltip body — the long-form text shown on hover/focus. */
  content: ReactNode;
  ariaLabel?: string;
  /** Tooltip width in px. Defaults to 280. */
  width?: number;
  /** Horizontal anchor for the popover above the trigger. */
  align?: 'center' | 'start' | 'end';
  className?: string;
}

const POPOVER_ALIGN: Record<
  NonNullable<IInfoTooltipProps['align']>,
  { panel: string; arrow: string }
> = {
  center: {
    panel: 'left-1/2 -translate-x-1/2',
    arrow: 'left-1/2 -translate-x-1/2',
  },
  start: {
    panel: 'left-0 translate-x-0',
    arrow: 'left-2',
  },
  end: {
    panel: 'right-0 left-auto translate-x-0',
    arrow: 'right-2 left-auto translate-x-0',
  },
};

/**
 * Small "?" affordance with a dark popover — used next to short labels that
 * have an authoritative long-form description. CSS-only show/hide via
 * `:hover` / `:focus-visible` on the trigger.
 */
export const InfoTooltip: FC<IInfoTooltipProps> = ({
  content,
  ariaLabel = 'More information',
  width = 280,
  align = 'center',
  className,
}) => {
  const pos = POPOVER_ALIGN[align];

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`group relative inline-flex size-4 shrink-0 cursor-help items-center justify-center rounded-full bg-paper-200 text-[10px] font-semibold leading-none text-paper-300 outline-none transition-colors hover:bg-paper-950 hover:text-white focus-visible:bg-paper-950 focus-visible:text-white ${className ?? ''}`}
    >
      ?
      <span
        role="tooltip"
        className={`invisible absolute bottom-full z-[100] mb-2 rounded-md bg-aside-primary px-3 py-2.5 text-left text-xs font-normal leading-snug text-white opacity-0 shadow-tooltip transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 ${pos.panel}`}
        style={{ width }}
      >
        {content}
        <span
          aria-hidden
          className={`absolute top-full size-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-aside-primary ${pos.arrow}`}
        />
      </span>
    </button>
  );
};
