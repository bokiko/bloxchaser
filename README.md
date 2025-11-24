<div align="center">
  <img src="./public/github-banner.svg" alt="bloxchaser Banner" width="100%" />

  <h3>Track the hashrate. Chase the blocks.</h3>

  <p>
    <a href="https://bloxchaser.com">
      <img src="https://img.shields.io/badge/Live-bloxchaser.com-orange?style=for-the-badge" alt="Live Demo" />
    </a>
  </p>

  <p>
    <a href="https://bloxchaser.com">
      <img src="https://img.shields.io/badge/demo-live-success" alt="Live Demo" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-16.0-black" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8" alt="Tailwind CSS" />
    </a>
  </p>
</div>

---

## What is bloxchaser?

**bloxchaser** is a free, real-time dashboard for cryptocurrency miners. It tracks network hashrate, difficulty, and profitability across 11 major Proof-of-Work blockchains - all in one place.

Whether you're a solo miner checking network health, a mining farm monitoring trends, or a researcher analyzing PoW networks - bloxchaser gives you instant visibility into what's happening on the blockchain.

**No account needed. No ads. Just data.**

---

## Who is this for?

| If you're a... | bloxchaser helps you... |
|----------------|------------------------|
| **Solo Miner** | Check if network difficulty is rising before you start mining |
| **Mining Farm** | Monitor hashrate trends across multiple coins to optimize your operation |
| **Trader** | Correlate hashrate changes with price movements |
| **Researcher** | Access 90 days of historical data via our public API |
| **Developer** | Build on top of our free API endpoints |

---

## What can you do on bloxchaser?

### See real-time network stats
- Current hashrate and difficulty for 11 PoW networks
- 7-day, 30-day, and 90-day trend changes
- Live price, 24h change, and market cap

### Estimate your mining earnings
- Built-in profit calculator on every coin card
- Enter your hashrate, see daily/monthly USD estimates
- Uses real-time network data and prices

### Track historical trends
- 90 days of hashrate and difficulty history
- Visual sparkline charts showing network growth
- Identify patterns before they hit the news

### Access free API
- Public API endpoints for all historical data
- No API key required for basic access
- Build your own tools, dashboards, or alerts

---

## Supported Networks (11 Coins)

| Coin | Symbol | Algorithm | What we track |
|------|--------|-----------|---------------|
| Bitcoin | BTC | SHA-256 | Hashrate, difficulty, price |
| Litecoin | LTC | Scrypt | Hashrate, difficulty, price |
| Monero | XMR | RandomX | Hashrate, difficulty, price |
| Dogecoin | DOGE | Scrypt | Hashrate, difficulty, price |
| Kaspa | KAS | kHeavyHash | Hashrate, difficulty, price |
| Ethereum Classic | ETC | Etchash | Hashrate, difficulty, price |
| Ravencoin | RVN | KawPow | Hashrate, difficulty, price |
| Zcash | ZEC | Equihash | Hashrate, difficulty, price |
| Bitcoin Cash | BCH | SHA-256 | Hashrate, difficulty, price |
| Ergo | ERG | Autolykos v2 | Hashrate, difficulty, price |
| Conflux | CFX | Octopus | Hashrate, difficulty, price |

---

## Data You Can Trust

- **Real blockchain data** - We fetch directly from official explorers and APIs
- **Multiple sources** - 4-tier fallback ensures data is always available
- **Updated every 4 hours** - Historical data collected automatically via GitHub Actions
- **90 days of history** - Over 130,000 data points across all networks
- **Transparent sources** - Every data source is documented below

---

## Quick Links

