import { notFound } from 'next/navigation';
import { NetworkStats } from '@/types';
import HashrateChart from '@/components/HashrateChart';
import { formatDistanceToNow } from 'date-fns';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchMinerstatCoins } from '@/lib/fetchMinerstatData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';
import BackButton from '@/components/BackButton';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate static params for all supported coins
export async function generateStaticParams() {
  return [
    { symbol: 'btc' },
    { symbol: 'ltc' },
    { symbol: 'xmr' },
    { symbol: 'doge' },
    { symbol: 'kas' },
    { symbol: 'etc' },
  ];
}

async function getCoinData(symbol: string): Promise<NetworkStats | null> {
  try {
    // Fetch all data sources in parallel
    const [bitcoinData, dogecoinData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(),
      fetchDogecoinHashrate(),
      fetchMinerstatCoins(),
      fetchCryptoPrices(),
    ]);

    const symbolUpper = symbol.toUpperCase();

    // Build the coin data based on symbol
    if (symbolUpper === 'BTC') {
      const bitcoinMinerstatData = minerstatCoins.get('BTC');
      return {
        ...bitcoinData,
        currentPrice: bitcoinMinerstatData?.currentPrice || prices.bitcoin.price || 0,
        currentDifficulty: bitcoinMinerstatData?.currentDifficulty || bitcoinData.currentDifficulty,
        priceChange24h: prices.bitcoin.change24h || 0,
        marketCap: prices.bitcoin.marketCap || 0,
      };
    } else if (symbolUpper === 'DOGE') {
      return {
        ...dogecoinData,
        currentPrice: prices.dogecoin.price || 0,
        priceChange24h: prices.dogecoin.change24h || 0,
        marketCap: prices.dogecoin.marketCap || 0,
      };
    } else if (symbolUpper === 'LTC') {
      const ltcData = minerstatCoins.get('LTC');
      return ltcData ? {
        ...ltcData,
        priceChange24h: prices.litecoin.change24h || 0,
        marketCap: prices.litecoin.marketCap || 0,
      } : null;
    } else if (symbolUpper === 'XMR') {
      const xmrData = minerstatCoins.get('XMR');
      return xmrData ? {
        ...xmrData,
        priceChange24h: prices.monero.change24h || 0,
        marketCap: prices.monero.marketCap || 0,
      } : null;
    } else if (symbolUpper === 'KAS') {
      const kasData = minerstatCoins.get('KAS');
      return kasData ? {
        ...kasData,
        priceChange24h: prices.kaspa.change24h || 0,
        marketCap: prices.kaspa.marketCap || 0,
      } : null;
    } else if (symbolUpper === 'ETC') {
      const etcData = minerstatCoins.get('ETC');
      return etcData ? {
        ...etcData,
        priceChange24h: prices.ethereumClassic.change24h || 0,
        marketCap: prices.ethereumClassic.marketCap || 0,
      } : null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return null;
  }
}

export default async function CoinPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();
  const coinData = await getCoinData(symbolParam);

  if (!coinData) {
    notFound();
  }

  const getHashrateUnit = (sym: string) => {
    switch (sym) {
      case 'BTC': return 'EH/s';
      case 'LTC': return 'TH/s';
      case 'XMR': return 'GH/s';
      case 'DOGE': return 'TH/s';
      case 'KAS': return 'EH/s'; // Kaspa has massive hashrate
      case 'ETC': return 'TH/s';
      default: return 'H/s';
    }
  };

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const formatDifficulty = (value: number) => {
    if (value >= 1e15) {
      return `${(value / 1e15).toFixed(2)}P`; // Peta
    } else if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`; // Tera
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}G`; // Giga
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`; // Mega
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`; // Kilo
    }
    return value.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {coinData.coin}
              </h1>
              <p className="text-slate-400">{coinData.symbol}</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-white">
                ${coinData.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
              <div className={`text-base md:text-lg font-semibold ${getChangeColor(coinData.priceChange24h)}`}>
                {formatChange(coinData.priceChange24h)} 24h
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
            <div className="text-slate-400 text-xs md:text-sm mb-2">Network Hashrate</div>
            <div className="text-xl md:text-2xl font-bold text-white">
              {coinData.currentHashrate.toFixed(2)}
            </div>
            <div className="text-slate-500 text-xs md:text-sm">{getHashrateUnit(symbol)}</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
            <div className="text-slate-400 text-xs md:text-sm mb-2">Market Cap</div>
            <div className="text-xl md:text-2xl font-bold text-white">
              ${(coinData.marketCap / 1e9).toFixed(2)}B
            </div>
            <div className="text-slate-500 text-xs md:text-sm">USD</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
            <div className="text-slate-400 text-xs md:text-sm mb-2">Difficulty</div>
            <div className="text-xl md:text-2xl font-bold text-white">
              {formatDifficulty(coinData.currentDifficulty)}
            </div>
            <div className="text-slate-500 text-xs md:text-sm">Network</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
            <div className="text-slate-400 text-xs md:text-sm mb-2">Last Updated</div>
            <div className="text-xl md:text-2xl font-bold text-white">
              {formatDistanceToNow(coinData.lastUpdated, { addSuffix: true }).replace('about ', '')}
            </div>
            <div className="text-slate-500 text-xs md:text-sm">ago</div>
          </div>
        </div>

        {/* Hashrate Changes */}
        <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Hashrate Trends</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-slate-400 text-xs md:text-sm mb-2">7 Days</div>
              <div className={`text-xl md:text-2xl font-bold ${getChangeColor(coinData.change7d)}`}>
                {formatChange(coinData.change7d)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs md:text-sm mb-2">30 Days</div>
              <div className={`text-xl md:text-2xl font-bold ${getChangeColor(coinData.change30d)}`}>
                {formatChange(coinData.change30d)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs md:text-sm mb-2">90 Days</div>
              <div className={`text-xl md:text-2xl font-bold ${getChangeColor(coinData.change90d)}`}>
                {formatChange(coinData.change90d)}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <HashrateChart stats={coinData} />
      </main>
    </div>
  );
}
