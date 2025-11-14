'use client';

import { NetworkStats } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NetworkCardProps {
  stats: NetworkStats;
}

export default function NetworkCard({ stats }: NetworkCardProps) {
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
        <div className="text-4xl">{getChangeEmoji(stats.change7d)}</div>
      </div>

      {/* Current Stats */}
      <div className="mb-6">
        <div className="text-slate-400 text-sm mb-2">Network Hashrate</div>
        <div className="text-4xl font-bold text-white mb-1">
          {formatHashrate(stats.currentHashrate)} <span className="text-2xl text-slate-400">EH/s</span>
        </div>
        <div className="text-slate-400 text-xs">
          Updated {formatDistanceToNow(stats.lastUpdated, { addSuffix: true })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6 pb-6 border-b border-slate-700">
        <div className="text-slate-400 text-sm mb-2">Difficulty</div>
        <div className="text-xl font-bold text-white">
          {stats.currentDifficulty.toExponential(2)}
        </div>
      </div>

      {/* Changes */}
      <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
}
