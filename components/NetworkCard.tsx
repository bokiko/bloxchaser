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
      case 'DOGE':
        return 'TH/s'; // Terahashes (merged mining with LTC)
      case 'KAS':
        return 'PH/s'; // Petahashes (~630 PH/s)
      case 'ETC':
        return 'TH/s'; // Terahashes
      case 'RVN':
        return 'TH/s'; // Terahashes
      case 'ZEC':
        return 'MSol/s'; // Mega-solutions (Equihash)
      case 'BCH':
        return 'EH/s'; // Exahashes (same as Bitcoin)
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

  const formatDifficulty = (value: number) => {
    if (value >= 1e15) {
      return `${(value / 1e15).toFixed(2)}P`;
    } else if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}G`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      {/* Coin Name */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">{stats.coin}</h2>
        <p className="text-slate-400 text-sm">{stats.symbol}</p>
      </div>

      {/* Top Row: Price + 24h change (larger text) */}
      <div className="mb-5">
        <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price
        </div>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-bold text-white">
            ${stats.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xl font-semibold ${getChangeColor(stats.priceChange24h)}`}>
            {formatChange(stats.priceChange24h)} 24h
          </div>
        </div>
      </div>

      {/* Middle Row: Hashrate + Difficulty */}
      <div className="mb-5 pb-5 border-b border-slate-700/50 grid grid-cols-2 gap-3">
        <div>
          <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Hashrate
          </div>
          <div className="text-lg font-bold text-white">
            {formatHashrate(stats.currentHashrate)} <span className="text-sm text-slate-400">{getHashrateUnit()}</span>
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Difficulty
          </div>
          <div className="text-lg font-bold text-white">
            {formatDifficulty(stats.currentDifficulty)}
          </div>
        </div>
      </div>

      {/* Bottom Row: Market cap + Trends */}
      <div className="mb-4">
        <div className="mb-3">
          <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Market Cap
          </div>
          <div className="text-lg font-bold text-white">
            ${(stats.marketCap / 1e9).toFixed(2)}B
          </div>
        </div>

        {/* Trends */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              7d
            </div>
            <div className={`text-base font-bold ${getChangeColor(stats.change7d)}`}>
              {formatChange(stats.change7d)}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              30d
            </div>
            <div className={`text-base font-bold ${getChangeColor(stats.change30d)}`}>
              {formatChange(stats.change30d)}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              90d
            </div>
            <div className={`text-base font-bold ${getChangeColor(stats.change90d)}`}>
              {formatChange(stats.change90d)}
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Indicator */}
      <div className="mb-4 pb-4 border-b border-slate-700/50">
        <div className="text-slate-400 text-xs flex items-center gap-1.5 group relative cursor-help">
          <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Updated {formatDistanceToNow(stats.lastUpdated)}
          <div className="hidden group-hover:block absolute z-10 w-48 px-2 py-1 bg-slate-900 border border-slate-700 rounded shadow-xl text-xs text-slate-300 bottom-full left-0 mb-2">
            {new Date(stats.lastUpdated).toUTCString()}
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
