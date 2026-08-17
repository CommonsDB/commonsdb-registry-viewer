import { useMemo } from 'react';

export const useDigitSize = (digits: Array<{ value: number | '.' }>) => {
  const numberDigitsCount = digits.filter((d) => d.value !== '.').length;
  return useMemo(() => {
    const baseClasses = {
      container: 'flex flex-row flex-wrap justify-between items-center',
      digitBox:
        'rounded-[4px] border-[0.5px] border-paper-200 bg-white flex items-center justify-center',
      digit: 'font-bold transition-all duration-200',
      dot: 'font-bold self-end transition-all duration-200',
    };

    if (numberDigitsCount === 0) {
      return {
        containerClass: 'flex flex-row flex-wrap justify-center items-center',
        digitBoxClass: `${baseClasses.digitBox} min-w-[16px] max-w-[24px] px-2 py-2`,
        digitClass: `${baseClasses.digit} text-[16px]`,
        dotClass: `${baseClasses.dot} text-[16px] text-paper-300`,
      };
    }

    // Dynamic classes based on digit count
    if (numberDigitsCount <= 6) {
      return {
        containerClass: `${baseClasses.container} gap-1`,
        digitBoxClass: `${baseClasses.digitBox} min-w-[16px] max-w-[24px] px-2 py-2`,
        digitClass: `${baseClasses.digit} text-[16px]`,
        dotClass: `${baseClasses.dot} text-[16px] text-paper-300`,
      };
    } else if (numberDigitsCount <= 8) {
      return {
        containerClass: `${baseClasses.container} gap-1`,
        digitBoxClass: `${baseClasses.digitBox} min-w-[14px] max-w-[20px] px-1.5 py-1`,
        digitClass: `${baseClasses.digit} text-[16px]`,
        dotClass: `${baseClasses.dot} text-[16px] text-paper-300`,
      };
    } else {
      return {
        containerClass: `${baseClasses.container} gap-0.5`,
        digitBoxClass: `${baseClasses.digitBox} min-w-[12px] max-w-[16px] px-1 py-0.5`,
        digitClass: `${baseClasses.digit} text-[12px]`,
        dotClass: `${baseClasses.dot} text-[12px] text-paper-300`,
      };
    }
  }, [numberDigitsCount]);
};
