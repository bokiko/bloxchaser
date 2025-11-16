# bloxchaser

**Real-Time Mining Network Analytics**

bloxchaser is a comprehensive mining network analytics dashboard that tracks hashrate trends, difficulty adjustments, network health, and price data for top mineable cryptocurrencies.

## Features

- 📊 **Real-time hashrate tracking** for 7 major cryptocurrencies
- 📈 **Historical charts** showing 90 days of network data with real blockchain data
- 🔥 **Trend analysis** - 7d, 30d, 90d hashrate changes with color-coded indicators
- ⚡ **Live difficulty tracking** with readable formatting (P/T/G units)
- 💰 **Price tracking** with 24h change and market cap data
- 🎨 **Beautiful, responsive UI** built with Next.js 15 and Tailwind CSS v4
- 🔄 **Auto-refresh** data fetching with 1-hour cache
- 📱 **Mobile-responsive** design for all screen sizes
- 🔒 **Enterprise-level security** with comprehensive HTTP headers
- 🚀 **Server-Side Rendering (SSR)** for optimal SEO and performance
- 🔍 **SEO-optimized** with Open Graph and Twitter Card metadata
- ⚖️ **Legal compliance** with Terms of Use and Privacy Policy pages

## Supported Cryptocurrencies

| Coin | Symbol | Hashrate Source | Price Source | Unit |
|------|--------|-----------------|--------------|------|
| Bitcoin | BTC | Mempool.space | CoinGecko / CoinPaprika / Minerstat | EH/s (Exahash) |
| Litecoin | LTC | Litecoinspace.org | CoinGecko / CoinPaprika / Minerstat | TH/s (Terahash) |
| Monero | XMR | Minerstat | CoinGecko / CoinPaprika / Minerstat | GH/s (Gigahash) |
| Dogecoin | DOGE | GetBlock RPC | CoinGecko / CoinPaprika | TH/s (Terahash) |
| Kaspa | KAS | api.kaspa.org | CoinGecko / CoinPaprika | PH/s (Petahash) |
| Ethereum Classic | ETC | Blockscout + Minerstat | Blockscout | TH/s (Terahash) |
| Ravencoin | RVN | Blockbook | CoinGecko / CoinPaprika | TH/s (Terahash) |

**Price Data Fallback Chain**:
1. CoinGecko API (primary - fastest updates)
2. CoinPaprika API (backup - no API key required)
3. Minerstat API (final fallback)

This ensures financial data is never missing due to API rate limiting or outages.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bloxchaser.git
cd bloxchaser

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Rendering**: Server-Side Rendering (SSR) with Incremental Static Regeneration (ISR)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Sources**:
  - Mempool.space API (Bitcoin hashrate & history)
  - Litecoinspace.org API (Litecoin hashrate & history)
  - GetBlock Public RPC (Dogecoin hashrate)
  - api.kaspa.org (Kaspa hashrate)
  - Blockscout API (ETC price, market cap, historical data)
  - Blockbook API (Ravencoin hashrate & historical blocks)
  - Minerstat API v2 (XMR, BTC/LTC price backup, ETC hashrate)
  - CoinGecko API (Primary price source with fallback chain)
  - CoinPaprika API (Price fallback, no API key required)
- **Date Formatting**: date-fns
- **HTTP Client**: axios
- **Security**:
  - Content-Security-Policy (CSP)
  - X-Content-Type-Options, X-Frame-Options
  - Referrer-Policy
- **Deployment**: Vercel-ready

## Project Structure

```
bloxchaser/
├── app/
│   ├── coin/
│   │   └── [symbol]/
│   │       └── page.tsx          # Individual coin detail page with charts
│   ├── legal/
│   │   ├── terms/
│   │   │   └── page.tsx          # Terms of Use page
│   │   └── privacy/
│   │       └── page.tsx          # Privacy Policy page
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles (Tailwind v4)
├── components/
│   ├── NetworkCard.tsx           # Coin stats card component
│   ├── NetworkView.tsx           # Card/Table view toggle component
│   ├── HashrateChart.tsx         # Historical hashrate chart component
│   └── BackButton.tsx            # Client-side navigation component
├── lib/
│   ├── fetchBitcoinData.ts       # Bitcoin data fetcher (Mempool.space)
│   ├── fetchLitecoinData.ts      # Litecoin data fetcher (Litecoinspace)
│   ├── fetchDogecoinData.ts      # Dogecoin data fetcher (GetBlock RPC)
│   ├── fetchKaspaData.ts         # Kaspa data fetcher (api.kaspa.org)
│   ├── fetchEthereumClassicData.ts # ETC data fetcher (Blockscout)
│   ├── fetchRavencoinData.ts     # Ravencoin data fetcher (Blockbook)
│   ├── fetchMinerstatData.ts     # Multi-coin data fetcher (Minerstat)
│   └── fetchPrices.ts            # Price data fetcher (CoinGecko/CoinPaprika)
├── types/
│   └── index.ts                  # TypeScript type definitions
├── TERMS_OF_USE.md               # Full Terms of Use document
└── PRIVACY_POLICY.md             # Full Privacy Policy document
```

