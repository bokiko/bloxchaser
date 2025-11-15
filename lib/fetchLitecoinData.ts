import axios from 'axios';
import { HashrateData, NetworkStats } from '@/types';

const LITECOINSPACE_API = 'https://litecoinspace.org/api/v1';

export async function fetchLitecoinHashrate(): Promise<NetworkStats> {
  try {
    // Fetch hashrate data for 3 months from Litecoinspace (official Litecoin block explorer)
    const hashrateResponse = await axios.get(`${LITECOINSPACE_API}/mining/hashrate/3m`);

    const hashrateData = hashrateResponse.data;

    // Check if we have hashrate data
    if (!hashrateData || !hashrateData.hashrates || hashrateData.hashrates.length === 0) {
      throw new Error('No hashrate data received from Litecoinspace API');
    }

    // Get current difficulty - using a reasonable estimate
    // Litecoinspace might have this endpoint, or we can get from Minerstat
    const currentDifficulty = 118363910.7402615; // We'll update this from actual data

    // Convert to our format (convert H/s to TH/s: divide by 1e12)
    const historicalData: HashrateData[] = hashrateData.hashrates.map((point: any) => ({
      timestamp: point.timestamp * 1000, // Convert to milliseconds
      hashrate: point.avgHashrate / 1e12, // Convert H/s to TH/s
      difficulty: currentDifficulty,
    }));

    // Calculate current values and changes
    const current = historicalData[historicalData.length - 1];
    const sevenDaysAgo = historicalData[Math.max(0, historicalData.length - 7)];
    const thirtyDaysAgo = historicalData[Math.max(0, historicalData.length - 30)];
    const ninetyDaysAgo = historicalData[Math.max(0, historicalData.length - 90)];

    const change7d = sevenDaysAgo && current.hashrate !== sevenDaysAgo.hashrate
      ? ((current.hashrate - sevenDaysAgo.hashrate) / sevenDaysAgo.hashrate) * 100
      : 0;
    const change30d = thirtyDaysAgo && current.hashrate !== thirtyDaysAgo.hashrate
      ? ((current.hashrate - thirtyDaysAgo.hashrate) / thirtyDaysAgo.hashrate) * 100
      : 0;
    const change90d = ninetyDaysAgo && current.hashrate !== ninetyDaysAgo.hashrate
      ? ((current.hashrate - ninetyDaysAgo.hashrate) / ninetyDaysAgo.hashrate) * 100
      : 0;

    return {
      coin: 'Litecoin',
      symbol: 'LTC',
      currentHashrate: current.hashrate,
      currentDifficulty,
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
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
      console.error('API Status:', error.response?.status);
      console.error('API URL:', error.config?.url);
    }
    throw new Error('Failed to fetch Litecoin hashrate data');
  }
}
