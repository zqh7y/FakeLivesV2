/** Number and time formatting the way streaming apps show them. */

export function formatCompact(value: number): string {
  const n = Math.max(0, Math.round(value));
  if (n < 1000) return String(n);
  if (n < 10_000) return trimZero((n / 1000).toFixed(1)) + 'K';
  if (n < 1_000_000) return Math.round(n / 1000) + 'K';
  if (n < 10_000_000) return trimZero((n / 1_000_000).toFixed(1)) + 'M';
  return Math.round(n / 1_000_000) + 'M';
}

function trimZero(s: string): string {
  return s.endsWith('.0') ? s.slice(0, -2) : s;
}

export function formatWithSeparators(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return `${h > 0 ? h + ':' : ''}${mm}:${String(sec).padStart(2, '0')}`;
}

/** Parses "12k", "1.5m", "12,000" style input into a number. */
export function parseLooseNumber(input: string): number {
  const cleaned = input.trim().toLowerCase().replace(/[,\s]/g, '');
  const match = cleaned.match(/^(\d+(?:\.\d+)?)([km])?$/);
  if (!match) return Number.NaN;
  const base = parseFloat(match[1]);
  const mult = match[2] === 'k' ? 1000 : match[2] === 'm' ? 1_000_000 : 1;
  return Math.round(base * mult);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
