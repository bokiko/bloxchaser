import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINPAPRIKA_API = 'https://api.coinpaprika.com/v1';

interface CoinGeckoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

interface CoinPaprikaTicker {
  quotes: {
    USD: {
      price: number;
      market_cap: number;
      percent_change_24h: number;
    };
  };
}

interface CryptoPrice {
  price: number;
  change24h: number;
  marketCap: number;
}

interface CryptoPrices {
  bitcoin: CryptoPrice;
  litecoin: CryptoPrice;
  monero: CryptoPrice;
  dogecoin: CryptoPrice;
  kaspa: CryptoPrice;
  ethereumClassic: CryptoPrice;
  ravencoin: CryptoPrice;
  zcash: CryptoPrice;
  bitcoinCash: CryptoPrice;
  ergo: CryptoPrice;
}

// CoinPaprika coin IDs mapping
const COINPAPRIKA_IDS = {
  bitcoin: 'btc-bitcoin',
  litecoin: 'ltc-litecoin',
  monero: 'xmr-monero',
  dogecoin: 'doge-dogecoin',
  kaspa: 'kas-kaspa',
  ethereumClassic: 'etc-ethereum-classic',
  ravencoin: 'rvn-ravencoin',
  zcash: 'zec-zcash',
  bitcoinCash: 'bch-bitcoin-cash',
  ergo: 'efyt-ergo',
};

async function fetchFromCoinGecko(): Promise<CryptoPrices | null> {
  try {
    const response = await axios.get<CoinGeckoPriceData>(
      `${COINGECKO_API}/simple/price`,
      {
        params: {
          ids: 'bitcoin,litecoin,monero,dogecoin,kaspa,ethereum-classic,ravencoin,zcash,bitcoin-cash,ergo',
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
        },
        timeout: 5000,
      }
    );

    return {
      bitcoin: {
        price: response.data.bitcoin.usd,
        change24h: response.data.bitcoin.usd_24h_change,
        marketCap: response.data.bitcoin.usd_market_cap,
      },
      litecoin: {
        price: response.data.litecoin.usd,
        change24h: response.data.litecoin.usd_24h_change,
        marketCap: response.data.litecoin.usd_market_cap,
      },
      monero: {
        price: response.data.monero.usd,
        change24h: response.data.monero.usd_24h_change,
        marketCap: response.data.monero.usd_market_cap,
      },
      dogecoin: {
        price: response.data.dogecoin.usd,
        change24h: response.data.dogecoin.usd_24h_change,
        marketCap: response.data.dogecoin.usd_market_cap,
      },
      kaspa: {
        price: response.data.kaspa.usd,
        change24h: response.data.kaspa.usd_24h_change,
        marketCap: response.data.kaspa.usd_market_cap,
      },
      ethereumClassic: {
        price: response.data['ethereum-classic'].usd,
        change24h: response.data['ethereum-classic'].usd_24h_change,
        marketCap: response.data['ethereum-classic'].usd_market_cap,
      },
      ravencoin: {
        price: response.data.ravencoin.usd,
        change24h: response.data.ravencoin.usd_24h_change,
        marketCap: response.data.ravencoin.usd_market_cap,
      },
      zcash: {
        price: response.data.zcash.usd,
        change24h: response.data.zcash.usd_24h_change,
        marketCap: response.data.zcash.usd_market_cap,
      },
      bitcoinCash: {
        price: response.data['bitcoin-cash'].usd,
        change24h: response.data['bitcoin-cash'].usd_24h_change,
        marketCap: response.data['bitcoin-cash'].usd_market_cap,
      },
      ergo: {
        price: response.data.ergo.usd,
        change24h: response.data.ergo.usd_24h_change,
        marketCap: response.data.ergo.usd_market_cap,
      },
    };
  } catch (error) {
    console.error('CoinGecko API failed:', error);
    return null;
  }
}

