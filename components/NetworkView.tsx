'use client';

import { NetworkStats } from '@/types';
import { useState } from 'react';
import NetworkCard from './NetworkCard';
import NetworkTable from './NetworkTable';

interface NetworkViewProps {
  networkData: NetworkStats[];
}

type ViewMode = 'grid' | 'table';

export default function NetworkView({ networkData }: NetworkViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <>
      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 shadow-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <NetworkTable networks={networkData} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {networkData.map((stats) => (
            <NetworkCard key={stats.symbol} stats={stats} />
          ))}
        </div>
      )}
    </>
  );
}
