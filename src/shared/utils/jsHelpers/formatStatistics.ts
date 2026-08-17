// Figma uses a "4.827.314" thousands style — locale 'de-DE' produces dots as
// thousand separators. Keeping this matches the design exactly.
const THOUSANDS_LOCALE = 'de-DE';

export const fmtStatNum = (n: number | null | undefined): string => {
  if (n == null) return '—';
  return Math.round(n).toLocaleString(THOUSANDS_LOCALE);
};

export const fmtStatCompact = (n: number | null | undefined): string => {
  if (n == null) return '—';
  const abs = Math.abs(n);
  // Thresholds account for display rounding: 999,950 would render as
  // "1000.0k" under a plain >= 1e6 check, so it promotes to "1M" instead.
  if (abs >= 999.995e6) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (abs >= 999.95e3) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'k';
  return String(Math.round(n));
};

export const fmtStatPct = (fraction: number, digits = 1): string =>
  `${(fraction * 100).toFixed(digits)}%`;

export const fmtStatDelta = (delta: number): string => {
  const sign = delta >= 0 ? '+' : '−';
  return `${sign}${(Math.abs(delta) * 100).toFixed(1)}%`;
};
