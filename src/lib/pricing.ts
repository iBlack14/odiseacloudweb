/**
 * Pricing Utility for Odisea Billing
 * Handles Markup (5-15%) and Currency Conversion (USD/PEN)
 */

export const MARKUP_PERCENTAGE = Number(process.env.DOMAIN_MARKUP_PERCENT) || 0.12; 
export const USD_TO_PEN_RATE = Number(process.env.CURRENCY_USD_TO_PEN) || 3.75; 

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
export function calculateFinalPrice(spaceshipPrice: number, currency: Currency = 'USD'): PriceDetails {
  const markupAmount = spaceshipPrice * MARKUP_PERCENTAGE;
  const totalUSD = spaceshipPrice + markupAmount;

  if (currency === 'PEN') {
    return {
      base: spaceshipPrice * USD_TO_PEN_RATE,
      markup: markupAmount * USD_TO_PEN_RATE,
      total: totalUSD * USD_TO_PEN_RATE,
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
