import { NextResponse } from 'next/server';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchMoneroHashrate } from '@/lib/fetchMoneroData';
import { fetchLitecoinHashrate } from '@/lib/fetchLitecoinData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch all coin data in parallel for better performance
    const [bitcoinData, moneroData, litecoinData] = await Promise.all([
      fetchBitcoinHashrate(),
      fetchMoneroHashrate(),
      fetchLitecoinHashrate(),
    ]);

    return NextResponse.json({
      success: true,
      data: [bitcoinData, litecoinData, moneroData], // Order: BTC, LTC, XMR
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
