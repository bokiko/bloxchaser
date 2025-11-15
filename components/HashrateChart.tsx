'use client';

import { NetworkStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import { useState } from 'react';

interface HashrateChartProps {
  stats: NetworkStats;
}

type TimePeriod = '7d' | '30d' | '90d' | '6m' | '1y';

export default function HashrateChart({ stats }: HashrateChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('90d');

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
        return 'PH/s';
      case 'ETC':
        return 'TH/s';
      default:
        return 'H/s';
    }
  };

  const getFilteredData = () => {
    const now = Date.now();
    let cutoffDate: number;

    switch (selectedPeriod) {
      case '7d':
        cutoffDate = subDays(now, 7).getTime();
        break;
      case '30d':
        cutoffDate = subDays(now, 30).getTime();
        break;
      case '90d':
        cutoffDate = subDays(now, 90).getTime();
        break;
      case '6m':
        cutoffDate = subMonths(now, 6).getTime();
        break;
      case '1y':
        cutoffDate = subMonths(now, 12).getTime();
        break;
      default:
        cutoffDate = subDays(now, 90).getTime();
    }

    return stats.historicalData
      .filter((point) => point.timestamp >= cutoffDate)
      .map((point) => ({
        date: point.timestamp,
        hashrate: point.hashrate,
        difficulty: point.difficulty,
      }));
  };

  const chartData = getFilteredData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-2xl">
          <p className="text-slate-300 text-xs mb-2">
            {format(new Date(payload[0].payload.date), 'MMM dd, yyyy HH:mm')}
          </p>
          <p className="text-white font-bold text-lg">
            {payload[0].value.toFixed(2)} <span className="text-cyan-400">{getHashrateUnit()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Network Hashrate</h3>
          <p className="text-slate-400 text-sm">Historical performance over time</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              if (selectedPeriod === '7d') {
                return format(date, 'EEE');
              } else if (selectedPeriod === '1y') {
                return format(date, 'MMM yy');
              }
              return format(date, 'MMM dd');
            }}
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value.toFixed(0)}`}
            label={{ value: getHashrateUnit(), angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { fontSize: '14px' } }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Area
            type="monotone"
            dataKey="hashrate"
            stroke="#06b6d4"
            strokeWidth={3}
            fill="url(#colorHashrate)"
            dot={false}
            activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
