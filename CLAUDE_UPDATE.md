# bloxchaser - Recent Updates Summary

## IMPORTANT: Project Guidelines

### Naming Convention
**The project is called "bloxchaser" - ALL LOWERCASE. Never use "BloxChaser" with capital letters.**

### Official Logo
**Always use `/public/logo.svg` as the official bloxchaser logo.** This is the orange wordmark that represents the brand across all pages and materials.

### Architecture Documentation
**ALWAYS consult `/ARCHITECTURE.md` before adding new networks.** This is a MANDATORY guide that must be followed in every development session. It includes:
- Complete data structure documentation
- RULE 0: API endpoint research (find 3 sources before coding)
- 8-step checklist for adding networks
- Unit conversion reference table
- Common pitfalls and solutions

## Session Overview
This document summarizes all changes made to bloxchaser during recent development sessions.

---

## Latest Session: Verus (VRSC) Network Integration (2025-11-28)

### 1. **Verus (VRSC) Network Integration**
- **Added Verus** as the 12th supported PoW network
- **Algorithm**: VerusHash (CPU-friendly proof-of-work)
- **Block time**: 1 minute (1440 blocks per day)
- **Block reward**: 3 VRSC per block
- **Hashrate unit**: TH/s (Terahashes per second)

### 2. **Data Sources - Official + Fallback**
- **Primary source**: Official Verus Explorer API (`https://explorer.verus.io/api/status`) for difficulty
- **Secondary source**: LuckPool API (`https://luckpool.net/verus/network`) for network hashrate
- **Price source**: CoinGecko/CoinPaprika/CryptoCompare 4-tier fallback system
- **Design principle**: Direct network data over 3rd-party aggregators (as requested)

### 3. **Implementation Files Created/Modified**
- **Created**: `/lib/fetchVerusData.ts` - Fetches real-time difficulty from Verus Explorer and hashrate from LuckPool
- **Modified**: `/lib/fetchPrices.ts` - Added VRSC to all price fetching functions (CoinGecko, CoinPaprika, CryptoCompare)
- **Modified**: `/app/page.tsx` - Added Verus to main dashboard with price integration
- **Modified**: `/app/coin/[symbol]/page.tsx` - Added VRSC to coin detail pages
- **Modified**: `/README.md` - Updated from 11 to 12 networks, added Verus to supported coins table
- **Modified**: `/ARCHITECTURE.md` - Added VRSC constants (hashrate units, block rewards, block config, brand colors)

### 4. **Technical Details**
- **CoinGecko ID**: `verus-coin`
- **CoinPaprika ID**: `vrsc-verus-coin`
- **CryptoCompare Symbol**: `VRSC`
- **Brand Color**: `#3165D4` (Verus Blue)
- **Build Status**: ✅ Successful (12 coin pages generated)

### 5. **Team Update**
- **README updated**: Added team members @bokiko_io and @cloudbasedme
- **Twitter handle**: Fixed from @blxchaser to @bloxchaser

---

## Previous Session: Historical Data System & Conflux Integration (2025-11-24)

### 1. **Conflux (CFX) Network Integration**
- **Added Conflux** as the 11th supported PoW network
- **API Source**: Minerstat API for hashrate/difficulty
- **Algorithm**: Octopus
- **Block time**: 0.5 seconds
- **Price Integration**: CryptoCompare API (primary), with CoinGecko/CoinPaprika fallback

### 2. **CryptoCompare Integration for ALL Coins**
- **Added CryptoCompare API** as comprehensive third-tier price fallback
- **New fallback chain**: CoinGecko -> CoinPaprika -> CryptoCompare -> Zeros
- **Single API call** fetches prices for all 11 coins simultaneously
- **Environment variable**: `CRYPTOCOMPARE_API_KEY` required
- **File modified**: `/lib/fetchPrices.ts` (lines 269-373)

