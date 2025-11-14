'use client';

import { useEffect, useState } from 'react';
import { NetworkStats } from '@/types';
import NetworkCard from '@/components/NetworkCard';
import HashrateChart from '@/components/HashrateChart';

export default function Home() {
  const [networkData, setNetworkData] = useState<NetworkStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/hashrate');
        const result = await response.json();

        if (result.success) {
          setNetworkData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch network data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                BloxChaser
              </h1>
              <p className="text-slate-400">
                Real-Time Mining Network Analytics
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Networks Tracked</div>
              <div className="text-3xl font-bold text-blue-400">{networkData.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading network data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && networkData.length > 0 && (
          <div className="space-y-8">
            {/* Network Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {networkData.map((stats) => (
                <NetworkCard key={stats.symbol} stats={stats} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              {networkData.map((stats) => (
                <HashrateChart key={`chart-${stats.symbol}`} stats={stats} />
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">More Networks Coming Soon</h2>
              <p className="text-slate-400 mb-4">
                Ethereum Classic, Litecoin, Monero, Dogecoin, Kaspa, and more...
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['ETC', 'LTC', 'XMR', 'DOGE', 'KAS', 'RVN', 'ERG', 'FLUX'].map((coin) => (
                  <span
                    key={coin}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 text-sm"
                  >
                    {coin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>Built for miners, by miners. Open source on GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
