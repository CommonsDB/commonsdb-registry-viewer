/** Values longer than this are shortened with a central ellipsis. */
const MAX_DISPLAY_LENGTH = 43;

const cutString = (value: string): string => {
  if (!value) return '';
  if (value.length <= MAX_DISPLAY_LENGTH) return value;

  return `${value.slice(0, 20)}...${value.slice(-20)}`;
};

/** Per-column display formatters for long identifier values. */
export const formatTableValues: Record<string, (value: string) => string> = {
  declarerId: cutString,
  signature: cutString,
  declarationId: cutString,
};