### 3. **Historical Data Collection System**
- **Purpose**: Store hashrate/difficulty history for all coins independently
- **Storage**: Separate JSON files per coin in `/data/history/`
- **Files created**:
  - `btc-history.json`, `ltc-history.json`, `xmr-history.json`
  - `kas-history.json`, `etc-history.json`, `rvn-history.json`
  - `zec-history.json`, `bch-history.json`, `erg-history.json`
  - `cfx-history.json` (10 coins total, DOGE excluded - no Minerstat history)

### 4. **90-Day Historical Backfill**
- **Script**: `/scripts/backfill-history.mjs`
- **Data source**: Minerstat Historical API (`/v2/coins-history?period=90d`)
- **Total entries**: 131,410 data points (13,141 per coin for 10 coins)
- **Data format**: `{ t: timestamp, d: difficulty, h: hashrate, p: price }`
- **Run once** to bootstrap historical data

### 5. **Automated Data Collection (GitHub Actions)**
- **Workflow**: `/.github/workflows/update-difficulty.yml`
- **Schedule**: Every 4 hours (cron: `0 */4 * * *`)
- **Script**: `/scripts/fetch-difficulty.mjs`
- **Auto-commit**: Pushes updated history files to repository
- **Note**: User must manually push workflow file (OAuth scope limitation)

### 6. **Public History API Endpoints**
- **GET /api/history** - Lists all coins with data summary
  - Returns: coin list, entry counts, last updated timestamps
- **GET /api/history/[symbol]** - Full history for specific coin
  - Parameters: `?days=30` (limit data), `?format=compact` (for charting)
  - Returns: Full historical data with timestamps, hashrate, difficulty, price
- **Caching**: 5-minute s-maxage with stale-while-revalidate
- **CORS**: Enabled for public API access

### 7. **Historical Data Helper Library**
- **File**: `/lib/historicalData.ts`
- **Functions**:
  - `getCoinHistory(symbol)` - Get full history for a coin
  - `getHistoricalHashrate(symbol, days)` - Get hashrate data for charting
  - `getHashrateChange(symbol, days)` - Calculate % change over period
  - `getCurrentStats(symbol)` - Get latest stats with 7d/30d/90d changes
  - `getAllCoinsSummary()` - Summary for API listing

### New Files Created
```
scripts/
├── fetch-difficulty.mjs     # Collects current data every 4 hours
└── backfill-history.mjs     # One-time 90-day historical backfill

data/
└── history/                 # Historical data storage
    ├── btc-history.json
    ├── ltc-history.json
    ├── xmr-history.json
    ├── kas-history.json
    ├── etc-history.json
    ├── rvn-history.json
    ├── zec-history.json
    ├── bch-history.json
    ├── erg-history.json
    └── cfx-history.json

lib/
└── historicalData.ts        # Helper library for reading history

app/api/history/
├── route.ts                 # GET /api/history
└── [symbol]/
    └── route.ts             # GET /api/history/[symbol]

.github/workflows/
└── update-difficulty.yml    # GitHub Actions (needs manual push)
```

### Environment Variables Required
```bash
# .env.local
CRYPTOCOMPARE_API_KEY=your_api_key_here
```

---

## Previous Session: Data Integrity & Architecture Documentation (2025-01-18)

### 1. **Fixed Dogecoin Hashrate Unit Conversion** ✅
- **Issue**: Dogecoin showing 3494 TH/s instead of 3.49 PH/s
- **Root Cause**: Wrong divisor in `lib/fetchDogecoinData.ts` line 41
  - Was: `/ 1e12` (converts to TH/s)
  - Now: `/ 1e15` (converts to PH/s)
- **Verification**: Tested GetBlock RPC, returns `networkhashps: 3493983796436320`
  - Calculation: 3493983796436320 / 1e15 = 3.49 PH/s ✅
- **Expected Range**: 2.6-3.4 PH/s (Scrypt algorithm)
- **Status**: Fixed, tested, committed, deployed

### 2. **Comprehensive Hashrate Audit** ✅
- **Audited All 10 Networks**: BTC, LTC, XMR, DOGE, KAS, ETC, RVN, ZEC, BCH, ERG
- **Results**:
  - 9 coins verified correct ✅
  - 1 coin fixed (DOGE) ✅
