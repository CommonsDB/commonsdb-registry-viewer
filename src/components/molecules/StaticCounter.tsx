'use client';

import React, { type FC } from 'react';
import { useDigitSize } from '~/hooks/useDigitSize';
import { useStaticCounter, type DigitState } from '~/hooks/useStaticCounter';

interface IStaticCounterProps {
  className?: string;
}

export const StaticCounter: FC<IStaticCounterProps> = ({ className = '' }) => {
  const { isLoading, digits } = useStaticCounter();

  const { containerClass, digitBoxClass, digitClass, dotClass } = useDigitSize(digits);

  return (
    <div className={`${containerClass} ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-b-2 border-raspberry-500" />
        </div>
      )}
      {!isLoading &&
        digits.map((digit: DigitState, index: number) =>
          digit.value === '.' ? (
            <span key={`dot-${index}`} className={dotClass}>
              .
            </span>
          ) : (
            <div key={`digit-${index}`} className={digitBoxClass}>
              <span className={digitClass}>{digit.value}</span>
            </div>
          ),
        )}
    </div>
  );
};
