import { NetworkStats } from '@/types';
import NetworkCard from '@/components/NetworkCard';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchMinerstatCoins } from '@/lib/fetchMinerstatData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getNetworkData(): Promise<NetworkStats[]> {
  try {
    // Fetch all data sources in parallel
    const [bitcoinData, dogecoinData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(),
      fetchDogecoinHashrate(),
      fetchMinerstatCoins(),
      fetchCryptoPrices(),
    ]);

    // Get coins from Minerstat
    const litecoinData = minerstatCoins.get('LTC');
    const moneroData = minerstatCoins.get('XMR');
    const kaspaData = minerstatCoins.get('KAS');
    const ethereumClassicData = minerstatCoins.get('ETC');

    // Merge price data with network stats
    const bitcoinWithPrice = {
      ...bitcoinData,
      currentPrice: prices.bitcoin.price,
      priceChange24h: prices.bitcoin.change24h,
      marketCap: prices.bitcoin.marketCap,
    };

    const litecoinWithPrice = litecoinData ? {
      ...litecoinData,
      priceChange24h: prices.litecoin.change24h,
      marketCap: prices.litecoin.marketCap,
    } : null;

    const moneroWithPrice = moneroData ? {
      ...moneroData,
      priceChange24h: prices.monero.change24h,
      marketCap: prices.monero.marketCap,
    } : null;

    const dogecoinWithPrice = {
      ...dogecoinData,
      currentPrice: prices.dogecoin.price,
      priceChange24h: prices.dogecoin.change24h,
      marketCap: prices.dogecoin.marketCap,
    };

    const kaspaWithPrice = kaspaData ? {
      ...kaspaData,
      priceChange24h: prices.kaspa.change24h,
      marketCap: prices.kaspa.marketCap,
    } : null;

    const ethereumClassicWithPrice = ethereumClassicData ? {
      ...ethereumClassicData,
      priceChange24h: prices.ethereumClassic.change24h,
      marketCap: prices.ethereumClassic.marketCap,
    } : null;

    return [
      bitcoinWithPrice,
      litecoinWithPrice,
      moneroWithPrice,
      dogecoinWithPrice,
      kaspaWithPrice,
      ethereumClassicWithPrice,
    ].filter((coin): coin is NetworkStats => coin !== null);
  } catch (error) {
    console.error('Error fetching network data:', error);
    return [];
  }
}

export default async function Home() {
  const networkData = await getNetworkData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                BloxChaser
              </h1>
              <p className="text-slate-400">
                Real-Time Mining Network Analytics
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Networks Tracked</div>
              <div className="text-3xl font-bold text-blue-400">{networkData.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {networkData.length === 0 ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">Failed to fetch network data</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Network Cards Grid - Mobile Friendly */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {networkData.map((stats) => (
                <NetworkCard key={stats.symbol} stats={stats} />
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">More Networks Coming Soon</h2>
              <p className="text-slate-400 mb-4 text-sm md:text-base">
                Ravencoin, Ergo, Flux, and more...
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['RVN', 'ERG', 'FLUX', 'ZEC', 'BCH'].map((coin) => (
                  <span
                    key={coin}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 text-xs md:text-sm"
                  >
                    {coin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>Built for miners, by miners. Open source on GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
