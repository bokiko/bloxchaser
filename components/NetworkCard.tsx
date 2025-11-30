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
      case 'ERG': return 'TH/s';
      case 'CFX': return 'TH/s';
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
      case 'ERG': return 9; // 9 ERG per block
      case 'CFX': return 0.78; // ~0.78 CFX per block
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
      case 'ERG': return 720; // 2 min blocks
      case 'CFX': return 172800; // 0.5 sec blocks
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

  const getCoinLogo = (symbol: string) => {
    const logos: Record<string, React.ReactElement> = {
      'BTC': (
        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
      ),
      'LTC': (
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.872 16.755l.522-2.178-2.075.52.377-1.582 2.075-.52 1.267-5.29h2.76l-1.144 4.773 2.462-.62-.377 1.582-2.462.62-.59 2.463H9.128z"/>
      ),
      'XMR': (
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.853 17.316h-3.29l-3.563-5.488-3.563 5.488H4.147V6.684L12 14.537l7.853-7.853v10.632z"/>
      ),
      'DOGE': (
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.853 10.447h-2.706v3.106h2.706v2.447H9.894v-2.447h1.259v-3.106H9.894V8h5.959v2.447z"/>
      ),
      'KAS': (
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18L11 12.5v6.32L4 15.5V9.18zm16 0v6.32l-7 3.32V12.5l7-3.32z"/>
      ),
      'ETC': (
        <path d="M12 0l-8 13.74L12 24l8-10.26L12 0zm0 2.47l5.55 9.48L12 17.53 6.45 11.95 12 2.47zM4 14.95L12 22l8-7.05-8 4.58-8-4.58z"/>
      ),
      'RVN': (
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18L11 12.5v6.32L4 15.5V9.18zm16 0v6.32l-7 3.32V12.5l7-3.32z"/>
      ),
      'ZEC': (
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.294 17h-7.588L16.176 9H9.647l-.588 2h3.765L6.706 19h7.588L14.176 15h6.529l.588-2h-3.765l6.118-8h-7.529L14.235 9h-3.764l.588-2z"/>
      ),
      'BCH': (
        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
      ),
      'ERG': (
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18L17.82 8 12 11.82 6.18 8 12 4.18zM5 9.18L11 12.5v6.32L5 15.5V9.18zm14 0v6.32l-6 3.32V12.5l6-3.32z"/>
      ),
      'CFX': (
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18L11 12.5v6.32L4 15.5V9.18zm16 0v6.32l-7 3.32V12.5l7-3.32z"/>
      ),
      'VRSC': (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 5.5L12 17.5 7.5 7.5h2.25l2.25 5.75 2.25-5.75h2.25z"/>
      ),
    };

    const colors: Record<string, string> = {
      'BTC': '#F7931A',  // Bitcoin Orange
      'LTC': '#345D9D',  // Litecoin Blue
      'XMR': '#FF6600',  // Monero Orange
      'DOGE': '#C2A633', // Dogecoin Gold
      'KAS': '#49E9C9',  // Kaspa Cyan
      'ETC': '#328332',  // Ethereum Classic Green
      'RVN': '#f15b22',  // Ravencoin Orange
      'ZEC': '#F4B728',  // Zcash Yellow
      'BCH': '#8DC351',  // Bitcoin Cash Green
      'ERG': '#000000',  // Ergo Black
      'CFX': '#1A1A2E',  // Conflux Dark Blue
      'VRSC': '#3165D4', // Verus Blue
    };

    return (
      <div className="relative group">
        <div className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" style={{ backgroundColor: colors[symbol] || '#F7931A' }}></div>
        <div className="relative bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-700/50">
          <svg className="w-8 h-8" fill={colors[symbol] || '#F7931A'} viewBox="0 0 24 24">
            {logos[symbol] || logos['BTC']}
          </svg>
        </div>
      </div>
    );
  };

  // Generate sparkline data from historical data
  const hashrateSparkline = stats.historicalData?.slice(-10).map(d => d.hashrate) || [];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      {/* Coin Name & Logo */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{stats.coin}</h2>
          <p className="text-slate-400 text-sm">{stats.symbol}</p>
        </div>
        {getCoinLogo(stats.symbol)}
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
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`$${stats.symbol} hashrate ${stats.change7d >= 0 ? '+' : ''}${stats.change7d.toFixed(1)}% (7d) 📊 Check @blxchaser for real-time mining stats`)}&url=${encodeURIComponent('https://bloxchaser.com')}`}
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
