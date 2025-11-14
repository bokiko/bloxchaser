import axios from 'axios';
import { HashrateData, NetworkStats } from '@/types';

const BLOCKCHAIN_API = 'https://blockchain.info';

interface BlockchainHashrateResponse {
  values: Array<{
    x: number; // timestamp in seconds
    y: number; // hashrate in TH/s
  }>;
}

export async function fetchBitcoinHashrate(): Promise<NetworkStats> {
  try {
    // Fetch hashrate data for the last 180 days
    const hashrateResponse = await axios.get<BlockchainHashrateResponse>(
      `${BLOCKCHAIN_API}/charts/hash-rate?timespan=180days&format=json&cors=true`
    );

    // Fetch difficulty data
    const difficultyResponse = await axios.get<BlockchainHashrateResponse>(
      `${BLOCKCHAIN_API}/charts/difficulty?timespan=180days&format=json&cors=true`
    );

    const hashrateData = hashrateResponse.data.values;
    const difficultyData = difficultyResponse.data.values;

    // Convert to our format (convert TH/s to EH/s: divide by 1,000,000)
    const historicalData: HashrateData[] = hashrateData.map((point, index) => ({
      timestamp: point.x * 1000, // Convert to milliseconds
      hashrate: point.y / 1000000, // Convert TH/s to EH/s
      difficulty: difficultyData[index]?.y || 0,
    }));

    // Calculate current values and changes
    const current = historicalData[historicalData.length - 1];
    const sevenDaysAgo = historicalData[historicalData.length - 8];
    const thirtyDaysAgo = historicalData[historicalData.length - 31];
    const ninetyDaysAgo = historicalData[historicalData.length - 91];

    const change7d = sevenDaysAgo
      ? ((current.hashrate - sevenDaysAgo.hashrate) / sevenDaysAgo.hashrate) * 100
      : 0;
    const change30d = thirtyDaysAgo
      ? ((current.hashrate - thirtyDaysAgo.hashrate) / thirtyDaysAgo.hashrate) * 100
      : 0;
    const change90d = ninetyDaysAgo
      ? ((current.hashrate - ninetyDaysAgo.hashrate) / ninetyDaysAgo.hashrate) * 100
      : 0;

    return {
      coin: 'Bitcoin',
      symbol: 'BTC',
      currentHashrate: current.hashrate,
      currentDifficulty: current.difficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: Date.now(),
      historicalData: historicalData.slice(-180), // Last 180 days
    };
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    throw new Error('Failed to fetch Bitcoin hashrate data');
  }
}
