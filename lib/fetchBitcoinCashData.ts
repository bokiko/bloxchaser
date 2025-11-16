import { NetworkStats } from '@/types';

// Bitcoin Cash block time is 600 seconds (10 minutes) - same as Bitcoin
const BCH_BLOCK_TIME = 600;

interface BlockchairStatsResponse {
  data: {
    blocks: number;
    difficulty: number;
    hashrate_24h: string;
    best_block_height: number;
    best_block_time: string;
    market_price_usd: number;
    market_cap_usd: number;
  };
}

interface BlockchairBlockResponse {
  data: {
    [key: string]: {
      block: {
        id: number;
        time: string;
        difficulty: number;
      };
    };
  };
}

async function fetchBlockDifficulty(blockHeight: number): Promise<{ difficulty: number; timestamp: number }> {
  const response = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/block/${blockHeight}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch block ${blockHeight}`);
  }
  const data: BlockchairBlockResponse = await response.json();
  const blockData = Object.values(data.data)[0].block;
  return {
    difficulty: blockData.difficulty,
    timestamp: new Date(blockData.time).getTime(),
  };
}

function calculateHashrateFromDifficulty(difficulty: number): number {
  // Formula: Hashrate = Difficulty * 2^32 / BlockTime
  const hashrate = (difficulty * Math.pow(2, 32)) / BCH_BLOCK_TIME;
  return hashrate / 1e18; // Convert to EH/s (Exahash)
}

export async function fetchBitcoinCashHashrate(): Promise<NetworkStats> {
  try {
    // Fetch current network info from Blockchair
    const response = await fetch('https://api.blockchair.com/bitcoin-cash/stats', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Blockchair API error: ${response.status}`);
    }

    const data: BlockchairStatsResponse = await response.json();
    const currentBlockHeight = data.data.best_block_height;
    const currentDifficulty = data.data.difficulty;
    const currentHashrate = calculateHashrateFromDifficulty(currentDifficulty);

    // Calculate block heights for historical data
    // BCH: 1 block per 600 seconds = 144 blocks per day
    const blocksPerDay = 144; // 24 * 60 * 60 / 600
    const blocks7DaysAgo = Math.max(0, currentBlockHeight - (blocksPerDay * 7));
    const blocks30DaysAgo = Math.max(0, currentBlockHeight - (blocksPerDay * 30));
    const blocks90DaysAgo = Math.max(0, currentBlockHeight - (blocksPerDay * 90));

    // Fetch historical blocks in parallel
    const [block7d, block30d, block90d] = await Promise.all([
      fetchBlockDifficulty(blocks7DaysAgo).catch(() => null),
      fetchBlockDifficulty(blocks30DaysAgo).catch(() => null),
      fetchBlockDifficulty(blocks90DaysAgo).catch(() => null),
    ]);

    // Calculate historical hashrates
    const hashrate7d = block7d ? calculateHashrateFromDifficulty(block7d.difficulty) : currentHashrate;
    const hashrate30d = block30d ? calculateHashrateFromDifficulty(block30d.difficulty) : currentHashrate;
    const hashrate90d = block90d ? calculateHashrateFromDifficulty(block90d.difficulty) : currentHashrate;

    // Generate historical data for chart (sample every 3 days for 90 days = 30 data points)
    const historicalData = [];
    const sampleInterval = blocksPerDay * 3; // Every 3 days

    for (let i = 90; i >= 0; i -= 3) {
      const blockHeight = Math.max(0, currentBlockHeight - (blocksPerDay * i));
      // Estimate difficulty for historical points based on which block we fetched
      const historicalDifficulty = i === 0 ? currentDifficulty :
                                    i <= 7 && block7d ? block7d.difficulty :
                                    i <= 30 && block30d ? block30d.difficulty :
                                    i <= 90 && block90d ? block90d.difficulty : currentDifficulty;

      historicalData.push({
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        hashrate: i === 0 ? currentHashrate :
                  i <= 7 ? hashrate7d :
                  i <= 30 ? hashrate30d : hashrate90d,
        difficulty: historicalDifficulty,
      });
    }

    // Calculate trend changes
    const change7d = ((currentHashrate - hashrate7d) / hashrate7d) * 100;
    const change30d = ((currentHashrate - hashrate30d) / hashrate30d) * 100;
    const change90d = ((currentHashrate - hashrate90d) / hashrate90d) * 100;

    return {
      coin: 'Bitcoin Cash',
      symbol: 'BCH',
      currentHashrate: currentHashrate,
      currentDifficulty: currentDifficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: new Date(data.data.best_block_time).getTime(),
      historicalData,
      currentPrice: 0, // Will be filled by price fetcher
      priceChange24h: 0, // Will be filled by price fetcher
      marketCap: 0, // Will be filled by price fetcher
    };
  } catch (error) {
    console.error('Error fetching Bitcoin Cash data:', error);
    throw error;
  }
}