- **Method**: Cross-verified against Minerstat API, mining pools, and web sources
- **Tools Used**: `curl`, Minerstat API v2, WebFetch
- **Documentation**: All hashrate conversions now documented in ARCHITECTURE.md

### 3. **Created ARCHITECTURE.md (900+ lines)** ✅
- **Purpose**: Permanent, mandatory guide for all development
- **Location**: `/ARCHITECTURE.md`
- **Sections**:
  1. **MANDATORY RULES** - Never ignore this section
  2. **RULE 0: API Endpoint Research** - Find 3 sources before coding
  3. **Project Structure** - Complete directory layout
  4. **Data Structure & Types** - `NetworkStats` and `HashrateData` interfaces
  5. **Data Flow Architecture** - Fetchers → Mergers → Renderers
  6. **Rules for Adding Networks** - 5 critical rules (type compliance, unit conversion, etc.)
  7. **Network Configuration Checklist** - 8-step process (Step 0 = API research)
  8. **File Modification Checklist** - Quick reference table
  9. **Coin-Specific Constants** - Units, rewards, block times, colors
  10. **Common Pitfalls & Solutions** - Real-world debugging tips

### 4. **Implemented RULE 0: API Endpoint Research** ✅
- **Requirement**: MUST find 3 API endpoints BEFORE writing any code
  - **PRIMARY**: Official block explorer API
  - **SECONDARY**: Alternative/fallback API (different provider)
  - **TERTIARY**: Third fallback (Minerstat, pools, RPC)
- **Process**:
  1. Search for "[COIN] blockchain explorer API"
  2. Search for "[COIN] network hashrate API"
  3. Search for "[COIN] mining pool API"
  4. Test each endpoint with curl/WebFetch
  5. Cross-verify hashrate values (within 10% tolerance)
  6. Document all endpoints in fetcher file comments
- **Documentation Format**: All fetchers must include API source documentation
- **Examples Provided**: BTC, DOGE, KAS, ERG endpoint documentation

### 5. **Updated Network Configuration Checklist** ✅
- **Changed from 7 steps to 8 steps**:
  - **Step 0** (NEW): API Endpoint Research (MANDATORY)
  - Step 1: Create Data Fetcher (now includes 3-tier fallback)
  - Step 2: Add Price Support
  - Step 3: Integrate in Dashboard
  - Step 4: Add to Detail Page
  - Step 5: Update NetworkCard Component
  - Step 6: Documentation Updates
  - Step 7: Testing & Verification
  - Step 8: Deployment
- **Key Addition**: Step 1 now requires documenting all 3 API endpoints in code comments

---

## Previous Session: Major Features Shipped

### 1. **Ergo (ERG) Network Integration** ✅
- **API Source**: Ergo Platform official API (explorer.ergoplatform.com)
- **Implementation**: `lib/fetchErgoData.ts`
- **Technical Specs**:
  - Algorithm: Autolykos v2
  - Block time: 120 seconds (2 minutes)
  - Blocks per day: 720
  - Block reward: 9 ERG
  - Hashrate unit: TH/s (Terahashes)
  - Hashrate calculation: `(difficulty * 2^32) / 120 / 1e12`
- **Price Integration**: Added to both CoinGecko and CoinPaprika fetchers
- **Full Support**: Dashboard card, detail page, profit calculator, sparklines

### 2. **Coin Logos on Network Cards** ✅
- **Location**: Top right corner of each NetworkCard
- **Design Features**:
  - Brand-accurate SVG icons for all 10 coins
  - Color-matched glow effects
  - Hover animation (opacity increases)
  - Glassmorphic design (backdrop blur, semi-transparent bg)
  - Consistent sizing: 32x32px (w-8 h-8)
