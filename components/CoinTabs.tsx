'use client';

import { NetworkStats } from '@/types';
import { useState } from 'react';

interface CoinTabsProps {
  coinData: NetworkStats;
}

type TabType = 'overview' | 'financials' | 'network';

export default function CoinTabs({ coinData }: CoinTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Static supply data for each coin (you can move this to API later)
  const coinSupplyData: Record<string, { total: number | null; circulating: number; maxSupply: string }> = {
    BTC: { total: 21000000, circulating: 19600000, maxSupply: '21,000,000' },
    LTC: { total: 84000000, circulating: 73900000, maxSupply: '84,000,000' },
    XMR: { total: null, circulating: 18300000, maxSupply: 'Infinite' },
    DOGE: { total: null, circulating: 142000000000, maxSupply: 'Infinite' },
    KAS: { total: 28700000000, circulating: 24200000000, maxSupply: '28.7B' },
    ETC: { total: null, circulating: 143000000, maxSupply: '~210M' },
  };

  const supplyData = coinSupplyData[coinData.symbol] || { total: null, circulating: 0, maxSupply: 'N/A' };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: '📊' },
    { id: 'financials' as TabType, label: 'Financials', icon: '💰' },
    { id: 'network' as TabType, label: 'Network', icon: '⚡' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl">
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-slate-400 text-sm mb-1">Current Price</div>
                <div className="text-2xl font-bold text-white">
                  ${coinData.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">24h Change</div>
                <div className={`text-xl font-bold ${coinData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.priceChange24h >= 0 ? '+' : ''}{coinData.priceChange24h.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Market Cap</div>
                <div className="text-xl font-bold text-white">
                  ${formatLargeNumber(coinData.marketCap)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-slate-400 text-sm mb-1">Network Hashrate</div>
                <div className="text-xl font-bold text-white">
                  {coinData.currentHashrate.toFixed(2)} {coinData.symbol === 'BTC' ? 'EH/s' : coinData.symbol === 'KAS' ? 'PH/s' : coinData.symbol === 'XMR' ? 'GH/s' : 'TH/s'}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">7-Day Hashrate Change</div>
                <div className={`text-xl font-bold ${coinData.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.change7d >= 0 ? '+' : ''}{coinData.change7d.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">30-Day Hashrate Change</div>
                <div className={`text-xl font-bold ${coinData.change30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.change30d >= 0 ? '+' : ''}{coinData.change30d.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Market Cap
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                ${formatLargeNumber(coinData.marketCap)}
              </div>
              <div className="text-xs text-slate-500">Total market value</div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Circulating Supply
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatLargeNumber(supplyData.circulating)}
              </div>
              <div className="text-xs text-slate-500">{coinData.symbol}</div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Max Supply
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {supplyData.maxSupply}
              </div>
              <div className="text-xs text-slate-500">Maximum coins</div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                24h Trading Volume
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                ${formatLargeNumber(coinData.volume24h || coinData.marketCap * 0.05)}
              </div>
              <div className="text-xs text-slate-500">Last 24 hours</div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Market Rank
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                #{coinData.marketCapRank || (coinData.symbol === 'BTC' ? 1 : coinData.symbol === 'LTC' ? 20 : coinData.symbol === 'XMR' ? 30 : coinData.symbol === 'DOGE' ? 8 : coinData.symbol === 'ETC' ? 25 : 40)}
              </div>
              <div className="text-xs text-slate-500">By market cap</div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
              <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Markets Listed
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {coinData.symbol === 'BTC' ? '500+' : coinData.symbol === 'LTC' ? '350+' : coinData.symbol === 'DOGE' ? '300+' : '200+'}
              </div>
              <div className="text-xs text-slate-500">Active exchanges</div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <div className="text-slate-400 text-sm mb-2">Current Hashrate</div>
                <div className="text-2xl font-bold text-white">
                  {coinData.currentHashrate.toFixed(2)} {coinData.symbol === 'BTC' ? 'EH/s' : coinData.symbol === 'KAS' ? 'PH/s' : coinData.symbol === 'XMR' ? 'GH/s' : 'TH/s'}
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <div className="text-slate-400 text-sm mb-2">Network Difficulty</div>
                <div className="text-2xl font-bold text-white">
                  {coinData.currentDifficulty >= 1e15
                    ? `${(coinData.currentDifficulty / 1e15).toFixed(2)}P`
                    : coinData.currentDifficulty >= 1e12
                    ? `${(coinData.currentDifficulty / 1e12).toFixed(2)}T`
                    : `${(coinData.currentDifficulty / 1e9).toFixed(2)}G`}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <div className="text-slate-400 text-sm mb-2">7-Day Change</div>
                <div className={`text-2xl font-bold ${coinData.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.change7d >= 0 ? '+' : ''}{coinData.change7d.toFixed(2)}%
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <div className="text-slate-400 text-sm mb-2">30-Day Change</div>
                <div className={`text-2xl font-bold ${coinData.change30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.change30d >= 0 ? '+' : ''}{coinData.change30d.toFixed(2)}%
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                <div className="text-slate-400 text-sm mb-2">90-Day Change</div>
                <div className={`text-2xl font-bold ${coinData.change90d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.change90d >= 0 ? '+' : ''}{coinData.change90d.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
