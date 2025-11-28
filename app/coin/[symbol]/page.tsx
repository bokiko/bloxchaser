import { notFound } from 'next/navigation';
import { NetworkStats } from '@/types';
import HashrateChart from '@/components/HashrateChart';
import CoinTabs from '@/components/CoinTabs';
import { formatDistanceToNow } from 'date-fns';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchLitecoinHashrate } from '@/lib/fetchLitecoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchKaspaHashrate } from '@/lib/fetchKaspaData';
import { fetchEthereumClassicHashrate } from '@/lib/fetchEthereumClassicData';
import { fetchRavencoinHashrate } from '@/lib/fetchRavencoinData';
import { fetchZcashHashrate } from '@/lib/fetchZcashData';
import { fetchBitcoinCashHashrate } from '@/lib/fetchBitcoinCashData';
import { fetchErgoHashrate } from '@/lib/fetchErgoData';
import { fetchConfluxHashrate } from '@/lib/fetchConfluxData';
import { fetchVerusHashrate } from '@/lib/fetchVerusData';
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
    { symbol: 'rvn' },
    { symbol: 'zec' },
    { symbol: 'bch' },
    { symbol: 'erg' },
    { symbol: 'cfx' },
    { symbol: 'vrsc' },
  ];
}

async function getCoinData(symbol: string): Promise<NetworkStats | null> {
  try {
    // Fetch all data sources in parallel
    const [bitcoinData, litecoinData, dogecoinData, kaspaData, ethereumClassicData, ravencoinData, zcashData, bitcoinCashData, ergoData, confluxData, verusData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(),
      fetchLitecoinHashrate(),
      fetchDogecoinHashrate(),
      fetchKaspaHashrate(),
      fetchEthereumClassicHashrate(),
      fetchRavencoinHashrate(),
      fetchZcashHashrate(),
      fetchBitcoinCashHashrate(),
      fetchErgoHashrate(),
      fetchConfluxHashrate(),
      fetchVerusHashrate(),
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
    } else if (symbolUpper === 'LTC') {
      const litecoinMinerstatData = minerstatCoins.get('LTC');
      return {
        ...litecoinData,
        currentPrice: litecoinMinerstatData?.currentPrice || prices.litecoin.price || 0,
        currentDifficulty: litecoinMinerstatData?.currentDifficulty || litecoinData.currentDifficulty,
        priceChange24h: prices.litecoin.change24h || 0,
        marketCap: prices.litecoin.marketCap || 0,
      };
    } else if (symbolUpper === 'DOGE') {
      return {
        ...dogecoinData,
        currentPrice: prices.dogecoin.price || 0,
        priceChange24h: prices.dogecoin.change24h || 0,
        marketCap: prices.dogecoin.marketCap || 0,
      };
    } else if (symbolUpper === 'KAS') {
      return {
        ...kaspaData,
        currentPrice: prices.kaspa.price || 0,
        priceChange24h: prices.kaspa.change24h || 0,
        marketCap: prices.kaspa.marketCap || 0,
      };
    } else if (symbolUpper === 'XMR') {
      const xmrData = minerstatCoins.get('XMR');
      return xmrData ? {
        ...xmrData,
        priceChange24h: prices.monero.change24h || 0,
        marketCap: prices.monero.marketCap || 0,
      } : null;
    } else if (symbolUpper === 'ETC') {
      // ETC already has price/market cap from Blockscout
      return ethereumClassicData;
    } else if (symbolUpper === 'RVN') {
      return {
        ...ravencoinData,
        currentPrice: prices.ravencoin.price || 0,
        priceChange24h: prices.ravencoin.change24h || 0,
        marketCap: prices.ravencoin.marketCap || 0,
      };
    } else if (symbolUpper === 'ZEC') {
      return {
        ...zcashData,
        currentPrice: prices.zcash.price || 0,
        priceChange24h: prices.zcash.change24h || 0,
        marketCap: prices.zcash.marketCap || 0,
      };
    } else if (symbolUpper === 'BCH') {
      return {
        ...bitcoinCashData,
        currentPrice: prices.bitcoinCash.price || 0,
        priceChange24h: prices.bitcoinCash.change24h || 0,
        marketCap: prices.bitcoinCash.marketCap || 0,
      };
    } else if (symbolUpper === 'ERG') {
      return {
        ...ergoData,
        currentPrice: prices.ergo.price || 0,
        priceChange24h: prices.ergo.change24h || 0,
        marketCap: prices.ergo.marketCap || 0,
      };
    } else if (symbolUpper === 'CFX') {
      const confluxMinerstatData = minerstatCoins.get('CFX');
      return {
        ...confluxData,
        currentPrice: confluxMinerstatData?.currentPrice || prices.conflux.price || 0,
        priceChange24h: prices.conflux.change24h || 0,
        marketCap: prices.conflux.marketCap || 0,
      };
    } else if (symbolUpper === 'VRSC') {
      return {
        ...verusData,
        currentPrice: prices.verus.price || 0,
        priceChange24h: prices.verus.change24h || 0,
        marketCap: prices.verus.marketCap || 0,
      };
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
      case 'KAS': return 'PH/s'; // Petahashes
      case 'ETC': return 'TH/s';
      case 'RVN': return 'TH/s';
      case 'ZEC': return 'MSol/s'; // Mega-solutions (Equihash)
      case 'BCH': return 'EH/s'; // Exahashes (same as Bitcoin)
      case 'ERG': return 'TH/s'; // Terahashes (Autolykos v2)
      case 'CFX': return 'TH/s'; // Terahashes (Octopus)
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

  const getCoinLogo = (symbol: string) => {
    const colors = {
      BTC: { bg: 'from-orange-500 to-orange-600', icon: '#F7931A' },
      LTC: { bg: 'from-slate-400 to-slate-500', icon: '#345D9D' },
      XMR: { bg: 'from-orange-600 to-red-600', icon: '#FF6600' },
      DOGE: { bg: 'from-yellow-400 to-yellow-500', icon: '#C2A633' },
      KAS: { bg: 'from-teal-500 to-cyan-600', icon: '#49E9C9' },
      ETC: { bg: 'from-green-600 to-emerald-700', icon: '#328332' },
      RVN: { bg: 'from-blue-600 to-indigo-700', icon: '#384182' },
      ZEC: { bg: 'from-yellow-600 to-amber-700', icon: '#F4B728' },
      BCH: { bg: 'from-green-500 to-emerald-600', icon: '#8DC351' },
      ERG: { bg: 'from-orange-500 to-red-600', icon: '#FF5722' },
      CFX: { bg: 'from-cyan-500 to-blue-500', icon: '#00D4FF' },
    };

    const config = colors[symbol as keyof typeof colors] || colors.BTC;

    return (
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bg} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse`}></div>
        <div className={`relative bg-gradient-to-br ${config.bg} p-4 rounded-2xl shadow-2xl`}>
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            {symbol === 'BTC' && (
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
            )}
            {symbol === 'LTC' && (
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.872 16.755l.522-2.178-2.075.52.377-1.582 2.075-.52 1.267-5.29h2.76l-1.144 4.773 2.462-.62-.377 1.582-2.462.62-.59 2.463H9.128z"/>
            )}
            {symbol === 'XMR' && (
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.853 17.316h-3.29l-3.563-5.488-3.563 5.488H4.147V6.684L12 14.537l7.853-7.853v10.632z"/>
            )}
            {symbol === 'DOGE' && (
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.853 10.447h-2.706v3.106h2.706v2.447H9.894v-2.447h1.259v-3.106H9.894V8h5.959v2.447z"/>
            )}
            {symbol === 'KAS' && (
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18L11 12.5v6.32L4 15.5V9.18zm16 0v6.32l-7 3.32V12.5l7-3.32z"/>
            )}
            {symbol === 'ETC' && (
              <path d="M12 0l-8 13.74L12 24l8-10.26L12 0zm0 2.47l5.55 9.48L12 17.53 6.45 11.95 12 2.47zM4 14.95L12 22l8-7.05-8 4.58-8-4.58z"/>
            )}
            {symbol === 'RVN' && (
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18L11 12.5v6.32L4 15.5V9.18zm16 0v6.32l-7 3.32V12.5l7-3.32z"/>
            )}
            {symbol === 'ZEC' && (
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.294 17h-7.588L16.176 9H9.647l-.588 2h3.765L6.706 19h7.588L14.176 15h6.529l.588-2h-3.765l6.118-8h-7.529L14.235 9h-3.764l.588-2z"/>
            )}
            {symbol === 'BCH' && (
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
            )}
            {symbol === 'ERG' && (
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18L17.82 8 12 11.82 6.18 8 12 4.18zM5 9.18L11 12.5v6.32L5 15.5V9.18zm14 0v6.32l-6 3.32V12.5l6-3.32z"/>
            )}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Coin Logo */}
              {getCoinLogo(coinData.symbol)}

              {/* Coin Info */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {coinData.coin}
                </h1>
                <p className="text-slate-400 text-lg">{coinData.symbol}</p>
              </div>
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
          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 group relative">
            <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
              Network Hashrate
              <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full mt-2">
              Total computational power securing the network
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">
              {coinData.currentHashrate.toFixed(2)}
            </div>
            <div className="text-slate-500 text-xs md:text-sm">{getHashrateUnit(symbol)}</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 group relative">
            <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
              Market Cap
              <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full mt-2">
              Total market value of all circulating coins
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">
              ${(coinData.marketCap / 1e9).toFixed(2)}B
            </div>
            <div className="text-slate-500 text-xs md:text-sm">USD</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 group relative">
            <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
              Difficulty
              <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full mt-2">
              Measure of how hard it is to mine a new block
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">
              {formatDifficulty(coinData.currentDifficulty)}
            </div>
            <div className="text-slate-500 text-xs md:text-sm">Network</div>
          </div>
        </div>

        {/* Financial & Network Tabs */}
        <div className="mb-8">
          <CoinTabs coinData={coinData} />
        </div>

        {/* Hashrate Changes */}
        <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Hashrate Trends</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="group relative">
              <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
                7 Days
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full">
                Hashrate change over the past week
              </div>
              <div className={`text-xl md:text-2xl font-bold ${getChangeColor(coinData.change7d)}`}>
                {formatChange(coinData.change7d)}
              </div>
            </div>
            <div className="group relative">
              <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
                30 Days
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full">
                Hashrate change over the past month
              </div>
              <div className={`text-xl md:text-2xl font-bold ${getChangeColor(coinData.change30d)}`}>
                {formatChange(coinData.change30d)}
              </div>
            </div>
            <div className="group relative">
              <div className="text-slate-400 text-xs md:text-sm mb-2 flex items-center gap-1">
                90 Days
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 top-0 left-0 transform -translate-y-full">
                Hashrate change over the past quarter
              </div>
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
