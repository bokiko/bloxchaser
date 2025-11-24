/**
 * Historical Difficulty Data Reader
 *
 * Reads difficulty/hashrate history from data/difficulty-history.json
 * Data is collected every 4 hours by GitHub Actions
 */

import fs from 'fs';
import path from 'path';

interface HistoryEntry {
  t: number;  // Unix timestamp
  d: number;  // Difficulty
  h: number;  // Hashrate from API
  c: number;  // Calculated hashrate
}

interface DifficultyHistory {
  metadata: {
    description: string;
    startDate: string;
    lastUpdated: string | null;
    coins: string[];
  };
  [coin: string]: HistoryEntry[] | object;
}

// Cache the history to avoid re-reading the file multiple times
let cachedHistory: DifficultyHistory | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

export function getHistoricalData(): DifficultyHistory {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedHistory && (now - cacheTime) < CACHE_TTL) {
    return cachedHistory;
  }

  try {
    const historyPath = path.join(process.cwd(), 'data', 'difficulty-history.json');
    const data = fs.readFileSync(historyPath, 'utf-8');
    cachedHistory = JSON.parse(data);
    cacheTime = now;
    return cachedHistory as DifficultyHistory;
  } catch (error) {
    console.error('Error reading historical data:', error);
    // Return empty structure if file doesn't exist
    return {
      metadata: {
        description: 'Historical difficulty data',
        startDate: '',
        lastUpdated: null,
        coins: [],
      },
    };
  }
}

export function getCoinHistory(symbol: string): HistoryEntry[] {
  const history = getHistoricalData();
  const coinData = history[symbol];

  if (Array.isArray(coinData)) {
    return coinData;
  }
  return [];
}

export interface HashrateDataPoint {
  timestamp: number;
  hashrate: number;
  difficulty: number;
}

/**
 * Get historical hashrate data for a coin
 * Returns data points suitable for charting
 */
export function getHistoricalHashrate(symbol: string): HashrateDataPoint[] {
  const entries = getCoinHistory(symbol);

  return entries
    .filter(entry => entry.h > 0) // Filter out invalid entries
    .map(entry => ({
      timestamp: entry.t * 1000, // Convert to milliseconds
      hashrate: entry.h,
      difficulty: entry.d,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Get hashrate change percentage over a period
 * @param symbol Coin symbol
 * @param days Number of days to look back
 */
export function getHashrateChange(symbol: string, days: number): number {
  const data = getHistoricalHashrate(symbol);

  if (data.length < 2) {
    return 0;
  }

  const now = Date.now();
  const cutoff = now - (days * 24 * 60 * 60 * 1000);

  // Get current hashrate (most recent)
  const current = data[data.length - 1];

  // Find hashrate from X days ago (closest to cutoff)
  const past = data.find(d => d.timestamp >= cutoff) || data[0];

  if (past.hashrate === 0) {
    return 0;
  }

  return ((current.hashrate - past.hashrate) / past.hashrate) * 100;
}

/**
 * Get hashrate at specific intervals for charting
 * Returns data points at regular intervals (every 4 hours)
 */
export function getHashrateForChart(symbol: string, days: number = 90): HashrateDataPoint[] {
  const data = getHistoricalHashrate(symbol);
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

  return data.filter(d => d.timestamp >= cutoff);
}

/**
 * Check if we have enough historical data for a coin
 */
export function hasHistoricalData(symbol: string, minDays: number = 7): boolean {
  const data = getHistoricalHashrate(symbol);

  if (data.length < 2) {
    return false;
  }

  const oldest = data[0].timestamp;
  const now = Date.now();
  const daysCovered = (now - oldest) / (24 * 60 * 60 * 1000);

  return daysCovered >= minDays;
}

/**
 * Get metadata about the historical data collection
 */
export function getHistoryMetadata() {
  const history = getHistoricalData();
  return history.metadata;
}
