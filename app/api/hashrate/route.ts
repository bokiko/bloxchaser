import { NextResponse } from 'next/server';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const bitcoinData = await fetchBitcoinHashrate();

    return NextResponse.json({
      success: true,
      data: [bitcoinData], // Array for future multi-coin support
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hashrate data',
      },
      { status: 500 }
    );
  }
}
