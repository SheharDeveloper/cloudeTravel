/**
 * An exact price, not rounded: at least 2 decimals, and every decimal the
 * converted amount has (€117.26, ₹12727.4646). Thousands are grouped.
 */
export function exactMoney(symbol: string, value: number): string {
    return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 10 })}`;
}
