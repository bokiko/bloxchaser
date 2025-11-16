import { NetworkStats } from '@/types';

// Zcash block time is 75 seconds (1.25 minutes)
const ZCASH_BLOCK_TIME = 75;

interface BlockbookResponse {
  blockbook: {
    coin: string;
    bestHeight: number;
    lastBlockTime: string;
  };
  backend: {
    chain: string;
    blocks: number;
    difficulty: string;
  };
}

interface BlockResponse {
  height: number;
  time: number;
  difficulty: string;
}

async function fetchBlockDifficulty(blockHeight: number): Promise<{ difficulty: number; timestamp: number }> {
  const response = await fetch(`https://zecblockexplorer.com/api/v2/block/${blockHeight}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch block ${blockHeight}`);
  }
  const data: BlockResponse = await response.json();
  return {
    difficulty: parseFloat(data.difficulty),
    timestamp: data.time * 1000, // Convert to milliseconds
  };
}

function calculateHashrateFromDifficulty(difficulty: number): number {
  // Zcash uses Equihash algorithm - hashrate is measured in Sol/s (solutions/second)
  // For Zcash, the difficulty value directly represents the network's Sol/s
  // We return in MSol/s (Mega-solutions per second) for display
  return difficulty / 1e6; // Convert to MSol/s
}

export async function fetchZcashHashrate(): Promise<NetworkStats> {
  try {
    // Fetch current network info
    const response = await fetch('https://zecblockexplorer.com/api/v2', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Blockbook API error: ${response.status}`);
    }

    const data: BlockbookResponse = await response.json();
    const currentBlockHeight = data.backend.blocks;
    const currentDifficulty = parseFloat(data.backend.difficulty);
    const currentHashrate = calculateHashrateFromDifficulty(currentDifficulty);

    // Calculate block heights for historical data
    // Zcash: 1 block per 75 seconds = 1152 blocks per day
    const blocksPerDay = 1152; // 24 * 60 * 60 / 75
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
      coin: 'Zcash',
      symbol: 'ZEC',
      currentHashrate: currentHashrate,
      currentDifficulty: currentDifficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: new Date(data.blockbook.lastBlockTime).getTime(),
      historicalData,
      currentPrice: 0, // Will be filled by price fetcher
      priceChange24h: 0, // Will be filled by price fetcher
      marketCap: 0, // Will be filled by price fetcher
    };
  } catch (error) {
    console.error('Error fetching Zcash data:', error);
    throw error;
  }
}
