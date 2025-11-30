# bloxchaser Architecture & Data Structure Guide

**Project Name:** bloxchaser (all lowercase - never "BloxChaser")
**Official Logo:** `/public/logo.svg`
**Last Updated:** 2025-11-24

---

## ⚠️ CRITICAL: MANDATORY RULES - NEVER IGNORE

**This document is a PERMANENT GUIDE that MUST be followed in every development session.**

### For AI Assistants (Claude Code):
- **ALWAYS** consult this guide before adding any new network
- **ALWAYS** follow the 8-step checklist completely
- **NEVER** skip API endpoint research (see Rule 0 below)
- **NEVER** deviate from the `NetworkStats` interface
- **NEVER** ignore unit conversion verification
- **ALWAYS** test against real-world data sources before committing

### For Human Developers:
- This guide ensures data integrity and code consistency
- All network additions must pass the verification checklist
- No exceptions to the type system or data flow patterns

---

## Table of Contents

1. [RULE 0: API Endpoint Research (MANDATORY)](#rule-0-api-endpoint-research-mandatory)
2. [Project Structure](#project-structure)
3. [Data Structure & Types](#data-structure--types)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Rules for Adding New Networks](#rules-for-adding-new-networks)
6. [Network Configuration Checklist](#network-configuration-checklist)
7. [File Modification Checklist](#file-modification-checklist)

---

## RULE 0: API Endpoint Research (MANDATORY)

**⚠️ CRITICAL REQUIREMENT: When adding ANY new network, you MUST research and document API endpoints BEFORE writing any code.**

### Step 0: API Endpoint Discovery

Before creating any fetcher file, you MUST find and verify:

#### 1. Primary Explorer API Endpoint
- **Official block explorer** for the coin
- Must provide: hashrate, difficulty, and/or block data
- Must be publicly accessible (no API key required, or key is available)
- Must be actively maintained (check for recent updates)

#### 2. Secondary Support API (Fallback #1)
- Alternative source for the same data
- Can be: another explorer, mining pool API, or aggregator
- Must provide at least: hashrate OR difficulty data
- Preferably from a different provider than primary

#### 3. Tertiary Support API (Fallback #2)
- Third alternative data source
- Can be: Minerstat, CoinWarz, mining pool stats, or blockchain RPC
- Used as final fallback if primary and secondary fail
- Must be independently verifiable

### Research Process (Step-by-Step)

When user requests: "Add GRIN network"

**YOU MUST DO THIS FIRST:**

```
1. Search for "GRIN blockchain explorer API"
2. Search for "GRIN network hashrate API"
3. Search for "GRIN mining pool API"
4. Test each endpoint with curl or WebFetch
5. Document findings in code comments
6. Choose primary, secondary, tertiary based on reliability
```

### Example Documentation Format

Add this comment block at the top of every fetcher file:

```typescript
/**
 * GRIN Network Data Fetcher
 *
 * API Endpoints (in order of preference):
 *
 * PRIMARY: https://grinexplorer.net/api/v1
 *   - Provides: hashrate, difficulty, block data
 *   - Tested: 2025-01-18
 *   - Status: Active ✅
 *
 * SECONDARY: https://grinscan.net/api
 *   - Provides: difficulty, network stats
 *   - Tested: 2025-01-18
 *   - Status: Active ✅
 *
 * TERTIARY: Minerstat API (https://api.minerstat.com/v2/coins?list=GRIN)
 *   - Provides: network_hashrate, difficulty, price
 *   - Tested: 2025-01-18
 *   - Status: Active ✅
 *
 * FALLBACK PLAN: If all APIs fail, calculate hashrate from difficulty using:
 *   - Algorithm: Cuckatoo31+ (GRIN's PoW algorithm)
 *   - Formula: hashrate = (difficulty × 2^32) / block_time / adjustment_factor
 *   - Block time: 60 seconds
 */
```

### Verification Checklist (BEFORE CODING)

- [ ] Found at least 3 API endpoints for this network
- [ ] Tested primary endpoint with `curl` or `WebFetch`
- [ ] Verified data format and availability
- [ ] Checked API rate limits (if any)
- [ ] Confirmed no authentication required (or obtained API key)
- [ ] Cross-verified hashrate values between sources (within 10% tolerance)
- [ ] Documented all endpoints in code comments
- [ ] Identified fallback calculation method if all APIs fail

### Real-World Examples from Current Networks

**Bitcoin:**
```
PRIMARY: mempool.space/api/v1 (hashrate data) ✅
SECONDARY: blockchain.info/stats (network stats) ✅
TERTIARY: Minerstat API (aggregated data) ✅
```

**Dogecoin:**
```
PRIMARY: GetBlock RPC (networkhashps) ✅
SECONDARY: dogechain.info/api (network stats) ✅
TERTIARY: Minerstat API (aggregated data) ✅
```

**Kaspa:**
```
PRIMARY: api.kaspa.org/info/hashrate (official API) ✅
SECONDARY: kas.fyi (community explorer) ✅
TERTIARY: Minerstat API (aggregated data) ✅
```

**Ergo:**
```
PRIMARY: Minerstat API (special Autolykos calculation) ✅
SECONDARY: explorer.ergoplatform.com/api (official explorer) ⚠️ (difficulty only)
TERTIARY: Calculate from difficulty (backup method) ✅
```

### What to Do if You Can't Find 3 Sources

**Minimum requirement: 1 reliable source + 1 calculation method**

If you can only find 1 API:
1. Use that as PRIMARY
2. Implement hashrate calculation from difficulty as SECONDARY
3. Use Minerstat as TERTIARY (if they support the coin)

**Example:**
```typescript
// PRIMARY: Official API
const response = await axios.get('https://explorer.coin.com/api/hashrate');
const hashrate = response.data.hashrate;

// SECONDARY: Calculate from difficulty
const calculatedHashrate = (difficulty * Math.pow(2, 32)) / blockTime / conversionFactor;

// TERTIARY: Minerstat fallback
const minerstatData = await fetchMinerstatCoins().get('COIN');
```

### Why This Rule Exists

1. **Reliability:** If one API goes down, we have backups
2. **Accuracy:** Cross-verification prevents incorrect data
3. **Maintainability:** Future developers know where data comes from
4. **Debugging:** Easy to test each source independently
5. **Transparency:** Users can verify our data against public sources

---

## Project Structure

### Directory Layout

```
bloxchaser/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main dashboard (/)
│   ├── layout.tsx                # Root layout with metadata
│   ├── about/page.tsx            # About page (/about)
│   ├── coin/[symbol]/page.tsx    # Dynamic coin detail pages (/coin/btc, /coin/ltc, etc.)
│   ├── api/
│   │   ├── hashrate/route.ts     # Real-time network stats API
│   │   └── history/              # Historical data API
│   │       ├── route.ts          # GET /api/history (list all coins)
│   │       └── [symbol]/
│   │           └── route.ts      # GET /api/history/[symbol] (coin history)
│   └── legal/
│       ├── privacy/page.tsx      # Privacy policy
│       └── terms/page.tsx        # Terms of use
├── components/                   # React components
│   ├── NetworkCard.tsx           # Card for each network (dashboard)
│   ├── NetworkView.tsx           # Grid/list view toggle
│   ├── HashrateChart.tsx         # Chart.js hashrate visualization
│   ├── CoinTabs.tsx              # Tabs on detail pages
│   ├── Sparkline.tsx             # Mini charts for trends
│   ├── BackButton.tsx            # Navigation component
│   └── WhatsNewModal.tsx         # Feature announcement modal
├── data/
│   └── history/                  # Historical data storage (per-coin JSON files)
│       ├── btc-history.json      # Bitcoin 90-day history
│       ├── ltc-history.json      # Litecoin 90-day history
│       ├── xmr-history.json      # Monero 90-day history
│       ├── kas-history.json      # Kaspa 90-day history
│       ├── etc-history.json      # Ethereum Classic 90-day history
│       ├── rvn-history.json      # Ravencoin 90-day history
│       ├── zec-history.json      # Zcash 90-day history
│       ├── bch-history.json      # Bitcoin Cash 90-day history
│       ├── erg-history.json      # Ergo 90-day history
│       └── cfx-history.json      # Conflux 90-day history
├── scripts/
│   ├── fetch-difficulty.mjs      # Collects current data (run every 4 hours)
│   └── backfill-history.mjs      # One-time 90-day historical backfill
├── lib/                          # Data fetching logic
│   ├── fetchBitcoinData.ts       # BTC hashrate fetcher
│   ├── fetchLitecoinData.ts      # LTC hashrate fetcher
│   ├── fetchMoneroData.ts        # XMR hashrate fetcher
│   ├── fetchDogecoinData.ts      # DOGE hashrate fetcher
│   ├── fetchKaspaData.ts         # KAS hashrate fetcher
│   ├── fetchEthereumClassicData.ts  # ETC hashrate fetcher
│   ├── fetchRavencoinData.ts     # RVN hashrate fetcher
│   ├── fetchZcashData.ts         # ZEC hashrate fetcher
│   ├── fetchBitcoinCashData.ts   # BCH hashrate fetcher
│   ├── fetchErgoData.ts          # ERG hashrate fetcher
│   ├── fetchMinerstatData.ts     # Minerstat API (XMR, ERG, CFX + fallback)
│   ├── fetchPrices.ts            # Price data (CoinGecko → CoinPaprika → CryptoCompare → Minerstat)
│   └── historicalData.ts         # Historical data reader helper library
├── types/
│   └── index.ts                  # TypeScript interfaces (NetworkStats, HashrateData)
├── public/
│   └── logo.svg                  # Official bloxchaser logo (orange wordmark)
├── .github/
│   └── workflows/
│       └── update-difficulty.yml # GitHub Actions (every 4 hours)
├── CLAUDE_UPDATE.md              # Session changelog & guidelines
├── ARCHITECTURE.md               # This file - architecture documentation
└── README.md                     # GitHub repository documentation
```

---

## Data Structure & Types

### Core TypeScript Interfaces

Location: `/types/index.ts`

#### 1. `HashrateData` - Historical Data Point

```typescript
export interface HashrateData {
  timestamp: number;      // Unix timestamp in milliseconds
  hashrate: number;       // Hashrate value in the coin's unit (EH/s, TH/s, etc.)
  difficulty: number;     // Network difficulty
}
```

**Purpose:** Represents a single data point in the historical hashrate chart (90-day history).

#### 2. `NetworkStats` - Complete Coin Data

```typescript
export interface NetworkStats {
  // Network Identity
  coin: string;                    // Full name: "Bitcoin", "Litecoin", etc.
  symbol: string;                  // Ticker: "BTC", "LTC", etc.

  // Hashrate & Difficulty
  currentHashrate: number;         // Current network hashrate (in coin's unit)
  currentDifficulty: number;       // Current network difficulty

  // Trend Data (percentage changes)
  change7d: number;                // 7-day hashrate change (%)
  change30d: number;               // 30-day hashrate change (%)
  change90d: number;               // 90-day hashrate change (%)

  // Metadata
  lastUpdated: number;             // Unix timestamp (ms)
  historicalData: HashrateData[];  // 90-day historical data points

  // Price Data (from CoinGecko/CoinPaprika/Minerstat)
  currentPrice: number;            // Current USD price
  priceChange24h: number;          // 24h price change (%)
  marketCap: number;               // Market capitalization (USD)

  // Optional Financial Data
  totalSupply?: number;            // Total coin supply
  circulatingSupply?: number;      // Circulating supply
  volume24h?: number;              // 24h trading volume
  marketCapRank?: number;          // CoinGecko market cap rank
}
```

**Purpose:** Complete dataset for a single cryptocurrency network. This is the single source of truth for all network data.

---

## Data Flow Architecture

### 1. Data Fetching Layer (`lib/fetch*.ts`)

Each coin has its own fetcher module that:
- Fetches hashrate data from a specific API
- Calculates historical trends (7d, 30d, 90d)
- Returns a `NetworkStats` object (with price fields set to 0)

**Example Pattern:**

```typescript
// lib/fetchBitcoinData.ts
export async function fetchBitcoinHashrate(): Promise<NetworkStats> {
  // 1. Fetch data from API
  const response = await axios.get('https://api.example.com/hashrate');

  // 2. Convert to proper unit (H/s → EH/s, TH/s, etc.)
  const currentHashrate = response.data.hashrate / 1e18; // Example: H/s to EH/s

  // 3. Build historical data array
  const historicalData: HashrateData[] = [...];

  // 4. Calculate trend changes
  const change7d = ((current - sevenDaysAgo) / sevenDaysAgo) * 100;

  // 5. Return NetworkStats object
  return {
    coin: 'Bitcoin',
    symbol: 'BTC',
    currentHashrate,
    currentDifficulty,
    change7d,
    change30d,
    change90d,
    lastUpdated: Date.now(),
    historicalData,
    currentPrice: 0,        // Filled later by price merger
    priceChange24h: 0,      // Filled later by price merger
    marketCap: 0,           // Filled later by price merger
  };
}
```

### 2. Price Fetching Layer (`lib/fetchPrices.ts`)

Centralized price fetching with 4-tier fallback system:

```
CoinGecko (Primary)
    ↓ (if fails)
CoinPaprika (Secondary)
    ↓ (if fails)
CryptoCompare (Tertiary - fetches all 12 coins in one call)
    ↓ (if fails)
Minerstat (Quaternary - via fetchMinerstatData.ts)
```

**Returns:**

```typescript
interface CryptoPrices {
  bitcoin: { price: number; change24h: number; marketCap: number };
  litecoin: { price: number; change24h: number; marketCap: number };
  monero: { price: number; change24h: number; marketCap: number };
  dogecoin: { price: number; change24h: number; marketCap: number };
  kaspa: { price: number; change24h: number; marketCap: number };
  ethereumClassic: { price: number; change24h: number; marketCap: number };
  ravencoin: { price: number; change24h: number; marketCap: number };
  zcash: { price: number; change24h: number; marketCap: number };
  bitcoinCash: { price: number; change24h: number; marketCap: number };
  ergo: { price: number; change24h: number; marketCap: number };
  conflux: { price: number; change24h: number; marketCap: number };
  verus: { price: number; change24h: number; marketCap: number };
}
```

### 3. Data Merger Layer (`app/page.tsx`)

The `getNetworkData()` function merges hashrate + price data:

```typescript
async function getNetworkData(): Promise<NetworkStats[]> {
  // 1. Fetch all data in parallel
  const [
    bitcoinData,
    litecoinData,
    // ... other coins
    minerstatCoins,
    prices
  ] = await Promise.all([
    fetchBitcoinHashrate(),
    fetchLitecoinHashrate(),
    // ... other fetchers
    fetchMinerstatCoins(),
    fetchCryptoPrices(),
  ]);

  // 2. Merge hashrate data with price data
  const bitcoinWithPrice = {
    ...bitcoinData,
    currentPrice: prices.bitcoin.price || 0,
    priceChange24h: prices.bitcoin.change24h || 0,
    marketCap: prices.bitcoin.marketCap || 0,
  };

  // 3. Sort by market cap (descending)
  const coins = [bitcoinWithPrice, litecoinWithPrice, ...].filter(Boolean);
  return coins.sort((a, b) => b.marketCap - a.marketCap);
}
```

### 4. Rendering Layer

**Dashboard (`app/page.tsx`):**
- Receives sorted `NetworkStats[]` array
- Passes to `<NetworkView>` component
- Each coin renders as `<NetworkCard>`

**Detail Pages (`app/coin/[symbol]/page.tsx`):**
- Static generation for all 12 coins via `generateStaticParams()`
- Fetches coin-specific data via `getCoinData(symbol)`
- Renders `<HashrateChart>` and `<CoinTabs>`

---

## Rules for Adding New Networks

### CRITICAL REQUIREMENTS

When adding a new PoW cryptocurrency network, you MUST follow these rules to maintain data integrity:

---

### 1. Data Type Compliance

**RULE:** All data fetchers MUST return the exact `NetworkStats` interface.

```typescript
// ✅ CORRECT
export async function fetchNewCoinHashrate(): Promise<NetworkStats> {
  return {
    coin: 'NewCoin',           // Full name
    symbol: 'NEW',             // Uppercase ticker
    currentHashrate: 123.45,   // Numeric value
    currentDifficulty: 67890,  // Numeric value
    change7d: 2.5,             // Percentage (positive or negative)
    change30d: 5.1,
    change90d: -1.2,
    lastUpdated: Date.now(),   // Unix timestamp in milliseconds
    historicalData: [...],     // Array of HashrateData objects
    currentPrice: 0,           // Set to 0 (filled by price merger)
    priceChange24h: 0,         // Set to 0 (filled by price merger)
    marketCap: 0,              // Set to 0 (filled by price merger)
  };
}

// ❌ WRONG - Missing required fields
return {
  coin: 'NewCoin',
  symbol: 'NEW',
  currentHashrate: 123.45,
  // Missing other fields!
};
```

---

### 2. Hashrate Unit Conversion

**RULE:** Always convert raw hashrate values to the appropriate unit for display.

**Unit Conversion Table:**

| Unit | Name | Conversion from H/s | Example Coins |
|------|------|---------------------|---------------|
| H/s | Hashes | `/ 1` | None (base unit) |
| KH/s | Kilohashes | `/ 1e3` | None currently |
| MH/s | Megahashes | `/ 1e6` | None currently |
| GH/s | Gigahashes | `/ 1e9` | Monero (XMR) |
| TH/s | Terahashes | `/ 1e12` | Litecoin, Dogecoin, ETC, Ravencoin, Ergo, Verus |
| PH/s | Petahashes | `/ 1e15` | Kaspa |
| EH/s | Exahashes | `/ 1e18` | Bitcoin, Bitcoin Cash |
| MSol/s | Mega-solutions | Special (Equihash) | Zcash |

**Examples:**

```typescript
// Bitcoin: Mempool API returns H/s, convert to EH/s
const currentHashrate = apiResponse.hashrate / 1e18;

// Dogecoin: GetBlock returns H/s, convert to PH/s
const currentHashrate = apiResponse.networkhashps / 1e15;

// Kaspa: API returns GH/s, convert to PH/s
const currentHashrate = apiResponse.hashrate / 1000;

// Monero: Minerstat returns H/s, convert to GH/s
const currentHashrate = apiResponse.network_hashrate / 1e9;
```

**VERIFICATION:** Always test against real-world data sources (Minerstat, CoinWarz, mining pools) to ensure your conversion is correct.

---

### 3. Historical Data Requirements

**RULE:** The `historicalData` array MUST contain at least 90 data points for chart rendering.

```typescript
// ✅ CORRECT - Real API data
const historicalData: HashrateData[] = [];
for (let i = 0; i < 90; i++) {
  const blockData = await fetchHistoricalBlock(i);
  historicalData.push({
    timestamp: blockData.timestamp * 1000,
    hashrate: calculateHashrate(blockData),
    difficulty: blockData.difficulty,
  });
}

// ✅ ACCEPTABLE - Simulated data (if API doesn't provide historical)
const historicalData: HashrateData[] = [];
for (let i = 90; i >= 0; i--) {
  historicalData.push({
    timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
    hashrate: currentHashrate * (0.92 + ((90 - i) / 90) * 0.12), // Simulate growth
    difficulty: currentDifficulty,
  });
}

// ❌ WRONG - Not enough data points
const historicalData = [{ timestamp: Date.now(), hashrate: 123, difficulty: 456 }];
```

---

### 4. Trend Calculation

**RULE:** Calculate percentage changes from historical data, not hardcoded estimates.

```typescript
// ✅ CORRECT - Calculate from actual historical data
const current = historicalData[historicalData.length - 1];
const sevenDaysAgo = historicalData[historicalData.length - 7];
const change7d = ((current.hashrate - sevenDaysAgo.hashrate) / sevenDaysAgo.hashrate) * 100;

// ❌ WRONG - Hardcoded fake trend
const change7d = 2.5; // Don't do this!
```

---

### 5. Error Handling

**RULE:** All fetchers MUST throw errors on failure, not return null/undefined.

```typescript
// ✅ CORRECT
export async function fetchNewCoinHashrate(): Promise<NetworkStats> {
  try {
    const response = await axios.get('https://api.example.com/data');
    // ... process data
    return networkStats;
  } catch (error) {
    console.error('Error fetching NewCoin data:', error);
    throw new Error('Failed to fetch NewCoin hashrate data');
  }
}

// ❌ WRONG - Silent failure
export async function fetchNewCoinHashrate(): Promise<NetworkStats | null> {
  try {
    // ... fetch data
  } catch (error) {
    return null; // Don't do this!
  }
}
```

---

## Network Configuration Checklist

Use this checklist when adding a new network (e.g., "GRIN"):

### Step 0: Research API Endpoints (MANDATORY - DO THIS FIRST!)

**⚠️ BEFORE writing ANY code, complete this research:**

- [ ] Search for "[COIN] blockchain explorer API"
- [ ] Search for "[COIN] network hashrate API"
- [ ] Search for "[COIN] mining pool API"
- [ ] Test PRIMARY endpoint with curl/WebFetch (verify it returns data)
- [ ] Test SECONDARY endpoint with curl/WebFetch
- [ ] Test TERTIARY endpoint with curl/WebFetch
- [ ] Cross-verify hashrate values match between sources (within 10% tolerance)
- [ ] Document all 3 endpoints in fetcher file comments
- [ ] Identify PoW algorithm and block time
- [ ] Find current block reward and halving schedule
- [ ] Verify hashrate unit (GH/s, TH/s, PH/s, EH/s)
- [ ] Calculate expected unit conversion divisor

**Example Research Output:**
```
GRIN Network Research (2025-01-18):
- PRIMARY: https://grinexplorer.net/api/v1/stats (hashrate: 5.2 KGps)
- SECONDARY: https://grinscan.net/api/network (difficulty: 125000)
- TERTIARY: Minerstat (network_hashrate: 5.2e12 H/s)
- Algorithm: Cuckatoo31+
- Block time: 60 seconds
- Unit: KGps (Kilo-graphs per second) or TH/s equivalent
- Conversion: Raw hashrate ÷ 1e12 = TH/s
```

### Step 1: Create Data Fetcher

- [ ] Create `/lib/fetchGrinData.ts`
- [ ] Add API endpoint documentation comment block at top of file (see RULE 0 format)
- [ ] Export `async function fetchGrinHashrate(): Promise<NetworkStats>`
- [ ] Implement PRIMARY API call to fetch hashrate
- [ ] Implement SECONDARY API fallback (if primary fails)
- [ ] Implement TERTIARY API fallback (if secondary fails)
- [ ] Convert hashrate to correct unit using verified divisor from Step 0
- [ ] Build 90-day `historicalData` array
- [ ] Calculate `change7d`, `change30d`, `change90d` from historical data
- [ ] Set `currentPrice`, `priceChange24h`, `marketCap` to 0
- [ ] Add comprehensive error handling with `try/catch`
- [ ] Test against real API to verify hashrate accuracy (must match Step 0 research)

### Step 2: Add Price Support

**File:** `/lib/fetchPrices.ts`

- [ ] Add CoinGecko ID to API call (line 63)
- [ ] Add CoinPaprika ID to `COINPAPRIKA_IDS` mapping (line 44)
- [ ] Add to `CryptoPrices` interface (line 30)
- [ ] Add to `fetchFromCoinGecko()` return object (line 72)
- [ ] Add to `fetchFromCoinPaprika()` parallel fetch (line 133)
- [ ] Add to `fetchFromCoinPaprika()` return object (line 146)
- [ ] Add to final fallback object (line 223)

### Step 3: Integrate in Dashboard

**File:** `/app/page.tsx`

- [ ] Import fetcher at top: `import { fetchGrinHashrate } from '@/lib/fetchGrinData';`
- [ ] Add to parallel fetch in `getNetworkData()` (line 22)
- [ ] Create merge object: `const grinWithPrice = { ...grinData, currentPrice: prices.grin.price, ... }`
- [ ] Add to `coins` array (line 110)
- [ ] Verify sorting by market cap still works (line 124)

### Step 4: Add to Detail Page

**File:** `/app/coin/[symbol]/page.tsx`

- [ ] Import fetcher at top (line 6)
- [ ] Add to `generateStaticParams()`: `{ symbol: 'grin' }` (line 35)
- [ ] Add to parallel fetch in `getCoinData()` (line 41)
- [ ] Add `else if` block for symbol matching (around line 130)
- [ ] Add to `getHashrateUnit()` switch statement (line 147)
- [ ] Add to `getCoinLogo()` colors mapping (line 189)

### Step 5: Update NetworkCard Component

**File:** `/components/NetworkCard.tsx`

- [ ] Add to `getHashrateUnit()` switch (line 18)
- [ ] Add to `getBlockReward()` switch (line 34)
- [ ] Add to `getBlocksPerDay()` switch (line 50)
- [ ] Add SVG logo path to `getCoinLogo()` logos (line 96)
- [ ] Add brand color to `getCoinLogo()` colors (line 129)

### Step 6: Documentation Updates

- [ ] Update `CLAUDE_UPDATE.md` with new network details
- [ ] Update `README.md` supported networks table
- [ ] Update this `ARCHITECTURE.md` if any patterns changed

### Step 7: Testing & Verification

- [ ] Build project: `npm run build`
- [ ] Check for TypeScript errors
- [ ] Verify hashrate matches real-world sources (Minerstat, pools)
- [ ] Test dashboard card renders correctly
- [ ] Test detail page loads at `/coin/grin`
- [ ] Verify profit calculator works
- [ ] Check sparklines render
- [ ] Test X share button generates correct tweet
- [ ] Verify market cap sorting still works

### Step 8: Deployment

- [ ] Commit changes: `git add . && git commit -m "Add GRIN network support"`
- [ ] Push to GitHub: `git push`
- [ ] Verify Vercel auto-deployment succeeds
- [ ] Test live site at `https://bloxchaser.com`

---

## File Modification Checklist

Quick reference for which files to modify when adding a new network:

| File | Required Changes | Lines to Modify |
|------|------------------|-----------------|
| `/lib/fetchNewCoinData.ts` | **CREATE NEW FILE** | Entire file |
| `/lib/fetchPrices.ts` | Add price support | 30, 44, 63, 72, 133, 146, 223 |
| `/app/page.tsx` | Import + merge + sort | 6-16, 22-34, 40-120, 124 |
| `/app/coin/[symbol]/page.tsx` | Import + static gen + mapping | 6-16, 24-35, 41-52, 58-128, 147-159, 189-200 |
| `/components/NetworkCard.tsx` | Units + rewards + logo | 18-30, 34-46, 50-62, 96-127, 129-140 |
| `/types/index.ts` | **NO CHANGES NEEDED** | N/A (interface is generic) |
| `CLAUDE_UPDATE.md` | Document changes | Add new network entry |
| `README.md` | Update table | Supported networks section |

---

## Coin-Specific Constants Reference

### Hashrate Units by Coin

```typescript
const HASHRATE_UNITS = {
  BTC: 'EH/s',     // Exahashes (10^18)
  BCH: 'EH/s',     // Exahashes (10^18)
  LTC: 'TH/s',     // Terahashes (10^12)
  DOGE: 'PH/s',    // Petahashes (10^15)
  XMR: 'GH/s',     // Gigahashes (10^9)
  KAS: 'PH/s',     // Petahashes (10^15)
  ETC: 'TH/s',     // Terahashes (10^12)
  RVN: 'TH/s',     // Terahashes (10^12)
  ZEC: 'MSol/s',   // Mega-solutions (Equihash)
  ERG: 'TH/s',     // Terahashes (10^12)
  CFX: 'TH/s',     // Terahashes (10^12) - Octopus algorithm
  VRSC: 'TH/s',    // Terahashes (10^12)
};
```

### Block Rewards (Current)

```typescript
const BLOCK_REWARDS = {
  BTC: 3.125,      // Post-2024 halving
  BCH: 3.125,      // Post-2024 halving
  LTC: 6.25,       // Post-2023 halving
  DOGE: 10000,     // Fixed reward
  XMR: 0.6,        // Tail emission
  KAS: 250,        // Current reward
  ETC: 2.56,       // Post-Thanos fork
  RVN: 2500,       // Post-halving
  ZEC: 3.125,      // Post-halving
  ERG: 9,          // 9 ERG per block
  CFX: 2,          // Current Conflux reward
  VRSC: 3,         // 3 VRSC per block
};
```

### Block Times & Daily Blocks

```typescript
const BLOCK_CONFIG = {
  BTC:  { time: 600,  perDay: 144 },    // 10 minutes
  BCH:  { time: 600,  perDay: 144 },    // 10 minutes
  LTC:  { time: 150,  perDay: 576 },    // 2.5 minutes
  DOGE: { time: 60,   perDay: 1440 },   // 1 minute
  XMR:  { time: 120,  perDay: 720 },    // 2 minutes
  KAS:  { time: 1,    perDay: 86400 },  // 1 second
  ETC:  { time: 13,   perDay: 6500 },   // 13 seconds
  RVN:  { time: 60,   perDay: 1440 },   // 1 minute
  ZEC:  { time: 75,   perDay: 1152 },   // 75 seconds
  ERG:  { time: 120,  perDay: 720 },    // 2 minutes
  CFX:  { time: 0.5,  perDay: 172800 }, // 0.5 seconds
  VRSC: { time: 60,   perDay: 1440 },   // 1 minute
};
```

### Brand Colors (for Logos)

```typescript
const BRAND_COLORS = {
  BTC: '#F7931A',  // Bitcoin Orange
  BCH: '#8DC351',  // Bitcoin Cash Green
  LTC: '#345D9D',  // Litecoin Blue
  DOGE: '#C2A633', // Dogecoin Gold
  XMR: '#FF6600',  // Monero Orange
  KAS: '#49E9C9',  // Kaspa Cyan
  ETC: '#328332',  // Ethereum Classic Green
  RVN: '#384182',  // Ravencoin Purple
  ZEC: '#F4B728',  // Zcash Yellow
  ERG: '#000000',  // Ergo Black
  CFX: '#1A1A2E',  // Conflux Dark Blue
  VRSC: '#3165D4', // Verus Blue
};
```

---

## Data Source Reliability

### Primary Sources (By Coin)

| Coin | Primary API | Hashrate Accuracy | Notes |
|------|-------------|-------------------|-------|
| BTC | mempool.space | ✅ Excellent | Real-time mempool data |
| BCH | mempool.space | ✅ Excellent | Calculated from difficulty |
| LTC | litecoinspace.org | ✅ Excellent | Direct blockchain data |
| DOGE | GetBlock RPC | ✅ Good | Direct node RPC call |
| XMR | minerstat.com | ✅ Good | Aggregated mining data |
| KAS | api.kaspa.org | ✅ Excellent | Official Kaspa API |
| ETC | blockscout.com | ✅ Excellent | Full block explorer |
| RVN | blockbook.ravencoin.org | ✅ Good | Official explorer |
| ZEC | zcashblockexplorer.com | ✅ Good | Community explorer |
| ERG | minerstat.com | ✅ Good | Special Autolykos calculation |
| CFX | minerstat.com | ✅ Good | Octopus algorithm data |
| VRSC | Verus Explorer API + LuckPool API | ✅ Good | Difficulty + hashrate data |

### Price API Fallback Chain

1. **CoinGecko** (Primary) - Fast updates, rate limited during builds
2. **CoinPaprika** (Secondary) - No API key required, reliable
3. **CryptoCompare** (Tertiary) - Fetches all 12 coins in one call, requires API key
4. **Minerstat** (Quaternary) - Includes hashrate data, final fallback

---

## Next.js ISR Configuration

**Revalidation:** 3600 seconds (1 hour)

```typescript
// app/page.tsx & app/coin/[symbol]/page.tsx
export const revalidate = 3600;
```

**Static Generation:** All coin detail pages are pre-rendered at build time via `generateStaticParams()`.

**Build-time fetching:** Dashboard fetches all 12 networks in parallel with individual error handling.

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Wrong Unit Conversion

**Problem:** Hashrate shows in millions instead of single digits.

**Solution:** Double-check the unit conversion divisor. Test against real-world sources.

```typescript
// Example: Dogecoin should show ~3.5 PH/s, not 3500 TH/s
// WRONG: / 1e12 (gives TH/s)
// RIGHT: / 1e15 (gives PH/s)
```

---

### ❌ Pitfall 2: Missing Historical Data

**Problem:** Charts don't render or show flat lines.

**Solution:** Ensure `historicalData` has at least 90 entries with realistic variance.

---

### ❌ Pitfall 3: Forgetting Price Integration

**Problem:** Network shows $0 price and market cap.

**Solution:** Add coin to ALL three sections in `fetchPrices.ts`:
1. `CryptoPrices` interface
2. `fetchFromCoinGecko()`
3. `fetchFromCoinPaprika()`

---

### ❌ Pitfall 4: Incorrect Block Reward

**Problem:** Profit calculator shows unrealistic earnings.

**Solution:** Verify current block reward accounting for halvings. Check official block explorers.

---

### ❌ Pitfall 5: Not Testing Build

**Problem:** TypeScript errors or build failures in production.

**Solution:** Always run `npm run build` locally before pushing.

---

## Maintaining Data Integrity

### Required Standards

1. **Type Safety:** Never use `any` types. Always use `NetworkStats` and `HashrateData`.
2. **Error Handling:** All API calls must have try/catch blocks.
3. **Fallbacks:** Price fetching has 3-tier fallback, individual coin fetchers throw on error.
4. **Unit Consistency:** Document the unit for every hashrate value in comments.
5. **Historical Accuracy:** Use real historical data when available, simulated data as last resort.
6. **Verification:** Always cross-check hashrate values against 2+ independent sources.

### Code Review Checklist

Before merging any network addition:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Hashrate matches real-world sources (verified against Minerstat/pools)
- [ ] Historical data array has 90+ entries
- [ ] Trends calculate from actual data, not hardcoded
- [ ] Price integration tested with all 3 APIs
- [ ] Logo SVG added and renders correctly
- [ ] Brand color matches official branding
- [ ] Block reward and timing verified against blockchain
- [ ] Profit calculator tested with sample inputs
- [ ] Detail page generates correctly at `/coin/[symbol]`
- [ ] Dashboard sorting by market cap still works
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

---

## Contact & Contributions

- **GitHub:** https://github.com/bokiko/bloxchaser
- **Live Site:** https://bloxchaser.com
- **Issues:** Use GitHub Issues for bug reports or feature requests

---

**Last Updated:** 2025-11-24
**Maintained By:** bloxchaser development team
**Version:** 1.0.0
