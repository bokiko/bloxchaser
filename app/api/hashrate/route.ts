import { NextResponse } from 'next/server';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchMinerstatCoins } from '@/lib/fetchMinerstatData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch all data sources in parallel
    const [bitcoinData, dogecoinData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(), // Bitcoin from Mempool.space
      fetchDogecoinHashrate(), // Dogecoin from GetBlock RPC
      fetchMinerstatCoins(),   // LTC, XMR, KAS, ETC from Minerstat
      fetchCryptoPrices(),     // Prices from CoinGecko (for 24h change and market cap)
    ]);

    // Get coins from Minerstat
    const litecoinData = minerstatCoins.get('LTC');
    const moneroData = minerstatCoins.get('XMR');
    const kaspaData = minerstatCoins.get('KAS');
    const ethereumClassicData = minerstatCoins.get('ETC');

    // Merge CoinGecko price data (for 24h change and market cap) with network stats
    const bitcoinWithPrice = {
      ...bitcoinData,
      currentPrice: prices.bitcoin.price,
      priceChange24h: prices.bitcoin.change24h,
      marketCap: prices.bitcoin.marketCap,
    };

    const litecoinWithPrice = litecoinData ? {
      ...litecoinData,
      priceChange24h: prices.litecoin.change24h,
      marketCap: prices.litecoin.marketCap,
    } : null;

    const moneroWithPrice = moneroData ? {
      ...moneroData,
      priceChange24h: prices.monero.change24h,
      marketCap: prices.monero.marketCap,
    } : null;

    const dogecoinWithPrice = {
      ...dogecoinData,
      currentPrice: prices.dogecoin.price,
      priceChange24h: prices.dogecoin.change24h,
      marketCap: prices.dogecoin.marketCap,
    };

    const kaspaWithPrice = kaspaData ? {
      ...kaspaData,
      priceChange24h: prices.kaspa.change24h,
      marketCap: prices.kaspa.marketCap,
    } : null;

    const ethereumClassicWithPrice = ethereumClassicData ? {
      ...ethereumClassicData,
      priceChange24h: prices.ethereumClassic.change24h,
      marketCap: prices.ethereumClassic.marketCap,
    } : null;

    // Filter out null values and return data
    const data = [
      bitcoinWithPrice,
      litecoinWithPrice,
      moneroWithPrice,
      dogecoinWithPrice,
      kaspaWithPrice,
      ethereumClassicWithPrice,
    ].filter(coin => coin !== null);

    return NextResponse.json({
      success: true,
      data,
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
