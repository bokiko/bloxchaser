import axios from 'axios';
import { HashrateData, NetworkStats } from '@/types';

// For Monero, we'll use a combination of APIs and estimated hashrate based on difficulty
// Monero doesn't have a single centralized API like Bitcoin, so we'll use block data

export async function fetchMoneroHashrate(): Promise<NetworkStats> {
  try {
    // Monero network stats - using estimated current values
    // In production, you'd want to use MoneroBlocks.info API or similar

    // Simulated historical data for now - you can replace with real API later
    const now = Date.now();
    const currentHashrate = 2.8; // GH/s (estimated current Monero hashrate)
    const currentDifficulty = 380000000000;

    // Generate 90 days of simulated data with realistic variance
    const historicalData: HashrateData[] = [];
    for (let i = 90; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const variance = 0.85 + (Math.random() * 0.3); // ±15% variance
      const hashrate = currentHashrate * variance;

      historicalData.push({
        timestamp,
        hashrate,
        difficulty: currentDifficulty * variance,
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
      coin: 'Monero',
      symbol: 'XMR',
      currentHashrate: current.hashrate,
      currentDifficulty: current.difficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: Date.now(),
      historicalData,
    };
  } catch (error) {
    console.error('Error fetching Monero data:', error);
    throw new Error('Failed to fetch Monero hashrate data');
  }
}
