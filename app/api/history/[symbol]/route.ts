/**
 * API: /api/history/[symbol]
 *
 * Returns full historical data for a specific coin
 *
 * Parameters:
 *   - symbol: Coin symbol (e.g., btc, ltc, xmr)
 *   - days: Optional, limit data to last N days (default: all)
 *   - format: Optional, 'full' or 'compact' (default: full)
 *
 * Examples:
 *   /api/history/btc
 *   /api/history/btc?days=30
 *   /api/history/btc?format=compact
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCoinHistory, getHistoricalHashrate, getCurrentStats, SUPPORTED_COINS } from '@/lib/historicalData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    // Validate symbol
    if (!SUPPORTED_COINS.includes(upperSymbol)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown coin: ${symbol}`,
          supportedCoins: SUPPORTED_COINS,
        },
        { status: 404 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : null;
    const format = searchParams.get('format') || 'full';

    // Get coin history
    const history = getCoinHistory(upperSymbol);

    if (!history) {
      return NextResponse.json(
        {
          success: false,
          error: `No data available for ${upperSymbol}`,
          message: 'Data collection may not have started yet. Check back after the next update.',
        },
        { status: 404 }
      );
    }

    // Get current stats
    const currentStats = getCurrentStats(upperSymbol);

    // Filter by days if specified
    let data = history.data;
    if (days) {
      const cutoff = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
      data = data.filter(entry => entry.t >= cutoff);
    }

    // Format response based on format parameter
    if (format === 'compact') {
      // Compact format: just arrays for charting
      return NextResponse.json({
        success: true,
        coin: upperSymbol,
        name: history.name,
        current: currentStats,
        data: {
          timestamps: data.map(e => e.t),
          hashrates: data.map(e => e.h),
          difficulties: data.map(e => e.d),
          prices: data.map(e => e.p),
        },
        totalEntries: data.length,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Full format: complete data structure
    return NextResponse.json({
      success: true,
      coin: upperSymbol,
      name: history.name,
      algorithm: history.algorithm,
      blockTime: history.blockTime,
      dataStarted: history.dataStarted,
      lastUpdated: history.lastUpdated,
      current: currentStats,
      data: data.map(entry => ({
        timestamp: entry.t,
        datetime: new Date(entry.t * 1000).toISOString(),
        hashrate: entry.h,
        difficulty: entry.d,
        price: entry.p,
      })),
      totalEntries: data.length,
      updateFrequency: 'Every 4 hours',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in /api/history/[symbol]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coin history' },
      { status: 500 }
    );
  }
}