- **Brand Colors**:
  - BTC: `#F7931A` (Bitcoin Orange)
  - LTC: `#345D9D` (Litecoin Blue)
  - XMR: `#FF6600` (Monero Orange)
  - DOGE: `#C2A633` (Dogecoin Gold)
  - KAS: `#49E9C9` (Kaspa Cyan)
  - ETC: `#328332` (Ethereum Classic Green)
  - RVN: `#384182` (Ravencoin Purple)
  - ZEC: `#F4B728` (Zcash Yellow)
  - BCH: `#8DC351` (Bitcoin Cash Green)
  - ERG: `#FF5722` (Ergo Orange-Red)

### 3. **UI Improvements** ✅
- **Removed**: "Coming Soon" section entirely
- **Sorting**: Networks automatically sorted by market cap (descending)
- **Implementation**: Already active at `app/page.tsx:124`

---

## Files Modified

### New Files
- `lib/fetchErgoData.ts` - Ergo network data fetcher

### Updated Files
- `lib/fetchPrices.ts` - Added ERG to CoinGecko + CoinPaprika
- `app/page.tsx` - Integrated ERG, removed Coming Soon section
- `app/coin/[symbol]/page.tsx` - Added ERG detail page support
- `components/NetworkCard.tsx` - Added ERG constants + coin logos

---

## Technical Details

### Ergo Data Fetching
```typescript
// Block endpoint
https://api.ergoplatform.com/api/v1/blocks?limit=1&offset=${offset}

// Historical data points
- Current (offset 0)
- 7 days (offset 5040 blocks)
- 30 days (offset 21600 blocks)
- 90 days (offset 64800 blocks)

// Hashrate formula
const hashrate = (difficulty * Math.pow(2, 32)) / 120;
return hashrate / 1e12; // Convert to TH/s
```

### Coin Logo Implementation
```typescript
const getCoinLogo = (symbol: string) => {
  // Returns elegant logo with:
  // - SVG icon
  // - Brand color
  // - Glow effect (blur-md)
  // - Backdrop blur background
  // - Hover animation
}
```

### Market Cap Sorting
```typescript
// Already implemented in app/page.tsx
return coins.sort((a, b) => b.marketCap - a.marketCap);
```

---

## Current Network Coverage (11 Total)

| Rank | Coin | Symbol | Algorithm | Hashrate Unit | Status |
|------|------|--------|-----------|---------------|--------|
| 1 | Bitcoin | BTC | SHA-256 | EH/s | ✅ Live |
| 2 | Ethereum Classic | ETC | Etchash | TH/s | ✅ Live |
| 3 | Bitcoin Cash | BCH | SHA-256 | EH/s | ✅ Live |
| 4 | Litecoin | LTC | Scrypt | TH/s | ✅ Live |
| 5 | Monero | XMR | RandomX | GH/s | ✅ Live |
| 6 | Kaspa | KAS | kHeavyHash | PH/s | ✅ Live |
| 7 | Zcash | ZEC | Equihash | MSol/s | ✅ Live |
| 8 | Dogecoin | DOGE | Scrypt | PH/s | ✅ Live |
| 9 | Ergo | ERG | Autolykos v2 | TH/s | ✅ Live |
| 10 | Ravencoin | RVN | KawPow | TH/s | ✅ Live |
| 11 | Conflux | CFX | Octopus | TH/s | ✅ Live |

---

## Features Available Per Coin

All 11 networks support:
- ✅ Real-time hashrate tracking
- ✅ Difficulty monitoring
- ✅ Price display (USD)
- ✅ 24h price change
- ✅ Market cap
- ✅ 7d/30d/90d trend tracking
- ✅ Sparkline charts
- ✅ Profit calculator
- ✅ Detail page with full charts
- ✅ X (Twitter) share button
- ✅ Branded coin logo

---

## Build & Deployment Status

- ✅ **TypeScript**: No errors
- ✅ **Build**: Successful (production bundle generated)
- ✅ **Tests**: All passing
- ✅ **Git**: Committed and pushed to main
- ✅ **Vercel**: Auto-deployment triggered

---

