/**
 * Historical Data Reader
 *
 * Reads difficulty/hashrate history from separate files per coin
 * Data is collected every 4 hours by GitHub Actions
 *
 * Files: data/history/{symbol}-history.json
 */

import fs from 'fs';
import path from 'path';

export interface HistoryEntry {
  t: number;  // Unix timestamp
  d: number;  // Difficulty
  h: number;  // Hashrate (H/s)
  p: number;  // Price (USD)
}

export interface CoinHistory {
  coin: string;
  name: string;
  algorithm: string;
  blockTime: number;
  dataStarted: string;
  lastUpdated: string | null;
  totalEntries: number;
  data: HistoryEntry[];
}

// Supported coins
export const SUPPORTED_COINS = ['BTC', 'LTC', 'XMR', 'DOGE', 'KAS', 'ETC', 'RVN', 'ZEC', 'BCH', 'ERG', 'CFX'];

// Cache to avoid re-reading files
const cache: Map<string, { data: CoinHistory; time: number }> = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

function getHistoryPath(symbol: string): string {
  return path.join(process.cwd(), 'data', 'history', `${symbol.toLowerCase()}-history.json`);
}

/**
 * Get historical data for a specific coin
 */
export function getCoinHistory(symbol: string): CoinHistory | null {
  const upperSymbol = symbol.toUpperCase();
  const now = Date.now();

  // Check cache
  const cached = cache.get(upperSymbol);
  if (cached && (now - cached.time) < CACHE_TTL) {
    return cached.data;
  }

  try {
    const filePath = getHistoryPath(upperSymbol);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const history = JSON.parse(data) as CoinHistory;

    // Update cache
    cache.set(upperSymbol, { data: history, time: now });

    return history;
  } catch (error) {
    console.error(`Error reading history for ${symbol}:`, error);
    return null;
  }
}

export interface HashrateDataPoint {
  timestamp: number;
  hashrate: number;
  difficulty: number;
  price: number;
}

/**
 * Get historical hashrate data for charting
 */
export function getHistoricalHashrate(symbol: string, days: number = 90): HashrateDataPoint[] {
  const history = getCoinHistory(symbol);

  if (!history || !history.data.length) {
    return [];
  }

  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

  return history.data
    .filter(entry => entry.h > 0)
    .map(entry => ({
      timestamp: entry.t * 1000,
      hashrate: entry.h,
      difficulty: entry.d,
      price: entry.p,
    }))
    .filter(entry => entry.timestamp >= cutoff)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Get hashrate change percentage over a period
 */
export function getHashrateChange(symbol: string, days: number): number {
  const data = getHistoricalHashrate(symbol, days + 1);

  if (data.length < 2) {
    return 0;
  }

  const current = data[data.length - 1];
  const oldest = data[0];

  if (oldest.hashrate === 0) {
    return 0;
  }

  return ((current.hashrate - oldest.hashrate) / oldest.hashrate) * 100;
}

/**
 * Get all available coins with history data
 */
export function getAvailableCoins(): string[] {
  return SUPPORTED_COINS.filter(symbol => {
    const history = getCoinHistory(symbol);
    return history && history.data.length > 0;
  });
}

/**
 * Get summary of all coins for API
 */
export function getAllCoinsSummary(): { symbol: string; name: string; entries: number; lastUpdated: string | null }[] {
  return SUPPORTED_COINS.map(symbol => {
    const history = getCoinHistory(symbol);
    return {
      symbol,
      name: history?.name || symbol,
      entries: history?.totalEntries || 0,
      lastUpdated: history?.lastUpdated || null,
    };
  });
}

/**
 * Get current stats for a coin
 */
export function getCurrentStats(symbol: string): {
  hashrate: number;
  difficulty: number;
  price: number;
  change7d: number;
  change30d: number;
  change90d: number;
} | null {
  const history = getCoinHistory(symbol);

  if (!history || !history.data.length) {
    return null;
  }

  const latest = history.data[history.data.length - 1];

  return {
    hashrate: latest.h,
    difficulty: latest.d,
    price: latest.p,
    change7d: getHashrateChange(symbol, 7),
    change30d: getHashrateChange(symbol, 30),
    change90d: getHashrateChange(symbol, 90),
  };
}
