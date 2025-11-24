#!/usr/bin/env node

/**
 * Backfill Historical Data Script
 *
 * Fetches 90 days of historical data from Minerstat API
 * and populates the history files.
 *
 * Run once to bootstrap historical data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MINERSTAT_HISTORY_API = 'https://api.minerstat.com/v2/coins-history';

// Coin configurations with correct algorithm names for Minerstat
const COINS = {
  BTC: { name: 'Bitcoin', algorithm: 'SHA-256', algo: 'SHA-256', blockTime: 600 },
  LTC: { name: 'Litecoin', algorithm: 'Scrypt', algo: 'Scrypt', blockTime: 150 },
  XMR: { name: 'Monero', algorithm: 'RandomX', algo: 'RandomX', blockTime: 120 },
  DOGE: { name: 'Dogecoin', algorithm: 'Scrypt', algo: 'Scrypt', blockTime: 60 },
  KAS: { name: 'Kaspa', algorithm: 'kHeavyHash', algo: 'KHeavyHash', blockTime: 1 },
  ETC: { name: 'Ethereum Classic', algorithm: 'Etchash', algo: 'Etchash', blockTime: 13 },
  RVN: { name: 'Ravencoin', algorithm: 'KAWPOW', algo: 'KAWPOW', blockTime: 60 },
  ZEC: { name: 'Zcash', algorithm: 'Equihash', algo: 'Equihash', blockTime: 75 },
  BCH: { name: 'Bitcoin Cash', algorithm: 'SHA-256', algo: 'SHA-256', blockTime: 600 },
  ERG: { name: 'Ergo', algorithm: 'Autolykos2', algo: 'Autolykos2', blockTime: 120 },
  CFX: { name: 'Conflux', algorithm: 'Octopus', algo: 'Octopus', blockTime: 0.5 },
};

async function fetchHistoricalData(symbol, algo) {
  const url = `${MINERSTAT_HISTORY_API}?coin=${symbol}&algo=${algo}&period=90d`;
  console.log(`  Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'BloxChaser/1.0 (https://bloxchaser.vercel.app)',
    },
  });

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`);
  }

  return await response.json();
}

function getHistoryPath(symbol) {
  return path.join(__dirname, '..', 'data', 'history', `${symbol.toLowerCase()}-history.json`);
}

async function backfillCoin(symbol) {
  const config = COINS[symbol];
  if (!config) {
    console.log(`  Unknown coin: ${symbol}`);
    return 0;
  }

  try {
    const data = await fetchHistoricalData(symbol, config.algo);
    const coinData = data[symbol];

    if (!coinData || Object.keys(coinData).length === 0) {
      console.log(`  No historical data available for ${symbol}`);
      return 0;
    }

    // Convert Minerstat format to our format
    // Minerstat: { timestamp: [difficulty, hashrate, ?, price] }
    const entries = [];
    for (const [timestamp, values] of Object.entries(coinData)) {
      const difficulty = parseFloat(values[0]) || 0;
      const hashrate = parseFloat(values[1]) || 0;
      const price = parseFloat(values[3]) || 0;

      // Skip invalid entries
      if (hashrate <= 0 && difficulty <= 0) {
        continue;
      }

      entries.push({
        t: parseInt(timestamp),
        d: difficulty,
        h: hashrate,
        p: price,
      });
    }

    // Sort by timestamp
    entries.sort((a, b) => a.t - b.t);

    // Create history object
    const history = {
      coin: symbol,
      name: config.name,
      algorithm: config.algorithm,
      blockTime: config.blockTime,
      dataStarted: new Date(entries[0].t * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      totalEntries: entries.length,
      source: 'Minerstat API (backfill)',
      data: entries,
    };

    // Write to file
    const filePath = getHistoryPath(symbol);
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));

    return entries.length;
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log('=== BloxChaser Historical Data Backfill ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');

  const historyDir = path.join(__dirname, '..', 'data', 'history');
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  let totalEntries = 0;
  let successCount = 0;

  for (const symbol of Object.keys(COINS)) {
    console.log(`Processing ${symbol}...`);
    const count = await backfillCoin(symbol);

    if (count > 0) {
      console.log(`  ✅ ${count} entries saved`);
      totalEntries += count;
      successCount++;
    } else {
      console.log(`  ⚠️ No data`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('=== Summary ===');
  console.log(`Coins with data: ${successCount}/${Object.keys(COINS).length}`);
  console.log(`Total entries: ${totalEntries}`);
  console.log('=== Done ===');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