## Recent Commits

### Commit 1: Add Ergo (ERG) network support
```
- Created lib/fetchErgoData.ts using Ergo Platform API
- Added ERG to price fetching (CoinGecko + CoinPaprika)
- Added ERG to main dashboard and coin detail page
- Updated NetworkCard with ERG constants
- Removed Flux from Coming Soon (not PoW)
- Updated Coming Soon to show GRIN, BEAM, FIRO
```

### Commit 2: Add coin logos and remove Coming Soon
```
- Added elegant coin logos to top right of each NetworkCard
- Logos feature color-matched glow effect and hover animation
- Removed Coming Soon section entirely
- Cards already sorted by market cap (descending)
```

---

## API Fallback Strategy

Price fetching uses a robust 4-tier fallback:
1. **Primary**: CoinGecko API (fastest updates)
2. **Secondary**: CoinPaprika API (no key required)
3. **Tertiary**: CryptoCompare API (fetches all 11 coins in one call)
4. **Quaternary**: Minerstat (final fallback with hashrate data)

Rate limiting during builds is expected and handled gracefully.

---

## Next Steps (Suggested)

Completed in this session:
- [x] Historical data collection system (90 days)
- [x] Public API endpoints for historical data
- [x] CryptoCompare integration for all coins
- [x] Conflux (CFX) network support
- [x] Automated data collection (GitHub Actions)

Potential future enhancements:
- [ ] More PoW networks coming soon
- [ ] Mining pool statistics
- [ ] Profitability rankings
- [ ] Email alerts for hashrate/difficulty changes
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Multi-currency support (EUR, GBP, etc.)

---

## Performance Metrics

- **Build Time**: ~5 seconds (with Turbopack)
- **Bundle Size**: Optimized for production
- **API Calls**: Batched and parallelized
- **Caching**: 5-minute revalidation (ISR)
- **Static Pages**: 16 pre-rendered at build time

---

## Known Issues

1. **CoinGecko Rate Limits**:
   - Expected during builds (many parallel requests)
   - Falls back to CoinPaprika automatically
   - No impact on production (ISR caching)

2. **CoinPaprika 404s**:
   - Some historical endpoints return 404
   - Gracefully handled with fallbacks
   - Does not affect user experience

---

## Tech Stack Summary

- **Framework**: Next.js 16.0.3 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

---

## Data Sources

| Network | Primary Source | Hashrate | Difficulty | Price |
|---------|---------------|----------|------------|-------|
| BTC | mempool.space | ✅ | ✅ | CoinGecko/CryptoCompare |
| LTC | litecoinspace.org | ✅ | ✅ | CoinGecko/CryptoCompare |
| XMR | Minerstat | ✅ | ✅ | CoinGecko/CryptoCompare |
| DOGE | GetBlock RPC | ✅ | ✅ | CoinGecko/CryptoCompare |
| KAS | api.kaspa.org | ✅ | ✅ | CoinGecko/CryptoCompare |
| ETC | blockscout.com | ✅ | ✅ | CoinGecko/CryptoCompare |
| RVN | blockbook.ravencoin.org | ✅ | ✅ | CoinGecko/CryptoCompare |
| ZEC | zcashblockexplorer.com | ✅ | ✅ | CoinGecko/CryptoCompare |
| BCH | mempool.space | ✅ | ✅ | CoinGecko/CryptoCompare |
| ERG | Minerstat | ✅ | ✅ | CoinGecko/CryptoCompare |
| CFX | Minerstat | ✅ | ✅ | CryptoCompare |

### Historical Data Sources
| Network | History Source | Data Period |
|---------|---------------|-------------|
| ALL | Minerstat API | 90 days |
| /api/history | Local JSON files | Continuous |

---

## Contact & Support

- **GitHub**: https://github.com/bokiko/bloxchaser
- **Live Site**: https://bloxchaser.com (Vercel)
- **Issues**: Use GitHub Issues for bug reports

---

## Session History

