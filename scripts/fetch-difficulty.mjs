#!/usr/bin/env node

/**
 * Fetch Difficulty Script
 *
 * Fetches current difficulty/hashrate data for all coins from Minerstat API
 * and saves to separate JSON files per coin.
 *
 * Run by GitHub Actions every 4 hours.
 *
 * Output: data/history/{symbol}-history.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MINERSTAT_API = 'https://api.minerstat.com/v2/coins';

// Coin configurations
const COINS = {
  BTC: { name: 'Bitcoin', algorithm: 'SHA-256', blockTime: 600 },
  LTC: { name: 'Litecoin', algorithm: 'Scrypt', blockTime: 150 },
  XMR: { name: 'Monero', algorithm: 'RandomX', blockTime: 120 },
  DOGE: { name: 'Dogecoin', algorithm: 'Scrypt', blockTime: 60 },
  KAS: { name: 'Kaspa', algorithm: 'kHeavyHash', blockTime: 1 },
  ETC: { name: 'Ethereum Classic', algorithm: 'Etchash', blockTime: 13 },
  RVN: { name: 'Ravencoin', algorithm: 'KAWPOW', blockTime: 60 },
  ZEC: { name: 'Zcash', algorithm: 'Equihash', blockTime: 75 },
  BCH: { name: 'Bitcoin Cash', algorithm: 'SHA-256', blockTime: 600 },
  ERG: { name: 'Ergo', algorithm: 'Autolykos2', blockTime: 120 },
  CFX: { name: 'Conflux', algorithm: 'Octopus', blockTime: 0.5 },
};

async function fetchFromMinerstat() {
  const coinList = Object.keys(COINS).join(',');
  const url = `${MINERSTAT_API}?list=${coinList}`;

  console.log(`Fetching from: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'BloxChaser/1.0 (https://bloxchaser.vercel.app)',
    },
  });

  if (!response.ok) {
    throw new Error(`Minerstat API failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

function getHistoryPath(symbol) {
  return path.join(__dirname, '..', 'data', 'history', `${symbol.toLowerCase()}-history.json`);
}

function readCoinHistory(symbol) {
  const filePath = getHistoryPath(symbol);

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn(`Could not read history for ${symbol}:`, error.message);
  }

  // Return new structure if file doesn't exist
  const coinConfig = COINS[symbol];
  return {
    coin: symbol,
    name: coinConfig?.name || symbol,
    algorithm: coinConfig?.algorithm || 'Unknown',
    blockTime: coinConfig?.blockTime || 0,
    dataStarted: new Date().toISOString(),
    lastUpdated: null,
    totalEntries: 0,
    data: [],
  };
}

function writeCoinHistory(symbol, history) {
  const filePath = getHistoryPath(symbol);
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}

async function main() {
  const historyDir = path.join(__dirname, '..', 'data', 'history');

  console.log('=== BloxChaser Difficulty Collector ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`History directory: ${historyDir}`);

  // Ensure directory exists
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  // Fetch current data from Minerstat
  let minerstatData;
  try {
    minerstatData = await fetchFromMinerstat();
    console.log(`Fetched data for ${minerstatData.length} coins`);
  } catch (error) {
    console.error('Error fetching from Minerstat:', error.message);
    process.exit(1);
  }

  // Current timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  const dateStr = new Date().toISOString();

  // Process each coin
  let updated = 0;
  for (const coin of minerstatData) {
    const symbol = coin.coin;

    if (!COINS[symbol]) {
      continue;
    }

    // Skip invalid data
    if (coin.difficulty < 0 || coin.network_hashrate < 0) {
      console.log(`${symbol}: Skipping (invalid data)`);
      continue;
    }

    // Read existing history
    const history = readCoinHistory(symbol);

    // Create new entry
    const entry = {
      t: timestamp,                    // Unix timestamp
      d: coin.difficulty,              // Difficulty from blockchain
      h: coin.network_hashrate,        // Hashrate (H/s)
      p: coin.price || 0,              // Price in USD
    };

    // Append to history
    history.data.push(entry);
    history.lastUpdated = dateStr;
    history.totalEntries = history.data.length;

    // Write back
    writeCoinHistory(symbol, history);
    updated++;

    // Calculate hashrate in readable format
    const hashrate = coin.network_hashrate;
    let hashrateStr;
    if (hashrate >= 1e18) hashrateStr = (hashrate / 1e18).toFixed(2) + ' EH/s';
    else if (hashrate >= 1e15) hashrateStr = (hashrate / 1e15).toFixed(2) + ' PH/s';
    else if (hashrate >= 1e12) hashrateStr = (hashrate / 1e12).toFixed(2) + ' TH/s';
    else if (hashrate >= 1e9) hashrateStr = (hashrate / 1e9).toFixed(2) + ' GH/s';
    else if (hashrate >= 1e6) hashrateStr = (hashrate / 1e6).toFixed(2) + ' MH/s';
    else hashrateStr = hashrate.toFixed(2) + ' H/s';

    console.log(`${symbol}: ${hashrateStr}, diff=${coin.difficulty.toExponential(2)}, entries=${history.totalEntries}`);
  }

  console.log(`\n✅ Updated ${updated} coins at ${dateStr}`);
  console.log('=== Done ===');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
