'use client';

import { NetworkStats } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import Sparkline from './Sparkline';

interface NetworkCardProps {
  stats: NetworkStats;
}

export default function NetworkCard({ stats }: NetworkCardProps) {
  const [showProfit, setShowProfit] = useState(false);
  const [userHashrate, setUserHashrate] = useState('');

  const getHashrateUnit = () => {
    switch (stats.symbol) {
      case 'BTC': return 'EH/s';
      case 'LTC': return 'TH/s';
      case 'XMR': return 'GH/s';
      case 'DOGE': return 'TH/s';
      case 'KAS': return 'PH/s';
      case 'ETC': return 'TH/s';
      case 'RVN': return 'TH/s';
      case 'ZEC': return 'MSol/s';
      case 'BCH': return 'EH/s';
      default: return 'H/s';
    }
  };

  const getBlockReward = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 3.125;
      case 'LTC': return 6.25;
      case 'DOGE': return 10000;
      case 'BCH': return 3.125;
      case 'ZEC': return 3.125;
      case 'RVN': return 2500;
      case 'ETC': return 2.56;
      case 'KAS': return 250;
      case 'XMR': return 0.6;
      default: return 0;
    }
  };

  const getBlocksPerDay = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 144; // 10 min blocks
      case 'LTC': return 576; // 2.5 min blocks
      case 'DOGE': return 1440; // 1 min blocks
      case 'BCH': return 144; // 10 min blocks
      case 'ZEC': return 1152; // 75 sec blocks
      case 'RVN': return 1440; // 1 min blocks
      case 'ETC': return 6500; // 13 sec blocks
      case 'KAS': return 86400; // 1 sec blocks
      case 'XMR': return 720; // 2 min blocks
      default: return 144;
    }
  };

  const calculateProfit = () => {
    if (!userHashrate || parseFloat(userHashrate) === 0) return 0;
    const userHash = parseFloat(userHashrate);
    const networkHash = stats.currentHashrate;
    const blockReward = getBlockReward(stats.symbol);
    const blocksPerDay = getBlocksPerDay(stats.symbol);

    // Daily profit = (user_hash / network_hash) * blocks_per_day * block_reward * price
    const dailyCoins = (userHash / networkHash) * blocksPerDay * blockReward;
    return dailyCoins * stats.currentPrice;
  };

  const formatHashrate = (value: number) => value.toFixed(2);
  const formatChange = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const formatDifficulty = (value: number) => {
    if (value >= 1e15) return `${(value / 1e15).toFixed(2)}P`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}G`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
  };

  // Generate sparkline data from historical data
  const hashrateSparkline = stats.historicalData?.slice(-10).map(d => d.hashrate) || [];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      {/* Coin Name */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">{stats.coin}</h2>
        <p className="text-slate-400 text-sm">{stats.symbol}</p>
      </div>

      {/* Top Row: Price + 24h change */}
      <div className="mb-5">
        <div className="text-slate-400 text-xs mb-1">Price</div>
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
          <div className="text-slate-400 text-xs mb-1">Hashrate</div>
          <div className="text-lg font-bold text-white">
            {formatHashrate(stats.currentHashrate)} <span className="text-sm text-slate-400">{getHashrateUnit()}</span>
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs mb-1">Difficulty</div>
          <div className="text-lg font-bold text-white">
            {formatDifficulty(stats.currentDifficulty)}
          </div>
        </div>
      </div>

      {/* Trends with Sparklines */}
      <div className="mb-4">
        <div className="text-slate-400 text-xs mb-1">Market Cap</div>
        <div className="text-lg font-bold text-white">
          ${(stats.marketCap / 1e9).toFixed(2)}B
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: '7d', value: stats.change7d },
            { label: '30d', value: stats.change30d },
            { label: '90d', value: stats.change90d }
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-slate-400 text-xs mb-0.5">{label}</div>
              <div className={`text-sm font-bold ${getChangeColor(value)}`}>
                {formatChange(value)}
              </div>
              {hashrateSparkline.length > 0 && (
                <div className="mt-1 h-4">
                  <Sparkline
                    data={hashrateSparkline}
                    color={value >= 0 ? '#10b981' : '#ef4444'}
                    height={16}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profit Calculator Toggle */}
      <div className="mb-4 pb-4 border-b border-slate-700/50">
        <button
          onClick={() => setShowProfit(!showProfit)}
          className="w-full text-left text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {showProfit ? 'Hide' : 'Show'} Profit Calculator
        </button>

        {showProfit && (
          <div className="mt-3 space-y-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Your Hashrate ({getHashrateUnit()})
              </label>
              <input
                type="number"
                value={userHashrate}
                onChange={(e) => setUserHashrate(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            {userHashrate && parseFloat(userHashrate) > 0 && (
              <div className="bg-green-900/20 border border-green-700/50 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">Estimated Daily Profit</div>
                <div className="text-2xl font-bold text-green-400">
                  ${calculateProfit().toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ≈ ${(calculateProfit() * 30).toFixed(2)}/month
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mb-4">
        <div className="text-slate-400 text-xs flex items-center gap-1.5">
          <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Updated {formatDistanceToNow(stats.lastUpdated)} ago
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* View Details Button */}
        <Link href={`/coin/${stats.symbol.toLowerCase()}`} className="col-span-2">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            View Details & Chart
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>

        {/* X Share Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${stats.symbol} hashrate ${stats.change7d >= 0 ? '+' : ''}${stats.change7d.toFixed(1)}% (7d) 📊 Check BloxChaser for real-time mining stats`)}&url=${encodeURIComponent('https://bloxchaser.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Share on X
          </button>
        </a>
      </div>
    </div>
  );
}
