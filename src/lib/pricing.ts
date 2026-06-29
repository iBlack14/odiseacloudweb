/**
 * Pricing Utility for Odisea Billing
 * Handles Markup (5-15%) and Currency Conversion (USD/PEN)
 */

import { FALLBACK_USD_TO_PEN } from "./exchange-rate";

export const MARKUP_PERCENTAGE = Number(process.env.DOMAIN_MARKUP_PERCENT) || 0.12;

/** @deprecated Use live rate from /api/exchange-rate — kept for backwards compat */
export const USD_TO_PEN_RATE = FALLBACK_USD_TO_PEN;

export type Currency = 'USD' | 'PEN';

export interface PriceDetails {
  base: number;
  markup: number;
  total: number;
  currency: Currency;
}

/**
 * Calculates the final price for the user
 * @param spaceshipPrice Original price from Spaceship API
 * @param currency Target currency
 */
export function calculateFinalPrice(
  spaceshipPrice: number,
  currency: Currency = 'USD',
  usdToPenRate: number = FALLBACK_USD_TO_PEN,
): PriceDetails {
  const markupAmount = spaceshipPrice * MARKUP_PERCENTAGE;
  const totalUSD = spaceshipPrice + markupAmount;

  if (currency === 'PEN') {
    return {
      base: spaceshipPrice * usdToPenRate,
      markup: markupAmount * usdToPenRate,
      total: totalUSD * usdToPenRate,
      currency: 'PEN'
    };
  }

  return {
    base: spaceshipPrice,
    markup: markupAmount,
    total: totalUSD,
    currency: 'USD'
  };
}

/**
 * Formats price for display
 */
export function formatPrice(price: number, currency: Currency): string {
  if (currency === 'PEN') {
    return `S/ ${price.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}
