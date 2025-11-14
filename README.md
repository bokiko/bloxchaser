# BloxChaser

**Real-Time Mining Network Analytics**

BloxChaser is a mining network analytics dashboard that tracks hashrate trends, difficulty adjustments, and network health for top mineable cryptocurrencies.

## Features

- 📊 **Real-time hashrate tracking** for Bitcoin (more coins coming soon)
- 📈 **Historical charts** showing 180 days of network data
- 🔥 **Trend analysis** - 7d, 30d, 90d hashrate changes
- ⚡ **Live difficulty tracking**
- 🎨 **Beautiful, responsive UI** built with Next.js and Tailwind CSS
- 🔄 **Auto-refresh** every 5 minutes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd bloxchaser

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Roadmap

### Currently Tracking
- ✅ Bitcoin (BTC)

### Coming Soon
- [ ] Ethereum Classic (ETC)
- [ ] Litecoin (LTC)
- [ ] Monero (XMR)
- [ ] Dogecoin (DOGE)
- [ ] Kaspa (KAS)
- [ ] Ravencoin (RVN)
- [ ] Ergo (ERG)
- [ ] Flux (FLUX)
- [ ] Zcash (ZEC)
- [ ] Bitcoin Cash (BCH)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data**: Blockchain.com API (no API key required)
- **Deployment**: Vercel

## Project Structure

```
bloxchaser/
├── app/
│   ├── api/hashrate/     # API routes for fetching data
│   ├── page.tsx          # Main dashboard page
│   └── layout.tsx        # Root layout
├── components/
│   ├── NetworkCard.tsx   # Network stats card
│   └── HashrateChart.tsx # Historical hashrate chart
├── lib/
│   └── fetchBitcoinData.ts # Data fetching utilities
└── types/
    └── index.ts          # TypeScript type definitions
```

## Contributing

Contributions are welcome! Feel free to:
- Add support for more coins
- Improve the UI/UX
- Add new features (alerts, comparisons, profitability calculators)
- Fix bugs

## License

MIT

---

**Built for miners, by miners.**
