import { NextResponse } from 'next/server';
import { calculateFinalPrice } from '@/lib/pricing';

/**
 * Spaceship Retail Prices (USD/year) — May 2026
 * Taken directly from spaceship.com pricing page.
 * Update these if Spaceship changes their pricing.
 */
const SPACESHIP_TLD_PRICES: Record<string, number> = {
  'com':     8.88,
  'net':    11.20,
  'org':     6.48,
  'pe':     60.00,
  'com.pe': 60.00,
  'io':     31.98,
  'co':     25.88,
  'info':    3.98,
  'biz':     5.98,
  'us':      6.98,
  'online':  4.88,
  'store':   6.98,
  'shop':    6.88,
  'app':    14.00,
  'dev':    14.00,
  'ai':     79.98,
  'xyz':     1.86,
  'lat':     1.04,
  'llc':    10.35,
  'network': 5.69,
  'tech':    7.22,
};

export async function POST(req: Request) {
  try {
    const { query, currency } = await req.json();
    const apiKey = process.env.SPACESHIP_API_KEY;
    const apiSecret = process.env.SPACESHIP_API_SECRET;
    const apiUrl = process.env.SPACESHIP_API_URL || 'https://spaceship.dev/api/v1';

    if (!apiKey || !apiSecret || apiKey === 'your_api_key_here') {
      return NextResponse.json({ error: 'API Keys not configured' }, { status: 500 });
    }

    const name = query.split('.')[0];
    const tlds = ['com', 'net', 'org', 'pe', 'com.pe'];
    const domainsToCheck = tlds.map(tld => `${name}.${tld}`);

    // Check availability via Spaceship API
    const availabilityResponse = await fetch(`${apiUrl}/domains/available`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'X-Api-Secret': apiSecret,
      } as HeadersInit,
      body: JSON.stringify({ domains: domainsToCheck })
    });

    if (!availabilityResponse.ok) {
      const errorText = await availabilityResponse.text();
      console.error("Spaceship availability API error:", errorText);
      return NextResponse.json({ error: 'Spaceship API error' }, { status: availabilityResponse.status });
    }

    const availabilityData = await availabilityResponse.json();

    // Map results using hardcoded real Spaceship retail prices
    const results = availabilityData.domains.map((res: any) => {
      const tld = res.domain.split('.').slice(1).join('.');
      const basePrice = SPACESHIP_TLD_PRICES[tld] ?? 12.00;

      console.log(`✅ Domain: ${res.domain} | Spaceship: $${basePrice} | After 12% markup: $${(basePrice * 1.12).toFixed(2)}`);

      const finalPriceDetails = calculateFinalPrice(basePrice, currency);

      return {
        domain: res.domain,
        available: res.result === 'available',
        priceUSD: basePrice,
        priceUser: `${currency === 'PEN' ? 'S/ ' : '$'}${finalPriceDetails.total.toFixed(2)}`,
        currency
      };
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error("Search API route error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
