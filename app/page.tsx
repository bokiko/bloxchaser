import { NetworkStats } from '@/types';
import NetworkView from '@/components/NetworkView';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchLitecoinHashrate } from '@/lib/fetchLitecoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchKaspaHashrate } from '@/lib/fetchKaspaData';
import { fetchEthereumClassicHashrate } from '@/lib/fetchEthereumClassicData';
import { fetchRavencoinHashrate } from '@/lib/fetchRavencoinData';
import { fetchMinerstatCoins } from '@/lib/fetchMinerstatData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getNetworkData(): Promise<NetworkStats[]> {
  try {
    // Fetch all data sources in parallel with individual error handling
    const [bitcoinData, litecoinData, dogecoinData, kaspaData, ethereumClassicData, ravencoinData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate().catch(err => { console.error('Bitcoin fetch failed:', err.message); return null; }),
      fetchLitecoinHashrate().catch(err => { console.error('Litecoin fetch failed:', err.message); return null; }),
      fetchDogecoinHashrate().catch(err => { console.error('Dogecoin fetch failed:', err.message); return null; }),
      fetchKaspaHashrate().catch(err => { console.error('Kaspa fetch failed:', err.message); return null; }),
      fetchEthereumClassicHashrate().catch(err => { console.error('ETC fetch failed:', err.message); return null; }),
      fetchRavencoinHashrate().catch(err => { console.error('Ravencoin fetch failed:', err.message); return null; }),
      fetchMinerstatCoins().catch(err => { console.error('Minerstat fetch failed:', err.message); return new Map(); }),
      fetchCryptoPrices().catch(err => { console.error('Prices fetch failed:', err.message); return { bitcoin: { price: 0, change24h: 0, marketCap: 0 }, litecoin: { price: 0, change24h: 0, marketCap: 0 }, monero: { price: 0, change24h: 0, marketCap: 0 }, dogecoin: { price: 0, change24h: 0, marketCap: 0 }, kaspa: { price: 0, change24h: 0, marketCap: 0 }, ethereumClassic: { price: 0, change24h: 0, marketCap: 0 }, ravencoin: { price: 0, change24h: 0, marketCap: 0 } }; }),
    ]);

    // Get coins from Minerstat (BTC for price/difficulty, LTC for price/difficulty, XMR)
    const bitcoinMinerstatData = minerstatCoins.get('BTC');
    const litecoinMinerstatData = minerstatCoins.get('LTC');
    const moneroData = minerstatCoins.get('XMR');

    // Merge price data with network stats (only if data exists)
    const bitcoinWithPrice = bitcoinData ? {
      ...bitcoinData,
      currentPrice: bitcoinMinerstatData?.currentPrice || prices.bitcoin.price || 0,
      currentDifficulty: bitcoinMinerstatData?.currentDifficulty || bitcoinData.currentDifficulty,
      priceChange24h: prices.bitcoin.change24h || 0,
      marketCap: prices.bitcoin.marketCap || 0,
    } : null;

    const litecoinWithPrice = litecoinData ? {
      ...litecoinData,
      currentPrice: litecoinMinerstatData?.currentPrice || prices.litecoin.price || 0,
      currentDifficulty: litecoinMinerstatData?.currentDifficulty || litecoinData.currentDifficulty,
      priceChange24h: prices.litecoin.change24h || 0,
      marketCap: prices.litecoin.marketCap || 0,
    } : null;

    const moneroWithPrice = moneroData ? {
      ...moneroData,
      priceChange24h: prices.monero.change24h,
      marketCap: prices.monero.marketCap,
    } : null;

    const dogecoinWithPrice = dogecoinData ? {
      ...dogecoinData,
      currentPrice: prices.dogecoin.price || 0,
      priceChange24h: prices.dogecoin.change24h || 0,
      marketCap: prices.dogecoin.marketCap || 0,
    } : null;

    const kaspaWithPrice = kaspaData ? {
      ...kaspaData,
      currentPrice: prices.kaspa.price || 0,
      priceChange24h: prices.kaspa.change24h || 0,
      marketCap: prices.kaspa.marketCap || 0,
    } : null;

    // ETC already has price/market cap from Blockscout, use it directly
    const ethereumClassicWithPrice = ethereumClassicData;

    const ravencoinWithPrice = ravencoinData ? {
      ...ravencoinData,
      currentPrice: prices.ravencoin.price || 0,
      priceChange24h: prices.ravencoin.change24h || 0,
      marketCap: prices.ravencoin.marketCap || 0,
    } : null;

    return [
      bitcoinWithPrice,
      litecoinWithPrice,
      moneroWithPrice,
      dogecoinWithPrice,
      kaspaWithPrice,
      ethereumClassicWithPrice,
      ravencoinWithPrice,
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
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Slogan */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative">
                  <img src="/logo.svg" alt="bloxchaser" className="h-10 w-auto" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Real-Time Mining Network Analytics
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Dashboard</a>
              <a href="#networks" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Networks</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">About</a>
            </nav>

            {/* Live Data Indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Live Data</span>
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
            {/* Network View with Toggle */}
            <NetworkView networkData={networkData} />

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
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Left: Branding */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">bloxchaser</h3>
              <p className="text-slate-400 text-sm">Built for miners, by miners.</p>
              <p className="text-slate-500 text-xs mt-2">© 2025 bloxchaser</p>
            </div>

            {/* Center: Links */}
            <div className="flex items-center justify-center gap-6">
              <a href="https://github.com/bokiko/bloxchaser" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>
              <a href="https://twitter.com/bloxchaser" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-sm hidden sm:inline">Twitter</span>
              </a>
            </div>

            {/* Right: Disclaimer */}
            <div className="text-left md:text-right">
              <p className="text-slate-400 text-xs flex items-center md:justify-end gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Data updates every 5 minutes. Not financial advice.
              </p>
            </div>
          </div>

          {/* Bottom Bar: Additional Links */}
          <div className="border-t border-slate-700/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Use</a>
              <a href="https://github.com/bokiko/bloxchaser#readme" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">Documentation</a>
            </div>
            <div className="text-center sm:text-right">
              Made with <span className="text-red-500">♥</span> for the mining community
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
