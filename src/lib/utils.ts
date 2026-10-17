import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'USD') {
  const symbols: Record<string, string> = { USD: '$', AFN: '؋', EUR: '€' };
  const symbol = symbols[currency] || '';
  if (price >= 1_000_000) return `${symbol}${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${symbol}${(price / 1_000).toFixed(0)}K`;
  return `${symbol}${price.toLocaleString()}`;
}

export function formatPriceFull(price: number, currency: string = 'USD') {
  const symbols: Record<string, string> = { USD: '$', AFN: '؋', EUR: '€' };
  const symbol = symbols[currency] || '';
  return `${symbol}${price.toLocaleString()}`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
