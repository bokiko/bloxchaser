'use client';

import { NetworkStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface HashrateChartProps {
  stats: NetworkStats;
}

export default function HashrateChart({ stats }: HashrateChartProps) {
  const getHashrateUnit = () => {
    switch (stats.symbol) {
      case 'BTC':
        return 'EH/s';
      case 'LTC':
        return 'TH/s';
      case 'XMR':
        return 'GH/s';
      case 'DOGE':
        return 'TH/s';
      case 'KAS':
        return 'PH/s'; // Petahashes
      case 'ETC':
        return 'TH/s';
      default:
        return 'H/s';
    }
  };

  const chartData = stats.historicalData.map((point) => ({
    date: point.timestamp,
    hashrate: point.hashrate,
    difficulty: point.difficulty,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-2">
            {format(new Date(payload[0].payload.date), 'MMM dd, yyyy')}
          </p>
          <p className="text-white font-bold">
            {payload[0].value.toFixed(2)} {getHashrateUnit()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Hashrate History (90 Days)</h3>
        <div className="text-xs text-slate-500 italic max-w-xs text-right">
          * Historical data generated for demonstration purposes
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM dd')}
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value.toFixed(0)}`}
            label={{ value: getHashrateUnit(), angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="hashrate"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
