import { NetworkStats } from '@/types';

// Ergo block time is 120 seconds (2 minutes)
const ERGO_BLOCK_TIME = 120;

interface ErgoBlock {
  height: number;
  timestamp: number;
  difficulty: number;
  minerReward: number;
}

interface ErgoBlocksResponse {
  items: ErgoBlock[];
  total: number;
}

async function fetchBlockData(offset: number): Promise<ErgoBlock | null> {
  const response = await fetch(`https://api.ergoplatform.com/api/v1/blocks?limit=1&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Ergo block at offset ${offset}`);
  }
  const data: ErgoBlocksResponse = await response.json();
  return data.items[0] || null;
}

function calculateHashrateFromDifficulty(difficulty: number): number {
  // Ergo uses Autolykos v2 - hashrate formula: Difficulty * 2^32 / BlockTime
  const hashrate = (difficulty * Math.pow(2, 32)) / ERGO_BLOCK_TIME;
  return hashrate / 1e12; // Convert to TH/s (Terahashes)
}

export async function fetchErgoHashrate(): Promise<NetworkStats> {
  try {
    // Fetch current block
    const currentBlock = await fetchBlockData(0);
    if (!currentBlock) throw new Error('No current block data');

    const currentDifficulty = currentBlock.difficulty;
    const currentHashrate = calculateHashrateFromDifficulty(currentDifficulty);
    const currentHeight = currentBlock.height;

    // Ergo: 1 block per 120 seconds = 720 blocks per day
    const blocksPerDay = 720;
    const offset7d = blocksPerDay * 7;
    const offset30d = blocksPerDay * 30;
    const offset90d = blocksPerDay * 90;

    // Fetch historical blocks in parallel
    const [block7d, block30d, block90d] = await Promise.all([
      fetchBlockData(offset7d).catch(() => null),
      fetchBlockData(offset30d).catch(() => null),
      fetchBlockData(offset90d).catch(() => null),
    ]);

    // Calculate historical hashrates
    const hashrate7d = block7d ? calculateHashrateFromDifficulty(block7d.difficulty) : currentHashrate;
    const hashrate30d = block30d ? calculateHashrateFromDifficulty(block30d.difficulty) : currentHashrate;
    const hashrate90d = block90d ? calculateHashrateFromDifficulty(block90d.difficulty) : currentHashrate;

    // Generate historical data for chart (sample every 3 days for 90 days = 30 data points)
    const historicalData = [];
    for (let i = 90; i >= 0; i -= 3) {
      const offset = blocksPerDay * i;
      historicalData.push({
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        hashrate: i === 0 ? currentHashrate :
                  i <= 7 ? hashrate7d :
                  i <= 30 ? hashrate30d : hashrate90d,
        difficulty: i === 0 ? currentDifficulty :
                    i <= 7 && block7d ? block7d.difficulty :
                    i <= 30 && block30d ? block30d.difficulty :
                    i <= 90 && block90d ? block90d.difficulty : currentDifficulty,
      });
    }

    // Calculate trend changes
    const change7d = ((currentHashrate - hashrate7d) / hashrate7d) * 100;
    const change30d = ((currentHashrate - hashrate30d) / hashrate30d) * 100;
    const change90d = ((currentHashrate - hashrate90d) / hashrate90d) * 100;

    return {
      coin: 'Ergo',
      symbol: 'ERG',
      currentHashrate,
      currentDifficulty,
      change7d,
      change30d,
      change90d,
      lastUpdated: currentBlock.timestamp,
      historicalData,
      currentPrice: 0, // Will be filled by price fetcher
      priceChange24h: 0, // Will be filled by price fetcher
      marketCap: 0, // Will be filled by price fetcher
    };
  } catch (error) {
    console.error('Error fetching Ergo data:', error);
    throw error;
  }
}
