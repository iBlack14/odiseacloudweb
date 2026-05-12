import { Currency } from './pricing';

export interface DomainAvailability {
  domain: string;
  available: boolean;
  priceUSD: number;
  priceUser: string;
  currency: Currency;
}

/**
 * Domain Search Service (Client-Side Bridge)
 * Calls the internal secure API to protect credentials.
 */
export async function searchDomain(query: string, currency: Currency = 'USD'): Promise<DomainAvailability[]> {
  try {
    const response = await fetch('/api/domains/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, currency })
    });

    if (!response.ok) {
      throw new Error("Error en la búsqueda de dominios");
    }

    return await response.json();
  } catch (error) {
    console.error("Search bridge error:", error);
    // Fallback simple por si falla el servidor
    return [];
  }
}