async function fetchFromCoinPaprika(): Promise<CryptoPrices | null> {
  try {
    // Fetch all coins in parallel
    const [btc, ltc, xmr, doge, kas, etc, rvn, zec, bch, erg] = await Promise.all([
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.bitcoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.litecoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.monero}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.dogecoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.kaspa}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ethereumClassic}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ravencoin}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.zcash}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.bitcoinCash}`, { timeout: 5000 }),
      axios.get<CoinPaprikaTicker>(`${COINPAPRIKA_API}/tickers/${COINPAPRIKA_IDS.ergo}`, { timeout: 5000 }),
    ]);

    return {
      bitcoin: {
        price: btc.data.quotes.USD.price,
        change24h: btc.data.quotes.USD.percent_change_24h,
        marketCap: btc.data.quotes.USD.market_cap,
      },
      litecoin: {
        price: ltc.data.quotes.USD.price,
        change24h: ltc.data.quotes.USD.percent_change_24h,
        marketCap: ltc.data.quotes.USD.market_cap,
      },
      monero: {
        price: xmr.data.quotes.USD.price,
        change24h: xmr.data.quotes.USD.percent_change_24h,
        marketCap: xmr.data.quotes.USD.market_cap,
      },
      dogecoin: {
        price: doge.data.quotes.USD.price,
        change24h: doge.data.quotes.USD.percent_change_24h,
        marketCap: doge.data.quotes.USD.market_cap,
      },
      kaspa: {
        price: kas.data.quotes.USD.price,
        change24h: kas.data.quotes.USD.percent_change_24h,
        marketCap: kas.data.quotes.USD.market_cap,
      },
      ethereumClassic: {
        price: etc.data.quotes.USD.price,
        change24h: etc.data.quotes.USD.percent_change_24h,
        marketCap: etc.data.quotes.USD.market_cap,
      },
      ravencoin: {
        price: rvn.data.quotes.USD.price,
        change24h: rvn.data.quotes.USD.percent_change_24h,
        marketCap: rvn.data.quotes.USD.market_cap,
      },
      zcash: {
        price: zec.data.quotes.USD.price,
        change24h: zec.data.quotes.USD.percent_change_24h,
        marketCap: zec.data.quotes.USD.market_cap,
      },
      bitcoinCash: {
        price: bch.data.quotes.USD.price,
        change24h: bch.data.quotes.USD.percent_change_24h,
        marketCap: bch.data.quotes.USD.market_cap,
      },
      ergo: {
        price: erg.data.quotes.USD.price,
        change24h: erg.data.quotes.USD.percent_change_24h,
        marketCap: erg.data.quotes.USD.market_cap,
      },
    };
  } catch (error) {
    console.error('CoinPaprika API failed:', error);
    return null;
  }
}

export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  // Try CoinGecko first (fastest updates)
  console.log('Attempting to fetch prices from CoinGecko...');
  const coinGeckoData = await fetchFromCoinGecko();
  if (coinGeckoData) {
    console.log('✅ Successfully fetched prices from CoinGecko');
    return coinGeckoData;
  }

  // Fallback to CoinPaprika (no API key required, reliable)
  console.log('CoinGecko failed, trying CoinPaprika...');
  const coinPaprikaData = await fetchFromCoinPaprika();
  if (coinPaprikaData) {
    console.log('✅ Successfully fetched prices from CoinPaprika (fallback)');
    return coinPaprikaData;
  }

  // Final fallback: return zeros (Minerstat will be used in the data merge layer)
  console.error('❌ All price APIs failed, returning zeros (Minerstat will be used as final fallback)');
  return {
    bitcoin: { price: 0, change24h: 0, marketCap: 0 },
    litecoin: { price: 0, change24h: 0, marketCap: 0 },
    monero: { price: 0, change24h: 0, marketCap: 0 },
    dogecoin: { price: 0, change24h: 0, marketCap: 0 },
    kaspa: { price: 0, change24h: 0, marketCap: 0 },
    ethereumClassic: { price: 0, change24h: 0, marketCap: 0 },
    ravencoin: { price: 0, change24h: 0, marketCap: 0 },
    zcash: { price: 0, change24h: 0, marketCap: 0 },
    bitcoinCash: { price: 0, change24h: 0, marketCap: 0 },
    ergo: { price: 0, change24h: 0, marketCap: 0 },
  };
}
