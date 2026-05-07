import { calculateFinalPrice, Currency } from './pricing';

export interface DomainAvailability {
  domain: string;
  available: boolean;
  priceUSD: number;
  priceUser: string;
  currency: Currency;
}

/**
 * Spaceship API Bridge
 * Handles domain searches and applies the business markup logic.
 */
export async function searchDomain(query: string, currency: Currency = 'USD'): Promise<DomainAvailability[]> {
  // En producción, aquí haríamos el fetch a Spaceship API
  // const response = await fetch(`${process.env.SPACESHIP_API_URL}/domains/check?name=${query}`);
  
  // Mock de respuesta para desarrollo
  await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia de red

  const tlds = ['.com', '.net', '.org', '.pe', '.com.pe'];
  const name = query.split('.')[0];

  return tlds.map(tld => {
    const basePrice = Math.random() * (15 - 8) + 8; // Precio base aleatorio entre 8 y 15 USD
    const finalPriceDetails = calculateFinalPrice(basePrice, currency);

    return {
      domain: `${name}${tld}`,
      available: Math.random() > 0.2, // 80% de probabilidad de estar disponible
      priceUSD: basePrice,
      priceUser: `${currency === 'PEN' ? 'S/ ' : '$'}${finalPriceDetails.total.toFixed(2)}`,
      currency
    };
  });
}
