/**
 * USD → PEN exchange rate (free APIs, no API key).
 * Primary: open.er-api.com · Fallback: fawazahmed0/currency-api (jsDelivr)
 */

export const FALLBACK_USD_TO_PEN = 3.75;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface ExchangeRateResult {
  rate: number;
  source: "open.er-api" | "currency-api" | "cache" | "fallback";
  date: string;
  base: "USD";
  quote: "PEN";
}

let memoryCache: { result: ExchangeRateResult; fetchedAt: number } | null = null;

async function fetchFromOpenErApi(): Promise<ExchangeRateResult | null> {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const rate = Number(data?.rates?.PEN);

  if (data?.result !== "success" || !rate || rate <= 0) return null;

  const date = data.time_last_update_unix
    ? new Date(data.time_last_update_unix * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return { rate, source: "open.er-api", date, base: "USD", quote: "PEN" };
}

async function fetchFromCurrencyApi(): Promise<ExchangeRateResult | null> {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) return null;

  const data = await response.json();
  const rate = Number(data?.usd?.pen);

  if (!rate || rate <= 0) return null;

  return {
    rate,
    source: "currency-api",
    date: new Date().toISOString().slice(0, 10),
    base: "USD",
    quote: "PEN",
  };
}

export async function fetchUsdToPenRate(): Promise<ExchangeRateResult> {
  if (memoryCache && Date.now() - memoryCache.fetchedAt < CACHE_TTL_MS) {
    return { ...memoryCache.result, source: "cache" };
  }

  const providers = [fetchFromOpenErApi, fetchFromCurrencyApi];

  for (const provider of providers) {
    try {
      const result = await provider();
      if (result) {
        memoryCache = { result, fetchedAt: Date.now() };
        return result;
      }
    } catch (error) {
      console.warn("[exchange-rate] Provider failed:", error);
    }
  }

  console.warn("[exchange-rate] All providers failed, using fallback");
  return {
    rate: FALLBACK_USD_TO_PEN,
    source: "fallback",
    date: new Date().toISOString().slice(0, 10),
    base: "USD",
    quote: "PEN",
  };
}

export function usdToPen(usd: number, rate: number): number {
  return Math.round(usd * rate * 100) / 100;
}