## API Endpoints

### GET /api/hashrate

Returns real-time network statistics for all supported coins.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "coin": "Bitcoin",
      "symbol": "BTC",
      "currentHashrate": 725.45,
      "currentDifficulty": 102290000000000,
      "change7d": 2.34,
      "change30d": -1.23,
      "change90d": 15.67,
      "lastUpdated": 1700000000000,
      "historicalData": [...],
      "currentPrice": 98234.56,
      "priceChange24h": 3.45,
      "marketCap": 1920000000000
    }
  ],
  "timestamp": 1700000000000
}
```

**Caching**: 1 hour (3600 seconds)

## Data Sources & Limits

- **Mempool.space**: No API key required, public endpoint
- **Litecoinspace.org**: No API key required, public endpoint
- **api.kaspa.org**: No API key required, official Kaspa API
- **Blockscout (ETC)**: No API key required, public blockchain explorer
- **Blockbook (RVN)**: No API key required, public Ravencoin blockchain explorer
- **Minerstat API**: Free tier, 12 requests/minute
- **GetBlock RPC**: Public endpoint for Dogecoin
- **CoinGecko**: Free tier, rate limited (primary price source)
- **CoinPaprika**: Free tier, 5-minute updates, no API key required (price fallback)

All APIs are used responsibly with appropriate caching (1-hour) to minimize requests and prevent rate limiting.

## Architecture & Performance

### Server-Side Rendering (SSR)
bloxchaser uses Next.js 15 Server Components for optimal performance and SEO:

- **Full HTML on first load**: Crawlers and users see complete content immediately
- **No loading states for bots**: SEO-friendly, perfect for Google, social media previews
- **Incremental Static Regeneration (ISR)**: Pages revalidate every hour
- **Static generation**: All 7 coin detail pages are pre-rendered at build time

### Security Features

All HTTP responses include enterprise-grade security headers:

- **Content-Security-Policy (CSP)**: Prevents XSS attacks by whitelisting trusted sources
- **X-Content-Type-Options**: Prevents MIME-type sniffing attacks
- **X-Frame-Options**: Prevents clickjacking attacks
- **Referrer-Policy**: Controls referrer information for privacy

All external API calls are made server-side, keeping API endpoints secure and never exposed to the browser.

### SEO Optimization

- Comprehensive Open Graph and Twitter Card metadata
- Semantic HTML with proper heading hierarchy
- Optimized meta descriptions with relevant keywords
- Crawler-friendly URLs and navigation structure

## Data Transparency

Historical hashrate data (90 days) is calculated from real blockchain data where available:
- **Ravencoin**: Fetches actual historical block difficulties at 7d, 30d, 90d intervals and calculates hashrate
- **Other coins**: Historical data points are sampled based on current network statistics

Current network data (hashrate, difficulty, price) is fetched in real-time from authoritative sources.

## Contributing

Contributions are welcome! Feel free to:
- Add support for more coins (ERG, FLUX, ZEC, BCH, etc.)
- Improve the UI/UX
- Add new features (alerts, comparisons, profitability calculators)
- Optimize data fetching and caching
- Fix bugs or improve documentation

## Roadmap

### Completed Features
- [x] Ravencoin (RVN) - Added with real historical blockchain data

### Planned Features
- [ ] Ergo (ERG)
- [ ] Flux (FLUX)
- [ ] Zcash (ZEC)
- [ ] Bitcoin Cash (BCH)
- [ ] Profitability calculator based on hardware specs
- [ ] Email/SMS alerts for hashrate changes
- [ ] Network comparison tool
- [ ] Historical difficulty charts
- [ ] Mining pool distribution data

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Mempool.space for Bitcoin hashrate & historical data
- Litecoinspace.org for Litecoin network data
- api.kaspa.org for official Kaspa hashrate API
- Blockscout for Ethereum Classic blockchain data
- Blockbook for Ravencoin blockchain data & historical blocks
- Minerstat for multi-coin network data and price backup
- GetBlock for Dogecoin RPC access
- CoinGecko for primary price data
- CoinPaprika for reliable price fallback (no API key required)

---

**Built for miners, by miners.**