- **Live Dashboard**: [bloxchaser.com](https://bloxchaser.com)
- **API Documentation**: [See below](#api-endpoints)
- **Twitter**: [@blxchaser](https://twitter.com/blxchaser)

---

# Technical Documentation

<details>
<summary><strong>Click to expand developer documentation</strong></summary>

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bokiko/bloxchaser.git
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

- **Next.js 16.0.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Chart.js** - Sparkline visualizations
- **Recharts** - Historical charts
- **Vercel** - Deployment

## Project Structure

```
bloxchaser/
├── app/
│   ├── page.tsx                  # Main dashboard
│   ├── coin/[symbol]/page.tsx    # Coin detail pages
│   └── api/
│       ├── hashrate/route.ts     # Real-time stats API
│       └── history/
│           ├── route.ts          # Historical data list
│           └── [symbol]/route.ts # Coin-specific history
├── components/
│   ├── NetworkCard.tsx           # Coin stats card
│   ├── HashrateChart.tsx         # Historical chart
│   └── Sparkline.tsx             # Mini trend chart
├── data/history/                 # 90-day historical data (JSON)
├── scripts/
│   ├── fetch-difficulty.mjs      # Data collection (runs every 4h)
│   └── backfill-history.mjs      # One-time historical backfill
├── lib/
│   ├── fetch*Data.ts             # Per-coin data fetchers
│   ├── fetchPrices.ts            # Price fetching (4-tier fallback)
│   └── historicalData.ts         # Historical data reader
└── .github/workflows/
    └── update-difficulty.yml     # Automated data collection
```

## Data Sources

### Hashrate & Difficulty
| Coin | Primary Source |
|------|---------------|
| BTC, BCH | Mempool.space |
| LTC | Litecoinspace.org |
| DOGE | GetBlock RPC |
| KAS | api.kaspa.org |
| ETC | Blockscout |
| RVN | Blockbook |
| ZEC | zcashblockexplorer.com |
| XMR, ERG, CFX | Minerstat |

### Price Data (4-tier fallback)
1. **CoinGecko** - Primary
2. **CoinPaprika** - Secondary
3. **CryptoCompare** - Tertiary
4. **Minerstat** - Final fallback

</details>

---

## API Endpoints

All endpoints are public and free to use. No authentication required.

### GET /api/history
List all coins with available historical data.

```bash
curl https://bloxchaser.com/api/history
```

**Response:**
```json
{
  "success": true,
  "coins": [
    { "symbol": "BTC", "name": "Bitcoin", "entries": 13141 }
  ],
  "supportedCoins": ["BTC", "LTC", "XMR", "DOGE", "KAS", "ETC", "RVN", "ZEC", "BCH", "ERG", "CFX"]
}
```

### GET /api/history/{symbol}
Get full historical data for a specific coin.

```bash
# Get Bitcoin history (last 30 days)
curl https://bloxchaser.com/api/history/btc?days=30

# Get compact format for charting
curl https://bloxchaser.com/api/history/btc?format=compact
```

**Parameters:**
- `days` - Limit to last N days (optional)
- `format` - `full` (default) or `compact`

**Response:**
```json
{
  "success": true,
  "coin": "BTC",
  "name": "Bitcoin",
  "algorithm": "SHA-256",
  "data": [
    {
      "timestamp": 1700000000,
      "hashrate": 725.45,
      "difficulty": 102290000000000,
      "price": 98234.56
    }
  ],
  "totalEntries": 13141
}
```

### GET /api/hashrate
Get real-time stats for all coins.

```bash
curl https://bloxchaser.com/api/hashrate
```

---

## Roadmap

### Completed
- [x] 11 PoW networks with real-time data
- [x] Profit calculator
- [x] 90-day historical data
- [x] Public API
- [x] Automated data collection

### Planned
- [ ] Email/SMS alerts for hashrate changes
- [ ] Network comparison tool
- [ ] Advanced profit calculator (electricity costs, hardware)
- [ ] Mining pool distribution
- [ ] Mobile app

---

## Contributing

Contributions welcome! Feel free to:
- Add support for more PoW coins
- Improve UI/UX
- Build new features
- Fix bugs

---

## Acknowledgments

Data provided by:
- Mempool.space, Litecoinspace.org, api.kaspa.org
- Blockscout, Blockbook, zcashblockexplorer.com
- Minerstat, CoinGecko, CoinPaprika, CryptoCompare
- GetBlock

---

## License

MIT License - see LICENSE file for details

---

<div align="center">
  <strong>Built for miners, by miners.</strong>
  <br><br>
  <a href="https://bloxchaser.com">bloxchaser.com</a> | <a href="https://twitter.com/blxchaser">@blxchaser</a>
</div>
