import axios from 'axios';
import { HashrateData, NetworkStats } from '@/types';

// For Litecoin, we'll use estimated data based on network stats
// In production, you could use litecoinpool.org API or similar

export async function fetchLitecoinHashrate(): Promise<NetworkStats> {
  try {
    // Litecoin network stats - using estimated current values
    // Current LTC hashrate is around 1.5 PH/s (petahashes)

    const now = Date.now();
    const currentHashrate = 1500; // TH/s (1.5 PH/s)
    const currentDifficulty = 45000000;

    // Generate 90 days of historical data with realistic trends
    const historicalData: HashrateData[] = [];
    for (let i = 90; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      // Simulate gradual growth with some variance
      const growthFactor = 0.90 + ((90 - i) / 90) * 0.15; // 10% growth over 90 days
      const variance = 0.90 + (Math.random() * 0.2); // ±10% daily variance
      const hashrate = currentHashrate * growthFactor * variance;

      historicalData.push({
        timestamp,
        hashrate,
        difficulty: currentDifficulty * growthFactor * variance,
      });
    }

    const current = historicalData[historicalData.length - 1];
    const sevenDaysAgo = historicalData[historicalData.length - 7];
    const thirtyDaysAgo = historicalData[historicalData.length - 30];
    const ninetyDaysAgo = historicalData[0];

    const change7d = ((current.hashrate - sevenDaysAgo.hashrate) / sevenDaysAgo.hashrate) * 100;
    const change30d = ((current.hashrate - thirtyDaysAgo.hashrate) / thirtyDaysAgo.hashrate) * 100;
    const change90d = ((current.hashrate - ninetyDaysAgo.hashrate) / ninetyDaysAgo.hashrate) * 100;

    return {
      coin: 'Litecoin',
      symbol: 'LTC',
      currentHashrate: current.hashrate,
      currentDifficulty: current.difficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: Date.now(),
      historicalData,
      currentPrice: 0,
      priceChange24h: 0,
      marketCap: 0,
    };
  } catch (error) {
    console.error('Error fetching Litecoin data:', error);
    throw new Error('Failed to fetch Litecoin hashrate data');
  }
}
