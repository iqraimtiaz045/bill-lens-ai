export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'PKR', symbol: 'Rs.', label: 'PKR (Rs.)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'AED', symbol: 'AED', label: 'AED' },
  { code: 'SAR', symbol: 'SAR', label: 'SAR' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
];

export function getCurrencySymbol(codeOrSymbol?: string): string {
  if (!codeOrSymbol) return 'Rs.';
  const clean = codeOrSymbol.trim();
  const upper = clean.toUpperCase();

  const match = SUPPORTED_CURRENCIES.find(
    (c) => c.code === upper || c.symbol === clean || c.label.toUpperCase().includes(upper)
  );

  if (match) return match.symbol;
  if (upper === 'RS' || upper === 'PKR' || clean === 'Rs' || clean === 'Rs.') return 'Rs.';
  if (upper === 'USD' || clean === '$') return '$';
  if (upper === 'EUR' || clean === '€') return '€';
  if (upper === 'GBP' || clean === '£') return '£';
  if (upper === 'INR' || clean === '₹') return '₹';
  if (upper === 'JPY' || clean === '¥') return '¥';

  return clean;
}

export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'PKR'
): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0)) || 0;
  const symbol = getCurrencySymbol(currency);

  const formattedNum = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (symbol === '$' || symbol === '€' || symbol === '£' || symbol === '₹' || symbol === '¥') {
    return `${symbol}${formattedNum}`;
  }
  return `${symbol} ${formattedNum}`;
}

