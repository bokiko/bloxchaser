# bloxchaser Architecture & Data Structure Guide

**Project Name:** bloxchaser (all lowercase - never "BloxChaser")
**Official Logo:** `/public/logo.svg`
**Last Updated:** 2025-01-18

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Data Structure & Types](#data-structure--types)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Rules for Adding New Networks](#rules-for-adding-new-networks)
5. [Network Configuration Checklist](#network-configuration-checklist)
6. [File Modification Checklist](#file-modification-checklist)

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
│   ├── fetchMinerstatData.ts     # Minerstat API (XMR + fallback)
│   └── fetchPrices.ts            # Price data (CoinGecko → CoinPaprika → Minerstat)
├── types/
│   └── index.ts                  # TypeScript interfaces (NetworkStats, HashrateData)
├── public/
│   └── logo.svg                  # Official bloxchaser logo (orange wordmark)
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

Centralized price fetching with 3-tier fallback system:

```
CoinGecko (Primary)
    ↓ (if fails)
CoinPaprika (Secondary)
    ↓ (if fails)
Minerstat (Tertiary - via fetchMinerstatData.ts)
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
- Static generation for all 10 coins via `generateStaticParams()`
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
| TH/s | Terahashes | `/ 1e12` | Litecoin, Dogecoin, ETC, Ravencoin, Ergo |
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

### Step 1: Create Data Fetcher

- [ ] Create `/lib/fetchGrinData.ts`
- [ ] Export `async function fetchGrinHashrate(): Promise<NetworkStats>`
- [ ] Implement API call to fetch hashrate
- [ ] Convert hashrate to correct unit (consult algorithm documentation)
- [ ] Build 90-day `historicalData` array
- [ ] Calculate `change7d`, `change30d`, `change90d` from historical data
- [ ] Set `currentPrice`, `priceChange24h`, `marketCap` to 0
- [ ] Add comprehensive error handling with `try/catch`
- [ ] Test against real API to verify hashrate accuracy

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
  ERG: '#FF5722',  // Ergo Orange-Red
};
```

---

## Data Source Reliability

### Primary Sources (By Coin)

| Coin | Primary API | Hashrate Accuracy | Notes |
|------|-------------|-------------------|-------|
| BTC | mempool.space | ✅ Excellent | Real-time mempool data |
| BCH | blockchair.com | ✅ Excellent | Calculated from difficulty |
| LTC | chainz.cryptoid.info | ✅ Excellent | Direct blockchain data |
| DOGE | GetBlock RPC | ✅ Good | Direct node RPC call |
| XMR | minerstat.com | ✅ Good | Aggregated mining data |
| KAS | api.kaspa.org | ✅ Excellent | Official Kaspa API |
| ETC | blockscout.com | ✅ Excellent | Full block explorer |
| RVN | ravencoin.network | ✅ Good | Official explorer |
| ZEC | zcashblockexplorer.com | ✅ Good | Community explorer |
| ERG | minerstat.com | ✅ Good | Special Autolykos calculation |

### Price API Fallback Chain

1. **CoinGecko** (Primary) - Fast updates, rate limited during builds
2. **CoinPaprika** (Secondary) - No API key required, reliable
3. **Minerstat** (Tertiary) - Includes hashrate data, final fallback

---

## Next.js ISR Configuration

**Revalidation:** 3600 seconds (1 hour)

```typescript
// app/page.tsx & app/coin/[symbol]/page.tsx
export const revalidate = 3600;
```

**Static Generation:** All coin detail pages are pre-rendered at build time via `generateStaticParams()`.

**Build-time fetching:** Dashboard fetches all 10 networks in parallel with individual error handling.

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

**Last Updated:** 2025-01-18
**Maintained By:** bloxchaser development team
**Version:** 1.0.0
