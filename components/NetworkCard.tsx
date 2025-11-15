'use client';

import { NetworkStats } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NetworkCardProps {
  stats: NetworkStats;
}

export default function NetworkCard({ stats }: NetworkCardProps) {
  const getHashrateUnit = () => {
    switch (stats.symbol) {
      case 'BTC':
        return 'EH/s'; // Exahashes
      case 'LTC':
        return 'TH/s'; // Terahashes
      case 'XMR':
        return 'GH/s'; // Gigahashes
      default:
        return 'H/s';
    }
  };

  const formatHashrate = (value: number) => {
    return value.toFixed(2);
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

  const getChangeEmoji = (value: number) => {
    if (value > 5) return '🔥';
    if (value > 0) return '📈';
    if (value < -5) return '❄️';
    if (value < 0) return '📉';
    return '➡️';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{stats.coin}</h2>
          <p className="text-slate-400 text-sm mt-1">{stats.symbol}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${stats.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-semibold ${getChangeColor(stats.priceChange24h)}`}>
            {formatChange(stats.priceChange24h)} 24h
          </div>
        </div>
      </div>

      {/* Current Stats */}
      <div className="mb-6">
        <div className="text-slate-400 text-sm mb-2">Network Hashrate</div>
        <div className="text-4xl font-bold text-white mb-1">
          {formatHashrate(stats.currentHashrate)} <span className="text-2xl text-slate-400">{getHashrateUnit()}</span>
        </div>
        <div className="text-slate-400 text-xs">
          Updated {formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}
        </div>
      </div>

      {/* Price & Market Cap Row */}
      <div className="mb-6 pb-6 border-b border-slate-700 grid grid-cols-2 gap-4">
        <div>
          <div className="text-slate-400 text-sm mb-2">Market Cap</div>
          <div className="text-lg font-bold text-white">
            ${(stats.marketCap / 1e9).toFixed(2)}B
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-sm mb-2">Difficulty</div>
          <div className="text-lg font-bold text-white">
            {stats.currentDifficulty.toExponential(2)}
          </div>
        </div>
      </div>

      {/* Changes */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-slate-400 text-xs mb-1">7 Days</div>
          <div className={`text-lg font-bold ${getChangeColor(stats.change7d)}`}>
            {formatChange(stats.change7d)}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs mb-1">30 Days</div>
          <div className={`text-lg font-bold ${getChangeColor(stats.change30d)}`}>
            {formatChange(stats.change30d)}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs mb-1">90 Days</div>
          <div className={`text-lg font-bold ${getChangeColor(stats.change90d)}`}>
            {formatChange(stats.change90d)}
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <Link href={`/coin/${stats.symbol.toLowerCase()}`}>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          View Details & Chart
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
