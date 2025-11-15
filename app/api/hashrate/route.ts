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
    const [bitcoinMempoolData, dogecoinData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(), // Bitcoin hashrate history from Mempool.space
      fetchDogecoinHashrate(), // Dogecoin from GetBlock RPC
      fetchMinerstatCoins(),   // BTC, LTC, XMR, KAS, ETC from Minerstat (includes prices!)
      fetchCryptoPrices(),     // Prices from CoinGecko (backup for 24h change and market cap)
    ]);

    // Get coins from Minerstat (now includes BTC with price and difficulty!)
    const bitcoinMinerstatData = minerstatCoins.get('BTC');
    const litecoinData = minerstatCoins.get('LTC');
    const moneroData = minerstatCoins.get('XMR');
    const kaspaData = minerstatCoins.get('KAS');
    const ethereumClassicData = minerstatCoins.get('ETC');

    // For Bitcoin: Use Mempool hashrate history + Minerstat price/difficulty
    const bitcoinWithPrice = {
      ...bitcoinMempoolData,
      currentPrice: bitcoinMinerstatData?.currentPrice || prices.bitcoin.price || 0,
      currentDifficulty: bitcoinMinerstatData?.currentDifficulty || bitcoinMempoolData.currentDifficulty,
      priceChange24h: prices.bitcoin.change24h || 0,
      marketCap: prices.bitcoin.marketCap || 0,
    };

    // For others: Use Minerstat data + CoinGecko for market cap/24h change if available
    const litecoinWithPrice = litecoinData ? {
      ...litecoinData,
      priceChange24h: prices.litecoin.change24h || 0,
      marketCap: prices.litecoin.marketCap || 0,
    } : null;

    const moneroWithPrice = moneroData ? {
      ...moneroData,
      priceChange24h: prices.monero.change24h || 0,
      marketCap: prices.monero.marketCap || 0,
    } : null;

    const dogecoinWithPrice = {
      ...dogecoinData,
      currentPrice: prices.dogecoin.price || 0,
      priceChange24h: prices.dogecoin.change24h || 0,
      marketCap: prices.dogecoin.marketCap || 0,
    };

    const kaspaWithPrice = kaspaData ? {
      ...kaspaData,
      priceChange24h: prices.kaspa.change24h || 0,
      marketCap: prices.kaspa.marketCap || 0,
    } : null;

    const ethereumClassicWithPrice = ethereumClassicData ? {
      ...ethereumClassicData,
      priceChange24h: prices.ethereumClassic.change24h || 0,
      marketCap: prices.ethereumClassic.marketCap || 0,
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