### Session 4: Historical Data System & Conflux (2025-11-24)
- **Duration**: ~120 minutes
- **Key Achievements**:
  - ✅ Added Conflux (CFX) network support (11th coin)
  - ✅ Integrated CryptoCompare API for all 11 coins
  - ✅ Created historical data collection system
  - ✅ Backfilled 90 days of data (131,410 entries)
  - ✅ Built public API endpoints for historical data
  - ✅ Created GitHub Actions workflow for automated updates
- **Files Created**: 14 new files
  - `scripts/fetch-difficulty.mjs`
  - `scripts/backfill-history.mjs`
  - `lib/historicalData.ts`
  - `app/api/history/route.ts`
  - `app/api/history/[symbol]/route.ts`
  - `.github/workflows/update-difficulty.yml`
  - 10 history JSON files in `data/history/`
- **Files Modified**: `lib/fetchPrices.ts` (CryptoCompare integration)

### Session 3: Data Integrity & Architecture (2025-01-18)
- **Duration**: ~90 minutes
- **Commits**: 3
  1. Fix Dogecoin hashrate unit conversion (TH/s → PH/s)
  2. Add comprehensive architecture documentation
  3. Add MANDATORY RULES and API endpoint research requirement
- **Files Modified**: 2
  - `lib/fetchDogecoinData.ts` (unit conversion fix)
  - `ARCHITECTURE.md` (created - 900+ lines)
- **Key Achievements**:
  - ✅ Fixed last hashrate bug (Dogecoin)
  - ✅ All 10 networks verified accurate
  - ✅ Created permanent development guide
  - ✅ Implemented mandatory API research rule

### Session 2: About Page & Navigation (2025-01-17)
- **Duration**: ~30 minutes
- **Commits**: 3
  1. Update naming convention and roadmap
  2. Create comprehensive About page
  3. Fix navigation and add logo to About page
- **Files Modified**: 4
  - `CLAUDE_UPDATE.md` (naming convention)
  - `README.md` (roadmap update)
  - `app/about/page.tsx` (created)
  - `app/page.tsx` (navigation fixes)
  - `public/logo.svg` (improved styling)
- **Key Achievements**:
  - ✅ Documented naming convention (bloxchaser - lowercase)
  - ✅ Removed specific coin promises from roadmap
  - ✅ Created professional About page
  - ✅ Fixed broken navigation links

### Session 1: Ergo Integration & UI Polish (2025-01-16)
- **Duration**: ~45 minutes
- **Commits**: 2
- **Lines of Code Changed**: ~220
- **Key Achievements**:
  - ✅ Added Ergo (ERG) network support
  - ✅ Coin logos on all network cards
  - ✅ Removed Coming Soon section
  - ✅ Implemented market cap sorting

---

## Important References

### For Adding New Networks:
1. **Read ARCHITECTURE.md FIRST** - Mandatory guide
2. **Follow RULE 0** - Find 3 API endpoints before coding
3. **Use the 8-step checklist** - Don't skip Step 0!
4. **Verify hashrate units** - Check the conversion table
5. **Test against real data** - Cross-verify with 2+ sources
6. **Document everything** - Include API sources in code comments

### For Debugging Hashrate Issues:
1. **Check unit conversion** - Most common error source
2. **Verify API endpoint** - Is it returning valid data?
3. **Cross-check sources** - Compare against Minerstat, pools
4. **Review algorithm docs** - Different algorithms need different calculations
5. **Test with curl** - Raw API response verification

### Unit Conversion Quick Reference:
```
H/s (base)
÷ 1e9  = GH/s  (Monero)
÷ 1e12 = TH/s  (Litecoin, ETC, Ravencoin, Ergo)
÷ 1e15 = PH/s  (Dogecoin, Kaspa)
÷ 1e18 = EH/s  (Bitcoin, Bitcoin Cash)
```

---

*Last Updated: 2025-11-24*
*Total Sessions: 4*
*Networks Supported: 11 (all verified accurate)*
*Historical Data Points: 131,410 entries across 10 coins*
