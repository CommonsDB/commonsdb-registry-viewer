'use client';

import { useMemo } from 'react';

import { useStatisticsQuery } from '~/api/queries';
import { mergeStatisticsBySupplier } from '~/shared/utils';

export interface DigitState {
  /** A single digit, or `'.'` for a thousands separator. */
  value: number | '.';
}

/**
 * Total declaration count, split into digits for the sidebar's rolling counter.
 */
export const useStaticCounter = () => {
  const { data, isLoading, isFetching, isError } = useStatisticsQuery();

  const digits = useMemo(() => {
    if (data?.overview?.declarations?.value == null) return [];

    // Merging first keeps this consistent with the statistics page, where
    // hidden test declarers are subtracted from the headline total.
    return toDigits(mergeStatisticsBySupplier(data).overview.declarations.value);
  }, [data]);

  return {
    // On error the counter renders empty rather than spinning forever.
    isLoading: !isError && (isLoading || isFetching || !data),
    digits,
  };
};

/** Splits a number into digits with `.` inserted every three places. */
function toDigits(value: number): DigitState[] {
  const characters = value.toString().split('').reverse();

  const grouped = characters.flatMap((digit, index) =>
    index > 0 && index % 3 === 0 ? ['.', digit] : [digit],
  );

  return grouped
    .reverse()
    .map((character) => ({ value: character === '.' ? '.' : Number(character) }));
}
