import { NextResponse } from 'next/server';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchMoneroHashrate } from '@/lib/fetchMoneroData';
import { fetchLitecoinHashrate } from '@/lib/fetchLitecoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchKaspaHashrate } from '@/lib/fetchKaspaData';
import { fetchEthereumClassicHashrate } from '@/lib/fetchEthereumClassicData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch all coin data and prices in parallel for better performance
    const [bitcoinData, moneroData, litecoinData, dogecoinData, kaspaData, ethereumClassicData, prices] = await Promise.all([
      fetchBitcoinHashrate(),
      fetchMoneroHashrate(),
      fetchLitecoinHashrate(),
      fetchDogecoinHashrate(),
      fetchKaspaHashrate(),
      fetchEthereumClassicHashrate(),
      fetchCryptoPrices(),
    ]);

    // Merge price data with network stats
    const bitcoinWithPrice = {
      ...bitcoinData,
      currentPrice: prices.bitcoin.price,
      priceChange24h: prices.bitcoin.change24h,
      marketCap: prices.bitcoin.marketCap,
    };

    const litecoinWithPrice = {
      ...litecoinData,
      currentPrice: prices.litecoin.price,
      priceChange24h: prices.litecoin.change24h,
      marketCap: prices.litecoin.marketCap,
    };

    const moneroWithPrice = {
      ...moneroData,
      currentPrice: prices.monero.price,
      priceChange24h: prices.monero.change24h,
      marketCap: prices.monero.marketCap,
    };

    const dogecoinWithPrice = {
      ...dogecoinData,
      currentPrice: prices.dogecoin.price,
      priceChange24h: prices.dogecoin.change24h,
      marketCap: prices.dogecoin.marketCap,
    };

    const kaspaWithPrice = {
      ...kaspaData,
      currentPrice: prices.kaspa.price,
      priceChange24h: prices.kaspa.change24h,
      marketCap: prices.kaspa.marketCap,
    };

    const ethereumClassicWithPrice = {
      ...ethereumClassicData,
      currentPrice: prices.ethereumClassic.price,
      priceChange24h: prices.ethereumClassic.change24h,
      marketCap: prices.ethereumClassic.marketCap,
    };

    return NextResponse.json({
      success: true,
      data: [bitcoinWithPrice, litecoinWithPrice, moneroWithPrice, dogecoinWithPrice, kaspaWithPrice, ethereumClassicWithPrice], // Order: BTC, LTC, XMR, DOGE, KAS, ETC
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
