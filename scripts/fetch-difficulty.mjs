#!/usr/bin/env node

/**
 * Fetch Difficulty Script
 *
 * This script fetches current difficulty data for all coins from Minerstat API
 * and appends it to the difficulty-history.json file.
 *
 * Run by GitHub Actions every 4 hours.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MINERSTAT_API = 'https://api.minerstat.com/v2/coins';

// Coin symbols to fetch
const COINS = ['BTC', 'LTC', 'XMR', 'DOGE', 'KAS', 'ETC', 'RVN', 'ZEC', 'BCH', 'ERG', 'CFX'];

// Hashrate calculation formulas for each algorithm
const HASHRATE_FORMULAS = {
  BTC: (diff) => (diff * Math.pow(2, 32)) / 600,           // SHA-256, 10 min blocks
  LTC: (diff) => (diff * Math.pow(2, 32)) / 150,           // Scrypt, 2.5 min blocks
  XMR: (diff) => diff / 120,                                // RandomX, 2 min blocks
  DOGE: (diff) => (diff * Math.pow(2, 32)) / 60,           // Scrypt, 1 min blocks
  KAS: (diff) => diff,                                      // kHeavyHash, 1 sec blocks
  ETC: (diff) => diff / 13,                                 // Etchash, 13 sec blocks
  RVN: (diff) => diff / 60,                                 // KAWPOW, 1 min blocks
  ZEC: (diff) => (diff * 8192) / 75,                        // Equihash, 75 sec blocks
  BCH: (diff) => (diff * Math.pow(2, 32)) / 600,           // SHA-256, 10 min blocks
  ERG: (diff) => diff / 120,                                // Autolykos2, 2 min blocks
  CFX: (diff) => diff * 2,                                  // Octopus, 0.5 sec blocks
};

async function fetchFromMinerstat() {
  const coinList = COINS.join(',');
  const url = `${MINERSTAT_API}?list=${coinList}`;

  console.log(`Fetching from: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'BloxChaser/1.0 (https://bloxchaser.vercel.app)',
    },
    timeout: 30000,
  });

  if (!response.ok) {
    throw new Error(`Minerstat API failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

function calculateHashrate(symbol, difficulty) {
  const formula = HASHRATE_FORMULAS[symbol];
  if (!formula) {
    console.warn(`No hashrate formula for ${symbol}`);
    return 0;
  }
  return formula(difficulty);
}

async function main() {
  const historyPath = path.join(__dirname, '..', 'data', 'difficulty-history.json');

  console.log('=== BloxChaser Difficulty Collector ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`History file: ${historyPath}`);

  // Read existing history
  let history;
  try {
    const data = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(data);
  } catch (error) {
    console.error('Error reading history file:', error.message);
    process.exit(1);
  }

  // Fetch current difficulty data
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

    if (!COINS.includes(symbol)) {
      continue;
    }

    const difficulty = coin.difficulty;
    const networkHashrate = coin.network_hashrate;
    const calculatedHashrate = calculateHashrate(symbol, difficulty);

    // Create entry with both difficulty and hashrate for verification
    const entry = {
      t: timestamp,                    // Unix timestamp
      d: difficulty,                   // Difficulty from blockchain
      h: networkHashrate,              // Hashrate from API (for verification)
      c: calculatedHashrate,           // Calculated hashrate (for verification)
    };

    // Append to history
    if (!history[symbol]) {
      history[symbol] = [];
    }
    history[symbol].push(entry);
    updated++;

    console.log(`${symbol}: diff=${difficulty.toExponential(2)}, hash=${networkHashrate.toExponential(2)}, calc=${calculatedHashrate.toExponential(2)}`);
  }

  // Update metadata
  history.metadata.lastUpdated = dateStr;

  // Write updated history
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log(`\nUpdated ${updated} coins at ${dateStr}`);
    console.log(`Total entries per coin: ${history.BTC?.length || 0}`);
  } catch (error) {
    console.error('Error writing history file:', error.message);
    process.exit(1);
  }

  console.log('=== Done ===');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
