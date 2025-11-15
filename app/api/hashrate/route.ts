import { NextResponse } from 'next/server';
import { fetchBitcoinHashrate } from '@/lib/fetchBitcoinData';
import { fetchDogecoinHashrate } from '@/lib/fetchDogecoinData';
import { fetchLitecoinHashrate } from '@/lib/fetchLitecoinData';
import { fetchKaspaHashrate } from '@/lib/fetchKaspaData';
import { fetchMinerstatCoins } from '@/lib/fetchMinerstatData';
import { fetchCryptoPrices } from '@/lib/fetchPrices';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch all data sources in parallel
    const [bitcoinMempoolData, litecoinData, dogecoinData, kaspaData, minerstatCoins, prices] = await Promise.all([
      fetchBitcoinHashrate(),   // Bitcoin hashrate history from Mempool.space
      fetchLitecoinHashrate(),  // Litecoin from Litecoinspace.org
      fetchDogecoinHashrate(),  // Dogecoin from GetBlock RPC
      fetchKaspaHashrate(),     // Kaspa from official Kaspa API
      fetchMinerstatCoins(),    // BTC, XMR, ETC from Minerstat (includes prices!)
      fetchCryptoPrices(),      // Prices from CoinGecko (backup for 24h change and market cap)
    ]);

    // Get coins from Minerstat (now includes BTC with price and difficulty!)
    const bitcoinMinerstatData = minerstatCoins.get('BTC');
    const litecoinMinerstatData = minerstatCoins.get('LTC'); // For price/difficulty fallback
    const moneroData = minerstatCoins.get('XMR');
    const ethereumClassicData = minerstatCoins.get('ETC');

    // For Bitcoin: Use Mempool hashrate history + Minerstat price/difficulty
    const bitcoinWithPrice = {
      ...bitcoinMempoolData,
      currentPrice: bitcoinMinerstatData?.currentPrice || prices.bitcoin.price || 0,
      currentDifficulty: bitcoinMinerstatData?.currentDifficulty || bitcoinMempoolData.currentDifficulty,
      priceChange24h: prices.bitcoin.change24h || 0,
      marketCap: prices.bitcoin.marketCap || 0,
    };

    // For Litecoin: Use Litecoinspace hashrate + Minerstat for price/difficulty
    const litecoinWithPrice = {
      ...litecoinData,
      currentPrice: litecoinMinerstatData?.currentPrice || prices.litecoin.price || 0,
      currentDifficulty: litecoinMinerstatData?.currentDifficulty || litecoinData.currentDifficulty,
      priceChange24h: prices.litecoin.change24h || 0,
      marketCap: prices.litecoin.marketCap || 0,
    };

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

    // For Kaspa: Use official Kaspa API + Minerstat for price
    const kaspaWithPrice = {
      ...kaspaData,
      currentPrice: prices.kaspa.price || 0,
      priceChange24h: prices.kaspa.change24h || 0,
      marketCap: prices.kaspa.marketCap || 0,
    };

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
