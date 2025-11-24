/**
 * API: /api/history
 *
 * Returns a summary of all available coins with historical data
 *
 * Response:
 * {
 *   "coins": [
 *     { "symbol": "BTC", "name": "Bitcoin", "entries": 100, "lastUpdated": "..." }
 *   ],
 *   "updateFrequency": "4 hours",
 *   "apiVersion": "1.0"
 * }
 */

import { NextResponse } from 'next/server';
import { getAllCoinsSummary, SUPPORTED_COINS } from '@/lib/historicalData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const summary = getAllCoinsSummary();

    return NextResponse.json({
      success: true,
      coins: summary,
      supportedCoins: SUPPORTED_COINS,
      updateFrequency: 'Every 4 hours',
      apiVersion: '1.0',
      endpoints: {
        list: '/api/history',
        coin: '/api/history/{symbol}',
        example: '/api/history/btc',
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in /api/history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history summary' },
      { status: 500 }
    );
  }
}
