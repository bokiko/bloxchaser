'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { NetworkStats } from '@/types';
import HashrateChart from '@/components/HashrateChart';
import { formatDistanceToNow } from 'date-fns';

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string).toUpperCase();

  const [coinData, setCoinData] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/hashrate');
        const result = await response.json();

        if (result.success) {
          const coin = result.data.find((c: NetworkStats) => c.symbol === symbol);
          if (coin) {
            setCoinData(coin);
          } else {
            setError('Coin not found');
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch coin data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [symbol]);

  const getHashrateUnit = (sym: string) => {
    switch (sym) {
      case 'BTC': return 'EH/s';
      case 'LTC': return 'TH/s';
      case 'XMR': return 'GH/s';
      case 'DOGE': return 'TH/s';
      case 'KAS': return 'TH/s';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (error || !coinData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Coin not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
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
