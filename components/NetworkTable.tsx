'use client';

import { NetworkStats } from '@/types';
import Link from 'next/link';

interface NetworkTableProps {
  networks: NetworkStats[];
}

export default function NetworkTable({ networks }: NetworkTableProps) {
  const getCoinImage = (symbol: string) => {
    const colors: Record<string, string> = {
      'BTC': 'bg-orange-500',
      'LTC': 'bg-slate-400',
      'XMR': 'bg-orange-600',
      'DOGE': 'bg-yellow-400',
      'KAS': 'bg-teal-500',
      'ETC': 'bg-green-600',
    };
    return colors[symbol] || 'bg-blue-500';
  };

  const getHashrateUnit = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 'EH/s';
      case 'LTC': return 'TH/s';
      case 'XMR': return 'GH/s';
      case 'DOGE': return 'TH/s';
      case 'KAS': return 'PH/s';
      case 'ETC': return 'TH/s';
      default: return 'H/s';
    }
  };

  const formatChange = (value: number) => {
    return value.toFixed(1);
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-slate-400';
  };

  const getChangeBg = (value: number) => {
    if (value > 0) return 'bg-green-500/10';
    if (value < 0) return 'bg-red-500/10';
    return 'bg-slate-500/10';
  };

  const formatDifficulty = (value: number) => {
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}P`;
    else if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    else if (value >= 1e9) return `${(value / 1e9).toFixed(2)}G`;
    else if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toFixed(2);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50">
              <th className="sticky left-0 bg-slate-800/50 px-4 py-3 text-left">
                <span className="text-xs font-semibold text-slate-400">#</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-slate-400">Coin</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">Price</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">24h</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">7d</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">Market Cap</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">Hashrate</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">Difficulty</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">30d</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-slate-400">90d</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {networks.map((stats, index) => (
              <tr
                key={stats.symbol}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                {/* Rank */}
                <td className="sticky left-0 bg-slate-900 hover:bg-slate-800/30 px-4 py-4">
                  <span className="text-sm text-slate-400 font-medium">{index + 1}</span>
                </td>

                {/* Coin */}
                <td className="px-4 py-4">
                  <Link href={`/coin/${stats.symbol.toLowerCase()}`}>
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className={`w-6 h-6 rounded-full ${getCoinImage(stats.symbol)} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">{stats.symbol[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{stats.coin}</span>
                        <span className="text-xs text-slate-400 uppercase font-medium">{stats.symbol}</span>
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Price */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-white font-medium">
                    ${stats.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>

                {/* 24h */}
                <td className="px-4 py-4 text-right">
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded ${getChangeBg(stats.priceChange24h)}`}>
                    <span className={`text-sm font-semibold ${getChangeColor(stats.priceChange24h)}`}>
                      {stats.priceChange24h > 0 && '▲'}{stats.priceChange24h < 0 && '▼'} {formatChange(Math.abs(stats.priceChange24h))}%
                    </span>
                  </div>
                </td>

                {/* 7d */}
                <td className="px-4 py-4 text-right">
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded ${getChangeBg(stats.change7d)}`}>
                    <span className={`text-sm font-semibold ${getChangeColor(stats.change7d)}`}>
                      {stats.change7d > 0 && '▲'}{stats.change7d < 0 && '▼'} {formatChange(Math.abs(stats.change7d))}%
                    </span>
                  </div>
                </td>

                {/* Market Cap */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-slate-300 font-medium">
                    ${(stats.marketCap / 1e9).toFixed(2)}B
                  </span>
                </td>

                {/* Hashrate */}
                <td className="px-4 py-4 text-right">
                  <div>
                    <div className="text-sm text-white font-medium">
                      {stats.currentHashrate.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {getHashrateUnit(stats.symbol)}
                    </div>
                  </div>
                </td>

                {/* Difficulty */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-slate-300">
                    {formatDifficulty(stats.currentDifficulty)}
                  </span>
                </td>

                {/* 30d */}
                <td className="px-4 py-4 text-right">
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded ${getChangeBg(stats.change30d)}`}>
                    <span className={`text-sm font-semibold ${getChangeColor(stats.change30d)}`}>
                      {stats.change30d > 0 && '▲'}{stats.change30d < 0 && '▼'} {formatChange(Math.abs(stats.change30d))}%
                    </span>
                  </div>
                </td>

                {/* 90d */}
                <td className="px-4 py-4 text-right">
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded ${getChangeBg(stats.change90d)}`}>
                    <span className={`text-sm font-semibold ${getChangeColor(stats.change90d)}`}>
                      {stats.change90d > 0 && '▲'}{stats.change90d < 0 && '▼'} {formatChange(Math.abs(stats.change90d))}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
