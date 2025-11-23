/**
 * Format a number with dot (.) as thousands separator
 * @param value - The number to format
 * @returns Formatted string (e.g., 12000 -> "12.000")
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a number as currency with "Rp " prefix
 * @param value - The number to format
 * @returns Formatted currency string (e.g., 12000 -> "Rp 12.000")
 */
export function formatCurrency(value: number | string): string {
  return `Rp ${formatNumber(value)}`;
}
