/**
 * Formats a declaration timestamp as `YYYY-MM-DD HH:mm:ss UTC`.
 *
 * Declaration times are always shown in UTC so that two people comparing the
 * same declaration see the same string regardless of where they are.
 *
 * @returns The formatted date, or `undefined` when the input is missing or
 *          unparseable — callers render an empty cell rather than `NaN-NaN-NaN`.
 */
export const getUTCDate = (date: number | string | undefined): string | undefined => {
  if (date === undefined || date === null || date === '') return undefined;

  // Only strings that look like epoch milliseconds (10–13 digits) are treated
  // as numbers; other digit runs (e.g. "20240101") go through Date parsing.
  const parsed = new Date(
    typeof date === 'string' && /^\d{10,13}$/.test(date) ? Number(date) : date,
  );

  if (Number.isNaN(parsed.getTime())) return undefined;

  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    `${parsed.getUTCFullYear()}-${pad(parsed.getUTCMonth() + 1)}-${pad(parsed.getUTCDate())} ` +
    `${pad(parsed.getUTCHours())}:${pad(parsed.getUTCMinutes())}:${pad(parsed.getUTCSeconds())} UTC`
  );
};
