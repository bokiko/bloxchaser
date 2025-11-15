# BloxChaser

**Real-Time Mining Network Analytics**

BloxChaser is a comprehensive mining network analytics dashboard that tracks hashrate trends, difficulty adjustments, network health, and price data for top mineable cryptocurrencies.

## Features

- 📊 **Real-time hashrate tracking** for 6 major cryptocurrencies
- 📈 **Historical charts** showing 90 days of network data with realistic variance
- 🔥 **Trend analysis** - 7d, 30d, 90d hashrate changes with color-coded indicators
- ⚡ **Live difficulty tracking** with readable formatting (P/T/G units)
- 💰 **Price tracking** with 24h change and market cap data
- 🎨 **Beautiful, responsive UI** built with Next.js 15 and Tailwind CSS
- 🔄 **Auto-refresh** data fetching with 1-hour cache
- 📱 **Mobile-responsive** design for all screen sizes

## Supported Cryptocurrencies

| Coin | Symbol | Data Source | Hashrate Unit |
|------|--------|-------------|---------------|
| Bitcoin | BTC | Mempool.space API | EH/s (Exahash) |
| Litecoin | LTC | Minerstat API | TH/s (Terahash) |
| Monero | XMR | Minerstat API | GH/s (Gigahash) |
| Dogecoin | DOGE | GetBlock RPC | TH/s (Terahash) |
| Kaspa | KAS | Minerstat API | TH/s (Terahash) |
| Ethereum Classic | ETC | Minerstat API | TH/s (Terahash) |

**Price Data**: CoinGecko API (24h change, market cap)

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
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Sources**:
  - Mempool.space API (Bitcoin)
  - Minerstat API v2 (LTC, XMR, KAS, ETC)
  - GetBlock Public RPC (Dogecoin)
  - CoinGecko API (Price data)
- **Date Formatting**: date-fns
- **HTTP Client**: axios
- **Deployment**: Vercel-ready

## Project Structure

```
bloxchaser/
├── app/
│   ├── api/
│   │   └── hashrate/
│   │       └── route.ts          # Main API endpoint orchestrating all data sources
│   ├── coin/
│   │   └── [symbol]/
│   │       └── page.tsx          # Individual coin detail page with charts
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles
├── components/
│   ├── NetworkCard.tsx           # Coin stats card component
│   └── HashrateChart.tsx         # Historical hashrate chart component
├── lib/
│   ├── fetchBitcoinData.ts       # Bitcoin data fetcher (Mempool.space)
│   ├── fetchDogecoinData.ts      # Dogecoin data fetcher (GetBlock RPC)
│   ├── fetchMinerstatData.ts     # Multi-coin data fetcher (Minerstat)
│   └── fetchPrices.ts            # Price data fetcher (CoinGecko)
└── types/
    └── index.ts                  # TypeScript type definitions
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
- **Minerstat API**: Free tier, 12 requests/minute
- **GetBlock RPC**: Public endpoint for Dogecoin
- **CoinGecko**: Free tier, rate limited

All APIs are used responsibly with appropriate caching to minimize requests.

## Contributing

Contributions are welcome! Feel free to:
- Add support for more coins (RVN, ERG, FLUX, ZEC, BCH, etc.)
- Improve the UI/UX
- Add new features (alerts, comparisons, profitability calculators)
- Optimize data fetching and caching
- Fix bugs or improve documentation

## Roadmap

### Planned Features
- [ ] Ravencoin (RVN)
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

- Mempool.space for Bitcoin data
- Minerstat for multi-coin network data
- GetBlock for Dogecoin RPC access
- CoinGecko for price data

---

**Built for miners, by miners.**
